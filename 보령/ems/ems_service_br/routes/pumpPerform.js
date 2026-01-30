const express = require('express');
const router = express.Router();
const dataController = require('../controllers/pumpPerformController.js');

// 라우트 처리
router.post('/pumpSearch', dataController.getSearch);

module.exports = router;