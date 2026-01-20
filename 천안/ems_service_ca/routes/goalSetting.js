const express = require('express');
const router = express.Router();
const dataController = require('../controllers/goalSettingController');

// 라우트 처리
router.post('/selectGetSetting', dataController.getSelectGetSetting);
router.post('/updateGoal', dataController.getUpdateGoal);

module.exports = router;