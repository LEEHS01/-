const logger = require('../../logger').logger

exports.alarm = () => {
  /*
  약품펌프("설비별 알람", alarm)
  */
  logger.info('PacTubeMapper::alarm > ');
  let query = `
  SELECT 
    pac_tube_pump_id, 
    TRUE as Alram 
  FROM 
    tb_diag_pac_tube_pump 
  WHERE 
    (
      pac_currnet_alarm = 1 
      OR diff_voltage_alarm = 1 
      OR overcurrent_alarm = 1
    ) 
    AND acq_date >= DATE_SUB(NOW(), INTERVAL 2 MINUTE) 
  ORDER BY 
    acq_date DESC;
  `;

  return query;
}

exports.pacTubeInfo = () => {
  /*
  약품펌프("가동중, 운영현황 조회, 상태정보", pacTubeInfo)
  */
  logger.info('PacTubeMapper::pacTubeInfo > ');
  let query = `
  SELECT 
    pac_tube_pump_id, 
    eq_on, 
    flowmeter, 
    flowppm 
  FROM 
    tb_pac_tube_pump 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_pac_tube_pump 
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
  약품펌프("전류 조회", currentInfo)
  */
  logger.info('PacTubeMapper::currentInfo > ', data);
  let query = `
  SELECT 
    pac_tube_pump_id, 
    current, 
    acq_date 
  FROM 
    tb_diag_pac_tube_pump 
  WHERE
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}

exports.detailInfo = (data) => {
  /*
  약품펌프("상세 조회", detailInfo)
  */
  logger.info('PacTubeMapper::detailInfo > ', data);
  let query = `
  SELECT 
    pac_tube_pump_id, 
    current, 
    diff_voltage, 
    pac_ch_single_i, 
    acq_date 
  FROM 
    tb_diag_pac_tube_pump 
  WHERE
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}