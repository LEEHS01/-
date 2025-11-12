// 정수지 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

export const URL = {
  CLEAR_HISTORY_FLOW_OUT: 'clear/history/fr/out',
  CLEAR_HISTORY_LEVEL: 'clear/history/le',
  CLEAR_HISTORY_CL: 'clear/history/cl'
}
export const PUT_CLEAR_HISTORY_FLOW_OUT = URL.CLEAR_HISTORY_FLOW_OUT + '/put'
export const PUT_CLEAR_HISTORY_LEVEL = URL.CLEAR_HISTORY_LEVEL + '/put'
export const PUT_CLEAR_HISTORY_CL = URL.CLEAR_HISTORY_CL + '/put'
const PUT_HISTORY_FLOW_OUT = PUT_CLEAR_HISTORY_FLOW_OUT.substr(PUT_CLEAR_HISTORY_FLOW_OUT.indexOf('/') + 1)
const PUT_HISTORY_LEVEL = PUT_CLEAR_HISTORY_LEVEL.substr(PUT_CLEAR_HISTORY_LEVEL.indexOf('/') + 1)
const PUT_HISTORY_CL = PUT_CLEAR_HISTORY_CL.substr(PUT_CLEAR_HISTORY_CL.indexOf('/') + 1)
export default {
  namespaced: true,
  state: {
    out_fr: null,
    le: null,
    h_cl: {
      in: null,
      out: null
    }
  },
  getters: {
  },
  mutations: {
    [PUT_HISTORY_FLOW_OUT]: function(state, data) {
      state.out_fr = data.out_fr
    },
    [PUT_HISTORY_LEVEL]: function(state, data) {
      state.le = data.le
    },
    [PUT_HISTORY_CL]: function(state, data) {
      state.h_cl.in = data.h_cl.in
      state.h_cl.out = data.h_cl.out
    }
  },
  actions: {
    [PUT_HISTORY_FLOW_OUT]: async function ({ commit }) {
      let nowTimestamp = Date.now()
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      await axios.put(`${DEV_SERVER}/${URL.CLEAR_HISTORY_FLOW_OUT}`, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_FLOW_OUT, data)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_HISTORY_LEVEL]: async function ({ commit }, {processStep}) {
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth()
      let day = now.getDate()
      await axios.put(`${DEV_SERVER}/${URL.CLEAR_HISTORY_LEVEL}/`+processStep, { 'start_time': new Date(year, month, day, 0, 0, 0).toISOString(), 'end_time': new Date(year, month, day, 23, 59, 59).toISOString() })
          .then(({ data }) => {
            commit(PUT_HISTORY_LEVEL, data)
          })
          .catch(error => {
            util.printError(error)
          })
    },
    [PUT_HISTORY_CL]: async function ({ commit }, obj) {
      let nowTimestamp = Date.now()
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      await axios.put(`${DEV_SERVER}/${URL.CLEAR_HISTORY_CL}/` + obj.selectedDisinfectionIndex + `/` + obj.processStep, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
          .then(({ data }) => {
            commit(PUT_HISTORY_CL, data)
          })
          .catch(error => {
            util.printError(error)
          })
    }
  }
}