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
            '606-354-PWQ-9124','606-354-PWQ-9130','606-354-PWQ-9136','606-354-PWQ-9142','606-354-PWQ-9100',
            '606-354-PWQ-9106','606-354-PWQ-9112','606-354-PWQ-9118','606-354-PWQ-9208','606-354-PWQ-9214',
            '606-354-PWQ-9220','606-354-PWQ-9226','606-354-PWQ-9232','606-354-PWQ-9238','606-354-PWQ-9148',
            '606-354-PWQ-9154','606-354-PWQ-9160','606-354-PWQ-9166','606-354-PWQ-9172','606-354-PWQ-9178',
            '606-354-PWQ-9184','606-354-PWQ-9190','606-354-PWQ-9196','606-354-PWQ-9202','606-354-PWQ-9244',
            '606-354-PWQ-9250','606-354-PWQ-9256','606-354-PWQ-9262','606-354-PWQ-9268','606-354-PWQ-9274',
            '606-354-PWQ-9280','606-354-PWQ-9286','606-354-PWQ-9292','606-354-PWQ-9298','606-354-PWQ-9304',
            '606-354-PWQ-9310','606-354-PWQ-9316','606-354-PWQ-9322','606-354-PWQ-9328','606-354-PWQ-9334',
            '606-354-PWQ-9340','606-354-PWQ-9346','606-354-PWQ-9352','606-354-PWQ-9358','606-354-PWQ-9364',
            '606-354-PWQ-9370','606-354-PWQ-9376','606-354-PWQ-9382','606-354-PWQ-9388','606-354-PWQ-9394',
            '606-354-PWQ-9400','606-354-PWQ-9406'
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
              '606-354-PWQ-9106','606-354-PWQ-9112','606-354-PWQ-9118','606-354-PWQ-9208','606-354-PWQ-9214',
              '606-354-PWQ-9220','606-354-PWQ-9226','606-354-PWQ-9232','606-354-PWQ-9238','606-354-PWQ-9148',
              '606-354-PWQ-9154','606-354-PWQ-9160','606-354-PWQ-9166','606-354-PWQ-9172','606-354-PWQ-9178',
              '606-354-PWQ-9184','606-354-PWQ-9190','606-354-PWQ-9196','606-354-PWQ-9202','606-354-PWQ-9244',
              '606-354-PWQ-9250','606-354-PWQ-9256','606-354-PWQ-9262','606-354-PWQ-9268','606-354-PWQ-9274',
              '606-354-PWQ-9280','606-354-PWQ-9286','606-354-PWQ-9292','606-354-PWQ-9298','606-354-PWQ-9304',
              '606-354-PWQ-9310','606-354-PWQ-9316','606-354-PWQ-9322','606-354-PWQ-9328','606-354-PWQ-9334',
              '606-354-PWQ-9340','606-354-PWQ-9346','606-354-PWQ-9352','606-354-PWQ-9358','606-354-PWQ-9364',
              '606-354-PWQ-9370','606-354-PWQ-9376','606-354-PWQ-9382','606-354-PWQ-9388','606-354-PWQ-9394',
              '606-354-PWQ-9400','606-354-PWQ-9406'
            )
    )b 
    WHERE a.tagname = b.tagname 
  ) a ;
