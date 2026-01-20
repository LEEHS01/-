import axios from 'axios'

export default {
  namespaced: true,
  state: {
    searchData: null
  },
  mutations: {
    setSearch (state, data) {
      state.searchData = data
    }
  },
  actions: {
    async fetchPumpSearch ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/pumpSearch`, null, { params: param })
        if (response.status === 500) {
          commit('setSearch', [])
        } else {
          commit('setSearch', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSearch', [])
      }
    }
  },
  getters: {
    getSearch: (state) => {
      return state.searchData
    }
  }
}
