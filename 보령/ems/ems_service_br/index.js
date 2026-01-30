const logger = require('./logger').logger;
const express = require('express');
const cors = require('cors');
const app = express();

const apiRoutes = require('./routes/analysis');
const sujiRoutes = require('./routes/sujiSelect');
const suji2Routes = require('./routes/sujiSelect2');
const pumpPerform = require('./routes/pumpPerform');
const songsu = require('./routes/songsu');
const costRoutes = require('./routes/cost');
const reductionRoutes = require('./routes/reduction');
const zoneUse = require('./routes/zoneUse');
const facUse = require('./routes/facUse');
const useTrend = require('./routes/useTrend');
const peakCtrl = require('./routes/peakcontrol')
const dashboard = require('./routes/dashboard')
const peak = require('./routes/peak')
const setting = require('./routes/setting')
const pumpOperation = require('./routes/pumpOperation')
const costSetting = require('./routes/costSetting')
const goalSetting = require('./routes/goalSetting')
const report = require('./routes/report')
const loginCheck = require('./routes/loginCheck')

app.use(cors());
app.use(express.json());

// 라우팅 등록
app.use('/api', apiRoutes)
app.use('/api', sujiRoutes)
app.use('/api', suji2Routes)
app.use('/api', pumpPerform)
app.use('/api', costRoutes)
app.use('/api', songsu)
app.use('/api', reductionRoutes)
app.use('/api', zoneUse)
app.use('/api', facUse)
app.use('/api', useTrend)
app.use('/api', peakCtrl)
app.use('/api', dashboard)
app.use('/api', peak)
app.use('/api', setting)
app.use('/api', pumpOperation)
app.use('/api', costSetting)
app.use('/api', goalSetting)
app.use('/api', report)
app.use('/api', loginCheck)

// ip 지정
app.listen(3000, () => {
	logger.info('Express server is running on port 3000');
});

