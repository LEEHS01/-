import datetime
import itertools
import json
import os
import socket
import threading
import time
import mysql.connector
import pandas as pd
import traceback
import logging
import logging.handlers

import psutil
from modules.messageProducer import MessageProducer
from apscheduler.schedulers.blocking import BlockingScheduler
# from ems_pump_event_generator import ems_pump_event_generator

def connect_to_db():
    # Configuration 파일에 설정된 DB에 연결, 3회까지 연결 시도
    max_retries = 3
    retries = 0
    conn = None
    
    while retries < max_retries:
        try:
            # db_host = g_settings.get('db_host')  
            # db_port = g_settings.get('db_port')  
            # db_user = g_settings.get('db_user') 
            # db_password = g_settings.get('db_password') 
            # db_database = g_settings.get('database')
            
            conn = mysql.connector.connect(
                host = g_db_host,
                port = g_db_port,
                user = g_db_user,
                password = g_db_password,
                database = g_db_database
            )
            
            if conn.is_connected():
                return conn
            
        except mysql.connector.Error as err:
            print(f"DB connection error!!: {err}")
            logger.error(f"DB connection error!!: {err}")
            
            retries += 1
            print(f"Retry {retries}/{max_retries}...")
            
    if conn is None:
        print("DB connection failed!!")
        logger.error("DB connection failed!!")
        raise Exception("DB connection failed!!")
        
    return conn


def get_ptr_ctr_inf_data(db_cursor, idx, time):
    # Kafka 전송 조건을 위한 AI Mode 관련 Tag 데이터 확인
    try:
        if g_ptr_ctr_inf_table is not None:
            # use_cols = "tag, value"
            use_cols = "tag, value, UPDT_TIME"
            # conditions = f"`RGSTR_TIME` IN (SELECT MAX(`RGSTR_TIME`) FROM {g_ptr_ctr_inf_table} GROUP BY `tag`"
            # sql = f"SELECT {use_cols} FROM {g_ptr_ctr_inf_table} WHERE {conditions}"        
            sql = f"SELECT {use_cols} FROM {g_ptr_ctr_inf_table}"        
            db_cursor.execute(sql)
            result = db_cursor.fetchall()
            
            col_name = [i[0] for i in db_cursor.description]
            ptr_ctr_inf_df = pd.DataFrame(result, columns=col_name)
            # ptr_ctr_inf_df = ptr_ctr_inf_df.set_index('tag').T.iloc[-1:,:]
            ptr_ctr_inf_df = ptr_ctr_inf_df.set_index('tag').T.iloc[:,:]
            ptr_ctr_inf_df = ptr_ctr_inf_df.fillna(0)
            # logger.debug(ptr_ctr_inf_df)
        else:
            ptr_ctr_inf_df = None

        ai_mode = ptr_ctr_inf_df.at['value', g_ai_mode_tag[idx]['ai_mode']]
        auto_onoff = ptr_ctr_inf_df.at['value', g_ai_mode_tag[idx]['auto']]
        halfauto_onoff = ptr_ctr_inf_df.at['value', g_ai_mode_tag[idx]['half_auto']]
        web_confirm = ptr_ctr_inf_df.at['value', g_ai_mode_tag[idx]['web_confirm']]
        ai_result = ptr_ctr_inf_df.at['value', g_ai_mode_tag[idx]['ai_result']]
        logger.debug(f"idx:{idx}, {g_ai_mode_tag[idx]}")
        
        if bool(ai_mode):
            if bool(halfauto_onoff): # AI 추천모드의 경우, 사용자 확인 Tag의 UPDT_TIME 시간 확인
                updated_time = ptr_ctr_inf_df.at['UPDT_TIME', g_ai_mode_tag[idx]['web_confirm']]
            elif bool(auto_onoff): # AI 운영모드(자동)의 경우, AI 결과 변경 Tag의 UPDT_TIME 시간 확인
                updated_time = ptr_ctr_inf_df.at['UPDT_TIME', g_ai_mode_tag[idx]['ai_result']]
            time_diff = abs(time - updated_time)
            
            # UPDT_TIME과 전송할 펌프제어 Tag 레코드의 time이 일치하면 Pending하지 않고 Kafka 전송하도록 pending_flag = False
            if time_diff == datetime.timedelta(seconds=0):
                pending_flag = False
            else:
                pending_flag = True

        else:
            pending_flag = False

    except:
        pending_flag = False
        ai_mode = 0
        auto_onoff = 0
        halfauto_onoff = 0
        web_confirm = 0
        ai_result = 0

        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    logger.debug(f"idx:{idx} pending_flag={pending_flag}, ai_mode={ai_mode}, " \
                 f"auto_onoff={auto_onoff}, halfauto_onoff={halfauto_onoff}, web_confirm={web_confirm}, ai_result={ai_result}")
    
    return pending_flag, ai_mode, auto_onoff, halfauto_onoff, web_confirm, ai_result


# return: mode_res, ai_mode_res
#         mode_res: 0-don't send, 1-send, 2-pending
#         ai_mode_re: 0-not AI mode or don't care, 1-AI Auto mode, 2-AI HalfAuto mode 
def check_kafka_send(db_cursor, idx, time): 
    # Configuration 파일에서 ture인 경우, 제어태그를 Kafka 전송하지 않음, 테스트용
    if bool(g_ctrl_no_pass_mode):
        return 0, 0

    if idx is  None:
        idx = 0
    elif type(idx) is str:
        idx = int(idx)

    # 해당 펌프제어 태그를 Kafka 전송해야 하는지 확인하기 위한 TB_PTR_CTR_INF의 AI 관련 Tag 데이터 
    pending_flag, ai_mode, auto_onoff, halfauto_onoff, web_confirm, ai_result = get_ptr_ctr_inf_data(db_cursor, idx, time)
# for test
#    pending_flag = 0
#    ai_mode = 1 
#    auto_onoff = 0 
#    halfauto_onoff = 1 
#    web_confirm = 1
    
    # 해당 펌프제어 태그 전송을 Pending하고 다음 프로그램 실행 주기에 다시 전송조건 확인
    if bool(pending_flag) == True:
        return 2, 0
    
    if bool(ai_mode):
        if bool(auto_onoff):
            if bool(ai_result): # AI운영 모드의 경우, 해당 펌프제어 태그 전송 
                return 1, 1 # AI Auto Mode
            else: 
                return 0, 0
        elif bool(halfauto_onoff):
            if bool(web_confirm): # AI추천 모드에서 펌프제어 팝업창의 적용 버튼이 선택된 경우, 해당 펌프제어 태그 전송
                return 1, 2 # AI Half-auto Mode
            else: # AI추천 모드에서 펌프제어 팝업창의 취소 버튼이 선택되거나 Timeout이 발생한 경우, 해당 펌프제어 태그 전송하지 않음
                return 0, 0
        else: # AI 모드가 아니므로 해당 펌프제어 태그 전송하지 않음
            return 0, 0
    else:
        return 0, 0


# return: 0-don't send, 1-send
def check_kafka_send_by_rules(db_cursor, idx, time): 
    # Configuration 파일에서 ture인 경우, 제어태그를 Kafka 전송하지 않음, 테스트용
    if bool(g_ctrl_no_pass_mode):
        return 0

    if idx is  None:
        idx = 0
    elif type(idx) is str:
        idx = int(idx)

    pending_flag, ai_mode, auto_onoff, halfauto_onoff, web_confirm, ai_result = get_ptr_ctr_inf_data(db_cursor, idx, time)
# for test
#    pending_flag = 0
#    ai_mode = 1 
#    auto_onoff = 0 
#    halfauto_onoff = 1 
#    web_confirm = 1
    
    if bool(ai_mode): # AI운영 모드의 경우, 해당 펌프제어 태그 전송 
        return 1
    else:
        return 0


def send_kafka_db_data(loc_idx, producer, row, time_col, cvt_need_cols):
    try:
        for col_nm in cvt_need_cols:
            try:
            # 정수로 형변환
                if ('-' not in row[col_nm] and ':' not in row[col_nm] and '.' not in row[col_nm]):
                    row[col_nm] = int(row[col_nm])
            # 소수로 형변환
                elif ('-' not in row[col_nm] and ':' not in row[col_nm] and '.' in row[col_nm]):
                    row[col_nm] = float(row[col_nm])
            except:
                pass
            
        # # (for test
        # new_tag = f"[{loc_idx}] tag"
        # row = row.rename(index={'tag': new_tag})
        # # )for test    
        
        # DATETIME 타입의 time 칼럼을 String Format으로 변환
        row[time_col] = pd.to_datetime(row[time_col]).strftime('%Y-%m-%d %H:%M:%S')
        # Kafka 전송을 위해 JSON 타입으로 변환
        row_res = row.to_json(date_format='iso')
        jsonObject = json.loads(row_res)
        
        # Kafka 전송 수행
        res = producer.send_message(jsonObject, False)
        # logger.debug(json.dumps(jsonObject) + json.dumps(res))
        logger.debug(f"[{loc_idx}]: {json.dumps(jsonObject)}, {json.dumps(res)}")
        print(jsonObject, res)
        return 1 # Kafka 전송 성공: update_flag = 1

    except Exception as e: 
        print("Exception: ", e)
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return 0 # Kafka 전송 중 오류 발생: update_flag = 0


def insert_ctrl_event(db_conn, db_cursor, db_tb, data, logger):
    # TB_EMS_ALARM에 펌프제어 완료 알람 이벤트 Insert
    try:
        sql = f"INSERT IGNORE INTO {db_tb} (`ALARM_ID`,`TIME`,`MSG`,`LINK`,`FLAG`) values (%s,%s,%s,%s,%s)"        
        db_cursor.execute(sql, data)
        db_conn.commit()
        logger.info(f"insert_ctrl_event: {data}")
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)


def send_kafka_pump_ctrl_single_tag(loc_idx, db_conn, db_cursor, producer, row, 
                                    ai_mode_res, target_table, pk_cols, time_col, cvt_need_cols):
    # 펌프제어 태그 하나를 JSON 타입으로 변환하여 전송
    update_flag = send_kafka_db_data(loc_idx, producer, row, time_col, cvt_need_cols) # normal case: update_flag = 1

    # Kafka 전송이 정상적으로 수행된 경우 TB_HMI_CTR_TAG의 해당 레코드 FLAG를 1로 업데이트
    if update_flag == 1:
        update_where_array = []
        for idx, key in enumerate(pk_cols):
            update_where_array.append(" %s = '%s' " % (key, row[key]))
        db_flag_update_sql_1 = f"UPDATE {target_table} SET flag = {update_flag} WHERE "
        db_flag_update_sql_2 = " and ".join(update_where_array)
        db_flag_update_sql = db_flag_update_sql_1 + db_flag_update_sql_2
        db_cursor.execute(db_flag_update_sql)
        db_conn.commit()
        
        # insert control tag log
        ctr_insert_sql = f"insert ignore into TB_HMI_CTR_LOG (`tag`,`time`,`value`,`FLAG`) values {row['tag'], row['time'], row['value'], ai_mode_res}"
        db_cursor.execute(ctr_insert_sql)
        db_conn.commit()
        
    # Kafka 전송 중 오류가 발생한 경우 Exception을 전달하여 동시간대의 이후 펌프제어도 수행하지 않도록 조치
    else:
        raise Exception(f"[{loc_idx}]: Kafka sending error!! [{row}]")


def send_kafka_pump_ctrl_tags(loc_idx, db_conn, db_cursor, producer, pump_on_msg, pump_off_msg, 
                              pump_freq_msg, target_table, pk_cols, time_col, cvt_need_cols):
    try:
        ai_mode = 0 # 0: Before setting, 1: Auto, 2:Half-auto
        tag_time = None
        # 펌프 On 제어없이 주파수 제어만 있는 펌프에 대한 주파수 제어 태그 전송 Loop
        for p_freq in pump_freq_msg:
            f_row, ai_mode, f_idx = p_freq
            tag_time = f_row[time_col]
            
            send_flag = True
            for p_on in pump_on_msg:
                p_row, ai_mode, p_idx = p_on
                if p_idx == f_idx: # 펌프 On 제어가 함께 수행되어야 하는 펌프의 경우에는 이후 펌프 On 제어태그를 먼저 전송하도록 함
                    send_flag = False
                    break
                
            if send_flag == True:
                # 주파수 제어 태그를 JSON 타입으로 변환하여 전송 후 FLAG 업데이트 
                send_kafka_pump_ctrl_single_tag(loc_idx, db_conn, db_cursor, producer, f_row, 
                                                ai_mode, target_table, pk_cols, time_col, cvt_need_cols)
        
        # 펌프 On/Off 제어 태그 전송 Loop
        # 펌프 On 제어 태그 전송 -> 일정 시간(현재 1분) Sleep -> 펌프 Off 제어 태그 전송 -> Sleep -> 펌프 On 제어 태그 전송...
        combined_length = max(len(pump_on_msg), len(pump_off_msg))        
        for idx, (p_on, p_off) in enumerate(itertools.zip_longest(pump_on_msg, pump_off_msg)):
            if p_on is not None:
                row, ai_mode, p_idx = p_on 
                tag_time = row[time_col]
                # 펌프 On 제어 태그를 JSON 타입으로 변환하여 전송 후 FLAG 업데이트
                send_kafka_pump_ctrl_single_tag(loc_idx, db_conn, db_cursor, producer, row, 
                                                ai_mode, target_table, pk_cols, time_col, cvt_need_cols)
                for p_freq in pump_freq_msg:
                    row, ai_mode, f_idx = p_freq
                    if p_idx == f_idx:
                        # time.sleep(g_ctrl_waiting_time)
                        # 주파수 제어가 함께 수행되어야 하는 펌프의 경우 주파수 제어 태그를 JSON 타입으로 변환하여 전송 후 FLAG 업데이
                        send_kafka_pump_ctrl_single_tag(loc_idx, db_conn, db_cursor, producer, row, 
                                                        ai_mode, target_table, pk_cols, time_col, cvt_need_cols)
                        break
                
                # 전송할 On/Off 제어 태그가 남은 경우 설정된 시간동안 Sleep
                if idx != combined_length - 1 or p_off is not None:
                    time.sleep(g_ctrl_waiting_time)
                    
            if p_off is not None:
                row, ai_mode, p_idx = p_off
                tag_time = row[time_col]
                # 펌프 Off 제어 태그를 JSON 타입으로 변환하여 전송 후 FLAG 업데이트
                send_kafka_pump_ctrl_single_tag(loc_idx, db_conn, db_cursor, producer, row, 
                                                ai_mode, target_table, pk_cols, time_col, cvt_need_cols)
                
                # 전송할 On/Off 제어 태그가 남은 경우 설정된 시간동안 Sleep
                if idx != combined_length - 1:
                    time.sleep(g_ctrl_waiting_time)
        
        # TB_EMS_ALARM에 펌프제어 완료 알람 이벤트 Insert 
        current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        alarm_msg = f"{g_alarm_loc[loc_idx]}의 {g_alarm_msg} ({tag_time})"
        # alarm_msg = g_alarm_msg
        insert_ctrl_event(db_conn, db_cursor, g_alarm_table, 
                            (g_alarm_id_end, current_time, alarm_msg, g_alarm_link, g_db_flag), logger)

    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return


def process_pump_ctrl(loc_idx, db_conn, db_cursor, target_table, target_cols, pk_cols, 
                      time_col, cvt_need_cols, excluded_tags, idx_col, producer, topic):
    print(f"@@@ {loc_idx}: > [process_pump_ctrl] DB_TBL: {target_table}, TOPIC:{topic}, BROKER:{g_kafka_brokers}")
    logger.info(f"@@@ {loc_idx}: > [process_pump_ctrl] DB_TBL: {target_table}, TOPIC:{topic}, BROKER:{g_kafka_brokers}") # not critical, just to print always

    try:
        # FLAG가 0인 레코드만 전송하기 위해 Select
        sql = f"SELECT * FROM {target_table} WHERE FLAG = 0 AND {idx_col} = {loc_idx};"        
        db_cursor.execute(sql)
        result = db_cursor.fetchall()

        # 전송할 펌프제어 태그가 없거나 오류 발생시 Return
        if len(result) <= 0:
            logger.info(f" {loc_idx}: {target_table} data length == 0, there is no data!")
            return

        logger.info(f" {loc_idx}: [{target_table}] result length = {len(result)}")
        # 전송할 DB 레코드들을 Pandas Data Frame으로 변환
        col_name = [i[0] for i in db_cursor.description]
        tb_df = pd.DataFrame(result, columns=col_name)[target_cols]
        # logger.debug(tb_df)
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return
    
    logger.debug(f"@@@ {loc_idx}: > START:: process_pump_ctrl[{topic}]: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    pump_on_msg = [] # 펌프 On 제어태그 List
    pump_off_msg = [] # 펌프 Off 제어태그 List
    pump_freq_msg = [] # 펌프 주파수 제어태그 List
    # Kafka 전송할 DB 레코드 Loop
    for i, row in tb_df.iterrows():
        update_flag = 5 # 0:not sent yet, 1:sent, 3:ctrl tags when AI mode conditions are not met, 4:excluded, 5:before processed

        # 전송이 불필요한 Tag List에 포함되어 있는지 확인
        if row['tag'] in excluded_tags:
            update_flag = 4
            logger.debug(f" {loc_idx}: {target_table}:{row['tag']} is in excluded_tags")
        
        else:
            old_data_flag = False
            if time_col != "" and time_col != None:
                current_time = datetime.datetime.now()
                time_diff = abs(current_time - row[time_col])
                
                # 오래된 제어 태그는 전송하지 않도록 time 컬럼 Check
                if time_diff >= datetime.timedelta(seconds=g_old_data_check_time[loc_idx]):
                    old_data_flag = True
            
            # Old 데이터인 경우에는 FLAG를 3으로 설정하고 전송 Skip
            if old_data_flag == True:
                update_flag = 3
                logger.debug(f" {loc_idx}: {target_table}:{row['tag']} [{row[time_col]}]: Old Data!")
            
            # AI Mode를 확인하여 전송할 펌프제어 태그 리스트 작성    
            else:          
                mode_res, ai_mode_res = check_kafka_send(db_cursor, row[idx_col], row[time_col]) # TB_HMI_CTR_TAG
                if mode_res == 1: # kafka tx condition: ok
                    update_flag = 0
                    row.drop(idx_col, inplace=True)
                    
                    if row['tag'] in g_pump_on_tag[loc_idx]:
                        pump_on_msg.append((row, ai_mode_res, g_pump_on_tag[loc_idx].index(row['tag'])))
                    elif row['tag'] in g_pump_off_tag[loc_idx]:
                        pump_off_msg.append((row, ai_mode_res, g_pump_off_tag[loc_idx].index(row['tag'])))
                    elif row['tag'] in g_pump_freq_tag[loc_idx]:
                        pump_freq_msg.append((row, ai_mode_res, g_pump_freq_tag[loc_idx].index(row['tag'])))

                # 펌프제어 팝업이 발생했으나 아직 운영자가 확인하지 않은 상태
                elif mode_res == 2: # kafka tx condition: pending
                    update_flag = 0
                    logger.debug(f" {loc_idx}: {target_table}:{row['tag']} [{row[time_col]}]: check_kafka_send is pending")

                # Kafka 전송 조건 맞지 않음, AI Mode가 아니거나 펌프제어 팝업이 취소된 상태
                else:
                    update_flag = 3
                    logger.debug(f" {loc_idx}: {target_table}:{row['tag']}: check_kafka_send is False")
        
        try:
            # 전송 Pending 또는 kafka 전송 예정 상태가 아니면 FLAG 컬럼 업데이트
            if update_flag != 0:
                update_where_array = []
                for idx, key in enumerate(pk_cols):
                    update_where_array.append(" %s = '%s' " % (key, row[key]))
                db_flag_update_sql_1 = f"UPDATE {target_table} SET flag = {update_flag} WHERE "
                db_flag_update_sql_2 = " and ".join(update_where_array)
                db_flag_update_sql = db_flag_update_sql_1 + db_flag_update_sql_2
                db_cursor.execute(db_flag_update_sql)
                db_conn.commit()
        except:
            traceback_message = traceback.format_exc()
            logger.error(traceback_message)
            
    try:
        logger.debug(f" {loc_idx}: pump_on_msg CNT: {len(pump_on_msg)}")
        logger.debug(f" {loc_idx}: pump_off_msg CNT: {len(pump_off_msg)}")
        logger.debug(f" {loc_idx}: pump_freq_msg CNT: {len(pump_freq_msg)}")
        
        # AI 모드 조건을 만족하는 펌프제어 태그들을 전송에 필요한 정보와 전달하여 실제 Kafka Producing 수행
        if len(pump_on_msg) > 0 or len(pump_off_msg) > 0 or len(pump_freq_msg) > 0:
            # Send one pump control tag, then wait for a specified time before sending the next tag.
            send_kafka_pump_ctrl_tags(loc_idx, db_conn, db_cursor, producer, pump_on_msg, pump_off_msg, 
                                    pump_freq_msg, target_table, pk_cols, time_col, cvt_need_cols)

        logger.debug(f"@@@ {loc_idx}: > END:: process_pump_ctrl[{topic}]: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return

# Rule에 의한 제어, 운영자의 UI 컨펌없이 즉시 전송, 금산정수장용
# Return: True-펌프제어 태그 전송 정상 수행, False-펌프제어 태그 전송 수행되지 않음
def process_pump_ctrl_by_rules(loc_idx, db_conn, db_cursor, target_table, target_cols, pk_cols, 
                      time_col, cvt_need_cols, excluded_tags, idx_col, producer, topic):
    print(f"@@@ {loc_idx}: > [process_pump_ctrl_by_rules] DB_TBL: {target_table}, TOPIC:{topic}, BROKER:{g_kafka_brokers}")
    logger.info(f"@@@ {loc_idx}: > [process_pump_ctrl_by_rules] DB_TBL: {target_table}, TOPIC:{topic}, BROKER:{g_kafka_brokers}") # not critical, just to print always

    try:
        # FLAG가 0인 레코드만 전송하기 위해 Select
        sql = f"SELECT * FROM {target_table} WHERE FLAG = 9 AND {idx_col} = {loc_idx};"        
        db_cursor.execute(sql)
        result = db_cursor.fetchall()

        # 전송할 펌프제어 태그가 없거나 오류 발생시 Return
        if len(result) <= 0:
            logger.info(f" {loc_idx}: {target_table} data length == 0, there is no data by rules!")
            return False

        logger.info(f" {loc_idx}: [{target_table}] result length = {len(result)}")
        # 전송할 DB 레코드들을 Pandas Data Frame으로 변환
        col_name = [i[0] for i in db_cursor.description]
        tb_df = pd.DataFrame(result, columns=col_name)[target_cols]
        # logger.debug(tb_df)
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return False
    
    logger.debug(f"@@@ {loc_idx}: > START:: process_pump_ctrl_by_rules[{topic}]: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    pump_on_msg = [] # 펌프 On 제어태그 List
    pump_off_msg = [] # 펌프 Off 제어태그 List
    pump_freq_msg = [] # 펌프 주파수 제어태그 List
    # Kafka 전송할 DB 레코드 Loop	
    for i, row in tb_df.iterrows():
        update_flag = 5 # 0:not sent yet, 1:sent, 3:ctrl tags when AI mode conditions are not met, 4:excluded, 5:before processed

        # 전송이 불필요한 Tag List에 포함되어 있는지 확인
        if row['tag'] in excluded_tags:
            update_flag = 4
            logger.debug(f" {loc_idx}: {target_table}:{row['tag']} is in excluded_tags")
        
        else:
            old_data_flag = False
            if time_col != "" and time_col != None:
                current_time = datetime.datetime.now()
                time_diff = abs(current_time - row[time_col])
                
                # 오래된 데이터는 전송하지 않도록 time 컬럼 Check
                if time_diff >= datetime.timedelta(seconds=g_old_data_check_time[loc_idx]):
                    old_data_flag = True
            
            # Old 데이터인 경우에는 FLAG를 3으로 설정하고 전송 Skip 
            if old_data_flag == True:
                update_flag = 3
                logger.debug(f" {loc_idx}: {target_table}:{row['tag']} [{row[time_col]}]: Old Data!")
                
            # AI Mode를 확인하여 전송할 펌프제어 태그 리스트 작성
            else:                
                mode_res = check_kafka_send_by_rules(db_cursor, row[idx_col], row[time_col]) # TB_HMI_CTR_TAG
                if mode_res == 1: # kafka tx condition: ok
                    update_flag = 0
                    row.drop(idx_col, inplace=True)
                    
                    if row['tag'] in g_pump_on_tag[loc_idx]:
                        pump_on_msg.append((row, 9, g_pump_on_tag[loc_idx].index(row['tag'])))
                    elif row['tag'] in g_pump_off_tag[loc_idx]:
                        pump_off_msg.append((row, 9, g_pump_off_tag[loc_idx].index(row['tag'])))
                    elif row['tag'] in g_pump_freq_tag[loc_idx]:
                        pump_freq_msg.append((row, 9, g_pump_freq_tag[loc_idx].index(row['tag'])))
                        
                # Kafka 전송 조건 맞지 않음, AI Mode가 아님
                else:
                    update_flag = 3
                    logger.debug(f" {loc_idx}: {target_table}:{row['tag']}: check_kafka_send_by_rules is False")
        
        try:
            # kafka 전송 예정 상태가 아니면 FLAG 컬럼 업데이트
            if update_flag != 0:
                update_where_array = []
                for idx, key in enumerate(pk_cols):
                    update_where_array.append(" %s = '%s' " % (key, row[key]))
                db_flag_update_sql_1 = f"UPDATE {target_table} SET flag = {update_flag} WHERE "
                db_flag_update_sql_2 = " and ".join(update_where_array)
                db_flag_update_sql = db_flag_update_sql_1 + db_flag_update_sql_2
                db_cursor.execute(db_flag_update_sql)
                db_conn.commit()
        except:
            traceback_message = traceback.format_exc()
            logger.error(traceback_message)
            
    try:
        logger.debug(f" {loc_idx}: pump_on_msg CNT: {len(pump_on_msg)}")
        logger.debug(f" {loc_idx}: pump_off_msg CNT: {len(pump_off_msg)}")
        logger.debug(f" {loc_idx}: pump_freq_msg CNT: {len(pump_freq_msg)}")
        
        # 펌프제어 태그들을 전송에 필요한 정보와 전달하여 실제 Kafka Producing 수행
        if len(pump_on_msg) > 0 or len(pump_off_msg) > 0 or len(pump_freq_msg) > 0:
            # Send one pump control tag, then wait for a specified time before sending the next tag.
            send_kafka_pump_ctrl_tags(loc_idx, db_conn, db_cursor, producer, pump_on_msg, pump_off_msg, 
                                    pump_freq_msg, target_table, pk_cols, time_col, cvt_need_cols)

        logger.debug(f"@@@ {loc_idx}: > END:: process_pump_ctrl_by_rules[{topic}]: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        return True
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return False


def load_settings(file_name):
    # 프로그램 설정 파일 Load
    try:
        json_file_path = file_name
        with open(json_file_path, 'r', encoding='utf-8') as file:
            config = json.load(file)
            return config
    except FileNotFoundError:
        print(f"Cannot find {json_file_path} file.")
        logger.error(f"Cannot find {json_file_path} file.")
        return None


def process_pump_control_one_location(idx):
    try:
        # Master로 동작하는 AI 플랫폼 #1 또는 #2 하나의 서버에서만 프로그램이 실행되어야 함
        isActive = isActiveSystem()
        if isActive == False:
            logger.error(f"[{idx}]: Currently this server is not master...")
            return
        
        logger.debug(f"[{idx}]: START process_pump_control_one_location")
        conn = connect_to_db()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        raise Exception("DB connection failed!!")
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Kafka 전송이 필요한 DB 테이블의 정보
        kafka_topic = g_tb_info['kafka_topic']
        target_table = g_tb_info['db_table']
        target_cols = g_tb_info['target_cols']
        pk_cols = g_tb_info['pk_cols']
        cvt_need_cols = g_tb_info['cvt_need_cols']
        time_col = g_tb_info['time_col']
        excluded_tags = g_tb_info['excluded_tags']
        idx_col = g_tb_info['idx_col']
        
        kafka_producer = MessageProducer(g_kafka_brokers, g_tb_info['kafka_topic'])
        
        # Rule에 의한 펌프제어 태그를 먼저 처리
        ruleTag = process_pump_ctrl_by_rules(idx, conn, cursor, target_table, target_cols, pk_cols, time_col, 
                          cvt_need_cols, excluded_tags, idx_col, kafka_producer, kafka_topic)
        
        # Rule에 의한 펌프제어 태그 전송이 발생하지 않거나 수행되지 않은 경우, 일반적인 펌프제어 태그 전송에 필요한 정보와 데이터를 전달하여 실제 Kafka Producing 수행
        if ruleTag == False:
            process_pump_ctrl(idx, conn, cursor, target_table, target_cols, pk_cols, time_col, 
                          cvt_need_cols, excluded_tags, idx_col, kafka_producer, kafka_topic)
        
        cursor.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    try:
        conn.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    try:
        kafka_producer.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    logger.debug(f"[{idx}]: END process_pump_control_one_location")    
    return


def get_ip_addresses():
    ip_list = []
    # Retrieve network interfaces and their addresses
    addrs = psutil.net_if_addrs()
    # Retrieve network interfaces and their statuses
    stats = psutil.net_if_stats()
    
    for interface, addr_info in addrs.items():
        # Check if the interface is up and running
        if stats[interface].isup:
            for addr in addr_info:
                if addr.family == socket.AF_INET:  # Only consider IPv4 addresses
                    ip_list.append(addr.address)
                    
    # logger.debug(f"ip_list : {ip_list}")
    return ip_list


def isActiveSystem():
    # "vip" Key에 해당하는 값이 서버에서 “hostname -I” 명령을 실행하여 도출되는 IP Ad-dress 리스트에 포함되어 있으면 Master임
    ip_list = get_ip_addresses()
    return g_vip in ip_list


if __name__ == "__main__":
    LOG_DIR = 'logs'
    LOG_FILE = 'ems_pump_ctrl_kafka_producer.log'
    LOG_FILE2 = 'ems_pump_alaram_generator.log'

    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    # 펌프제어 태그 전송 Log와 알람 생성 전송 Log를 분리하여 일별로 생성
    logger = logging.getLogger('EMS_PUMP_CTRL_KAFKA')
    logger.setLevel(logging.ERROR)
    logger2 = logging.getLogger('EMS_PUMP_ALARM_GNRTR')
    logger2.setLevel(logging.ERROR)

    file_handler = logging.handlers.TimedRotatingFileHandler(
        filename=f"{LOG_DIR}/{LOG_FILE}", 
        when='midnight', 
        interval=1,
        backupCount=10,  
        encoding='utf-8'
    )
    formatter = logging.Formatter('(%(asctime)s) %(levelname)s [%(filename)s:%(lineno)d]: %(message)s')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    file_handler2 = logging.handlers.TimedRotatingFileHandler(
        filename=f"{LOG_DIR}/{LOG_FILE2}", 
        when='midnight', 
        interval=1,
        backupCount=10,  
        encoding='utf-8'
    )
    file_handler2.setFormatter(formatter)
    logger2.addHandler(file_handler2)
    
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    logger2.addHandler(console_handler)
    
    # 설정 파일 Load
    g_settings = load_settings('settings_pump_ctrl.json')
    if not g_settings:
        logger.error("Exit!![setting file error]")
        logger2.error("Exit!![setting file error]")
        exit()    
        
    # 파일과 콘솔 로그의 레벨을 별도로 지정 
    log_level_file = g_settings.get('log_level_file', 'ERROR').upper()
    log_level_console = g_settings.get('log_level_console', 'ERROR').upper()
    file_handler.setLevel(log_level_file)
    file_handler2.setLevel(log_level_file)
    console_handler.setLevel(log_level_console)
    
    lowest_level = min(file_handler.level, console_handler.level)
    logger.setLevel(lowest_level)
    logger2.setLevel(lowest_level)

    # Global Configuration Loading
    g_vip = g_settings.get('vip')  
    g_db_host = g_settings.get('db_host')  
    g_db_port = g_settings.get('db_port')  
    g_db_user = g_settings.get('db_user') 
    g_db_password = g_settings.get('db_password') 
    g_db_database = g_settings.get('database')
    
    g_tb_info = g_settings.get('tb_info', None)
    g_loc_cnt = g_settings.get('loc_cnt', 0)
    g_ai_mode_tag = g_settings.get('ai_mode_tag', None)
    g_pump_on_tag = g_settings.get('pump_on_tag', None)
    g_pump_off_tag = g_settings.get('pump_off_tag', None)
    g_pump_freq_tag = g_settings.get('pump_freq_tag', None)
    g_kafka_brokers = g_settings.get('kafka_brokers', None)
    g_ptr_ctr_inf_table = g_settings.get('ptr_ctr_inf', None)
    g_ctrl_no_pass_mode = g_settings.get('ctrl_no_pass_mode', None)
    g_ctrl_waiting_time = g_settings.get('ctrl_waiting_time', 30)
    g_old_data_check_time = g_settings.get('old_data_check_time', 900)
    
    g_alarm_info =  g_settings.get('alarm_info', None)
    g_alarm_table = g_alarm_info['db_table']
    g_alarm_id_end = g_alarm_info['id_end']
    g_db_flag = g_alarm_info['db_flag']
    g_alarm_msg = g_alarm_info['msg_end']
    g_alarm_link = g_alarm_info['link']
    g_alarm_loc = g_alarm_info['loc']
    
    g_period = g_settings.get('period', 60)
    g_alarm_period = g_settings.get('alarm_period', 10)
    logger.info(f"@@@> Running period: {g_period}s")
    for idx in range(g_loc_cnt):
        logger.info(f"@@@> Old data check time: loc{idx+1} = {g_old_data_check_time[idx]}s")
    logger2.info(f"@@@> Running period: {g_alarm_period}s")
    
    # global g_running_flag
    # g_running_flag = False
    
    scheduler = BlockingScheduler(job_defaults={'max_instances': 1})
    
    # 게통별 펌프제어 태그 전송 기능을 주기적으로 수행하기 위한 스케줄링
    for idx in range(g_loc_cnt):
        # scheduler.add_job(process_pump_control_one_location, args=[idx])
        scheduler.add_job(process_pump_control_one_location, 'interval', seconds=g_period, start_date='2024-04-01 00:00:30', args=[idx])

    # 반자동 모드 펌프 제어 팝업을 띄우기 위한 Event 생성: 일단 Comment out (Front에서 처리)        
    # scheduler.add_job(ems_pump_event_generator, 'interval', seconds=g_alarm_period, 
    #                   start_date='2024-04-01 00:00:30', args=[g_settings, logger2])

    logger.critical(f"@@@> EMS_PUMP_CONTROL_KAFKA_PRODUCER Start!!!") # not critical, just to print always
    scheduler.start()

