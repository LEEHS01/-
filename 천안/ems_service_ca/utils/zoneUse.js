const logger = require('../logger').logger;

exports.sisul_sunsi = () => {
  /*
  에너지사용현황>시설별사용량("시설별사용량", sisul_sunsi)
  */
  let query = `
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계착수정동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN ('881-355-PWI-9198') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계여과지동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('881-355-PWI-9204','881-355-PWI-9210') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'여과지동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('881-355-PWI-9054','881-355-PWI-9060','881-355-PWI-9066','881-355-PWI-9072') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'탈수기동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN ('881-355-PWI-9078','881-355-PWI-9084','881-355-PWI-9120','881-355-PWI-9126',
              '881-355-PWI-9102','881-355-PWI-9108','881-355-PWI-9114','881-355-PWI-9090') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계농축슬러지펌프동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN ('881-355-PWI-9306','881-355-PWI-9312','881-355-PWI-9318')
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계정수지동' zone_name, ROUND(sum(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN ('881-355-PWI-9216','881-355-PWI-9222','881-355-PWI-9228','881-355-PWI-9234','881-355-PWI-9240',
              '881-355-PWI-9246','881-355-PWI-9252','881-355-PWI-9258','881-355-PWI-9264','881-355-PWI-9270',
              '881-355-PWI-9276','881-355-PWI-9282','881-355-PWI-9288','881-355-PWI-9294') 
    
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계송수펌프동' zone_name, ROUND(sum(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN ('881-355-PWI-4101','881-355-PWI-4102','881-355-PWI-4103') 
    UNION ALL
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'송수펌프동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
              ) 
    AND tagname IN ('881-355-PWI-9144','881-355-PWI-9150','881-355-PWI-9156','881-355-PWI-9162','881-355-PWI-9168',
                '881-355-PWI-9174','881-355-PWI-9180','881-355-PWI-9186','881-355-PWI-9192') 
    
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'약품동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN ('881-355-PWI-9000','881-355-PWI-9006','881-355-PWI-9012','881-355-PWI-9018','881-355-PWI-9048') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'응집침전지동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('881-355-PWI-9024','881-355-PWI-9030','881-355-PWI-9036','881-355-PWI-9042') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'배출수동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('881-355-PWI-9096') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'농축조동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('881-355-PWI-9132','881-355-PWI-9138') 	
      ;
  `

  return query
}

/*
  에너지사용현황>시설별사용량("순시전력챠트(팝업)", sunsiChart)
*/
exports.sunsiChart = (reqbody) => {
  logger.info('sunsiChart reqbody > ', reqbody);
  let query = `
    ${reqbody.search === '3단계착수정동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '3단계착수정동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9198')  -- 3단계착수정동
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계여과지동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '3단계여과지동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9204','881-355-PWI-9210') -- 3단계여과지동
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '여과지동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '여과지동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9054','881-355-PWI-9060','881-355-PWI-9066','881-355-PWI-9072') -- 여과지
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '탈수기동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '탈수기동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9078','881-355-PWI-9084','881-355-PWI-9120','881-355-PWI-9126',
          '881-355-PWI-9102','881-355-PWI-9108','881-355-PWI-9114','881-355-PWI-9090')  -- 탈수기동

      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계농축슬러지펌프동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '3단계농축슬러지펌프동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9306','881-355-PWI-9312','881-355-PWI-9318')   -- 3단계농축슬러지펌프동
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계정수지동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '3단계정수지동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9216','881-355-PWI-9222','881-355-PWI-9228','881-355-PWI-9234','881-355-PWI-9240',
          '881-355-PWI-9246','881-355-PWI-9252','881-355-PWI-9258','881-355-PWI-9264','881-355-PWI-9270',
          '881-355-PWI-9276','881-355-PWI-9282','881-355-PWI-9288','881-355-PWI-9294')   -- 3단계정수지
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계송수펌프동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '3단계송수펌프동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-4101','881-355-PWI-4102','881-355-PWI-4103')  -- 3단계송수펌프동
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '송수펌프동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '송수펌프동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9144','881-355-PWI-9150','881-355-PWI-9156','881-355-PWI-9162','881-355-PWI-9168',
          '881-355-PWI-9174','881-355-PWI-9180','881-355-PWI-9186','881-355-PWI-9192')  -- 송수펌프동
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '약품동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '약품동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9000','881-355-PWI-9006','881-355-PWI-9012','881-355-PWI-9018','881-355-PWI-9048')  -- 약품동
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '응집침전지동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '응집침전지동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9024','881-355-PWI-9030','881-355-PWI-9036','881-355-PWI-9042') -- 응집침전지
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '농축조동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '농축조동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9132','881-355-PWI-9138') 	-- 농축조동
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '배출수동' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '배출수동' zone_name, 
        ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('881-355-PWI-9096') 	-- 배출수동
      GROUP BY ts
    ` : ''}
  `;

  return query;
}

/*
  에너지사용현황>시설별사용량("순시전력챠트(팝업)", selectZoneUseList)
  : 시간당 최대전력,전력시간대 트렌드
*/

exports.selectZoneUseList = (reqbody) => {
  logger.info('selectZoneUseList reqbody > ', reqbody);
  let query = `
    SELECT 
      ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""} 
      AS x,'3단계착수정동' zone_name, ROUND(SUM(VALUE),2) AS y
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
      AS x,'3단계여과지동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9204','881-355-PWQ-9210')
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
      AS x,'여과지동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9054','881-355-PWQ-9060','881-355-PWQ-9066','881-355-PWQ-9072')
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
      AS x,'탈수기동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9078','881-355-PWQ-9084','881-355-PWQ-9120','881-355-PWQ-9126',
              '881-355-PWQ-9102','881-355-PWQ-9108','881-355-PWQ-9114','881-355-PWQ-9090')
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
      AS x,'3단계농축슬러지펌프동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE 
    ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9306','881-355-PWQ-9312','881-355-PWQ-9318')
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
      AS x,'3단계정수지동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
    ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9216','881-355-PWQ-9222','881-355-PWQ-9228','881-355-PWQ-9234','881-355-PWQ-9240',
              '881-355-PWQ-9246','881-355-PWQ-9252','881-355-PWQ-9258','881-355-PWQ-9264','881-355-PWQ-9270',
              '881-355-PWQ-9276','881-355-PWQ-9282','881-355-PWQ-9288','881-355-PWQ-9294')
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
      AS x,'3단계송수펌프동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE 
    ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-4101','881-355-PWQ-4102','881-355-PWQ-4103')
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
      AS x,'송수펌프동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
    ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9144','881-355-PWQ-9150','881-355-PWQ-9156','881-355-PWQ-9162','881-355-PWQ-9168',
                '881-355-PWQ-9174','881-355-PWQ-9180','881-355-PWQ-9186','881-355-PWQ-9192')
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
      AS x,'약품동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
    ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9000','881-355-PWQ-9006','881-355-PWQ-9012','881-355-PWQ-9018','881-355-PWQ-9048')
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
      AS x,'배출수동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
    ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9096')
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
      AS x,'농축조동' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
    ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('881-355-PWQ-9132','881-355-PWQ-9138')
    GROUP BY 
      ${reqbody.search3 === "h" ? "ts" : ""}
      ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
      ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
      ${reqbody.search3 === "y" ? "YEAR(ts)" : ""}
  `;

  return query;
}

exports.selectZoneUseList_sum = (reqbody) => {
  logger.info('selectZoneUseList_sum reqbody > ', reqbody);
  let query = `
    SELECT MAX(X) x, zone_name, SUM(Y) y
    FROM 
    (
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""} 
        AS x,'3단계착수정동' zone_name, ROUND(SUM(VALUE),2) AS y
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
        AS x,'3단계여과지동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9204','881-355-PWQ-9210')
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
        AS x,'여과지동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9054','881-355-PWQ-9060','881-355-PWQ-9066','881-355-PWQ-9072')
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
        AS x,'탈수기동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9078','881-355-PWQ-9084','881-355-PWQ-9120','881-355-PWQ-9126',
                '881-355-PWQ-9102','881-355-PWQ-9108','881-355-PWQ-9114','881-355-PWQ-9090')
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
        AS x,'3단계농축슬러지펌프동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9306','881-355-PWQ-9312','881-355-PWQ-9318')
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
        AS x,'3단계정수지동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9216','881-355-PWQ-9222','881-355-PWQ-9228','881-355-PWQ-9234','881-355-PWQ-9240',
                '881-355-PWQ-9246','881-355-PWQ-9252','881-355-PWQ-9258','881-355-PWQ-9264','881-355-PWQ-9270',
                '881-355-PWQ-9276','881-355-PWQ-9282','881-355-PWQ-9288','881-355-PWQ-9294')
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
        AS x,'3단계송수펌프동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-4101','881-355-PWQ-4102','881-355-PWQ-4103')
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
        AS x,'송수펌프동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9144','881-355-PWQ-9150','881-355-PWQ-9156','881-355-PWQ-9162','881-355-PWQ-9168',
                  '881-355-PWQ-9174','881-355-PWQ-9180','881-355-PWQ-9186','881-355-PWQ-9192')
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
        AS x,'약품동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9000','881-355-PWQ-9006','881-355-PWQ-9012','881-355-PWQ-9018','881-355-PWQ-9048')
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
        AS x,'배출수동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9096')
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
        AS x,'농축조동' zone_name, ROUND(SUM(VALUE),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('881-355-PWQ-9132','881-355-PWQ-9138')
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

