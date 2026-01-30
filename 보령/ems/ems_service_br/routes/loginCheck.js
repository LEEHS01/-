const express = require('express');
const router = express.Router();
const dataController = require('../controllers/loginCheckController');

// 라우트 처리
router.get('/loginCheck', dataController.getLoginCheck);  // selectSuji1

module.exports = router;