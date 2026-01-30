const queries = require('../utils/zoneUse');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getSisul_sunsi = async (req, res) => {
  let conn;
  try {
    logger.info('getSisul_sunsi ---')
    let result = queries.sisul_sunsi();
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

exports.getSunsiChart = async (req, res) => {
  let conn;
  let { search } = req.query;
  logger.info(search)
  try{
    logger.info('getSunsiChart ---')
    let result = queries.sunsiChart({ search });
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    res.json(rows);
  }catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getSelectZoneUseList = async (req, res) => {
  let conn;
  let { search, search2, search3 } = req.query;
  logger.info(search, search2, search3)
  try{
    logger.info('getSelectZoneUseList ---')
    let result = queries.selectZoneUseList({ search, search2, search3 });
    let result2 = queries.selectZoneUseList_sum({ search, search2, search3 });
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    const rows_2 = await conn.query(result2);

    let param = {}
    param.data1 = rows;
    param.data2 = rows_2;

    res.json(param);
  }catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};
