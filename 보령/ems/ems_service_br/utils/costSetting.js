const logger = require('../logger').logger;

exports.selectRtInfo = () => {
  /*
  설정>전력 요금제("요금제", selectRtInfo)
  */
  let query = `
    SELECT
      RATE_IDX,
      LARGE_CTGRY,
      MIDDLE_CTGRY,
      SMALL_CTGRY
    FROM TB_RT_MSTR_INF
    WHERE USE_YN = '1'  
  `;

  return query
}

exports.selectRT_RATE_INF = (reqbody) => {
  /*
  설정>전력 요금제("계절별(시간대)", selectRT_RATE_INF)
  */
  logger.info('selectRT_RATE_INF reqbody > ', reqbody);
  let query = `
    SELECT *
    FROM TB_RT_RATE_INF
    WHERE 
      RATE_IDX = '${reqbody.rate}' 
      AND SSN = '${reqbody.season}'
    GROUP BY STN_TM
  `;

  return query
}

exports.update_L_RT_RATE_INF = (reqbody) => {
  /*
  설정>전력 요금제("요금제 적용(경부하)", updateRT_RATE_INF)
  */
  logger.info('update_L_RT_RATE_INF reqbody > ', reqbody);
  let query = `
    UPDATE TB_RT_RATE_INF
      SET BASE_RATE='${reqbody.base_rate}',
        ENVRNMNT_RATE='${reqbody.env_rate}',
        FUELCOST_RATE='${reqbody.fuel_rate}',
        ELCTR_RATE='${reqbody.rate_L}'
    WHERE RATE_IDX='${reqbody.rate}' 
      AND SSN = '${reqbody.season}' 
      AND TIMEZONE = 'L'
  `;

  return query
}

exports.update_M_RT_RATE_INF = (reqbody) => {
  /*
  설정>전력 요금제("요금제 적용(중부하)", updateRT_RATE_INF)
  */
  logger.info('update_M_RT_RATE_INF reqbody > ', reqbody);
  let query = `
    UPDATE TB_RT_RATE_INF
      SET BASE_RATE='${reqbody.base_rate}',
        ENVRNMNT_RATE='${reqbody.env_rate}',
        FUELCOST_RATE='${reqbody.fuel_rate}',
        ELCTR_RATE='${reqbody.rate_M}'
    WHERE RATE_IDX='${reqbody.rate}' 
      AND SSN = '${reqbody.season}' 
      AND TIMEZONE = 'M'
  `;

  return query
}

exports.update_H_RT_RATE_INF = (reqbody) => {
  /*
  설정>전력 요금제("요금제 적용(최대부하)", updateRT_RATE_INF)
  */
  logger.info('update_H_RT_RATE_INF reqbody > ', reqbody);
  let query = `
    UPDATE TB_RT_RATE_INF
      SET BASE_RATE='${reqbody.base_rate}',
        ENVRNMNT_RATE='${reqbody.env_rate}',
        FUELCOST_RATE='${reqbody.fuel_rate}',
        ELCTR_RATE='${reqbody.rate_H}'
    WHERE RATE_IDX='${reqbody.rate}' 
      AND SSN = '${reqbody.season}' 
      AND TIMEZONE = 'H'
  `;

  return query
}

exports.update_time_RT_RATE_INF = (reqbody) => {
  /*
  설정>전력 요금제("요금제 적용(시간별 부하)", updateRT_RATE_INF)
  */
  logger.info('update_time_RT_RATE_INF reqbody > ', reqbody);
  let query = `
    UPDATE TB_RT_RATE_INF
      SET TIMEZONE='${reqbody.time.timezone}'
    WHERE SSN='${reqbody.season}' 
      AND RATE_IDX IN ('7','8','9') 
      AND STN_TM='${reqbody.time.stn_tm}'
  `;

  return query
}