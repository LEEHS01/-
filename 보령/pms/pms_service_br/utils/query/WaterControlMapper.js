const logger = require('../../logger').logger

exports.alarm = () => {
  /*
  착수정유입밸브("설비별 알람", alarm)
  */
  logger.info('WaterControlMapper::alarm > ');
  let query = `
  SELECT 
    water_controll_valve_id, 
    TRUE as Alram 
  FROM 
    tb_diag_water_controll_valve 
  WHERE 
    acq_date >= DATE_SUB(NOW(), INTERVAL 2 MINUTE) 
    AND (
      volve_voltage_variance_alarm = 1 
      OR volve_overcurrent_alarm = 1
    ) 
  ORDER BY 
    acq_date DESC
  `;

  return query;
}

exports.eqOpen = () => {
  /*
  착수정유입밸브("개폐여부", eqOpen)
  */
  logger.info('WaterControlMapper::eqOpen > ');
  let query = `
  SELECT 
    water_controll_valve_id, 
    eq_open 
  FROM 
    tb_water_controll_valve 
  WHERE 
  --  acq_date >= DATE_SUB(NOW(), INTERVAL 2 MINUTE) 
    acq_date >= DATE_SUB('2023-03-20', INTERVAL 2 MINUTE) 
  ORDER BY 
    acq_date DESC
  `;

  return query;
}

exports.currentGraph = (data) => {
  /*
  착수정유입밸브("전류 그래프 기간조회", currentGraph)
  */
  logger.info('WaterControlMapper::currentGraph > ', data);
  let query = `
  SELECT 
    water_controll_valve_id, 
    electric_current, 
    acq_date 
  FROM 
    tb_water_controll_valve 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
    and water_controll_valve_id = '${data.id}'
  ORDER BY 
    acq_date ASC
  `;

  return query;
}

exports.overCurrentGraph = (data) => {
  /*
  착수정유입밸브("과전류 그래프 기간조회", overCurrentGraph)
  */
  logger.info('WaterControlMapper::overCurrentGraph > ', data);
  let query = `
  SELECT 
    water_controll_valve_id, 
    current, 
    acq_date 
  FROM 
    tb_diag_water_controll_valve 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
    and water_controll_valve_id = '${data.id}'
  ORDER BY 
    acq_date ASC
  `;

  return query;
}

exports.voltageFluctuationGraph = (data) => {
  /*
  착수정유입밸브("전압변동량 그래프 기간조회", voltageFluctuationGraph)
  */
  logger.info('WaterControlMapper::voltageFluctuationGraph > ', data);
  let query = `
  SELECT 
    water_controll_valve_id, 
    volve_voltage_variance, 
    acq_date 
  FROM 
    tb_diag_water_controll_valve 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
    and water_controll_valve_id = '${data.id}'
  ORDER BY 
    acq_date ASC
  `;

  return query;
}