/*
  에너지절감관리>절감목표 달성현황("1,2,3,4", getUsageData)
*/
exports.usageDataQuery = (params) => {
  // 
  let query = `
    SELECT 
      CASE WHEN (t.ts >= '${params.mStr01}' AND t.ts <= '${params.mEnd01}') THEN nvl(SUM(t.VALUE),0) END AS '1월'
      ,CASE WHEN (t.ts >= '${params.mStr02}' AND t.ts <= '${params.mEnd02}') THEN nvl(SUM(t.VALUE),0) END AS '2월'
      ,CASE WHEN (t.ts >= '${params.mStr03}' AND t.ts <= '${params.mEnd03}') THEN nvl(SUM(t.VALUE),0) END AS '3월'
      ,CASE WHEN (t.ts >= '${params.mStr04}' AND t.ts <= '${params.mEnd04}') THEN nvl(SUM(t.VALUE),0) END AS '4월'
      ,CASE WHEN (t.ts >= '${params.mStr05}' AND t.ts <= '${params.mEnd05}') THEN nvl(SUM(t.VALUE),0) END AS '5월'
      ,CASE WHEN (t.ts >= '${params.mStr06}' AND t.ts <= '${params.mEnd06}') THEN nvl(SUM(t.VALUE),0) END AS '6월'
      ,CASE WHEN (t.ts >= '${params.mStr07}' AND t.ts <= '${params.mEnd07}') THEN nvl(SUM(t.VALUE),0) END AS '7월'
      ,CASE WHEN (t.ts >= '${params.mStr08}' AND t.ts <= '${params.mEnd08}') THEN nvl(SUM(t.VALUE),0) END AS '8월'
      ,CASE WHEN (t.ts >= '${params.mStr09}' AND t.ts <= '${params.mEnd09}') THEN nvl(SUM(t.VALUE),0) END AS '9월'
      ,CASE WHEN (t.ts >= '${params.mStr10}' AND t.ts <= '${params.mEnd10}') THEN nvl(SUM(t.VALUE),0) END AS '10월'
      ,CASE WHEN (t.ts >= '${params.mStr11}' AND t.ts <= '${params.mEnd11}') THEN nvl(SUM(t.VALUE),0) END AS '11월'
      ,CASE WHEN (t.ts >= '${params.mStr12}' AND t.ts <= '${params.mEnd12}') THEN NVL(SUM(t.VALUE),0) END AS '12월'
      ,G.*
    FROM TB_DATA_RAW_TAG AS t, 
      (
      SELECT * 
      FROM TB_GOALSETTING
        WHERE YEAR = ${params.year}
    ) G
    -- WHERE tagname IN('745-617-PWQ-4000','745-617-PWQ-4100')  /* 특고압반 유효전력량  */
    WHERE tagname IN('606-354-PWI-9500','606-354-PWI-9520')	/* 아산정수장 고압반 유효전력 */
  `

  return query
}