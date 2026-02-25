package co.irexnet.waio.WAIO_ServerAgent.ai_dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
// ai_receiving_realtime
// 착수 공정 AI 결과 테이블
public class AiReceivingRealtimeDTO
{
    private Date upd_ti;
    private Integer ai_opr;   // 운전 모드 0:수동, 1:반자동, 2:완전자동
    private Integer ems_opr;         // EMS 모드 0:OFF, 1:ON
    private String b_in_fr_q;             // 원수 유입 유량
    private Float b_in_pr;              // 원수 유입 압력
    private Float b_out_fri;            // 정수지 유출 유량
    private String b_vv_po;             // 원수 조절 밸브 개도
    private String h_loc_le;                // 정수지 수위
    private Float h_out_fr;             // 정수지 유출 유량
    private String ai_h_out_fr;         // AI 정수지 유출 유량 예측
    private Float ai_b_in_fri;          // AI 원수 유입 유량 예측
    private Float ai_b_vv_po;          // AI 원수 조절 밸브 개도 예측
    private String ai_b_in_fri_trend;    // AI 원수 유입 유량 예측 트렌드
    private String ai_b_out_fri_trend;    // AI 정수지 유출 유량
    // 펌프 추가
    private Integer b_pump_cnt_h1;		// 전동1단계 펌프 총 가동 대수
    private String b_pump_on_h1;		// 전동1단계 펌프 호기별 작동상태
    private Integer b_pump_cnt_h2;		// 전동2단계 펌프 총 가동 대수
    private String b_pump_on_h2;		// 전동2단계 펌프 호기별 작동상태
    private Integer b_pump_cnt_h3;		// 전동3단계 펌프 총 가동 대수
    private String b_pump_on_h3;		// 전동3단계 펌프 호기별 작동상태
    private Integer ai_b_pump_cnt;		// 펌프 총 가동 대수 예측
    private String ai_b_pump_cb_h1;		// 전동1단계 펌프 가동 조합 예측
    private String ai_b_pump_cb_h2;		// 전동2단계 펌프 가동 조합 예측
    private String ai_b_pump_cb_h3;		// 전동3단계 펌프 가동 조합 예측
    private String b_fri;				// 원수 유입 유량
    private String b_out_fri_all;				// 원수 유입 유량
    private Float b_out_fri_tj;         // 탕정분기 유량
    private Float b_out_fri_as;         // 아산 생활원수 유량
}
