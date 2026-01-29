// 소독 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

const OPEN_LSTM_DIALOG = 'OPEN_LSTM_DIALOG'
const CLOSE_LSTM_DIALOG = 'CLOSE_LSTM_DIALOG'
const OPEN_PRE_DIALOG = 'OPEN_PRE_DIALOG'
const URL = {
  DISINFECTION_LATEST: 'disinfection/latest',
  DISINFECTION_HISTORY_EVAPORATION: 'disinfection/history/evaporation',
  DISINFECTION_CONTROL_OPERATION_PRE: 'disinfection/control/operation/pre',
  DISINFECTION_CONTROL_PRE: 'disinfection/control/pre',
  DISINFECTION_CONTROL_CHOLRATE: 'disinfection/control/cholrate'
}
export const GET_DISINFECTION_LATEST = 'disinfection/latest' + '/get'
export const PUT_DISINFECTION_HISTORY_EVAPORATION = URL.DISINFECTION_HISTORY_EVAPORATION + '/put'
export const PUT_DISINFECTION_CONTROL_OPERATION_PRE = URL.DISINFECTION_CONTROL_OPERATION_PRE + '/put'
export const PUT_DISINFECTION_CONTROL_PRE = URL.DISINFECTION_CONTROL_PRE + '/put'
export const PUT_DISINFECTION_CONTROL_CHOLRATE = URL.DISINFECTION_CONTROL_CHOLRATE + '/put'
const GET_LATEST = GET_DISINFECTION_LATEST.substr(GET_DISINFECTION_LATEST.indexOf('/') + 1)
const PUT_HISTORY_EVAPORATION = PUT_DISINFECTION_HISTORY_EVAPORATION.substr(PUT_DISINFECTION_HISTORY_EVAPORATION.indexOf('/') + 1)
const PUT_CONTROL_OPERATION_PRE = PUT_DISINFECTION_CONTROL_OPERATION_PRE.substr(PUT_DISINFECTION_CONTROL_OPERATION_PRE.indexOf('/') + 1)
const PUT_CONTROL_PRE = PUT_DISINFECTION_CONTROL_PRE.substr(PUT_DISINFECTION_CONTROL_PRE.indexOf('/') + 1)
const PUT_CONTROL_CHOLRATE = PUT_DISINFECTION_CONTROL_CHOLRATE.substr(PUT_DISINFECTION_CONTROL_CHOLRATE.indexOf('/') + 1)
const SET_MODIFYED_FROM_LATEST = "setModifyedFromLatest"
const PROCESS_STEP = 1
import { CLOSE_AI_MODE_DIALOG } from '@/store/modules/dialog'

export default {
  namespaced: true,
  state: {
    processStep: 1,
    isModifyMode: false,
    isPopupModifyMode: false,
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
      //ai_g_1_chlorination: null, //차염A(전차염) 예측주입률 --> 분석서에는 차염 예측 주입률이 없음
      //ai_g_2_chlorination: null, //차염B(중차염) 예측주입률 --> 분석서에는 차염 예측 주입률이 없음
      //ai_g_3_chlorination: null, //차염C(후차염) 예측주입률 --> 분석서에는 차염 예측 주입률이 없음
      //ai_g_4_chlorination: null, //차염D 예측주입률         --> 분석서에는 차염 예측 주입률이 없음
      ai_g_pre_chol: null,  //전염소 예측 주입률
      ai_g_peri_chol: null, //중염소 예측 주입률
      ai_g_post_chol: null, //후염소 예측 주입률
      ai_g_ser_inr: null,
      g_pre_corrected: null,  //차염A(전차염) 염소주입률 보정상수
      g_peri_corrected: null, //차염B(중차염) 염소주입률 보정상수
      g_post_corrected: null, //차염C(후차염) 염소주입률 보정상수
      g_d_corrected: null,    //차염D(예비) 염소주입률 보정상수
      g_pre_set_max: null,                 //전차염 주입률 상한
      g_pre_set_min: null,                 //전차염 주입률 하한
      g_pre_calib_cycle: null,             //전차염 보정 주기
      g_pre_chg_limit_for_onetime: null,   //전차염 1회 변경 주입률
      g_e_obj_residual_cl: null,            //전차염 목표 혼화지 잔류염소
      g_pre_max_limit_0: null,
      g_pre_max_limit_1: null,
      g_pre_max_limit_2: null,
      g_pre_max_limit_3: null,
      g_pre_max_limit_4: null,
      g_pre_max_limit_5: null,
      g_pre_max_limit_6: null,
      g_pre_max_limit_7: null,
      g_pre_max_limit_8: null,
      g_pre_max_limit_9: null,
      g_pre_max_limit_10: null,
      g_pre_max_limit_11: null,
      g_pre_max_limit_12: null,
      g_pre_max_limit_13: null,
      g_pre_max_limit_14: null,
      g_pre_max_limit_15: null,
      g_pre_max_limit_16: null,
      g_pre_max_limit_17: null,
      g_pre_max_limit_18: null,
      g_pre_max_limit_19: null,
      g_pre_max_limit_20: null,
      g_pre_max_limit_21: null,
      g_pre_max_limit_22: null,
      g_pre_max_limit_23: null,
      g_pre_min_limit_0: null,
      g_pre_min_limit_1: null,
      g_pre_min_limit_2: null,
      g_pre_min_limit_3: null,
      g_pre_min_limit_4: null,
      g_pre_min_limit_5: null,
      g_pre_min_limit_6: null,
      g_pre_min_limit_7: null,
      g_pre_min_limit_8: null,
      g_pre_min_limit_9: null,
      g_pre_min_limit_10: null,
      g_pre_min_limit_11: null,
      g_pre_min_limit_12: null,
      g_pre_min_limit_13: null,
      g_pre_min_limit_14: null,
      g_pre_min_limit_15: null,
      g_pre_min_limit_16: null,
      g_pre_min_limit_17: null,
      g_pre_min_limit_18: null,
      g_pre_min_limit_19: null,
      g_pre_min_limit_20: null,
      g_pre_min_limit_21: null,
      g_pre_min_limit_22: null,
      g_pre_min_limit_23: null
    },
    latestModify: {
      upd_ti: null,
      pre_ai_opr: null,
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
      //ai_g_1_chlorination: null, //차염A(전차염) 예측주입률 --> 분석서에는 차염 예측 주입률이 없음
      //ai_g_2_chlorination: null, //차염B(중차염) 예측주입률 --> 분석서에는 차염 예측 주입률이 없음
      //ai_g_3_chlorination: null, //차염C(후차염) 예측주입률 --> 분석서에는 차염 예측 주입률이 없음
      //ai_g_4_chlorination: null, //차염D 예측주입률         --> 분석서에는 차염 예측 주입률이 없음
      ai_g_pre_chol: null,  //전염소 예측 주입률
      ai_g_peri_chol: null, //중염소 예측 주입률
      ai_g_post_chol: null, //후염소 예측 주입률
      ai_g_ser_inr: null,
      g_pre_corrected: null,  //차염A(전차염) 염소주입률 보정상수
      g_peri_corrected: null, //차염B(중차염) 염소주입률 보정상수
      g_post_corrected: null, //차염C(후차염) 염소주입률 보정상수
      g_d_corrected: null,    //차염D(예비) 염소주입률 보정상수
      g_pre_set_max: null,                //전차염 주입률 상한
      g_pre_set_min: null,                //전차염 주입률 하한
      g_pre_calib_cycle: null,            //전차염 보정 주기
      g_pre_chg_limit_for_onetime: null,  //전차염 1회 변경 주입률
      g_e_obj_residual_cl: null,           //전차염 목표 혼화지 잔류염소
      g_pre_max_limit_0: null,
      g_pre_max_limit_1: null,
      g_pre_max_limit_2: null,
      g_pre_max_limit_3: null,
      g_pre_max_limit_4: null,
      g_pre_max_limit_5: null,
      g_pre_max_limit_6: null,
      g_pre_max_limit_7: null,
      g_pre_max_limit_8: null,
      g_pre_max_limit_9: null,
      g_pre_max_limit_10: null,
      g_pre_max_limit_11: null,
      g_pre_max_limit_12: null,
      g_pre_max_limit_13: null,
      g_pre_max_limit_14: null,
      g_pre_max_limit_15: null,
      g_pre_max_limit_16: null,
      g_pre_max_limit_17: null,
      g_pre_max_limit_18: null,
      g_pre_max_limit_19: null,
      g_pre_max_limit_20: null,
      g_pre_max_limit_21: null,
      g_pre_max_limit_22: null,
      g_pre_max_limit_23: null,
      g_pre_min_limit_0: null,
      g_pre_min_limit_1: null,
      g_pre_min_limit_2: null,
      g_pre_min_limit_3: null,
      g_pre_min_limit_4: null,
      g_pre_min_limit_5: null,
      g_pre_min_limit_6: null,
      g_pre_min_limit_7: null,
      g_pre_min_limit_8: null,
      g_pre_min_limit_9: null,
      g_pre_min_limit_10: null,
      g_pre_min_limit_11: null,
      g_pre_min_limit_12: null,
      g_pre_min_limit_13: null,
      g_pre_min_limit_14: null,
      g_pre_min_limit_15: null,
      g_pre_min_limit_16: null,
      g_pre_min_limit_17: null,
      g_pre_min_limit_18: null,
      g_pre_min_limit_19: null,
      g_pre_min_limit_20: null,
      g_pre_min_limit_21: null,
      g_pre_min_limit_22: null,
      g_pre_min_limit_23: null
    },
    pre_evaporation: {
      series1: null
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
      if (state.isModifyMode === false && state.isPopupModifyMode === false) {
        state.latestModify = Object.assign({}, data)
      }
    },
    [SET_MODIFYED_FROM_LATEST]: function (state) {
      state.latestModify = Object.assign({}, state.latest)
    },
    [PUT_HISTORY_EVAPORATION]: function (state, data) {
      state.pre_evaporation = data
    },
    [PUT_CONTROL_CHOLRATE]: function (state, data) {
      state.latest.g_pre_max_limit_0 = data.g_pre_max_limit_0
      state.latest.g_pre_max_limit_1 = data.g_pre_max_limit_1
      state.latest.g_pre_max_limit_2 = data.g_pre_max_limit_2
      state.latest.g_pre_max_limit_3 = data.g_pre_max_limit_3
      state.latest.g_pre_max_limit_4 = data.g_pre_max_limit_4
      state.latest.g_pre_max_limit_5 = data.g_pre_max_limit_5
      state.latest.g_pre_max_limit_6 = data.g_pre_max_limit_6
      state.latest.g_pre_max_limit_7 = data.g_pre_max_limit_7
      state.latest.g_pre_max_limit_8 = data.g_pre_max_limit_8
      state.latest.g_pre_max_limit_9 = data.g_pre_max_limit_9
      state.latest.g_pre_max_limit_10 = data.g_pre_max_limit_10
      state.latest.g_pre_max_limit_11 = data.g_pre_max_limit_11
      state.latest.g_pre_max_limit_12 = data.g_pre_max_limit_12
      state.latest.g_pre_max_limit_13 = data.g_pre_max_limit_13
      state.latest.g_pre_max_limit_14 = data.g_pre_max_limit_14
      state.latest.g_pre_max_limit_15 = data.g_pre_max_limit_15
      state.latest.g_pre_max_limit_16 = data.g_pre_max_limit_16
      state.latest.g_pre_max_limit_17 = data.g_pre_max_limit_17
      state.latest.g_pre_max_limit_18 = data.g_pre_max_limit_18
      state.latest.g_pre_max_limit_19 = data.g_pre_max_limit_19
      state.latest.g_pre_max_limit_20 = data.g_pre_max_limit_20
      state.latest.g_pre_max_limit_21 = data.g_pre_max_limit_21
      state.latest.g_pre_max_limit_22 = data.g_pre_max_limit_22
      state.latest.g_pre_max_limit_23 = data.g_pre_max_limit_23
      state.latest.g_pre_min_limit_0 = data.g_pre_min_limit_0
      state.latest.g_pre_min_limit_1 = data.g_pre_min_limit_1
      state.latest.g_pre_min_limit_2 = data.g_pre_min_limit_2
      state.latest.g_pre_min_limit_3 = data.g_pre_min_limit_3
      state.latest.g_pre_min_limit_4 = data.g_pre_min_limit_4
      state.latest.g_pre_min_limit_5 = data.g_pre_min_limit_5
      state.latest.g_pre_min_limit_6 = data.g_pre_min_limit_6
      state.latest.g_pre_min_limit_7 = data.g_pre_min_limit_7
      state.latest.g_pre_min_limit_8 = data.g_pre_min_limit_8
      state.latest.g_pre_min_limit_9 = data.g_pre_min_limit_9
      state.latest.g_pre_min_limit_10 = data.g_pre_min_limit_10
      state.latest.g_pre_min_limit_11 = data.g_pre_min_limit_11
      state.latest.g_pre_min_limit_12 = data.g_pre_min_limit_12
      state.latest.g_pre_min_limit_13 = data.g_pre_min_limit_13
      state.latest.g_pre_min_limit_14 = data.g_pre_min_limit_14
      state.latest.g_pre_min_limit_15 = data.g_pre_min_limit_15
      state.latest.g_pre_min_limit_16 = data.g_pre_min_limit_16
      state.latest.g_pre_min_limit_17 = data.g_pre_min_limit_17
      state.latest.g_pre_min_limit_18 = data.g_pre_min_limit_18
      state.latest.g_pre_min_limit_19 = data.g_pre_min_limit_19
      state.latest.g_pre_min_limit_20 = data.g_pre_min_limit_20
      state.latest.g_pre_min_limit_21 = data.g_pre_min_limit_21
      state.latest.g_pre_min_limit_22 = data.g_pre_min_limit_22
      state.latest.g_pre_min_limit_23 = data.g_pre_min_limit_23
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

    /**
     * 전차염 증발량 예측 비교 트렌드 조회
     */
    [PUT_HISTORY_EVAPORATION]: async function ({ commit }, { selectedDisinfectionIndex }) {
      // FIXME 하위 6개 주석 라인 운영반영시 주석해제
      let yesterDayTimestamp = new Date().getTime() - 1000 * 60 * 60 * 24
      let yesterDay = new Date(yesterDayTimestamp)
      let year = yesterDay.getFullYear()
      let month = yesterDay.getMonth()
      let day = yesterDay.getDate()
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_HISTORY_EVAPORATION}/1/`+ selectedDisinfectionIndex, { 'start_time': new Date(year, month, day, 0, 0, 0).toISOString(), 'end_time': new Date().toISOString() })
      // await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_HISTORY_EVAPORATION}/1/`+ selectedDisinfectionIndex, { 'start_time': new Date('2013-09-03 00:00:00').toISOString(), 'end_time': new Date('2013-09-04 23:59:59').toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_EVAPORATION, data.pre_evaporation)
        })
        .catch(error => {
          util.printError(error)
        })
    },

    /**
     * 전차염 AI 운영모드 변경 제어
     */
    [PUT_CONTROL_OPERATION_PRE]: async function ({ commit }, { operation, processStep, selectedDisinfectionIndex }) {
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_OPERATION_PRE}/` + processStep + '/'+selectedDisinfectionIndex, { 'operation': operation })
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
     * g_pre_set_max                : 전차염 주입률 상한
     * g_pre_set_min                : 전차염 주입률 하한
     * g_pre_calib_cycle            : 보정 주기
     * g_pre_chg_limit_for_onetime  : 1회 변경 주입률
     * g_e_obj_residual_cl          : 침전지 목표 잔류염소
     */
    [PUT_CONTROL_PRE]: async function ({ commit }, { 
        g_pre_set_max, 
        g_pre_set_min,
        g_pre_calib_cycle, 
        g_pre_chg_limit_for_onetime, 
        g_e_obj_residual_cl,
        processStep, 
        selectedDisinfectionIndex
       }) {
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_PRE}/` + processStep + '/' + selectedDisinfectionIndex, { 
        g_pre_set_max, 
        g_pre_set_min,
        g_pre_calib_cycle, 
        g_pre_chg_limit_for_onetime, 
        g_e_obj_residual_cl
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
    },
    [PUT_CONTROL_CHOLRATE]: async function ({ commit }, data) { // eslint-disable-line no-unused-vars
      await axios.put(`${DEV_SERVER}/${URL.DISINFECTION_CONTROL_CHOLRATE}`, data)
      .then(() => {
        commit(PUT_CONTROL_CHOLRATE, data)
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
    },
  }
}