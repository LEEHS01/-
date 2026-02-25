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
      B_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      B_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      C_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      D_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      E_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      F_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_PRE_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_PRE_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_PRE_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_PRE_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_PERI_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_PERI_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_PERI_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_PERI_0 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_POST_SUM :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_POST_2 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_POST_1 :{
        days : 0,
        hours : 0,
        totalHours : 0
      },
      G_POST_0 :{
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