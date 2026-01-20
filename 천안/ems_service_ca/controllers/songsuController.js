const queries = require('../utils/songsu');
const logger = require('../logger').logger;

// MariaDB 연결 설정
const { ems_db } = require('../db.js');

exports.getGetPopup = async (req, res) => {
  let conn;
  try {
    logger.info('getGetPopup ---')
    let result = queries.getPopup();
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);

    let param = {}
    param.data = rows;

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

exports.getInsertPopup = async (req, res) => {
  let conn;
  let { search, search2 } = req.query;
  try {
    logger.info('getInsertPopup ---');
    let result = queries.insertPopup({ search, search2 });
    let result2 = queries.updatePopup();
    conn = await ems_db.getConnection();
    await conn.query(result);
    await conn.query(result2);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getInitPopup = async (req,res) => {
  let conn;
  try {
    logger.info('getInitPopup ---');
    let result = queries.initPopup();
    conn = await ems_db.getConnection();
    await conn.query(result);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }

}

exports.getInsertPopup2 = async (req, res) => {
  let conn;
  let { search, local, updt_time, ai_info, flag } = req.query;
  try {
    logger.info('getInsertPopup2 ---');
    let result = queries.insertPopup4({ local });
    let result2 = queries.insertPopup2({ search, local, updt_time });
    let result3 = queries.insertPopup3({ local });
    let result4 = queries.insertPopup5({ local, updt_time });
    let result5 = queries.insertPopup6({ updt_time, ai_info, flag });
    conn = await ems_db.getConnection();
    await conn.query(result);
    await conn.query(result2);
    await conn.query(result3);
    await conn.query(result4);
    await conn.query(result5);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getInsertPopupAuto2 = async (req, res) => {
  let conn;
  let { search, local, updt_time, ai_info, flag } = req.query;
  try {
    logger.info('getInsertPopupAuto2 ---');
    // let result = queries.insertPopup4({ local });
    // let result2 = queries.insertPopup2({ search, local, updt_time });
    // let result3 = queries.insertPopup3({ local });
    // let result4 = queries.insertPopup5({ local, updt_time });
    let result5 = queries.insertPopup6({ updt_time, ai_info, flag });
    conn = await ems_db.getConnection();
    // await conn.query(result);
    // await conn.query(result2);
    // await conn.query(result3);
    // await conn.query(result4);
    await conn.query(result5);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getInsertPopup3 = async (req, res) => {
  let conn;
  let { search } = req.query;
  try {
    logger.info('getInsertPopup3 ---');
    if (search != '천안' && search != '목천') {
      logger.error('error :no search parameter!')
      res.status(500).json({ message: 'Internal Server Error: no search parameter' });
      return;
    }

    let result = queries.insertPopup3({ search });
    conn = await ems_db.getConnection();
    await conn.query(result);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getUpdateCTR_PRF_PMPMST_INF = async (req, res) => {
  let conn;
  let { search } = req.query;
  try {
    logger.info('getUpdateCTR_PRF_PMPMST_INF ---');
    let result = queries.updateCTR_PRF_PMPMST_INF({ search });
    conn = await ems_db.getConnection();
    await conn.query(result);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};


exports.getPTR_CTR_INF = async (req, res) => {
  let conn;
  try {
    logger.info('getPTR_CTR_INF ---');
    let result = queries.PTR_CTR_INF();
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);

    let param = {};
    param.data = {};

    rows.forEach(row => {
      // UPDT_TIME에서 분 값만 추출
      let updtTime = new Date(row.UPDT_TIME);
      let minutes = updtTime.getMinutes();

      // 각 tag를 키로 하는 객체 생성
      param.data[row.tag] = {
        value: row.value,
        UPDT_TIME_MINUTES: minutes,
        DIFF_TIME: row.diff,
        UPDT_TIME: row.UPDT_TIME
      };
    });

    res.json(param);
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

// exports.getPTR_CTR_INF = async (req, res) => {
//   let conn;
//   try {
//     logger.info('getPTR_CTR_INF ---');
//     let result = queries.PTR_CTR_INF();
//     conn = await ems_db.getConnection();
//     const rows = await conn.query(result);

//     let param = {}
//     param.data = rows;

//     res.json(param);
//   } catch (err) {
//     logger.error('error: ', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   } finally {
//     if (conn) {
//       conn.release()
//     }
//   }
// };

exports.getSongsuSelect = async (req, res) => {
  let conn;
  let { name } = req.query;
  try {
    logger.info('getSongsuSelect ---');
    let result2 
    logger.info(name)
    let result = queries.songsuSelect();

    if(name === 'songsu'){
      result2 = queries.songsuSelect2();
    }
    else if(name === 'modal'){
      result2 = queries.songsuSelectPopup2();
    }

    let result3 = queries.songsuSelect3();
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    const rows_2 = await conn.query(result2);
    const rows_3 = await conn.query(result3);

    let param = {}
    param.data1 = rows;
    param.data2 = rows_2;
    param.data3 = rows_3;

    res.json(param);
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getPumpSelect = async (req, res) => {
  let conn;
  try {
    logger.info('getPumpSelect ---');
    let result = queries.pumpSelect();
    let result2 = queries.pumpSelect2();
    let result3 = queries.pumpSelect3();
    let result4 = queries.pumpSelect4();


    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    const rows_2 = await conn.query(result2);
    const rows_3 = await conn.query(result3);
    const row_4 = await conn.query(result4);

    let param = {}
    param.data1 = rows;
    param.data2 = rows_2;
    param.data3 = rows_3;
    param.data4 = row_4;

    res.json(param);
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getInsertAIonOff = async (req, res) => {
  let conn;
  let { search, search2 } = req.query;
  try {
    logger.info('getInsertAIonOff ---');
    let result = queries.insertAIonOff({ search, search2 });
    let result2 = queries.updateAIonOff({ search, search2 });
    conn = await ems_db.getConnection();
    await conn.query(result);
    await conn.query(result2);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getInterpuppt = async (req, res) => {
  let conn;
  try {
    logger.info('getInterpuppt ---');
    let result = queries.interpuppt();
    let result2 = queries.getPumpTime();
    conn = await ems_db.getConnection();
    const rows = await conn.query(result);
    const rows_2 = await conn.query(result2);

    let param = {}
    param.interpuppt = rows;
    param.getPumpTime = rows_2;

    res.json(param);
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};

exports.getInsertAIpopupAlarm = async (req, res) => {
  let conn;
  try {
    logger.info('getInsertAIpopupAlarm ---');
    let result = queries.insertAIpopupAlarm();
    conn = await ems_db.getConnection();
    await conn.query(result);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    logger.error('error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};
