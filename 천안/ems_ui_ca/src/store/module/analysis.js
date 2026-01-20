import axios from 'axios'
import log from '@/logger.js'

export default {
  namespaced: true,
  state: {
    mariadbData: null, // Mariadb 데이터를 저장할 상태 변수
    predictionData: null, // 예측 결과 데이터 저장 변수
    selectValveData: null, // 펌프가동 대수 저장 변수
    PumpchartData: null, // 차트 저장 변수
    PumpData: null
  },
  mutations: {

    setMariadbData (state, data) {
      state.mariadbData = JSON.parse(JSON.stringify(data))
    },
    setPredictionData (state, data) {
      state.predictionData = data
    },
    setSelectValveData (state, data) {
      state.selectValveData = data
    },
    setChartData (state, data) {
      state.PumpchartData = data
    },
    setGetPumpData (state, data) {
      state.PumpData = data
    }
  },
  actions: {
    async fetchMariadbData ({ commit }) {
      try {
        const response = await axios.post('http://localhost:3000/api/mariadb')
        const data = response.data
        commit('setMariadbData', data)
      } catch (err) {
        log.logError(err.message);
      }
    },
    // 예측 결과 axios 요청
    async fetchPredictionData ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/analyPrediction`)
        const data = response.data
        commit('setPredictionData', data)
      } catch (err) {
        log.logError(err.message);
      }
    },
    async fetchSelectValveData ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectValve`)
        const data = response.data
        commit('setSelectValveData', data)
      } catch (err) {
        log.logError(err.message);
      }
    },
    async fetchChartData ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/analysis`)
        const data = response.data
        commit('setChartData', data)
      } catch (err) {
        log.logError(err.message);
      }
    },
    async fetchGetPumpData ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/analyPump`)
        const data = response.data
        commit('setGetPumpData', data)
      } catch (err) {
        log.logError(err.message);
      }
    }
  },
  getters: {
    getPump: (state) => {
      return JSON.parse(JSON.stringify(state.PumpData))
    },
    getPrediction: (state) => {
      return JSON.parse(JSON.stringify(state.predictionData))
    },
    getSelectValveData: (state) => {
      return JSON.parse(JSON.stringify(state.selectValveData))
    }
  }
}
