package co.irexnet.waio.WAIO_ServerAgent.dao;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiReceivingRealtimeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class AiReceivingRealtimeDAOImpl implements IAiReceivingRealtimeDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<AiReceivingRealtimeDTO> select(Date start_time, Date end_time, int processStep)
    {
        String strQuery = "SELECT UPD_TI, AI_OPR, IN_VAL, OUT_VAL"
        + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_POI'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_POI'))-2) AS ai_b_vv_po "
        + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_LEI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_LEI'))-2) AS h_loc_le "
        + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI'))-2) AS b_out_fri FROM " 
        + getTableByProcessStep(processStep) + " WHERE upd_ti > ? AND upd_ti <= ? ORDER BY upd_ti";
        return jdbcTemplate.query(
                strQuery,
                new Object[]{start_time, end_time},
                new BeanPropertyRowMapper<>(AiReceivingRealtimeDTO.class)
        );
    }

    @Override
    public AiReceivingRealtimeDTO select(int processStep) {
    	
        String strQuery = "SELECT UPD_TI, AI_OPR, IN_VAL, OUT_VAL"
        + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_POI'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_POI'))-2) AS ai_b_vv_po "
        + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI'))-2) AS ai_b_in_fri "
        + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI_TREND'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI_TREND'))-2) AS ai_b_in_fri_trend "
        + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_OUT_FRI_TREND'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_OUT_FRI_TREND'))-2) AS ai_b_out_fri_trend "
        + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_LEI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_LEI'))-2) AS h_loc_le "
        + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI'))-2) AS b_out_fri "
        + "FROM "
        + getTableByProcessStep(processStep) + " ORDER BY upd_ti DESC LIMIT 1";
        
    	if(processStep == 0) {
            strQuery = "SELECT UPD_TI, AI_OPR, IN_VAL, OUT_VAL"
                + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_POI'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_POI'))-2) AS ai_b_vv_po "
                + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI'))-2) AS ai_b_in_fri "
                + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI_TREND'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI_TREND'))-2) AS ai_b_in_fri_trend "
                + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_OUT_FRI_TREND'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_OUT_FRI_TREND'))-2) AS ai_b_out_fri_trend "
                + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_LEI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_LEI'))-2) AS h_loc_le "
                + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI'))-2) AS b_out_fri "
                + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI2'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI2'))-2) AS b_out_fri2 "
                + ", CONCAT('{\"b_pump_on_h1\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_PUMP_ON_H1'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_PUMP_ON_H1'))-2), '}')  AS b_pump_on_h1 "
                + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_PUMP_CNT_H1'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_PUMP_CNT_H1'))-2) AS b_pump_cnt_h1 "
                + ", CONCAT('{\"b_pump_on_h2\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_PUMP_ON_H2'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_PUMP_ON_H2'))-2), '}')  AS b_pump_on_h2 "
                + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_PUMP_CNT_H2'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_PUMP_CNT_H2'))-2) AS b_pump_cnt_h2 "
                + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_PUMP_CNT'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_PUMP_CNT'))-2) AS ai_b_pump_cnt "
                + ", CONCAT('{\"ai_b_pump_cb_h1\":', SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_PUMP_CB_H1'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_PUMP_CB_H1'))-2), '}') AS ai_b_pump_cb_h1 "
                + ", CONCAT('{\"ai_b_pump_cb_h2\":', SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_PUMP_CB_H2'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_PUMP_CB_H2'))-2), '}') AS ai_b_pump_cb_h2 "
                + "FROM "
                + getTableByProcessStep(processStep) + " ORDER BY upd_ti DESC LIMIT 1";
    	}
        try
        {
            return jdbcTemplate.queryForObject(strQuery, new BeanPropertyRowMapper<>(AiReceivingRealtimeDTO.class));
        }
        catch(EmptyResultDataAccessException e)
        {
            return null;
        }
    }

    @Override
    public int delete(Date upd_ti, int processStep)
    {
        String strQuery = "DELETE FROM " + getTableByProcessStep(processStep) + " WHERE upd_ti < ?";
        return jdbcTemplate.update(strQuery, upd_ti);
    }
    
    public String getTableByProcessStep(int processStep) {
        String tableNm = "";
        if(processStep == 1) {
            tableNm = "TB_AI_B1_RT";
        } else if(processStep == 2) {
            tableNm = "TB_AI_B2_RT";
        } else if(processStep == 0) {
            tableNm = "TB_AI_B_PUMP_RT";
        }
        return tableNm;
    }
}
