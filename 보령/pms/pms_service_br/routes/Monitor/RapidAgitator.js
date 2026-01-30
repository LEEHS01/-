const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/RapidAgitatorController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/rapidAgitatorInfo', dataController.rapidAgitatorInfo)
router.get('/rapidAgitatorCount', dataController.rapidAgitatorCount)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;