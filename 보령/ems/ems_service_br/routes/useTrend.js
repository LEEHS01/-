const express = require('express');
const router = express.Router();
const dataController = require('../controllers/useTrendController');

// 라우트 처리
router.post('/selectUseTrandList', dataController.getSelectUseTrendList);

module.exports = router;