// 소독 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

const OPEN_LSTM_DIALOG = 'OPEN_LSTM_DIALOG'
const CLOSE_LSTM_DIALOG = 'CLOSE_LSTM_DIALOG'
const OPEN_PRE_DIALOG = 'OPEN_PRE_DIALOG'
const URL = {
  DISINFECTION_LATEST: 'disinfection/latest',
  DISINFECTION_HISTORY_CHOL_RATE_TREND: 'disinfection/history/periCholRateTrend',
  DISINFECTION_CONTROL_OPERATION_PERI: 'disinfection/control/operation/peri',
  DISINFECTION_CONTROL_RERI: 'disinfection/control/peri',

}
export const GET_MIDDISINFECTION_LATEST = 'midDisinfection/latest' + '/get'
export const PUT_MIDDISINFECTION_HISTORY_CHOL_RATE_TREND = 'midDisinfection/history/periCholRateTrend/put'
export const PUT_DISINFECTION_CONTROL_OPERATION_PERI = 'midDisinfection/control/operation/peri' + '/put'
export const PUT_DISINFECTION_CONTROL_PERI = 'midDisinfection/control/peri' + '/put'
const GET_LATEST = GET_MIDDISINFECTION_LATEST.substr(GET_MIDDISINFECTION_LATEST.indexOf('/') + 1)
const PUT_HISTORY_CHOL_RATE_TREND = PUT_MIDDISINFECTION_HISTORY_CHOL_RATE_TREND.substr(PUT_MIDDISINFECTION_HISTORY_CHOL_RATE_TREND.indexOf('/') + 1)
const PUT_CONTROL_OPERATION_PERI = PUT_DISINFECTION_CONTROL_OPERATION_PERI.substr(PUT_DISINFECTION_CONTROL_OPERATION_PERI.indexOf('/') + 1)
const PUT_CONTROL_PERI = PUT_DISINFECTION_CONTROL_PERI.substr(PUT_DISINFECTION_CONTROL_PERI.indexOf('/') + 1)
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
    selectedDisinfectionIndex: 2,
    latest: {
      upd_ti: null,
      peri_ai_opr: null,
      d1_target_cl: null,
      d2_target_cl: null,
      d1_cl: null,
      b_in_fr: null,
      d1_in_fr: null,
      d_ser_in_fr: null,
      e1_target_cl: null,
      e2_target_cl: null,
      g_ser_trg_cl: null,
      e1_cl: null,
      h_in_cl: null,
      h_out_cl: null,
      h_ph: null,
      h_tb: null,
      g_pre1_chg_limit_for_onetime: null,
      g_1_chlorination: null, //차염A(전차염) 현재주입률
      g_2_chlorination: null, //차염B(중차염) 현재주입률
      g_3_chlorination: null, //차염C(후차염) 현재주입률
      g_4_chlorination: null, //차염D 현재주입률
      g_1_mm_fr:null, //차염A(전차염) 현재주입량
      g_2_mm_fr:null, //차염B(중차염) 현재주입량
      g_3_mm_fr:null, //차염C(후차염) 현재주입량
      g_4_mm_fr:null, //차염D 현재주입량
      g_1_goal_chlorination: null, //차염A(전차염) 목표주입률
      g_2_goal_chlorination: null, //차염B(중차염) 목표주입률
      g_3_goal_chlorination: null, //차염C(후차염) 목표주입률
      g_4_goal_chlorination: null, //차염D 목표주입률
      g_1_set_max: null, //차염A(전차염) 주입률 상한
      g_1_set_min: null, //차염A(전차염) 주입률 하한
      g_2_set_max: null, //차염B(중차염) 주입률 상한
      g_2_set_min: null, //차염B(중차염) 주입률 히한
      g_3_set_max: null, //차염C(후차염) 주입률 상한
      g_3_set_min: null, //차염C(중차염) 주입률 하한
      g_4_set_max: null, //차염D 주입률 상한
      g_4_set_min: null, //차염D 주입률 하한
      g_pre2_chg_limit_for_onetime: null,
      g_peri1_chg_limit_for_onetime: null,
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
      ai_g_pre_chol: null,  //전염소 예측 주입률
      ai_g_peri_chol: null, //중염소 예측 주입률
      ai_g_post_chol: null, //후염소 예측 주입률
      ai_g_ser_inr: null,
      g_pre_corrected: null,  //차염A(전차염) 염소주입률 보정상수
      g_peri_corrected: null, //차염B(중차염) 염소주입률 보정상수
      g_post_corrected: null, //차염C(후차염) 염소주입률 보정상수
      g_d_corrected: null,    //차염D(예비) 염소주입률 보정상수
      g_peri_set_max: null,                //중차염 주입률 상한
      g_peri_set_min: null,                //중차염 주입률 하한
      g_peri_calib_cycle: null,            //중차염 보정 주기
      g_peri_chg_limit_for_onetime: null,  //중차염 1회 변경 주입률
      g_e_obj_residual_cl: null,           //중차염 목표 침전지 잔류염소
      ai_g_peri_chol_rate: null,            //중차염 주입률 예측 트렌드
      g_e_residual_cl_holding: null,
      g_f_out_residual_cl_min: null
    },
    latestModify: {
      upd_ti: null,
      peri_ai_opr: null,
      d1_target_cl: null,
      d2_target_cl: null,
      d1_cl: null,
      d1_in_fr: null,
      d_ser_in_fr: null,
      e1_target_cl: null,
      e2_target_cl: null,
      g_ser_trg_cl: null,
      e1_cl: null,
      h_in_cl: null,
      h_out_cl: null,
      h_ph: null,
      h_tb: null,
      g_pre1_chg_limit_for_onetime: null,
      g_1_chlorination: null, //차염A(전차염) 현재주입률
      g_2_chlorination: null, //차염B(중차염) 현재주입률
      g_3_chlorination: null, //차염C(후차염) 현재주입률
      g_4_chlorination: null, //차염D 현재주입률
      g_1_mm_fr:null, //차염A(전차염) 현재주입량
      g_2_mm_fr:null, //차염B(중차염) 현재주입량
      g_3_mm_fr:null, //차염C(후차염) 현재주입량
      g_4_mm_fr:null, //차염D 현재주입량
      g_1_goal_chlorination: null, //차염A(전차염) 목표주입률
      g_2_goal_chlorination: null, //차염B(중차염) 목표주입률
      g_3_goal_chlorination: null, //차염C(후차염) 목표주입률
      g_4_goal_chlorination: null, //차염D 목표주입률
      g_1_set_max: null, //차염A(전차염) 주입률 상한
      g_1_set_min: null, //차염A(전차염) 주입률 하한
      g_2_set_max: null, //차염B(중차염) 주입률 상한
      g_2_set_min: null, //차염B(중차염) 주입률 히한
      g_3_set_max: null, //차염C(후차염) 주입률 상한
      g_3_set_min: null, //차염C(중차염) 주입률 하한
      g_4_set_max: null, //차염D 주입률 상한
      g_4_set_min: null, //차염D 주입률 하한
      g_pre2_chg_limit_for_onetime: null,
      g_peri1_chg_limit_for_onetime: null,
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
      ai_g_pre_chol: null,  //전염소 예측 주입률
      ai_g_peri_chol: null, //중염소 예측 주입률
      ai_g_post_chol: null, //후염소 예측 주입률
      ai_g_ser_inr: null,
      g_pre_corrected: null,  //차염A(전차염) 염소주입률 보정상수
      g_peri_corrected: null, //차염B(중차염) 염소주입률 보정상수
      g_post_corrected: null, //차염C(후차염) 염소주입률 보정상수
      g_d_corrected: null,    //차염D(예비) 염소주입률 보정상수
      g_peri_set_max: null,                //중차염 주입률 상한
      g_peri_set_min: null,                //중차염 주입률 하한
      g_peri_calib_cycle: null,            //중차염 보정 주기
      g_peri_chg_limit_for_onetime: null,  //중차염 1회 변경 주입률
      g_e_obj_residual_cl: null,            //중차염 목표 침전지 잔류염소
      ai_g_peri_chol_rate_trend: null,       //중차염 주입률 예측 트렌드
      g_e_residual_cl_holding: null,
      g_f_out_residual_cl_min: null
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
    [PUT_HISTORY_CHOL_RATE_TREND]: function (state, data) {
      state.ai_g_peri_chol_rate_trend = data
    }
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
    [PUT_HISTORY_CHOL_RATE_TREND]: async function ({ commit }, { selectedDisinfectionIndex }) {
      let nowTimestamp = Date.now()
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      // FIXME 현재 날짜 수정
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_HISTORY_CHOL_RATE_TREND}/1/`+ selectedDisinfectionIndex, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
      // await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_HISTORY_CHOL_RATE_TREND}/1/`+ selectedDisinfectionIndex, { 'start_time': new Date('2023-11-27 00:00:00.000').toISOString(), 'end_time': new Date('2023-11-27 23:59:10.000').toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_CHOL_RATE_TREND, data.ai_g_peri_chol_rate_trend)
        })
        .catch(error => {
          util.printError(error)
        })
    },

    [PUT_CONTROL_OPERATION_PERI]: async function ({ commit }, { operation, processStep, selectedDisinfectionIndex }) {
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_OPERATION_PERI}/`+ processStep + '/'+selectedDisinfectionIndex, { 'operation': operation })
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

    [PUT_CONTROL_PERI]: async function ({ commit }, { 
          g_peri_set_max,
          g_peri_set_min,
          g_peri_calib_cycle,
          g_peri_chg_limit_for_onetime,
          g_e_obj_residual_cl,
          g_f_out_residual_cl_min,
          processStep, 
          selectedDisinfectionIndex,
          g_e_residual_cl_holding
       }) { // eslint-disable-line no-unused-vars
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_RERI}/`+ processStep + '/' + selectedDisinfectionIndex, { 
        g_peri_set_max,
        g_peri_set_min,
        g_peri_calib_cycle,
        g_peri_chg_limit_for_onetime,
        g_e_obj_residual_cl,
        g_f_out_residual_cl_min,
        g_e_residual_cl_holding
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