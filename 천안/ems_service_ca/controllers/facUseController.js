const queries = require('../utils/facUse');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getSelectZone = async (req, res) => {
  let conn;
  try {
    logger.info('getSelectZone ---')
    let result = queries.selectZone();
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    res.json(rows);
  } catch(err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  } 
};

exports.getSelectFac = async (req, res) => {
  let conn;
  let { search} = req.query;
  logger.info(search)
  try{
    logger.info('getSelectFac ---')
    let result = queries.selectFac({ search });
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

exports.getSelectFacUseList = async (req, res) => {
  let conn;
  let { search, search2, search3, search4, search5 } = req.query;
  logger.info('getSelectFacUseList ---', search, search2, search3, search4, search5)
  try{
    let result = queries.selectFacUseList({ search, search2, search3, search4, search5 });
    let result2 = queries.selectFacUseList_sum({ search, search2, search3, search4, search5 });
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

exports.getSelectFacSunsi = async (req, res) => {
  let conn;
  let { search} = req.query;
  logger.info(search)
  try{
    logger.info('getSelectFacSunsi ---')
    let result = queries.selectFacSunsi({ search });
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
