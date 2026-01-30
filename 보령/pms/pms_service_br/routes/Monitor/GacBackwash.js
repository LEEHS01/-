const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/GacBackwashController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/backwashCount', dataController.backwashCount)
router.get('/backwashInfo', dataController.backwashInfo)
router.post('/distribution', dataController.distribution)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;