import axios from 'axios';
import log from '@/logger.js'

const monitor19 = {
  namespaced: true,
  state: {
    diagPOVData: [],
    diagPIVData: [],
    diagMOVData: [],
    diagMIVData: [],
    diagTimeWaveData: [],
    diagSpecTrumData: [],
    centerId:'전동1(가)',
    ipcLocId:'전동1가압장',
    pumpMotorId:'motor_01',
    channelId:'1Ch_P',
    nav:'POV',
    pumpNum: '1',
    pmId: '1PM',
    lastSpot:'',

    startDate: '2021-10-21 10:00:00',
    endDate: '2021-10-30 16:00:00',
    pickDate: {
        from: 0,
        to: 0,
    },
  },
  getters: {},
  mutations: {
    SET_DIAG_POV_DATA(state, data) {
      state.diagPOVData = data;
    },
    SET_DIAG_PIV_DATA(state, data) {
      state.diagPIVData = data;
    },
    SET_DIAG_MOV_DATA(state, data) {
      state.diagMOVData = data;
    },
    SET_DIAG_MIV_DATA(state, data) {
      state.diagMIVData = data;
    },
    SET_DIAG_TIMEWAVE_DATA(state, data) {
      state.diagTimeWaveData = data;
    },
    SET_DIAG_SPECTRUM_DATA(state, data) {
      state.diagSpecTrumData = data;
    },
  },
  actions: {
    async fetchDiagPOV({ commit, state, rootState }) {
      try {
        const response = await axios.post(`${rootState.globalIP}/api/v1/diagnosis/diagPOV`, {
            centerId:state.centerId,
            pumpId:state.pumpMotorId,
            startDate: state.startDate,
            endDate: state.endDate,

        });
        commit('SET_DIAG_POV_DATA', response.data.datas);
      } catch (error) {
          log.logError(error.message);
      }
    },
    async fetchDiagPIV({ commit, state, rootState }) {
      try {
        const response = await axios.post(`${rootState.globalIP}/api/v1/diagnosis/diagPIV`, {
            centerId:state.centerId,
            pumpId:state.pumpMotorId,
            startDate: state.startDate,
            endDate: state.endDate,

        });
        commit('SET_DIAG_PIV_DATA', response.data.datas);
      } catch (error) {
          log.logError(error.message);
      }
    },
    async fetchDiagMOV({ commit, state, rootState }) {
      try {
        const response = await axios.post(`${rootState.globalIP}/api/v1/diagnosis/diagMOV`, {
            centerId:state.centerId,
            motorId:state.pumpMotorId,
            startDate: state.startDate,
            endDate: state.endDate,
        });
        commit('SET_DIAG_MOV_DATA', response.data.datas);
      } catch (error) {
          log.logError(error.message);
      }
    },
    async fetchDiagMIV({ commit, state, rootState }) {
      try {
        const response = await axios.post(`${rootState.globalIP}/api/v1/diagnosis/diagMIV`, {
            centerId:state.centerId,
            motorId:state.pumpMotorId,
            startDate: state.startDate,
            endDate: state.endDate,
        });
        commit('SET_DIAG_MIV_DATA', response.data.datas);
      } catch (error) {
          log.logError(error.message);
      }
    },
    async fetchTimeWave({ commit, state, rootState }) {
      try {
        const response = await axios.post(`${rootState.globalIP}/api/v1/diagnosis/diagTimeWave`, {
            centerId:state.ipcLocId,
            channelId:state.channelId,
            startDate: state.lastSpot,
            endDate: state.endDate,
        });
        commit('SET_DIAG_TIMEWAVE_DATA', response.data.datas);
      } catch (error) {
          log.logError(error.message);
      }
    },
    async fetchSpecTrum({ commit, state, rootState }) {
      try {
        const response = await axios.post(`${rootState.globalIP}/api/v1/diagnosis/diagSpecTrum`, {
            centerId:state.ipcLocId,
            pmId:state.pmId,
            channelId:state.channelId,
            startDate: state.lastSpot,
            endDate: state.endDate,
        });
        commit('SET_DIAG_SPECTRUM_DATA', response.data.datas);
      } catch (error) {
          log.logError(error.message);
      }
    },
  },
};

export default monitor19;
