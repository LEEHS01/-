const queries = require('../utils/pumpOperation');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getSelectCTR = async (req, res) => {
  let conn;
  try {
    logger.info('getSelectCTR ---')
    let result = queries.selectCTR_PRF_PMPMST_INF();
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

exports.getUpdateCTR = async (req, res) => {
  let conn;
  let { PMP_IDX, PRRT_RNK, flag, USE_YN } = req.query;
  try{
    logger.info('getUpdateCTR ---')
    let result = queries.updateSetCTR_PRF_PMPMST_INF({ PMP_IDX, PRRT_RNK, flag, USE_YN });
    // conn = await ems_db.getConnection();
    // await conn.query(result);
    res.status(200).json({ message: 'ok' });
  }catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getUpdateCTR2 = async (req, res) => {
  let conn;
  let { flag } = req.query;
  try{
    logger.info('getUpdateCTR2 ---')
    let result = queries.updateSetCTR_PRF_PMPMST_INF2({ flag });
    // conn = await ems_db.getConnection();
    // await conn.query(result);
    res.status(200).json({ message: 'ok' });
  }catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getMergePTR = async (req, res) => {
  let conn;
  let { NO, VALUE, USERID, SEASON } = req.query;
  try{
    logger.info('getMergePTR ---')
    let result = queries.mergePTR_STRTG_INF({ NO, VALUE, USERID, SEASON });
    // conn = await ems_db.getConnection();
    // await conn.query(result);
    res.status(200).json({ message: 'ok' });
  }catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getMergeOPER = async (req, res) => {
  let conn;
  let { userid, season, ...values } = req.query;
  try{
    logger.info('getMergeOPER ---')
    let result = queries.mergeOPER_INF({ userid, season, values });
    // conn = await ems_db.getConnection();
    // await conn.query(result);
    res.status(200).json({ message: 'ok' });
  }catch(err) {
    logger.error('error :', err);
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
    logger.info('getSelectRT ---')
    let result = queries.selectRT_RATE_INF({ rate, season });
    let result2 = queries.selectOPER_INF({ season });
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    const rows_2 = await conn.query(result2);

    let param = {}
    param.data = rows;
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
