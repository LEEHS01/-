const logger = require('../logger').logger;

// selectpmpPerformList
exports.searchQuery = (data) => {
  logger.info('searchQuery data > ', data);
  let query = `
    SELECT a.*,
    (
      SELECT CONCAT(S_ID,SP_ID)
      FROM TB_MST_SUPPLY_PUMP
      WHERE  
  `;
  if (data.search3 === 'PMB_TAG') {
    query += `SP_ONOFF_STTS`;
  } else if (data.search3 === 'PWI_TAG') {
    query += `SP_INS_PWR`;
  } else if (data.search3 === 'SPI_TAG') {
    query += `SP_HZ_STTS`;
  }
  query += ` 
      = a.tagname
      LIMIT 1
      ) name
    FROM (
      SELECT 
  `;
  if (data.search4 === 'h') {
    query += `DATE_FORMAT(ts, '%Y-%m-%d %H:%i')`;
  } else if (data.search4 === 'd') {
    query += `DATE_FORMAT(ts, '%Y-%m-%d')`;
  } else if (data.search4 === 'm') {
    query += `DATE_FORMAT(ts, '%Y-%m')`;
  } else if (data.search4 === 'y') {
    query += `DATE_FORMAT(ts, '%Y')`;
  }
  query += ` ts, tagname, value
      FROM TB_DATA_RAW_TAG b
      WHERE 
  `;
  if (data.search4 === 'h' || data.search4 === 'd') {
    query += `ts >= CONCAT('${data.search}', ' 00:00:00') AND ts <= CONCAT('${data.search2}', ' 23:59:00')`;
  } else if (data.search4 === 'm') {
    query += `ts >= CONCAT('${data.search}-01 00:00:00') AND ts <= CONCAT('${data.search2}-31 23:59:00')`;
  } else if (data.search4 === 'y') {
    query += `ts >= CONCAT('${data.search}-01-01 00:00:00') AND ts <= CONCAT('${data.search2}-12-31 23:59:00')`;
  }
  query += ` AND tagname IN (
      SELECT `;
  if (data.search3 === 'PMB_TAG') {
    query += `SP_ONOFF_STTS`;
  } else if (data.search3 === 'PWI_TAG') {
    query += `SP_INS_PWR`;
  } else if (data.search3 === 'SPI_TAG') {
    query += `SP_HZ_STTS`;
  }
  query += ` 
    FROM TB_MST_SUPPLY_PUMP
    ) 
    AND ts LIKE ('%00:00')  
    GROUP BY `;
  if (data.search4 === 'h') {
    query += `b.ts`;
  } else if (data.search4 === 'd') {
    query += `DATE(b.ts)`;
  } else if (data.search4 === 'm') {
    query += `MONTH(b.ts)`;
  } else if (data.search4 === 'y') {
    query += `YEAR(b.ts)`;
  }
  query += `, b.tagname
    ) a`;
    
  return query;
};
