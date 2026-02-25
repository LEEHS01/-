import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/components/dashboard/Dashboard'
import MtccAlgorithm from '@/components/mixingTank/MtccAlgorithm'
import PerformanceMonitoring from '@/components/PerformanceMonitoring/PerformanceMonitoring'
import AlarmManagement from '@/components/systemSettings/AlarmManagement'
import UserManagement from '@/components/systemSettings/UserManagement'
import LoginHistory from '@/components/systemSettings/LoginHistory'
import ConfigNetwork from '@/components/systemSettings/ConfigNetwork'
import AlarmHistory from '@/components/systemSettings/alarmHistory/AlarmHistory'
import CgAlgorithm from '@/components/coagulants/CgAlgorithm'
import CgSimulation from '@/components/coagulants/CgSimulation'
import SedimentationAlgorithm from '@/components/sedimentation/SedimentationAlgorithm'
import FilterAlgorithm from '@/components/filter/FilterAlgorithm'
import TrtIndCgAlgorithm from '@/components/trtIndCoagulants/TrtIndCgAlgorithm'
import TrtIndMtccAlgorithm from '@/components/trtIndMixingTank/TrtIndMtccAlgorithm'
import TrtIndSedimentationAlgorithm from '@/components/trtIndSedimentation/TrtIndSedimentationAlgorithm'
import IndCgAlgorithm from '@/components/indCoagulants/IndCgAlgorithm'
import IndMtccAlgorithm from '@/components/indMixingTank/IndMtccAlgorithm'
import IndSedimentationAlgorithm from '@/components/indSedimentation/IndSedimentationAlgorithm'
import TrdFilterAlgorithm from '@/components/trdFilter/TrdFilterAlgorithm'
import FstDisinfectionAlgorithm from '@/components/fstDisinfection/FstDisinfectionAlgorithm'
import SndDisinfectionAlgorithm from '@/components/sndDisinfection/SndDisinfectionAlgorithm'
import TrdDisinfectionAlgorithm from '@/components/trdDisinfection/TrdDisinfectionAlgorithm'
import FstReceivingAlgorithm from '@/components/fstReceiving/FstReceivingAlgorithm'
import SndReceivingAlgorithm from '@/components/sndReceiving/SndReceivingAlgorithm'
import TrdReceivingAlgorithm from '@/components/trdReceiving/TrdReceivingAlgorithm'
import PumpReceivingAlgorithm from '@/components/pumpReceiving/PumpReceivingAlgorithm'
import store from '@/store'
import drawer from '@/store/modules/drawer.js'
import AIOprHistoryRecord from '@/components/systemSettings/AIOprHistoryRecord'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/sedimentationAlgorithm', component: SedimentationAlgorithm, name: 'SedimentationAlgorithm' },
  { path: '/filterAlgorithm', component: FilterAlgorithm, name: 'FilterAlgorithm' },
  { path: '/cgAlgorithm', component: CgAlgorithm, name: 'CgAlgorithm' },
  { path: '/cgSimulation', component: CgSimulation, name: 'CgSimulation' },
  { path: '/mtccAlgorithm', component: MtccAlgorithm, name: 'MtccAlgorithm'},
  { path: '/performanceMonitoring', component: PerformanceMonitoring, name: 'PerformanceMonitoring' },
  { path: '/alarmManagement', component: AlarmManagement, name: 'AlarmManagement', meta: { requiresAuth: true } },
  { path: '/userManagement', component: UserManagement, name: 'UserManagement', meta: { requiresAuth: true }},
  { path: '/loginHistory', component: LoginHistory, name: 'LoginHistory', meta: { requiresAuth: true } },
  { path: '/alarmHistory', component: AlarmHistory, name: 'AlarmHistory' },
  { path: '/configNetwork', component: ConfigNetwork, name: 'ConfigNetwork', meta: { requiresAuth: true } },
  { path: '/trtIndCgAlgorithm', component: TrtIndCgAlgorithm, name: 'TrtIndCgAlgorithm' }, // 공업3차 약품
  { path: '/trtIndMtccAlgorithm', component: TrtIndMtccAlgorithm, name: 'TrtIndMtccAlgorithm' }, // 공업3차 혼화/응집
  { path: '/trtIndSedimentationAlgorithm', component: TrtIndSedimentationAlgorithm, name: 'TrtIndSedimentationAlgorithm' }, // 공업3차 침전
  { path: '/indCgAlgorithm', component: IndCgAlgorithm, name: 'IndCgAlgorithm' }, // 공업1차 약품
  { path: '/indMtccAlgorithm', component: IndMtccAlgorithm, name: 'IndMtccAlgorithm' }, // 공업1차 혼화/응집
  { path: '/indSedimentationAlgorithm', component: IndSedimentationAlgorithm, name: 'IndSedimentationAlgorithm' }, // 공업1차 침전
  { path: '/trdFilterAlgorithm', component: TrdFilterAlgorithm, name: 'TrdFilterAlgorithm' }, // 3차 여과
  { path: '/fstReceivingAlgorithm', component: FstReceivingAlgorithm, name: 'FstReceivingAlgorithm' }, // 2단계공업 착수
  { path: '/sndReceivingAlgorithm', component: SndReceivingAlgorithm, name: 'SndReceivingAlgorithm' }, // 2단계공업 착수
  { path: '/trdReceivingAlgorithm', component: TrdReceivingAlgorithm, name: 'TrdReceivingAlgorithm' }, // 2단계공업 착수
  { path: '/pumpReceivingAlgorithm', component: PumpReceivingAlgorithm, name: 'PumpReceivingAlgorithm' }, // 펌프제어 착수
  { path: '/preFstDisinfectionAlgorithm', component: FstDisinfectionAlgorithm, name: 'PreFstDisinfectionAlgorithm' }, // 2단계공업 전차염
  { path: '/preSndDisinfectionAlgorithm', component: SndDisinfectionAlgorithm, name: 'PreSndDisinfectionAlgorithm' }, // 2단계생활 전차염
  { path: '/preTrdDisinfectionAlgorithm', component: TrdDisinfectionAlgorithm, name: 'PreTrdDisinfectionAlgorithm' }, // 3단계 전차염
  { path: '/periSndDisinfectionAlgorithm', component: SndDisinfectionAlgorithm, name: 'PeriSndDisinfectionAlgorithm' }, // 2단계생활 중차염
  { path: '/periTrdDisinfectionAlgorithm', component: TrdDisinfectionAlgorithm, name: 'PeriTrdDisinfectionAlgorithm' }, // 3단계 중차염
  { path: '/postSndDisinfectionAlgorithm', component: SndDisinfectionAlgorithm, name: 'PostSndDisinfectionAlgorithm' }, // 2단계생활 후차염
  { path: '/postTrdDisinfectionAlgorithm', component: TrdDisinfectionAlgorithm, name: 'PostTrdDisinfectionAlgorithm' }, // 3단계 후차염
  { path: '/aiOprHistoryRecord', component: AIOprHistoryRecord, name: 'AIOprHistoryRecord' }, //  AI 운영 이력
  // { path: '/fstDisinfectionAlgorithm', component: FstDisinfectionAlgorithm, name: 'FstDisinfectionAlgorithm' }, // 2단계공업
  // { path: '/sndDisinfectionAlgorithm', component: SndDisinfectionAlgorithm, name: 'SndDisinfectionAlgorithm' }, // 2단계생활
  // { path: '/trdDisinfectionAlgorithm', component: TrdDisinfectionAlgorithm, name: 'TrdDisinfectionAlgorithm' }, // 3단계

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  console.log(from, to)

  // 상단 네비게이션 선택시 좌측 메뉴가 선택된 상태로 Open
  for (let i = 0; i < drawer.state.drawer.items.length; i++) {
    let item = drawer.state.drawer.items[i]
    if (item.children) {
      for(let j = 0; j < item.children.length; j++) {
        let childrenItem = item.children[j]
        if (childrenItem.route === to.path) {
          item.active = true
          childrenItem.active = true
        }
      }
    }
  }

  if (to.name === 'Dashboard') {
    store.state.backgroundIndex = 1
    store.state.drawer.selectedMainMenuIndex = 0
    store.state.selectedBuildingIndex = 0
  } else if (to.name === 'AlarmHistory' || to.name === 'PerformanceMonitoring' || to.name === 'AlarmManagement'  || to.name === 'UserManagement'  || to.name === 'LoginHistory' || to.name === 'ConfigNetwork' || to.name === 'AIOprHistoryRecord') {
    store.state.backgroundIndex = 2
    store.state.drawer.selectedMainMenuIndex = 5
  } else {
    store.state.backgroundIndex = 2
    store.state.drawer.selectedMainMenuIndex = 2
  }

   //주소 이동시, index를 별도 명시해야 하는 경우 (컴포넌트 공유시)
  if (to.name ==='PreSndDisinfectionAlgorithm' || to.name === 'PreTrdDisinfectionAlgorithm') {
    store.state.sndDisinfection.disinfectionStep = 1
    store.state.trdDisinfection.disinfectionStep = 1
    store.state.sndDisinfection.title = '전차염'
    store.state.trdDisinfection.title = '전차염'
  } else if (to.name === 'PeriSndDisinfectionAlgorithm' || to.name === 'PeriTrdDisinfectionAlgorithm') {
    store.state.sndDisinfection.disinfectionStep = 2
    store.state.trdDisinfection.disinfectionStep = 2
    store.state.sndDisinfection.title = '중차염'
    store.state.trdDisinfection.title = '중차염'
  } else if (to.name ==='PostSndDisinfectionAlgorithm' || to.name === 'PostTrdDisinfectionAlgorithm') {
    store.state.sndDisinfection.disinfectionStep = 3
    store.state.trdDisinfection.disinfectionStep = 3
    store.state.sndDisinfection.title = '후차염'
    store.state.trdDisinfection.title = '후차염'
  }


  if (to.name !== from.name) {
    let router = routes.filter((it) => it.name === to.name)
    // 경로가 router 에 존재하는 경우
    if (router.length > 0) {
      // 권한이 필요한 페이지 체크
      if (to.matched.some(record => record.meta.requiresAuth)) {
        // 로그인이 안됐을 경우 / 로 이동
        if (store.state.login.user.usr_id === null) {
          next('/')
        }
      }
      next()
    // 경로가 router에 존재하지 않는 경우 / 로 이동
    } else {
      next('/')
    }
  }
})
export default router
