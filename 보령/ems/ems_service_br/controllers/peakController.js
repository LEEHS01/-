const { ems_db } = require('../db.js')
const queries = require('../utils/peak')
const logger = require('../logger').logger;

exports.getPeakSelectData = async (req, res) => {
  let conn = null
  try {
    logger.info('getPeakSelectData ---')
    let { search, search2, search3 } = req.body.params
    let sqlquery = await queries.PeakSelectData(search, search2, search3)
    conn = await ems_db.getConnection();

    const data = await conn.query(sqlquery)
    res.json(data)
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    conn.release()
  }
}

exports.getPeakGoal = async (req, res) => {
  let conn = null
  try {
    logger.info('getPealGoal ---')
    let sqlquery = await queries.peakGoal()
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

exports.getUpdatePeakGoal = async (req, res) => {
  let conn = null
  try {
    logger.info('getUpdatePeakGoal ---')
    let search = req.body.params
    let sqlquery = await queries.updatePeakGoal(search)
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

exports.getPeakFac = async (req, res) => {
  let conn = null
  try {
    logger.info('peakFac ---')
    let search = req.body.params
    let sqlquery = await queries.peakFac(search)
    conn = await ems_db.getConnection()
    
    const data = await conn.query(sqlquery)
    res.json(data)
  } catch(err) {
    logger.error('error: ', err)
    res.status(500).json({ message: 'Internal Server Error '})
  } finally {
    conn.release()
  }
}

// exports.getAlarmCheck = async (req,res) => {
//   let conn = null
//   try {
//     logger.info('getAlarmCheck ---')
//     let sqlquery = await queries.alarmCheck()
//     conn = await ems_db.getConnection()

//     const data = await conn.query(sqlquery)
//     res.json(data)
//   } catch(err) { 
//     logger.error('error :', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   } finally {
//     conn.release()
//   }

// }


// exports.getAlarmUpdate = async (req,res) => {
//   let conn = null
//   try {
//     logger.info('getAlarmUpdate ---')
//     let sqlquery = await queries.alarmUpdate()
//     conn = await ems_db.getConnection()

//     await conn.query(sqlquery)
//     res.status(200).json({ message: 'ok' });
//   } catch(err) { 
//     logger.error('error :', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   } finally {
//     conn.release()
//   }

// }

// exports.getSiteAlarmCheck = async (req,res) => {
//   let conn = null
//   try {
//     logger.info('getSiteAlarmCheck ---')
//     let sqlquery = await queries.siteAlarmCheck()
//     conn = await ems_db.getConnection()

//     const data = await conn.query(sqlquery)
//     res.json(data)
//   } catch(err) { 
//     logger.error('error :', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   } finally {
//     conn.release()
//   }

// }

// exports.getSiteAlarmUpdate = async (req,res) => {
//   let conn = null
//   try {
//     logger.info('getSiteAlarmUpdate ---')
//     let sqlquery = await queries.siteAlarmUpdate()
//     conn = await ems_db.getConnection()

//     await conn.query(sqlquery)
//     res.status(200).json({ message: 'ok' });
//   } catch(err) { 
//     logger.error('error :', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   } finally {
//     conn.release()
//   }

// }

exports.getNowPeak = async (req, res) => {
  let conn = null
  try {
    logger.info('getNowPeak ---')
    let sqlquery = await queries.nowPeak()
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


exports.getCostPeak = async (req, res) => {
  let conn = null
  try {
    logger.info('getCostPeak ---')
    let sqlquery = await queries.costPeak()
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