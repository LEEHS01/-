const logger = require('../../logger').logger

exports.alarm = () => {
  /*
  변압기반("설비별 알람", alarm)
  */
  logger.info('TransformersMapper::alarm > ');
  let query = `
  SELECT 
    transformer_id, 
    TRUE as Alram 
  FROM 
    tb_diag_transformer 
  WHERE 
    (
      samepart_fail = 1 
      OR ambienttemp_fail = 1 
      OR pps_fail = 1 
      OR dbm_fail = 1
    ) 
    -- AND acq_date >= DATE_SUB(NOW(), INTERVAL 2 MINUTE) 
    AND acq_date >= DATE_SUB('2023-03-19', INTERVAL 2 MINUTE) 
  ORDER BY 
    acq_date DESC;
  `;

  return query;
}

exports.disCharge = (data) => {
  /*
  변압기반("부분방전 크기 조회", disCharge)
  */
  logger.info('TransformersMapper::disCharge > ', data);
  let query = `
  SELECT 
    transformer_id, 
    dbm_avg, 
    acq_date 
  FROM 
    tb_transformer 
  WHERE 
    acq_date >= '${data.startDate}' and acq_date <= '${data.endDate}'
  `;

  return query;
}

exports.info = () => {
  /*
  변압기반("상태정보 온도", info)
  */
  logger.info('TransformersMapper::info > ');
  let query = `
  SELECT 
    transformer_id, 
    eq_on, 
    temp_1, 
    temp_2, 
    temp_3, 
    temp_4, 
    temp_5, 
    temp_6, 
    temp_7, 
    temp_8, 
    temp_9, 
    temp_10, 
    temp_11, 
    temp_12, 
    temp_13, 
    temp_14, 
    temp_15, 
    temp_16, 
    temp_17, 
    temp_18, 
    temp_19, 
    temp_20 
  FROM 
    tb_transformer 
  WHERE 
    acq_date = (
      SELECT 
        acq_date 
      FROM 
        tb_pump_board_temp 
      WHERE 
        -- acq_date >= DATE_SUB(NOW(), INTERVAL 3 MINUTE) 
        acq_date >= DATE_SUB('2023-03-19', INTERVAL 3 MINUTE) 
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

exports.detailInfo = (data) => {
  /*
  변압기반("상세 조회", detailInfo)
  */
  logger.info('TransformersMapper::detailInfo > ', data);
  let query = `
  SELECT 
    transformer_id, 
    dbm, 
    pps, 
    max_in, 
    max_out, 
    acq_date 
  FROM 
    tb_diag_transformer 
  WHERE 
    acq_date >= '${data.startDate}'
    and acq_date <= '${data.endDate}'
  `;

  return query;
}