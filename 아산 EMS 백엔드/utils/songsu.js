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

exports.insertPopup2 = (reqbody) => {
  logger.info('insertPopup2 reqbody > ', reqbody);
  let query;

  if (reqbody.local === 'Industry') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '606-485-EMS-1004'
    `;
  } 
  else if (reqbody.local === 'Life') {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '${reqbody.search}',
          UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag = '606-485-EMS-2004'
    `;
  }

  return query;
};


exports.insertPopup3 = (reqbody) => {
  logger.info('insertPopup3 > ');
  let query
  if(reqbody.local === 'Industry'){
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '606-485-EMS-1901'
    `
  }
  else if(reqbody.local === 'Life')  {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET value = '0'
      WHERE tag = '606-485-EMS-2901'
    `
  } 

	return query
}

exports.insertPopup4 = (reqbody) => {
  logger.info('insertPopup4 > ', reqbody);
  let query
  if(reqbody.local === 'Industry'){
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('606-485-EMS-1901',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      '0',
      'WEB',
      'WEB',
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG),
      (select DATE_FORMAT(max(ts),'%Y-%m-%d %H:%i:00') from TB_DATA_RAW_TAG)
      )
    `
  }
  else if(reqbody.local === 'Life') {
    query = `
      INSERT IGNORE INTO TB_HMI_ALR_TAG (tag,time,value,ANLY_CD,DC_NMB,RGSTR_TIME,UPDT_TIME) 
      values('606-485-EMS-2901',
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
  if(reqbody.local === 'Industry'){
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('606-485-EMS-1001', '606-485-EMS-1002', '606-485-EMS-1003');
    `
  }
  else if(reqbody.local === 'Life')  {
    query = `
      UPDATE TB_PTR_CTR_INF
      SET UPDT_TIME = '${formatDateToLocal(reqbody.updt_time)}'
      WHERE tag IN ('606-485-EMS-2001', '606-485-EMS-2002', '606-485-EMS-2003');
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
    WHERE tag IN ('606-485-EMS-1901', '606-485-EMS-2901', '606-485-EMS-1001', '606-485-EMS-1002', '606-485-EMS-1003', '606-485-EMS-2001', '606-485-EMS-2002', '606-485-EMS-2003');
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
    SELECT 
      SUM(case when tagname='606-485-PAI-2208' then VALUE END) AS 공업전력,
      SUM(case when tagname='606-485-PRI-8006' then VALUE END) AS 공업관압,
      SUM(case when tagname='606-485-FRI-8005' then VALUE END) AS 공업유량,
      SUM(case when tagname='606-485-PMB-8528' then VALUE END) AS 공업펌프1가동상태운영,
      SUM(case when tagname='606-485-PMB-8529' then VALUE END) AS 공업펌프2가동상태운영,
      SUM(case when tagname='606-485-PMB-8530' then VALUE END) AS 공업펌프3가동상태운영,
      SUM(case when tagname='606-485-PMB-8531' then VALUE END) AS 공업펌프4가동상태운영,
      SUM(case when tagname='606-485-PMB-8532' then VALUE END) AS 공업펌프5가동상태운영,
      SUM(case when tagname='606-485-SPB-9103' then VALUE END) AS 공업변속펌프1주파수운영,
      SUM(case when tagname='606-485-SPB-9104' then VALUE END) AS 공업변속펌프2주파수운영,
      SUM(case when tagname='606-485-PWI-9540' OR tagname='606-485-PWI-9560' then VALUE END) AS 생활전력,
      SUM(case when tagname='606-485-PRI-8001' then VALUE END) AS 생활관압,
      SUM(case when tagname='606-485-FRI-8002' OR tagname='606-485-FRI-8009' then VALUE END) AS 생활펌프유량운영,
      SUM(case when tagname='606-485-PMB-8006' then VALUE END) AS 생활펌프1가동상태운영,
      SUM(case when tagname='606-485-PMB-8011' then VALUE END) AS 생활펌프2가동상태운영,
      SUM(case when tagname='606-485-PMB-8054' then VALUE END) AS 생활펌프3가동상태운영,
      SUM(case when tagname='606-485-PMB-8059' then VALUE END) AS 생활펌프4가동상태운영,
      SUM(case when tagname='606-485-PMI-8010' then VALUE END) AS 생활펌프1주파수,
      SUM(case when tagname='606-485-PMI-8026' then VALUE END) AS 생활펌프2주파수,
      SUM(case when tagname='606-485-PMI-8045' then VALUE END) AS 생활펌프3주파수,
      SUM(case when tagname='606-485-PMI-8053' then VALUE END) AS 생활펌프4주파수,
      SUM(case when tagname='606-485-PRI-8006' then VALUE END) AS 변속펌프AI운영관압,
      COALESCE(SUM(case when tagname='xxx-xxx-EMS-xxxx' then VALUE END),0) AS 최소요구관압정수장,
      COALESCE(SUM(case when tagname='xxx-xxx-EMS-xxxx' then VALUE END),0) AS 최소요구관압분기점
    FROM
    (	
      SELECT 
        ts,
        tagname,
        VALUE,
        ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn
      FROM TB_DATA_RAW_TAG 
      WHERE 
        tagname IN ('606-485-PAI-2208',
              '606-485-PRI-8006',
              '606-485-FRI-8005',
              '606-485-PMB-8528',
              '606-485-PMB-8529',
              '606-485-PMB-8530',
              '606-485-PMB-8531',
              '606-485-PMB-8532',
              '606-485-SPB-9103',
              '606-485-SPB-9104',
              '606-485-PWI-9540','606-485-PWI-9560',
              '606-485-PRI-8001',
              '606-485-FRI-8002','606-485-FRI-8009',
              '606-485-PMB-8006',
              '606-485-PMB-8011',
              '606-485-PMB-8054',
              '606-485-PMB-8059',
              '606-485-PMI-8010',
              '606-485-PMI-8026',
              '606-485-PMI-8045',
              '606-485-PMI-8053',
              '606-485-PRI-8006',
              'xxx-xxx-EMS-xxxx'
            ) 
        and ts >= DATE_ADD(NOW(),INTERVAL -10 MINUTE)
    ) subquery		
    WHERE rn = 1;
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
      e.life_ai_onoff,
      f.life_ai_onoff_auto,
      g.life_ai_onoff_auto_ban,
      h.life_ai_onoff_auto_ban_result
    FROM 
    -- 공업
    (
      SELECT VALUE ai_onoff
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-485-EMS-1001')
    )a LEFT join
    (
      SELECT VALUE ai_onoff_auto
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-485-EMS-1002')
    )b ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-485-EMS-1003')
    )c ON 1=1
    LEFT join
    (
      SELECT VALUE ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF 	WHERE tag IN ('606-485-EMS-1004')
    )d ON 1=1
    LEFT join
    -- 생활
    (
      SELECT VALUE life_ai_onoff
      FROM TB_PTR_CTR_INF WHERE tag IN ('606-485-EMS-2001')
    )e ON 1=1
    LEFT join
    (
      SELECT VALUE life_ai_onoff_auto
      FROM TB_PTR_CTR_INF WHERE tag IN ('606-485-EMS-2002')
    )f ON 1=1
    LEFT JOIN 
    (
      SELECT VALUE life_ai_onoff_auto_ban
      FROM TB_PTR_CTR_INF WHERE tag IN ('606-485-EMS-2003')
    )g ON 1=1
    LEFT join
    (
      SELECT VALUE life_ai_onoff_auto_ban_result
      FROM TB_PTR_CTR_INF WHERE tag IN ('606-485-EMS-2004')
    )h ON 1=1 
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
      MAX(CASE WHEN tag = '606-354-EMS-9000' THEN value END) AS 당진공업분석결과예상관압,
      MAX(CASE WHEN tag = '606-354-EMS-9001' THEN value END) AS 당진공업분석결과예상유량,
      MAX(CASE WHEN tag = '606-354-EMS-9504' THEN value END) AS 당진공업분석결과예상전력,
    /* 화면에서 필요없으면 삭제 요망
      MAX(CASE WHEN tag = '' THEN value END) AS p_TUBE_PRSR_PRDCT,
      MAX(CASE WHEN tag = '' THEN value END) AS p_PRDCT_MEAN,
      MAX(CASE WHEN tag = '' THEN value END) AS p_PWR_PRDCT,
    */  
      MAX(CASE WHEN tag = '606-354-EMS-9003' THEN value END) AS 당진생활분석결과예상유량,
      MAX(CASE WHEN tag = '606-354-EMS-9002' THEN value END) AS 당진생활분석결과예상관압,
      MAX(CASE WHEN tag = '606-354-EMS-9505' THEN value END) AS 당진생활예측전력,
      MAX(CASE WHEN tag = '606-354-EMS-9101' THEN value END) AS 변속펌프1가동상태운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9102' THEN value END) AS 변속펌프2가동상태운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9301' THEN value END) AS 변속펌프1가동상태운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9302' THEN value END) AS 변속펌프2가동상태운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9303' THEN value END) AS 변속펌프3가동상태운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9304' THEN value END) AS 변속펌프4가동상태운영_생활,	 
      MAX(CASE WHEN tag = '606-354-EMS-9201' THEN value END) AS 변속펌프1주파수운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9202' THEN value END) AS 변속펌프2주파수운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9401' THEN value END) AS 변속펌프1주파수운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9402' THEN value END) AS 변속펌프2주파수운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9403' THEN value END) AS 변속펌프3주파수운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9404' THEN value END) AS 변속펌프4주파수운영_생활,
      MAX(CASE WHEN tag = '606-354-EMS-9103' THEN value END) AS 정속펌프1가동상태운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9104' THEN value END) AS 정속펌프2가동상태운영_공업,
      MAX(CASE WHEN tag = '606-354-EMS-9105' THEN value END) AS 정속펌프3가동상태운영_공업,	 
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
      WHERE tag IN ('606-354-EMS-9000','606-354-EMS-9002','606-354-EMS-9001',
              '606-354-EMS-9003','606-354-EMS-9002','606-354-EMS-9003',
              '606-354-EMS-9505','606-354-EMS-9101','606-354-EMS-9102',
              '606-354-EMS-9302','606-354-EMS-9303','606-354-EMS-9304',
              '606-354-EMS-9201','606-354-EMS-9202','606-354-EMS-9402',
              '606-354-EMS-9403','606-354-EMS-9404','606-354-EMS-9103',
              '606-354-EMS-9104','606-354-EMS-9105','606-354-EMS-9301',
              'xxx-xxx-EMS-xxxx','xxx-xxx-EMS-xxxx','xxx-xxx-EMS-xxxx',
              'xxx-xxx-EMS-xxxx')
        AND TIME >= DATE_ADD(NOW(),INTERVAL -30 MINUTE)
    ) subquery
    WHERE rn = 1;
  `

  return query
}
//pumpSelect4

exports.pumpSelect4 = () => {
  logger.info('pumpSelect4 > ');
  let query = `
  SELECT zone, value
    FROM (
        SELECT 
            CASE 
                WHEN tagname = '606-354-FRI-9001' THEN 'CGN대산유량'
                WHEN tagname = '606-354-FRI-8052' THEN '석문분기생활용수유량'
                WHEN tagname = '606-485-FRI-4401' THEN '대산원수유입유량'
                WHEN tagname = '606-485-FRI-9800' THEN '송산2관로분기점유량'
            END AS zone,
            value,
            ROW_NUMBER() OVER (PARTITION BY tagname ORDER BY ts DESC) AS rn,
            tagname
        FROM TB_DATA_RAW_TAG
        WHERE tagname IN (
            '606-354-FRI-9001','606-354-FRI-8052','606-485-FRI-4401','606-485-FRI-9800'
        )
        AND ts >= DATE_ADD(NOW(), INTERVAL -60 MINUTE)
        -- AND ts >= DATE_ADD('2024-03-15', INTERVAL -1 MINUTE)
    ) AS ranked
    WHERE rn = 1
    ORDER BY FIELD(tagname, 
            '606-354-FRI-9001','606-354-FRI-8052','606-485-FRI-4401','606-485-FRI-9800'
    );
  `

  return query
}

exports.insertAIonOff = (reqbody) => {
  logger.info('insertAIonOff reqbody > ', reqbody);
  // let query = `
  //   INSERT INTO TB_HMI_TRNSP_TAG (tag, TIME, value, ANLY_CD, DC_NMB, RGSTR_TIME, UPDT_TIME) 
  //   VALUES
  //   (
  //     '${reqbody.search}',
  //     (
  //       SELECT DATE_FORMAT(MAX(ts),'%Y-%m-%d %H:%i:00')
  //       FROM TB_DATA_RAW_TAG
  //     ),
  //     '${reqbody.search2}',
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
      WHERE tagname IN ('606-485-PMB-8528')   -- 당진공업 ON/OFF
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4116') 
      WHERE tagname IN ('606-485-PMB-8529')   -- 당진공업
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4119') 
      WHERE tagname IN ('606-485-PMB-8530')   -- 당진공업
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4122') 
      WHERE tagname IN ('606-485-PMB-8531')   -- 당진공업
    AND ts = (
            SELECT MAX(ts)
            FROM TB_DATA_RAW_TAG
            WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
          ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    -- WHERE tagname IN ('745-617-PMB-4101') 
      WHERE tagname IN ('606-485-PMB-8532')   -- 당진공업
      AND ts = (
              SELECT MAX(ts)
              FROM TB_DATA_RAW_TAG
              WHERE ts >= DATE_ADD(NOW(), INTERVAL -1 DAY)
            ) 
    UNION ALL
    SELECT ts,ts
    FROM TB_DATA_RAW_TAG
    WHERE tagname IN ('606-485-SPI-7001')   -- 당진생활 4번펌프 ON/OFF(1,2,3 펌프는 없음)
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