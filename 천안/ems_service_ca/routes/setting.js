const express = require('express');
const router = express.Router();
const dataController = require('../controllers/settingController');

//라우트 처리
router.post('/TagSelectZone', dataController.getZone)
router.post('/selectTag', dataController.getSelectTag)
router.post('/updateTagInfo', dataController.updateTagInfo)

module.exports = router