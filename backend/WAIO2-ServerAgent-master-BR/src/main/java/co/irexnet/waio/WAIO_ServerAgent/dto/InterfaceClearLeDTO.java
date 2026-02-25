package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// Front-end 착수 공정 정수지 목표 수위 값을 저장하기 위한 class
public class InterfaceClearLeDTO
{
    private Float h_target_le_max;
    private Float h_target_le_min;
    private Float b_valve_gv_max;
    private Float b_valve_gv_min;
    private Float b_valve_bypass_max;
    private Float b_valve_bypass_min;
    private Float b_valve_gv_pwr;
    private Float b_valve_gv_uplmt;
    private Float b_valve_gv_lolmt;
    private Float b_valve_bypass_uplmt;
    private Float b_valve_bypass_lolmt;
    //20260225 이현수 : 착수공정 후처리 관련하여 시각화 부분 미리 작성 
    //현재 실제 웹에 UI추가는 나중에 남부쪽 UI끝나면 이후 업데이트 현재는 디비에서만 수정하게 현재 미적용
    private Float b_pred_friout_correction_ratio_factor;  // 유출유량 예측 보정 계수 (alpha값, 0~1)
    private Float b_process_period_sec;                      // AI 착수 공정 실행 주기 (초)
}
