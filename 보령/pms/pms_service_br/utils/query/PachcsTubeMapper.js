const logger = require('../../logger').logger

exports.alarm = () => {
  /*
  PAHCS튜브펌프("설비별 알람", alarm)
  */
  logger.info('PachcsTubeMapper::alarm > ');
  let query = `
  SELECT 
    pahcs_tube_pump_id, 
    TRUE as Alram 
  FROM 
    tb_diag_pahcs_tube_pump 
  WHERE 
    (
      pahcs_currnet_alarm = 1 
      OR diff_voltage_alarm = 1 
      OR overcurrent_alarm = 1
    ) 
    AND acq_date >= DATE_SUB(NOW(), INTERVAL 2 MINUTE) 
  ORDER BY 
    acq_date DESC;
  `;

  return query;
}

exports.pahcsTubeInfo = () => {
  /*
  PAHCS튜브펌프("가동중, 운영현황 조회, 상태정보", pahcsTubeInfo)
  */
  logger.info('PachcsTubeMapper::pahcsTubeInfo > ');
  let query = `
  SELECT 
    pahcs_tube_pump_id, 
    eq_on, 
    flowmeter, 
    flowppm 
  FROM 
    tb_pahcs_tube_pump 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_pahcs_tube_pump 
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
  PAHCS튜브펌프("전류 조회", currentInfo)
  */
  logger.info('PachcsTubeMapper::currentInfo > ', data);
  let query = `
  SELECT 
    pahcs_tube_pump_id, 
    current, 
    acq_date 
  FROM 
    tb_diag_pahcs_tube_pump 
  WHERE
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}

exports.detailInfo = (data) => {
  /*
  PAHCS튜브펌프("상세 조회", detailInfo)
  */
  logger.info('PachcsTubeMapper::detailInfo > ', data);
  let query = `
  SELECT 
    pahcs_tube_pump_id, 
    current, 
    diff_voltage, 
    pahcs_ch_single_i, 
    acq_date 
  FROM 
    tb_diag_pahcs_tube_pump 
  WHERE
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}