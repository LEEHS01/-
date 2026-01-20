const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/DashBoard/MainController');

// 라우트 처리
router.get('/waterPacAll', dataController.waterPacAll)
router.get('/rapidAggloSludgeAll', dataController.rapidAggloSludgeAll)
router.get('/filterGacAll', dataController.filterGacAll)
router.get('/motifCoolAll', dataController.motifCoolAll)
router.get('/pumpTransVcbAll', dataController.pumpTransVcbAll)
router.get('/waterAlarmAll', dataController.waterAlarmAll)
router.get('/rapidAggloSludgeAlarmAll', dataController.rapidAggloSludgeAlarmAll)
router.get('/filterAlarmAll', dataController.filterAlarmAll)
router.get('/ozoneAlarmAll', dataController.ozoneAlarmAll)
router.get('/pumpAlarmAll', dataController.pumpAlarmAll)
router.get('/motorDataAll', dataController.motorDataAll)
router.get('/pumpBearingAll', dataController.pumpBearingAll)
router.get('/motorAlarm', dataController.motorAlarm)
router.get('/alarmDataAll', dataController.alarmDataAll)
router.get('/nullDataAlarmInfo', dataController.nullDataAlarmInfo)
router.get('/operationAll', dataController.operationAll)

module.exports = router;