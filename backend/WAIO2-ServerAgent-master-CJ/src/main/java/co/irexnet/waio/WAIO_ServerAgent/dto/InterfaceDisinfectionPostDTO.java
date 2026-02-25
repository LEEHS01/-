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
    private float g_post_1_set_max;               // 1계열 후염소 주입률 최대값
    private float g_post_1_set_min;               // 1계열 후염소 주입률 최소값
    private float g_post_1_chg_limit_for_onetime; // 1계열 후염소 1회 변경 한계치
    private float g_h_in_1_obj_residual_cl;       // 1계열 정수지유입 목표잔류염소
    private float g_post_1_calib_cycle;           // 1계열 1회 변경 주입률
    
    private float g_post_2_set_max;               // 2계열 후염소 주입률 최대값
    private float g_post_2_set_min;               // 2계열 후염소 주입률 최소값
    private float g_post_2_chg_limit_for_onetime; // 2계열후염소 1회 변경 한계치
    private float g_h_in_2_obj_residual_cl;       // 2계열 정수지유입 목표잔류염소
    private float g_post_2_calib_cycle;           // 2계열 1회 변경 주입률
    private float g_ser_trg_cl;                  // 정수지 목표 잔류염소
    
    private float g_post_1_calib_num;			 // 1계열 보정상수
    private float g_post_2_calib_num;			 // 2계열 보정상수
    
    private float g_h_in_1_residual_cl_holding; // 1계열 정수지 유입 잔류염소 홀딩 범위
    private float g_h_in_2_residual_cl_holding; // 2계열 정수지 유입 잔류염소 홀딩 범위

}
