const express = require('express');
const router = express.Router();
const dataController = require('../controllers/songsuController');

// 라우트 처리
router.post('/getPopup', dataController.getGetPopup);
router.post('/insertPopup', dataController.getInsertPopup);
router.post('/initPopup', dataController.getInitPopup)
router.post('/insertPopup2', dataController.getInsertPopup2);
router.post('/insertPopupAuto2', dataController.getInsertPopupAuto2);
router.post('/insertPopup3', dataController.getInsertPopup3);
router.post('/updateCTR_PRF_PMPMST_INF', dataController.getUpdateCTR_PRF_PMPMST_INF);
router.post('/PTR_CTR_INF', dataController.getPTR_CTR_INF);
router.post('/songsuSelect', dataController.getSongsuSelect);
router.post('/pumpSelect', dataController.getPumpSelect);
router.post('/insertAIonOff', dataController.getInsertAIonOff);
router.post('/interpuppt', dataController.getInterpuppt);
router.post('/insertAIpopupAlarm', dataController.getInsertAIpopupAlarm);

module.exports = router;