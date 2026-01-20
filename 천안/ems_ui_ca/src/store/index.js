import { createStore } from 'vuex'

import userStore from '@/store/module/userStore.js'
import postStore from '@/store/module/postStore.js'
import mariadbModule from '@/store/module/analysis.js'
import selectSuji from '@/store/module/sujiSelect.js'
import selectSuji2 from '@/store/module/sujiSelect2.js'
import pumpPerform from '@/store/module/pumpPerform.js'
import peakControl from '@/store/module/peakControl.js'
import cost from '@/store/module/cost.js'
import songsu from '@/store/module/songsu.js'
import zoneUse from '@/store/module/zoneUse.js'
import facUse from '@/store/module/facUse.js'
import useTrand from '@/store/module/useTrand.js'
import dashboard from '@/store/module/dashboard'
import peak from '@/store/module/peak.js'
import setting from '@/store/module/setting.js'
import pumpOperation from '@/store/module/pumpOperation.js'
import costSetting from '@/store/module/costSetting.js'
import goalSetting from '@/store/module/goalSetting.js'
import report from '@/store/module/report.js'
import loginCheck from '@/store/module/loginCheck.js'

const store = createStore({
  modules: {
    // 키: 값 형태로 저장됩니다.
    userStore: userStore,
    postStore: postStore,
    mariadb: mariadbModule,
    sujiSelect: selectSuji,
    sujiSelect2: selectSuji2,
    pumpPerform: pumpPerform,
    peakControl: peakControl,
    cost: cost,
    songsu: songsu,
    zoneUse: zoneUse,
    facUse: facUse,
    useTrand: useTrand,
    dashboard: dashboard,
    peak: peak,
    setting: setting,
    pumpOperation: pumpOperation,
    costSetting: costSetting,
    goalSetting: goalSetting,
    report: report,
    loginCheck: loginCheck
  }
})

export default store
