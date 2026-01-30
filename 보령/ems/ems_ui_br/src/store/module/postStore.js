const postStore = {
    namespaced: true,
    state: {
        postList: [
            {
                title: 'EMS 설정',
                author: '도로시'
            },
            {
                title: 'axios 알아보기',
                author: '도로시'
            },
            {
                title: 'react 알아보기',
                author: '토토'
            }                         
        ]
    },
    getters: {
        GE_POST_LIST: state => state.postList
    },
    mutations: {
        MU_POST_LIST: (state, payload) => {
            state.postList = payload
        }
    },
    actions: {
        AC_USER_NAME: ({ commit }, payload) => {
            console.log('action start!!')
            commit('MU_POST_LIST', payload)
        }
    }
}

export default postStore