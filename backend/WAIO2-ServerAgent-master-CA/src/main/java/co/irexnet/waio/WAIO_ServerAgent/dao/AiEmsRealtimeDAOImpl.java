package co.irexnet.waio.WAIO_ServerAgent.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiEmsRealtimeDTO;

@Repository
public class AiEmsRealtimeDAOImpl implements IAiEmsRealtimeDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<AiEmsRealtimeDTO> select()
    {
    	String strQuery = "SELECT tag AS tag_sn, value AS tag_val"
    	        + " FROM SMART_EMS.TB_PTR_CTR_ANLY_RST"
    	        + " WHERE 1=1"
    	        + " AND TIME = (SELECT DATE_FORMAT(MAX(time), '%Y-%m-%d %H:%i:00')"
    	        + "             FROM SMART_EMS.TB_PTR_CTR_ANLY_RST)"
    	        + " AND tag IN ("
    	        + "   '881-355-EMS-9101'," // 천안(정) 1번 펌프 ON/OFF 예측
    	        + "   '881-355-EMS-9102'," // 천안(정) 2번 펌프 ON/OFF 예측
    	        + "   '881-355-EMS-9103'," // 천안(정) 3번 펌프 ON/OFF 예측
    	        + "   '881-355-EMS-9202'," // 천안(정) 2번 펌프 주파수 예측
    	        + "   '881-355-EMS-9203'," // 천안(정) 3번 펌프 주파수 예측
    	        + "   '881-355-EMS-9301'," // 목천(가) 1번 펌프 ON/OFF 예측
    	        + "   '881-355-EMS-9302'," // 목천(가) 2번 펌프 ON/OFF 예측
    	        + "   '881-355-EMS-9401'," // 목천(가) 1번 펌프 주파수 예측
    	        + "   '881-355-EMS-9402' " // 목천(가) 2번 펌프 주파수 예측
    	        + ")"
    	        + " UNION ALL"
    	        + " SELECT tag AS tag_sn, value AS tag_val"
    	        + " FROM SMART_EMS.TB_PTR_CTR_INF"
    	        + " WHERE 1=1"
    	        + " AND tag IN ("
    	        + "   '881-355-EMS-1001'," // 천안 AI 운영 ON/OFF 구분
    	        + "   '881-455-EMS-2001' " // 목천 AI 운영 ON/OFF 구분
    	        + ")";
        try
        {
            return jdbcTemplate.query(strQuery, new BeanPropertyRowMapper<>(AiEmsRealtimeDTO.class));
        }
        catch(EmptyResultDataAccessException e)
        {
            return null;
        }
    }
}
