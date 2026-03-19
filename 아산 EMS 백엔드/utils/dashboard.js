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
    WHERE tagname IN ('606-354-PWI-9500'
                ,'606-354-PWI-9520')  /* 수전차단기 전력량  태그  */
      AND ts = 
          (
            SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
            FROM TB_DATA_RAW_TAG
            WHERE 
              ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
    --					ts >= DATE_ADD('2023-03-01', INTERVAL -1 DAY)			
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
          AND tagname IN ('606-354-PWI-9500','606-354-PWI-9520')
      )a
    )a,
    (
      SELECT SUM(value)'금월전력량'
      FROM
      (
        SELECT ts,VALUE
        FROM TB_DATA_RAW_TAG_HOUR
        WHERE ts >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY AND ts <= LAST_DAY(NOW())
          AND tagname IN ('606-354-PWI-9500','606-354-PWI-9520')
      )b
    )b,
    (
      SELECT SUM(value)'금년전력량'
      FROM
      (
        SELECT ts,VALUE
        FROM TB_DATA_RAW_TAG_HOUR
        WHERE ts >= CONCAT(YEAR(NOW()),'-01-01') AND ts <= CONCAT(YEAR(NOW()),'-12-31')
          AND tagname IN ('606-354-PWI-9500','606-354-PWI-9520')
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
        WHERE tagname LIKE '%PWQ%'
      ) b 
      ON a.tagname = b.tagname
    INNER JOIN TB_FAC c 
      ON c.fac_code = b.fac
    WHERE 1=1
      AND ts >= CONCAT('${date}',' 00:00:00') AND ts <= CONCAT('${date}',' 23:59:00') 
      AND b.zone = '${zone_code}'
    GROUP BY c.fac_name
    ORDER BY VALUE DESC
    LIMIT 3
  `

  return query
}
