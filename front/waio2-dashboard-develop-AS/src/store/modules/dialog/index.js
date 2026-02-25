import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

// dialog store
export const OPEN_AI_MODE_DIALOG = 'OPEN_AI_MODE_DIALOG'
export const CLOSE_AI_MODE_DIALOG = 'CLOSE_AI_MODE_DIALOG'
export const CLOSE_ALL_AI_MODE_DIALOG = 'CLOSE_ALL_AI_MODE_DIALOG'
export const OPEN_ALARM_NOTIFY_POPUP = 'OPEN_ALARM_NOTIFY_POPUP'
export const CLOSE_ALARM_NOTIFY_POPUP = 'CLOSE_ALARM_NOTIFY_POPUP'
export const OPEN_AI_FILTER_AND_GAC_SCHEDULE_POPUP = 'OPEN_AI_FILTER_AND_GAC_SCHEDULE_POPUP'
export const CLOSE_AI_FILTER_AND_GAC_SCHEDULE_POPUP = 'CLOSE_AI_FILTER_AND_GAC_SCHEDULE_POPUP'
export const OPEN_AI_MODE_OF_JI_DIALOG = 'OPEN_AI_MODE_OF_JI_DIALOG'
export const CLOSE_AI_MODE_OF_JI_DIALOG = 'CLOSE_AI_MODE_OF_JI_DIALOG'
export const CHANGE_ALL_AI_MODE = 'CHANGE_ALL_AI_MODE'
export const OPEN_FILTER_OPERATION_OF_JI_DIALOG = 'OPEN_FILTER_OPERATION_OF_JI_DIALOG'
export const CLOSE_FILTER_OPERATION_OF_JI_DIALOG = 'CLOSE_FILTER_OPERATION_OF_JI_DIALOG'
export const CLOSE_MIXING_CRT_POPUP = 'CLOSE_MIXING_CRT_POPUP'
export const PUT_MIXING_CONTROL_INIT = 'PUT_MIXING_CONTROL_INIT'
export const CLOSE_DISINFECTION_POPUP = 'CLOSE_DISINFECTION_POPUP'
export default {
  namespaced: true,
  state: {
    aiMode: {
      visible: false,
      expectedValue: null,
      disinfectionIndex: null,
      processStep: null,
      d_g_value_ctr_flag: null,
      mixingStep: null
    },
    aiModeOfJi: {
      visible: false,
      number: null
    },
    aiFilterNGACSchedule: {
      visible: false
    },
    alarmNotify: {
      visible: true
    },
    filterOperationOfJi: {
      visible: false,
      number: null
    },
    autoModeCrt: {
      visible: false,
      d_g_step1_crt: null,
      d_g_step2_crt: null,
      d_g_step3_crt: null,
      processStep: null
    },
    disinfection: {
      visible: false
    }
  },
  mutations: {
    [OPEN_AI_MODE_DIALOG]: function(state, data) {
      if(typeof data === "string") {
        state.aiMode.mixingStep = data
        state.aiMode.expectedValue = null
      } else {
        state.aiMode.expectedValue = data
        state.aiMode.d_g_value_ctr_flag = null
      }
      state.aiMode.visible = true
    },
    [OPEN_AI_MODE_OF_JI_DIALOG]: function(state) {
      state.aiModeOfJi.visible = true
    },
    [CLOSE_AI_MODE_DIALOG]: function(state) {
      state.aiMode.visible = false
    },
    [CLOSE_ALL_AI_MODE_DIALOG]: function(state) {
      state.aiMode.visible = false
      state.aiMode.changeAllAIMode = false
    },
    [CLOSE_AI_MODE_OF_JI_DIALOG]: function(state) {
      state.aiModeOfJi.visible = false
    },
    [OPEN_AI_FILTER_AND_GAC_SCHEDULE_POPUP]: function(state) {
      state.aiFilterNGACSchedule.visible = true
    },
    [CLOSE_AI_FILTER_AND_GAC_SCHEDULE_POPUP]: function(state) {
      state.aiFilterNGACSchedule.visible = false
    },
    [OPEN_ALARM_NOTIFY_POPUP]: function(state) {
      state.alarmNotify.visible = true
    },
    [CLOSE_ALARM_NOTIFY_POPUP]: function(state) {
      state.alarmNotify.visible = false
    },
    [OPEN_FILTER_OPERATION_OF_JI_DIALOG]: function(state) {
      state.filterOperationOfJi.visible = true
    },
    [CLOSE_FILTER_OPERATION_OF_JI_DIALOG]: function(state) {
      state.filterOperationOfJi.visible = false
    },
    [CLOSE_MIXING_CRT_POPUP]: function(state) {
      state.autoModeCrt.visible = false
    },
    [PUT_MIXING_CONTROL_INIT]: function(state, obj) {
      let key = state.processStep == 1 ? 'indMixing' : state.processStep == 2 ? 'mixing' : 'trtIndMixing'
      // console.log(key)
      state[key].latestModify.d_g_step1_crt = obj.d_g_step1_crt
      // state[key].latestModify.d_g_step2_crt = obj.d_g_step2_crt
      // state[key].latestModify.d_g_step3_crt = obj.d_g_step3_crt
    },
    [CLOSE_DISINFECTION_POPUP]: function(state) {
      state.disinfection.visible = false
    },
  },
  actions: {
    [OPEN_AI_MODE_DIALOG]: function ({ commit }, value) {
      commit(OPEN_AI_MODE_DIALOG, value)
    },
    [OPEN_AI_MODE_OF_JI_DIALOG]: function ({ commit }) {
      commit(OPEN_AI_MODE_OF_JI_DIALOG)
    },
    [CLOSE_AI_MODE_DIALOG]: function ({ commit }) {
      commit(CLOSE_AI_MODE_DIALOG)
    },
    [CLOSE_ALL_AI_MODE_DIALOG]: function ({ commit }) {
      commit(CLOSE_ALL_AI_MODE_DIALOG)
    },
    [OPEN_AI_FILTER_AND_GAC_SCHEDULE_POPUP]: function ({ commit }) {
      commit(OPEN_AI_FILTER_AND_GAC_SCHEDULE_POPUP)
    },
    [CLOSE_AI_FILTER_AND_GAC_SCHEDULE_POPUP]: function ({ commit }) {
      commit(CLOSE_AI_FILTER_AND_GAC_SCHEDULE_POPUP)
    },
    [OPEN_ALARM_NOTIFY_POPUP]: function ({ commit }) {
      commit(OPEN_ALARM_NOTIFY_POPUP)
    },
    [CLOSE_ALARM_NOTIFY_POPUP]: function ({ commit }) {
      commit(CLOSE_ALARM_NOTIFY_POPUP)
    },
    [CLOSE_AI_MODE_OF_JI_DIALOG]: function ({commit}) {
      commit(CLOSE_AI_MODE_OF_JI_DIALOG)
    },
    [CHANGE_ALL_AI_MODE]: async function ({ commit, state }){
      await axios.put(`${DEV_SERVER}/`+'dashboard/control/operation', {operation: state.aiMode.expectedValue})
        .then(()=>{
          commit(CLOSE_ALL_AI_MODE_DIALOG)
          let _data = {
            visible: true,
            title: '제어 성공',
            text1: '전체 공정 운전모드 변경요청 완료'
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
   [OPEN_FILTER_OPERATION_OF_JI_DIALOG]: function ({ commit }) {
    commit(OPEN_FILTER_OPERATION_OF_JI_DIALOG)
   },
   [CLOSE_FILTER_OPERATION_OF_JI_DIALOG]: function ({ commit }) {
    commit(CLOSE_FILTER_OPERATION_OF_JI_DIALOG)
   },
   [PUT_MIXING_CONTROL_INIT]:  async function ({ commit, state, rootState }, obj){
    await axios.put(`${DEV_SERVER}/`+'mixing/control/ai/' + state.autoModeCrt.processStep, obj)
      .then(() => {
        let key = state.autoModeCrt.processStep == 1 ? 'indMixing' : state.autoModeCrt.processStep == 2 ? 'mixing' : 'trtIndMixing'
        rootState[key].latestModify.d_g_step1_crt = obj.d_g_step1_crt
        rootState[key].latestModify.d_g_step2_crt = obj.d_g_step2_crt
        rootState[key].latestModify.d_g_step3_crt = obj.d_g_step3_crt

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
      })
  }
  }
}