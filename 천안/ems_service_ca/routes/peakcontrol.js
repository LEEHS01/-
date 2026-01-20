const express = require('express');
const router = express.Router();
const dataController = require('../controllers/peakCtrlController');

//라우트 처리
router.post('/selectPeakControl', dataController.getData)
router.post('/selectPump', dataController.getPump)
router.post('/selectPeakGoal', dataController.getPeakGoal)
router.post('/peakSelect', dataController.getPeakData)

module.exports = router