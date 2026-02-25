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
                + "   '740-450-EMS-9101'," // 논산(가) 펌프 1 ON/OFF 상태 예측
                + "   '740-450-EMS-9102'," // 논산(가) 펌프 2 ON/OFF 상태 예측
                + "   '740-450-EMS-9103'," // 논산(가) 펌프 3 ON/OFF 상태 예측
                + "   '740-450-EMS-9104'," // 논산(가) 펌프 4 ON/OFF 상태 예측
                + "   '740-914-EMS-9301'," // 함열(가) 펌프 1 ON/OFF 상태 예측
                + "   '740-914-EMS-9302'," // 함열(가) 펌프 2 ON/OFF 상태 예측
                + "   '740-914-EMS-9303'," // 함열(가) 펌프 3 ON/OFF 상태 예측
                + "   '740-914-EMS-9304'," // 함열(가) 펌프 4 ON/OFF 상태 예측
                + "   '740-914-EMS-9402'," // 함열(가) 펌프 1, 2 주파수 예측
                + "   '740-914-EMS-9403'," // 함열(가) 펌프 3 주파수 예측
                + "   '740-914-EMS-9404' " // 함열(가) 펌프 4 주파수 예측
                + ")"
                + " UNION ALL"
                + " SELECT tag AS tag_sn, value AS tag_val"
                + " FROM SMART_EMS.TB_PTR_CTR_INF"
                + " WHERE 1=1"
                + " AND tag IN ("
                + "   '740-450-EMS-1001'," // 논산(가) AI 운영 ON/OFF 구분
                + "   '740-914-EMS-2001' " // 함열(가) AI 운영 ON/OFF 구분
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
