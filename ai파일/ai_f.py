##########
# 여과 모듈 파일
# author : Lee Hyeokhui
# since : 2024. 10. 07
# version : 0.1
##########

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
TAG_PATH = '/'.join([PROC_PATH, 'tag_list/']) # tag_list 경로
LOGS_PATH = BASE_PATH + '/logs/'             # log 경로

# 공통 라이브러리
from db_util import DBUtil
from config import Config
from analysis import *
import json
import joblib
from joblib import dump,load
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
import re

# model 관련 라이브러리
import tensorflow as tf
from tensorflow import keras
import keras.backend as K

# 전송 로거 생성
from aos_util import *
build_logger(ROOT_PATH, BASE_PATH, PROC_NAME)

################################################## 로그 처리 ##################################################
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
###############################################################################################################

################################################ 실행 함수 ####################################################
def get_init(db, table_nm):
    """
    init값 가져오기
    최대여과지속시간, 최대수위, 지별 사용상태, AI 모드

    db : db Class
    table_nm : Init Table 명
    """
    
    sql = """
    SELECT * FROM {}
    """.format(table_nm)
    df_init = db.read(sql)

    # 최대여과지속시간 설정값
    max_ti_min = df_init[df_init['ITM'] == 'f_location_ti_set_max']['INIT_VAL'].values[0] * 60 - 15 # 실행시간/역세중복 고려해 최대지속시간에서 45분 빼고 적용
    # 최대수위 설정값
    max_wl = df_init[df_init['ITM'] == 'f_location_wl_max']['INIT_VAL'].values[0]
    # 최대전력량 설정값
    f_pw = df_init[df_init['ITM'] == 'f_pw']['INIT_VAL'].values[0]
    # 여과지 사용여부 설정값
    opr_ji_list = df_init[['ITM', 'TAG_SN', 'INIT_VAL']].set_index('ITM').sort_values('TAG_SN').filter(like='ji', axis=0)['INIT_VAL'].values
    # ai mode 설정값
    ai_opr = df_init[df_init['ITM'] == 'f_operation_mode']['INIT_VAL'].values[0]
    
    return max_ti_min, max_wl, f_pw, opr_ji_list, ai_opr
    
def drop_outlier_cat(df):
    """
    범주형 데이터의 0,1 이외의 값 앞의 값으로 대체하는 함수
    
    df : 전처리 대상 데이터프레임
    """
    # 0,1 이외의 데이터 전처리 - 이전 값으로 대체
    for col in df.columns:
        df[col] = df[col].apply(lambda x : x if (x==0) or (x==1) else None)
        df[col] = df[col].fillna(method='ffill').fillna(method='bfill')
        
    return df

def cal_status(df_in, df_out, df_ex_out, df_dr_out, df_air_in, df_bw_in, n, opr_ji_list):
    """
    밸브 조합에 따른 여과상태 컬럼 생성 함수
    
    df_in : 유입밸브 F/C 태그 모아놓은 데이터 프레임
    df_out : 유출밸브 F/C 태그 모아놓은 데이터 프레임
    df_ex_out : 퇴수밸브 F/C 태그 모아놓은 데이터 프레임
    df_dr_out : 배수(사수)밸브 F/C 태그 모아놓은 데이터 프레임
    df_air_in : 공기유입밸브 F/C 태그 모아놓은 데이터 프레임
    df_bw_in : 역세척유입밸브 F/C 태그 모아놓은 데이터 프레임
    n : 지번호 -1 값 ex) 여과지 1지면 0
    """
    # 지별 유입/유출/퇴수/배수/공기/역세척 밸브 데이터프레임 생성
    df_valve_status = pd.concat([df_in[[df_in.columns[n]]],df_out[[df_out.columns[n]]],
                                 df_ex_out[[df_ex_out.columns[n]]],df_dr_out[[df_dr_out.columns[n]]],
                                 df_air_in[[df_air_in.columns[n]]],df_bw_in[[df_bw_in.columns[n]]]], axis=1)

    # 밸브 조합 컬럼 생성
    df_vs_str = df_valve_status.astype('int').astype('str')
    df_valve_status['#{}지valve_status'.format(n+1)] = df_vs_str.sum(axis=1)

    # 밸브 조합 별 여과지 상태 컬럼 생성
    col = '#{}지valve_status'.format(n+1)
    df_valve_status['#{}지여과중'.format(n+1)] = df_valve_status[col].apply(lambda x : 1 if (x == '001111') or (x == '011111') else 0)
    df_valve_status['#{}지역세대기중'.format(n+1)] = [0 for _ in range(len(df_valve_status))]
    df_valve_status['#{}지역세중'.format(n+1)] = df_valve_status[col].apply(lambda x : 1 if (x == '110101') or (x == '110110') or (x == '110100') else 0)
    df_valve_status['#{}지여과대기중'.format(n+1)] = [0 for _ in range(len(df_valve_status))]
    df_valve_status['#{}지시동방수중'.format(n+1)] = df_valve_status[col].apply(lambda x : 1 if (x == '011011') else 0)
    df_valve_status['#{}지운휴중'.format(n+1)] = [0 for _ in range(len(df_valve_status))]

    # 사용여부 여과지로 변경
    if opr_ji_list[n] == 0:
        df_valve_status.loc[df_valve_status.index[-1], '#{}지운휴중'.format(n+1)] = 1

    # # 사용여부 여과지로 변경
    # # 7일동안 여과/역세 안했을 경우 운휴처리
    # if df_valve_status[df_valve_status.columns[-6:-2]].sum().sum() == 0:
    #    df_valve_status.loc[df_valve_status.index[-1], '#{}지운휴중'.format(n+1)] = 1
    
    # 역세대기/여과대기상태 생성
    if ((df_valve_status[df_valve_status.columns[-6:]].sum(axis=1).values[-1]) == 0):
        for i, val in enumerate(list(range(len(df_valve_status.index) - 1, -1, -1))):
            df_index = df_valve_status.index[val]
            if (df_valve_status.loc[df_index]['#{}지여과중'.format(n+1)] == 1):
                ret_val = df_valve_status.index[val+1]
                df_valve_status.loc[ret_val:, '#{}지역세대기중'.format(n+1)] = [1 for _ in range(len(df_valve_status.loc[ret_val:]))]
                break
            if (df_valve_status.loc[df_index]['#{}지역세중'.format(n+1)] == 1):
                ret_val = df_valve_status.index[val+1]
                df_valve_status.loc[ret_val:, '#{}지여과대기중'.format(n+1)] = [1 for _ in range(len(df_valve_status.loc[ret_val:]))]
                break

    # 모든 조합 해당안할 경우 운휴중으로 변경
    if ((df_valve_status[df_valve_status.columns[-6:]].sum(axis=1).values[-1]) == 0):
        df_valve_status.loc[df_valve_status.index[-1], '#{}지운휴중'.format(n+1)] = 1
    
    return df_valve_status

def eda_cat(df_cat, opr_ji_list):
    """
    범주형 변수 전처리 데이터
    1. 0,1 이외 데이터 전처리
    2. 각 밸브 별 데이터프레임 생성 후 밸브 조합 컬럼 생성
    3. 여과지별 밸브조합에 따른 여과상태 컬럼 추가한 데이터프레임 생성
    4. 여과지별 데이터프레임 merge
    5. '여과중'에 해당하는 여과지를 통해 운영 여과지 수 계산

    df_cat : 범주형 변수 모아놓은 데이터프레임
    """
    # 0,1 이외 데이터 전처리
    df_cat = drop_outlier_cat(df_cat)
    
    # 변수 특성별 데이터프레임 생성
    # 범주형 변수
    df_in = df_cat[df_cat.columns[:22]]              # 유입밸브 F/C
    df_out = df_cat[df_cat.columns[22:44]]           # 유출밸브 F/C
    df_ex_out = df_cat[df_cat.columns[44:66]]       # 퇴수밸브 F/C
    df_dr_out = df_cat[df_cat.columns[66:88]]       # 배수(사수)밸브 F/C
    df_air_in = df_cat[df_cat.columns[88:110]]       # 공기유입밸브 F/C 
    df_bw_in = df_cat[df_cat.columns[110:132]]        # 역세척유입밸브 F/C
    
    # 여과지별 밸브/운전상태 데이터프레임 생성
    df_status_list = [cal_status(df_in, df_out, df_ex_out, df_dr_out, df_air_in, df_bw_in, i, opr_ji_list) for i in range(22)]
    
    # 여과지별 데이터프레임 merge
    df_status = reduce(lambda left, right : pd.merge(left, right, how='inner', left_index=True, right_index=True), df_status_list)
    
    # 운영 여과지 수 생성
    df_status['운영 여과지 수'] = df_status.filter(like="여과중", axis=1).sum(axis=1)
    # 3 미만인 경우 ffill(정수장마다 다름)
    df_status['운영 여과지 수'] = df_status['운영 여과지 수'].apply(lambda x : x if (x > 0) else None)
    df_status['운영 여과지 수'] = df_status['운영 여과지 수'].fillna(method='ffill')

    return df_status, df_status_list

def make_col_list(df_status):
    """
    여과지 상태 컬럼 list 생성

    df_status : 여과지 지별 상태 / 운영 여과지 수 데이터프레임
    
    """
    # 여과 컬럼 리스트
    list_f_proc_fil_nm = df_status.filter(like='여과중').columns
    list_f_proc_bw_wait_nm = df_status.filter(like='역세대기중').columns
    list_f_proc_bw_nm = df_status.filter(like='역세중').columns
    list_f_proc_fil_wait_nm = df_status.filter(like='여과대기중').columns
    list_f_proc_ftw_nm = df_status.filter(like='시동방수중').columns
    list_f_proc_wait_long_nm = df_status.filter(like='운휴중').columns
    list_f_proc_full_nm = np.concatenate([list_f_proc_fil_nm, list_f_proc_bw_wait_nm, list_f_proc_bw_nm, 
                                        list_f_proc_fil_wait_nm, list_f_proc_ftw_nm, list_f_proc_wait_long_nm])
    
    return list_f_proc_full_nm

def cal_bw_time(df_status):
    """
    역세 후 대기시간 계산

    df_status : 여과지 지별 상태 / 운영 여과지 수 데이터프레임
    """
    df_bw_status = df_status.filter(like='역세중')
    bw_time_list = []
    bw_time_col = ['location{}'.format(i+1) for i in range(len(df_bw_status.columns))]
    for col in df_bw_status.columns:
        if len(df_bw_status[df_bw_status[col] == 1]) > 1:
            bw_time = df_status.index[-1] - max(df_bw_status[df_bw_status[col] == 1].index)
            bw_time = bw_time.total_seconds() / 60
        else:
            bw_time = -1
        bw_time_list.append(bw_time)
    df_bw_time = pd.DataFrame(bw_time_list, index = bw_time_col, columns=['F_TIME_BW_PER'])
    return df_bw_time

def eda_tbi_per(df_con):
    """
    여과지별 탁도 전처리 함수
    - Na값 처리
    - 극단값 처리
    
    df_con : 연속형 변수 데이터프레임
    """
    # 여과지별 탁도 전처리
    df_tbi_per = df_con[df_con.columns[22:44]]
    
    # 2 초과값 전처리 (기준값은 정수장마다 변경)
    for col in df_tbi_per.columns:
        df_tbi_per[col] = df_tbi_per[col].apply(lambda x: x if (x < 2) else None)
        df_tbi_per[col] = df_tbi_per[col].fillna(method='ffill')

    return df_tbi_per

def eda_wl(df_con):
    """
    여과지별 수위 전처리 - 데이터 안정적이어서 전처리 크게 진행 안함
    - Na값 처리
    - 극단값 처리
    
    df_con : 연속형 변수 데이터프레임
    """
    # 여과지별 수위 전처리
    df_wl = df_con[df_con.columns[44:66]]
    
    # 수위가 0인 경우 앞의 값으로 대체
    for col in df_wl.columns:
        df_wl[col] = df_wl[col].apply(lambda x: x if (x > 0) & (x < 3) else None)
        df_wl[col] = df_wl[col].fillna(method='ffill')
    
    return df_wl

def eda_fri(df_con, df_status):
    """
    원수 유입유량, 여과지 유출유량 데이터 전처리 및 여과속도 산출 함수
    - Na값
    - 스무딩
    - 여과속도 산출 (정수장별 여과속도 산출식 확인 필요)
    
    df_con : 연속형 변수 데이터프레임
    df_status : 여과지 지별 상태 / 운영 여과지 수 데이터프레임 (운영 여과지 수만 사용)
    """
    # 유량 전처리 (원수 유입유량, 여과지 유출유량)
    df_fri = df_con[df_con.columns[66:68]]
    df_fri = df_fri.fillna(method='ffill')
    df_fri.columns = ['원수유입유량', '여과지유출유량']
    
    df_fri_in = df_fri[[df_fri.columns[0]]]
    df_fri_out = df_fri[df_fri.columns[1:]]

    # 극단값 처리
    df_fri_in['원수유입유량'] = df_fri_in['원수유입유량'].apply(lambda x: x if (x>1000) &(x<15000) else None)
    df_fri_in['원수유입유량'] = df_fri_in['원수유입유량'].fillna(method='ffill')
    df_fri_out['여과지유출유량'] = df_fri_out['여과지유출유량'].apply(lambda x: x if (x>1000) &(x<15000) else None)
    df_fri_out['여과지유출유량'] = df_fri_out['여과지유출유량'].fillna(method='ffill') 
     
    if len(df_fri) > 180:
        window_size = 180
    else:
        window_size = len(df_fri) // 2
        if window_size == 0:
            window_size = 1

    if len(df_fri_in) > 10:
        # savgol filtering
        df_fri_in['원수유입유량_smoothed'] = savgol_filter(df_fri_in['원수유입유량'], window_size, 3)
    else:
        df_fri_in['원수유입유량_smoothed'] = df_fri_in['원수유입유량'].rolling(window=window_size, min_periods = 1, center=False).mean()
    
    # 여과지 지별 유출유량 전처리
    # savgol filtering
    if len(df_fri_out) > 10:
        df_fri_out['여과지유출유량_smoothed'] = savgol_filter(df_fri_out['여과지유출유량'], window_size, 3)
    else:
        df_fri_out['여과지유출유량_smoothed'] = df_fri_out['여과지유출유량'].rolling(window=window_size, min_periods = 1, center=False).mean()
    
    # 여과속도 산출
    df_friout_status = pd.merge(df_fri_out['여과지유출유량_smoothed'], df_status['운영 여과지 수'], how='inner', left_index=True, right_index=True)
    df_friout_status = df_friout_status.dropna()
    df_speed = pd.DataFrame(df_fri_out['여과지유출유량_smoothed'] / df_friout_status['운영 여과지 수'] / 112) # 여과속도 = 유출유량 / 운영 여과지 수 / 112
    df_speed.columns = ['여과속도']
    
    df_fri_in = df_fri_in[['원수유입유량_smoothed']]
    df_fri_in.columns = ['원수유입유량']
    df_fri_out = df_fri_out[['여과지유출유량_smoothed']]
    df_fri_out.columns = ['여과지유출유량']
    
    return df_fri_in, df_fri_out, df_speed

def eda_tbi(df_con):
    """
    원수 탁도 및 침전수 탁도 전처리 함수
    1. 10분 단위 resampling
    2. Z_score (침전수 탁도만)
    3. STL
    
    df_con : 연속형 변수 데이터프레임
    """
    # 탁도 전처리(원수 탁도, 침전수 탁도)
    df_tbis = df_con[df_con.columns[68:70]]    
    df_tbis.columns = ['침전수탁도', '원수탁도']

    df_tbie = df_tbis[[df_tbis.columns[0]]]
    df_tbi = df_tbis[[df_tbis.columns[1]]]

    # 극단값 처리
    df_tbie['침전수탁도'] = df_tbie['침전수탁도'].apply(lambda x: x if (x>0)&(x<5) else None)
    df_tbie['침전수탁도'] = df_tbie['침전수탁도'].fillna(method='ffill')
    df_tbi['원수탁도'] = df_tbi['원수탁도'].apply(lambda x: x if (x>0)&(x<150) else None)
    df_tbi['원수탁도'] = df_tbi['원수탁도'].fillna(method='ffill')
    
    return df_tbie, df_tbi

def cal_state(df_f_current, list_f_pond_nm, list_f_proc_full_nm):
    """
    현재 여과지 지별 상태 산출

    df_f_current : 기준 시간대의 전체 데이터프레임
    list_f_pond_nm : 여과지 번호 리스트
    list_f_proc_full_nm : 여과지 상태 컬럼 리스트
 
    return : 현재 여과지 지별 상태
    """
    # 여과 공정 현재 지별 상태 저장
    f_location_state = pd.DataFrame()
    for pond_index, pond in enumerate(list_f_pond_nm):
        # 여과상태 저장
        list_pond_state_cols = [] # 지별 번호 + 상태값 형태로 저장됨. ex) '5여과중', '5역세중', ... , '5순환후대기'
        for c in list_f_pond_state_post_cols:
            list_pond_state_cols.append('#' + str(pond)+c)
        # 24시간 전부터 현재 예측 시점까지의 데이터를 전처리 한 후 현재 예측 시점의 데이터를 저장한다.
        #df_pond_states = proc_preprocessing(df_f_rn.loc[prev24_dt:][list_pond_state_cols]).loc[[current_dt]]
        df_pond_states = df_f_current[list_f_proc_full_nm].filter(like='#{}지'.format(str(pond)))
        # 지별 상태값 합 계산
        state_sum = df_pond_states.sum(axis=1).values[0].astype(int)
        
        state_result = df_pond_states[df_pond_states.isin([1])].T.dropna().index[0]
        state_result = re.sub(r'#[0-9]+지', '', state_result)
        state_result_num = list_f_pond_state_post_cols.index(state_result) + 1
        # 각 지별 상태를 저장한다. 저장데이터는 숫자 형태로 저장된다. 
        f_location_state = pd.concat([f_location_state,
                    pd.DataFrame(
                        [
                            int(state_result_num)
                        ],
                        columns=['F_LOCATION_STATE'],
                        index=['location'+str(pond)]
                    )]
                )

    return f_location_state

################################################# 스케줄 함수 ##################################################
def find_prev_state_start_ti(df, _col, comp_val = 0):
    '''
    이전 상태에서 여과/역세가 시작된 시점을 파악하기 위한 함수
    ex) 현재 역세중이라면 언제 역세가 시작되었는지 파악하기 위해 현재 시점(역세중값이 1)에서 시작하여 역세중값이 0인 시점을 파악한다.
    Parameter -
        df : 파악할 데이터가 저장된 DataFrame
        _col : 비교할 컬럼 명
        comp_val : 비교값
    return -
        ret_val : [여과 / 역세 시작 시점(분 단위값), 여과 / 역세 시작 시점 timestamp값]
    '''
    ret_val = [0, df.index[0]] # date_index, date
    # 0~99 : 100
    # 0, 99,  1, 98
    # 역순 조회 시작
    for i, val in enumerate(list(range(len(df.index) - 2, 0, -1))):
        df_index = df.index[val]
        if (df.loc[df_index][_col] == comp_val): # 비교값과 같다면 해당 인덱스 및 시점 저장 후 반환
            ret_val = [i+1, df.index[val+1]]
            break
    return ret_val

def cal_fil_bw_st_end_ti(df_f_rn, df_time, list_ji_state, current_dt_ts, max_ti_min):
    """
    여과시작/종료, 역세시작/종료 시간 리스트 생성 및 산출

    return
    fil_st_ti_list : 지별 여과시작시간 리스트
    fil_end_ti_list : 지별 여과종료시간 리스트
    bw_st_ti_list : 지별 역세시작시간 리스트
    bw_end_ti_list: 지별 역세종료시간 리스트
    """
    
    # 여과시작시간 저장
    fil_st_ti_list = [0 if (df_f_rn.filter(like='여과중').tail(1)[col].values == 0)
                   else (current_dt_ts - timedelta(minutes=df_time[df_time.columns[i]].tail(1).values[0]))
                   for i, col in enumerate(df_f_rn.filter(like='여과중').columns)]
    # 여과종료시간 저장
    fil_end_ti_list = [0 if t == 0 else t + timedelta(minutes=max_ti_min) for t in fil_st_ti_list]
    # 역세시작시간 저장
    bw_st_ti_list = [0 for i in range(len(fil_end_ti_list))]
    # 역세종료시간 저장
    bw_end_ti_list = [0 for i in range(len(fil_end_ti_list))]

    # 역세중인 여과지 있으면 실행
    if 3 in list(list_ji_state['F_LOCATION_STATE']):
        for i in range(22):
            if list_ji_state.loc['location{}'.format(i+1), 'F_LOCATION_STATE'] == 3: # 역세중
                bw_st_ti_list[i] = find_prev_state_start_ti(df_f_rn, '#{}지역세중'.format(i+1), 0)[1]
                bw_end_ti_list[i] = bw_st_ti_list[i] + timedelta(minutes=30)
    
    return fil_st_ti_list, fil_end_ti_list, bw_st_ti_list, bw_end_ti_list

def get_future_fr(df_f_rn, current_dt_ts):
    '''
    지난 7일치의 혼화지 유입유량을 고려하여 앞으로의 유입유량을 예측하는 함수로 착수공정의 명수성 수석이 제공한 함수를 가져다 사용함.
    자세한 내용은 명수성 수석에게 문의바람.
    Return -
        df_future_f_in_fr : 향후 24시간동안의 예측 유입유량
    '''
    df_f_in_fr = df_f_rn[['원수유입유량']]
    df_f_in_fr.reset_index(inplace=True)
    
    # 날짜와 시간을 기준으로 인덱스 설정
    # 총유입유량에 대해 일자별(row), 시간순(column)의 컬럼값으로  적재된 형태로 변경됨
    df_Da=df_f_in_fr.set_index([df_f_in_fr['UPD_TI'].dt.date, df_f_in_fr['UPD_TI'].dt.time])
    df_Da=df_Da[['원수유입유량']]
    df_Da=df_Da.rename_axis([None]*2)
    df_Da=df_Da.unstack()
    df_Da=df_Da.iloc[:-1,]
    
    # 각 시간별로 일자별 row값에 대해 median 필터를 적용한 값으로 1차원 값을 가진 DataFrame 생성
    # 해당 데이터에 대해 median 필터 적용
    df_roll=pd.DataFrame(df_Da.median(axis=0).rolling(4, center=True).median(),columns=['roll'])
    df_Da_m=df_Da.median(axis=0)
    df_roll_na = df_roll[df_roll.isna().values]
    for i in df_roll_na.index:
        df_roll.at[i, 'roll']=df_Da_m.loc[i]
    df_roll=df_roll.fillna(method='ffill')
    df_roll=round(df_roll,2)
    
    df_roll = df_roll.filter(items={'roll'})
    df_roll.index.names = ['name', 'time']
    df_roll = df_roll.reset_index()
    df_roll = df_roll.drop('name', axis=1)
    df_roll = df_roll.set_index('time')
    
    # 생성된 데이터에 현재 예측 시점 + 10분부터 24시간까지의 인덱스를 생성 후 최종 예측 DataFrame 생성
    future_f_in_fr_index = pd.date_range(current_dt_ts+timedelta(minutes=1), current_dt_ts+timedelta(days=1), freq='1T')
    future_f_in_fr_time_index = future_f_in_fr_index.time.tolist()
    df_future_f_in_fr = pd.DataFrame( index = future_f_in_fr_index )
    df_future_f_in_fr['원수유입유량'] = 0
    for i in df_roll.index:
        df_future_f_in_fr.iat[future_f_in_fr_time_index.index(i), 0] = df_roll.loc[i].values[0]

    return df_future_f_in_fr
    
def set_future_fr(df_future_fr):
    '''
    prepare_data()에서 get_future_fr()를 통해 저장된 예측 유입유량 self.df_future_fr 데이터를 10분단위로 resampling하여 저장한다.
    Parameter - 
        df_future_fr : 예측 유입유량
    Return - 
        df_future_fr_10m : 10분 resampling된 예측 유입유량
    
    '''
    # 운영지수/수위예측 t+n 예측을 위한 미래 유입유량 10분 단위 Resampling
    df_future_fr_10m = pd.DataFrame()
    for i in range(0, len(df_future_fr), 10):
        df_future_fr_10m = pd.concat([df_future_fr_10m, 
            pd.DataFrame([(
                df_future_fr.iloc[i:i+10]['원수유입유량'].mean(),
                df_future_fr.iloc[i:i+10].index[-1]
            )],
            columns=['원수유입유량', 'datetime']
            )]
        )
    df_future_fr_10m = df_future_fr_10m.set_index('datetime')
    return df_future_fr_10m

def normalize_data_by_minmax(dataset, minmax, value=False, lst=False):
        '''
        주어진 minmax 값으로 normalization 적용
        Parameter - 
            dataset : normalization 대상 DataFrame
            minmax : normalization을 적용할 최소/최대값 리스
            value : dataset이 DataFrame이 아닐 경우 True
        Return -
            result : normalization 결과
        '''
        if (value == False) & (lst == False):
            result = dataset.copy()
            for index, feature_name in enumerate(dataset.columns):
                max_value = minmax[index][1]
                min_value = minmax[index][0]
                result[feature_name] = (dataset[feature_name] - min_value) / (max_value - min_value)
            return result
        elif (value == True) & (lst == False):
            max_value = minmax[0][1]
            min_value = minmax[0][0]
            result = (dataset - min_value) / (max_value - min_value)
            return result    
        else:
            max_value = minmax[0][1]
            min_value = minmax[0][0]
            result = [(i - min_value) / (max_value - min_value) for i in dataset]
            return result

def convert_model_values_step_1(sequence, n_steps):
        '''
        예측 모델에서 t+1 예측을 위한 데이터 변환 함수
        Parameter -
            sequence : normalization 처리된 DataFrame
            n_steps : 예측 모델에서 사용되는 step 값
        Return - 모델에서 사용되는 array 값과 feature 크기 반환
        '''
        X = list() # 빈리스트 생성
        if len(sequence) == n_steps:
            X.append(sequence)
            X_sub = np.array(X) # 리스트를 array로 변환
            return X_sub, X_sub.shape[2] # 모델에서 사용되는 array 값과 feature 크기 반환
        else:
            return np.array(X), 0

def denormalize_data(df, minmax, value=False):
        '''
        주어진 minmax값으로 normalization 결과를 원복하기 위한 함수
        Paramter -
            df : 원복할 DataFrame
            minmax : 원복에서 사용되는 최소/최대값 리스트
        Return -
            result : denormalization 결과
        '''
        if value == False:
            if (len(df.columns) == len(minmax)):
                result = df.copy()
                for index, feature_name in enumerate(df.columns):
                    max_value = minmax[index][1]
                    min_value = minmax[index][0]
                    # normalization 을 역산한다.
                    result[feature_name] = df[feature_name] *  (max_value - min_value) + min_value
                    df_max = result[result[feature_name] > max_value]
                    if len(df_max) > 0:
                        result.loc[df_max.index, feature_name] = [max_value for _ in range(len(df_max.index))]
                    df_min = result[result[feature_name] < min_value]              
                    if len(df_min) > 0:
                        result.loc[df_min.index, feature_name] = [min_value for _ in range(len(df_max.index))]
                return result
            else:
                print('Dataframe and minmax size are different!')
                return df
        else:
            max_value = minmax[0][1]
            min_value = minmax[0][0]
            result = df * (max_value - min_value) + min_value
            if result > max_value:
                result = max_value
            if result < min_value:
                result = min_value
            return result           

def convert_index_to_string(_df):
    '''
    timestamp형태로 저장된 DataFrame의 인덱스 값을 문자열 형태로 변환하여 반환한다.
    Parameter - _df : timestamp datetime 인덱스를 변환할 DataFrame
    Return - df : timestamp datetime 인덱스를 문자열형태로 변환한 DataFrame
    '''
    df = _df.copy()
    #df['datetime'] = df.index.strftime('%Y-%m-%d %H:%M') # timestamp --> 문자열 반환
    df['datetime'] = df.index
    df['datetime'] = df['datetime'].apply(lambda x: datetime.strftime(x, '%Y-%m-%d %H:%M'))
    df.index = df['datetime']
    df.drop('datetime', axis=1, inplace=True) # 기존 timestamp 값을 삭제한다.
    return df

def round_num_result(_result):
    '''
    소수점 단위의 오차로 DeNormalize 실행 시 1지 차이나게 도출되는 경우가 있어
    운영 여과지 수 모델 예측결과를 보정한다.
    Parameter - _result : 모델 예측 결과    
    Return - result : 보정 후 예측 결과
    '''
    result = _result.round(2)
    if (result < 0.0625):
        result = 0
    elif (result >= 0.0625) & (result < 0.1875):
        result = 0.125
    elif (result >= 0.1875) & (result < 0.3125):
        result = 0.250
    elif (result >= 0.3125) & (result < 0.4375):
        result = 0.375
    elif (result >= 0.4375) & (result < 0.5625):
        result = 0.500
    elif (result >= 0.5625) & (result < 0.6875):
        result = 0.625
    elif (result >= 0.6875) & (result < 0.8125):
        result = 0.750
    elif (result >= 0.8125) & (result < 0.9375):
        result = 0.875
    elif result >= 0.9375:
        result = 1
    return np.array([result])

def predict_proc_n(df_future_fr, df_f_3hours, current_dt_ts, minmax_proc, steps_10m_model_n):
    """
    1. 운영 여과지 수 예측을 위한 데이터셋 생성
    2. 운영 여과지수 예측
    """
    # 운영 여과지 수 예측용 데이터셋 생성 및 예측
    # 유입유량 10분 Resampling
    df_future_fr_10m = set_future_fr(df_future_fr)
    # 원수 유입유량, 운영 여과지 수 merge
    df_3hours_m = df_f_3hours[['원수유입유량', '운영 여과지 수']]

    df_3hours_10m = df_3hours_m.resample('10min', origin='end').mean()
    df_3hours_10m['운영 여과지 수'] = df_3hours_10m['운영 여과지 수'].round()
    df_3hours_10m.index.name = 'datetime'
    df_3hours_10m['datetime'] = df_3hours_10m.index
    df_3hours_10m['운영 여과지 수'] = df_3hours_10m['운영 여과지 수'].rolling('60min').mean().round()
    df_3hours_10m = df_3hours_10m.fillna(method='ffill')
    df_3hours_10m = df_3hours_10m.fillna(method='bfill')
    df_f_2hours_10m = df_3hours_10m.tail(12)

    # 원수 유입유량 Normalization - 설정된 원수 유입유량에 대한 최대최소값을 기준으로 평준화 처리를한다.
    df_2hours_10m_fr_nor = normalize_data_by_minmax(df_f_2hours_10m[['원수유입유량']], minmax_fr)

    # 운영 여과지 수 Normalization - 설정된 운영 여과지 수에 대한 최대최소값을 기준으로 평준화 처리를한다.
    df_2hours_10m_pcnt_nor = normalize_data_by_minmax(df_f_2hours_10m[['운영 여과지 수']], minmax_proc)

    # 예측 모델용 데이터 변환
    df_2hours_10m_nor = pd.merge(df_2hours_10m_fr_nor, df_2hours_10m_pcnt_nor, on='datetime', how='left')

    
    # t+1 예측을 위한 데이터로 변환한다.
    X_sub, n_features = convert_model_values_step_1(df_2hours_10m_nor.values, steps_10m_model_n)
    # 변환된 데이터를 모델에 적용하기위해 차원수를 변경한다.
    step_1_x_10m = X_sub.reshape((len(X_sub), steps_10m_model_n, n_features))

    # t+1 예측
    pred_y = model_n.predict(step_1_x_10m)
    pred_n_y = round_num_result(pred_y)
    
    # 24시간 여과 운영지 수 예측
    # 24시간 예측 원수 유입유량 Normalization
    df_future_fr_10m_nor = normalize_data_by_minmax(df_future_fr_10m[['원수유입유량']], minmax_fr)

    list_pred_n_y = []
    step_n_x_10m = step_1_x_10m.copy()
    pred_n_y = denormalize_data(pred_n_y, minmax_proc, value=True).astype(np.int)

    for index, f_val in enumerate(df_future_fr_10m_nor.values):
        pred_n_y = normalize_data_by_minmax(pred_n_y, minmax_proc, value=True)
        append_val = np.concatenate((df_future_fr_10m_nor.values[index], pred_n_y), axis=0)
        append_val = append_val.reshape(1, 1, 2)
        step_n_x_10m = step_n_x_10m[:,-11:,:]
        step_n_x_10m = np.concatenate((step_n_x_10m, append_val), axis=1)
        pred_n_y = model_n.predict( step_n_x_10m )
        pred_n_y = round_num_result(pred_n_y)
        pred_n_y = denormalize_data(pred_n_y, minmax_proc, value=True).astype(np.int)
        list_pred_n_y.append(pred_n_y)

    # t+n 예측 - 예측 유입유량데이터에 t+1예측으로 산출된 운영지수를 차례대로 적용하여 24시간에 대한 예측 데이터 산출 종료 ------
    arr_pred_n_y = np.array(list_pred_n_y).reshape(len(list_pred_n_y),)
    df_pred_n_result = pd.DataFrame(arr_pred_n_y, columns=['ai_f_operation_count']) # 예측 운영 지수 array 데이터를 DataFrame 형태로 변경
    df_pred_n_result.index = df_future_fr_10m_nor.index # datetime 인덱스 설정
    df_pred_n_result = df_pred_n_result.copy() # 최종 결과 저장

    return df_pred_n_result, df_future_fr_10m, df_f_2hours_10m
    
###################################### 최대지속시간 기준 스케줄 함수 ######################################
def make_friin_speed(df_pred_n_result, df_f_2hours_10m, df_future_fr_10m, df_f_3hours, current_dt_ts):
    """
    예측 운영 여과지 수와 예측 유량을 통해 산출식 적용하여 24시간 여과속도 산출

    Return -
        df_pred_ps : 24시간 유입유량, 여과속도로 이루어진 dataframe
    """
    # 이전 2시간 데이터의 20분 데이터와 예측 유입유량 합치기
    df_pred_ps = df_f_2hours_10m.iloc[-2:] # 이전 2시간 데이터의 20분 데이터
    df_pred_ps = pd.concat([df_pred_ps, df_future_fr_10m])
    df_pred_ps = df_pred_ps.drop(columns=['datetime'])

    # 여과 유출유량은 급속여과 유입유량에서 20분 뒤의 데이터에 임계값 0.90를 적용하여 산출한다.
    for i in df_pred_ps.index:
        # 예측 운영지수값을 넣어준다.
        if df_pred_ps.loc[i][['운영 여과지 수']].isna()[0]: # 운영 여과지 수 데이터가 없는 인덱스에 예측 운영지수 값을 삽입한다.
            df_pred_ps.at[i, '운영 여과지 수'] = df_pred_n_result.loc[i]['ai_f_operation_count']
    # 유입유량으로 유출유량 산출
    df_pred_ps['여과지유출유량'] = df_pred_ps['원수유입유량'].shift(2)*.90 
    df_pred_ps = df_pred_ps.dropna()

    # 산출된 유입유량과 예측 운영지수로 여과속도 산출
    df_pred_ps['여과속도'] = df_pred_ps['여과지유출유량'] / df_pred_ps['운영 여과지 수'] / 150
    # 사용될 총유입유량과 여과속도만 남겨둔다.
    df_pred_ps = df_pred_ps.drop(['운영 여과지 수','여과지유출유량'], axis=1) 

    # 3시간 데이터에서 2시간 여과속도 추출
    df_pond_sp = df_f_3hours[['여과속도']].tail(120)

    # 기존 2시간에 대한 여과 유입유량 저장된 데이터에 급속여과지여과속도 데이터를 합산한다.
    df_2hours_nstep = pd.merge(df_f_3hours[['원수유입유량']], df_pond_sp, how='left', left_index=True, right_index=True)
    df_2hours_nstep = df_2hours_nstep.dropna()
    # 향후 24시간 데이터의 datetime 인덱스를 저장한다.
    future_fr_index = df_pred_ps.index
    
    return df_pred_ps, df_2hours_nstep, future_fr_index
    
def make_schedule_max_ti(df_pred_ps, list_ji_state, list_fil_ti, list_bw_wait_ti, list_bw_ti, current_dt_ts, max_ti_min, list_f_pond_nm):
    """
    최대여과지속시간 기준 스케줄 작성
    추후 역세조정 편의를 위해 역세는 60분 진행으로 작성, 뒤에서 조정 시 20분으로 조정
    """

    # 여과지별 최대여과지속시간 기준 스케줄 합친 데이터프레임
    schedule_max_ti_all = pd.DataFrame(index = df_pred_ps.index, columns=['location{}'.format(i+1) for i in range(len(list_ji_state))])

    for pond_index, pond in enumerate(list_f_pond_nm):
        # 지별 스케줄 저장용 데이터프레임 생성
        schedule_max_ti = pd.DataFrame(index = df_pred_ps.index, columns=['location{}'.format(pond)])
        
        # 해당 여과지가 여과중일 때 -- 모든 case 테스트 완료
        if list_ji_state[pond_index] == 1:
            for i, idx in enumerate(df_pred_ps.index):
                # 최대 여과지속시간 여부 확인            
                list_fil_ti[pond_index] = list_fil_ti[pond_index] + 10 # 여과지속시간 + 10
                list_bw_wait_ti[pond_index] = list_bw_wait_ti[pond_index] + 10 # 역세대기시간 + 10
                # 최대 여과지속 시간 초과 --> 다음 step : 역세대기중
                if (list_fil_ti[pond_index] > max_ti_min):
                    # 여과 종료 후 나머지 시간 스케줄 작성
                    if len(df_pred_ps.loc[idx:]) <= 4: # 40분 이하로 남은 경우
                        schedule_max_ti.loc[idx : , 'location{}'.format(pond)] = [2 for _ in range(len(df_pred_ps.loc[idx : ]))] # 역세대기중으로 전환
                        break
                    elif (len(df_pred_ps.loc[idx:]) > 4) and (len(df_pred_ps.loc[idx:]) <= 10): # 100분 이하로 남은 경우
                        schedule_max_ti.loc[idx : idx+timedelta(minutes=30), 'location{}'.format(pond)] = [2 for _ in range(4)] # 역세대기중으로 전환
                        schedule_max_ti.loc[idx+timedelta(minutes=40) : , 'location{}'.format(pond)] = [3 for _ in range(len(df_pred_ps.loc[idx+timedelta(minutes=40) : ]))] # 역세중으로 전환
                        break
                    else:
                        schedule_max_ti.loc[idx : idx+timedelta(minutes=30), 'location{}'.format(pond)] = [2 for _ in range(4)] # 역세대기중으로 전환
                        schedule_max_ti.loc[idx+timedelta(minutes=40) : idx+timedelta(minutes=90), 'location{}'.format(pond)] = [3 for _ in range(6)] # 역세중으로 전환
                        schedule_max_ti.loc[idx+timedelta(minutes=100) : , 'location{}'.format(pond)] = [4 for _ in range(len(df_pred_ps.loc[idx+timedelta(minutes=100) : ]))] # 여과대기중으로 전환
                        break
                else:
                    schedule_max_ti.loc[idx, 'location{}'.format(pond)] = 1
            
        # 해당 여과지가 역세대기중일 때
        elif list_ji_state[pond_index] == 2:
            for i, idx in enumerate(df_pred_ps.index):
                if list_bw_wait_ti[pond_index] >= 40: # 역세대기시간이 40분 이상일 경우
                    schedule_max_ti.loc[idx : idx+timedelta(minutes=30), 'location{}'.format(pond)] = [3 for _ in range(4)] # 역세중으로 전환
                    schedule_max_ti.loc[idx+timedelta(minutes=40) : , 'location{}'.format(pond)] = [4 for _ in range(len(df_pred_ps.loc[idx+timedelta(minutes=40) : ]))] # 여과대기중으로 전환
                    break
                else:
                    list_bw_wait_ti[pond_index] = list_bw_wait_ti[pond_index] + 10 # 역세대기시간 + 10
                    schedule_max_ti.loc[idx, 'location{}'.format(pond)] = 2
        
        # 해당 여과지가 역세줄일 때
        elif list_ji_state[pond_index] == 3:
            for i, idx in enumerate(df_pred_ps.index):
                if list_bw_ti[pond_index] >= 60: # 역세동작시간이 60분 이상일 경우
                    schedule_max_ti.loc[idx : , 'location{}'.format(pond)] = [4 for _ in range(len(df_pred_ps.loc[idx:]))] # 여과대기중으로 전환
                    break
                else:
                    list_bw_ti[pond_index] = list_bw_ti[pond_index] + 10
                    schedule_max_ti.loc[idx, 'location{}'.format(pond)] = 3
                    
        # 해당 여과지 여과대기중일 때
        elif list_ji_state[pond_index] == 4:
            idx = df_pred_ps.index[0]
            schedule_max_ti.loc[idx:, 'location{}'.format(pond)] = [4 for _ in range(144)]
        
        # 해당 여과지 시동방수중일 때 -- 고민이 필요.....
        elif list_ji_state[pond_index] == 5:
            idx = df_pred_ps.index[0]
            schedule_max_ti.loc[idx:idx+timedelta(minutes=20), 'location{}'.format(pond)] = [5 for _ in range(3)]
            schedule_max_ti.loc[idx+timedelta(minutes=30):, 'location{}'.format(pond)] = [4 for _ in range(141)]
        
        # 해당 여과지 운휴중일 때
        elif list_ji_state[pond_index] == 6:
            idx = df_pred_ps.index[0]
            schedule_max_ti.loc[idx:, 'location{}'.format(pond)] = [6 for _ in range(144)]
                    
        # 전체 스케줄 표에 통합
        schedule_max_ti_all['location{}'.format(pond)] = schedule_max_ti['location{}'.format(pond)]
    
    return schedule_max_ti_all

def check_wl_max(schedule_max_ti_all, df_wl, current_dt_ts, max_wl):
    """
    최대수위 확인 후 조기종료 진행
    만약 현재 수위가 최대수위를 넘을 경우 역세대기 상태로 전환하도록 스케쥴 수정

    Return - 
        schedule_max_ti_all : 조기종료 적용 후의 최대지속시간 기준 스케쥴
    """
    es_pond = []
    n = 22
    
    for i in range(n):
        if df_wl.loc[current_dt_ts, df_wl.columns[i]] >= (max_wl): 
            schedule_max_ti_all.loc[schedule_max_ti_all.index[0]:schedule_max_ti_all.index[3], schedule_max_ti_all.columns[i]] = [2 for _ in range(4)] # 1시간 역세대기
            schedule_max_ti_all.loc[schedule_max_ti_all.index[4]:schedule_max_ti_all.index[9], schedule_max_ti_all.columns[i]] = [3 for _ in range(6)] # 60분 역세 진행 - 뒷부분 역세조정에서 40분은 여과대기로 전환 예정
            schedule_max_ti_all.loc[schedule_max_ti_all.index[10]:, schedule_max_ti_all.columns[i]] = [4 for _ in range(len(schedule_max_ti_all.loc[schedule_max_ti_all.index[10]:]))] # 나머지 여과대기
            es_pond.append(i+1) # 조기종료 번호 저장

    return schedule_max_ti_all, es_pond

def tune_proc_n(schedule_max_ti_all, df_pred_n_result, list_last_bw_ti, df_pred_ps):
    """
    예측 운영 여과지 수에 맞춰 스케줄 조정 진행
    예측한 수보다 적게 운영할 때만 조정함, 많을 땐 X
    여과대기중인 여과지 없을 경우 다음 index로 pass
    
    """
    # 최대여과지속시간 기준 24시간 여과 운영지 수 계산
    schedule_max_ti_all['여과 운영지 수_maxti'] = schedule_max_ti_all.apply(lambda x: list(x).count(1), axis=1)
    # 예측 운영지 수 merge
    schedule_max_ti_all['여과 운영지 수_pred'] = df_pred_n_result
    #schedule_max_ti_all['여과 운영지 수_pred'] = schedule_max_ti_all['여과 운영지 수_maxti'].values[-1]
    # 최대지속시간 기준 운영지 수와 예측 운영지 수 차이 max값 계산
    max_maxti_pred_diff = schedule_max_ti_all[schedule_max_ti_all['여과 운영지 수_maxti'] < schedule_max_ti_all['여과 운영지 수_pred']].index
    
    # 예측 운영지 수보다 적게 운영되는 시간대에 여과대기중인 여과지 여과중으로 전환
    for i in range(len(max_maxti_pred_diff)):
        # 예측 운영지 수보다 적은 index 중 가장 빠른 시간대
        idx_diff_list =  schedule_max_ti_all[schedule_max_ti_all['여과 운영지 수_maxti'] < schedule_max_ti_all['여과 운영지 수_pred']].index
        if len(idx_diff_list) == 0:
            break
        else:
            idx_diff = idx_diff_list[0]
        # 해당 시간대에 여과대기 중인 여과지 리스트
        list_fil_w_loc_diff = list(schedule_max_ti_all.filter(like='location').loc[idx_diff][schedule_max_ti_all.loc[idx_diff] == 4].index)
        # if 해당 시간대에 여과대기 중인 여과지가 없다면
        if len(list_fil_w_loc_diff) == 0:
            t = timedelta(minutes=10)
            while len(list_fil_w_loc_diff) == 0:
                if idx_diff+t not in schedule_max_ti_all.index:
                    break
                list_fil_w_loc_diff = list(schedule_max_ti_all.filter(like='location').loc[idx_diff + t][schedule_max_ti_all.loc[idx_diff + t] == 4].index)
                t = t + timedelta(minutes=10)
            idx_diff = idx_diff+t-timedelta(minutes=10)
        # 해당 여과지의 인덱스 저장
        list_fil_w_idx_diff = [list(schedule_max_ti_all.columns).index(i) for i in list_fil_w_loc_diff]
        if len(list_fil_w_idx_diff) == 0:
            break
        # 역세 종료한 지 가장 오래된 여과지 인덱스
        min_last_bw_ti_idx = list_last_bw_ti.index(min([list_last_bw_ti[i] for i in list_fil_w_idx_diff]))
        # 해당 여과지 여과중으로 전환(위에서 계산한 idx_diff부터)
        schedule_max_ti_all.loc[idx_diff:,schedule_max_ti_all.columns[min_last_bw_ti_idx]] = [1 for _ in range(len(df_pred_ps.loc[idx_diff:]))] # 여과중으로 전환
        # 여과 운영지 수 update
        schedule_max_ti_all['여과 운영지 수_maxti'] = schedule_max_ti_all[schedule_max_ti_all.columns[:-2]].apply(lambda x: list(x).count(1), axis=1)
    return schedule_max_ti_all

def make_data_wl(df_f_3hours, df_pred_ps, current_dt_ts, minmax_fr, minmax_sp, minmax_le, minmax_ti):
    """
    수위 예측용 데이터셋 생성
    24시간 여과속도, 원수유입유량, 이전 수위, 이전 여과지속시간 Normalization 진행

    Return - 
        df_2hours_10m_sp_fi_24_nor : Normalization 진행된 입력변수로 이루어진 dataframe
    """
    # 여과속도, 원수 유입유량 10분 단위 Resampling
    # 여과속도, 원수 유입유량 merge
    df_3hours_sp_fr = df_f_3hours[['여과속도', '원수유입유량']]
    # 운영지수 t+1 예측 데이터 - 분단위 데이터를 10분단위 데이터로 resampling 처리한다.
    df_3hours_sp_fi_10m = df_3hours_sp_fr.resample(rule='10min', origin='end').mean()
    df_3hours_sp_fi_10m = df_3hours_sp_fi_10m.fillna(method='ffill')
    df_3hours_sp_fi_10m = df_3hours_sp_fi_10m.fillna(method='bfill')
    
    df_f_2hours_sp_fi_10m = df_3hours_sp_fi_10m.tail(12)

    # 원수 유입유량 Normalization - 설정된 원수 유입유량에 대한 최대최소값을 기준으로 평준화 처리를한다.
    df_2hours_10m_fr_nor = normalize_data_by_minmax(df_f_2hours_sp_fi_10m[['원수유입유량']], minmax_fr)

    # 운영 여과지 수 Normalization - 설정된 운영 여과지 수에 대한 최대최소값을 기준으로 평준화 처리를한다.
    df_2hours_10m_sp_nor = normalize_data_by_minmax(df_f_2hours_sp_fi_10m[['여과속도']], minmax_sp)

    # 예측 모델용 데이터 변환
    df_2hours_10m_sp_fi_nor = pd.merge(df_2hours_10m_sp_nor, df_2hours_10m_fr_nor, on='UPD_TI', how='left')

    # 여과지 수위 10분 단위 Resampling
    df_3hours_le_10m = df_f_3hours.filter(like='수위').resample(rule='10min', origin='end').mean()
    df_3hours_le_10m = df_3hours_le_10m.fillna(method='ffill')
    df_2hours_le_10m = df_3hours_le_10m.loc[df_2hours_10m_sp_fi_nor.index]

    # 여과지 수위 Normalization
    for col in df_2hours_le_10m:
        df_2hours_le_10m[col] = normalize_data_by_minmax(df_2hours_le_10m[[col]], minmax_le)

    # 여과지속시간 10분 단위
    df_2hours_ti_10m = df_f_3hours.filter(like='시간').loc[df_2hours_10m_sp_fi_nor.index]

    # 여과지속시간 Normalization
    for col in df_2hours_ti_10m:
        df_2hours_ti_10m[col] = normalize_data_by_minmax(df_2hours_ti_10m[[col]], minmax_ti)

    # 시간/수위/유량/속도 merge
    df_le_10m = pd.concat([df_2hours_ti_10m,df_2hours_le_10m,df_2hours_10m_sp_fi_nor],axis=1)

    # 24시간 이후 여과속도/유입유량 normalization
    list_f_fr_24_norm = normalize_data_by_minmax(df_pred_ps['원수유입유량'], minmax_fr, lst=True) # 24시간 원수 유입유량 normalize
    list_f_sp_24_norm = normalize_data_by_minmax(df_pred_ps['여과속도'], minmax_sp, lst=True) # 24시간 여과속도 normalize

    df_2hours_10m_sp_fi_24_nor = pd.DataFrame(index=df_pred_ps.index)
    df_2hours_10m_sp_fi_24_nor['여과속도'] = list_f_sp_24_norm
    df_2hours_10m_sp_fi_24_nor['원수유입유량'] = list_f_fr_24_norm
    
    return df_2hours_10m_sp_fi_24_nor, df_le_10m
    
def predict_wl(df_pred_ps, df_2hours_10m_sp_fi_24_nor, df_le_10m, list_ji_state, list_f_ti, list_f_pond_nm, steps_10m_model_wl, minmax_le):
    """
    여과지별 수위 예측 진행
    24시간 지속시간/수위/유량/속도 활용하여 지별 수위 예측 진행

    Return - 
        df_le_result : 여과지별 24시간 수위 예측 결과 dataframe
    
    """    
    df_le_result = pd.DataFrame(index = df_pred_ps.index)
    for pond_index, pond in enumerate(list_f_pond_nm):
        if list_ji_state[pond_index] == 1: # 현재 여과중일 때
            if list_f_ti[pond_index] > 200: # 여과지속시간이 200분을 넘었을 때
                list_f_ti_24 = [list_f_ti[0] + t for t in range(10, 1450, 10)] # 해당 여과지의 24시간 여과지속시간 리스트 생성
                list_f_ti_24_norm = normalize_data_by_minmax(list_f_ti_24, minmax_ti, lst=True) # 해당 여과지 24시간 여과지속시간 normalize
        
                # 해당 여과지 columns만 가져오기
                df_le_per = df_le_10m[[df_le_10m.columns[pond_index],df_le_10m.columns[pond_index+22], df_le_10m.columns[-2],df_le_10m.columns[-1]]]
                
                # 수위 예측을 위한 sequence 생성
                step_1_x_pred_le, n_features_pred_le = convert_model_values_step_1(df_le_per, steps_10m_model_wl)
        
                # 10분 후 수위 예측
                pred_le_y = model_wl.predict(step_1_x_pred_le)
        
                # 다음 예측을 위한 변수 생성
                step_n_x_pred_le = step_1_x_pred_le.copy() # sequnece 복사
                pred_le_n_y = pred_le_y.copy() # 결과값 복사
                pred_le_n_y_list = [] # 24시간 예측 결과 저장용 list
                df_le_result_per = pd.DataFrame(index = df_pred_ps.index) # 24시간 예측 결과 DF
        
                # 10분 후 예측값 저장
                pred_le_n_y_list.append(pred_le_y[0][0])
                
                # 24시간 예측 시작
                for index, dt in enumerate(df_pred_ps.index[:-1]):
                    # 다음 시점 추가할 데이터 생성
                    append_val = [list_f_ti_24_norm[index],pred_le_n_y[0][0]]
                    append_val = np.concatenate((append_val,df_2hours_10m_sp_fi_24_nor.loc[dt].values), axis=0)
                    append_val = np.array(append_val).reshape(1,1,n_features_pred_le)
        
                    # 다음 시점 sequence 생성
                    step_n_x_pred_le = step_n_x_pred_le[:,1:,:]
                    step_n_x_pred_le = np.concatenate((step_n_x_pred_le,append_val), axis=1)
        
                    # 다음 시점 predict
                    pred_le_n_y = model_wl.predict(step_n_x_pred_le)
                    
                    # 해당 시점 예측 결과 저장
                    pred_le_n_y_list.append(pred_le_n_y[0][0])
        
                # 24시간 예측 결과 저장
                df_le_result_per['location{}수위'.format(pond)] = pred_le_n_y_list
        
                # Denormalize
                df_le_result_per['location{}수위'.format(pond)] = denormalize_data(df_le_result_per, minmax_le)
                df_le_result['location{}수위'.format(pond)] = df_le_result_per
            else:
                # 수위 예측 해당하지 않는 여과지는 -1 저장
                df_le_result['location{}수위'.format(pond)] = [-1 for _ in range(144)] 
        else:
            # 수위 예측 해당하지 않는 여과지는 -1 저장
            df_le_result['location{}수위'.format(pond)] = [-1 for _ in range(144)] 
            
    return df_le_result

def make_schedule_le(df_pred_ps, df_le_result, max_wl):
    """
    예측 수위 기준 스케줄 생성
    예측 수위가 최대수위를 넘을 경우 여과종료(역세대기)

    Return - 
        schedule_le_all : 예측 수위 기준 24시간 운영 스케줄
    """
    # 예측 수위 기준 스케줄 작성
    schedule_le_all = pd.DataFrame(index = df_pred_ps.index)

    for col in df_le_result.columns:
        new_col = col[:-2]
        schedule_le_all[new_col] = df_le_result[col].apply(lambda x: 1 if x<max_wl else 2) # 여과지별로 한계수위보다 낮은 경우는 여과중, 높은 경우는 역세대기로 전환
        len_bw_wait = len(schedule_le_all[schedule_le_all[new_col] == 2])
        if len_bw_wait > 0:
            idx_bw_wait = schedule_le_all[schedule_le_all[new_col] == 2].index[0] # 역세대기 시작 index
            if (len_bw_wait<=6) : # 역세대기 상태가 6개 이하인 경우
                schedule_le_all.loc[idx_bw_wait:,new_col] = [2 for _ in range(len(schedule_le_all.loc[idx_bw_wait:]))] # 해당시간 이후 모두 역세대기로 전환
            if (len_bw_wait>6) and (len_bw_wait<=12): # 역세대기 상태가 6개 초과 12개 이하인 경우
                schedule_le_all.loc[idx_bw_wait+timedelta(minutes=60):,new_col] = [3 for _ in range(len(schedule_le_all.loc[idx_bw_wait+timedelta(minutes=60) : ]))] # 60분 이후 역세중으로 전환
            elif (len_bw_wait > 12): # 역세대기 상태가 12개 초과인 경우
                schedule_le_all.loc[idx_bw_wait+timedelta(minutes=60):idx_bw_wait+timedelta(minutes=110),new_col] = [3 for _ in range(6)] # 60분 이후 60분동안 역세중으로 전환
                schedule_le_all.loc[idx_bw_wait+timedelta(minutes=120):,new_col] = [4 for _ in range(len(schedule_le_all.loc[idx_bw_wait+timedelta(minutes=120) : ]))] # 120분 이후 여과대기중으로 전환
    
    return schedule_le_all

def tune_bw_ti(schedule_full):
    """
    역세대기, 역세 겹치는 부분 조정 진행
    역세가 중복되서 진행되면 안되기 때문에 겹치는 부분에 대해서 역세대기시간이 더 긴 여과지를 우선으로 스케줄 조정

    Return -
        schedule_full : 역세 스케줄 조정 후의 통합 24시간 운영 스케줄 dataframe
    
    """
    flag=True
    schedule_full['cnt_bw'] = schedule_full.filter(like='location').apply(lambda x: list(x).count(2), axis=1)
    while flag:
        if len(schedule_full[schedule_full['cnt_bw'] == 2]) > 0:
            idx = schedule_full[schedule_full['cnt_bw'] == 2].index
            dup_bw_col = ['location{}'.format(i+1) for i,n in enumerate(schedule_full.filter(like='location').loc[idx].values[0]) if n == 2]

            if len(dup_bw_col) > 1:
                idx01 = schedule_full[schedule_full[dup_bw_col[0]] == 2].index[0]
                idx02 = schedule_full[schedule_full[dup_bw_col[0]] == 2].index[-1]
                idx11 = schedule_full[schedule_full[dup_bw_col[1]] == 2].index[0]
                idx12 = schedule_full[schedule_full[dup_bw_col[1]] == 2].index[-1]

                if idx01 <= idx11:
                    idx3 = idx02 + timedelta(minutes=10)
                    idx4 = idx3 + timedelta(minutes=40)
                    idx5 = idx4 + timedelta(minutes=60)
                    
                    schedule_full.loc[idx11:, dup_bw_col[1]] = [1 for _ in range(len(schedule_full.loc[idx11:]))] # 늦게 역세대기에 들어가는 여과지를 겹치는 만큼 여과 더 진행
                    if idx3 in schedule_full.index:
                        schedule_full.loc[idx3:, dup_bw_col[1]] = [2 for _ in range(len(schedule_full.loc[idx3:]))] # 먼저 역세대기중인 여과지의 역세대기 끝나면 역세대기
                        if idx4 in schedule_full.index:
                            schedule_full.loc[idx4:, dup_bw_col[1]] = [3 for _ in range(len(schedule_full.loc[idx4:]))] # 역세대기 종료 후 역세
                            if idx5 in schedule_full.index:
                                schedule_full.loc[idx5:, dup_bw_col[1]] = [4 for _ in range(len(schedule_full.loc[idx5:]))] # 역세대기 종료 후 역세
                if idx01 > idx11:
                    idx3 = idx12 + timedelta(minutes=10)
                    idx4 = idx3 + timedelta(minutes=40)
                    idx5 = idx4 + timedelta(minutes=60)

                    schedule_full.loc[idx11:, dup_bw_col[1]] = [1 for _ in range(len(schedule_full.loc[idx11:]))] # 늦게 역세대기에 들어가는 여과지를 겹치는 만큼 여과 더 진행
                    if idx3 in schedule_full.index:
                        schedule_full.loc[idx3:, dup_bw_col[1]] = [2 for _ in range(len(schedule_full.loc[idx3:]))] # 먼저 역세대기중인 여과지의 역세대기 끝나면 역세대기
                        if idx4 in schedule_full.index:
                            schedule_full.loc[idx4:, dup_bw_col[1]] = [3 for _ in range(len(schedule_full.loc[idx4:]))] # 역세대기 종료 후 역세
                            if idx5 in schedule_full.index:
                                schedule_full.loc[idx5:, dup_bw_col[1]] = [4 for _ in range(len(schedule_full.loc[idx5:]))] # 역세대기 종료 후 역세
        else:
            flag = False
            
        schedule_full['cnt_bw'] = schedule_full.filter(like='location').apply(lambda x: list(x).count(2), axis=1)
        
    schedule_full = schedule_full.drop(columns=['cnt_bw'])

    return schedule_full

def tune_bw_ti_30(schedule_full, bw_st_ti_list, bw_end_ti_list):
    """
    역세시간 30분으로 조정 (이전에는 중복 제거 등의 이유로 60분이었음)

    Return - 
        schedule_full : 역세시간 조정 후의 24시간 운영 스케쥴 dataframe
    """
    for i, col in enumerate(schedule_full.columns):
        idx = schedule_full[schedule_full[col] == 3].index
        if len(idx) > 0:
            bw_st_dt = bw_st_ti_list[i]
            if bw_st_dt == 0: # 역세중 아닐 때
                if len(idx) >= 4:
                    schedule_full.loc[idx[3]:idx[-1], col] = [4 for _ in range(len(schedule_full.loc[idx[3]:idx[-1]]))]
            else: # 역세중일 때
                if len(idx) >= 3:
                    bw_ed_dt = bw_end_ti_list[i] + timedelta(minutes=10)
                    schedule_full.loc[bw_ed_dt:idx[-1], col] = [4 for _ in range(len(schedule_full.loc[bw_ed_dt:idx[-1]]))]

    return schedule_full

def tune_st_ed_ti(schedule_full, fil_st_ti_list, fil_end_ti_list, bw_st_ti_list, bw_end_ti_list, list_ji_state, max_ti_min):
    """
    최종 스케줄에 맞춰 앞서 설정한 여과시작/종료, 역세시작/종료 시간 조정 및 다음 여과시작/종료시간 업데이트

    Return -
        fil_st_ti_list : 여과시작시간 리스트
        fil_end_ti_list : 여과종료시간 리스트
        bw_st_ti_list : 역세시작시간 리스트
        bw_end_ti_list : 역세종료시간 리스트
        next_fil_st_ti_list : 다음 여과시작시간 리스트
        next_fil_ed_ti_list : 다음 여과종료시간 리스트
    """
    next_fil_st_ti_list = []
    
    for i, col in enumerate(schedule_full.columns):
        # 여과종료시간 update
        tmp_idx_filed = schedule_full[schedule_full[col] == 2].index
        if len(tmp_idx_filed) > 0:
            fil_ed_ti = tmp_idx_filed[0]-timedelta(minutes=10)
            fil_end_ti_list[i] = fil_ed_ti
        # 역세시작/종료시간 update
        tmp_idx_bwed = schedule_full[schedule_full[col] == 3].index
        if len(tmp_idx_bwed) > 0:
            bw_end_ti_list[i] = tmp_idx_bwed[-1]
            if list_ji_state['F_LOCATION_STATE'].values[i] != 3: # 현재 역세중이 아니면 역세 시작시간 update
                bw_st_ti_list[i] = tmp_idx_bwed[0]
        if fil_end_ti_list[i] != 0:
            bw_st_ti_list[i] = fil_end_ti_list[i] + timedelta(minutes=50)
            bw_end_ti_list[i] = bw_st_ti_list[i] + timedelta(minutes=20)
        # 다음 여과시작/종료시간 생성
        tmp_idx_next_filst = schedule_full[schedule_full[col] == 4].index
        if len(tmp_idx_next_filst) > 0:
            if tmp_idx_next_filst[-1] != schedule_full.index[-1]:
                next_fil_st_ti_list.append(tmp_idx_next_filst[-1] + timedelta(minutes=10))
            else:
                next_fil_st_ti_list.append(0)
        else:
            next_fil_st_ti_list.append(0)
        # 여과대기에서 여과중 변경된 여과지의 여과시작시간 및 종료시간 update
        if list_ji_state['F_LOCATION_STATE'].values[i] == 4:
            if schedule_full[schedule_full.columns[i]].head(1).values[0] == 1:
                fil_st_ti_list[i] = schedule_full.head(1).index[0]
                fil_end_ti_list[i] = fil_st_ti_list[i] + timedelta(minutes=max_ti_min)
    
    next_fil_ed_ti_list = [dt + timedelta(minutes=max_ti_min) if dt != 0 else 0 for dt in next_fil_st_ti_list]

    return fil_st_ti_list, fil_end_ti_list, bw_st_ti_list, bw_end_ti_list, next_fil_st_ti_list, next_fil_ed_ti_list   

def bw_ctr_p(now_status, next_status, bw_con, df_wl_now, df_ctr_bw, bw_not_alm, ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list, f_pw):
    """
    전력량 적용할 때의 역세 제어 리스트 생성

    Return - 
        ai_bw_ctr_idx : 역세 제어 진행할 여과지 index
        ai_bw_ctr_list : 역세 제어 진행할 여과지 제어태그 리스트
        ai_alm_list : 역세 제어 진행할 여과지의 알람태그 리스트
    """
    # 전력량 적용
    for i in range(22):
        if (now_status[i] == 2) & (next_status[i] == 3):
            i_nm = i+1
            # 현재 역세중인 여과지 있으면 pass
            if 3 in now_status: 
                print('역세중인 여과지 있음!')
                pass
            # 역세수조수위 낮으면 pass
            elif (bw_con[0] < 2.7) or (bw_con[1] < 2.7):
                print('역세수조수위 낮음!')
                if ai_opr == 2:
                    ai_alm_list.append(bw_not_alm)
                pass
            # 회수조 수위 높으면 pass
            elif (bw_con[2] > 2.5) or (bw_con[3] > 2.5):
                print('회수조 높음!')
                if ai_opr == 2:
                    ai_alm_list.append(bw_not_alm)
                pass
            # 가동전력 수위 높으면 pass
            elif (bw_con[4] > f_pw) or (bw_con[5] > f_pw):
                print('가동전력 높음!')
                if ai_opr == 2:
                    ai_alm_list.append(bw_not_alm)
                pass
            elif i_nm == 1: # 1지
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 1.0: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
            elif i_nm in [2,3,7,8,9,14,16,17,18,20,21,22]:
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 0.8: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
            elif i_nm in [4,5,6,11,12,15,19]:
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 0.9: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
            elif i_nm == 10:
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 1.05: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
            elif i_nm == 13:
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 0.95: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
    return ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list

def bw_ctr(now_status, next_status, bw_con, df_wl_now, df_ctr_bw, bw_not_alm, ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list):
    """
    전력량 적용 안할 때의 역세 제어 리스트 생성
    
    Return - 
        ai_bw_ctr_idx : 역세 제어 진행할 여과지 index
        ai_bw_ctr_list : 역세 제어 진행할 여과지 제어태그 리스트
        ai_alm_list : 역세 제어 진행할 여과지의 알람태그 리스트
    """
    # 전력량 적용안함
    for i in range(22):
        if (now_status[i] == 2) & (next_status[i] == 3):
            i_nm = i+1
            # 현재 역세중인 여과지 있으면 pass
            if 3 in now_status: 
                print('역세중인 여과지 있음!')
                pass
            # 역세수조수위 낮으면 pass
            elif (bw_con[0] < 2.7) or (bw_con[1] < 2.7):
                print('역세수조수위 낮음!')
                if ai_opr == 2:
                    ai_alm_list.append(bw_not_alm)
                pass
            # 회수조 수위 높으면 pass
            elif (bw_con[2] > 2.5) or (bw_con[3] > 2.5):
                print('회수조 높음!')
                if ai_opr == 2:
                    ai_alm_list.append(bw_not_alm)
                pass
            elif i_nm == 1: # 1지
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 1.0: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
            elif i_nm in [2,3,7,8,9,14,16,17,18,20,21,22]:
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 0.8: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
            elif i_nm in [4,5,6,11,12,15,19]:
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 0.9: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
            elif i_nm == 10:
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 1.05: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
            elif i_nm == 13:
                # 여과지 수위 높으면 pass
                if df_wl_now[i] > 0.95: 
                    print('{}지 여과지수위 높음!'.format(i+1))
                    if ai_opr == 2:
                        ai_alm_list.append(bw_not_alm)
                    pass
                else:
                    ai_bw_ctr_list.append(df_ctr_bw.loc[i, 'tag'])
                    ai_bw_ctr_idx.append(i)
    return ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list
###############################################################################################################

############################### 모듈 실행 시 한 번만 불러올 list/scaler/model 선언 ###############################
# 불러올 태그 리스트
tags_list = pd.read_csv(TAG_PATH + '보령_F_taglist.csv')  
tags = tuple(tags_list['tag'])

# 제어 태그 리스트
ctr_list = pd.read_csv(TAG_PATH + '보령_F_ctr_taglist.csv')
df_ctr_bw = ctr_list.loc[:21]
df_ctr_fil = ctr_list.loc[22:43].reset_index(drop=True)
df_ctr_stop = ctr_list.loc[44:].reset_index(drop=True)

# 알람 태그 리스트
alm_list = pd.read_csv(TAG_PATH + '보령_F_alm_taglist.csv')
fil_start_alm = list(alm_list.loc[3:24]['ALM_ID'])
fil_stop_alm = list(alm_list.loc[25:46]['ALM_ID'])
bw_start_alm = list(alm_list.loc[47:68]['ALM_ID'])
bw_not_alm = alm_list.loc[69]['ALM_ID']

# 날짜 타입 설정
datetype = '%Y-%m-%d %H:%M'

# 여과지 번호 리스트
list_f_pond_nm = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]

list_f_pond_state_post_cols = ['여과중', '역세대기중', '역세중', '여과대기중', '시동방수중', '운휴중'] # 여과 상태 리스트

# MinMax Scaling List (변수별 min/max 값)
# 운영 지수 예측 사용 MinMax List
minmax_fr = [[1000, 15000]] # 원수 유입유량 - 여과지 수위 예측에도 사용       
minmax_proc = [[14, 22]] # 운영지수 Normalization
# 운영 지수 예측 사용 MinMax List
minmax_ti = [[0, 4320]] # 여과지속시간
minmax_le = [[0, 3]] # 여과지수위
minmax_sp = [[0, 10]] # 여과속도

# 스케쥴 결과에 사용될 지별 컬럼 리스트
# 급속 여과 공정 processing schedule - 5 부분에 수위예측 값 연산부분에서 사용됨
list_f_schedule_cols = []
for pond in list_f_pond_nm:
    list_f_schedule_cols.append('location'+str(pond))

# 여과 운영지 수 Sequence Size 설정
steps_10m_model_n = 12
steps_10m_model_wl = 12
model_n = keras.models.load_model(MODEL_PATH + 'model1_n_F')
model_wl = keras.models.load_model(MODEL_PATH + 'model2_wl_F')

@log_perform
###################################### main 실행 함수 ######################################
def perform(db, job_datetime=None):
    '''
    여과지 운영지 수 / 수위 예측 및 24시간 스케줄 생성

    진행순서
    1. 데이터 로드
    2. 화면설정값 로드
    3. 데이터 전처리
    4. 모델 입력용 데이터 생성
    5. 운영지수 예측 및 스케쥴 생성
    6. 수위 예측 및 스케쥴 생성
    7. 스케쥴 조정
    8. ai_rt 저장용 데이터 생성
    9. 제어 및 알람 진행
    10. 결과 저장
    
    '''
    print('---------------- 공정 실행 ----------------')
    start = time.time() # 실행시간 계산용
    
    # Read Data
    if job_datetime is None:
        f_rt_df = db.read_rt_subday_max('TB_F_RT', tags)
    else:
        f_rt_df = db.read_rt_subday_etime('TB_F_RT', tags, job_datetime)
    if len(f_rt_df) <= 0:
        return
    
    # column 순서 조정(편의성)
    f_rt_df = f_rt_df[list(tags_list['tag'])]
    # column명 description으로 조정(편의성)
    f_rt_df.columns = tags_list['desc']

    # 기준시간 저장
    current_dt = f_rt_df.index[-1].strftime(datetype)
    current_dt_ts = datetime.strptime(current_dt, '%Y-%m-%d %H:%M')
    
    # 최대여과지속시간 설정값 가져오기
    max_ti_min, max_wl, f_pw, opr_ji_list, ai_opr = get_init(db, 'TB_AI_F_INIT')
    
    ############################### 데이터 전처리 #1 ###############################
    # 중복 index 제거
    f_df_filtered = drop_duplicate_rows(f_rt_df)
    
    # 결측치 처리
    # 규칙1 : 개별 컬럼에서 1시간 이상 결측 발생한 경우 제거
    # 규칙2 : 전체 컬럼에서 과반 이상에서 결측 발생한 경우 제거
    result = check_drop_missing(f_df_filtered)
    f_df_filtered = f_df_filtered.drop(index = result[result == True].index)
    
    # 시간 index 설정 - 중복/결측 처리 후 빈 시간대 발생 시 채우기 위함
    time_df = pd.DataFrame(index = pd.date_range(start = current_dt_ts - timedelta(days = 7), end = current_dt_ts, freq = '1min'))
    f_df_filtered = f_df_filtered.merge(time_df, how = 'right', left_index = True, right_index = True)
    f_df_filtered = f_df_filtered.fillna(method = 'bfill').fillna(method = 'ffill')
    f_df_filtered.index.name = 'UPD_TI'

    ############################### 데이터 전처리 #2 ###############################
    # 범주형/연속형 변수 구분
    df_cat = f_df_filtered[f_df_filtered.columns[:132]] # 범주형 변수 데이터프레임
    df_con = f_df_filtered[f_df_filtered.columns[132:]] # 연속형 변수 데이터프레임
    
    # # 역세 조건 dataframe 생성
    # f_df_bw_condition = f_df_filtered[['보령(정) 역세척수조 #1 수위', '보령(정) 역세척수조 #2 수위', '보령(정) 회수조 #1 수위', '보령(정) 회수조 #2 수위', '보령(정) 특고압반(PE-04-1) 유효전력 KW']]
    # f_df_filtered = f_df_filtered.drop(columns = ['보령(정) 역세척수조 #1 수위', '보령(정) 역세척수조 #2 수위', '보령(정) 회수조 #1 수위', '보령(정) 회수조 #2 수위', '보령(정) 특고압반(PE-04-1) 유효전력 KW'])
    
    # 역세 조건 dataframe 생성
    f_df_bw_condition = f_df_filtered[['보령(정) 역세척수조 #1 수위', '보령(정) 역세척수조 #2 수위', '보령(정) 회수조 #1 수위', '보령(정) 회수조 #2 수위', '보령(정) 특고압반(PE-04-1) 유효전력 KW', '보령(정) 특고압반(PE-04) 유효전력 KW']]
    f_df_filtered = f_df_filtered.drop(columns = ['보령(정) 역세척수조 #1 수위', '보령(정) 역세척수조 #2 수위', '보령(정) 회수조 #1 수위', '보령(정) 회수조 #2 수위', '보령(정) 특고압반(PE-04-1) 유효전력 KW', '보령(정) 특고압반(PE-04) 유효전력 KW'])

    # 범주형 변수 전처리 (밸브 조합에 따른 여과지 상태 및 운영 여과지 수 생성)
    df_status, df_status_list = eda_cat(df_cat, opr_ji_list)
    list_f_proc_full_nm = make_col_list(df_status)
    
    # 연속형 변수 전처리
    # 지별 시간 변수
    df_time = df_con[df_con.columns[:22]].astype('float64')
    # 역세 후 대기시간
    df_bw_time = cal_bw_time(df_status).astype('int')
    # 지별 탁도 전처리
    df_tbi_per = eda_tbi_per(df_con)
    # 지별 수위 전처리
    df_wl = eda_wl(df_con)
    # 유량 전처리(원수 유입유량, 여과지 유출유량)
    df_fri_in, df_fri_out, df_speed = eda_fri(df_con, df_status)
    # 탁도 전처리(침전수 탁도, 원수 탁도)
    df_tbie, df_tbi = eda_tbi(df_con)
    
    # data merge
    data_list = [df_status, df_time, df_tbi_per, df_wl, df_fri_in, df_fri_out, df_speed, df_tbie, df_tbi]
    df_f_rn = reduce(lambda left, right: pd.merge(left, right, how='left', left_index=True, right_index=True), data_list)

    # 여과지 지별 상태
    list_ji_state = cal_state(df_f_rn.loc[[current_dt_ts]], list_f_pond_nm, list_f_proc_full_nm) # 여과지별 상태
    
    # 여과지 지별 여과시작/종료, 역세시작/종료 시간
    fil_st_ti_list, fil_end_ti_list, bw_st_ti_list, bw_end_ti_list = cal_fil_bw_st_end_ti(df_f_rn, df_time, list_ji_state, current_dt_ts, max_ti_min)
    
    # 24시간 유입유량 산출
    df_future_fr = get_future_fr(df_f_rn, current_dt_ts)
    
    # 모델 예측에 사용되는 만큼만 저장
    df_f_3hours = df_f_rn.tail(140)
    
    # 운영 여과지 수 예측
    df_pred_n_result, df_future_fr_10m, df_f_2hours_10m = predict_proc_n(df_future_fr, df_f_3hours, current_dt_ts, minmax_proc, steps_10m_model_n)

    # 운영 여과지 수 = 22지
    if df_pred_n_result.loc[current_dt_ts + timedelta(minutes=10)].values[0] < 22:
        df_pred_n_result['ai_f_operation_count'] = 22
    
    # 24시간 유입유량으로 여과속도 산출
    df_pred_ps, df_2hours_nstep, future_fr_index = make_friin_speed(df_pred_n_result, df_f_2hours_10m, df_future_fr_10m, df_f_3hours, current_dt_ts)
    
    # 여과지속시간, 역세대기시간, 역세동작시간 산출
    list_fil_ti = df_time.loc[current_dt_ts].tolist() # 여과지속시간
    list_bw_wait_ti = [sum(df_f_rn.filter(like='#{}지역세대기'.format(pond)).values)[0] for pond in list_f_pond_nm] # 역세대기시간
    list_bw_ti = [int((current_dt_ts - bw_st_ti_list[i]).total_seconds() / 60) if (list_ji_state.T.values[0][i] == 3) else 0 for i in range(22)] # 역세동작시간
    list_fil_wait_ti = [sum(df_f_rn.filter(like='#{}지여과대기'.format(pond)).values)[0] for pond in list_f_pond_nm] # 여과대기시간
    
    # 최대여과지속시간 기준 스케줄 생성
    schedule_max_ti_all = make_schedule_max_ti(df_pred_ps, list_ji_state['F_LOCATION_STATE'].values, list_fil_ti,
                                            list_bw_wait_ti, list_bw_ti, current_dt_ts, max_ti_min, list_f_pond_nm)
    
    # 조기종료 확인 및 업데이트
    schedule_max_ti_all, es_pond = check_wl_max(schedule_max_ti_all, df_wl, current_dt_ts, max_wl)
    
    # 여과지별 마지막 역세 종료 시간
    list_last_bw_ti = [find_prev_state_start_ti(df_status_list[i], '#{}지역세중'.format(i+1), comp_val = 1)[1] for i in range(22)]
    
    # 예측 운영지 수에 맞춰 스케줄 조정
    schedule_max_ti_all = tune_proc_n(schedule_max_ti_all, df_pred_n_result, list_last_bw_ti, df_pred_ps)
    
    ######################################### 여과지 수위 예측 #########################################
    df_2hours_10m_sp_fi_24_nor, df_le_10m = make_data_wl(df_f_3hours, df_pred_ps, current_dt_ts, minmax_fr, minmax_sp, minmax_le, minmax_ti)
    
    list_f_ti = df_time.tail(1).values[0]
    df_le_result = predict_wl(df_pred_ps, df_2hours_10m_sp_fi_24_nor, df_le_10m, list_ji_state['F_LOCATION_STATE'].values, list_f_ti, list_f_pond_nm, steps_10m_model_wl, minmax_le)
    
    # 예측 수위 기준 스케줄 생성
    schedule_le_all = make_schedule_le(df_pred_ps, df_le_result, max_wl)
    
    ######################################### 2개 스케줄 통합 #########################################
    #schedule_full = make_schedule_full(df_pred_ps, schedule_max_ti_all, schedule_le_all)
    schedule_full = schedule_max_ti_all[schedule_max_ti_all.columns[:22]].copy() # 수위 모델 예측력 증가할 때까지 임시
    
    # 역세 중복 피하기 위한 역세 시점 조정
    schedule_full = tune_bw_ti(schedule_full)
    
    ######################################### 역세 진행 시간 30분으로 조정 #########################################
    schedule_full = tune_bw_ti_30(schedule_full, bw_st_ti_list, bw_end_ti_list)

    ######################################### in_val 생성 #########################################
    f_location_state = list_ji_state.to_dict()
    f_fil_ing = pd.DataFrame(df_status.filter(like='여과중').tail(1).values, columns=schedule_full.columns, index=['F_FIL_ING']).T.to_dict()
    f_bw_wait = pd.DataFrame(df_status.filter(like='역세대기중').tail(1).values, columns=schedule_full.columns, index=['F_BW_WAIT']).T.to_dict()
    f_bw_ing = pd.DataFrame(df_status.filter(like='역세중').tail(1).values, columns=schedule_full.columns, index=['F_BW_ING']).T.to_dict()
    f_fil_wait = pd.DataFrame(df_status.filter(like='여과대기중').tail(1).values, columns=schedule_full.columns, index=['F_FIL_WAIT']).T.to_dict()
    f_dr_ing = pd.DataFrame(df_status.filter(like='시동방수중').tail(1).values, columns=schedule_full.columns, index=['F_DR_ING']).T.to_dict()
    f_rest = pd.DataFrame(df_status.filter(like='운휴중').tail(1).values, columns=schedule_full.columns, index=['F_REST']).T.to_dict()
    f_time_bw_per = df_bw_time.to_dict()
    f_time_per = pd.DataFrame(df_time.tail(1).values, columns=schedule_full.columns, index=['F_TIME_PER']).T.astype('int').to_dict()
    f_tbi_per = pd.DataFrame(df_tbi_per.tail(1).values, columns=schedule_full.columns, index=['F_TBI_PER']).T.to_dict()
    f_wl_per = pd.DataFrame(df_wl.tail(1).values, columns=schedule_full.columns, index=['F_WL_PER']).T.to_dict()
    f_fri_in = {'F_FRI_IN' : df_fri_in.tail(1).values[0][0]}
    f_fri_out = {'F_FRI_OUT' : df_fri_out.tail(1).values[0][0]}
    f_tbi = {'F_TBI' : df_tbi.tail(1).values[0][0]}
    f_tbi_e = {'F_TBI_E' : df_tbie.tail(1).values[0][0]}
    f_speed = {'F_SPEED' : df_speed.tail(1).values[0][0]}
    f_num_fil = {'F_NUM_FIL' : float(df_status.filter(like='여과중').tail(1).values.sum())}
    
    in_val = {**f_location_state, **f_fil_ing, **f_bw_wait, **f_bw_ing, **f_fil_wait, **f_dr_ing, **f_rest,
              **f_time_bw_per, **f_time_per, **f_tbi_per, **f_wl_per, **f_fri_in, **f_fri_out, **f_tbi, 
              **f_tbi_e, **f_speed, **f_num_fil}
    
    ######################################### out_val 생성 #########################################
    date_str = [datetime.strftime(idx,datetype) for idx in schedule_full.index]
    fil_st_ti_list, fil_end_ti_list, bw_st_ti_list, bw_end_ti_list, next_fil_st_ti_list, next_fil_ed_ti_list = tune_st_ed_ti(schedule_full, fil_st_ti_list, fil_end_ti_list, bw_st_ti_list, bw_end_ti_list, list_ji_state, max_ti_min)
    
    ai_f_num_fil = pd.DataFrame(df_pred_n_result.values, columns=['AI_F_NUM_FIL'], index=date_str).to_dict()
    ai_f_wl = {'AI_F_WL' : pd.DataFrame(df_le_result.values, columns=schedule_full.columns, index=date_str).to_dict()}
    list_ai_fi_time = [(fil_end_ti_list[i] - fil_st_ti_list[i]).total_seconds()/60 if fil_st_ti_list[i]!=0 else 0 for i in range(22)]
    ai_f_time = pd.DataFrame(list_ai_fi_time, columns=['AI_F_TIME'], index=schedule_full.columns).astype('int').to_dict()
    list_ai_f_bw_start_time = [(t - current_dt_ts).total_seconds()/60 if t != 0 else 0 for t in bw_st_ti_list]
    ai_f_bw_start_time = pd.DataFrame(list_ai_f_bw_start_time, columns=['AI_F_BW_START_TIME'], index=schedule_full.columns).astype('int').to_dict()
    schedule_max_ti_all.index = date_str
    ai_f_schedule_max_ti = {'AI_F_SCHEDULE_MAX_TI' : schedule_max_ti_all[schedule_max_ti_all.columns[:22]].to_dict()}
    schedule_le_all.index = date_str
    ai_f_schedule_wl = {'AI_F_SCHEDULE_WL' : schedule_le_all[schedule_le_all.columns].to_dict()}
    schedule_full.index = date_str
    ai_f_schedule_final = {'AI_F_SCHEDULE_FINAL' : schedule_full[schedule_full.columns].to_dict()}
    df_ai_f_location_operation = pd.DataFrame(columns = schedule_full.columns, index=['start', 'end', 'bw_start', 'bw_end', 'next_start', 'next_end'])
    df_ai_f_location_operation.loc['start'] = [datetime.strftime(t, datetype) if t !=0 else '0' for t in fil_st_ti_list]
    df_ai_f_location_operation.loc['end'] = [datetime.strftime(t, datetype) if t !=0 else '0' for t in fil_end_ti_list]
    df_ai_f_location_operation.loc['bw_start'] = [datetime.strftime(t, datetype) if t !=0 else '0' for t in bw_st_ti_list]
    df_ai_f_location_operation.loc['bw_end'] = [datetime.strftime(t, datetype) if t !=0 else '0' for t in bw_end_ti_list]
    df_ai_f_location_operation.loc['next_start'] = [datetime.strftime(t, datetype) if t !=0 else '0' for t in next_fil_st_ti_list]
    df_ai_f_location_operation.loc['next_end'] = [datetime.strftime(t, datetype) if t !=0 else '0' for t in next_fil_ed_ti_list]
    ai_f_location_operation = {'AI_F_LOCATION_OPERATION' : df_ai_f_location_operation.to_dict()}
    
    out_val = {**ai_f_num_fil, **ai_f_wl, **ai_f_time, **ai_f_bw_start_time, **ai_f_schedule_max_ti, 
               **ai_f_schedule_wl, **ai_f_schedule_final, **ai_f_location_operation}
    
    ######################################### 주요인자 저장 #########################################
    row_in_fr = {'b_in_fr' : f_df_filtered.tail(1)['보령(정) 원수 유입유량 순시'].values[0].astype('float64')}
    row_out_fr = {'f_out_fr' : f_df_filtered.tail(1)['보령(정) 여과지 총 유출유량순시'].values[0].astype('float64')}
    row_tbi_e = {'e1_tb_b' : f_df_filtered.tail(1)['보령(정) 침전수 탁도'].values[0].astype('float64')}
    row_f_sp = {'f_speed' : df_speed.tail(1).values[0][0]}
    
    ai_factor = {**row_in_fr, **row_tbi_e, **row_f_sp, **row_out_fr}

    in_val_json = json.dumps([in_val])
    out_val_json = json.dumps([out_val])
    ai_factor_json = json.dumps([ai_factor])

    ########################### 제어 및 알람 ###########################
    now_status = list_ji_state.T.values[0]
    next_status = schedule_full.head(1).values[0]
    
    bw_con = f_df_bw_condition.tail(1).values[0] # 역세 조건
    df_wl_now = df_wl.tail(1).values[0]          # 현재 여과지 수위

    ai_ctr_list = []
    ai_ctr_idx = []
    ai_alm_list = []
    ai_bw_ctr_list = []
    ai_bw_ctr_idx = []
    
    # 여과종료
    tmp_fil_st_list = []
    for i in range(22):
        # 여과종료
        if (now_status[i] == 1) & (next_status[i] == 2):
            if 2 in now_status: # 현재 역세대기 중인 여과지 있으면 pass
                pass
            else:
                if len(tmp_fil_st_list) == 0:
                    ai_ctr_list.append(df_ctr_stop.loc[i, 'tag'])
                    ai_ctr_idx.append(i)
                    tmp_fil_st_list.append(i)
                    if ai_opr == 2:
                        ai_alm_list.append(fil_stop_alm[i])
                else:
                    pass

    # 여과시작
    for i in range(22):
        # 여과시작
        if (now_status[i] == 4) & (next_status[i] == 1):
            ai_ctr_list.append(df_ctr_fil.loc[i, 'tag'])
            ai_ctr_idx.append(i)
            if ai_opr == 2:
                ai_alm_list.append(fil_start_alm[i])

    # 역세시작
    # 일요일
    tmp_ctdt = current_dt_ts
    if tmp_ctdt.weekday() == 6:
        ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list = bw_ctr(now_status, next_status, bw_con, df_wl_now, df_ctr_bw, bw_not_alm, ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list)
    # 다른 요일
    else:
        # 야간 (전력량 적용 안함)
        if (tmp_ctdt > datetime(tmp_ctdt.year, tmp_ctdt.month, tmp_ctdt.day, 22, 00)) or (tmp_ctdt < datetime(tmp_ctdt.year, tmp_ctdt.month, tmp_ctdt.day, 8, 00)):
            ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list = bw_ctr(now_status, next_status, bw_con, df_wl_now, df_ctr_bw, bw_not_alm, ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list)
        # 야간 아닐 때 (전력량 적용 함 / bw_ctr_p함수 내 기준값 확인, 현재 2900)
        else:
            ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list = bw_ctr_p(now_status, next_status, bw_con, df_wl_now, df_ctr_bw, bw_not_alm, ai_bw_ctr_idx, ai_bw_ctr_list, ai_alm_list, f_pw)
    
    # 역세 시작 여과지가 2개 이상일 경우 역세대기시간이 긴 여과지부터 역세 시작
    if len(ai_bw_ctr_idx) > 1:
        bw_ti_current = df_bw_time.tail(1).values[0]
        # bw_ti_current = np.array([0,0,1300,1600,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        max_ti = np.max(bw_ti_current[ai_bw_ctr_idx])
        bw_ti_max_idx = np.where(bw_ti_current == max_ti)[0][0]
        ai_ctr_list.append(df_ctr_bw.loc[bw_ti_max_idx, 'tag'])
        ai_ctr_idx.append(bw_ti_max_idx)
        if ai_opr == 2:
            ai_alm_list.append(bw_start_alm[bw_ti_max_idx])
    elif len(ai_bw_ctr_idx) == 1:
        bw_idx = ai_bw_ctr_idx[0]
        ai_ctr_list.append(df_ctr_bw.loc[bw_idx, 'tag'])
        ai_ctr_idx.append(bw_idx)
        if ai_opr == 2:
            ai_alm_list.append(bw_start_alm[bw_idx])

    ######################################### 제어 및 알람 #########################################
    run_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    df_factor = pd.DataFrame(columns = ['proc_cd', 'disinfection_index', 'rnti', 'factor'], index = [run_time])
    df_factor['proc_cd'] = 'F'
    df_factor['disinfection_index'] = 'NONE'
    df_factor['rnti'] = run_time
    df_factor['factor'] = ai_factor_json 
    
    run_time = f'"{run_time}"'

    if ai_opr == 1:
        if len(ai_ctr_list) == 0:
            pass
        else:
            for ctr_id in ai_ctr_list:
                ctr_id = f'"{ctr_id}"'
                db.save_ctr('TB_AI_F_CTR', run_time, run_time, ctr_id, 1, 0, 0, 0)
                print('제어 적재 완료')
            db.save_ai_factor(df_factor)

    if ai_opr == 2:
        if len(ai_alm_list) == 0:
            pass
        else:
            for alm_id in ai_alm_list:
                db.save_alm('TB_AI_F_ALM', alm_id, run_time)
                print('알람 적재 완료')
            if len(ai_ctr_list) > 0:
                for ctr_id in ai_ctr_list:
                    ctr_id = f'"{ctr_id}"'
                    db.save_ctr('TB_AI_F_CTR', run_time, run_time, ctr_id, 1, 0, 0, 0)
                    print('제어 적재 완료')
                db.save_ai_factor(df_factor)

    ######################################### 결과 저장 #########################################
    # 여과 공정 결과 테이블 형태의 DataFrame 생성
    df_final = pd.DataFrame(columns = ['upd_ti', 'AI_OPR', 'IN_VAL', 'OUT_VAL'], index=[current_dt])
    df_final['upd_ti'] = datetime.now()
    df_final['AI_OPR'] = ai_opr
    df_final['IN_VAL'] = in_val_json
    df_final['OUT_VAL'] = out_val_json
    db.save_ai_rt('TB_AI_F_RT', df_final)   

    # 메모리 증가 방지용 session clear
    K.clear_session()

    if len(ai_ctr_list) > 0:
        fil_stop_flag = False
        for ctr_id in ai_ctr_list:
            if ctr_id in list(df_ctr_stop['tag']):
                time.sleep(120)
                ctr_id = f'"{ctr_id}"'
                run_time2 = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                run_time2 = f'"{run_time2}"'
                db.save_ctr('TB_AI_F_CTR', run_time2, run_time2, ctr_id, 0, 1, 0, 0)
                fil_stop_flag = True
        if fil_stop_flag == False:
            time.sleep(480)
        else:
            time.sleep(300)
    
    print(f"{time.time() - start:.5f} sec")
    print('---------------- 공정 실행 완료 (1 cycle) ----------------') 
    