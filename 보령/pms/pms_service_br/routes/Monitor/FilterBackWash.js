const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/FilterBackWashController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/count', dataController.count)
router.get('/info', dataController.filterBackWashInfo)
router.post('/distribution', dataController.distribution)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;