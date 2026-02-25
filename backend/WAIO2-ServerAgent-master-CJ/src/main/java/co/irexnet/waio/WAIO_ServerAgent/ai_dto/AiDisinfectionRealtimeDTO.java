package co.irexnet.waio.WAIO_ServerAgent.ai_dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
// ai_disinfection_realtime
// 소독 공정 AI 결과 테이블
public class AiDisinfectionRealtimeDTO {
    private Date upd_ti;
    private Integer g_pre_operation_mode;   // 전염소 운전 모드 0:수동, 1:반자동, 2:완전자동
    private Integer g_peri_operation_mode;  // 중염소 운전 모드 0:수동, 1:반자동, 2:완전자동
    private Integer g_post_operation_mode;  // 후염소 운전 모드 0:수동, 1:반자동, 2:완전자동
    private Float ai_g_pre1_evaporation;    // AI 전염소 1계열 증발량 예측
    private Float g_ser_cl_eva;    // AI 전염소 2계열 증발량 예측
    private Float g_e_obj_residual_cl;             // 1계열 혼화지 목표 잔류염소
    private Float d2_target_cl;             // 2계열 혼화지 목표 잔류염소
    private Float e1_target_cl;             // 1계열 침전지 목표 잔류염소
    private Float e2_target_cl;             // 2계열 침전지 목표 잔류염소
    private Float g_ser_trg_cl;              // 정수지 목표 잔류염소
    private Float g_pre1_chlorination;      // 전염소 1계열 현재 주입률
    private Float g_pre2_chlorination;      // 전염소 2계열 현재 주입률
    private Float g_peri1_chlorination;     // 중염소 1계열 현재 주입률
    private Float g_peri2_chlorination;     // 중염소 2계열 현재 주입률
    private Float g_ser_inr;      // 후염소 현재 주입률
    private Float ai_g_pre1_chlorination;   // AI 전염소 1계열 주입률 예측
    private Float ai_g_pre2_chlorination;   // AI 전염소 2계열 주입률 예측
    private Float ai_g_peri1_chlorination;  // AI 중염소 1계열 주입률 예측
    private Float ai_g_peri2_chlorination;  // AI 중염소 2계열 주입률 예측
    private Float ai_g_post1_chlorination;
    private Float ai_g_post2_chlorination;
    private Float e1_cl;                    // 1계열 침전지 잔류염소
    private Float d_ser_cl;                    // 2계열 침전지 잔류염소
    private Float d1_cl;                    // 1계열 혼화지 잔류염소
    private Float e_ser_cl;                    // 2계열 혼화지 잔류염소
    private Float d1_in_fr;                 // 1계열 혼화지 유입 유량
    private Float d_ser_in_fr;                 // 2계열 혼화지 유입 유량
    private Float g_pre1_corrected;         // 전염소 1계열 보정상수
    private Float g_pre2_corrected;         // 전염소 2계열 보정상수
    private Float ai_g_pre1_corrected;      // AI 전염소 1계열 보정값 예측
    private Float ai_g_pre2_corrected;      // AI 전염소 2계열 보정값 예측
    private Float ai_g_peri1_corrected;     // AI 중염소 1계열 보정값 예측
    private Float ai_g_peri2_corrected;     // AI 중염소 2계열 보정값 예측
    private Float g_inr_crt;      // AI 후염소 보정값 예측
    private Float h_in_cl;                  // 정수지 유입 잔류염소
    private Float h_out_cl;                 // 정수지 유출 잔류염소
    private Float h_ph;                     // 정수지 pH
    private Float h_tb;                     // 정수지 탁도
    private Float ai_g_ser_inr;   // AI 후염소 주입률 예측
    private Float g_h_in_1_residual_cl; // 정수1지 유입 잔류염소 (1계열)
    private Float g_h_in_2_residual_cl; // 정수3지 유입 잔류염소 (2계열)
    private Float g_post_1_chol_rate; // 후차염 1계열 주입률
    private Float g_post_2_chol_rate; // 후차염 2계열 주입률
    private Float g_f_out_1_residual_cl; // 중차염 여과지 1계열 유출 잔류염소
    private Float g_f_out_2_residual_cl; // 중차염 여과지 2계열 유출 잔류염소
    private Float ai_g_chol_rate;
    private Float g_peri_chol_rate; // 중염소 주입률
    private Float ai_g_1_chol_rate;
    private Float ai_g_2_chol_rate;
    private Float ai_g_1_correct_degree; // 후차염 1계열 이전 주입률 보정예측
    private Float ai_g_2_correct_degree; // 후차염 2계열 이전 주입률 보정예측
    private Float g_d_residual_cl; // 혼화지 잔류 염소
    private int g_pump_1_run;
    private int g_pump_2_run;
    private int g_1_pump_1_run;
    private int g_1_pump_2_run;
    private int g_2_pump_1_run;
    private int g_2_pump_2_run;
    private float g_tei;
    private Float g_e_1_residual_cl;
    private Float g_e_2_residual_cl;
    private Float g_elapsed_time; //주입률 경과시간
    private Float g_1_elapsed_time; //후차염 1계열 주입률 경과시간
    private Float g_2_elapsed_time; //후차염 2계열 주입률 경과시간
}
