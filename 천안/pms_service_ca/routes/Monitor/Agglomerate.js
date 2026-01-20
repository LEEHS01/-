const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/AgglomerateController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/agglomerateInfo/:id', dataController.agglomerateInfo)
router.get('/agglomerateCount', dataController.agglomerateCount)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)

module.exports = router;