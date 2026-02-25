#-*- coding:utf-8 -*-
##########
# 여과 실행 파일
# author : Lee Hyeokhui
# since : 2024. 10. 07
# version : 0.1
##########

############################### package load ###############################
from ai_f import *
import check_vip as vip

# 공정 메인 함수
def main(args):
    """공정 메인 함수

    Args:
        args (Dictionary): 파라미터
    """
        
    # DB Class 호출 
    db = DBUtil(Config)

    # 예측 시작
    while True:
        vip_check = vip.main("waio-portal-vip")
        
        if vip_check == "isVip":
            try:
                perform(db)
            except Exception as e:
                runLogger.error('Error: {}'.format(traceback.format_exc()))
                run_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                run_time = f'"{run_time}"'
                db.save_alm('TB_AI_F_ALM', 135002, run_time)
                pass
            time.sleep(300)
        else:
            time.sleep(300)
            pass
        
if __name__=="__main__":
    try:
        main(sys.argv)
    except Exception as e:
        runLogger.error('Error: {}'.format(str(e)))
    
    # manager=Manager()
    # params=manager.dict()

    # p1=Process(target=main,args=(params,))

    # p1.start()
    # p1.join()
