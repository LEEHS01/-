const express = require('express')
const router = express.Router()
const dataController = require('../../controllers/Monitor/SludgeCollectorController.js');

// 라우트 처리
router.get('/alarm', dataController.alarm)
router.get('/sludgeInfo', dataController.sludgeInfo)
router.post('/currentInfo', dataController.currentInfo)
router.post('/detailInfo', dataController.detailInfo)
router.get('/torqueInfo', dataController.torqueInfo)

module.exports = router;