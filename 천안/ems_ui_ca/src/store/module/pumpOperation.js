import axios from 'axios'

export default {
  namespaced: true,
  state: {
    selectCTR_PRF_PMPMST_INF: null,
    updateSetCTR_PRF_PMPMST_INF: null,
    updateSetCTR_PRF_PMPMST_INF2: null,
    mergePTR_STRTG_INF: null,
    mergeOPER_INF: null,
    selectRT_RATE_INF: null
  },
  mutations: {
    setSelectCTR (state, data) {
      state.selectCTR_PRF_PMPMST_INF = data
    },
    setUpdateCTR (state, data) {
      state.updateSetCTR_PRF_PMPMST_INF = data
    },
    setUpdateCTR2 (state, data) {
      state.updateSetCTR_PRF_PMPMST_INF2 = data
    },
    setMergePTR (state, data) {
      state.mergePTR_STRTG_INF = data
    },
    setMergeOPER (state, data) {
      state.mergeOPER_INF = data
    },
    setSelectRT (state, data) {
      state.selectRT_RATE_INF = data
    }
  },
  actions: {
    async fetSelectCTR ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectCTR_PRF_PMPMST_INF`)
        if (response.status === 500) {
          commit('setSelectCTR', [])
        } else {
          commit('setSelectCTR', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectCTR', [])
      }
    },
    async fetchUpdateCTR ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/updateSetCTR_PRF_PMPMST_INF`, null, { params: param })
        if (response.status === 500) {
          commit('setUpdateCTR', [])
        } else {
          commit('setUpdateCTR', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setUpdateCTR', [])
      }
    },
    async fetchUpdateCTR2 ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/updateSetCTR_PRF_PMPMST_INF2`, null, { params: param })
        if (response.status === 500) {
          commit('setUpdateCTR2', [])
        } else {
          commit('setUpdateCTR2', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setUpdateCTR2', [])
      }
    },
    async fetchMergePTR ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/mergePTR_STRTG_INF`, null, { params: param })
        if (response.status === 500) {
          commit('setMergePTR', [])
        } else {
          commit('setMergePTR', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setMergePTR', [])
      }
    },
    async fetchMergeOPER ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/mergeOPER_INF`, null, { params: param })
        if (response.status === 500) {
          commit('setMergeOPER', [])
        } else {
          commit('setMergeOPER', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setMergeOPER', [])
      }
    },
    async fetchSelectRT ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectRT_RATE_INF`, null, { params: param })
        if (response.status === 500) {
          commit('setSelectRT', [])
        } else {
          commit('setSelectRT', response.data)
        }
      } catch (err) {
        // console.log(err.message)
        commit('setSelectRT', [])
      }
    }
  },
  getters: {
    getSelectCTR: (state) => {
      return state.selectCTR_PRF_PMPMST_INF
    },
    getUpdateCTR: (state) => {
      return state.updateSetCTR_PRF_PMPMST_INF
    },
    getUpdateCTR2: (state) => {
      return state.updateSetCTR_PRF_PMPMST_INF2
    },
    getMergePTR: (state) => {
      return state.mergePTR_STRTG_INF
    },
    getMergeOPER: (state) => {
      return state.mergeOPER_INF
    },
    getSelectRT: (state) => {
      return state.selectRT_RATE_INF
    }
  }
}
