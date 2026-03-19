const logger = require('../logger').logger;

exports.sisul_sunsi = () => {
  /*
  에너지사용현황>시설별사용량("시설별사용량", sisul_sunsi)
  */
  let query = `
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'착수' zone_name, ROUND(SUM(VALUE*0.001),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN ('xxx-xxx-PWI-xxxx','xxx-xxx-PWI-xxxx') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'1단계약품' zone_name, ROUND(SUM(VALUE*0.001),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9100' ,'606-354-PWI-9106','606-354-PWI-9112','606-354-PWI-9118')
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'2단계약품' zone_name, ROUND(SUM(VALUE*0.001),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9124' ,'606-354-PWI-9130','606-354-PWI-9136','606-354-PWI-9142')
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'1단계혼화응집' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9208' ,'606-354-PWI-9214') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'1단계침전' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9148' ,'606-354-PWI-9154') 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS X,'2단계혼화응집' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9244')	 
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'2단계침전' zone_name, ROUND(SUM(VALUE*0.001),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9244')
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계혼화응집1' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9250' ,'606-354-PWI-9256')	
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계침전1' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9376' ,'606-354-PWI-9376')	
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계약품' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9112' ,'606-354-PWI-9118')
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'여과' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9274' ,'606-354-PWI-9280')		
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계혼화응집2' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9250' ,'606-354-PWI-9256')			
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'3단계침전2' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('606-354-PWI-9262' ,'606-354-PWI-9268')
    UNION
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'소독' zone_name, ROUND(SUM(VALUE),2) AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN ('xxx-xxx-PWI-xxxx' ,'xxx-xxx-PWI-xxxx')
  `

  return query
}

/*
  에너지사용현황>시설별사용량("순시전력챠트(팝업)", sunsiChart)
*/
exports.sunsiChart = (reqbody) => {
  logger.info('sunsiChart reqbody > ', reqbody);
  let query = `
    ${reqbody.search === '착수' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '착수' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('xxx-xxx-PWI-xxxx','xxx-xxx-PWI-xxxx')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '1단계약품' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '생활약품' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9100' ,'606-354-PWI-9106','606-354-PWI-9112','606-354-PWI-9118')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '2단계약품' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '공업약품' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9124' ,'606-354-PWI-9130','606-354-PWI-9136','606-354-PWI-9142')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '1단계혼화응집' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '공업혼화응집' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI9208' ,'606-354-PWI-9214')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '1단계침전' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '공업침전' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9148' ,'606-354-PWI-9154')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '2단계혼화응집' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '생활혼화응집' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9244')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '2단계침전' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '생활침전' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9244')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계혼화응집1' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '여과' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9250' ,'606-354-PWI-9256')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계침전1' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '여과' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9376' ,'606-354-PWI-9376')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계약품' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '여과' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9112' ,'606-354-PWI-9118')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '여과' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '여과' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9274' ,'606-354-PWI-9280')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계혼화응집2' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '여과' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9250' ,'606-354-PWI-9256')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '3단계침전2' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '여과' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('606-354-PWI-9262' ,'606-354-PWI-9268')
      GROUP BY ts
    ` : ''}
    
    ${reqbody.search === '소독' ? `
      SELECT 
        DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,
        '여과' zone_name, 
        ROUND(SUM(VALUE*0.001),2) AS Y
      FROM TB_DATA_RAW_TAG
      WHERE ts >= DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND ts <= DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:00') 
        AND tagname IN ('xxx-xxx-PWI-xxxx' ,'xxx-xxx-PWI-xxxx')
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
      AS x,'착수' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('xxx-xxx-PWQ-xxxx' ,'xxx-xxx-PWQ-xxxx')
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
      AS X,'1단계약품' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9100' ,'606-354-PWQ-9106','606-354-PWQ-9112','606-354-PWQ-9118')
    GROUP BY YEAR(ts)
    UNION
    SELECT 
      ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""}  
      AS X,'2단계약품' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9124' ,'606-354-PWQ-9130','606-354-PWQ-9136','606-354-PWQ-9142')
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
      AS x,'1단계혼화응집' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9208' ,'606-354-PWQ-9214')
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
      AS x,'1단계침전' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9148' ,'606-354-PWQ-9154')						
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
      AS x,'2단계혼화응집' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9244')						
    GROUP BY 
      ${reqbody.search3 === "h" ? "ts" : ""}
      ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
      ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
      ${reqbody.search3 === "y" ? "YEAR(ts)" : ""}
    UNION ALL
    SELECT 
      ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""}  
      AS x,'2단계침전' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9244')						
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
      AS x,'3단계혼화응집1' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9250' ,'606-354-PWQ-9256')						
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
      AS x,'3단계침전1' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9376' ,'606-354-PWQ-9376')
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
      AS x,'3단계약품' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9112' ,'606-354-PWQ-9118')
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
      AS x,'여과' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9274' ,'606-354-PWQ-9280')
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
      AS x,'3단계혼화응집2' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9250' ,'606-354-PWQ-9256')
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
      AS x,'3단계침전2' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('606-354-PWQ-9262' ,'606-354-PWQ-9268')
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
      AS x,'소독' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('xxx-xxx-PWQ-xxxx' ,'xxx-xxx-PWQ-xxxx')
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
    SELECT MAX(X) x,zone_name, SUM(Y) y 
    FROM 
    (
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""}  
        AS x,'착수' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS Y
      FROM 	TB_DATA_RAW_TAG_PWQ_HOUR 	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('xxx-xxx-PWQ-xxxx' ,'xxx-xxx-PWQ-xxxx')
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
        AS X,'1단계약품' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9100' ,'606-354-PWQ-9106','606-354-PWQ-9112','606-354-PWQ-9118')
      GROUP BY YEAR(ts)
      UNION
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""}  
        AS X,'2단계약품' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9124' ,'606-354-PWQ-9130','606-354-PWQ-9136','606-354-PWQ-9142')
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
        AS x,'1단계혼화응집' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9208' ,'606-354-PWQ-9214')
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
        AS x,'1단계침전' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9148' ,'606-354-PWQ-9154')						
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
        AS x,'2단계혼화응집' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9244')						
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""}
      UNION ALL
      SELECT 
        ${reqbody.search3 === "h" ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
        ${reqbody.search3 === "d" ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
        ${reqbody.search3 === "m" ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
        ${reqbody.search3 === "y" ? "DATE_FORMAT(ts,'%Y')" : ""}  
        AS x,'2단계침전' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9244')						
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
        AS x,'3단계혼화응집1' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9250' ,'606-354-PWQ-9256')						
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
        AS x,'3단계침전1' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9376' ,'606-354-PWQ-9376')
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
        AS x,'3단계약품' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9112' ,'606-354-PWQ-9118')
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
        AS x,'여과' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9274' ,'606-354-PWQ-9280')
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
        AS x,'3단계혼화응집2' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9250' ,'606-354-PWQ-9256')
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
        AS x,'3단계침전2' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('606-354-PWQ-9262' ,'606-354-PWQ-9268')
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
        AS x,'소독' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG_PWQ_HOUR	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN ('xxx-xxx-PWQ-xxxx' ,'xxx-xxx-PWQ-xxxx')
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""}
    ) AS a
    GROUP BY zone_name;  
  `;

  return query;
}

