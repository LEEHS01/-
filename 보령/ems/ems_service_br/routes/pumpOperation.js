const express = require('express');
const router = express.Router();
const dataController = require('../controllers/pumpOperationController');

// 라우트 처리
router.post('/selectCTR_PRF_PMPMST_INF', dataController.getSelectCTR);
router.post('/updateSetCTR_PRF_PMPMST_INF', dataController.getUpdateCTR);
router.post('/updateSetCTR_PRF_PMPMST_INF2', dataController.getUpdateCTR2);
router.post('/mergePTR_STRTG_INF', dataController.getMergePTR);
router.post('/mergeOPER_INF', dataController.getMergeOPER);
router.post('/selectRT_RATE_INF', dataController.getSelectRT);

module.exports = router;