const logger = require('../../logger').logger

exports.flowPressure = (data) => {
  /*
  송수펌프("상태정보[유량, 압력]", flowPressure) -> UI 삭제, 불필요
  */
  logger.info('MotorMapper::flowPressure > ', data);
  let query = `
    SELECT 
      flow_rate, 
      pressure 
    FROM 
    TB_PUMP_SCADA 
    WHERE 
    acq_date = (
    SELECT 
      acq_date 
    FROM 
      TB_PUMP_SCADA 
    WHERE 
      acq_date >= DATE_SUB(NOW(), INTERVAL 3 MINUTE)
    --  acq_date >= DATE_SUB('2023-03-19', INTERVAL 3 MINUTE) 
    GROUP BY 
      acq_date 
    ORDER BY 
      acq_date DESC 
    LIMIT 
      1, 1
    ) 
    AND pump_scada_id = '${data}'
    -- AND pump_scada_id = '2021-10-29 02:50:00'
    -- AND center_id = '전동1(가)'
  `;

  return query;
}

exports.distribution = (data) => {
  /*
  송수펌프("분포도", distribution) -> UI 삭제, 불필요
  */
  logger.info('MotorMapper::distribution > ', data);
  let query = `
    SELECT 
      pump_scada_id, 
      acq_date, 
      flow_rate / 60 as flow_rate, 
      pressure * 10 as pressure 
    FROM 
    TB_PUMP_SCADA 
    WHERE 
      acq_date >= '${data.startDate}'
      and acq_date <= '${data.endDate}'
      and pump_scada_id = '${data.id}'
    -- acq_date >= '2023-03-13 00:03:00'
    -- and acq_date <= '2023-03-13 16:42:00'
    -- and pump_scada_id = 'pump_scada_01'
    -- AND center_id = '전동1(가)' 
  `;

  return query;
}

exports.bearingTempInfo = (data) => {
  /*
  송수펌프("모터 베어링 온도", bearingTempInfo)
  */
  logger.info('MotorMapper::bearingTempInfo > ', data);
  let query = `
    SELECT 
      pump_scada_id, 
      acq_date, 
      brg_motor_de_temp as M_DE_bearing_temp, 
      brg_motor_nde_temp as M_NDE_bearing_temp, 
      brg_pump_de_temp as P_DE_bearing_temp, 
      brg_pump_nde_temp as P_NDE_bearing_temp 
    FROM 
      TB_PUMP_SCADA as m 
    WHERE 
      m.acq_date >= '${data.startDate}'
      and m.acq_date <= concat(DATE_FORMAT('${data.endDate}','%Y-%m-%d'),' 23:59:59')
      and m.pump_scada_id = '${data.id}'
      --  m.acq_date >= '2024-02-16 19:24:00'    
      --  and m.acq_date <= '2024-02-16 19:35:00'
      --  and m.pump_scada_id = 'pump_scada_07'
    ORDER BY 
      acq_date ASC
  `;

  return query;
}

exports.windingTempInfo = (data) => {
  /*
  송수펌프("권선 온도", windingTempInfo)
  */
  logger.info('MotorMapper::windingTempInfo > ', data);
  let query = `
    SELECT 
      pump_scada_id, 
      acq_date, 
      r_temp as winding_tempR, 
      s_temp as winding_tempS, 
      t_temp as winding_tempT
    FROM 
      TB_PUMP_SCADA as m 
    WHERE 
      m.acq_date >= '${data.startDate}'
      and m.acq_date <= concat(DATE_FORMAT('${data.endDate}','%Y-%m-%d'),' 23:59:59')
      and m.pump_scada_id = '${data.id}'
    ORDER BY 
      acq_date ASC
  `;

  return query;
}

exports.motorDetails = (data) => {
  /*
  송수펌프("모터 상세 데이터", motorDetails)
  */
  logger.info('MotorMapper::motorDetails > ', data);
  let query = `
    SELECT 
        m.moter_id, 
        m.DE_rms_amp as motor_de_rms_amp,
        /*
        case m.DE_rms_alarm
          when '0' then '정상'
          when '1' then '경고'
          when '2' then '알람'
        END AS de_rms_alarm,  
        */
        m.NDE_rms_amp as motor_nde_rms_amp,
        m.misalignment_amp as motor_misalignment_amp, 
        m.unbalance_amp as motor_unbalance_amp, 
        m.rotor_amp as motor_rotor_amp, 
        m.de_amp as motor_de_amp, 
        m.NDE_amp as motor_nde_amp, 
        p.DE_amp as pump_de_amp, 
        p.NDE_amp as pump_nde_amp, 
        p.cavitation_amp as pump_cavatation_amp, 
        p.impeller_amp as pump_impeller_amp,
        p.NDE_rms_amp as pump_nde_rms_amp,
        p.DE_rms_amp as pump_de_rms_amp, 
        m.acq_date as acq_date,
        m.de_bpfo_alarm, -- 모터 부하 베어링결함
        m.NDE_BPFO_alarm, -- 모터 반부하 베어링결함
        p.DE_BPFI_alarm, -- 펌프 부하 베어링결함
        p.NDE_BPFI_alarm, -- 펌프 반부하 베어링결함
        m.rotor_alarm,   -- 모터 회전자결함
        p.impeller_alarm, -- 펌프임펠러걸함
        m.unbalance_alarm, -- 펌프모터질량불평형
        p.cavitation_alarm, -- 펌프캐비테이션
        m.misalignment_alarm -- 축정렬불량
      FROM 
        TB_AI_DIAG_MOTER as m 
        LEFT JOIN TB_AI_DIAG_PUMP as p on m.moter_id = p.pump_id 
        and m.acq_date = p.acq_date AND m.center_id = p.center_id
        AND m.center_id = '${data.centerId}' AND p.center_id = '${data.centerId}'
      WHERE 
        m.acq_date >= '${data.startDate}'
        and m.acq_date <= concat(DATE_FORMAT('${data.endDate}','%Y-%m-%d'),' 23:59:59')
        and m.moter_id = '${data.id}'
        and m.center_id = '${data.centerId}'
      ORDER BY 
        m.acq_date ASC
  `;

  console.log(query)
  return query;
}

exports.vibrationGraph = (data) => {
  /*
  송수펌프("총진동량 조회", vibrationGraph)
  */
  logger.info('MotorMapper::vibrationGraph > ', data);
  let query = `
    SELECT
      m.moter_id,
      m.acq_date,
      m.DE_rms_amp as motor_de_rms_amp,
      m.NDE_rms_amp as motor_nde_rms_amp,
      p.DE_rms_amp as pump_de_rms_amp,
      p.NDE_rms_amp as pump_nde_rms_amp
    FROM
      TB_AI_DIAG_MOTER as m
      LEFT JOIN TB_AI_DIAG_PUMP as p on m.moter_id = p.pump_id
      and m.acq_date = p.acq_date
      and m.center_id = p.center_id
    WHERE
      m.acq_date >= '${data.startDate}'
      and m.acq_date <= '${data.endDate}'
      -- m.acq_date >= '2024-04-17 08:40:00'
      -- and m.acq_date <= '2024-04-23 23:59:00'
    ORDER BY
      m.acq_date ASC
  `;

  console.log(query)
  return query;
}

exports.runningInfo = () => {
  /*
  송수펌프("모터 운영 상태", runningInfo)
  */
  logger.info('MotorMapper::runningInfo > ');
  let query = `
    SELECT 
      pump_scada_id, 
      eq_on 
    FROM 
      TB_PUMP_SCADA 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          TB_PUMP_SCADA 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          1, 1
      )
    --  AND center_id = '전동1(가)'  /* 당진탭을 클릭하면 '당진(가)' 으로 바뀔수 있도록 화면에 파라미터 추가 */
  `;

  return query;
}

exports.alarm = () => {
  /*
  송수펌프("송수펌프모터 설비별 알람", alarm)
  */
  logger.info('MotorMapper::alarm > ');
  let query = `
    SELECT 
      m.moter_id, 
      m.center_id,
      (
          m.unbalance_alarm = 1 or m.misalignment_alarm = 1 or m.rotor_alarm = 1 or m.de_bpfo_alarm = 1  or m.DE_BPFI_alarm = 1 or
          m.DE_BSF_alarm = 1 or m.DE_FTF_alarm = 1 or m.NDE_BPFO_alarm = 1 or m.NDE_BPFI_alarm = 1 or m.NDE_BSF_alarm = 1 or m.NDE_FTF_alarm = 1 or
            p.impeller_alarm = 1 or p.cavitation_alarm = 1 or p.de_bpfo_alarm = 1 or p.DE_BPFI_alarm = 1 or p.DE_BSF_alarm = 1 or p.DE_FTF_alarm = 1 or
          p.NDE_BPFO_alarm = 1 or p.NDE_BPFI_alarm = 1 or p.NDE_BSF_alarm = 1 or p.NDE_FTF_alarm
        ) as Alarm
    FROM 
      (
          SELECT * from TB_AI_DIAG_MOTER
      ) as m LEFT outer JOIN 
      (
          SELECT * from TB_AI_DIAG_PUMP
      ) as p 
          on m.moter_id = p.pump_id 
            and m.acq_date = p.acq_date AND m.center_id = p.center_id
    WHERE 1=1
      and m.acq_date in (
          SELECT 
        max(acq_date) AS acq_date
        FROM 
          TB_AI_DIAG_MOTER 
        WHERE 1=1
        GROUP BY  
          center_id
        ORDER BY 
          acq_date DESC 
      ) 
    ORDER BY 
      substr(m.moter_id,7,2) asc;  
  `;
  return query;
}