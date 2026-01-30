const express = require('express');
const router = express.Router();
const dataController = require('../controllers/costController');

router.post('/selectRateInfo', dataController.getRateInfo);
router.post('/selectRtRate', dataController.getMonthRateData)

module.exports = router;