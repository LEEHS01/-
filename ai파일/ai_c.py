##########
# 약품 모듈 파일
# author : Lee Hyeokhui
# since : 2024. 10. 07
# version : 0.1
##########

############################### 경로 설정 및 package load ###############################
# 공통 부분
import sys
import os

# 경로 설정
if '__file__' in globals() and os.path.isfile(os.path.abspath(__file__)):
    PROC_PATH = os.path.dirname(os.path.abspath(__file__))
else:
    PROC_PATH = os.path.dirname(os.path.abspath('_'))

PROC_NAME = os.path.basename(PROC_PATH)

BASE_PATH = os.path.dirname(PROC_PATH)
ROOT_PATH = os.path.dirname(BASE_PATH)
sys.path.append(BASE_PATH + '/common')
sys.path.append(ROOT_PATH + '/common')

MODEL_PATH = '/'.join([PROC_PATH, 'model/']) # 모델 경로
LOGS_PATH = BASE_PATH + '/logs/'             # 로그 경로

# 공통 util 관련 라이브러리
from db_util import DBUtil
from config import Config
from analysis import *
import json
import pickle
from multiprocessing import Process,Manager
import time
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings("ignore")

# Log 관련 라이브러리
import traceback
import logging
from logging import handlers

# 전처리 관련 라이브러리 
from scipy.signal import savgol_filter
from functools import reduce
from scipy import stats

# model 관련 라이브러리
import tensorflow as tf
from tensorflow import keras
import keras.backend as K

# 전송 로거 생성
from aos_util import *
build_logger(ROOT_PATH, BASE_PATH, PROC_NAME)

############################### 로그 처리 ###############################
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

############################### 전처리 함수 ###############################
def upper_lower_bounds(col, upper, lower, dataframe) :
    """
    태그 데이터의 정상 계측 범위 상/하한 값 적용 함수

    Args:
        col (str): 정상 계측 범위를 적용할 컬럼명
        upper (float): 계측 범위 상한값
        lower (float): 계측 범위 하한값
        dataframe (DataFrame): 해당 함수를 적용할 DataFrame
        
    Returns:
        pd.DataFrame: 정상 계측 범위 적용 결과 DataFrame
    """
    if len(dataframe[col].unique()) == 1: 
        pass
        
    else: 
        idx = dataframe[(dataframe[col] >= upper) | (dataframe[col] <= lower)].index
        dataframe.loc[dataframe.index.isin(idx), col] = np.nan
        try: 
            dataframe[col].fillna(method = 'ffill', axis = 0, inplace = True)
            dataframe[col].fillna(method = 'bfill', axis = 0, inplace = True)
        except :
            dataframe[col].fillna(dataframe[col].mean(), axis=0, inplace=True)
    return dataframe

def series_to_supervised_simu(dataframe, n_in = 1, dropnan = True):
    """
    시계열 데이터를 모델 입력 데이터 세트로 변환하는 함수
    
    Args:
        dataframe (DataFrame): 모델 입력 데이터로 변환 할 DataFrame
        n_in (int): 예측하려는 시간 갯수
        dropnan (bool): NA 데이터 drop 여부
        
    Returns:
        pd.DataFrame: 모델 입력 DataFrame
    """
    cols, names = list(), list()
    
    for idx, dt in enumerate(dataframe.index):
        df_shift_input = dataframe.loc[[dt]]
        df_shift_input.columns += '(t-' + str(n_in - idx) + ')'
        df_shift_input.reset_index(drop = True, inplace = True)
        cols.append(df_shift_input)
        names += df_shift_input.columns.tolist()

    agg = pd.concat(cols, axis = 1)
    agg.columns = names

    if dropnan:
        agg.dropna(inplace = True)
    
    return agg

def set_use(df):
    """
    작동중인 투입기의 응집제 주입률 설정값을 불러오는 함수
    
    Args:
        dataframe (DataFrame): 투입기별 RUN, SET 데이터가 포함된 DataFrame
        
    Returns:
        작동중인 투입기의 응집제 주입률 설정값
    """
    # 투입기 #1만 사용
    if (df['run1'] == 1) & (df['run2'] == 0) & (df['run3'] == 0):
        return round(df['set1'])
    # 투입기 #2만 사용
    elif (df['run1'] == 0) & (df['run2'] == 1) & (df['run3'] == 0):
        return round(df['set2'])
    # 투입기 #3만 사용
    elif (df['run1'] == 0) & (df['run2'] == 0) & (df['run3'] == 1):
        return round(df['set3'])
    # 투입기 #1, 2 동시 사용 (현재 주입률 값 사용)
    elif (df['run1'] == 1) & (df['run2'] == 1) & (df['run3'] == 0):
        return round(df['cfi1'] + df['cfi2'])
    # 투입기 #2, 3 동시 사용
    elif (df['run1'] == 0) & (df['run2'] == 1) & (df['run3'] == 1):
        return round(df['set2'] + df['set3'])
    # 이외의 경우 na 처리 (학습데이터 확인 결과 이외의 경우 케이스 수가 매우 적음)
    else:
        return np.nan

def get_init(db):
    """
    init table에서 값을 불러오는 함수 
    
    Args:
        db: DB Class
    Returns:
        ai_opr: 운영모드값
        co_max: 응집제 주입률 상한값
        co_min: 응집제 주입률 하한값
        co_tbi_e: 목표 침전지 탁도 설정값
    """
    sql = """
    SELECT * FROM TB_AI_C_INIT
    """
    df_init = db.read(sql)

    ai_opr = df_init[df_init['ITM'] == 'c_operation_mode']['INIT_VAL'].values[0]
    co_max = df_init[df_init['ITM'] == 'c_cf_max']['INIT_VAL'].values[0]
    co_min = df_init[df_init['ITM'] == 'c_cf_min']['INIT_VAL'].values[0]
    co_user = df_init[df_init['ITM'] == 'c_user_correct']['INIT_VAL'].values[0]
    co_tbi_e = df_init[df_init['ITM'] == 'c_user_tb_e']['INIT_VAL'].values[0]
    
    return ai_opr, co_max, co_min, co_user, co_tbi_e

def get_ctype(db):  #약품 종류 태그 미사용
    """
    현재 사용중인 약품 종류를 불러오는 함수 
    
    Args:
        db: DB Class
    Returns:
        ai_opr: 운영모드값
        co_max: 응집제 주입률 상한값
        co_min: 응집제 주입률 하한값
    """
    sql = """
    SELECT * FROM TB_USR_MNG
    """
    df_init = db.read(sql)

    c_type = df_init[df_init['ITM'] == 'c_cf_coagulant']['INIT_VAL'].values[0]

    return c_type

# def get_ctype(x):  #약품 종류 태그 사용
#     """
#     현재 사용중인 약품 종류를 불러오는 함수 
    
#     Args:
#         x: 응집제 종류 상태 데이터 (응집제 탱크 번호+응집제 종류)
#     Returns:
#         응집제 종류
#     """
#     try:
#         c_type_number =  int(x) % 10
#         if c_type_number == 1:
#             c_type = 'PACS'
#         else:
#             c_type = 'etc'
#     except:
#         c_type = np.nan

#     return c_type

def ctr_set(db, run_time, control_tag, ai_pred_y_set, last_set):
    """
    제어 테이블 적재 함수
    
    Args:
        db: DB Class
        run_time(datetime): 현재 시간
        control_tag(str): 제어할 태그명
        ai_pred_y_set(float): 응집제 주입률 예측값
        last_set(float): 응집제 주입률 기존값
    """
    tag_sn = f'"{control_tag}"'
    
    db.save_ctr('TB_AI_C_CTR', run_time, run_time, tag_sn, ai_pred_y_set, last_set, 0, 0)

############################### 모듈 실행시 필요한 인자 선언 ###############################
# DB에서 불러올 태그 리스트
tags = (
    '600-359-TEI-1101', # 보령(정) 착수정 온도
    '600-359-PHI-1000', # 보령(정) 원수 PH
    '600-359-TBI-1000', # 보령(정) 원수 탁도
    '600-359-CUI-1000', # 보령(정) 원수 전기전도도
    '600-359-ALI-1000', # 보령(정) 원수 알카리도
    '600-359-TBI-2000', # 보령(정) 침전수 탁도
    '600-359-CFI-2104', # 보령(정) 응집제 1호기 주입률
    '600-359-CFI-2103', # 보령(정) 응집제 2호기 주입률
    '600-359-CFI-2110', # 보령(정) 응집제 3호기 주입률
    # '600-359-CFB-2705', # 보령(정) 응집제투입기 #1 ON
    # '600-359-CFB-2605', # 보령(정) 응집제투입기 #2 ON
    # '600-359-CFB-2503', # 보령(정) 응집제투입기 #3 ON
    '600-359-XXI-1002', # 보령(정) 응집제투입기 #1 목표주입률 적용
    '600-359-XXI-1003', # 보령(정) 응집제투입기 #2 목표주입률 적용
    '600-359-XXI-1005', # 보령(정) 응집제투입기 #3 목표주입률 적용
    # '600-359-CFI-3124', # 보령(정) 옥외탱크 응집제 선택 상태 (약품 종류 태그 사용)
)

# 태그 리스트 이름 dictionary
col_names = {
    '600-359-TBI-1000': '원수 탁도',
    '600-359-PHI-1000': '원수 pH',
    '600-359-TEI-1101': '원수 수온',
    '600-359-CUI-1000': '원수 전기전도도',
    '600-359-ALI-1000': '원수 알칼리도',
    '600-359-TBI-2000': '침전수 탁도',
    '600-359-CFI-2104': 'cfi1', 
    '600-359-CFI-2103': 'cfi2', 
    '600-359-CFI-2110': 'cfi3', 
    '600-359-XXI-1002': 'set1',
    '600-359-XXI-1003': 'set2',
    '600-359-XXI-1005': 'set3',
    # '600-359-CFI-3124': '응집제 상태' #약품 종류 태그 사용
}

# RUN 태그 리스트 
run_columns = [
    'run1',
    'run2',
    'run3'
]

# set 태그 리스트
set_columns = [
    'set1',
    'set2',
    'set3'
]

# 태그별 정상 계측 범위 상/하한값
bounds_tbi = {'min': 0, 'max': 150}
bounds_phi = {'min': 5.8, 'max': 8.5}
bounds_tei = {'min': 0, 'max': 30}
bounds_cui = {'min': 30, 'max': 350} 
bounds_ali = {'min': 3, 'max': 100}
bounds_tbi_p = {'min': 0.05, 'max': 3}

# 데이터 스무딩 파라미터
savgol_win = 120
savgol_poly = 3

smooth_columns = [
    '원수 pH', 
    '원수 수온', 
    '원수 전기전도도', 
    '원수 알칼리도'
]

# 주입률 예측에 사용할 데이터 리스트
pred_c_columns = [
    '원수 탁도',
    '원수 pH',
    '원수 수온',
    '침전수 탁도',
]

# scaler 설정
minmax_dic = {
    '원수 탁도_min': 0.4325,
    '원수 탁도_max': 149.82,
    '원수 pH_min': 6.1335012899926555,
    '원수 pH_max': 8.105509114029417,
    '원수 수온_min': 1.7952777681298406,
    '원수 수온_max': 24.857491720787788,
    '침전수 탁도_min': 0.1653125,
    '침전수 탁도_max': 2.904375
}

# dataset 형태 설정
input_hours = 6 # 5분단위 6개 -> 30분 seq
n_features = 6

# load model
co_model = keras.models.load_model(MODEL_PATH + 'BR_C_model')

# json 형태로 저장하기 위한 key list(입력변수)
dict_key = [
    'C_TB', 
    'C_CU', 
    'C_AL', 
    'C_PH', 
    'C_TE',   
    'C_TB_E', 
    'C_CF_1',
    'C_CF_2',
    'C_CF_3'
]

# 목표 침전수 탁도값 설정 - 임시 코드 
warning_tbi_p_value = 1.0

# 침전지 탁도 보정 기준값 설정
tb_e_rep = 0.7
tb_e_value = 0.0

# 보정값 설정 기준값 설정
tb_rep_1 = 10
tb_rep_2 = 10
correction_value = 1.0

# 직전값 대비 임계치 기준값 설정
ex_value = 5.0

# 주입률 제어 기준값 설정
ctr_value = 2.0

############################### 예측 실행 ###############################
@log_perform
def perform(db, job_datetime=None):
    """
    응집제 주입률 예측 실행
    """
    print('---------------- 공정 실행 ----------------') 

    if job_datetime is None:
        c_rt_df = db.read_rt_subday_max('TB_C_RT', tags)
    else:
        c_rt_df = db.read_rt_subday_etime('TB_C_RT', tags, job_datetime)
    if len(c_rt_df) <= 0:
        return

    current_dt_date = c_rt_df.index[-1]
    ai_opr, co_max, co_min, co_user, co_tbi_e = get_init(db) # INIT 가져오기
    c_type = get_ctype(db) # 현재 약품 종류 가져오기

    ### 데이터 전처리 진행 ###
    # 컬럼명 변경
    c_rt_df.rename(columns = col_names, inplace = True)

    # 중복 index 제거
    df_filtered = drop_duplicate_rows(c_rt_df)

    # 결측치 제거
    result = check_drop_missing(df_filtered)
    df_filtered = df_filtered.drop(index = result[result == True].index)

    # 시간 index 설정
    time_df = pd.DataFrame(index = pd.date_range(start = current_dt_date - timedelta(days = 7), end = current_dt_date, freq = '1min'))
    df_filtered = df_filtered.merge(time_df, how = 'right', left_index = True, right_index = True)
    df_filtered = df_filtered.fillna(method = 'ffill')
    df_filtered = df_filtered.fillna(method = 'bfill')

    ### 응집제 주입률 설정값 컬럼 생성 ###
    # run 태그 생성 (현재 주입률 기준으로 생성)
    df_filtered['run1'] = df_filtered['cfi1'].apply(lambda x: 1 if x >= 2 else 0)
    df_filtered['run2'] = df_filtered['cfi2'].apply(lambda x: 1 if x >= 2 else 0)
    df_filtered['run3'] = df_filtered['cfi3'].apply(lambda x: 1 if x >= 2 else 0)
    
    # 응집제 주입률 설정값 컬럼 생성
    df_filtered['응집제주입률설정'] = df_filtered.apply(lambda x: set_use(x), axis = 1)

    idx = df_filtered[df_filtered['응집제주입률설정'].isna()].index.tolist()
    df_filtered.loc[idx, 'run1'] = np.nan
    df_filtered.loc[idx, 'run2'] = np.nan
    df_filtered.loc[idx, 'run3'] = np.nan

    # 응집제 주입률 현재값 컬럼 제거
    df_filtered = df_filtered.drop(['cfi1', 'cfi2', 'cfi3'], axis = 1)
    
    # 응집제 주입률 설정값 수정 (5 미만, 80 이상인 경우 직전 또는 직후값 대체)
    df_filtered['응집제주입률설정'] = df_filtered['응집제주입률설정'].apply(lambda x: x if (x >= 5) & (x < 80) else None)

    for col in ['응집제주입률설정', 'run1', 'run2', 'run3']:
        df_filtered[col] = df_filtered[col].fillna(method = 'ffill')
        df_filtered[col] = df_filtered[col].fillna(method = 'bfill')
    
    # 태그 데이터 정상 계측 범위 상/하한 값 적용
    df_filtered = upper_lower_bounds(col = '원수 탁도', upper = bounds_tbi['max'], lower = bounds_tbi['min'], dataframe = df_filtered)
    df_filtered = upper_lower_bounds(col = '원수 pH', upper = bounds_phi['max'], lower = bounds_phi['min'], dataframe = df_filtered)
    df_filtered = upper_lower_bounds(col = '원수 수온', upper = bounds_tei['max'], lower = bounds_tei['min'], dataframe = df_filtered)
    df_filtered = upper_lower_bounds(col = '원수 전기전도도', upper = bounds_cui['max'], lower = bounds_cui['min'], dataframe = df_filtered) 
    df_filtered = upper_lower_bounds(col = '원수 알칼리도', upper = bounds_ali['max'], lower = bounds_ali['min'], dataframe = df_filtered)   
    df_filtered = upper_lower_bounds(col = '침전수 탁도', upper = bounds_tbi_p['max'], lower = bounds_tbi_p['min'], dataframe = df_filtered) 

    # RUN 태그 분리
    run_df = df_filtered[run_columns]
    df_filtered = df_filtered.drop(run_columns, axis = 1)

    # set 태그 분리
    set_df = df_filtered[set_columns]
    df_filtered = df_filtered.drop(set_columns, axis = 1)

    # RUN df와 set df 합치기
    set_df = pd.merge(run_df, set_df, how = 'inner', left_index = True, right_index = True)

    set_df['inval_set1'] = set_df.apply(lambda x: x['set1'] if x['run1'] == 1 else 0, axis = 1)
    set_df['inval_set2'] = set_df.apply(lambda x: x['set2'] if x['run2'] == 1 else 0, axis = 1)
    set_df['inval_set3'] = set_df.apply(lambda x: x['set3'] if x['run3'] == 1 else 0, axis = 1)

    set_df['use_sum'] = set_df['run1'] + set_df['run2'] + set_df['run3']

    # savgol_filter
    for col in smooth_columns:
        # 데이터 스무딩
        tmp_smooth = savgol_filter(df_filtered[col], savgol_win, savgol_poly)
        df_filtered[col] = tmp_smooth
        # 마이너스값 직전/직후값 대체
        if df_filtered[col].min() <= 0:
            df_filtered[col] = df_filtered[col].apply(lambda x: x if x > 0 else None)
            df_filtered[col] = df_filtered[col].fillna(method='ffill')
            df_filtered[col] = df_filtered[col].fillna(method='bfill')

    # 5분 단위 resample
    modeling_df_5min = df_filtered[pred_c_columns].resample('5min', origin = 'end').mean()
    
    # 약품 종류 컬럼 추가 (약품 종류 태그 미사용)
    if 'PACS' in c_type:
        modeling_df_5min['apac'] = 0
        modeling_df_5min['pacs'] = 1
    else:
        modeling_df_5min['apac'] = 1
        modeling_df_5min['pacs'] = 0

    # 약품 종류 컬럼 추가 (약품 종류 태그 사용)
    # modeling_df_5min = modeling_df_5min.merge(df_filtered[['응집제 상태']], how = 'left', left_index = True, right_index = True)
    # modeling_df_5min['응집제 상태'] = modeling_df_5min['응집제 상태'].apply(lambda x: get_ctype(x))

    # modeling_df_5min['응집제 상태'] = modeling_df_5min['응집제 상태'].fillna(method = 'ffill')
    # modeling_df_5min['응집제 상태'] = modeling_df_5min['응집제 상태'].fillna(method = 'bfill')

    # modeling_df_5min['pacs'] = modeling_df_5min['응집제 상태'].apply(lambda x: 1 if x == 'PACS' else 0)
    # modeling_df_5min['apac'] = modeling_df_5min['응집제 상태'].apply(lambda x: 1 if x != 'PACS' else 0)
    
    # modeling_df_5min = modeling_df_5min.drop('응집제 상태', axis = 1)

    # 가장 최근 6개(5분 단위, 총 30분) 데이터 사용
    use_modeling_df_5min = modeling_df_5min.tail(input_hours)

    use_modeling_df_5min = use_modeling_df_5min.fillna(method = 'ffill')
    use_modeling_df_5min = use_modeling_df_5min.fillna(method = 'bfill')

    ### 모델 예측 
    # 데이터셋 변환
    simu_model_df = series_to_supervised_simu(use_modeling_df_5min, input_hours)

    # scaling
    for col in simu_model_df.columns.tolist():
        string = col.split('(')[0]
        if string in ['apac', 'pacs']:
            continue
        simu_model_df[col] = (simu_model_df[col] - minmax_dic[f'{string}_min']) / (minmax_dic[f'{string}_max'] - minmax_dic[f'{string}_min'])

    # input shape 변경
    scale_simu = np.array(simu_model_df)
    scale_simu = scale_simu.reshape((scale_simu.shape[0], 1, input_hours * n_features))

    # model predict
    ai_pred_y = co_model.predict(scale_simu).item()

    if ai_pred_y is np.nan:
        ai_pred_y = float(df_filtered.loc[df_filtered.index[-1],'응집제주입률설정'])

    # 결과값 정수처리
    ai_pred_y_set = round(ai_pred_y)
   
    # 기본 보정  
    ai_pred_y_set = ai_pred_y_set + correction_value 

    # 고탁도의 경우 추가 보정
    c_tb = df_filtered.tail(5)['원수 탁도'].median()
    
    if correction_value < 0:
        if (c_tb >= tb_rep_1) & (c_tb < tb_rep_2):
            ai_pred_y_set = ai_pred_y_set - round(correction_value/2)
        elif c_tb >= tb_rep_2:
            ai_pred_y_set = ai_pred_y_set - correction_value

    # 침전지 탁도 보정
    if df_filtered.tail(5)['침전수 탁도'].median() > tb_e_rep:
        ai_pred_y_set = ai_pred_y_set + tb_e_value

    # 현재 주입률 가져오기
    last_set = round(df_filtered.loc[df_filtered.index[-1],'응집제주입률설정'])
   
    #20260223 이현수 
    #사용자 보정값 적용 과 임계치 이상 보정의 순서가 이상함
    #사용자 보정값 적용의 변수 선언을  아래에서 선언하는데 위에서쓰니까 오류가뜸
    #테스트를 위해 사용자 보정값 적용 과 임계치 이상보정의 로직순서를 변경
    
    # 사용자 보정값 적용
    ai_pred_y_set_final = ai_pred_y_set + co_user

    # 임계치 이상 보정
    if abs(ai_pred_y_set_final - last_set) > ex_value :
        if ai_pred_y_set_final > last_set:
            ai_pred_y_set_final = last_set + ex_value
        elif ai_pred_y_set_final < last_set:
            ai_pred_y_set_final = last_set - ex_value

    
    # 예측값 상/하한 조정
    if ai_pred_y_set_final < co_min:
        ai_pred_y_set_final = co_min
    if ai_pred_y_set_final > co_max:
        ai_pred_y_set_final = co_max
    
    K.clear_session()

    ############################### 제어 테스트용 변수 ###############################
    # ai_opr = 1
    # ai_pred_y_set = 17 
    # last_set = 20
    # co_min = 0
    # co_max = 1000
    
    # ai_opr = 2
    # df_filtered.loc[df_filtered.index[-1],'침전수 탁도'] = 1.2

    ############################### 결과 DB 적재 ###############################
    # 입/출력 변수 Dictionary 형태로 변환
    # 입력 변수
    # 입/출력 변수 Dictionary 형태로 변환
    # 입력 변수
    in_val = dict()
    in_val = {
        dict_key[0] : float(df_filtered.loc[df_filtered.index[-1],'원수 탁도']),
        dict_key[1] : float(df_filtered.loc[df_filtered.index[-1],'원수 전기전도도']),
        dict_key[2] : float(df_filtered.loc[df_filtered.index[-1],'원수 알칼리도']),
        dict_key[3] : float(df_filtered.loc[df_filtered.index[-1],'원수 pH']),
        dict_key[4] : float(df_filtered.loc[df_filtered.index[-1],'원수 수온']),
        dict_key[5] : float(df_filtered.loc[df_filtered.index[-1],'침전수 탁도']),
        dict_key[6] : float(set_df.loc[set_df.index[-1],'inval_set1']),
        dict_key[7] : float(set_df.loc[set_df.index[-1],'inval_set2']),
        dict_key[8] : float(set_df.loc[set_df.index[-1],'inval_set3']),
        'CO_MIN' : float(co_min),
        'CO_MAX' : float(co_max),
        'CO_USER' : float(co_user)
    }

    for key in dict_key:
        in_val[key] = float(0) if in_val[key] is np.nan else in_val[key] 
        in_val[key] = float(0) if in_val[key] < 0 else in_val[key]

    # 출력 변수
    out_val = dict()
    out_val = {
        'AI_C_CF' : float(ai_pred_y_set_final),
        'C_TB' : float(df_filtered.loc[df_filtered.index[-1],'원수 탁도']),
        'C_INJECTOR1' : float(set_df.loc[set_df.index[-1],'run1']),
        'C_INJECTOR2' : float(set_df.loc[set_df.index[-1],'run2']),
        'C_INJECTOR3' : float(set_df.loc[set_df.index[-1],'run3']),
        'AI_C_CF_NR' : float(ai_pred_y),
        'AI_C_CF_NORM_CO' : float(ai_pred_y_set) 
    }
 
    for key in ['C_TB', 'C_INJECTOR1', 'C_INJECTOR2', 'C_INJECTOR3']:
        out_val[key] = float(0) if out_val[key] is np.nan else out_val[key] 
        out_val[key] = float(0) if out_val[key] < 0 else out_val[key]

    # 주요 인자
    factor_val = dict()
    factor_val = {
        'b_tb' : float(df_filtered.loc[df_filtered.index[-1],'원수 탁도']),
        'b_ph' : float(df_filtered.loc[df_filtered.index[-1],'원수 pH']),
        'b_te' : float(df_filtered.loc[df_filtered.index[-1],'원수 수온']),
        'b_cu' : float(df_filtered.loc[df_filtered.index[-1],'원수 전기전도도'])
    }

    in_val = [in_val]
    out_val = [out_val]
    factor_val = [factor_val]

    # 입/출력 변수 Dictionary to json
    in_val_json = json.dumps(in_val)
    out_val_json = json.dumps(out_val)
    factor_val_json = json.dumps(factor_val)

    ############################### 알람/제어 코드 ###############################
    run_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    df_factor = pd.DataFrame(columns = ['proc_cd', 'disinfection_index', 'rnti', 'factor'], index = [current_dt_date])
    df_factor['proc_cd'] = 'C'
    df_factor['disinfection_index'] = 'NONE'
    df_factor['rnti'] = run_time
    df_factor['factor'] = factor_val_json 

    run_time = f'"{run_time}"'
 
    # 제어 코드 (반자동 모드)
    if ai_opr == 1:
        # 이전값과 제어 기준값 이상 차이나면 제어 테이블 insert 진행
        if abs(ai_pred_y_set_final - last_set) >= ctr_value:
            # 응집제 주입률 최소/최대 임계치 범위를 벗어나는 경우 4번 타입 알람 발생
            if (ai_pred_y_set_final > co_max) or (ai_pred_y_set_final < co_min):
                db.save_alm('TB_AI_C_ALM', 132006, run_time)
                print('---------------- 응집제 주입률 임계치 알람 발생 ----------------')
            # 직전값 대비 임계치 이상 변화하는 경우 4번 타입 알람 발생
            elif abs(ai_pred_y_set_final - last_set) >= ex_value :
                db.save_alm('TB_AI_C_ALM', 132006, run_time)
                print('---------------- 직전값 대비 응집제 주입률 임계치 알람 발생 ----------------') 
            # 응집제 주입률 제어
            # 태그와 예측값 리스트 생성
            control_tag_list = []
            ai_pred_y_list = []
            # 사용중인 투입기의 주입률 설정값 tag 저장
            # 투입기 1 사용
            if set_df['run1'].loc[current_dt_date] == 1:
                tag = '600-359-CFC-2104'
                control_tag_list.append(tag)
            # 투입기 2 사용
            if set_df['run2'].loc[current_dt_date] == 1:
                tag = '600-359-CFC-2103'
                control_tag_list.append(tag)
            # 투입기 3 사용
            if set_df['run3'].loc[current_dt_date] == 1:
                tag = '600-359-CFC-2300'
                control_tag_list.append(tag)
            ### 사용중인 투입기 수만큼 주입률 예측값 배분
            # 투입기 1개 사용
            if set_df['use_sum'].loc[current_dt_date] == 1:
                ai_pred_y_list.append(ai_pred_y_set_final)
            # 투입기 2개 사용    
            elif set_df['use_sum'].loc[current_dt_date] == 2: 
                y_value_1 = round(ai_pred_y_set_final/2)
                y_value_2 = ai_pred_y_set_final - y_value_1
                ai_pred_y_list = ai_pred_y_list + [y_value_1, y_value_2]
            for cont, val in zip(control_tag_list, ai_pred_y_list):
                ctr_set(db, run_time, cont, val, last_set)
            if len(control_tag_list) > 0:
                db.save_ai_factor(df_factor)
            print('---------------- 제어테이블 적재 완료 ----------------')
    
    # 제어 코드 (자동 모드)
    if ai_opr == 2:
        # 이전값과 제어 기준값 이상 차이나면 제어 테이블 insert 진행
        if abs(ai_pred_y_set_final - last_set) >= ctr_value:
            # 임계치 범위를 벗어나는 경우 4번 타입 알람 발생
            if (ai_pred_y_set_final > co_max) or (ai_pred_y_set_final < co_min):
                db.save_alm('TB_AI_C_ALM', 132006, run_time)
                print('---------------- 응집제 주입률 임계치 알람 발생 ----------------')
            # 직전값 대비 임계치 이상 변화하는 경우 4번 타입 알람 발생
            elif abs(ai_pred_y_set_final - last_set) >= ex_value :
                db.save_alm('TB_AI_C_ALM', 132006, run_time)
                print('---------------- 직전값 대비 응집제 주입률 임계치 알람 발생 ----------------') 
            # 응집제 자동 변경 알람 발생
            elif (ai_pred_y_set_final <= co_max) and (ai_pred_y_set_final >= co_min):
                db.save_alm('TB_AI_C_ALM', 132004, run_time)
                print('---------------- 응집제 주입률 변경 알람 발생 ----------------')
            # 응집제 주입률 제어
            # 태그와 예측값 리스트 생성
            control_tag_list = []
            ai_pred_y_list = []
            # 사용중인 투입기의 주입률 설정값 tag 저장
            # 투입기 1 사용
            if set_df['run1'].loc[current_dt_date] == 1:
                tag = '600-359-CFC-2104'
                control_tag_list.append(tag)
            # 투입기 2 사용
            if set_df['run2'].loc[current_dt_date] == 1:
                tag = '600-359-CFC-2103'
                control_tag_list.append(tag)
            # 투입기 3 사용
            if set_df['run3'].loc[current_dt_date] == 1:
                tag = '600-359-CFC-2300'
                control_tag_list.append(tag)
            ### 사용중인 투입기 수만큼 주입률 예측값 배분
            # 투입기 1개 사용
            if set_df['use_sum'].loc[current_dt_date] == 1:
                ai_pred_y_list.append(ai_pred_y_set_final)
            # 투입기 2개 사용    
            elif set_df['use_sum'].loc[current_dt_date] == 2: 
                y_value_1 = round(ai_pred_y_set_final/2)
                y_value_2 = ai_pred_y_set_final - y_value_1
                ai_pred_y_list = ai_pred_y_list + [y_value_1, y_value_2]
            for cont, val in zip(control_tag_list, ai_pred_y_list):
                ctr_set(db, run_time, cont, val, last_set)  
            if len(control_tag_list) > 0:
                db.save_ai_factor(df_factor)
            print('---------------- 제어테이블 적재 완료 ----------------')
            
    # 목표 침전수 탁도 초과 알람
    if ai_opr != 0: # 반자동/자동모드
        if co_tbi_e <= float(df_filtered.loc[df_filtered.index[-1],'침전수 탁도']):
            db.save_alm('TB_AI_C_ALM', 132005, run_time) 
            print('---------------- 목표 침전수 탁도 초과 알람 발생 ----------------')

    ############################### 예측 결과 저장 ###############################        
    # 결과 테이블에 저장
    # 약품 공정 결과 테이블 형태의 DataFrame 생성
    df_final = pd.DataFrame(columns = ['upd_ti', 'AI_OPR', 'IN_VAL', 'OUT_VAL'], index = [current_dt_date])
    df_final['upd_ti'] = datetime.now()
    df_final['AI_OPR'] = ai_opr
    df_final['IN_VAL'] = in_val_json
    df_final['OUT_VAL'] = out_val_json   
          
    # 결과 테이블에 저장
    db.save_ai_rt('TB_AI_C_RT', df_final)

    print('---------------- 공정 실행 완료 (1 cycle) ----------------')