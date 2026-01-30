const logger = require('../../logger').logger
const queries = require('../../utils/query/PachcsTubeMapper.js')
const { pms_db } = require('../../db.js')

exports.alarm = async (req, res) => {
  logger.info('PachcsTubeController::alarm')
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
    logger.error('PachcsTubeController::alarm: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.pahcsTubeInfo = async(req, res) => {
  logger.info('PachcsTubeController::pahcsTubeInfo')
  let conn
  try {
    const query = queries.pahcsTubeInfo()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows.map(row => ({
        pahcs_tube_pump_id: row.pahcs_tube_pump_id,
        eq_on: Number(row.eq_on),
        flowmeter: row.flowmeter,
        flowppm: row.flowppm
      }))
    }
    res.json(response)
  } catch(err) {
    logger.error('PachcsTubeController::pahcsTubeInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.currentInfo = async(req, res) => {
  logger.info('PachcsTubeController::currentInfo')
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
    logger.error('PachcsTubeController::currentInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.detailInfo = async(req, res) => {
  logger.info('PachcsTubeController::detailInfo')
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
    logger.error('PachcsTubeController::detailInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}