const logger = require('../logger').logger;

// selectpmpPerformList
exports.searchQuery_old = (data) => {
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

    console.log('가동이력: ',query)
  return query;
};

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
    query += `DATE_FORMAT(t2.ts, '%Y-%m-%d %H:%i')`;
  } else if (data.search4 === 'd') {
    query += `DATE_FORMAT(t2.ts, '%Y-%m-%d')`;
  } else if (data.search4 === 'm') {
    query += `DATE_FORMAT(t2.ts, '%Y-%m')`;
  } else if (data.search4 === 'y') {
    query += `DATE_FORMAT(t2.ts, '%Y')`;
  }
  query += ` ts, \n `
  if (data.search3 === 'PMB_TAG') {
    query += `t1.SP_ONOFF_STTS as tagname  \n`;
  } else if (data.search3 === 'PWI_TAG') {
    query += `t1.SP_INS_PWR as tagname  \n `;
  } else if (data.search3 === 'SPI_TAG') {
    query += `t1.SP_HZ_STTS as tagname  \n `;
  }


  query += ` ,ifnull(t2.value,0) value  \n` ;
  query += `    FROM ( select  \n` ;
  if (data.search3 === 'PMB_TAG') {
    query += `SP_ONOFF_STTS  \n`;
  } else if (data.search3 === 'PWI_TAG') {
    query += `SP_INS_PWR  \n`;
  } else if (data.search3 === 'SPI_TAG') {
    query += `SP_HZ_STTS  \n`;
  }   
  query += `FROM TB_MST_SUPPLY_PUMP  \n`;
  query += `) t1 LEFT OUTER JOIN   \n`
  query += `(  \n` ;
  query += ` SELECT DATE_FORMAT(ts, '%Y-%m-%d %H:%i') ts, tagname, value  \n` ;
  query += ` FROM TB_DATA_RAW_TAG  \n` ;
  query += ` where  \n` ;
  if (data.search4 === 'h' || data.search4 === 'd') {
    query += `ts >= CONCAT('${data.search}', ' 00:00:00') AND ts <= CONCAT('${data.search2}', ' 23:59:00') \n`;
  } else if (data.search4 === 'm') {
    query += `ts >= CONCAT('${data.search}-01 00:00:00') AND ts <= CONCAT('${data.search2}-31 23:59:00') \n`;
  } else if (data.search4 === 'y') {
    query += `ts >= CONCAT('${data.search}-01-01 00:00:00') AND ts <= CONCAT('${data.search2}-12-31 23:59:00') \n`;
  }
  query += ` AND ts LIKE ('%00:00')  \n ` 
  query += ` ) t2 ON ` 
  if (data.search3 === 'PMB_TAG') {
    query += `t1.SP_ONOFF_STTS=t2.tagname \n`;
  } else if (data.search3 === 'PWI_TAG') {
    query += `t1.SP_INS_PWR=t2.tagname \n`;
  } else if (data.search3 === 'SPI_TAG') {
    query += `t1.SP_HZ_STTS=t2.tagname \n`;
  }
  query += ` ) a` ;
  query += ` order by  name asc,ts asc `

    console.log('가동이력: ',query)
  return query;
};
