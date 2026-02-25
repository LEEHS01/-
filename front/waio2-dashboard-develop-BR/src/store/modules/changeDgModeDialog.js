const OPEN_CHANGE_DGMODE_DIALOG = 'OPEN_CHANGE_DGMODE_DIALOG'
const CLOSE_CHANGE_DGMODE_DIALOG = 'CLOSE_CHANGE_DGMODE_DIALOG'
export default {
  namespaced: true,
  state: {
    visible: false,
    title: null,
    text1: null,
    text2: null
  },
  mutations: {
    [OPEN_CHANGE_DGMODE_DIALOG]: function(state, data) {
      state.title = data.title
      state.text1 = data.text1
      state.text2 = data.text2
      state.visible = true
    },
    [CLOSE_CHANGE_DGMODE_DIALOG]: function(state) {
      state.visible = false
      state.title = null
      state.text1 = null
      state.text2 = null
    }
  },
  actions: {
    [OPEN_CHANGE_DGMODE_DIALOG]: function ({ commit }, data) {
      commit(OPEN_CHANGE_DGMODE_DIALOG, data)
    }
  }
}