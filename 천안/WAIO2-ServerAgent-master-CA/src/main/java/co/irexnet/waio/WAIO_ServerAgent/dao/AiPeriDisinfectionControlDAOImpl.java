package co.irexnet.waio.WAIO_ServerAgent.dao;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessControlDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class AiPeriDisinfectionControlDAOImpl implements IAiProcessControlDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public AiProcessControlDTO select(Date upd_ti, Date rnti, String tag_sn, int kfk_flg, int processStep)
    {
        String strQuery = "SELECT * FROM " + getTableByProcessStep(processStep) + " WHERE upd_ti=? and rnti=? and tag_sn=? and kfk_flg=?";

        try
        {
            return jdbcTemplate.queryForObject(
                    strQuery,
                    new Object[]{upd_ti, rnti, tag_sn, kfk_flg},
                    new BeanPropertyRowMapper<>(AiProcessControlDTO.class)
            );
        }
        catch(EmptyResultDataAccessException e)
        {
            return null;
        }
    }

    @Override
    public List<AiProcessControlDTO> select(Date rnti, int kfk_flg, int processStep)
    {
        String strQuery = "SELECT * FROM " +
                "(SELECT * FROM " + getTableByProcessStep(processStep) + " WHERE rnti>=? and kfk_flg=? ORDER BY rnti DESC LIMIT 100) "
                				  + getTableByProcessStep(processStep) + " GROUP BY tag_sn ORDER BY rnti";
        return jdbcTemplate.query (
                strQuery,
                new Object[]{rnti, kfk_flg},
                new BeanPropertyRowMapper<>(AiProcessControlDTO.class)
        );
    }

    @Override
    public int updateKafkaFlag(Date upd_ti, Date rnti, String tag_sn, int kfk_flg, int processStep)
    {
        String strQuery = "UPDATE " + getTableByProcessStep(processStep) + " SET kfk_flg=? WHERE upd_ti=? and rnti=? and tag_sn=?";
        return jdbcTemplate.update(
                strQuery,
                kfk_flg, upd_ti, rnti, tag_sn
        );
    }

    @Override
    public int delete(Date date, int processStep)
    {
        String strQuery = "DELETE FROM " + getTableByProcessStep(processStep) + " WHERE upd_ti < ?";
        return jdbcTemplate.update(strQuery, date);
    }
    
    public String getTableByProcessStep(int processStep) {
        String tableNm = "";
        if(processStep == 2) {			// 2단계생활 중차염
            tableNm = "TB_AI_PERI_G2_LIV_CTR";
        } else if(processStep == 3) {	// 3단계 중차염
            tableNm = "TB_AI_PERI_G3_CTR";
        }
        return tableNm;
    }
}
