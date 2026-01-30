const logger = require('../logger').logger;

exports.selectReport = (reqbody) => {
  /*
  일일 보고서("전력 사용량", selectReport)
  */
  logger.info('selectReport reqbody > ', reqbody);
  let query = `
  SELECT '전일' AS ROW, 
  FORMAT(l_kwh, 0) AS l_kwh, 
  FORMAT(m_kwh, 0) AS m_kwh, 
  FORMAT(h_kwh, 0) AS h_kwh, 
  FORMAT(l_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS l_kwh_p, 
  FORMAT(m_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS m_kwh_p, 
  FORMAT(h_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS h_kwh_p, 
  savingkwh, 
  savingCo2
  FROM (
  SELECT '전일' AS ROW, 
        l_kwh.val AS l_kwh, 
        m_kwh.val AS m_kwh, 
        h_kwh.val AS h_kwh, 
        savingkwh, 
        savingCo2
  FROM (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search2}', '000000') 
            AND ts <= CONCAT('${reqbody.search2}', '235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'L'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) l_kwh,
  (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search2}', '000000') 
            AND ts <= CONCAT('${reqbody.search2}', '235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'M'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) m_kwh,
  (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search2}', '000000') 
            AND ts <= CONCAT('${reqbody.search2}', '235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'H'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) h_kwh,
  (
    SELECT savingkwh 
      FROM ems_service.RST_SAVINGS_TARGET 
      WHERE ts = '${reqbody.search4}'
  ) savingkwh,
  (
    SELECT savingCo2 
      FROM ems_service.RST_SAVINGS_TARGET 
      WHERE ts = '${reqbody.search4}'
  ) savingCo2
  ) a

  UNION ALL

  SELECT '금일' AS ROW, 
    FORMAT(l_kwh, 0) AS l_kwh, 
    FORMAT(m_kwh, 0) AS m_kwh, 
    FORMAT(h_kwh, 0) AS h_kwh, 
    FORMAT(l_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS l_kwh_p, 
    FORMAT(m_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS m_kwh_p, 
    FORMAT(h_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS h_kwh_p, 
    savingkwh, 
    savingCo2
  FROM (
  SELECT '금일' AS ROW, 
        l_kwh.val AS l_kwh, 
        m_kwh.val AS m_kwh, 
        h_kwh.val AS h_kwh, 
        savingkwh, 
        savingCo2
  FROM (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search}', '000000') 
            AND ts <= CONCAT('${reqbody.search}', '235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'L'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) l_kwh,
  (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search}', '000000') 
            AND ts <= CONCAT('${reqbody.search}', '235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'M'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) m_kwh,
  (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search}', '000000') 
            AND ts <= CONCAT('${reqbody.search}', '235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'H'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) h_kwh,
  (
    SELECT savingkwh 
      FROM ems_service.RST_SAVINGS_TARGET 
      WHERE ts = '${reqbody.search3}'
  ) savingkwh,
  (
    SELECT savingCo2 
      FROM ems_service.RST_SAVINGS_TARGET 
      WHERE ts = '${reqbody.search3}'
  ) savingCo2
  ) a

  UNION ALL

  SELECT '금월' AS ROW, 
    FORMAT(l_kwh, 0) AS l_kwh, 
    FORMAT(m_kwh, 0) AS m_kwh, 
    FORMAT(h_kwh, 0) AS h_kwh, 
    FORMAT(l_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS l_kwh_p, 
    FORMAT(m_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS m_kwh_p, 
    FORMAT(h_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS h_kwh_p, 
    savingkwh, 
    savingCo2
  FROM (
  SELECT '금월' AS ROW, 
        l_kwh.val AS l_kwh, 
        m_kwh.val AS m_kwh, 
        h_kwh.val AS h_kwh, 
        savingkwh, 
        savingCo2
  FROM (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search5}', '01000000') 
            AND ts <= CONCAT('${reqbody.search5}', '31235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'L'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) l_kwh,
  (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search5}', '01000000') 
            AND ts <= CONCAT('${reqbody.search5}', '31235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'M'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) m_kwh,
  (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search5}', '01000000') 
            AND ts <= CONCAT('${reqbody.search5}', '31235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'H'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) h_kwh,
  (
    SELECT SUM(CAST(REPLACE(savingKwh, ',', '') AS DECIMAL(10, 1))) AS savingKwh 
      FROM ems_service.RST_SAVINGS_TARGET 
      WHERE ts >= CONCAT('${reqbody.search7}', '-01') 
        AND ts <= CONCAT('${reqbody.search7}', '-31')
  ) savingkwh,
  (
    SELECT SUM(CAST(REPLACE(savingCo2, ',', '') AS DECIMAL(10, 1))) AS savingCo2 
      FROM ems_service.RST_SAVINGS_TARGET 
      WHERE ts >= CONCAT('${reqbody.search7}', '-01') 
        AND ts <= CONCAT('${reqbody.search7}', '-31')
  ) savingCo2
  ) a

  UNION ALL

  SELECT '금년' AS ROW, 
    FORMAT(l_kwh, 0) AS l_kwh, 
    FORMAT(m_kwh, 0) AS m_kwh, 
    FORMAT(h_kwh, 0) AS h_kwh, 
    FORMAT(l_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS l_kwh_p, 
    FORMAT(m_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS m_kwh_p, 
    FORMAT(h_kwh / (l_kwh + m_kwh + h_kwh) * 100, 2) AS h_kwh_p, 
    savingkwh, 
    savingCo2
  FROM (
  SELECT '금년' AS ROW, 
        l_kwh.val AS l_kwh, 
        m_kwh.val AS m_kwh, 
        h_kwh.val AS h_kwh, 
        savingkwh, 
        savingCo2
  FROM (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search6}', '0101000000') 
            AND ts <= CONCAT('${reqbody.search6}', '1231235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'L'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) l_kwh,
  (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search6}', '0101000000') 
            AND ts <= CONCAT('${reqbody.search6}', '1231235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'M'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) m_kwh,
  (
    SELECT SUM(a.value) AS val
      FROM (
        SELECT ts, value
          FROM ems_service.rawdata_hour2
          WHERE ts >= CONCAT('${reqbody.search6}', '0101000000') 
            AND ts <= CONCAT('${reqbody.search6}', '1231235900') 
            AND tagname IN ('745-617-PWQ-4000', '745-617-PWQ-4100')
        ) a,
            (SELECT STN_TM
              FROM ems_service.RT_RATE_INF
              WHERE RATE_IDX = '7' 
                AND MNTH = MONTH(NOW()) 
                AND TIMEZONE = 'H'
            ) b
      WHERE SUBSTRING(ts, 12, 2) = STN_TM
  ) h_kwh,
  (
    SELECT SUM(CAST(REPLACE(savingKwh, ',', '') AS DECIMAL(10, 1))) AS savingKwh 
      FROM ems_service.RST_SAVINGS_TARGET 
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01') 
        AND ts <= CONCAT('${reqbody.search6}', '-12-31')
  ) savingkwh,
  (
    SELECT SUM(CAST(REPLACE(savingCo2, ',', '') AS DECIMAL(10, 1))) AS savingCo2 
      FROM ems_service.RST_SAVINGS_TARGET 
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01') 
        AND ts <= CONCAT('${reqbody.search6}', '-12-31')
  ) savingCo2
  ) a;
  `;

  return query;
}

exports.selectReport2 = (reqbody) => {
  /*
  일일 보고서("시설별 사용량", selectReport2)
  */
  logger.info('selectReport2 reqbody > ', reqbody);
  let query = `
    SELECT '전일' AS ROW,
           kwh_1 + kwh_2 + kwh_3 + kwh_4 + kwh_5 + kwh_6 + kwh_7 + kwh_8 AS t_kwh,
           kwh_1, kwh_2, kwh_3, kwh_4, kwh_5, kwh_6, kwh_7, kwh_8
    FROM (
      SELECT ROUND(SUM(value), 0) AS kwh_1
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search4}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search4}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-9300', '745-617-PWQ-9330', '745-617-PWQ-4700', '745-617-PWQ-4500', '745-617-PWQ-4200', '745-617-PWQ-4450', '745-617-PWQ-9260', '745-617-PWQ-9100')
    ) a,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_2
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search4}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search4}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-9360', '745-617-PWQ-9220')
    ) b,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_3
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search4}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search4}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-3060')
    ) c,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_4
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search4}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search4}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-3040', '745-617-PWQ-3050', '745-617-PWQ-9240', '745-617-PWQ-9250', '745-617-PWQ-9130', '745-617-PWQ-9140', '745-617-PWQ-9200', '745-617-PWQ-9210')
    ) d,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_5
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search4}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search4}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-7200', '745-617-PWQ-7250')
    ) e,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_6
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search4}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search4}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-6020', '745-617-PWQ-6000')
    ) f,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_7
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search4}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search4}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-2000', '745-617-PWQ-2080')
    ) g,
    (
      SELECT 0 AS kwh_8 FROM dual
    ) h

    UNION

    SELECT '금일' AS ROW,
           kwh_1 + kwh_2 + kwh_3 + kwh_4 + kwh_5 + kwh_6 + kwh_7 + kwh_8 AS t_kwh,
           kwh_1, kwh_2, kwh_3, kwh_4, kwh_5, kwh_6, kwh_7, kwh_8
    FROM (
      SELECT ROUND(SUM(value), 0) AS kwh_1
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-9300', '745-617-PWQ-9330', '745-617-PWQ-4700', '745-617-PWQ-4500', '745-617-PWQ-4200', '745-617-PWQ-4450', '745-617-PWQ-9260', '745-617-PWQ-9100')
    ) a,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_2
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-9360', '745-617-PWQ-9220')
    ) b,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_3
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-3060')
    ) c,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_4
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-3040', '745-617-PWQ-3050', '745-617-PWQ-9240', '745-617-PWQ-9250', '745-617-PWQ-9130', '745-617-PWQ-9140', '745-617-PWQ-9200', '745-617-PWQ-9210')
    ) d,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_5
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-7200', '745-617-PWQ-7250')
    ) e,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_6
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-6020', '745-617-PWQ-6000')
    ) f,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_7
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
        AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
        AND tagname IN ('745-617-PWQ-2000', '745-617-PWQ-2080')
    ) g,
    (
      SELECT 0 AS kwh_8 FROM dual
    ) h

    UNION

    SELECT '금월' AS ROW,
           kwh_1 + kwh_2 + kwh_3 + kwh_4 + kwh_5 + kwh_6 + kwh_7 + kwh_8 AS t_kwh,
           kwh_1, kwh_2, kwh_3, kwh_4, kwh_5, kwh_6, kwh_7, kwh_8
    FROM (
      SELECT ROUND(SUM(value), 0) AS kwh_1
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search7}', '-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
        AND tagname IN ('745-617-PWQ-9300', '745-617-PWQ-9330', '745-617-PWQ-4700', '745-617-PWQ-4500', '745-617-PWQ-4200', '745-617-PWQ-4450', '745-617-PWQ-9260', '745-617-PWQ-9100')
    ) a,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_2
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search7}', '-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
        AND tagname IN ('745-617-PWQ-9360', '745-617-PWQ-9220')
    ) b,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_3
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search7}', '-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
        AND tagname IN ('745-617-PWQ-3060')
    ) c,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_4
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search7}', '-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
        AND tagname IN ('745-617-PWQ-3040', '745-617-PWQ-3050', '745-617-PWQ-9240', '745-617-PWQ-9250', '745-617-PWQ-9130', '745-617-PWQ-9140', '745-617-PWQ-9200', '745-617-PWQ-9210')
    ) d,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_5
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search7}', '-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
        AND tagname IN ('745-617-PWQ-7200', '745-617-PWQ-7250')
    ) e,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_6
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search7}', '-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
        AND tagname IN ('745-617-PWQ-6020', '745-617-PWQ-6000')
    ) f,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_7
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search7}', '-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
        AND tagname IN ('745-617-PWQ-2000', '745-617-PWQ-2080')
    ) g,
    (
      SELECT 0 AS kwh_8 FROM dual
    ) h

    UNION

    SELECT '금년' AS ROW,
           kwh_1 + kwh_2 + kwh_3 + kwh_4 + kwh_5 + kwh_6 + kwh_7 + kwh_8 AS t_kwh,
           kwh_1, kwh_2, kwh_3, kwh_4, kwh_5, kwh_6, kwh_7, kwh_8
    FROM (
      SELECT ROUND(SUM(value), 0) AS kwh_1
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
        AND tagname IN ('745-617-PWQ-9300', '745-617-PWQ-9330', '745-617-PWQ-4700', '745-617-PWQ-4500', '745-617-PWQ-4200', '745-617-PWQ-4450', '745-617-PWQ-9260', '745-617-PWQ-9100')
    ) a,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_2
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
        AND tagname IN ('745-617-PWQ-9360', '745-617-PWQ-9220')
    ) b,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_3
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
        AND tagname IN ('745-617-PWQ-3060')
    ) c,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_4
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
        AND tagname IN ('745-617-PWQ-3040', '745-617-PWQ-3050', '745-617-PWQ-9240', '745-617-PWQ-9250', '745-617-PWQ-9130', '745-617-PWQ-9140', '745-617-PWQ-9200', '745-617-PWQ-9210')
    ) d,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_5
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
        AND tagname IN ('745-617-PWQ-7200', '745-617-PWQ-7250')
    ) e,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_6
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
        AND tagname IN ('745-617-PWQ-6020', '745-617-PWQ-6000')
    ) f,
    (
      SELECT ROUND(SUM(value), 0) AS kwh_7
      FROM ems_service.rawdata_hour2
      WHERE ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00')
        AND ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
        AND tagname IN ('745-617-PWQ-2000', '745-617-PWQ-2080')
    ) g,
    (
      SELECT 0 AS kwh_8 FROM dual
    ) h
  `;

  return query;
}

exports.selectReport3 = (reqbody) => {
  /*
  일일 보고서("펌프 가동이력", selectReport3)
  */
  logger.info('selectReport3 reqbody > ', reqbody);
  let query = `
  SELECT '일누계(전력사용량)' ROW,
    FORMAT(p_1, 0) AS p_1,
    FORMAT(p_2, 0) AS p_2,
    FORMAT(p_3, 0) AS p_3,
    FORMAT(p_4, 0) AS p_4,
    FORMAT(s_1, 0) AS s_1,
    FORMAT(s_2, 0) AS s_2,
    FORMAT(p_1 + p_2 + p_3 + p_4 + s_1 + s_2, 0) AS t_kwh,
    FORMAT(m3, 0) AS m3,
    FORMAT((p_1 + p_2 + p_3 + p_4 + s_1 + s_2) / m3, 2) AS t_k_m3
  FROM (
    SELECT SUM(VALUE) AS p_1
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-4700' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) a,
  (
    SELECT SUM(VALUE) AS p_2
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-4200' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) b,
  (
    SELECT SUM(VALUE) AS p_3
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-4450' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) c,
  (
    SELECT SUM(VALUE) AS p_4
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-4500' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) d,
  (
    SELECT SUM(VALUE) AS s_1
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-9260' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) e,
  (
    SELECT SUM(VALUE) AS s_2
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-9100' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) f,
  (
    SELECT SUM(VALUE) AS m3
    FROM ems_service.rawdata_hour2
    WHERE tagname IN ('745-617-FRQ-4100', '745-617-FRQ-4101') AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) g
  
  UNION
  
  SELECT '일누계(비율)' ROW,
    FORMAT(p_1, 2) AS p_1,
    FORMAT(p_2, 2) AS p_2,
    FORMAT(p_3, 2) AS p_3,
    FORMAT(p_4, 2) AS p_4,
    FORMAT(s_1, 2) AS s_1,
    FORMAT(s_2, 2) AS s_2,
    FORMAT(t_kwh, 0) AS t_kwh,
    FORMAT(m3, 0) AS m3,
    FORMAT(t_kwh / m3, 2) AS t_k_m3
  FROM ( 
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS p_1
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4113' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4113' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE =  0
    ) b
  ) a,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS p_2
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4116' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4116' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE =  0
    ) b
  ) b,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS p_3
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4119' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4119' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE =  0
    ) b
  ) c,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS p_4
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4122' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4122' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE =  0
    ) b
  ) d,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS s_1
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4101' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4101' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE =  0
    ) b
  ) e,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS s_2
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4104' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4104' AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00') AND VALUE =  0
    ) b
  ) f,
  (
    SELECT SUM(VALUE) AS t_kwh
    FROM ems_service.rawdata_hour2
    WHERE tagname IN ('745-617-PWQ-4700','745-617-PWQ-4200','745-617-PWQ-4450','745-617-PWQ-4500','745-617-PWQ-9260','745-617-PWQ-9100') AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) g,
  (
    SELECT SUM(VALUE) AS m3
    FROM ems_service.rawdata_hour2
    WHERE tagname IN ('745-617-FRQ-4100','745-617-FRQ-4101') AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) h

  UNION

  SELECT '월누계(전력사용량)' ROW,
  FORMAT(p_1, 0) AS p_1,
  FORMAT(p_2, 0) AS p_2,
  FORMAT(p_3, 0) AS p_3,
  FORMAT(p_4, 0) AS p_4,
  FORMAT(s_1, 0) AS s_1,
  FORMAT(s_2, 0) AS s_2,
  FORMAT(p_1 + p_2 + p_3 + p_4 + s_1 + s_2, 0) AS t_kwh,
  FORMAT(m3, 0) AS m3,
  FORMAT((p_1 + p_2 + p_3 + p_4 + s_1 + s_2) / m3, 2) AS t_k_m3
  FROM (
    SELECT SUM(VALUE) p_1
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-4700' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) a,
  (
    SELECT SUM(VALUE) p_2
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-4200' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) b,
  (
    SELECT SUM(VALUE) p_3
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-4450' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) c,
  (
    SELECT SUM(VALUE) p_4
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-4500' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) d,
  (
    SELECT SUM(VALUE) s_1
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-9260' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) e,
  (
    SELECT SUM(VALUE) s_2
    FROM ems_service.rawdata_hour2
    WHERE tagname = '745-617-PWQ-9100' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) f,
  (
    SELECT SUM(VALUE) m3
    FROM ems_service.rawdata_hour2
    WHERE tagname IN ('745-617-FRQ-4100', '745-617-FRQ-4101') AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) g

  UNION

  SELECT '월누계(비율)' ROW,
    FORMAT(p_1, 2) AS p_1,
    FORMAT(p_2, 2) AS p_2,
    FORMAT(p_3, 2) AS p_3,
    FORMAT(p_4, 2) AS p_4,
    FORMAT(s_1, 2) AS s_1,
    FORMAT(s_2, 2) AS s_2,
    FORMAT(t_kwh, 0) AS t_kwh,
    FORMAT(m3, 0) AS m3,
    FORMAT(t_kwh / m3, 2) AS t_k_m3
  FROM ( 
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS p_1
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4113' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4113' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE =  0
    ) b
  ) a,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS p_2
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4116' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4116' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE =  0
    ) b
  ) b,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS p_3
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4119' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4119' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE =  0
    ) b
  ) c,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS p_4
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4122' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4122' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE =  0
    ) b
  ) d,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS s_1
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4101' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4101' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE =  0
    ) b
  ) e,
  (
    SELECT cnt_a / (cnt_a + cnt_b) * 100 AS s_2
    FROM (
      SELECT COUNT(*) AS cnt_a
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4104' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE = 1
    ) a,
    (
      SELECT COUNT(*) AS cnt_b
      FROM ems_service.rawdata_hour
      WHERE tagname = '745-617-PMB-4104' AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00') AND VALUE =  0
    ) b
  ) f,
  (
    SELECT SUM(VALUE) AS t_kwh
    FROM ems_service.rawdata_hour2
    WHERE tagname IN ('745-617-PWQ-4700','745-617-PWQ-4200','745-617-PWQ-4450','745-617-PWQ-4500','745-617-PWQ-9260','745-617-PWQ-9100') AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) g,
  (
    SELECT SUM(VALUE) AS m3
    FROM ems_service.rawdata_hour2
    WHERE tagname IN ('745-617-FRQ-4100','745-617-FRQ-4101') AND ts >= CONCAT('${reqbody.search7}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search7}', '-31 23:59:00')
  ) h

  UNION

  SELECT '연누계(전력사용량)' AS ROW,
  FORMAT(p_1, 0) AS p_1,
  FORMAT(p_2, 0) AS p_2,
  FORMAT(p_3, 0) AS p_3,
  FORMAT(p_4, 0) AS p_4,
  FORMAT(s_1, 0) AS s_1,
  FORMAT(s_2, 0) AS s_2,
  FORMAT(p_1 + p_2 + p_3 + p_4 + s_1 + s_2, 0) AS t_kwh,
  FORMAT(m3, 0) AS m3,
  FORMAT((p_1 + p_2 + p_3 + p_4 + s_1 + s_2) / m3, 2) AS t_k_m3
  FROM (
  SELECT SUM(VALUE) p_1
  FROM ems_service.rawdata_hour2
  WHERE tagname = '745-617-PWQ-4700' AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) a,
  (
  SELECT SUM(VALUE) p_2
  FROM ems_service.rawdata_hour2
  WHERE tagname = '745-617-PWQ-4200' AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) b,
  (
  SELECT SUM(VALUE) p_3
  FROM ems_service.rawdata_hour2
  WHERE tagname = '745-617-PWQ-4450' AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) c,
  (
  SELECT SUM(VALUE) p_4
  FROM ems_service.rawdata_hour2
  WHERE tagname = '745-617-PWQ-4500' AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) d,
  (
  SELECT SUM(VALUE) s_1
  FROM ems_service.rawdata_hour2
  WHERE tagname = '745-617-PWQ-9260' AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) e,
  (
  SELECT SUM(VALUE) s_2
  FROM ems_service.rawdata_hour2
  WHERE tagname = '745-617-PWQ-9100' AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) f,
  (
  SELECT SUM(VALUE) m3
  FROM ems_service.rawdata_hour2
  WHERE tagname IN ('745-617-FRQ-4100', '745-617-FRQ-4101') AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) g

  UNION

  SELECT '연누계(비율)' AS ROW,
    FORMAT(p_1, 2) AS p_1,
    FORMAT(p_2, 2) AS p_2,
    FORMAT(p_3, 2) AS p_3,
    FORMAT(p_4, 2) AS p_4,
    FORMAT(s_1, 2) AS s_1,
    FORMAT(s_2, 2) AS s_2,
    FORMAT(t_kwh, 0) AS t_kwh,
    FORMAT(m3, 0) AS m3,
    FORMAT(t_kwh / m3, 2) AS t_k_m3
  FROM (
  SELECT (cnt_a / (cnt_a + cnt_b)) * 100 AS p_1
  FROM (
    SELECT COUNT(*) AS cnt_a
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4113' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 1
  ) a,
  (
    SELECT COUNT(*) AS cnt_b
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4113' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 0
  ) b
  ) AS p_1,
  (
  SELECT (cnt_a / (cnt_a + cnt_b)) * 100 AS p_2
  FROM (
    SELECT COUNT(*) AS cnt_a
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4116' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 1
  ) a,
  (
    SELECT COUNT(*) AS cnt_b
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4116' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 0
  ) b
  ) AS p_2,
  (
  SELECT (cnt_a / (cnt_a + cnt_b)) * 100 AS p_3
  FROM (
    SELECT COUNT(*) AS cnt_a
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4119' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 1
  ) a,
  (
    SELECT COUNT(*) AS cnt_b
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4119' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 0
  ) b
  ) AS p_3,
  (
  SELECT (cnt_a / (cnt_a + cnt_b)) * 100 AS p_4
  FROM (
    SELECT COUNT(*) AS cnt_a
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4122' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 1
  ) a,
  (
    SELECT COUNT(*) AS cnt_b
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4122' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 0
  ) b
  ) AS p_4,
  (
  SELECT (cnt_a / (cnt_a + cnt_b)) * 100 AS s_1
  FROM (
    SELECT COUNT(*) AS cnt_a
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4101' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 1
  ) a,
  (
    SELECT COUNT(*) AS cnt_b
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4101' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 0
  ) b
  ) AS s_1,
  (
  SELECT (cnt_a / (cnt_a + cnt_b)) * 100 AS s_2
  FROM (
    SELECT COUNT(*) AS cnt_a
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4104' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 1
  ) a,
  (
    SELECT COUNT(*) AS cnt_b
    FROM ems_service.rawdata_hour
    WHERE tagname = '745-617-PMB-4104' AND
        ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
        ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00') AND
        VALUE = 0
  ) b
  ) AS s_2,
  (
  SELECT SUM(VALUE) AS t_kwh
  FROM ems_service.rawdata_hour2
  WHERE tagname IN (
    '745-617-PWQ-4700',
    '745-617-PWQ-4200',
    '745-617-PWQ-4450',
    '745-617-PWQ-4500',
    '745-617-PWQ-9260',
    '745-617-PWQ-9100'
  ) AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) AS t_kwh,
  (
  SELECT SUM(VALUE) AS m3
  FROM ems_service.rawdata_hour2
  WHERE tagname IN ('745-617-FRQ-4100', '745-617-FRQ-4101') AND
    ts >= CONCAT('${reqbody.search6}', '-01-01 00:00:00') AND
    ts <= CONCAT('${reqbody.search6}', '-12-31 23:59:00')
  ) AS m3
  `;  

  return query;
}

exports.selectReport4 = (reqbody) => {
  /*
  일일 보고서("주요 배수지 수위", selectReport4)
  */
  logger.info('selectReport4 reqbody > ', reqbody);
  let query = `
  SELECT '최대' AS ROW, a_1, a_2, b_1, b_2, c_1, c_2, d_1, d_2 FROM (
      SELECT FORMAT(IFNULL(MAX(VALUE), 0), 2) AS a_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8982' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) a,
  (
      SELECT FORMAT(IFNULL(MAX(VALUE), 0), 2) AS a_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8983' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) b,
  (
      SELECT FORMAT(IFNULL(MAX(VALUE), 0), 2) AS b_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8965' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) c,
  (
      SELECT FORMAT(IFNULL(MAX(VALUE), 0), 2) AS b_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8966' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) d,
  (
      SELECT FORMAT(IFNULL(MAX(VALUE), 0), 2) AS c_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8856' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) e,
  (
      SELECT FORMAT(IFNULL(MAX(VALUE), 0), 2) AS c_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8857' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) f,
  (
      SELECT FORMAT(IFNULL(MAX(VALUE), 0), 2) AS d_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8984' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) g,
  (
      SELECT FORMAT(IFNULL(MAX(VALUE), 0), 2) AS d_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8987' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) h

  UNION

  SELECT '최소' AS ROW, a_1, a_2, b_1, b_2, c_1, c_2, d_1, d_2 FROM (
      SELECT FORMAT(IFNULL(MIN(VALUE), 0), 2) AS a_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8982' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) a,
  (
      SELECT FORMAT(IFNULL(MIN(VALUE), 0), 2) AS a_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8983' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) b,
  (
      SELECT FORMAT(IFNULL(MIN(VALUE), 0), 2) AS b_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8965' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) c,
  (
      SELECT FORMAT(IFNULL(MIN(VALUE), 0), 2) AS b_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8966' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) d,
  (
      SELECT FORMAT(IFNULL(MIN(VALUE), 0), 2) AS c_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8856' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) e,
  (
      SELECT FORMAT(IFNULL(MIN(VALUE), 0), 2) AS c_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8857' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) f,
  (
      SELECT FORMAT(IFNULL(MIN(VALUE), 0), 2) AS d_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8984' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) g,
  (
      SELECT FORMAT(IFNULL(MIN(VALUE), 0), 2) AS d_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8987' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) h

  UNION

  SELECT '평균' AS ROW, a_1, a_2, b_1, b_2, c_1, c_2, d_1, d_2 FROM (
      SELECT FORMAT(IFNULL(AVG(VALUE), 0), 2) AS a_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8982' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) a,
  (
      SELECT FORMAT(IFNULL(AVG(VALUE), 0), 2) AS a_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8983' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) b,
  (
      SELECT FORMAT(IFNULL(AVG(VALUE), 0), 2) AS b_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8965' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) c,
  (
      SELECT FORMAT(IFNULL(AVG(VALUE), 0), 2) AS b_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8966' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) d,
  (
      SELECT FORMAT(IFNULL(AVG(VALUE), 0), 2) AS c_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8856' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) e,
  (
      SELECT FORMAT(IFNULL(AVG(VALUE), 0), 2) AS c_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8857' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) f,
  (
      SELECT FORMAT(IFNULL(AVG(VALUE), 0), 2) AS d_1
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8984' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) g,
  (
      SELECT FORMAT(IFNULL(AVG(VALUE), 0), 2) AS d_2
      FROM ems_data.rawdata
      WHERE tagname = '745-617-LEI-8987' AND
          ts >= CONCAT('${reqbody.search3}', ' 00:00:00') AND
          ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ) h
`;

  return query;
}

exports.selectReport5 = (reqbody) => {
  /*
  일일 보고서("수위 트렌드", selectReport5)
  */
  logger.info('selectReport5 reqbody > ', reqbody);
  let query = `
  SELECT DATE_FORMAT(ts, '%Y-%m-%d %H:%i') AS ts,
  CASE
    WHEN tagname = '745-617-LEI-8982' THEN '봉담2 1지'
    WHEN tagname = '745-617-LEI-8983' THEN '봉담2 2지'
    WHEN tagname = '745-617-LEI-8965' THEN '남양6 1지'
    WHEN tagname = '745-617-LEI-8966' THEN '남양6 2지'
    WHEN tagname = '745-617-LEI-8856' THEN '남양6신설 1지'
    WHEN tagname = '745-617-LEI-8857' THEN '남양6신설 2지'
    WHEN tagname = '745-617-LEI-8984' THEN '마도 1지'
    WHEN tagname = '745-617-LEI-8987' THEN '마도 2지'
  END AS tagname,
  FORMAT(VALUE, 2) AS val
  FROM ems_data.rawdata
  WHERE tagname IN ('745-617-LEI-8982', '745-617-LEI-8983', '745-617-LEI-8965', '745-617-LEI-8966', '745-617-LEI-8856', '745-617-LEI-8857', '745-617-LEI-8984', '745-617-LEI-8987')
    AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
    AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
  ORDER BY ts;
`;

  return query;
}

exports.selectReport6 = (reqbody) => {
  /*
  일일 보고서("시간대별 전력사용현황", selectReport6)
  */
  logger.info('selectReport6 reqbody > ', reqbody);
  let query = `
  SELECT DATE_FORMAT(a.DATE, '%Y-%m-%d %H:%i') AS DATE, b.val, c.CBL
  FROM (
    SELECT '${reqbody.search3}' + INTERVAL (a.h) HOUR AS DATE
    FROM (
        WITH RECURSIVE cte AS (
          SELECT 0 AS h 
          UNION ALL
          SELECT h+1
          FROM cte
          WHERE h < 23
        )
        SELECT *
        FROM cte
    ) a
  ) a
  LEFT JOIN (
    SELECT 
      CASE 
        WHEN SUBSTRING(DATE_FORMAT(ts, '%Y-%m-%d %H:%i:00'), 15, 2) = '00' THEN DATE_FORMAT(ts, '%Y-%m-%d %H:%i:00')
        ELSE DATE_FORMAT(ts, '%Y-%m-%d %H:%00:00')
      END AS ts,
      SUM(VALUE) AS val
    FROM ems_service.rawdata_hour2
    WHERE tagname IN ('745-617-PWQ-4100', '745-617-PWQ-4000')
      AND ts >= CONCAT('${reqbody.search3}', ' 00:00:00')
      AND ts <= CONCAT('${reqbody.search3}', ' 23:59:00')
    GROUP BY DATE_FORMAT(ts, '%Y-%m-%d %H:%i:00')
  ) b ON a.DATE = DATE_FORMAT(b.ts, '%Y-%m-%d %H:%i:00')
  LEFT JOIN (
    SELECT PRDC_TIME, FORMAT(CBL, 0) AS CBL
    FROM ems_service.DMN_DMND_RST
    WHERE PRDC_TIME >= CONCAT('${reqbody.search3}', ' 00:00:00')
      AND PRDC_TIME <= CONCAT('${reqbody.search3}', ' 23:59:00')
    GROUP BY PRDC_TIME
  ) c ON a.DATE = c.PRDC_TIME
  ORDER BY DATE;
  `;
  
  return query;
}

exports.selectReport7 = (reqbody) => {
  /*
  일일 보고서("전력/목표설정 피크값", selectReport7)
  */
  logger.info('selectReport7 reqbody > ', reqbody);
  let query = `
    SELECT MAX(gnrtd_pwr) AS peak
    FROM ems_service.PEAK_GNRTD_RST
    WHERE CNFRM_TIME >= CONCAT('${reqbody.search3}', ' 00:00:00')
      AND CNFRM_TIME <= CONCAT('${reqbody.search3}', ' 23:59:00');
  `;

  return query;
}

// selectpmpPerformList
exports.selectPerformList = (reqbody) => {
  /*
  일일 보고서("가동 트렌드", selectPerformList)
  */
  logger.info('selectPerformList reqbody > ', reqbody);
  let query = `
  SELECT a.*, (SELECT CONCAT(PMP_GRP_DSC, PMP_GRP_IDX) FROM ems_service.CTR_PRF_PMPMST_INF WHERE `;
  if (reqbody.search3 === 'PMB_TAG') {
    query += `PMB_TAG`;
  } else if (reqbody.search3 === 'PWI_TAG') {
    query += `PWI_TAG`;
  } else if (reqbody.search3 === 'SPI_TAG') {
    query += `SPI_TAG`;
  }
  query += ` = tagname) name
    FROM (
      SELECT `;
  if (reqbody.search4 === 'h') {
    query += `DATE_FORMAT(ts, '%Y-%m-%d %H:%i')`;
  } else if (reqbody.search4 === 'd') {
    query += `DATE_FORMAT(ts, '%Y-%m-%d')`;
  } else if (reqbody.search4 === 'm') {
    query += `DATE_FORMAT(ts, '%Y-%m')`;
  } else if (reqbody.search4 === 'y') {
    query += `DATE_FORMAT(ts, '%Y')`;
  }
  query += ` ts, tagname, value
      FROM ems_service.rawdata_hour b
      WHERE `;
  if (reqbody.search4 === 'h' || reqbody.search4 === 'd') {
    query += `ts >= CONCAT('${reqbody.search}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search2}', ' 23:59:00')`;
  } else if (reqbody.search4 === 'm') {
    query += `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')`;
  } else if (reqbody.search4 === 'y') {
    query += `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')`;
  }
  query += ` AND tagname IN (
      SELECT `;
  if (reqbody.search3 === 'PMB_TAG') {
    query += `PMB_TAG`;
  } else if (reqbody.search3 === 'PWI_TAG') {
    query += `PWI_TAG`;
  } else if (reqbody.search3 === 'SPI_TAG') {
    query += `SPI_TAG`;
  }
  query += ` FROM ems_service.CTR_PRF_PMPMST_INF
    ) 
    GROUP BY `;
  if (reqbody.search4 === 'h') {
    query += `b.ts`;
  } else if (reqbody.search4 === 'd') {
    query += `DATE(b.ts)`;
  } else if (reqbody.search4 === 'm') {
    query += `MONTH(b.ts)`;
  } else if (reqbody.search4 === 'y') {
    query += `YEAR(b.ts)`;
  }
  query += `, b.tagname
    ) a
  `;

  return query;
}
