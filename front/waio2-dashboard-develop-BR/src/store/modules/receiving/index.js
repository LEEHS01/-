// 착수 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

export const URL = {
  RECEIVING_LATEST: 'receiving/latest',
  RECEIVING_HISTORY_FLOW_OUT: 'receiving/history/fr/out',
  RECEIVING_CONTROL_OPERATION: 'receiving/control/operation',
  RECEIVING_CONTROL_LEVEL: 'receiving/control/le',
}
export const GET_RECEIVING_LATEST = URL.RECEIVING_LATEST + '/get'
export const PUT_RECEIVING_HISTORY_FLOW_OUT = URL.RECEIVING_HISTORY_FLOW_OUT + '/put'
export const PUT_RECEIVING_CONTROL_OPERATION = URL.RECEIVING_CONTROL_OPERATION + '/put'
export const PUT_RECEIVING_CONTROL_LEVEL = URL.RECEIVING_CONTROL_LEVEL + '/put'
const GET_LATEST = GET_RECEIVING_LATEST.substr(GET_RECEIVING_LATEST.indexOf('/') + 1)
const PUT_HISTORY_FLOW_OUT = PUT_RECEIVING_HISTORY_FLOW_OUT.substr(PUT_RECEIVING_HISTORY_FLOW_OUT.indexOf('/') + 1)
const PUT_CONTROL_OPERATION = PUT_RECEIVING_CONTROL_OPERATION.substr(PUT_RECEIVING_CONTROL_OPERATION.indexOf('/') + 1)
const PUT_CONTROL_LEVEL = PUT_RECEIVING_CONTROL_LEVEL.substr(PUT_RECEIVING_CONTROL_LEVEL.indexOf('/') + 1)
const SET_MODIFYED_FROM_LATEST = "setModifyedFromLatest"
const PROCESS_STEP = 1

import { CLOSE_AI_MODE_DIALOG } from '@/store/modules/dialog'

export default {
  namespaced: true,
  state: {
    processStep: 1,
    isModifyMode: false,
    latest: {
      upd_ti: null,
      ai_opr: null,
      ems_mode: null,
      h_target_le_max: null,
      h_target_le_min: null,
      b_in_fr: null,
      b_in_fr_q: null,
      ai_b_in_fr: null,
      //ai_b1_in_fr: null,
      //ai_b2_in_fr: null,
      ai_b_in_fr_trd: null,
      b_in_pr: null,
      b1_vv_po: null,
      b2_vv_po: null,
      b1_out_fr: null,
      b2_out_fr: null,
      ai_b1_vv_po: null,
      ai_b2_vv_po: null,
      h_location_le1: null,
      h_location_le2: null,
      h_location_le3: null,
      h_location_le4: null,
      h_out_fr: null, //보령(정) 유출유량 순시 value
      ai_h_out_fr: null,
      b_valve_gv_pwr: null,
      b_valve_gv_uplmt: null,
      b_valve_gv_lolmt: null,
      b_valve_bypass_uplmt: null,
      b_valve_bypass_lolmt: null,
      //260226 이현수 착수공정후처리 위한 ui 수정 작업
      // 알파값 및 실행주기 추가
      b_pred_friout_correction_ratio_factor: null,  // 알파값
      b_process_period_sec: null                     // 실행주기
    },
    latestModify: {
      upd_ti: null,
      ai_opr: null,
      ems_mode: null,
      h_target_le_max: null,
      h_target_le_min: null,
      b_in_fr: null,
      b_in_fr_q: null,
      ai_b_in_fr: null,
      //ai_b1_in_fr: null,
      //ai_b2_in_fr: null,
      ai_b_in_fr_trd: null,
      b_in_pr: null,
      b1_vv_po: null,
      b2_vv_po: null,
      b1_out_fr: null,
      b2_out_fr: null,
      ai_b1_vv_po: null,
      ai_b2_vv_po: null,
      h_location_le1: null,
      h_location_le2: null,
      h_location_le3: null,
      h_location_le4: null,
      h_out_fr: null, //보령(정) 유출유량 순시 value
      ai_h_out_fr: null,
      b_valve_gv_pwr: null,
      b_valve_gv_uplmt: null,
      b_valve_gv_lolmt: null,
      b_valve_bypass_uplmt: null,
      b_valve_bypass_lolmt: null,
      //260226 이현수 착수공정후처리 위한 ui 수정 작업
      // 알파값 및 실행주기 추가
      b_pred_friout_correction_ratio_factor: null,  // 알파값
      b_process_period_sec: null                     // 실행주기
    },
    out_fr: {
      series1: null
    }
  },
  getters: {
  },
  mutations: {
    [GET_LATEST]: function(state, data) {
      state.latest = data
      const fixed_h_target_le_max = data.h_target_le_max.toFixed(1)
      const fixed_h_target_le_min = data.h_target_le_min.toFixed(1)
      const fixed_b_valve_gv_max = data.b_valve_gv_max.toFixed(1)
      const fixed_b_valve_gv_min = data.b_valve_gv_min.toFixed(1)
      const fixed_b_valve_bypass_max = data.b_valve_bypass_max.toFixed(1)
      const fixed_b_valve_bypass_min = data.b_valve_bypass_min.toFixed(1)
      const fixed_b_valve_gv_pwr = data.b_valve_gv_pwr.toFixed(0)
      const fixed_b_valve_gv_uplmt = data.b_valve_gv_uplmt.toFixed(0)
      const fixed_b_valve_gv_lolmt = data.b_valve_gv_lolmt.toFixed(0)
      const fixed_b_valve_bypass_uplmt = data.b_valve_bypass_uplmt.toFixed(0)
      const fixed_b_valve_bypass_lolmt = data.b_valve_bypass_lolmt.toFixed(0)
      //260226 이현수 착수공정후처리 위한 ui 수정 작업
      // 알파값 및 실행주기 추가
      const fixed_b_pred_friout_correction_ratio_factor = data.b_pred_friout_correction_ratio_factor != null ? data.b_pred_friout_correction_ratio_factor : 0
      const fixed_b_process_period_sec = data.b_process_period_sec != null ? data.b_process_period_sec.toFixed(0) : 0
      const Fixed = {
        h_target_le_max: fixed_h_target_le_max,
        h_target_le_min: fixed_h_target_le_min,
        b_valve_gv_max: fixed_b_valve_gv_max,
        b_valve_gv_min: fixed_b_valve_gv_min,
        b_valve_bypass_max: fixed_b_valve_bypass_max,
        b_valve_bypass_min: fixed_b_valve_bypass_min,
        b_valve_gv_pwr: fixed_b_valve_gv_pwr,
        b_valve_gv_uplmt: fixed_b_valve_gv_uplmt,
        b_valve_gv_lolmt: fixed_b_valve_gv_lolmt,
        b_valve_bypass_uplmt: fixed_b_valve_bypass_uplmt,
        b_valve_bypass_lolmt: fixed_b_valve_bypass_lolmt,
        //260226 이현수 착수공정후처리 위한 ui 수정 작업
        // 알파값 및 실행주기 추가
        b_pred_friout_correction_ratio_factor: fixed_b_pred_friout_correction_ratio_factor,
        b_process_period_sec: fixed_b_process_period_sec
      }
      state.latest = Object.assign(state.latest, Fixed)
      if (state.isModifyMode === false) {
        state.latestModify = Object.assign({}, Fixed)
      }
    },
    [SET_MODIFYED_FROM_LATEST]: function (state) {
      state.latestModify = Object.assign({}, state.latest)
    },
    [PUT_HISTORY_FLOW_OUT]: function(state, data) {
      state.out_fr.series1 = data.out_fr.series1
    },
    [PUT_CONTROL_OPERATION]: function (state, data) {
      state.latest.ai_opr = data
    }
  },
  actions: {

    [GET_LATEST]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.RECEIVING_LATEST}/`+ PROCESS_STEP)
        .then(({ data }) => {
          commit(GET_LATEST, data.latest)
        })
        .catch(error => {
          util.printError(error)
        })
    },

    //정수지 유출 유량 차트 그래프 데이터 조회
    [PUT_HISTORY_FLOW_OUT]: async function ({ commit }) {
      // FIXME 하위 아래 3개 라인 주석 해제
      let nowTimestamp = Date.now()
      // nowTimestamp = Date.parse("2013-9-4 10:00:00"); // FIXME 현재 날짜 수정
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      await axios.put(`${DEV_SERVER}/${URL.RECEIVING_HISTORY_FLOW_OUT}/` + PROCESS_STEP, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
      // await axios.put(`${DEV_SERVER}/${URL.RECEIVING_HISTORY_FLOW_OUT}/` + PROCESS_STEP, { 'start_time': new Date('2022-12-23 00:00:00').toISOString(), 'end_time': new Date('2022-12-30 23:59:59').toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_FLOW_OUT, data)
        })
        .catch(error => {
          util.printError(error)
        })
    },

    [PUT_CONTROL_OPERATION]: async function ({ commit }, { operation }) {
      await axios.put(`${DEV_SERVER}/${URL.RECEIVING_CONTROL_OPERATION}/`+ PROCESS_STEP, { 'operation': operation })
      .then(() => {
        commit('dialog/'+ CLOSE_AI_MODE_DIALOG, null, { root: true })
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
      })
    },
    //260226 이현수 착수공정후처리 위한 ui 수정 작업
    // 알파값 및 실행주기 추가
   /* [PUT_CONTROL_LEVEL]: async function ({ commit }, { h_target_le_max, h_target_le_min, b_valve_gv_max, b_valve_gv_min, b_valve_bypass_max, b_valve_bypass_min, b_valve_gv_pwr, b_valve_gv_uplmt, b_valve_gv_lolmt, b_valve_bypass_uplmt, b_valve_bypass_lolmt }) {
      await axios.put(`${DEV_SERVER}/${URL.RECEIVING_CONTROL_LEVEL}/` + PROCESS_STEP, { h_target_le_max, h_target_le_min, b_valve_gv_max, b_valve_gv_min, b_valve_bypass_max, b_valve_bypass_min, b_valve_gv_pwr, b_valve_gv_uplmt, b_valve_gv_lolmt, b_valve_bypass_uplmt, b_valve_bypass_lolmt })*/
      [PUT_CONTROL_LEVEL]: async function ({ commit }, { h_target_le_max, h_target_le_min, b_valve_gv_max, b_valve_gv_min, b_valve_bypass_max, b_valve_bypass_min, b_valve_gv_pwr, b_valve_gv_uplmt, b_valve_gv_lolmt, b_valve_bypass_uplmt, b_valve_bypass_lolmt, b_pred_friout_correction_ratio_factor, b_process_period_sec }) {
      await axios.put(`${DEV_SERVER}/${URL.RECEIVING_CONTROL_LEVEL}/` + PROCESS_STEP, { h_target_le_max, h_target_le_min, b_valve_gv_max, b_valve_gv_min, b_valve_bypass_max, b_valve_bypass_min, b_valve_gv_pwr, b_valve_gv_uplmt, b_valve_gv_lolmt, b_valve_bypass_uplmt, b_valve_bypass_lolmt, b_pred_friout_correction_ratio_factor, b_process_period_sec })
      .then(() => {
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다.'
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