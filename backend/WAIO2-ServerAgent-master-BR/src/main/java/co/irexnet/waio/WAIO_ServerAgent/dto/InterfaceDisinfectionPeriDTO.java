package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// Front-end 소독 중염소 알고리즘 설정값을 저장하기 위한 class
public class InterfaceDisinfectionPeriDTO
{
	private float g_peri_set_max;				//중차염 주입률 상한
	private float g_peri_set_min;				//중차염 주입률 하한
	private float g_peri_calib_cycle;			//중차염 보정주기
	private float g_peri_chg_limit_for_onetime;	//중차염 1회 변경 주입률
	private float g_e_obj_residual_cl;			//중차염 목표 침전지 잔류염소
	private float g_f_out_residual_cl_min;		//여과지 유출 잔류염소 하한값
	private float g_e_residual_cl_holding;		//침전지 잔류염소 홀딩 범위
}
