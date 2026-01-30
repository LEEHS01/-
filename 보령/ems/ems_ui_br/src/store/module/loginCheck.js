import axios from 'axios'

export default {
  namespaced: true,
  state: {
    loginInfo: []
  },
  mutations: {
    setLoginInfo (state, data) {
      state.loginInfo = data
    }
  },
  actions: {
    async fetchLoginInfo ({ commit }) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_HOST_IP}/api/loginCheck`)
        if (response.status === 500) {
          commit('setLoginInfo', [])
        } else {
          commit('setLoginInfo', response.data)
        }
      } catch (err) {
        console.log(err.message)
        commit('setLoginInfo', [])
      }
    }
  },
  getters: {
    getLoginInfo: (state) => {
      return JSON.parse(JSON.stringify(state.loginInfo))
    }
  }
}
