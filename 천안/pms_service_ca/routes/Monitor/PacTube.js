const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/PacTubeController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/pacTubeInfo', dataController.pacTubeInfo)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;