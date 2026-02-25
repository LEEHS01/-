import os
import sys
import traceback
import logging
from logging import handlers
import time
from multiprocessing import Process, Manager
from datetime import datetime, timedelta

# vip 체크
import check_vip as vip

# 사용자 정의 클래스 
PROC_PATH = os.path.dirname(os.path.abspath(__file__)) # (.py) 
BASE_PATH = os.path.dirname(PROC_PATH)
ROOT_PATH = os.path.dirname(BASE_PATH)
MODEL_PATH = '/'.join([PROC_PATH, 'model/']) # 모델 경로

sys.path.append(PROC_PATH + '/common')
sys.path.append(BASE_PATH + '/common')
sys.path.append(ROOT_PATH + '/common')

PROC_NAME = os.path.basename(PROC_PATH)
LOGS_PATH = BASE_PATH + '/logs/'
PROC_PATH = '/home/au/br/e'

from ai_e import JobRealtimeAiDataProc
job_proc = JobRealtimeAiDataProc()

# 전송 로거 생성
from aos_util import *
import check_vip as vip
build_logger(ROOT_PATH, BASE_PATH, PROC_NAME)

# log settings
runLogFormatter = logging.Formatter('%(asctime)s : %(message)s')
logfile = LOGS_PATH + PROC_NAME + '.log'
runLogHandler = handlers.TimedRotatingFileHandler(filename=logfile, when='midnight', interval=1,
                                                  encoding='utf-8')
runLogHandler.setFormatter(runLogFormatter)
runLogHandler.suffix = "%Y%m%d"

# logger set
runLogger = logging.getLogger()
runLogger.setLevel(logging.ERROR)
runLogger.addHandler(runLogHandler)

DATE_FORMAT = '%Y-%m-%d %H:%M:%S'
        
import pandas as pd

# 공정 메인 함수
@log_perform
def main(sn=1):
    """공정 메인 함수
    Args:
        args (Dictionary): 파라미터
    """

    job_proc.update_job(sn)

# vip 확인하여 조건 만족하면 main함수 실행
while True:
    vip_check = vip.main("smart-vip")
    if vip_check == "isVip":
        try:
            main()
            
        except:
            runLogger.error('Error: {}'.format(traceback.format_exc()))
            print('err occured')
    else:
        time.sleep(300)
        pass