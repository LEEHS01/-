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
    public List<AiDisinfectionRealtimeDTO> select(Date start_time, Date end_time, int processStep, int disinfectionIndex)
    {
        String strQuery = "SELECT UPD_TI, AI_OPR, IN_VAL, OUT_VAL "
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_CLI_H_IN')) AS e1_target_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_E_RESIDUAL_CL')) AS e1_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_PRE_CHOL_RATE')) AS g_pre1_chlorination"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_POST_CHOL_RATE')) AS g_post_chol_rate"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_IN_RESIDUAL_CL')) AS g_h_in_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_OUT_RESIDUAL_CL')) AS h_out_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_RESIDUAL_CL')) AS g_h_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_IN_1_RESIDUAL_CL')) AS g_h_in_1_residual_cl" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_IN_2_RESIDUAL_CL')) AS g_h_in_2_residual_cl" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_POST_1_CHOL_RATE')) AS g_post_1_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_POST_2_CHOL_RATE')) AS g_post_2_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_PERI_CHOL_RATE')) AS g_peri_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_F_OUT_1_RESIDUAL_CL')) AS g_f_out_1_residual_cl" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_F_OUT_2_RESIDUAL_CL')) AS g_f_out_2_residual_cl" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_E_1_RESIDUAL_CL')) AS g_e_1_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_E_2_RESIDUAL_CL')) AS g_e_2_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_EVAP')) AS ai_g_pre1_evaporation"
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_CHOL_RATE')) AS ai_g_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_1_CHOL_RATE')) AS ai_g_1_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_2_CHOL_RATE')) AS ai_g_2_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_1_CORRECT_DEGREE')) AS ai_g_1_correct_degree" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_2_CORRECT_DEGREE')) AS ai_g_2_correct_degree" 
                + " FROM "
                + getTableByProcessStep(processStep, disinfectionIndex) + 
                " WHERE upd_ti > ? AND upd_ti <= ? ORDER BY upd_ti";
        return jdbcTemplate.query(
                strQuery,
                new Object[]{start_time, end_time},
                new BeanPropertyRowMapper<>(AiDisinfectionRealtimeDTO.class)
        );
    }

    @Override
    public AiDisinfectionRealtimeDTO select(int processStep, int disinfectionIndex)
    {
        String strQuery = "SELECT UPD_TI, AI_OPR, IN_VAL, OUT_VAL "
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_CLI_H_IN')) AS e1_target_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_E_RESIDUAL_CL')) AS e1_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_D_RESIDUAL_CL')) AS g_d_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_PRE_CHOL_RATE')) AS g_pre1_chlorination"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_POST_CHOL_RATE')) AS g_post_chol_rate"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_IN_RESIDUAL_CL')) AS g_h_in_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_OUT_RESIDUAL_CL')) AS h_out_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_RESIDUAL_CL')) AS g_h_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_IN_1_RESIDUAL_CL')) AS g_h_in_1_residual_cl" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_H_IN_2_RESIDUAL_CL')) AS g_h_in_2_residual_cl" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_POST_1_CHOL_RATE')) AS g_post_1_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_POST_2_CHOL_RATE')) AS g_post_2_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_PERI_CHOL_RATE')) AS g_peri_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_F_OUT_1_RESIDUAL_CL')) AS g_f_out_1_residual_cl" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_F_OUT_2_RESIDUAL_CL')) AS g_f_out_2_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_E_1_RESIDUAL_CL')) AS g_e_1_residual_cl"
                + ", JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_E_2_RESIDUAL_CL')) AS g_e_2_residual_cl"
                + ", IFNULL(JSON_UNQUOTE(JSON_EXTRACT(IN_VAL, '$.G_TEI')), 0) AS g_tei" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_EVAP')) AS ai_g_pre1_evaporation"
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_CHOL_RATE')) AS ai_g_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_1_CHOL_RATE')) AS ai_g_1_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_2_CHOL_RATE')) AS ai_g_2_chol_rate" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_1_CORRECT_DEGREE')) AS ai_g_1_correct_degree" 
                + ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.AI_G_2_CORRECT_DEGREE')) AS ai_g_2_correct_degree" 
                + ", IFNULL(JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_PUMP_1_RUN')), 0) AS g_pump_1_run"
                + ", IFNULL(JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_PUMP_2_RUN')), 0) AS g_pump_2_run"
                + ", IFNULL(JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_1_PUMP_1_RUN')), 0) AS g_1_pump_1_run"
                + ", IFNULL(JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_1_PUMP_2_RUN')), 0) AS g_1_pump_2_run"
                + ", IFNULL(JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_2_PUMP_1_RUN')), 0) AS g_2_pump_1_run"
                + ", IFNULL(JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_2_PUMP_2_RUN')), 0) AS g_2_pump_2_run"
        		+ ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_ELAPSED_TIME')) AS g_elapsed_time"
        		+ ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_1_ELAPSED_TIME')) AS g_1_elapsed_time"
        		+ ", JSON_UNQUOTE(JSON_EXTRACT(OUT_VAL, '$.G_2_ELAPSED_TIME')) AS g_2_elapsed_time"
                + " FROM "
                + getTableByProcessStep(processStep, disinfectionIndex) + " ORDER BY upd_ti DESC LIMIT 1";
        try
        {
            return jdbcTemplate.queryForObject(strQuery, new BeanPropertyRowMapper<>(AiDisinfectionRealtimeDTO.class));
        }
        catch(EmptyResultDataAccessException e)
        {
            return null;
        }
    }

    @Override
    public int delete(Date upd_ti, int processStep, int disinfectionIndex)
    {
        String strQuery = "DELETE FROM " + getTableByProcessStep(processStep, disinfectionIndex) + " WHERE upd_ti < ?";
        return jdbcTemplate.update(strQuery, upd_ti);
    }

    public String getTableByProcessStep(int processStep, int disinfectionIndex) {
        String tableNm = "";
        if(processStep == 1 && disinfectionIndex == 1) { // 1단계 전차염
            tableNm = "TB_AI_PRE_G1_RT";
        } else if(processStep == 2 && disinfectionIndex == 1) { // 2단계 전차염
            tableNm = "TB_AI_PRE_G2_RT";
        } else if(processStep == 2 && disinfectionIndex == 2) { // 2단계 중차염
            tableNm = "TB_AI_PERI_G2_RT";
        } else if(processStep == 2 && disinfectionIndex == 3) { // 2단계 후차염
            tableNm = "TB_AI_POST_G2_RT";
        }
        return tableNm;
    }
}
