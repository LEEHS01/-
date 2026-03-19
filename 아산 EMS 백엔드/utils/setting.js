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

//selectTagList
exports.getSelectTag = (zoneData) => {
  logger.info('getSelectTag zoneData > ', zoneData);
	let query = `
    SELECT
      a.zone,
      a.fac,
      fac_name,
      b.description, GROUP_CONCAT(a.tagname) AS tagname
    FROM TB_TAGINFO_2 a, TB_FAC b
    WHERE 1=1 
      AND a.fac = b.fac_code
    `

    if(zoneData.zone == '전체' || zoneData.zone == '') {
      query += `AND zone LIKE '%%'`
    } else if (zoneData.zone != '전체' && zoneData.zone) {
      query += `AND zone LIKE '%${zoneData.zone}%'`
    } else {
      query += `AND zone LIKE ''`			
    }
    query +=
     `	
    ${zoneData.fac ? `AND description LIKE '%${zoneData.fac}%'` : ''}
    ${zoneData.tagname ? `AND tagname LIKE '%${zoneData.tagname}%'` : ''}
    GROUP BY a.fac
  `

  return query
}

// updateTagInfo
exports.updateZone = (data) => {
  let tag = data.tag
  logger.info('updateZone tag > ', tag);
  let query = `
    UPDATE TB_TAGINFO_2 
      SET zone = '${tag.zone}'
    WHERE 
      fac = '${tag.fac}'
  `

  return query
}

// updateFac
exports.updateFac = (data) => {
  let tag = data.tag
  logger.info('updateFac tag > ', tag);
  let query = `
    UPDATE TB_FAC 
      SET description = '${tag.description}' 
    WHERE 
      fac_code = '${tag.fac}'
  `

  return query
}
