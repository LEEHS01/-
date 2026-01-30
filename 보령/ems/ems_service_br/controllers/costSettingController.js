const queries = require('../utils/costSetting');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getSelectRtInfo = async (req, res) => {
  let conn;
  try {
    logger.info('getSelectRtInfo ---')
    let result = queries.selectRtInfo();
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    res.json(rows);
  } catch(err) {
    logger.error('error: ',err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  } 
};

exports.getSelectRT = async (req, res) => {
  let conn;
  let { rate, season } = req.query;
  try{
    logger.info('getSelectRT(costSetting) ---')
    let result = queries.selectRT_RATE_INF({ rate, season });
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);

    let param = {}
    param.data = rows;

    res.json(param);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getUpdateRT = async (req, res) => {
  let conn;
  let { rate, season, env_rate, fuel_rate, base_rate, rate_L, rate_M, rate_H, time } = req.query;
  try{
    logger.info('getUpdateRT ---')
    conn = await ems_db.getConnection();
    for (let i = 0; i < 24; i++) {
      let result = queries.update_L_RT_RATE_INF({ rate, env_rate, fuel_rate, base_rate, rate_L, season });
      let result2 = queries.update_M_RT_RATE_INF({ rate,env_rate, fuel_rate,  base_rate, rate_M, season });
      let result3 = queries.update_H_RT_RATE_INF({ rate, env_rate, fuel_rate, base_rate, rate_H, season });
      let result4 = queries.update_time_RT_RATE_INF({ season, time: time[i] });
      await conn.query(result);
      await conn.query(result2);
      await conn.query(result3);
      await conn.query(result4);
    }
    res.status(200).json({ message: 'ok' });
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};
