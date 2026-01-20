import axios from 'axios'

export default {
  namespaced: true,
  state: {
    selectZone: null,
    selectFac: null,
    selectFacUseList: null,
    selectFacSunsi: null
  },
  mutations: {
    setSelectZone (state, data) {
      state.selectZone = data
    },
    setSelectFac (state, data) {
      state.selectFac = data
    },
    setSelectFacUseList (state, data) {
      state.selectFacUseList = data
    },
    setSelectFacSunsi (state, data) {
      state.selectFacSunsi = data
    }
  },
  actions: {
    async fetchSelectZone ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectZone`)
        if (response.status === 500) {
          commit('setSelectZone', [])
        } else {
          commit('setSelectZone', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectZone', [])
      }
    },
    async fetchSelectFac ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectFac`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectFac', [])
        } else {
          commit('setSelectFac', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectFac', [])
      }
    },
    async fetchSelectFacUseList ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectFacUseList`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectFacUseList', [])
        } else {
          commit('setSelectFacUseList', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectFacUseList', [])
      }
    },
    async fetchSelectFacSunsi ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectFacSunsi`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectFacSunsi', [])
        } else {
          commit('setSelectFacSunsi', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectFacSunsi', [])
      }
    }
  },
  getters: {
    getSelectZone: (state) => {
      return state.selectZone
    },
    getSelectFac: (state) => {
      return state.selectFac
    },
    getSelectFacUseList: (state) => {
      return state.selectFacUseList
    },
    getSelectFacSunsi: (state) => {
      return state.selectFacSunsi
    }
  }
}
