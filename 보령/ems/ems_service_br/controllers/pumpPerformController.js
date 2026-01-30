const mariadb = require('mariadb');
const queries = require('../utils/pumpPerform');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getSearch = async (req, res) => {
  // 데이터 처리 로직
  let conn;
  let { search, search2, search4 } = req.query;
  try {
    logger.info('getSearch ---')
    let result = await queries.searchQuery({ search3: "PMB_TAG", search, search2, search4 });
    let result2 = await queries.searchQuery({ search3: "PWI_TAG", search, search2, search4 });
    let result3 = await queries.searchQuery({ search3: "SPI_TAG", search, search2, search4 });

    conn = await ems_db.getConnection();

    const rows = await conn.query(result);
    const rows_2 = await conn.query(result2);
    const rows_3 = await conn.query(result3);
    
    let param = {}
    param.data1 = rows;
    param.data2 = rows_2;
    param.data3 = rows_3;

    res.json(param);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};