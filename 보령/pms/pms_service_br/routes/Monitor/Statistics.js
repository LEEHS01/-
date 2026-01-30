const express = require('express')
const router = express.Router()
const statisticsController = require('../../controllers/Monitor/StatisticsController.js')

// 라우트 처리
router.get('/facStatistics', statisticsController.facStatistics)
router.get('/diagStatistics', statisticsController.diagStatistics)
router.get('/defectAlarmAll', statisticsController.defectAlarmAll)
router.get('/weeklyAlarm', statisticsController.weeklyAlarm)
router.get('/alarmList', statisticsController.alarmList)

module.exports = router