package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
//Front-end 여과 공정 여과 지속 시간 값 및 한계 수위 값을 저장하기 위한 class
public class InterfaceFilterDTO
{
 private int f_location_ti_set_max;
 private float f_location_wl_max;
 private float f_bw_tank_le; // 역세수조 기준수위
 private float f_back_le; //회수조 기준수위 (1단계) / 배출수지 기준수위(2단계)
 private float f_h_le; //정수지 기준수위
}
