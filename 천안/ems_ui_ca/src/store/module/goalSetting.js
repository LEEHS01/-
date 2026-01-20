import axios from 'axios'

export default {
  namespaced: true,
  state: {
    selectGetSetting: null,
    updateGoal: null
  },
  mutations: {
    setSelectGetSetting (state, data) {
      state.selectGetSetting = data
    },
    setUpdateGoal (state, data) {
      state.updateGoal = data
    }
  },
  actions: {
    async fetchSelectGetSetting ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectGetSetting`)
        if (response.status === 500) {
          commit('setSelectGetSetting', [])
        } else {
          commit('setSelectGetSetting', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectGetSetting', [])
      }
    },
    async fetchUpdateGoal ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/updateGoal`, null, { params: param })
        if (response.status === 500) {
          commit('setUpdateGoal', [])
        } else {
          commit('setUpdateGoal', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setUpdateGoal', [])
      }
    }
  },
  getters: {
    getSelectGetSetting: (state) => {
      return state.selectGetSetting
    },
    getUpdateGoal: (state) => {
      return state.updateGoal
    }
  }
}
