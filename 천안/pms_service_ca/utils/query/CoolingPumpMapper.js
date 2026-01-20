const logger = require('../../logger').logger

exports.alarm = () => {
  /*
  냉각수펌프("설비별 알람", alarm)
  */
  logger.info('CoolingPumpMapper::alarm > ');
  let query = `
  SELECT 
    cooling_pump_id, 
    TRUE as Alram 
  FROM 
    tb_diag_cooling_pump 
  WHERE 
    (
      voltage_unbalance_alarm = 1 
      OR voltage_diff_alarm = 1 
      OR overcurrent_alarm = 1 
      OR current_unbalance_alarm = 1
    ) 
    AND acq_date >= DATE_SUB(NOW(), INTERVAL 2 MINUTE) 
  ORDER BY 
    acq_date DESC;
  `;

  return query;
}

exports.coolingPumpInfo = () => {
  /*
  냉각수펌프("가동중, 운영현황 조회, 상태정보", coolingPumpInfo)
  */
  logger.info('CoolingPumpMapper::coolingPumpInfo > ');
  let query = `
  SELECT 
    cooling_pump_id, 
    eq_on, 
    outflow_temp, 
    flowmeter 
  FROM 
    tb_cooling_pump 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_cooling_pump 
      GROUP BY 
        acq_date 
      ORDER BY 
        acq_date DESC 
      LIMIT 
        1, 1
    )
  `;

  return query;
}

exports.currentInfo = (data) => {
  /*
  냉각수펌프("전류 조회", currentInfo)
  */
  logger.info('CoolingPumpMapper::currentInfo > ', data);
  let query = `
  SELECT 
    cooling_pump_id, 
    GREATEST(
      if(
        r_v_electric_current is not null, r_v_electric_current, 
        0
      ), 
      if(
        s_v_electric_current is not null, s_v_electric_current, 
        0
      ), 
      if(
        t_v_electric_current is not null, t_v_electric_current, 
        0
      )
    ) as current, 
    acq_date 
  FROM 
    tb_cooling_pump 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}

exports.detailInfo = (data) => {
  /*
  냉각수펌프("상세 조회", detailInfo)
  */
  logger.info('CoolingPumpMapper::detailInfo > ', data);
  let query = `
  SELECT 
    cooling_pump_id, 
    current_limit, 
    voltage_diff, 
    current_unbalance, 
    voltage_unbalance, 
    acq_date 
  FROM 
    tb_diag_cooling_pump 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}