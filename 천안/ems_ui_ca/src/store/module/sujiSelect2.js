import axios from 'axios'
import log from '@/logger.js'

export default {
  namespaced: true,
  state () {
    return {

      comboList: null,
      basujiList: null
    }
  },
  mutations: {

    setComboList (state, data) {
      state.comboList = data
    },
    setBasujiList (state, data) {
      state.basujiList = data
    }
  },
  actions: {

    async fetchComboList ({ commit }) {
      // console.log('combo !!!')
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/combo`)
        // console.log('store', response)
        commit('setComboList', response.data)
      } catch (err) {
        log.logError(err.message);;
        commit('setComboList', err)
      }
    },
    async fetchBasujiList ({ commit }, param) {
      const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/basuji`, null, { params: param })
      commit('setBasujiList', response.data)
    }
  },
  getters: {

    getCombo: (state) => {
      return state.comboList
    },
    getBasuji: (state) => {
      return state.basujiList
    }
  }
}
