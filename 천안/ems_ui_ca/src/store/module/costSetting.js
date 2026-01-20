import axios from 'axios'

export default {
  namespaced: true,
  state: {
    selectRtInfo: null,
    selectRT_RATE_INF: null,
    updateRT_RATE_INF: null
  },
  mutations: {
    setSelectRtInfo (state, data) {
      state.selectRtInfo = data
    },
    setSelectRT (state, data) {
      state.selectRT_RATE_INF = data
    },
    setUpdateRT (state, data) {
      state.updateRT_RATE_INF = data
    }
  },
  actions: {
    async fetchSelectRtInfo ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectRtInfo`)
        if (response.status === 500) {
          commit('setSelectRtInfo', [])
        } else {
          commit('setSelectRtInfo', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectRtInfo', [])
      }
    },
    async fetchSelectRT ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectRT_RATE_INF_COST`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectRT', [])
        } else {
          commit('setSelectRT', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectRT', [])
      }
    },
    async fetchUpdateRT ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/updateRT_RATE_INF`, null, { params: param })
        if (response.status === 500) {
          commit('setUpdateRT', [])
        } else {
          commit('setUpdateRT', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setUpdateRT', [])
      }
    }
  },
  getters: {
    getSelectRtInfo: (state) => {
      return state.selectRtInfo
    },
    getSelectRT: (state) => {
      return state.selectRT_RATE_INF
    },
    getUpdateRT: (state) => {
      return state.updateRT_RATE_INF
    }
  }
}
