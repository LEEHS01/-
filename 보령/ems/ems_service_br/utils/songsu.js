const logger = require('../logger').logger;
const { format, parseISO } = require('date-fns');

const formatDateToLocal = (isoDate) => {
  const date = parseISO(isoDate);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};


exports.getPopup = () => {
  logger.info('getPopup > ');
	let query = `
    SELECT *
    FROM TB_MST_SUPPLY_PUMP
  `

	return query
}

exports.insertPopup = (reqbody) => {
  logger.info('insertPopup reqbody > ', reqbody);
  let query = `
    INSERT INTO TB_HMI_CTR_TAG (tag, TIME,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
    VALUES
    (
      '${reqbody.search}',
      (
        SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
        FROM TB_DATA_RAW_TAG
      ),
      '${reqbody.search2}',
      'WEB',
      'test',
      (
        SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
        FROM TB_DATA_RAW_TAG
      ),
      (
      SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
      FROM TB_DATA_RAW_TAG
      )
    )
  `

  return query
}

exports.updatePopup = () => {
  logger.info('updatePopup > ');
  let query = `
    UPDATE TB_MST_SUPPLY_PUMP 
    SET SP_AVLBL = PMS_USE_YN 
  `

  return query
}

exports.insertPopup2 = (reqbody) => {
  logger.info('insertPopup2 reqbody > ', reqbody);
	let query
  if(reqbody.local === 'Boryeong'){
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '606-359-EMS-1004'
    `
  }
  else if(reqbody.local === 'Cheongyang') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '606-459-EMS-1004'
    `
  }
  else if(reqbody.local === 'Seosan') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '600-456-EMS-1004'
    `
  }
  else if(reqbody.local === 'Yesan') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '600-456-EMS-2004'
    `
  }
  else if(reqbody.local === 'Dangjin') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '600-457-EMS-1004'
    `
  }
  else if(reqbody.local === 'Taean') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '600-457-EMS-2004'
    `
  }

	return query
}

exports.insertPopup3 = (reqbody) => {
  logger.info('insertPopup3 > ', reqbody);
	let query
  if(reqbody.local === 'Boryeong'){
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '606-359-EMS-1901'
    `
  }
  else if(reqbody.local === 'Cheongyang') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '606-459-EMS-1901'
    `
  }
  else if(reqbody.local === 'Seosan') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '600-456-EMS-1901'
    `
  }
  else if(reqbody.local === 'Yesan') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '600-456-EMS-2901'
    `
  }
  else if(reqbody.local === 'Dangjin') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '600-457-EMS-1901'
    `
  }
  else if(reqbody.local === 'Taean') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '600-457-EMS-2901'
    `
  }

	return query
}

exports.insertPopup4 = (reqbody) => {
  logger.info('insertPopup4 > ', reqbody);
	let query
  if(reqbody.local === 'Boryeong'){
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('606-359-EMS-1901',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '0',
      'WEB',
      'WEB',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG)
      )
    `
  }
  else if(reqbody.local === 'Cheongyang') {
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('606-459-EMS-1901',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '0',
      'WEB',
      'WEB',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG)
      )
    `
  }
  else if(reqbody.local === 'Seosan') {
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('600-456-EMS-1901',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '0',
      'WEB',
      'WEB',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG)
      )
    `
  }
  else if(reqbody.local === 'Yesan') {
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('600-456-EMS-2901',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '0',
      'WEB',
      'WEB',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG)
      )
    `
  }
  else if(reqbody.local === 'Dangjin') {
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('600-457-EMS-1901',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '0',
      'WEB',
      'WEB',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG)
      )
    `
  }
  else if(reqbody.local === 'Taean') {
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('600-457-EMS-2901',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '0',
      'WEB',
      'WEB',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG)
      )
    `
  }

	return query
}

exports.insertPopup5 = (reqbody) => {
  logger.info('insertPopup5 > ', reqbody);
	let query
  if(reqbody.local === 'Boryeong'){
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('606-359-EMS-1001', '606-359-EMS-1002', '606-359-EMS-1003');
    `
  }
  else if(reqbody.local === 'Cheongyang') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('606-459-EMS-1001', '606-459-EMS-1002', '606-459-EMS-1003');
    `
  }
  else if(reqbody.local === 'Seosan') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('600-456-EMS-1001', '600-456-EMS-1002', '600-456-EMS-1003');
    `
  }
  else if(reqbody.local === 'Yesan') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('600-456-EMS-2001', '600-456-EMS-2002', '600-456-EMS-2003');
    `
  }
  else if(reqbody.local === 'Dangjin') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('600-457-EMS-1001', '600-457-EMS-1002', '600-457-EMS-1003');
    `
  }
  else if(reqbody.local === 'Taean') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('600-457-EMS-2001', '600-457-EMS-2002', '600-457-EMS-2003');
    `
  }

	return query
}

exports.insertPopup6 = (reqbody) => {
  logger.info('insertPopup6 > ', reqbody);
  let query = '';
  logger.info(reqbody.ai_info)
  
  let dataRows = reqbody.ai_info;

  query = `
    INSERT IGNORE INTO TB_HMI_CTR_LOG (tag, time, value, ANLY_CD, DC_NMB, RGSTR_TIME, UPDT_TIME, FLAG) 
    VALUES 
  `;
  dataRows.forEach((row, index) => {
    query += `
      ('${row.tag}', 
      '${formatDateToLocal(reqbody.updt_time)}', 
      '${row.value}', 
      'WEB', 
      'WEB', 
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG), 
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '${reqbody.flag}'
      )${index < dataRows.length - 1 ? ',' : ''} 
    `;
  });
  return query;
}

exports.updateCTR_PRF_PMPMST_INF = (reqbody) => {
  logger.info('updateCTR_PRF_PMPMST_INF reqbody > ', reqbody);
	let query = `
    UPDATE TB_MST_SUPPLY_PUMP 
    SET SP_AVLBL = '1'
    WHERE S_ID = '${reqbody.search}'	/* 계통id */
      AND SP_ID = '${reqbody.search}'	/* 펌프id */
  `

	return query
}

exports.PTR_CTR_INF = () => {
  logger.info('PTR_CTR_INF > ');
  let query = `
    SELECT tag, value, UPDT_TIME, CONCAT('', TIMEDIFF(CURRENT_TIMESTAMP(),UPDT_TIME)) diff
    FROM TB_PTR_CTR_INF
    WHERE tag IN (
    '606-359-EMS-1901', '606-359-EMS-1001', '606-359-EMS-1002', '606-359-EMS-1003', 
    '606-459-EMS-1901', '606-459-EMS-1001', '606-459-EMS-1002', '606-459-EMS-1003',
    '600-456-EMS-1901', '600-456-EMS-1001', '600-456-EMS-1002', '600-456-EMS-1003', 
    '600-456-EMS-2901', '600-456-EMS-2001', '600-456-EMS-2002', '600-456-EMS-2003',
    '600-457-EMS-1901', '600-457-EMS-1001', '600-457-EMS-1002', '600-457-EMS-1003', 
    '600-457-EMS-2901', '600-457-EMS-2001', '600-457-EMS-2002', '600-457-EMS-2003'
    );
    `

	return query
}


/*
	AI분석 > 송수펌프 제어 > 송수펌프제어 세부현황(, songsuSelect)
	: tagname이 FO_TAG, FC_TAG.... 등등의 확정이 필요(화면단에서 태그값 보내야 할 것 같음).
	: 태그 확정시 까지 보류
*/
exports.songsuSelect = () => {
  logger.info('songsuSelect > ');
  let query = `
    SELECT 
      S_ID AS TNK_GRP_IDX,
      R_ID AS TNK_IDX,
      RT_ID AS VLV_IDX,
      R_ID AS TNK_GRP_NM,
      '' AS PMP_GRP,
      '' AS PMP_GRP_NM,
      RT_FO_STTS AS FO_TAG,
      IFNULL((select value from TB_DATA_RAW_TAG WHERE tagname = RT_FO_STTS AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ),'0') FO_VAL,
      RT_FC_STTS AS FC_TAG, 
      IFNULL((select value from TB_DATA_RAW_TAG WHERE tagname = RT_FC_STTS AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ),'0') FC_VAL,
      RT_OV_STTS AS POI_TAG, 
      IFNULL((select value from TB_DATA_RAW_TAG WHERE tagname = RT_OV_STTS AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ),'0') POI_VAL, 
      RT_WTR_LVL AS LEI_TAG,
      IFNULL((select value from TB_DATA_RAW_TAG WHERE tagname = RT_WTR_LVL AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ),'0') LEI_VAL, 
      RT_IN_FR AS IN_FLW_TAG,
      IFNULL((select value from TB_DATA_RAW_TAG WHERE tagname = RT_IN_FR AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ),'0') IN_FLW_VAL, 
      RT_OUT_FR AS OUT_FLW_TAG,
      IFNULL((select value from TB_DATA_RAW_TAG WHERE tagname = RT_OUT_FR AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ),'0') OUT_FLW_VAL, 
      RT_MIN_RQRMN_PR AS DMD_PRI,
      RT_WTR_LVL_LCL AS LWL_LIM,
      RT_WTR_LVL_UCL AS HWL_LIM,
      '' AS MIN_LOAD_LWL,
      '' AS MAX_LOAD_LWL,
      '' AS VLM,
      '' AS LWL,
      '' AS HWL,
      '' AS BASE_AREA,
      '' AS USE_YN
    FROM TB_MST_RESERVOIR_TANK
     WHERE R_ID <> '흡수정'
  `

	return query
}

exports.songsuSelect2_br = () => {
  logger.info('songsuSelect2_br > ');
  let query = `
    SELECT * 
    FROM 
    (
        SELECT sum(VALUE) /*변속펌프소비전력운영 */ '보령전력' 
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-PAI-1408','600-359-PAI-1508','600-359-PAI-1608','600-359-PAI-1708','600-359-PAI-1808','600-359-PAI-1908' )  
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) a LEFT JOIN
    (
        SELECT sum(VALUE) /* 변속펌프관압운영 */ '보령관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-PRI-4410' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) b ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프유량운영 */ '보령유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-FRI-4410')   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) c ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '정속펌프1가동상태운영_보령'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-PMB-4015' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '정속펌프2가동상태운영_보령'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-PMB-4025' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '정속펌프3가동상태운영_보령'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-PMB-4035' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_1 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '정속펌프4가동상태운영_보령'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-PMB-4045' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_2 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '정속펌프5가동상태운영_보령'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-PMB-4055' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_3 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '정속펌프6가동상태운영_보령'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-359-PMB-4065' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_4 ON 1=1
  `

	return query
}

exports.songsuSelect2_cy = () => {
  logger.info('songsuSelect2_cy > ');
  let query = `
    SELECT * 
    FROM 
    (
        SELECT sum(VALUE) /*변속펌프소비전력운영 */ '청양전력' 
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-PWI-8012','600-459-PWI-8010','600-459-PWI-8008')  
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) a LEFT JOIN
    (
        SELECT sum(VALUE) /* 변속펌프관압운영 */ '청양관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-PRI-8001' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) b ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프유량운영 */ '청양유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-FRI-8002')   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) c ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1가동상태운영_청양'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-PMB-8005' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프2가동상태운영_청양'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-PMB-8003' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프3가동상태운영_청양'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-PMB-8001' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_1 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1주파수_청양'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-SPC-8002' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_2 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프2주파수_청양'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-SPC-8001' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_3 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프3주파수_청양'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-459-SPC-8000' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_4 ON 1=1
  `

	return query
}

exports.songsuSelect2_hs = () => {
  logger.info('songsuSelect2_hs > ');
  let query = `
    SELECT * 
    FROM 
    (
        SELECT sum(VALUE) /*변속펌프소비전력운영 */ '서산전력' 
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PAI-1408','600-456-PAI-1508','600-456-PAI-1608', '600-456-PAI-1708' )  
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) a LEFT JOIN
    (
        SELECT sum(VALUE) /* 변속펌프관압운영 */ '서산관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PRI-8040' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) b ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프유량운영 */ '서산유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-FRI-8040')   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) c ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1가동상태운영_서산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-XXB-9044' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프2가동상태운영_서산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-XXB-9046' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프3가동상태운영_서산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PAB-1600' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_1 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프4가동상태운영_서산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PAB-1700' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_2 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1_2주파수_서산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-SPC-9000' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_3 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '인버터운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-XXB-9002' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_4 ON 1=1
    LEFT JOIN
    (
        SELECT sum(VALUE) /*변속펌프소비전력운영 */ '예산전력' 
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PAI-1808','600-456-PAI-1908','600-456-PAI-2008', '600-456-PAI-2108' )  
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f ON 1=1 
    LEFT JOIN
    (
        SELECT sum(VALUE) /* 변속펌프관압운영 */ '예산관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PRI-8030' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_1 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프유량운영 */ '예산유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-FRI-8030')   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_2 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1가동상태운영_예산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-XXB-8800' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_3 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프2가동상태운영_예산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PAB-1900' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_4 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프3가동상태운영_예산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PAB-2000' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_5 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프4가동상태운영_예산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-PAB-2100' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_6 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1주파수_예산'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-456-SPC-8800' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_7 ON 1=1


  `

	return query
}

exports.songsuSelect2_ss = () => {
  logger.info('songsuSelect2_ss > ');
  let query = `
    SELECT * 
    FROM 
    (
        SELECT sum(VALUE) /*변속펌프소비전력운영 */ '당진전력' 
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-XXB-9105','600-457-PAI-1508','600-457-XXB-9108', '600-457-PAI-1708' )  
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) a
    LEFT JOIN
    (
        SELECT sum(VALUE) /* 변속펌프관압운영 */ '당진관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-PRI-8030' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) b ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프유량운영 */ '당진유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-FRI-8030')   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) c ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1가동상태운영_당진'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-XXB-9018' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프2가동상태운영_당진'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-PAB-1500' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프3가동상태운영_당진'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-XXB-9020' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_1 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프4가동상태운영_당진'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-PAB-1700' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_2 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1주파수_당진'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-XXC-9020' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_3 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프3가동상태운영 */ '펌프3주파수_당진'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-XXC-9021' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e_4 ON 1=1
    LEFT JOIN
    (
        SELECT sum(VALUE) /*변속펌프소비전력운영 */ '태안전력' 
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-SPB-8803','600-457-PAI-1908','600-457-PAI-2008', '600-457-PAI-2108' )  
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f ON 1=1 
    LEFT JOIN
    (
        SELECT sum(VALUE) /* 변속펌프관압운영 */ '태안관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-PRI-8020' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_1 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프유량운영 */ '태안유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-FRI-8020')   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_2 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1가동상태운영_태안'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-XXB-8800' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_3 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프2가동상태운영_태안'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-PAB-1900' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_4 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프3가동상태운영_태안'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-PAB-2000' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_5 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프2가동상태운영 */ '펌프4가동상태운영_태안'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-PAB-2100' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_6 ON 1=1
    LEFT JOIN
    (
        SELECT VALUE /* 변속펌프1가동상태운영 */ '펌프1주파수_태안'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('600-457-SPC-8800' )   AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f_7 ON 1=1


  `

	return query
}

// songsuSelect3
exports.songsuSelect3_br = () => {
  logger.info('songsuSelect3_br > ');
	let query = `
    SELECT 
      a.ai_onoff,
      b.ai_onoff_auto,
      c.ai_onoff_auto_ban,
      d.ai_onoff_auto_ban_result
    FROM 
    (
      SELECT VALUE ai_onoff
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-359-EMS-1001')
    )a LEFT join
    (
      SELECT VALUE ai_onoff_auto
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-359-EMS-1002')
    )b ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-359-EMS-1003')
    )c ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-359-EMS-1004')
    )d ON 1=1
  `

	return query
}

// songsuSelect3
exports.songsuSelect3_cy = () => {
  logger.info('songsuSelect3_cy > ');
	let query = `
    SELECT 
      a.ai_onoff,
      b.ai_onoff_auto,
      c.ai_onoff_auto_ban,
      d.ai_onoff_auto_ban_result
    FROM 
    (
      SELECT VALUE ai_onoff
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-459-EMS-1001')
    )a LEFT join
    (
      SELECT VALUE ai_onoff_auto
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-459-EMS-1002')
    )b ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-459-EMS-1003')
    )c ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-459-EMS-1004')
    )d ON 1=1
  `

	return query
}

// songsuSelect3
exports.songsuSelect3_br = () => {
  logger.info('songsuSelect3_br > ');
	let query = `
    SELECT 
      a.ai_onoff,
      b.ai_onoff_auto,
      c.ai_onoff_auto_ban,
      d.ai_onoff_auto_ban_result
    FROM 
    (
      SELECT VALUE ai_onoff
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-359-EMS-1001')
    )a LEFT join
    (
      SELECT VALUE ai_onoff_auto
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-359-EMS-1002')
    )b ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-359-EMS-1003')
    )c ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-359-EMS-1004')
    )d ON 1=1
  `

	return query
}

// songsuSelect3
exports.songsuSelect3_cy = () => {
  logger.info('songsuSelect3_cy > ');
	let query = `
    SELECT 
      a.ai_onoff,
      b.ai_onoff_auto,
      c.ai_onoff_auto_ban,
      d.ai_onoff_auto_ban_result
    FROM 
    (
      SELECT VALUE ai_onoff
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-459-EMS-1001')
    )a LEFT join
    (
      SELECT VALUE ai_onoff_auto
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-459-EMS-1002')
    )b ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-459-EMS-1003')
    )c ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-459-EMS-1004')
    )d ON 1=1
  `

	return query
}


// songsuSelect3
exports.songsuSelect3_hs = () => {
  logger.info('songsuSelect3_hs > ');
	let query = `
    SELECT 
      a.ai_onoff,
      b.ai_onoff_auto,
      c.ai_onoff_auto_ban,
      d.ai_onoff_auto_ban_result,
      e.ys_ai_onoff,
      f.ys_ai_onoff_auto,
      g.ys_ai_onoff_auto_ban,
      h.ys_ai_onoff_auto_ban_result
    FROM 
    -- 서산
    (
      SELECT VALUE ai_onoff
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('600-456-EMS-1001')
    )a LEFT join
    (
      SELECT VALUE ai_onoff_auto
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('600-456-EMS-1002')
    )b ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('600-456-EMS-1003')
    )c ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('600-456-EMS-1004')
    )d ON 1=1
    LEFT join
    -- 예산
    (
      SELECT VALUE ys_ai_onoff
      FROM TB_PTR_CTR_INF WHERE tag IN ('600-456-EMS-2001')
    )e ON 1=1
    LEFT join
    (
      SELECT VALUE ys_ai_onoff_auto
      FROM TB_PTR_CTR_INF WHERE tag IN ('600-456-EMS-2002')
    )f ON 1=1
    LEFT JOIN 
    (
      SELECT VALUE ys_ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF WHERE tag IN ('600-456-EMS-2003')
    )g ON 1=1
    LEFT join
    (
      SELECT VALUE ys_ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF WHERE tag IN ('600-456-EMS-2004')
    )h ON 1=1
  `

	return query
}

// songsuSelect3
exports.songsuSelect3_ss = () => {
  logger.info('songsuSelect3_ss > ');
	let query = `
    SELECT 
      a.ai_onoff,
      b.ai_onoff_auto,
      c.ai_onoff_auto_ban,
      d.ai_onoff_auto_ban_result,
      e.ta_ai_onoff,
      f.ta_ai_onoff_auto,
      g.ta_ai_onoff_auto_ban,
      h.ta_ai_onoff_auto_ban_result
    FROM 
    -- 당진
    (
      SELECT VALUE ai_onoff
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('600-457-EMS-1001')
    )a LEFT join
    (
      SELECT VALUE ai_onoff_auto
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('600-457-EMS-1002')
    )b ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('600-457-EMS-1003')
    )c ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('600-457-EMS-1004')
    )d ON 1=1
    LEFT join
    -- 태안
    (
      SELECT VALUE ta_ai_onoff
      FROM TB_PTR_CTR_INF WHERE tag IN ('600-457-EMS-2001')
    )e ON 1=1
    LEFT join
    (
      SELECT VALUE ta_ai_onoff_auto
      FROM TB_PTR_CTR_INF WHERE tag IN ('600-457-EMS-2002')
    )f ON 1=1
    LEFT JOIN 
    (
      SELECT VALUE ta_ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF WHERE tag IN ('600-457-EMS-2003')
    )g ON 1=1
    LEFT join
    (
      SELECT VALUE ta_ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF WHERE tag IN ('600-457-EMS-2004')
    )h ON 1=1
  `

	return query
}

exports.pumpSelect = () => {
  logger.info('pumpSelect > ');
  let query = `
    SELECT 
      OPT_IDX, 
      DATE_FORMAT(ANLY_TIME,'%Y-%m-%d %H:%i') ANLY_TIME, 
      DATE_FORMAT(PRDCT_TIME,'%Y-%m-%d %H:%i') PRDCT_TIME,
      PRDCT_T_DIFF,
      PMP_GRP,
      PRDCT_MEAN,
      PRDCT_STD, 
      ROUND(TUBE_PRSR_PRDCT,2) TUBE_PRSR_PRDCT, 
      ROUND(PWR_PRDCT,2) PWR_PRDCT,
      RGSTR_TIME,
      DC_NMB,
      FLAG
    FROM TB_CTR_OPT_RST2
    WHERE ANLY_TIME = 
        (
          SELECT MAX(anly_time)
          FROM TB_CTR_OPT_RST2
          WHERE anly_time >= DATE_ADD(NOW(), INTERVAL -30 MINUTE)
        )
    ORDER BY PRDCT_T_DIFF,PMP_GRP,PRDCT_TIME
  `

  return query
}

exports.pumpSelect2 = () => {
  logger.info('pumpSelect2 > ');
  let query = `
    SELECT 
      A.OPT_IDX, 
      DATE_FORMAT(A.ANLY_TIME,'%Y-%m-%d %H:%i') ANLY_TIME,
      DATE_FORMAT(A.PRDCT_TIME,'%Y-%m-%d %H:%i') PRDCT_TIME,
      A.PRDCT_T_DIFF,
      A.PMP_GRP,
      A.PRDCT_MEAN,
      A.PRDCT_STD, 
      ROUND(A.TUBE_PRSR_PRDCT,2) TUBE_PRSR_PRDCT,
      ROUND(A.PWR_PRDCT,2) PWR_PRDCT,
      A.RGSTR_TIME,
      A.DC_NMB,
      A.FLAG,
      B.YN,
      B.FREQ,
      B.PMP_IDX,
      B.PMP_TYP
    FROM TB_CTR_OPT_RST2 A, TB_CTR_PMPYN_RST B
    WHERE A.OPT_IDX = B.OPT_IDX 
      AND A.ANLY_TIME = 
                (
                  SELECT MAX(anly_time)
                  FROM TB_CTR_OPT_RST2
                  WHERE 
                    anly_time >= DATE_ADD(NOW(), INTERVAL -30 MINUTE)
    --                anly_time >= DATE_ADD('2023-03-01', INTERVAL -30 MINUTE)
                )
    ORDER BY A.PRDCT_T_DIFF,A.PMP_GRP
  `

  return query
}

// pumpSelect3
exports.pumpSelect3_br = () => {
  logger.info('pumpSelect3_br > ');
  let query = `
    SELECT 
      MAX(CASE WHEN tag = '606-359-EMS-9000' THEN value END) AS 보령분석결과예상관압,
      MAX(CASE WHEN tag = '606-359-EMS-9001' THEN value END) AS 보령분석결과예상유량,
      MAX(CASE WHEN tag = '606-359-EMS-9002' THEN value END) AS 보령분석결과예상전력,
      MAX(CASE WHEN tag = '606-359-EMS-9101' THEN value END) AS 정속펌프1가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9102' THEN value END) AS 정속펌프2가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9103' THEN value END) AS 정속펌프3가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9104' THEN value END) AS 정속펌프4가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9105' THEN value END) AS 정속펌프5가동상태운영_보령,
      MAX(CASE WHEN tag = '606-359-EMS-9106' THEN value END) AS 정속펌프6가동상태운영_보령,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영대수,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영모드,
      COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압정수장,
    COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압분기점
    FROM (
      SELECT 
          tag,
          VALUE,
          ROW_NUMBER() OVER (PARTITION BY tag ORDER BY time DESC) AS rn
      FROM TB_PTR_CTR_ANLY_RST
      WHERE tag IN ('606-359-EMS-9000','606-359-EMS-9001','606-359-EMS-9002', 
              '606-359-EMS-9101','606-359-EMS-9102','606-359-EMS-9103',
              '606-359-EMS-9104','606-359-EMS-9105','606-359-EMS-9106', 'xxx-xxx-EMS-xxxx')
        AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1
  `

  return query
}

// pumpSelect3
exports.pumpSelect3_ss = () => {
  logger.info('pumpSelect3_ss > ');
  let query = `
    SELECT 
      MAX(CASE WHEN tag = '600-400-EMS-9000' THEN value END) AS 당진분석결과예상관압,
      MAX(CASE WHEN tag = '600-400-EMS-9002' THEN value END) AS 태안분석결과예상관압,
      MAX(CASE WHEN tag = '600-400-EMS-9001' THEN value END) AS 당진분석결과예상유량,
      MAX(CASE WHEN tag = '600-400-EMS-9003' THEN value END) AS 태안분석결과예상유량,
      MAX(CASE WHEN tag = '600-400-EMS-9004' THEN value END) AS 당진분석결과예상전력,
      MAX(CASE WHEN tag = '600-400-EMS-9005' THEN value END) AS 태안분석결과예상전력,
      MAX(CASE WHEN tag = '600-400-EMS-9101' THEN value END) AS 펌프1가동상태운영_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9102' THEN value END) AS 펌프2가동상태운영_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9103' THEN value END) AS 펌프3가동상태운영_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9104' THEN value END) AS 펌프4가동상태운영_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9301' THEN value END) AS 펌프1가동상태운영_태안,
      MAX(CASE WHEN tag = '600-400-EMS-9302' THEN value END) AS 펌프2가동상태운영_태안,
      MAX(CASE WHEN tag = '600-400-EMS-9303' THEN value END) AS 펌프3가동상태운영_태안,
      MAX(CASE WHEN tag = '600-400-EMS-9304' THEN value END) AS 펌프4가동상태운영_태안,
      MAX(CASE WHEN tag = '600-400-EMS-9201' THEN value END) AS 펌프1주파수_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9202' THEN value END) AS 펌프3주파수_당진,
      MAX(CASE WHEN tag = '600-400-EMS-9401' THEN value END) AS 펌프1주파수_태안,
      
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영대수,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영모드,
      COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압정수장,
    COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압분기점
    FROM (
      SELECT 
          tag,
          value,
          ROW_NUMBER() OVER (PARTITION BY tag ORDER BY time DESC) AS rn
      FROM TB_PTR_CTR_ANLY_RST
      WHERE tag IN ('600-400-EMS-9000','600-400-EMS-9002','600-400-EMS-9001', 
              '600-400-EMS-9003','600-400-EMS-9004','600-400-EMS-9005',
              '600-400-EMS-9101','600-400-EMS-9102','600-400-EMS-9103',
              '600-400-EMS-9104','600-400-EMS-9301','600-400-EMS-9302',
              '600-400-EMS-9303','600-400-EMS-9304','600-400-EMS-9201',
              '600-400-EMS-9202','600-400-EMS-9401','xxx-xxx-EMS-xxxx')
      AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1
  `

  return query
}

// pumpSelect3
exports.pumpSelect3_cy = () => {
  logger.info('pumpSelect3_cy > ');
  let query = `
    SELECT 
      MAX(CASE WHEN tag = '600-401-EMS-9000' THEN value END) AS 청양분석결과예상관압,
      MAX(CASE WHEN tag = '600-401-EMS-9001' THEN value END) AS 청양분석결과예상유량,
      MAX(CASE WHEN tag = '600-401-EMS-9002' THEN value END) AS 청양분석결과예상전력,
      MAX(CASE WHEN tag = '600-401-EMS-9101' THEN value END) AS 펌프1가동상태운영_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9102' THEN value END) AS 펌프2가동상태운영_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9103' THEN value END) AS 펌프3가동상태운영_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9201' THEN value END) AS 펌프1주파수_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9202' THEN value END) AS 펌프2주파수_청양,
      MAX(CASE WHEN tag = '600-401-EMS-9203' THEN value END) AS 펌프3주파수_청양,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영대수,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영모드,
      COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압정수장,
    COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압분기점
    FROM (
      SELECT 
          tag,
          value,
          ROW_NUMBER() OVER (PARTITION BY tag ORDER BY time DESC) AS rn
      FROM TB_PTR_CTR_ANLY_RST
      WHERE tag IN ('600-401-EMS-9000','600-401-EMS-9001','600-401-EMS-9002', 
              '600-401-EMS-9101','600-401-EMS-9102','600-401-EMS-9103',
              '600-401-EMS-9201','600-401-EMS-9202','600-401-EMS-9203',
              'xxx-xxx-EMS-xxxx')
        AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1
  `

  return query
}

// pumpSelect3
exports.pumpSelect3_hs = () => {
  logger.info('pumpSelect3_hs > ');
  let query = `
    SELECT 
      MAX(CASE WHEN tag = '600-402-EMS-9000' THEN value END) AS 서산분석결과예상관압,
      MAX(CASE WHEN tag = '600-402-EMS-9001' THEN value END) AS 서산분석결과예상유량,
      MAX(CASE WHEN tag = '600-402-EMS-9004' THEN value END) AS 서산분석결과예상전력,
      MAX(CASE WHEN tag = '600-402-EMS-9002' THEN value END) AS 예산분석결과예상관압,
      MAX(CASE WHEN tag = '600-402-EMS-9003' THEN value END) AS 예산분석결과예상유량,
      MAX(CASE WHEN tag = '600-402-EMS-9005' THEN value END) AS 예산분석결과예상전력,
      MAX(CASE WHEN tag = '600-402-EMS-9101' THEN value END) AS 펌프1가동상태운영_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9102' THEN value END) AS 펌프2가동상태운영_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9103' THEN value END) AS 펌프3가동상태운영_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9104' THEN value END) AS 펌프4가동상태운영_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9105' THEN value END) AS 펌프1가동상태운영_예산,
      MAX(CASE WHEN tag = '600-402-EMS-9106' THEN value END) AS 펌프2가동상태운영_예산,
      MAX(CASE WHEN tag = '600-402-EMS-9107' THEN value END) AS 펌프3가동상태운영_예산,
      MAX(CASE WHEN tag = '600-402-EMS-9108' THEN value END) AS 펌프4가동상태운영_예산,
      MAX(CASE WHEN tag = '600-402-EMS-9201' THEN value END) AS 펌프1주파수_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9202' THEN value END) AS 펌프2주파수_서산,
      MAX(CASE WHEN tag = '600-402-EMS-9205' THEN value END) AS 펌프1주파수_예산,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영대수,
      MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END) AS 운영모드,
      COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압정수장,
    COALESCE(MAX(CASE WHEN tag = 'xxx-xxx-EMS-xxxx' THEN value END),0) AS 최소요구관압분기점
    FROM (
      SELECT 
          tag,
          value,
          ROW_NUMBER() OVER (PARTITION BY tag ORDER BY time DESC) AS rn
      FROM TB_PTR_CTR_ANLY_RST
      WHERE tag IN ('600-402-EMS-9000','600-402-EMS-9001','600-402-EMS-9004', 
              '600-402-EMS-9002','600-402-EMS-9003','600-402-EMS-9005',
              '600-402-EMS-9101','600-402-EMS-9102','600-402-EMS-9103',
              '600-402-EMS-9104','600-402-EMS-9105','600-402-EMS-9106',
              '600-402-EMS-9107','600-402-EMS-9108','600-402-EMS-9201',
              '600-402-EMS-9202','600-402-EMS-9205','xxx-xxx-EMS-xxxx')
      AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1
  `

  return query
}

//pumpSelect4

exports.pumpSelect4_br = () => {
  logger.info('pumpSelect4_br > ');
  let query = `
  SELECT zone, value
    FROM (
        SELECT 
            CASE 
                WHEN tagname = '600-456-FRI-8001' THEN '홍성유입유량'
                WHEN tagname = '600-359-PRI-8010' THEN '청양분기압력'
                WHEN tagname = '600-359-PRI-8621' THEN '서천관말분기압력'
                WHEN tagname = '600-359-PRI-8700' THEN '송수터널후단압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '600-456-FRI-8001','600-359-PRI-8010','600-359-PRI-8621','600-359-PRI-8700'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -5 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '600-456-FRI-8001','600-359-PRI-8010','600-359-PRI-8621','600-359-PRI-8700'
    );
  `

  return query
}

exports.pumpSelect4_ss = () => {
  logger.info('pumpSelect4_ss > ');
  let query = `
  SELECT zone, value
    FROM (
        SELECT 
            CASE
                WHEN tagname = '600-457-PRI-8701' THEN '당진관말압력'
                WHEN tagname = '600-500-FRI-9401' THEN '팔봉유출유량'
                WHEN tagname = '600-457-FRI-8661' THEN '태안관말유량'
                WHEN tagname = '600-457-PRI-8661' THEN '태안관말압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '600-457-PRI-8701','600-500-FRI-9401','600-457-FRI-8661','600-457-PRI-8661'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -5 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '600-457-PRI-8701','600-500-FRI-9401','600-457-FRI-8661','600-457-PRI-8661'
    );
  `
  return query
}

exports.pumpSelect4_cy = () => {
  logger.info('pumpSelect4_cy > ');
  let query = `
  SELECT zone, value
    FROM (
        SELECT 
            CASE
                WHEN tagname = '600-359-FRI-8012' THEN '청양유입유량'
                WHEN tagname = '600-359-PRI-8010' THEN '청양유입압력'
                WHEN tagname = '600-459-PRI-8020' THEN '청양유출분기압력'
                WHEN tagname = '600-459-PRI-8040' THEN '청양유량분기압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '600-359-FRI-8012','600-359-PRI-8010','600-459-PRI-8020','600-459-PRI-8040'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -5 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '600-359-FRI-8012','600-359-PRI-8010','600-459-PRI-8020','600-459-PRI-8040'
    );
  `
  return query
}

exports.pumpSelect4_hs = () => {
  logger.info('pumpSelect4_hs > ');
  let query = `
  SELECT zone, value
    FROM (
        SELECT 
            CASE 
                WHEN tagname = '600-500-FRI-8205' THEN '수석신유입유량'
                WHEN tagname = '600-456-PRI-8641' THEN '구항압력'
                WHEN tagname = '600-456-PRI-8651' THEN '갈산압력'
                WHEN tagname = '600-457-PRI-8641' THEN '수석압력'
                WHEN tagname = '600-456-PRI-8621' THEN '남장압력'
                WHEN tagname = '600-456-PRI-8631' THEN '예산관말압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '600-500-FRI-8205','600-456-PRI-8641','600-456-PRI-8651','600-457-PRI-8641',
            '600-456-PRI-8621','600-456-PRI-8631'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -5 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '600-500-FRI-8205','600-456-PRI-8641','600-456-PRI-8651','600-457-PRI-8641',
            '600-456-PRI-8621','600-456-PRI-8631'
    );
  `
  return query
}

exports.insertAIonOff = (reqbody) => {
  logger.info('insertAIonOff reqbody > ', reqbody);
  // let query = `
  //   INSERT INTO TB_HMI_TRNSP_TAG (tag, TIME,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
  //   VALUES
  //   (
  //     '${reqbody.search}',
  //     (
  //       SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
  //       FROM TB_DATA_RAW_TAG
  //     ),
  //     '${reqbody.search2},
  //     'WEB',
  //     'test',
  //     (
  //       SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
  //       FROM TB_DATA_RAW_TAG
  //     ),
  //     (
  //       SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
  //       FROM TB_DATA_RAW_TAG
  //     )
  //   )
  let query = `
  INSERT INTO TB_HMI_TRNSP_TAG (tag, time, value, ANLY_CD, DC_NMB, RGSTR_TIME, UPDT_TIME, FLAG) 
  VALUES ('${reqbody.search}',
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')),
      '${reqbody.search2}',
      'WEB',
      'test',
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')),
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')),
      '1')
  `

	return query
}

exports.updateAIonOff = (reqbody) => {
  logger.info('updateAIonOff reqbody > ', reqbody);
	let query = `
    UPDATE TB_PTR_CTR_INF 
    SET value = '${reqbody.search2}' 
    WHERE tag = '${reqbody.search}'
  `

	return query
}

exports.interpuppt = () => {
  logger.info('interpuppt > ');
	let query = `
    SELECT *
    FROM 
    (
      SELECT IFNULL(
                (
                  SELECT VALUE a
                  FROM TB_DATA_RAW_TAG
                  -- WHERE tagname IN ('745-617-VVB-4325') 
                  WHERE tagname IN ('XXX-XXX-VVB-XXXX') 
                    AND ts = (
                            SELECT MAX(ts)
                            FROM TB_DATA_RAW_TAG
                            WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
                          )
                )
              ,0) AS a
      FROM TB_DATA_RAW_TAG
    --	WHERE tagname IN ('745-617-VVB-4325') 
      WHERE tagname IN ('XXX-XXX-VVB-XXXX') 
        AND ts = (
                SELECT MAX(ts)
                FROM TB_DATA_RAW_TAG
                WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
              ) 
      UNION ALL
      SELECT 0 a FROM DUAL
      LIMIT 1
    )a,
    (
      SELECT IFNULL
              (	
                (
                  SELECT VALUE b
                  FROM TB_DATA_RAW_TAG
                  -- WHERE tagname IN ('745-617-VVB-4328') 
                  WHERE tagname IN ('XXX-XXX-VVB-XXXX') 
                    AND ts = (
                            SELECT MAX(ts)
                            FROM TB_DATA_RAW_TAG
                            WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
                          )
                )
              ,0) AS b
      FROM TB_DATA_RAW_TAG
    --	WHERE tagname IN ('745-617-VVB-4328') 
      WHERE tagname IN ('XXX-XXX-VVB-XXXX') 
        AND ts = (
                SELECT MAX(ts)
                FROM TB_DATA_RAW_TAG
                WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
              ) 
      UNION ALL
      SELECT 0 b FROM DUAL
      LIMIT 1
    )b,
    (
      SELECT IFNULL(
                (
                  SELECT VALUE c
                  FROM TB_DATA_RAW_TAG
                  -- WHERE tagname IN ('745-617-VVB-4331') 
                  WHERE tagname IN ('XXX-XXX-VVB-XXXX') 
                    AND ts = (
                            SELECT MAX(ts)
                            FROM TB_DATA_RAW_TAG
                            WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
                          )
                )
              ,0) AS c
      FROM TB_DATA_RAW_TAG
    --	WHERE tagname IN ('745-617-VVB-4331') 
      WHERE tagname IN ('XXX-XXX-VVB-XXXX') 
        AND ts = (
                SELECT MAX(ts)
                FROM TB_DATA_RAW_TAG
                WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
              ) 
      UNION ALL
      SELECT 0 c FROM DUAL
      LIMIT 1
    )c,
    (
      SELECT IFNULL(	
                (
                  SELECT VALUE d
                  FROM TB_DATA_RAW_TAG
                  -- WHERE tagname IN ('745-617-VVB-4334') 
                  WHERE tagname IN ('XXX-XXX-VVB-XXXX') 
                  AND ts = (
                          SELECT MAX(ts)
                          FROM TB_DATA_RAW_TAG
                          WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
                        )
                )
              ,0) AS d
      FROM TB_DATA_RAW_TAG
    --	WHERE tagname IN ('745-617-VVB-4334') 
      WHERE tagname IN ('XXX-XXX-VVB-XXXX') 
        AND ts = (
                SELECT MAX(ts)
                FROM TB_DATA_RAW_TAG
                WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
              ) 
      UNION ALL
      SELECT 0 d FROM DUAL
      LIMIT 1
    )d  
  `

	return query
}

exports.getPumpTime = () => {
  logger.info('getPumpTime > ');
  let query = `
    SELECT DATE_FORMAT(ts,'%Y-%m-%d %H:%i:00') ts,ts t
    FROM TB_DATA_RAW_TAG
      WHERE tagname IN ('600-359-PMC-4012')   -- 보령정수장  펌프1  ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
      WHERE tagname IN ('600-359-PMC-4022')   -- 보령정수장 펌프2  ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
      WHERE tagname IN ('600-359-PMC-4032')   -- 보령정수장 펌프3  ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
      WHERE tagname IN ('600-359-PMC-4042')   -- 보령정수장 펌프4 ON/OFF
    AND ts = (
            SELECT MAX(ts)
            FROM TB_DATA_RAW_TAG
            WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
          ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
      WHERE tagname IN ('600-359-PMC-4052')   -- 보령정수장 펌프5 ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
      WHERE tagname IN ('600-359-PMC-4062')   -- 보령정수장 펌프6 ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            )
  `

	return query
}

exports.insertAIpopupAlarm = (reqbody) => {
  logger.info('insertAIpopupAlarm');
  let query = `
    INSERT INTO TB_EMS_ALARM (ALARM_ID, TIME, MSG, LINK, RGSTR_TIME, UPDT_TIME, FLAG) 
    VALUES (233000, 
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')),
      'AI 펌프제어 추천 팝업이 발생했습니다',
      'http://10.73.1.53:38085/songsu',
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')),
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')),
      '5')
  `

  return query
}