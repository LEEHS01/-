# 파일명: ai_b.py
# 최종수정일: 2024.11.11

import sys
import os
import json
import joblib
import pickle
import copy
import time
import warnings
import traceback
import logging
from logging import handlers
from datetime import timedelta
from multiprocessing import Process, Manager
import pandas as pd
import numpy as np
from sympy import *
import math
from scipy.signal import savgol_filter
from functools import reduce
from collections import OrderedDict
import tensorflow as tf
import keras.backend as K
from keras.models import Model
from keras.layers import (Concatenate, Dense, Activation, Dropout,
                          Layer, LayerNormalization, Conv1D, Input,
                          Permute, Add, GlobalAvgPool1D)
from tensorflow.keras.losses import MSE
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator
from tensorflow import keras

#Path 설정
if '__file__' in globals() and os.path.isfile(os.path.abspath(__file__)):
    PROC_PATH = os.path.dirname(os.path.abspath(__file__))
else:
    PROC_PATH = os.path.dirname(os.path.abspath('_'))
    
PROC_NAME = os.path.basename(PROC_PATH)
BASE_PATH = os.path.dirname(PROC_PATH)
ROOT_PATH = os.path.dirname(BASE_PATH)
sys.path.append(BASE_PATH + '/common')
sys.path.append(ROOT_PATH + '/common')

from db_util import DBUtil
from config import Config
from analysis import *
from aos_util import *

MODEL_PATH = '/'.join([PROC_PATH, 'model/'])  # 모델 경로
LOGS_PATH = BASE_PATH + '/logs/'  # 로그 경로

#전송 로거 생성
build_logger(ROOT_PATH, BASE_PATH, PROC_NAME)

#로그 처리
runLogFormatter = logging.Formatter('%(asctime)s : %(message)s')
logfile = LOGS_PATH + PROC_NAME + '.log'
runLogHandler = handlers.TimedRotatingFileHandler(
    filename=logfile, when='midnight', interval=1, encoding='utf-8')
runLogHandler.setFormatter(runLogFormatter)
runLogHandler.suffix = "%Y%m%d"

#logger set
runLogger = logging.getLogger()
runLogger.setLevel(logging.ERROR)
runLogger.addHandler(runLogHandler)

#테이블명 정의
tb_nm_base = 'TB_B_RT'
tb_nm_ai = 'TB_AI_B_RT'
tb_nm_init = 'TB_AI_B_INIT'
tb_nm_ctr = 'TB_AI_B_CTR'
tb_nm_alm = 'TB_AI_B_ALM'
tb_nm_opr_bnd = 'TB_AI_H_OPR_BND'

a2_lei_min = 2         # 정수지 수위
#전처리 기준(각 태그의 상하한값)
a2_lei_max = 5
a2_friin_min = 5000    # 원수 유입유량
a2_friin_max = 20000
a2_friout_min = 5000   # 정수 유출유량
a2_friout_max = 20000
a2_pri_min = 2.0       # 원수 유입 압력
a2_pri_max = 3.5
a2_friout_h_min = 200  # 회수조상등수유출유량
a2_friout_h_max = 1500
a2_elec_min = 300      # 소수력 유효전력
a2_elec_max = 600
a2_gv_min = 0          # 가이드배인 개도
a2_gv_max = 100
a2_bypass_min = 0      # 바이패스 밸브 개도율
a2_bypass_max = 80
a2_dam_min = 80       # 댐 수위
a2_dam_max = 600

# 테이블에 데이터가 일주일 내내 결측일 때 과거 데이터의 평균값으로 대체
dic_mean = {
            '600-359-LEI-4001': 3.52,    # 보령(정) 정수지 #1 수위
            '600-359-LEI-4002': 3.56,    # 보령(정) 정수지 #2 수위
            '600-359-LEI-4003': 3.60,    # 보령(정) 정수지 #3 수위
            '600-359-FRI-1011': 10745,   # 보령(정) 원수 유입유량 순시
            '600-359-FRI-4410': 10858,   # 보령(정) 유출유량 순시
            '600-359-PRI-1001': 2.78,    # 보령(정) 원수 유입압력
            '600-359-FRI-7102': 728.61,  # 보령(정) 회수조 상등수 유출유량
            '702-600-359-GE2-4068': 492.53,  # #2 소수력 ACB 총 유효전력
            '702-600-359-GE2-4014': 57.17,   # #2 소수력 가이드 배인 개도
            '702-600-359-GE2-4102': 58.57,   # #2 소수력 가이드베인 출력개도_FB(설정값)
            '702-600-359-GE2-4103': 10.18,   # #2 소수력 바이패스 1 개도 설정
            '600-151-LEI-1001': 73.1}        # 보령(댐) 본댐 수위

@log_perform
def perform(db, job_datetime=None):
    '''
    태그 데이터 조회 및 함수 실행(전처리, 예측, 결과 저장 등)
    Parameter -
        db: DB연결 정보
        job_datetime: (필요 시)ai_b_batch.py 실행 시 필요한 특정 날짜
    Return - 없음(각 함수 실행됨)
    '''
    try : 
        print('#####################공정 실행#####################')
        start = time.time()  # 실행시간 계산용
    
        # 필요원수유입유량 데이터 태그
        tags_df_friin = ('600-359-FRI-1011', '') # 태그가 1개면 read_rt_subday_max 함수 사용 어려워서 빈값 넣어놓음
    
        #정수지 수위 밴드 데이터용 태그 목록
        tags_df_band = ('600-359-LEI-4001',	'600-359-LEI-4002',	'600-359-LEI-4003')
    
        #전체 데이터용 태그 목록
        tags = ( 
            '600-359-LEI-4001',  # 보령(정) 정수지 #1 수위
            '600-359-LEI-4002',  # 보령(정) 정수지 #2 수위
            '600-359-LEI-4003',  # 보령(정) 정수지 #3 수위
            '600-359-LEI-1101',  # 보령(정) 착수정 #1 수위
            '600-359-LEI-1102',  # 보령(정) 착수정 #2 수위
            '600-359-FRI-1011',  # 보령(정) 원수 유입유량 순시
            '600-359-FRI-3200',  # 보령(정) 여과지 유출유량
            '600-359-FRI-4410',  # 보령(정) 유출유량 순시
            '600-359-PRI-1001',  # 보령(정) 원수 유입압력
            '600-359-FRI-7102',  # 보령(정) 회수조 상등수 유출유량
            '702-600-359-GE2-4068',  # #2 소수력 ACB 총 유효전력
            '702-600-359-GE2-4014',  # #2 소수력 가이드 배인 개도
            '702-600-359-GE2-4102',  # #2 소수력 가이드베인 출력개도_FB(설정값)
            '702-600-359-GE2-4103',  # #2 소수력 바이패스 1 개도 설정
            '600-151-LEI-1001')       # 보령(댐) 본댐 수위
    
        #데이터 조회
        if job_datetime is None:
            df_friin = db.read_rt_subday_max(tb_nm_base, tags_df_friin)
            df_friin_1day = db.read_rt_subday_max(tb_nm_base, tags_df_friin, 1)
            df_band = db.read_rt_subday_max(tb_nm_base, tags_df_band)
            df = db.read_rt_subday_max(tb_nm_base, tags)
            
            sql_init = f'''
                    select *
                    from {tb_nm_init}
                    '''
            df_init = db.read(sql_init)
    
            sql = f'''
                SELECT UPD_TI, AI_OPR, IN_VAL, OUT_VAL
                FROM {tb_nm_ai}
                ORDER BY UPD_TI DESC LIMIT 1
               '''
            df_last = db.read(sql)
        else:
            df_friin = db.read_rt_subday_etime(
                tb_nm_base, tags_df_friin, job_datetime)
            df_friin_1day = db.read_rt_subday_etime(
                tb_nm_base, tags_df_friin, job_datetime, 1)
            df_band = db.read_rt_subday_etime(
                tb_nm_base, tags_df_band, job_datetime)
            df = db.read_rt_subday_etime(
                tb_nm_base, tags, job_datetime)
    
            sql_init = f'''
                    select *
                    from {tb_nm_init}
                    '''
            df_init = db.read(sql_init)
    
            sql = f'''
                SELECT UPD_TI, AI_OPR, IN_VAL, OUT_VAL
                FROM {tb_nm_ai}
                WHERE UPD_TI BETWEEN
                        DATE_SUB("{job_datetime}", INTERVAL 1 DAY)
                        AND "{job_datetime}"
                ORDER BY UPD_TI DESC LIMIT 1
               '''
            df_last = db.read(sql)
            

        # RT테이블 비정상 또는 태그리스트 중 특정 태그값이 없을 때 ai_rt 테이블의 이전값으로 데이터 저장
        if (len(df) == 0) or (len(tags) != len(df.columns)):
            print("Empty Data")
            df_mixing_ai_result = pd.DataFrame(
                columns=['upd_ti', 'AI_OPR', 'IN_VAL', 'OUT_VAL'], index=[0])
            df_mixing_ai_result['upd_ti'] = datetime.now().strftime(
                '%Y-%m-%d %H:%M:%S')
            df_mixing_ai_result['AI_OPR'] = df_last['AI_OPR']
            df_mixing_ai_result['IN_VAL'] = df_last['IN_VAL']
            df_mixing_ai_result['OUT_VAL'] = df_last['OUT_VAL']
            db.save_ai_rt(tb_nm_ai, df_mixing_ai_result)
            print("Upload last data to database")
            return

        else:
                dic = {}
                current_data(dic, df, df_band, df_init)
                print("current_data---------------------------------- OK")
                predict_valve(dic, db)
                print("predict_valve--------------------------------- OK")
                apply_valve(dic, db)
                print("apply_valve----------------------------------- OK")
                upload_control(dic, db,df)
                print("upload_control-------------------------------- OK")
                upload_result_data(dic, db, df_friin, df_friin_1day)
                print("upload_result_data---------------------------- OK")
                print(f"{time.time() - start:.5f} sec")
                print('#####################공정 실행 완료 (1 cycle)#####################')
    except : 
        print('error')
        runLogger.error('Error: {}'.format(traceback.format_exc()))
        db.save_alm(tb_nm_alm, "'"+str(131002)+"'", "'"+time.strftime('%Y-%m-%d %H:%M:%S')+"'")
        
def current_data(dic, df, df_band, df_init):
    '''
    데이터 전처리 및 dic값 저장
    Parameter -
        dic: Empty Dictionary
        df: 과거 7일 전체 데이터(dataframe)
        df_band: 과거 7일 정수지 수위 데이터(dataframe)
        df_init: init 테이블 데이터(dataframe)
    Return - 없음(dic에 값 저장됨)
    '''

    #운영모드
    dic['OperationMode'] = (int(df_init[df_init['ITM'] == 'b_operation_mode']['INIT_VAL'].item()))
    
    #사용자 설정값(정수지 수위 상/하한값, 밸브 개도 1회 제어 시 상/하한값)
    dic['P_LEI_MIN'] = float(df_init[df_init['ITM']=='h_target_le_min']['INIT_VAL'].item())
    dic['P_LEI_MAX'] = float(df_init[df_init['ITM']=='h_target_le_max']['INIT_VAL'].item())
    dic['P_VALVE_GV_MIN'] = int(df_init[df_init['ITM']=='b_valve_gv_min']['INIT_VAL'].item())
    dic['P_VALVE_GV_MAX'] = int(df_init[df_init['ITM']=='b_valve_gv_max']['INIT_VAL'].item())
    dic['P_VALVE_BYPASS_MIN'] = int(df_init[df_init['ITM']=='b_valve_bypass_min']['INIT_VAL'].item())
    dic['P_VALVE_BYPASS_MAX'] = int(df_init[df_init['ITM']=='b_valve_bypass_max']['INIT_VAL'].item())
    dic['P_GV_PWR'] = int(df_init[df_init['ITM']=='b_valve_gv_pwr']['INIT_VAL'].item())

    # 밸브 상/하한 값 추가 (11.07)
    dic['P_VALVE_GV_LOLMT'] = int(df_init[df_init['ITM']=='b_valve_gv_lolmt']['INIT_VAL'].item())
    dic['P_VALVE_GV_UPLMT'] = int(df_init[df_init['ITM']=='b_valve_gv_uplmt']['INIT_VAL'].item())
    dic['P_VALVE_BYPASS_LOLMT'] = int(df_init[df_init['ITM']=='b_valve_bypass_lolmt']['INIT_VAL'].item())
    dic['P_VALVE_BYPASS_UPLMT'] = int(df_init[df_init['ITM']=='b_valve_bypass_uplmt']['INIT_VAL'].item())
    
    
    #중복 index 제거
    df_dup = drop_duplicate_rows(df)
    df_dup = df_dup.resample('1T').mean()

    #결측치 제거
    result = check_drop_missing(df_dup)
    df = df_dup.drop(index=result[result == True].index)
    df.sort_index(ascending=False, inplace=True)
    
    df = upper_lower_bounds(col='600-359-LEI-4001',  # 정수지 수위 #1
    #극단값 제거 - 정수장별 태그별 상하한값 별도 적용
                            upper=a2_lei_max, lower=a2_lei_min, df=df)
    df = upper_lower_bounds(col='600-359-LEI-4002',  # 정수지 수위 #2
                            upper=a2_lei_max, lower=a2_lei_min, df=df)
    df = upper_lower_bounds(col='600-359-LEI-4003',  # 정수지 수위 #3
                            upper=a2_lei_max, lower=a2_lei_min, df=df)
    df = upper_lower_bounds(col='600-359-FRI-1011',  # 원수 유입유량
                            upper=a2_friin_max, lower=a2_friin_min, df=df)
    df = upper_lower_bounds(col='600-359-FRI-4410',  # 유출유량
                            upper=a2_friout_max, lower=a2_friout_min, df=df)
    df = upper_lower_bounds(col='600-359-PRI-1001',  # 원수 유입압력
                            upper=a2_pri_max, lower=a2_pri_min, df=df)
    df = upper_lower_bounds(col='600-359-FRI-7102',  # 회수조 상등수 유출유량
                            upper=a2_friout_h_max, lower=a2_friout_h_min, df=df)    
    df = upper_lower_bounds(col='702-600-359-GE2-4068',  # 유효전력
                            upper=a2_elec_max, lower=a2_elec_min, df=df)
    df = upper_lower_bounds(col='702-600-359-GE2-4014',  # 가이드배인 개도(현재값)
                            upper=a2_gv_max, lower=a2_gv_min, df=df)
    df = upper_lower_bounds(col='702-600-359-GE2-4102',  # 가이드배인 개도(설정)
                            upper=a2_gv_max, lower=a2_gv_min, df=df)
    df = upper_lower_bounds(col='702-600-359-GE2-4103',  # 바이패스 개도(설정)
                            upper=a2_bypass_max, lower=a2_bypass_min, df=df)
    df = upper_lower_bounds(col='600-151-LEI-1001',  # 보령 댐 수위
                            upper=a2_dam_max, lower=a2_dam_min, df=df)
    
    #연속형 태그 리스트(개도율(y) 제외)
    tags_con = [
                '600-359-LEI-4001',
                '600-359-LEI-4002',
                '600-359-LEI-4003',  # 정수지 수위
                '600-359-FRI-1011',  # 원수 유입유량
                '600-359-FRI-4410',  # 정수 유출유량
                '600-359-PRI-1001',  # 원수 유입압력
                '600-359-FRI-7102',  # 회수조 상등수 유출유량
                '702-600-359-GE2-4068',  # 유효전력
                '600-151-LEI-1001'  # 댐 수위
                ]

    #전처리 함수 실행(z-score, STL, smoothing)
    for col in tags_con:
        outlier_preprocessing(df=df,
                              outlier_z_score=outlier_z_score,
                              replace_outliers_with_mean=replace_outliers_with_mean,
                              outlier_for_timeseries=outlier_for_timeseries,
                              col=col)

    #전처리 결과를 하나의 데이터프레임으로 병합
    df_pre = []
    for col in tags_con:
        df_pre.append(globals()['pre_'+col])
    df_pre = reduce(lambda left, right: pd.merge(left, right, on='UPD_TI'), df_pre)

    #데이터 음수일 경우 0으로 처리
    for col in df_pre.columns:
        df_pre[col] = np.where(df_pre[col] < 0, 0, df_pre[col])
        
    #밸브(y)는 극단값만 제외하고 사용
    df_pre['702-600-359-GE2-4014'] = df[['702-600-359-GE2-4014']]  # 가이드베인
    df_pre['702-600-359-GE2-4102'] = df[['702-600-359-GE2-4102']]  # 가이드베인
    df_pre['702-600-359-GE2-4103'] = df[['702-600-359-GE2-4103']]  # 바이패스
    df_pre['702-600-359-GE2-4068'] = df[['702-600-359-GE2-4068']]  # 전력량
    df_pre['600-151-LEI-1001'] = df[['702-600-359-GE2-4068']]      # 댐 수위
    

    #일주일내내 값이 결측일 경우 과거 평균값으로 대체
    for col in tags_con:
        if df_pre[col].isna().sum() == len(df_pre):
            df_pre[col] = dic_mean[col]

    #10분 단위 데이터셋 생성
    df_pre_10m = df_pre.resample('10T').first()

    #정수지 수위 값이 비정상일 경우 예외처리
    col_list_wl = ['600-359-LEI-4001', '600-359-LEI-4002', '600-359-LEI-4003']
    temp_wl = df_pre[col_list_wl]
    temp_wl['LEI_mean'] = temp_wl.mean(axis=1)
    for col in col_list_wl:
        if df_pre[col].isna().sum() == len(df_pre):
            df_pre[col] = temp_wl['LEI_mean']
            
    #dic 값 저장
    dic['update_time'] = str(df_pre.index[0])
    dic['C_LEI1'] = round(df['600-359-LEI-4001'][0], 2)  # 보령(정) 정수지 #1 수위
    dic['C_LEI2'] = round(df['600-359-LEI-4002'][0], 2)  # 보령(정) 정수지 #2 수위
    dic['C_LEI3'] = round(df['600-359-LEI-4003'][0], 2)  # 보령(정) 정수지 #3 수위
    dic['C_FRIIN'] = round(df_pre['600-359-FRI-1011'][0], 2)  # 보령(정) 원수 유입유량 순시
    dic['C_FRIIN_REAL'] = round(df['600-359-FRI-1011'][0], 2)  # 보령(정) 원수 유입유량 순시(실시간데이터)
    dic['C_FRIOUT'] = round(df_pre['600-359-FRI-4410'][0], 2)  # 보령(정) 유출유량 순시
    dic['C_FRIOUT_REAL'] = round(df['600-359-FRI-4410'][0], 2)  # 보령(정) 유출유량 순시
    dic['C_PRI'] = round(df['600-359-PRI-1001'][0], 2)  # 보령(정) 원수 유입압력
    dic['C_FRIOUT_H'] = round(df['600-359-FRI-7102'][0], 2)  # 회수조 상등수 유출유량
    dic['C_ELEC'] = round(df_pre['702-600-359-GE2-4068'][0], 2)  # 유효전력
    dic['C_POC_GV_REAL'] = round(df_pre['702-600-359-GE2-4014'][0], 2)  # 가이드베인 개도(현재값)
    dic['C_POC_GV'] = round(df_pre['702-600-359-GE2-4102'][0], 2)  # 가이드베인 개도(설정값)
    dic['C_POC_BYPASS'] = round(df_pre['702-600-359-GE2-4103'][0], 2)  # 바이패스 밸브 개도(설정값)
    dic['C_DAM'] = round(df_pre['600-151-LEI-1001'][0], 2)  # 보령(댐) 본댐 수위
    dic['F_FRI_OUT_REAL'] = round(df['600-359-FRI-3200'][0],2) # 여과지 유출유량 
    dic['Z_LEI1'] = round(df['600-359-LEI-1101'][0], 2)  # 보령(정) 착수정 수위 #1
    dic['Z_LEI2'] = round(df['600-359-LEI-1102'][0], 2)  # 보령(정) 착수정 수위 #2
    
    #예측 모델에 사용할 input을 dic에 저장
    dic['df_pre_10m'] = df_pre_10m
    dic['temp_wl'] = temp_wl

    #가이드베인, 바이패스 밸브 개도율 값은 가장 최근 데이터로 변경
    dic['df_pre_10m'].iloc[-1]['702-600-359-GE2-4102'] = df_pre.iloc[0]['702-600-359-GE2-4102']
    dic['df_pre_10m'].iloc[-1]['702-600-359-GE2-4103'] = df_pre.iloc[0]['702-600-359-GE2-4103']
    
    # 보정로직에 사용할 데이터 저장
    dic['C_FRIIN_REAL_5m'] = round(df['600-359-FRI-1011'][4], 2)   # 10분전 원수 유입유량 
    dic['C_FRIOUT_REAL_5m'] = round(df['600-359-FRI-4410'][4], 2)  # 보령(정) 유출유량 순시
    dic['F_FRI_OUT_REAL_5m'] = round(df['600-359-FRI-3200'][4],2)  # 10분전 여과지 유출유량 
    dic['C_FRIOUT_H_5m'] = round(df['600-359-FRI-7102'][4], 2)  # 회수조 상등수 유출유량
    
    dic['C_FRIIN_REAL_10m'] = round(df['600-359-FRI-1011'][9], 2)   # 10분전 원수 유입유량 
    dic['C_FRIOUT_REAL_10m'] = round(df['600-359-FRI-4410'][9], 2)  # 보령(정) 유출유량 순시
    dic['F_FRI_OUT_REAL_10m'] = round(df['600-359-FRI-3200'][9],2)       # 10분전 여과지 유출유량 

    dic['C_POC_GV_5m'] = round(df_pre['702-600-359-GE2-4102'][4], 2)     # 5분전 가이드베인 개도(설정값)
    dic['C_POC_BYPASS_5m'] = round(df_pre['702-600-359-GE2-4103'][4], 2) # 5분전 바이패스 밸브 개도(설정값)

    dic['C_POC_GV_10m'] = round(df_pre['702-600-359-GE2-4102'][9], 2)     # 10분전 가이드베인 개도(설정값)
    dic['C_POC_BYPASS_10m'] = round(df_pre['702-600-359-GE2-4103'][9], 2) # 10분전 바이패스 밸브 개도(설정값)

    dic['C_POC_GV_20m'] = round(df_pre['702-600-359-GE2-4102'][14], 2)     # 20분전 가이드베인 개도(설정값)
    dic['C_POC_BYPASS_20m'] = round(df_pre['702-600-359-GE2-4103'][14], 2) # 20분전 바이패스 밸브 개도(설정값)

    dic['C_LEI1_10m']= round(df['600-359-LEI-4001'][9], 2)  # 10분 전 보령(정) 정수지 #1 수위
    dic['C_LEI1_20m']= round(df['600-359-LEI-4001'][19], 2)  # 20분 전 보령(정) 정수지 #1 수위

    dic['C_LEI2_10m']= round(df['600-359-LEI-4002'][9], 2)  # 10분 전 보령(정) 정수지 #2 수위
    dic['C_LEI2_20m']= round(df['600-359-LEI-4002'][19], 2)  # 20분 전 보령(정) 정수지 #2 수위

    dic['C_LEI3_10m']= round(df['600-359-LEI-4003'][9], 2)  # 10분 전 보령(정) 정수지 #3 수위
    dic['C_LEI3_20m']= round(df['600-359-LEI-4003'][19], 2)  # 20분 전 보령(정) 정수지 #3 수위
    
    #회수유량 0보다 작은 경우 0으로 치환
    if dic['C_FRIOUT_H'] < 0 : 
        dic['C_FRIOUT_H'] = 0
    if dic['C_FRIOUT_H_5m'] < 0 : 
        dic['C_FRIOUT_H_5m'] = 0


def upper_lower_bounds(col, upper, lower, df):
    '''
    극단값 대체 함수. 데이터의 정상 계측 범위 상/하한 값 적용
    Parameter -
        col: 컬럼명(string)
        upper: 상한값(int/float)
        lower: 하한값(int/float)
        df: 전처리 대상 데이터(dataframe)
    Return -
        df: 극단값 제거 후 데이터(dataframe)
    '''
    if col in df.columns:
        if len(df[col].unique()) == 1 : 
            temp_val = df[col].unique()[0]
            if (temp_val <= upper) and (temp_val >= lower):
                pass
            #모든 값이 정상 범위가 아닐 때(결측 처리)
            else:
                df[col] = np.nan
        else : 
            idx = df[(df[col] > upper) | (df[col] < lower)].index
            df.loc[df.index.isin(idx), col] = np.nan
            try: 
                df[col].fillna(method='ffill', axis=0, inplace=True)
                df[col].fillna(method='bfill', axis=0, inplace=True)
            except :
                df[col].fillna(df[col].mean(), axis=0, inplace=True)
        return df
    else :
        temp = pd.DataFrame(index = df.index, columns=[col])
        df = pd.concat([df, temp], axis = 1)
        return df


def outlier_preprocessing(df, outlier_z_score, replace_outliers_with_mean, outlier_for_timeseries, col):
    '''
    데이터 전처리 함수. z-score, STL
    Parameter -
        df: 전처리 대상 데이터(dataframe)
        outlier_z_score: z-score 기반 이상치 탐지하는 사용자 정의 함수(function)
        replace_outliers_with_mean: 이상치 대체하는 사용자 정의 함수(function)
        outlier_for_timeseries: 시계열 기반 이상치 탐지하는 사용자 정의 함수(function)
        col: 컬럼명(string)
    Return - 없음(global - 'pre_'+col 저장)
    '''
    #모든 값이 동일할 때(정상 범위가 아니면 전체 결측값)
    if len(df[col].unique()) == 1:
        outlier_replace_n = pd.DataFrame(df[col], columns=[col]).set_index(df.index)
        globals()['pre_' + col.upper()] = outlier_replace_n.copy()

    else:
        temp_len = len(df[col].unique())
        z_thresh = 3
        outlier_series, z_score_series = outlier_z_score(df[col], thresh=z_thresh)
        outlier_idx = outlier_series[outlier_series == True].index
        Series_dropna = df[col].squeeze()
        if temp_len < 10080:
            outlier_rep_df = replace_outliers_with_mean(data=Series_dropna,
                                                        indices=outlier_idx,
                                                        n=temp_len)
        else:
            outlier_rep_df = replace_outliers_with_mean(data=Series_dropna,
                                                        indices=outlier_idx,
                                                        n=10080)
        outlier_rep_df = pd.DataFrame(outlier_rep_df, columns=[col])
        outlier_rep_df.fillna(outlier_rep_df.mean(), inplace=True)

        #이상치 대체 STL. 3시간 평균값으로 대체 (데이터 길이 짧으면 해당 길이로)
        Series_dropna_2 = outlier_rep_df[col].squeeze()
        is_outlier, _ = outlier_for_timeseries(Series_dropna_2)
        if temp_len < 180:
            outlier_rep_df_2 = replace_outliers_with_mean(Series_dropna_2,
                                                          Series_dropna_2[is_outlier].index,
                                                          n=temp_len)
        else:
            outlier_rep_df_2 = replace_outliers_with_mean(Series_dropna_2,
                                                          Series_dropna_2[is_outlier].index,
                                                          n=180)
        outlier_rep_df_2 = pd.DataFrame(outlier_rep_df_2, columns=[col])
        outlier_rep_df_2.fillna(outlier_rep_df_2.mean(), inplace=True)
        globals()['pre_'+col] = outlier_rep_df_2.copy()


def normalize_data(df, minmax):
    '''
    주어진 minmax 값으로 normalization 적용
    Parameter -
        df : normalization 대상 데이터(dataframe)
        minmax : normalization을 적용할 최소/최대값 리스트(list)
    Return -
        result : normalization 결과
    '''
    result = copy.deepcopy(df)
    for index, feature_name in enumerate(df.columns):
        max_value = minmax[index][1]
        min_value = minmax[index][0]
        result[feature_name] = (df[feature_name] - min_value) / (max_value - min_value)
    return result


def denormalize_data(df, minmax):
    '''
    주어진 minmax값으로 normalization 결과를 원복하기 위한 함수
    Paramter -
        df : 원복 대상(dataframe)
        minmax : 원복에서 사용되는 최소/최대값 리스트(list)
    Return -
        result : denormalization 결과
    '''
    result = copy.deepcopy(df)
    max_value = minmax[0][1]
    min_value = minmax[0][0]
    result = df * (max_value - min_value) + min_value
    return result


def predict_valve(dic, db):
    '''
    밸브 개도 예측 함수
        1. 정수 유출유량 예측(predict_friout())
        2. 정수지 수위 밴드(create_band_lei())
        3. 목표 유입유량 예측(predict_friin())
        4. 가이드베인 개도 예측(predict_guidevane())
        5. 바이패스밸브 개도 예측(predict_bypass())
    Parameter -
        dic: Dictionary(전처리 데이터 및 모델 input 포함)
        db: DB연결 정보
    Return - 없음
    '''

    #기학습 모델 로드
    model_friout = tf.keras.models.load_model(MODEL_PATH+'friout/')
    model_friin = tf.keras.models.load_model(MODEL_PATH+'friin/')
    model_guidevane = tf.keras.models.load_model(MODEL_PATH+'guidevane/')
    model_bypass = tf.keras.models.load_model(MODEL_PATH+'bypass/')

    #모델 input 데이터 정의
    df_pre_10m = dic['df_pre_10m']
    temp_wl = dic['temp_wl']

    """    1. 정수 유출유량 예측
    과거 24시간 정수 유출유량 데이터로 향후 24시간 예측 후 4시간 예측값 활용"""
    df_base = copy.deepcopy(df_pre_10m)
    tags_friout = '600-359-FRI-4410'
    len_num = 144  # 10분 단위 144건 - 1440분 - 24시간
    model = model_friout
    minmax_friout = [6000, 14000]
    
    #Null 값 예외처리 코드 추가
    def validate_inputs1(df_base,model):
        if df_base is None:
            raise runLogger.error('validate_inputs Error - df_base: {}'.format(traceback.format_exc()))
            return
        if model is None:
            raise runLogger.error('validate_inputs Error - model: {}'.format(traceback.format_exc()))
            return
            
    validate_inputs1(df_base,model)
    
    df_pred_friout_4h = predict_friout(df_base, tags_friout, len_num, model, minmax_friout)
    friout_trend = df_pred_friout_4h.iloc[-1]
    st_hms = df_pred_friout_4h.index[-1]
    end_hms = st_hms+timedelta(hours=3, minutes=50)
    friout_trend.index = pd.date_range(st_hms, end_hms, freq='10T')

    # ===============================================================
    # ============ VVV 예측 유출유량 보정식 내용(260213) VVV ============
    # ===============================================================
    """
        작성 시각 : 260213
        작성자 : 온더시스 강동현 사원
        작성 목적 : 해당 코드 수정은 보령 정수장의 유입유량 예측 AI 모델이 변화한 정수장 환경을 따라가지 못해 정확도가 하락하는 문제의 선제적 조치로
                    진행되었다. 예측 유입유량을 인위적으로 보정해 임시적으로 정확도를 높이고자 한다.
        작성 내용 : 
                    1. friout_trend에서 현재 실제 유입유량을 앵커로 두고 a 보정계수에 따라 보정 적용
                    2. Saturation Range에 맞게 컷오프 적용
                    3. 이 때, 보정 계수 a와 saturation min max 값을 config에서 불러와서 사용
        메모 : 추후, AI 모델의 재학습 적용 후, 제거할 예정

        + 수정  : 260223 (보정 전 RAW 값 백업 코드 적용 및 AI_RT의 OUT_VAL 추가)
    """

    #262023
    # ---보정 전 RAW 값 백업 (260213 패치검증용) ---
    dic['AI_B_OUT_FRI_TREND_RAW'] = friout_trend.copy(deep=True)
    #262023

    # 1. now_friout_val 구하기 (현재 실제 유출 유량 anchor)
    # dic에는 current_data()에서 이미 C_FRIOUT_REAL 저장함! 이걸 가져다 쓰기
    now_friout_val = float(dic.get('C_FRIOUT_REAL', dic.get('C_FRIOUT', np.nan)))
    if not np.isfinite(now_friout_val):
        raise ValueError("now_friout_val (C_FRIOUT_REAL) is missing or invalid.")

    # 2. sat_min, sat_max, var_a을 json에서 읽어오기
    # config.json 위치: ai_b.py와 같은 폴더(PROC_PATH) 기준
    cfg_path = os.path.join(PROC_PATH, "config.json")

    # 기본값 = json이 없으면 보정 미적용&Saturation Clamp 미적용
    sat_min = 999999
    sat_max = 0
    var_a = 0.0  # 0이면 z = y(예측 그대로), 1이면 z = x(현재 실측으로 고정)

    try:
        with open(cfg_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            # 불러오기
        sat_min = float(cfg.get("ai_friout_trend_saturation_min", sat_min))
        sat_max = float(cfg.get("ai_friout_trend_saturation_max", sat_max))
        var_a  = float(cfg.get("ai_friout_trend_correction_var_a", var_a))
    except FileNotFoundError:
        # 운영에서 파일이 없으면 기본값으로 진행 (로그만 남기고 계속)
        runLogger.error(f"config.json not found: {cfg_path}")
    except Exception:
        runLogger.error(f"config.json read/parse error: {traceback.format_exc()}")

    # a 범위 보장 (0 < a < 1)
    # 극단값이 들어오면 clamp 적용
    var_a = max(0.0, min(1.0, var_a))

    # sat_min/sat_max 정합성 보장
    # 대소 관계 틀렸다면 뒤바꿔줌
    if sat_min > sat_max:
        sat_min, sat_max = sat_max, sat_min

    # 3. friout_trend 에 보정 적용 (각 24개 원소에 대해)
    # z = a*x + (1-a)*y
    # x = now_friout_val(현재 실측 유출유량), y = friout_trend(예측 트렌드)
    friout_trend = (var_a * now_friout_val) + ((1.0 - var_a) * friout_trend.astype(float))

    # 4. min/max(saturation) 적용
    # pandas Series clip 사용
    friout_trend = friout_trend.clip(lower=sat_min, upper=sat_max)

    # ===============================================================
    # ============ ^^^ 예측 유출유량 보정식 내용(260213) ^^^ ============
    # ===============================================================
    dic['AI_B_OUT_FRI_TREND'] = friout_trend
    



    """    2. 정수지 수위 밴드
    과거 정수지 수위 데이터와 최근 7일 정수지 수위 데이터로 정수지 수위 밴드 생성"""
    df_lei = copy.deepcopy(temp_wl)
    path_lei_csv_file = '/b/data/BR_lei_20230101_20240131.csv'  # 과거 정수지 수위 데이터
    min_value = dic['P_LEI_MIN']
    max_value = dic['P_LEI_MAX']
    col_list_wl = ['600-359-LEI-4001', '600-359-LEI-4002', '600-359-LEI-4003']
    df_lei_roll = create_band_lei(df_lei, path_lei_csv_file, col_list_wl, min_value, max_value)
    df_roll = copy.deepcopy(df_lei_roll[['hh', 'll']])
    df_roll.columns = ['H_BND_UPLMT', 'H_BND_LOLMT']
    df_roll.index.name = 'TI_SEQ'
    df_roll = df_roll.reset_index()
    dic['lei_roll'] = df_roll
    db.save_df_opr_bnd(tb_nm_opr_bnd, df_roll)

    """    3. 목표 유입유량 예측
    과거 원수 유입유량 데이터, 정수 유출유량 예측값(4시간), 정수지 수위 데이터 활용"""
    df_base = copy.deepcopy(df_pre_10m)
    df_lei = copy.deepcopy(temp_wl)
    df_roll = copy.deepcopy(df_lei_roll)
    df_friout = copy.deepcopy(df_pred_friout_4h)
    tags_friin = '600-359-FRI-1011'
    tags_friout = '600-359-FRI-4410'
    tags_friout_h = '600-359-FRI-7102'
    len_num_x1 = 144  # 10분 단위 14건 - 1440분 - 24시간
    len_num_x2 = 12   # 10분 단위 12건 - 120분 - 2시간
    model = model_friin
    minmax_friin = [6000, 14000]
    minmax_friin_list = [
                        [2.5, 4.8],  # 정수지 수위 평균
                        [4.0, 4.8],  # 정수지 수위 상한값
                        [2.5, 3.2],  # 정수지 수위 하한값
                        [0, 1500],   # 회수조 상등수 유출유량
                        [6000, 14000],  # 현재 정수 유출유량
                        [7000, 13000], #1
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000], #5
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000], #10
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000], #15
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000], #20
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000],
                        [7000, 13000] #24
        ]

    #Null 값 예외처리 코드 추가
    def validate_inputs2(df_base, df_lei,df_roll,df_friout,model):
        if df_base is None:
            raise runLogger.error('validate_inputs Error - df_base: {}'.format(traceback.format_exc()))
            return
        if df_lei is None:
            raise runLogger.error('validate_inputs Error - df_lei: {}'.format(traceback.format_exc()))
            return
        if df_roll is None:
            raise runLogger.error('validate_inputs Error - df_roll: {}'.format(traceback.format_exc()))
            return
        if df_friout is None:
            raise runLogger.error('validate_inputs Error - df_friout: {}'.format(traceback.format_exc()))
            return
        if model is None:
            raise runLogger.error('validate_inputs Error - model: {}'.format(traceback.format_exc()))
            return

            
    validate_inputs2(df_base, df_lei,df_roll,df_friout,model)
    
    df_pred_friin = predict_friin(df_base, df_lei, df_roll, df_friout,
                                  tags_friin, tags_friout, tags_friout_h,
                                  len_num_x1, len_num_x2,
                                  model,
                                  minmax_friin, minmax_friin_list)

    #개도 예측 input에 사용할 데이터프레임
    df_pred_friin_for_valve = df_pred_friin[['in_10m']]
    df_pred_friin_for_valve.columns = ['pred_friin']
    
    #10분 후 필요 원수 유입유량(상단 표출값)
    df_pred_friin_10m = df_pred_friin.iloc[:, :1]
    df_pred_friin_10m.index.name = 'datetime'
    dic['AI_B_IN_FRI'] = df_pred_friin_10m.iloc[-1][0]  
    
    #향후 24시간 필요 원수 유입유량 트렌드(좌측 하단 표출값)
    friin_trend = df_pred_friin.iloc[-1, :]
    st_hms = df_pred_friin.index[-1]
    end_hms = st_hms+timedelta(hours=23, minutes=50)
    friin_trend.index = pd.date_range(st_hms, end_hms, freq='10T')
    dic['AI_B_IN_FRI_TREND'] = friin_trend
    
    """    4. 가이드베인 개도 예측
    최근 7일 데이터 및 10분 후 목표 유입유량 데이터 활용하여 가이드베인 개도율 예측"""
    df_base = copy.deepcopy(df_pre_10m)
    df_friin_pred = copy.deepcopy(df_pred_friin_for_valve)
    tags_friin = '600-359-FRI-1011'
    len_num = 12  # 10분 단위 12건 - 120분 - 2시간
    model = model_guidevane
    x_cols_gv = [
                '600-359-LEI-4001',
                '600-359-LEI-4002',
                '600-359-LEI-4003',  # 정수지 수위
                '600-359-PRI-1001',  # 원수 유입압력
                '702-600-359-GE2-4068',  # 소수력 ACB 총 유효전력
                'diff',  # 목표 유입유량과 현재 원수 유입유량 차이
                '702-600-359-GE2-4103',  # 바이패스 개도율(현재)
                '702-600-359-GE2-4102'  # 가이드베인 개도율(현재)
                ]
    minmax_list_gv = [
                        [2.4, 4.8], [2.4, 4.8], [2.4, 4.8],  # 정수지수위
                        [2.5, 3.0],  # 원수 유입압력
                        [300, 600],  # 소수력 ACB 총 유효전력
                        [-4000, 4000],  # 목표 유입유량과 현재 원수 유입유량 차이
                        [0, 40],  # 바이패스(현재)
                        [0, 80]   # 가이드베인(현재)
                    ]

    #11.08 Null 값 예외처리 코드 추가
    def validate_inputs3(df_base, df_friin_pred,model):
        if df_base is None:
            raise runLogger.error('validate_inputs Error - df_base: {}'.format(traceback.format_exc()))
            return
        if df_friin_pred is None:
            raise runLogger.error('validate_inputs Error - df_friin_pred: {}'.format(traceback.format_exc()))
            return
        if model is None:
            raise runLogger.error('validate_inputs Error - model: {}'.format(traceback.format_exc()))
            return
            
    #함수 적용
    validate_inputs3(df_base, df_friin_pred,model)
    
    pred_gv = predict_guidevane(df_base, df_friin_pred, tags_friin, x_cols_gv,
                                len_num, minmax_list_gv, model)

    """    5. 바이패스 밸브 개도 예측
    최근 7일 데이터 및 10분 후 목표 유입유량 데이터 활용하여 밸바이패스 밸브 개도율 예측"""
    df_base = copy.deepcopy(df_pre_10m)
    df_friin_pred = copy.deepcopy(df_pred_friin_for_valve)
    tags_friin = '600-359-FRI-1011'
    len_num = 12
    model = model_bypass
    x_cols_bypass = [
                    '600-359-LEI-4001',
                    '600-359-LEI-4002',
                    '600-359-LEI-4003',  # 정수지 수위
                    '600-359-PRI-1001',  # 원수 유입압력
                    '702-600-359-GE2-4068',  # 소수력 ACB 총 유효전력
                    'diff',  # 목표 유입유량과 현재 원수 유입유량 차이
                    '702-600-359-GE2-4102',  # 가이드베인 개도율(현재)
                    '702-600-359-GE2-4103'  # 바이패스 개도율(현재)
                    ]
    minmax_list_bypass = [
                            [2.4, 4.8], [2.4, 4.8], [2.4, 4.8],  # 정수지수위
                            [2.5, 3.0],  # 원수 유입압력
                            [300, 600],  # 소수력 ACB 총 유효전력
                            [-4000, 4000],  # 목표 유입유량과 현재 원수 유입유량 차이
                            [0, 80],  # 가이드베인(현재)
                            [0, 40]   # 바이패스(현재)
                        ]

    #11.08 Null 값 예외처리 코드 추가
    def validate_inputs(df_base, df_friin_pred,model):
        if df_base is None:
            raise runLogger.error('validate_inputs Error - df_base: {}'.format(traceback.format_exc()))
            return
        if df_friin_pred is None:
            raise runLogger.error('validate_inputs Error - df_friin_pred: {}'.format(traceback.format_exc()))
            return
        if model is None:
            raise runLogger.error('validate_inputs Error - model: {}'.format(traceback.format_exc()))
            return
            
    #함수 적용
    validate_inputs(df_base, df_friin_pred,model)
    pred_bypass = predict_bypass(df_base, df_friin_pred, tags_friin, x_cols_bypass,
                                 len_num, minmax_list_bypass, model)

    #최종 밸브 개도 예측값 반올림 및 저장
    valve_gv = round(pred_gv.iloc[-1].item())
    valve_bypass = round(pred_bypass.iloc[-1].item())
    dic['Prediction_V_gv'] = valve_gv
    dic['Prediction_V_bypass'] = valve_bypass

    print("Current Guidevane Value: ", dic['C_POC_GV'],
          "\n--> Predicted Guidevane Value: ", dic['Prediction_V_gv'])
    print("Current Bypass Valve Value: ", dic['C_POC_BYPASS'],
          "\n--> Predicted Bypass Valve Value: ", dic['Prediction_V_bypass'])

    del dic['df_pre_10m']
    del dic['temp_wl']
    K.clear_session()
    tf.keras.backend.clear_session()


def predict_friout(df_base, tags_friout, len_num, model, minmax_friout):
    '''
    정수 유출유량 예측 함수
    Parameter -
        df_base: 정수 유출유량 태그가 포함된 전처리 후 최근 데이터(dataframe)
        tags_friout: 정수 유출유량 예측에 사용되는 태그명(string)
        len_num: 시퀀스 길이(int)
        model: 정수 유출유량 예측 모델(model)
        minmax_friout: 정수 유출유량 최소/최대값 리스트(predict_frioutlist)
    Return -
        df_pred_friout_4h: 정수 유출유량 4시간 예측 결과(dataframe)
    '''

    #데이터 인덱스 전체 기간 및 10분 단위 설정
    start_date = df_base.index[0]
    end_date = df_base.index[-1]
    idx_date = pd.date_range(start_date, end_date, freq='10T')

    #정수 유출유량 데이터프레임 생성
    df_friout = pd.DataFrame(index=idx_date)
    df_friout['friout'] = df_base[tags_friout]
    df_friout = df_friout.fillna(method='ffill')

    #최소/최대값 리스트
    minmax_friout = [minmax_friout]

    #데이터 스케일링
    df_scaled_friout = normalize_data(df_friout, minmax_friout)

    #시퀀스 생성
    temp_x = []
    for i in range(len(df_scaled_friout)-len_num):
        seq_x = df_scaled_friout[i:i+len_num]
        temp_x.append(seq_x)
    x_seq_friout = np.array(temp_x)
    x_seq_friout = x_seq_friout.reshape((len(x_seq_friout), len_num, 1))

    #정수 유출유량 예측
    pred_friout = model.predict(x_seq_friout)

    #예측값 디스케일링
    inv_pred_friout = denormalize_data(pred_friout, minmax_friout)

    #24시간 예측값 중 4시간 예측값으로 구성된 데이터프레임 생성
    df_pred_friout = pd.DataFrame(inv_pred_friout)
    df_pred_friout.index = df_friout.index[144:]
    col_list_friout = [f'out_{(x+1)*10}m' for x in range(144)]
    df_pred_friout.columns = col_list_friout
    df_pred_friout_4h = df_pred_friout.iloc[:, :24]
    df_pred_friout_4h.index.name = 'datetime'

    return df_pred_friout_4h


def unstack_rolling(df, col):
    '''
    정수지 수위 시간대별 평균값 산출하는 함수
    Parameter - 
        df: 시간대별 평균값 산출할 대상 데이터(dataframe)
        col: 컬럼명(string)
    Return -
        df_roll: 정수지 수위 시간대별 평균 데이터(dataframe)
    '''
    df_tmp = df[[col]]
    df_tmp.dropna(axis=0, inplace=True)
    df_tmp.index = pd.to_datetime(df_tmp.index)
    df_tmp = drop_duplicate_rows(df_tmp)
    #row index: 날짜, columns: 시간(분단위)
    df_Da = df_tmp.set_index([df_tmp.index.date,
                              df_tmp.index.time])[col].rename_axis([None] * 2).unstack()
    #10분 이동평균값 활용
    df_roll = pd.DataFrame(df_Da.mean(axis=0).rolling(10).mean(), columns=['roll'])

    ll = len(df_roll) - 1
    for i in range(10):
        df_roll['roll'][i] = df_roll['roll'][ll - i]
    df_roll = df_roll.interpolate()

    return df_roll


def create_band_lei(df_lei, path_lei_csv_file, col_list_wl, min_value, max_value):
    '''
    정수지 수위 밴드 산출 함수
    Parameter -
        df_lei: 최근 정수지 수위 데이터(dataframe)
        path_lei_csv_file: 과거 정수지 수위 csv 데이터 파일 경로(string)
        col_list_wl: 정수지 수위 태그명 리스트(list)
        min_value: 정수지 수위 최소값(float)
        max_value: 정수지 수위 최대값(float)
    Return -
        lei_roll: 정수지 수위 밴드 데이터(dataframe)
    '''
    #최근 정수지 수위 데이터
    df_lei = copy.deepcopy(df_lei)
    df_lei.index = pd.to_datetime(df_lei.index)
    df_lei.index.name = 'datetime'

    #과거 정수지 데이터
    df_lei_past = pd.read_csv(BASE_PATH+path_lei_csv_file)
    df_lei_past.index = df_lei_past['datetime']
    df_lei_past.index.name = 'UPD_TI'
    df_lei_past = df_lei_past.drop(columns=['datetime'])
    df_lei_past.columns = col_list_wl

    """    과거 정수지 수위 데이터 + 최근 정수지 수위 데이터
    df_lei_wl_all = pd.concat([df_lei_past, df_lei], axis=0)"""
    df_lei_wl_all = df_lei.copy(deep=True)
    
    #정수지 수위 데이터 전처리
    for col in col_list_wl:
        df_lei_wl_all[col] = np.where(df_lei_wl_all[col] < min_value,
                                      np.NaN, df_lei_wl_all[col])
        df_lei_wl_all[col] = np.where(df_lei_wl_all[col] > max_value,
                                      np.NaN, df_lei_wl_all[col])
    df_lei_wl_all['lei'] = df_lei_wl_all.mean(axis=1)
    

    #정수지 수위 밴드 생성
    df_lei_roll = unstack_rolling(df_lei_wl_all, 'lei')
    df_lei_roll['hh'] = df_lei_roll['roll']+(2*df_lei_wl_all['lei'].std())
    df_lei_roll['ll'] = df_lei_roll['roll']-(2*df_lei_wl_all['lei'].std())
    df_lei_roll.index.name = 'hms'
    return df_lei_roll


def predict_friin(df_base, df_lei, df_roll, df_friout,
                  tags_friin, tags_friout, tags_friout_h,
                  len_num_x1, len_num_x2,
                  model,
                  minmax_friin, minmax_friin_list):
    '''
    목표 유입유량 예측 함수
    Parameter -
        df_base: 유입/유출유량 태그가 포함된 전처리 후 최근 데이터(dataframe)
        df_lei: 최근 정수지 수위 데이터(dataframe)
        df_roll: 정수지 수위 밴드 데이터(dataframe)
        df_friout: 정수 유출유량 4시간 예측 결과 데이터(dataframe)
        tags_friin: 원수 유입유량 태그명(string)
        tags_friout: 정수 유출유량 태그명(string)
        tags_friout: 회수조 유출유량 태그명(string)
        len_num_x1: x1 시퀀스 길이(int)
        len_num_x2: x2 시퀀스 길이(int)
        model: 목표 유입유량 예측 모델(model)
        minmax_friin: 원수 유입유량 최소/최대값 리스트(list)
        minmax_friin_list: 목표 유입유량 예측에 사용되는 입력변수의 최소/최대값 리스트(list)
    Return -
        df_pred_friin_for_valve: 목표 유입유량 예측 결과(dataframe)
    '''
    #최근 원수 유입유량 데이터 선언 및 인덱스명 변경
    df_now = pd.DataFrame(df_base[tags_friin])
    df_now.columns = ['friin']
    df_now = df_now.fillna(method='ffill')
    df_now.index.name = 'datetime'

    #x1: 원수 유입유량(y값 베이스)
    df_friin = copy.deepcopy(df_now)
    df_friin['friin'] = df_base[tags_friin]

    #x2: 설명 변수 추가(수위, 회수조 유출유량, 유출유량 등)
    df_for_pred_in = copy.deepcopy(df_now)

    #정수지 수위 데이터 인덱스명 변경
    df_lei.index.name = 'datetime'

    #원수 유입유량 데이터 + 수위 평균값
    df_for_pred_in = pd.merge(df_for_pred_in, df_lei[['LEI_mean']],
                              left_on='datetime', right_on='datetime', how='left')
    df_for_pred_in['hms'] = df_for_pred_in.index.time

    #정수지 수위 밴드 컬럼 추가(상/하한값)
    df_for_pred_in = pd.merge(df_for_pred_in, df_roll[['hh', 'll']],
                              left_on='hms', right_on='hms', how='left')

    #데이터프레임 인덱스 지정(일주일, 10분 단위)
    df_for_pred_in.index = df_base.index

    #현재 회수조 상등수 유출유량, 정수 유출유량 컬럼 추가
    df_for_pred_in['friout_h'] = df_base[tags_friout_h]
    df_for_pred_in['friout'] = df_base[tags_friout]

    #현재 원수 유입유량, 시간 컬럼 삭제
    df_for_pred_in = df_for_pred_in.drop(columns=['friin', 'hms'])

    #결측값을 이전값으로 대체
    df_for_pred_in = df_for_pred_in.fillna(method='ffill')

    #정수 유출유량 예측값(4시간) 컬럼 추가
    df_for_pred_in = pd.merge(df_for_pred_in, df_friout,
                              left_on='datetime', right_on='datetime', how='right')
    df_for_pred_in = df_for_pred_in.dropna()

    #최소/최대값 리스트
    minmax_friin = [minmax_friin]

    #minmax_list 활용하여 데이터 스케일링
    df_scaled_friin_x1 = normalize_data(df_friin, minmax_friin)
    df_scaled_friin_x2 = normalize_data(df_for_pred_in, minmax_friin_list)

    #시퀀스 데이터 생성: x1
    temp_x = []
    for i in range(len(df_scaled_friin_x1)-len_num_x1):
        seq_x = df_scaled_friin_x1[i:i+len_num_x1]
        temp_x.append(seq_x)
    x1_seq_friin = np.array(temp_x)
    x1_seq_friin = x1_seq_friin.reshape((len(x1_seq_friin), len_num_x1, 1))

    #시퀀스 데이터 생성 : x2
    temp_x = []
    for i in range(len(df_scaled_friin_x2)-len_num_x2):
        seq_x = df_scaled_friin_x2[i:i+len_num_x2]
        temp_x.append(seq_x)
    x2_seq_friin = np.array(temp_x)
    x2_seq_friin = x2_seq_friin.reshape((len(x2_seq_friin), len_num_x2, len(df_for_pred_in.columns)))

    #인덱스 동일하게 설정
    len_diff = len(x1_seq_friin) - len(x2_seq_friin)
    x1_seq_friin = x1_seq_friin[len_diff:]
                      
    #목표 유입유량 예측
    pred_friin = model.predict([x1_seq_friin, x2_seq_friin])

    #예측값 디스케일링
    inv_pred_friin = denormalize_data(pred_friin, minmax_friin)

    #예측값 데이터프레임 생성
    df_pred_friin = pd.DataFrame(inv_pred_friin)
    df_pred_friin.index = df_for_pred_in.index[12:]
    col_list_friin = [f'in_{(x+1)*10}m' for x in range(144)]
    df_pred_friin.columns = col_list_friin

    return df_pred_friin


def predict_guidevane(df_base, df_friin_pred, tags_friin, x_cols_gv,
                      len_num, minmax_list_gv, model):
    '''
    가이드베인 개도 예측 함수
    Parameter -
        df_base: 유입/유출유량 태그가 포함된 전처리 후 최근 데이터(dataframe)
        df_friin_pred: 목표 유입유량 예측 결과 데이터(dataframe)
        tags_friin: 원수 유입유량 태그명(string)
        x_cols_gv: 가이드베인 개도 예측에 필요한 입력변수명 리스트(list)
        len_num: 시퀀스 길이(int)
        minmax_list_gv: 가이드베인 개도 예측에 사용되는 입력변수의 최소/최대값 리스트(list)
        model: 가이드베인 개도 예측 모델(model)
    Return -
        df_pred_gv: 가이드베인 개도 예측 결과(dataframe)
    '''
    #인덱스명 변경 및 모델 입력 데이터 생성
    df_base.index.name = 'datetime'
    df_model = pd.merge(df_base, df_friin_pred,
                        left_on='datetime', right_on='datetime', how='left')

    #목표 유입유량과 현재 원수 유입유량 차이 계산
    df_model['diff'] = df_model['pred_friin'] - df_model[tags_friin]

    #예측 모델 input 데이터 생성
    df_model = df_model[x_cols_gv]
    df_model = df_model.dropna()
    x1_cols = df_model.columns[:-1]  # 가이드베인 현재값을 제외한 변수는 input1으로 사용
    x2_cols = df_model.columns[-1]  # 가이드베인 현재값은 input2로 사용
    df_scaled_gv = normalize_data(df_model, minmax_list_gv)
    temp_x1 = []
    temp_x2 = []
    for i in range(len(df_scaled_gv)-len_num):
        seq_x1 = df_scaled_gv[i:i+len_num][x1_cols]
        seq_x2 = df_scaled_gv.iloc[i+len_num][x2_cols].item()
        temp_x1.append(seq_x1)
        temp_x2.append(seq_x2)
    x1_seq_gv = np.array(temp_x1)
    x2_seq_gv = np.array(temp_x2)

    #input1, input2 데이터로 예측 및 결과 저장
    pred_gv = model.predict([x1_seq_gv, x2_seq_gv])
    df_pred_gv = denormalize_data(pd.DataFrame(pred_gv,
                                               columns=['pred']), [minmax_list_gv[-1]])
    df_pred_gv.index = df_model.index[len_num:]

    return df_pred_gv


def predict_bypass(df_base, df_friin_pred, tags_friin, x_cols_bypass,
                   len_num, minmax_list_bypass, model):
    '''
    바이패스 밸브 개도 예측 함수
    Parameter -
        df_base: 유입/유출유량 태그가 포함된 전처리 후 최근 데이터(dataframe)
        df_friin_pred: 목표 유입유량 예측 결과 데이터(dataframe)
        tags_friin: 원수 유입유량 태그명(string)
        x_cols_bypass: 바이패스 밸브 개도 예측에 필요한 입력변수명 리스트(list)
        len_num: 시퀀스 길이(int)
        minmax_list_bypass: 바이패스 밸브 개도 예측에 사용되는 입력변수의 최소/최대값 리스트(list)
        model: 바이패스 밸브 개도 예측 모델(model)
    Return -
        df_pred_bypass: 바이패스 밸브 개도 예측 결과(dataframe)
    '''
    #인덱스명 변경 및 모델 입력 데이터 생성
    df_base.index.name = 'datetime'
    df_model = pd.merge(df_base, df_friin_pred, left_on='datetime', right_on='datetime', how='left')

    #목표 유입유량과 현재 원수 유입유량 차이 계산
    df_model['diff'] = df_model['pred_friin'] - df_model[tags_friin]

    #예측 모델 input 데이터 생성
    df_model = df_model[x_cols_bypass]
    df_model = df_model.dropna()
    x1_cols = df_model.columns[:-1]  # 바이패스 밸브 현재값을 제외한 변수는 input1으로 사용
    x2_cols = df_model.columns[-1]  # 바이패스 밸브 현재값은 input2로 사용
    df_scaled_bypass = normalize_data(df_model, minmax_list_bypass)
    temp_x1 = []
    temp_x2 = []
    for i in range(len(df_scaled_bypass)-len_num):
        seq_x1 = df_scaled_bypass[i:i+len_num][x1_cols]
        seq_x2 = df_scaled_bypass.iloc[i+len_num][x2_cols].item()
        temp_x1.append(seq_x1)
        temp_x2.append(seq_x2)
    x1_seq_bypass = np.array(temp_x1)
    x2_seq_bypass = np.array(temp_x2)

    #input1, input2 데이터로 예측 및 결과 저장
    pred_bypass = model.predict([x1_seq_bypass, x2_seq_bypass])
    df_pred_bypass = denormalize_data(pd.DataFrame(pred_bypass,
                                                   columns=['pred']), [minmax_list_bypass[-1]])
    df_pred_bypass.index = df_model.index[len_num:]

    return df_pred_bypass

def pre_ctr_chng_check(db, tb_nm_base, dic):
    '''
    모델 전처리 후 CTR에 전송하기 전 이미 제어근무자에 의해 개도제어가 이루어진 경우,
    제어 테이블에 값 전송하지 않음 
    변경 이전 개도율 값 제어 알람 방지용

    Parameter -
        db: DB연결 정보
        tb_nm_base: 테이블명
        dic: Dictionary
    Return - pre_ctr_chng_flag(int)

    '''

    pre_ctr_chng_flag = 0  # 현재 개도율 설정 값과 모델 예측에 사용된 값 변동 여부  
    poc_1 = '702-600-359-GE2-4102'  # 가이드 베인
    poc_2 = '702-600-359-GE2-4103'  # 바이패스 밸브

    sql1 = f'''
        select * from {tb_nm_base}
		where TAG_SN = {"'"+str(poc_1)+"'"}
        order by UPD_TI desc limit 1
       '''
	   
    sql2 = f'''
        select * from {tb_nm_base}
		where TAG_SN = {"'"+str(poc_2)+"'"}
        order by UPD_TI desc limit 1
       '''
	  
    #RT 테이블 LOAD
    rt_poc1 = db.read(sql1)
    rt_poc2 = db.read(sql2)
    
    rt_poc1_val = rt_poc1['TAG_VAL'].values[0]
    rt_poc2_val = rt_poc2['TAG_VAL'].values[0]
    
 #모델 예측에 사용된 최근 값
    poc1 = dic['C_POC_GV']
    poc2 = dic['C_POC_BYPASS']
    
    if int(float(rt_poc1_val)) != int(float(poc1)) or int(float(rt_poc2_val)) != int(float(poc2)) : 
        pre_ctr_chng_flag = 1

    return pre_ctr_chng_flag

def pre_ctr_cancel_check(db, tb_nm_ctr):
    '''
    최근 30분 기준 제어 취소한 이력이 있는경우 제어 전송하지 않음
    보정 로직 적용시 활용되는 지속시간에 영향 받지 않도록 함

    Parameter -
        db: DB연결 정보
        tb_nm_ctr: CTR 테이블명
    Return - pre_ctr_cancel_flag(int)
    '''
    pre_ctr_cancel_flag = 0    # 이전 시간 제어 취소 여부  
    minutes = 30               # 제어 결과 비교 주기  
    
    sql = f'''
        select * from {tb_nm_ctr}
        where UPD_TI >= SYSDATE() - INTERVAL {minutes} MINUTE 
        AND KFK_FLG != {str(3)}
        order by UPD_TI desc;
       '''
	   
    #AI CTR 테이블 LOAD
    pre_ai_ctr = db.read(sql)
    
    #시간 이내 알람 횟수 측정
    pre_ctr_cnt = len(pre_ai_ctr)

    # 제어 취소가 1건이라도 있으면 True
    if pre_ctr_cnt > 0  :
        pre_ctr_cancel_flag  = 1
    else : 
        pre_ctr_cancel_flag  = 0
    
    return pre_ctr_cancel_flag 


def pre_alm_check(db, tb_nm_alm,alm_id):
    '''
    최근 15분 기준 수위발생 알람 발생한경우, 알람 발생하지 않음 
    
    Parameter -
        db: DB연결 정보
        tb_nm_alm: ALM 테이블명
    Return - pre_alm_flag(int)
    '''
    pre_alm_flag = 0    # 이전 시간 제어 취소 여부  
    minutes = 30               # 제어 결과 비교 주기  
    
    sql = f'''
        select * from {tb_nm_alm}
        where ALM_TI >= SYSDATE() - INTERVAL {minutes} MINUTE 
        AND ALM_ID = {alm_id}
        order by ALM_TI desc;
       '''
	   
    #AI CTR 테이블 LOAD
    pre_ai_alm = db.read(sql)
    
    #시간 이내 알람 횟수 측정
    pre_alm_cnt = len(pre_ai_alm)

    if pre_alm_cnt > 0  :
        pre_alm_flag  = 1 
    else : 
        pre_alm_flag  = 0
    
    return pre_alm_flag 

    
def apply_valve(dic, db):
    '''
    밸브 예측값 업데이트 및 알람 발생
    Parameter -
        dic: Dictionary(현재값 및 예측값 포함)
        db: DB연결 정보
    Return - 없음(dic 값 변경 및 알람 테이블 데이터 저장)

    <운영 특이사항>
    * 약 3개월에 1번씩 가이드 베인 작동을 멈춤(설비 점검)
    -> (가이드베인 실제값이 0임. 설정값과 다름. 바이패스 밸브로 원수 유입유량 조절)
    
    * 가이드 베인 전력량 기준 350kw~550kw 유지되도록 조절
    -> (전력량이 550kw 넘지 않아야 함)
    
    * 가이드 베인 전력량은 같은 개도율 값으로 변경해도 댐 수위에 따라 달라짐
    -> 데이터로 확인한 결과, 댐 수위와 유효전력 간 약한 양의 상관관계가 나타났음
       그러나, 전력 변화량과의 관계는 파악할 수 없어 보정로직에 추가하지 않음
    
    * 바이패스 밸브 개도율을 늘리면 가이드 베인 전력량 감소함

    ==> 설비점검 등으로 가이드 베인 운영하지 않을 경우 데이터로 구분(가이드 베인 실제값 이용)
    ==> 전력량이 일정 기준 넘으면 가이드 베인 추가 개도하지 않고 바이패스만 추가 개도함
    
    보정로직
    1. 예측값과 관계없이 정수지 수위가 낮을 때 밸브 개도율 증가
       - 정수지 수위가 30분동안 낮을 때 밸브 개도율 증가
    2. 예측값과 관계없이 유출유량, 정수지 수위 고려하여 밸브 개도율 증가
       - 1시간 전보다 유출유량이 2000 초과 증가 
       - 1시간 전보다 정수지 수위가 0.2m 초과 감소
       - 현재 정수지 수위가 2.6m 미만
    3. 예측값과 관계없이 정수지 수위가 높을 때 밸브 개도율 감소
       - 정수지 수위가 30분동안 높을 때 밸브 개도율 감소
    '''

    #시간대별 전처리
    upd_tm_h = pd.to_datetime(dic['update_time']).hour
    #스케줄 형식의 제어를 위한 분단위 추출
    upd_tm_m = pd.to_datetime(dic['update_time']).minute
    
    V_TOL_GV = dic['P_VALVE_GV_MIN']             # 가이드베인 개도 변화 최소값
    V_THRE_GV = dic['P_VALVE_GV_MAX']+1          # 가이드베인 개도율 임계치
    V_TOL_BYPASS = dic['P_VALVE_BYPASS_MIN']     # 바이패스 밸브 개도 변화 최소값
    V_THRE_BYPASS = dic['P_VALVE_BYPASS_MAX']+1  # 바이패스 밸브 개도율 임계치

    V_FRI_IN_UPPER = 12300                     # 해당 값 이상 시 더이상 개도하지 않음
    V_FRI_IN_UPPER_H = 12800                   # 해당 값 이상 시 개도율 감소 
    V_FRI_IN_LOWER = 0                         # 해당 값 이하 시 더이상 개도 감소하지 않음

    #목표정수지 수위 보정로직 (화면설정값 : 4.2m - 3.2m로 설정)
    V_LEI_LOWER = dic['P_LEI_MIN'] +0.3
    V_LEI_UPPER = dic['P_LEI_MAX'] -0.3  # 1지 특성 반영 
    
    #시간대 실제 목표 수위
    dic['V_LEI_LOWER'] = V_LEI_LOWER
    dic['V_LEI_UPPER'] = V_LEI_UPPER

    #주간에는 미리 물을 받기 위해 목표 수위 변경
    if (upd_tm_h >=5) and (upd_tm_h <= 10) :
        V_LEI_LOWER = V_LEI_LOWER + 0.1
        
    #야간에는 미리 물을 받기 위해 목표 수위 변경
    elif (upd_tm_h >=17) and (upd_tm_h <= 22) :
        V_LEI_LOWER = V_LEI_LOWER + 0.1

    #  정수지 수위가 목표 수위 근처에 도달한 경우에는 유입유량 더 받음 
    if 3 < dic['C_LEI1'] : 
        V_FRI_IN_UPPER = 12400
        V_FRI_IN_UPPER_H = 13000
        
    # 최소/최대 값 가이드 베인 최소/최대 값
    V_CTR_GV,V_CTR_GV_MAX = dic['P_VALVE_GV_MIN'],dic['P_VALVE_GV_MAX']           
    #바이패스 밸브 최소/최대 값
    V_CTR_BP,V_CTR_BP_MAX = dic['P_VALVE_BYPASS_MIN'],dic['P_VALVE_BYPASS_MAX']  
    
    #전력량 상한 (전력량 상한 - 버퍼)
    V_THRE_ELEC = dic['P_GV_PWR']-20
    
    #가이드베인 상/하한
    gv_lower,gv_upper = dic['P_VALVE_GV_LOLMT'],dic['P_VALVE_GV_UPLMT']
    #바이패스 상/하한
    bp_lower,bp_upper = dic['P_VALVE_BYPASS_LOLMT'],dic['P_VALVE_BYPASS_UPLMT']

    
    #가이드베인 50이하일 때만 하한 변경
    if dic['C_POC_GV'] <= 50:
        bp_lower = 0
    
    #가이드 베인 운영 여부 판단(가이드베인 개도 10% 미만일 때 미운영으로 판단)
    CHECK_GV = np.where(dic['C_POC_GV'] < 10, 'BP', 'GV')

    #전력량 기준(추가 개도 대상)
    CHECK_ELEC = np.where(dic['C_ELEC'] > V_THRE_ELEC, 'BP', 'GV')

    #댐 수위 기준 (70 m) (10.25)
    CHECK_DAM = np.where(dic['C_DAM'] >= 70, 'H', 'L') 
    
    #현재시간
    dic['now'] = time.strftime('%Y-%m-%d %H:%M:%S')
    
    #  예외처리
    # (1) 모델 실행 중 제어 값 변경된 경우 제어근무자 개도율 변경이후 반대 알람 방지용
    dic['pre_ctr_chng_flag'] = pre_ctr_chng_check(db, tb_nm_base, dic)

    # (2) 최근 30분간 제어 취소된 이력이 있는 경우 유사한 제어 취소 알람 개수 최소화
    dic['pre_ctr_cancel_flag'] = pre_ctr_cancel_check(db, tb_nm_ctr)

    #최소값보다 작으면 현재 개도율 그대로 사용
    if abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) <= V_TOL_GV:
        dic['Control_V_gv'] = dic['C_POC_GV']
    elif abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) > V_TOL_GV:
        dic['Control_V_gv'] = dic['Prediction_V_gv']
        
    #최소값보다 크거나 같으면 예측값으로 개도 설정 변경
    if abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) <= V_TOL_BYPASS:
        dic['Control_V_bypass'] = dic['C_POC_BYPASS']
    elif abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) > V_TOL_BYPASS:
        dic['Control_V_bypass'] = dic['Prediction_V_bypass']

    #개도율 증가 로직 (가이드베인/바이패스 중 택1 제어)
    def plus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper) : 
        #가이드 베인 운영중 & 전력량 기준 안정적 : 가이드베인 먼저 증가
        if (CHECK_GV == 'GV') & (CHECK_ELEC == 'GV') & ((dic['Control_V_gv'] + V_CTR_GV)<=gv_upper):
            dic['Control_V_gv'] = dic['Control_V_gv'] + V_CTR_GV
        #그 외의 경우 바이패스 개도
        else : 
            if dic['C_POC_BYPASS'] >= 10 :
                dic['Control_V_bypass'] = dic['Control_V_bypass'] + V_CTR_BP
            else : 
                dic['Control_V_bypass'] = dic['Control_V_bypass'] + V_CTR_BP_MAX
            
        return dic['Control_V_gv'],dic['Control_V_bypass']
        
    #개도율 감소 로직 (가이드베인/바이패스 중 택1 제어)
    def minus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower) : 
        #가이드 베인 운영중 & 전력량 기준 안정적: 바이패스 밸브 먼저 감소
        if (CHECK_GV == 'GV') & (CHECK_ELEC == 'GV') & ((dic['Control_V_bypass'] - V_CTR_BP)>=bp_lower):
            dic['Control_V_bypass'] = dic['Control_V_bypass'] - V_CTR_BP_MAX
        #그 외의 경우 가이드베인 감소
        else : 
            dic['Control_V_gv'] = dic['Control_V_gv'] - V_CTR_GV
            
        return dic['Control_V_gv'],dic['Control_V_bypass']

        
    #개도율 증가 로직 2 (가이드베인/바이패스 동시 제어)
    def plus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper) : 
        if (CHECK_GV == 'GV') & (CHECK_ELEC == 'GV') & ((dic['Control_V_gv'] + V_CTR_GV_MAX)<=gv_upper) :
            dic['Control_V_gv'] = dic['Control_V_gv'] + V_CTR_GV_MAX
        else :    
            dic['Control_V_gv'] = dic['Control_V_gv'] + V_CTR_GV
            if dic['C_POC_BYPASS'] >= 10 :
                dic['Control_V_bypass'] = dic['Control_V_bypass'] + V_CTR_BP
            else : 
                dic['Control_V_bypass'] = dic['Control_V_bypass'] + V_CTR_BP_MAX 
        return dic['Control_V_gv'],dic['Control_V_bypass']

        
    #개도율 감소 로직 2 (가이드베인/바이패스 동시 제어)
    def minus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower) : 
        if (CHECK_GV == 'GV') & (CHECK_ELEC == 'GV')  & ((dic['Control_V_bypass'] - V_CTR_BP_MAX)>=bp_lower) :
            dic['Control_V_gv'] = dic['Control_V_gv'] - V_CTR_GV
            dic['Control_V_bypass'] = dic['Control_V_bypass'] - V_CTR_BP_MAX
        else :    
            dic['Control_V_gv'] = dic['Control_V_gv'] - V_CTR_GV_MAX
        return dic['Control_V_gv'],dic['Control_V_bypass']
    
    #보정로직 로그 변수
    dic['VALVE_CRT'] = 0
    try : 

        # 보정로직) 10분안에 변경 이력이 있으면 예측값으로 변경하지 않고 현재값 사용
        if (dic['C_POC_GV'] == dic['C_POC_GV_10m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_10m']):
            pass
        else : 
            dic['Control_V_gv'] = dic['C_POC_GV']
            dic['Control_V_bypass'] = dic['C_POC_BYPASS']
            dic['VALVE_CRT'] = 91
            
        # 5분단위 제어 예측 결과 적용시, 개도율 제어 변환의 영향 최소화
        if (dic['C_POC_GV'] == dic['C_POC_GV_5m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_5m']) : 
            #보정로직) 유입유량이 많거나 착수정 수위가 높은 경우 개도율 감소  
            if (dic['C_FRIIN_REAL'] >= V_FRI_IN_UPPER_H) or (dic['Z_LEI1'] >= 4)  or (dic['Z_LEI2']>=4) : 
                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower)
                dic['VALVE_CRT'] = 1    

            #보정로직) 정수지 수위가 낮을 때 밸브 개도율 증가
            elif (dic['C_LEI1'] < V_LEI_LOWER) and (dic['C_LEI1_10m'] < V_LEI_LOWER):
                dic['VALVE_CRT'] = 2        
                if dic['C_FRIIN_REAL'] <= V_FRI_IN_UPPER :
                    if (dic['C_FRIIN_REAL']+dic['C_FRIOUT_H'] <= dic['C_FRIOUT_REAL']) and (dic['F_FRI_OUT_REAL'] <= dic['C_FRIOUT_REAL']):  
                        if (dic['C_FRIIN_REAL_5m']+dic['C_FRIOUT_H_5m'] <= dic['C_FRIOUT_REAL_5m']) and (dic['F_FRI_OUT_REAL_5m'] <= dic['C_FRIOUT_REAL_5m']):
                            if ((dic['C_FRIIN_REAL']+dic['C_FRIOUT_H']-dic['C_FRIOUT_REAL']) <= -1000) and ((dic['F_FRI_OUT_REAL']-dic['C_FRIOUT_REAL']) <= -1000) and (dic['C_FRIIN_REAL'] <= 11500)  :
                                dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                dic['VALVE_CRT'] = 21   
                            elif ((dic['C_FRIIN_REAL']+dic['C_FRIOUT_H']-dic['C_FRIOUT_REAL']) <= -1000) and ((dic['F_FRI_OUT_REAL']-dic['C_FRIOUT_REAL']) <= -1000) : 
                                if dic['C_FRIIN_REAL'] >= 12000 :
                                    dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                    dic['VALVE_CRT'] = 22
                                else :
                                    V_CTR_BP = V_CTR_BP_MAX
                                    dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                    dic['VALVE_CRT'] = 23
                            else :
                                dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                dic['VALVE_CRT'] = 24

                    #여과지 유출유량만 낮은 경우
                    elif (dic['F_FRI_OUT_REAL'] <= dic['C_FRIOUT_REAL']):
                        if (dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL'] <= -1000) and (dic['F_FRI_OUT_REAL_5m'] - dic['C_FRIOUT_REAL_5m'] <= -1000):
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                dic['VALVE_CRT'] = 25                        
                        if (dic['F_FRI_OUT_REAL_5m'] <= dic['C_FRIOUT_REAL_5m']):
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                dic['VALVE_CRT'] = 26

                                
                    #수위가 낮지만 유량이 많이 차이나는 경우 (10.25)
                    elif (dic['C_FRIIN_REAL']+dic['C_FRIOUT_H'] >= dic['C_FRIOUT_REAL']) and (dic['F_FRI_OUT_REAL'] >= dic['C_FRIOUT_REAL']):
                        if (dic['C_FRIIN_REAL_5m']+dic['C_FRIOUT_H_5m'] >= dic['C_FRIOUT_REAL_5m']) and (dic['F_FRI_OUT_REAL_5m'] >= dic['C_FRIOUT_REAL_5m']):
                            if (dic['C_FRIIN_REAL']+dic['C_FRIOUT_H']-dic['C_FRIOUT_REAL'] >= 2000) and (dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL'] >= 2000) and (dic['C_FRIIN_REAL'] >= 9000) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower)
                                dic['VALVE_CRT'] = 27

                            elif (dic['C_FRIIN_REAL']+dic['C_FRIOUT_H']-dic['C_FRIOUT_REAL'] >= 2000) and (dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL'] >= 2000) : 
                                V_CTR_BP = V_CTR_BP_MAX
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower) 
                                dic['VALVE_CRT'] = 28


                    #여과지 유출유량이 너무 높은 경우 (증가중이지만 너무 큰 폭으로 증가할 때)
                    elif (dic['F_FRI_OUT_REAL'] >= dic['C_FRIOUT_REAL']) :
                        if (dic['F_FRI_OUT_REAL_5m'] - dic['C_FRIOUT_REAL_5m'] >= 1000):
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower)
                                dic['VALVE_CRT'] = 29
                                    
                                    
            #보정로직) 정수지 수위가 높을 때 밸브 개도율 감소
            elif (dic['C_LEI1'] > V_LEI_UPPER) and (dic['C_LEI1_10m'] > V_LEI_UPPER):
                dic['VALVE_CRT'] = 3
                if dic['C_FRIIN_REAL'] >= V_FRI_IN_LOWER  : 
                    if (dic['C_FRIIN_REAL']+dic['C_FRIOUT_H'] >= dic['C_FRIOUT_REAL']) and (dic['F_FRI_OUT_REAL'] >= dic['C_FRIOUT_REAL']):
                        if (dic['C_FRIIN_REAL_5m']+dic['C_FRIOUT_H_5m'] >= dic['C_FRIOUT_REAL_5m']) and (dic['F_FRI_OUT_REAL_5m'] >= dic['C_FRIOUT_REAL_5m']):
                            if (dic['C_FRIIN_REAL']+dic['C_FRIOUT_H']-dic['C_FRIOUT_REAL'] >= 1000) and (dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL'] >= 1000) and (dic['C_FRIIN_REAL'] >= 9000) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower)
                                dic['VALVE_CRT'] = 31
                            # 유입유출 차 1000 이상 밸브 1회 제어 최대값 감소
                            elif (dic['C_FRIIN_REAL']+dic['C_FRIOUT_H']-dic['C_FRIOUT_REAL'] >= 1000) and (dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL'] >= 1000) : 
                                V_CTR_BP = V_CTR_BP_MAX
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower) 
                                dic['VALVE_CRT'] = 32
                            # 유입유출 차 1000 이하 밸브 1회 제어 최소 값 감소
                            else : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower) 
                                dic['VALVE_CRT'] = 33
                                
                    #여과지 유출유량만 높은 경우
                    elif (dic['F_FRI_OUT_REAL'] >= dic['C_FRIOUT_REAL']) :
                        
                        if (dic['F_FRI_OUT_REAL_5m'] - dic['C_FRIOUT_REAL_5m'] >= 1000) & (dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL'] >= 1000):
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower)
                                dic['VALVE_CRT'] = 34
                        
                        #5분전 조건 동일
                        if (dic['F_FRI_OUT_REAL_5m'] >= dic['C_FRIOUT_REAL_5m']):
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower)
                                dic['VALVE_CRT'] = 35

                    #여과지 유출유량이 너무 낮은 경우 (감소중이지만 너무 큰 폭으로 감소할 때)
                    elif (dic['F_FRI_OUT_REAL'] <= dic['C_FRIOUT_REAL']):
                        if (dic['F_FRI_OUT_REAL_5m'] - dic['C_FRIOUT_REAL_5m'] <= -1000):
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                dic['VALVE_CRT'] = 36
                                
                                
            #보정로직) 수위 관계 없이 유입 - 유출 차가 큰 경우
            elif ((dic['C_FRIIN_REAL'] +dic['C_FRIOUT_H'] - dic['C_FRIOUT_REAL']) <= -1000) or ((dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL'])<= -1000) : 
                dic['VALVE_CRT'] = 4
                if dic['C_FRIIN_REAL'] <= V_FRI_IN_UPPER :
                    if (dic['C_FRIIN_REAL']+dic['C_FRIOUT_H'] - dic['C_FRIOUT_REAL'] <= -1000)  and (dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL'] <= -1000) : 
                        if (dic['C_FRIIN_REAL_5m'] +dic['C_FRIOUT_H_5m']- dic['C_FRIOUT_REAL_5m'] <= -1000)  and (dic['F_FRI_OUT_REAL_5m'] - dic['C_FRIOUT_REAL_5m'] <= -1000)  and (dic['C_FRIIN_REAL'] <= 11500): 
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                if dic['C_FRIIN_REAL'] < 12000 :
                                    V_CTR_BP = V_CTR_BP_MAX
                                #개도율 증가
                                dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                dic['VALVE_CRT'] = 41
    
                    #여과지 유출유량만 낮은 경우
                    elif (dic['F_FRI_OUT_REAL'] <= dic['C_FRIOUT_REAL']):
                        if (dic['F_FRI_OUT_REAL_5m'] - dic['C_FRIOUT_REAL_5m'] <= -1000):
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = plus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,gv_upper)
                                dic['VALVE_CRT'] = 42

                            
            #보정로직) 수위 관계 없이 유입 - 유출 차가 큰 경우
            elif ((dic['C_FRIIN_REAL'] +dic['C_FRIOUT_H']- dic['C_FRIOUT_REAL']) >= 1000)  or ((dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL']) >= 1000) :
                if dic['C_FRIIN_REAL'] >= V_FRI_IN_LOWER  : 
                    if ((dic['C_FRIIN_REAL']+dic['C_FRIOUT_H'] - dic['C_FRIOUT_REAL']) >= 1000)  and ((dic['F_FRI_OUT_REAL'] - dic['C_FRIOUT_REAL']) >= 1000) :
                        if (dic['C_FRIIN_REAL_5m'] +dic['C_FRIOUT_H_5m']- dic['C_FRIOUT_REAL_5m'] >= 1000) and (dic['F_FRI_OUT_REAL_5m'] - dic['C_FRIOUT_REAL_5m'] >= 1000) and (dic['C_FRIIN_REAL'] >= 9000): 
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                V_CTR_BP = V_CTR_BP_MAX
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic_2(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower)
                                dic['VALVE_CRT'] = 43
    
                    #여과지 유출유량만 높은 경우
                    elif (dic['F_FRI_OUT_REAL'] >= dic['C_FRIOUT_REAL']) :
                        if (dic['F_FRI_OUT_REAL_5m'] - dic['C_FRIOUT_REAL_5m'] >= 1000):
                            if (dic['C_POC_GV'] == dic['C_POC_GV_20m']) and (dic['C_POC_BYPASS'] == dic['C_POC_BYPASS_20m']) : 
                                dic['Control_V_gv'],dic['Control_V_bypass'] = minus_valve_logic(dic,CHECK_GV,CHECK_ELEC,V_CTR_GV,V_CTR_BP,V_CTR_GV_MAX,V_CTR_BP_MAX,bp_lower)
                                dic['VALVE_CRT'] = 44

                    
            #최근 예측값이 10분동안 차이가 없으나 보정로직을 적용하지는 않은 경우
            else : 
                dic['VALVE_CRT'] = 9

    except : 
        print('error')
        dic['VALVE_CRT'] = 99
        runLogger.error('Error: {}'.format(traceback.format_exc()))
        db.save_alm(tb_nm_alm, "'"+str(131002)+"'", "'"+time.strftime('%Y-%m-%d %H:%M:%S')+"'")


    #제어 보정 값 상하한 넘지 않고 최대값 적용되도록함
    if dic['Control_V_gv']>=gv_upper : 
        dic['Control_V_gv'] = gv_upper 
    elif dic['Control_V_gv']<=gv_lower :
        dic['Control_V_gv'] = gv_lower
    
    if dic['Control_V_bypass']>=bp_upper : 
        dic['Control_V_bypass'] = bp_upper 
    elif dic['Control_V_bypass']<=bp_lower :
        dic['Control_V_bypass'] = bp_lower
    
                
    # 08.25 꼬여있는 변수 통일 (들여쓰기 한칸만)
    dic['Prediction_V_gv'] = dic['Control_V_gv']
    dic['Prediction_V_bypass'] = dic['Control_V_bypass']
        
    # (개도율 알람) 모델 실행 중 제어 값 변경되지 않은 경우
    if dic['pre_ctr_chng_flag'] == 0 : 
        if dic['pre_ctr_cancel_flag'] == 0 :
            
            if dic['OperationMode'] == 1:
                if (abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) >= V_THRE_GV
                   ) or (abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) >= V_THRE_BYPASS):
                    db.save_alm(tb_nm_alm, "'" + str(131006) + "'", "'" + dic['now'] + "'")
                #임계치보다 작고, 개도 변화 최소값 이상일 때 2번 타입 알람 발생
                elif (
                    (abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) < V_THRE_GV
                     ) & (abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) >= V_TOL_GV)
                     ) or ((abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) < V_THRE_BYPASS
                     ) & (abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) >= V_TOL_BYPASS)):
                    db.save_alm(tb_nm_alm, "'" + str(131001) + "'", "'" + dic['now'] + "'")
                else:
                    pass
        
            #자동모드 (dic['OperationMode'] == 2)
            if dic['OperationMode'] == 2:
                if (abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) >= V_THRE_GV
                   ) or (abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) >= V_THRE_BYPASS):
                    db.save_alm(tb_nm_alm, "'" + str(131006) + "'", "'" + dic['now'] + "'")
                #임계치보다 작고, 개도 변화 최소값 이상일 때 3번 타입 알람 발생
                elif (
                    (abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) < V_THRE_GV
                     ) & (abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) >= V_TOL_GV)
                     ) or ((abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) < V_THRE_BYPASS
                     ) & (abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) >= V_TOL_BYPASS)):
                    db.save_alm(tb_nm_alm, "'" + str(131005) + "'", "'" + dic['now'] + "'")
                else:
                    pass

    #정수지 수위 알람
    V_LEI_MIN = dic['P_LEI_MIN']
    V_LEI_MAX = dic['P_LEI_MAX']
    
    pre_alm_flag = pre_alm_check(db, tb_nm_alm, 131004)
    
    if dic['OperationMode'] != 0:
        if (dic['C_LEI1'] < V_LEI_MIN) or (dic['C_LEI2'] < V_LEI_MIN) or (dic['C_LEI3'] < V_LEI_MIN
           ) or (dic['C_LEI1'] > V_LEI_MAX) or (dic['C_LEI2'] > V_LEI_MAX) or (dic['C_LEI3'] > V_LEI_MAX):
            if pre_alm_flag == 0 : 
                dic['now'] = time.strftime('%Y-%m-%d %H:%M:%S')
                db.save_alm(tb_nm_alm, "'" + str(131004) + "'", "'" + dic['now'] + "'")
        else:
            pass


def upload_control(dic,db,df):
    '''
    CTR 테이블 업데이트
    Parameter -
        dic: Dictionary(현재값 및 예측값 포함)
        db: DB연결 정보
    Return - 없음(CTR 테이블 데이터 저장)
    '''

    upd_ti = dic['now']
    rnti = dic['now']
    tag_sn_gv = '702-600-359-GE2-4102'
    tag_sn_bypass = '702-600-359-GE2-4103'

    V_TOL_GV = dic['P_VALVE_GV_MIN']          # 가이드베인 개도 변화 최소값
    V_TOL_BYPASS = dic['P_VALVE_BYPASS_MIN']  # 바이패스 밸브 개도 변화 최소값

    
    #제어이력 상세보기 주요인자
    factor_b_in_fr = round(float(dic['C_FRIIN']),0)
    factor_b_in_pr = round(float(dic['C_PRI']),2)
    
    factor_h_location_le1 = round(float(dic['C_LEI1']),2)
    factor_h_location_le2 = round(float(dic['C_LEI2']),2)
    factor_h_location_le3 = round(float(dic['C_LEI3']),2)
    
    factor_h_out_fr = round(float(dic['C_FRIOUT']),0)
    factor_b1_gv_vv_po =  round(float(dic['C_POC_GV']),0)
    factor_b1_vv_po =  round(float(dic['C_POC_GV']),0)
    
    values_factor = pd.DataFrame(
        [(
             factor_b_in_fr,
             factor_b_in_pr,
             factor_h_location_le1,
             factor_h_location_le2,
             factor_h_location_le3,
             factor_h_out_fr,
             factor_b1_gv_vv_po,
             factor_b1_vv_po
        )],
        columns = [
             'b_in_fr',
             'b_in_pr',
             'h_location_le1',
             'h_location_le2',
             'h_location_le3',
             'h_out_fr',
             'b1_gv_vv_po',
             'b1_vv_po'
        ])

    values_factor_json = values_factor.to_json(orient='records')

    #모델 실행 중 제어 값 변경되지 않은 경우
    if dic['pre_ctr_chng_flag'] == 0 : 
    #최근 30분간 제어 취소가 되지 않은 경우
        if dic['pre_ctr_cancel_flag'] == 0 : 
            if dic['OperationMode'] != 0:
                if abs(dic['C_POC_GV'] - dic['Prediction_V_gv']) >= V_TOL_GV:
                    db.save_ctr(tb_nm_ctr,
                                f'"{upd_ti}"',
                                f'"{rnti}"',
                                f'"{tag_sn_gv}"',
                                int(dic['Control_V_gv']),
                                int(dic['C_POC_GV']),
                                0,
                                0
                                )
                    
                if abs(dic['C_POC_BYPASS'] - dic['Prediction_V_bypass']) >= V_TOL_BYPASS:
                    db.save_ctr(tb_nm_ctr,
                                f'"{upd_ti}"',
                                f'"{rnti}"',
                                f'"{tag_sn_bypass}"',
                                int(dic['Control_V_bypass']),
                                int(dic['C_POC_BYPASS']),
                                0,
                                0
                                )
                    
                #주요인자 전송
                df_factor = pd.DataFrame(['B', 'NONE', rnti, values_factor_json],
                                         index = ['proc_cd', 'disinfection_index', 'rnti', 'factor']).transpose()
                
                db.save_ai_factor(df_factor)


def upload_result_data(dic, db, df_friin, df_friin_1day):
    '''
    예측 결과 업로드 함수
    Parameter -
        dic: Dictionary(전처리 데이터 및 모델 input 포함)
        db: DB연결 정보
        df_friin: 최근 7일 원수 유입유량 데이터(dataframe)
        df_friin_1day: 과거 24시간 원수 유입유량 데이터(dataframe)
    Return - 없음
    '''
    #원수 유입유량
    b_in_fr = round(float(dic['C_FRIIN_REAL']),2)

    #원수 유입압력
    b_in_pr = round(float(dic['C_PRI']),1)

    #현재 밸브 개도율을 json 형식으로 변환
    a = OrderedDict()
    a['guidevane'] = float(dic['C_POC_GV'])
    a['bypass'] = float(dic['C_POC_BYPASS'])
    c = {"b_vv_po": a}
    b_vv_po = json.dumps(c, ensure_ascii=False)

    #현재 정수지 수위를 json 형식으로 변환
    a = OrderedDict()
    a['location1'] = round(float(dic['C_LEI1']),2)
    a['location2'] = round(float(dic['C_LEI2']),2)
    a['location3'] = round(float(dic['C_LEI3']),2)
    c = {"h_le": a}
    h_le = json.dumps(c, ensure_ascii=False)

    #여과지 유출유량
    f_out_fr = round(float(dic['F_FRI_OUT_REAL']),2)
    
    #정수 유출유량
    h_out_fr = round(float(dic['C_FRIOUT_REAL']),2)
    #전력량
    b_gv_elec = round(float(dic['C_ELEC']),2)
    #보정로직 로그
    v_crt_log = int(dic['VALVE_CRT'])
    
    #밸브개도율 예측값을 json 형식으로 변환
    a = OrderedDict()
    a['guidevane'] = float(dic['Control_V_gv'])
    a['bypass'] = float(dic['Control_V_bypass'])
    c = {"ai_b_vv_po": a}
    ai_b_vv_po = json.dumps(c, ensure_ascii=False)

    #필요 원수 유입유량 데이터
    ai_b_in = float(dic['AI_B_IN_FRI'])
    ai_b_in_trend = dic['AI_B_IN_FRI_TREND']
    ai_b_in_trend = pd.DataFrame(ai_b_in_trend)
    ai_b_in_trend.columns = ['ai_b_in_fr_trend']
    ai_b_in_trend.index = ai_b_in_trend.index.astype(str)
    ai_b_in_trend = ai_b_in_trend.to_json(orient='columns')

    #정수 유출유량 트렌드 데이터(4시간)를 json 형식으로 변환
    ai_b_out_trend = dic['AI_B_OUT_FRI_TREND']
    ai_b_out_trend = pd.DataFrame(ai_b_out_trend)
    ai_b_out_trend.columns = ['ai_b_out_fr_trend']
    ai_b_out_trend.index = ai_b_out_trend.index.astype(str)
    ai_b_out_trend = ai_b_out_trend.to_json(orient='columns')

# ===============================================================
# ============ VVV 예측 유출유량 보정식 내용(260223) VVV ============
# ===============================================================
    """
    작성 시각 :260223
    작성자 : 온더시스 강동현 사원
    내용 : 보정(260213 패치) 직전 RAW 값 백업 코드 적용 및 AI_RT의 OUT_VAL에 추가
    """

    ### 262023
    #정수 유출유량 트렌드 데이터_보정전(4시간)를 json 형식으로 변환
    ai_b_out_trend_raw = dic['AI_B_OUT_FRI_TREND_RAW']
    ai_b_out_trend_raw = pd.DataFrame(ai_b_out_trend_raw)
    ai_b_out_trend_raw.columns = ['ai_b_out_fr_trend']
    ai_b_out_trend_raw.index = ai_b_out_trend_raw.index.astype(str)
    ai_b_out_trend_raw = ai_b_out_trend_raw.to_json(orient='columns')
    ### 262023


    # 정수지수위밴드
    lei_b_band_trend = dic['lei_roll']

    #정수지 목표 수위
    lei_target_min = dic['P_LEI_MIN']
    lei_target_max = dic['P_LEI_MAX']
    
    # 실제 보정로직이 반영되는 목표 수위 구간 
    lei_target_min_real = dic['V_LEI_LOWER']
    lei_target_max_real = dic['V_LEI_UPPER']
    
    in_val = pd.DataFrame(
        [(
            b_in_fr,
            b_in_pr,
            b_vv_po,
            h_le,
            f_out_fr,
            h_out_fr,
            v_crt_log,
            b_gv_elec,
            dic['pre_ctr_chng_flag'],
            dic['pre_ctr_cancel_flag'],
            lei_target_min,
            lei_target_max,
            lei_target_min_real,
            lei_target_max_real
        )],
        columns=[
            'B_FRI',
            'B_PRI',
            'B_POI',
            'B_LEI',
            'F_OUT_FRI',
            'B_OUT_FRI',
            'V_CRT_LOG',
            'B_GV_ELEC',
            'CTR_CHNG_FLAG',
            'CTR_CANCLE_FLAG',
            'LEI_TARGET_MIN',
            'LEI_TARGET_MAX',
            'LEI_TARGET_MIN_REAL',
            'LEI_TARGET_MAX_REAL'])


    out_val = pd.DataFrame(
        [(
            ai_b_vv_po,
            ai_b_in,
            ai_b_in_trend,
            ai_b_out_trend
            
            ### 262023
            ,ai_b_out_trend_raw
            ### 262023
    
        )],
        columns=[
            'AI_B_POI',
            'AI_B_IN_FRI',
            'AI_B_IN_FRI_TREND',
            'AI_B_OUT_FRI_TREND'
            
            ### 262023
            ,'AI_B_OUT_FRI_TREND_RAW'
            ### 262023

            ])

    in_val['B_POI'] = in_val['B_POI'].apply(lambda x: eval(x))
    in_val['B_LEI'] = in_val['B_LEI'].apply(lambda x: eval(x))
    out_val['AI_B_POI'] = out_val['AI_B_POI'].apply(lambda x: eval(x))
    out_val['AI_B_IN_FRI_TREND'] = out_val['AI_B_IN_FRI_TREND'].apply(lambda x: eval(x))
    out_val['AI_B_OUT_FRI_TREND'] = out_val['AI_B_OUT_FRI_TREND'].apply(lambda x: eval(x))

    ### 262023
    out_val['AI_B_OUT_FRI_TREND_RAW'] = out_val['AI_B_OUT_FRI_TREND_RAW'].apply(lambda x: eval(x))
    ### 262023

    in_val_json = in_val.to_json(orient='records')
    out_val_json = out_val.to_json(orient='records')
    in_val_json = str(in_val_json).replace("\\", "")
    out_val_json = str(out_val_json).replace("\\", "")

    df_mixing_ai_result = pd.DataFrame([(dic['now'], dic['OperationMode'], in_val_json, out_val_json)],
                                       columns=['upd_ti', 'AI_OPR', 'IN_VAL', 'OUT_VAL'])
    db.save_ai_rt(tb_nm_ai, df_mixing_ai_result)
    print("Upload Result Data  Uplode to Database--- OK")