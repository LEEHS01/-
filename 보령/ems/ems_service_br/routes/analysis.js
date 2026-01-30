const express = require('express');
const router = express.Router();
const dataController = require('../controllers/analysisController');

// 라우트 처리
router.post('/analysis', dataController.getChart);
router.post('/analyPrediction', dataController.getPrediction);
router.post('/analyPump', dataController.getPumpData);
router.post('/selectValve', dataController.getValveData);

module.exports = router;