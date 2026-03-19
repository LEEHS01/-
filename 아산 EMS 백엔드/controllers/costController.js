const queries = require('../utils/cost');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getRateInfo = async (req, res) => {
  let conn;
  try {
    logger.info('getRateInfo ---')

    let queryStr = await queries.rateInfoQuery();
    conn = await ems_db.getConnection();
    const rateInfo = await conn.query(queryStr);

    res.json(rateInfo);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getMonthRateData = async (req, res) => {
  let conn;
  try {
    logger.info('getMonthRateData ---')

    let queryStr = await queries.monthRateQuery(req.body.search);
    conn = await ems_db.getConnection();
    const monthRate = await conn.query(queryStr);
    
    res.json(monthRate);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};
