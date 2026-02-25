package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// 착수 인버터 Hz 상하한 DTO
public class InterfaceReceivingHzDTO
{
    private float b_hz_max; //인버터 Hz 상한
    private float b_hz_min; //인버터 Hz 하한
}
