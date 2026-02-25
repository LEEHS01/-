package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// 착수 공정 설정값을 저장하기 위한 class
public class InterfaceReceivingDTO
{
    private Float h_target_le_max;
    private Float h_target_le_min;
    private float b_valve_max; //개도율 최대값
    private float b_valve_min; //개도율 최소값
}
