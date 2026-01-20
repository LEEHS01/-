const logger = require('../logger').logger;

// peakSelect
exports.PeakSelectData = (search, search2, search3) => {
  logger.info('PeakSelectData  > ', search, search2, search3);
  const query = `
    SELECT 
      DATE_FORMAT(a.DATE,'%Y-%m-%d %H:%i') DATE, 
      b.PRDCT_PWR, IFNULL(b.PEAK_YN,0) PEAK_YN,
      c.GNRTD_PWR
    FROM
    (
      SELECT CURDATE() + INTERVAL (a.h) HOUR AS DATE
      FROM 
      (
        WITH RECURSIVE cte AS (
        SELECT 0 AS h 
        UNION ALL
        SELECT h+1
        FROM cte
        WHERE h <23)
        SELECT *
        FROM cte
      ) a
    ) a
    LEFT JOIN 
    (
      SELECT CNFRM_TIME, FORMAT (PRDCT_PWR,0) PRDCT_PWR, 
        CASE WHEN NOW() > cnfrm_time THEN '0' ELSE PEAK_YN END PEAK_YN
      FROM TB_PEAK_PWR_PRDCT_RST
      WHERE 
    --    ANLY_TIME = '2023-02-28 01:00:00'
        ANLY_TIME = '${search}'
        OR CNFRM_TIME = DATE_ADD(anly_time, INTERVAL 15 MINUTE)
    ) b ON a.DATE = b.CNFRM_TIME
    LEFT JOIN 
    (
      SELECT CNFRM_TIME, FORMAT (GNRTD_PWR,0) GNRTD_PWR
      FROM TB_PEAK_GNRTD_RST
      WHERE 
    --    CNFRM_TIME >= '2021-10-13 00:00:00'  AND CNFRM_TIME <= '2021-11-28 07:00:00'
        CNFRM_TIME >= '${search2}'  AND CNFRM_TIME <= '${search3}'
    ) c ON a.DATE = c.CNFRM_TIME
    ORDER BY DATE
  `

  return query
}

// selectPeakGoal
exports.peakGoal = () => {
  const query = `
    SELECT nvl(VALUE,0) value
    FROM TB_PTR_CTR_INF
    WHERE tag = '881-355-PEAKGOAL-0001'
  `

  return query
}

// insertPeakGoal
exports.updatePeakGoal = (search) => {
  logger.info('updatePeakGoal  > ', search);
  const query = `
    UPDATE TB_PTR_CTR_INF
    SET value = '${search}'
    WHERE tag = '881-355-PEAKGOAL-0001'
  `

  return query
}

exports.peakFac = (search) => {
  logger.info('peakFac  > ', search);
  const query = `
    SELECT 
      (
        SELECT fac_name as description
        FROM TB_TAGINFO_2 a, TB_FAC b
        WHERE a.fac = b.fac_code 
        AND a.tagname = REPLACE (base.tagname,'PWI','PWQ')
      ) tagname
      ,CASE WHEN(
                SELECT ins_unit
                FROM TB_PEAK_TAG_INF  /* 피크 제어 태그 정보 */
                WHERE ins_tag = tagname) = 'W' 
            THEN VALUE*0.001 
          WHEN(
                SELECT ins_unit
                FROM TB_PEAK_TAG_INF
                WHERE ins_tag = tagname) = 'kW' 
            THEN VALUE 
      END AS 'kWVALUE'
    FROM TB_DATA_RAW_TAG base
    WHERE ts = '${search}' 
    -- WHERE ts = '2024-05-13 23:57:00'
      AND tagname IN(
                  SELECT INS_TAG 
                  FROM TB_PEAK_TAG_INF 
                  -- WHERE INS_TAG NOT IN ('745-617-PWI-4100', '745-617-PWI-4070', '745-617-PWI-4150')
                  WHERE INS_TAG NOT IN ('...')
                )
    ORDER BY kWVALUE+0 DESC
    LIMIT 6
  `

  return query
}

// //alarmCheck
// exports.alarmCheck = (search) => {
//   const query = `
//   SELECT * 
//   FROM TB_EMS_ALARM 
//   where TIME > date_add(NOW(),interval -2 MINUTE)
//   -- where TIME > '2024-03-06 19:00:00'
//     AND FLAG = 0
//     AND TIME < NOW()
//   group by alarm_id;
//   `

//   return query
  
// }

// exports.alarmUpdate = (search) => {
//   const query = `
//   UPDATE  
//   TB_EMS_ALARM
//   SET FLAG = 5
//   WHERE TIME > date_add(NOW(), interval -2 MINUTE)
//     AND FLAG = 0
//     AND TIME < NOW()
//   `

//   return query
  
// }

// //siteAlarmCheck
// exports.siteAlarmCheck = (search) => {
//   const query = `
//   SELECT * 
//   FROM TB_EMS_ALARM 
//   where TIME > date_add(NOW(),interval -2 MINUTE)
//   -- where TIME > '2024-03-06 19:00:00'
//     AND FLAG = 2
//     AND TIME < NOW()
//   group by alarm_id;
//   `

//   return query
  
// }

// exports.siteAlarmUpdate = (search) => {
//   const query = `
//   UPDATE  
//   TB_EMS_ALARM
//   SET FLAG = 6
//   WHERE TIME > date_add(NOW(), interval -2 MINUTE)
//     AND FLAG = 2
//     AND TIME < NOW()
//   `

//   return query
  
// }

exports.nowPeak = () => {
  const query = `
    SELECT VALUE 
    FROM TB_DATA_RAW_TAG
    -- WHERE  tagname IN ( '745-617-PWI-4000','745-617-PWI-4100') -- 수전차단기전력량
    WHERE  tagname IN ('881-355-PWI-7405','881-355-PWI-7445') 
      AND VALUE > 0 
    ORDER BY ts desc LIMIT 1
  `

  return query
}

exports.costPeak = () => {
  const query = `
   SELECT PWR FROM TB_RT_POWER_RST
    ORDER BY DATA_BS_YMNTH DESC, RST_TYP DESC, RGSTR_TIME DESC LIMIT 1;
  `

  return query
}

