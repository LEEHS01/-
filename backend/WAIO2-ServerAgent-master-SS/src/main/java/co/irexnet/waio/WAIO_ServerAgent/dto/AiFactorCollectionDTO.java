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
	private float h_location_le4; // 정수지 #4 수위
	private float b_out_fri;// 정수지 총 유출 유량
	private float b_rtrn_in_fr;// 회수조 유출 유량
	private float b_in_pr; //원수 유입 압력
	
	
	//Coagulant
	private float b_tb; //	원수 탁도
	private float b_ph; //	원수 pH
	private float b_te; //	원수 수온
	private float b_cu; //	원수 전기전도도

	
	//Mixing
//	private float b_te; // 원수 수온 
	private float d_tb_e; // 침전지 탁도
	private float b_te_loc1; // 응집지 #1 수온
	private float b_te_loc2; // 응집지 #2 수온
	private float b_te_loc3; // 응집지 #3 수온
	private float b_te_loc4; // 응집지 #4 수온
	
	
	//Sedimentation
//	private float b_in_fr;	// 원수 유입 유량
//	private float b_tb;	// 원수 탁도
	private float ai_c1_cf_coagulant;	// 1단계 약품
	private float ai_c2_cf_coagulant;	// 2단계 약품
	private float mm_fr;	// 약품 사용량
	
	
	//Filter
//	private float b_in_fr;	// 원수 유입 유량
	private float e1_tb_b; //침전수 탁도
	private float f_speed; //여과속도
	private float f_out_fr;	//여과 유출 유량
	
	
	//Disinfection
//	private float b_te;	// 수온
//	private float b_tb; // 원수 탁도
//	private float b_ph;	// 원수 pH
//	private float b_cu; // 원수 전기 전도도
	private float g_tei; //기온
	private float g_e_residual_cl;	//침전지 잔류 염소
	private float g_pre_chol_rate;	//현재 주입률 
	private float g_peri_chol_rate;	//현재 주입률
	private float g_post_chol_rate;	//현재 주입률
	private float g_d_residual_cl;	//혼화지 잔류 염소
	private float g_f_out_residual_cl; //여과수 통합 잔류염소
	private float g_h_in_residual_cl;	//정수지 유입 잔류염소
	
	private float disinfection_index; //소독 단계
}
