# 파일명: ai_b_main.py
# 최종수정일: 2024.10.17

from ai_b import *
import tracemalloc
# vip 체크
import check_vip as vip

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
        vip_check = vip.main("smart-vip")
        
        if vip_check == "isVip":
            try:
                perform(db)
            except Exception as e:
                runLogger.error('Error: {}'.format(traceback.format_exc()))
                run_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                run_time = f'"{run_time}"'
                save_alm('TB_AI_B_ALM', 131002, run_time)
                pass

            print(tracemalloc.get_traced_memory())
        else:
            pass
        
        time.sleep(300)
        
if __name__=="__main__":
    tracemalloc.start()
    
    try:
        main(sys.argv)
    except Exception as e:
        runLogger.error('Error: {}'.format(str(e)))

    tracemalloc.stop()

