##########
# 침전 DEF 소스 파일
# author : 김준수
# since : 2024. 10. 07
# version : 1.0
##########

# 데이터
import pandas as pd
import numpy as np
import sys
import os
from scipy import signal

# 날짜 & 시간
from datetime import timedelta
from datetime import datetime
import time

# 사용자 정의 클래스 패스
PROC_PATH = os.path.dirname(os.path.abspath('__file__')) # (.ipynb)
BASE_PATH = os.path.dirname(PROC_PATH)
ROOT_PATH = os.path.dirname(BASE_PATH)
sys.path.append(PROC_PATH + '/common')
sys.path.append(BASE_PATH + '/common')
sys.path.append(ROOT_PATH + '/common')
PROC_PATH = '/home/app/br/e'

from db_util import DBUtil
from config import Config
from sqlalchemy import text

import warnings
warnings.filterwarnings('ignore')

class CommonSedimentation:
    """
        AI 결과 산출 공통함수 클래스
            - 공통함수
    """
    
    def __init__(self):
        """
            CommonSEdimentation Class 초기화
                - 사용자 입력값
        """
        self.db = DBUtil(Config)

        self.sludge_limit = None  # 대차 운행 기준 슬러지 양
        self.scraper_standby = None  # 대차 운행 대기 최대 일수
        self.scraper_run_distance = None # 침전지 대차 총 운전 거리 (편도 거리)
        self.scraper_run_times = None # 침전지 대차 총 운전 시간
        self.df = None
        self.df_init = self.get_df_init()
        self.obj = {
            'UPD_TI': None,
            'RNTI': None,
            'TAG_SN': None,
            'TAG_VAL': "0",
            'TAG_CMP_VAL': "0",
            'KFK_FLG': 0,
            'CTR_FLG': 0
        }


    def set_com_df( self, df ):
        """
            @SETTER dataframe
                - 실시간 데이터 set
        """
        self.df = df


    def get_com_df( self, tags, job_datetime ):
        """
            현재부터 과거 7일동안 SCADA 데이터 가져오기
                - 실시간 7일치 데이터
        """
        
        # 실제
        if job_datetime is None:

            self.df = self.db.read_rt_subday_max('TB_E_RT', tags)

        else:
            
            etime = job_datetime.strftime('%Y-%m-%d %H:%M:%S')
            self.df = self.db.read_rt_subday_etime('TB_E_RT', tags, etime)
    
        return self.df
    
    
    def get_df_init( self ):
        """
            침전공정 설정 값 조회 및 처리
            @return
                - 사용자 설정값
        """
        sql = '''
                SELECT ITM as item, TAG_SN, INIT_VAL as value
                FROM TB_AI_E_INIT
            '''

        df_init = self.db.read(sql.strip())
        # df_init = pd.read_csv(PROC_PATH + '/data/df_init.csv')

        self.sludge_limit           = df_init.set_index('item').at['e_sc_set_sludge_q', 'value'] # 대차 운행 기준 슬러지 양
        self.scraper_standby        = df_init.set_index('item').at['e_sc_set_max_wait', 'value'] # 대차 운행 대기 최대 일수
        self.scraper_run_distance   = df_init.set_index('item').at['e_set_lt', 'value'] # 침전지 대차 총 운전 거리 (편도 거리)
        self.scraper_run_times      = df_init.set_index('item').at['e_sc_set_ti', 'value'] # 침전지 대차 총 운전 시간

        return df_init


    def get_default_constant( self ):
        """
            침전공정 설정 값 보내주는 함수
            @return
            - 수집기 운행 기준 슬러지 양, 수집기 최대 대기일, 수집기 운행거리, 수집기 운행 시간
        """
        return self.sludge_limit, self.scraper_standby, self.scraper_run_distance, self.scraper_run_times # type: ignore


    def get_limit_outlier(self, df, col, max_val, min_val ):
        """
            이상치 제거 및 대체하는 함수
            @return
                - 이상치 제거된 실시간 데이터
        """
        outlier_index = df[(df[col] >= max_val) | (df[col] <= min_val)].index
        df.loc[outlier_index, col] = np.nan
        df_subset = df.interpolate(method='values')

        return df_subset
    
    
    def get_run_oper_cnt(self, df_latest, col_dict):
        """
            운영되는 침전지 수를 파악하기 위한 함수
            @return
                - 운영중인 침전지 수
        """
        g_op_cnt = 0

        for g_no in range(1, 9):
            cnt_flag = self.get_oper_flag(df_latest, col_dict, g_no)
            g_op_cnt += 1 if int(cnt_flag) == 0 else 0
            
        return g_op_cnt
    
    
    def get_oper_flag(self, df_latest, col_list, g_number):
        """ 
            침전지 운영상태 확인
            
            혼화/응집 유입밸브로 침전지 운영여부 확인
            침전지 번호가 들어오면 유입밸브 신호 총합을 반환
            @return
                g_flag: 
                    1: 침전지 운영 안함
                    0: 침전지 운영 함
        """
        col = col_list[g_number][:3]
        
        g_flag_sum = df_latest[col].sum(axis=1)
        g_flag = 0 if int(g_flag_sum) >= 0 else 1
        
        return g_flag


    def get_control_flag(self, df_init, g_number):
        """
            침전지별 개별 AI 모드 상태 확인 하는 함수
            @return
                - 지별 AI모드상태
        """
        g_chk_val = None

        if df_init.empty:
            g_chk_val = self.df_init.set_index('item').at['e_sc_set{}'.format(g_number), 'value']
            oper_mode = self.df_init.set_index('item').at['e_operation_mode', 'value']
        else:
            g_chk_val = df_init.set_index('item').at['e_sc_set{}'.format(g_number), 'value']
            oper_mode = df_init.set_index('item').at['e_operation_mode', 'value']

        # g_flag가 0이면 자율운영 제외 1이면 자율운영
        g_flag = 1 if int(g_chk_val) == 1 else 0

        return g_flag, oper_mode


    def chg_control_value(self, g_number, mode='start'):
        """
            개별 침전지 상태 제어를 위해 생성한 함수
                - 침전지 전/후진 제어
        """
        dic_info = {
            'item' : 'e_sc_set{}'.format(g_number),
            'value' : 1 if mode == 'start' else 0
            }

        self.update_ai_sedimentation_init(dic_info)
        

    def get_bogie_speed_time( self, df, col_dict, g_no ):
        """
            침전지 대차 총 운행시간, 속도 추출 함수
            @return
                - 총 운행시간, 대차속도
        """
        move_time, speed = 0, 0
        
        try:

            # 지별 수집기 대차 속도가 Hz로 표기 20Hz = 1분에 0.2m 이동
            #speed = df_bogie[g_key].values[0] / 100
            if speed == 0.0:
                speed = 0.3

            colist = col_dict[g_no][3:5]
            g_df = df[colist].astype("object").resample('1Min').ffill()

            # 슬러지 수집기가 전진에서 후진 혹은 후진에서 전진으로 넘어가는 시간 확인
            # shift를 이용하여 변수 값이 바뀌는 지점 찾기
            df_g_forback = g_df[(g_df[colist[0]] != g_df[colist[0]].shift(-1)) |
                                    (g_df[colist[1]] != g_df[colist[1]].shift(-1))]
            
            # 바뀌는 지점의 datetime 인덱스로 전진, 후진 시작 지점 컬럼 생성
            rtn_forward = df_g_forback[(df_g_forback[colist[0]] == 0)]
            rtn_forward["rtn_forward"] = rtn_forward.index
            rtn_backward = df_g_forback[(df_g_forback[colist[1]] == 0)]
            rtn_backward["rtn_backward"] = rtn_backward.index
                
            g_df = pd.merge(g_df, rtn_forward[["rtn_forward"]], left_index=True, right_index=True, how='left')
            g_df = pd.merge(g_df, rtn_backward[["rtn_backward"]], left_index=True, right_index=True, how='left')
            g_df = g_df.fillna(method='ffill')
            
            # 슬러지 수집기 운영시간 계산
            # 슬러지 수집기 운영시간 = 현시점 시간 - 슬러지수집 전진/후진 시작시간      
            g_df["sludge_runtime"] = 0
            g_df["sludge_runtime"] = np.where(g_df[colist[0]] == 1, g_df.index - g_df["rtn_forward"], g_df["sludge_runtime"])
            g_df["sludge_runtime"] = np.where(g_df[colist[1]] == 1, g_df.index - g_df["rtn_backward"], g_df["sludge_runtime"])
            g_df["sludge_runtime"] = (g_df['sludge_runtime'].dt.total_seconds()/60).round(3)
            g_df2 = g_df[((g_df.index == g_df.rtn_forward) | (g_df.index == g_df.rtn_backward)) & (g_df['sludge_runtime'] > 0)]
            
            move_time = round(g_df2[~g_df2['sludge_runtime'].isnull()].tail(5)['sludge_runtime'].mean())
            #del [[df_bogie]]
        except:
            speed = 0.3
            move_time = 245
            
        return move_time, speed

    def scraper_forward_start(self, df, col_dict, g_number):
        """
            슬러지 수집기 전진시작를 확인하는 함수
            @return
                - 전진시작 여부
        """
        colist = col_dict[g_number][3:5]
        df_g = df[colist].copy()
        rtn_value = df_g[colist[0]].tail(1).item()
        
        return rtn_value
    
    def scraper_forward_end(self, df, col_dict, g_number):
        """
            슬러지 수집기 전진완료를 확인하는 함수
            @return
                - 전진완료 여부
        """
        colist = col_dict[g_number][3:5]
        df_g = df[colist].copy()
        g_df = df_g[( df_g[colist[0]] == 1 ) & ( df_g[colist[0]] != df_g[colist[0]].shift(-1) ) & ( df_g[colist[0]].shift(-1) == 0)]
        rtn_time = rtn_value = g_df[colist[0]].tail(1).index.item()
        rtn_value = g_df[colist[0]].tail(1).item()
        
        return rtn_value, rtn_time

    def scraper_backward_start(self, df, col_dict, g_number):
        """
            슬러지 수집기 후진시작를 확인하는 함수
            @return
                - 후진시작 여부
        """
        colist = col_dict[g_number][3:5]
        df_g = df[colist].copy()
        g_df = df_g[( df_g[colist[1]] == 0 ) & ( df_g[colist[1]] != df_g[colist[1]].shift(-1) ) & ( df_g[colist[1]].shift(-1) == 1)]
        rtn_value = df_g[colist[1]].tail(1).item()
        rtn_time = g_df[colist[1]].tail(1).index.item()
        
        return rtn_value

    
    def get_scraper_position(self, df, move_tot_time, col_dict, g_number):
        """ 
            슬러지 수집기 위치 판단 함수
            @return
                - 슬러지수집기 위치
        """
        colist = col_dict[g_number][5]
        g_df = df[colist].astype("object").resample('1Min').ffill()
        # g_df.values = g_df.values / 100
        
        return g_df.tail(3)

    
    def get_bogie_start_time( self, df, col_dict, g_number, datetime_now ):
        """ 
            슬러지수집기 시작시간 추출 함수
            
            슬러지수집기 위치 태그데이터 존재하여 위치 태그데이터가 
            0에 가까운 시간으로 슬러지 수집기 시작시간 추출 
            
            @return
                - 슬러지수집기 시작시간
        """
        colist = col_dict[g_number][3:5]
        df_g = df[colist].copy()
        
        try:
            g_df = df_g[( df_g[colist[0]] == 0 ) & ( df_g[colist[0]] != df_g[colist[0]].shift(-1) ) & ( df_g[colist[0]].shift(-1) == 1)]
            rtn_value = g_df[colist[0]].tail(1).index.item()
            
        except:
            
            rtn_value = datetime_now

        return rtn_value

    
    def set_ai_sedimentation_alarm(self, obj, run_time):
        """
            알람에 대한 사항을 DB에 저장하는 함수
                - 알람id, runtime
        """
        self.db.save_alm('TB_AI_E_ALM', obj['alarm_id'], run_time)
            

    def set_ai_sedimentation_realtime( self, df):
        """
            AI Step E 결과 등록
                - 결과 데이터 등록
        """
        self.db.save_ai_rt('TB_AI_E_RT', df)


    def update_ai_sedimentation_init(self, obj):
        """
            알람에 대한 사항을 init에 저장하는 함수
                - 사용자 설정값 init저장
        """
        self.db.save_init('TB_AI_E_INIT', obj['item'], obj['value'])
            
            
    def set_ai_factor_db(self, df):
        """
            주요인자에 대한 사항을 DB에 저장하는 함수
                - 분석결과에 대한 주요인자
        """
        self.db.save_ai_factor(df) 


    def set_ai_sedimentation_control(self, obj):
        """
            제어에 대한 사항을 DB에 저장하는 함수
                - 대차 전/후진 제어
        """
        self.db.save_ctr('TB_AI_E_CTR', obj['UPD_TI'], obj['RNTI'], obj['TAG_SN'], obj['TAG_VAL'], obj['TAG_CMP_VAL'], obj['KFK_FLG'], obj['CTR_FLG'])
                
                
    def set_scraper_run_ctrl(self, control_dict, g_no, run_time, ctrl_flag='stop'):
        """
            @ 침전지 대차 제어 기동 / 정지 태그를 DB에 저장하는 함수
                - 전/후진 판단
        """
        # run_time = datetime.now()
        ctr_tags = control_dict[g_no]
        ctr_tag = ctr_tags[0] if ctrl_flag == 'start' else ctr_tags[1]
        
        self.obj['UPD_TI']  = run_time
        self.obj['RNTI']    = run_time
        self.obj['TAG_SN']  = ctr_tag
        self.obj['TAG_VAL'] =  "1.0"
        self.obj['TAG_CMP_VAL'] =  "0.0"

        self.set_ai_sedimentation_control(self.obj)
        print(f'DB에 침전지 대차 제어 {"정지" if ctrl_flag == "stop" else "기동"} 명령: {self.obj["TAG_SN"]}')
        
        
    # SCADA에서 받아 저장된 내용 중 가장 최근에 저장된 사항을 가져오기 위한 함수
    def get_last_sedi_realtime(self, table, tags):
        """
            @ SCADA에서 받아 저장된 내용 중 가장 최근에 저장된 사항을 가져오기 위한 함수
                - 최근 데이터 불러오기
        """
        
        tag_sn = ', '.join(['%s' for _ in tags])
        sql = f'''
            SELECT UPD_TI, TAG_SN, TAG_VAL 
            FROM {table}
            WHERE TAG_SN IN ({tag_sn})
            AND UPD_TI = (SELECT MAX(UPD_TI) FROM {table})
        '''

        df = self.db.read(sql)
        df = df.pivot(index='UPD_TI', columns='TAG_SN', values='TAG_VAL')
        df = df.astype('float32')

        return df


    def get_draw_max_time(self, inv_dict, g_number, df):
        """
            인발밸브 값
                - 가장 최근 인발시간 확인
        """
        # SCADA 인발밸브 관련 VVB 검색
        inv_list = inv_dict[g_number]
        df_draw = df[inv_dict[g_number]].astype('float').copy()

        # 밸브 열림 신호
        df_draw_open = df_draw[inv_list[:4]].copy()
        # 밸브 닫힘 신호
        df_draw_close = df_draw[inv_list[4:]].copy()

        df_draw_open = df_draw_open.fillna(0.0)
        df_draw_close = df_draw_close.fillna(1.0)

        condition_open = (df_draw_open[inv_list[0]] > 0) | (df_draw_open[inv_list[1]] > 0) | (df_draw_open[inv_list[2]] > 0) | (df_draw_open[inv_list[3]] > 0) 
        condition_close = (df_draw_close[inv_list[4]] > 0) | (df_draw_close[inv_list[5]] > 0) | (df_draw_close[inv_list[6]] > 0) | (df_draw_close[inv_list[7]] > 0) 

        df_d_open = df_draw_open[condition_open].copy()
        df_d_close = df_draw_close[condition_close].copy()

        rtn_time = df_d_open.index.max() if df_d_open.index.max() > df_d_close.index.max() else df_d_close.index.max() 
        
        # 1주일 이상 인발 정보가 없는 경우 발견
        if len(df_d_open) == 0:
            rtn_time = None

        return rtn_time