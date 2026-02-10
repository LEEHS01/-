import os
import json
import datetime
import traceback
import logging
import logging.handlers
from apscheduler.schedulers.blocking import BlockingScheduler


def load_settings():
    try:
        json_file_path = 'setting.json'
        with open(json_file_path, 'r', encoding='utf-8') as file:
            config = json.load(file)
            return config
    except FileNotFoundError:
        # print("설정 파일을 찾을 수 없습니다.")
        logger.error("설정 파일을 찾을 수 없습니다.")
        return None


def delete_data_files_in_folder(directory, delta_date):
    print("@@@> delete_data_files_in_folder")
    
    try:
        target_date = datetime.datetime.now() - delta_date
        logger.critical(f"@@@> Start: delete_data_files_in_folder !!![{directory}, {delta_date}]") # not critical, just to print always
        
        list = os.listdir(directory)        
        files = [x for x in list if os.path.isfile(os.path.join(directory, x))]
        for file in files:
            file_path = os.path.join(directory, file)
            file_date_str = file[:19]  
            
            # 파일명에서 시간데이터 추출하여 datetime 형식으로 변환
            file_date = datetime.datetime.strptime(file_date_str, '%Y_%m_%d_%H_%M_%S')
            
            if file_date < target_date:
                os.remove(file_path)
                logger.debug(f'Removed {file_path}')
            
    except FileNotFoundError:
        logger.error(f"Directory {directory} not found.")

    logger.critical("@@@> End: delete_data_files_in_folder !!!") # not critical, just to print always
    

def delete_processed_files_in_folder(directory, delta_date):
    print("@@@> delete_processed_files_in_folder")
    
    try:
        target_date = datetime.datetime.now() - delta_date
        logger.critical(f"@@@> Start: delete_processed_files_in_folder !!![{directory}, {delta_date}]") # not critical, just to print always
        
        list = os.listdir(directory)        
        files = [x for x in list if os.path.isfile(os.path.join(directory, x))]
        for file in files:
            file_path = os.path.join(directory, file)
            file_date_str = file[16:26]  
            
            # 파일명에서 시간데이터 추출하여 datetime 형식으로 변환
            file_date = datetime.datetime.strptime(file_date_str, '%Y-%m-%d')
            
            if file_date < target_date:
                os.remove(file_path)
                logger.debug(f'Removed {file_path}')
            
    except FileNotFoundError:
        logger.error(f"Directory {directory} not found.")

    logger.critical("@@@> End: delete_processed_files_in_folder !!!") # not critical, just to print always


def main():
    logger.critical("@@@> main !!!") # not critical, just to print always

    try:
        target_dir = settings.get('target_dir', '')
        backup_dir = settings.get('backup_dir', '')
        processed_dir = settings.get('processed_dir', '')
        
        # Kafka 전송 오류로 진동데이터가 Backup 폴더로 이동되지 못할 경우 1시간 이전 데이터는 삭제
        delete_data_files_in_folder(target_dir, datetime.timedelta(hours=1))
        
        # Backup 폴더로 이동된 7일 이전 진동 데이터 삭제
        delete_data_files_in_folder(backup_dir, datetime.timedelta(days=7))
        
        # PROCESSED_FILES 폴더의 30일 이전 데이터 삭제
        delete_processed_files_in_folder(processed_dir, datetime.timedelta(days=30))
        
    except:
        traceback_message = traceback.format_exc()
        # print(traceback_message)
        logger.error(traceback_message)


if __name__ == "__main__":
    LOG_DIR = 'logs'
    LOG_FILE = 'del_vib.log'

    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    # Log 파일 생성: 5MB 용량의 Log 파일을 10개까지 Backup
    logger = logging.getLogger('DEL_VIB')
    log_file_handler = logging.handlers.RotatingFileHandler(f'{LOG_DIR}/{LOG_FILE}', 
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
    
    main()
    
    # Windows 작업 스케쥴러에서 스케쥴링하도록 Comment out
    # scheduler = BlockingScheduler(timezone='Asia/Seoul', job_defaults={'max_instances': 1})
    # # scheduler.add_job(main, 'interval', days=1, start_date='2023-11-04 10:45:00', misfire_grace_time=600)
    # scheduler.add_job(main, 'cron', hour='1', minute='45', misfire_grace_time=600)
    # scheduler.add_job(main)
    # scheduler.start()

    # scheduler = BlockingScheduler(timezone='Asia/Seoul', job_defaults={'max_instances': 1})
    # # scheduler.add_job(main, 'interval', hours=1, start_date='2023-11-04 10:45:00', misfire_grace_time=600)
    # scheduler.add_job(main, 'cron', minute='19', misfire_grace_time=600)
    # scheduler.add_job(main)
    # scheduler.start()
