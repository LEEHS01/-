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
        + ", JSON_EXTRACT(SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_LEI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_LEI'))-2), '$.h_le') AS h_le "
        + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_OUT_FRI'))-2) AS b_out_fri FROM " 
        + getTableByProcessStep(processStep) + " WHERE upd_ti > ? AND upd_ti <= ? ORDER BY upd_ti";
        return jdbcTemplate.query(
                strQuery,
                new Object[]{start_time, end_time},
                new BeanPropertyRowMapper<>(AiReceivingRealtimeDTO.class)
        );
    }

    @Override
    public AiReceivingRealtimeDTO select(int processStep)
    {
        String strQuery = "SELECT UPD_TI, AI_OPR, IN_VAL, OUT_VAL"
        + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].B_POI'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].B_POI'))-2) AS b_vv_po" //밸브 개도 (조절 밸브)		
        + ", JSON_EXTRACT( SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_POI'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_POI'))-2), '$.ai_b_vv_po' ) AS ai_b_vv_po " // AI 밸브 개도 (AI 조절 밸브)
        + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI'))-2) AS ai_b_in_fr" //AI 원수 유입유량
        + ", JSON_EXTRACT( SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI_TREND'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_IN_FRI_TREND'))-2), '$.ai_b_in_fr_trend' ) AS ai_b_in_fr_rtd " //AI 원수 유입유량 트렌드 차트
        + ", SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_OUT_FRI_TREND'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_B_OUT_FRI_TREND'))-2) AS ai_b_out_fri_trend "	// 정수 유출 유량 트렌드
        + " FROM "+ getTableByProcessStep(processStep) + " ORDER BY upd_ti DESC LIMIT 1"; // FIXME DESC 수정
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
            tableNm = "TB_AI_B_RT";
        }
        return tableNm;
    }
}
