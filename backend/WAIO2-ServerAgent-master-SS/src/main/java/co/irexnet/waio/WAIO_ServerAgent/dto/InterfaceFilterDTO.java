package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// Front-end 여과 공정 여과 지속 시간 값 및 한계 수위 값을 저장하기 위한 class
public class InterfaceFilterDTO
{
    private int f_location_ti_set_max;
    private float f_location_wl_max;
    private float f_bw_tank_le;
    private float f_back_le;
}
