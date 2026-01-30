const logger = require('../../logger').logger
const queries = require('../../utils/query/MainMapper')
const { pms_db } = require('../../db.js')

exports.waterPacAll = async (req, res) => {
  logger.info('MainController::waterPacAll')
  let conn
  try {
    const query = queries.waterPacAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::waterPacAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.rapidAggloSludgeAll = async (req, res) => {
  logger.info('MainController::rapidAggloSludgeAll')
  let conn
  try {
    const query = queries.rapidAggloSludgeAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::rapidAggloSludgeAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.filterGacAll = async (req, res) => {
  logger.info('MainController::filterGacAll')
  let conn
  try {
    const query = queries.filterGacAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::filterGacAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.motifCoolAll = async (req, res) => {
  logger.info('MainController::motifCoolAll')
  let conn
  try {
    const query = queries.motifCoolAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::motifCoolAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.pumpTransVcbAll = async (req, res) => {
  logger.info('MainController::pumpTransVcbAll')
  let conn
  try {
    const query = queries.pumpTransVcbAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::pumpTransVcbAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.waterAlarmAll = async (req, res) => {
  logger.info('MainController::waterAlarmAll')
  let conn
  try {
    const query = queries.waterAlarmAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::waterAlarmAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.rapidAggloSludgeAlarmAll = async (req, res) => {
  logger.info('MainController::rapidAggloSludgeAlarmAll')
  let conn
  try {
    const query = queries.rapidAggloSludgeAlarmAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::rapidAggloSludgeAlarmAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.filterAlarmAll = async (req, res) => {
  logger.info('MainController::filterAlarmAll')
  let conn
  try {
    const query = queries.filterAlarmAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::filterAlarmAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.ozoneAlarmAll = async (req, res) => {
  logger.info('MainController::ozoneAlarmAll')
  let conn
  try {
    const query = queries.ozoneAlarmAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::ozoneAlarmAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.pumpAlarmAll = async (req, res) => {
  logger.info('MainController::pumpAlarmAll')
  let conn
  try {
    const query = queries.pumpAlarmAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::pumpAlarmAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.motorDataAll = async (req, res) => {
  logger.info('MainController::motorDataAll')
  let conn
  try {
    const query = queries.motorDataAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::motorDataAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.pumpBearingAll = async (req, res) => {
  logger.info('MainController::pumpBearingAll')
  let conn
  try {
    const query = queries.pumpBearingAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::pumpBearingAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.motorAlarm = async (req, res) => {
  logger.info('MainController::motorAlarm')
  let conn
  try {
    const query = queries.motorAlarm()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::motorAlarm: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.alarmDataAll = async (req, res) => {
  logger.info('MainController::alarmDataAll')
  let conn
  try {
    const query = queries.alarmDataAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::alarmDataAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.nullDataAlarmInfo = async (req, res) => {
  logger.info('MainController::nullDataAlarmInfo')
  let conn
  try {
    const query = queries.nullDataAlarmInfo()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::nullDataAlarmInfo: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.operationAll = async (req, res) => {
  logger.info('MainController::operationAll')
  let conn
  try {
    const query = queries.operationAll()
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('MainController::operationAll: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}