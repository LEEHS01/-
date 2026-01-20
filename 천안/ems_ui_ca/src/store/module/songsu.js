import axios from 'axios'

export default {
  namespaced: true,
  state: {
    getPopup: null,
    insertPopup: null,
    initPopup: null,
    insertPopup2: null,
    insertPopupAuto2: null,
    insertPopup3: null,
    updateCTR_PRF_PMPMST_INF: null,
    PTR_CTR_INF: null,
    songsuSelect: null,
    pumpSelect: null,
    insertAIonOff: null,
    interpuppt: null
  },
  mutations: {
    setGetPopup (state, data) {
      state.getPopup = data
    },
    setInsertPopup (state, data) {
      state.insertPopup = data
    },
    setInittPopup (state, data) {
      state.initPopup = data
    },
    setInsertPopup2 (state, data) {
      state.insertPopup2 = data
    },
    setInsertPopupAuto2 (state, data) {
      state.insertPopupAuto2 = data
    },
    setInsertPopup3 (state, data) {
      state.insertPopup3 = data
    },
    setUpdateCTR_PRF_PMPMST_INF (state, data) {
      state.updateCTR_PRF_PMPMST_INF = data
    },
    setPTR_CTR_INF (state, data) {
      state.PTR_CTR_INF = data
    },
    setSongsuSelect (state, data) {
      state.songsuSelect = data
    },
    setPumpSelect (state, data) {
      state.pumpSelect = data
    },
    setInsertAIonOff (state, data) {
      state.insertAIonOff = data
    },
    setInterpuppt (state, data) {
      state.interpuppt = data
    }
  },
  actions: {
    async fetchGetPopup ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/getPopup`, null)
        if (response.status === 500) {
          commit('setGetPopup', response.data)
        } else {
          commit('setGetPopup', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setGetPopup', [])
      }
    },
    async fetchInsertPopup ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/insertPopup`, null, { params: param })
        if (response.status === 500) {
          commit('setInsertPopup', response.data)
        } else {
          commit('setInsertPopup', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setInsertPopup', [])
      }
    },
    async fetchInitPopup ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/initPopup`, null)
        if (response.status === 500) {
          commit('setInittPopup', response.data)
        } else {
          commit('setInittPopup', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setInittPopup', [])
      }
    },
    async fetchInsertPopup2 ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/insertPopup2`, null, { params: param })
        if (response.status === 500) {
          commit('setInsertPopup2', response.data)
        } else {
          commit('setInsertPopup2', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setInsertPopup2', [])
      }
    },
    async fetchInsertPopupAuto2 ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/insertPopupAuto2`, null, { params: param })
        if (response.status === 500) {
          commit('setInsertPopupAuto2', response.data)
        } else {
          commit('setInsertPopupAuto2', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setInsertPopupAuto2', [])
      }
    },
    async fetchInsertPopup3 ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/insertPopup3`, null)
        if (response.status === 500) {
          commit('setInsertPopup3', response.data)
        } else {
          commit('setInsertPopup3', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setInsertPopup3', [])
      }
    },
    async fetchUpdateCTR_PRF_PMPMST_INF ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/updateCTR_PRF_PMPMST_INF`, null, { params: param })
        if (response.status === 500) {
          commit('setUpdateCTR_PRF_PMPMST_INF', response.data)
        } else {
          commit('setUpdateCTR_PRF_PMPMST_INF', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setUpdateCTR_PRF_PMPMST_INF', [])
      }
    },
    async fetchPTR_CTR_INF ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/PTR_CTR_INF`, null)
        if (response.status === 500) {
          commit('setPTR_CTR_INF', response.data)
        } else {
          commit('setPTR_CTR_INF', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setPTR_CTR_INF', [])
      }
    },
    async fetchSongsuSelect ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/songsuSelect`, null, { params: param })
        if (response.status === 500) {
          commit('setSongsuSelect', response.data)
        } else {
          commit('setSongsuSelect', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSongsuSelect', [])
      }
    },
    async fetchPumpSelect ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/pumpSelect`, null)
        if (response.status === 500) {
          commit('setPumpSelect', response.data)
        } else {
          commit('setPumpSelect', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setPumpSelect', [])
      }
    },
    async fetchInsertAIonOff ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/insertAIonOff`, null, { params: param })
        if (response.status === 500) {
          commit('setInsertAIonOff', response.data)
        } else {
          commit('setInsertAIonOff', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setInsertAIonOff', [])
      }
    },
    async fetchInterpuppt ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/interpuppt`, null)
        if (response.status === 500) {
          commit('setInterpuppt', response.data)
        } else {
          commit('setInterpuppt', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setInterpuppt', [])
      }
    }
  },
  getters: {
    getGetPopup: (state) => {
      return state.getPopup
    },
    getInsertPopup: (state) => {
      return state.insertPopup
    },
    getInsertPopup2: (state) => {
      return state.insertPopup2
    },
    getInsertPopup3: (state) => {
      return state.insertPopup3
    },
    getUpdateCTR_PRF_PMPMST_INF: (state) => {
      return state.updateCTR_PRF_PMPMST_INF
    },
    getPTR_CTR_INF: (state) => {
      return state.PTR_CTR_INF
    },
    getSongsuSelect: (state) => {
      return state.songsuSelect
    },
    getPumpSelect: (state) => {
      return state.pumpSelect
    },
    getInsertAIonOff: (state) => {
      return state.insertAIonOff
    },
    getInterpuppt: (state) => {
      return state.interpuppt
    }
  }
}
