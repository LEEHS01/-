const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/PachcsTubeController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/pahcsTubeInfo', dataController.pahcsTubeInfo)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;