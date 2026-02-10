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
            '702-880-353-PWQ-6500','702-880-353-PWQ-6506','702-880-353-PWQ-6512','702-880-353-PWQ-6518','702-880-353-PWQ-6524',
            '702-880-353-PWQ-6530','702-880-353-PWQ-6536','702-880-353-PWQ-6542','702-880-353-PWQ-6554','702-880-353-PWQ-6560',
            '702-880-353-PWQ-6548','702-880-353-PWQ-6590','702-880-353-PWQ-6596','702-880-353-PWQ-6602','702-880-353-PWQ-6608',
            '702-880-353-PWQ-6566','702-880-353-PWQ-6572','702-880-353-PWQ-6578','702-880-353-PWQ-6584','702-880-353-PWQ-6614',
            '702-880-353-PWQ-6620','702-880-353-PWQ-6626','702-880-353-PWQ-6632','702-880-353-PWQ-6638','702-880-353-PWQ-6644',
            '702-880-353-PWQ-6650','702-880-353-PWQ-6656','702-880-353-PWQ-6662'
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
              '702-880-353-PWQ-6500','702-880-353-PWQ-6506','702-880-353-PWQ-6512','702-880-353-PWQ-6518','702-880-353-PWQ-6524',
              '702-880-353-PWQ-6530','702-880-353-PWQ-6536','702-880-353-PWQ-6542','702-880-353-PWQ-6554','702-880-353-PWQ-6560',
              '702-880-353-PWQ-6548','702-880-353-PWQ-6590','702-880-353-PWQ-6596','702-880-353-PWQ-6602','702-880-353-PWQ-6608',
              '702-880-353-PWQ-6566','702-880-353-PWQ-6572','702-880-353-PWQ-6578','702-880-353-PWQ-6584','702-880-353-PWQ-6614',
              '702-880-353-PWQ-6620','702-880-353-PWQ-6626','702-880-353-PWQ-6632','702-880-353-PWQ-6638','702-880-353-PWQ-6644',
              '702-880-353-PWQ-6650','702-880-353-PWQ-6656','702-880-353-PWQ-6662'
            )
    )b 
    WHERE a.tagname = b.tagname 
  ) a ;