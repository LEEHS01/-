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
  predic_query3_br: `
    SELECT 
      MAX(CASE WHEN tag = '606-359-EMS-9000' THEN value END) AS 보령분석결과예상관압,
      MAX(CASE WHEN tag = '606-359-EMS-9001' THEN value END) AS 보령분석결과예상유량,
      MAX(CASE WHEN tag = '606-359-EMS-9002' THEN value END) AS 보령분석결과예상전력,
      MAX(CASE WHEN tag = '606-359-EMS-9101' THEN value END) AS 정속펌프1가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9102' THEN value END) AS 정속펌프2가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9103' THEN value END) AS 정속펌프3가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9104' THEN value END) AS 정속펌프4가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9105' THEN value END) AS 정속펌프5가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9106' THEN value END) AS 정속펌프6가동상태운영_보령,
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
      WHERE tag IN ('606-359-EMS-9000','606-359-EMS-9001','606-359-EMS-9002', 
              '606-359-EMS-9101','606-359-EMS-9102','606-359-EMS-9103',
              '606-359-EMS-9104','606-359-EMS-9105','606-359-EMS-9106', 'xxx-xxx-EMS-xxxx')
        AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1
  `,

  // pumpSelect3
  predic_query3_ss: `
    SELECT 
      MAX(CASE WHEN tag = '600-400-EMS-9000' THEN value END) AS 당진분석결과예상관압,
      MAX(CASE WHEN tag = '600-400-EMS-9002' THEN value END) AS 태안분석결과예상관압,
      MAX(CASE WHEN tag = '600-400-EMS-9001' THEN value END) AS 당진분석결과예상유량,
      MAX(CASE WHEN tag = '600-400-EMS-9003' THEN value END) AS 태안분석결과예상유량,
      MAX(CASE WHEN tag = '600-400-EMS-9004' THEN value END) AS 당진분석결과예상전력,
      MAX(CASE WHEN tag = '600-400-EMS-9005' THEN value END) AS 태안분석결과예상전력,
      MAX(CASE WHEN tag = '600-400-EMS-9101' THEN value END) AS 펌프1가동상태운영_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9102' THEN value END) AS 펌프2가동상태운영_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9103' THEN value END) AS 펌프3가동상태운영_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9104' THEN value END) AS 펌프4가동상태운영_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9301' THEN value END) AS 펌프1가동상태운영_태안,
      MAX(CASE WHEN tag = '600-400-EMS-9302' THEN value END) AS 펌프2가동상태운영_태안,
      MAX(CASE WHEN tag = '600-400-EMS-9303' THEN value END) AS 펌프3가동상태운영_태안,
      MAX(CASE WHEN tag = '600-400-EMS-9304' THEN value END) AS 펌프4가동상태운영_태안,
      MAX(CASE WHEN tag = '600-400-EMS-9201' THEN value END) AS 펌프1주파수_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9202' THEN value END) AS 펌프3주파수_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9401' THEN value END) AS 펌프1주파수_태안,
      
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영대수,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영모드,
      COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압정수장,
    COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압분기점
    FROM (
      SELECT 
          tag,
          value,
          ROW_NUMBER() OVER (PARTITION BY tag ORDER BY time DESC) AS rn
      FROM TB_PTR_CTR_ANLY_RST
      WHERE tag IN ('600-400-EMS-9000','600-400-EMS-9002','600-400-EMS-9001', 
              '600-400-EMS-9003','600-400-EMS-9004','600-400-EMS-9005',
              '600-400-EMS-9101','600-400-EMS-9102','600-400-EMS-9103',
              '600-400-EMS-9104','600-400-EMS-9301','600-400-EMS-9302',
              '600-400-EMS-9303','600-400-EMS-9304','600-400-EMS-9201',
              '600-400-EMS-9202','600-400-EMS-9401','xxx-xxx-EMS-xxxx')
      AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1
  `,

  // pumpSelect3
  predic_query3_cy: `
    SELECT 
      MAX(CASE WHEN tag = '600-401-EMS-9000' THEN value END) AS 청양분석결과예상관압,
      MAX(CASE WHEN tag = '600-401-EMS-9001' THEN value END) AS 청양분석결과예상유량,
      MAX(CASE WHEN tag = '600-401-EMS-9002' THEN value END) AS 청양분석결과예상전력,
      MAX(CASE WHEN tag = '600-401-EMS-9101' THEN value END) AS 펌프1가동상태운영_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9102' THEN value END) AS 펌프2가동상태운영_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9103' THEN value END) AS 펌프3가동상태운영_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9201' THEN value END) AS 펌프1주파수_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9202' THEN value END) AS 펌프2주파수_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9203' THEN value END) AS 펌프3주파수_청양,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영대수,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영모드,
      COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압정수장,
    COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압분기점
    FROM (
      SELECT 
          tag,
          value,
          ROW_NUMBER() OVER (PARTITION BY tag ORDER BY time DESC) AS rn
      FROM TB_PTR_CTR_ANLY_RST
      WHERE tag IN ('600-401-EMS-9000','600-401-EMS-9001','600-401-EMS-9002', 
              '600-401-EMS-9101','600-401-EMS-9102','600-401-EMS-9103',
              '600-401-EMS-9201','600-401-EMS-9202','600-401-EMS-9203',
              'xxx-xxx-EMS-xxxx')
        AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1
  `,

  // pumpSelect3
  predic_query3_hs: `
    SELECT 
      MAX(CASE WHEN tag = '600-402-EMS-9000' THEN value END) AS 서산분석결과예상관압,
      MAX(CASE WHEN tag = '600-402-EMS-9001' THEN value END) AS 서산분석결과예상유량,
      MAX(CASE WHEN tag = '600-402-EMS-9004' THEN value END) AS 서산분석결과예상전력,
      MAX(CASE WHEN tag = '600-402-EMS-9002' THEN value END) AS 예산분석결과예상관압,
      MAX(CASE WHEN tag = '600-402-EMS-9003' THEN value END) AS 예산분석결과예상유량,
      MAX(CASE WHEN tag = '600-402-EMS-9005' THEN value END) AS 예산분석결과예상전력,
      MAX(CASE WHEN tag = '600-402-EMS-9101' THEN value END) AS 펌프1가동상태운영_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9102' THEN value END) AS 펌프2가동상태운영_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9103' THEN value END) AS 펌프3가동상태운영_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9104' THEN value END) AS 펌프4가동상태운영_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9105' THEN value END) AS 펌프1가동상태운영_예산,
      MAX(CASE WHEN tag = '600-402-EMS-9106' THEN value END) AS 펌프2가동상태운영_예산,
      MAX(CASE WHEN tag = '600-402-EMS-9107' THEN value END) AS 펌프3가동상태운영_예산,
      MAX(CASE WHEN tag = '600-402-EMS-9108' THEN value END) AS 펌프4가동상태운영_예산,
      MAX(CASE WHEN tag = '600-402-EMS-9201' THEN value END) AS 펌프1주파수_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9202' THEN value END) AS 펌프2주파수_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9205' THEN value END) AS 펌프1주파수_예산,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영대수,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영모드,
      COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압정수장,
    COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압분기점
    FROM (
      SELECT 
          tag,
          value,
          ROW_NUMBER() OVER (PARTITION BY tag ORDER BY time DESC) AS rn
      FROM TB_PTR_CTR_ANLY_RST
      WHERE tag IN ('600-402-EMS-9000','600-402-EMS-9001','600-402-EMS-9004', 
              '600-402-EMS-9002','600-402-EMS-9003','600-402-EMS-9005',
              '600-402-EMS-9101','600-402-EMS-9102','600-402-EMS-9103',
              '600-402-EMS-9104','600-402-EMS-9105','600-402-EMS-9106',
              '600-402-EMS-9107','600-402-EMS-9108','600-402-EMS-9201',
              '600-402-EMS-9202','600-402-EMS-9205','xxx-xxx-EMS-xxxx')
      AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1
  `,

  // selectPumpStatus(analyPump)
  pump_query1_br: `
    /*
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
                    WHERE S_Id = '보령(정)'
                  )
    */
    SELECT
    mst.name, nvl(b.value,0) VALUE
    FROM 
    (	
      SELECT  CONCAT(s_id,sp_id) AS NAME, SP_ONOFF_STTS  -- 펌프작동여부태그
      FROM TB_MST_SUPPLY_PUMP
      WHERE S_Id = '보령(정)'
    ) mst LEFT OUTER JOIN
    (                 
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
                      WHERE S_Id = '보령(정)'
                    )
    ) b ON mst.name = b.name   
  `,

  // selectPumpStatus(analyPump)
  pump_query1_ss: `
  /*
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
                    WHERE S_Id = '서산(가)'
                  )
  */
  SELECT
    mst.name, nvl(b.value,0) VALUE
  FROM 
  (	
    SELECT  CONCAT(s_id,sp_id) AS NAME, SP_ONOFF_STTS  -- 펌프작동여부태그
    FROM TB_MST_SUPPLY_PUMP
    WHERE S_Id = '서산(가)'
  ) mst LEFT OUTER JOIN
  (                 
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
                    WHERE S_Id = '서산(가)'
                  )
  ) b ON mst.name = b.name   
   `,

  // selectPumpStatus(analyPump)
  pump_query1_cy: `
    /*
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
                    WHERE S_Id = '청양(가)'
                  )
  */         
    SELECT
    mst.name, nvl(b.value,0) VALUE
    FROM 
    (	
      SELECT  CONCAT(s_id,sp_id) AS NAME, SP_ONOFF_STTS  -- 펌프작동여부태그
      FROM TB_MST_SUPPLY_PUMP
      WHERE S_Id = '청양(가)'
    ) mst LEFT OUTER JOIN
    (                 
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
                      WHERE S_Id = '청양(가)'
                    )
    ) b ON mst.name = b.name           
  `,

  // selectPumpStatus(analyPump)
  pump_query1_hs: `
    /*
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
                    WHERE S_Id = '홍성(가)'
                  )
                    
    */
  SELECT
    mst.name, nvl(b.value,0) VALUE
  FROM 
  (	
    SELECT  CONCAT(s_id,sp_id) AS NAME, SP_ONOFF_STTS  -- 펌프작동여부태그
    FROM TB_MST_SUPPLY_PUMP
    WHERE S_Id = '홍성(가)'
  ) mst LEFT OUTER JOIN
  (                 
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
                    WHERE S_Id = '홍성(가)'
                  )
  ) b ON mst.name = b.name    
  `,

  // selectPumpStatus1
  pump_query2_br: `
    SELECT 
      CASE tagname
          when '600-359-PRI-4410' then '보령관압'
        ELSE 'X'		
      END NAME
    ,VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts = (
            SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
            FROM TB_DATA_RAW_TAG
            ) 
      AND tagname IN (
                  SELECT SP_PMP_PR	/* 전체압력태그: 계통송수압력태그를 의미한다 */
                  FROM TB_MST_SUPPLY_PUMP
                  WHERE S_ID = '보령(정)'
                ) 
  `,

  // selectPumpStatus1
  pump_query2_ss: `
    SELECT 
      CASE tagname
          when '600-457-PRI-8030' then '당진관압'
        ELSE '태안관압'		
      END NAME
    ,VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts = (
            SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
            FROM TB_DATA_RAW_TAG
            ) 
      AND tagname IN (
                  SELECT SP_PMP_PR	/* 전체압력태그: 계통송수압력태그를 의미한다 */
                  FROM TB_MST_SUPPLY_PUMP
                  WHERE S_ID = '서산(가)'
                ) 
  `,
  
  // selectPumpStatus1
  pump_query2_cy: `
    SELECT 
      CASE tagname
          when '600-459-PRI-8001' then '청양관압'
        ELSE 'X'		
      END NAME
      ,VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
            ) 
        AND tagname IN (
                    SELECT SP_PMP_PR	/* 전체압력태그: 계통송수압력태그를 의미한다 */
                    FROM TB_MST_SUPPLY_PUMP
                    WHERE S_ID = '청양(가)'
                  )
  `,
  
  // selectPumpStatus1
  pump_query2_hs: `
    SELECT
      CASE tagname
          when '600-456-PRI-8030' then '예산관압'
        ELSE '서산관압'		
      END NAME
    ,VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts = (
            SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
            FROM TB_DATA_RAW_TAG
            )
      AND tagname IN (
                  SELECT distinct SP_PMP_PR	/* 전체압력태그: 계통송수압력태그를 의미한다 */
                  FROM TB_MST_SUPPLY_PUMP
                  WHERE S_ID = '홍성(가)'
                )    
  `,
  
  // selectPumpStatus2
  pump_query3_br: `
    SELECT
      case tagname
        when '600-359-FRI-4410' then '보령(정) 유출유량 순시'
        when '600-359-FRI-4310' then '보령(정) 서천방면 유량 순시'
        when '600-359-FRI-8621' then '서천관말(분) 유량'
        when '600-359-FRI-8622' then '서천관말(분) 유량'
        when '600-359-FRI-8650' then '성주미산면(분) 유량순시'
        when '600-359-FRI-8431' then '창동(배) 순시유량'
        ELSE 'X' END NAME
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
                    WHERE s_id = '보령(정)'
                  )
  `,
  // selectPumpStatus2
  pump_query3_ss: `
    SELECT
      case tagname
        when '600-457-FRI-8030' then '당진유량'
        when '600-457-FRI-8020' then '태안유량'
        ELSE 'X' END NAME
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
                    WHERE s_id = '서산(가)'
                  )
  `,
  // selectPumpStatus2
  pump_query3_cy: `
    SELECT
      case tagname
        when '600-459-FRI-8002' then '청양유량'
        ELSE 'X' END NAME
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
                    WHERE s_id = '청양(가)'
                  )
  `,
  // selectPumpStatus2
  pump_query3_hs: `
    SELECT
      case tagname
        when '600-456-FRI-8030' then '예산유량'
        when '600-456-FRI-8040' then '서산유량'
        ELSE 'X' END NAME
      ,VALUE
    FROM TB_DATA_RAW_TAG a
    WHERE ts =
          (
            SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
            FROM TB_DATA_RAW_TAG
          )
        AND tagname IN (
                    SELECT distinct SP_PMP_FR /* 유량태그: 계통 송수유량순시를 의미한다  */
                    FROM TB_MST_SUPPLY_PUMP
                    WHERE s_id = '홍성(가)'
                  )
  `,

  // selectPumpStatus3 :보령 정수장에서는 해당 쿼리 필요없음(정속만 있으므로)
  pump_query4_ss: `
    SELECT
      CASE WHEN tagname = '600-457-XXC-9020' THEN '당진(가) 송수펌프1 주파수'
          when tagname = '600-457-XXC-9021' then '당진(가) 송수펌프3 주파수'
          when tagname = '600-457-SPC-8800' then '태안(가) 송수펌프5 주파수'
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
                  WHERE s_id = '서산(가)'
                )
  `,
  // selectPumpStatus3 :보령 정수장에서는 해당 쿼리 필요없음(정속만 있으므로)
  pump_query4_cy: `
    SELECT
      CASE WHEN tagname = '600-459-SPC-8002' THEN '청양(가) 송수펌프1 주파수'
          when tagname = '600-459-SPC-8001' then '청양(가) 송수펌프2 주파수'
          when tagname = '600-459-SPC-8000' then '청양(가) 송수펌프3 주파수'
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
                  WHERE s_id = '청양(가)'
                )
  `,
  // selectPumpStatus3 :보령 정수장에서는 해당 쿼리 필요없음(정속만 있으므로)
  pump_query4_hs: `
    SELECT
      CASE WHEN tagname = '600-456-SPC-9000' THEN '서산송수펌프1,2 주파수'
          when tagname = '600-456-SPC-8800' then '예산송수펌프5 주파수'
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
                  WHERE s_id = '홍성(가)'
                )
  `,

  // selectPumpStatus4
  pump_query5_br:`
    SELECT *
    FROM
    (
      SELECT SUM(a) '가동대수'
      FROM
      (
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              )
          AND tagname IN ('600-359-PMB-4016','600-359-PMB-4026','600-359-PMB-4036','600-359-PMB-4046','600-359-PMB-4056','600-359-PMB-4066') 	/* 송수펌프 ON 태그를 의미 */
      )t
    )g
  `
  ,
  // selectPumpStatus4
  pump_query5_ss:`
    SELECT *
    FROM
    (
      SELECT '당진',SUM(a) '가동대수'
      FROM
      (
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              )
          -- AND tagname IN ('600-457-PMC-8012','600-457-PMC-8022','600-457-PMC-8032','600-457-PMC-8042') 	/* 송수펌프 ON 태그를 의미 */
          AND tagname IN ('600-457-CBB-8317','600-457-CBB-8153','600-457-CBB-8319','600-457-CBB-8173') 	/* 송수펌프 상태 태그를 의미 '25.01.12 */
          
      )t
      UNION all
      SELECT '태안',SUM(a) '가동대수'
      FROM
      (
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              )
          -- AND tagname IN ('600-457-PMC-8052','600-457-PMC-8062','600-457-PMC-8072','600-457-PMC-8082') 	/* 송수펌프 ON 태그를 의미 */
          AND tagname IN ('600-457-CBB-8183','600-457-CBB-8193','600-457-CBB-8203','600-457-CBB-8213') 	/* 송수펌프 상태 태그를 의미 '25.01.12 */
      )t1
    )g
  `
  ,
  // selectPumpStatus4
  pump_query5_cy:`
    SELECT *
    FROM
    (
      SELECT SUM(a) '가동대수'
      FROM
      (
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              )
          -- AND tagname IN ('600-459-PMC-8004','600-459-PMC-8002','600-459-PMC-8000') 	/* 송수펌프 ON 태그를 의미 */
          AND tagname IN ('600-459-PMB-8005','600-459-PMB-8003','600-459-PMB-8001') 	/* 송수펌프 상태 태그를 의미 '25.01.12 */
      )t
    )g
  `
  ,
  // selectPumpStatus4
  pump_query5_hs:`
    SELECT *
    FROM
    (
      SELECT '홍성',SUM(a) '가동대수'
      FROM
      (
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              )
          -- AND tagname IN ('600-456-PMC-8012','600-456-PMC-8022','600-456-PMC-8032','600-456-PMC-8042') 	/* 송수펌프 ON 태그를 의미 */
          AND tagname IN ('600-456-CBB-8142','600-456-CBB-8152','600-456-CBB-8162','600-456-CBB-8172') 	/* 송수펌프 상태 태그를 의미 '25.01.12 */
      )t
      UNION all
      SELECT '예산',SUM(a) '가동대수'
      FROM
      (
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              )
          -- AND tagname IN ('600-456-PMC-8052','600-456-PMC-8062','600-456-PMC-8072','600-456-PMC-8082') 	/* 송수펌프 ON 태그를 의미 */
          AND tagname IN ('600-456-CBB-8182','600-456-CBB-8192','600-456-CBB-8202','600-456-CBB-8212') 	/* 송수펌프 상태 태그를 의미 '25.01.12 */
      )t1
    )g
  `
  ,

  // selectPumpStatus5
  pump_query6: `
    SELECT *
    FROM 
    (
      SELECT VALUE '펌프1전력'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              ) 
      AND tagname IN ('600-359-PAI-1408') /* 보령(정) 송수펌프 1호기 전력 */
    )a LEFT JOIN
    (
      SELECT VALUE '펌프2전력'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              ) 
      AND tagname IN ('600-359-PAI-1508') /* 보령(정) 송수펌프 2호기 전력 */
    )b ON 1=1
    LEFT JOIN
    (
      SELECT value  '펌프3전력'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              ) 
      AND tagname IN ('600-359-PAI-1608') /* 보령(정) 송수펌프 3호기 전력 */
    )c ON 1=1
    LEFT JOIN
    (
      SELECT value  '펌프4전력'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              ) 
    AND tagname IN ('600-359-PAI-1708') /* 보령(정) 송수펌프 4호기 전력 */
    )d ON 1=1
    LEFT JOIN
    (
      SELECT value  '펌프5전력'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              ) 
    AND tagname IN ('600-359-PAI-1808') /* 보령(정) 송수펌프5호기 전력 */
    )e ON 1=1
    LEFT JOIN
    (
      SELECT value  '펌프6전력'
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              ) 
    AND tagname IN ('600-359-PAI-1908') /* 보령(정) 송수펌프6호기 전력 */
    )f ON 1=1
  `
  ,

  pump_query7_br: `
  SELECT zone, value
    FROM (
        SELECT 
            CASE 
                WHEN tagname = '600-456-FRI-8001' THEN '홍성유입유량'
                WHEN tagname = '600-359-PRI-8010' THEN '청양분기압력'
                WHEN tagname = '600-359-PRI-8621' THEN '서천관말분기압력'
                WHEN tagname = '600-359-PRI-8700' THEN '송수터널후단압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '600-456-FRI-8001','600-359-PRI-8010','600-359-PRI-8621','600-359-PRI-8700'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -5 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '600-456-FRI-8001','600-359-PRI-8010','600-359-PRI-8621','600-359-PRI-8700'
    );
  `
  ,
  pump_query7_ss: `
  SELECT zone, value
    FROM (
        SELECT 
            CASE
                WHEN tagname = '600-457-PRI-8701' THEN '당진관말압력'
                WHEN tagname = '600-500-FRI-9401' THEN '팔봉유출유량'
                WHEN tagname = '600-457-FRI-8661' THEN '태안관말유량'
                WHEN tagname = '600-457-PRI-8661' THEN '태안관말압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '600-457-PRI-8701','600-500-FRI-9401','600-457-FRI-8661','600-457-PRI-8661'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -5 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '600-457-PRI-8701','600-500-FRI-9401','600-457-FRI-8661','600-457-PRI-8661'
    );
  `
  ,
  pump_query7_cy: `
  SELECT zone, value
    FROM (
        SELECT 
            CASE
                WHEN tagname = '600-359-FRI-8012' THEN '청양유입유량'
                WHEN tagname = '600-359-PRI-8010' THEN '청양유입압력'
                WHEN tagname = '600-459-PRI-8020' THEN '청양유출분기압력'
                WHEN tagname = '600-459-PRI-8040' THEN '청양유량분기압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '600-359-FRI-8012','600-359-PRI-8010','600-459-PRI-8020','600-459-PRI-8040'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -5 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '600-359-FRI-8012','600-359-PRI-8010','600-459-PRI-8020','600-459-PRI-8040'
    );
  `
  ,
  pump_query7_hs: `
  SELECT zone, value
    FROM (
        SELECT 
            CASE 
                WHEN tagname = '600-500-FRI-8205' THEN '수석신유입유량'
                WHEN tagname = '600-456-PRI-8641' THEN '구항압력'
                WHEN tagname = '600-456-PRI-8651' THEN '갈산압력'
                WHEN tagname = '600-457-PRI-8641' THEN '수석압력'
                WHEN tagname = '600-456-PRI-8621' THEN '남장압력'
                WHEN tagname = '600-456-PRI-8631' THEN '예산관말압력'
                WHEN tagname = '600-456-XXB-9002' THEN '인버터운영'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '600-500-FRI-8205','600-456-PRI-8641','600-456-PRI-8651','600-457-PRI-8641',
            '600-456-PRI-8621','600-456-PRI-8631', '600-456-XXB-9002'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -5 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '600-500-FRI-8205','600-456-PRI-8641','600-456-PRI-8651','600-457-PRI-8641',
            '600-456-PRI-8621','600-456-PRI-8631','600-456-XXB-9002'
    );
  `
  
  ,

  // selectValve
  valve_query: `
    SELECT 
      S_ID AS TNK_GRP_IDX,
      R_ID AS TNK_IDX,
      RT_ID AS VLV_IDX,
      R_ID AS TNK_GRP_NM,
      '' AS PMP_GRP,
      '' AS PMP_GRP_NM,
      RT_FO_STTS AS FO_TAG,
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_FO_STTS AND  ts = (SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG) ) 'FO',
      RT_FC_STTS AS FC_TAG, 
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_FC_STTS AND  ts = (SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG) ) 'FC',
      RT_OV_STTS AS POI_TAG, 
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_OV_STTS AND  ts = (SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG) ) '개도율', 
      RT_WTR_LVL AS LEI_TAG,
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_WTR_LVL AND  ts = (SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG) ) '수위', 
      RT_IN_FR AS IN_FLW_TAG,
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_IN_FR AND  ts = (SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG) ) '유입유량', 
      RT_OUT_FR AS OUT_FLW_TAG,
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_OUT_FR AND  ts = (SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG) ) '유출유량', 
      RT_MIN_RQRMN_PR AS DMD_PRI,
      RT_WTR_LVL_LCL AS LWL_LIM,
      RT_WTR_LVL_UCL AS HWL_LIM,
      '' AS MIN_LOAD_LWL,
      '' AS MAX_LOAD_LWL,
      '' AS VLM,
      '' AS LWL,
      '' AS HWL,
      '' AS BASE_AREA,
      '' AS USE_YN
    FROM TB_MST_RESERVOIR_TANK
  `
}

module.exports = queries;