import axios from 'axios';
import log from '@/logger.js'

const monitor20 = {
    namespaced: true,
    state: {
        facStatisticsData: [],
        diagStatisticsData: [],
        defectAlarmAllData: [],
        weeklyAlarmData: [],
        alarmListData: [],
        startDate: '2021-10-21 10:00:00',
        endDate: '2021-10-30 16:00:00',
        pickDate: {
            from: 0,
            to: 0,
        },
    },
    getters: {},
    mutations: {
        SET_FAC_STATISTICS(state, data) {
            state.facStatisticsData = data;
        },
        SET_DIAG_STATISTICS(state, data) {
            state.diagStatisticsData = data;
        },
        SET_DEFECT_ALARM_ALL(state, data) {
            state.defectAlarmAllData = data;
        },
        SET_WEEKLY_ALARM(state, data) {
            state.weeklyAlarmData = data;
        },
        SET_ALARM_LIST(state, data) {
            state.alarmListData = data;
        },
    },
    actions: {
        async fetchFacStatistics({ commit, rootState }) {
            try {
                const response = await axios.get(`${rootState.globalIP}/api/v1/statistics/facStatistics`);
                commit('SET_FAC_STATISTICS', response.data.datas);
            } catch (error) {
                log.logError(error.message);
            }
        },
        async fetchDiagStatistics({ commit, rootState }) {
            try {
                const response = await axios.get(`${rootState.globalIP}/api/v1/statistics/diagStatistics`);
                commit('SET_DIAG_STATISTICS', response.data.datas);
            } catch (error) {
                log.logError(error.message);
            }
        },
        async fetchDefectAlarmAll({ commit, rootState }) {
            try {
                const response = await axios.get(`${rootState.globalIP}/api/v1/statistics/defectAlarmAll`);
                commit('SET_DEFECT_ALARM_ALL', response.data.datas);
            } catch (error) {
                log.logError(error.message);
            }
        },
        async fetchWeeklyAlarm({ commit, rootState }) {
            try {
                const response = await axios.get(`${rootState.globalIP}/api/v1/statistics/weeklyAlarm`);
                commit('SET_WEEKLY_ALARM', response.data.datas);
            } catch (error) {
                log.logError(error.message);
            }
        },
        async fetchAlarmList({ commit, state, rootState }) {
 
            const search= state.pickDate.from
            const search2= state.pickDate.to

            try {
                const response = await axios.get(`${rootState.globalIP}/api/v1/statistics/alarmList`, {
                    params: { search, search2 }
                });
                commit('SET_ALARM_LIST', response.data.datas);
            } catch (error) {
                log.logError(error.message);
            }
        },
    },
};

export default monitor20;
