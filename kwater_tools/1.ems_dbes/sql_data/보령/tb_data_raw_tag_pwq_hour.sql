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
            '600-359-PAI-3112','600-359-PAI-3127','600-359-PAI-3142','600-359-PAI-3157','600-359-PAI-3172',
            '600-359-PAI-3187','600-359-PAI-3202','600-359-PAI-3217','600-359-PAI-3232','600-359-PAI-3247',
            '600-359-PAI-3262','600-359-PAI-3277','600-359-PAI-3292','600-359-PAI-3307','600-359-PAI-3322',
            '600-359-PAI-3337','600-359-PAI-3352'
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
              '600-359-PAI-3112','600-359-PAI-3127','600-359-PAI-3142','600-359-PAI-3157','600-359-PAI-3172',
              '600-359-PAI-3187','600-359-PAI-3202','600-359-PAI-3217','600-359-PAI-3232','600-359-PAI-3247',
              '600-359-PAI-3262','600-359-PAI-3277','600-359-PAI-3292','600-359-PAI-3307','600-359-PAI-3322',
              '600-359-PAI-3337','600-359-PAI-3352'
            )
    )b 
    WHERE a.tagname = b.tagname 
  ) a ;
