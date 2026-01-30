const logger = require('../../logger.js').logger
const queries = require('../../utils/query/StatisticsMapper.js')
const { pms_db } = require('../../db.js')

exports.facStatistics = async (req, res) => {
  logger.info('StatisticsController::facStatistics')
  let conn
  try {
    const id = req.params.id
    const query = queries.facStatistics()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('StatisticsController::facStatistics: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.diagStatistics = async (req, res) => {
  logger.info('StatisticsController::diagStatistics')
  let conn
  try {
    const id = req.params.id
    const query = queries.diagStatistics()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('StatisticsController::diagStatistics: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.defectAlarmAll = async (req, res) => {
  logger.info('StatisticsController::defectAlarmAll')
  let conn
  try {
    const id = req.params.id
    const query = queries.defectAlarmAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const nonZeroAlarms = Object.entries(rows[0])
    .filter(([key, value]) => value !== "0" && value !== null)
    .map(([key, value]) => ({ key, value }));
    const response = {
      status: 200,
      message: 'success',
      datas: nonZeroAlarms
    }
    res.json(response)
  } catch(err) {
    logger.error('StatisticsController::defectAlarmAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.weeklyAlarm = async (req, res) => {
  logger.info('StatisticsController::weeklyAlarm')
  let conn
  try {
    const id = req.params.id
    const query = queries.weeklyAlarm()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('StatisticsController::weeklyAlarm: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.alarmList = async (req, res) => {
  let conn
  let { search, search2 } = req.query
  logger.info('StatisticsController::alarmList --- ', search, search2)
  try {
    const id = req.params.id
    const query = queries.alarmList({ search, search2 })
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('StatisticsController::alarmList: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}
