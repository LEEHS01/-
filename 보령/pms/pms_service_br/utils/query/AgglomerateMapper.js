const logger = require('../../logger').logger

exports.alarm = () => {
  /*
  응집기("설비별 알람", alarm)
  */
  logger.info('AgglomerateMapper::alarm > ');
  let query = `
  SELECT 
    agglomerate_id, 
    TRUE as Alram 
  FROM 
    tb_diag_agglomerate 
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

exports.agglomerateInfo = (data) => {
  /*
  응집기("가동중, 운영현황 조회, 상태정보", agglomerateInfo)
  */
  logger.info('AgglomerateMapper::agglomerateInfo > ', data);
  let query = `
  SELECT 
    count(eq_on) as eq_on 
  FROM 
    tb_agglomerate_eq 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_agglomerate_eq 
      GROUP BY 
        acq_date 
      ORDER BY 
        acq_date DESC 
      LIMIT 
        1, 1
    ) 
    AND agglomerate_eq_id like CONCAT(
      '${data}', '%')
      AND eq_on = TRUE
  `;

  return query;
}

exports.agglomerateCount = () => {
  /*
  응집기("가동대수", agglomerateCount)
  */
  logger.info('AgglomerateMapper::agglomerateCount > ');
  let query = `
  SELECT 
    count(eq_on) as eq_on 
  FROM 
    tb_agglomerate_eq 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_agglomerate_eq 
      GROUP BY 
        acq_date 
      ORDER BY 
        acq_date DESC 
      LIMIT 
        1, 1
    ) 
    AND eq_on = TRUE
  `;

  return query
}

exports.currentInfo = (data) => {
  /*
  응집기("전류 조회", currentInfo)
  */
  logger.info('AgglomerateMapper::currentInfo > ', data);
  let query = `
  SELECT 
    agglomerate_id, 
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
    tb_agglomerate 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}

exports.detailInfo = (data) => {
  /*
  응집기("상세 조회", detailInfo)
  */
  logger.info('AgglomerateMapper::detailInfo > ', data);
  let query = `
  SELECT 
    agglomerate_id, 
    current_limit, 
    voltage_diff, 
    current_unbalance, 
    voltage_unbalance, 
    acq_date 
  FROM 
    tb_diag_agglomerate 
  WHERE
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}