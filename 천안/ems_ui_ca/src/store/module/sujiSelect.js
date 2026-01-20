import axios from 'axios'
import log from '@/logger.js'

export default {
  namespaced: true,
  state () {
    return {
      count: 0,
      selectData: null
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setSelect (state, data) {
      state.selectData = data
    }
  },
  actions: {
    increment ({ commit }) {
      commit('increment')
    },
    async fetchSelect ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/select1`, null, { params: param })
        commit('setSelect', response.data)
      } catch (err) {
        log.logError(err.message);
      }
    }
  },
  getters: {
    getCount: (state) => {
      return state.count
    },
    getSelect: (state) => {
      return state.selectData
    }
  }
}
