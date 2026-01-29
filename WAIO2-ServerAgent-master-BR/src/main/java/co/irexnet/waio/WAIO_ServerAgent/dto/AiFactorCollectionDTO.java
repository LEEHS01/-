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
	private float b_in_fr; 				// 원수 유입 유량
	private float b_in_pr; 				// 원수 유입 압력
	private float h_location_le1; 		// 정수지 #1 수위
	private float h_location_le2; 		// 정수지 #2 수위
	private float h_location_le3; 		// 정수지 #3 수위
	private float h_out_fr;				// 정수지 총 유출 유량
	private float b1_gv_vv_po;			// 가이드 베인 개도
	private float b1_vv_po;				// 바이패스 개도

	//Coagulant
	private float b_tb; 				// 원수 탁도
	private float b_ph; 				// 원수 pH
	private float b_te; 				// 원수 수온
	private float b_cu; 				// 원수 전기전도도
	private float e1_tb_b;				// 침전지 탁도

	//Mixing
//	private float b_te;					// 원수 수온
	private float d_tb_e;				// 침전지 탁도

	//Sedimentation
//	private float b_in_fr;				// 원수 유입 유량
//	private float b_tb;					// 원수 탁도
	private float c_cf_coagulant;		// 약품
	private float mm_fr;				// 약품 주입량
	private float c_mm_fr_etc1;			// 활성탄 주입량
	private float c_mm_fr_etc2;			// 소석회 주입량
	private float c_mm_fr_etc3;			// 폴리아민 주입량
	
	//Filter
//	private float b_in_fr;				// 원수 유입 유량
//	private float e1_tb_b; 				// 침전수 탁도
	private float f_speed; 				// 여과속도
	private float f_out_fr;				// 여과 유출 유량
	
	//Disinfection
	private float g_tei;				// 기온
//	private float b_te;					// 착수정 수온
	private float d1_cl;				// 혼화지 잔류 염소
	private float e1_cl;				// 침전지 잔류 염소
	private float g_peri_chol_rate;		// 중차염 주입률
	private float g_pre_chol_rate;		// 전차염 주입률
	private float g_f_out_residual_cl;	// 여과지 유출 잔류염소
	private float h_in_cl;				// 정수지 유입 잔류 염소
	private float g_post_chol_rate;		// 후차염 주입률
	
}
