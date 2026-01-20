const logger = require('../../logger').logger
const queries = require('../../utils/query/MotorMapper.js')
const { pms_db } = require('../../db.js')

exports.flowPressure = async (req, res) => {
  logger.info('MotorController::flowPressure')
  let conn
  try {
    const id = req.params.id
    const query = queries.flowPressure(id)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MotorController::flowPressure: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.distribution = async (req, res) => {
  logger.info('MotorController::distribution')
  let conn
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      id: req.body.id
    }
    const query = queries.distribution(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MotorController::distribution: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.bearingTempInfo = async (req, res) => {
  logger.info('MotorController::bearingTempInfo')
  let conn
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      id: req.body.id
    }
    const query = queries.bearingTempInfo(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MotorController::bearingTempInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.windingTempInfo = async (req, res) => {
  logger.info('MotorController::windingTempInfo')
  let conn
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      id: req.body.id
    }
    const query = queries.windingTempInfo(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MotorController::windingTempInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.motorDetails = async (req, res) => {
  logger.info('MotorController::motorDetails')
  let conn
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      id: req.body.id,
      centerId: req.body.centerId
    }
    const query = queries.motorDetails(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MotorController::motorDetails: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.vibrationGraph = async (req, res) => {
  logger.info('MotorController::vibrationGraph')
  let conn
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      id: req.body.id
    }
    const query = queries.vibrationGraph(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MotorController::vibrationGraph: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.runningInfo = async (req, res) => {
  logger.info('MotorController::runningInfo')
  let conn
  try {
    const query = queries.runningInfo()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MotorController::runningInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.alarm = async (req, res) => {
  logger.info('MotorController::alarm')
  let conn
  try {
    // const params = {
    //   centerId: req.body.centerId
    // }
    // const query = queries.alarm(params)
    const query = queries.alarm()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MotorController::alarm: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}