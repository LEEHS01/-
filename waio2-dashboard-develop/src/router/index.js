import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/components/dashboard/Dashboard'
import MtccAlgorithm from '@/components/mixingTank/MtccAlgorithm'
import PerformanceMonitoring from '@/components/PerformanceMonitoring/PerformanceMonitoring'
import AlarmManagement from '@/components/systemSettings/AlarmManagement'
import UserManagement from '@/components/systemSettings/UserManagement'
import LoginHistory from '@/components/systemSettings/LoginHistory'
// import ConfigNetwork from '@/components/systemSettings/ConfigNetwork'
import AlarmHistory from '@/components/systemSettings/alarmHistory/AlarmHistory'
import DisinfectionAlgorithm from '@/components/disinfection/DisinfectionAlgorithm'
import IndDisinfectionAlgorithm from '@/components/indDisinfection/IndDisinfectionAlgorithm'
import IndCgAlgorithm from '@/components/indCoagulants/IndCgAlgorithm'
import IndCgSimulation from '@/components/indCoagulants/IndCgSimulation'
import ReceivingAlgorithm from '@/components/receiving/ReceivingAlgorithm' 
import IndReceivingAlgorithm from '@/components/indReceiving/IndReceivingAlgorithm'
import SedimentationAlgorithm from '@/components/sedimentation/SedimentationAlgorithm'
import FilterAlgorithm from '@/components/filter/FilterAlgorithm'
import IndFilterAlgorithm from '@/components/indFilter/IndFilterAlgorithm'
import GACAlgorithm from '@/components/gac/GACAlgorithm'
import SecondCgAlgorithm from '@/components/secondCoagulants/SecondCgAlgorithm'
import IndMtccAlgorithm from '@/components/indMixingTank/IndMtccAlgorithm'
import IndSedimentationAlgorithm from '@/components/indSedimentation/IndSedimentationAlgorithm'
import SndDisinfectionAlgorithm from '@/components/disinfection/SndDisinfectionAlgorithm'
import FstDisinfectionAlgorithm from '@/components/disinfection/FstDisinfectionAlgorithm'
import TrtIndReceivingAlgorithm from '@/components/trtIndReceiving/TrtIndReceivingAlgorithm'
import store from '@/store'
import drawer from '@/store/modules/drawer.js'
import AIOprHistoryRecord from '@/components/systemSettings/AIOprHistoryRecord'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/indReceivingAlgorithm', component: IndReceivingAlgorithm, name: 'IndReceivingAlgorithm' },              // 공업 1단계 착수
  { path: '/indCgAlgorithm', component: IndCgAlgorithm, name: 'IndCgAlgorithm' },                                   // 공업 1단계 약품
  { path: '/indMtccAlgorithm', component: IndMtccAlgorithm, name: 'IndMtccAlgorithm' },                             // 공업 1단계 혼화응집
  { path: '/indSedimentationAlgorithm', component: IndSedimentationAlgorithm, name: 'IndSedimentationAlgorithm' },  // 공업 1단계 침전
  { path: '/indFilterAlgorithm', component: IndFilterAlgorithm, name: 'IndFilterAlgorithm'},                        // 공업 1단계 여과
  { path: '/indDisinfectionAlgorithm', component: IndDisinfectionAlgorithm, name: 'IndDisinfectionAlgorithm' },     // 공업 1단계 소독 (전차염)
  { path: '/receivingAlgorithm', component: ReceivingAlgorithm, name: 'ReceivingAlgorithm' },                       // 생활 2단계 착수
  { path: '/secondCgAlgorithm', component: SecondCgAlgorithm, name: 'secondCgAlgorithm' },                          // 생활 2단계 약품
  { path: '/mtccAlgorithm', component: MtccAlgorithm, name: 'MtccAlgorithm'},                                       // 생활 2단계 혼화응집
  { path: '/sedimentationAlgorithm', component: SedimentationAlgorithm, name: 'SedimentationAlgorithm' },           // 생활 2단계 침전
  { path: '/filterAlgorithm', component: FilterAlgorithm, name: 'FilterAlgorithm' },                                // 생활 2단계 여과
  { path: '/fstDisinfectionAlgorithm', component: FstDisinfectionAlgorithm, name: 'FstDisinfectionAlgorithm' },     // 생활 2단계 소독 (중차염)
  { path: '/sndDisinfectionAlgorithm', component: SndDisinfectionAlgorithm, name: 'SndDisinfectionAlgorithm' },     // 생활 2단계 소독 (중차염)
  { path: '/disinfectionAlgorithm', component: DisinfectionAlgorithm, name: 'DisinfectionAlgorithm' },              // 생활 2단계 소독 (후차염)
  { path: '/gacAlgorithm', component: GACAlgorithm, name: 'GACAlgorithm' },
  { path: '/indCgSimulation', component: IndCgSimulation, name: 'IndCgSimulation' },
  { path: '/performanceMonitoring', component: PerformanceMonitoring, name: 'PerformanceMonitoring' },
  { path: '/alarmManagement', component: AlarmManagement, name: 'AlarmManagement', meta: { requiresAuth: true } },
  { path: '/userManagement', component: UserManagement, name: 'UserManagement', meta: { requiresAuth: true }},
  { path: '/loginHistory', component: LoginHistory, name: 'LoginHistory', meta: { requiresAuth: true } },
  { path: '/alarmHistory', component: AlarmHistory, name: 'AlarmHistory' },
  // { path: '/configNetwork', component: ConfigNetwork, name: 'ConfigNetwork', meta: { requiresAuth: true } },
  { path: '/trtIndReceivingAlgorithm', component: TrtIndReceivingAlgorithm, name: 'TrtIndReceivingAlgorithm' },
  { path: '/aiOprHistoryRecord', component: AIOprHistoryRecord, name: 'AIOprHistoryRecord' }, //  AI 운영 이력
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
