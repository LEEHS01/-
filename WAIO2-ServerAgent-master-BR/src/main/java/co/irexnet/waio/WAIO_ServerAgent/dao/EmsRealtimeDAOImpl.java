package co.irexnet.waio.WAIO_ServerAgent.dao;

import co.irexnet.waio.WAIO_ServerAgent.dto.ProcessRealtimeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

@Repository
public class EmsRealtimeDAOImpl implements IProcessRealtimeDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public int insert(List<ProcessRealtimeDTO> list)
    {
        int[] result = jdbcTemplate.batchUpdate(
                "INSERT INTO ems_realtime VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE " +
                        "update_time = VALUES(update_time), value = VALUES(value);",
                new BatchPreparedStatementSetter()
                {
                    public void setValues(PreparedStatement ps, int i) throws SQLException
                    {
                        ps.setTimestamp(1, new java.sql.Timestamp(list.get(i).getUpd_ti().getTime()));
                        ps.setString(2, list.get(i).getTag_sn());
                        ps.setString(3, list.get(i).getTag_val());
                        ps.setInt(4, list.get(i).getQlt().intValue());
                    }
                    public int getBatchSize() { return list.size(); }
                }
        );
        return result.length;
    }

    @Override
    public List<ProcessRealtimeDTO> select(String partitionName, int processStep)
    {
    	String strQuery = "SELECT TAGNAME AS tag_sn, VALUE AS tag_val, TS AS upd_ti, QUALITY AS qlt"
                + " FROM SMART_EMS.TB_DATA_RAW_TAG ems"
                + " WHERE 1=1"
                + " AND TS = (SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00')"
                + "           FROM SMART_EMS.TB_DATA_RAW_TAG)"
                + " AND TAGNAME IN ("
                + "   '600-359-PMB-4015',"  // 보령(정) 펌프 1 ON/OFF 상태
                + "   '600-359-PMB-4025',"  // 보령(정) 펌프 2 ON/OFF 상태
                + "   '600-359-PMB-4035',"  // 보령(정) 펌프 3 ON/OFF 상태
                + "   '600-359-PMB-4045',"  // 보령(정) 펌프 4 ON/OFF 상태
                + "   '600-359-PMB-4055',"  // 보령(정) 펌프 5 ON/OFF 상태
                + "   '600-359-PMB-4065',"  // 보령(정) 펌프 6 ON/OFF 상태
                + "   '600-459-PMB-8005',"  // 청양(가) 펌프 1 ON/OFF 상태
                + "   '600-459-PMB-8003',"  // 청양(가) 펌프 2 ON/OFF 상태
                + "   '600-459-PMB-8001',"  // 청양(가) 펌프 3 ON/OFF 상태
                + "   '600-459-SPI-8002',"  // 청양(가) 펌프 1 주파수
                + "   '600-459-SPI-8001',"  // 청양(가) 펌프 2 주파수
                + "   '600-459-SPI-8000',"  // 청양(가) 펌프 3 주파수
                + "   '600-456-CBB-8142',"  // 홍성(가) 서산계통 펌프 1 ON/OFF 상태
                + "   '600-456-CBB-8152',"  // 홍성(가) 서산계통 펌프 2 ON/OFF 상태
                + "   '600-456-CBB-8162',"  // 홍성(가) 서산계통 펌프 3 ON/OFF 상태
                + "   '600-456-CBB-8172',"  // 홍성(가) 서산계통 펌프 4 ON/OFF 상태
                + "   '600-456-SPB-9008',"  // 홍성(가) 서산계통 펌프 1, 2 주파수
                + "   '600-456-CBB-8182',"  // 홍성(가) 예산계통 펌프 5 ON/OFF 상태
                + "   '600-456-CBB-8192',"  // 홍성(가) 예산계통 펌프 6 ON/OFF 상태
                + "   '600-456-CBB-8202',"  // 홍성(가) 예산계통 펌프 7 ON/OFF 상태
                + "   '600-456-CBB-8212',"  // 홍성(가) 예산계통 펌프 8 ON/OFF 상태
                + "   '600-456-SPB-8801',"  // 홍성(가) 예산계통 펌프 5 주파수
                + "   '600-457-CBB-8317',"  // 서산(가) 당진계통 펌프 1 ON/OFF 상태
                + "   '600-457-CBB-8153',"  // 서산(가) 당진계통 펌프 2 ON/OFF 상태
                + "   '600-457-CBB-8319',"  // 서산(가) 당진계통 펌프 3 ON/OFF 상태
                + "   '600-457-CBB-8173',"  // 서산(가) 당진계통 펌프 4 ON/OFF 상태
                + "   '600-457-XXB-9103',"  // 서산(가) 당진계통 펌프 1 주파수
                + "   '600-457-XXB-9106',"  // 서산(가) 당진계통 펌프 3 주파수
                + "   '600-457-CBB-8183',"  // 서산(가) 태안계통 펌프 5 ON/OFF 상태
                + "   '600-457-CBB-8193',"  // 서산(가) 태안계통 펌프 6 ON/OFF 상태
                + "   '600-457-CBB-8203',"  // 서산(가) 태안계통 펌프 7 ON/OFF 상태
                + "   '600-457-CBB-8213',"  // 서산(가) 태안계통 펌프 8 ON/OFF 상태
                + "   '600-457-XXB-8800'"   // 서산(가) 태안계통 펌프 5 주파수
                + ")";
        return jdbcTemplate.query(strQuery, new BeanPropertyRowMapper<>(ProcessRealtimeDTO.class));
    }

    @Override
    public List<ProcessRealtimeDTO> select(Date start_time, int processStep)
    {
        // Do anything
        return null;
    }

    @Override
    public List<ProcessRealtimeDTO> select(String name, Date start_time, Date end_time, int processStep)
    {
        // Do anything
        return null;
    }

    @Override
    public ProcessRealtimeDTO selectLatest(String name, int processStep)
    {
        // Do anything
        return null;
    }

    @Override
    public void addPartition(String partitionName, String end_time)
    {
        // Do anything
    }

    @Override
    public void dropPartition(String partitionName)
    {
        // Do anything
    }
}
