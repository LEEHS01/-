const logger = require('../../logger.js').logger
const queries = require('../../utils/query/DiagnosisMapper.js')
const { pms_db } = require('../../db.js')
const zlib = require('zlib');
const base64 = require('base64-js');
const math = require('mathjs');



exports.diagPOV = async (req, res) => {
  let conn
  const params = {
    centerId: req.body.centerId,
    pumpId: req.body.pumpId,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }
  logger.info('DiagnosisController::diagPOV --- ', params)
  try {
    const id = req.params.id
    const query = queries.diagPOV(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('DiagnosisController::diagPOV: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.diagPIV = async (req, res) => {
  let conn
  const params = {
    centerId: req.body.centerId,
    pumpId: req.body.pumpId,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }
  logger.info('DiagnosisController::diagPIV --- ', params)
  try {
    const id = req.params.id
    const query = queries.diagPIV(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('DiagnosisController::diagPIV: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.diagMOV = async (req, res) => {
  let conn
  const params = {
    centerId: req.body.centerId,
    motorId: req.body.motorId,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }
  logger.info('DiagnosisController::diagMOV --- ', params)
  try {
    const id = req.params.id
    const query = queries.diagMOV(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('DiagnosisController::diagMOV: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.diagMIV = async (req, res) => {
  let conn
  const params = {
    centerId: req.body.centerId,
    motorId: req.body.motorId,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }
  logger.info('DiagnosisController::diagMIV --- ', params)
  try {
    const id = req.params.id
    const query = queries.diagMIV(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('DiagnosisController::diagMIV: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.diagTimeWave = async (req, res) => {
  let conn
  const params = {
    centerId: req.body.centerId,
    channelId: req.body.channelId,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }
  logger.info('DiagnosisController::diagTimeWave --- ', params)
  try {
    const id = req.params.id
    const query = queries.diagTimeWave(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    if (rows.length > 0 && rows[0].dt_ary.length > 0) {
      const compressedData = Buffer.from(rows[0].dt_ary, 'base64')
      const decompressedData = zlib.gunzipSync(compressedData)
      rows[0].dt_ary = decompressedData.toString('utf-8')
    }
    const response = {
      status: 200,
      message: 'success',
      datas: rows
    }
    res.json(response)
  } catch(err) {
    logger.error('DiagnosisController::diagTimeWave: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

exports.diagSpecTrum = async (req, res) => {
  let conn
  const params = {
    centerId: req.body.centerId,
    pmId: req.body.pmId,
    channelId: req.body.channelId,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }
  logger.info('DiagnosisController::diagSpecTrum --- ')
  try {
    // const id = req.params.id
    const query = queries.diagSpecTrum(params)
    conn = await pms_db.getConnection()
    const rows = await conn.query(query)
    if (rows.length > 0 && rows[0].dt_ary.length > 0) {
      const compressedData = Buffer.from(rows[0].dt_ary, 'base64')
      const decompressedData = zlib.gunzipSync(compressedData)
      rows[0].dt_ary = decompressedData.toString('utf-8')
    }
    if (rows.length > 0) {
      const vibrationValues = rows[0].dt_ary.split(',').map(parseFloat);
      const n = vibrationValues.length;
      const sample_rate = 12800;  // Hz
  
      // 주파수 계산
      const frequencies = Array.from({ length: n }, (_, i) => i * sample_rate / n);
  
      // FFT 수행 (math.js 사용)
      const spectrum = math.fft(vibrationValues);
      const amplitude = spectrum.map(value => math.abs(value));
  
      // 주파수와 진폭 범위 생성
      const frequencyRange = frequencies.slice(0, n / 2);
      const amplitudeRange = amplitude.slice(0, n / 2);
  
      // 속도 계산 (진폭을 속도로 변환)
      // 속도(v) = 진폭(a) / (2 * π * 주파수(f))
      const velocityRange = amplitudeRange.map((amp, i) => frequencyRange[i] === 0 ? 0 : amp / (2 * Math.PI * frequencyRange[i]));
      
      const response = {
        status: 200,
        message: 'success',
        datas: {
          frequencyRange: frequencyRange,
          velocityRange: velocityRange
        }
      }
      res.json(response)
      } else {
        const response = {
          status: 200,
          message: 'success',
          datas: {
            frequencyRange: null,
            velocityRange: null
          }
        }
        res.json(response)
    }
  } catch(err) {
    logger.error('DiagnosisController::diagSpecTrum: ', err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

  exports.diagDataSave = async(req, res) => {
    let conn;
    try {
      // 프론트엔드에서 보낸 데이터를 추출
      const { ipc_loc, pm_id, ch_id, formData} = req.body;  
      logger.info( ipc_loc, pm_id, ch_id, formData )
      // pumpFormData나 motorFormData에 따라서 저장하는 로직을 나눕니다.
      const data = formData;

      // 쿼리를 실행하기 위한 준비
      const query = queries.diagDataSave({
        ipc_loc,
        pm_id,
        ch_id,
        data
      });



      conn = await pms_db.getConnection();
      await conn.query(query); // 쿼리 실행
      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (err) {
      logger.error('error :', err);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  exports.getDiagData = async(req, res) => {
    let conn;
    try {
      // 프론트엔드에서 보낸 데이터를 추출
      const { ipc_loc, pm_id, ch_id} = req.body;  
      logger.info( ipc_loc, pm_id, ch_id )

      // 쿼리를 실행하기 위한 준비
      const query = queries.getDiagData({
        ipc_loc,
        pm_id,
        ch_id,
      });

      conn = await pms_db.getConnection();
      const rows = await conn.query(query); // 쿼리 실행

      const response = {
        status: 200,
        message: 'success',
        datas: rows
      }
      res.json(response)
    } catch (err) {
      logger.error('getDiagData: ', err.stack)
      res.status(500).json({ message: 'Internal Server Error' })
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
