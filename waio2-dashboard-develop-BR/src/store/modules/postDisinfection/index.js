// 소독 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

const OPEN_LSTM_DIALOG = 'OPEN_LSTM_DIALOG'
const CLOSE_LSTM_DIALOG = 'CLOSE_LSTM_DIALOG'
const OPEN_PRE_DIALOG = 'OPEN_PRE_DIALOG'
const URL = {
  DISINFECTION_LATEST: 'disinfection/latest',
  DISINFECTION_HISTORY_CHOL_RATE_TREND: 'disinfection/history/postCholRateTrend',
  DISINFECTION_CONTROL_OPERATION_POST: 'disinfection/control/operation/post',
  DISINFECTION_CONTROL_POST: 'disinfection/control/post',
  DISINFECTION_H_RESIDUAL_CL : 'disinfection/history/postResidualCl'
}
export const GET_POSTDISINFECTION_LATEST = 'postDisinfection/latest' + '/get'
export const PUT_POSTDISINFECTION_HISTORY_CHOL_RATE_TREND = 'postDisinfection/history/postCholRateTrend/put'
export const PUT_POSTDISINFECTION_H_RESIDUAL_CL = 'postDisinfection/history/postResidualCl/put'
export const PUT_DISINFECTION_CONTROL_OPERATION_POST = 'postDisinfection/control/operation/post' + '/put'
export const PUT_DISINFECTION_CONTROL_POST = 'postDisinfection/control/peri' + '/put'
const GET_LATEST = GET_POSTDISINFECTION_LATEST.substr(GET_POSTDISINFECTION_LATEST.indexOf('/') + 1)
const PUT_HISTORY_CHOL_RATE_TREND = PUT_POSTDISINFECTION_HISTORY_CHOL_RATE_TREND.substr(PUT_POSTDISINFECTION_HISTORY_CHOL_RATE_TREND.indexOf('/') + 1)
const PUT_H_RESIDUAL_CL_TREND = PUT_POSTDISINFECTION_H_RESIDUAL_CL.substr(PUT_POSTDISINFECTION_H_RESIDUAL_CL.indexOf('/') + 1)
const PUT_CONTROL_OPERATION_POST = PUT_DISINFECTION_CONTROL_OPERATION_POST.substr(PUT_DISINFECTION_CONTROL_OPERATION_POST.indexOf('/') + 1)
const PUT_CONTROL_POST = PUT_DISINFECTION_CONTROL_POST.substr(PUT_DISINFECTION_CONTROL_POST.indexOf('/') + 1)
const SET_MODIFYED_FROM_LATEST = "setModifyedFromLatest"
const PROCESS_STEP = 1
import { CLOSE_AI_MODE_DIALOG } from '@/store/modules/dialog'

export default {
  namespaced: true,
  state: {
    processStep: 1,
    isModifyMode: false,
    dialog: {
      lstm: {
        visible: false
      },
      pre: {
        visible: false
      }
    },
    selectedDisinfectionIndex: 3,
    latest: {
      upd_ti: null,
      post_ai_opr: null,
      d1_cl: null,
      b_in_fr: null,
      d1_in_fr: null,
      d_ser_in_fr: null,
      g_ser_trg_cl: null,
      e1_cl: null,
      h_in_cl: null,
      h_cl:null,
      h_out_cl: null,
      h_ph: null,
      h_tb: null,
      g_3_chlorination: null,
      g_4_chlorination: null,
      g_3_mm_fr:null,
      g_4_mm_fr:null,
      g_3_goal_chlorination: null,
      g_4_goal_chlorination: null,
      g_3_set_max: null,
      g_3_set_min: null,
      g_4_set_max: null,
      g_4_set_min: null,
      g_ser_inr: null,
      g_post_set_max: null,
      g_post_set_min: null,
      g_post_chg_limit_for_onetime: null,
      g_inr_crt: null,
      g_ser_cl_eva: null, 
      ai_g_3_chlorination: null,
      ai_g_4_chlorination: null,
      ai_g_post_chol: null,
      ai_g_ser_inr: null,
      g_post_corrected: null,
      g_d_corrected: null,
      g_post_calib_cycle: null,
      g_h_obj_residual_cl: null,
      ai_g_post_chol_rate_trend: null,
      g_h_in_residual_cl_trend: null,
      ai_g_correct_degree: null,
      g_h_in_residual_cl_holding: null
    },
    latestModify: {
      upd_ti: null,
      post_ai_opr: null,
      d1_cl: null,
      b_in_fr: null,
      d1_in_fr: null,
      d_ser_in_fr: null,
      g_ser_trg_cl: null,
      e1_cl: null,
      h_in_cl: null,
      h_cl:null,
      h_out_cl: null,
      h_ph: null,
      h_tb: null,
      g_3_chlorination: null,
      g_4_chlorination: null,
      g_3_mm_fr:null,
      g_4_mm_fr:null,
      g_3_goal_chlorination: null,
      g_4_goal_chlorination: null,
      g_3_set_max: null,
      g_3_set_min: null,
      g_4_set_max: null,
      g_4_set_min: null,
      g_ser_inr: null,
      g_post_set_max: null,
      g_post_set_min: null,
      g_post_chg_limit_for_onetime: null,
      g_inr_crt: null,
      g_ser_cl_eva: null, 
      ai_g_3_chlorination: null,
      ai_g_4_chlorination: null,
      ai_g_post_chol: null,
      ai_g_ser_inr: null,
      g_post_corrected: null,
      g_d_corrected: null,
      g_post_calib_cycle: null,
      g_h_obj_residual_cl: null,
      ai_g_post_chol_rate_trend: null,
      g_h_in_residual_cl_trend: null,
      ai_g_correct_degree: null,
      g_h_in_residual_cl_holding: null
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
    [SET_MODIFYED_FROM_LATEST]: function (state) {
      state.latestModify = Object.assign({}, state.latest)
    },
    [PUT_HISTORY_CHOL_RATE_TREND]: function (state, data){
      state.ai_g_post_chol_rate_trend = data
    },
    [PUT_H_RESIDUAL_CL_TREND]: function (state, data){
      state.g_h_in_residual_cl_trend = data
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
    [GET_LATEST]: async function ({ commit }, {selectedDisinfectionIndex}) {
      await axios.get(`${DEV_SERVER}/${URL.DISINFECTION_LATEST}/` + PROCESS_STEP + '/' + selectedDisinfectionIndex)
        .then(({ data }) => {
          commit(GET_LATEST, data.latest)
        })
        .catch(error => {
          util.printError(error)
        })
    },

    //후차염 주입률 예측 트렌드
    [PUT_HISTORY_CHOL_RATE_TREND]: async function ({ commit }, { selectedDisinfectionIndex }) {
      let nowTimestamp = Date.now()
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      // FIXME 현재 날짜 수정
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_HISTORY_CHOL_RATE_TREND}/1/`+ selectedDisinfectionIndex, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
      // await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_HISTORY_CHOL_RATE_TREND}/1/`+ selectedDisinfectionIndex, { 'start_time': new Date('2023-11-27 00:00:00.000').toISOString(), 'end_time': new Date('2023-11-27 23:59:10.000').toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_CHOL_RATE_TREND, data.ai_g_post_chol_rate_trend)
        })
        .catch(error => {
          util.printError(error)
        })
    },

    /**
     * 후차염 정수지 잔류염소 트렌드
     * => 사용하지 않음
     */
    [PUT_H_RESIDUAL_CL_TREND]: async function ({ commit }, { selectedDisinfectionIndex }){
      // FIXME 하위 6개 주석 라인 운영반영시 주석해제
      let yesterDayTimestamp = new Date().getTime() - 1000 * 60 * 60 * 24
      let yesterDay = new Date(yesterDayTimestamp)
      let year = yesterDay.getFullYear()
      let month = yesterDay.getMonth()
      let day = yesterDay.getDate()
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_H_RESIDUAL_CL}/1/`+ selectedDisinfectionIndex, { 'start_time': new Date(year, month, day, 0, 0, 0).toISOString(), 'end_time': new Date().toISOString() })
      // await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_H_RESIDUAL_CL}/1/`+ selectedDisinfectionIndex, { 'start_time': new Date('2013-09-03 00:00:00').toISOString(), 'end_time': new Date('2023-10-05 23:59:59').toISOString() })
        .then(({ data }) => {
          commit(PUT_H_RESIDUAL_CL_TREND, data.g_h_in_residual_cl_trend)
        })
        .catch(error => {
          util.printError(error)
        })
    },

    /**
     * 후차염 AI 운영모드 제어
     */
    [PUT_CONTROL_OPERATION_POST]: async function ({ commit }, { operation, processStep, selectedDisinfectionIndex }) {
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_OPERATION_POST}/`+ processStep +`/`+selectedDisinfectionIndex, { 'operation': operation })
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

    /**
     * 전차염 알고리즘 설정값 제어
     * 
     * g_post_set_max                : 전차염 주입률 상한
     * g_post_set_min                : 전차염 주입률 하한
     * g_post_calib_cycle            : 보정 주기
     * g_post_chg_limit_for_onetime  : 1회 변경 주입률
     * g_h_obj_residual_cl          : 침전지 목표 잔류염소
     */
    [PUT_CONTROL_POST]: async function ({ commit }, { 
      g_post_set_max,
      g_post_set_min,
      g_post_calib_cycle,
      g_post_chg_limit_for_onetime,
      g_h_obj_residual_cl,
      g_post_calib_num,
      processStep,
      selectedDisinfectionIndex,
      g_h_in_residual_cl_holding
     }) {
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_POST}/` + processStep + '/' + selectedDisinfectionIndex, { 
        g_post_set_max,
        g_post_set_min,
        g_post_calib_cycle,
        g_post_chg_limit_for_onetime,
        g_h_obj_residual_cl,
        g_post_calib_num,
        g_h_in_residual_cl_holding
      })
      .then(() => {
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다'
        }
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