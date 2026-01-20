const logger = require('../../logger').logger
let testMode = false
let date = 'NOW()'
  
if (testMode) {
  date = "'2023-04-22'";
}

exports.waterPacAll = () => {
  /*
  대시보드("이상감지 > 착수/약품", waterPacAll)
  */
  logger.info('MainMapper::waterPacAll > ');
  let query = `
  (
    SELECT 
      water_controll_valve_id as id, 
      electric_current, 
      acq_date 
    FROM 
      tb_water_controll_valve 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_water_controll_valve 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        pac_tube_pump_id as id, 
        electric_current, 
        acq_date 
      FROM 
        tb_pac_tube_pump 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_pac_tube_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  UNION ALL 
    (
      SELECT 
        pahcs_tube_pump_id as id, 
        electric_current, 
        acq_date 
      FROM 
        tb_pahcs_tube_pump 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_pahcs_tube_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  UNION ALL 
    (
      SELECT 
        auto_water_pump_id as id, 
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
        tb_auto_water_pump 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_auto_water_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  `;

  return query;
}

exports.rapidAggloSludgeAll = () => {
  /*
  대시보드("이상감지 > 혼화/응집/침전", rapidAggloSludgeAll)
  */
  logger.info('MainMapper::rapidAggloSludgeAll > ');
  let query = `
  (
    SELECT 
      rapid_agitator_id as id, 
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
      tb_rapid_agitator 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_rapid_agitator 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        agglomerate_id as id, 
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
        tb_agglomerate 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_agglomerate 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  /* [gelix_lsj_230925] tb_diag_sludge_collector에 해당 column 없음
  UNION ALL 
    (
      SELECT 
        sludge_collector_id as id, 
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
        tb_sludge_collector 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_sludge_collector 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  */
  `;

  return query;
}

exports.filterGacAll = () => {
  /*
  대시보드("이상감지 > 여과/GAC", filterGacAll)
  */
  logger.info('MainMapper::filterGacAll > ');
  let query = `
  (
    SELECT 
      filter_backwash_pump_id as id, 
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
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_filter_backwash_pump 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        gac_backwash_pump_id as id, 
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
        tb_gac_backwash_pump 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_gac_backwash_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  UNION ALL 
    (
      SELECT 
        backwash_blower_id as id, 
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
        tb_backwash_blower 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_backwash_blower 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  `;

  return query;
}

exports.motifCoolAll = () => {
  /*
  대시보드("이상감지 > 오존/소독", motifCoolAll)
  */
  logger.info('MainMapper::motifCoolAll > ');
  let query = `
  (
    SELECT 
      motif_pump_id as id, 
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
      tb_motif_pump 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_motif_pump 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        cooling_pump_id as id, 
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
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_cooling_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  `;

  return query;
}

exports.pumpTransVcbAll = () => {
  /*
  대시보드("이상감지 > 송수", pumpTransVcbAll)
  */
  logger.info('MainMapper::pumpTransVcbAll > ');
  let query = `
  (
    SELECT 
      pump_board_temp_id as id, 
      dbm_avg, 
      acq_date 
    FROM 
      tb_pump_board_temp 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_pump_board_temp 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        transformer_id as id, 
        dbm_avg, 
        acq_date 
      FROM 
        tb_transformer 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_transformer 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  UNION ALL 
    (
      SELECT 
        vcb_id as id, 
        dbm_avg, 
        acq_date 
      FROM 
        tb_vcb 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_vcb 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  `;

  return query;
}

exports.waterAlarmAll = () => {
  /*
  대시보드("알람 > 착수/약품", waterAlarmAll)
  */
  logger.info('MainMapper::waterAlarmAll > ');
  let query = `
  (
    SELECT 
      water_controll_valve_id as id, 
      (
        volve_voltage_variance_alarm = 1 
        OR volve_overcurrent_alarm = 1
      ) as Alarm, 
      acq_date 
    FROM 
      tb_diag_water_controll_valve 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_diag_water_controll_valve 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        pac_tube_pump_id as id, 
        (
          pac_currnet_alarm = 1 
          OR diff_voltage_alarm = 1 
          OR overcurrent_alarm = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_pac_tube_pump 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_pac_tube_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  UNION ALL 
    (
      SELECT 
        pahcs_tube_pump_id as id, 
        (
          pahcs_currnet_alarm = 1 
          OR diff_voltage_alarm = 1 
          OR overcurrent_alarm = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_pahcs_tube_pump 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_pahcs_tube_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  `;

  return query;
}

exports.rapidAggloSludgeAlarmAll = () => {
  /*
  대시보드("알람 > 혼화/응집/침전", rapidAggloSludgeAlarmAll)
  */
  logger.info('MainMapper::rapidAggloSludgeAlarmAll > ');
  let query = `
  (
    SELECT 
      rapid_agitator_id as id, 
      (
        voltage_unbalance_alarm = 1 
        OR voltage_diff_alarm = 1 
        OR overcurrent_alarm = 1 
        OR current_unbalance_alarm = 1
      ) as Alarm, 
      acq_date 
    FROM 
      tb_diag_rapid_agitator 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_diag_rapid_agitator 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        agglomerate_id as id, 
        (
          voltage_unbalance_alarm = 1 
          OR voltage_diff_alarm = 1 
          OR overcurrent_alarm = 1 
          OR current_unbalance_alarm = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_agglomerate 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_agglomerate 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  /* [gelix_lsj_230925] tb_diag_sludge_collector에 해당 column 없음
  UNION ALL 
    (
      SELECT 
        sludge_collector_id as id, 
        (
          voltage_unbalance_alarm = 1 
          OR voltage_diff_alarm = 1 
          OR overcurrent_alarm = 1 
          OR current_unbalance_alarm = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_sludge_collector 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_sludge_collector 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  */
  `;

  return query;
}

exports.filterAlarmAll = () => {
  /*
  대시보드("알람 > 여과/GAC", filterAlarmAll)
  */
  logger.info('MainMapper::filterAlarmAll > ');
  let query = `
  (
    SELECT 
      filter_backwash_pump_id as id, 
      (
        voltage_unbalance_alarm = 1 
        OR voltage_diff_alarm = 1 
        OR overcurrent_alarm = 1 
        OR current_unbalance_alarm = 1
      ) as Alarm, 
      acq_date 
    FROM 
      tb_diag_filter_backwash_pump 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_diag_filter_backwash_pump 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        gac_backwash_pump_id as id, 
        (
          voltage_unbalance_alarm = 1 
          OR voltage_diff_alarm = 1 
          OR overcurrent_alarm = 1 
          OR current_unbalance_alarm = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_gac_backwash_pump 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_gac_backwash_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  UNION ALL 
    (
      SELECT 
        backwash_blower_id as id, 
        (
          voltage_unbalance_alarm = 1 
          OR voltage_diff_alarm = 1 
          OR overcurrent_alarm = 1 
          OR current_unbalance_alarm = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_backwash_blower 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_backwash_blower 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  `;

  return query;
}

exports.ozoneAlarmAll = () => {
  /*
  대시보드("알람 > 오존/소독", ozoneAlarmAll)
  */
  logger.info('MainMapper::ozoneAlarmAll > ');
  let query = `
  (
    SELECT 
      motif_pump_id as id, 
      (
        voltage_unbalance_alarm = 1 
        OR voltage_diff_alarm = 1 
        OR overcurrent_alarm = 1 
        OR current_unbalance_alarm = 1
      ) as Alarm, 
      acq_date 
    FROM 
      tb_diag_motif_blower 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_diag_motif_blower 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        cooling_pump_id as id, 
        (
          voltage_unbalance_alarm = 1 
          OR voltage_diff_alarm = 1 
          OR overcurrent_alarm = 1 
          OR current_unbalance_alarm = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_cooling_pump 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_cooling_pump 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  `;

  return query;
}

exports.pumpAlarmAll = () => {
  /*
  대시보드("알람 > 송수", pumpAlarmAll)
  */
  logger.info('MainMapper::pumpAlarmAll > ');
  let query = `
  (
    SELECT 
      pump_board_temp_id as id, 
      (
        samepart_fail = 1 
        OR ambienttemp_fail = 1 
        OR pps_fail = 1 
        OR dbm_fail = 1
      ) as Alarm, 
      acq_date 
    FROM 
      tb_diag_pump_board_temp 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          tb_diag_pump_board_temp 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      acq_date ASC
  ) 
  UNION ALL 
    (
      SELECT 
        transformer_id as id, 
        (
          samepart_fail = 1 
          OR ambienttemp_fail = 1 
          OR pps_fail = 1 
          OR dbm_fail = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_transformer 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_transformer 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    ) 
  UNION ALL 
    (
      SELECT 
        vcb_id as id, 
        (
          samepart_fail = 1 
          OR ambienttemp_fail = 1 
          OR pps_fail = 1 
          OR dbm_fail = 1
        ) as Alarm, 
        acq_date 
      FROM 
        tb_diag_vcb 
      WHERE 
        acq_date = (
          SELECT 
            acq_date 
          FROM 
            tb_diag_vcb 
          WHERE 
            acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          GROUP BY 
            acq_date 
          ORDER BY 
            acq_date DESC 
          LIMIT 
            0, 1
        ) 
      ORDER BY 
        acq_date ASC
    )  
  `;

  return query;
}

exports.motorDataAll = () => {
  /*
  대시보드("자율진단 > 송수펌프모터 부하/반부하/총진동값", motorDataAll)
  */
  logger.info('MainMapper::motorDataAll > ');
  let query = `
    SELECT *
    FROM
    (
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
        WHERE 
          m.acq_date = (
            SELECT 
            acq_date
            FROM 
              TB_AI_DIAG_MOTER 
            WHERE 1=1
            AND center_id = '전동1(가)'
            GROUP BY 
              acq_date
            ORDER BY 
              acq_date DESC 
            LIMIT 
              0, 1
          ) 
      UNION all
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
        WHERE 
          m.acq_date = (
            SELECT 
            acq_date
            FROM 
              TB_AI_DIAG_MOTER 
            WHERE 1=1
            AND center_id = '전동2(가)'
            GROUP BY 
              acq_date
            ORDER BY 
              acq_date DESC 
            LIMIT 
              0, 1
          ) 
      UNION ALL
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
        WHERE 
          m.acq_date = (
            SELECT 
            acq_date
            FROM 
              TB_AI_DIAG_MOTER 
            WHERE 1=1
            AND center_id = '전동3(가)'
            GROUP BY 
              acq_date
            ORDER BY 
              acq_date DESC 
            LIMIT 
              0, 1
          ) 
    
    ) t    
    ORDER BY t.acq_date ASC
  `;

  return query;
}

exports.pumpBearingAll = () => {
  /*
  대시보드("자율진단 > 송수펌프모터 베어링 온도", pumpBearingAll)
  */
  logger.info('MainMapper::pumpBearingAll > ');
  let query = `
    SELECT 
      CONCAT('pump_scada_',lpad(ROW_NUMBER() OVER(order by CASE WHEN center_id = '전동1(가)' THEN 0 ELSE 1 END  ASC ) ,2,0)) AS pump_scada_id  ,	    
      brg_motor_de_temp, 
      brg_motor_nde_temp, 
      brg_pump_de_temp, 
      brg_pump_nde_temp, 
      acq_date 
    FROM 
      TB_PUMP_SCADA 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          TB_PUMP_SCADA 
        WHERE 
          -- acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
          acq_date >= (SELECT max(acq_date) FROM TB_PUMP_SCADA) 
          -- acq_date >= DATE_SUB('2024-03-06 14:43:00', INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC
        LIMIT 
        0, 1
      ) 
  `;

  return query;
}

exports.motorAlarm = () => {
  /*
  대시보드("송수펌프모터 알람", motorAlarm)
  */
  logger.info('MainMapper::motorAlarm > ');
  let query = `
    SELECT 
      m.moter_id as id, 
      (
        m.unbalance_alarm = 1 
        or m.misalignment_alarm = 1 
        or m.rotor_alarm = 1 
        or m.de_bpfo_alarm = 1 
        or m.DE_BPFI_alarm = 1 
        or m.DE_BSF_alarm = 1 
        or m.DE_FTF_alarm = 1 
        or m.NDE_BPFO_alarm = 1 
        or m.NDE_BPFI_alarm = 1 
        or m.NDE_BSF_alarm = 1 
        or m.NDE_FTF_alarm = 1 
        or p.impeller_alarm = 1 
        or p.cavitation_alarm = 1 
        or p.de_bpfo_alarm = 1 
        or p.DE_BPFI_alarm = 1 
        or p.DE_BSF_alarm = 1 
        or p.DE_FTF_alarm = 1 
        or p.NDE_BPFO_alarm = 1 
        or p.NDE_BPFI_alarm = 1 
        or p.NDE_BSF_alarm = 1 
        or p.NDE_FTF_alarm
      ) as Alarm, 
      m.acq_date 
    FROM 
      TB_AI_DIAG_MOTER as m 
      LEFT JOIN TB_AI_DIAG_PUMP as p on m.moter_id = p.pump_id 
      and m.acq_date = p.acq_date AND m.center_id = p.center_id
    WHERE 
      m.acq_date in (
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
    ORDER BY 
      CASE WHEN m.center_id = '전동1(가)' THEN 0 ELSE 1 END  ASC , m.moter_id asc
  `;

  return query;
}

exports.alarmDataAll = () => {
  /*
  대시보드("모든 설비 알람", alarmDataAll)
  */
  logger.info('MainMapper::alarmDataAll > ');
  let query = `
    SELECT 
      m.moter_id as id, 
      (
        m.unbalance_alarm = 1 
        or m.misalignment_alarm = 1 
        or m.rotor_alarm = 1 
        or m.de_bpfo_alarm = 1 
        or m.DE_BPFI_alarm = 1 
        or m.DE_BSF_alarm = 1 
        or m.DE_FTF_alarm = 1 
        or m.NDE_BPFO_alarm = 1 
        or m.NDE_BPFI_alarm = 1 
        or m.NDE_BSF_alarm = 1 
        or m.NDE_FTF_alarm = 1 
        or p.impeller_alarm = 1 
        or p.cavitation_alarm = 1 
        or p.de_bpfo_alarm = 1 
        or p.DE_BPFI_alarm = 1 
        or p.DE_BSF_alarm = 1 
        or p.DE_FTF_alarm = 1 
        or p.NDE_BPFO_alarm = 1 
        or p.NDE_BPFI_alarm = 1 
        or p.NDE_BSF_alarm = 1 
        or p.NDE_FTF_alarm
      ) as Alarm, 
      m.acq_date 
    FROM 
      TB_AI_DIAG_MOTER as m 
      LEFT JOIN TB_AI_DIAG_PUMP as p on m.moter_id = p.pump_id 
      and m.acq_date = p.acq_date AND m.center_id = p.center_id
    WHERE 
      m.acq_date = (
        SELECT 
          acq_date 
        FROM 
          TB_AI_DIAG_MOTER 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 15 MINUTE) 
        --  acq_date >= DATE_SUB('2021-10-29 02:50:00', INTERVAL 15 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
      CASE WHEN m.center_id = '전동1(가)' THEN 0 ELSE 1 END  ASC , m.moter_id asc  
  `;

  return query;
}

exports.nullDataAlarmInfo = () => {
  /*
  대시보드("모든 설비 알람", alarmDataAll)
  */
  logger.info('MainMapper::nullDataAlarmInfo > ');

  let query = `
    /* 천안정수장 PMS 진동데이터에 문제 있을때 띄울 팝업쿼리 */
    SELECT 
      '전동1가압장' AS ipc_loc ,
      (
        SELECT
          CAST(count(acq_ti) AS CHAR)
        FROM TB_PM
        WHERE 1=1
          AND acq_ti >= DATE_SUB(NOW(), INTERVAL 1 HOUR) AND acq_ti < NOW()
          AND IPC_LOC IN ('전동1가압장')
      ) AS cnt,
      (
        select
          CASE 
            WHEN COUNT(acq_ti) = 0 THEN '전동1가압장의 IPC 전원을 확인하십시오.'
            ELSE ''
          END 
        FROM TB_PM
          WHERE 1=1
            AND acq_ti >= DATE_SUB(NOW(), INTERVAL 1 HOUR) AND acq_ti < NOW()
            AND IPC_LOC IN ('전동1가압장')
      ) msg
    UNION
    SELECT 
      '전동2가압장' AS ipc_loc ,
      (
        SELECT
          CAST(count(acq_ti) AS CHAR)
        FROM TB_PM
        WHERE 1=1
          AND acq_ti >= DATE_SUB(NOW(), INTERVAL 1 HOUR) AND acq_ti < NOW()
          AND IPC_LOC IN ('전동2가압장')
      ) AS cnt,
      (
        select
          CASE 
            WHEN COUNT(acq_ti) = 0 THEN '전동2가압장의 IPC 전원을 확인하십시오.'
            ELSE ''
          END 
        FROM TB_PM
          WHERE 1=1
            AND acq_ti >= DATE_SUB(NOW(), INTERVAL 1 HOUR) AND acq_ti < NOW()
            AND IPC_LOC IN ('전동2가압장')
      ) msg	
    UNION
    SELECT 
      '전동3가압장' AS ipc_loc ,
      (
        SELECT
          CAST(count(acq_ti) AS CHAR)
        FROM TB_PM
        WHERE 1=1
          AND acq_ti >= DATE_SUB(NOW(), INTERVAL 1 HOUR) AND acq_ti < NOW()
          AND IPC_LOC IN ('전동3가압장')
      ) AS cnt,
      (
        select
          CASE 
            WHEN COUNT(acq_ti) = 0 THEN '전동3가압장의 IPC 전원을 확인하십시오.'
            ELSE ''
          END 
        FROM TB_PM
          WHERE 1=1
            AND acq_ti >= DATE_SUB(NOW(), INTERVAL 1 HOUR) AND acq_ti < NOW()
            AND IPC_LOC IN ('전동3가압장')
      ) msg	
  `;



  return query;
}

exports.operationAll = () => {
  /*
  대시보드("모든 설비 가동중 조회", operationAll)
  */
  logger.info('MainMapper::operationAll > ');
  let query = `
    SELECT 
      pump_scada_id as id, 
      eq_on, 
      acq_date 
    FROM 
      TB_PUMP_SCADA 
    WHERE 
      acq_date = (
        SELECT 
          acq_date 
        FROM 
          TB_PUMP_SCADA 
        WHERE 
          acq_date >= DATE_SUB(${date}, INTERVAL 3 MINUTE) 
        --  acq_date >= DATE_SUB('2021-10-29 02:50:00', INTERVAL 3 MINUTE) 
        GROUP BY 
          acq_date 
        ORDER BY 
          acq_date DESC 
        LIMIT 
          0, 1
      ) 
    ORDER BY 
    CASE WHEN center_id = '전동1(가)' THEN 0 ELSE 1 END  ASC  , pump_scada_id asc
  `;

  return query;
}
