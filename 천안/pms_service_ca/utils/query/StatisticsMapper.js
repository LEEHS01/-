const logger = require('../../logger').logger

exports.facStatistics = () => {
  /* 
    사용챠트 : 설비별 상태 현황
    용도: PMS, 정상설비와 비정상 설비를 나타내는 쿼리
    테스트DB: SMART_PMS_CHEONAN
  */
  logger.info('StatisticsMapper::facStatistics > ');
  let query = `
    SELECT
      SUM(CASE WHEN broken_cnt = 0 then 1 ELSE 0 END) normal,
      SUM(CASE WHEN broken_cnt >= 1 then 1 ELSE 0 END) abnormal
    FROM
    (
      SELECT
        p1.pump_id, p1.center_id, p1.acq_date ,
        (
          m1.unbalance_alarm +
          m1.misalignment_alarm +
          m1.rotor_alarm +
          m1.de_bpfo_alarm +
          m1.DE_BPFI_alarm +
          m1.DE_BSF_alarm +
          m1.DE_FTF_alarm +
          m1.NDE_BPFO_alarm +
          m1.NDE_BPFI_alarm +
          m1.NDE_BSF_alarm +
          m1.NDE_FTF_alarm +
          m1.DE_rms_alarm +
          m1.NDE_rms_alarm +
          p1.impeller_alarm +
          p1.cavitation_alarm +
          p1.DE_bpfo_alarm +
          p1.DE_BPFI_alarm +
          p1.DE_BSF_alarm +
          p1.DE_FTF_alarm +
          p1.NDE_BPFO_alarm +
          p1.NDE_BPFI_alarm +
          p1.NDE_BSF_alarm +
          p1.NDE_FTF_alarm +
          p1.DE_rms_alarm +
          p1.NDE_rms_alarm
      ) broken_cnt
      FROM
      (
        SELECT * FROM
        (
          SELECT
            t.*
          FROM TB_AI_DIAG_MOTER t
          where t.acq_date in (
              SELECT
              -- center_id,
              max(acq_date) AS acq_date
      
              FROM
                TB_AI_DIAG_MOTER
              WHERE 1 = 1
              GROUP BY
                center_id
              ORDER BY
                acq_date DESC
            )
        ) sq
      )m1 INNER JOIN
      (
        SELECT * FROM
        (
          SELECT
            t.*
          FROM TB_AI_DIAG_PUMP t
          where t.acq_date in (
              SELECT
              -- center_id,
              max(acq_date) AS acq_date
      
              FROM
                TB_AI_DIAG_MOTER
              WHERE 1 = 1
              GROUP BY
                center_id
              ORDER BY
                acq_date DESC
            )
        ) sq
      )p1 ON m1.moter_id = p1.pump_id AND m1.center_id = p1.center_id
    )t
  `;

  return query;
}

exports.diagStatistics = () => {
  /* 
    사용챠트 : 진단별 상태 현황
    용도: PMS, 전체설비, 정상설비와 비정상 설비를 나탸내는 쿼리
    테스트DB: SMART_PMS_CHEONAN
  */
  logger.info('StatisticsMapper::diagStatistics > ');
  let query = `
    SELECT
      SUM(CASE WHEN broken_cnt >= 0 then 1 ELSE 0 END) tot_cnt,
      SUM(CASE WHEN broken_cnt = 0 then 1 ELSE 0 END) normal,
      SUM(CASE WHEN broken_cnt >= 1 then 1 ELSE 0 END) abnormal
    FROM
    (
      SELECT
        p1.pump_id, p1.center_id, p1.acq_date , 
        (	
          m1.unbalance_alarm +	
          m1.misalignment_alarm + 
          m1.rotor_alarm + 
          m1.de_bpfo_alarm + 
          m1.DE_BPFI_alarm +
          m1.DE_BSF_alarm +
          m1.DE_FTF_alarm +
          m1.NDE_BPFO_alarm +
          m1.NDE_BPFI_alarm +
          m1.NDE_BSF_alarm +
          m1.NDE_FTF_alarm +
          m1.DE_rms_alarm +
          m1.NDE_rms_alarm +
          p1.impeller_alarm +
          p1.cavitation_alarm +
          p1.DE_bpfo_alarm +
          p1.DE_BPFI_alarm +
          p1.DE_BSF_alarm +
          p1.DE_FTF_alarm +
          p1.NDE_BPFO_alarm +
          p1.NDE_BPFI_alarm +
          p1.NDE_BSF_alarm +
          p1.NDE_FTF_alarm +
          p1.DE_rms_alarm +
          p1.NDE_rms_alarm
      ) broken_cnt
      FROM
      (
        SELECT 
          t.* 
        FROM TB_AI_DIAG_MOTER t
        WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -1 MONTH)
      )m1 INNER JOIN
      ( 
        SELECT 
          t.* 
        FROM TB_AI_DIAG_PUMP t
        WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -1 MONTH)
      )p1 ON m1.moter_id = p1.pump_id AND m1.acq_date = p1.acq_date
    )t
  `;

  return query;
}

exports.defectAlarmAll = () => {
  /* 
    사용챠트 : 결함별 알람 현황
    용도: PMS, 결함별 알람 보여주는 것
    테스트DB: SMART_PMS_CHEONAN
  */
  logger.info('StatisticsMapper::defectAlarmAll > ');
  let query = `
    SELECT
      SUM(unbalance_alarm_m) as 질량불평형알람 ,
      SUM(misalignment_alarm_m) as 축정렬불량알람,
      SUM(rotor_alarm_m) as 로터진폭알람,
      SUM(de_bpfo_alarm_m) as 모터드라이브외륜결함알람,
      SUM(DE_BPFI_alarm_m) as 모터드라이브내륜결함알람,
      SUM(DE_BSF_alarm_m) as 모터드라이브볼결함알람,
      SUM(DE_FTF_alarm_m) as 모터드라이브트레인결함알람,
      SUM(NDE_BPFO_alarm_m) as 모터논드라이브외륜알람,
      SUM(NDE_BPFI_alarm_m) as 모터논드라이브내륜알람,
      SUM(NDE_BSF_alarm_m) as 모터논드라이브볼알람,
      SUM(NDE_FTF_alarm_m) as 모터논드라이브트레인알람,
      SUM(DE_rms_alarm_m) as 모터드라이브총진동량알람,
      SUM(NDE_rms_alarm_m) as 모터논드라이브총진동량알람,
      SUM(impeller_alarm_p) as 임펠러알람,
      SUM(cavitation_alarm_p) as 캐비테이션알람,
      SUM(DE_bpfo_alarm_p) as 펌프드라이브외륜알람,
      SUM(DE_BPFI_alarm_p) as 펌프드라이브내륜알람,
      SUM(DE_BSF_alarm_p) as 펌프드라이브볼알람,
      SUM(DE_FTF_alarm_p) as 펌프드라이브트레인알람,
      SUM(NDE_BPFO_alarm_p) as 펌프논드라이브외륜알람,
      SUM(NDE_BPFI_alarm_p) as 펌프논드라이브내륜알람,
      SUM(NDE_BSF_alarm_p) as 펌프논드라이브볼알람,
      SUM(NDE_FTF_alarm_p) as 펌프논드라이브트레인알람,
      SUM(DE_rms_alarm_p) as 펌프드라이브총진동량,
      SUM(NDE_rms_alarm_p) as 펌프논드라이브총진동량알람
    FROM
    (
      SELECT
        p1.pump_id, p1.center_id, p1.acq_date , 
        m1.unbalance_alarm AS unbalance_alarm_m,
        m1.misalignment_alarm AS misalignment_alarm_m,
        m1.rotor_alarm AS rotor_alarm_m,
        m1.de_bpfo_alarm AS de_bpfo_alarm_m,
        m1.DE_BPFI_alarm AS DE_BPFI_alarm_m ,
        m1.DE_BSF_alarm AS DE_BSF_alarm_m,
        m1.DE_FTF_alarm AS DE_FTF_alarm_m ,
        m1.NDE_BPFO_alarm AS NDE_BPFO_alarm_m ,
        m1.NDE_BPFI_alarm AS NDE_BPFI_alarm_m,
        m1.NDE_BSF_alarm AS NDE_BSF_alarm_m,
        m1.NDE_FTF_alarm AS NDE_FTF_alarm_m,
        m1.DE_rms_alarm AS DE_rms_alarm_m,
        m1.NDE_rms_alarm AS NDE_rms_alarm_m ,
        p1.impeller_alarm AS impeller_alarm_p,
        p1.cavitation_alarm AS cavitation_alarm_p,
        p1.DE_bpfo_alarm AS DE_bpfo_alarm_p ,
        p1.DE_BPFI_alarm AS DE_BPFI_alarm_p,
        p1.DE_BSF_alarm AS DE_BSF_alarm_p ,
        p1.DE_FTF_alarm AS DE_FTF_alarm_p,
        p1.NDE_BPFO_alarm AS NDE_BPFO_alarm_p,
        p1.NDE_BPFI_alarm AS NDE_BPFI_alarm_p ,
        p1.NDE_BSF_alarm AS NDE_BSF_alarm_p,
        p1.NDE_FTF_alarm AS NDE_FTF_alarm_p,
        p1.DE_rms_alarm AS DE_rms_alarm_p,
        p1.NDE_rms_alarm AS NDE_rms_alarm_p
      FROM
      (
        SELECT 
          t.* 
        FROM TB_AI_DIAG_MOTER t
        WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -1 MONTH)
      )m1 INNER JOIN
      ( 
        SELECT 
          t.* 
        FROM TB_AI_DIAG_PUMP t
        WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -1 MONTH)
      )p1 ON m1.moter_id = p1.pump_id AND m1.acq_date = p1.acq_date
    )t
  `;

  return query;
}

exports.weeklyAlarm = () => {
  /* 
    사용챠트 : 주간 알람 추이 현황
    용도: PMS, 전체설비, 정상설비와 비정상 설비를 나탸내는 쿼리
    테스트DB: SMART_PMS_CHEONAN
    
    참고: 테스트는 해당 쿼리로 실행하고, 
          실제 반영할때는 야래 주석  쿼리 사용(-- WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -7 DAY))
    */
  logger.info('StatisticsMapper::weeklyAlarm > ');
  let query = `
    SELECT
      DATE_FORMAT(p1.acq_date, '%y-%m-%d') AS date ,
      SUM(	
        m1.unbalance_alarm +	
        m1.misalignment_alarm + 
        m1.rotor_alarm + 
        m1.de_bpfo_alarm + 
        m1.DE_BPFI_alarm +
        m1.DE_BSF_alarm +
        m1.DE_FTF_alarm +
        m1.NDE_BPFO_alarm +
        m1.NDE_BPFI_alarm +
        m1.NDE_BSF_alarm +
        m1.NDE_FTF_alarm +
        m1.DE_rms_alarm +
        m1.NDE_rms_alarm +
        p1.impeller_alarm +
        p1.cavitation_alarm +
        p1.DE_bpfo_alarm +
        p1.DE_BPFI_alarm +
        p1.DE_BSF_alarm +
        p1.DE_FTF_alarm +
        p1.NDE_BPFO_alarm +
        p1.NDE_BPFI_alarm +
        p1.NDE_BSF_alarm +
        p1.NDE_FTF_alarm +
        p1.DE_rms_alarm +
        p1.NDE_rms_alarm
    ) broken_cnt
    FROM
    (
      SELECT t.* 
      FROM TB_AI_DIAG_MOTER t
    --  WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -7 MONTH)
      WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -7 DAY)
    )m1 INNER JOIN
    ( 
      SELECT t.* 
      FROM TB_AI_DIAG_PUMP t
    --  WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -7 MONTH)
      WHERE acq_date >= DATE_ADD(NOW(),INTERVAL -7 DAY)
    )p1 ON m1.moter_id = p1.pump_id AND m1.acq_date = p1.acq_date
    GROUP BY DATE_FORMAT(p1.acq_date, '%y-%m-%d')
  `;

  return query;
}

exports.alarmList = (reqbody) => {
  /* 
    사용그리드 : 알람리스트
    테스트DB: SMART_PMS_CHEONAN
    
    참고: 테스트는 해당 쿼리로 실행하고, 
          실제 반영할때는 야래 주석  쿼리 사용 -- AND acq_date >= CONCAT(#{search}) AND acq_date <= concat(#{search2})
  */
  logger.info('StatisticsMapper::alarmList > ');
  let query = `
    SELECT 
      DATE_FORMAT(acq_date,'%Y-%m-%d %H:%i') AS DATE,
      CASE 
        WHEN CAST(RIGHT(moter_id,2) AS INT) >=1 AND CAST(RIGHT(moter_id,2) AS INT) <= 5 then '전동1'
        WHEN CAST(RIGHT(moter_id,2) AS INT) >=6 AND CAST(RIGHT(moter_id,2) AS INT) <= 12 then '전동2'
        WHEN CAST(RIGHT(moter_id,2) AS INT) >=13 AND CAST(RIGHT(moter_id,2) AS INT) <= 19 then '전동3'
      END AS 전동그룹,
      CONCAT(RIGHT(moter_id,2),'호기') AS hogi,
      'MOTOR' AS gbn,
      CONCAT(
            CASE WHEN t.unbalance_alarm > 0 THEN '질량불평형, ' ELSE '' END,
            CASE WHEN t.misalignment_alarm > 0 THEN '축정렬불량, ' ELSE '' END,
            CASE WHEN t.rotor_alarm > 0 THEN '로터진폭, ' ELSE '' END,
            CASE WHEN t.de_bpfo_alarm > 0 THEN '드라이브외륜결함, ' ELSE '' END,
            CASE WHEN t.DE_BPFI_alarm > 0 THEN '드라이브내륜결함, ' ELSE '' END,
            CASE WHEN t.DE_BSF_alarm > 0 THEN '드라이브볼결함, ' ELSE '' END,
            CASE WHEN t.DE_FTF_alarm > 0 THEN '드라이브트레인결함, ' ELSE '' END,
            CASE WHEN t.NDE_BPFO_alarm > 0 THEN '논드라이브외륜, ' ELSE '' END,
            CASE WHEN t.NDE_BPFI_alarm > 0 THEN '논드라이브내륜, ' ELSE '' END,
            CASE WHEN t.NDE_BSF_alarm > 0 THEN '논드라이브볼, ' ELSE '' END,
            CASE WHEN t.NDE_FTF_alarm > 0 THEN '논드라이브트레인, ' ELSE '' END,
            CASE WHEN t.DE_rms_alarm > 0 THEN '드라이브총진동량, ' ELSE '' END,
            CASE WHEN t.NDE_rms_alarm > 0 THEN '논드라이브총진동량, ' ELSE '' END
        ) AS alarm_types, 
        'Alert' alarm_status
    FROM TB_AI_DIAG_MOTER t
    WHERE 1=1
      AND acq_date >= DATE_FORMAT(STR_TO_DATE('${reqbody.search}', '%Y%m%d'), '%Y-%m-%d 00:00:00') 
      AND acq_date <= DATE_FORMAT(STR_TO_DATE('${reqbody.search2}', '%Y%m%d'), '%Y-%m-%d 23:59:59')
    --  AND (DATE_FORMAT(acq_date,'%Y-%m-%d') >= CONCAT('2024-05-01') AND DATE_FORMAT(acq_date,'%Y-%m-%d') <= CONCAT('2024-05-31'))
      AND (	
          t.unbalance_alarm +	
          t.misalignment_alarm + 
          t.rotor_alarm + 
          t.de_bpfo_alarm + 
          t.DE_BPFI_alarm +
          t.DE_BSF_alarm +
          t.DE_FTF_alarm +
          t.NDE_BPFO_alarm +
          t.NDE_BPFI_alarm +
          t.NDE_BSF_alarm +
          t.NDE_FTF_alarm +
          t.DE_rms_alarm +
          t.NDE_rms_alarm 
        ) > 0
    UNION ALL	
    SELECT 
      DATE_FORMAT(acq_date,'%Y-%m-%d %H:%i') AS DATE,
      CASE 
        WHEN CAST(RIGHT(pump_id,2) AS INT) >=1 AND CAST(RIGHT(pump_id,2) AS INT) <= 5 then '전동1'
        WHEN CAST(RIGHT(pump_id,2) AS INT) >=6 AND CAST(RIGHT(pump_id,2) AS INT) <= 12 then '전동2'
        WHEN CAST(RIGHT(pump_id,2) AS INT) >=13 AND CAST(RIGHT(pump_id,2) AS INT) <= 19 then '전동3'
      END AS 전동그룹,
      CONCAT(RIGHT(pump_id,2),'호기') AS hogi,
      'PUMP' as gbn, 
      CONCAT(
            CASE WHEN t.impeller_alarm > 0 THEN '임펠러, ' ELSE '' END,
            CASE WHEN t.cavitation_alarm > 0 THEN '캐비테이션, ' ELSE '' END,
            CASE WHEN t.DE_bpfo_alarm > 0 THEN '드라이브외륜, ' ELSE '' END,
            CASE WHEN t.DE_BPFI_alarm > 0 THEN '드라이브내륜, ' ELSE '' END,
            CASE WHEN t.DE_BSF_alarm > 0 THEN '드라이브볼, ' ELSE '' END,
            CASE WHEN t.DE_FTF_alarm > 0 THEN '드라이브트레인, ' ELSE '' END,
            CASE WHEN t.NDE_BPFO_alarm > 0 THEN '논드라이브외륜, ' ELSE '' END,
            CASE WHEN t.NDE_BPFI_alarm > 0 THEN '논드라이브내륜, ' ELSE '' END,
            CASE WHEN t.NDE_BSF_alarm > 0 THEN '논드라이브볼, ' ELSE '' END,
            CASE WHEN t.NDE_FTF_alarm > 0 THEN '논드라이브트레인, ' ELSE '' END,
            CASE WHEN t.DE_rms_alarm > 0 THEN '드라이브총진동량, ' ELSE '' END,
            CASE WHEN t.NDE_rms_alarm > 0 THEN '논드라이브총진동량, ' ELSE '' END
        ) AS alarm_types, 
        'Alert' alarm_status
    FROM TB_AI_DIAG_PUMP t
    WHERE 1=1
      AND acq_date >= DATE_FORMAT(STR_TO_DATE('${reqbody.search}', '%Y%m%d'), '%Y-%m-%d 00:00:00') 
      AND acq_date <= DATE_FORMAT(STR_TO_DATE('${reqbody.search2}', '%Y%m%d'), '%Y-%m-%d 23:59:59')
    --  AND (DATE_FORMAT(acq_date,'%Y-%m-%d') >= CONCAT('2024-05-01') AND DATE_FORMAT(acq_date,'%Y-%m-%d') <= CONCAT('2024-05-31'))
      AND (
          t.impeller_alarm +
          t.cavitation_alarm +
          t.DE_bpfo_alarm +
          t.DE_BPFI_alarm +
          t.DE_BSF_alarm +
          t.DE_FTF_alarm +
          t.NDE_BPFO_alarm +
          t.NDE_BPFI_alarm +
          t.NDE_BSF_alarm +
          t.NDE_FTF_alarm +
          t.DE_rms_alarm +
          t.NDE_rms_alarm
      ) > 0
  `;

  return query;
}
