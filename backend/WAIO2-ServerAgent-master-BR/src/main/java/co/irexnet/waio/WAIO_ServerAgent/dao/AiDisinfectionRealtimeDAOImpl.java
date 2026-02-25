package co.irexnet.waio.WAIO_ServerAgent.dao;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiDisinfectionRealtimeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class AiDisinfectionRealtimeDAOImpl implements IAiDisinfectionRealtimeDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<AiDisinfectionRealtimeDTO> select(Date start_time, Date end_time, int processStep, int disinfectionStep)
    {
        String strQuery = "SELECT * "; 
        		if(processStep == 1 && disinfectionStep == 1) {
        			strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_CHOL_RATE') as ai_g_pre_chol";		//전차염 주입률 예측
        			strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_E_RESIDUAL_CL') as e1_cl "; 			//전차염 침전지 잔류염소
        			strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_EVAP') as ai_g_pre_evap ";			//전차염 증발량 예측
        		}else if(processStep == 1 && disinfectionStep == 2) {
        			strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_CHOL_RATE') as ai_g_peri_chol";	//중차염 주입률 예측
                	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_E_RESIDUAL_CL') as e1_cl"; 			//중차염 침전지 잔류염소 계측값
        		}else if(processStep == 1 && disinfectionStep == 3) {
                	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_CHOL_RATE') as ai_g_post_chol";					//후차염 주입률 예측
                	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_CORRECT_DEGREE') as ai_g_correct_degree";			//후차염 이전 주입률 보정예측
                	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_H_IN_RESIDUAL_CL') as g_h_in_residual_cl";				//후차염 정수지 유입 잔류염소
                	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_H_IN_OBJ_RESIDUAL_CL') as g_h_in_obj_residual_cl";		//후차염 목표 정수지 잔류염소
                	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_H_OUT_RESIDUAL_CL') as g_h_out_residual_cl";		//후차염 정수지 유출 잔류염소
                }
        		strQuery += " FROM " + getTableByProcessStep(processStep, disinfectionStep) + " WHERE upd_ti > ? AND upd_ti <= ? ORDER BY upd_ti";
        return jdbcTemplate.query(
                strQuery,
                new Object[]{start_time, end_time},
                new BeanPropertyRowMapper<>(AiDisinfectionRealtimeDTO.class)
        );
    }

    @Override
    public AiDisinfectionRealtimeDTO select(int processStep, int disinfectionStep)
    {
        String strQuery = "SELECT * " ;
        
        if(processStep == 1 && disinfectionStep == 1) {
        	//전차염 분석테이블 조회
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_CHOL_RATE') as ai_g_pre_chol";		//전차염 주입률 예측
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_E_RESIDUAL_CL') as e1_cl"; 			//전차염 침전지 잔류염소 계측값
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_PRE_CHOL_RATE') as g_pre_chol_rate"; 	//전차염 주입률
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_D_RESIDUAL_CL') as d1_cl"; 			//전차염 혼화지 잔류염소
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_EVAP') as ai_g_pre_evap";			//전차염 증발량 예측
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.G_INJ_A_RUN') as g_inj_a_run";			//A차염설비 사용여부
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.G_INJ_D_RUN') as g_inj_d_run";			//D차염설비 사용여부
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_TEI') as g_tei";						//기온
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_PERI_CHOL_RATE') as g_peri_chol_rate"; //중차염 주입률
        }else if(processStep == 1 && disinfectionStep == 2) {
        	//중차염 분석테이블 조회
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_CHOL_RATE') as ai_g_peri_chol";	//중차염 주입률 예측
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_PERI_CHOL_RATE') as g_peri_chol_rate"; //중차염 주입률
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_E_RESIDUAL_CL') as e1_cl"; 			//중차염 침전지 잔류염소 계측값
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.G_INJ_B_RUN') as g_inj_b_run";			//B차염설비 사용여부
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.G_INJ_D_RUN') as g_inj_d_run";			//D차염설비 사용여부
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_F_OUT_RESIDUAL_CL') as g_f_out_residual_cl";	//여과지 유출 잔류염소
        }else if(processStep == 1 && disinfectionStep == 3) {
        	//후차염 분석테이블 조회
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_CHOL_RATE') as ai_g_post_chol";					//후차염 주입률 예측
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.AI_G_CORRECT_DEGREE') as ai_g_correct_degree";			//후차염 이전 주입률 보정예측
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_H_IN_RESIDUAL_CL') as g_h_in_residual_cl";				//후차염 정수지 잔류염소
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_H_IN_OBJ_RESIDUAL_CL') as g_h_in_obj_residual_cl";		//후차염 목표 정수지 잔류염소
        	strQuery += ", JSON_EXTRACT(IN_VAL, '$.G_POST_CHOL_RATE') as g_post_chol_rate"; 				//후차염 주입률
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.G_INJ_C_RUN') as g_inj_c_run";							//C차염설비 사용여부
        	strQuery += ", JSON_EXTRACT(OUT_VAL, '$.G_INJ_D_RUN') as g_inj_d_run";							//D차염설비 사용여부
        }
        strQuery += ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_ELAPSED_TIME')) AS g_elapsed_time";			//주입 후 경과시간
        strQuery += " FROM "+ getTableByProcessStep(processStep, disinfectionStep)+" ORDER BY upd_ti DESC LIMIT 1";
        
        try {
            return jdbcTemplate.queryForObject(strQuery, new BeanPropertyRowMapper<>(AiDisinfectionRealtimeDTO.class));
        } catch(EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public int delete(Date upd_ti, int processStep, int disinfectionStep)
    {
        String strQuery = "DELETE FROM "+ getTableByProcessStep(processStep, disinfectionStep) + " WHERE upd_ti < ?";
        return jdbcTemplate.update(strQuery, upd_ti);
    }
    
    public String getTableByProcessStep(int processStep, int disinfectionStep) {
        String tableNm = "";
        if(processStep == 1 && disinfectionStep == 1) {
            tableNm = "TB_AI_PRE_G_RT";
        }else if(processStep == 1 && disinfectionStep == 2) {
        	tableNm = "TB_AI_PERI_G_RT";
        }else if(processStep == 1 && disinfectionStep == 3) {
        	tableNm = "TB_AI_POST_G_RT";
        }
        return tableNm;
    }
}
