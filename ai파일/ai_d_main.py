# 파일명: ai_d_main.py
# 최종수정일: 2024.10.10

from ai_d import *

import tracemalloc
from datetime import datetime

# 공정 메인 함수
def main(args):
    
    """공정 메인 함수
      DB 객체 호출 및 py 파일 실행 
      배치 주기에 맞게 sleep 적용
    Args:
        args (Dictionary): 파라미터
    """
        
    # DB Class 호출 
    db = DBUtil(Config)

    while True:
        try:
            perform(db)
        except Exception as e:
            runLogger.error('Error: {}'.format(traceback.format_exc()))
            pass

        print(tracemalloc.get_traced_memory())
        time.sleep(600)
        
if __name__=="__main__":
    tracemalloc.start()
    
    try:
        main(sys.argv)
    except Exception as e:
        runLogger.error('Error: {}'.format(str(e)))

    tracemalloc.stop()
