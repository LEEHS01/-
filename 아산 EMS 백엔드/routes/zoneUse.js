const express = require('express');
const router = express.Router();
const dataController = require('../controllers/zoneUseController');

// 라우트 처리
router.post('/sisul_sunsi', dataController.getSisul_sunsi);
router.post('/sunsiChart', dataController.getSunsiChart);
router.post('/selectZoneUseList', dataController.getSelectZoneUseList);

module.exports = router;