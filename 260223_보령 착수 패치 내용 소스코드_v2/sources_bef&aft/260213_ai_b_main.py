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
        

        # ===============================================================
        # ============ VVV 보정주기 조정 가능하게 수정(260213) VVV ============
        # ===============================================================

        """
            작성 시각 : 260213
            작성자 : 온더시스 강동현 사원
            작성 목적 : 해당 코드 수정은 보령 정수장의 착수 공정 주기를 간단히 수정 가능하게 만들고자 만들어졌음
            작성 내용 : config에서 예측 주기를 가져와 적용하는 내용
            메모 : X
        """
        
        cfg_path = os.path.join(PROC_PATH, "config.json")
        
        period_mins = 5 # 기본값
        
        try:
            with open(cfg_path, "r", encoding="utf-8") as f:
                cfg = json.load(f)

            period_mins  = float(cfg.get("process_period_mins", period_mins))
        except FileNotFoundError:
            # 운영에서 파일이 없으면 기본값으로 진행 (로그만 남기고 계속)
            runLogger.error(f"config.json not found: {cfg_path}")
        except Exception:
            runLogger.error(f"config.json read/parse error: {traceback.format_exc()}")
            
        time.sleep(period_mins * 60)
        # ===============================================================
        # ============ ^^^ 보정주기 조정 가능하게 수정(260213) ^^^ ============
        # ===============================================================
        # 기존 코드
        """
        time.sleep(300)
        """

        
if __name__=="__main__":
    tracemalloc.start()
    
    try:
        main(sys.argv)
    except Exception as e:
        runLogger.error('Error: {}'.format(str(e)))

    tracemalloc.stop()

