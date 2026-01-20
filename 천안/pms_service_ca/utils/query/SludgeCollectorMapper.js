const logger = require('../../logger').logger

exports.alarm = () => {
  /*
  침전슬러지수집기("설비별 알람", alarm)
  */
  logger.info('SludgeCollectorMapper::alarm > ');
  let query = `
  SELECT 
    sludge_collector_id, 
    TRUE as Alram 
  FROM 
    tb_diag_sludge_collector 
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

exports.sludgeInfo = () => {
  /*
  침전슬러지수집기("가동중, 운영현황 조회, 상태정보", sludgeInfo)
  */
  logger.info('SludgeCollectorMapper::sludgeInfo > ');
  let query = `
  SELECT 
    sludge_collector_eq_id, 
    if(
      forward = TRUE, 
      TRUE, 
      if(backward = TRUE, TRUE, FALSE)
    ) as eq_on, 
    speed, 
    speed_fb 
  FROM 
    tb_sludge_collector_eq 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_sludge_collector_eq 
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
  침전슬러지수집기("전류 조회", currentInfo)
  */
  logger.info('SludgeCollectorMapper::currentInfo > ', data);
  let query = `
  SELECT 
    sludge_collector_id, 
    GREATEST (
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
    tb_sludge_collector 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}

exports.detailInfo = (data) => {
  /*
  침전슬러지수집기("상세 조회", detailInfo)
  */
  logger.info('SludgeCollectorMapper::detailInfo > ', data);
  let query = `
  SELECT 
    sludge_collector_id, 
    current_limit, 
    voltage_diff, 
    current_unbalance, 
    voltage_unbalance, 
    acq_date 
  FROM 
    tb_diag_sludge_collector 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}

exports.torqueInfo = () => {
  /*
  침전슬러지수집기("상세 조회", torqueInfo)
  */
  logger.info('SludgeCollectorMapper::torqueInfo > ');
  let query = `
  SELECT 
    sludge_collector_id as id, 
    /* [gelix_lsj_230925] tb_sludge_collector에 해당 column 없음
    torque_1, 
    torque_2, 
    torque_3, 
    torque_4, 
    */
    acq_date 
  FROM 
    tb_sludge_collector 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_sludge_collector 
      WHERE 
        acq_date >= DATE_SUB(NOW(), INTERVAL 3 MINUTE) 
      GROUP BY 
        acq_date 
      ORDER BY 
        acq_date DESC 
      LIMIT 
        0, 1
    ) 
  ORDER BY 
    acq_date ASC
  `;

  return query;
}