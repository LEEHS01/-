package co.irexnet.waio.WAIO_ServerAgent.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import co.irexnet.waio.WAIO_ServerAgent.dto.AlarmNotifyDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceAlarmControlHistoryDTO;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;

@Repository
public class AlarmNotifyDAOImpl implements IAlarmNotifyDAO
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    
    @Override
    public List<InterfaceAlarmControlHistoryDTO> selectBySeqAndTag (int almSeq, String tagSn) {
    	String strQuery = "SELECT * FROM TB_ALM_CTR_HIS WHERE ALM_SEQ = ? AND TAG_SN = ? ";
    	return jdbcTemplate.query(strQuery, new Object[] {almSeq, tagSn}, new BeanPropertyRowMapper<>(InterfaceAlarmControlHistoryDTO.class));
    }
    
    @Override
    public int insert(AlarmNotifyDTO dto)
    {
    	String strQuery = "INSERT INTO TB_ALM_NTF (ALM_ID, ALM_NTF_TI, HOST, VAL, ACK_STT) VALUES (?, ?, ?, ?, 0)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement ps = connection.prepareStatement(strQuery, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, dto.getAlm_id());
                ps.setTimestamp(2, new Timestamp(dto.getAlm_ntf_ti().getTime()));
                ps.setString(3, dto.getHost());
                ps.setString(4, dto.getVal());
                return ps;
            }
        }, keyHolder);
        return keyHolder.getKey().intValue();
    }

    @Override
    public List<AlarmNotifyDTO> select()
    {
        // 알람 네비게이터 삭제
//        String strQuery = "select " + 
//                "seq, alm_id, alm_ntf_ti, host, val, IF(ack_stt, 'true', 'false') as ack_stt " +
//                "from TB_ALM_NTF order by seq desc limit 1000";
        String strQuery = "select " +
                "seq, alm_id, alm_ntf_ti, host, val " +
                "from TB_ALM_NTF order by seq desc limit 1000";
        return jdbcTemplate.query(strQuery, new BeanPropertyRowMapper<>(AlarmNotifyDTO.class));
    }
    
    @Override
    public List<AlarmNotifyDTO> select(Date start_time)
    {
        String strQuery = "select seq, alm_id, alm_ntf_ti, host, val " +
                "from TB_ALM_NTF where alm_ntf_ti >= ? and ack_stt = 0 " +
                "order by seq ASC limit 10"; 
        return jdbcTemplate.query(strQuery, new Object[]{start_time}, new BeanPropertyRowMapper<>(AlarmNotifyDTO.class));
    }

    @Override
    public List<AlarmNotifyDTO> select(boolean ackState)
    {
        // 알람 네비게이터 삭제
//        String strQuery = "select " +
//                "seq, alm_id, alm_ntf_ti, host, val, IF(ack_stt, 'true', 'false') as ack_stt " +
//                "from TB_ALM_NTF where ack_stt=? " +
//                "order by seq desc limit 1000";
        String strQuery = "select " +
                "seq, alm_id, alm_ntf_ti, host, val " +
                "from TB_ALM_NTF where ack_stt=? " +
                "order by seq desc limit 1000";
        return jdbcTemplate.query(strQuery, new Object[]{ackState}, new BeanPropertyRowMapper<>(AlarmNotifyDTO.class));
    }

    @Override
    public AlarmNotifyDTO select(int alm_id, Date alm_ntf_ti, String host)
    {
        // 알람 네비게이터 삭제
//        String strQuery = "select " +
//                "seq, alm_id, alm_ntf_ti, host, val, IF(ack_stt, 'true', 'false') as ack_stt " +
//                "from TB_ALM_NTF where alm_id=? and host=? and alm_ntf_ti>?" +
//                "order by seq desc limit 1";
        String strQuery = "select " +
                "seq, alm_id, alm_ntf_ti, host, val " +
                "from TB_ALM_NTF where alm_id=? and host=? and alm_ntf_ti>?" +
                "order by seq desc limit 1";
        try
        {
            return jdbcTemplate.queryForObject(
                    strQuery,
                    new Object[]{alm_id, host, alm_ntf_ti},
                    new BeanPropertyRowMapper<>(AlarmNotifyDTO.class));
        }
        catch(EmptyResultDataAccessException e)
        {
            return null;
        }
    }

    @Override
    public List<AlarmNotifyDTO> select(Date start_time, Date end_time)
    {
// 알람 네비게이터 삭제
//        String strQuery = "select " +
//                "seq, alm_id, alm_ntf_ti, host, val, IF(ack_stt, 'true', 'false') as ack_stt " +
//                "from TB_ALM_NTF where alm_ntf_ti >= ? and alm_ntf_ti < ?" +
//                "order by seq desc";
        String strQuery = "select " +
                "seq, alm_id, alm_ntf_ti, host, val " +
                "from TB_ALM_NTF where alm_ntf_ti >= ? and alm_ntf_ti < ?" +
                "order by seq desc";
        return jdbcTemplate.query(strQuery, new Object[]{start_time, end_time}, new BeanPropertyRowMapper<>(AlarmNotifyDTO.class));
    }

    @Override
    public int updateAckState(int alarmNotifyIndex, boolean ackState)
    {
        String strQuery = "update alarm_notify set ack_stt=? where seq=?";
        return jdbcTemplate.update(strQuery, ackState, alarmNotifyIndex);
    }
    
    @Override
    public void insertAlarmControlHistory(InterfaceAlarmControlHistoryDTO dto) {
        String strQuery = "INSERT INTO TB_ALM_CTR_HIS "+
                "( USR_ID, USR_NM, CTR_TI, CTR_YN, ALM_SEQ, UPD_TI, TAG_SN) VALUES " +
                "( ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(
                strQuery,
                dto.getUsrId(), dto.getUsrNm(), dto.getCtrTi(), dto.getCtrYn(), dto.getAlmSeq(), dto.getUpdTi(), dto.getTagSn()
        );
    }

//    @Override
//    public List<InterfaceAlarmControlHistoryDTO> selectAlarmControlHistory(InterfaceAlarmControlHistoryDTO dto) { 
//        String strQuery = "SELECT SEQ, A.ALM_SEQ, ALM_ID, ALM_TY, ALM_NTF_TI, DP_NM, USR_ID, USR_NM, CTR_TI, CTR_YN, A.TAG_SN, UPD_TI,"
//        +" PROCESS_STEP, DISINFECTION_INDEX, "
//        +" ( CASE WHEN PROCESS = 1 THEN 'B' WHEN PROCESS = 2 THEN 'C' WHEN PROCESS = 3 THEN 'D'"
//        +     " WHEN PROCESS = 4 THEN 'E' WHEN PROCESS = 5 THEN 'F' WHEN PROCESS = 7 THEN 'G'"
//	    +     " END ) AS PROCESS"
//        +" FROM TB_ALM_CTR_HIS A INNER JOIN ( "
//        +" SELECT A.ALM_ID, A.DP_NM, A.ALM_TY, B.ALM_NTF_TI, B.SEQ AS ALM_SEQ "
//        +", SUBSTRING(A.ALM_ID, 3, 1) AS PROCESS, SUBSTRING(A.ALM_ID, 4, 1) AS PROCESS_STEP , SUBSTRING(A.ALM_ID, 5, 1) AS DISINFECTION_INDEX "
//        +" FROM TB_ALM_INFO A INNER JOIN TB_ALM_NTF B ON A.ALM_ID = B.ALM_ID ) B ON A.ALM_SEQ = B.ALM_SEQ "
//        +" WHERE CTR_TI >= ? and CTR_TI < ?"
//        + "GROUP BY CTR_TI, ALM_SEQ ORDER BY SEQ DESC";
//        return jdbcTemplate.query(strQuery, new Object[]{dto.getStart_time(), dto.getEnd_time()}, new BeanPropertyRowMapper<>(InterfaceAlarmControlHistoryDTO.class));
//    }

    @Override
    public List<InterfaceAlarmControlHistoryDTO> selectAlarmControlHistory(InterfaceAlarmControlHistoryDTO dto) { 
    	Calendar updTiStartTime = Calendar.getInstance();
    	updTiStartTime.setTime(dto.getStart_time());
    	updTiStartTime.add(Calendar.HOUR, -1);
    	
        String strQuery = 
//        		"WITH ctr_tables AS ( " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_B1_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_B2_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_B_PUMP_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_C1_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_C2_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_D1_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_D2_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_E1_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_E2_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_F1_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_F2_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_PRE_G1_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_PRE_G2_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_PERI_G2_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		"    UNION ALL " +
//        		"    SELECT TAG_SN, UPD_TI, TAG_VAL, TAG_CMP_VAL " +
//        		"    FROM TB_AI_POST_G2_CTR " +
//        		"    WHERE UPD_TI BETWEEN ? AND ? " +
//        		") " +
        		"SELECT " +
        		"    SEQ, " +
        		"    A.ALM_SEQ, " +
        		"    ALM_ID, " +
        		"    ALM_TY, " +
        		"    ALM_NTF_TI, " +
        		"    DP_NM, " +
        		"    USR_ID, " +
        		"    USR_NM, " +
        		"    CTR_TI, " +
        		"    CTR_YN, " +
        		"    A.TAG_SN, " +
        		"    A.UPD_TI, " +
        		"    PROCESS_STEP, " +
        		"    DISINFECTION_INDEX, " +
//        		"    IF(COUNT(ctr_tables.TAG_SN) >= 2, '-', (SELECT DP FROM TB_TAG_MNG WHERE TAG_SN = ctr_tables.TAG_SN AND TAG_TY=4)) AS DP, " +
//        		"    IF(COUNT(ctr_tables.TAG_VAL) >= 2, '-', ctr_tables.TAG_VAL) AS TAG_VAL, " +
//        		"    IF(COUNT(ctr_tables.TAG_CMP_VAL) >= 2, '-', ctr_tables.TAG_CMP_VAL) AS TAG_CMP_VAL, " +
        		"    ( CASE " +
        		"        WHEN PROCESS = 1 THEN 'B' " +
        		"        WHEN PROCESS = 2 THEN 'C' " +
        		"        WHEN PROCESS = 3 THEN 'D' " +
        		"        WHEN PROCESS = 4 THEN 'E' " +
        		"        WHEN PROCESS = 5 THEN 'F' " +
        		"        WHEN PROCESS = 7 THEN 'G' " +
        		"    END ) AS PROCESS " +
        		"FROM " +
        		"    TB_ALM_CTR_HIS A " +
        		"INNER JOIN ( " +
        		"    SELECT " +
        		"        A.ALM_ID, " +
        		"        A.DP_NM, " +
        		"        A.ALM_TY, " +
        		"        B.ALM_NTF_TI, " +
        		"        B.SEQ AS ALM_SEQ, " +
        		"        SUBSTRING(A.ALM_ID, 3, 1) AS PROCESS, " +
        		"        SUBSTRING(A.ALM_ID, 4, 1) AS PROCESS_STEP, " +
        		"        SUBSTRING(A.ALM_ID, 5, 1) AS DISINFECTION_INDEX " +
        		"    FROM " +
        		"        TB_ALM_INFO A " +
        		"    INNER JOIN TB_ALM_NTF B ON " +
        		"        A.ALM_ID = B.ALM_ID " +
        		") B ON " +
        		"    A.ALM_SEQ = B.ALM_SEQ " +
//        		"INNER JOIN " +
//        		"    ctr_tables ON A.UPD_TI = ctr_tables.UPD_TI " +
//        		"    AND A.TAG_SN = ctr_tables.TAG_SN " +
        		"WHERE CTR_TI >= ? and CTR_TI < ?" +
        		"GROUP BY " +
        		"    CTR_TI, " +
        		"    ALM_SEQ " +
        		"ORDER BY " +
        		"    SEQ DESC;";
        return jdbcTemplate.query(strQuery, new Object[]{
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
//        		updTiStartTime, dto.getEnd_time(),
        		dto.getStart_time(), dto.getEnd_time()
        		}, new BeanPropertyRowMapper<>(InterfaceAlarmControlHistoryDTO.class));
    }
    
    @Override
    public List<InterfaceAlarmControlHistoryDTO> selectTagInfoList(InterfaceAlarmControlHistoryDTO dto) { 
        String strQuery = "SELECT CTR.UPD_TI, CTR.TAG_SN, MNG.DP, CTR.TAG_VAL, CTR.TAG_CMP_VAL"
        		+ " FROM " + getTableByProcessStep(dto) + "_CTR CTR"
        		+ " INNER JOIN TB_TAG_MNG MNG"
        		+ " ON CTR.TAG_SN = MNG.TAG_SN"
        		+ " AND MNG.TAG_TY = 4"
        		+ " WHERE CTR.UPD_TI = ?";
        return jdbcTemplate.query(strQuery, new Object[]{dto.getUpdTi()}, new BeanPropertyRowMapper<>(InterfaceAlarmControlHistoryDTO.class));
    }
    
    @Override
    public List<InterfaceAlarmControlHistoryDTO> selectAlarmControlHistoryDetail(InterfaceAlarmControlHistoryDTO dto) {
        String strQuery = "SELECT A.SEQ AS HISTORY_SEQ, A.USR_ID, A.USR_NM, A.CTR_TI, B.ALM_SEQ, A.UPD_TI, ALM_ID, DP_NM, ALM_TY,"
            + "C.RNTI, C.TAG_SN, C.TAG_VAL, C.TAG_CMP_VAL, "
            + "(SELECT DP FROM TB_TAG_MNG WHERE TAG_SN = C.TAG_SN AND TAG_TY = 4 AND AI_CD = '"+ dto.getProcess() + "' AND PROC_CD = '" + dto.getProcess() + ( "0".equals(dto.getProcessStep()) ? "_PUMP" : dto.getProcessStep() ) + "') AS DP "
            + " FROM TB_ALM_CTR_HIS A INNER JOIN ( "
            + " SELECT A.ALM_ID, A.DP_NM, A.ALM_TY, B.ALM_NTF_TI, B.SEQ AS ALM_SEQ "
            + " FROM TB_ALM_INFO A INNER JOIN TB_ALM_NTF B ON A.ALM_ID = B.ALM_ID ) B "
            + " ON A.ALM_SEQ = B.ALM_SEQ INNER JOIN " + getTableByProcessStep(dto) + "_CTR C  "
            + " ON A.UPD_TI = C.UPD_TI AND A.TAG_SN = C.TAG_SN "
            + " WHERE CTR_TI = ? AND A.ALM_SEQ = ?";
        return jdbcTemplate.query(strQuery, new Object[]{dto.getCtrTi(), dto.getAlmSeq()}, new BeanPropertyRowMapper<>(InterfaceAlarmControlHistoryDTO.class));
    }

    @Override
    public InterfaceAlarmControlHistoryDTO getAlarmExceeded(InterfaceAlarmControlHistoryDTO dto) {
        String strQuery = "SELECT C.ALM_ID, C.DP_NM, C.URL, A.RNTI, C.ALM_TY "
        + " FROM " + getTableByProcessStep(dto) + "_CTR A " 
        + " INNER JOIN " + getTableByProcessStep(dto) +  "_ALM B " 
        + " ON A.RNTI = B.ALM_TI " 
        + " INNER JOIN TB_ALM_INFO C "
        + " ON B.ALM_ID = C.ALM_ID "
        + " WHERE ALM_TY = ? AND A.RNTI = ? AND A.UPD_TI = ? AND A.TAG_SN = ? AND A.KFK_FLG = 0";
        try {
            return jdbcTemplate.queryForObject(strQuery, new Object[]{dto.getAlmTy(), dto.getAlm_ntf_ti(), dto.getUpdTi(), dto.getTagSn()}, new BeanPropertyRowMapper<>(InterfaceAlarmControlHistoryDTO.class));
        } catch(EmptyResultDataAccessException e) {
            return null;
        }
    }
    
    // 5분전 데이터 조회
    public List<InterfaceAlarmControlHistoryDTO> getBeforeAlarmNotify(InterfaceAlarmControlHistoryDTO dto) {
        StringBuffer strQuery = new StringBuffer();
        strQuery.append("SELECT SEQ, ALM_ID, ALM_NTF_TI, HOST, VAL FROM TB_ALM_NTF ")
                .append("WHERE ALM_ID = ? AND TIMESTAMPDIFF(MINUTE, ALM_NTF_TI, ?) <= 5 ");
        try {
            return jdbcTemplate.query(strQuery.toString(), new Object[]{dto.getAlm_id(), dto.getStart_time()}, new BeanPropertyRowMapper<>(InterfaceAlarmControlHistoryDTO.class));
        } catch (DataAccessException e) {
            strQuery.append("SELECT NULL PROCESS, ? AS UPD_TI FROM DUAL");
            return jdbcTemplate.query(strQuery.toString(), new Object[]{dto.getStart_time()}, new BeanPropertyRowMapper<>(InterfaceAlarmControlHistoryDTO.class));
        }

        
    }

    public String getTableByProcessStep(InterfaceAlarmControlHistoryDTO dto) {
        StringBuffer tableNm = new StringBuffer();
        tableNm.append("TB_AI_");

        if(CommonValue.PROCESS_DISINFECTION.equals(dto.getProcess())) { // 소독
            tableNm.append(dto.getDisinfectionIndex() == CommonValue.DISINFECTION_PRE_STEP ? "PRE_" : 
                dto.getDisinfectionIndex() == CommonValue.DISINFECTION_PERI_STEP ? "PERI_" : "POST_");
        }
        tableNm.append(dto.getProcess()).append("0".equals(dto.getProcessStep()) ? "_PUMP" : dto.getProcessStep());
        return tableNm.toString();
    }

}
