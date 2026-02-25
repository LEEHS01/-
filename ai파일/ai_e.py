##########
# 침전 공통 소스 파일
# author : 김준수
# since : 2024. 10. 07
# version : 1.0
##########

import os
import sys

# 사용자 정의 클래스 
#PROC_PATH = os.path.dirname(os.path.abspath('__file__')) # (.ipynb)
PROC_PATH = os.path.dirname(os.path.abspath(__file__)) # (.py) 
BASE_PATH = os.path.dirname(PROC_PATH)
ROOT_PATH = os.path.dirname(BASE_PATH)

sys.path.append(PROC_PATH + '/common')
sys.path.append(BASE_PATH + '/common')
sys.path.append(ROOT_PATH + '/common')
PROC_PATH = '/home/app/br/e'
MODEL_PATH = '/'.join([PROC_PATH, 'model/']) # 모델 경로

# 텐서
from tensorflow import keras

# 데이터
import pandas as pd
import numpy as np
import csv
import ast
# 날짜 & 시간
from datetime import timedelta
from datetime import datetime

# 공통
from os.path import join
import joblib
import json
import traceback
import warnings
warnings.filterwarnings('ignore')

from ai_e_def import CommonSedimentation
com = CommonSedimentation()


###################################################################################
#
# AI 결과 데이터 업데이트 클래스
#
###################################################################################
class JobRealtimeAiDataProc:
    """
        AI 결과 데이터 업데이트 클래스
            - 메인 클래스
    """

    def __init__(self):
        """
            변수 초기화
                - 사용자 입력변수
                - 활용태그 dict
        """
        self.df = None

        # get_df_init 함수
        self.df_init = com.get_df_init()
        self.sludge_limit           = self.df_init.set_index('item').at['e_sc_set_sludge_q', 'value'] # 대차 운행 기준 슬러지 양
        self.scraper_standby        = self.df_init.set_index('item').at['e_sc_set_max_wait', 'value'] # 대차 운행 대기 최대 일수
        self.scraper_run_distance   = self.df_init.set_index('item').at['e_set_lt', 'value'] # 침전지 대차 총 운전 거리 (편도 거리)
        self.scraper_run_times      = self.df_init.set_index('item').at['e_sc_set_ti', 'value'] # 침전지 대차 총 운전 시간

        self.ana_col_dict = self.read_dict('ana_col_dict.csv')
        self.col_dict = self.read_dict('col_dict.csv')
        self.inv_dict = self.read_dict('inv_dict.csv')
        self.col_name_dict = self.read_dict('colname_dict.csv')
        self.control_dict = self.read_dict('control_dict.csv')


    def read_dict( self, dict_file ):
        """
            활용태그 데이터 업로드
            @return
                - 활욭태그 dict
        """
        tmp_dict = {}
        
        with open(PROC_PATH + '/data/' + dict_file, 'r') as file:
            reader = csv.reader(file)
            for row in reader:
                tmp_dict[row[0]] = row[1]
                
        my_dict = {}
        num = [1]
        for i in num:
            my_dict[i] = ast.literal_eval(tmp_dict[str(i)])
        
        return my_dict
        
        
    def update_realtime( self, tags, job_datetime ):
        """
            실시간 데이터 업데이트 (최근 7일 데이터 유지)
            @return
                - 실시간 데이터(7일)
        """

        df = com.get_com_df(tags, job_datetime)
        #df_append = com.get_last_sedi_realtime(tags)
        #df = pd.concat([df, df_append])

        df = df.dropna(axis=0, how='all')
        df = df.groupby(level=0).first()
        
        self.df = df.copy()
        return df


    def multi_step_model( self, load_scaled_obj, df_Ws_latest_7days, var_size, model_path ):
        '''
            다중 스텝 모델 (T1, T2, T3, T4, T5, T6, T7)

            @params
                - load_scaled_obj MinMaxScaler
                - df_Ws_latest_7days 최근 7일 WS(슬러지발생량)
            @return
                - 최근 7일 + 예측 7일 슬러지 발생량
        '''
        nd_dataset = load_scaled_obj.transform(df_Ws_latest_7days)

        ############################################################
        # 추가 2021-11-18
        # 만약 nd_dataset 크기가 7일치가 아닐경우 입력된 마지막 값을 추출하여 배열 재 생성
        if len(nd_dataset) != 7:
            add_cnt = 7 - len(nd_dataset)
            tmp_data = np.full((add_cnt, var_size+1), nd_dataset[0])
            nd_dataset = np.append(tmp_data, nd_dataset, axis=0)

        dataset = np.delete(nd_dataset, -1, axis=1).reshape(1,7, var_size)

        # 모델 로드
        model_name = 'E_multi_step_model.hdf5'
        model_path_filename = os.path.join(model_path, model_name)
        model = keras.models.load_model(model_path_filename)

        # pred_y = model.predict( dataset )
        pred_y = model(dataset)

        zero = np.zeros(len(pred_y.numpy()[0]))
        df_pred_y = pd.DataFrame([zero,zero,zero,zero,zero,zero,pred_y.numpy()[0]]).T
        nd_pred_y = df_pred_y.values
        pred_ws_val = load_scaled_obj.inverse_transform(nd_pred_y)

        df_pred_ws = pd.DataFrame(pred_ws_val)
        df_pred_ws.columns=[0, 0, 0, 0, 0, 0, 'ws']

        stime= (df_Ws_latest_7days.index.max() + timedelta(days=1)).strftime('%Y-%m-%d')
        etime= (df_Ws_latest_7days.index.max() + timedelta(days=7)).strftime('%Y-%m-%d')
        base_index = pd.date_range( stime, etime , freq = '1D' )
        df_pred_ws.index = base_index

        df_Ws_latest_7days[['ws']]
        df_pred_ws[['ws']]

        df_multi_pred = pd.concat([ df_Ws_latest_7days[['ws']], df_pred_ws[['ws']] ])
            
        del [[df_pred_y, df_pred_ws, df_Ws_latest_7days]]

        return df_multi_pred


    def one_step_model( self, load_scaled_obj, df_Ws_latest_day, var_size, model_path ):
        '''
            단일 스텝(T1) 모델

            @params
                
                - load_scaled_obj MinMaxScaler
                - df_Ws_latest_day 최근 1일 WS(슬러지발생량)
            @return
                - pre_pred_ws_val - [전처리된 예측한 슬러지 발생량]
                - pred_ws_val - [예측한 슬러지 발생량]
                - real_ws_val - [실제 슬러지 발생량]
        '''
        nd_dataset = load_scaled_obj.transform(df_Ws_latest_day)
        dataset = nd_dataset[:,:-1].reshape(1,1,var_size)

        # 모델 로드
        model_name = 'E_one_step_model.hdf5'
        model_path_filename = os.path.join(model_path, model_name)
        model = keras.models.load_model(model_path_filename)

        # 모델 단일스텝(T1) 예측
        pred_y = model(dataset)

        # [전처리된 예측한 슬러지 발생량]
        pre_pred_ws_val = pred_y.numpy().item(0)

        # [예측한 슬러지 발생량] - ( 전처리(minmax scaled)값 -> 전처리값(minmax scale inverse) 복원 )
        pred_ws_val = load_scaled_obj.inverse_transform(np.array([[0, 0, 0, 0, 0, 0, pre_pred_ws_val]]))[0][var_size]

        # [실제 슬러지 발생량]
        real_ws_val = df_Ws_latest_day['ws'].values[0]

        return (pre_pred_ws_val , pred_ws_val, real_ws_val)


    def get_df_feature( self, df, ana_col, col_name, sn ):
        '''
            예측 모델 입력 변수 데이터 로드 & 전처리 & 슬러지 발생량 계산
            @return
                - 최근 7일 슬러지발생량
                    : df_Ws[['q', 'ntu', 'pac', 'pac_etc', 'ws']] 원수유입유량, 원수탁도, 응집제사용량, 보조약품사용, 슬러지발생량
        '''
        df = df.copy()
        df_ana         = df[ana_col].copy()
        df_ana.columns = col_name

        df_ana['FRI'] = df_ana['FRI1'] + df_ana['FRI2']
        df_ana['PAC'] = df_ana['PAC1'] + df_ana['PAC2'] + df_ana['PAC3']
        df_ana["PAC_ETC3"] = (df_ana["PAC_ETC3.1"] + df_ana["PAC_ETC3.2"]) / df_ana["FRI"] * 60
        df_pac_type = df_ana[['PAC_TYPE']]
        df_ana = df_ana[['FRI', 'TBI', 'PAC', 'PAC_ETC1', 'PAC_ETC2', 'PAC_ETC3']]
        df_ana.columns = ['q', 'tbi', 'pac', 'pac_etc1', 'pac_etc2', 'pac_etc3']

        # [원수 유량]
        df_q = df_ana[['q']].copy()
        df_q  = com.get_limit_outlier( df_q[['q']], 'q', 100000, 0 )
        df_q['q'] = (df_q['q'].astype('float') * 24) # 분당 하루 유입유량 데이터(시간당 유입유량이기때문에 * 24)
        df_q = df_q.resample( '1Min' ).interpolate( method='bfill', limit_direction="backward" )

        # [원수 탁도]
        df_ntu = df_ana[['tbi']].copy()
        df_ntu = df_ntu[['tbi']].astype('float')
        df_ntu  = com.get_limit_outlier( df_ntu[['tbi']], 'tbi', 300, 0 )
        df_ntu = df_ntu.resample( '1Min' ).interpolate( method='bfill', limit_direction="backward" )

        # [응집제 사용량]
        df_pac = df_ana[['pac']].copy()
        df_pac  = com.get_limit_outlier( df_pac[['pac']], 'pac', 300, 0 )
        df_pac = df_pac.resample( '1Min' ).interpolate( method='bfill', limit_direction="backward" )

        # [보조약품 사용량]
        df_pac_etc1 = df_ana[['pac_etc1']].copy()
        df_pac_etc1  = com.get_limit_outlier( df_pac_etc1[['pac_etc1']], 'pac_etc1', 100000, -0.0001 )
        df_pac_etc2 = df_ana[['pac_etc2']].copy()
        df_pac_etc2  = com.get_limit_outlier( df_pac_etc2[['pac_etc2']], 'pac_etc2', 100000, -0.0001 )
        df_pac_etc3 = df_ana[['pac_etc3']].copy()
        df_pac_etc3  = com.get_limit_outlier( df_pac_etc3[['pac_etc3']], 'pac_etc3', 100000, -0.0001 )

        # [슬러지 발생량]
        df_Ws = pd.concat([df_q, df_ntu, df_pac, df_pac_etc1, df_pac_etc2, df_pac_etc3], axis=1)
        # 약품 종류별 환산계수 PACS: 0.556, PAC: 0.184, PAHCS: 0.245, etc: 1
        
        df_Ws['b']       = 1.4
        df_Ws['Ca(OH)2'] = 0
        df_Ws['A']       = 0
        pac_type = df_pac_type[['PAC_TYPE']].tail(1).values[0]
        if pac_type == 31 or pac_type == 21 or pac_type == 11:
            df_Ws['k']   = 0.556
        elif pac_type == 32 or pac_type == 22 or pac_type == 12:
            df_Ws['k']   = 0.184
        elif pac_type == 33 or pac_type == 23 or pac_type == 13:
            df_Ws['k']   = 0.245
        else:
            df_Ws['k']   = 1.0
        df_Ws['ws']      = ( df_Ws['q'] * ( df_Ws['b'] * df_Ws['tbi'] + df_Ws['k'] * (df_Ws['pac']) + 
                                            (df_Ws['Ca(OH)2']) + df_Ws['pac_etc1'] + df_Ws['pac_etc2'] + df_Ws['pac_etc3'] + df_Ws['A']) * (10**-6))

        df_Ws = df_Ws[['q', 'tbi', 'pac', 'pac_etc1', 'pac_etc2', 'pac_etc3', 'ws']].resample('1D').mean()

        df_Ws = df_Ws.tail(7) # 최근 7일 데이터
            
        del [[df, df_ana, df_q, df_ntu, df_pac]]

        return df_Ws


    def get_min_max_scaler( self, MODEL_PATH ):
        '''
            전처리(MinMaxScaler) 모듈 로드

            @return MinMaxScaler
        '''

        min_max_scaler_path          = MODEL_PATH # 경로
        min_max_scaler_filename      = 'min_max_scaler.obj' # 파일명
        min_max_scaler_path_filename = os.path.join( min_max_scaler_path, min_max_scaler_filename ) # 경로/파일명
        load_scaled_obj = joblib.load( min_max_scaler_path_filename ) # min_max_scaler 불러오기

        return load_scaled_obj


    def get_ws( self, df, sn ):
        '''
            실시간 슬러지 발생량

            return [전처리된 예측한 슬러지 발생량], [예측한 슬러지 발생량], [슬러지 발생량]
        '''

        df = self.df
        var_size = 6

        df_ws = self.get_df_feature(df, self.ana_col_dict[sn], self.col_name_dict[sn], sn)
        min_max_scaler = self.get_min_max_scaler(MODEL_PATH)

        df_multi_pred  = self.multi_step_model( min_max_scaler, df_ws, var_size, MODEL_PATH ) # 다중 스텝 모델 예측
        df_one_pred    = self.one_step_model( min_max_scaler, df_ws.tail(1), var_size, MODEL_PATH ) # 단일 스텝 모델 예측

        return df_one_pred, df_multi_pred


    def get_sludge_base( ):
        '''
        슬러지 수집 최소시간과 설정된 최대 대기일수의 관계를 이용하여 다음 슬러지 수집기 시간을 산출하는 함수

        최소 기준시간은 12시간
        최대 대기일수는 4일 = 96시간

        현재 침전지별 슬러지 누적량을 이용하여 다음 대차 시간은 몇 시간 정도 더 뒤에 처리되어야 하는지 결정해주는 함수
        '''
        df_init = com.get_df_init()
        
        # 최소 대기 시간 (대차 운전 주기 최소 기준 시간 예 12시간 )
        low_hour = df_init.set_index('item').at['e_low_hour', 'value']

        # 최대 대기 시간 (사용자가 지정한 대차 운전 주기 최대 대기 일수 * 24시간)
        scraper_standby = df_init.set_index('item').at['e_sc_set_max_wait', 'value'] # 추후 변경 필요
        hight_hour = scraper_standby * 24
        
        scraper_run_times = df_init.set_index('item').at['e_sc_set_ti', 'value'] # 추후 변경 필요
        q_sludge_div = scraper_run_times # 대차 이동 시간
        hour_div     = int( ( hight_hour - low_hour ) / ( q_sludge_div - 1 ) ) #

        list_hour_div = [hight_hour]

        for div in range( 1, int(q_sludge_div)-1, 1 ):
            d = int(round(list_hour_div[div-1] - hour_div, 0))
            list_hour_div.append(d)
        list_hour_div.append(low_hour)

        list_sludge_div = []
        for div in range( 1, int(q_sludge_div)+1, 1 ):
            list_sludge_div.append((div)/(q_sludge_div)*0.1)

        df_sludge_base = pd.DataFrame({ 'time': list_hour_div, 'sludge': list_sludge_div })

        return df_sludge_base



    def get_df_latest( df ):
        '''
            최근 실시간 데이터 가져오기
            @return
                - 최근 1분 실시간 데이터
        '''
        df_latest = df[ df.index.max() == df.index ].copy()
        df_latest.fillna(value=0.0, inplace=True)

        return df_latest


    def make_scraper_schedule(  self, df_init, df_latest, 
                                col_dict, control_dict, g_ws, g_opt_cnt, inval_factor, sn, job_datetime = None ):
        '''
            정의 : 대차 스케쥴표 작성 함수
            인자 : 설정값, 최종 1분 실시간 데이터셋, 분석활용 컬럼, 제어관련 컬럼, 실제 슬러지 발생량, 운영 침전지 수
            대차 움직임 모니터링을 하며 필요에 따라 바로 제어 명령을 보낼 수 있도록 변경
        '''
        ###############################################################
        g_hour_ws  = g_ws / 24 # 시간당 적산할 슬러지양

        #job_datetime = None
        if job_datetime is None:
            datetime_now = datetime.now() # 기준 현재 시간
        else:
            datetime_now = job_datetime # 작업 현재 시간
        g_scraper_length_distance = self.scraper_run_distance # 대차 총 운전 거리 (편도 거리)
        calc_days = int(self.sludge_limit / g_hour_ws / 24) # 대차 운행 기준 슬러지양 / 시간당 적산할 슬러지양 / 24
        set_sludge_days = 7 if calc_days < 7 else calc_days + 3

        # [변수 체크]
        print('[변수 체크]---------------------------------------------------------------------------')
        print('    - 대차 운행 기준 슬러지 양 : {} ton/day'.format(self.sludge_limit))
        print('    - 침전지 대차 총 운전 거리 (편도 거리) : {}m'.format(self.scraper_run_distance))
        print('    - 대차 운행 대기 최대 일수 : {}일'.format(self.scraper_standby))
        print('    - 침전지 대차 총 운전 시간 : {}시'.format(self.scraper_run_times))

        print('    - 운영 침전지 수 : {}'.format(g_opt_cnt))
        print('    - 침전지별 슬러지양 (1일 적산량) : {}'.format(g_ws))
        print('    - 시간당 적산 슬러지양 : {}'.format(round(g_hour_ws, 4)))

        print('    - 대차 운행 기준 슬러지 발생 시간 : {}일({}시간)'.format(round(calc_days, 2), round(self.sludge_limit / g_hour_ws, 2)))

        print('현재 시간 : {}'.format(datetime_now))

        # 이미 파일로 저장 된 대차 스케쥴표 정보 로딩
        dataframe_path = PROC_PATH + '/data'
        dataframe_name = 'E_sch_data.csv'
        dataframe_path_filename = os.path.join(dataframe_path, dataframe_name)

        if os.path.isfile( dataframe_path_filename ):
            df_sch = pd.read_csv( dataframe_path_filename, dtype={'g': int,'latest': str,'next_start': str,'next_end': str, \
                                                                'start': str,'stop': str,'time_hh':str,'time_mm':str,'state': int, \
                                                                'ai_mode': int, 'updatetime': str})
            df_sch_init = 0 # 초기화 여부
        else:
            print("[EVENT-Log] 대차스케쥴표 파일 없음 : 초기화 진행")
            li = list()
            for i in range(1, 9):
                sch_data = {'g':i,'latest':'','next_start':'','next_end':'','start': '','stop': '',
                            'time_hh':'0','time_mm':'0','state':0, 'ai_mode': 0, 
                            'updatetime':datetime_now.strftime('%Y-%m-%d %H:%M')}
                li.append(sch_data)

            df_sch = pd.DataFrame( li )
            df_sch.to_csv( dataframe_path_filename, index=False ) # 초기화 된 내용으로 파일 생성
            df_sch_init = 1 # 초기화 여부

        df_sch = df_sch.fillna('')
        
        # 알람 관련 
        alarm_obj = {
            'alarm_id': 0,
            'time' : datetime_now.strftime('%Y-%m-%d %H:%M:%S')
        }

        g_start_alarm, g_end_alarm = 134003, 134043

        for g_number in range(1, 9):
            # 해당 침전지의 운영 상태 여부 판단
            g_op_flag = com.get_oper_flag(df_latest, col_dict[sn], g_number)
            # 해당 침전지 AI모드 상태 확인
            g_control_flag, control_mode = com.get_control_flag(df_init, g_number)
            # g_control_flag = 1 if com.get_control_flag(df_init, g_number) else 0
            g_back_flag, forward_done_time = com.scraper_forward_end(self.df, col_dict[sn], g_number)
            g_state_flag_f = com.scraper_forward_start(self.df, col_dict[sn], g_number)
            g_state_flag_b = com.scraper_backward_start(self.df, col_dict[sn], g_number)
            # 프로그래밍용 index (배열용)
            g_index = df_sch.query(f'g == {g_number}').index.item()
            # 대차스케쥴표상의 값들 지정 (필요한 것만)
            # df_sch_start_time = ''
            # df_sch_stop_time = ''
            df_sch_next_time = ''
            df_sch_state = 0

            if(df_sch_init != 1): # 초기화 된 경우

                if df_sch.set_index('g').at[g_number, 'next_start'] != '':
                    df_sch_next_time = datetime.strptime(df_sch.set_index('g').at[g_number, 'next_start'], "%Y-%m-%d %H:%M")
                else:
                    df_sch_next_time = ''
                
                if df_sch.set_index('g').at[g_number, 'state'] != '' or df_sch.set_index('g').at[g_number, 'state'] != 0:
                    df_sch_state = df_sch.set_index('g').at[g_number, 'state']
                else:
                    df_sch_state = 0

            g_scraper_direction = df_sch_state # 침전지 대차 현재 상태 기본 값 (중지or대기)
            if int(g_op_flag) < 1:
        #             if g_op_flag < 1 and g_control_flag == 1: # 현재 침전지가 운행 상태인 경우
                # -------------------------------------------------------------------------------------------------------------------------
                # 1. 현재 침전지별 대차들의 위치 확인 및 잔여 대차 운전시간 확인
                # -------------------------------------------------------------------------------------------------------------------------
                # 1.1 침전지 대차의 상태(정지/전진/후진) 판단을 위해 가장 최근 3개 데이터 호출
                # 1.2 대차 운전 상태 대기(0), 전진(1), 후진(2) 확인
                # - 대차 최종 위치와 최종 바로 전 위치를 비교하여 상태를 설정한다.
                # 1.3 현재 대차의 남은 운전 예상 시간 계산
                # 1.3.1 대차 운전 잔여 거리 계산 : 전진이면 대차 총 운전 거리에서 현 위치 차감, 후진이면 현 위치 그대로 사용
                # 1.3.2 추가시간 : 대차가 전진 중이면 후진을 고려한 5시간을 추가 / 후진 상태면 추가 시간 없음 / 대기 상태면 10시간을 추가
                

                # 슬러지 수집기 대차 종료 시간은 셋팅된 스피드 값에 의하여 각 지별로 계산
                g_bogie_tot_time, g_bogie_hz = com.get_bogie_speed_time(self.df, col_dict[sn], g_number)
                g_bogie_hour, g_bogie_min = divmod(g_bogie_tot_time * 2, 60)
                g_bogie_move_full_time = g_bogie_tot_time * 2
                g_bogie_move_full_time = 490
                
                g_scraper_positions = com.get_scraper_position(self.df, g_bogie_tot_time, col_dict[sn], g_number) # 침전지 위치 추출
                g_scraper_positions = g_scraper_positions / 100
                g_scraper_last = float(g_scraper_positions.iloc[2]) # 최종 위치
                g_scraper_last_before = float(g_scraper_positions.iloc[1]) # 최종 바로 전 위치
                g_scraper_last_temp = float(g_scraper_positions.iloc[0]) # 최종위치를 가져오지 못해 Error 날 경우 대비
                g_scraper_rest_time = 0

                if (g_scraper_last is None) or np.isnan(g_scraper_last):
                    g_scraper_last = g_scraper_last_before
                    g_scraper_last_before = g_scraper_last_temp

                # 슬러지 수집기 운전 시작시간은 센서 상 0 값에 근접한 최종 시간을 시작시간으로 설정 (2022-02-10)
                g_scraper_start_time = pd.to_datetime(str(com.get_bogie_start_time(self.df, col_dict[sn], g_number, datetime_now)))
                
                gap_real_time = datetime_now - g_scraper_start_time
                gap_real_min = int(round(gap_real_time.total_seconds() / 60, 0))

                g_scraper_rest_distance = g_scraper_length_distance - g_scraper_last
                g_scraper_rest_time = int(g_bogie_move_full_time) - gap_real_min

                # 긴 조건문을 바깥으로 빼놓음
                # condition = df_sch_next_time != '' and datetime_now >= df_sch_next_time and abs(datetime_now - df_sch_next_time) <= timedelta(minutes=10)
                condition = df_sch_next_time != '' and abs(datetime_now - df_sch_next_time) <= timedelta(minutes=5) and g_state_flag_f != 1
                
                if df_sch_next_time == '':
                    df_sch_next_time = datetime_now
                print('[{}]번 침전지 : 상태값 {}'.format(g_number, g_scraper_direction))

                # 침전공정에서 사용하는 상태값
                # g_scraper_direction
                # 0: 운행 종료, 1: 전진, 2: 후진, 4: 대기 (출발 위치가 아닌 곳에서 서 있을 경우), 5: 운행 대기 (1m 이내 멈춰 있는 경우)
                # 침전지 슬러지 수집기가 운행하게 되면 0 -> 5 -> 1 -> 2 -> 0 의 순으로 가야 정상 운영임
                if g_scraper_last < 1 and g_control_flag == 1 and control_mode >= 1:
                    # 자동제어 정지 후 공운전 해제, 그 후 자동제어 시작으로 로직 변경요구 (2022-03-08)
                    if condition:
                        g_scraper_direction = 5
                        
                        rn_ti = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        com.set_scraper_run_ctrl(control_dict, g_number, rn_ti, 'start')

                        if control_mode == 2:
                            alarm_obj['alarm_id'] = g_start_alarm + g_number
                            com.set_ai_sedimentation_alarm(alarm_obj, rn_ti)
                        
                        df_e_factor = pd.DataFrame(columns = ['PROC_CD', 'DISINFECTION_INDEX', 'RNTI', 'FACTOR'], index=rn_ti)
                        df_e_factor['PROC_CD'] = 'E'
                        df_e_factor['DISINFECTION_INDEX'] = 'NONE'
                        df_e_factor['RNTI'] = rn_ti
                        df_e_factor['FACTOR'] = inval_factor
                        com.set_ai_factor_db( df_e_factor )
                        
                        print('    슬러지 양에 따른 {0} 침전지 슬러지 수집기 운행 시작'.format(g_number))
                        
                    # # 자동운전 중이고 위치가 1보다 작은 상태에서 전진일 경우 대차 자동운전 정지
                    # if (g_scraper_last > g_scraper_last_before) and (g_scraper_direction not in [0,5]):
                    #     g_scraper_direction = 0
                        
                    #     rn_ti = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    #     com.set_scraper_run_ctrl(control_dict, g_number, rn_ti, 'stop')

                    #     alarm_obj['alarm_id'] = g_start_alarm + g_number
                    #     com.set_ai_sedimentation_alarm(alarm_obj, rn_ti)
                        
                    #     print('    자율운영 상태에 따른 슬러지 수집기 정지실행 (운행종료)'.format(g_number))
                    else:
                        pass
                
                # 자동제어 전진완료 후 후진 제어
                elif forward_done_time >= g_scraper_start_time and g_scraper_last >= 76.39  and g_control_flag == 1 and g_back_flag == 1 and g_state_flag_b != 1:
                    rn_ti = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    com.set_scraper_run_ctrl(control_dict, g_number, rn_ti, 'back')
                    print('    자율운영 상태에 따른 {} 침전지 슬러지 수집기 후진실행'.format(g_number))
                    
                else:
                    if g_scraper_last == g_scraper_last_before:
                        # 현재 위치가 1보다 작을 경우는 대기 상태로 간주
                        if g_scraper_last < 1:
                            g_scraper_direction = 0
                            print('    슬러지 수집기 상태(운행종료)'.format(g_number))
                            
                            # if g_control_flag == 1 and condition:
                                
                            #     rn_ti = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                            #     com.set_scraper_run_ctrl(control_dict, g_number, rn_ti, 'start')
                                
                            #     alarm_obj['alarm_id'] = g_start_alarm + g_number
                            #     com.set_ai_sedimentation_alarm(alarm_obj, rn_ti)
                                
                            #     print('    슬러지 양에 따른 {0} 침전지 슬러지 수집기 운행 시작'.format(g_number))
                                
                        else:
                            g_scraper_direction = 4 # 출발위치가 아닌 곳에서 정지해있는 경우.
                            g_scraper_rest_time = g_bogie_move_full_time + int(g_scraper_rest_distance / (g_bogie_hz)) + gap_real_min
                            print('    슬러지 수집기 상태(대기)'.format(g_number))
                            
                    elif g_scraper_last > g_scraper_last_before:
                        g_scraper_direction = 1 # 전진 : 최종 위치값이 바로 전 값보다 큼
                        g_scraper_rest_distance += g_scraper_length_distance
                        print('    슬러지 수집기 상태(전진)'.format(g_number))
                        
                    elif g_scraper_last < g_scraper_last_before:
                        g_scraper_direction = 2 # 후진 : 최종 위치값이 바로 전 값보다 작음
                        print('    슬러지 수집기 상태(후진)'.format(g_number))
                        
                    else:
                        print('    슬러지 수집기 위치 데이터 이상')
                        pass
                
                back_start_time = com.scraper_backward_start(self.df, col_dict[sn], g_number)
                g_scraper_stop_time = g_scraper_start_time + timedelta(minutes=g_bogie_move_full_time)
                # if g_scraper_start_time < back_start_time:
                #     g_scraper_stop_time = back_start_time + timedelta(minutes=g_bogie_move_full_time/2)

                print('   | ----------------------------------------------------------------------------------------------------')
                print('   | 현시점 대차 위치 : {} / 잔여거리 : {}'.format(round(g_scraper_last, 2), round(g_scraper_rest_distance, 2)))
                print('   | 현시점 대차 운행 잔여 시간 : {}'.format(g_scraper_rest_time))
                print('   | 현시점 대차 운행 출발 시간 : {}'.format(g_scraper_start_time))
                print('   | 현시점 대차 운행 종료 시간 : {}'.format(g_scraper_stop_time))

                # -------------------------------------------------------------------------------------------------------------------------
                # 2. 슬러지 발생량 추이 확인 및 대차 운행 시점 확인
                #    인발밸브 열림닫힘 시간을 슬러지 발생량 시작시점으로 간주
                # -------------------------------------------------------------------------------------------------------------------------
                print('   | ----------------------------------------------------------------------------------------------------')
                # 2.1 슬러지 발생량 추이의 시작 시점(최근 인발밸브 열림이 있었던 시점)과 종료 시점(출발 시점+7일 - 1주일) 설정
                # 2.1.1 슬러지 발생량 추이의 시작 시점 : 최근 인발했을 때의 시점을 슬러지 발생량 시작으로 수정 (2022.01.24)
                g_sludge_start_time = com.get_draw_max_time(self.inv_dict[sn], g_number, self.df)
                g_sludge_start_time = None
                
                # 인발 시간을 가져오지 못하는 경우 출발시간을 시작 시간으로 설정
                if pd.isnull(g_sludge_start_time):
                    g_sludge_start_time = g_scraper_start_time
                    
                # 2.1.2 인발 시점을 기준으로 운행되어야 하는 다음 시작 시간
                scraper_standby_time = self.scraper_standby * 24
                g_sludge_pred_next_time = g_sludge_start_time + timedelta(hours=scraper_standby_time)

                # g_sludge_start_time = g_sludge_start_time.replace(minute=0)

                # 2.1.3 슬러지 발생량 추이의 종료 시점 : 시작부터 수집기 대차 관련 일자 조정 기본 7일
                g_sludge_stop_time = (g_sludge_start_time + timedelta(days=set_sludge_days))
                # 2.1.4 슬러지 발생량 추이를 저장할 데이터셋 정의 : 시작~종료까지 1시간 단위의 데이터셋
                g_sludge_integrate_index = pd.date_range( g_sludge_start_time, g_sludge_stop_time, freq='1H' )
                # 2.1.5 데이터셋에 row 항목 추가
                g_sludge_integrate = pd.DataFrame( np.arange(1, len(g_sludge_integrate_index)+1, 1), columns=['row'], index=g_sludge_integrate_index )
                g_sludge_loop_cnt = 0 # 반복문 횟수 증가용 변수
                # 2.1.6 슬러지 발생량에 따른 다음 대차 운행 예정 시간 정의 : 기본적으로 현시점 대차 운행 종료 예상 시간으로 설정
                g_sludge_next_time = g_scraper_stop_time
                # 2.1.7 데이터셋 설정
                for idx, _ in g_sludge_integrate.iterrows():
                    tmp_sludge_val = round(g_sludge_loop_cnt * g_hour_ws, 4) # 슬러지 발생량을 순차적으로 적산 (시간당 슬러지 예측 발생량)
                    # 2.1.7.1 적산량이 인발을 위한 슬러지 발생량 기준보다 커지는 순간 count를 0으로 설정
                    if tmp_sludge_val >= self.sludge_limit:
                        g_sludge_loop_cnt = 0 if idx > g_scraper_stop_time else g_sludge_loop_cnt + 1
                    else:
                        g_sludge_loop_cnt += 1
                    # 2.1.7.2 row에 맞춰 적산량 할당
                    g_sludge_integrate.at[idx, 'ws'] = tmp_sludge_val

                first_over_index = pd.to_datetime(g_sludge_integrate[g_sludge_integrate['ws'] >= self.sludge_limit].head(1).index.values[0])

                if first_over_index > g_scraper_stop_time:
                    first_over_index = pd.to_datetime(g_sludge_integrate[g_sludge_integrate['ws'] >= self.sludge_limit].head(2).index.values[0])

                # 2.1.7.3 현시점 대차 운행 시작 시간에 기준 슬러지양이 넘어가는 첫번 째 시간에서 대차 운행 시간을 뺀 시간을 넣어줌
                g_sludge_next_time = first_over_index - timedelta(hours=self.scraper_run_times)

                print('   | {}침전지 인발 최종 시간 : {}  / 인발관련 예상 운행 시간 : {}'.format(g_number, g_sludge_start_time, g_sludge_pred_next_time))
                print('   | 슬러지 발생량에 따른 다음 대차 운행 예정 시간 : {}'.format(g_sludge_next_time))

                # -------------------------------------------------------------------------------------------------------------------------
                # 3. 다음 슬러지 수집기 운행 시간 결정
                # -------------------------------------------------------------------------------------------------------------------------
                # 3.1 기본적으로 운행 시간은 슬러지 예측량에 따른 시간과 인발 후 예정된 대기시간의 최소값으로 설정 (단 현재 시점보다 작은 경우는 현재 시간보다 10분 뒤로 설정)
                if datetime_now < g_sludge_next_time and datetime_now < g_sludge_pred_next_time:
                    g_scraper_next_time = min(g_sludge_next_time, g_sludge_pred_next_time)
                    print('   | 인발/슬러지 예측 관련 최소 예정일 : {}'.format(g_sludge_next_time))
                elif datetime_now > g_sludge_next_time and datetime_now < g_sludge_pred_next_time:
                    g_scraper_next_time = max(g_sludge_next_time, g_sludge_pred_next_time)
                    print('   | 인발/슬러지 예측 관련 최대 예정일 : {}'.format(g_sludge_next_time))
                else:
                    g_scraper_next_time = df_sch_next_time if datetime_now <= df_sch_next_time else datetime_now.replace(second=0, microsecond=0) + timedelta(minutes=10)
                    print('   | 인발/슬러지 예측 관련 오류로 인한 당일 시간설정 : {}'.format(g_scraper_next_time))
                    

                # 3.2 다음 대차 시간이 종료시간보다 빠르거나 같을 경우 대차 종료시간에 임의의 10분을 두어 진행할 수 있도록 한다.
                #     대차 최대 대기 시간을 적용해서 산출해준다 (2022-02-10)
                if g_scraper_stop_time >= g_scraper_next_time and g_scraper_direction != 0:
                    g_scraper_next_time = g_scraper_stop_time + timedelta(minutes=10)

                # 3.3 종료시간과 다음 대차 스케쥴 시간이 기준 대차시간을 넘어갈 경우 설정된 최대 대기일수에 대해 적용한다.
                if (g_scraper_next_time - g_scraper_stop_time) >= timedelta(days=self.scraper_standby) and g_scraper_direction != 0:
                    g_scraper_next_time = g_scraper_stop_time + timedelta(days=self.scraper_standby)
                    
                print('   | [기존] 다음 대차 운행 예정 시간 : {}'.format(df_sch_next_time))
                print('   | [최종] 다음 대차 운행 예정 시간 : {}'.format(g_scraper_next_time))

                # -------------------------------------------------------------------------------------------------------------------------
                # 4. 1차 대차 스케쥴표 작성
                # -------------------------------------------------------------------------------------------------------------------------
                # 기존 다음 대차 시작시간 분을 슬러지 수집기 운전 속도 시간과 분으로 변경 (2022-03-09)
                # scraper_next_sch_hh  = ( g_scraper_next_time ).strftime( '%H' )
                # scraper_next_sch_mm  = ( g_scraper_next_time ).strftime( '%M' )

                df_sch.at[g_index, "latest"]        = g_sludge_start_time.strftime( '%Y-%m-%d %H:%M' )
                df_sch.at[g_index, "start"]         = g_scraper_start_time.strftime( '%Y-%m-%d %H:%M' )
                df_sch.at[g_index, "stop"]          = g_scraper_stop_time.strftime( '%Y-%m-%d %H:%M' )
                df_sch.at[g_index, "next_start"]    = g_scraper_next_time.strftime( '%Y-%m-%d %H:%M' )
                df_sch.at[g_index, "next_end"]      = (g_scraper_next_time + timedelta(minutes=int(g_bogie_move_full_time))).strftime( '%Y-%m-%d %H:%M' )
                df_sch.at[g_index, "time_hh"]       = g_bogie_hour
                df_sch.at[g_index, "time_mm"]       = g_bogie_min
                #df_sch.loc[g_index, "state"]   = 1 if float(g_scraper_last) != float(g_scraper_last_before) else 0 # 대차 대기상태가 아닌 경우에만 운행중으로 설정
            else:
                # -----------------------------------------------------------------------------------------------------------------------
                # 현재 침전지가 미운영상태이면 해당 침전지 대차 스케쥴 초기화
                # -------------------------------------------------------------------------------------------------------------------------
                df_sch.at[g_index, "latest"]        = ''
                df_sch.at[g_index, "start"]         = ''
                df_sch.at[g_index, "stop"]          = ''
                df_sch.at[g_index, "next_start"]    = ''
                df_sch.at[g_index, "next_end"]      = ''
                df_sch.at[g_index, "time_hh"]       = '0'
                df_sch.at[g_index, "time_mm"]       = '0'
                #df_sch.loc[g_index, "state"]   = 0
                # 자율운영 상태는 유입밸브가 열리지 않으면 무조건 자율운행 중지로 설정
                if com.get_control_flag(df_init, g_number):
                    com.chg_control_value(g_number, 'stop')
                else:
                    pass
            df_sch.at[g_index, "state"]   = g_scraper_direction # (0) 대기 또는 중지, (1) 전진 (2) 후진   <<< 위 조건문에서 state를 지정하는 것은 배제해도 무관함.
            df_sch.at[g_index, 'ai_mode'] = g_control_flag
            
            df_sch.at[g_index, "updatetime"] = datetime_now.strftime('%Y-%m-%d %H:%M')

        # -------------------------------------------------------------------------------------------------------------------------
        # 4. 대차별 운행시간 비교하여 대차 출발 시간이 30분의 간격을 유지하도록 처리
        # -------------------------------------------------------------------------------------------------------------------------
        # 4.1 (2021.12.28 추가) 다음 대차 운행 예정 시간이 최종 stop 시간에서 사용자 설정의 최대 운행 대기 일시를 더한 일시보다 크면
        #                       다음 대차 운행 예정 시간을 최종 stop 시간에서 사용자 설정의 최대 운행 대기 일시를 더한 일시로 한다.
        # print('[침전지별 대차 운행 최대대기 시간 판단]-------------------------------------------------------------------')
        df_sch_temp = df_sch.copy()
        # 4.2 정렬을 위한 column 형식 변경
        df_sch_temp['latest'] = pd.to_datetime(df_sch_temp['latest'])
        df_sch_temp['next_start'] = pd.to_datetime(df_sch_temp['next_start'])
        df_sch_temp['next_end'] = pd.to_datetime(df_sch_temp['next_end'])

        for idx, _ in df_sch_temp.iterrows():
            df_sch_temp['gap'] = df_sch_temp['next_start'].diff()

            if df_sch_temp.at[idx, 'gap'] is pd.NaT:
                pass
            elif df_sch_temp.at[idx, 'gap'] < timedelta(minutes=30):
                time_delta1 = df_sch_temp.at[idx-1, 'next_start'] + timedelta(minutes=10) 
                time_delta2 = df_sch_temp.at[idx-1, 'next_end'] + timedelta(minutes=10) 
                df_sch_temp.at[idx, 'next_start'] = time_delta1
                df_sch_temp.at[idx, 'next_end'] = time_delta2
            df_sch_temp.sort_values(by=['next_start'], axis=0, inplace=True)

        df_sch_temp = df_sch_temp.astype({'latest': str, 'next_start': str, 'next_end':str})
        df_sch_temp['latest'] = df_sch_temp['latest'].astype('str').str[:-3]
        df_sch_temp['next_start'] = df_sch_temp['next_start'].astype('str').str[:-3]
        df_sch_temp['next_end'] = df_sch_temp['next_end'].astype('str').str[:-3]
        df_sch_temp.fillna('', inplace=True)
        # df_sch_temp.drop(columns=['gap'], inplace=True)

        # 4.3 다음 대차 스케쥴 기준으로 정렬하여 재저장
        df_sch_temp.sort_values(by=['g'], axis=0, inplace=True)
        # 시간에 대해 자동 연산되어 처리되기 때문에 시간이 변경될 수 있음, 최대한 근접 시간으로 처리하는 로직 필요
        #print(df_sch_temp)
        # -------------------------------------------------------------------------------------------------------------------------
        # 5. 대차 스케쥴표 작성 (파일 저장)
        # -------------------------------------------------------------------------------------------------------------------------
        try :
            df_sch_temp.to_csv(dataframe_path_filename, index=False)
            print( "[Process] 대차 스케쥴표 작성 완료" )
        except :
            print( "[Process-Error] 대차 스케쥴표 작성 실패" )
            
        del [[df_sch, g_sludge_integrate]]

        return df_sch_temp


    def get_g_data( self, df_latest, g_number, g_ws, g_bogie_tot_time, df_sch, inv_dict, sn, job_datetime ):
        '''
            AI 분석 데이터
        '''
        ####################################################################################
        # 침전지 동작여부 추가 (2021-11-18)
        # key : operation
        # value : 0 동작 안함 1 동작
        col_dict = self.col_dict
        oper_flag = com.get_oper_flag(df_latest, col_dict[sn], g_number)
        oper = {'e_operation_mode': 1 if int(oper_flag) < 1 else 0}

        # [위치]
        df = self.df
        scraper_positions = com.get_scraper_position(df, g_bogie_tot_time, col_dict[sn], g_number) # 침전지 위치 추출
        scraper_positions = scraper_positions / 100
        scraper_loc_b = float(np.nan_to_num(scraper_positions[0]))
        #scraper_loc_b = float(np.nan_to_num(df_latest['SCI_2{}09'.format(g_number)].values[0])) # 대차 B
        scraper_loc_f = self.scraper_run_distance - scraper_loc_b # 대차 F (침전지 길이 64M)
        dict_scraper_loc = {'e_loc_sc_{}'.format(g_number): {'f':int(scraper_loc_f),'b':int(scraper_loc_b)}}
        dict_scraper_loc['e_loc_sc_{}'.format(g_number)] = {k:v if not np.isnan(v) else 0 for k,v in dict_scraper_loc['e_loc_sc_{}'.format(g_number)].items() }

        # [대차 스케쥴]
        latest_sch      = df_sch.set_index('g').at[g_number, 'latest']
        next_sch        = df_sch.set_index('g').at[g_number, 'next_start']
        next_end_sch    = df_sch.set_index('g').at[g_number, 'next_end']

        start_sch  = df_sch.set_index('g').at[g_number, 'start']
        stop_sch   = df_sch.set_index('g').at[g_number, 'stop']
        inbal_sch  = df_sch.set_index('g').at[g_number, 'next_end'] # 슬러지 산출량에 따른 스케쥴 시간에 인발이 진행된다고 봄 (2022-02-10).

        sch_obj = {'latest': latest_sch, 'next_start': next_sch, 'next_end': next_end_sch, 'start': start_sch, 'stop': stop_sch, 'inbal': inbal_sch}

        dict_sch   = {'AIE-600{}'.format(g_number): sch_obj}

        # [인발밸브1 열림]
        vvb_1      = np.nan_to_num(df_latest[inv_dict[sn][g_number][0]].values[0])
        # [인발밸브2 열림]
        vvb_2      = np.nan_to_num(df_latest[inv_dict[sn][g_number][1]].values[0])
        # [인발밸브3 열림]
        vvb_3      = np.nan_to_num(df_latest[inv_dict[sn][g_number][2]].values[0])
        # [인발밸브3 열림]
        vvb_4      = np.nan_to_num(df_latest[inv_dict[sn][g_number][3]].values[0])
        
        dict_vvb = {'e_drn_vv{}_1'.format(g_number): float(vvb_1), 
                    'e_drn_vv{}_2'.format(g_number): float(vvb_2),
                    'e_drn_vv{}_3'.format(g_number): float(vvb_3),
                    'e_drn_vv{}_4'.format(g_number): float(vvb_4) }
        dict_vvb = {k:v if not np.isnan(v) else 0 for k,v in dict_vvb.items() }
        dict_vv = {'e_drn_vv{}'.format(g_number): dict_vvb}


        df_base = None

        # [슬러지양]
        ###############################################################
        min_10_g_ws = g_ws / 24 # 시간당 적산할 슬러지양

        start_state = df_sch.set_index('g').at[g_number, 'state']
        time_hh     = df_sch.set_index('g').at[g_number, 'time_hh']
        time_mm     = df_sch.set_index('g').at[g_number, 'time_mm']

        # 현재시간 - 대차 종료일시
        dict_ws_trend = dict()
        if int(oper_flag) < 1:

            start_dt = None
            if pd.isnull(start_dt):
                start_dt = datetime.strptime(start_sch, '%Y-%m-%d %H:%M')

            end_dt = (start_dt + timedelta(days=self.scraper_standby + 3)).strftime("%Y-%m-%d %H")
            start_dt = start_dt.strftime("%Y-%m-%d %H")
            next_start_dt = pd.to_datetime(next_sch)

            base_index = pd.date_range( start_dt, end_dt , freq = '1H' )
            df_base = pd.DataFrame( np.arange(1,len(base_index)+1,1), columns=['row'], index=base_index )
            df_base['ws'] = round( df_base['row'].astype('float') * min_10_g_ws , 4 )

            #########################################################################################
            # 침전지에 대한 슬러지 양이 기준을 초과하면 0으로 변경하여 다시 슬러지가 쌓이는 것으로 추산
            cnt = 1

            for idx, _ in df_base.iterrows():
                tmp_sludge_val = round(cnt * min_10_g_ws, 4)

                if tmp_sludge_val >= self.sludge_limit:
                    cnt = 1 if idx > next_start_dt else (cnt + 1)
                else:
                    cnt += 1

                df_base.at[idx, 'ws'] = tmp_sludge_val

            #########################################################################################
            index_time = datetime.now().strftime("%Y-%m-%d %H")
            if df_base.index.max() < datetime.now():
                index_time = df_base.index.max()
            else:
                index_time = datetime.now().strftime("%Y-%m-%d %H")

            g_ws  = float(round( df_base.at[index_time, 'ws'].item(0), 4))
            df_ws_trend = df_base.copy()

            df_ws_trend['datetime'] = df_ws_trend.index
            df_ws_trend = df_ws_trend.astype({'datetime':str, 'ws':float})
            df_ws_trend.index = df_ws_trend['datetime']
            df_ws_trend = df_ws_trend.fillna(method='bfill').fillna(method='ffill').fillna(0)

            dict_ws_trend = df_ws_trend['ws'].to_dict()
            # datetime_now = datetime.strptime(datetime.now().strftime("%Y-%m-%d %H:%M"), "%Y-%m-%d %H:%M")
            datetime_now = datetime.strptime(job_datetime.strftime("%Y-%m-%d %H:%M"), "%Y-%m-%d %H:%M")
            start_ws_time = datetime.strptime(start_sch, '%Y-%m-%d %H:%M')
            ws_time = datetime_now - start_ws_time
        else:
            ws_time = 0.0
            g_ws = 0.0

        dict_g_ws = {'AIE-500{}'.format(g_number): g_ws}
        g_ws_minutes = ws_time.seconds / 60
        print("ws_time: ", g_ws_minutes)
        ws_time = {'AIE-501{}'.format(g_number): g_ws_minutes}

        # [현재 슬러지양] - 대차 운전 시작부터 현재까지 슬러지양 적산량.인발후에는 슬러지양 0
        dict_ws_trend =   {'AIE-510{}'.format(g_number): dict_ws_trend}

        # [대차 시작 제어]
        dict_start_state = {'AIE-700{}'.format(g_number): int(start_state)}
        # [시작 시 제어]
        dict_time_hh = {'AIE-800{}'.format(g_number): int(time_hh)}
        # [시작 분 제어]
        dict_time_mm = {'AIE-810{}'.format(g_number): int(time_mm)}

        li = [
                oper, dict_vv, dict_scraper_loc, dict_g_ws, ws_time, dict_sch,
                dict_start_state, dict_time_hh, dict_time_mm, dict_ws_trend
            ]

        # AIE-900X 에 대한 Dictionary 생성
        g_data = li
        json_g_data = json.dumps(g_data).replace('NaN','""').replace('nan', '""').replace('null', '""')
        
        del [[df_base]]

        return json_g_data


    def get_df_latest( self, df ):
        '''
            최근 실시간 데이터 가져오기
            @return
                - 최근 1분 실시간 데이터
        '''
        df_latest = df[ df.index.max() == df.index ].copy()
        df_latest.fillna(value=0.0, inplace=True)

        return df_latest


    def update_job( self, sn, job_datetime = None):
        '''
            실시간 결과 저장
            DataFrame column이 DB와 매칭되어야 하기 때문에 df_e_ai_data DataFrame은 ai_sedimentation_realtime의 컬럼과 동일해야함
        '''

        ana_col_dict = self.ana_col_dict
        col_dict = self.col_dict
        inv_dict = self.inv_dict
        control_dict = self.control_dict
        
        # 설정에 맞는 기본 정보 가져옴
        colist = tuple(ana_col_dict[sn] + sum(list(col_dict[sn].values()), []) + sum(list(inv_dict[sn].values()), []))
        df = self.update_realtime(colist, job_datetime) # SCADA에서 받아온 조회시간부터7일간의 값
        df_latest = self.get_df_latest(df) # 조회 시간이 지연되었을 경우를 대비한 최근 1분 값
        df_init   = com.get_df_init() # 침전공정에서 설정한 상수에 대한 값

        df_sch = None

        # 원수 유입유량, 원수 탁도, PACS 주입량, 활성탄 주입률, 가성소다주입량
        # main_cols 수정
        # FRI-1003 → b_in_fr, TBI-1001 → b_tb, FRI-2001 → c_mm_fr, SRC-2032 → c_mm_fr_etc1, FRI-2003 → c_mm_fr_etc2
        main_cols = ana_col_dict[sn]

        # 1계열 중탁도, 2계열 중탁도는 DB에 컬럼이 없어서 별도 처리
        #df_g_cols = ['TBI_2500','TBI_2510']

        df_e_ai_data = df_latest[df_latest.columns[df_latest.columns.isin(main_cols)]].copy()
        df_e_ai_data = df_e_ai_data[ana_col_dict[sn][:10]]
        df_e_ai_data.columns = ['b_tb', 'b_in_fr1', 'b_in_fr2', 'c_mm_fr1', 'c_mm_fr2', 'c_mm_fr3', 'c_mm_fr_etc1', 'c_mm_fr_etc2', 'c_mm_fr_etc3_1', 'c_mm_fr_etc3_2']
        # df_lv = df_latest[df_latest.columns[df_latest.columns.isin(df_g_cols)]].copy() # [taez]    

        sludge_limit, scraper_standby, scraper_run_distance, scraper_run_times = com.get_default_constant()

        # UI에서 설정한 AI 운전모드
        df_e_ai_data['AIE-1000'] = df_init.set_index('item').at['e_operation_mode', 'value']

        # 운전 침전지 수
        # 응집지의 유입밸브 확인하여 그 값이 0 이면 열림 1이면 닫힘으로 닫힘은 운전 침전지가 아니라고 판단한다
        g_opt_cnt = com.get_run_oper_cnt(df_latest, col_dict[sn])

        # 슬러지양 -- AI 실시간
        df_one_pred, df_multi_pred = self.get_ws(df, sn)

        # pred_y      = df_one_pred[0]
        pred_ws_val = df_one_pred[1]
        real_ws_val = df_one_pred[2]

        # AI 슬러지 발생량 예측
        df_e_ai_data['AIE-5300'] = round(pred_ws_val, 4)

        # [총 슬러지 발생량]
        df_multi_pred['datetime'] = df_multi_pred.index.strftime('%Y-%m-%d')
        df_multi_pred.index = df_multi_pred['datetime']
        df_multi_pred.drop('datetime', axis=1, inplace=True)
        df_multi_pred.columns = ['AIE-5200']
        df_multi_pred = df_multi_pred.round(4)
        df_multi_pred = df_multi_pred.fillna(method='bfill').fillna(method='ffill').fillna(0)
        json_aie_5200 = df_multi_pred['AIE-5200'].to_dict()
        df_e_ai_data['AIE-5200'] = str(json_aie_5200)
        df_e_ai_data.fillna(0)

        # 주요인자
        df_factor = df_e_ai_data[['b_tb', 'b_in_fr1', 'b_in_fr2', 'c_mm_fr1', 'c_mm_fr2', 'c_mm_fr3', 'c_mm_fr_etc1', 'c_mm_fr_etc2', 'c_mm_fr_etc3_1', 'c_mm_fr_etc3_2']]
        df_factor['b_in_fr'] = df_factor['b_in_fr1'] + df_factor['b_in_fr2']
        df_factor['c_mm_fr'] = df_factor['c_mm_fr1'] + df_factor['c_mm_fr2'] + df_factor['c_mm_fr3']
        df_factor['c_mm_fr_etc3'] = df_factor['c_mm_fr_etc3_1'] + df_factor['c_mm_fr_etc3_2']
        df_factor['c1_cf_coagulant'] = 11
        inval_factor = df_factor[['b_in_fr', 'b_tb', 'c1_cf_coagulant', 'c_mm_fr', 'c_mm_fr_etc1', 'c_mm_fr_etc2', 'c_mm_fr_etc3']].to_json(orient='records')
        
        # 침전지별 슬러지 양
        g_ws = round( real_ws_val / g_opt_cnt, 4)

        # 대차 스케줄 표 작성
        try:
            df_sch = self.make_scraper_schedule( df_init, df_latest, col_dict, control_dict[sn], g_ws, g_opt_cnt, inval_factor, sn, job_datetime)
        except FileNotFoundError as e:
            df_sch = None
        except (ValueError, KeyError) as e:
            df_sch = None
        except Exception as e:
            df_sch = None

        if df_sch is None: 
            dataframe_path = PROC_PATH + '/data'
            dataframe_name = 'E_sch_data.csv'
            dataframe_path_filename = os.path.join(dataframe_path, dataframe_name)

            df_sch = pd.read_csv( dataframe_path_filename, dtype={'g': int,'latest': str,'next_start': str,'next_end': str, \
                                                                'start': str,'stop': str,'time_hh':str,'time_mm':str,'state': int, \
                                                                'ai_mode': int, 'updatetime': str})
            
            alarm_obj = {
            'alarm_id': 134002,
            'time' : datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            rn_ti = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            com.set_ai_sedimentation_alarm(alarm_obj, rn_ti)


        # 침전지 지 시작 ----------------------->
        for g_number in range(1, 9):
            g_bogie_tot_time, _ = com.get_bogie_speed_time(df_latest, col_dict[sn], g_number)
            df_e_ai_data['AIE-900{}'.format(g_number)] = self.get_g_data(df_latest, g_number, g_ws, g_bogie_tot_time, df_sch, inv_dict, sn, job_datetime )
        # 침전지 지 끝   ----------------------->
        df_e_ai_data['update_time'] = df_e_ai_data.index

        # 적재테이블 만들기 
        in_val_json = df_e_ai_data[['b_tb', 'b_in_fr1', 'b_in_fr2', 'c_mm_fr1', 'c_mm_fr2', 'c_mm_fr3', 'c_mm_fr_etc1', 'c_mm_fr_etc2', 'c_mm_fr_etc3_1', 'c_mm_fr_etc3_2']].to_json(orient='records')
        out_val_json = df_e_ai_data[['AIE-5200', 'AIE-5300', 'AIE-9001', 'AIE-9002', 'AIE-9003', 'AIE-9004', 'AIE-9005', 'AIE-9006', 'AIE-9007', 'AIE-9008']].to_json(orient='records')
        in_val_json = str(in_val_json).replace("\\", "")
        in_val_json = str(in_val_json).replace(" ", "")
        out_val_json = str(out_val_json).replace("\\", "")
        out_val_json = str(out_val_json).replace('"{', "{")
        out_val_json = str(out_val_json).replace('}"', "}")
        out_val_json = str(out_val_json).replace("'2", '"2')
        out_val_json = str(out_val_json).replace("':", '":')
        #out_val_json = str(out_val_json).replace(" ", "")
        out_val_json = str(out_val_json).replace('"[{', "[{")
        out_val_json = str(out_val_json).replace('}]"', "}]")

        df_e_ai_result = pd.DataFrame(columns = ['upd_ti', 'AI_OPR', 'IN_VAL', 'OUT_VAL'], index=[df_e_ai_data.index[0]])
        df_e_ai_result['upd_ti']  =  df_e_ai_data.index[0]
        df_e_ai_result['AI_OPR']  =  df_e_ai_data['AIE-1000'][0]
        df_e_ai_result['IN_VAL']  =  in_val_json
        df_e_ai_result['OUT_VAL'] =  out_val_json
        
        try:
            com.set_ai_sedimentation_realtime( df_e_ai_result )
            print('[Process] 분석결과 데이터 적재 완료')
        except Exception as e:
            print('[Process Error] 분석결과 데이터 적재 실패..')

        del [[df_latest, df_init, df_one_pred]]