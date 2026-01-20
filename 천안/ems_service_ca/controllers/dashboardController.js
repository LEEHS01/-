const queries = require('../utils/dashboard');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getAlarmCheck = async (req,res) => {
  let conn = null
  try {
    logger.info('getAlarmCheck ---')
    let sqlquery = await queries.alarmCheck()
    conn = await ems_db.getConnection()

    const data = await conn.query(sqlquery)
    res.json(data)
  } catch(err) { 
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    conn.release()
  }

}


exports.getAlarmUpdate = async (req,res) => {
  let conn = null
  try {
    logger.info('getAlarmUpdate ---')
    let sqlquery = await queries.alarmUpdate()
    conn = await ems_db.getConnection()

    await conn.query(sqlquery)
    res.status(200).json({ message: 'ok' });
  } catch(err) { 
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    conn.release()
  }

}

exports.getSiteAlarmCheck = async (req,res) => {
  let conn = null
  try {
    logger.info('getSiteAlarmCheck ---')
    let sqlquery = await queries.siteAlarmCheck()
    conn = await ems_db.getConnection()

    const data = await conn.query(sqlquery)
    res.json(data)
  } catch(err) { 
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    conn.release()
  }

}

exports.getSiteAlarmUpdate = async (req,res) => {
  let conn = null
  try {
    logger.info('getSiteAlarmUpdate ---')
    let sqlquery = await queries.siteAlarmUpdate()
    conn = await ems_db.getConnection()

    await conn.query(sqlquery)
    res.status(200).json({ message: 'ok' });
  } catch(err) { 
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    conn.release()
  }

}

exports.getNowElec = async (req, res) => {
  let conn = null;
  try {
    logger.info('getNowElec ---')

    let queryStr1 = await queries.nowElecQuery();
    let queryStr2 = await queries.nowPeakQuery();
    let queryStr3 = await queries.ymdQuery();
    let queryStr4 = await queries.baseElecQuery();
    let queryStr5 = await queries.rstSavingTargetSumQuery();

    conn = await ems_db.getConnection();

    const nowElect = await conn.query(queryStr1);
    const nowPeak = await conn.query(queryStr2);
    const ymd = await conn.query(queryStr3);
    const baseElec = await conn.query(queryStr4);
    const rstSavingTargetSum = await conn.query(queryStr5);

    let result = {
      data: nowElect,
      data2: nowPeak,
      data3: ymd,
      data4: baseElec,
      data5: rstSavingTargetSum
    }

    res.json(result);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getTop3 = async (req, res) => {
  let conn = null
  let { date, zone_code } = req.query
  try {
    logger.info('getTop3 ---', date, zone_code)

    let queryStr = await queries.top3Query(date, zone_code);
    conn = await ems_db.getConnection();
    const top3 = await conn.query(queryStr);
    
    res.json(top3);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.selectZoneUseList_sum_dashboard = async (req, res) => {
  let conn;
  let { search, search2, search3 } = req.query;
  try{
    logger.info('selectZoneUseList_sum_dashboard ---', search, search2, search3)
    let result = queries.selectZoneUseList_sum_dashboard({ search, search2, search3 });
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);

    let param = {}
    param.data1 = rows;

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

