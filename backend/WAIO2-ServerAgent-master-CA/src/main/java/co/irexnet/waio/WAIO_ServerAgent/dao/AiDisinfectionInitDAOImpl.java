package co.irexnet.waio.WAIO_ServerAgent.dao;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessInitDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AiDisinfectionInitDAOImpl implements IAiDisinfectionProcessInitDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<AiProcessInitDTO> select(int processStep, int disinfectionStep)
    {
        String strQuery = "SELECT * FROM " + getTableByProcessStep(processStep, disinfectionStep);
        return jdbcTemplate.query(strQuery, new BeanPropertyRowMapper<>(AiProcessInitDTO.class));
    }

    @Override
    public AiProcessInitDTO select(String itm, int processStep, int disinfectionStep)
    {
        String strQuery = "SELECT * FROM " + getTableByProcessStep(processStep, disinfectionStep) + " WHERE itm=?";
        try
        {
            return jdbcTemplate.queryForObject(
                    strQuery, new Object[]{itm}, new BeanPropertyRowMapper<>(AiProcessInitDTO.class)
            );
        }
        catch(EmptyResultDataAccessException e)
        {
            return null;
        }
    }

    @Override
    public int updateOperationMode(int operation_mode, int processStep, int disinfectionStep)
    {
        String strQuery = "UPDATE " + getTableByProcessStep(processStep, disinfectionStep) + " SET init_val=? WHERE itm='" + getOperationModeName(disinfectionStep)+"'";
        return jdbcTemplate.update(strQuery, operation_mode);
    }

    @Override
    public int update(String itm, float init_val, int processStep, int disinfectionStep)
    {
        String strQuery = "UPDATE " + getTableByProcessStep(processStep, disinfectionStep) + " SET init_val=? WHERE itm=?";
        return jdbcTemplate.update(strQuery, init_val, itm);
    }
    
    public String getTableByProcessStep(int processStep, int disinfectionStep) {
        String tableNm = "";
        if(processStep == 1 && disinfectionStep == 1) {
            tableNm = "TB_AI_PRE_G2_IND_INIT";
        } else if(processStep == 2 && disinfectionStep == 1) {
            tableNm = "TB_AI_PRE_G2_LIV_INIT";
        } else if(processStep == 2 && disinfectionStep == 2) {
            tableNm = "TB_AI_PERI_G2_LIV_INIT";
        } else if(processStep == 2 && disinfectionStep == 3) {
            tableNm = "TB_AI_POST_G2_LIV_INIT";
        } else if(processStep == 3 && disinfectionStep == 1) {
            tableNm = "TB_AI_PRE_G3_INIT";
        } else if(processStep == 3 && disinfectionStep == 2) {
            tableNm = "TB_AI_PERI_G3_INIT";
        } else if(processStep == 3 && disinfectionStep == 3) {
            tableNm = "TB_AI_POST_G3_INIT";
        }
        return tableNm;
    }
    
    public String getOperationModeName(int disinfectionIndex) {
        StringBuilder sb = new StringBuilder("g_");
        if(disinfectionIndex == 1) {
            sb.append("pre");
        }else if(disinfectionIndex == 2) {
            sb.append("peri");
        }else if(disinfectionIndex == 3){
            sb.append("post");
        }
        sb.append("_operation_mode");
        return sb.toString();
    }
}
