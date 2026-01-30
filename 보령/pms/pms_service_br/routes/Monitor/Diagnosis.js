const express = require('express')
const router = express.Router()
const diagnosisController = require('../../controllers/Monitor/DiagnosisController.js')

// 라우트 처리
router.post('/diagPOV', diagnosisController.diagPOV)
router.post('/diagPIV', diagnosisController.diagPIV)
router.post('/diagMOV', diagnosisController.diagMOV)
router.post('/diagMIV', diagnosisController.diagMIV)
router.post('/diagTimeWave', diagnosisController.diagTimeWave)
router.post('/diagSpecTrum', diagnosisController.diagSpecTrum)
router.post('/diagDataSave', diagnosisController.diagDataSave)
router.post('/getDiagData', diagnosisController.getDiagData)

module.exports = router