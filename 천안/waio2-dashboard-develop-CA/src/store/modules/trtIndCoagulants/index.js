// 약품 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

export const URL = {
  COAGULANTS_CLUSTER: 'coagulants/cluster',
  COAGULANTS_RAWWATER: 'coagulants/rawwater',
  COAGULANTS_CONTROL_OPERATION: 'coagulants/control/operation',
  COAGULANT_LATEST: 'coagulants/latest',
  COAGULANT_SIMULATION: 'coagulants/simulation',
  COAGULANT_CONTROL_AI: 'coagulants/control/ai',
  COAGULANT_CONTROL_COAGULANT: 'coagulants/control/coagulant',
  COAGULANT_CONTROL_USER_CORRECT: 'coagulants/control/userCorrect'
}
export const GET_COAGULANTS_CLUSTER = 'trtIndCoagulants/cluster/get'
export const GET_COAGULANTS_RAWWATER = 'trtIndCoagulants/rawwater/get'
export const PUT_COAGULANTS_RAWWATER = 'trtIndCoagulants/rawwater/put'
export const PUT_TRTINDCOAGULANTS_CONTROL_OPERATION = 'trtIndCoagulants/control/operation/put'
export const GET_TRTINDCOAGULANT_LATEST = 'trtIndCoagulants/get'
export const PUT_COAGULANT_SIMULATION = URL.COAGULANT_SIMULATION + '/put'
export const POST_COAGULANT_SIMULATION = URL.COAGULANT_SIMULATION + '/post'
export const PUT_COAGULANT_CONTROL_AI = 'trtIndCoagulants/control/ai/put'
export const PUT_COAGULANT_CONTROL_COAGULANT = 'trtIndCoagulants/control/coagulant/put'
export const PUT_COAGULANT_CONTROL_USER_CORRECT = 'trtIndCoagulants/control/userCorrect/put'
const GET_CLUSTER = GET_COAGULANTS_CLUSTER.substr(GET_COAGULANTS_CLUSTER.indexOf('/') + 1)
const GET_RAWWATER = GET_COAGULANTS_RAWWATER.substr(GET_COAGULANTS_RAWWATER.indexOf('/') + 1)
const PUT_RAWWATER = PUT_COAGULANTS_RAWWATER.substr(PUT_COAGULANTS_RAWWATER.indexOf('/') + 1)
const PUT_CONTROL_OPERATION = PUT_TRTINDCOAGULANTS_CONTROL_OPERATION.substr(PUT_TRTINDCOAGULANTS_CONTROL_OPERATION.indexOf('/') + 1)
const GET_LATEST = GET_TRTINDCOAGULANT_LATEST.substr(GET_TRTINDCOAGULANT_LATEST.indexOf('/') + 1)
const PUT_SIMULATION = PUT_COAGULANT_SIMULATION.substr(PUT_COAGULANT_SIMULATION.indexOf('/') + 1)
const POST_SIMULATION = POST_COAGULANT_SIMULATION.substr(POST_COAGULANT_SIMULATION.indexOf('/') + 1)
const PUT_CONTROL_AI = PUT_COAGULANT_CONTROL_AI.substr(PUT_COAGULANT_CONTROL_AI.indexOf('/') + 1)
const PUT_CONTROL_COAGULANT = PUT_COAGULANT_CONTROL_COAGULANT.substr(PUT_COAGULANT_CONTROL_COAGULANT.indexOf('/') + 1)
const PUT_CONTROL_USER_CORRECT = PUT_COAGULANT_CONTROL_USER_CORRECT.substr(PUT_COAGULANT_CONTROL_USER_CORRECT.indexOf('/') + 1)
const OPEN_POPUP = 'OPEN_POPUP'
const CLOSE_POPUP = 'CLOSE_POPUP'
const SET_MODIFYED_FROM_LATEST = "setModifyedFromLatest"
const PROCESS_STEP = 3

import { CLOSE_AI_MODE_DIALOG } from '@/store/modules/dialog'
export default {
  namespaced: true,
  state: {
    isModifyMode: false,
    isCoagulantsModifyMode: false,
    isModifyModeUser: false,
    latest: {
      log_time: null,
      start_time: null,
      end_time: null,
      reg_time: null,
      c_cf_max: null,
      c_cf_min: null,
      water_purification: null,
      cluster_id: null,
      chemical1: null,
      injection1_percent: null,
      injection1_ai: null,
      injection1_revision: null,
      injection1_amount: null,
      d1_fr: null,
      chemical2: null,
      injection2_percent: null,
      injection2_ai: null,
      injection2_revision: null,
      injection2_amount: null,
      d2_fr: null,
      tb: null,
      ph: null,
      te: null,
      cu: null,
      total_count: null,
      collect_count: null,
      available_count: null,
      error_count: null,
      missing_count: null,
      c3_cf_coagulant: null,
      c_user_correct: null,
      ai_c_cf_norm_co: null,
      c_user_tb_e: null
    },
    latestModify: {
      log_time: null,
      start_time: null,
      end_time: null,
      reg_time: null,
      c_cf_max: null,
      c_cf_min: null,
      water_purification: null,
      cluster_id: null,
      chemical1: null,
      injection1_percent: null,
      injection1_ai: null,
      injection1_revision: null,
      injection1_amount: null,
      d1_fr: null,
      chemical2: null,
      injection2_percent: null,
      injection2_ai: null,
      injection2_revision: null,
      injection2_amount: null,
      d2_fr: null,
      tb: null,
      ph: null,
      te: null,
      cu: null,
      total_count: null,
      collect_count: null,
      available_count: null,
      error_count: null,
      missing_count: null,
      c3_cf_coagulant: null,
      c_user_correct: null,
      ai_c_cf_norm_co: null,
      c_user_tb_e: null
    },
    cluster_info: null,
    popup: {
      visible: false,
      class_info: null,
    },
    class_info: null,
    simulation: {
      b_tb: '',
      b_ph: '',
      b_te: '',
      b_cu: '',
      b_in_fr: '',
      e1_tb: '',
      e2_tb: '',
      ai_c1_cf: '',
      ai_c1_cf_coagulant: '',
      ai_c2_cf: '',
      ai_c2_cf_coagulant: '',
      searchList: [],
      formattedStartTime: null,
      formmatedEndTime: null,
      startTime: null,
      endTime: null
    },
  },
  getters: {
  },
  mutations: {
    [GET_LATEST]: function(state, data) {
      state.latest = data
      const fixed_c_cf_max = data.c_cf_max.toFixed(2)
      const fixed_c_cf_min = data.c_cf_min.toFixed(2)
      const fixed_c_user_correct = data.c_user_correct.toFixed(2)
      const fixed_c_user_tb_e = data.c_user_tb_e.toFixed(2)
      const Fixed = {
        c_cf_max: fixed_c_cf_max,
        c_cf_min: fixed_c_cf_min,
        c1_cf_coagulant: data.c1_cf_coagulant,
        c2_cf_coagulant: data.c2_cf_coagulant,
        c3_cf_coagulant: data.c3_cf_coagulant,
        c_user_correct: fixed_c_user_correct,
        c_user_tb_e: fixed_c_user_tb_e,
      }
      state.latest = Object.assign(state.latest, Fixed)
      if (state.isModifyMode === false) {
        state.latestModify = Object.assign({}, Fixed)
      }
    },
    [SET_MODIFYED_FROM_LATEST]: function (state) {
      const fixed_c_cf_max = state.latest.c_cf_max.toFixed(2)
      const fixed_c_cf_min = state.latest.c_cf_min.toFixed(2)
      const fixed_c_user_correct = state.latest.c_user_correct.toFixed(2)
      const fixed_c_user_tb_e = state.latest.c_user_tb_e.toFixed(2)
      const Fixed = {
        c_cf_max: fixed_c_cf_max,
        c_cf_min: fixed_c_cf_min,
        c1_cf_coagulant: state.latest.c1_cf_coagulant,
        c2_cf_coagulant: state.latest.c2_cf_coagulant,
        c3_cf_coagulant: state.latest.c3_cf_coagulant,
        c_user_correct: fixed_c_user_correct,
        c_user_tb_e: fixed_c_user_tb_e,
      }
      state.latestModify = Object.assign(state.latest, Fixed)
    },
    [GET_CLUSTER]: function(state, data) {
      state.cluster_info = data
    },
    [GET_RAWWATER]: function(state, data) {
      state.class_info = data
      state.popup.class_info = data
      if (state.class_info.length > 0) {
        state.class_info.map(it => {
          it.isModify = false
        })
        state.popup.class_info.map(it => {
          it.isModify = false
        })
      }
    },
    [PUT_RAWWATER]: function(state, data) {
      console.log(data)
    },
    [OPEN_POPUP]: function(state) {
      state.popup.visible = true
    },
    [CLOSE_POPUP]: function(state) {
      state.popup.visible = false
    },
    [PUT_CONTROL_OPERATION]: function (state, data) {
      state.latest.ai_opr = data
    },
    [PUT_SIMULATION]: function (state, data) {
      state.simulation.searchList = data
    },
    [PUT_CONTROL_COAGULANT]: function (state, c3_cf_coagulant){
      state.latest.c3_cf_coagulant = c3_cf_coagulant
    }
  },
  actions: {
    [GET_LATEST]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/`+ 'coagulant/latest/' + PROCESS_STEP)
        .then(({ data }) => {
          commit(GET_LATEST, data.latest)
          console.log('coagulant_latest', data.latest)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [GET_CLUSTER]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.COAGULANTS_CLUSTER}`)
        .then(({ data }) => {
          commit(GET_CLUSTER, data.cluster_info)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [GET_RAWWATER]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.COAGULANTS_RAWWATER}/` + PROCESS_STEP)
        .then(({ data }) => {
          commit(GET_RAWWATER, data.class_info)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_RAWWATER]: async function ({ commit }, {class_index, description, tb, ph, te, cu}) {
      await axios.put(`${DEV_SERVER}/${URL.COAGULANTS_RAWWATER}/${class_index}/` + PROCESS_STEP, {description, tb, ph ,te ,cu})
        .then(({ data }) => {
          commit(PUT_RAWWATER, data)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_CONTROL_OPERATION]: async function ({ commit }, { operation }) {
      await axios.put(`${DEV_SERVER}/`+ 'coagulant/control/operation/' + PROCESS_STEP, { 'operation': operation })
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
    [PUT_SIMULATION]: async function ({ commit }, { start_time, end_time }) {
      await axios.put(`${DEV_SERVER}/`+ 'coagulant/simulation', { start_time, end_time })
      .then(({ data }) => {
        commit(PUT_SIMULATION, data.simulation)
      })
      .catch(error => {
        util.printError(error)
        commit(PUT_SIMULATION, [])
      })
    },
    [POST_SIMULATION]: async function ({ dispatch }, { b_tb, b_ph, b_te, b_cu, b_in_fr, e1_tb, e2_tb, start_time, end_time }) {
      await axios.post(`${DEV_SERVER}/`+ 'coagulant/simulation', { b_tb, b_ph, b_te, b_cu, b_in_fr, e1_tb, e2_tb })
      .then(() => {
        dispatch('coagulants/simulation/put', { start_time, end_time }, { root: true })
      })
      .catch(error => {
        util.printError(error)
      })
    },

    [PUT_CONTROL_AI]: async function ({ commit }, { c_cf_max, c_cf_min, c_user_tb_e }) {
      await axios.put(`${DEV_SERVER}/`+'coagulant/control/ai/' + PROCESS_STEP, { c_cf_max, c_cf_min, c_user_tb_e })
      .then((response) => {
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다.'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
        console.log('date', response)
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
    [PUT_CONTROL_COAGULANT]: async function ({ commit }, { c3_cf_coagulant }) {
      await axios.put(`${DEV_SERVER}/${URL.COAGULANT_CONTROL_COAGULANT}/` + PROCESS_STEP, { c3_cf_coagulant })
      .then((response) => {
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다.'
        }
        commit(PUT_CONTROL_COAGULANT, c3_cf_coagulant)
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
        console.log('date', response)
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
    [PUT_CONTROL_USER_CORRECT]: async function ({ commit }, { c_user_correct }) {
      await axios.put(`${DEV_SERVER}/${URL.COAGULANT_CONTROL_USER_CORRECT}/` + PROCESS_STEP, { c_user_correct })
      .then((response) => {
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다.'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
        console.log('date', response)
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