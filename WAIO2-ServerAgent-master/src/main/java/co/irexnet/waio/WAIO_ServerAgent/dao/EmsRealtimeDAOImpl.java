package co.irexnet.waio.WAIO_ServerAgent.dao;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import co.irexnet.waio.WAIO_ServerAgent.dto.ProcessRealtimeDTO;

@Repository
public class EmsRealtimeDAOImpl implements IProcessRealtimeDAO
{
    @Autowired
    // @Qualifier("emsJdbcTemplate")
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
        String strQuery = "SELECT * FROM ems_realtime ORDER BY name";
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
        String strQuery = "SELECT * FROM SMART_EMS.TB_TAG_MNG_EMS_CJ WHERE TAG_SN ='702-880-353-PWI-3720'";
        return jdbcTemplate.queryForObject(
                    strQuery,
                    new Object[]{},
                    new BeanPropertyRowMapper<>(ProcessRealtimeDTO.class)
        );
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
