# 파일명 : ai_g_main.py
# Description : 보령 소독 주입률 main 파일. 해당 파일을 실행해 운영코드 실행
# Execute Program : ai_g_main.py 실행
# 수정일 : 2024-10-10 (주석 추가)
from ai_g import *
import check_vip as vip

def main(args):
    """
    일정 주기로 운영코드를 실행하는 main함수

    Args:
        args: main함수 인자

    Returns:
        None
    """
    # DB 연결
    db = DBUtil(Config)
    count_pre = 999
    count_peri = 999
    count_post = 999
    pre_chol = 0
    peri_chol = 0
    post_chol = 0
    calib_time_pre = datetime.now() - timedelta(days=1)
    calib_time_peri = datetime.now() - timedelta(days=1)
    calib_time_post = datetime.now() - timedelta(days=1)
    
    while True:
        vip_check = vip.main("smart-vip")
        if vip_check == 'isVip':    
            try:
                calib_time_pre, calib_time_peri, calib_time_post, count_pre, count_peri, count_post, pre_chol, peri_chol, post_chol = perform(db, calib_time_pre, calib_time_peri, calib_time_post, count_pre, count_peri, count_post, pre_chol, peri_chol, post_chol)
            except Exception as e:
                print('Error: {}'.format(traceback.format_exc()))
                pass
        else:
            pass
            
        time.sleep(60)

if __name__=="__main__":
    try:
        main(sys.argv)
    except Exception as e:
        runLogger.error('Error: {}'.format(str(e)))
    