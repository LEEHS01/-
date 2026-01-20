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
  // let query = `
  //   INSERT INTO ems_service.HMI_CTR_TAG (tag, time, value, ANLY_CD, DC_NMB, RGSTR_TIME, UPDT_TIME) 
  //   VALUES ('${reqbody.search}', 
  //     (SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM ems_data.rawdata),
  //     '${reqbody.search2}',
  //     'WEB',
  //     'test',
  //     (SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM ems_data.rawdata),
  //     (SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM ems_data.rawdata))
  // `
  let query = `
    INSERT INTO TB_HMI_CTR_TAG (tag, time, value, ANLY_CD, DC_NMB, RGSTR_TIME, UPDT_TIME) 
    VALUES ('${reqbody.search}', 
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')),
      '${reqbody.search2}',
      'WEB',
      'test',
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')),
      (SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')))
  `

  return query
}

exports.updatePopup = () => {
  logger.info('updatePopup > ');
  let query = `
    UPDATE TB_MST_SUPPLY_PUMP
    SET SP_USE_YN = SP_PMS_USE_YN
  `

  return query
}

exports.initPopup = () => {
  let query = `
    UPDATE TB_PTR_CTR_INF
    SET value = '0'
    WHERE tag IN ('881-355-EMS-1004', '881-455-EMS-2004');  
  `

  return query
}

exports.insertPopup2 = (reqbody) => {
  logger.info('insertPopup2 reqbody > ', reqbody);
  let query;

  if (reqbody.local === 'CA') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '881-355-EMS-1004'
    `;
  } 
  else if (reqbody.local === 'MC') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '881-455-EMS-2004'
    `;
  }

  return query;
};

exports.insertPopup3 = (reqbody) => {
  logger.info('insertPopup3 > ');
  let query
  if(reqbody.local === 'CA'){
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '881-355-EMS-1901'
    `
  }
  else if(reqbody.local === 'MC')  {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '881-455-EMS-1901'
    `
  } 

	return query
}

exports.insertPopup4 = (reqbody) => {
  logger.info('insertPopup4 > ', reqbody);
  let query
  if(reqbody.local === 'CA'){
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('881-355-EMS-1901',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '0',
      'WEB',
      'WEB',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG)
      )
    `
  }
  else if(reqbody.local === 'MC') {
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('881-455-EMS-1901',
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
  logger.info('insertPopup5 > ');
  let query
  if(reqbody.local === 'CA'){
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('881-355-EMS-1003', '881-355-EMS-1002', '881-355-EMS-1001');
    `
  }
  else if(reqbody.local === 'MC')  {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('881-455-EMS-2003', '881-455-EMS-2002', '881-455-EMS-2001');
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
  logger.info('update TB_MST_SUPPLY_PUMP > ', reqbody);
  let query = `
    UPDATE TB_MST_SUPPLY_PUMP
    SET SP_PMS_USE_YN = '1'
    WHERE PMP_IDX = '${reqbody.search}'
  `

  return query
}

exports.PTR_CTR_INF = (reqbody) => {
  logger.info('TB_PTR_CTR_INF > ', reqbody);
  let query = `
    SELECT tag, value, UPDT_TIME, CONCAT('', TIMEDIFF(CURRENT_TIMESTAMP(),UPDT_TIME)) diff
    FROM TB_PTR_CTR_INF
    WHERE tag IN ('881-355-EMS-1901', '881-455-EMS-1901', '881-355-EMS-1001', '881-355-EMS-1002', '881-355-EMS-1003', '881-455-EMS-2001', '881-455-EMS-2002', '881-455-EMS-2003');
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
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_FO_STTS AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ) FO_VAL,
      RT_FC_STTS AS FC_TAG, 
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_FC_STTS AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ) FC_VAL,
      RT_OV_STTS AS POI_TAG, 
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_OV_STTS AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ) POI_VAL, 
      RT_WTR_LVL AS LEI_TAG,
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_WTR_LVL AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ) LEI_VAL, 
      RT_IN_FR AS IN_FLW_TAG,
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_IN_FR AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ) IN_FLW_VAL, 
      RT_OUT_FR AS OUT_FLW_TAG,
      (select value from TB_DATA_RAW_TAG WHERE tagname = RT_OUT_FR AND  ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY)) ) OUT_FLW_VAL, 
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
  `

  return query
}

exports.songsuSelect2 = () => {
  logger.info('songsuSelect2 > ');
  let query = `
    SELECT * 
    FROM 
    ( /*
        SELECT 
        (latest.VALUE - previous.VALUE) AS '천안정전력'
        FROM 
          (SELECT sum(VALUE) AS VALUE
          FROM TB_DATA_RAW_TAG
          WHERE tagname IN ('881-355-PWI-4101', '881-355-PWI-4102', '881-355-PWI-4103')
          AND ts = (SELECT distinct ts 
                FROM TB_DATA_RAW_TAG
                WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
                ORDER BY ts DESC
                LIMIT 1)
          ) AS latest,
          (SELECT sum(VALUE) AS VALUE
          FROM TB_DATA_RAW_TAG
          WHERE tagname IN ('881-355-PWI-4101', '881-355-PWI-4102', '881-355-PWI-4103')
          AND ts = (SELECT distinct ts 
                FROM TB_DATA_RAW_TAG
                WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
                ORDER BY ts DESC
                LIMIT 1 OFFSET 1)
          ) AS previous
        */
        SELECT sum(VALUE) AS '천안정전력'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PWI-9246', '881-355-PWI-9252', '881-355-PWI-9258' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG)
    ) a LEFT JOIN 
    (
        SELECT max(VALUE) AS '천안정관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PRI-4151', '881-355-PRI-4152', '881-355-PRI-4153' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) b ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-FRI-8001' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) c ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가전력'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-PWI-1010' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) a1 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-PRI-8050' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) b1 ON 1=1 
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-FRI-8002' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) c1 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정펌프1가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PMB-4111' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정펌프2가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PMB-4112' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정펌프3가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PMB-4113' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가펌프1가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455VPMB-8020' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d1 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가펌프2가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455VPMB-8030' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d2 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정변속펌프2주파수운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-HZI-4112' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) g ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정변속펌프3주파수운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-HZI-4113' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) h ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가변속펌프1주파수운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-SPC-1100' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) g1 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가변속펌프2주파수운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-SPC-1101' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) g2 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가분기유출압력'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-PRI-8051' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) i ON 1=1
  `

  return query
}

exports.songsuSelectPopup2 = () => {
  logger.info('songsuSelectPopup2 > ');
  let query = `
    SELECT * 
    FROM 
    (
        SELECT 
        (latest.VALUE - previous.VALUE) AS '천안정전력'
        FROM 
          (SELECT sum(VALUE) AS VALUE
          FROM TB_DATA_RAW_TAG
          WHERE tagname IN ('881-355-PWI-4101', '881-355-PWI-4102', '881-355-PWI-4103')
          AND ts = (SELECT distinct ts 
                FROM TB_DATA_RAW_TAG
                WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
                ORDER BY ts DESC
                LIMIT 1)
          ) AS latest,
          (SELECT sum(VALUE) AS VALUE
          FROM TB_DATA_RAW_TAG
          WHERE tagname IN ('881-355-PWI-4101', '881-355-PWI-4102', '881-355-PWI-4103')
          AND ts = (SELECT distinct ts 
                FROM TB_DATA_RAW_TAG
                WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
                ORDER BY ts DESC
                LIMIT 1 OFFSET 1)
          ) AS previous
    ) a LEFT JOIN 
    (
        SELECT max(VALUE) AS '천안정관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PRI-4151', '881-355-PRI-4152', '881-355-PRI-4153' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) b ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-FRI-8001' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) c ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가전력'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-PWI-1010' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) a1 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가관압'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-PRI-8050' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) b1 ON 1=1 
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가유량'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-FRI-8002' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) c1 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정펌프1가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PMB-4111' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정펌프2가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PMB-4112' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) e ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정펌프3가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-PMB-4113' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) f ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가펌프1가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455VPMB-8020' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d1 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가펌프2가동상태운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455VPMB-8030' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) d2 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정변속펌프2주파수운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-HZI-4112' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) g ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '천안정변속펌프3주파수운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-355-HZI-4113' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) h ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가변속펌프1주파수운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-SPC-1100' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) g1 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가변속펌프2주파수운영'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-SPC-1101' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) g2 ON 1=1
    LEFT JOIN 
    (
        SELECT VALUE AS '목천가분기유출압력'
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN ('881-455-PRI-8051' )   
          AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG WHERE ts >= DATE_ADD(NOW(),INTERVAL -1 DAY))
    ) i ON 1=1
  `

  return query
}

exports.songsuSelect3 = () => {
  logger.info('songsuSelect3 > ');
  let query = `
    SELECT 
      a.ai_onoff,
      b.ai_onoff_auto,
      c.ai_onoff_auto_ban,
      d.ai_onoff_auto_ban_result,
      e.mok_ai_onoff,
      f.mok_ai_onoff_auto,
      g.mok_ai_onoff_auto_ban,
      h.mok_ai_onoff_auto_ban_result
    FROM
      (SELECT VALUE AS ai_onoff FROM TB_PTR_CTR_INF WHERE tag = '881-355-EMS-1001') AS a
    LEFT JOIN
      (SELECT VALUE AS ai_onoff_auto FROM TB_PTR_CTR_INF WHERE tag = '881-355-EMS-1002') AS b ON 1 = 1
    LEFT JOIN
      (SELECT VALUE AS ai_onoff_auto_ban FROM TB_PTR_CTR_INF WHERE tag = '881-355-EMS-1003') AS c ON 1 = 1
    LEFT JOIN
      (SELECT VALUE AS ai_onoff_auto_ban_result FROM TB_PTR_CTR_INF WHERE tag = '881-355-EMS-1004') AS d ON 1 = 1
    -- 여기까지 천안정수장 
    -- 지금부터 목천가압장   
    LEFT JOIN
      (SELECT VALUE AS mok_ai_onoff FROM TB_PTR_CTR_INF WHERE tag = '881-455-EMS-2001') AS e ON 1 = 1
    LEFT JOIN
      (SELECT VALUE AS mok_ai_onoff_auto FROM TB_PTR_CTR_INF WHERE tag = '881-455-EMS-2002') AS f ON 1 = 1	 
    LEFT JOIN
      (SELECT VALUE AS mok_ai_onoff_auto_ban FROM TB_PTR_CTR_INF WHERE tag = '881-455-EMS-2003') AS g ON 1 = 1    
    LEFT JOIN
      (SELECT VALUE AS mok_ai_onoff_auto_ban_result FROM TB_PTR_CTR_INF WHERE tag = '881-455-EMS-2004') AS h ON 1 = 1 ;
  `

  return query
}

exports.pumpSelect = () => {
  logger.info('pumpSelect > ');
  let query = `
    SELECT 
      OPT_IDX, DATE_FORMAT(ANLY_TIME,'%Y-%m-%d %H:%i') ANLY_TIME, 
      DATE_FORMAT(PRDCT_TIME,'%Y-%m-%d %H:%i') PRDCT_TIME,
      PRDCT_T_DIFF,
      PMP_GRP,
      PRDCT_MEAN,
      PRDCT_STD, ROUND(TUBE_PRSR_PRDCT,2) TUBE_PRSR_PRDCT, ROUND(PWR_PRDCT,2) PWR_PRDCT,
      RGSTR_TIME,
      DC_NMB,
      FLAG
    FROM TB_CTR_OPT_RST2	/* 최적 펌프제어 지역결과 */
    WHERE ANLY_TIME = 
      (
        SELECT MAX(anly_time)
        FROM TB_CTR_OPT_RST2
        WHERE anly_time >= DATE_ADD(NOW(), INTERVAL -30 MINUTE)
      --  WHERE anly_time >= DATE_ADD('2023-02-28 00:00:00', INTERVAL -30 MINUTE)
      )
    ORDER BY PRDCT_T_DIFF,PMP_GRP,PRDCT_TIME
  `

  return query
}

exports.pumpSelect2 = () => {
  logger.info('pumpSelect2 > ');
  let query = `
    SELECT 
      A.OPT_IDX, DATE_FORMAT(A.ANLY_TIME,'%Y-%m-%d %H:%i') ANLY_TIME
      ,DATE_FORMAT(A.PRDCT_TIME,'%Y-%m-%d %H:%i') PRDCT_TIME,
      A.PRDCT_T_DIFF,
      A.PMP_GRP,
      A.PRDCT_MEAN,
      A.PRDCT_STD, ROUND(A.TUBE_PRSR_PRDCT,2) TUBE_PRSR_PRDCT,
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
                --    anly_time >= DATE_ADD('2023-03-01', INTERVAL -30 MINUTE)
                )
    ORDER BY A.PRDCT_T_DIFF,A.PMP_GRP
  `

  return query
}

exports.pumpSelect3 = () => {
  logger.info('pumpSelect3 > ');
  let query = `
    SELECT 
      MAX(CASE WHEN tag = '881-355-EMS-9000' THEN value END) AS 천안분석결과예상관압,
      MAX(CASE WHEN tag = '881-355-EMS-9001' THEN value END) AS 천안분석결과예상유량,
      MAX(CASE WHEN tag = '881-355-EMS-9002' THEN value END) AS 목천분석결과예상관압,
      MAX(CASE WHEN tag = '881-355-EMS-9003' THEN value END) AS 목천분석결과예상유량,
      MAX(CASE WHEN tag = '881-355-EMS-9004' THEN value END) AS p_PWR_PRDCT,
      MAX(CASE WHEN tag = '881-355-EMS-9005' THEN value END) AS s_PWR_PRDCT,
    /* 화면에서 필요없으면 삭제 요망
      MAX(CASE WHEN tag = '' THEN value END) AS p_TUBE_PRSR_PRDCT,
      MAX(CASE WHEN tag = '' THEN value END) AS p_PRDCT_MEAN,
      MAX(CASE WHEN tag = '' THEN value END) AS p_PWR_PRDCT,
    */  
      MAX(CASE WHEN tag = '881-355-EMS-9101' THEN value END) AS 정속펌프1가동상태운영_천안,
      MAX(CASE WHEN tag = '881-355-EMS-9102' THEN value END) AS 변속펌프2가동상태운영,
      MAX(CASE WHEN tag = '881-355-EMS-9103' THEN value END) AS 변속펌프3가동상태운영,
      MAX(CASE WHEN tag = '881-355-EMS-9301' THEN value END) AS 변속펌프1가동상태운영_목천,
      MAX(CASE WHEN tag = '881-355-EMS-9302' THEN value END) AS 변속펌프2가동상태운영_목천,
      MAX(CASE WHEN tag = '881-355-EMS-9202' THEN value END) AS 변속펌프2주파수운영_천안,
      MAX(CASE WHEN tag = '881-355-EMS-9203' THEN value END) AS 변속펌프3주파수운영_천안,
      MAX(CASE WHEN tag = '881-355-EMS-9401' THEN value END) AS 변속펌프1주파수운영_목천,
      MAX(CASE WHEN tag = '881-355-EMS-9402' THEN value END) AS 변속펌프2주파수운영_목천,
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
      WHERE tag IN ('881-355-EMS-9000','881-355-EMS-9001',
              '881-355-EMS-9002','881-355-EMS-9003','881-355-EMS-9004',
              '881-355-EMS-9005','881-355-EMS-9101','881-355-EMS-9102',
              '881-355-EMS-9103','881-355-EMS-9301','881-355-EMS-9302',
              '881-355-EMS-9202','881-355-EMS-9203','881-355-EMS-9401',
              '881-355-EMS-9402')
        AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1;
  `

  return query
}

// exports.pumpSelect3 = () => {
//   logger.info('pumpSelect3 > ');
//   let query = `
//     SELECT * FROM
//     (
//         SELECT value 천안분석결과예상관압  /* 천안분석결과 AI 예상관압 (F_CV) */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9000')
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) a_9,
//     (
//         SELECT value 목천분석결과예상관압  /* 목천분석결과 AI 예상관압 (F_CV) */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9002')
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) a_99,
//     (
//         SELECT value 천안분석결과예상유량  /* 천안분석결과 AI 예상유량 (F_CV) */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9001')
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) a_999,
//     (
//         SELECT value 목천분석결과예상유량  /* 목천분석결과 AI 예상유량 (F_CV) */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9003')
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) a_9999,
//     (
//         SELECT value p_TUBE_PRSR_PRDCT  /* 정속펌프 AI 예상관압 (F_CV) */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9000')
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) a,
//     (
//         SELECT value p_PRDCT_MEAN  /* AI 예상유량 */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9001' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) b,
//     (
//         SELECT value p_PWR_PRDCT  /* 천안 AI 소비전력 */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9004' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) c,
//     (
//         SELECT value s_TUBE_PRSR_PRDCT	/* 변속펌프 AI 예상관압 */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9002')
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE TIME >= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) a_1,
//     (
//         SELECT value s_PRDCT_MEAN  /* 변속펌프 AI 예상유량 */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9003' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time >= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) b_1,
//     (
//         SELECT value s_PWR_PRDCT /* 목천 AI 소비전력 */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9005' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE TIME >= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) c_1,
//     (
//         SELECT value 변속펌프2가동상태운영 /* 천안(정)변속펌프 AI 1번펌프 ON/OFF */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9102' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) d,
//     (
//         SELECT value 변속펌프3가동상태운영 /* 천안(정)변속펌프 AI 2번펌프 ON/OFF */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9103' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) d_1,
//     (
//         SELECT value 변속펌프1가동상태운영_목천 /* 목천가 변속펌프 AI 1번펌프 ON/OFF */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9301' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) e,
//     (
//         SELECT VALUE '변속펌프2가동상태운영_목천'  /* 목천가 변속펌프 AI 2번펌프 ON/OFF */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9302' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) ks1,
//     (
//         SELECT value 변속펌프2주파수운영_천안 /* 변속펌프 AI 1번펌프 주파수_천안(정) */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9202' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) f,
//     (
//         SELECT value 변속펌프3주파수운영_천안 /* 변속펌프 AI 2번펌프 주파수_천안(정) */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9203' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) g,
//     (
//         SELECT value 변속펌프1주파수운영_목천 /* 변속펌프1 AI 주파수_목천 */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9401' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) kss1,
//     (
//         SELECT value 변속펌프2주파수운영_목천 /* 변속펌프2 AI 주파수_목천 */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9402' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) kss2,
//     (
//         SELECT value 정속펌프1가동상태운영_천안 /* 정속 송수펌프1_천안(정) */
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9101' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) d1,
//     (
//         SELECT value 운영대수
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9003' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) h1,
//     (
//         SELECT value 운영모드
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('881-355-EMS-9003' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//     ) i1,
//     (
//         SELECT IFNULL( 	
//                     (
//                       SELECT VALUE  최소요구관압정수장
//                       FROM TB_PTR_CTR_ANLY_RST
//                       WHERE tag IN ('xxx-xxx-EMS-xxx' )
//                         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 MINUTE))
//                     )
//                   ,0) AS 최소요구관압정수장
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('xxx-xxx-EMS-xxx' )
//           AND time = (
//                     select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute)
//                   )
//       UNION all
//       SELECT 0 최소요구관압정수장 FROM DUAL LIMIT 1
//     ) ai_2,
//     (
//         SELECT IFNULL( 	
//                     (
//                       SELECT VALUE  최소요구관압분기점
//                       FROM TB_PTR_CTR_ANLY_RST
//                       WHERE tag IN ('xxx-xxx-EMS-xxx' )
//                         AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//                     )
//                 ,0 ) AS 최소요구관압분기점
//         FROM TB_PTR_CTR_ANLY_RST
//         WHERE tag IN ('xxx-xxx-EMS-xxx' )
//           AND time = (select max(time)  from TB_PTR_CTR_ANLY_RST WHERE time>= DATE_ADD(NOW(),INTERVAL -30 minute))
//         UNION all
//         SELECT 0 최소요구관압정수장 FROM DUAL LIMIT 1
//     ) ai_3
//   `

//   return query
// }

exports.pumpSelect4 = () => {
  logger.info('pumpSelect4 > ');
  let query = `
  SELECT zone, value
    FROM (
        SELECT 
            CASE 
                WHEN tagname = '881-455-PRI-8051' THEN '목천분기유출압력'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '881-455-PRI-8051'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -60 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '881-455-PRI-8051'
    );
  `

  return query
}

exports.insertAIonOff = (reqbody) => {
  logger.info('insertAIonOff reqbody > ', reqbody);
  // let query = `
  //   INSERT INTO ems_service.HMI_TRNSP_TAG (tag, time, value, ANLY_CD, DC_NMB, RGSTR_TIME, UPDT_TIME, FLAG) 
  //   VALUES ('${reqbody.search}',
  //       (SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM ems_data.rawdata),
  //       '${reqbody.search2}',
  //       'WEB',
  //       'test',
  //       (SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM ems_data.rawdata),
  //       (SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM ems_data.rawdata),
  //       '1')
  // `
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
    -- FROM ems_data.rawdata
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4113') 
      WHERE tagname IN ('881-355-PMB-4111')   -- 천안정수정 펌프1  ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4116') 
      WHERE tagname IN ('881-355-PMB-4112')   -- 천안정수정 펌프2  ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4119') 
      WHERE tagname IN ('881-355-PMB-4113')   -- 천안정수정 펌프3  ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4122') 
      WHERE tagname IN ('881-455-PMC-8020')   -- 목천가압장 펌프1 ON/OFF
    AND ts = (
            SELECT MAX(ts)
            FROM TB_DATA_RAW_TAG
            WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
          ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4101') 
      WHERE tagname IN ('881-455-PMC-8030')   -- -- 목천가압장 펌프2 ON/OFF
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