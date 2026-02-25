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
	private float b_in_fr; 				// 원수 유입유량
	private float h_location_le1; 		// 정수지 #1 수위
	private float h_location_le2; 		// 정수지 #2 수위
	private float h_location_le3; 		// 정수지 #3 수위
	private float h_location_le4; 		// 정수지 #4 수위
	private float b_out_fri;			// 정수지 총 유출 유량
	private float b_back_in_fr;			// 배출수지 회수 유량
	private float b_back_le1;			// 배출수지 유출거수위#1
	private float b_back_le2;			// 배출수지 유출거수위#2
	private float b_fri_all_f1;			// 2단계공업 원수유입유량
	private float b_fri_all_f2;			// 2단계생활 원수유입유량
	private float b_fri_all_f3;			// 3단계 원수유입유량
	private float b_out_fri_tj;			// 6누수 원수 관로유량
	private float b_out_fri_as;			// 3단계 6누수 순시유량
	
	//Coagulant
	private float b_tb; 				// 원수 탁도
	private float b_ph; 				// 원수 pH
	private float b_te; 				// 원수 수온
	private float b_cu; 				// 원수 전기전도도

	//Mixing
//	private float b_te;					// 원수 수온
	private float d_tb_e;				// 침전지 탁도

	//Sedimentation
//	private float b_in_fr;				// 원수 유입 유량
//	private float b_tb;					// 원수 탁도
	private float c1_cf_coagulant;		// 2단계공업 약품
	private float c2_cf_coagulant;		// 2단계생활 약품
	private float c3_cf_coagulant;		// 3단계 약품
	private float c_mm_fr;				// 약품 주입량
	private float c_mm_fr_etc1;			// (2단계공업, 3단계)가성소다 주입량, (2단계생활)활성탄 주입량
	private float c_mm_fr_etc2;			// (2단계생활)가성소다 주입량, (3단계)폴리아민 주입량
	private float c_mm_fr_etc3;			// (2단계생활)폴리아민 주입량
	
	//Filter
//	private float b_in_fr;				// 원수 유입 유량
	private float e1_tb_b; 				// 침전수 탁도
	private float f_speed; 				// 여과속도
	private float f_out_fr;				// 여과 유출 유량
	
	//Disinfection
	private float g_tei;				// 기온
//	private float b_te;					// 수온
	private float h_in_fr;				// 정수지 잔류 염소
	private float g_pre_chol_rate;		// 전차염 현재 주입률
	private float g_d_residual_cl;		// 혼화지 잔류 염소
	private float g_e_residual_cl;		// 침전지 잔류 염소
	private float g_peri_chol_rate;		// 중차염 현재 주입률
	
	private float g_h_in_residual_cl;	// 정수지 유입 잔류 염소
	private float g_post_chol_rate;		// 후차염 현재 주입률
}
