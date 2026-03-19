const express = require('express');
const router = express.Router();
const dataController = require('../controllers/sujiSelectController');

// 라우트 처리
router.post('/select1', dataController.getSelect);  // selectSuji1

module.exports = router;