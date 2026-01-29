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
}
