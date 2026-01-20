// query import..

const { ems_db } = require('../db.js')
const queries = require('../utils/peakcontrol')
const logger = require('../logger').logger;

exports.getData = async (req, res) => {
  let conn;
  try {
    let query = await queries.selectPeakControl()
    conn = await ems_db.getConnection()
    const rows = await conn.query(query)
    res.json(rows)
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

// exports.getChart = async (req, res) => {
//   let conn
//   let { search, search2 , search3} = req.query
//   try {
//     let sqlquery = await queries.selectPeakChart(search, search2 ,search3 )
//     conn = await ems_db.getConnection();

//     const rows = await conn.query(sqlquery)
//     let param = {}
//     if(rows) {
//       param.data = rows,
//       param.erorr = false
//     }
    
//     res.json(param)
//   } catch(err) {
//     logger.error('error :', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   } finally {
//     if (conn) {
//       conn.release()
//     }
//   }
// }

exports.getPump = async (req, res) => {
  let conn
  try {
    let sqlquery = await queries.pumpSelect()
    let sqlquery2 = await queries.pumpSelect2()
    conn = await ems_db.getConnection()
    
    const data1 = await conn.query(sqlquery)
    const data2 = await conn.query(sqlquery2)

    let param = {}
    param.data1 = data1
    param.data2 = data2
    if( data1 && data2 ) {
      param.error = false
      res.json(param)
    } else {
      param.error = true
      res.json(param)
    }
  }catch(err) {
    logger.error(err)
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }

  
}

exports.getPeakGoal = async (req, res) => {
  let conn;

  try {
    let queryStr = await queries.selectPeakGoalQuery();
    conn = await ems_db.getConnection();
    const peakGoal = await conn.query(queryStr);

    res.json(peakGoal);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.getPeakData = async (req, res) => {
  let conn;
  let { search, search2 , search3 } = req.query;

  try {
    let queryStr = await queries.peakSelectQuery(search, search2 ,search3);
    conn = await ems_db.getConnection();
    const peakData = await conn.query(queryStr);

    res.json(peakData);
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
}
