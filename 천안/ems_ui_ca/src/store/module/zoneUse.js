import axios from 'axios'

export default {
  namespaced: true,
  state: {
    sisul_sunsi: null,
    sunsiChart: null,
    selectZoneUseList: null
  },
  mutations: {
    setSisul_sunsi (state, data) {
      state.sisul_sunsi = data
    },
    setSunsiChart (state, data) {
      state.sunsiChart = data
    },
    setSelectZoneUseList (state, data) {
      state.selectZoneUseList = data
    }
  },
  actions: {
    async fetchSisul_sunsi ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/sisul_sunsi`)
        if (response.status === 500) {
          commit('setSisul_sunsi', [])
        } else {
          commit('setSisul_sunsi', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSisul_sunsi', [])
      }
    },
    async fetchSunsiChart ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/sunsiChart`, null, { params: param })
        if (response.status === 500) {
          commit('setSunsiChart', [])
        } else {
          commit('setSunsiChart', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSunsiChart', [])
      }
    },
    async fetchSelectZoneUseList ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectZoneUseList`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectZoneUseList', [])
        } else {
          commit('setSelectZoneUseList', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectZoneUseList', [])
      }
    }
  },
  getters: {
    getSisul_sunsi: (state) => {
      return state.sisul_sunsi
    },
    getSunsiChart: (state) => {
      return state.sunsiChart
    },
    getSelectZoneUseList: (state) => {
      return state.selectZoneUseList
    }
  }
}
