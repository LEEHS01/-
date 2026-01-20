const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dashboardController');

router.post('/alarmCheck', dataController.getAlarmCheck) //alarmCheck
router.post('/alarmUpdate', dataController.getAlarmUpdate) //alarmUpdate
router.post('/siteAlarmCheck', dataController.getSiteAlarmCheck) //siteAlarmCheck
router.post('/siteAlarmUpdate', dataController.getSiteAlarmUpdate) //alarmUpdate
router.post('/selectNowElec', dataController.getNowElec);
router.post('/getTop3', dataController.getTop3)
router.post('/selectZoneUseList_sum_dashboard', dataController.selectZoneUseList_sum_dashboard)

module.exports = router;