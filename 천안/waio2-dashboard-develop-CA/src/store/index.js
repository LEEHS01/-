import Vue from 'vue'
import Vuex from 'vuex'
import HighchartsVue from 'highcharts-vue'
import vueMoment from 'vue-moment'
import moment from 'moment-timezone'
import login from '@/store/modules/login'
import rules from '@/store/modules/rules'
import alertDialog from '@/store/modules/alertDialog'
import loginHistory from '@/store/modules/loginHistory'

import addUserDialog from '@/store/modules/user/addUserDialog'
import modifyUserDialog from '@/store/modules/user/modifyUserDialog'
import modifyPasswordDialog from '@/store/modules/user/modifyPasswordDialog'
import deleteUserDialog from '@/store/modules/user/deleteUserDialog'
import loginDialog from '@/store/modules/user/loginDialog'
import user from '@/store/modules/user/user'

import alarm from '@/store/modules/alarm/alarm'
import modifyAlarmDialog from '@/store/modules/alarm/modifyAlarmDialog'

import drawer from '@/store/modules/drawer'
import performance from '@/store/modules/performance'
import network from '@/store/modules/network'

import disinfection from '@/store/modules/disinfection/index'
import filter from '@/store/modules/filter/index'
import clear from '@/store/modules/clear/index'
import mixing from '@/store/modules/mixing/index'
import sedimentation from '@/store/modules/sedimentation'
import raw from '@/store/modules/raw'
import coagulants from '@/store/modules/coagulants'
import ems from '@/store/modules/ems'
import pms from '@/store/modules/pms'
import indMixing from '@/store/modules/indMixing/index'
import trtIndMixing from '@/store/modules/trtIndMixing/index'
import indCoagulants from '@/store/modules/indCoagulants'
import trtIndCoagulants from '@/store/modules/trtIndCoagulants'
import indSedimentation from '@/store/modules/indSedimentation'
import trtIndSedimentation from '@/store/modules/trtIndSedimentation'
import trdFilter from '@/store/modules/trdFilter'
import fstDisinfection from '@/store/modules/fstDisinfection/index'
import sndDisinfection from '@/store/modules/sndDisinfection/index'
import trdDisinfection from '@/store/modules/trdDisinfection/index'
import fstReceiving from '@/store/modules/fstReceiving/index'
import sndReceiving from '@/store/modules/sndReceiving/index'
import trdReceiving from '@/store/modules/trdReceiving/index'
import pumpReceiving from '@/store/modules/pumpReceiving/index'
import fstClear from '@/store/modules/fstClear/index'
import sndClear from '@/store/modules/sndClear/index'
import trdClear from '@/store/modules/trdClear/index'
import dialog from '@/store/modules/dialog'

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

import common from '@/store/common'
import aioprhistory from '@/store/modules/aioprhistory'

Vue.use(VueVideoPlayer)

Vue.use(vueMoment, {
  moment
})
Vue.use(Vuex)
Vue.use(common)
Vue.use(HighchartsVue)

export const API_SERVER = '/api'
export const JSON_SERVER = '/json'
export const DEV_SERVER = '/api_xai' //로컬 테스트
// export const DEV_SERVER = '' //정수장 배포

export const LATEST_DASHBOARD_ID = 'dashboard/latest'
export const DASHBOARD = 'dashboard'
export const GET_DASHBOARD = 'getDashboard'
export const POST_DASHBOARD = 'postDashboard'
export const PUT_DASHBOARD = 'putDashboard'
export const DEL_DASHBOARD = 'delDashboard'

export const DASHBOARDS = 'dashboards'
export const POST_DASHBOARDS = 'postDashboards'
export const PUT_DASHBOARDS = 'putDashboards'
export const DEL_DASHBOARDS = 'delDashboards'


export const LISTS = 'lists'
export const DEL_LISTS = 'delLists'
export const PUT_LISTS = 'putLists'
export const POST_LISTS = 'postLists'
export const CLEAR_LISTS = 'clearLists'
export const CLEAR_SHAPES = 'clearShapes'

export const PATHS = 'paths'
export const POST_PATHS = 'postPaths'
export const PUT_PATHS = 'putPaths'
export const DEL_PATHS = 'delPaths'

export const SET_OVERLAY = 'SET_OVERLAY'
export const SERVICE_URL = {
  XAI: 'http://10.65.1.83:38080',
  EMS: 'http://10.65.1.83:38085',
  PMS: 'http://10.65.1.83:38095',
  // CCTV: 'http://10.231.21.230:20102/index'
}
export const COLOR_HIGH = 'rgba(212, 110, 250, 0.4)'
export const COLOR_MID = 'rgba(126, 110, 250, 0.4)'
export const PLOT_BANDS_SPRING = [{
  color: COLOR_MID,
  from: 9,
  to: 10,
  status: 'mid'
},{
  color: COLOR_MID,
  from: 12,
  to: 13,
  status: 'mid'
},{
  color: COLOR_MID,
  from: 17,
  to: 23,
  status: 'mid'
},{
  color: COLOR_HIGH,
  from: 10,
  to: 12,
  status: 'high'
},{
  color: COLOR_HIGH,
  from: 13,
  to: 17,
  status: 'high'
}]
export const PLOT_BANDS_SUMMER = [{
  color: COLOR_MID,
  from: 9,
  to: 10,
  status: 'mid'
},{
  color: COLOR_MID,
  from: 12,
  to: 13,
  status: 'mid'
},{
  color: COLOR_MID,
  from: 17,
  to: 23,
  status: 'mid'
},{
  color: COLOR_HIGH,
  from: 10,
  to: 12,
  status: 'high'
},{
  color: COLOR_HIGH,
  from: 13,
  to: 17,
  status: 'high'
}]
export const PLOT_BANDS_WINTER = [{
  color: COLOR_MID,
  from: 9,
  to: 10,
  status: 'mid'
},{
  color: COLOR_MID,
  from: 12,
  to: 17,
  status: 'mid'
},{
  color: COLOR_MID,
  from: 20,
  to: 22,
  status: 'mid'
},{
  color: COLOR_HIGH,
  from: 10,
  to: 12,
  status: 'high'
},{
  color: COLOR_HIGH,
  from: 17,
  to: 20,
  status: 'high'
},{
  color: COLOR_HIGH,
  from: 22,
  to: 23,
  status: 'high'
}]
export const SPRING = 0
export const SUMMER = 1
export const WINTER = 2
const store = new Vuex.Store({
  modules: {
    login,
    rules,
    user,
    modifyPasswordDialog,
    modifyUserDialog,
    addUserDialog,
    alertDialog,
    deleteUserDialog,
    loginDialog,
    loginHistory,
    alarm,
    modifyAlarmDialog,
    drawer,
    performance,
    network,
    disinfection,
    sedimentation,
    filter,
    clear,
    mixing,
    raw,
    coagulants,
    dialog,
    ems,
    pms,
    indMixing,
    trtIndMixing,
    indCoagulants,
    trtIndCoagulants,
    indSedimentation,
    trtIndSedimentation,
    trdFilter,
    fstDisinfection,
    sndDisinfection,
    trdDisinfection,
    fstReceiving,
    sndReceiving,
    trdReceiving,
    fstClear,
    sndClear,
    trdClear,
    pumpReceiving,
    aioprhistory
  },
  state: {
    currentDashboardTitle: '스마트 정수장 AI 플랫폼 (천안)', // 타이틀
    showConfirmDialog: false, // 확인 Dialog
    // App.vue router main css
    css: {
      content: {
        paddingLeft: '0px'
      }
    },
    overlay: false, // API 요청시 OverLay Loading Image
    backgroundIndex: 1, // 배경 상태 셀렉터

    selectedBuildingIndex: 0, // 현재 선택되어 있는 공정(default. 착수)
    isSelectedMainMenuIndex7AiOn: true, // Dashboard.vue 탈수기동 AI모드
    isSelectedMainMenuIndex9AiOn: true, // Dashboard.vue 농축조 AI모드
  },
  getters: {
    /**
     * 상태에 따라 배경화면 선택
     * @param state 상태
     * @returns 
     */
    backgroundImage: function (state) {
      if (state.backgroundIndex === 1) {
        return 'common'
      } else {
        return 'disinfection'
      }
    },
  },
  mutations: {
    [SET_OVERLAY]: function (state, data) {
      state.overlay = data
    }
  },
  actions: {
  }
})


export default store