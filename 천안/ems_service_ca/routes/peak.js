const express = require('express');
const router = express.Router();
const dataController = require('../controllers/peakController');

//라우트 처리
router.post('/peakSelectData', dataController.getPeakSelectData)  // peakSelect
router.post('/peakGoal', dataController.getPeakGoal)  // selectPeakGoal
router.post('/updatePeakGoal', dataController.getUpdatePeakGoal)  // insertPeakGoal
router.post('/peakFac', dataController.getPeakFac)
router.post('/nowPeak', dataController.getNowPeak)
// router.post('/alarmCheck', dataController.getAlarmCheck) //alarmCheck
// router.post('/alarmUpdate', dataController.getAlarmUpdate) //alarmUpdate
// router.post('/siteAlarmCheck', dataController.getSiteAlarmCheck) //siteAlarmCheck
// router.post('/siteAlarmUpdate', dataController.getSiteAlarmUpdate) //alarmUpdate
router.post('/costPeak', dataController.getCostPeak)

module.exports = router