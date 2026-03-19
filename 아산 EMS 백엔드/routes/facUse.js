const express = require('express');
const router = express.Router();
const dataController = require('../controllers/facUseController');

// 라우트 처리
router.post('/selectZone', dataController.getSelectZone);
router.post('/selectFac', dataController.getSelectFac);
router.post('/selectfacUseList', dataController.getSelectFacUseList);
router.post('/selectFacSunsi', dataController.getSelectFacSunsi);

module.exports = router;