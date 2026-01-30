// const getChartQuery = require('./queries/AI/analysis');

const queries = require('../utils/sujiSelect');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

// selectSuji1
exports.getSelect = async (req, res) => {
  logger.info('select1 ---')
  
  logger.info('ksw: ',req.gubun)

  // 데이터 처리 로직
  let conn;
  const  search_query = await queries.searchQuery(req.query);
  const search_query2 = await queries.searchQuery2(req.query);
  const search_query3_1 = await queries.searchQuery3_1(req.query);
  // const search_query3_2 = await queries.searchQuery3_2(req.query);
  const search_query4 = await queries.searchQuery4(req.query);
  const search_query5 = await queries.searchQuery5(req.query);
  const search_query6 = await queries.searchQuery6(req.query);
  const search_query_sunsi = await queries.searchQuery_sunsi(req.query);
  
  //  console.log('수위: ', search_query)
  //  console.log('유입유량: ', search_query2)
    // console.log('유입밸브상태: ', search_query3_1)
  //  console.log('유입밸브상태2: ', search_query3_2)
  //   console.log('유출유량: ', search_query4)
  //   console.log('토출관압: ', search_query5)
  //   console.log('정속펌프대수: ', search_query6)
    // console.log('순시값: ', search_query_sunsi)
  

  try {
    conn = await ems_db.getConnection();
    const rows1 = await conn.query(search_query);
    const rows2 = await conn.query(search_query2);
    const rows3_1 = await conn.query(search_query3_1);
    // const rows3_2 = await conn.query(search_query3_2);
    const rows4 = await conn.query(search_query4);
    const rows5 = await conn.query(search_query5);
    const rows6 = await conn.query(search_query6);
    const rows7 = await conn.query(search_query_sunsi);


    let result = {
      data1: rows1,
      data2: rows2,
      data3_1: rows3_1,
      // data3_2: rows3_2,
      data4: rows4,
      data5: rows5,
      data6: rows6,
      data7: rows7
    }
    res.json(result); // 클라이언트에 응답으로 결과 데이터 전송
  }catch(err) {
    logger.error('Error occurred:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      errno: err.errno,
      sql: err.sql // SQL 쿼리가 포함된 경우
    });
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};
