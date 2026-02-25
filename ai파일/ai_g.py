# 파일명 : ai_g.py
# Description : 소독 주입률 예측 및 제어 운영코드
# Execute Program : ai_g_main.py 모듈 사용
# 수정일 : 2024-10-10 (주석 추가)
import os
import sys
import json
import joblib
import time
import keras
import keras.backend as K
import tensorflow as tf
import pandas as pd
from pandas.api.types import is_numeric_dtype, is_integer_dtype, is_float_dtype, is_bool_dtype
from pandas.api.types import is_object_dtype, is_string_dtype, is_categorical_dtype, is_datetime64_dtype
import numpy as np
import scipy.stats as ss
from datetime import timedelta

from multiprocessing import Process,Manager
import warnings
    
from scipy.signal import savgol_filter

import traceback
import logging
from logging import handlers

if '__file__' in globals() and os.path.isfile(os.path.abspath(__file__)):
    PROC_PATH = os.path.dirname(os.path.abspath(__file__))
else:
    PROC_PATH = os.path.dirname(os.path.abspath('_'))

BASE_PATH = os.path.dirname(PROC_PATH)
ROOT_PATH = os.path.dirname(BASE_PATH)
MODEL_PATH = PROC_PATH + '/model/' # 모델 경로
PROC_NAME = os.path.basename(PROC_PATH)
LOGS_PATH = BASE_PATH + '/logs/'
sys.path.append(BASE_PATH + '/common')
sys.path.append(ROOT_PATH + '/common')

from db_util import DBUtil
from config import Config
from analysis import *

MIN_MAX_SCALE_FILENAME = 'min_max_scale.csv'
MODEL_FILE = 'model_evaporation.h5'
DB_NAME = 'G'
G_PRE_CTR_TAG = '600-359-SWI-5100'
G_PERI_CTR_TAG = '600-359-SWI-5103'
G_POST_CTR_TAG = '600-359-SWI-5106'
CTR_TB_PRE = 'WATER_BR.TB_AI_PRE_G_CTR'
CTR_TB_PERI = 'WATER_BR.TB_AI_PERI_G_CTR'
CTR_TB_POST = 'WATER_BR.TB_AI_POST_G_CTR'
ALM_TB_PRE = 'WATER_BR.TB_AI_PRE_G_ALM'
ALM_TB_PERI = 'WATER_BR.TB_AI_PERI_G_ALM'
ALM_TB_POST = 'WATER_BR.TB_AI_POST_G_ALM'
ALM_ERR_PRE = '137012'
ALM_ERR_PERI = '137022'
ALM_ERR_POST = '137032'
ALM_CTR_PRE = '137014'
ALM_CTR_PERI = '137024'
ALM_CTR_POST = '137034'
ALM_THRESHOLD_PRE = '137015'
ALM_THRESHOLD_PERI = '137025'
ALM_THRESHOLD_POST = '137036'
ALM_H_OUT_RESIDUAL_CL_EXCEEDED = '137035'

# 전송 로거 생성
from aos_util import *
build_logger(ROOT_PATH, BASE_PATH, PROC_NAME)

# log settings
runLogFormatter = logging.Formatter('%(asctime)s : %(message)s')

logfile = LOGS_PATH + PROC_NAME + '.log'
runLogHandler = handlers.TimedRotatingFileHandler(filename=logfile, when='midnight', interval=1,
                                                  encoding='utf-8')
runLogHandler.setFormatter(runLogFormatter)
runLogHandler.suffix = "%Y%m%d"

# logger set
runLogger = logging.getLogger()
runLogger.setLevel(logging.ERROR)
runLogger.addHandler(runLogHandler)

# 모델 load 
model = keras.models.load_model(MODEL_PATH + MODEL_FILE)

def save_ctr_tag(operation_mode, db, count, correct_degree, threshold, tb_ctr_name, tb_alm_name, UPD_TI, TAG_SN, TAG_VAL, TAG_CMP_VAL, KFK_FLG=0, CTR_FLG=0, ALM_CTR=0, ALM_THRES=0, min_chol_rate=0, max_chol_rate=3, df_factor=pd.DataFrame(), RNTI=datetime.now().strftime('%Y-%m-%d %H:%M') ):
    """
    운영 모드에 따라 맞는 방식으로 주입률 제어를 진행하는 함수.
    CTR 및 ALM 테이블에 쿼리를 insert 하는 식으로 제어 진행

    Args:
        operation_mode : 운영모드, 0: 분석모드, 1: 추천모드, 2: AI모드
        db : 연결된 db connection
        count : 보정주기 도달 여부. 도달 시 0
        correct_degree : 현재 주입률 대비 보정 정도
        threshold : 1회 변경 임계치 값. 
        tb_ctr_name : CTR 테이블의 이름
        tb_alm_name : ALM 테이블의 이름
        UPD_TI : CTR 및 ALM 테이블의 UPD_TI에 들어갈 시각.
        TAG_SN : 제어 태그
        TAG_VAL : 예측값
        TAG_CMP_VAL : 이전값
        KFK_FLG : CTR에 insert 시 사용되는 플래그 값
        CTR_FLG : CTR에 insert 시 사용되는 플래그 값
        ALM_CTR : 띄우고자 하는 제어 알람에 대한 number값
        ALM_THRES : 띄우고자 하는 임계치 알람에 대한 number값
        min_chol_rate : 임계치 알람 기준 최소값
        max_chol_rate : 임계치 알람 기준 최대값
        df_factor : ai factor값이 저장된 DataFrame
        RNTI : 함수 실행 시각
    
    Returns:
        None
    """
    # CTR 테이블의 UPD_TI와 RNTI도 현재 시간(RNTI)로 통일
    UPD_TI = f'\"{RNTI}\"'
    RNTI = f'\"{RNTI}\"'
    TAG_SN = f'\"{TAG_SN}\"'
    
    if operation_mode == 0: 
        return

    TAG_CMP_VAL = round(TAG_CMP_VAL, 2)
    
    
    if operation_mode == 1:
        if (count == 0) and (abs(correct_degree) >= threshold) and (round(TAG_VAL, 2) != round(TAG_CMP_VAL, 2)):
            # 현재값이 주입률 상하한을 벗어나있을 시 임계치 알람 발생(주입률 데이터 0으로 들어오는 경우 대응)
            if ((min_chol_rate > TAG_CMP_VAL) or (max_chol_rate < TAG_CMP_VAL)):
                db.save_alm(
                    tb_alm_name,
                    ALM_THRES,
                    RNTI
                )
            # operation_mode가 1 or 2이면 ALM 먼저 삽입 이후 CTR 삽입
            db.save_ctr(
                tb_ctr_name,
                UPD_TI,
                RNTI,
                TAG_SN,
                str(TAG_VAL),
                str(TAG_CMP_VAL),
                KFK_FLG,
                CTR_FLG
            )
            db.save_ai_factor(df_factor)

    
    if operation_mode == 2:
        if (count == 0) and (abs(correct_degree) >= threshold) and (round(TAG_VAL, 2) != round(TAG_CMP_VAL, 2)):
            if ((min_chol_rate > TAG_CMP_VAL) or (max_chol_rate < TAG_CMP_VAL)):
                db.save_alm(
                    tb_alm_name,
                    ALM_THRES,
                    RNTI
                )
            else:
                # CTR 저장했음을 ALM 테이블에 저장 
                db.save_alm(
                    tb_alm_name,
                    ALM_CTR,
                    RNTI
                )
            # operation_mode가 1 or 2이면 ALM 먼저 삽입 이후 CTR 삽입
            db.save_ctr(
                tb_ctr_name,
                UPD_TI,
                RNTI,
                TAG_SN,
                str(TAG_VAL),
                str(TAG_CMP_VAL),
                KFK_FLG,
                CTR_FLG
            )
            db.save_ai_factor(df_factor)

def used_chol_tank(df: pd.DataFrame):
    """
    각 차염주입탱크에 대해 사용 여부를 판별하는 함수.
    차염주입펌프 1,2 각각의 RUN 여부를 확인하여 하나라도 RUN이면 사용중인 탱크로 간주하며,
    둘 다 RUN이 아닐 경우 미사용중인 탱크로 간주

    Args:
        df: load한 실시간 데이터의 데이터프레임

    Returns:
        set: 사용 중인 탱크의 이니셜(A, B, C, D)이 담긴 set
    """

    used_tank = []
    tank_list = ['A', 'B', 'C', 'D']
    pump_list = [
        ['G_TANK_A1_RUN', 'G_TANK_A2_RUN'],
        ['G_TANK_B1_RUN', 'G_TANK_B2_RUN'],
        ['G_TANK_C1_RUN', 'G_TANK_C2_RUN'],
        ['G_TANK_D1_RUN', 'G_TANK_D2_RUN'],
    ]
    
    for tank, pump_set in zip(tank_list, pump_list):
        pump1, pump2 = pump_set
        if (df.iloc[-1][pump1] != 0) or (df.iloc[-1][pump2] != 0):
            used_tank.append(tank)
            
    used_tank = set(used_tank)
    return used_tank

def add_chol_rate_col(df):
    """
    사용 중인 차염 설비의 전,중,후 주입 위치를 확인하여, 전,중,후차염에 관련된 값 및 태그를 매핑하는 함수
    현재주입률의 경우 인자로 받는 데이터프레임에 값을 매핑
    
    Args:
        df : load한 실시간 데이터의 데이터프레임

    Returns:
        None
    """

    global G_PRE_CTR_TAG, G_PERI_CTR_TAG, G_POST_CTR_TAG
    
    used_tank = used_chol_tank(df)
    tank_mapping_dict = dict()
    tank_ctr_tag = {
        'A':'600-359-SWI-5100',
        'B':'600-359-SWI-5103',
        'C':'600-359-SWI-5106',
        'D':'600-359-SWI-5109'
    }

    # 주입 위치 값이 1 -> 해당 위치에 해당 탱크의 주입률 값을 할당
    for tank in used_tank:
        to_pre_tag = f'G_TANK_{tank}_TO_PRE'
        to_peri_tag = f'G_TANK_{tank}_TO_PERI'
        to_post_tag = f'G_TANK_{tank}_TO_POST'

        if df.iloc[-1][to_pre_tag] == 1:
            df['G_PRE_CHOL_RATE'] = df[f'차염{tank} 현재주입률']
            G_PRE_CTR_TAG = tank_ctr_tag[tank]
        if df.iloc[-1][to_peri_tag] == 1:
            df['G_PERI_CHOL_RATE'] = df[f'차염{tank} 현재주입률']
            G_PERI_CTR_TAG = tank_ctr_tag[tank]
        if df.iloc[-1][to_post_tag] == 1:
            df['G_POST_CHOL_RATE'] = df[f'차염{tank} 현재주입률']
            G_POST_CTR_TAG = tank_ctr_tag[tank]

    if 'G_PRE_CHOL_RATE' not in df.columns:
        df['G_PRE_CHOL_RATE'] = 0
        G_PRE_CTR_TAG = tank_ctr_tag['A']

    if 'G_PERI_CHOL_RATE' not in df.columns:
        df['G_PERI_CHOL_RATE'] = 0
        G_PERI_CTR_TAG = tank_ctr_tag['B']

    if 'G_POST_CHOL_RATE' not in df.columns:
        df['G_POS_CHOL_RATE'] = 0
        G_POST_CTR_TAG = tank_ctr_tag['C']

def set_chol_in_limit(cur_val, next_val, limit):
    """
    예측 주입률이 현재 주입률보다 1회 변경 가능 한계치 이상 변경되지 않도록 보정하는 함수

    Args:
        cur_val : 현재 주입률
        next_val : 예측 주입률
        limit : 1회 변경 가능 한계치

    Returns:
        Float : 1회 변경 가능 한계치에 맞게 보정된 예측 주입률
    """
    if cur_val > next_val:
        if cur_val - next_val > limit:
            return cur_val - limit
        else:
            return next_val
    else:
        if next_val - cur_val > limit:
            return cur_val + limit
        else:
            return next_val

def get_init(df_init):
    """
    해당 공정 Init 테이블 값을 불러오는 함수

    Args:
        df_init : init 테이블 값이 담긴 DataFrame

    Returns:
        Dict : init 테이블 값이 담긴 딕셔너리
    """
    dict_init = dict()

    for i in df_init.index:
        itm = df_init.loc[i]['ITM']
        dict_init[itm] = df_init.loc[i]['INIT_VAL']

    return dict_init

def get_pre_init(db):
    """
    전차염(pre)의 Init에서 관리하는 값들을 저장하는 dict를 반환

    Args:
        db : 연결된 db connection

    Returns:
        DataFrame : pre_init 테이블 값이 담긴 딕셔너리
    """
    sql = f'SELECT * FROM TB_AI_PRE_{DB_NAME}_INIT'

    df_init = db.read(sql)
    
    dict_init = get_init(df_init)
    
    return dict_init

def get_peri_init(db):
    """
    중차염(peri)의 Init에서 관리하는 값들을 저장하는 dict를 반환

    Args:
        db : 연결된 db connection

    Returns:
        DataFrame : peri_init 테이블 값이 담긴 딕셔너리
    """
    sql = f'SELECT * FROM TB_AI_PERI_{DB_NAME}_INIT'

    df_init = db.read(sql)
    
    dict_init = get_init(df_init)
    
    return dict_init

def get_post_init(db):
    """
    후차염(post)의 Init에서 관리하는 값들을 저장하는 dict를 반환

    Args:
        db : 연결된 db connection

    Returns:
        DataFrame : post_init 테이블 값이 담긴 딕셔너리
    """
    sql = f'SELECT * FROM TB_AI_POST_{DB_NAME}_INIT'

    df_init = db.read(sql)
    
    dict_init = get_init(df_init)
    
    return dict_init

def get_ai_pre_rt(db):
    """
    AI 결과 테이블 최근 데이터 5개가 담긴 dataframe 반환

    Args:
        db : 연결된 db connection

    Returns:
        DataFrame : 결과테이블 중 최근 5개 값이 담긴 데이터프레임
    """
    sql = f'SELECT * FROM TB_AI_PRE_{DB_NAME}_RT \
    ORDER BY UPD_TI DESC \
    LIMIT 5'

    df_ai_rt = db.read(sql)

    return df_ai_rt

def perform_pre(db, calib_time_pre, count_pre, pre_chol, job_datetime):
    """
    전차염의 실시간 데이터 load 부터 전처리, 증발량 및 주입률 예측 진행하는 함수

    Args:
        db : 연결된 db connection
        calib_time_pre : 설정된 보정주기
        count_pre : 이전 보정주기 도달 이후 운영코드 실행 횟수
        pre_chol : 현재 주입률
        job_datetime : 특정 시점부터 데이터를 불러오기 위한 설정값. None일 경우 가장 최근 데이터로부터 불러옴

    Returns:
        calib_time_pre : 설정된 보정주기
        count_pre : 이전 보정주기 도달 이후 운영코드 실행 횟수
        pre_chol : 현재 주입률        
    """
    print('---------------- 전차염 공정 실행 ----------------')

    try:
        PROC_PATH = os.path.dirname(os.path.abspath(__file__))
    except:
        PROC_PATH = os.path.dirname(os.path.abspath('_'))

    now_str = '2022-12-15 00:00:00'
    now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
    residual_time = 270
    
    tags = (
        '600-359-TEI-1101',
        '600-359-FRI-1003',
        '600-359-CLI-2400',
        '600-359-CLI-2000',
        '600-359-FRI-5255',
        '600-359-FRI-5256',
        '600-359-FRI-5257',
        '600-359-FRI-5258',
        '600-359-RAQ-2041',
        '600-359-FRI-5150',
        '600-359-FRI-5151',
        '600-359-FRI-5152',
        '600-359-FRI-5153',
       '600-359-CIB-5172',
       '600-359-CIB-5173',
       '600-359-CIB-5174',
       '600-359-CIB-5175',
       '600-359-CIB-5176',
       '600-359-CIB-5177',
       '600-359-CIB-5178',
       '600-359-CIB-5179',
       '600-359-CIB-5180',
       '600-359-CIB-5181',
       '600-359-CIB-5182',
       '600-359-CIB-5183',
       '600-359-PHI-4000',
       '600-359-TBI-4000',
       '600-359-CIB-5115',
       '600-359-CIB-5113',
       '600-359-CIB-5111',
       '600-359-CIB-5109',
       '600-359-CIB-5107',
       '600-359-CIB-5105',
       '600-359-CIB-5103',
       '600-359-CIB-5101',
        '600-359-TEI-7700',
        '600-359-CLI-2500',
        '600-359-CIB-5160',
        '600-359-CIB-5161',
        '600-359-CIB-5162',
        '600-359-CIB-5163',
        '600-359-CIB-5164',
        '600-359-CIB-5165',
        '600-359-CIB-5166',
        '600-359-CIB-5167',
        '600-359-CIB-5168',
        '600-359-CIB-5169',
        '600-359-CIB-5170',
        '600-359-CIB-5171',
    )

    if job_datetime is None:
        g_rt_df = db.read_rt_subday_max('TB_G_RT', tags)
        now_str = str(g_rt_df.iloc[-1].name)
        now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
        rnti = datetime.now()
    else:
        g_rt_df = db.read_rt_subday_etime('TB_G_RT', tags, job_datetime)
        now_str = str(g_rt_df.iloc[-1].name)
        now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
        rnti = datetime.now()
    if len(g_rt_df) <= 0:
        return

    for tag in tags:
        if tag not in g_rt_df.columns:
            g_rt_df[tag] = 0
        
    # index(UPD_TI)를 datetime으로 타입 변환
    g_rt_df.index = pd.to_datetime(g_rt_df.index)
    
    g_rt_df = g_rt_df.resample('1T').fillna(method='ffill')
    g_rt_df = g_rt_df.fillna(method='bfill')

    # column 명을 구분하기 쉽도록 변환
    column_name = {'600-359-TEI-1101':'G_TEI_WATER',
                  '600-359-CLI-2400':'G_D_RESIDUAL_CL',
                  '600-359-FRI-1003':'FRI_D',
                  '600-359-CLI-2000':'G_E_RESIDUAL_CL',
                  '600-359-FRI-5255':'차염A 현재주입률',
                  '600-359-FRI-5256':'차염B 현재주입률',
                  '600-359-FRI-5257':'차염C 현재주입률',
                  '600-359-FRI-5258':'차염D 현재주입률',
                  '600-359-RAQ-2041':'분말활성탄 주입률',
                  '600-359-FRI-5150':'G_FRI_TANK_A',
                  '600-359-FRI-5151':'G_FRI_TANK_B',
                   '600-359-FRI-5152':'G_FRI_TANK_C',
                   '600-359-FRI-5153':'G_FRI_TANK_D',
                   '600-359-CIB-5172':'G_TANK_A_TO_PRE',
                   '600-359-CIB-5173':'G_TANK_A_TO_PERI',
                   '600-359-CIB-5174':'G_TANK_A_TO_POST',
                   '600-359-CIB-5175':'G_TANK_B_TO_PRE',
                   '600-359-CIB-5176':'G_TANK_B_TO_PERI',
                   '600-359-CIB-5177':'G_TANK_B_TO_POST',
                   '600-359-CIB-5178':'G_TANK_C_TO_PRE',
                   '600-359-CIB-5179':'G_TANK_C_TO_PERI',
                   '600-359-CIB-5180':'G_TANK_C_TO_POST',
                   '600-359-CIB-5181':'G_TANK_D_TO_PRE',
                   '600-359-CIB-5182':'G_TANK_D_TO_PERI',
                   '600-359-CIB-5183':'G_TANK_D_TO_POST',
                   '600-359-PHI-4000':'정수 PH',
                   '600-359-TBI-4000':'정수 탁도',
                   '600-359-CIB-5115':'G_TANK_D2_RUN',
                   '600-359-CIB-5113':'G_TANK_D1_RUN',
                   '600-359-CIB-5111':'G_TANK_C2_RUN',
                   '600-359-CIB-5109':'G_TANK_C1_RUN',
                   '600-359-CIB-5107':'G_TANK_B2_RUN',
                   '600-359-CIB-5105':'G_TANK_B1_RUN',
                   '600-359-CIB-5103':'G_TANK_A2_RUN',
                   '600-359-CIB-5101':'G_TANK_A1_RUN',
                   '600-359-TEI-7700':'기온',
                   '600-359-CLI-2500':'G_F_OUT_RESIDUAL_CL',
                    '600-359-CIB-5160':'차염A 운전모드 주입률',
                    '600-359-CIB-5161':'차염A 운전모드 주입량',
                    '600-359-CIB-5162':'차염A 운전모드 전자동',
                    '600-359-CIB-5163':'차염B 운전모드 주입률',
                    '600-359-CIB-5164':'차염B 운전모드 주입량',
                    '600-359-CIB-5165':'차염B 운전모드 전자동',
                    '600-359-CIB-5166':'차염C 운전모드 주입률',
                    '600-359-CIB-5167':'차염C 운전모드 주입량',
                    '600-359-CIB-5168':'차염C 운전모드 전자동',
                    '600-359-CIB-5169':'차염D 운전모드 주입률',
                    '600-359-CIB-5170':'차염D 운전모드 주입량',
                    '600-359-CIB-5171':'차염D 운전모드 전자동',
                  }
    
    g_rt_df = g_rt_df.rename(columns=column_name)

    # Init 테이블 값 Load
    dict_pre_init = get_pre_init(db)

    # RT 테이블 값 Load
    df_ai_pre_rt = get_ai_pre_rt(db)
    
    # 전,중, 후염소 컬럼 추가
    add_chol_rate_col(g_rt_df)
    
    # 주입 위치별 사용 차염설비 설정
    used_tank = used_chol_tank(g_rt_df)

    if 'A' in used_tank:
        g_pre_inj_a_run = 1
        g_pre_inj_d_run = 0
        is_mode_manual_rate = g_rt_df.loc[now, '차염A 운전모드 주입률']
        is_mode_manual_quan = g_rt_df.loc[now, '차염A 운전모드 주입량']
        is_mode_auto = g_rt_df.loc[now, '차염A 운전모드 전자동']
    else:
        g_pre_inj_a_run = 0
        g_pre_inj_d_run = 1
        is_mode_manual_rate = g_rt_df.loc[now, '차염D 운전모드 주입률']
        is_mode_manual_quan = g_rt_df.loc[now, '차염D 운전모드 주입량']
        is_mode_auto = g_rt_df.loc[now, '차염D 운전모드 전자동']

    # 전처리 시작
    ana_df_droped = g_rt_df.copy()
    
    # add_chol_rate_col(ana_df_droped)
    
    # 전처리
    num_datas = len(ana_df_droped)
    window_size = min(60, (num_datas+1)//2)
    # 데이터 스무딩
    ana_df_droped['G_TEI_WATER'] = ana_df_droped['G_TEI_WATER'].rolling(window=window_size, min_periods=1, center=False).mean()
    ana_df_droped['G_D_RESIDUAL_CL'] = ana_df_droped['G_D_RESIDUAL_CL'].rolling(window=window_size, min_periods=1, center=False).mean()
    ana_df_droped['G_E_RESIDUAL_CL'] = ana_df_droped['G_E_RESIDUAL_CL'].rolling(window=window_size, min_periods=1, center=False).mean()

    ana_df_droped['G_TEI'] = ana_df_droped['기온']
    

    # 극단값 대체
    extreme_val_idx = ana_df_droped[(ana_df_droped["FRI_D"] > 15000)].index
    ana_df_droped.loc[extreme_val_idx, "FRI_D"] = np.nan

    
    
    ana_df_droped = ana_df_droped.interpolate(method='values')

    # 이상치 대체
    outlier_series, z_score_series = outlier_z_score(ana_df_droped["FRI_D"], 5)
    ana_df_droped.loc[outlier_series, "FRI_D"] = np.nan

    ana_df_droped = ana_df_droped.interpolate(method='values')

    cl_fri_list = ["G_PRE_CHOL_RATE", "G_PERI_CHOL_RATE", "G_POST_CHOL_RATE"]

    extreme_val_idx = ana_df_droped[ana_df_droped[cl_fri_list[0]] == 0].index
    ana_df_droped.loc[extreme_val_idx, cl_fri_list[0]] = np.nan
    extreme_val_idx = ana_df_droped[ana_df_droped[cl_fri_list[1]] == 0].index
    ana_df_droped.loc[extreme_val_idx, cl_fri_list[1]] = np.nan
    extreme_val_idx = ana_df_droped[ana_df_droped[cl_fri_list[2]] == 0].index
    ana_df_droped.loc[extreme_val_idx, cl_fri_list[2]] = np.nan

    ana_df_droped = ana_df_droped.interpolate(method='values')
    
    # 전처리 데이터 중 증발량 예측 모델 입력에 사용될 변수만 추출
    ana_df_cli = ana_df_droped.loc[:, ['G_TEI_WATER', 'G_D_RESIDUAL_CL', 'G_E_RESIDUAL_CL', 'G_PRE_CHOL_RATE', 'G_PERI_CHOL_RATE', 'G_TEI']]
    
    # 증발량 계산
    ana_df_cli['G_EVAP'] = (ana_df_cli['G_PRE_CHOL_RATE'] + ana_df_cli['G_PERI_CHOL_RATE']) - ana_df_cli['G_E_RESIDUAL_CL'].shift(-270)

    minus_series = ana_df_cli[ana_df_cli['G_EVAP'] <= 0 ].index
    ana_df_cli.loc[minus_series, 'G_EVAP'] = np.nan
    ana_df_cli = ana_df_cli.interpolate(method='linear')


    # 파생변수 생성
    df_samp = []
    df_temp = ana_df_cli.copy()

    for col in df_temp.columns:
        df_samp.append( ana_df_cli[col] )

        if col != 'G_EVAP':
            df_samp.append( ana_df_cli[col].shift(60).rename('{}_LAG_1'.format(col), inplace=True) )
            df_samp.append( ana_df_cli[col].shift(120).rename('{}_LAG_2'.format(col), inplace=True) )
            df_samp.append( ana_df_cli[col].shift(180).rename('{}_LAG_3'.format(col), inplace=True) )

        df_samp.append( ana_df_cli[col].shift(360).rename('{}_LAG_6'.format(col), inplace=True) )
        df_samp.append( ana_df_cli[col].shift(720).rename('{}_LAG_12'.format(col), inplace=True) )
        df_samp.append( ana_df_cli[col].shift(1440).rename('{}_LAG_24'.format(col), inplace=True) )
        df_samp.append( ana_df_cli[col].shift(2880).rename('{}_LAG_48'.format(col), inplace=True) )
        df_samp.append( ana_df_cli[col].shift(4320).rename('{}_LAG_72'.format(col), inplace=True) )
        df_samp.append( ana_df_cli[col].shift(5760).rename('{}_LAG_96'.format(col), inplace=True) )
        df_samp.append( ana_df_cli[col].shift(7200).rename('{}_LAG_120'.format(col), inplace=True) )
        df_samp.append( ana_df_cli[col].shift(8640).rename('{}_LAG_144'.format(col), inplace=True) )
        df_samp.append( ana_df_cli[col].shift(10079).rename('{}_LAG_168'.format(col), inplace=True) )

        if col not in ['G_EVAP']:
            df_samp.append( ana_df_cli[col].rolling(window=10, min_periods=1, center=False).mean().rename('{}_MOV_AVG_10'.format(col), inplace=True) )
            df_samp.append( ana_df_cli[col].rolling(window=30, min_periods=1, center=False).mean().rename('{}_MOV_AVG_30'.format(col), inplace=True) )
            df_samp.append( ana_df_cli[col].rolling(window=60, min_periods=1, center=False).mean().rename('{}_MOV_AVG_60'.format(col), inplace=True) )
            df_samp.append( ana_df_cli[col].rolling(window=180, min_periods=1, center=False).mean().rename('{}_MOV_AVG_180'.format(col), inplace=True) )
            df_samp.append( ana_df_cli[col].rolling(window=360, min_periods=1, center=False).mean().rename('{}_MOV_AVG_360'.format(col), inplace=True) )
            df_samp.append( ana_df_cli[col].rolling(window=720, min_periods=1, center=False).mean().rename('{}_MOV_AVG_720'.format(col), inplace=True) )

    for i in range(1, 8):
        df_temp['evap_before_{}'.format(i)] = df_temp['G_EVAP'].shift(1440*i)

    # 같은 시간대 평균 증발량 데이터 생성
    def cal_mean_evap(day):
        """
        같은 시간대 증발량 평균을 계산하는 함수

        Args:
            day : day일 만큼 이전까지의 증발량 평균을 계산함

        Returns:
            Float : day일까지의 같은 시간대 평균 증발량
        """
        mean_evap = 0
        for i in range(1, day+1):
            mean_evap += df_temp['evap_before_{}'.format(i)]
    
        mean_evap = mean_evap / day
    
        return mean_evap
    
    df_samp.append( cal_mean_evap(1).rename('MEAN_EVAP_ST_1', inplace=True) )
    df_samp.append( cal_mean_evap(2).rename('MEAN_EVAP_ST_2', inplace=True) )
    df_samp.append( cal_mean_evap(3).rename('MEAN_EVAP_ST_3', inplace=True) )
    df_samp.append( cal_mean_evap(4).rename('MEAN_EVAP_ST_4', inplace=True) )
    df_samp.append( cal_mean_evap(5).rename('MEAN_EVAP_ST_5', inplace=True) )
    df_samp.append( cal_mean_evap(6).rename('MEAN_EVAP_ST_6', inplace=True) )
    df_samp.append( cal_mean_evap(7).rename('MEAN_EVAP_ST_7', inplace=True) )

    df_sample = pd.concat(df_samp, axis=1)

    # mean_evap 값 NaN 존재 시 최근 일자의 데이터로 대체
    if df_sample.tail(32)['MEAN_EVAP_ST_1'].isna().any():
        df_sample.loc[:, 'MEAN_EVAP_ST_1'] = df_sample.loc[:, 'G_EVAP']
    if df_sample.tail(32)['MEAN_EVAP_ST_2'].isna().any():
        df_sample.loc[:, 'MEAN_EVAP_ST_2'] = df_sample.loc[:, 'MEAN_EVAP_ST_1']
    if df_sample.tail(32)['MEAN_EVAP_ST_3'].isna().any():
        df_sample.loc[:, 'MEAN_EVAP_ST_3'] = df_sample.loc[:, 'MEAN_EVAP_ST_2']
    if df_sample.tail(32)['MEAN_EVAP_ST_4'].isna().any():
        df_sample.loc[:, 'MEAN_EVAP_ST_4'] = df_sample.loc[:, 'MEAN_EVAP_ST_3']
    if df_sample.tail(32)['MEAN_EVAP_ST_5'].isna().any():
        df_sample.loc[:, 'MEAN_EVAP_ST_5'] = df_sample.loc[:, 'MEAN_EVAP_ST_4']
    if df_sample.tail(32)['MEAN_EVAP_ST_6'].isna().any():
        df_sample.loc[:, 'MEAN_EVAP_ST_6'] = df_sample.loc[:, 'MEAN_EVAP_ST_5']
    if df_sample.tail(32)['MEAN_EVAP_ST_7'].isna().any():
        df_sample.loc[:, 'MEAN_EVAP_ST_7'] = df_sample.loc[:, 'MEAN_EVAP_ST_6']

    # 실제 모델 입력인자들만 추출
    df_sample = df_sample[['G_E_RESIDUAL_CL',
     'G_PERI_CHOL_RATE',
     'G_TEI_WATER_LAG_72',
     'G_TEI_WATER_LAG_120',
     'G_TEI_WATER_LAG_168',
     'G_TEI_WATER_MOV_AVG_360',
     'G_D_RESIDUAL_CL_LAG_24',
     'G_D_RESIDUAL_CL_LAG_168',
     'G_D_RESIDUAL_CL_MOV_AVG_180',
     'G_D_RESIDUAL_CL_MOV_AVG_360',
     'G_E_RESIDUAL_CL_LAG_24',
     'G_E_RESIDUAL_CL_LAG_72',
     'G_E_RESIDUAL_CL_MOV_AVG_10',
     'G_E_RESIDUAL_CL_MOV_AVG_30',
     'G_E_RESIDUAL_CL_MOV_AVG_360',
     'G_E_RESIDUAL_CL_MOV_AVG_720',
     'G_PRE_CHOL_RATE_LAG_3',
     'G_PRE_CHOL_RATE_LAG_6',
     'G_PRE_CHOL_RATE_LAG_72',
     'G_PRE_CHOL_RATE_LAG_120',
     'G_PRE_CHOL_RATE_MOV_AVG_30',
     'G_PRE_CHOL_RATE_MOV_AVG_60',
     'G_PRE_CHOL_RATE_MOV_AVG_180',
     'G_PRE_CHOL_RATE_MOV_AVG_360',
     'G_PRE_CHOL_RATE_MOV_AVG_720',
     'G_PERI_CHOL_RATE_LAG_24',
     'G_PERI_CHOL_RATE_LAG_72',
     'G_PERI_CHOL_RATE_MOV_AVG_10',
     'G_PERI_CHOL_RATE_MOV_AVG_30',
     'G_PERI_CHOL_RATE_MOV_AVG_60',
     'G_PERI_CHOL_RATE_MOV_AVG_360',
     'G_EVAP_LAG_6',
     'G_EVAP_LAG_12',
     'G_EVAP_LAG_24',
     'G_EVAP_LAG_48',
     'G_EVAP_LAG_72',
     'G_TEI_LAG_24',
     'G_TEI_LAG_168',
     'G_TEI_MOV_AVG_720',
     'MEAN_EVAP_ST_2',
     'MEAN_EVAP_ST_3',
     'MEAN_EVAP_ST_4',
     'MEAN_EVAP_ST_6',
     'MEAN_EVAP_ST_7',
     'G_D_RESIDUAL_CL',
     'G_PRE_CHOL_RATE',
     'G_TEI_WATER',
     'G_TEI']]
    
    # GRU 모델 Input sequence 길이만큼 데이터 추출
    if len(df_sample) > 32:
        data_x = df_sample.copy().iloc[-32:]
        data_x = data_x.fillna(method='bfill')
        data_x_origin = data_x.copy()      
    else:
        row_list = [df_sample.iloc[0]] * 32
        df_list = pd.DataFrame(row_list)
        df_sample = pd.concat([df_list, df_sample])
        data_x = df_sample.copy().iloc[-32:]
        data_x = data_x.fillna(method='bfill')
        data_x_origin = data_x.copy()

    # Min-max scaling
    min_max_csv = pd.read_csv(MODEL_PATH + MIN_MAX_SCALE_FILENAME, index_col='title')

    for col in data_x.columns:
        if col in min_max_csv.index:
            min_col_val = min_max_csv.loc[col, 'MIN']
            max_col_val = min_max_csv.loc[col, 'MAX']
            data_x.loc[:, col] = (data_x[col] - min_col_val) / (max_col_val - min_col_val)
        
    # feature, target 변수 설정
    feature = data_x.columns.tolist()

    # predict
    X = data_x[feature].to_numpy().reshape(1, 32, -1)
    predict = model.predict(X)
    ai_evaporation_predict = predict[0][0]

    # 주입률 결정 피드백 수식 설정하기
    g_e_residual_cl = round(g_rt_df.loc[now, 'G_E_RESIDUAL_CL'], 2)
    g_peri_chol_rate = round(g_rt_df.loc[now, 'G_PERI_CHOL_RATE'], 2)
    g_post_chol_rate = round(ana_df_droped.loc[now, 'G_POST_CHOL_RATE'], 2)
    g_pre_chol_rate = round(g_rt_df.loc[now, 'G_PRE_CHOL_RATE'].astype('float64'), 2)
    g_d_residual_cl = round(g_rt_df.loc[now, 'G_D_RESIDUAL_CL'], 2)
    g_f_out_residual_cl = round(g_rt_df.loc[now, 'G_F_OUT_RESIDUAL_CL'], 2)   
    
    # Init 데이터 할당
    g_pre_operation_mode = dict_pre_init['g_pre_operation_mode']
    g_pre_set_max = dict_pre_init['g_pre_set_max']
    g_pre_set_min = dict_pre_init['g_pre_set_min']
    g_pre_chg_limit_for_onetime = dict_pre_init['g_pre_chg_limit_for_onetime']
    g_pre_calib_cycle = dict_pre_init['g_pre_calib_cycle']
    g_e_obj_residual_cl = dict_pre_init['g_e_obj_residual_cl']

    # Init 데이터 할당 : 시간대별 주입률 설정값
    g_pre_max_limit = list()
    g_pre_min_limit = list()
    for i in range(0, 24):
        init_max_str = f'g_pre_max_limit_{i}'
        init_min_str = f'g_pre_min_limit_{i}'
        g_pre_max_limit.append(dict_pre_init[init_max_str])
        g_pre_min_limit.append(dict_pre_init[init_min_str])

    g_pre_chol = round((ai_evaporation_predict - g_peri_chol_rate + g_e_obj_residual_cl), 2)

    cur_hour = rnti.hour
    
    # 시간대별 주입률 상하한 범위 내로 예측값 설정
    if g_pre_chol_rate < g_pre_min_limit[cur_hour]:
        g_pre_chol = g_pre_min_limit[cur_hour]
    elif g_pre_chol_rate >= g_pre_max_limit[cur_hour]:
        g_pre_chol = g_pre_max_limit[cur_hour] 

    # 전차염 최대 변경범위 설정
    g_pre_chol = set_chol_in_limit(g_pre_chol_rate, g_pre_chol, g_pre_chg_limit_for_onetime)
    # OUT_VAL이 NaN일 경우에 대해 따로 처리
    # 증발량 예측값이 nan일 경우 -> ai 결과테이블의 가장 마지막 예측 증발량으로 설정
    # 다음 주입률 예측값이 nan일 경우 -> 실시간 rt 테이블의 가장 최근 주입률로 설정
    if np.isnan(ai_evaporation_predict):
        ai_evaporation_predict = json.loads(df_ai_pre_rt.iloc[-1]['OUT_VAL'])['AI_G_EVAP']
    if np.isnan(g_pre_chol):
        g_pre_chol = ana_df_droped.loc[now, 'G_PRE_CHOL_RATE'].astype('float64')

    g_pre_chol = round(g_pre_chol, 2)
    
    if g_pre_chol > g_pre_set_max:
        g_pre_chol = g_pre_set_max 
    if g_pre_chol < g_pre_set_min:
        g_pre_chol = g_pre_set_min


    rnti = datetime.now()
    # 주입후 경과시간
    elapsed_time = ((rnti - calib_time_pre).seconds // 60)
    
    # 보정주기가 지났을 때만 주입률 변경하도록 설정
    if calib_time_pre + timedelta(minutes=g_pre_calib_cycle) <= rnti:
        pre_chol = g_pre_chol
        calib_time_pre = rnti
        count_pre = 0
        elapsed_time = 0
    else:
        g_pre_chol = pre_chol
        count_pre += 1


    
    IN_VAL_PRE = dict()
    IN_VAL_PRE['G_PRE_CHOL_RATE'] = round(ana_df_droped.loc[now, 'G_PRE_CHOL_RATE'].astype('float64'), 2)
    IN_VAL_PRE['G_PERI_CHOL_RATE'] = round(ana_df_droped.loc[now, 'G_PERI_CHOL_RATE'].astype('float64'), 2)
    IN_VAL_PRE['G_D_RESIDUAL_CL'] = round(ana_df_droped.loc[now, 'G_D_RESIDUAL_CL'].astype('float64'), 2)
    IN_VAL_PRE['G_E_RESIDUAL_CL'] = round(ana_df_droped.loc[now, 'G_E_RESIDUAL_CL'].astype('float64'), 2)
    IN_VAL_PRE['G_E_OBJ_RESIDUAL_CL'] = g_e_obj_residual_cl
    IN_VAL_PRE['G_TEI_WATER'] = round(ana_df_droped.loc[now, 'G_TEI_WATER'].astype('float64'), 2)
    IN_VAL_PRE['G_TEI'] = round(ana_df_droped.loc[now, 'G_TEI'].astype('float64'), 2)

    OUT_VAL_PRE = dict()
    OUT_VAL_PRE = {
        'AI_G_EVAP' : round(float(ai_evaporation_predict), 2),
        'AI_G_CHOL_RATE' : round(g_pre_chol, 2),
        'G_INJ_A_RUN': g_pre_inj_a_run,
        'G_INJ_D_RUN': g_pre_inj_d_run,
        'G_ELAPSED_TIME': elapsed_time,
    }

    # 입/출력 변수 Dictionary to json
    IN_VAL_PRE_json = json.dumps(IN_VAL_PRE)
    OUT_VAL_PRE_json = json.dumps(OUT_VAL_PRE)

    # 데이터 저장 시점에서 현재 시각 재할당.
    rnti = datetime.now()
    
    # 소독 공정 결과 테이블 형태의 DataFrame 생성
    df_pre_final = pd.DataFrame(columns = ['upd_ti', 'AI_OPR', 'IN_VAL', 'OUT_VAL'], index=[rnti])
    df_pre_final['upd_ti'] = rnti
    df_pre_final['AI_OPR'] = g_pre_operation_mode
    df_pre_final['IN_VAL'] = IN_VAL_PRE_json
    df_pre_final['OUT_VAL'] = OUT_VAL_PRE_json

    # 증발량 저장용 df 생성
    can_cal_evap_time = now - timedelta(minutes=residual_time)
    if can_cal_evap_time in g_rt_df.index:
        df_evaporation = pd.DataFrame(columns=['upd_ti', 'VAL'], index=[can_cal_evap_time])
        df_evaporation['upd_ti'] = can_cal_evap_time
        df_evaporation['VAL'] = ana_df_cli.loc[can_cal_evap_time, 'G_EVAP']
    
        db.save_df('TB_AI_EVA_G', df_evaporation)

    # TB_AI_FACTOR에 넣은 주요 인자 구성
    FACTOR_PRE = dict()
    FACTOR_PRE['b_te'] = IN_VAL_PRE['G_TEI_WATER']
    FACTOR_PRE['g_tei'] = IN_VAL_PRE['G_TEI']
    FACTOR_PRE['d1_cl'] = IN_VAL_PRE['G_D_RESIDUAL_CL']
    FACTOR_PRE['e1_cl'] = IN_VAL_PRE['G_E_RESIDUAL_CL']
    FACTOR_PRE['g_pre_chol_rate'] = IN_VAL_PRE['G_PRE_CHOL_RATE']
    FACTOR_PRE['g_peri_chol_rate'] = IN_VAL_PRE['G_PERI_CHOL_RATE']

    FACTOR_PRE_json = json.dumps([FACTOR_PRE])

    df_factor_pre = pd.DataFrame(['G', 'PRE', rnti, FACTOR_PRE_json], index=['proc_cd', 'disinfection_index', 'rnti', 'factor']).transpose()
        

    # out_val_itm 으로부터 데이터를 불러와 현재 제어중인 주입률 tag로 최신화
    # CTR_TAG로부터 ITM 가져오기
    ctr_to_itm = {
        '600-359-SWI-5100':'SWI-5100',
        '600-359-SWI-5103':'SWI-5103',
        '600-359-SWI-5106':'SWI-5106',
        '600-359-SWI-5109':'SWI-5109',
    }

    # in_val_itm, out_val_itm 파일 load
    in_val_itm = get_in_val_itm()
    out_val_itm = get_out_val_itm()


    # in_val_itm에서 step이 'g2_liv'인 모든 row들 제거
    drop_idx = (in_val_itm[in_val_itm['step'] == 'g'].index)  
    in_val_itm = in_val_itm.drop(index=drop_idx)
    # 로깅할 데이터만 in_val_itm에 추가
    itm_pre = {
        'site':['br', 'br', 'br', 'br', 'br', 'br'],
        'step':['g', 'g', 'g', 'g', 'g', 'g'],
        'json_itm':['G_TEI', 'G_TEI_WATER', 'G_D_RESIDUAL_CL', 'G_E_RESIDUAL_CL', 'G_PRE_CHOL_RATE', 'G_PERI_CHOL_RATE'],
        'itm':['TEI-7700', 'b_te', 'd1_cl', 'e1_cl', ctr_to_itm[G_PRE_CTR_TAG], ctr_to_itm[G_PERI_CTR_TAG]]
    }
    df_new_itm_pre = pd.DataFrame(data=itm_pre)
    in_val_itm = pd.concat([in_val_itm, df_new_itm_pre], ignore_index=True)
    set_in_val_itm(in_val_itm)

    
    
    # out_val_itm에서 step이 'g'이고 json_itm이 'AI_G_CHOL_RATE'인 row들 제거
    drop_idx = (out_val_itm[out_val_itm['step'] == 'g'].index).intersection(out_val_itm[out_val_itm['json_itm'] == 'AI_G_CHOL_RATE'].index)    
    out_val_itm = out_val_itm.drop(index=drop_idx)
    # 로깅할 데이터만 out_val_itm에 추가
    itm_pre = {
        'site':['br'],
        'step':['g'],
        'json_itm':['AI_G_CHOL_RATE'],
        'itm':ctr_to_itm[G_PRE_CTR_TAG]
    }
    df_new_itm_pre = pd.DataFrame(data=itm_pre)
    out_val_itm = pd.concat([out_val_itm, df_new_itm_pre], ignore_index=True)
    set_out_val_itm(out_val_itm)
    # 전차염 저장 및 전차염 주입률만 logging
    db.save_ai_rt('TB_AI_PRE_G_RT', df_pre_final)

    # 주입률 모드가 수동-주입률일 시에만 제어
    if is_mode_manual_rate == 1 and is_mode_manual_quan == 0 and is_mode_auto == 0:
        # 전차염 CTR 테이블에 저장
        save_ctr_tag(
            g_pre_operation_mode,
            db,
            count_pre,
            round(g_pre_chol - g_pre_chol_rate, 2),
            0.05, # threshold
            CTR_TB_PRE,
            ALM_TB_PRE,
            rnti,
            G_PRE_CTR_TAG,
            round(g_pre_chol, 2),
            round(g_pre_chol_rate, 2),
            0,
            0,
            ALM_CTR_PRE,
            ALM_THRESHOLD_PRE,
            min_chol_rate=g_pre_set_min,
            max_chol_rate=g_pre_set_max,
            df_factor=df_factor_pre,
            RNTI=rnti
        )
    
    print('---------------- 전차염 공정 실행 완료 ----------------')

    return calib_time_pre, count_pre, pre_chol


def perform_peri(db, calib_time_peri, count_peri, peri_chol, job_datetime=None):
    """
    중차염의 실시간 데이터 load 부터 전처리, 증발량 및 주입률 예측 진행하는 함수

    Args:
        db : 연결된 db connection
        calib_time_peri : 설정된 보정주기
        count_peri : 이전 보정주기 도달 이후 운영코드 실행 횟수
        peri_chol : 현재 주입률
        job_datetime : 특정 시점부터 데이터를 불러오기 위한 설정값. None일 경우 가장 최근 데이터로부터 불러옴

    Returns:
        calib_time_peri : 설정된 보정주기
        count_peri : 이전 보정주기 도달 이후 운영코드 실행 횟수
        peri_chol : 현재 주입률        
    """
    print('---------------- 중차염 공정 실행 ----------------')

    now_str = '2022-12-15 00:00:00'
    now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
    residual_time = 270
    
    tags = (
        '600-359-TEI-1101',
        '600-359-FRI-1003',
        '600-359-CLI-2400',
        '600-359-CLI-2000',
        '600-359-FRI-5255',
        '600-359-FRI-5256',
        '600-359-FRI-5257',
        '600-359-FRI-5258',
        '600-359-RAQ-2041',
        '600-359-FRI-5150',
        '600-359-FRI-5151',
        '600-359-FRI-5152',
        '600-359-FRI-5153',
       '600-359-CIB-5172',
       '600-359-CIB-5173',
       '600-359-CIB-5174',
       '600-359-CIB-5175',
       '600-359-CIB-5176',
       '600-359-CIB-5177',
       '600-359-CIB-5178',
       '600-359-CIB-5179',
       '600-359-CIB-5180',
       '600-359-CIB-5181',
       '600-359-CIB-5182',
       '600-359-CIB-5183',
       '600-359-PHI-4000',
       '600-359-TBI-4000',
       '600-359-CIB-5115',
       '600-359-CIB-5113',
       '600-359-CIB-5111',
       '600-359-CIB-5109',
       '600-359-CIB-5107',
       '600-359-CIB-5105',
       '600-359-CIB-5103',
       '600-359-CIB-5101',
        '600-359-TEI-7700',
        '600-359-CLI-2500',
        '600-359-CIB-5160',
        '600-359-CIB-5161',
        '600-359-CIB-5162',
        '600-359-CIB-5163',
        '600-359-CIB-5164',
        '600-359-CIB-5165',
        '600-359-CIB-5166',
        '600-359-CIB-5167',
        '600-359-CIB-5168',
        '600-359-CIB-5169',
        '600-359-CIB-5170',
        '600-359-CIB-5171',
    )

    if job_datetime is None:
        g_rt_df = db.read_rt_subday_max('TB_G_RT', tags)
        now_str = str(g_rt_df.iloc[-1].name)
        now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
        rnti = datetime.now()
    else:
        g_rt_df = db.read_rt_subday_etime('TB_G_RT', tags, job_datetime)
        now_str = str(g_rt_df.iloc[-1].name)
        now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
        rnti = datetime.now()
    if len(g_rt_df) <= 0:
        return

    for tag in tags:
        if tag not in g_rt_df.columns:
            g_rt_df[tag] = 0
        
    # index(UPD_TI)를 datetime으로 타입 변환
    g_rt_df.index = pd.to_datetime(g_rt_df.index)
    
    g_rt_df = g_rt_df.resample('1T').fillna(method='ffill')
    g_rt_df = g_rt_df.fillna(method='bfill')

    # column 명을 구분하기 쉽도록 변환
    column_name = {'600-359-TEI-1101':'G_TEI_WATER',
                  '600-359-CLI-2400':'G_D_RESIDUAL_CL',
                  '600-359-FRI-1003':'FRI_D',
                  '600-359-CLI-2000':'G_E_RESIDUAL_CL',
                  '600-359-FRI-5255':'차염A 현재주입률',
                  '600-359-FRI-5256':'차염B 현재주입률',
                  '600-359-FRI-5257':'차염C 현재주입률',
                  '600-359-FRI-5258':'차염D 현재주입률',
                  '600-359-RAQ-2041':'분말활성탄 주입률',
                  '600-359-FRI-5150':'G_FRI_TANK_A',
                  '600-359-FRI-5151':'G_FRI_TANK_B',
                   '600-359-FRI-5152':'G_FRI_TANK_C',
                   '600-359-FRI-5153':'G_FRI_TANK_D',
                   '600-359-CIB-5172':'G_TANK_A_TO_PRE',
                   '600-359-CIB-5173':'G_TANK_A_TO_PERI',
                   '600-359-CIB-5174':'G_TANK_A_TO_POST',
                   '600-359-CIB-5175':'G_TANK_B_TO_PRE',
                   '600-359-CIB-5176':'G_TANK_B_TO_PERI',
                   '600-359-CIB-5177':'G_TANK_B_TO_POST',
                   '600-359-CIB-5178':'G_TANK_C_TO_PRE',
                   '600-359-CIB-5179':'G_TANK_C_TO_PERI',
                   '600-359-CIB-5180':'G_TANK_C_TO_POST',
                   '600-359-CIB-5181':'G_TANK_D_TO_PRE',
                   '600-359-CIB-5182':'G_TANK_D_TO_PERI',
                   '600-359-CIB-5183':'G_TANK_D_TO_POST',
                   '600-359-PHI-4000':'정수 PH',
                   '600-359-TBI-4000':'정수 탁도',
                   '600-359-CIB-5115':'G_TANK_D2_RUN',
                   '600-359-CIB-5113':'G_TANK_D1_RUN',
                   '600-359-CIB-5111':'G_TANK_C2_RUN',
                   '600-359-CIB-5109':'G_TANK_C1_RUN',
                   '600-359-CIB-5107':'G_TANK_B2_RUN',
                   '600-359-CIB-5105':'G_TANK_B1_RUN',
                   '600-359-CIB-5103':'G_TANK_A2_RUN',
                   '600-359-CIB-5101':'G_TANK_A1_RUN',
                   '600-359-TEI-7700':'기온',
                   '600-359-CLI-2500':'G_F_OUT_RESIDUAL_CL',
                    '600-359-CIB-5160':'차염A 운전모드 주입률',
                    '600-359-CIB-5161':'차염A 운전모드 주입량',
                    '600-359-CIB-5162':'차염A 운전모드 전자동',
                    '600-359-CIB-5163':'차염B 운전모드 주입률',
                    '600-359-CIB-5164':'차염B 운전모드 주입량',
                    '600-359-CIB-5165':'차염B 운전모드 전자동',
                    '600-359-CIB-5166':'차염C 운전모드 주입률',
                    '600-359-CIB-5167':'차염C 운전모드 주입량',
                    '600-359-CIB-5168':'차염C 운전모드 전자동',
                    '600-359-CIB-5169':'차염D 운전모드 주입률',
                    '600-359-CIB-5170':'차염D 운전모드 주입량',
                    '600-359-CIB-5171':'차염D 운전모드 전자동',
                  }
    
    g_rt_df = g_rt_df.rename(columns=column_name)

    # Init 테이블 값 Load
    dict_peri_init = get_peri_init(db)
    
    # 전,중, 후염소 컬럼 추가
    add_chol_rate_col(g_rt_df)
    
    # 주입 위치별 사용 차염설비 설정
    used_tank = used_chol_tank(g_rt_df)

    if 'B' in used_tank:
        g_peri_inj_b_run = 1
        g_peri_inj_d_run = 0
        is_mode_manual_rate = g_rt_df.loc[now, '차염B 운전모드 주입률']
        is_mode_manual_quan = g_rt_df.loc[now, '차염B 운전모드 주입량']
        is_mode_auto = g_rt_df.loc[now, '차염B 운전모드 전자동']
    else:
        g_peri_inj_b_run = 0
        g_peri_inj_d_run = 1
        is_mode_manual_rate = g_rt_df.loc[now, '차염D 운전모드 주입률']
        is_mode_manual_quan = g_rt_df.loc[now, '차염D 운전모드 주입량']
        is_mode_auto = g_rt_df.loc[now, '차염D 운전모드 전자동']
        
    ana_df_droped = g_rt_df.copy()
    
    # 주입률 결정 피드백 수식 설정하기
    g_e_residual_cl = round(g_rt_df.loc[now, 'G_E_RESIDUAL_CL'], 2)
    g_peri_chol_rate = round(g_rt_df.loc[now, 'G_PERI_CHOL_RATE'], 2)
    g_post_chol_rate = round(ana_df_droped.loc[now, 'G_POST_CHOL_RATE'], 2)
    g_pre_chol_rate = round(g_rt_df.loc[now, 'G_PRE_CHOL_RATE'].astype('float64'), 2)
    g_d_residual_cl = round(g_rt_df.loc[now, 'G_D_RESIDUAL_CL'], 2)
    g_f_out_residual_cl = round(g_rt_df.loc[now, 'G_F_OUT_RESIDUAL_CL'], 2)
    g_e_residual_cl_holding = dict_peri_init['g_e_residual_cl_holding']

    # 여과지 유출 잔류염소 최근 10분 평균 
    before_10m = now - timedelta(minutes=10)
    g_f_out_residual_cl_mean_10m = round(g_rt_df.loc[before_10m:, 'G_F_OUT_RESIDUAL_CL'].mean(), 2)
    # 침전지 잔류염소 최근 5분 평균
    before_5m = now - timedelta(minutes=5)
    g_e_residual_cl_mean_5m = round(g_rt_df.loc[before_5m:, 'G_E_RESIDUAL_CL'].mean(), 2)    
    
    # Init 데이터 할당
    g_peri_operation_mode = dict_peri_init['g_peri_operation_mode']
    g_peri_set_max = dict_peri_init['g_peri_set_max']
    g_peri_set_min = dict_peri_init['g_peri_set_min']
    g_peri_chg_limit_for_onetime = dict_peri_init['g_peri_chg_limit_for_onetime']
    g_peri_calib_cycle = dict_peri_init['g_peri_calib_cycle']
    g_e_obj_residual_cl = dict_peri_init['g_e_obj_residual_cl']
    g_f_out_residual_cl_min = dict_peri_init['g_f_out_residual_cl_min']

    ai_g_peri_correct_degree = round((g_e_obj_residual_cl - g_e_residual_cl).astype('float64'), 2)

    
    if g_e_obj_residual_cl - g_e_residual_cl >= g_peri_chg_limit_for_onetime:
        ai_g_peri_correct_degree = g_peri_chg_limit_for_onetime
    elif g_e_obj_residual_cl - g_e_residual_cl <= -g_peri_chg_limit_for_onetime:
        ai_g_peri_correct_degree = -g_peri_chg_limit_for_onetime
    else:
        ai_g_peri_correct_degree = 0

    # 침전지 잔류염소가 홀딩 범위 내에 있을 경우 주입률 변경하지 않음
    if g_e_obj_residual_cl - g_e_residual_cl_holding <= g_e_residual_cl <= g_e_obj_residual_cl + g_e_residual_cl_holding:
        ai_g_peri_correct_degree = 0
        
    # 보정 로직 : 최근 여과지 유출 잔류염소 10분 평균값이 0.55 ppm 이하이거나, 침전지 잔류염소가 0.2ppm 이하일 경우 침전지 잔류염소 값에 관계없이 중차염 주입률을 1회 변경 가능 주입률만큼 상향 조정
    if g_f_out_residual_cl_mean_10m <= g_f_out_residual_cl_min + 0.05:
        ai_g_peri_correct_degree = g_peri_chg_limit_for_onetime
        

    g_peri_chol = round(g_peri_chol_rate + ai_g_peri_correct_degree, 2)

    # OUT_VAL이 NaN일 경우에 대해 따로 처리
    # 증발량 예측값이 nan일 경우 -> ai 결과테이블의 가장 마지막 예측 증발량으로 설정
    # 다음 주입률 예측값이 nan일 경우 -> 실시간 rt 테이블의 가장 최근 주입률로 설정
    if np.isnan(g_peri_chol):
        g_peri_chol = ana_df_droped.loc[now, 'G_PERI_CHOL_RATE'].astype('float64')

    # 전차염 최대 변경범위 설정
    g_peri_chol = round(g_peri_chol, 2)
    
    # # 주입률 상, 하한 설정
    if g_peri_chol > g_peri_set_max:
        g_peri_chol = g_peri_set_max
    if g_peri_chol < g_peri_set_min:
        g_peri_chol = g_peri_set_min

    rnti = datetime.now()

    # 주입후 경과시간
    elapsed_time = ((rnti - calib_time_peri).seconds // 60)
    # 보정주기가 지났을 때만 주입률 변경하도록 설정
    if calib_time_peri + timedelta(minutes=g_peri_calib_cycle) <= rnti:
        peri_chol = g_peri_chol
        calib_time_peri = rnti
        count_peri = 0
        elapsed_time = 0
    else:
        g_peri_chol = peri_chol
        count_peri += 1

    IN_VAL_PERI = dict()
    IN_VAL_PERI = {
        'G_PERI_CHOL_RATE':round(g_rt_df.loc[now, 'G_PERI_CHOL_RATE'].astype('float64'), 2),
        'G_E_RESIDUAL_CL':round(g_rt_df.loc[now, 'G_E_RESIDUAL_CL'].astype('float64'), 2),
        'G_F_OUT_RESIDUAL_CL':round(g_rt_df.loc[now, 'G_F_OUT_RESIDUAL_CL'].astype('float64'), 2),
        'G_E_OBJ_RESIDUAL_CL':g_e_obj_residual_cl,
    }
    
    OUT_VAL_PERI = dict()
    OUT_VAL_PERI = {
        'AI_G_CHOL_RATE' : round(g_peri_chol, 2),
        'G_INJ_B_RUN': g_peri_inj_b_run,
        'G_INJ_D_RUN': g_peri_inj_d_run,
        'G_ELAPSED_TIME': elapsed_time,
    }

    # 입/출력 변수 Dictionary to json
    IN_VAL_PERI_json = json.dumps(IN_VAL_PERI)
    OUT_VAL_PERI_json = json.dumps(OUT_VAL_PERI)

    # 데이터 저장 시점에서 현재 시각 재할당.
    rnti = datetime.now()
    
    # 소독 공정 결과 테이블 형태의 DataFrame 생성
    df_peri_final = pd.DataFrame(columns = ['upd_ti', 'AI_OPR', 'IN_VAL', 'OUT_VAL'], index=[rnti])
    df_peri_final['upd_ti'] = rnti
    df_peri_final['AI_OPR'] = g_peri_operation_mode
    df_peri_final['IN_VAL'] = IN_VAL_PERI_json
    df_peri_final['OUT_VAL'] = OUT_VAL_PERI_json

    # TB_AI_FACTOR에 주요 인자 insert
    FACTOR_PERI = dict()
    FACTOR_PERI['g_peri_chol_rate'] = IN_VAL_PERI['G_PERI_CHOL_RATE']
    FACTOR_PERI['e1_cl'] = IN_VAL_PERI['G_E_RESIDUAL_CL']
    FACTOR_PERI['g_f_out_residual_cl'] = IN_VAL_PERI['G_F_OUT_RESIDUAL_CL']

    FACTOR_PERI_json = json.dumps([FACTOR_PERI])

    df_factor_peri = pd.DataFrame(['G', 'PERI', rnti, FACTOR_PERI_json], index=['proc_cd', 'disinfection_index', 'rnti', 'factor']).transpose()
    
    # out_val_itm 으로부터 데이터를 불러와 현재 제어중인 주입률 tag로 최신화
    # CTR_TAG로부터 ITM 가져오기
    ctr_to_itm = {
        '600-359-SWI-5100':'SWI-5100',
        '600-359-SWI-5103':'SWI-5103',
        '600-359-SWI-5106':'SWI-5106',
        '600-359-SWI-5109':'SWI-5109',
    }
    
    # in_val_itm, out_val_itm 파일 load
    in_val_itm = get_in_val_itm()
    out_val_itm = get_out_val_itm()


    # in_val_itm에서 step이 'g'인 모든 row들 제거
    drop_idx = (in_val_itm[in_val_itm['step'] == 'g'].index)  
    in_val_itm = in_val_itm.drop(index=drop_idx)
    # 로깅할 데이터만 in_val_itm에 추가
    itm_peri = {
        'site':['br', 'br', 'br'],
        'step':['g', 'g', 'g'],
        'json_itm':['G_E_RESIDUAL_CL', 'G_F_OUT_RESIDUAL_CL', 'G_PERI_CHOL_RATE'],
        'itm':['e1_cl', 'CLI_2500', ctr_to_itm[G_PERI_CTR_TAG]]
    }
    df_new_itm_peri = pd.DataFrame(data=itm_peri)
    in_val_itm = pd.concat([in_val_itm, df_new_itm_peri], ignore_index=True)
    set_in_val_itm(in_val_itm)

    
    
    # out_val_itm에서 step이 'g'이고 json_itm이 'AI_G_CHOL_RATE'인 row들 제거
    drop_idx = (out_val_itm[out_val_itm['step'] == 'g'].index).intersection(out_val_itm[out_val_itm['json_itm'] == 'AI_G_CHOL_RATE'].index)    
    out_val_itm = out_val_itm.drop(index=drop_idx)
    # 로깅할 데이터만 out_val_itm에 추가
    itm_peri = {
        'site':['br'],
        'step':['g'],
        'json_itm':['AI_G_CHOL_RATE'],
        'itm':ctr_to_itm[G_PERI_CTR_TAG]
    }
    df_new_itm_peri = pd.DataFrame(data=itm_peri)
    out_val_itm = pd.concat([out_val_itm, df_new_itm_peri], ignore_index=True)
    set_out_val_itm(out_val_itm)
    
    # 전차염 저장 및 전차염 주입률만 logging
    db.save_ai_rt('TB_AI_PERI_G_RT', df_peri_final)

    # 주입률 모드가 수동-주입률일 시에만 제어
    if is_mode_manual_rate == 1 and is_mode_manual_quan == 0 and is_mode_auto == 0:
        # 중차염 CTR 테이블에 저장 
        save_ctr_tag(
            g_peri_operation_mode,
            db,
            count_peri,
            round(g_peri_chol - g_peri_chol_rate, 2),
            0.05, # threshold
            CTR_TB_PERI,
            ALM_TB_PERI,
            rnti,
            G_PERI_CTR_TAG,
            round(g_peri_chol, 2),
            round(g_peri_chol_rate, 2),
            0,
            0,
            ALM_CTR_PERI,
            ALM_THRESHOLD_PERI,
            min_chol_rate=g_peri_set_min,
            max_chol_rate=g_peri_set_max,
            df_factor=df_factor_peri,
            RNTI=rnti
        )
    
    print('---------------- 중차염 공정 실행 완료 ----------------')

    return calib_time_peri, count_peri, peri_chol

def perform_post(db, calib_time_post, count_post, post_chol, job_datetime=None):
    """
    후차염의 실시간 데이터 load 부터 전처리, 증발량 및 주입률 예측 진행하는 함수

    Args:
        db : 연결된 db connection
        calib_time_post : 설정된 보정주기
        count_post : 이전 보정주기 도달 이후 운영코드 실행 횟수
        post_chol : 현재 주입률
        job_datetime : 특정 시점부터 데이터를 불러오기 위한 설정값. None일 경우 가장 최근 데이터로부터 불러옴

    Returns:
        calib_time_post : 설정된 보정주기
        count_post : 이전 보정주기 도달 이후 운영코드 실행 횟수
        post_chol : 현재 주입률        
    """
    print('---------------- 후차염 공정 실행 ----------------')

    now_str = '2022-12-15 00:00:00'
    now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
    residual_time = 270
    
    tags = (
        '600-359-TEI-1101',
        '600-359-FRI-1003',
        '600-359-CLI-2400',
        '600-359-CLI-2000',
        '600-359-FRI-3200',
        '600-359-CLI-3000',
        '600-359-CLI-4000',
        '600-359-FRI-5255',
        '600-359-FRI-5256',
        '600-359-FRI-5257',
        '600-359-FRI-5258',
        '600-359-RAQ-2041',
        '600-359-FRI-5150',
        '600-359-FRI-5151',
        '600-359-FRI-5152',
        '600-359-FRI-5153',
       '600-359-CIB-5172',
       '600-359-CIB-5173',
       '600-359-CIB-5174',
       '600-359-CIB-5175',
       '600-359-CIB-5176',
       '600-359-CIB-5177',
       '600-359-CIB-5178',
       '600-359-CIB-5179',
       '600-359-CIB-5180',
       '600-359-CIB-5181',
       '600-359-CIB-5182',
       '600-359-CIB-5183',
       '600-359-PHI-4000',
       '600-359-TBI-4000',
       '600-359-CIB-5115',
       '600-359-CIB-5113',
       '600-359-CIB-5111',
       '600-359-CIB-5109',
       '600-359-CIB-5107',
       '600-359-CIB-5105',
       '600-359-CIB-5103',
       '600-359-CIB-5101',
       '600-359-LEI-4001',
       '600-359-LEI-4002',
       '600-359-LEI-4003',
        '600-359-TEI-7700',
        '600-359-CLI-2500',
        '600-359-CIB-5160',
        '600-359-CIB-5161',
        '600-359-CIB-5162',
        '600-359-CIB-5163',
        '600-359-CIB-5164',
        '600-359-CIB-5165',
        '600-359-CIB-5166',
        '600-359-CIB-5167',
        '600-359-CIB-5168',
        '600-359-CIB-5169',
        '600-359-CIB-5170',
        '600-359-CIB-5171',
    )

    if job_datetime is None:
        g_rt_df = db.read_rt_subday_max('TB_G_RT', tags)
        now_str = str(g_rt_df.iloc[-1].name)
        now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
        rnti = datetime.now()
    else:
        g_rt_df = db.read_rt_subday_etime('TB_G_RT', tags, job_datetime)
        now_str = str(g_rt_df.iloc[-1].name)
        now = datetime.strptime(now_str, '%Y-%m-%d %H:%M:%S')
        rnti = datetime.now()
    if len(g_rt_df) <= 0:
        return

    for tag in tags:
        if tag not in g_rt_df.columns:
            g_rt_df[tag] = 0
        
    # index(UPD_TI)를 datetime으로 타입 변환
    g_rt_df.index = pd.to_datetime(g_rt_df.index)
    
    g_rt_df = g_rt_df.resample('1T').first()
    g_rt_df = g_rt_df.fillna(method='ffill')
    g_rt_df = g_rt_df.fillna(method='bfill')

    # column 명을 구분하기 쉽도록 변환
    column_name = {'600-359-TEI-1101':'G_TEI_WATER',
                  '600-359-CLI-2400':'G_D_RESIDUAL_CL',
                  '600-359-FRI-1003':'FRI_D',
                  '600-359-CLI-2000':'G_E_RESIDUAL_CL',
                  '600-359-FRI-3200':'FRI_H',
                  '600-359-CLI-3000':'G_H_IN_RESIDUAL_CL',
                  '600-359-CLI-4000':'G_H_OUT_RESIDUAL_CL',
                  '600-359-FRI-5255':'차염A 현재주입률',
                  '600-359-FRI-5256':'차염B 현재주입률',
                  '600-359-FRI-5257':'차염C 현재주입률',
                  '600-359-FRI-5258':'차염D 현재주입률',
                  '600-359-RAQ-2041':'분말활성탄 주입률',
                  '600-359-FRI-5150':'G_FRI_TANK_A',
                  '600-359-FRI-5151':'G_FRI_TANK_B',
                   '600-359-FRI-5152':'G_FRI_TANK_C',
                   '600-359-FRI-5153':'G_FRI_TANK_D',
                   '600-359-CIB-5172':'G_TANK_A_TO_PRE',
                   '600-359-CIB-5173':'G_TANK_A_TO_PERI',
                   '600-359-CIB-5174':'G_TANK_A_TO_POST',
                   '600-359-CIB-5175':'G_TANK_B_TO_PRE',
                   '600-359-CIB-5176':'G_TANK_B_TO_PERI',
                   '600-359-CIB-5177':'G_TANK_B_TO_POST',
                   '600-359-CIB-5178':'G_TANK_C_TO_PRE',
                   '600-359-CIB-5179':'G_TANK_C_TO_PERI',
                   '600-359-CIB-5180':'G_TANK_C_TO_POST',
                   '600-359-CIB-5181':'G_TANK_D_TO_PRE',
                   '600-359-CIB-5182':'G_TANK_D_TO_PERI',
                   '600-359-CIB-5183':'G_TANK_D_TO_POST',
                   '600-359-PHI-4000':'정수 PH',
                   '600-359-TBI-4000':'정수 탁도',
                   '600-359-CIB-5115':'G_TANK_D2_RUN',
                   '600-359-CIB-5113':'G_TANK_D1_RUN',
                   '600-359-CIB-5111':'G_TANK_C2_RUN',
                   '600-359-CIB-5109':'G_TANK_C1_RUN',
                   '600-359-CIB-5107':'G_TANK_B2_RUN',
                   '600-359-CIB-5105':'G_TANK_B1_RUN',
                   '600-359-CIB-5103':'G_TANK_A2_RUN',
                   '600-359-CIB-5101':'G_TANK_A1_RUN',
                   '600-359-LEI-4001':'정수지 수위1',
                   '600-359-LEI-4002':'정수지 수위2',
                   '600-359-LEI-4003':'정수지 수위3',
                   '600-359-TEI-7700':'기온',
                   '600-359-CLI-2500':'G_F_OUT_RESIDUAL_CL',
                    '600-359-CIB-5160':'차염A 운전모드 주입률',
                    '600-359-CIB-5161':'차염A 운전모드 주입량',
                    '600-359-CIB-5162':'차염A 운전모드 전자동',
                    '600-359-CIB-5163':'차염B 운전모드 주입률',
                    '600-359-CIB-5164':'차염B 운전모드 주입량',
                    '600-359-CIB-5165':'차염B 운전모드 전자동',
                    '600-359-CIB-5166':'차염C 운전모드 주입률',
                    '600-359-CIB-5167':'차염C 운전모드 주입량',
                    '600-359-CIB-5168':'차염C 운전모드 전자동',
                    '600-359-CIB-5169':'차염D 운전모드 주입률',
                    '600-359-CIB-5170':'차염D 운전모드 주입량',
                    '600-359-CIB-5171':'차염D 운전모드 전자동',
                  }
    
    g_rt_df = g_rt_df.rename(columns=column_name)

    # Init 테이블 값 Load
    dict_post_init = get_post_init(db)
    
    # 전,중, 후염소 컬럼 추가
    add_chol_rate_col(g_rt_df)

    # 주입 위치별 사용 차염설비 설정
    used_tank = used_chol_tank(g_rt_df)
    
    if 'C' in used_tank:
        g_post_inj_c_run = 1
        g_post_inj_d_run = 0
        is_mode_manual_rate = g_rt_df.loc[now, '차염C 운전모드 주입률']
        is_mode_manual_quan = g_rt_df.loc[now, '차염C 운전모드 주입량']
        is_mode_auto = g_rt_df.loc[now, '차염C 운전모드 전자동']
    else:
        g_post_inj_c_run = 0
        g_post_inj_d_run = 1
        is_mode_manual_rate = g_rt_df.loc[now, '차염D 운전모드 주입률']
        is_mode_manual_quan = g_rt_df.loc[now, '차염D 운전모드 주입량']
        is_mode_auto = g_rt_df.loc[now, '차염D 운전모드 전자동']

    ana_df_droped = g_rt_df.copy()
    
    
    # 주입률 결정 피드백 수식 설정하기
    g_e_residual_cl = round(g_rt_df.loc[now, 'G_E_RESIDUAL_CL'], 2)
    g_peri_chol_rate = round(g_rt_df.loc[now, 'G_PERI_CHOL_RATE'], 2)
    g_post_chol_rate = round(ana_df_droped.loc[now, 'G_POST_CHOL_RATE'], 2)
    g_h_in_residual_cl = round(g_rt_df.loc[now, 'G_H_IN_RESIDUAL_CL'].astype('float64'), 2)
    g_h_out_residual_cl = round(g_rt_df.loc[now, 'G_H_OUT_RESIDUAL_CL'].astype('float64'), 2)
    g_pre_chol_rate = round(g_rt_df.loc[now, 'G_PRE_CHOL_RATE'].astype('float64'), 2)
    g_d_residual_cl = round(g_rt_df.loc[now, 'G_D_RESIDUAL_CL'], 2)
    g_f_out_residual_cl = round(g_rt_df.loc[now, 'G_F_OUT_RESIDUAL_CL'], 2)

    # 여과지 유출 잔류염소 최근 10분 평균 
    before_10m = now - timedelta(minutes=10)
    g_f_out_residual_cl_mean_10m = round(g_rt_df.loc[before_10m:, 'G_F_OUT_RESIDUAL_CL'].mean(), 2)
    # 정수지 유입입 잔류염소 최근 5분 평균
    before_5m = now - timedelta(minutes=5)
    g_h_in_residual_cl_mean_5m = round(g_rt_df.loc[before_5m:, 'G_H_IN_RESIDUAL_CL'].mean(), 2)    
    
    # Init 데이터 할당
    g_post_operation_mode = dict_post_init['g_post_operation_mode']
    g_post_set_max = dict_post_init['g_post_set_max']
    g_post_set_min = dict_post_init['g_post_set_min']
    g_post_chg_limit_for_onetime = dict_post_init['g_post_chg_limit_for_onetime']
    g_post_calib_cycle = dict_post_init['g_post_calib_cycle']
    g_h_in_obj_residual_cl = dict_post_init['g_h_obj_residual_cl']
    g_post_calib_num = dict_post_init['g_post_calib_num']
    g_h_in_residual_cl_holding = dict_post_init['g_h_in_residual_cl_holding']

    ai_g_post_correct_degree = round( ((g_h_in_obj_residual_cl - g_h_in_residual_cl) *g_post_calib_num ).astype('float64'), 2)
    
    # 현장 요청으로 인해 보정주기 5분 -> 5분평균 잔류염소는 사용하지 않음.
    if g_h_in_obj_residual_cl - g_h_in_residual_cl >= g_post_chg_limit_for_onetime:
        ai_g_post_correct_degree = g_post_chg_limit_for_onetime
    elif g_h_in_obj_residual_cl - g_h_in_residual_cl <= -g_post_chg_limit_for_onetime:
        ai_g_post_correct_degree = -g_post_chg_limit_for_onetime
    else:
        ai_g_post_correct_degree = 0

    # 정수지 유입 잔류염소가 홀딩 범위 내에 있을 경우 주입률을 변경하지 않음
    if g_h_in_obj_residual_cl - g_h_in_residual_cl_holding <= g_h_in_residual_cl <= g_h_in_obj_residual_cl + g_h_in_residual_cl_holding:
        ai_g_post_correct_degree = 0
    
    g_post_chol = round(g_post_chol_rate + ai_g_post_correct_degree, 2)

    # OUT_VAL이 NaN일 경우에 대해 따로 처리
    # 증발량 예측값이 nan일 경우 -> ai 결과테이블의 가장 마지막 예측 증발량으로 설정
    # 다음 주입률 예측값이 nan일 경우 -> 실시간 rt 테이블의 가장 최근 주입률로 설정
    if np.isnan(g_post_chol):
        g_post_chol = ana_df_droped.loc[now, 'G_POST_CHOL_RATE'].astype('float64')


    g_post_chol = round(g_post_chol, 2)

    if g_post_chol > g_post_set_max:
        g_post_chol = g_post_set_max
    if g_post_chol < g_post_set_min:
        g_post_chol = g_post_set_min

    # 주입후 경과시간
    elapsed_time = ((rnti - calib_time_post).seconds // 60)
    
    # 보정주기가 지났을 때만 주입률 변경하도록 설정
    if calib_time_post + timedelta(minutes=g_post_calib_cycle) <= rnti:
        post_chol = g_post_chol
        calib_time_post = rnti
        count_post = 0
        elapsed_time = 0
    else:
        g_post_chol = post_chol
        count_post += 1



    IN_VAL_POST = dict()
    IN_VAL_POST = {
        'G_POST_CHOL_RATE':round(g_post_chol_rate.astype('float64'), 2),
        'G_H_IN_RESIDUAL_CL':g_h_in_residual_cl,
        'G_H_IN_OBJ_RESIDUAL_CL':g_h_in_obj_residual_cl,
        'G_H_OUT_RESIDUAL_CL':g_h_out_residual_cl
    }
    
    OUT_VAL_POST = dict()
    OUT_VAL_POST = {
        'AI_G_CORRECT_DEGREE':round(ai_g_post_correct_degree, 2),
        'AI_G_CHOL_RATE' : round(g_post_chol, 2),
        'G_INJ_C_RUN': g_post_inj_c_run,
        'G_INJ_D_RUN': g_post_inj_d_run,
        'G_ELAPSED_TIME': elapsed_time
    }

    # 입/출력 변수 Dictionary to json
    IN_VAL_POST_json = json.dumps(IN_VAL_POST)
    OUT_VAL_POST_json = json.dumps(OUT_VAL_POST)

    # 데이터 저장 시점에서 현재 시각 재할당.
    rnti = datetime.now()
    
    # 소독 공정 결과 테이블 형태의 DataFrame 생성
    df_post_final = pd.DataFrame(columns = ['upd_ti', 'AI_OPR', 'IN_VAL', 'OUT_VAL'], index=[rnti])
    df_post_final['upd_ti'] = rnti
    df_post_final['AI_OPR'] = g_post_operation_mode
    df_post_final['IN_VAL'] = IN_VAL_POST_json
    df_post_final['OUT_VAL'] = OUT_VAL_POST_json

    # TB_AI_FACTOR에 주요 인자 insert
    FACTOR_POST = dict()
    FACTOR_POST['g_post_chol_rate'] = IN_VAL_POST['G_POST_CHOL_RATE']
    FACTOR_POST['h_in_cl'] = IN_VAL_POST['G_H_IN_RESIDUAL_CL']

    FACTOR_POST_json = json.dumps([FACTOR_POST])

    df_factor_post = pd.DataFrame(['G', 'POST', rnti, FACTOR_POST_json], index=['proc_cd', 'disinfection_index', 'rnti', 'factor']).transpose()
    
    # out_val_itm 으로부터 데이터를 불러와 현재 제어중인 주입률 tag로 최신화
    # CTR_TAG로부터 ITM 가져오기
    ctr_to_itm = {
        '600-359-SWI-5100':'SWI-5100',
        '600-359-SWI-5103':'SWI-5103',
        '600-359-SWI-5106':'SWI-5106',
        '600-359-SWI-5109':'SWI-5109',
    }

    
    # in_val_itm, out_val_itm 파일 load
    in_val_itm = get_in_val_itm()
    out_val_itm = get_out_val_itm()


    # in_val_itm에서 step이 'g'인 모든 row들 제거
    drop_idx = (in_val_itm[in_val_itm['step'] == 'g'].index)  
    in_val_itm = in_val_itm.drop(index=drop_idx)
    # 로깅할 데이터만 in_val_itm에 추가
    itm_post = {
        'site':['br', 'br', 'br'],
        'step':['g', 'g', 'g'],
        'json_itm':['G_H_IN_RESIDUAL_CL', 'G_H_OUT_RESIDUAL_CL', 'G_POST_CHOL_RATE'],
        'itm':['h_in_cl', 'h_cl', ctr_to_itm[G_POST_CTR_TAG]]
    }
    df_new_itm_post = pd.DataFrame(data=itm_post)
    in_val_itm = pd.concat([in_val_itm, df_new_itm_post], ignore_index=True)
    set_in_val_itm(in_val_itm)

    
    
    # out_val_itm에서 step이 'g'이고 json_itm이 'AI_G_CHOL_RATE'인 row들 제거
    drop_idx = (out_val_itm[out_val_itm['step'] == 'g'].index).intersection(out_val_itm[out_val_itm['json_itm'] == 'AI_G_CHOL_RATE'].index)    
    out_val_itm = out_val_itm.drop(index=drop_idx)
    # 로깅할 데이터만 out_val_itm에 추가
    itm_post = {
        'site':['br'],
        'step':['g'],
        'json_itm':['AI_G_CHOL_RATE'],
        'itm':ctr_to_itm[G_POST_CTR_TAG]
    }
    df_new_itm_post = pd.DataFrame(data=itm_post)
    out_val_itm = pd.concat([out_val_itm, df_new_itm_post], ignore_index=True)
    set_out_val_itm(out_val_itm)
    
    # 후차염 저장 및 전차염 주입률만 logging
    db.save_ai_rt('TB_AI_POST_G_RT', df_post_final)

    
    # 주입률 모드가 수동-주입률일 시에만 제어
    if is_mode_manual_rate == 1 and is_mode_manual_quan == 0 and is_mode_auto == 0:
        # 후차염 CTR 테이블에 저장
        save_ctr_tag(
            g_post_operation_mode,
            db,
            count_post,
            round(g_post_chol - g_post_chol_rate, 2),
            0.01, # threshold
            CTR_TB_POST,
            ALM_TB_POST,
            rnti,
            G_POST_CTR_TAG,
            round(g_post_chol, 2),
            round(g_post_chol_rate, 2),
            0,
            0,
            ALM_CTR_POST,
            ALM_THRESHOLD_POST,
            min_chol_rate=g_post_set_min,
            max_chol_rate=g_post_set_max,
            df_factor=df_factor_post,
            RNTI=rnti
        )
    
    rnti = f'\"{rnti}\"'
    # 정수지 유출 잔류염소가 기준치(0.6 ~ 1.2) 초과 시 알람 발생
    if (g_h_out_residual_cl < 0.6) or (g_h_out_residual_cl > 1.2):
        db.save_alm(
            ALM_TB_POST,
            ALM_H_OUT_RESIDUAL_CL_EXCEEDED,
            rnti
        )
    
    print('---------------- 후차염 공정 실행 완료 ----------------')

    return calib_time_post, count_post, post_chol



@log_perform
def perform(db, calib_time_pre, calib_time_peri, calib_time_post, count_pre, count_peri, count_post, pre_chol, peri_chol, post_chol, job_datetime=None):
    """
    전,중,후차염 각각 perform 함수를 실행하기 위한 공동함수.

    Args:
        db : 연결된 db connection
        calib_time_pre : 전차염 설정된 보정주기
        calib_time_peri : 중차염 설정된 보정주기
        calib_time_post : 후차염 설정된 보정주기
        count_pre : 전차염 이전 보정주기 도달 이후 운영코드 실행 횟수
        count_peri : 중차염 이전 보정주기 도달 이후 운영코드 실행 횟수
        count_post : 후차염 이전 보정주기 도달 이후 운영코드 실행 횟수
        pre_chol : 전차염 현재 주입률
        peri_chol : 중차염 현재 주입률
        post_chol : 후차염 현재 주입률
        job_datetime : 특정 시점부터 데이터를 불러오기 위한 설정값. None일 경우 가장 최근 데이터로부터 불러옴

    Returns:
        calib_time_pre : 전차염 설정된 보정주기
        calib_time_peri : 중차염 설정된 보정주기
        calib_time_post : 후차염 설정된 보정주기
        count_pre : 전차염 이전 보정주기 도달 이후 운영코드 실행 횟수
        count_peri : 중차염 이전 보정주기 도달 이후 운영코드 실행 횟수
        count_post : 후차염 이전 보정주기 도달 이후 운영코드 실행 횟수
        pre_chol : 전차염 현재 주입률
        peri_chol : 중차염 현재 주입률
        post_chol : 후차염 현재 주입률      
    """
    print('---------------- 공정 실행 ----------------')

    rnti = datetime.now()
    rnti_to_str = f'\"{rnti}\"'

    # 전차염 주입률 결정 코드 실행
    # 실행 중 오류 시 AI 분석 이상 알람 발생
    try:
        calib_time_pre, count_pre, pre_chol = perform_pre(
            db=db,
            calib_time_pre=calib_time_pre,
            count_pre=count_pre,
            pre_chol=pre_chol,
            job_datetime=job_datetime
        )
    except Exception as e:
        db.save_alm(        
            ALM_TB_PRE,
            ALM_ERR_PRE,
            rnti_to_str
        )
        runLogger.error('Error: {}'.format(traceback.format_exc()))
        raise

    # 중차염 주입률 결정 코드 실행
    # 실행 중 오류 시 AI 분석 이상 알람 발생
    try:
        calib_time_peri, count_peri, peri_chol = perform_peri(
            db=db,
            calib_time_peri=calib_time_peri,
            count_peri=count_peri,
            peri_chol=peri_chol,
            job_datetime=job_datetime,
        )
    except Exception as e:
        db.save_alm(        
            ALM_TB_PERI,
            ALM_ERR_PERI,
            rnti_to_str
        )
        runLogger.error('Error: {}'.format(traceback.format_exc()))
        raise

    # 후차염 주입률 결정 코드 실행
    # 실행 중 오류 시 AI 분석 이상 알람 발생
    try:
        calib_time_post, count_post, post_chol = perform_post(
            db=db,
            calib_time_post=calib_time_post,
            count_post=count_post,
            post_chol=post_chol,
            job_datetime=job_datetime,
        )
    except Exception as e:
        db.save_alm(        
            ALM_TB_POST,
            ALM_ERR_POST,
            rnti_to_str
        )
        runLogger.error('Error: {}'.format(traceback.format_exc()))
        raise

        
    ################################################
    # clear_session 적용
    K.clear_session()
    ################################################
    
    print('---------------- 공정 실행 완료 (1 cycle) ----------------')
    return calib_time_pre, calib_time_peri, calib_time_post, count_pre, count_peri, count_post, pre_chol, peri_chol, post_chol
    
