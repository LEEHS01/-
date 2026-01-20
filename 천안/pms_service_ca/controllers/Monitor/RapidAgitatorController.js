const logger = require('../../logger').logger
const queries = require('../../utils/query/RapidAgitatorMapper.js')
const { pms_db } = require('../../db.js')

exports.alarm = async (req, res) => {
  logger.info('RapidAgitatorController::alarm')
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
    logger.error('RapidAgitatorController::alarm: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.rapidAgitatorInfo = async(req, res) => {
  logger.info('RapidAgitatorController::rapidAgitatorInfo')
  let conn
  try {
    const query = queries.rapidAgitatorInfo()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows.map(row => ({
        rapid_agitator_id: row.rapid_agitator_id,
        eq_on: Number(row.eq_on)
      }))
    }
    res.json(response)
  } catch(err) {
    logger.error('RapidAgitatorController::rapidAgitatorInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.rapidAgitatorCount = async(req, res) => {
  logger.info('RapidAgitatorController::rapidAgitatorCount')
  let conn
  try {
    const query = queries.rapidAgitatorCount()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows.map(row => ({
        eq_on: Number(row.eq_on)
      }))
    }
    res.json(response)
  } catch(err) {
    logger.error('RapidAgitatorController::rapidAgitatorCount: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.currentInfo = async(req, res) => {
  logger.info('RapidAgitatorController::currentInfo')
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
    logger.error('RapidAgitatorController::currentInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.detailInfo = async(req, res) => {
  logger.info('RapidAgitatorController::detailInfo')
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
    logger.error('RapidAgitatorController::detailInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

