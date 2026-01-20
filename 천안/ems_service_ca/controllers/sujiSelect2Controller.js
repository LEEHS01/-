const mariadb = require('mariadb');
const queries = require('../utils/sujiSelect2');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getCombo = async (req, res) => {
  // 데이터 처리 로직
  let conn;
  try{
    let Combo = await queries.ComboQuery();

    logger.info('getCombo ----')
    conn = await ems_db.getConnection();
    const comboList = await conn.query(Combo);    
    res.json(comboList);
    // comboList.release();
  }catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getBasuji = async (req, res) => {
  logger.info('getBasuji ---- @@@  ')
  let conn;
  try {
    let Basuji = await queries.basuji(req.query);
    let Basuji_sum = await queries.baeSuji_sum(req.query);
    let Basuji_sunsi = await queries.baeSuji_sunsi();
    conn = await ems_db.getConnection();
    const rows = await conn.query(Basuji);
    const rows_sum = await conn.query(Basuji_sum);
    const rows_sunsi = await conn.query(Basuji_sunsi);

    let result = {
        data1: rows,
        data2: rows_sum,
        data3: rows_sunsi
    }
    res.json(result);
  }catch(err) {
    logger.info(err)
    res.status(500).json({ message: 'Internal Server Error'});
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

