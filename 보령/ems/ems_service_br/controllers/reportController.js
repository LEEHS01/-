const queries = require('../utils/report');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getSelectReport = async (req, res) => {
  let conn;
  let { search, search2, search3, search4, search5, search6, search7 } = req.query;
  try {
    logger.info('getSelectReport ---')
    let result = queries.selectReport({ search, search2, search3, search4, search5, search6, search7 });
    let result2 = queries.selectReport2({ search3, search4, search6, search7 });
    let result3 = queries.selectReport3({ search3, search6, search7 });
    let result4 = queries.selectReport4({ search3 });
    let result5 = queries.selectReport5({ search3 });
    let result6 = queries.selectReport6({ search3 });
    let result7 = queries.selectReport7({ search3 });
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    const rows2 = await conn.query(result2);
    const rows3 = await conn.query(result3);
    const rows4 = await conn.query(result4);
    const rows5 = await conn.query(result5);
    const rows6 = await conn.query(result6);
    const rows7 = await conn.query(result7);

    let param = {}
    param.data1 = rows;
    param.data2 = rows2;
    param.data3 = rows3;
    param.data4 = rows4;
    param.data5 = rows5;
    param.data6 = rows6;
    param.data7 = rows7;

    res.json(param);
  } catch(err) {
    logger.error('error: ',err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getSelectPerformList = async (req, res) => {
  let conn;
  let { search, search2, search3, search4 } = req.query;
  try{
    logger.info('getSelectPerformList ---')
    let result = queries.selectPerformList({ search, search2, search3, search4 });
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    res.json(rows);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};
