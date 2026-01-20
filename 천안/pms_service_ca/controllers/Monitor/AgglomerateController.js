const logger = require('../../logger').logger
const queries = require('../../utils/query/AgglomerateMapper.js')
const { pms_db } = require('../../db.js')

exports.alarm = async (req, res) => {
  logger.info('AgglomerateController::alarm')
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
    logger.error('AgglomerateController::alarm: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.agglomerateInfo = async(req, res) => {
  logger.info('AgglomerateController::agglomerateInfo')
  let conn
  try {
    const id = req.params.id
    const query = queries.agglomerateInfo(id)
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
    logger.error('AgglomerateController::agglomerateInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.agglomerateCount = async(req, res) => {
  logger.info('AgglomerateController::agglomerateCount')
  let conn
  try {
    const query = queries.agglomerateCount()
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
    logger.error('AgglomerateController::agglomerateCount: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.currentInfo = async(req, res) => {
  logger.info('AgglomerateController::currentInfo')
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
    logger.error('AgglomerateController::currentInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.detailInfo = async(req, res) => {
  logger.info('AgglomerateController::detailInfo')
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
    logger.error('AgglomerateController::detailInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}