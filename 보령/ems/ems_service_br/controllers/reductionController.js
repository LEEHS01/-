const queries = require('../utils/reduction');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getUsageData = async (req, res) => {
  let conn;
  try {
    logger.info('getUsageData ---')

    let queryStr = await queries.usageDataQuery(req.body);
    conn = await ems_db.getConnection();
    const usageData = await conn.query(queryStr);
    
    res.json(usageData);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};
