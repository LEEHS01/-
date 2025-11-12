package co.irexnet.waio.WAIO_ServerAgent.dao;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiFilterRealtimeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class AiFilterRealtimeDAOImpl implements IAiFilterRealtimeDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<AiFilterRealtimeDTO> select(Date start_time, Date end_time, int processStep)
    {
        String strQuery = "SELECT * FROM " + getTableByProcessStep(processStep) + " " +
                "WHERE upd_ti > ? AND upd_ti <= ? ORDER BY upd_ti";
        return jdbcTemplate.query(
                strQuery,
                new Object[]{start_time, end_time},
                new BeanPropertyRowMapper<>(AiFilterRealtimeDTO.class)
        );
    }

    @Override
    public AiFilterRealtimeDTO select(int processStep)
    {
    	String strQuery = "SELECT * "
                + ", SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_SPEED'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_SPEED'))-2) AS f_sp " 
        		+ ", JSON_EXTRACT(IN_VAL, '$.F_FRI_IN') AS f_fri_in" 			//원수유입유량 도출
        		+ ", CONCAT('{\"ai_f_opr_cnt\":', SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_NUM_FIL'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_NUM_FIL'))-2),'}') AS ai_f_opr_cnt" 	//운영지 수(count) 예측값
        		+ ", JSON_EXTRACT(IN_VAL, '$.F_TBI_PER') as f_tb"
        		+ ", JSON_EXTRACT(IN_VAL, '$.F_WL_PER') as f_wl" 				//각 지별 여과지 수위 (JSON)
                + ", CONCAT('{\"ai_f_wl\":', SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_WL'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_WL'))-2),'}') AS ai_f_wl " //각 지별 예측 여과지 수위 (JSON)
        		+ ", JSON_EXTRACT(IN_VAL, '$.F_TIME_PER') as f_time" 			//각 지별 여과지속시간 (JSON)
                + ", CONCAT('{\"f_time_bw_per\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_TIME_BW_PER'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_TIME_BW_PER'))-2),'}') AS f_time_bw_per "
                + ", CONCAT('{\"ai_f_time\":', SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_TIME'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_TIME'))-2),'}') AS ai_f_time " //각 지별 예측 여과지속시간 (JSON)
                + ", CONCAT('{\"ai_f_loc_bw_ti\":', SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_BW_START_TIME'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_BW_START_TIME'))-2),'}') AS ai_f_loc_bw_ti " //각 지별 예측 역세시작시간 (JSON)
                + ", CONCAT('{\"ai_f_location_operation\":', SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_LOCATION_OPERATION'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_LOCATION_OPERATION'))-2),'}') AS ai_f_location_operation "
        		+ ", CONCAT('{\"ai_f_schedule\":', SUBSTR(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_SCHEDULE_FINAL'), 2, LENGTH(JSON_EXTRACT(OUT_VAL, '$[*].AI_F_SCHEDULE_FINAL'))-2),'}') AS ai_f_schedule "
                + ", CONCAT('{\"f_fil_ready\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_FIL_READY'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_FIL_READY'))-2),'}') AS f_fil_ready "
                + ", CONCAT('{\"f_fil_ing\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_FIL_ING'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_FIL_ING'))-2),'}') AS f_fil_ing "
                + ", CONCAT('{\"f_fil_end\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_FIL_END'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_FIL_END'))-2),'}') AS f_fil_end "
                + ", CONCAT('{\"f_fil_wait\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_FIL_WAIT'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_FIL_WAIT'))-2),'}') AS f_fil_wait "
                + ", CONCAT('{\"f_rest\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_REST'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_REST'))-2), '}') AS f_rest"
                + ", CONCAT('{\"f_bw_wait\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_BW_WAIT'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_BW_WAIT'))-2),'}') AS f_bw_wait "
                + ", CONCAT('{\"f_bw_ing\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_BW_ING'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_BW_ING'))-2),'}') AS f_bw_ing "
                + ", CONCAT('{\"f_dr_ing\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_DR_ING'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_DR_ING'))-2),'}') AS f_dr_ing "
                + ", CONCAT('{\"f_etc\":', SUBSTR(JSON_EXTRACT(IN_VAL, '$[*].F_ETC'), 2, LENGTH(JSON_EXTRACT(IN_VAL, '$[*].F_ETC'))-2),'}') AS f_etc "
        		+ " FROM " + getTableByProcessStep(processStep)
        		+ " ORDER BY upd_ti DESC LIMIT 1";
        try
        {
            return jdbcTemplate.queryForObject(strQuery, new BeanPropertyRowMapper<>(AiFilterRealtimeDTO.class));
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
    		tableNm = "TB_AI_F1_RT";
    	}else if(processStep == 2) {
    		tableNm = "TB_AI_F2_RT";
    	}
    	return tableNm;
    }
}
