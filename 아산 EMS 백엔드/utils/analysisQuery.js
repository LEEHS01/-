const queries = {
  // AI분석 > 송수펌프 제어 > 송수펌프제어  분석(6, savingChart)
  chart_query: `
    SELECT *
    FROM 
    (
      SELECT b.ts, b.savingKwh, FORMAT(b.savingUnit,2) unit
      FROM TB_BASE_SAVING_CHART a,
            TB_RST_SAVINGS_TARGET b
      WHERE DATE_FORMAT(a.ts,'%m-%d') = DATE_FORMAT(b.ts,'%m-%d') 
        AND b.ts <= DATE_ADD(CURRENT_DATE(), INTERVAL -1 DAY)
      ORDER BY b.ts DESC
      LIMIT 14
    )a
    ORDER BY ts  
  `
  ,
  // pumpSelect(analyPrediction)
  predic_query1: `
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
  `,
  // pumpSelect2
  predic_query2: `
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
  ,
  // pumpSelect3
  predic_query3: `
    SELECT 
      MAX(CASE WHEN tag = '606-354-EMS-9000' THEN value END) AS 당진공업분석결과예상관압,
      MAX(CASE WHEN tag = '606-354-EMS-9001' THEN value END) AS 당진공업분석결과예상유량,
      MAX(CASE WHEN tag = '606-354-EMS-9002' THEN value END) AS 당진생활분석결과예상관압,
      MAX(CASE WHEN tag = '606-354-EMS-9003' THEN value END) AS 당진생활분석결과예상유량,
      MAX(CASE WHEN tag = '606-354-EMS-9505' THEN value END) AS 당진생활예측전력,
    /* 화면에서 필요없으면 삭제 요망
      MAX(CASE WHEN tag = '' THEN value END) AS p_TUBE_PRSR_PRDCT,
      MAX(CASE WHEN tag = '' THEN value END) AS p_PRDCT_MEAN,
      MAX(CASE WHEN tag = '' THEN value END) AS p_PWR_PRDCT,
    */  
      MAX(CASE WHEN tag = '606-354-EMS-9101' THEN value END) AS 변속펌프1가동상태운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9102' THEN value END) AS 변속펌프2가동상태운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9301' THEN value END) AS 변속펌프1가동상태운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9302' THEN value END) AS 변속펌프2가동상태운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9303' THEN value END) AS 변속펌프3가동상태운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9304' THEN value END) AS 변속펌프4가동상태운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9201' THEN value END) AS 변속펌프1주파수운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9202' THEN value END) AS 변속펌프2주파수운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9401' THEN value END) AS 변속펌프1주파수운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9402' THEN value END) AS 변속펌프2주파수운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9403' THEN value END) AS 변속펌프3주파수운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9404' THEN value END) AS 변속펌프4주파수운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9103' THEN value END) AS 정속펌프1가동상태운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9104' THEN value END) AS 정속펌프2가동상태운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9105' THEN value END) AS 정속펌프3가동상태운영_공업,	 
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영대수,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영모드,
      COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압정수장,
    COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압분기점
    FROM (
      SELECT 
          tag,
          VALUE,
          ROW_NUMBER() OVER (PARTITION BY tag ORDER BY time DESC) AS rn
      FROM TB_PTR_CTR_ANLY_RST
      WHERE tag IN ('606-354-EMS-9000','606-354-EMS-9002','606-354-EMS-9001',
              '606-354-EMS-9003','606-354-EMS-9002','606-354-EMS-9003',
              '606-354-EMS-9505','606-354-EMS-9101','606-354-EMS-9102',
              '606-354-EMS-9302','606-354-EMS-9303','606-354-EMS-9304',
              '606-354-EMS-9201','606-354-EMS-9202','606-354-EMS-9402',
              '606-354-EMS-9403','606-354-EMS-9404','606-354-EMS-9103',
              '606-354-EMS-9104','606-354-EMS-9105','606-354-EMS-9301',
              'xxx-xxx-EMS-xxxx','xxx-xxx-EMS-xxxx','xxx-xxx-EMS-xxxx',
              'xxx-xxx-EMS-xxxx')
        AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1;
  `
  ,
  // selectPumpStatus(analyPump)
  pump_query1: `
    SELECT 
      (
        SELECT CONCAT(s_id,sp_id)
        FROM TB_MST_SUPPLY_PUMP b
        WHERE a.tagname = b.SP_ONOFF_STTS
      ) NAME
      ,value AS VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts = 
          (
            SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
            FROM TB_DATA_RAW_TAG
          ) 
        AND tagname IN (
                    SELECT SP_ONOFF_STTS  -- 펌프작동여부태그
                    FROM TB_MST_SUPPLY_PUMP
                  )
  `,
  // selectPumpStatus1
  pump_query2: `
    SELECT
      case tagname
        when '606-485-PRI-8006' then '당진공업토출압력'
        when '606-485-PRI-8001' then '당진생활토출압력'
      ELSE 'X'
      END NAME
    ,VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts =
        (
          SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
          FROM TB_DATA_RAW_TAG
        )
      AND tagname IN (
                  SELECT SP_PMP_PR	/* 전체압력태그: 계통송수압력태그를 의미한다 */
                  FROM TB_MST_SUPPLY_PUMP
                )
  `,
  // selectPumpStatus2
  pump_query3: `
    SELECT 
      CASE WHEN tagname = '606-485-FRI-8005' THEN '공업유량' ELSE '생활유량' END NAME
    ,VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts = 
        (
          SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
          FROM TB_DATA_RAW_TAG
        ) 
      AND tagname IN (
                  SELECT SP_PMP_FR /* 유량태그: 계통 송수유량순시를 의미한다  */
                  FROM TB_MST_SUPPLY_PUMP
                )
  `,
  // selectPumpStatus3
  pump_query4: `
    SELECT
      CASE WHEN tagname = '606-485-SPB-9103' THEN '당진공업1 주파수'
          WHEN tagname = '606-485-SPB-9104' THEN '당진공업2 주파수'
          when tagname = '606-485-PMI-8010' THEN '당진생활1 주파수'
          when tagname = '606-485-PMI-8026' THEN '당진생활2 주파수'
          when tagname = '606-485-PMI-8045' THEN '당진생활3 주파수'
          when tagname = '606-485-PMI-8053' THEN '당진생활4 주파수'
        ELSE '태그없음'
      END as NAME
    ,VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts = (
          SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
          FROM TB_DATA_RAW_TAG
          )
      AND tagname IN (
                  SELECT SP_HZ_STTS	/* 주파수태그 */
                  FROM TB_MST_SUPPLY_PUMP
                )
  `,
  // selectPumpStatus4
  pump_query5:`
    SELECT *
    FROM 
    (
      SELECT SUM(a) '정속가동대수'
      FROM 
      (
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE 
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              ) 
          AND tagname IN ('606-485-PMB-8530') 	/* 송수펌프 ON 태그를 의미 */
        UNION ALL
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE 
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              ) 
        AND tagname IN ('606-485-PMB-8531')	/* 송수펌프 ON 태그를 의미 */ 
        UNION ALL
        SELECT VALUE a
        FROM TB_DATA_RAW_TAG a
        WHERE 
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              ) 
          AND tagname IN ('606-485-PMB-8532') /* 송수펌프 ON 태그를 의미 */
      )t
    )g,
    (
      SELECT SUM(a) '변속가동대수'
      FROM 
      (
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE 
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              ) 
          AND tagname IN ('606-485-PMB-8528') /* 송수펌프 ON 태그를 의미 */
        UNION ALL
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE 
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              ) 
          AND tagname IN ('606-485-PMB-8529') /* 송수펌프 ON 태그를 의미 */
        
      )t
    )h
  `
  ,
  // selectPumpStatus5
  pump_query6: `
    SELECT *
    FROM
    (
      SELECT IFNULL(VALUE,0) '공업전력1'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              )
      AND tagname IN ('606-485-PAI-2208') /* 당진(가)공업, 1,2호기 교대로 해당 태그 사용 */
    )a LEFT JOIN
    (
      SELECT IFNULL(VALUE,0) '공업전력2'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
      ) AND tagname IN ('606-485-PAI-2208') /* 당진(가)공업, 1,2호기 교대로 해당 태그 사용 */
    )b ON 1=1
    LEFT JOIN
    (
      SELECT '0' 공업전력3
    -- FROM TB_DATA_RAW_TAG a
    -- WHERE ts = (
    -- SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
    -- FROM TB_DATA_RAW_TAG) AND tagname IN ('745-617-PWI-4450') /* 당진(가)공업, 3호기 태그는 없음 */
      
    )c ON 1=1
    LEFT JOIN
    (
      SELECT '0' 공업전력4
    -- FROM TB_DATA_RAW_TAG a
    -- WHERE ts = (
    -- SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
    -- FROM TB_DATA_RAW_TAG) AND tagname IN ('745-617-PWI-4500') /* 당진(가)공업, 4호기 태그는 없음 */
    )d ON 1=1
    LEFT JOIN
    (
      SELECT 0 '공업전력5'
    --	FROM TB_DATA_RAW_TAG a
    --	WHERE ts = (
    --	SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
    --	FROM TB_DATA_RAW_TAG) AND tagname IN ('745-617-PWI-4500') /* 당진(가)공업, 5호기 태그는 없음 */
    )d_1 ON 1=1
    LEFT JOIN
    (
      SELECT IFNULL(sum(VALUE),0) '생활전력1'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
      SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
      FROM TB_DATA_RAW_TAG) AND tagname IN ('606-485-PWI-9540', '606-485-PWI-9560') /* 당진(가)생활, 1,2,3호기 펌프를 교대로 사용하며, 하나의 태그로 사용 */
    )e ON 1=1
    LEFT JOIN
    (
      SELECT IFNULL(sum(VALUE),0) '생활전력2'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
      SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
      FROM TB_DATA_RAW_TAG) AND tagname IN ('606-485-PWI-9540', '606-485-PWI-9560') /* 당진(가)생활, 1,2,3호기 펌프를 교대로 사용하며, 하나의 태그로 사용 */
    )f ON 1=1
    LEFT JOIN
    (
      SELECT IFNULL(sum(VALUE),0) '생활전력3'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
      SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
      FROM TB_DATA_RAW_TAG) AND tagname IN ('606-485-PWI-9540', '606-485-PWI-9560') /* 당진(가)생활, 1,2,3호기 펌프를 교대로 사용하며, 하나의 태그로 사용 */
    )g ON 1=1
    LEFT JOIN
    (
      SELECT 0 '생활전력4'
    --	FROM TB_DATA_RAW_TAG a
    --	WHERE ts = (
    --	SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
    --	FROM TB_DATA_RAW_TAG) AND tagname IN ('745-617-PWI-9100') /* 당진(가)생활, 4호기 태그는 없음 */
    )h ON 1=1
  `
  ,
  // selectPumpStatus6
  pump_query7:`
  SELECT zone, value
    FROM (
        SELECT 
            CASE 
                WHEN tagname = '606-354-FRI-9001' THEN 'CGN대산유량'
                WHEN tagname = '606-354-FRI-8052' THEN '석문분기생활용수유량'
                WHEN tagname = '606-485-FRI-4401' THEN '대산원수유입유량'
                WHEN tagname = '606-485-FRI-9800' THEN '송산2관로분기점유량'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '606-354-FRI-9001','606-354-FRI-8052','606-485-FRI-4401','606-485-FRI-9800'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -60 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '606-354-FRI-9001','606-354-FRI-8052','606-485-FRI-4401','606-485-FRI-9800'
    );
  `
,
  // selectValve
  valve_query: `
    SELECT
      R_ID AS TNK_GRP_NM,
      GROUP_CONCAT(RT_FO_STTS),
      IFNULL
      (
      GROUP_CONCAT(
        (
          SELECT value
          FROM TB_DATA_RAW_TAG
          WHERE tagname = RT_FO_STTS
            AND ts = (
                    SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                      FROM TB_DATA_RAW_TAG
                  )
        )
      )
      ,0)	 'FO',
      GROUP_CONCAT(RT_FC_STTS),

      IFNULL(
      GROUP_CONCAT(
          (
          SELECT value
          FROM TB_DATA_RAW_TAG
          WHERE tagname = RT_FC_STTS
            AND ts = (
                    SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                    FROM TB_DATA_RAW_TAG
                  )
        )
      )
      ,0)'FC',

      GROUP_CONCAT(RT_OV_STTS),
      GROUP_CONCAT(
        (
          SELECT value
          FROM TB_DATA_RAW_TAG
          WHERE tagname = RT_OV_STTS
          AND ts = (
                  SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                  FROM TB_DATA_RAW_TAG
                )
        )
      ) '개도율',
      RT_WTR_LVL AS LEI_TAG,
      (
        SELECT value
        FROM TB_DATA_RAW_TAG
        WHERE tagname = RT_WTR_LVL
          AND ts = (
                  SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                  FROM TB_DATA_RAW_TAG
                )
      ) '수위',
      RT_IN_FR AS IN_FLW_TAG,
    
      (
        SELECT value
        FROM TB_DATA_RAW_TAG
        WHERE tagname = RT_IN_FR
          AND ts =(
                  SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                  FROM TB_DATA_RAW_TAG
                )
      ) '유입유량',
      RT_OUT_FR AS OUT_FLW_TAG,
      (
        SELECT value
        FROM TB_DATA_RAW_TAG
        WHERE tagname = RT_OUT_FR
          AND ts = (
                  SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                  FROM TB_DATA_RAW_TAG
                )
      ) '유출유량',
      RT_MIN_RQRMN_PR '최소요구관압',
      RT_WTR_LVL_LCL '운영수위하한',
      RT_WTR_LVL_UCL '운영수위 상한',
      '' AS  '경부하운영수위하한',
      '' AS '경부하운영수위상한',
      '' AS '수저체적',
      '' AS '수조저수위',
      '' AS '수조고수위'
    FROM TB_MST_RESERVOIR_TANK t
    WHERE 1=1
    GROUP BY RT_WTR_LVL
    ORDER BY RT_MIN_RQRMN_PR DESC
  `
}

module.exports = queries;