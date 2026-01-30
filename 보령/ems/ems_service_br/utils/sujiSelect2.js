const logger = require('../logger').logger;

// sujiCombo
exports.ComboQuery = () => {
  let query = `
    SELECT 
      S_ID AS TNK_GRP_IDX,
      CONCAT(R_ID,'_', RT_ID,'수조')  AS TNK_IDX,
      RT_ID AS VLV_IDX,
      CONCAT(R_ID,'_', RT_ID,'수조')  AS TNK_GRP_NM,
      '' AS PMP_GRP,
      '' AS PMP_GRP_NM,
      RT_FO_STTS AS FO_TAG,
      RT_FC_STTS AS FC_TAG,
      RT_OV_STTS AS POI_TAG,
      RT_WTR_LVL AS LEI_TAG,
      RT_IN_FR AS IN_FLW_TAG,
      RT_OUT_FR AS OUT_FLW_TAG,
      RT_MIN_RQRMN_PR AS DMD_PRI,
      RT_WTR_LVL_LCL AS LWL_LIM,
      RT_WTR_LVL_UCL AS HWL_LIM,
      '' AS MIN_LOAD_LWL,
      '' AS MID_LOAD_LWL,
      '' AS MAX_LOAD_LWL,
      '' AS VLM,
      '' AS LWL,
      '' AS HWL,
      RT_AREA AS BASE_AREA,
      '1' AS USE_YN,
      '' AS RGSTR_TIME,
      '' AS UPDT_TIME
    FROM TB_MST_RESERVOIR_TANK 
    ORDER BY RT_MIN_RQRMN_PR DESC
  `

  return query
}

// baeSuji
exports.basuji = (reqbody) => {
  logger.info('basuji reqbody > ', reqbody);
  let query = `
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') ts,
      tagname, FORMAT (VALUE, 0) VALUE
    FROM TB_DATA_RAW_TAG_HOUR
    WHERE 
      ts LIKE CONCAT('${reqbody.search}','%') 
      AND tagname = '${reqbody.search2}' 
  `

  return query
}

exports.baeSuji_sum = (reqbody) => {
  logger.info('baeSuji_sum reqbody > ', reqbody);
  let query = `
    SELECT R_ID AS TNK_GRP_NM,
    (
      SELECT SUM(VALUE) 
      FROM TB_DATA_RAW_TAG a
        WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
                ) 
          AND tagname IN (
                      SELECT RT_WTR_LVL
                      FROM TB_MST_RESERVOIR_TANK
                      WHERE R_ID = a.R_ID
                      GROUP BY RT_WTR_LVL
                    )
          AND ts like CONCAT('${reqbody.search}','%')
        GROUP BY a.ts	
    ) '수위'
  FROM TB_MST_RESERVOIR_TANK a
  GROUP BY R_ID
  `

  return query
}

exports.baeSuji_sunsi = () => {
  let query = `
    SELECT R_ID AS TNK_GRP_NM,
      (
        SELECT IFNULL(FORMAT(SUM(value), 2),'-') '수위'
        FROM TB_DATA_RAW_TAG a
        WHERE ts = (
                  SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                  FROM TB_DATA_RAW_TAG
                ) 
        AND tagname IN (
                    SELECT RT_WTR_LVL
                    FROM TB_MST_RESERVOIR_TANK
                    WHERE R_ID = a.R_ID
                    GROUP BY RT_WTR_LVL
                  )
        GROUP BY a.ts
      ) 수위
    FROM TB_MST_RESERVOIR_TANK a
    GROUP BY R_ID  
  `

  return query;
}