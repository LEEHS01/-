const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/AutoWaterController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/waterPumpInfo', dataController.waterPumpInfo)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;