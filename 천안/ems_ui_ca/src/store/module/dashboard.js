import axios from 'axios'
import moment from 'moment'
import log from '@/logger.js'

const dashboard = {
  namespaced: true,

  state: {
    alarm: null,
    siteAlarm: null,
    selectedBdIdx: 0,
    selectedBdName: '탈수기동',
    selectedBdPowerUsage: 0,
    peakGoal: 1000,
    costPeak: 0,
    peakData: [
      { DATE: '2023-07-05 00:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 01:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 02:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 03:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 04:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 05:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 06:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 07:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 08:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 09:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 10:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 11:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 12:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 13:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 14:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 15:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 16:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 17:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 18:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 19:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 20:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 21:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 22:00', PEAK_YN: '0' },
      { DATE: '2023-07-05 23:00', PEAK_YN: '0' }
    ],
    facData: [
      // { description: '급속훈화장치#1', value: 10 },
      // { description: '급속훈화장치#2', value: 10 },
      // { description: '급속훈화장치#3', value: 10 }
      { description: '', value: 0 },
      { description: '', value: 0 },
      { description: '', value: 0 }
    ],
    zonePer: {
      탈수기동: 10,
      관리동: 10
    },
    zoneList: null,
    pumps: [
      { name: '목천가1', status: 0, pwr: 0 },
      { name: '목천가2', status: 1, pwr: 0 },
      { name: '천안정1', status: 1, pwr: 0 },
      { name: '천안정2', status: 0, pwr: 0 },
      { name: '천안정3', status: 1, pwr: 0 }
    ],
    valveData: [],
    nowUse: 0,
    yesterdayUse: 0,
    monthUse: 0,
    yearUse: 0,
    dayPer: 0,
    monthPer: 0,
    yearPer: 0,
    daySavingKwh: 0,
    monthSavingKwh: 0,
    yearSavingKwh: 0,
    daySavingCo2: 0,
    monthSavingCo2: 0,
    yearSavingCo2: 0
  },

  mutations: {
    setAlarm (state, data) {
      state.alarm = data
    },

    setSiteAlarm (state, data) {
      state.siteAlarm = data
    },

    setZoneList (state, data) {
      state.zoneList = data.data1

      if (state.zoneList !== null && state.zoneList !== undefined  && state.zoneList.length !== 0) {
        let sumY = 0
        state.zoneList.forEach(zone => {
          sumY += zone.y
        })

        const tempZonePer = {}
        state.zoneList.forEach(zone => {
          const key = ('Z' + zone.zone_name).replace('(위)', 'U').replace('(아래)', 'D')
          tempZonePer[key] = (zone.y === 0) ? 0 : (zone.y * 100 / sumY).toFixed(1)
        })
        state.zonePer = tempZonePer
      }
    },

    setPeakGoal (state, data) {
      state.peakGoal = data[0].value
    },
    setCostPeak (state, data) {
      state.costPeak = data[0].PWR
    },

    setPeakData (state, data) {
      state.peakData = data
    },

    setPumpStatus (state, data) {
      data.data1.forEach((pump, idx) => {
        if (idx >= state.pumps.length) {
          return false
        }
        state.pumps[idx].name = pump.NAME
        state.pumps[idx].status = pump.VALUE
        if (data.data6 === null || data.data6.length === 0) {
          state.pumps[idx].pwr = 0
        } else if (Object.keys(data.data6[0]).includes(pump.NAME.slice(5))) {
          state.pumps[idx].pwr = Number(data.data6[0][pump.NAME.slice(5)]).toFixed(0)
        } else {
          state.pumps[idx].pwr = 0
        }
      })
    },

    setValveData (state, data) {
      state.valveData = data
    },

    setNowElec (state, data) {
      const yesterdayYear = moment().subtract(1, 'd').format('YYYY')
      const yesterdayMonth = moment().subtract(1, 'd').format('MM')
      const days = new Date(yesterdayYear, yesterdayMonth, 0).getDate()
      const monthIdx = 'month' + moment().format('M')

      // const days = 31; // TODO: 임시로 날짜 고정 (3/10)
      // const monthIdx = 'month3'; // TODO: 임시로 날짜 고정 (3/10)

      state.nowUse = Number(data.data[0].VALUE)
      state.yesterdayUse = Number(data.data3[0].전일전력량)
      state.monthUse = Number(data.data3[0].금월전력량)
      state.yearUse = Number(data.data3[0].금년전력량)
      state.dayPer = Number((state.yesterdayUse * 100) / (data.data2[0][monthIdx] / days))
      state.monthPer = Number((state.monthUse * 100) / data.data2[0][monthIdx])

      const goalList = Object.values(data.data2[0])
      let goalSum = 0
      goalList.forEach(goal => {
        goalSum += Number(goal)
      })
      state.yearPer = (state.yearUse * 100) / goalSum

      if (data.data5.length > 0) {
        state.yearSavingKwh = Number(data.data5[0].savingKwh.replaceAll(',', ''))
        state.yearSavingCo2 = Number(data.data5[0].savingCo2.replaceAll(',', ''))
      } else {
        state.yearSavingKwh = 0
        state.yearSavingCo2 = 0
      }
      state.monthSavingKwh = 0
      state.monthSavingCo2 = 0
      state.daySavingKwh = 0
      state.daySavingCo2 = 0

      const thisMonth = moment().format('MM')
      const yesterday = moment().subtract(1, 'd').format('YYYY-MM-DD')

      // const thisMonth = '03'; // TODO: 임시로 날짜 고정 (3/10)
      // const yesterday = '2023-03-09'; // TODO: 임시로 날짜 고정 (3/10)

      if (data.data4.length > 0) {
        data.data4.forEach((savingData, idx) => {
          if (savingData.ts.substring(5, 7) === thisMonth) {
            state.monthSavingKwh += Number(savingData.savingKwh.replaceAll(',', ''))
            state.monthSavingCo2 += Number(savingData.savingCo2.replaceAll(',', ''))
          }

          if (savingData.ts === yesterday) {
            state.daySavingKwh = Number(savingData.savingKwh.replaceAll(',', ''))
            state.daySavingCo2 = Number(savingData.savingCo2.replaceAll(',', ''))
          }
        })
      }
    },

    setTop3 (state, data) {
      state.facData.forEach((fac, idx) => {
        state.facData[idx].description = ''
        state.facData[idx].value = 0
      })

      data.forEach((fac, idx) => {
        state.facData[idx].description = fac.description
        state.facData[idx].value = fac.value
      })

      // console.log(state.facData);
    }
  },

  actions: {
    async fetchAlarm ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/alarmCheck`)
        if (response.data.length > 0) {
          commit('setAlarm', response.data)
        } else {
          commit('setAlarm', [])
        }
      } catch (err) {
        // console.log(err.message)
        commit('setAlarm', [])
      }
    },

    async fetchSiteAlarm ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/siteAlarmCheck`)
        if (response.data.length > 0) {
          commit('setSiteAlarm', response.data)
        } else {
          commit('setSiteAlarm', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    },

    async getZoneUseList ({ commit }) {
      const param = {
        search: moment().format('YYYY-MM-DD'),
        search2: moment().format('YYYY-MM-DD'),
        search3: 'h'
      }
      // // for test
      // const param = { // TODO
      //   search: '2023-07-17',
      //   search2: '2023-07-17',
      //   search3: 'h'
      // }

      axios
        .post(
          `${process.env.VUE_APP_HOST_IP}/api/selectZoneUseList_sum_dashboard`,
          null,
          { params: param }
        )
        .then((resp) => {
          commit('setZoneList', resp.data)
        })
        .catch((error) => {
          if (error.response) {
            // console.log(error.response.data)
            // console.log(error.response.status)
          }
        })
    },

    async getPeakGoal ({ commit }) {
      try {
        const resp = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/selectPeakGoal`)
        if (resp.data !== null && resp.data.length > 0) {
          commit('setPeakGoal', resp.data)
        }
      } catch (err) {
        log.logError(err.message);
      }
    },
    async getCostPeak ({ commit }) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_HOST_IP}/api/costPeak`)
        if (response.data.length > 0) {
          // console.log(response.data)
          commit('setCostPeak', response.data)
        } else {
          commit('setCostPeak', [])
        }
      } catch (err) {
        log.logError(err.message);
      }
    },

    async getPeakData ({ commit }) {
      const param = {
        search: moment().format('YYYY-MM-DD hh:mm:ss'),
        search2: moment().format('YYYYMMDD') + '000000',
        search3: moment().format('YYYYMMDD') + '235900'
      }
      // const param = { // TODO
      //   search: '2023-02-28 15:30:00',
      //   search2: '20230228000000',
      //   search3: '20230228235900'
      // };

      try {
        const resp = await axios
          .post(`${process.env.VUE_APP_HOST_IP}/api/peakSelect`, null, { params: param })
        if (resp.data !== null) {
          commit('setPeakData', resp.data)
        }
      } catch (err) {
        log.logError(err.message);
      }
    },

    async getNowElec ({ commit }) {
      try {
        const resp = await axios
          .post(`${process.env.VUE_APP_HOST_IP}/api/selectNowElec`)
        if (resp.data !== null) {
          commit('setNowElec', resp.data)
        }
      } catch (err) {
        log.logError(err.message);
      }
    },

    async getPumpStatus ({ commit }) {
      try {
        // const resp = await axios
        //   .post(`${process.env.VUE_APP_HOST_IP}/api/selectPumpStatus`);
        const resp = await axios
          .post(`${process.env.VUE_APP_HOST_IP}/api/analyPump`)
        if (resp.data !== null) {
          commit('setPumpStatus', resp.data)
        }
      } catch (err) {
        log.logError(err.message);
      }
    },

    async getValveData ({ commit }) {
      try {
        const resp = await axios
          .post(`${process.env.VUE_APP_HOST_IP}/api/selectValve`)
        if (resp.data !== null) {
          commit('setValveData', resp.data)
        }
      } catch (err) {
        log.logError(err.message);
      }
    },

    async getTop3 ({ commit }, param) {
      // const param = { // TODO
      //   date: '2023-03-07',
      //   zone_code: '관리동'
      // };

      // param.date = '2023-11-25' // for test

      try {
        const resp = await axios
          .post(`${process.env.VUE_APP_HOST_IP}/api/getTop3`, null, { params: param });
        if (resp.data !== null) {
          commit('setTop3', resp.data)
        }
      } catch (err) {
        log.logError(err.message);
      }
    }
  },

  getters: {
    getAlarm: (state) => {
      return JSON.parse(JSON.stringify(state.alarm))
    },

    getSiteAlarm: (state) => {
      return JSON.parse(JSON.stringify(state.siteAlarm))
    },

    getPeakGoal: (state) => {
      return state.peakGoal
    },

    getPeakData: (state) => {
      return state.peakData
    },

    getCostPeak: (state) => {
      return state.costPeak
    },

    getZoneList: (state) => {
      return state.zoneList
    },

    getPumps: (state) => {
      return state.pumps
    }
  }
}

export default dashboard
