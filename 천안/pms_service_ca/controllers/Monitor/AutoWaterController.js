const logger = require('../../logger').logger
const queries = require('../../utils/query/AutoWaterMapper.js')
const { pms_db } = require('../../db.js')

exports.alarm = async (req, res) => {
  logger.info('AutoWaterController::alarm')
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
    logger.error('AutoWaterController::alarm: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.waterPumpInfo = async(req, res) => {
  logger.info('AutoWaterController::waterPumpInfo')
  let conn
  try {
    const query = queries.waterPumpInfo()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('AutoWaterController::waterPumpInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.currentInfo = async(req, res) => {
  logger.info('AutoWaterController::currentInfo')
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
    logger.error('AutoWaterController::currentInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.detailInfo = async(req, res) => {
  logger.info('AutoWaterController::detailInfo')
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
    logger.error('AutoWaterController::detailInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}
