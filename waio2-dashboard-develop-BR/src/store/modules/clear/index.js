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
const PROCESS_STEP = 1
export default {
  namespaced: true,
  state: {
    out_fr: null,
    le: {
      location1: null,
      location2: null,
      location3: null,
      h_bnd_uplmt: null,
      h_bnd_lolmt: null
    },
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

    //착수 > 정수지 수위 밴드 차트 데이터 조회 (범위 및 수위 데이터)
    [PUT_HISTORY_LEVEL]: async function ({ commit }) {
      // FIXME 하위 아래 5개 라인 주석 해제
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth()
      let day = now.getDate()
      await axios.put(`${DEV_SERVER}/${URL.CLEAR_HISTORY_LEVEL}/`+ PROCESS_STEP, { 'start_time': new Date(year, month, day, 0, 0, 0).toISOString(), 'end_time': new Date(year, month, day, 23, 59, 59).toISOString() })
      // await axios.put(`${DEV_SERVER}/${URL.CLEAR_HISTORY_LEVEL}/`+ PROCESS_STEP, { 'start_time': new Date('2022-12-23 00:00:00').toISOString(), 'end_time': new Date('2022-12-30 23:59:59').toISOString() })
          .then(({ data }) => {
            commit(PUT_HISTORY_LEVEL, data)
          })
          .catch(error => {
            util.printError(error)
          })
    },
    // 후차염 정수지 잔류염소 그래프 데이터
    [PUT_HISTORY_CL]: async function ({ commit }, { selectedDisinfectionIndex }) {
      // FIXME 현재 날짜 수정
      let nowTimestamp = Date.now()
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      await axios.put(`${DEV_SERVER}/${URL.CLEAR_HISTORY_CL}/1/` + selectedDisinfectionIndex, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
      // await axios.put(`${DEV_SERVER}/${URL.CLEAR_HISTORY_CL}/1/` + selectedDisinfectionIndex, { 'start_time': new Date('2023-11-27 00:00:00').toISOString(), 'end_time': new Date('2023-11-27 23:59:59').toISOString() })
          .then(({ data }) => {
            commit(PUT_HISTORY_CL, data)
          })
          .catch(error => {
            util.printError(error)
          })
    }
  }
}