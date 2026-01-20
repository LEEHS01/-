const logger = require('../logger').logger;

// let search3 = 'h';
// let search = '2022-02-01';
// let search2 = '한화토탈';
// let search4 = '2022-02-27';

// req 인자값 받기위해 함수로 선언
// sujiSelect1
exports.searchQuery = (reqbody) => {
  logger.info('searchQuery : ',reqbody);
  let search = reqbody.search;
  let search2 = reqbody.search2;
  let search3 = reqbody.search3;
  let search4 = reqbody.search4;

  return `
    SELECT 
      ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
      tagname, 
      FORMAT (SUM(value), 2) value
    -- FROM rawdata_hour a
    FROM TB_DATA_RAW_TAG a
    WHERE 
      ${search3 === 'h' || search3 === 'd' ? `ts >= CONCAT('${search}', ' 00:00:00') AND ts <= CONCAT('${search4}', ' 23:59:00')` : ''}
      ${search3 === 'm' ? `ts >= CONCAT('${search}', '-01 00:00:00') AND ts <= CONCAT('${search4}', '-31 23:59:00')` : ''}
      ${search3 === 'y' ? `ts >= CONCAT('${search}', '-01-01 00:00:00') AND ts <= CONCAT('${search4}', '-12-31 23:59:00')` : ''}
  --    ts >= CONCAT('2023-03-01','-01-01 00:00:00') AND ts <= CONCAT('2023-03-01','-12-31 23:59:00')
      AND ts LIKE ('%00:00')
      AND tagname IN (
            SELECT RT_WTR_LVL
            FROM TB_MST_RESERVOIR_TANK
--                WHERE R_ID = '목천(구)(배)' 	
            WHERE R_ID = '${search2}' 	
            GROUP BY RT_WTR_LVL
        )
    GROUP BY 
      ${search3 === 'h' ? 'ts' : ''}
      ${search3 === 'd' ? 'DATE(ts)' : ''}
      ${search3 === 'm' ? 'MONTH(ts)' : ''}
      ${search3 === 'y' ? 'YEAR(ts)' : ''}
  `;
};

// sujiSelect2
exports.searchQuery2 = (reqbody) => {
  logger.info('searchQuery : ',reqbody);
  let search = reqbody.search;
  let search2 = reqbody.search2;
  let search3 = reqbody.search3;
  let search4 = reqbody.search4;
  let query = `
    SELECT
      ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
      tagname,
      FORMAT (sum(value) , 0) value 
    FROM TB_DATA_RAW_TAG a 
    WHERE
  `;

  if (search3 === 'h' || search3 === 'd') {
    query += `
      ts >= CONCAT('${search}', ' 00:00:00') AND
      ts <= CONCAT('${search4}', ' 23:59:00')`;
  } else if (search3 === 'm') {
    query += `
      ts >= CONCAT('${search}', '-01 00:00:00') AND
      ts <= CONCAT('${search4}', '-31 23:59:00')`;
  } else if (search3 === 'y') {
    query += `
      ts >= CONCAT('${search}', '-01-01 00:00:00') AND
      ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
  }
  query += `
    AND ts LIKE ('%00:00')
    AND tagname in (
      SELECT RT_IN_FR 
      FROM TB_MST_RESERVOIR_TANK 
  --    WHERE R_ID = '목천(구)(배)' 
      WHERE R_ID = '${search2}' 
      GROUP BY RT_IN_FR
    )
    GROUP BY`;
  if (search3 === 'h') {
    query += ' ts';
  } else if (search3 === 'd') {
    query += ' DATE(ts)';
  } else if (search3 === 'm') {
    query += ' MONTH(ts)';
  } else if (search3 === 'y') {
    query += ' YEAR(ts)';
  }

  return query;
};

// sujiSelect3_1
exports.searchQuery3_1 = (reqbody) => {
  let search = reqbody.search;
  let search2 = reqbody.search2;
  let search3 = reqbody.search3;
  let search4 = reqbody.search4;
  let query =`
    SELECT
      ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
      tagname, 
      FORMAT (value, 0) value
    FROM TB_DATA_RAW_TAG a
    WHERE
  `;
  if( search3 == 'h' || search3 == 'd') {
    query += `
    ts >= CONCAT('${search}', ' 00:00:00') AND
    ts <= CONCAT('${search4}', ' 23:59:00')`;
  } else if(search3 == 'm') {
    query += `
    ts >= CONCAT('${search}', '-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-31 23:59:00')`;
  } else if(search3 == 'y') {
    query += `
    ts >= CONCAT('${search}', '-01-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
  }
  query += `
    AND ts LIKE ('%00:00')
    AND tagname in (
      SELECT RT_FC_STTS
      FROM TB_MST_RESERVOIR_TANK 
    WHERE R_ID = '${search2}' 
--        WHERE R_ID = '목천(구)(배)' 
      GROUP BY RT_FC_STTS
    )
    GROUP BY 
  `;
  if (search3 === 'h') {
    query += ' ts';
  } else if (search3 === 'd') {
    query += ' DATE(ts)';
  } else if (search3 === 'm') {
    query += ' MONTH(ts)';
  } else if (search3 === 'y') {
    query += ' YEAR(ts)';
  }
  return query;
}

// sujiSelect3_2
exports.searchQuery3_2 = (reqbody) => {
  let search = reqbody.search;
  let search2 = reqbody.search2;
  let search3 = reqbody.search3;
  let search4 = reqbody.search4;

  let query = `
    SELECT
      ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
      tagname,
      FORMAT(SUM(value), 0) AS value
    FROM TB_DATA_RAW_TAG a
    WHERE 
  `;
  if (search3 === 'h' || search3 === 'd') {
    query += `
    ts >= CONCAT('${search}', ' 00:00:00') AND
    ts <= CONCAT('${search4}', ' 23:59:00')`;
  } else if (search3 === 'm') {
    query += `
    ts >= CONCAT('${search}', '-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-31 23:59:00')`;
  } else if (search3 === 'y') {
    query += `
    ts >= CONCAT('${search}', '-01-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
  }
  query += `
    AND ts LIKE ('%00:00')
  AND tagname in (
          SELECT RT_FO_STTS
          FROM TB_MST_RESERVOIR_TANK 
          WHERE 
          R_ID = '${search2}'
--            R_ID = '목천(구)(배)'
          GROUP BY RT_FO_STTS
        )
    GROUP BY
  `;
  if (search3 === 'h') {
    query += ' ts';
  } else if (search3 === 'd') {
    query += ' DATE(ts)';
  } else if (search3 === 'm') {
    query += ' MONTH(ts)';
  } else if (search3 === 'y') {
    query += ' YEAR(ts)';
  }
  return query;
}

// sujiSelect4
exports.searchQuery4 = (reqbody) => {
  let search = reqbody.search;
  let search2 = reqbody.search2;
  let search3 = reqbody.search3;
  let search4 = reqbody.search4;

  let query = `
    SELECT
      ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
      tagname,
      FORMAT(SUM(value), 0) AS value
    -- FROM rawdata_hour a
    FROM TB_DATA_RAW_TAG a
    WHERE 
  `;
  if (search3 === 'h' || search3 === 'd') {
    query += `
    ts >= CONCAT('${search}', ' 00:00:00') AND
    ts <= CONCAT('${search4}', ' 23:59:00')`;
  } else if (search3 === 'm') {
    query += `
    ts >= CONCAT('${search}', '-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-31 23:59:00')`;
  } else if (search3 === 'y') {
    query += `
    ts >= CONCAT('${search}', '-01-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
  }
  query += `
    AND ts LIKE ('%00:00')
    -- AND tagname in ('745-617-FRI-4101','745-617-FRI-4100')
    AND tagname in ('881-355-FRI-8001','881-355-FRI-8002','881-355-FRI-8003','881-355-FRI-8051')
    GROUP BY
  `;
  if (search3 === 'h') {
    query += ' ts';
  } else if (search3 === 'd') {
    query += ' DATE(ts)';
  } else if (search3 === 'm') {
    query += ' MONTH(ts)';
  } else if (search3 === 'y') {
    query += ' YEAR(ts)';
  }

  return query;
}

// sujiSelect5
exports.searchQuery5 = (reqbody) => {
  let search = reqbody.search;
  let search2 = reqbody.search2;
  let search3 = reqbody.search3;
  let search4 = reqbody.search4;

  let query = `
    SELECT
      ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
      ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
      ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
      ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
    tagname, FORMAT (value, 2) value
    -- FROM rawdata_hour 
    FROM TB_DATA_RAW_TAG
    WHERE 
  `;

  if (search3 === 'h' || search3 === 'd') {
    query += `
    ts >= CONCAT('${search}', ' 00:00:00') AND
    ts <= CONCAT('${search4}', ' 23:59:00')`;
  } else if (search3 === 'm') {
    query += `
    ts >= CONCAT('${search}', '-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-31 23:59:00')`;
  } else if (search3 === 'y') {
    query += `
    ts >= CONCAT('${search}', '-01-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
  }
  query += `
    AND ts LIKE ('%00:00')
    -- AND tagname = '745-617-PRI-4118'
    AND tagname = '881-355-PRI-4151'
    GROUP BY
  `;
  if (search3 === 'h') {
    query += ' ts';
  } else if (search3 === 'd') {
    query += ' DATE(ts)';
  } else if (search3 === 'm') {
    query += ' MONTH(ts)';
  } else if (search3 === 'y') {
    query += ' YEAR(ts)';
  }
  return query;
}

// sujiSelect6
exports.searchQuery6 = (reqbody) => {
  let search = reqbody.search;
  let search2 = reqbody.search2;
  let search3 = reqbody.search3;
  let search4 = reqbody.search4;

  let query = `
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') ts,
        tagname, FORMAT (VALUE, 0) value
    -- FROM rawdata_hour
    FROM TB_DATA_RAW_TAG a
    WHERE 
  `;
  if (search3 === 'h' || search3 === 'd') {
    query += `
    ts >= CONCAT('${search}', ' 00:00:00') AND
    ts <= CONCAT('${search4}', ' 23:59:00')`;
  } else if (search3 === 'm') {
    query += `
    ts >= CONCAT('${search}', '-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-31 23:59:00')`;
  } else if (search3 === 'y') {
    query += `
    ts >= CONCAT('${search}', '-01-01 00:00:00') AND
    ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
  }
  query += `
    AND ts LIKE ('%00:00')
    -- AND tagname in ('745-617-PMB-4113','745-617-PMB-4116','745-617-PMB-4119','745-617-PMB-4122')
    AND tagname in ('881-355-PMB-4111')
  `;

  return query;
}

// suji_sunsi
exports.searchQuery_sunsi = (reqbody) => {
  let search = reqbody.search;
  let search2 = reqbody.search2;
  let search3 = reqbody.search3;
  let search4 = reqbody.search4;
  
  let query = `
    SELECT * 
    FROM 
    (
      SELECT FORMAT (SUM(value), 0) '수위'
    --	FROM ems_data.rawdata a
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              ) 
        AND tagname IN (
                    SELECT RT_WTR_LVL
                    FROM TB_MST_RESERVOIR_TANK
                --    WHERE R_ID = '광덩면직결(배)'
                    WHERE R_ID = '${search2}'
                    GROUP BY RT_WTR_LVL
                  )
    )a,
    (
      SELECT FORMAT (SUM(value), 0) '유입유량'
      --	FROM ems_data.rawdata a
      FROM TB_DATA_RAW_TAG a
      WHERE ts = (
                SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
                FROM TB_DATA_RAW_TAG
              ) 
        AND tagname IN (
                    SELECT RT_IN_FR
                    FROM TB_MST_RESERVOIR_TANK
                --    WHERE R_ID = '광덩면직결(배)'
                    WHERE R_ID = '${search2}'
                    GROUP BY RT_IN_FR
                  ) 
    )b,
    (
                SELECT case
                      when a = 0 AND b = 0 then 50
                      when a = 0 AND b = 1 then 100
                      when a = 1 AND b = 0 then 0
                      ELSE 100 
                  end AS '밸브상태' 
                FROM 
                (
                  SELECT FORMAT (sum(value) , 0) a from TB_DATA_RAW_TAG a 
                  WHERE ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
                  AND tagname IN (
                              SELECT RT_FC_STTS FROM TB_MST_RESERVOIR_TANK 
                          --    WHERE R_ID = '광덩면직결(배)'
                              WHERE R_ID = '${search2}'
                              GROUP BY RT_FC_STTS
                            ) 
                )a,
                (
                  SELECT FORMAT (sum(value) , 0) b from TB_DATA_RAW_TAG a 
                  where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
                  AND tagname IN (
                              SELECT RT_FO_STTS FROM TB_MST_RESERVOIR_TANK 
                          --    WHERE R_ID = '광덩면직결(배)'
                              WHERE R_ID = '${search2}'
                              GROUP BY RT_FO_STTS
                            ) 
                )b
            
    )c,
    (
              SELECT FORMAT (sum(value) , 0) '유출유량' from TB_DATA_RAW_TAG a 
              where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
                -- AND tagname IN ('745-617-FRI-4101','745-617-FRI-4100') 
                AND tagname IN ('881-355-FRI-8001','881-355-FRI-8002','881-355-FRI-8003','881-355-FRI-8051') 
    )d,
    (
              SELECT FORMAT (sum(value) , 0) '정속토출관압' from TB_DATA_RAW_TAG a 
              where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
                -- AND tagname IN ('745-617-PRI-4118') 
                AND tagname IN ('881-355-PRI-4151') 
              GROUP BY a.ts 
    )e,
    (
              SELECT FORMAT (sum(value) , 0) '변속토출관압' from TB_DATA_RAW_TAG a 
              where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
                -- AND tagname IN ('745-617-PRI-4117') 
                AND tagname IN ('881-355-PRI-4152','881-355-PRI-4153') 
              GROUP BY a.ts 
    )f,
    (
      SELECT SUM(a) '정속가동대수' 
      FROM (
            SELECT value a from TB_DATA_RAW_TAG a 
            where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
              -- AND tagname IN ('745-617-PMB-4113') 
              AND tagname IN ('881-355-PMB-4111') 
          )t
      
    )g,
    (
      SELECT FORMAT (sum(value) , 0) '주파수1' from TB_DATA_RAW_TAG a 
      where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
    --		AND tagname IN ('745-617-SPI-4213') 
        AND tagname IN ('881-355-HZI-4112') 
    )h,
    (
      SELECT FORMAT (sum(value) , 0) '주파수2' from TB_DATA_RAW_TAG a 
      where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
        -- AND tagname IN ('745-617-CTI-4260') 
        AND tagname IN ('881-355-HZI-4113') 
    )h2,
    (
      SELECT FORMAT (sum(value) , 0) '주파수3' from TB_DATA_RAW_TAG a 
      where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
        -- AND tagname IN ('745-617-CTI-4260') 
        AND tagname IN ('881-455-SPI-1100') 
    )h3,
    (
      SELECT FORMAT (sum(value) , 0) '주파수4' from TB_DATA_RAW_TAG a 
      where ts  = (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG) 
        -- AND tagname IN ('745-617-CTI-4260') 
        AND tagname IN ('881-455-SPI-1101') 
    )h4
  `;
  
  return query
}
