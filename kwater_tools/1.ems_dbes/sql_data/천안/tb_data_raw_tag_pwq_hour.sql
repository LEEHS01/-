INSERT INTO TB_DATA_RAW_TAG_PWQ_HOUR 
  SELECT ts,tagname,case
    when unit = 'Wh' then VALUE*0.001
    ELSE value 
      end AS VALUE,quality
  FROM
  (
    SELECT a.ts,a.tagname,a.value - b.value VALUE,a.quality,
        (SELECT int_unit FROM TB_PEAK_TAG_INF WHERE int_tag = a.tagname) unit 
    FROM 
    (
      SELECT * FROM TB_DATA_RAW_TAG 
      WHERE 1=1
        AND ts = (
                SELECT
                CASE WHEN 
                        SUBSTRING_INDEX(DATE_FORMAT(NOW(), '%Y-%m-%d %H'),' ',-1) =  00 
                      THEN CONCAT(DATE_FORMAT(NOW(), '%Y-%m-%d %H'),':01:00' )
                    ELSE 
                      DATE_FORMAT(NOW(), '%Y-%m-%d %H') 
                END ts
                FROM DUAL
              )
        AND tagname IN 
          (
            '881-355-PWQ-9000','881-355-PWQ-9006','881-355-PWQ-9012','881-355-PWQ-9018','881-355-PWQ-9048',
            '881-355-PWQ-9024','881-355-PWQ-9030','881-355-PWQ-9036','881-355-PWQ-9042','881-355-PWQ-9054',
            '881-355-PWQ-9060','881-355-PWQ-9066','881-355-PWQ-9072','881-355-PWQ-9078','881-355-PWQ-9084',
            '881-355-PWQ-9120','881-355-PWQ-9126','881-355-PWQ-9102','881-355-PWQ-9108','881-355-PWQ-9114',
            '881-355-PWQ-9090','881-355-PWQ-9096','881-355-PWQ-9132','881-355-PWQ-9138','881-355-PWQ-9144',
            '881-355-PWQ-9150','881-355-PWQ-9156','881-355-PWQ-9162','881-355-PWQ-9168','881-355-PWQ-9174',
            '881-355-PWQ-9180','881-355-PWQ-9186','881-355-PWQ-9192','881-355-PWQ-9198','881-355-PWQ-9204',
            '881-355-PWQ-9210','881-355-PWQ-9216','881-355-PWQ-9222','881-355-PWQ-9228','881-355-PWQ-9234',
            '881-355-PWQ-9240','881-355-PWQ-9246','881-355-PWQ-9252','881-355-PWQ-9258','881-355-PWQ-9264',
            '881-355-PWQ-9270','881-355-PWQ-9276','881-355-PWQ-9282','881-355-PWQ-9288','881-355-PWQ-9294',
            '881-355-PWQ-9300','881-355-PWQ-9306','881-355-PWQ-9312','881-355-PWQ-9318'
          )
    )a,
    (

      SELECT * FROM TB_DATA_RAW_TAG 
      WHERE 1=1 
        AND ts =  (
                SELECT
                CASE WHEN 
                        SUBSTRING_INDEX(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL -1 HOUR), '%Y-%m-%d %H'),' ',-1) =  00 
                      THEN CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL -1 HOUR), '%Y-%m-%d %H'),':01:00' )
                    ELSE 
                      DATE_FORMAT(DATE_ADD(NOW(), INTERVAL -1 HOUR), '%Y-%m-%d %H') 
                END ts
                FROM DUAL
                )
        AND tagname  IN
            (
              '881-355-PWQ-9000','881-355-PWQ-9006','881-355-PWQ-9012','881-355-PWQ-9018','881-355-PWQ-9048',
              '881-355-PWQ-9024','881-355-PWQ-9030','881-355-PWQ-9036','881-355-PWQ-9042','881-355-PWQ-9054',
              '881-355-PWQ-9060','881-355-PWQ-9066','881-355-PWQ-9072','881-355-PWQ-9078','881-355-PWQ-9084',
              '881-355-PWQ-9120','881-355-PWQ-9126','881-355-PWQ-9102','881-355-PWQ-9108','881-355-PWQ-9114',
              '881-355-PWQ-9090','881-355-PWQ-9096','881-355-PWQ-9132','881-355-PWQ-9138','881-355-PWQ-9144',
              '881-355-PWQ-9150','881-355-PWQ-9156','881-355-PWQ-9162','881-355-PWQ-9168','881-355-PWQ-9174',
              '881-355-PWQ-9180','881-355-PWQ-9186','881-355-PWQ-9192','881-355-PWQ-9198','881-355-PWQ-9204',
              '881-355-PWQ-9210','881-355-PWQ-9216','881-355-PWQ-9222','881-355-PWQ-9228','881-355-PWQ-9234',
              '881-355-PWQ-9240','881-355-PWQ-9246','881-355-PWQ-9252','881-355-PWQ-9258','881-355-PWQ-9264',
              '881-355-PWQ-9270','881-355-PWQ-9276','881-355-PWQ-9282','881-355-PWQ-9288','881-355-PWQ-9294',
              '881-355-PWQ-9300','881-355-PWQ-9306','881-355-PWQ-9312','881-355-PWQ-9318'
            )
    )b 
    WHERE a.tagname = b.tagname 
  ) a ;
