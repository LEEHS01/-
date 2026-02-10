import socket
import mysql.connector
import traceback
import logging
import logging.handlers
import psutil


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


def insert_peak_event(db_conn, db_cursor, sql, logger):
    # 전력피크 발생 이벤트를 Insert하는 SQL을 실행
    try:
        db_cursor.execute(sql)
        db_conn.commit()
        logger.info(f"insert_peak_event: {sql}")
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)


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


def peak_event_scheduler(settings, logger):
    try:
        # Master로 동작하는 AI 플랫폼 #1 또는 #2 하나의 서버에서만 프로그램이 실행되어야 함
        isActive = isActiveSystem(settings.get('vip'), logger)
        if isActive == False:
            logger.error(f"Currently this server is not master...")
            return

        logger.debug(f"START peak_event_scheduler")
        conn = connect_to_db(settings, logger)        
        
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        raise Exception("DB connection failed!!")
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        peak_info = settings.get('peak_info', None)
        get_query = peak_info['get_query']
        event_query = peak_info['event_query']
        
        # 전력피크 목표 설정치를 가져오는 SQL 수행
        cursor.execute(get_query['target_sql'])
        result = cursor.fetchone()

        if result is not None:
            # 전력피크 목표 설정치
            target_peak = result['value']

            # 현재 전력량을 가져오는 SQL 수행
            cursor.execute(get_query['now_sql'])
            result = cursor.fetchone()
            now_peak = None
            if result is not None:
                now_peak = float(result['value']) / 1000

            # 10분 후 예상 전력 값을 가져오는 SQL 수행
            cursor.execute(get_query['m10_sql'])
            result = cursor.fetchone()
            if result is not None:
                m10_peak = result['prdct_pwr']
                cnt1 = result['cnt1']

            # 1시간 후 예상 전력 값을 가져오는 SQL
            cursor.execute(get_query['h1_sql'])
            result = cursor.fetchone()
            if result is not None:
                h1_peak = result['prdct_pwr']
                cnt2 = result['cnt2']

            # 2시간 후 예상 전력 값을 가져오는 SQL
            cursor.execute(get_query['h2_sql'])
            result = cursor.fetchone()
            if result is not None:
                h2_peak = result['prdct_pwr']
                cnt3 = result['cnt3']
                
            # 현재전력량 및 예상 전력 값들을 목표 설정치와 비교하여 전력피크 이벤트 생성
            if now_peak is not None and now_peak > target_peak:
                insert_peak_event(conn, cursor, event_query['now_sql'], logger)
            elif m10_peak is not None and m10_peak > target_peak and cnt1 != 0 :
                insert_peak_event(conn, cursor, event_query['m10_sql'], logger)
            elif h1_peak is not None and h1_peak > target_peak and cnt2 != 0 :
                insert_peak_event(conn, cursor, event_query['h1_sql'], logger)
            elif h2_peak is not None and h2_peak > target_peak and cnt3 != 0 :
                insert_peak_event(conn, cursor, event_query['h2_sql'], logger)
            else:
                logger.debug(f"target_peak:[{target_peak}], now_peak:[{now_peak}], m10_peak:[{m10_peak}], h1_peak:[{h1_peak}], h2_peak:[{h2_peak}]")

            logger.debug(f"target_peak:[{target_peak}], now_peak:[{now_peak}], m10_peak:[{m10_peak}], h1_peak:[{h1_peak}], h2_peak:[{h2_peak}]")
            
        else:
            logger.error("target_peak is None!!")         

        cursor.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    try:
        conn.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    logger.debug(f"END peak_event_scheduler")    
    return
