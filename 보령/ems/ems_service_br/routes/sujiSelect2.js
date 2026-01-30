const express = require('express');
const router = express.Router();
const dataController = require('../controllers/sujiSelect2Controller');

// 라우트 처리
router.post('/combo', dataController.getCombo); // sujiCombo
router.post('/basuji', dataController.getBasuji) // baeSuji

module.exports = router;