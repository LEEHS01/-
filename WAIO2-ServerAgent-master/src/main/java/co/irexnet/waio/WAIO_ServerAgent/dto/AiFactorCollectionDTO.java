package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.util.Date;
@Getter
@Setter
@ToString
// AiFactorCollectionDTO 공정별 주요인자 모음 DTO
public class AiFactorCollectionDTO
{	
	//Receiving
	private float b_in_fr; // 원수 유입유량
	private float h_location_le1; // 정수지 #1 수위
	private float h_location_le2; //정수지 #2 수위
	private float h_location_le3; // 정수지 #3 수위
	private float h_out_fr;// 정수지 총 유출 유량
	private float b_in_fr_sum; //현도(취) 토출유량 (#1~#10)
	private float b_in_fr3; // 현도2(취) 토출유량
	private float b_in_fr4; //전동(가) 1단계 유입유량
	private float b_in_fr5; //전동(가) 2단계 유입유량
	private float b_in_fr6; //중부권유량
	private float b_lei; //원형수조 수위
	
	//Coagulant
	private float b_tb; //	원수 탁도
	private float b_ph; //	원수 pH
	private float b_te; //	원수 수온
	private float b_cu; //	원수 전기전도도

	//Mixing
//	private float b_te;	//원수 수온
//	private float d_ki_dv;	//동점성 계수
//	private float d_anr;	//패들면적
//	private float d_v;// 조 체적
	private float d_tb_e;	//침전지 탁도

	//Sedimentation
//	private float b_in_fr;	// 원수 유입 유량
//	private float b_tb;	// 원수 탁도
	private float c1_cf_coagulant;	// 1단계 약품
	private float c_mm_fr;	// 약품 주입량
	private float c2_cf_coagulant;	// 2단계 약품
	private float c_mm_fr_etc;	// 활성탄 주입률
	
	//Filter
	private float d1_in_fr;	// 원수 유입 유량
	private float e1_tb_b; //침전수 탁도
	private float f_speed; //여과속도
	private float f_out_fr;	//여과 유출 유량
	
	//Disinfection
//	private float b_te;	//수온
	private float g_tei;	//기온
//	private float h_tb;	//정수 탁도
//	private float h_ph;	//정수 pH
//	private float b_in_fr;	//원수 유입유량
	private float e1_cl;	//침전지 잔류 염소
	private float g_pre_chol_rate;	//현재 주입률
	private float g_d_residual_cl;	//혼화지 잔류 염소
	private float g_e_1_residual_cl;	//침전지 잔류 염소
	private float g_e_2_residual_cl;	//침전지 잔류 염소
	private float g_peri_chol_rate;	//중염소 주입률
	private float g_f_out_1_residual_cl;	//여과지 유출 잔류 염소 1계열
	private float g_f_out_2_residual_cl;	//여과지 유출 잔류 염소 2계열
	private float f1_out_fr;	//여과지 유출유량 1계열
	private float f2_out_fr;	//여과지 유출유량 2계열
	private float g_h_in_1_residual_cl;	//정수지 유입 잔류염소 1계열
	private float g_h_in_2_residual_cl;	//정수지 유입 잔류염소 2계열
	private float g_h_out_residual_cl;	//정수지 유출 잔류염소
	private float g_post_1_chol_rate;	//현재 주입률 1계열
	private float g_post_2_chol_rate;	//현재 주입률 2계열
	private float disinfection_index; //소독 단계
}
