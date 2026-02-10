INSERT IGNORE INTO TB_DATA_RAW_TAG_HOUR_USE_TREND  
    SELECT TS, TAGNAME, SUM(VALUE) AS VALUE, 100, '' 
    FROM
    (
      SELECT  *	FROM TB_DATA_RAW_TAG				
        WHERE 1=1
        AND TAGNAME IN(
                    '702-880-353-VOI-4112',
										'702-880-353-VOI-4117',
										'702-880-353-VOI-4122',
										'702-880-353-VOI-4127',
										'702-880-353-VOI-4132',
										'702-880-353-VOI-4137'
                  )
        AND TS LIKE CONCAT(DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 HOUR),'%Y-%m-%d %H'),'%')
    ) T	
    GROUP BY TAGNAME