// 원수 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

const URL = {
  PMS_LATEST: 'pms/latest'
}
export const GET_PMS_LATEST = URL.PMS_LATEST + '/get'
const GET_LATEST = GET_PMS_LATEST.substr(GET_PMS_LATEST.indexOf('/') + 1)
export default {
  namespaced: true,
  state: {
    latest: {
      ai:[],
      scada:[]
    },
    selectedId: "01"
  },
  getters: {
    getPMSPumpState: function (state) {
      let selectedAI = state.latest.ai.filter(it => {
        if (it.moter_id.includes(state.selectedId)) {
          return true
        }
      })[0]
      if (selectedAI === undefined) {
        selectedAI = { pump_nde_rms_amp: "-", pump_de_rms_amp: "-", motor_de_rms_amp: "-", motor_nde_rms_amp: "-" }
      }
      return { ai: selectedAI }
    }
  },
  mutations: {
    [GET_LATEST]: function (state, data) {
      state.latest = data
    }
  },
  actions: {
    [GET_LATEST]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.PMS_LATEST}`)
        .then(({ data }) => {
          commit(GET_LATEST, data)
        })
        .catch(error => {
          util.printError(error)
        })
    }
  }
}