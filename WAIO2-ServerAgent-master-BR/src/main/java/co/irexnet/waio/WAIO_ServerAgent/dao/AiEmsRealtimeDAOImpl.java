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
                + "   '606-359-EMS-9101'," // 보령(정) 펌프 1 ON/OFF 상태 예측
                + "   '606-359-EMS-9102'," // 보령(정) 펌프 2 ON/OFF 상태 예측
                + "   '606-359-EMS-9103'," // 보령(정) 펌프 3 ON/OFF 상태 예측
                + "   '606-359-EMS-9104'," // 보령(정) 펌프 4 ON/OFF 상태 예측
                + "   '606-359-EMS-9105'," // 보령(정) 펌프 5 ON/OFF 상태 예측
                + "   '606-359-EMS-9106'," // 보령(정) 펌프 6 ON/OFF 상태 예측
                + "   '600-401-EMS-9101'," // 청양(가) 펌프 1 ON/OFF 상태 예측
                + "   '600-401-EMS-9102'," // 청양(가) 펌프 2 ON/OFF 상태 예측
                + "   '600-401-EMS-9103'," // 청양(가) 펌프 3 ON/OFF 상태 예측
                + "   '600-401-EMS-9201'," // 청양(가) 펌프 1 주파수 예측
                + "   '600-401-EMS-9202'," // 청양(가) 펌프 2 주파수 예측
                + "   '600-401-EMS-9203'," // 청양(가) 펌프 3 주파수 예측
                + "   '600-402-EMS-9101'," // 홍성(가) 서산계통 펌프 1 ON/OFF 상태 예측
                + "   '600-402-EMS-9102'," // 홍성(가) 서산계통 펌프 2 ON/OFF 상태 예측
                + "   '600-402-EMS-9103'," // 홍성(가) 서산계통 펌프 3 ON/OFF 상태 예측
                + "   '600-402-EMS-9104'," // 홍성(가) 서산계통 펌프 4 ON/OFF 상태 예측
                + "   '600-402-EMS-9201'," // 홍성(가) 서산계통 펌프 1 주파수 예측
                + "   '600-402-EMS-9202'," // 홍성(가) 서산계통 펌프 2 주파수 예측
                + "   '600-402-EMS-9105'," // 홍성(가) 예산계통 펌프 5 ON/OFF 상태 예측
                + "   '600-402-EMS-9106'," // 홍성(가) 예산계통 펌프 6 ON/OFF 상태 예측
                + "   '600-402-EMS-9107'," // 홍성(가) 예산계통 펌프 7 ON/OFF 상태 예측
                + "   '600-402-EMS-9108'," // 홍성(가) 예산계통 펌프 8 ON/OFF 상태 예측
                + "   '600-402-EMS-9205'," // 홍성(가) 예산계통 펌프 5 주파수 예측
                + "   '600-400-EMS-9101'," // 서산(가) 당진계통 펌프 1 ON/OFF 상태 예측
                + "   '600-400-EMS-9102'," // 서산(가) 당진계통 펌프 2 ON/OFF 상태 예측
                + "   '600-400-EMS-9103'," // 서산(가) 당진계통 펌프 3 ON/OFF 상태 예측
                + "   '600-400-EMS-9104'," // 서산(가) 당진계통 펌프 4 ON/OFF 상태 예측
                + "   '600-400-EMS-9201'," // 서산(가) 당진계통 펌프 1 주파수 예측
                + "   '600-400-EMS-9202'," // 서산(가) 당진계통 펌프 3 주파수 예측
                + "   '600-400-EMS-9301'," // 서산(가) 태안계통 펌프 5 ON/OFF 상태 예측
                + "   '600-400-EMS-9302'," // 서산(가) 태안계통 펌프 6 ON/OFF 상태 예측
                + "   '600-400-EMS-9303'," // 서산(가) 태안계통 펌프 7 ON/OFF 상태 예측
                + "   '600-400-EMS-9304'," // 서산(가) 태안계통 펌프 8 ON/OFF 상태 예측
                + "   '600-400-EMS-9401' " // 서산(가) 태안계통 펌프 5 주파수 예측
                + ")"
                + " UNION ALL"
                + " SELECT tag AS tag_sn, value AS tag_val"
                + " FROM SMART_EMS.TB_PTR_CTR_INF"
                + " WHERE 1=1"
                + " AND tag IN ("
                + "   '606-359-EMS-1001'," // 보령(정) AI 운영 ON/OFF 구분
                + "   '606-459-EMS-1001'," // 청양(가) AI 운영 ON/OFF 구분
                + "   '600-456-EMS-1001'," // 홍성(가) 서산 AI 운영 ON/OFF 구분
                + "   '600-456-EMS-2001'," // 홍성(가) 예산 AI 운영 ON/OFF 구분
                + "   '600-457-EMS-1001'," // 서산(가) 당진 AI 운영 ON/OFF 구분
                + "   '600-457-EMS-2001' " // 서산(가) 태안 AI 운영 ON/OFF 구분
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
