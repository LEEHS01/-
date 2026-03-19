const queries = require('../utils/goalSetting');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getSelectGetSetting = async (req, res) => {
  let conn;
  try {
    logger.info('getSelectGetSetting ---')
    let result = queries.selectGetSetting();
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

exports.getUpdateGoal = async (req, res) => {
  let conn;
  let { ...list } = req.query;
  try{
    logger.info('getUpdateGoal ---')
    let result = queries.updateGoal({ list: list });
    conn = await ems_db.getConnection();
    await conn.query(result);
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
