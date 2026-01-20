import axios from 'axios'
import log from '@/logger.js'

export default {
  namespaced: true,
  state: {
    peakSelect: null,
    peakGoal: null,
    updatePeakGoal: null,
    peakFac: null,
    nowPeak: null,
    // alarm: null,
    // siteAlarm: null,
    costPeak: null
  },
  mutations: {
    setPeakSelect (state, data) {
      state.peakSelect = data
    },
    setPeakGoal (state, data) {
      state.peakGoal = data
    },
    setUpdatePeakGoal (state, data) {
      state.updatePeakGoal = data
    },
    setPeakFac (state, data) {
      state.peakFac = data
    },
    setNowPeak (state, data) {
      state.nowPeak = data
    },
    // setAlarm (state, data) {
    //   state.alarm = data
    // },
    // setSiteAlarm (state, data) {
    //   state.siteAlarm = data
    // },
    setCostPeak (state, data) {
      state.costPeak = data
    }
  },
  actions: {
    async fetchPeakSelect ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/peakSelectData`, { params: param })
        if (response.data.length !== 0) {
          commit('setPeakSelect', response.data)
        } else {
          commit('setPeakSelect', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    },
    async fetchPeakGoal ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/peakGoal`)
        if (response.data.length > 0) {
          commit('setPeakGoal', response.data)
        } else {
          commit('setPeakGoal', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    },
    async fetchCostPeak ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/costPeak`)
        if (response.data.length > 0) {
          commit('setCostPeak', response.data)
        } else {
          commit('setCostPeak', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    },
    async fetchUpdatePeakGoal ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/updatePeakGoal`, { params: param })
        if (response.data.length > 0) {
          commit('setUpdatePeakGoal', response.data)
        } else {
          commit('setUpdatePeakGoal', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    },
    async fetchPeakFac ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/peakFac`, { params: param })
        if (response.data.length > 0) {
          commit('setPeakFac', response.data)
        } else {
          commit('setPeakFac', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    },
    async fetchNowPeak ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/nowPeak`)
        if (response.data.length > 0) {
          commit('setNowPeak', response.data)
        } else {
          commit('setNowPeak', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    }
    // async fetchAlarm ({ commit }) {
    //   try {
    //     const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/alarmCheck`)
    //     if (response.data.length > 0) {
    //       commit('setAlarm', response.data)
    //     } else {
    //       commit('setAlarm', [])
    //     }
    //   } catch (err) {
    //     console.log(err.message)
    //     commit('setAlarm', [])
    //   }
    // },
    // async fetchSiteAlarm ({ commit }) {
    //   try {
    //     const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/siteAlarmCheck`)
    //     if (response.data.length > 0) {
    //       commit('setSiteAlarm', response.data)
    //     } else {
    //       commit('setSiteAlarm', [])
    //     }
    //   } catch (err) {
    //     console.log(err.message)
    //   }
    // }
  },
  getters: {
    getPeakSelect: (state) => {
      return JSON.parse(JSON.stringify(state.peakSelect))
    },
    getPeakGoal: (state) => {
      return JSON.parse(JSON.stringify(state.peakGoal))
    },
    getUpdatePeakGoal: (state) => {
      return JSON.parse(JSON.stringify(state.updatePeakGoal))
    },
    getPeakFac: (state) => {
      return JSON.parse(JSON.stringify(state.peakFac))
    },
    getNowPeak: (state) => {
      return JSON.parse(JSON.stringify(state.nowPeak))
    },
    // getAlarm: (state) => {
    //   return JSON.parse(JSON.stringify(state.alarm))
    // },
    // getSiteAlarm: (state) => {
    //   return JSON.parse(JSON.stringify(state.siteAlarm))
    // },
    getCostPeak: (state) => {
      return JSON.parse(JSON.stringify(state.costPeak))
    }
  }
}
