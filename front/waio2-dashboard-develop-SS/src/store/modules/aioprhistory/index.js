//운영시간이력 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

export const URL = {
  AI_OPR_HISTORY_SEARCH:'aioprhistory/search',
  AI_OPR_HISTORY_TOTAL:'aioprhistory/total'
}

export const PUT_AI_OPR_HISTORY_SEARCH = URL.AI_OPR_HISTORY_SEARCH + '/put'
export const GET_AI_OPR_HISTORY_TOTAL = URL.AI_OPR_HISTORY_TOTAL + '/get'

const PUT_SEARCH = PUT_AI_OPR_HISTORY_SEARCH.substr(PUT_AI_OPR_HISTORY_SEARCH.indexOf('/') + 1)
const GET_TOTAL = GET_AI_OPR_HISTORY_TOTAL.substr(GET_AI_OPR_HISTORY_TOTAL.indexOf('/') + 1)

export default {
  namespaced: true,
  state: {
    aiOprHistoryPopupVisible: false,
    aiOprHistorySearch : {
      B_LIV_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_LIV_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_LIV_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_LIV_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_IND_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_IND_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_IND_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_IND_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_LIV_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_LIV_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_LIV_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_LIV_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_IND_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_IND_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_IND_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_IND_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_LIV_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_LIV_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_LIV_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_LIV_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_IND_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_IND_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_IND_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_IND_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_LIV_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_LIV_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_LIV_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_LIV_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_IND_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_IND_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_IND_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_IND_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F_LIV_NONE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F_LIV_NONE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F_LIV_NONE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F_LIV_NONE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_PRE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_PRE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_PRE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_PRE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_PERI_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_PERI_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_PERI_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_PERI_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_POST_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_POST_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_POST_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_LIV_POST_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_IND_PRE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_IND_PRE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_IND_PRE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_IND_PRE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
    },
    aiOprTotal: {},
    startTime: null,
    endTime: null,
    formattedStartTime: null,
    formattedEndTime: null,
  },
  mutations: {
    [PUT_SEARCH]: function (state, data){
      for (const key in data){
        const minutes = data[key]
        const days = (minutes / 1440) | 0;
        const hours = ((minutes % 1440) / 60) | 0;
        const totalHours = (minutes / 60) | 0;
        state.aiOprHistorySearch[key] = {days, hours, totalHours}
      }
    },
    [GET_TOTAL]: function (state, data){
      for (const key in data){
        const minutes = data[key]
        const days = (minutes / 1440) | 0;
        const hours = ((minutes % 1440) / 60) | 0;
        const totalHours = (minutes / 60) | 0;
        state.aiOprTotal[key] = {days, hours, totalHours}
      }
    }
  },
  actions: {
    [PUT_SEARCH]: async function ({ commit }, { start_time, end_time }){
      await axios.put(`${DEV_SERVER}/${URL.AI_OPR_HISTORY_SEARCH}`, {start_time, end_time})
        .then(({data})=> {
          commit(PUT_SEARCH, data.aiOprHistorySearch)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [GET_TOTAL]: async function ({ commit }){
      await axios.get(`${DEV_SERVER}/${URL.AI_OPR_HISTORY_TOTAL}`)
        .then(({data}) => {
          commit(GET_TOTAL, data.aiOprTotal)
        })
        .catch(error =>{
          util.printError(error)
        })
    }
  },
}