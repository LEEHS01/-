package co.irexnet.waio.WAIO_ServerAgent.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.UsrManageDTO;

@Repository
public class UsrManageDAOImpl implements IUsrManageDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

	@Override
    public UsrManageDTO select(String itm)
    {
        String strQuery = "SELECT * FROM TB_USR_MNG WHERE itm=?";
        try
        {
            return jdbcTemplate.queryForObject(
                    strQuery, new Object[]{itm}, new BeanPropertyRowMapper<>(UsrManageDTO.class)
            );
        }
        catch(EmptyResultDataAccessException e)
        {
            return null;
        }
    }
	
	@Override
    public int update(String itm, String value)
    {
        String strQuery = "UPDATE TB_USR_MNG SET init_val=? WHERE itm=?";
        return jdbcTemplate.update(strQuery, value, itm);
    }

}
