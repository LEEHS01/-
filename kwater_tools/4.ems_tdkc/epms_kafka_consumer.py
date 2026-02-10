import os
import json
import logging
import logging.handlers
import time

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.events import EVENT_JOB_ERROR

from kafka_ems_scada_consumer import consume_kafka_ems_scada
from kafka_pms_scada_consumer import consume_kafka_pms_scada
from kafka_pms_vib_consumer import consume_kafka_pms_vib
from kafka_alarm_consumer import consume_kafka_alarm

def load_settings(file_name):
    # 프로그램 설정 파일 Load
    try:
        json_file_path = file_name
        with open(json_file_path, 'r', encoding='utf-8') as file:
            config = json.load(file)
            return config
    except FileNotFoundError:
        print(f"Cannot find {json_file_path} file.")
        return None


def job_error_listener(event):
    # BlockingScheduler 수행 중 Exception 발생시 Log 기록 후 프로그램 종료
    if event.exception:
        print(f"Job {event.job_id} failed")
        logger.error(f"Job {event.job_id} failed. This program will exit after a minute")
        logger2.error(f"Job {event.job_id} failed. This program will exit after a minute")
        logger3.error(f"Job {event.job_id} failed. This program will exit after a minute")
        logger4.error(f"Job {event.job_id} failed. This program will exit after a minute")

        time.sleep(60)
        os._exit(1)


if __name__ == "__main__":
    LOG_DIR = 'logs'
    LOG_FILE = 'ems_scada_consumer.log'
    LOG_FILE2 = 'pms_scada_consumer.log'
    LOG_FILE3 = 'pms_vib_consumer.log'
    LOG_FILE4 = 'alarm_consumer.log'

    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)
        
    # SCADA에서 전달되는 EMS 관련 Tag 데이터를 TB_DATA_RAW_TAG 테이블에 적재하는 Kafka Consumer Log
    logger = logging.getLogger('EMS_SCADA_CNSM')
    logger.setLevel(logging.ERROR)

    # SCADA에서 전달되는 PMS 관련 Tag 데이터를 TB_PUMP_SCADA 테이블에 적재하는 Kafka Consumer Log
    logger2 = logging.getLogger('PMS_SCADA_CNSM')
    logger2.setLevel(logging.ERROR)

    # IPC에서 전달된 PMS 진동데이터를 TB_PM 테이블에 적재하는 Kafka Consumer Log
    logger3 = logging.getLogger('PMS_VIB_CNSM')
    logger3.setLevel(logging.ERROR)

    # 자율운영에서 전달하는 이벤트를 TB_EMS_ALARM 테이블에 적재하는 Kafka Consumer Log
    logger4 = logging.getLogger('ALARM_CNSM')
    logger4.setLevel(logging.ERROR)

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
    
    file_handler3 = logging.handlers.TimedRotatingFileHandler(
        filename=f"{LOG_DIR}/{LOG_FILE3}", 
        when='midnight', 
        interval=1,
        backupCount=10,  
        encoding='utf-8'
    )
    file_handler3.setFormatter(formatter)
    logger3.addHandler(file_handler3)
    
    file_handler4 = logging.handlers.TimedRotatingFileHandler(
        filename=f"{LOG_DIR}/{LOG_FILE4}", 
        when='midnight', 
        interval=1,
        backupCount=10,  
        encoding='utf-8'
    )
    file_handler4.setFormatter(formatter)
    logger4.addHandler(file_handler4)
    
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    logger2.addHandler(console_handler)
    logger3.addHandler(console_handler)
    logger4.addHandler(console_handler)
    
    # 설정 파일 Load
    g_settings = load_settings('settings.json')
    if not g_settings:
        logger.error("Exit!![setting file error]")
        logger2.error("Exit!![setting file error]")
        logger3.error("Exit!![setting file error]")
        logger4.error("Exit!![setting file error]")
        exit()    
        
    # 파일과 콘솔 로그의 레벨을 별도로 지정
    log_level_file = g_settings.get('log_level_file', 'ERROR').upper()
    log_level_console = g_settings.get('log_level_console', 'ERROR').upper()
    file_handler.setLevel(log_level_file)
    file_handler2.setLevel(log_level_file)
    file_handler3.setLevel(log_level_file)
    console_handler.setLevel(log_level_console)
    
    lowest_level = min(file_handler.level, console_handler.level)
    logger.setLevel(lowest_level)
    logger2.setLevel(lowest_level)
    logger3.setLevel(lowest_level)
    logger4.setLevel(lowest_level)

    scheduler = BlockingScheduler(job_defaults={'max_instances': 1})

    # SCADA에서 전달되는 EMS 관련 Tag 데이터를 TB_DATA_RAW_TAG 테이블에 적재하는 Kafka Consumer 수행
    ems_scada_config = g_settings.get('ems_scada_info', None)
    # EMS SCADA Consumer에 대해 AI 플랫폼 #1은 Topic1만 AI 플랫폼 #2는 Topic2만 수집하도록 아래 2라인 중 하나는 Comment Out되어야 함
    scheduler.add_job(consume_kafka_ems_scada, args=[ems_scada_config, ems_scada_config['kafka_topic1'], logger])
    scheduler.add_job(consume_kafka_ems_scada, args=[ems_scada_config, ems_scada_config['kafka_topic2'], logger])
    
    # SCADA에서 전달되는 PMS 관련 Tag 데이터를 TB_PUMP_SCADA 테이블에 적재하는 Kafka Consumer 수행
    pms_scada_config = g_settings.get('pms_scada_info', None)
    # PMS SCADA Consumer에 대해 AI 플랫폼 #1은 Topic1만 AI 플랫폼 #2는 Topic2만 수집하도록 아래 2라인 중 하나는 Comment Out되어야 함
    scheduler.add_job(consume_kafka_pms_scada, args=[pms_scada_config, pms_scada_config['kafka_topic1'], logger2])
    scheduler.add_job(consume_kafka_pms_scada, args=[pms_scada_config, pms_scada_config['kafka_topic2'], logger2])

    # IPC에서 전달된 PMS 진동데이터를 TB_PM 테이블에 적재하는 Kafka Consumer 수행
    pms_vib_config = g_settings.get('pms_vib_info', None)
    scheduler.add_job(consume_kafka_pms_vib, args=[pms_vib_config, pms_vib_config['kafka_topic1'], logger3])

    # # 자율운영에서 전달하는 이벤트를 TB_EMS_ALARM 테이블에 적재하는 Kafka Consumer 수행 
    # alarm_config = g_settings.get('alarm_info', None)
    # scheduler.add_job(consume_kafka_alarm, args=[alarm_config, alarm_config['kafka_topic1'], logger4])

    # BlockingScheduler 수행 중 Exception 발생시 Log 기록 후 프로그램 종료하도록하여 Docker가 Restart되도록 하기 위한 Listener 등록
    scheduler.add_listener(job_error_listener, EVENT_JOB_ERROR)

    try:
        scheduler.start()

    except:
        exit(1)


