import datetime
import json
import os
import socket
import mysql.connector
import pandas as pd
import traceback
import logging
import logging.handlers

import psutil
from modules.messageProducer import MessageProducer
from apscheduler.schedulers.blocking import BlockingScheduler
from alarm_kafka_producer import alarm_kafka_producer


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
            logging.error(f"DB connection error!!: {err}")
            
            retries += 1
            print(f"Retry {retries}/{max_retries}...")
            
    if conn is None:
        print("DB connection failed!!")
        logging.error("DB connection failed!!")
        raise Exception("DB connection failed!!")
        
    return conn


def get_ptr_ctr_inf_data(db_cursor, idx, time):
    # Kafka 전송 조건 확인을 위한 AI Mode 관련 Tag 데이터 확인, 현재 사용 안함
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
        logger.debug(f"idx:{idx}, {g_ai_mode_tag[idx]}")
        
        if bool(halfauto_onoff):
            updated_time = ptr_ctr_inf_df.at['UPDT_TIME', g_ai_mode_tag[idx]['web_confirm']]
            time_diff = abs(time - updated_time)
            
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

        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    logger.debug(f"pending_flag={pending_flag}, ai_mode={ai_mode}, " \
                 f"auto_onoff={auto_onoff}, halfauto_onoff={halfauto_onoff}, web_confirm={web_confirm}")
    
    return pending_flag, ai_mode, auto_onoff, halfauto_onoff, web_confirm


def check_kafka_send(db_cursor, idx, time): # return: 0-don't send, 1-send, 2-pending
    # Kafka 전송 조건 확인을 위한 AI Mode 관련 Tag 데이터 확인, 현재 사용 안함
    if bool(g_ctrl_no_pass_mode):
        return 0, 0

    if idx is  None:
        idx = 0
    elif type(idx) is str:
        idx = int(idx)

    pending_flag, ai_mode, auto_onoff, halfauto_onoff, web_confirm = get_ptr_ctr_inf_data(db_cursor, idx, time)
# for test
#    pending_flag = 0
#    ai_mode = 1 
#    auto_onoff = 0 
#    halfauto_onoff = 1 
#    web_confirm = 1
    
    if bool(pending_flag) == True:
        return 2, 0
    
    if bool(ai_mode):
        if bool(auto_onoff):
            return 1, 1 # AI Auto Mode
        elif bool(halfauto_onoff):
            if bool(web_confirm):
                return 1, 2 # AI Half-auto Mode
            else:
                return 0, 0
        else:
            return 0, 0
    else:
        return 0, 0


def send_kafka_db_data(producer, row, time_col, cvt_need_cols):
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
    
    # DATETIME 타입의 time 칼럼을 String Format으로 변환    
    row[time_col] = pd.to_datetime(row[time_col]).strftime('%Y-%m-%d %H:%M:%S')
    # Kafka 전송을 위해 JSON 타입으로 변환
    row_res = row.to_json(date_format='iso')
    jsonObject = json.loads(row_res)
    try:
        # Kafka 전송 수행
        res = producer.send_message(jsonObject, False)
        logger.debug(json.dumps(jsonObject) + json.dumps(res))
        print(jsonObject, res)
        return 1 # update_flag = 1

    except Exception as e: 
        print("Exception: ", e)
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return 0 # update_flag = 0


def produce_kafka_db_data(tb_df, db_conn, db_cursor, target_table, pk_cols, time_col,
                          cvt_need_cols, excluded_tags, idx_col, topic, ai_mode_check):
    print(f"@@@> [produce_kafka] DB_TBL: {target_table}, TOPIC:{topic}, BROKER:{g_kafka_brokers}")
    logger.info(f"@@@> [produce_kafka] TOPIC:{topic}, BROKER:{g_kafka_brokers}, DATA Length ={len(tb_df)}") # not critical, just to print always

    if len(tb_df) > 0:
        try:
            producer = MessageProducer(g_kafka_brokers, topic)
        except:
            traceback_message = traceback.format_exc()
            logger.error(traceback_message)
            return
        
        logger.debug(f"@@@> START:: produce_kafka_db_data[{topic}]: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        # Kafka 전송할 DB 레코드 Loop
        for i, row in tb_df.iterrows():
            update_flag = 5 # 0:not sent yet, 1:sent, 3:ctrl tags when AI mode conditions are not met, 4:excluded, 5:before processed

            # 전송이 불필요한 Tag List에 포함되어 있는지 확인
            if row['tag'] in excluded_tags:
                update_flag = 4
                logger.debug(f"{target_table}:{row['tag']} is in excluded_tags")
            
            else:
                old_data_flag = False
                if time_col != "" and time_col != None:
                    current_time = datetime.datetime.now()
                    time_diff = abs(current_time - row[time_col])
                    
                    # 오래된 데이터는 전송하지 않도록 time 컬럼 Check
                    if time_diff >= datetime.timedelta(seconds=g_old_data_check_time):
                        old_data_flag = True
                
                # Old 데이터인 경우에는 FLAG를 3으로 설정하고 전송 Skip 
                if old_data_flag == True:
                    update_flag = 3
                    logger.debug(f"{target_table}:{row['tag']} [{row[time_col]}]: Old Data!")
                    
                # 펌프제어 태그가 아닌 경우에는 ai_mode_check가 False임, DB 레코드를 Kafka 전송 수행
                elif ai_mode_check == False:
                    update_flag = send_kafka_db_data(producer, row, time_col, cvt_need_cols) # normal case: update_flag = 1
                
                # 펌프제어 태그의 경우 AI Mode를 확인하여 Kafka 전송, 현재는 수행되지 않는 코드임(펌프제어 태그 전송 프로그램 별도로 구현)
                else:
                    mode_res, ai_mode_res = check_kafka_send(db_cursor, row[idx_col], row[time_col]) # TB_HMI_CTR_TAG
                    if mode_res == 1: # kafka tx condition: ok
                        row.drop(idx_col, inplace=True)
                        update_flag = send_kafka_db_data(producer, row, time_col, cvt_need_cols) # normal case: update_flag = 1

                        # insert control tag log
                        ctr_insert_sql = f"insert ignore into TB_HMI_CTR_LOG (`tag`,`time`,`value`,`FLAG`) values {row['tag'], row['time'], row['value'], ai_mode_res}"
                        # ctr_insert_sql = f"insert into TB_HMI_CTR_LOG (`tag`,`time`,`value`,`FLAG`) values {row['tag'], row['time'], row['value'], '2'}"
                        db_cursor.execute(ctr_insert_sql)
                        db_conn.commit()

                    elif mode_res == 2: # kafka tx condition: pending
                        # 펌프제어 팝업이 발생했으나 아직 운영자가 확인하지 않은 상태
                        update_flag = 0
                        logger.debug(f"{target_table}:{row['tag']} [{row[time_col]}]: check_kafka_send is pending")

                    else:
                        update_flag = 3 # Kafka 전송 조건 맞지 않음, AI Mode가 아니거나 펌프제어 팝업이 취소된 상태
                        logger.debug(f"{target_table}:{row['tag']}: check_kafka_send is False")
            
            try:
                # 전송 Pending 상태가 아니면 FLAG 컬럼 업데이트
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
        
        producer.close()    
        logger.debug(f"@@@> END:: produce_kafka_db_data[{topic}]: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


def load_settings():
    # 프로그램 설정 파일 Load
    try:
        json_file_path = 'settings_db_producer.json'
        with open(json_file_path, 'r', encoding='utf-8') as file:
            config = json.load(file)
            return config
    except FileNotFoundError:
        print(f"Cannot find {json_file_path} file.")
        logging.error(f"Cannot find {json_file_path} file.")
        return None


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
                    
    logger.debug(f"ip_list : {ip_list}")
    return ip_list


def isActiveSystem():
    # "vip" Key에 해당하는 값이 서버에서 “hostname -I” 명령을 실행하여 도출되는 IP Ad-dress 리스트에 포함되어 있으면 Master임
    ip_list = get_ip_addresses()
    return g_vip in ip_list


def db_kafka_producer():
    try:
        # # Master로 동작하는 AI 플랫폼 #1 또는 #2 하나의 서버에서만 프로그램이 실행되어야 함
        # isActive = isActiveSystem()
        # if isActive == False:
        #     logger.error(f"Currently this server is not master...")
        #     return
        
        conn = connect_to_db()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        for i, tb_info in enumerate(g_tb_infos):
            try: 
                # Kafka 전송이 필요한 DB 테이블의 정보
                kafka_topic = tb_info['kafka_topic']
                target_table = tb_info['db_table']
                target_cols = tb_info['target_cols']
                pk_cols = tb_info['pk_cols']
                cvt_need_cols = tb_info['cvt_need_cols']
                time_col = tb_info['time_col']
                excluded_tags = tb_info['excluded_tags']
                idx_col = tb_info['idx_col']
                ai_mode_check = tb_info['ai_mode_check']
                
                # FLAG가 0인 레코드만 전송하기 위해 Select
                sql = f"SELECT * FROM {target_table} WHERE flag = 0;"        
                cursor.execute(sql)
                result = cursor.fetchall()
                logger.info(f"[{target_table}] result length = {len(result)}")

                if len(result) > 0:
                    col_name = [i[0] for i in cursor.description]
                    tb_df = pd.DataFrame(result, columns=col_name)[target_cols]
                    # logger.debug(tb_df)
                    # Kafka 전송에 필요한 정보와 데이터를 전달하여 실제 Kafka Producing 수행
                    produce_kafka_db_data(tb_df, conn, cursor, target_table, pk_cols, time_col, 
                                        cvt_need_cols, excluded_tags, idx_col, kafka_topic, ai_mode_check)
                
            except:
                traceback_message = traceback.format_exc()
                logger.error(traceback_message)

        cursor.close()

    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    conn.close()


if __name__ == "__main__":
    LOG_DIR = 'logs'
    LOG_FILE = 'db_kafka_producer.log'
    LOG_FILE2 = 'alaram_kafka_producer.log'

    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    # HMI 데이터 전송 Log와 이벤트 데이터 전송 Log를 분리하여 일별로 생성
    logger = logging.getLogger('DB_KAFKA_PRDCR')
    logger.setLevel(logging.ERROR)
    
    logger2 = logging.getLogger('ALARM_KAFKA_PRDCR')
    logger2.setLevel(logging.ERROR)
    
    file_handler = logging.handlers.TimedRotatingFileHandler(
        filename=f"{LOG_DIR}/{LOG_FILE}", 
        when='midnight', 
        interval=1,
        backupCount=10,  
        encoding='utf-8'
    )
    formatter = logging.Formatter('(%(asctime)s) %(levelname)s:%(message)s')
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
    g_settings = load_settings()
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
    
    g_tb_infos = g_settings.get('tb_infos', None)
    g_alarm_infos = g_settings.get('alarm_infos', None)
    g_ai_mode_tag = g_settings.get('ai_mode_tag', None)
    g_kafka_brokers = g_settings.get('kafka_brokers', None)
    g_ptr_ctr_inf_table = g_settings.get('ptr_ctr_inf', None)
    g_ctrl_no_pass_mode = g_settings.get('ctrl_no_pass_mode', None)
    g_old_data_check_time = g_settings.get('old_data_check_time', 900)
    
    # HMI 데이터 전송 기능을 실행하는 주기 설정(초단위로 아래 scheduler.add_job에서 설정)
    g_period = g_settings.get('period', 60)
    # 이벤트 데이터 전송 기능을 실행하는 주기 설정(초단위로 아래 scheduler.add_job에서 설정)
    g_alarm_period = g_settings.get('alarm_period', 10)
    logger.info(f"@@@> Running period: {g_period}s, {g_alarm_period}s")
    
    scheduler = BlockingScheduler(job_defaults={'max_instances': 1})
    
    # HMI 데이터 전송 기능을 주기적으로 수행하기 위한 스케줄링
    scheduler.add_job(db_kafka_producer, 'interval', seconds=g_period, start_date='2024-04-01 00:00:40')
    
    # # 이벤트 데이터 전송 기능을 주기적으로 수행하기 위한 스케줄링
    # scheduler.add_job(alarm_kafka_producer, 'interval', seconds=g_alarm_period, 
    #                   start_date='2024-04-01 00:00:30', args=[g_settings, logger2])
    
    logger.critical(f"@@@> DB_KAFKA_PRODUCER Start!!!") # not critical, just to print always
    scheduler.start()
    
    

