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
      MAX(CASE WHEN tag = '881-355-EMS-9000' THEN value END) AS 천안분석결과예상관압,
      MAX(CASE WHEN tag = '881-355-EMS-9001' THEN value END) AS 천안분석결과예상유량,
      MAX(CASE WHEN tag = '881-355-EMS-9002' THEN value END) AS 목천분석결과예상관압,
      MAX(CASE WHEN tag = '881-355-EMS-9003' THEN value END) AS 목천분석결과예상유량,
      MAX(CASE WHEN tag = '881-355-EMS-9004' THEN value END) AS p_PWR_PRDCT,
      MAX(CASE WHEN tag = '881-355-EMS-9005' THEN value END) AS s_PWR_PRDCT,
    /* 화면에서 필요없으면 삭제 요망
      MAX(CASE WHEN tag = '' THEN value END) AS p_TUBE_PRSR_PRDCT,
      MAX(CASE WHEN tag = '' THEN value END) AS p_PRDCT_MEAN,
      MAX(CASE WHEN tag = '' THEN value END) AS p_PWR_PRDCT,
    */  
      MAX(CASE WHEN tag = '881-355-EMS-9101' THEN value END) AS 정속펌프1가동상태운영_천안,
      MAX(CASE WHEN tag = '881-355-EMS-9102' THEN value END) AS 변속펌프2가동상태운영,
      MAX(CASE WHEN tag = '881-355-EMS-9103' THEN value END) AS 변속펌프3가동상태운영,
      MAX(CASE WHEN tag = '881-355-EMS-9301' THEN value END) AS 변속펌프1가동상태운영_목천,
      MAX(CASE WHEN tag = '881-355-EMS-9302' THEN value END) AS 변속펌프2가동상태운영_목천,
      MAX(CASE WHEN tag = '881-355-EMS-9202' THEN value END) AS 변속펌프2주파수운영_천안,
      MAX(CASE WHEN tag = '881-355-EMS-9203' THEN value END) AS 변속펌프3주파수운영_천안,
      MAX(CASE WHEN tag = '881-355-EMS-9401' THEN value END) AS 변속펌프1주파수운영_목천,
      MAX(CASE WHEN tag = '881-355-EMS-9402' THEN value END) AS 변속펌프2주파수운영_목천,
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
      WHERE tag IN ('881-355-EMS-9000','881-355-EMS-9001',
              '881-355-EMS-9002','881-355-EMS-9003','881-355-EMS-9004',
              '881-355-EMS-9005','881-355-EMS-9101','881-355-EMS-9102',
              '881-355-EMS-9103','881-355-EMS-9301','881-355-EMS-9302',
              '881-355-EMS-9202','881-355-EMS-9203','881-355-EMS-9401',
              '881-355-EMS-9402')
        AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1;
  `
  ,
  // predic_query3: `
  //   SELECT * FROM
  //   (
  //       SELECT value 천안분석결과예상관압  /* 천안분석결과 AI 예상관압 (F_CV) */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9000')
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) a_9,
  //   (
  //       SELECT value 목천분석결과예상관압  /* 목천분석결과 AI 예상관압 (F_CV) */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9002')
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) a_99,
  //   (
  //       SELECT value 천안분석결과예상유량  /* 천안분석결과 AI 예상유량 (F_CV) */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9001')
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) a_999,
  //   (
  //       SELECT value 목천분석결과예상유량  /* 목천분석결과 AI 예상유량 (F_CV) */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9003')
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) a_9999,
  //   (
  //       SELECT value p_TUBE_PRSR_PRDCT  /* 정속펌프 AI 예상관압 (F_CV) */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9000')
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) a,
  //   (
  //       SELECT value p_PRDCT_MEAN  /* AI 예상유량 */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9001' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) b,
  //   (
  //       SELECT value p_PWR_PRDCT  /* 천안 AI 소비전력 */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9004' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) c,
  //   (
  //       SELECT value s_TUBE_PRSR_PRDCT	/* 변속펌프 AI 예상관압 */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9002')
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE TIME >= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) a_1,
  //   (
  //       SELECT value s_PRDCT_MEAN  /* 변속펌프 AI 예상유량 */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9003' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time >= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) b_1,
  //   (
  //       SELECT value s_PWR_PRDCT /* 목천 AI 소비전력 */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9004' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE TIME >= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) c_1,
  //   (
  //       SELECT value 변속펌프2가동상태운영 /* 천안(정)변속펌프 AI 1번펌프 ON/OFF */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9102' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) d,
  //   (
  //       SELECT value 변속펌프3가동상태운영 /* 천안(정)변속펌프 AI 2번펌프 ON/OFF */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9103' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) d_1,
  //   (
  //       SELECT value 변속펌프1가동상태운영_목천 /* 목천가 변속펌프 AI 1번펌프 ON/OFF */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9301' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) e,
  //   (
  //       SELECT VALUE '변속펌프2가동상태운영_목천'  /* 목천가 변속펌프 AI 2번펌프 ON/OFF */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9302' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) ks1,
  //   (
  //       SELECT value 변속펌프2주파수운영_천안 /* 변속펌프 AI 1번펌프 주파수_천안(정) */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9202' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) f,
  //   (
  //       SELECT value 변속펌프3주파수운영_천안 /* 변속펌프 AI 2번펌프 주파수_천안(정) */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9203' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) g,
  //   (
  //       SELECT value 변속펌프1주파수운영_목천 /* 변속펌프1 AI 주파수_목천 */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9401' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) kss1,
  //   (
  //       SELECT value 변속펌프2주파수운영_목천 /* 변속펌프2 AI 주파수_목천 */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9402' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) kss2,
  //   (
  //       SELECT value 정속펌프1가동상태운영_천안 /* 정속 송수펌프1_천안(정) */
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9101' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) d1,
  //   (
  //       SELECT value 운영대수
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9003' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) h1,
  //   (
  //       SELECT value 운영모드
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('881-355-EMS-9003' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //   ) i1,
  //   (
  //       SELECT IFNULL( 	
  //                   (
  //                     SELECT VALUE  최소요구관압정수장
  //                     FROM TB_PTR_CTR_ANLY_RST
  //                     WHERE tag IN ('xxx-xxx-EMS-xxx' )
  //                       AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 MINUTE))
  //                   )
  //                 ,0) AS 최소요구관압정수장
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('xxx-xxx-EMS-xxx' )
  //         AND time = (
  //                   select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute)
  //                 )
  //     UNION all
  //     SELECT 0 최소요구관압정수장 FROM DUAL LIMIT 1
  //   ) ai_2,
  //   (
  //       SELECT IFNULL( 	
  //                   (
  //                     SELECT VALUE  최소요구관압분기점
  //                     FROM TB_PTR_CTR_ANLY_RST
  //                     WHERE tag IN ('xxx-xxx-EMS-xxx' )
  //                       AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //                   )
  //               ,0 ) AS 최소요구관압분기점
  //       FROM TB_PTR_CTR_ANLY_RST
  //       WHERE tag IN ('xxx-xxx-EMS-xxx' )
  //         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
  //       UNION all
  //       SELECT 0 최소요구관압정수장 FROM DUAL LIMIT 1
  //   ) ai_3
  // `
  // ,
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
    SELECT NAME, MAX(VALUE) AS VALUE
    FROM
    (
      SELECT
        CASE
          WHEN tagname = '881-455-PRI-8050' THEN '목천방면관압'
          WHEN tagname = '881-355-PRI-4151' OR tagname = '881-355-PRI-4152' OR tagname = '881-355-PRI-4153' THEN '천안방면관압'
        ELSE '' END NAME
        ,IFNULL(VALUE,0) AS VALUE
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
    ) t
    GROUP BY NAME
  `,
  // selectPumpStatus2
  pump_query3: `
    SELECT 
      CASE WHEN tagname IN('881-355-FRI-8001')  THEN '천안유량' 
           WHEN tagname IN('881-455-FRI-8002')  THEN '목천유량' END NAME
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
      CASE WHEN tagname = '881-355-HZI-4112' THEN '천안(정) 송수펌프2 주파수'
          when tagname = '881-355-HZI-4113' then '천안(정) 송수펌프3 주파수'
          when tagname = '881-455-SPC-1100' then '목천(가) 가압펌프1 주파수'
          when tagname = '881-455-SPC-1101' then '목천(가) 가압펌프2 주파수'
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
          AND tagname IN ('881-355-PMB-4111') 	/* 송수펌프 ON 태그를 의미 */
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
          AND tagname IN ('881-355-PMB-4112') /* 송수펌프 ON 태그를 의미 */
        UNION ALL
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE 
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              ) 
          AND tagname IN ('881-355-PMB-4113') /* 송수펌프 ON 태그를 의미 */
        UNION ALL
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE 
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              ) 
          AND tagname IN ('881-455-PMC-8020') /* 송수펌프 ON 태그를 의미 */
        UNION ALL
        SELECT value a
        FROM TB_DATA_RAW_TAG a
        WHERE 
          ts = (
              SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
              FROM TB_DATA_RAW_TAG
              ) 
          AND tagname IN ('881-455-PMC-8030') /* 송수펌프 ON 태그를 의미 */	
      )t
    )h
  `
  ,
  // selectPumpStatus5
  pump_query6: `
    SELECT *
    FROM
    (
      SELECT value 천안정펌프1
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              )
      AND tagname IN ('881-355-PWI-4101') /* '천안(정) 3단계 송수펌프 1호기 전력 */
    )a LEFT JOIN
    (
      SELECT value 천안정펌프2
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              )
      AND tagname IN ('881-355-PWI-4102') /* 천안(정) 3단계 송수펌프 2호기 전력 */
    )b ON 1=1
    LEFT JOIN
    (
      SELECT value 천안정펌프3
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              )
      AND tagname IN ('881-355-PWI-4103') /* 천안(정) 3단계 송수펌프 3호기 전력 */
    )c ON 1=1
    LEFT JOIN
    (
      SELECT value 목천펌프1
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              )
    AND tagname IN ('881-455-PWI-1010') /* 목천(가) 기동반#1 전력(펌프전력합) */
    )d ON 1=1
    LEFT JOIN
    (
      SELECT value 목천펌프2
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              )
    AND tagname IN ('xxx-xxx-PWI-xx') /* 목천(가) 두번째 태그 없음 */
    )e ON 1=1    
  `
  ,
  pump_query7:`
  SELECT zone, value
    FROM (
        SELECT 
            CASE 
                WHEN tagname = '881-455-PRI-8051' THEN '목천분기유출압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '881-455-PRI-8051'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -60 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '881-455-PRI-8051'
    );
  `
  ,

  // selectValve
  valve_query: `
    SELECT
      CONCAT(R_ID,'_',RT_ID,'번 ','수조') AS TNK_GRP_NM ,
      GROUP_CONCAT(RT_FO_STTS),
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
      ) 'FO',
      GROUP_CONCAT(RT_FC_STTS),
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
      ) 'FC',
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