import axios from 'axios'

export default {
  namespaced: true,
  state: {
    selectReport: null,
    selectPerformList: null
  },
  mutations: {
    setSelectReport (state, data) {
      state.selectReport = data
    },
    setSelectPerformList (state, data) {
      state.selectPerformList = data
    }
  },
  actions: {
    async fetchSelectReport ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectReport`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectReport', [])
        } else {
          commit('setSelectReport', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectReport', [])
      }
    },
    async fetchSelectPerformList ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectPerformList`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectPerformList', [])
        } else {
          commit('setSelectPerformList', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectPerformList', [])
      }
    }
  },
  getters: {
    getSelectReport: (state) => {
      return state.selectReport
    },
    getSelectPerformList: (state) => {
      return state.selectPerformList
    }
  }
}
