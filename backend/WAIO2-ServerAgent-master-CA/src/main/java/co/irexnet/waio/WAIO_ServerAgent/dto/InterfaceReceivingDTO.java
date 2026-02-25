package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// Front-end 착수 회수 유량 사용 여부를 설정하기 위한 class
public class InterfaceReceivingDTO
{
    private float b_back_in_fr_flag;	// 회수 유량 사용 여부
    private float b_back_in_fr_po;		// 회수 유량 사용 시 원수 조절 밸브 개도
}
