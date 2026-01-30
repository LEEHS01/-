const express = require('express');
const router = express.Router();
const dataController = require('../controllers/reductionController');

router.post('/getUsageData', dataController.getUsageData)

module.exports = router;