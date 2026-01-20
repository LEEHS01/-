const queries = require('../utils/loginCheck');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getLoginCheck = async (req, res) => {
  let conn;
  try {
    logger.info('getLoginCheck ---')
    let result = queries.loginCheck();
    conn = await ems_db.getConnection();

    const data = await conn.query(result)
    res.json(data)
  } catch(err) {
    logger.error('error: ',err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  } 
};