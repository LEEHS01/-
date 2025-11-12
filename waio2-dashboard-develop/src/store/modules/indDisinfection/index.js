// 소독 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

const OPEN_LSTM_DIALOG = 'OPEN_LSTM_DIALOG'
const CLOSE_LSTM_DIALOG = 'CLOSE_LSTM_DIALOG'
const OPEN_PRE_DIALOG = 'OPEN_PRE_DIALOG'
const URL = {
  DISINFECTION_LATEST: 'disinfection/latest',
  DISINFECTION_LATEST_MAIN: 'disinfection/latest/main',
  DISINFECTION_HISTORY_EVAPORATION: 'disinfection/history/evaporation',
  DISINFECTION_HISTORY_CORRECTED_POST: 'disinfection/history/corrected/post',
  DISINFECTION_CONTROL_OPERATION_PRE: 'disinfection/control/operation/pre',
  DISINFECTION_CONTROL_PRE: 'disinfection/control/pre',
  DISINFECTION_CONTROL_RERI: 'disinfection/control/peri',
  DISINFECTION_CONTROL_POST: 'disinfection/control/post'
}

export const GET_INDDISINFECTION_LATEST_MAIN = 'indDisinfection/latest/main' + '/get'
export const GET_INDDISINFECTION_LATEST = 'indDisinfection/latest' + '/get'
export const PUT_DISINFECTION_HISTORY_EVAPORATION = 'indDisinfection/history/evaporation' + '/put'
export const PUT_DISINFECTION_HISTORY_CORRECTED_POST = 'indDisinfection/history/corrected/post' + '/put'
export const PUT_INDDISINFECTION_CONTROL_OPERATION_PRE = 'indDisinfection/control/operation/pre' + '/put'
export const PUT_INDDISINFECTION_CONTROL_OPERATION_PERI = 'indDisinfection/control/operation/peri' + '/put'
export const PUT_INDDISINFECTION_CONTROL_OPERATION_POST = 'indDisinfection/control/operation/post' + '/put'
export const PUT_DISINFECTION_CONTROL_PRE = 'indDisinfection/control/pre' + '/put'
const GET_LATEST = GET_INDDISINFECTION_LATEST.substr(GET_INDDISINFECTION_LATEST.indexOf('/') + 1)
const GET_LATEST_MAIN = GET_INDDISINFECTION_LATEST_MAIN.substr(GET_INDDISINFECTION_LATEST_MAIN.indexOf('/') + 1)
const PUT_HISTORY_EVAPORATION = PUT_DISINFECTION_HISTORY_EVAPORATION.substr(PUT_DISINFECTION_HISTORY_EVAPORATION.indexOf('/') + 1)
const PUT_HISTORY_CORRECTED_POST = PUT_DISINFECTION_HISTORY_CORRECTED_POST.substr(PUT_DISINFECTION_HISTORY_CORRECTED_POST.indexOf('/') + 1)
const PUT_CONTROL_OPERATION_PRE = PUT_INDDISINFECTION_CONTROL_OPERATION_PRE.substr(PUT_INDDISINFECTION_CONTROL_OPERATION_PRE.indexOf('/') + 1)
const PUT_CONTROL_PRE = PUT_DISINFECTION_CONTROL_PRE.substr(PUT_DISINFECTION_CONTROL_PRE.indexOf('/') + 1)
const SET_MODIFYED_FROM_LATEST = "setModifyedFromLatest"
import { CLOSE_AI_MODE_DIALOG } from '@/store/modules/dialog'
const PROCESS_STEP = 1

export default {
  namespaced: true,
  state: {
    isModifyMode: false,
    dialog: {
      lstm: {
        visible: false
      },
      pre: {
        visible: false
      }
    },
    selectedDisinfectionIndex: 1,
    latest: {
      upd_ti: null,
      pre_ai_opr: null,
      peri_ai_opr: null,
      post_ai_opr: null,
      g_e_obj_residual_cl: null,
      g_e_residual_cl_holding: null,
      d2_target_cl: null,
      d1_cl: null,
      e_ser_cl: null,
      d1_in_fr: null,
      d_ser_in_fr: null,
      e1_target_cl: null,
      e2_target_cl: null,
      g_ser_trg_cl: null,
      e1_cl: null,
      d_ser_cl: null,
      h_in_cl: null,
      h_out_cl: null,
      h_ph: null,
      h_tb: null,
      g_pre1_chlorination: null,
      g_pre_set_max: null,
      g_pre_set_min: null,
      g_pre_chg_limit_for_onetime: null,
      g_pre2_chlorination: null,
      g_pre2_set_max: null,
      g_pre2_set_min: null,
      g_pre2_chg_limit_for_onetime: null,
      g_peri1_chlorination: null,
      g_peri_set_max: null,
      g_peri_set_min: null,
      g_peri_chg_limit_for_onetime: null,
      g_peri2_chlorination: null,
      g_peri2_set_max: null,
      g_peri2_set_min: null,
      g_peri2_chg_limit_for_onetime: null,
      g_ser_inr: null,
      g_post_set_max: null,
      g_post_set_min: null,
      g_post_chg_limit_for_onetime: null,
      ai_g_pre1_corrected: null,
      ai_g_pre2_corrected: null,
      ai_g_peri1_corrected: null,
      ai_g_peri2_corrected: null,
      g_inr_crt: null,
      ai_g_pre1_evaporation: null,
      g_ser_cl_eva: null,
      ai_g_pre1_chlorination: null,
      ai_g_pre2_chlorination: null,
      ai_g_peri1_chlorination: null,
      ai_g_peri2_chlorination: null,
      ai_g_ser_inr: null,
      g_pre_calib_cycle: null
    },
    latestModify: {
      upd_ti: null,
      pre_ai_opr: null,
      peri_ai_opr: null,
      post_ai_opr: null,
      g_e_obj_residual_cl: null,
      g_e_residual_cl_holding: null,
      d2_target_cl: null,
      d1_cl: null,
      e_ser_cl: null,
      d1_in_fr: null,
      d_ser_in_fr: null,
      e1_target_cl: null,
      e2_target_cl: null,
      g_ser_trg_cl: null,
      e1_cl: null,
      d_ser_cl: null,
      h_in_cl: null,
      h_out_cl: null,
      h_ph: null,
      h_tb: null,
      g_pre1_chlorination: null,
      g_pre_set_max: null,
      g_pre_set_min: null,
      g_pre_chg_limit_for_onetime: null,
      g_pre2_chlorination: null,
      g_pre2_set_max: null,
      g_pre2_set_min: null,
      g_pre2_chg_limit_for_onetime: null,
      g_peri1_chlorination: null,
      g_peri_set_max: null,
      g_peri_set_min: null,
      g_peri_chg_limit_for_onetime: null,
      g_peri2_chlorination: null,
      g_peri2_set_max: null,
      g_peri2_set_min: null,
      g_peri2_chg_limit_for_onetime: null,
      g_ser_inr: null,
      g_post_set_max: null,
      g_post_set_min: null,
      g_post_chg_limit_for_onetime: null,
      ai_g_pre1_corrected: null,
      ai_g_pre2_corrected: null,
      ai_g_peri1_corrected: null,
      ai_g_peri2_corrected: null,
      g_inr_crt: null,
      ai_g_pre1_evaporation: null,
      g_ser_cl_eva: null,
      ai_g_pre1_chlorination: null,
      ai_g_pre2_chlorination: null,
      ai_g_peri1_chlorination: null,
      ai_g_peri2_chlorination: null,
      ai_g_ser_inr: null,
      g_pre_calib_cycle: null
    },
    pre_evaporation: {
      series1: null,
      series2: null
    },
    correctedTrend: null
  },
  getters: {
    isAiOperationMode: function (state) {
      if (state.latest.pre_ai_opr === 2 && state.latest.peri_ai_opr === 2 && state.latest.post_ai_opr === 2) {
        return true
      } else {
        return false
      }
    }
  },
  mutations: {
    [OPEN_PRE_DIALOG]: function(state) {
      state.dialog.pre.visible = true
    },
    [OPEN_LSTM_DIALOG]: function(state) {
      state.dialog.lstm.visible = true
    },
    [CLOSE_LSTM_DIALOG]: function(state) {
      state.dialog.lstm.visible = false
    },
    [GET_LATEST]: function (state, data) {
      state.latest = data
      if (state.isModifyMode === false) {
        state.latestModify = Object.assign({}, data)
      }
    },
    [GET_LATEST_MAIN]: function (state, data) { //메인화면 개발용 추가
      state.latest = data
      if (state.isModifyMode === false) {
        state.latestModify = Object.assign({}, data)
      }
    },
    [SET_MODIFYED_FROM_LATEST]: function (state) {
      state.latestModify = Object.assign({}, state.latest)
    },
    [PUT_HISTORY_EVAPORATION]: function (state, data) {
      state.pre_evaporation = data
    },
    [PUT_HISTORY_CORRECTED_POST]: function (state, data) {
      state.correctedTrend = data
    },
    [PUT_CONTROL_PRE]: function (state, { g_pre_set_max, g_pre_set_min, g_pre_chg_limit_for_onetime, g_e_obj_residual_cl, g_pre_calib_cycle, g_e_residual_cl_holding }){
      state.latest.g_pre_set_max = g_pre_set_max
      state.latest.g_pre_set_min = g_pre_set_min
      state.latest.g_pre_chg_limit_for_onetime = g_pre_chg_limit_for_onetime
      state.latest.g_e_obj_residual_cl = g_e_obj_residual_cl
      state.latest.g_e_residual_cl_holding = g_e_residual_cl_holding
      state.latest.g_pre_calib_cycle = g_pre_calib_cycle
    },
  },
  actions: {
    [OPEN_PRE_DIALOG]: function ({ commit }) {
      commit(OPEN_PRE_DIALOG)
    },
    [OPEN_LSTM_DIALOG]: function ({ commit }) {
      commit(OPEN_LSTM_DIALOG)
    },
    [CLOSE_LSTM_DIALOG]: function ({ commit }) {
      commit(CLOSE_LSTM_DIALOG)
    },
    [GET_LATEST]: async function ({ commit , state }) {
      let pStep = state.selectedDisinfectionIndex
      await axios.get(`${DEV_SERVER}/${URL.DISINFECTION_LATEST}/` + pStep + '/' +PROCESS_STEP)
        .then(({ data }) => {
          commit(GET_LATEST, data.latest)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [GET_LATEST_MAIN]: async function ({commit}){
      let pStep = 1
      let dIdx = 0
      
      await axios.get(`${DEV_SERVER}/${URL.DISINFECTION_LATEST_MAIN}/` + dIdx + '/' +pStep)
      .then(({ data }) => {
        commit(GET_LATEST_MAIN, data.latest)
      })
      .catch(error => {
        util.printError(error)
      })
    },    
    [PUT_HISTORY_EVAPORATION]: async function ({ commit ,state }) {
      let yesterDayTimestamp = new Date().getTime() - 1000 * 60 * 60 * 24
      let yesterDay = new Date(yesterDayTimestamp)
      let year = yesterDay.getFullYear()
      let month = yesterDay.getMonth()
      let day = yesterDay.getDate()

      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_HISTORY_EVAPORATION}/` + state.selectedDisinfectionIndex + '/' + PROCESS_STEP, 
      { 'start_time': new Date(year, month, day, 0, 0, 0).toISOString(), 'end_time': new Date().toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_EVAPORATION, data.pre_evaporation)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_HISTORY_CORRECTED_POST]: async function ({ commit }) {
      let nowTimestamp = Date.now()
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_HISTORY_CORRECTED_POST}`, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_CORRECTED_POST, data.corrected)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_CONTROL_OPERATION_PRE]: async function ({ commit , state }, { operation }) {
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_OPERATION_PRE}/` + state.selectedDisinfectionIndex + '/' + PROCESS_STEP, { 'operation': operation })
      .then(() => {
        commit('dialog/' +CLOSE_AI_MODE_DIALOG, null, { root: true })
        let _data = {
          visible: true,
          title: '제어 성공',
          text1: '운전모드 변경요청 완료'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
      })
      .catch(error => {
        util.printError(error)
        let _data = {
          visible: true,
          title: '제어 실패',
          text1: '관리자에게 문의해주세요'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
        commit(SET_MODIFYED_FROM_LATEST)
      })
    },
    [PUT_CONTROL_PRE]: async function ({ commit, state }, { g_pre_set_max, g_pre_set_min, g_pre_chg_limit_for_onetime, g_e_obj_residual_cl, g_pre_calib_cycle, g_e_residual_cl_holding }) { // eslint-disable-line no-unused-vars
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_PRE}/` +  state.selectedDisinfectionIndex + `/` + PROCESS_STEP, { g_pre_set_max, g_pre_set_min, g_pre_chg_limit_for_onetime, g_e_obj_residual_cl, g_pre_calib_cycle, g_e_residual_cl_holding })
      .then(() => {
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다'
        }
        commit(PUT_CONTROL_PRE,  { g_pre_set_max, g_pre_set_min, g_pre_chg_limit_for_onetime, g_e_obj_residual_cl, g_pre_calib_cycle, g_e_residual_cl_holding })
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
      })
      .catch(error => {
        util.printError(error)
        let _data = {
          visible: true,
          title: '설정 실패',
          text1: '관리자에게 문의해주세요'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
        commit(SET_MODIFYED_FROM_LATEST)
      })
    }
  }
}