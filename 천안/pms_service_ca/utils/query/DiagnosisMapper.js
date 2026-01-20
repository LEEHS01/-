const logger = require('../../logger').logger;
let testMode = false;
let dbPrefix = '';

exports.diagPOV = (data) => {
  /*
    사용그리드 : 정밀진단(상단챠트)
    테스트DB: SMART_PMS_CHEONAN
    
    참고: "POV" 버튼이 눌렸을때
          실제 반영할때는 야래 주석  쿼리 사용 -- AND acq_date >= CONCAT(#{search}) AND acq_date <= concat(#{search2})
  */
  logger.info('DiagnosisMapper::diagPOV > ', data);
  let query = `
    SELECT
      t.acq_date, t.pump_id, 
      t.NDE_rms_amp  as calRMS
    FROM ${dbPrefix}TB_AI_DIAG_PUMP t
    WHERE 1=1
  `;

  if (testMode) {
    query += ` AND center_id = '전동1(가)'  /* 가압장 이름, 변수처리 */
      AND pump_id = 'motor_01'   /* 화면의 펌프번호, 변수처리  */
      AND (DATE_FORMAT(acq_date,'%Y-%m-%d') >= CONCAT('2024-05-01') AND DATE_FORMAT(acq_date,'%Y-%m-%d') <= CONCAT('2024-06-03'))
    `;
  } else {
    query += ` AND center_id = '${data.centerId}'  /* 가압장 이름, 변수처리 */
      AND pump_id = '${data.pumpId}'   /* 화면의 펌프번호, 변수처리  */
      AND acq_date >= CONCAT('${data.startDate}') AND acq_date <= concat('${data.endDate}')
      -- AND (DATE_FORMAT(acq_date,'%Y-%m-%d') >= CONCAT('2024-05-01') AND DATE_FORMAT(acq_date,'%Y-%m-%d') <= CONCAT('2024-06-04'))
    `; 
  }

  query += ` ORDER BY t.acq_date ASC `;
  return query;
}

exports.diagPIV = (data) => {
  /*
    사용그리드 : 정밀진단(상단챠트)
    테스트DB: SMART_PMS_CHEONAN
    
    참고: "PIV" 버튼이 눌렸을때
          실제 반영할때는 야래 주석  쿼리 사용 -- AND acq_date >= CONCAT(#{search}) AND acq_date <= concat(#{search2})
  */
  logger.info('DiagnosisMapper::diagPIV > ', data);
  let query = `
    SELECT
      t.acq_date, t.pump_id, 
      t.DE_rms_amp as calRMS   
    FROM ${dbPrefix}TB_AI_DIAG_PUMP t
    WHERE 1=1
  `;

  if (testMode) {
    query += ` AND center_id = '전동1(가)'  /* 가압장 이름, 변수처리 */
      AND pump_id = 'motor_01'   /* 화면의 펌프번호, 변수처리  */
      AND (DATE_FORMAT(acq_date,'%Y-%m-%d') >= CONCAT('2024-05-01') AND DATE_FORMAT(acq_date,'%Y-%m-%d') <= CONCAT('2024-06-03'))
    `;
  } else {
    query += ` AND center_id = '${data.centerId}'  /* 가압장 이름, 변수처리 */
      AND pump_id = '${data.pumpId}'   /* 화면의 펌프번호, 변수처리  */
      AND acq_date >= CONCAT('${data.startDate}') AND acq_date <= concat('${data.endDate}')
    `; 
  }

  query += ` ORDER BY t.acq_date ASC `;

  return query;
}

exports.diagMIV = (data) => {
  /*
    사용그리드 : 정밀진단(상단챠트)
    테스트DB: SMART_PMS_CHEONAN
    
    참고: "MIV" 버튼이 눌렸을때
          실제 반영할때는 야래 주석  쿼리 사용 -- AND acq_date >= CONCAT(#{search}) AND acq_date <= concat(#{search2})
  */
  logger.info('DiagnosisMapper::diagMIV > ', data);
  let query = `
    SELECT
      t.acq_date, t.moter_id,
      t.DE_rms_amp as calRMS  
    FROM ${dbPrefix}TB_AI_DIAG_MOTER t
    WHERE 1=1
  `;

  if (testMode) {
    query += ` AND center_id = '전동1(가)'  /* 가압장 이름, 변수처리 */
      AND moter_id = 'motor_01'   /* 화면의 모터번호, 변수처리  */
      AND (DATE_FORMAT(acq_date,'%Y-%m-%d') >= CONCAT('2024-05-01') AND DATE_FORMAT(acq_date,'%Y-%m-%d') <= CONCAT('2024-06-03'))
    `;
  } else {
    query += ` AND center_id = '${data.centerId}'  /* 가압장 이름, 변수처리 */
      AND moter_id = '${data.motorId}'   /* 화면의 모터번호, 변수처리  */
      AND acq_date >= CONCAT('${data.startDate}') AND acq_date <= concat('${data.endDate}')
    `; 
  }

  query += ` ORDER BY t.acq_date ASC `;

  return query;
}

exports.diagMOV = (data) => {
  /*
    사용그리드 : 정밀진단(상단챠트)
    테스트DB: SMART_PMS_CHEONAN
    
    참고: "MOV" 버튼이 눌렸을때
          실제 반영할때는 야래 주석  쿼리 사용 -- AND acq_date >= CONCAT(#{search}) AND acq_date <= concat(#{search2})
  */
  logger.info('DiagnosisMapper::diagMOV > ', data);
  let query = `
    SELECT
      t.acq_date, t.moter_id,
      t.NDE_rms_amp as calRMS  
    FROM ${dbPrefix}TB_AI_DIAG_MOTER t
    WHERE 1=1
  `;

  if (testMode) {
    query += ` AND center_id = '전동1(가)'  /* 가압장 이름, 변수처리 */
      AND moter_id = 'motor_01'   /* 화면의 모터번호, 변수처리  */
      AND (DATE_FORMAT(acq_date,'%Y-%m-%d') >= CONCAT('2024-05-01') AND DATE_FORMAT(acq_date,'%Y-%m-%d') <= CONCAT('2024-06-03'))
    `;
  } else {
    query += ` AND center_id = '${data.centerId}'  /* 가압장 이름, 변수처리 */
      AND moter_id = '${data.motorId}'   /* 화면의 모터번호, 변수처리  */
      AND acq_date >= CONCAT('${data.startDate}') AND acq_date <= concat('${data.endDate}')
    `; 
  }

  query += ` ORDER BY t.acq_date ASC `;

  return query;
}

exports.diagTimeWave = (data) => {
  /*
    사용그리드 : 정밀진단(하단 왼쪽 챠트, TimeWave)
    테스트DB: SMART_PMS_CHEONAN
    참고: 상단 RMS포인트를 눌렀을때
  */

  logger.info('DiagnosisMapper::diagTimeWave > ', data);
  let query = `
    SELECT
      t.acq_ti, 
      t.ch_id,
      t.dt_ary  
    FROM ${dbPrefix}TB_PM t
    WHERE 1=1
  `;

  if (testMode) {
    query += ` AND ipc_loc = '전동1가압장'  /* 가압장 이름, 변수처리 */
      AND ch_id = '1Ch_P'   /* 화면의 펌프번호, 변수처리  */
      AND CONCAT(DATE_FORMAT(acq_ti,'%Y-%m-%d %H:%i:%S'),'.0000') = CONCAT('2024-05-28 11:04:12.0000')
    `;
  } else {
    query += ` AND ipc_loc = '${data.centerId}'  /* 가압장 이름, 변수처리 */
      AND ch_id = '${data.channelId}'   /* 화면의 펌프번호, 변수처리  */
      AND acq_ti = CONCAT('${data.startDate}')
      
    `; 
  }

  query += ` ORDER BY t.acq_ti ASC
    LIMIT 1 
  `;

  return query;
}

exports.diagSpecTrum = (data) => {
  /*
    사용그리드 : 정밀진단(하단 왼쪽 챠트, TimeWave)
    테스트DB: SMART_PMS_CHEONAN
    참고: 상단 RMS포인트를 눌렀을때
  */

  logger.info('DiagnosisMapper::diagSpecTrum > ', data);
  let query = 
  `
    SELECT dt_ary 
    FROM TB_PM 
  `;
  if (testMode) {
    query += `where eq_id=1 
    AND pm_id='1PM' 
    AND ch_id='1Ch_P' 
    AND acq_ti='2024-05-28 11:04:12.0000'
    `;
  } else {
    query += ` where 1 = 1
    AND ipc_loc = '${data.centerId}' 
    AND pm_id='${data.pmId}' 
    AND ch_id='${data.channelId}' 
    AND acq_ti = CONCAT('${data.startDate}')
    
    `; 
  }
  return query;
}

exports.diagDataSave = ({ ipc_loc, pm_id, ch_id, data }) => {
  let query = `
    INSERT INTO TB_PM_INFO (ipc_loc, pm_id, ch_id, 
                            pole, d_hz, bpfi_hz, bpfo_hz, ball_spin_hz, retainer_hz, pump_impller, power_hz, rpm)
    VALUES ('${ipc_loc}', '${pm_id}', '${ch_id}', 
            ${data.pole}, ${data.d_hz}, ${data.bpfi_hz}, ${data.bpfo_hz}, ${data.ball_spin_hz}, ${data.retainer_hz}, ${data.pump_impller}, ${data.power_hz}, ${data.rpm})
    ON DUPLICATE KEY UPDATE 
      pole = VALUES(pole),
      d_hz = VALUES(d_hz),
      bpfi_hz = VALUES(bpfi_hz),
      bpfo_hz = VALUES(bpfo_hz),
      ball_spin_hz = VALUES(ball_spin_hz),
      retainer_hz = VALUES(retainer_hz),
      pump_impller = VALUES(pump_impller),
      power_hz = VALUES(power_hz),
      rpm = VALUES(rpm)
  `;

  
  return query;
}


exports.getDiagData = ({ ipc_loc, pm_id, ch_id}) => {

  let query = `
    SELECT *
    FROM TB_PM_INFO
    WHERE ipc_loc = '${ipc_loc}'  -- ipc_loc 값
      AND pm_id = '${pm_id}'            -- pm_id 값
      AND ch_id = '${ch_id}';   
  `;

  
  return query;
}


