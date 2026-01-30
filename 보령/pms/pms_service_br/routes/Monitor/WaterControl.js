const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/WaterController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/eqOpen', dataController.eqOpen)
router.post('/currentGraph', dataController.currentGraph)
router.post('/overCurrentGraph', dataController.overCurrentGraph)
router.post('/voltageFluctuationGraph', dataController.voltageFluctuationGraph)

module.exports = router;