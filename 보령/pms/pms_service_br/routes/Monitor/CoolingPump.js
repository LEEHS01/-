const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/CoolingPumpController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/coolingPumpInfo', dataController.coolingPumpInfo)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;