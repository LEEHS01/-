import axios from 'axios'
import log from '@/logger.js'
// fetchPumpSearch
export default {
  namespaced: true,
  state () { // 값을 저장소
    return {
      searchData: null,
      peakChartData: null,
      pumpSelectData: null
    }
  },
  mutations: { //
    setData (state, data) {
      state.searchData = data
    },
    setPeakChart (state, data) {
      state.peakChartData = data
    },
    setPumpSelect (state, data) {
      state.pumpSelectData = data
    }
  },
  actions: { // api
    async fetchPeakCntData ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectPeakControl`)
        if (response.data) {
          commit('setData', response.data)
        } else {
          commit('setData', null)
        }
 			} catch (err) {
        log.logError(err.message);
        // commit('setData',err.message)
        // console.log(err.message)
      }
    },
    async fetchPeakSelect ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectPeakChart`, null, { params: param })
        if (!response.data.error) {
          commit('setPeakChart', response.data.data)
        } else {
          commit('setPeakChart', [])
        }
      } catch (err) {
        log.logError(err.message);
        // console.error(err)
        // commit('setPeakChart', err.message);
        // console.log(err.message)
      }
    },
    async fetchPumpSelect ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectPump`)
        // console.log(response)
        if (response.data.error == false) {
          commit('setPumpSelect', response.data)
        }
      } catch (err) {
        log.logError(err.message);
      }
    }
  },

  getters: {
    getpeakctrl: (state) => {
      return JSON.parse(JSON.stringify(state.searchData))
      // return state.searchData;
    },
    getPeakChart: (state) => {
      return JSON.parse(JSON.stringify(state.peakChartData))
    },
    getPumpSelect: (state) => {
      return JSON.parse(JSON.stringify(state.pumpSelectData))
    }
  }
}
