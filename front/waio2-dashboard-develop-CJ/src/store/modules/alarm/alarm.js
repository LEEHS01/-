import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

const GET_ALL_ALARM_SETTING = 'GET_ALL_ALARM_SETTING'
const PUT_ALARM = 'PUT_ALARM'
const PUT_ALARMS_SEARCH = 'PUT_ALARMS_SEARCH'
const PUT_ALARMS_DETAIL = 'PUT_ALARMS_DETAIL'
const ALARMS = 'alarms'
const SETTING = 'setting'
const SEARCH = 'search'
const DETAIL = 'detail'
export const URL = {
  ALRAM_NOTIFY: 'alarm/notify',
  ALARM_INFO: 'alarm/info',
  ALARM_CONTROL: 'alarm/control',
  ALARM_CONTROL_HISTORY: 'alarm/controlHistory',
  ALARM_DETAIL : 'alarm/detail'
}
export const GET_ALARM_NOTIFY = URL.ALRAM_NOTIFY + '/get'
export const GET_ALARM_INFO = URL.ALARM_INFO + '/get'
export const PUT_ALARM_CONTROL = URL.ALARM_CONTROL + '/put'
export const PUT_ALARM_CONTROL_HISTORY = URL.ALARM_CONTROL_HISTORY + '/put'
export const DEL_NOTIFY = 'alarm/DEL_NOTIFY'
const GET_NOTIFY = GET_ALARM_NOTIFY.substr(GET_ALARM_NOTIFY.indexOf('/') + 1)
const GET_INFO = GET_ALARM_INFO.substr(GET_ALARM_INFO.indexOf('/') + 1)
const PUT_CONTROL = PUT_ALARM_CONTROL.substr(PUT_ALARM_CONTROL.indexOf('/') + 1)
const PUT_CONTROL_HISTORY = PUT_ALARM_CONTROL_HISTORY.substr(PUT_ALARM_CONTROL_HISTORY.indexOf('/') + 1)
const OPEN_POPUP = 'OPEN_POPUP'
export const CLOSE_POPUP = 'CLOSE_POPUP'
export default {
  namespaced: true,
  state: {
    visible: false,
    selectedIndex: 0,
    selectedClassification: 'total',
    alarmInfo: [],
    alarmInfoV2: [],
    alarms: [], // 알람이력
    alarms7Days: [],
    startTime: null,
    endTime: null,
    formattedStartTime: null,
    formmatedEndTime: null,
    alarm: [], // notify push 알림
    critical: 4, // 임계치
    semiAuto: 2,  // 반자동
    alarmIgnore: [],
    alarmsDetail: {
      ctrHisList: [],
      factorMap: {},
      procCd: ""
    },
    selectedProcessTitle: null
  },
  mutations: {
    [GET_ALL_ALARM_SETTING]: function (state, data) {
      state.alarmInfo = data.alarm_info
    },
    [PUT_ALARM]: function (state, data) {
      let find = state.alarmInfo.find((element) => element.seq === data.seq)
      find.dp_nm = data.dp_nm
      find.cmp_val = data.cmp_val
      find.scd_snd = data.scd_snd
    },
    [PUT_ALARMS_DETAIL]: function (state, data) {
      state.alarmsDetail = data.alarmsDetail
    },
    [PUT_ALARMS_SEARCH]: function (state, data) {
      if(data.alarms !== undefined) {
        state.alarms = []
        state.alarms7Days = []
        if (data.isInit) {
          state.alarms7Days = data.alarms
        }
        state.alarms = data.alarms
      } else {
        state.alarms = []
        state.alarms7Days = []
      }
    },
    [GET_NOTIFY]: function (state, data) {
      if(data !== undefined){
        // 알림 수신시 알람에 310초를 더함(10초를 밑에서 뺴면 5분임)
        data.map((it) => {
          it.timeLeft = 310
          it.isVisible = true
        })
        if (state.alarm.length === 0) {
          state.alarm = data
        } else {
          // 수신된 알림이 저장된 알림 리스트에 있는지 확인하여 없는 값들만 추가함
          for(let j=0; j<data.length; j++) {
            let _data = data[j]
            let isDuplication = false
            for(let i=0; i< state.alarm.length; i++) {
              let _alarm = state.alarm[i]
              if (_alarm.seq === _data.seq) {
                isDuplication = true
                break
              }
            }
            if (!isDuplication) {
              state.alarm.push(_data)
            }
          }
        }
      }
        state.alarmIgnore = []
        // 1분이 지난 알림은 리스트에서 제거
        // state.alarm = state.alarm.filter((it) => {
        //   it.timeLeft -= 10
        //   if(it.timeLeft == 0) {
        //     state.alarmIgnore.push(it)
        //   }
        //   return it.timeLeft > 0
        // })
      // 1분이 지난 알림은 isVisible을 false로 변환 && 무반응 알림 리스트에 추가
      // 5분이 지난 알림은 리스트에서 제거.
        let tempAlmArray = [];
        state.alarm.forEach((it) => {
          it.timeLeft -= 10
          if(it.timeLeft == 240){
            if(it.isVisible){ //1분이 지날때까지 처리되지 않은 제어 알람 - noActionAlarmList 추가
              if(it.alm_ty == 2 || it.alm_ty == 4){
                state.alarmIgnore.push(it)
              }
            }
            //1분이 지난 모든 알람은 팝업 숨김 처리
            it.isVisible = false;
          }
          //5분이 지난 알람은 리스트에서 제외
          if(it.timeLeft > 0) {
            tempAlmArray.push(it)
          }
        })
        state.alarm = tempAlmArray;
    },
    'DEL_NOTIFY': function (state, data) {
      state.alarm.forEach((it) => {
        if(it.seq === data){
          it.isVisible = false;
        }
      })
    },
    [GET_INFO]: function (state, data) {
      state.alarmInfoV2 = data
    },
    [OPEN_POPUP]: function (state) {
      state.alarm.visible = true
    },
    [CLOSE_POPUP]: function(state) {
      state.visible = false
    }
  },
  actions: {
    [PUT_ALARMS_SEARCH]: async function({ commit, state }, obj) {
      await axios.put(`${DEV_SERVER}/${ALARMS}/${SEARCH}`, obj)
        .then(({ data }) => {
          data.isInit = obj.isInit
          commit(PUT_ALARMS_SEARCH, data)
        })
        .catch(error => {
          state.alarms = []
          state.alarms7Days = []
          util.printError(error)
        })
    },
    [PUT_ALARMS_DETAIL]: async function({ state, commit }, obj) {
      await axios.put(`${DEV_SERVER}/${ALARMS}/${DETAIL}`, obj)
        .then(({ data }) => {
          commit(PUT_ALARMS_DETAIL, data)
        })
        .catch(error => {
          util.printError(error)
          state.alarmsDetail = {
            ctrHisList: [],
            factorMap: {},
            procCd: ""
          }
        })
    },
    // 알람 설정 정보 요청 - 관리자 전용 API
    [GET_ALL_ALARM_SETTING]: async function({ commit, dispatch, state }) {
      await axios.get(`${DEV_SERVER}/${ALARMS}/${SETTING}`)
        .then(({ data }) => {
          commit(GET_ALL_ALARM_SETTING, data)
          dispatch(PUT_ALARMS_SEARCH, { start_time: state.startTime.valueOf(), end_time: state.endTime.valueOf(), isInit: true})
        })
        .catch(error => {
          util.printError(error)
        })
    },
    // 알람 설정 정보 수정 API
    [PUT_ALARM]: async function ({ commit }, { seq, dp_nm, cmp_val, scd_snd }) {
      await axios.put(`${DEV_SERVER}/${ALARMS}/${SETTING}` + '/' + seq, { dp_nm, cmp_val, scd_snd })
        .then(() => {
          commit(PUT_ALARM, { seq, dp_nm, cmp_val, scd_snd })
          commit('modifyAlarmDialog/CLOSE_DIALOG', null, { root: true })
          let data = {
            visible: true,
            title: '알람 정보 수정',
            text1: '알람 정보가 수정 됐습니다'
          }
          commit('alertDialog/OPEN_DIALOG', data, { root: true })
        })
        .catch(error => {
          util.printError(error)
        })
    },
    // v2
    [GET_NOTIFY]: async function ({ commit, state, dispatch, rootState }) {
      await axios.get(`${DEV_SERVER}/${URL.ALRAM_NOTIFY}`)
        .then(({ data }) => {
          commit(GET_NOTIFY, data.alarm)

          if(state.alarmIgnore.length > 0) {
            state.alarmIgnore.forEach((it) => {
              it.tkn = rootState.login.user.tkn
              it.kfk_flg = 4
              it.no_action_flg = 'Y'
              it.almSeq = it.seq
              it.ctrYn = ''
              dispatch(PUT_CONTROL_HISTORY, it)
              dispatch(PUT_CONTROL, it)
              
            })
          }
          
        })
        .catch(error => {
          commit(GET_NOTIFY, [])
          if(state.alarmIgnore.length > 0) {
            state.alarmIgnore.forEach((it) => {
              it.tkn = rootState.login.user.tkn
              it.kfk_flg = 4
              it.no_action_flg = 'Y'
              it.almSeq = it.seq
              it.ctrYn = ''
              dispatch(PUT_CONTROL_HISTORY, it)
              dispatch(PUT_CONTROL, it)
              
            })
          }
          util.printError(error)
        })
    },
    // v2
    [GET_INFO]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.ALARM_INFO}`)
        .then(({ data }) => {
          commit(GET_INFO, data.alarm_info)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    // v2
    [PUT_CONTROL]: async function ({ commit }, { alm_id, alm_ntf_ti, kfk_flg, no_action_flg}) { // eslint-disable-line no-unused-vars
      var url = `${DEV_SERVER}/${URL.ALARM_CONTROL}`
      if(no_action_flg){ //무반응 알람 해당할 시, 파라미터에 플래그 추가
        url += `/?noActionFlag=${encodeURIComponent(no_action_flg)}`
      }
      await axios.put(url, { alm_id, alm_ntf_ti, kfk_flg})
        .then(() => {
          // commit()
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            let _data = {
              visible: true,
              title: '',
              text1: '이미 만료된 알람입니다.'
            }
            commit('alertDialog/OPEN_DIALOG', _data, { root: true })
          } else {
          util.printError(error)
          }
        })
    },
    [PUT_CONTROL_HISTORY]: async function ({ commit }, obj) { // eslint-disable-line no-unused-vars
      axios.defaults.headers.common['X-ACCESS-TOKEN'] = obj.tkn != null ? obj.tkn : ""
      await axios.put(`${DEV_SERVER}/${URL.ALARM_CONTROL_HISTORY}`, obj)
        .then(() => {
        })
        .catch(error => {
          util.printError(error)
        })
    }
  }
}