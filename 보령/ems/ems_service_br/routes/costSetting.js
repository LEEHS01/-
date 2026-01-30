const express = require('express');
const router = express.Router();
const dataController = require('../controllers/costSettingController');

// 라우트 처리
router.post('/selectRtInfo', dataController.getSelectRtInfo);
router.post('/selectRT_RATE_INF_COST', dataController.getSelectRT);
router.post('/updateRT_RATE_INF', dataController.getUpdateRT);

module.exports = router;