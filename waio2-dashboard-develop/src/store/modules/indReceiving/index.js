// 1차 착수 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

export const URL = {
  RECEIVING_LATEST: 'receiving/latest',
  RECEIVING_HISTORY_FLOW_OUT: 'receiving/history/fr/out',
  RECEIVING_CONTROL_OPERATION: 'receiving/control/operation',
  RECEIVING_CONTROL: 'receiving/control',
}
export const GET_INDRECEIVING_LATEST = 'indReceiving/latest' + '/get'
export const PUT_RECEIVING_HISTORY_FLOW_OUT = 'indReceiving' + '/put'
export const PUT_INDRECEIVING_CONTROL_OPERATION = 'indReceiving/control/operation' + '/put'
export const PUT_RECEIVING_CONTROL = 'indReceiving/control/le' + '/put'
const GET_LATEST = GET_INDRECEIVING_LATEST.substr(GET_INDRECEIVING_LATEST.indexOf('/') + 1)
const PUT_HISTORY_FLOW_OUT = PUT_RECEIVING_HISTORY_FLOW_OUT.substr(PUT_RECEIVING_HISTORY_FLOW_OUT.indexOf('/') + 1)
const PUT_CONTROL_OPERATION = PUT_INDRECEIVING_CONTROL_OPERATION.substr(PUT_INDRECEIVING_CONTROL_OPERATION.indexOf('/') + 1)
const PUT_CONTROL = PUT_RECEIVING_CONTROL.substr(PUT_RECEIVING_CONTROL.indexOf('/') + 1)
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
      b_in_fr_i: null,
      b_in_fr_q: null,
      ai_b_in_fri: null,
      ai_b2_in_fr: null,
      ai_b_in_fr_rtd: null,
      b_in_pr: null,
      b_vv_po: null,
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
      h_out_fr: null,
      ai_h_out_fr: null,
      ai_b_out_fr_rtd: null,
      b_valve_max: null,
      b_valve_min: null,
    },
    latestModify: {
      upd_ti: null,
      ai_opr: null,
      ems_mode: null,
      h_target_le_max: null,
      h_target_le_min: null,
      b_in_fr_i: null,
      b_in_fr_q: null,
      ai_b_in_fri: null,
      ai_b2_in_fr: null,
      ai_b_in_fr_rtd: null,
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
      h_out_fr: null,
      ai_h_out_fr: null,
      ai_b_out_fr_rtd: null,
      b_valve_max: null,
      b_valve_min: null,
    },
    out_fr: {
      series1: null,
      series2: null
    }
  },
  getters: {
  },
  mutations: {
    [GET_LATEST]: function(state, data) {
      state.latest = data
      const fixed_h_target_le_max = data.h_target_le_max.toFixed(1)
      const fixed_h_target_le_min = data.h_target_le_min.toFixed(1)
      const fixed_b_valve_max = data.b_valve_max.toFixed(1)
      const fixed_b_valve_min = data.b_valve_min.toFixed(1)
      const Fixed = {
        h_target_le_max: fixed_h_target_le_max,
        h_target_le_min: fixed_h_target_le_min,
        b_valve_max: fixed_b_valve_max,
        b_valve_min: fixed_b_valve_min,
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
      state.out_fr.series2 = data.out_fr.series2
    },
    [PUT_CONTROL_OPERATION]: function (state, data) {
      state.latest.ai_opr = data
    }
  },
  actions: {
    [GET_LATEST]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.RECEIVING_LATEST}/${PROCESS_STEP}`)
        .then(({ data }) => {
          commit(GET_LATEST, data.latest)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_HISTORY_FLOW_OUT]: async function ({ commit }) {
      let nowTimestamp = Date.now()
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      await axios.put(`${DEV_SERVER}/${URL.RECEIVING_HISTORY_FLOW_OUT}/${PROCESS_STEP}`, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_FLOW_OUT, data)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_CONTROL_OPERATION]: async function ({ commit }, { operation }) {
      await axios.put(`${DEV_SERVER}/${URL.RECEIVING_CONTROL_OPERATION}/${PROCESS_STEP}`, { 'operation': operation })
      .then(() => {
        // commit(PUT_CONTROL_OPERATION, operation)
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
    [PUT_CONTROL]: async function ({ commit }, { h_target_le_max, h_target_le_min, b_valve_max, b_valve_min  }) {
      await axios.put(`${DEV_SERVER}/${URL.RECEIVING_CONTROL}/${PROCESS_STEP}`, { h_target_le_max, h_target_le_min, b_valve_max, b_valve_min  })
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