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
  let { search } = req.body;

  try {
    logger.info('getPumpData --- search: ', search);
    conn = await ems_db.getConnection();
    let rows1;
    let rows2;
    let rows3;
    let rows4;
    let rows5;
    let rows7;

    switch (search) {
      case '보령_정':
        rows1 = await conn.query(queries.pump_query1_br);
        rows2 = await conn.query(queries.pump_query2_br);
        rows3 = await conn.query(queries.pump_query3_br);
        rows4 = [];
        rows5 = await conn.query(queries.pump_query5_br);
        rows7 = await conn.query(queries.pump_query7_br);
        break;
      case '서산_가':
        rows1 = await conn.query(queries.pump_query1_ss);
        rows2 = await conn.query(queries.pump_query2_ss);
        rows3 = await conn.query(queries.pump_query3_ss);
        rows4 = await conn.query(queries.pump_query4_ss)
        rows5 = await conn.query(queries.pump_query5_ss);
        rows7 = await conn.query(queries.pump_query7_ss);
        break;
      case '청양_가':
        rows1 = await conn.query(queries.pump_query1_cy);
        rows2 = await conn.query(queries.pump_query2_cy);
        rows3 = await conn.query(queries.pump_query3_cy);
        rows4 = await conn.query(queries.pump_query4_cy)
        rows5 = await conn.query(queries.pump_query5_cy);
        rows7 = await conn.query(queries.pump_query7_cy);
        break;
      case '홍성_가':
        rows1 = await conn.query(queries.pump_query1_hs);
        rows2 = await conn.query(queries.pump_query2_hs);
        rows3 = await conn.query(queries.pump_query3_hs);
        rows4 = await conn.query(queries.pump_query4_hs)
        rows5 = await conn.query(queries.pump_query5_hs);
        rows7 = await conn.query(queries.pump_query7_hs);
        break;
      default:
        logger.error('error :no search parameter!')
        res.status(500).json({ message: 'Internal Server Error: no search parameter' });
        return;
    }

    const rows6 = await conn.query(queries.pump_query6);

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
  let { search } = req.body;
  logger.info('---- getPrediction search: ', search)

  try {
    conn = await ems_db.getConnection();
    const rows1 = await conn.query(queries.predic_query1);
    const rows2 = await conn.query(queries.predic_query2);
    let rows3;

    switch (search) {
      case '보령_정':
        rows3 = await conn.query(queries.predic_query3_br);
        break;
      case '서산_가':
        rows3 = await conn.query(queries.predic_query3_ss);
        break;
      case '청양_가':
        rows3 = await conn.query(queries.predic_query3_cy);
        break;
      case '홍성_가':
        rows3 = await conn.query(queries.predic_query3_hs);
        break;
      default:
        logger.error('error :no search parameter!')
        res.status(500).json({ message: 'Internal Server Error: no search parameter' });
        return;
    }

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
