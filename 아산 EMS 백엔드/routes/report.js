const express = require('express');
const router = express.Router();
const dataController = require('../controllers/reportController');

// 라우트 처리
router.post('/selectReport', dataController.getSelectReport);
router.post('/selectPerformList', dataController.getSelectPerformList); // selectpmpPerformList

module.exports = router;