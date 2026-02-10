import datetime
import json
import socket
import mysql.connector
import pandas as pd
import traceback
import logging
import logging.handlers

import psutil
from modules.messageProducer import MessageProducer


def connect_to_db(settings, logger):
    # Configuration 파일에 설정된 DB에 연결, 3회까지 연결 시도
    max_retries = 3
    retries = 0
    conn = None
    
    while retries < max_retries:
        try:
            db_host = settings.get('db_host')  
            db_port = settings.get('db_port')  
            db_user = settings.get('db_user') 
            db_password = settings.get('db_password') 
            db_database = settings.get('database')
            
            conn = mysql.connector.connect(
                host = db_host,
                port = db_port,
                user = db_user,
                password = db_password,
                database = db_database
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


def msg2message(row):
    # 알람 이벤트 DB 데이터를 Key:Value Message 형태로 구성
    message = {
        'alarm_id': int(row['ALARM_ID']),
        'message': row['MSG'],
        'url': row['LINK'],
        'time': row['TIME'],
    }
    return message


def send_kafka_alarm_data(producer, row, logger):
    try:
        # Kafka 전송을 위해 JSON 타입으로 변환
        row_res = row.to_json(date_format='iso')
        row_json = json.loads(row_res)
        jsonObject = msg2message(row_json)
        
        # Kafka 전송 수행
        res = producer.send_message(jsonObject, False)
        logger.debug(json.dumps(jsonObject) + json.dumps(res))
        return 1 # update_flag = 1

    except Exception as e: 
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return 0 # update_flag = 0


def produce_kafka_alarm_data(tb_df, db_conn, db_cursor, settings, alarm_info, logger):
    target_table = alarm_info['db_table'] # Kafka 전송할 알람 이벤트 데이터 테이블, TB_EMS_ALARM
    pk_cols = alarm_info['pk_cols']
    time_col = alarm_info['time_col']
    old_alarm_check_time = alarm_info['old_alarm_check_time']

    topic = alarm_info['kafka_topic']
    broker = settings.get('kafka_brokers')

    logger.info(f"@@@> [produce_kafka_alarm_data] TOPIC:{topic}, BROKER:{broker}, DATA Length ={len(tb_df)}") # not critical, just to print always

    if len(tb_df) > 0:
        try:
            producer = MessageProducer(broker, topic)
        except:
            traceback_message = traceback.format_exc()
            logger.error(traceback_message)
            return

        logger.debug(f"@@@> START:: produce_kafka_alarm_data[{topic}]: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        # Kafka 전송할 DB 레코드 Loop
        for i, row in tb_df.iterrows():
            update_flag = 9 # 0: before popup, 5:not sent yet(after popup), 1:sent, 3:old alarm, 9:before processed
            old_data_flag = False
            if time_col != "" and time_col != None:
                current_time = datetime.datetime.now()
                date_obj = datetime.datetime.strptime(row[time_col], "%Y-%m-%d %H:%M:%S")
                time_diff = abs(current_time - date_obj)
                
                # 오래된 데이터는 전송하지 않도록 time 컬럼 Check
                if time_diff >= datetime.timedelta(seconds=old_alarm_check_time):
                    old_data_flag = True
            
            # Old 데이터인 경우에는 FLAG를 3으로 설정하고 전송 Skip
            if old_data_flag == True:
                update_flag = 3
                logger.debug(f"{target_table}:{row['MSG']} [{row[time_col]}]: Old Alarm!")
            
            # DB 레코드를 Kafka 전송 수행    
            else:
                update_flag = send_kafka_alarm_data(producer, row, logger) # normal case: update_flag = 1
            
            try:
                # FLAG 컬럼 업데이트
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
        logger.debug(f"@@@> END:: produce_kafka_alarm_data[{topic}]: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


def get_ip_addresses(logger):
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


def isActiveSystem(vip, logger):
    # "vip" Key에 해당하는 값이 서버에서 “hostname -I” 명령을 실행하여 도출되는 IP Ad-dress 리스트에 포함되어 있으면 Master임
    ip_list = get_ip_addresses(logger)
    return vip in ip_list


def alarm_kafka_producer(settings, logger):
    try:
        # Master로 동작하는 AI 플랫폼 #1 또는 #2 하나의 서버에서만 프로그램이 실행되어야 함
        isActive = isActiveSystem(settings.get('vip'), logger)
        if isActive == False:
            logger.error(f"Currently this server is not master...")
            return
        
        conn = connect_to_db(settings, logger)
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Kafka 전송이 필요한 DB 테이블의 정보
        alarm_infos = settings.get('alarm_infos')
        for i, alarm_info in enumerate(alarm_infos):
            try: 
                target_table = alarm_info['db_table']
                target_cols = alarm_info['target_cols']
                
                # FLAG가 5인 레코드만 전송하기 위해 Select
                sql = f"SELECT * FROM {target_table} WHERE flag = 5;"  
                cursor.execute(sql)
                result = cursor.fetchall()
                logger.info(f"[{target_table}] result length = {len(result)}")

                if len(result) > 0:
                    col_name = [i[0] for i in cursor.description]
                    tb_df = pd.DataFrame(result, columns=col_name)[target_cols]
                    # logger.debug(tb_df)
                    
                    # Kafka 전송에 필요한 정보와 알람 데이터를 전달하여 실제 Kafka Producing 수행
                    produce_kafka_alarm_data(tb_df, conn, cursor, settings, alarm_info, logger)
                
            except:
                traceback_message = traceback.format_exc()
                logger.error(traceback_message)

        cursor.close()

    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    conn.close()
