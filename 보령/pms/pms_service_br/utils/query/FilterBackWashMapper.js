const logger = require('../../logger').logger

exports.alarm = () => {
  /*
  여과역세펌프("설비별 알람", alarm)
  */
  logger.info('FilterBackWashMapper::alarm > ');
  let query = `
  SELECT 
    filter_backwash_pump_id, 
    TRUE as Alram 
  FROM 
    tb_diag_filter_backwash_pump 
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

exports.count = () => {
  /*
  여과역세펌프("가동대수", count)
  */
  logger.info('FilterBackWashMapper::count > ');
  let query = `
  SELECT 
    count(eq_on) as eq_on 
  FROM 
    tb_filter_backwash_pump 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_filter_backwash_pump 
      GROUP BY 
        acq_date 
      ORDER BY 
        acq_date DESC 
      LIMIT 
        1, 1
    ) 
    AND eq_on = TRUE
  `;

  return query;
}

exports.filterBackWashInfo = () => {
  /*
  여과역세펌프("가동중, 운영현황 조회, 상태정보", filterBackWashInfo)
  */
  logger.info('FilterBackWashMapper::filterBackWashInfo > ');
  let query = `
  SELECT 
    filter_backwash_pump_id, 
    eq_on, 
    flow_rate / 60 as flow_rate, 
    pressure * 10 as pressure 
  FROM 
    tb_filter_backwash_pump 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_filter_backwash_pump 
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

exports.distribution = (data) => {
  /*
  여과역세펌프("분포도", distribution)
  */
  logger.info('FilterBackWashMapper::distribution > ', data);
  let query = `
  SELECT 
    filter_backwash_pump_id, 
    flow_rate / 60 as flow_rate, 
    pressure * 10 as pressure 
  FROM 
    tb_filter_backwash_pump 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
    AND filter_backwash_pump_id = '${data.id}'
    and proc_stat = 1
  `;

  return query;
}

exports.currentInfo = (data) => {
  /*
  여과역세펌프("전류 조회", currentInfo)
  */
  logger.info('FilterBackWashMapper::currentInfo > ', data);
  let query = `
  SELECT 
    filter_backwash_pump_id, 
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
    tb_filter_backwash_pump 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}

exports.detailInfo = (data) => {
  /*
  여과역세펌프("상세 조회", detailInfo)
  */
  logger.info('FilterBackWashMapper::detailInfo > ', data);
  let query = `
  SELECT 
    filter_backwash_pump_id, 
    current_limit, 
    voltage_diff, 
    current_unbalance, 
    voltage_unbalance, 
    acq_date 
  FROM 
    tb_diag_filter_backwash_pump 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}