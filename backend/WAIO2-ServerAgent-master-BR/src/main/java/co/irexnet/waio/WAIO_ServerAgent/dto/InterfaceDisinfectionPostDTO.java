package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// Front-end 소독 후염소 알고리즘 설정값을 저장하기 위한 class
public class InterfaceDisinfectionPostDTO
{
	private float g_post_set_max;				//후차염 주입률 상한
	private float g_post_set_min;				//후차염 주입률 하한
	private float g_post_calib_cycle;			//후차염 보정주기
	private float g_post_chg_limit_for_onetime;	//후차염 1회 변경 주입률
	private float g_h_obj_residual_cl;			//후차염 목표 정수 잔류염소
	private float g_post_calib_num;				//후차염 보정상수
	private float g_h_in_residual_cl_holding;	//정수지 유입 잔류염소 홀딩 범위
}
