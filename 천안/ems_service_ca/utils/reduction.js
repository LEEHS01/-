/*
  에너지절감관리>절감목표 달성현황("1,2,3,4", getUsageData)
*/
exports.usageDataQuery = (params) => {
  // 
  let query = `
    SELECT 
       SUM(CASE WHEN (t.ts >= '${params.mStr01}' AND t.ts <= '${params.mEnd01}') THEN t.VALUE END) AS '1월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr02}' AND t.ts <= '${params.mEnd02}') THEN t.VALUE END) AS '2월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr03}' AND t.ts <= '${params.mEnd03}') THEN t.VALUE END) AS '3월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr04}' AND t.ts <= '${params.mEnd04}') THEN t.VALUE END) AS '4월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr05}' AND t.ts <= '${params.mEnd05}') THEN t.VALUE END) AS '5월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr06}' AND t.ts <= '${params.mEnd06}') THEN t.VALUE END) AS '6월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr07}' AND t.ts <= '${params.mEnd07}') THEN t.VALUE END) AS '7월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr08}' AND t.ts <= '${params.mEnd08}') THEN t.VALUE END) AS '8월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr09}' AND t.ts <= '${params.mEnd09}') THEN t.VALUE END) AS '9월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr10}' AND t.ts <= '${params.mEnd10}') THEN t.VALUE END) AS '10월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr11}' AND t.ts <= '${params.mEnd11}') THEN t.VALUE END) AS '11월'
      ,SUM(CASE WHEN (t.ts >= '${params.mStr12}' AND t.ts <= '${params.mEnd12}') THEN t.VALUE END) AS '12월'
      ,G.*
    FROM (SELECT * FROM TB_DATA_RAW_TAG
            WHERE tagname IN ('881-355-PWI-7485','881-355-PWI-7508')      
            -- AND YEAR(TS) = ${params.year}
            AND ts >= CONCAT('${params.year}','-01-01 00:00:00') AND ts <= CONCAT('${params.year}','-12-31 23:59:00')
          ) AS t ,
	    (SELECT 1m,2m,3m,4m,5m,6m,7m,8m,9m,10m,11m,12m FROM TB_GOALSETTING WHERE YEAR=${params.year}) g 
   
  `

  return query
}