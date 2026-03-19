const logger = require('../logger').logger;

exports.selectZone = () => {
  let query = `
    SELECT
      ZONE_CODE,
      ZONE_NAME,
      DESCRIPTION
    FROM TB_ZONE
  `;

  return query;
}

exports.selectFac = (reqbody) => {
  logger.info('selectFac reqbody > ', reqbody);
  let query = `
    SELECT 
      a.fac,
      b.description
    FROM TB_TAGINFO_2 a , TB_FAC b
    where a.fac = b.fac_code
      AND  ZONE = '${reqbody.search}' 
    GROUP BY fac
  `;
  
  return query;
}

exports.selectFacUseList = (reqbody) => {
  logger.info('selectFacUseList reqbody > ', reqbody);
  let query = `SELECT `;
  
  if (reqbody.search5 === 'h') {
    query += `DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i')`;
  } else if (reqbody.search5 === 'd') {
    query += `DATE_FORMAT(MAX(ts), '%Y-%m-%d')`;
  } else if (reqbody.search5 === 'm') {
    query += `DATE_FORMAT(MAX(ts), '%Y-%m')`;
  } else if (reqbody.search5 === 'y') {
    query += `DATE_FORMAT(MAX(ts), '%Y')`;
  }
  
  query += ` AS x
      ,c.fac_name
      ,a.tagname
      ,ROUND(SUM(VALUE),2) AS Y
    FROM TB_DATA_RAW_TAG a
        ,TB_TAGINFO_2 b
        ,TB_FAC c
    WHERE 
      a.tagname = b.tagname AND b.FAC = c.fac_code AND
    `;
  
  if (reqbody.search5 === 'h' || reqbody.search5 === 'd') {
    query += `ts >= CONCAT('${reqbody.search}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search2}', ' 23:59:00')`;
  } else if (reqbody.search5 === 'm') {
    query += `ts >= CONCAT('${reqbody.search}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}', '-31 23:59:00')`;
  } else if (reqbody.search5 === 'y') {
    query += `ts >= CONCAT('${reqbody.search}', '-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}', '-12-31 23:59:00')`;
  }

  query += ` AND ts LIKE ('%00:00') `;

  if (reqbody.search3 != null && reqbody.search3 != '') {
    query += ` AND b.zone = '${reqbody.search3}'`;
  }
  
  if (reqbody.search4 != null && reqbody.search4 != '') {
    query += ` AND b.fac = '${reqbody.search4}'`;
  }
  
  query += ` GROUP BY `;
  
  if (reqbody.search5 === 'h') {
    query += `ts`;
  } else if (reqbody.search5 === 'd') {
    query += `DATE(ts)`;
  } else if (reqbody.search5 === 'm') {
    query += `MONTH(ts)`;
  } else if (reqbody.search5 === 'y') {
    query += `YEAR(ts)`;
  }
  
  query += `, b.FAC`;

  return query;
}

exports.selectFacUseList_sum = (reqbody) => {
  logger.info('selectFacUseList_sum reqbody > ', reqbody);
  let query = `SELECT MAX(X) x, fac_name, SUM(Y) y 
    FROM 
    (
      SELECT `;
  
  if (reqbody.search5 === 'h') {
    query += `DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i')`;
  } else if (reqbody.search5 === 'd') {
    query += `DATE_FORMAT(MAX(ts), '%Y-%m-%d')`;
  } else if (reqbody.search5 === 'm') {
    query += `DATE_FORMAT(MAX(ts), '%Y-%m')`;
  } else if (reqbody.search5 === 'y') {
    query += `DATE_FORMAT(MAX(ts), '%Y')`;
  }
  
  query += ` AS x
      ,c.fac_name
      ,ROUND(SUM(VALUE),2) AS Y
    FROM TB_DATA_RAW_TAG a
        ,TB_TAGINFO_2 b
        ,TB_FAC c
    WHERE 
      a.tagname = b.tagname AND b.FAC = c.fac_code AND
    `;
  
  if (reqbody.search5 === 'h' || reqbody.search5 === 'd') {
    query += `ts >= CONCAT('${reqbody.search}', ' 00:00:00') AND ts <= CONCAT('${reqbody.search2}', ' 23:59:00')`;
  } else if (reqbody.search5 === 'm') {
    query += `ts >= CONCAT('${reqbody.search}', '-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}', '-31 23:59:00')`;
  } else if (reqbody.search5 === 'y') {
    query += `ts >= CONCAT('${reqbody.search}', '-01-01 00:00:00') AND ts <= CONCAT('${reqbody.search2}', '-12-31 23:59:00')`;
  }

  query += ` AND ts LIKE ('%00:00') `;

  if (reqbody.search3 != null && reqbody.search3 != '') {
    query += ` AND b.zone = '${reqbody.search3}'`;
  }
  
  if (reqbody.search4 != null && reqbody.search4 != '') {
    query += ` AND b.fac = '${reqbody.search4}'`;
  }
  
  query += ` GROUP BY `;
  
  if (reqbody.search5 === 'h') {
    query += `ts`;
  } else if (reqbody.search5 === 'd') {
    query += `DATE(ts)`;
  } else if (reqbody.search5 === 'm') {
    query += `MONTH(ts)`;
  } else if (reqbody.search5 === 'y') {
    query += `YEAR(ts)`;
  }
  
  query += `, b.FAC) a GROUP BY fac_name;`;

  return query;
}

exports.selectFacSunsi = (reqbody) => {
  logger.info('selectFacSunsi reqbody > ', reqbody);
  let query = `
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i') AS x, c.fac_name, a.tagname, c.description, d.INS_UNIT, 
      CASE 
        WHEN ins_unit='W' THEN ROUND(VALUE*0.001,2) ELSE ROUND(VALUE,2) 
      END AS y
    FROM 
        TB_DATA_RAW_TAG a 
        ,TB_TAGINFO_2 b
        ,TB_FAC c
        ,TB_PEAK_TAG_INF d
    WHERE a.tagname = b.tagname 
        AND b.FAC = c.fac_code 
        AND a.tagname = d.INS_TAG 
        AND ts >= CONCAT(CURDATE(),' 00:00:00') AND ts <= CONCAT(CURDATE(),' 23:59:00') 
    --    AND ts >= CONCAT('2023-03-01',' 00:00:00') AND ts <= CONCAT('2023-03-01',' 23:59:00') 
    --  AND b.zone = '약품투입동'  
      AND b.zone = '${reqbody.search}'  
  `;  

  return query;
}
