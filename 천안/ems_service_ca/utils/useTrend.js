const logger = require('../logger').logger;

exports.selectUseTrendList = (reqbody) => {
  logger.info('selectUseTrendList reqbody > ', reqbody);

  let query = `SELECT `;
  
  if (reqbody.search3 === 'h') {
    query += `DATE_FORMAT(ts, '%Y-%m-%d %H:%i')`;
  } else if (reqbody.search5 === 'd') {
    query += `DATE_FORMAT(ts, '%Y-%m-%d')`;
  } else if (reqbody.search5 === 'm') {
    query += `DATE_FORMAT(ts, '%Y-%m')`;
  } else if (reqbody.search5 === 'y') {
    query += `DATE_FORMAT(ts, '%Y')`;
  }

  query += `
        ts, SUM(VALUE) val
    FROM TB_DATA_RAW_TAG_HOUR_USE_TREND a
    WHERE 
        `;

  if (reqbody.search3 === 'h' || reqbody.search3 === 'd') {
    query += `ts >= CONCAT('${reqbody.search}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search2}', ' 23:59:00')`;
  } else if (reqbody.search3 === 'm') {
    query += `ts >= CONCAT('${reqbody.search}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}', '-31 23:59:00')`;
  } else if (reqbody.search3 === 'y') {
    query += `ts >= CONCAT('${reqbody.search}', '-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}', '-12-31 23:59:00')`;
  }

  query += ` GROUP BY
        `;

  if (reqbody.search3 === 'h') {
    query += `a.ts`;
  } else if (reqbody.search3 === 'd') {
    query += `DATE(a.ts)`;
  } else if (reqbody.search3 === 'm') {
    query += `MONTH(a.ts)`;
  } else if (reqbody.search3 === 'y') {
    query += `YEAR(a.ts)`;
  }

  return query;
}

exports.peak_max = () => {
  let query = `
    SELECT 
      format(max(case when ts like CONCAT(CURDATE() - INTERVAL 1 DAY,'%') then  VALUE+0 END),0) '전일' ,
      format(max(case when ts like CONCAT(CURDATE() ,'%') then  VALUE+0 END),0) '금일' ,
      format(max(case when ts >= ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 0 ) AND ts <= ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 6 ) then  VALUE+0 END),0) '금주' ,
      format(max(case when ts >= LAST_DAY(NOW() - INTERVAL 1 month) + interval 1 DAY AND ts <= LAST_DAY(NOW()) then  VALUE+0 END),0) '금월' ,
      format(max(case when ts >= concat(year(NOW()),'-01-01') AND ts <= concat(year(NOW()),'-12-31') then  VALUE+0 END),0) '금년' 
    FROM 
      TB_DATA_RAW_TAG
    WHERE 
    --	tagname IN ( '745-617-PWI-4000','745-617-PWI-4100')  	/* 수전차단기 전력량 태그 */
      tagname IN ( '881-355-PWI-7405' ,'881-355-PWI-7445')  	/* 수전차단기 전력량 태그 */
      AND ts LIKE '%00:00'
  `;

  return query;
}

exports.todayTcost = () => {
  let query = `
    SELECT 
      CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost
    ,SUM(a.value) value
    FROM 
    (
    SELECT ts,VALUE
    FROM	TB_DATA_RAW_TAG_HOUR_USE_TREND
    WHERE 
      ts LIKE CONCAT(CURDATE(),'%') 
    )a,
    (
    SELECT STN_TM,ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX ='7' 
      AND MNTH = MONTH(NOW())
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.todayLcost = () => {
  let query = `
    SELECT 
      CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost
      ,SUM(a.value) value
    FROM 
    (
    SELECT ts,VALUE
    FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
    WHERE 
      ts LIKE CONCAT(CURDATE(),'%') 
    )a,
    (
    SELECT 
        STN_TM
      ,ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX ='7' 
      AND MNTH = MONTH(NOW()) AND TIMEZONE = 'L'
      AND TIMEZONE = 'L'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.todayMcost = () => {
  let query = `
    SELECT 
      CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost
      ,SUM(a.value) value
    FROM 
    (
    SELECT ts,VALUE
    FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
    WHERE 
      ts LIKE CONCAT(CURDATE(),'%') 
    )a,
    (
    SELECT 
        STN_TM
      ,ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX ='7' 
      AND MNTH = MONTH(NOW()) 
      AND TIMEZONE = 'M'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.todayHcost = () => {
  let query = `
    SELECT 
      CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost
      ,SUM(a.value) value
    FROM 
    (
    SELECT ts,VALUE
    FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
    WHERE 
      ts LIKE CONCAT(CURDATE(),'%') 
    )a,
    (
    SELECT 
        STN_TM
      ,ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX ='7' 
      AND MNTH = MONTH(NOW()) 
      AND TIMEZONE = 'H'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.monthT = () => {
  let query = `
    SELECT CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost, SUM(a.value) value
    FROM 
    (
      SELECT ts,VALUE
      FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
      WHERE 
        ts >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY AND ts <= LAST_DAY(NOW())
    )a,
    (
      SELECT STN_TM,ELCTR_RATE
      FROM TB_RT_RATE_INF
      WHERE RATE_IDX ='7' 
        AND MNTH = MONTH(NOW())
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.monthL = () => {
  let query = `
    SELECT CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost, SUM(a.value) value
    FROM 
    (
      SELECT ts,VALUE
      FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
      WHERE 
        ts >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY AND ts <= LAST_DAY(NOW())
    )a,
    (
      SELECT STN_TM,ELCTR_RATE
      FROM TB_RT_RATE_INF
      WHERE RATE_IDX ='7' 
        AND MNTH = MONTH(NOW()) AND TIMEZONE = 'L'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.monthM = () => {
  let query = `
    SELECT CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost, SUM(a.value) value
    FROM 
    (
      SELECT ts,VALUE
      FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
      WHERE 
        ts >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY AND ts <= LAST_DAY(NOW())
    )a,
    (
      SELECT STN_TM,ELCTR_RATE
      FROM TB_RT_RATE_INF
      WHERE RATE_IDX ='7' 
        AND MNTH = MONTH(NOW()) AND TIMEZONE = 'M'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.monthH = () => {
  let query = `
    SELECT CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost, SUM(a.value) value
    FROM 
    (
      SELECT ts,VALUE
      FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
      WHERE 
        ts >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY AND ts <= LAST_DAY(NOW())
    )a,
    (
      SELECT STN_TM,ELCTR_RATE
      FROM TB_RT_RATE_INF
      WHERE RATE_IDX ='7' 
        AND MNTH = MONTH(NOW()) AND TIMEZONE = 'H'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.yearT = () => {
  let query = `
    SELECT 
      CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost
    ,SUM(a.value) value
    FROM 
    (
    SELECT ts,VALUE
    FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
    WHERE 
      ts >= CONCAT(YEAR(NOW()),'-01-01') AND ts <= CONCAT(YEAR(NOW()),'-12-31')
    )a,
    (
    SELECT STN_TM,ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX ='7' 
      AND MNTH = MONTH(NOW())
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.yearL = () => {
  let query = `
    SELECT 
      CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost
    ,SUM(a.value) value
    FROM 
    (
    SELECT ts,VALUE
    FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
    WHERE 
      ts >= concat(year(NOW()),'-01-01') AND ts <= concat(year(NOW()),'-12-31')
    )a,
    (
    SELECT STN_TM,ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX ='7' 
      AND MNTH = MONTH(NOW()) 
      AND TIMEZONE = 'L'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.yearM = () => {
  let query = `
    SELECT 
      CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost
    ,SUM(a.value) value
    FROM 
    (
    SELECT ts,VALUE
    FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
    WHERE 
      ts >= concat(year(NOW()),'-01-01') AND ts <= concat(year(NOW()),'-12-31')
    )a,
    (
    SELECT STN_TM,ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX ='7' 
      AND MNTH = MONTH(NOW()) 
      AND TIMEZONE = 'M'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

exports.yearH = () => {
  let query = `
    SELECT 
      CAST(SUM(a.value*b.ELCTR_RATE) AS signed INTEGER) AS cost
    ,SUM(a.value) value
    FROM 
    (
    SELECT ts,VALUE
    FROM TB_DATA_RAW_TAG_HOUR_USE_TREND
    WHERE 
      ts >= concat(year(NOW()),'-01-01') AND ts <= concat(year(NOW()),'-12-31')
    )a,
    (
    SELECT STN_TM,ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX ='7' 
      AND MNTH = MONTH(NOW()) 
      AND TIMEZONE = 'H'
    )b
    WHERE SUBSTRING(ts,12,2) = STN_TM
  `;

  return query;
}

