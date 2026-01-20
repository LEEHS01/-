import axios from 'axios'
import { groupBy } from '@/utils/utils.js'

const cost = {
  namespaced: true,

  state: {
    selectedDate: '2022-12',
    selectedmonth: '12',
    totalFee: 0,
    season: '가을철',
    subRateCategory: '',
    baseFee: 0,
    etcFee: 0,
    lightLoadFee: 0,
    middleLoadFee: 0,
    highLoadFee: 0,
    contractPower: 0,
    usedPower: 0,
    dataMissing: 0,
    lightLoadPower: 0,
    middleLoadPower: 0,
    highLoadPower: 0,
    seasonData: [],
    seasonDataList: [],
    rawRateData: [],
    rateIdx: 0
  },

  mutations: {
    setSeasonData (state, data) {
      state.seasonData = groupBy(data, 'RATE_IDX');
    },

    changeRateData (state, selectedIdx) {
      state.rateIdx = selectedIdx;
      state.totalFee = state.rawRateData[selectedIdx].TOT_FEE;
      state.baseFee = state.rawRateData[selectedIdx].BASE_FEE;
      state.etcFee = state.rawRateData[selectedIdx].ETC_FEE;
      state.lightLoadFee = state.rawRateData[selectedIdx].L_ELCTR_FEE;
      state.middleLoadFee = state.rawRateData[selectedIdx].M_ELCTR_FEE;
      state.highLoadFee = state.rawRateData[selectedIdx].H_ELCTR_FEE;
      state.seasonDataList = groupBy(state.seasonData[state.rawRateData[selectedIdx].RATE_IDX], 'MNTH')[state.selectedmonth];
    },

    setMonthRateData (state, { month, data }) {
      state.selectedDate = month;
      state.selectedmonth = month.replaceAll('-', '').substr(4, 2);
      state.rawRateData = data;

      if (data.length > 0) {
        let opt = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].OPT_RATE_YN === '1') {
            opt = i;
            break;
          }
        }
        state.rateIdx = opt;
        state.subRateCategory = data[opt].MIDDLE_CTGRY + ' ' + data[opt].SMALL_CTGRY;
        state.totalFee = data[opt].TOT_FEE;
        state.baseFee = data[opt].BASE_FEE;
        state.etcFee = data[opt].ETC_FEE;
        state.lightLoadFee = data[opt].L_ELCTR_FEE;
        state.middleLoadFee = data[opt].M_ELCTR_FEE;
        state.highLoadFee = data[opt].H_ELCTR_FEE;
        state.contractPower = data[0].PWR;
        state.usedPower = data[0].TOT_PWR;
        state.dataMissing = data[0].DT_MSN_PRCNT;
        state.lightLoadPower = data[0].L_PWR;
        state.middleLoadPower = data[0].M_PWR;
        state.highLoadPower = data[0].H_PWR;
        state.seasonDataList = groupBy(state.seasonData[data[opt].RATE_IDX], 'MNTH')[state.selectedmonth];
        state.season = groupBy(state.seasonData[7], 'MNTH')[state.selectedmonth][0].SSN;
      } else {
        state.subRateCategory = '';
        state.totalFee = 0;
        state.baseFee = 0;
        state.etcFee = 0;
        state.lightLoadFee = 0;
        state.middleLoadFee = 0;
        state.highLoadFee = 0;
        state.contractPower = 0;
        state.usedPower = 0;
        state.dataMissing = 0;
        state.lightLoadPower = 0;
        state.middleLoadPower = 0;
        state.highLoadPower = 0;
        state.seasonDataList = [];
        state.season = '겨울철';
      }
    }
  },

  actions: {
    fetchRateInfo ({ commit }) {
      axios
        .post(
          `${process.env.VUE_APP_HOST_IP}/api/selectRateInfo`,
          ''
        )
        .then((resp) => {
          commit('setSeasonData', resp.data);
        })
        .catch((error) => {
          if (error.response) {
            // console.log(error.response.data);
            // console.log(error.response.status);
          }
        });
    },

    fetchMonthRateData ({ commit }, selectedMonth) {
      const params = { search: selectedMonth.replaceAll('-', '') };
      // const params = { search: '202206' };

      axios
        .post(
          `${process.env.VUE_APP_HOST_IP}/api/selectRtRate`,
          params
        )
        .then((resp) => {
          commit('setMonthRateData', { month: selectedMonth, data: resp.data });
        })
        .catch((error) => {
          if (error.response) {
            // console.log(error.response.data);
            // console.log(error.response.status);
          }
        });
    },

    changeRate({ commit }, selectedIdx) {
      commit('changeRateData', selectedIdx);
    }
  },

  getters: {
  }
}

export default cost;
