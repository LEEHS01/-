import base64
import gzip
import os
import shutil
import traceback
import numpy as np
import json
import time
import datetime
import logging
import logging.handlers
from modules.messageProducer import MessageProducer
from apscheduler.schedulers.blocking import BlockingScheduler


def load_settings():
    try:
        json_file_path = 'setting.json'
        with open(json_file_path, 'r', encoding='utf-8') as file:
            config = json.load(file)
            return config
    except FileNotFoundError:
        print("설정 파일을 찾을 수 없습니다.")
        logging.error("설정 파일을 찾을 수 없습니다.")
        return None


# 처리한 파일을 추적하기 위한 파일 목록 기록
def save_processed_files(file):
    today = datetime.datetime.now().strftime("%Y-%m-%d")  # 현재 날짜를 가져옴
    log_folder = 'processed_files'
    
    if not os.path.exists(log_folder):
        os.makedirs(log_folder.upper())
    
    log_filename = f'{log_folder}/processed_files_{today}.txt'  # 현재 날짜를 포함한 로그 파일명 생성
    
    with open(log_filename, 'a') as file_list:
        file_list.write(file + '\n')

    file_name = os.path.basename(file)        
    shutil.move(file, backup_dir+'\\'+file_name)
    logger.info(f"MOVE FILE: {file} -> {backup_dir}\\{file_name}")


# 처리한 파일을 확인하여 이미 처리한 파일인지 여부 반환
def is_processed(file_path):
    today = datetime.datetime.now().strftime("%Y-%m-%d")  # 현재 날짜를 가져옴
    log_folder = 'processed_files'  # 로그가 저장된 폴더명
    
    log_filename = f'{log_folder}/processed_files_{today}.txt'  # 오늘 날짜의 로그 파일명
    
    try:
        if os.path.exists(log_filename):
            with open(log_filename, 'r', encoding='utf-8') as file_list:
                processed_files = file_list.read().splitlines()
                return file_path in processed_files
        else:
            return False
    except FileNotFoundError as err:
        logging.error(f"에러 상세 정보: {err}")
        return False


def is_file_complete(file_path):
    max_attempts = 5  # 최대 시도 횟수
    attempt = 0
    previous_size = 0
    
    while attempt < max_attempts:
        current_size = os.path.getsize(file_path)
        if current_size == previous_size:  # 크기 변화가 없으면 완료된 것으로 간주
            return True
        
        previous_size = current_size
        time.sleep(1)  # 1초마다 확인
        attempt += 1
        
    return False  # 최대 시도 횟수 동안 크기 변화가 있으면 완료되지 않은 것으로 처리


def list_files_in_directory(directory, settings):
    print("@@@> list_files_in_directory")
    logger.critical("@@@> Start: list_files_in_directory !!!") # not critical, just to print always
    
    try:
        # Get list of files in the directory
        files = os.listdir(directory)
        for file in files:
            file_path = os.path.join(directory, file)
            file_name = file
            date_str = file_name[:19]  # 파일 이름에서 날짜 부분 추출 (19자리까지)
            date_format = "%Y_%m_%d_%H_%M_%S"  # 파일 이름의 날짜 형식에 맞는 포맷 지정
            try:
                acq_ti = datetime.datetime.strptime(date_str, date_format).strftime('%Y-%m-%d %H:%M:%S')
            except ValueError:
                logger.error("올바른 날짜 형식이 아닙니다.")
                continue
            
            if is_file_complete(file_path):
                process_sensor_data(file_path, acq_ti, settings)
            else:
                logger.info(f"파일 '{file}'이(가) 아직 완료되지 않았습니다.")
    except FileNotFoundError:
        logger.error("Directory '{}' not found.".format(directory))

    logger.critical("@@@> End: list_files_in_directory !!!") # not critical, just to print always


def produce_kafka(data, topic, broker):
    logger.critical("@@@> [produce_kafka] TOPIC: '%s', BROKER: '%s' " % (topic, broker)) # not critical, just to print always
    logger.debug("@@@> START:: produce_kafka['%s']: '%s'" % (topic, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')))

    producer = MessageProducer(broker, topic)
    for msg in data:
        try:
            res = producer.send_message(msg, False)
            # print(msg, res)
            logger.debug(f'[{msg[0]}] [{len(msg[4])}] {res}')
        except Exception as e: 
            print("Exception: ", e)
            traceback_message = traceback.format_exc()
            logger.error(traceback_message)
            
    producer.close()
    
    logger.debug("@@@> END:: produce_kafka['%s']: '%s'" % ((topic, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))))


# 센서 데이터 처리    
def process_sensor_data(file_path, acq_ti, settings):
    if settings:
        num_sensors = settings.get('num_sensors', 21)
        last_sec = settings.get('last_sec', 10)
        ipc_loc = settings.get('ipc_loc', '현도1취수장')
        
    if is_processed(file_path):
        logger.info(f"File '{file_path}' 이미 처리되었습니다. 건너뜁니다.")
        print(f"File '{file_path}' 이미 처리되었습니다. 건너뜁니다.")
        return

    logger.debug("@@@> START:: process_sensor_data: '%s'" % (datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        
    # 초기값 설정
    eq_id = 0; pm_id = 0; ch_id = 0; # acq_ti = 0
    with open(file_path, 'rb') as binary_file:
        data = binary_file.read()
    
    # 각 센서 데이터의 길이 계산
    sensor_data_length = len(data) // (num_sensors * last_sec)  # 각 센서의 데이터 길이 계산

    # INSERT 쿼리 실행을 위한 데이터 리스트 생성
    data_list_generated = []
    
    ch_names_mapping = {0: "Ch_P", 1: "Ch_P", 2: "Ch_M", 3: "Ch_M"}
    
    for i in range(num_sensors * last_sec):
        start_index = i * sensor_data_length
        end_index = start_index + sensor_data_length
        sensor_values = np.frombuffer(data[start_index:end_index], dtype=np.float64)  # 데이터를 float64로 변환
        
        # 리스트를 문자열로 변환
        sensor_values_str = ', '.join(map(str, sensor_values))
        
        try:
            sensor_values_bytes = sensor_values_str.encode('utf-8')  # Convert to bytes
            compressed_sensor_values = gzip.compress(sensor_values_bytes)
            encoded_data = base64.standard_b64encode(compressed_sensor_values).decode('utf-8')
            
            # #( for test
            # # decoded_data = base64.b64decode(encoded_data)
            # decompressed_sensor_values = gzip.decompress(compressed_sensor_values)
            # # decompressed_sensor_values = gzip.decompress(decoded_data)
            # decompressed_sensor_values_str = decompressed_sensor_values.decode('utf-8')
            
            # if sensor_values_str == decompressed_sensor_values_str:
            #     logger.info(f"Compression succeeded![before:{len(sensor_values_str)}, after:{len(compressed_sensor_values)}, encoded:{len(encoded_data)}]")
            # else:
            #     logger.info("Compression failed!")
            # #) for test    
            
        except:
            traceback_message = traceback.format_exc()
            print(traceback_message)     
        
        # EQ_ID: 장비아디,  PM_ID: 펌프모터아이디,  CH_ID: 채널아이디  ACQ_TI: 계측시간
        eq_id += 1
        #if i % 21 == 0:
        if i % num_sensors == 0:
            pm_id = (i // num_sensors) + 1  # 21의 배수일 때 pm_id 초기화
            ch_id = 0  # ch_id도 초기화
        
        pm_id_renew = str((i % num_sensors) // 4 + 1) + 'PM'
        
        # ch_id가 4개마다 증가하도록 유지
        ch_id_remainder = ch_id % 4
        ch_name = ch_names_mapping[ch_id_remainder]
        ch_id += 1
        ch_name_renew = str(ch_id) + ch_name
        
        # 각 행의 데이터를 튜플로 만들어 리스트에 추가
        # data_list_generated.append((eq_id, pm_id_renew, ch_name_renew, acq_ti, sensor_values_str, 1, ipc_loc))
        data_list_generated.append((eq_id, pm_id_renew, ch_name_renew, acq_ti, encoded_data, 1, ipc_loc))
        
    
    try:
        print("@@@> data_list_generated length =", len(data_list_generated))
        if len(data_list_generated) > 0:
            produce_kafka(data_list_generated, settings.get('kafka_topic'), settings.get('kafka_brokers'))
			
        save_processed_files(file_path)  # 파일 처리 완료 후 처리한 파일 기록        
        print(f"File '{file_path}' 처리 완료")

    except:
        traceback_message = traceback.format_exc()
        print(traceback_message)     
        
    logger.info("@@@> END:: process_sensor_data[%s] '%s'" % (file_path, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')))


if __name__ == "__main__":
    LOG_DIR = 'logs'
    LOG_FILE = 'kafka_pms_prdc.log'

    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    logger = logging.getLogger('KAFKA_EMS_PRDC')
    log_file_handler = logging.handlers.RotatingFileHandler(f'{LOG_DIR}/{LOG_FILE}', 
                                                        encoding='utf-8',
                                                        maxBytes = 1024 * 1024 * 5, 
                                                        backupCount = 10)
    formatter = logging.Formatter('(%(asctime)s) %(levelname)s:%(message)s')
    log_file_handler.setFormatter(formatter)
    logger.addHandler(log_file_handler)
    logger.setLevel(logging.ERROR)
    
    settings = load_settings()
    if not settings:
        logger.error("설정 파일을 읽지 못했습니다.")
        exit()    
        
    logger.setLevel(settings.get('log_level', 'ERROR'))
    
    folder_path = settings.get('nidir', 'C:\\NI Sensing')  
    backup_dir = settings.get('nidir_backup', 'C:\\NI Sensing\\backup')
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    list_files_in_directory(folder_path, settings)

    # Windows 작업 스케쥴러에서 스케쥴링. Windows가 Sleep 상태에 있으면 apscheduler가 정상동작하지 않는 것으로 판단됨.
    # scheduler = BlockingScheduler(job_defaults={'max_instances': 1})
    # scheduler.add_job(list_files_in_directory, 'interval', 
    #                   args=[folder_path, settings], seconds=600, start_date='2023-12-25 00:00:00', misfire_grace_time=120)
    #                 #   args=[folder_path, settings], seconds=120, start_date='2023-12-25 00:00:00')
    # scheduler.add_job(list_files_in_directory, args=[folder_path, settings])
    # scheduler.start()

