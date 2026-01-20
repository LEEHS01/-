import axios from 'axios'

export default {
  namespaced: true,
  state: {
    selectUseTrandList: null
  },
  mutations: {
    setSelectUseTrandList (state, data) {
      state.selectUseTrandList = data
    }
  },
  actions: {
    async fetchSetSelectUseTrandList ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectUseTrandList`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectUseTrandList', [])
        } else {
          commit('setSelectUseTrandList', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectUseTrandList', [])
      }
    }
  },
  getters: {
    getSelectUseTrandList: (state) => {
      return state.selectUseTrandList
    }
  }
}
