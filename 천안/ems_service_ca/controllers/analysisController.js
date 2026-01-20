// const getChartQuery = require('./queries/AI/analysis');
const mariadb = require('mariadb');
const queries = require('../utils/analysisQuery');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

// savingChart(analysis)
exports.getChart = async (req, res) => {
  // 데이터 처리 로직
  let conn;
  try {
    conn = await ems_db.getConnection();
    const rows = await conn.query(queries.chart_query);
    res.json(rows);
  } catch(err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  } 
};

exports.getPumpData = async(req, res) => {
  let conn;
  try {
    conn = await ems_db.getConnection();

    const rows1 = await conn.query(queries.pump_query1);
    const rows2 = await conn.query(queries.pump_query2);
    const rows3 = await conn.query(queries.pump_query3);
    const rows4 = await conn.query(queries.pump_query4);
    const rows5 = await conn.query(queries.pump_query5);
    const rows6 = await conn.query(queries.pump_query6);
    const rows7 = await conn.query(queries.pump_query7);

    let result = {
        data1: rows1,
        data2: rows2,
        data3: rows3,
        data4: rows4,
        data5: rows5,
        data6: rows6,
        data7: rows7
    }
    res.json(result); // 클라이언트에 응답으로 결과 데이터 전송
  } catch(err) { 
    logger.error('error:', err);
    res.status(500).json({ message: 'Internal Server Error'});
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getValveData = async(req, res) => { 
  logger.info('---- getValveData start!')
  let conn;
  try {
    conn = await ems_db.getConnection();
    const rows1 = await conn.query(queries.valve_query);

    res.json(rows1); 
  } catch(err) {
    logger.error('error :', err.message)
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.getPrediction = async(req, res) => {
  let conn;
  try {
    conn = await ems_db.getConnection();
    const rows1 = await conn.query(queries.predic_query1);
    const rows2 = await conn.query(queries.predic_query2);
    const rows3 = await conn.query(queries.predic_query3);

    let result = {
      data1: rows1,
      data2: rows2,
      data3: rows3,
    }
    res.json(result); // 클라이언트에 응답으로 결과 데이터 전송
  } catch(err) {
    logger.error('error :', err.message)
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }

}
