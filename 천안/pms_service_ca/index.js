const logger = require('./logger').logger;
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3010

const bodyParser = require('body-parser')
require('dotenv').config()

const Main = require('./routes/DashBoard/Main.js')
const Statistics = require('./routes/Monitor/Statistics.js')
const Diagnosis = require('./routes/Monitor/Diagnosis.js')
const WaterControl = require('./routes/Monitor/WaterControl.js')
const PacTube = require('./routes/Monitor/PacTube.js')
const PachcsTube = require('./routes/Monitor/PachcsTube.js')
const AutoWater = require('./routes/Monitor/AutoWater.js')
const RapidAgitator = require('./routes/Monitor/RapidAgitator.js')
const Agglomerate = require('./routes/Monitor/Agglomerate.js')
const SludgeCollector = require('./routes/Monitor/SludgeCollector.js')
const FilterBackWash = require('./routes/Monitor/FilterBackWash.js')
const BackWashBlower = require('./routes/Monitor/BackWashBlower.js')
const GacBackwash = require('./routes/Monitor/GacBackwash.js')
const MotifPump = require('./routes/Monitor/MotifPump.js')
const CoolingPump = require('./routes/Monitor/CoolingPump.js')
const Motor = require('./routes/Monitor/Motor.js')
const PumpBoard = require('./routes/Monitor/PumpBoard.js')
const Transformers = require('./routes/Monitor/Transformers.js')
const Vcb = require('./routes/Monitor/Vcb.js')

app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/v1/main', Main) // 대시보드(dashboard)
app.use('/api/v1/statistics', Statistics) // 통계(statistics)
app.use('/api/v1/diagnosis', Diagnosis) // 정밀진단(diagnosis)
app.use('/api/v1/waterControl', WaterControl) // 착수 > 유입밸브(monitor3)
app.use('/api/v1/pacTube', PacTube) // 약품 > 약품펌프(monitor4)
app.use('/api/v1/pahcsTube', PachcsTube)  // 약품 > 튜브펌프(monitor5), 기존 소스 메뉴는 비활성화 상태
app.use('/api/v1/autoWater', AutoWater)  // 약품 > 자동급수펌프(monitor6)
app.use('/api/v1/rapidAgitator', RapidAgitator)  // 혼화/응집 > 급속분사교반기(monitor7)
app.use('/api/v1/agglomerate', Agglomerate)  // 혼화/응집 > 응집기(monitor8)
app.use('/api/v1/sludge', SludgeCollector)  // 침전 > 슬라지수집기(monitor9)
app.use('/api/v1/filterBackWash', FilterBackWash)  // 여과 > 역세펌프(monitor10)
app.use('/api/v1/backWashBlower', BackWashBlower)  // 여과 > 역세송풍기(monitor11)
app.use('/api/v1/gacBackwash', GacBackwash)  // GAC > 역세펌프(monitor12)
// app.use('/api/v1/', )  // 오존 > 오존발생기(monitor15)
app.use('/api/v1/motifPump', MotifPump)  // 오존 > 모티브펌프(monitor13)
app.use('/api/v1/coolingPump', CoolingPump)  // 오존 > 냉각수펌프(monitor14)
// app.use('/api/v1/', )  // 소독 > 차염발생기(monitor16)
app.use('/api/v1/motor', Motor)  // 송수 > 송수펌프모니터(monitor1)
app.use('/api/v1/pumpBoard', PumpBoard)  // 송수 > 펌프기동반(monitor2)
app.use('/api/v1/transformers', Transformers)  // 송수 > 변압기반(monitor17)
app.use('/api/v1/vcb', Vcb)  // 송수 > VCB반(monitor18)
// app.use('/api/v1/', )  // 통계/이력(monitor19)

app.listen(port, () => {
  logger.info('Express server is running on port ' + port);
})