const logger = require('../logger').logger;

exports.selectCTR_PRF_PMPMST_INF = () => {
  /*
  설정>송수펌프 운영("펌프 우선 순위(현재 값)", selectCTR_PRF_PMPMST_INF)
  */
  let query = `
    SELECT SP_ID AS PMP_IDX, 
      CONCAT(S_ID,SP_ID) 'PMP', 
      SP_ANLY_RNK AS ANLY_RNK, 
      SP_USER_RNK AS USER_RNK,
      SP_PMS_USE_YN AS PMS_USE_YN,
      SP_AVLBL AS USE_YN,
      SP_PRRTY AS PRRT_RNK
    FROM TB_MST_SUPPLY_PUMP
  `;

  return query
}

exports.updateSetCTR_PRF_PMPMST_INF = (reqbody) => {
  /*
  설정>송수펌프 운영("펌프 우선 순위(우선순위 값 적용)", updateSetCTR_PRF_PMPMST_INF)
  */
  logger.info('updateSetCTR_PRF_PMPMST_INF reqbody > ', reqbody);
  let query = `
    UPDATE TB_MST_SUPPLY_PUMP 
      SET SP_PRRTY = '${reqbody.PRRT_RNK}',
          SP_AVLBL = '${reqbody.USE_YN}',
          ${reqbody.flag === "1" ? "SP_USER_RNK" : "SP_ANLY_RNK"} = '${reqbody.PRRT_RNK}'
    WHERE SP_ID = '${reqbody.PMP_IDX}'
  `;

  return query
}

exports.updateSetCTR_PRF_PMPMST_INF2 = (reqbody) => {
  /*
  설정>송수펌프 운영("펌프 우선 순위(운영자/우선순위 모드 적용)", updateSetCTR_PRF_PMPMST_INF2)
  */
  logger.info('updateSetCTR_PRF_PMPMST_INF2 reqbody > ', reqbody);
  let query = `
    UPDATE TB_PTR_CTR_INF 
      SET value = '${reqbody.flag}'
    -- WHERE tag = '745-617-EMS-1905'	
    WHERE tag = 'XXX-XXX-EMS-XXXX'
  `;

  return query
}

exports.mergePTR_STRTG_INF = (reqbody) => {
  /*
  설정>송수펌프 운영("펌프 운영 관리(현재 계절 적용)", mergePTR_STRTG_INF)
  */
  logger.info('mergePTR_STRTG_INF reqbody > ', reqbody);
  let query = `
      INSERT INTO TB_PTR_STRTG_INF(TAG, VALUE, RGSTR_TIME, UPDT_TIME, REAL_TIME_YN,userid,season)
        VALUE('${reqbody.NO}', '${reqbody.VALUE}, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), '1','${reqbody.USERID}','${reqbody.SEASON}'
      )
      ON DUPLICATE KEY
      UPDATE
        TAG = '${reqbody.NO}', 
        VALUE = '${reqbody.VALUE}, 
        UPDT_TIME = CURRENT_TIMESTAMP(),
        REAL_TIME_YN = '1',
        userid='${reqbody.USERID}',
        season='${reqbody.SEASON}'
  `;

  return query
}

exports.mergeOPER_INF = (reqbody) => {
  /*
  설정>송수펌프 운영("펌프 운영 관리(적용)", mergeOPER_INF)
  */
  logger.info('mergeOPER_INF reqbody > ', reqbody);
  let query = `
  INSERT INTO TB_OPER_INF(
    userid, season, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23
  ) VALUES (
    '${reqbody.userid}',
    '${reqbody.season}',
    '${reqbody.values.c0}',
    '${reqbody.values.c1}',
    '${reqbody.values.c2}',
    '${reqbody.values.c3}',
    '${reqbody.values.c4}',
    '${reqbody.values.c5}',
    '${reqbody.values.c6}',
    '${reqbody.values.c7}',
    '${reqbody.values.c8}',
    '${reqbody.values.c9}',
    '${reqbody.values.c10}',
    '${reqbody.values.c11}',
    '${reqbody.values.c12}',
    '${reqbody.values.c13}',
    '${reqbody.values.c14}',
    '${reqbody.values.c15}',
    '${reqbody.values.c16}',
    '${reqbody.values.c17}',
    '${reqbody.values.c18}',
    '${reqbody.values.c19}',
    '${reqbody.values.c20}',
    '${reqbody.values.c21}',
    '${reqbody.values.c22}',
    '${reqbody.values.c23}'
  )
  ON DUPLICATE KEY
  UPDATE
    userid = '${reqbody.userid}',
    season = '${reqbody.season}',
    c0 = '${reqbody.values.c0}',
    c1 = '${reqbody.values.c1}',
    c2 = '${reqbody.values.c2}',
    c3 = '${reqbody.values.c3}',
    c4 = '${reqbody.values.c4}',
    c5 = '${reqbody.values.c5}',
    c6 = '${reqbody.values.c6}',
    c7 = '${reqbody.values.c7}',
    c8 = '${reqbody.values.c8}',
    c9 = '${reqbody.values.c9}',
    c10 = '${reqbody.values.c10}',
    c11 = '${reqbody.values.c11}',
    c12 = '${reqbody.values.c12}',
    c13 = '${reqbody.values.c13}',
    c14 = '${reqbody.values.c14}',
    c15 = '${reqbody.values.c15}',
    c16 = '${reqbody.values.c16}',
    c17 = '${reqbody.values.c17}',
    c18 = '${reqbody.values.c18}',
    c19 = '${reqbody.values.c19}',
    c20 = '${reqbody.values.c20}',
    c21 = '${reqbody.values.c21}',
    c22 = '${reqbody.values.c22}',
    c23 = '${reqbody.values.c23}'
  `;

  return query
}

exports.selectRT_RATE_INF = (reqbody) => {
  /*
  설정>송수펌프 운영("펌프 운영 관리(시간대)", selectRT_RATE_INF)
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

// selectSuji
exports.selectOPER_INF = (reqbody) => {
  /*
  설정>송수펌프 운영("펌프 운영 관리(관압모드)", selectOPER_INF)
  */
  logger.info('selectOPER_INF reqbody > ', reqbody);
  let query = `
    SELECT * 
    FROM TB_OPER_INF 
    WHERE season='${reqbody.season}'
  `;

  return query
}