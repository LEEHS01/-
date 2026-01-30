const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/MotorController.js')

// 라우트 처리
router.get('/flowPressure/:id', dataController.flowPressure)
router.post('/distribution', dataController.distribution)
router.post('/bearingTempInfo', dataController.bearingTempInfo)
router.post('/windingTempInfo', dataController.windingTempInfo)
router.post('/motorDetails', dataController.motorDetails)
router.post('/vibrationGraph', dataController.vibrationGraph)
router.get('/runningInfo', dataController.runningInfo)
router.get('/alarm', dataController.alarm)

module.exports = router