import axios from 'axios'
import log from '@/logger.js'

export default {
  namespaced: true,
  state: {
    zoneData: null,
    tagData: null,
    updateTagInfo: null
  },
  mutations: {
    setZone (state, data) {
      state.zoneData = JSON.parse(JSON.stringify(data))
    },
    setTag (state, data) {
      state.tagData = JSON.parse(JSON.stringify(data))
    },
    updateTag (state, data) {
      state.updateTagInfo = JSON.parse(JSON.stringify(data))
    }
  },
  actions: {
    async selectZone ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/TagSelectZone`)
        if (response.data.length !== 0) {
          commit('setZone', response.data)
        } else {
          commit('setZone', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    },
    async selectTagList ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectTag`, { params: param })
        if (response.data.length !== 0) {
          commit('setTag', response.data)
        } else {
          commit('setTag', null)
        }
      } catch (err) {
        log.logError(err.message);
      }
    },
    async updateTagInfo ({ commit }, param) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/updateTagInfo`, { params: param })
        if (response.data.length !== 0) {
          commit('updateTag', response.data)
        } else {
          commit('updateTag', null)
        }
      } catch (err) {
        log.logError(err.message);
      }
    }
  },
  getters: {
    getZoneData: (state) => {
      return JSON.parse(JSON.stringify(state.zoneData))
    },
    getSelectData: (state) => {
      return JSON.parse(JSON.stringify(state.tagData))
    },
    getUpdateTagInfo: (state) => {
      return JSON.parse(JSON.stringify(state.updateTagInfo))
    }
  }
}
