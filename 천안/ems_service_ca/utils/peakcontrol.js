// selectPeackControl
exports.selectPeakControl = () => {
  let query = `
    SELECT *
    FROM 
    (
      SELECT SUM(VALUE) '펌프순시전력'
      FROM TB_DATA_RAW_TAG
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              )
      AND tagname IN (
                    '881-355-PWI-4101'
                  ,'881-355-PWI-4102'
                  ,'881-355-PWI-4103'
                )
    )a,
    (
      SELECT SUM(VALUE) '총순시전력'
      FROM TB_DATA_RAW_TAG
      WHERE 
        ts = (
            SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
            FROM TB_DATA_RAW_TAG
            ) 
      AND tagname IN (
                  '881-355-PWI-7425'
                  ,'881-355-PWI-7465'
                )
    )b,
    (
      SELECT PWR '요금적용전력'
      FROM TB_RT_POWER_RST
      ORDER BY ANLY_DATE DESC
      LIMIT 1
    )c,
    (
      SELECT VALUE '목표피크전력'
      FROM TB_PTR_CTR_INF
    --	WHERE tag = '745-617-EMS-4600'
      WHERE tag = '881-355-PEAKGOAL-0001'
    )d
  `

  return query
}

// exports.selectPeakChart = (search, search2 ,search3) => {
  
//   let query = `
//   SELECT DATE_FORMAT(a.DATE, '%Y-%m-%d %H:%i') AS DATE, b.PRDCT_PWR, IFNULL(b.PEAK_YN, 0) AS PEAK_YN, c.GNRTD_PWR 
//   FROM (
//     SELECT CURDATE() + INTERVAL (a.h) HOUR AS DATE
//     FROM (
//       WITH RECURSIVE cte AS (
//         SELECT 0 AS h UNION ALL
//         SELECT h + 1 FROM cte WHERE h < 23
//       )
//       SELECT * FROM cte
//     ) a
//   ) a 
//   LEFT JOIN (
//     SELECT CNFRM_TIME, FORMAT(PRDCT_PWR, 0) AS PRDCT_PWR, CASE WHEN NOW() > cnfrm_time THEN '0' ELSE PEAK_YN END AS PEAK_YN
//     FROM ems_service.PEAK_PWR_PRDCT_RST
//     WHERE ANLY_TIME = '${search}' OR CNFRM_TIME = DATE_ADD(anly_time, INTERVAL 15 MINUTE)
//   ) b ON a.DATE = b.CNFRM_TIME
//   LEFT JOIN (
//     SELECT CNFRM_TIME, FORMAT(GNRTD_PWR, 0) AS GNRTD_PWR 
//     FROM ems_service.PEAK_GNRTD_RST 
//     WHERE CNFRM_TIME >= ${search2} AND CNFRM_TIME <= ${search3}
//   ) c ON a.DATE = c.CNFRM_TIME
//   ORDER BY DATE`;

//   return query
// }

exports.pumpSelect = () => {
  let query = `
    SELECT 
      OPT_IDX, DATE_FORMAT(ANLY_TIME,'%Y-%m-%d %H:%i') ANLY_TIME, 
      DATE_FORMAT(PRDCT_TIME,'%Y-%m-%d %H:%i') PRDCT_TIME,
      PRDCT_T_DIFF,
      PMP_GRP,
      PRDCT_MEAN,
      PRDCT_STD, ROUND(TUBE_PRSR_PRDCT,2) TUBE_PRSR_PRDCT, ROUND(PWR_PRDCT,2) PWR_PRDCT,
      RGSTR_TIME,
      DC_NMB,
      FLAG
    FROM TB_CTR_OPT_RST2	/* 최적 펌프제어 지역결과 */
    WHERE ANLY_TIME = 
      (
        SELECT MAX(anly_time)
        FROM TB_CTR_OPT_RST2
        WHERE anly_time >= DATE_ADD(NOW(), INTERVAL -30 MINUTE)
      --  WHERE anly_time >= DATE_ADD('2023-02-28 00:00:00', INTERVAL -30 MINUTE)
      )
    ORDER BY PRDCT_T_DIFF,PMP_GRP,PRDCT_TIME
  `

  return query
}

exports.pumpSelect2 = () => {
  let query = `
    SELECT 
      A.OPT_IDX, DATE_FORMAT(A.ANLY_TIME,'%Y-%m-%d %H:%i') ANLY_TIME
      ,DATE_FORMAT(A.PRDCT_TIME,'%Y-%m-%d %H:%i') PRDCT_TIME,
      A.PRDCT_T_DIFF,
      A.PMP_GRP,
      A.PRDCT_MEAN,
      A.PRDCT_STD, ROUND(A.TUBE_PRSR_PRDCT,2) TUBE_PRSR_PRDCT,
      ROUND(A.PWR_PRDCT,2) PWR_PRDCT,
      A.RGSTR_TIME,
      A.DC_NMB,
      A.FLAG,
      B.YN,
      B.FREQ,
      B.PMP_IDX,
      B.PMP_TYP
    FROM TB_CTR_OPT_RST2 A, TB_CTR_PMPYN_RST B
    WHERE A.OPT_IDX = B.OPT_IDX 
      AND A.ANLY_TIME = 
                (
                  SELECT MAX(anly_time)
                  FROM TB_CTR_OPT_RST2
                  WHERE 
                    anly_time >= DATE_ADD(NOW(), INTERVAL -30 MINUTE)
                --    anly_time >= DATE_ADD('2023-03-01', INTERVAL -30 MINUTE)
                )
    ORDER BY A.PRDCT_T_DIFF,A.PMP_GRP
  `
  return query
}

// selectPeakGoal
exports.selectPeakGoalQuery = () => {
  let query = `
    SELECT nvl(VALUE,0) value
    FROM TB_PTR_CTR_INF
    WHERE tag = '881-355-PEAKGOAL-0001'
  `
  return query
}

// peakSelect
exports.peakSelectQuery = (search, search2 ,search3) => {
  let query = `
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
