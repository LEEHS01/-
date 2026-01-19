import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

export const URL = {
  AIOPR_TOTAL: 'aioprhistory/total',
  AIOPR_SEARCH: 'aioprhistory/search'
}
export const GET_AIOPR_TOTAL = URL.AIOPR_TOTAL + '/get'
export const PUT_AIOPR_SEARCH = URL.AIOPR_SEARCH + '/put'
const GET_TOTAL = GET_AIOPR_TOTAL.substr(GET_AIOPR_TOTAL.indexOf('/') + 1)
const PUT_SEARCH = PUT_AIOPR_SEARCH.substr(PUT_AIOPR_SEARCH.indexOf('/') + 1)

export default {
  namespaced: true,
  state: {
    aiOprHistoryPopupVisible: false,
    aiOprTotal: {},
    aiOprHistorySearch : {
      B2_IND_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B2_IND_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B2_IND_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B2_IND_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B2_LIV_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B2_LIV_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B2_LIV_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B2_LIV_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B3_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B3_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B3_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B3_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_PUMP_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_PUMP_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_PUMP_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_PUMP_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C2_IND_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C2_IND_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C2_IND_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C2_IND_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C2_LIV_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C2_LIV_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C2_LIV_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C2_LIV_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C3_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C3_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C3_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C3_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D2_IND_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D2_IND_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D2_IND_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D2_IND_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D2_LIV_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D2_LIV_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D2_LIV_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D2_LIV_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D3_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D3_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D3_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D3_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E2_IND_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E2_IND_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E2_IND_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E2_IND_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E2_LIV_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E2_LIV_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E2_LIV_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E2_LIV_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E3_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E3_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E3_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E3_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F2_LIV_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F2_LIV_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F2_LIV_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F2_LIV_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F3_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F3_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F3_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F3_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_IND_PRE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_IND_PRE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_IND_PRE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_IND_PRE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_PRE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_PRE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_PRE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_PRE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_PRE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_PRE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_PRE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_PRE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_PERI_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_PERI_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_PERI_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_PERI_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_PERI_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_PERI_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_PERI_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_PERI_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_POST_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_POST_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_POST_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G2_LIV_POST_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_POST_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_POST_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_POST_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G3_POST_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
    },
  },
  mutations: {
    [GET_TOTAL]: function (state, data) {
      for (const key in data){
        const minutes = data[key]
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        const totalHours = Math.floor(minutes / 60);
        state.aiOprTotal[key] = {days, hours, totalHours}
      }
    },
    [PUT_SEARCH]: function (state, data) {
      if (data && Object.keys(data).length > 0) {
        for (const key in data){
          const minutes = data[key]
          const days = Math.floor(minutes / 1440);
          const hours = Math.floor((minutes % 1440) / 60);
          const totalHours = Math.floor(minutes / 60);
          state.aiOprHistorySearch[key] = {days, hours, totalHours}
        }
      } else {
        for (const key in state.aiOprHistorySearch) {
          state.aiOprHistorySearch[key] = { days: 0, hours: 0, totalHours: 0 };
        }
      }
    },
  },
  actions: {
    [GET_TOTAL]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.AIOPR_TOTAL}`)
        .then(({ data }) => {
          commit(GET_TOTAL, data.aiOprTotal)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_SEARCH]: async function ({ commit }, { start_time, end_time }) {
      await axios.put(`${DEV_SERVER}/${URL.AIOPR_SEARCH}/`, { start_time, end_time })
        .then(({ data }) => {
          commit(PUT_SEARCH, data.aiOprHistorySearch)
        })
        .catch(error => {
          util.printError(error)
        })
    },
  },
}