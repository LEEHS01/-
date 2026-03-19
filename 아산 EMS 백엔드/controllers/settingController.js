const { ems_db } = require('../db.js')
const queries = require('../utils/setting')
const logger = require('../logger').logger;

// selectZone
exports.getZone = async (req, res) => {
  let conn
  try {
    logger.info('getZone ---')
    let result = queries.selectZone();
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
}

// selectTagList
exports.getSelectTag = async (req, res) => {
  let conn
  try {
    logger.info('getSelectTAG ---')
    let zoneData = {
        zone: req.body.params.zone,
        fac: req.body.params.fac,
        tagname: req.body.params.tag
    }
    let result_query = await queries.getSelectTag(zoneData)
    conn = await ems_db.getConnection()
    const result = await conn.query(result_query)
    res.json(result)
  } catch(err) {
    logger.error('error : ', err)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.updateTagInfo = async (req, res) => {
  let conn;
  let { tagList } = req.body.params;
  try {
    logger.info('updateTagInfo ---')
    conn = await ems_db.getConnection();
    for (let i = 0; i < tagList.length; i++) {
      let tag = tagList[i]
      let result = queries.updateZone({ tag });
      let result2 = queries.updateFac({ tag });
      await conn.query(result);
      await conn.query(result2);
    }
    res.status(200).json({ message: 'ok' });
  } catch(err) {
    logger.error('error :', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release()
    }
  }
};