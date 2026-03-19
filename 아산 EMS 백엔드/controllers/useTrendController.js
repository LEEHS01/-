const queries = require('../utils/useTrend');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

const serializeData = (data) => {
  // BigInt 값을 숫자로 변환
  const convertBigInt = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'bigint') {
        obj[key] = Number(obj[key]);
      } else if (typeof obj[key] === 'object') {
        convertBigInt(obj[key]);
      }
    }
  };

  // 데이터 직렬화
  convertBigInt(data);
  return JSON.stringify(data);
};

exports.getSelectUseTrendList = async (req, res) => {
  let conn;
  let { search, search2, search3 } = req.query;
  logger.info(search, search2, search3)
  try{
    logger.info('getSelectUseTrendList ---')
    let result = queries.selectUseTrendList({ search, search2, search3 });
    let result2 = queries.peak_max();
    let result3 = queries.todayTcost();
    let result4 = queries.todayLcost();
    let result5 = queries.todayMcost();
    let result6 = queries.todayHcost();
    let result7 = queries.monthT();
    let result8 = queries.monthL();
    let result9 = queries.monthM();
    let result10 = queries.monthH();
    let result11 = queries.yearT();
    let result12 = queries.yearL();
    let result13 = queries.yearM();
    let result14 = queries.yearH();

    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    const rows_2 = await conn.query(result2);
    const rows_3 = await conn.query(result3);
    const rows_4 = await conn.query(result4);
    const rows_5 = await conn.query(result5);
    const rows_6 = await conn.query(result6);
    const rows_7 = await conn.query(result7);
    const rows_8 = await conn.query(result8);
    const rows_9 = await conn.query(result9);
    const rows_10 = await conn.query(result10);
    const rows_11 = await conn.query(result11);
    const rows_12 = await conn.query(result12);
    const rows_13 = await conn.query(result13);
    const rows_14 = await conn.query(result14);

    let param = {}
    param.data1 = rows;
    param.peak_max = rows_2;
    param.todayTcost = rows_3;
    param.todayLcost = rows_4;
    param.todayMcost = rows_5;
    param.todayHcost = rows_6;
    param.monthT = rows_7;
    param.monthL = rows_8;
    param.monthM = rows_9;
    param.monthH = rows_10;
    param.yearT = rows_11;
    param.yearL = rows_12;
    param.yearM = rows_13;
    param.yearH = rows_14;

    res.send(serializeData(param));
  }catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};
