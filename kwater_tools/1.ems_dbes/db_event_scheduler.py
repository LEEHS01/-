import datetime
import json
import os
import socket
import traceback
import mysql.connector
import logging
import logging.handlers
import psutil
from apscheduler.schedulers.blocking import BlockingScheduler
from peak_event_scheduler import peak_event_scheduler


def connect_to_db():
    # Configuration 파일에 설정된 DB에 연결, 3회까지 연결 시도
    max_retries = 3
    retries = 0
    conn = None
    
    while retries < max_retries:
        try:
            db_host = g_settings.get('db_host')  
            db_port = g_settings.get('db_port')  
            db_user = g_settings.get('db_user') 
            db_password = g_settings.get('db_password') 
            db_database = g_settings.get('database')
            
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
            logging.error(f"DB connection error!!: {err}")
            
            retries += 1
            print(f"Retry {retries}/{max_retries}...")
            
    if conn is None:
        print("DB connection failed!!")
        logging.error("DB connection failed!!")
        raise Exception("DB connection failed!!")
        
    return conn


def exceute_sql(sql):
    # 전달된 SQL을 수행
    try:
        conn = connect_to_db()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return

    try:
        with conn.cursor() as cursor:
            cursor.execute(sql)
            conn.commit()        
        
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    try:
        conn.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)


def load_settings(file_name):
    # 프로그램 설정 파일 Load
    try:
        json_file_path = file_name
        with open(json_file_path, 'r', encoding='utf-8') as file:
            config = json.load(file)
            return config
    except FileNotFoundError:
        print(f"Cannot find {json_file_path} file.")
        logging.error(f"Cannot find {json_file_path} file.")
        return None


def load_db_event_config():
    # Event Schesuler 프로그램이 실행될 때마다 수행되어야 하는 SQL 파일들을 Buffer로 Load
    try: 
        evt_infos = g_settings.get('evt_infos')
        data_folder = g_settings.get('data_folder')
        db_event_data = []
        for i, evt_info in enumerate(evt_infos):
            data_file = evt_info['sql']
            logger.info(f"SQL FILE: {data_file}")
            file_path = os.path.join(data_folder, data_file)
            with open(file_path, 'r') as file:
                sql_buffer = file.read()
            
            db_event_data.append((data_file, sql_buffer)) 
            logger.info(f"[[[{data_file}]]] : {sql_buffer}")

        # SQL 파일명과 SQL 데이터를 Return
        return db_event_data    
            
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
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
    g_vip = g_settings.get('vip')
    
    return g_vip in ip_list


def db_event_scheduler():
    try: 
        # Master로 동작하는 AI 플랫폼 #1 또는 #2 하나의 서버에서만 프로그램이 실행되어야 함 
        isActive = isActiveSystem()
        if isActive == False:
            logger.error(f"Currently this server is not master...")
            return
        
        for i, db_event in enumerate(g_db_events):
            # SQL 파일명과 SQL 데이터
            sql_file_name, sql_buffer = db_event
            exceute_sql(sql_buffer)
            logger.info(f"{sql_file_name} is excuted.")
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)


if (__name__ == "__main__"):
    LOG_DIR = 'logs'
    LOG_FILE = 'db_event_scheduler.log'
    LOG_FILE2 = 'peak_event_scheduler.log'

    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)
    
    # DB Event Scheduler Log와 전력 피크 Event 발생 Log를 분리하여 일별로 생성
    logger = logging.getLogger('DB_EVENT_SCHEDULER')
    logger.setLevel(logging.ERROR)
    logger2 = logging.getLogger('PEAK_EVENT_SCHEDULER')
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
    g_settings = load_settings('settings_db_event.json')
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

    # DB Event Schesuler 기능을 실행하는 주기 설정(분단위로 아래 scheduler.add_job에서 설정)
    exec_period_peak = g_settings.get('period_peak', 60)

    # 전력 피크 이벤트 생성 기능을 실행하는 주기 설정(초단위로 아래 scheduler.add_job에서 설정)
    exec_period = g_settings.get('period', 60)
    
    # 프로그램을 최초로 실행하는 시간의 분 설정
    start_minute = g_settings.get('start_minute', '05')

    current_date = datetime.datetime.now().strftime('%Y-%m-%d')
    start_date_str = f"{current_date} 00:{start_minute}:00"
    logger.info(f"@@@> Running period: {exec_period}m, Starting minute: {start_minute}, start_date_str: {start_date_str}")
    
    # 실행할 DB Event SQL 정보 Load
    g_db_events = load_db_event_config()
    
    scheduler = BlockingScheduler(job_defaults={'max_instances': 1})
    
    # DB Event Schesuler 기능을 주기적으로 수행하기 위한 스케줄링
    scheduler.add_job(db_event_scheduler, 'interval', 
                      minutes=exec_period, start_date=start_date_str, misfire_grace_time=60)
    
    # 전력 피크 이벤트 생성 기능을 주기적으로 수행하기 위한 스케줄링
    scheduler.add_job(peak_event_scheduler, 'interval', 
                      seconds=exec_period_peak, start_date=start_date_str, 
                      misfire_grace_time=30, args=[g_settings, logger2])

    logger.critical(f"@@@> DB_EVENT_SCHEDULER Start!!!") # not critical, just to print always
    scheduler.start()
