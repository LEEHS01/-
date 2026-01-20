//alarmCheck
exports.alarmCheck = (search) => {
  const query = `
  SELECT * 
  FROM TB_EMS_ALARM 
  where TIME > date_add(NOW(),interval -2 MINUTE)
  -- where TIME > '2024-03-06 19:00:00'
    AND FLAG = 0
    AND TIME < NOW()
  group by alarm_id;
  `

  return query
  
}

exports.alarmUpdate = (search) => {
  const query = `
  UPDATE  
  TB_EMS_ALARM
  SET FLAG = 5
  WHERE TIME > date_add(NOW(), interval -2 MINUTE)
    AND FLAG = 0
    AND TIME < NOW()
  `

  return query
  
}

//siteAlarmCheck
exports.siteAlarmCheck = (search) => {
  const query = `
  SELECT * 
  FROM TB_EMS_ALARM 
  where TIME > date_add(NOW(),interval -2 MINUTE)
  -- where TIME > '2024-03-06 19:00:00'
    AND FLAG = 2
    AND TIME < NOW()
  group by alarm_id;
  `

  return query
  
}

exports.siteAlarmUpdate = (search) => {
  const query = `
  UPDATE  
  TB_EMS_ALARM
  SET FLAG = 6
  WHERE TIME > date_add(NOW(), interval -2 MINUTE)
    AND FLAG = 2
    AND TIME < NOW()
  `

  return query
  
}

// 대시보드 (1, selectNowElec)
exports.nowElecQuery = () => {
  let query = `
    SELECT SUM(VALUE) 'VALUE'
    FROM TB_DATA_RAW_TAG
    WHERE tagname IN ('881-355-PWI-7405'
                      ,'881-355-PWI-7445')  /* 수전차단기 전력량  태그  */
    AND ts = 
          (
            SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
            FROM TB_DATA_RAW_TAG
            WHERE 
              ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
          --    ts >= DATE_ADD('2023-03-01', INTERVAL -1 DAY)
          )
  `

  return query
}

// 대시보드 (/selectNowElec에서 호출, selectNowPeak)
exports.nowPeakQuery = () => {
  let query = `
    SELECT 1m 'month1', 2m 'month2', 3m 'month3', 4m 'month4', 5m 'month5', 6m 'month6', 7m 'month7', 8m 'month8', 9m 'month9', 10m 'month10', 11m 'month11', 12m 'month12' 
    FROM TB_GOALSETTING 
    WHERE 
      YEAR=DATE_FORMAT(now(),'%Y')
    --	YEAR=DATE_FORMAT('2023-03-01','%Y')
  `

  return query
}

// 대시보드 (/selectNowElec에서 호출, selectYMD)
exports.ymdQuery = () => {
  let query = `
    SELECT
      *
    FROM
    (
      SELECT SUM(VALUE)'전일전력량'
      FROM
      (
        SELECT ts,VALUE
        FROM TB_DATA_RAW_TAG_HOUR
        WHERE ts LIKE CONCAT(CURDATE() - INTERVAL 1 DAY,'%')
          AND tagname IN ('881-355-PWI-7425','881-355-PWI-7465')
      )a
    )a,
    (
      SELECT SUM(value)'금월전력량'
      FROM
      (
        SELECT ts,VALUE
        FROM TB_DATA_RAW_TAG_HOUR
        WHERE ts >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY AND ts <= LAST_DAY(NOW())
          AND tagname IN ('881-355-PWI-7425','881-355-PWI-7465')
      )b
    )b,
    (
      SELECT SUM(value)'금년전력량'
      FROM
      (
        SELECT ts,VALUE
        FROM TB_DATA_RAW_TAG_HOUR
        WHERE ts >= CONCAT(YEAR(NOW()),'-01-01') AND ts <= CONCAT(YEAR(NOW()),'-12-31')
          AND tagname IN ('881-355-PWI-7425','881-355-PWI-7465')
      )c
    )c
  `
  return query
}

// 대시보드 (/selectNowElec에서 호출, baseElec)
exports.baseElecQuery = () => {
  let query = `
    SELECT 
      ts, TYPE, savingCost, savingKwh, savingCo2
    FROM TB_RST_SAVINGS_TARGET   /* db 프로시저에서 작동(rst_savings_target_daily_event) */
    WHERE 
      ts > LAST_DAY(NOW() - interval 1 month) AND ts <= LAST_DAY(NOW())
    --	ts > LAST_DAY('2023-03-01' - interval 1 month) AND ts <= LAST_DAY('2023-03-01')
    ORDER BY ts	
  `

  return query
}

// 대시보드 (/selectNowElec에서 호출, rstSavingTargetSum)
exports.rstSavingTargetSumQuery = () => {
  let query = `
    SELECT 
      substring(ts,1,4) as ts, TYPE
    ,format(sum(REPLACE(savingCost,',','')),0) AS savingCost
    ,format(sum(REPLACE(savingKwh,',','')),1) AS savingKwh
    ,format(sum(REPLACE(savingCo2,',','')),1) AS savingCo2
    FROM TB_RST_SAVINGS_TARGET
    GROUP BY SUBSTRING(ts,1,4)
    ORDER BY ts
  `
  return query
}

// 대시보드 (6, getTop3)
exports.top3Query = (date, zone_code) => {
  let query = `
    SELECT c.fac_name AS description, SUM(a.VALUE) value
    FROM TB_DATA_RAW_TAG a
    INNER JOIN 
      (
        SELECT *
        FROM TB_TAGINFO_2
        WHERE tagname LIKE '%PWI%'
      ) b ON a.tagname = b.tagname
    INNER JOIN TB_FAC c ON c.fac_code = b.fac
    WHERE 1=1
      AND ts >= CONCAT('${date}',' 00:00:00') AND ts <= CONCAT('${date}',' 23:59:00')
      AND b.zone = '${zone_code}'
  --  AND a.ts >= CONCAT('2023-11-01',' 00:00:00') AND a.ts <= CONCAT('2023-11-30',' 23:59:00') 
  --  AND b.zone = '약품동'
    GROUP BY c.fac_name
    ORDER BY VALUE DESC
    LIMIT 3
  `

  return query
}

// 대시보드 (2의 Percent, 6의 전력소비, selectZoneUseList_sum_dashboard)
exports.selectZoneUseList_sum_dashboard = (reqbody) => {
  let query = `
    SELECT MAX(X) x, zone_name, SUM(Y) y
    FROM 
    (
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""} 
        AS x,'착수' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9198')
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""} 
      UNION 
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""} 
        AS x,'약품' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9000','881-355-PWQ-9018','881-355-PWQ-9030','881-355-PWQ-9036')
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""}
      UNION
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""} 
        AS x,'혼화응집' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('XXX')
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""} 
      UNION
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""} 
        AS x,'침전' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('XXX')
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""} 
      UNION
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""} 
        AS x,'여과' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9204','881-355-PWQ-9210','881-355-PWQ-9264','881-355-PWQ-9270','881-355-PWQ-9276','881-355-PWQ-9282','')
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""} 
      UNION
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""} 
        AS x,'소독' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9066','881-355-PWQ-9216','881-355-PWQ-9222','881-355-PWQ-9228','881-355-PWQ-9234',
          '881-355-PWQ-9240','881-355-PWQ-9150','881-355-PWQ-9156','881-355-PWQ-9162','881-355-PWQ-9180',
          '881-355-PWQ-9186','881-355-PWQ-9192','881-355-PWQ-9006','881-355-PWQ-9012','881-355-PWQ-9042'
          )
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""}
    )a
    GROUP BY zone_name 
  `;

  return query;
}
