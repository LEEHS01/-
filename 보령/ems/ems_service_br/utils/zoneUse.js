const logger = require('../logger').logger;

exports.sisul_sunsi = () => {
  /*
  에너지사용현황>시설별사용량("시설별사용량", sisul_sunsi)
  */
  let query = `
    SELECT t2.x, t1.zone_name, nvl(t2.y,0.00) y
  from
  (
	SELECT '수변전실' AS zone_name
	UNION ALL 
	SELECT '송수펌프동' AS zone_name
	UNION ALL 
	SELECT '약품동' AS zone_name
	UNION ALL 
   SELECT '배출수동' AS zone_name
   UNION ALL 
   SELECT '회수펌프동' AS zone_name
   UNION ALL 
   SELECT '기타분전반' AS zone_name
  ) t1 LEFT OUTER join
  (
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'수변전실' zone_name, nvl(ROUND(VALUE,2),'0') AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN ('600-359-PAI-0508') 
    UNION all
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'송수펌프동' zone_name, nvl(ROUND(VALUE,2),'0') AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN (
               '600-359-PAI-1408',
					'600-359-PAI-1508',
					'600-359-PAI-1608',
					'600-359-PAI-1708',
					'600-359-PAI-1808',
					'600-359-PAI-1908',
					'600-359-PAI-2008',
					'600-359-PAI-2108',
					'600-359-PAI-2208',
					'600-359-PAI-3231',
					'600-359-PAI-3246',
					'600-359-PAI-3261'
              ) 
    UNION all
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS X,'약품동' zone_name, nvl(ROUND(VALUE,2),'0') AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN (
			'600-359-PAI-3111',
			'600-359-PAI-3126',
			'600-359-PAI-3141',
			'600-359-PAI-3156'

			) 
    UNION all
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS X,'배출수동' zone_name, nvl(ROUND(VALUE,2),'0') AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN (
	 			'600-359-PAI-3171',
				'600-359-PAI-3186',
				'600-359-PAI-3201',
				'600-359-PAI-3216'

				 ) 
    UNION all
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x,'회수펌프동' zone_name, nvl(ROUND(VALUE,2),'0') AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    AND tagname IN (
            '600-359-PAI-3276',
				'600-359-PAI-3291',
				'600-359-PAI-3306'

            )
   UNION all
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS X,'기타분전반' zone_name, nvl(ROUND(VALUE,2),'0') AS y
    FROM TB_DATA_RAW_TAG
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
      AND tagname IN (
						'600-359-PAI-3321',
						'600-359-PAI-3336',
						'600-359-PAI-3351'
			)      
	) t2 ON t1.zone_name = t2.zone_name	 

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
        AND tagname IN ('600-359-PWI-5100')
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
      AS x,'수변전실' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM 	TB_DATA_RAW_TAG 	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN ('600-359-PAI-0508')   
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
      AS X,'송수펌프동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y   
    FROM TB_DATA_RAW_TAG	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN (
                      '600-359-PAI-1408',
                      '600-359-PAI-1508',
                      '600-359-PAI-1608',
                      '600-359-PAI-1708',
                      '600-359-PAI-1808',
                      '600-359-PAI-1908',
                      '600-359-PAI-2008',
                      '600-359-PAI-2108',
                      '600-359-PAI-2208',
                      '600-359-PAI-3231',
                      '600-359-PAI-3246',
                      '600-359-PAI-3261'

                      )   
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
      AS X,'여과동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y   
    FROM TB_DATA_RAW_TAG	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN (
                      '600-359-PAI-2008',
                      '600-359-PAI-2108',
                      '600-359-PAI-2208'
                      )   
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
      AS x,'약품동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN (
                        '600-359-PAI-3111',
                        '600-359-PAI-3126',
                        '600-359-PAI-3141',
                        '600-359-PAI-3156'
                      )  
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
      AS X,'배출수동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y	
    FROM TB_DATA_RAW_TAG	/* 전력적산 */
    WHERE 
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN (
                        '600-359-PAI-3171',
                        '600-359-PAI-3186',
                        '600-359-PAI-3201',
                        '600-359-PAI-3216'

        )  
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
      AS X,'회수펌프동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN (
              '600-359-PAI-3276',
              '600-359-PAI-3291',
              '600-359-PAI-3306'

                    )   
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
      AS X,'기타분전반' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
    FROM TB_DATA_RAW_TAG	/* 전력적산 */
    WHERE
      ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
        `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
      ${reqbody.search3 === "m" ?
        `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
      ${reqbody.search3 === "y" ?
        `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
      AND tagname IN (
              '600-359-PAI-3321',
              '600-359-PAI-3336',
              '600-359-PAI-3351'

              )   
    GROUP BY 
      ${reqbody.search3 === "h" ? "ts" : ""}
      ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
      ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
      ${reqbody.search3 === "y" ? "YEAR(ts)" : ""}

  `;

   //console.log(query)
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
        AS x,'수변전실' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM 	TB_DATA_RAW_TAG 	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN (
                        '600-359-PAI-0508'
                        )   
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
        AS X,'송수펌프동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y   
      FROM TB_DATA_RAW_TAG	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN (
                        '600-359-PAI-1408',
                        '600-359-PAI-1508',
                        '600-359-PAI-1608',
                        '600-359-PAI-1708',
                        '600-359-PAI-1808',
                        '600-359-PAI-1908',
                        '600-359-PAI-2008',
                        '600-359-PAI-2108',
                        '600-359-PAI-2208',
                        '600-359-PAI-3231',
                        '600-359-PAI-3246',
                        '600-359-PAI-3261'
                        )   
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
        AS X,'여과동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y   
      FROM TB_DATA_RAW_TAG	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN (
                        '600-359-PAI-2008',
                        '600-359-PAI-2108',
                        '600-359-PAI-2208'
                        )   
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
        AS x,'약품동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN (
                        '600-359-PAI-3111',
                        '600-359-PAI-3126',
                        '600-359-PAI-3141',
                        '600-359-PAI-3156'

                        )   
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
        AS X,'배출수동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y	
      FROM TB_DATA_RAW_TAG	/* 전력적산 */
      WHERE 
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN (
                      '600-359-PAI-3171',
                      '600-359-PAI-3186',
                      '600-359-PAI-3201',
                      '600-359-PAI-3216'

                      )   
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
        AS X,'회수펌프동' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN (
                '600-359-PAI-3276',
                '600-359-PAI-3291',
                '600-359-PAI-3306'

                        )   
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
        AS X,'기타분전반' zone_name, ROUND(SUM(nvl(VALUE,0)),2) AS y
      FROM TB_DATA_RAW_TAG	/* 전력적산 */
      WHERE
        ${reqbody.search3 === "h" || reqbody.search3 === "d" ?
          `ts >= CONCAT('${reqbody.search}',' 00:00:00') AND ts <= CONCAT('${reqbody.search2}',' 23:59:00')` : ""}
        ${reqbody.search3 === "m" ?
          `ts >= CONCAT('${reqbody.search}-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-31 23:59:00')` : ""}
        ${reqbody.search3 === "y" ?
          `ts >= CONCAT('${reqbody.search}-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}-12-31 23:59:00')` : ""}
        AND tagname IN (
                '600-359-PAI-3321',
                '600-359-PAI-3336',
                '600-359-PAI-3351'

                        )   
      GROUP BY 
        ${reqbody.search3 === "h" ? "ts" : ""}
        ${reqbody.search3 === "d" ? "DATE(ts)" : ""}
        ${reqbody.search3 === "m" ? "MONTH(ts)" : ""}
        ${reqbody.search3 === "y" ? "YEAR(ts)" : ""}

    )a
    GROUP BY zone_name	  
  `;

  // console.log('ggg: ', query)
  return query;
}

