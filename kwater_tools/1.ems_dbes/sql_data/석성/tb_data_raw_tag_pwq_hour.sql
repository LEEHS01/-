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
            '740-351-PWQ-9602','740-351-PWQ-9608','740-351-PWQ-9614','740-351-PWQ-9620','740-351-PWQ-9530',
            '740-351-PWQ-9536','740-351-PWQ-9542','740-351-PWQ-9548','740-351-PWQ-9554','740-351-PWQ-9560',
            '740-351-PWQ-9584','740-351-PWQ-9590','740-351-PWQ-9596','740-351-PWQ-9566','740-351-PWQ-9572',
            '740-351-PWQ-9578','740-351-PWQ-9500','740-351-PWQ-9506','740-351-PWQ-9512','740-351-PWQ-9518',
            '740-351-PWQ-9524'
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
              '740-351-PWQ-9602','740-351-PWQ-9608','740-351-PWQ-9614','740-351-PWQ-9620','740-351-PWQ-9530',
              '740-351-PWQ-9536','740-351-PWQ-9542','740-351-PWQ-9548','740-351-PWQ-9554','740-351-PWQ-9560',
              '740-351-PWQ-9584','740-351-PWQ-9590','740-351-PWQ-9596','740-351-PWQ-9566','740-351-PWQ-9572',
              '740-351-PWQ-9578','740-351-PWQ-9500','740-351-PWQ-9506','740-351-PWQ-9512','740-351-PWQ-9518',
              '740-351-PWQ-9524'
            )
    )b 
    WHERE a.tagname = b.tagname 
  ) a ;