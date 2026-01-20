const logger = require('../../logger').logger
const queries = require('../../utils/query/CoolingPumpMapper.js')
const { pms_db } = require('../../db.js')

exports.alarm = async (req, res) => {
  logger.info('CoolingPumpController::alarm')
  let conn
  try {
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
    logger.error('CoolingPumpController::alarm: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.coolingPumpInfo = async (req, res) => {
  logger.info('CoolingPumpController::coolingPumpInfo')
  let conn
  try {
    const query = queries.coolingPumpInfo()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('CoolingPumpController::coolingPumpInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.currentInfo = async (req, res) => {
  logger.info('CoolingPumpController::currentInfo')
  let conn
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    }
    const query = queries.currentInfo(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('CoolingPumpController::currentInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.detailInfo = async (req, res) => {
  logger.info('CoolingPumpController::detailInfo')
  let conn
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    }
    const query = queries.detailInfo(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('CoolingPumpController::detailInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}