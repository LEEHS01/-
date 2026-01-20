const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/VcbController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.post('/disCharge', dataController.disCharge)
router.get('/info', dataController.info)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;