import axios from 'axios';
import comp1 from '@/assets/data/comp_1.json';
import comp2 from '@/assets/data/comp_2.json';

const monitor11 = {
    namespaced: true,
    state: {
        selectModel: '역세송풍기 #1',
        modelList: [
            {
                title: '역세송풍기 #1',
                id: 'backwash_blower_01',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
                    speed: '',
                },
                distribution: {
                    flow_rate: [],
                    pressure: [],
                },
                comp: comp1,
            },
            {
                title: '역세송풍기 #2',
                id: 'backwash_blower_02',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
                    speed: '',
                },
                distribution: {
                    flow_rate: [],
                    pressure: [],
                },
                comp: comp2,
            },
        ],
        detailData: {
            acq_date: [],
            current_limit: [],
            current_unbalance: [],
            voltage_diff: [],
            voltage_unbalance: [],
            ch_I_backwash: [],
        },
        // startDate: '',
        // endDate: '',
        startDate: '2021-10-01 00:00:00',
        endDate: '2021-10-31 00:00:00',
        id: 'backwash_blower_01',
        pickDate: {
            from: 0,
            to: 0,
        },
        pumpStatus: {},
        equipCount: 0,
    },
    getters: {
        selectModelStatus: (state) => {
            let data = {
                eq_on: state.modelList.filter((list) => list.id === state.id)[0]
                    .status.eq_on,
                flow_rate: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].status.flow_rate,
                pressure: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].status.pressure,
                speed: state.modelList.filter((list) => list.id === state.id)[0]
                    .status.speed,
            };
            return data;
        },
    },
    mutations: {
        handleGraphData(state, { datas, index }) {
            state.modelList[index].current = [];
            let current = [];
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                current.push([date.getTime(), datas[i].current]);
            }
            if (current.length !== 0) {
                let avarage = Number(current[current.length - 1][1]).toFixed(2);
                state.modelList[index].avarage = avarage;
            } else {
                state.modelList[index].avarage = 0;
            }
            state.modelList[index].current = current;
        },
        alramIsTrue(state, datas) {
            state.modelList.filter((list) => {
                if (list.id === datas.id) list.alram = true;
            });
        },
        getPumpInfo(state, datas) {
            for (let i = 0; i < datas.length; i++) {
                // [gelix_lsj_230922] flow_rate 값 null 체크
                if (datas[i].flow_rate !== null && typeof datas[i].flow_rate !== 'undefined') {
                    state.modelList[i].status.flow_rate = datas[
                        i
                    ].flow_rate.toFixed(2);
                }
                // [gelix_lsj_230922] pressure 값 null 체크
                if (datas[i].pressure !== null && typeof datas[i].pressure !== 'undefined') {
                    state.modelList[i].status.pressure = datas[
                        i
                    ].pressure.toFixed(2);
                }
                state.modelList[i].status.eq_on = datas[i].eq_on;
            }
        },
        handleDatePickGraph(state, datas) {
            state.detailData.current_limit = [];
            state.detailData.current_unbalance = [];
            state.detailData.voltage_diff = [];
            state.detailData.voltage_unbalance = [];
            state.detailData.ch_I_backwash = [];
            let current_limit = [];
            let current_unbalance = [];
            let voltage_diff = [];
            let voltage_unbalance = [];
            let ch_I_backwash = [];
            // let datas = data.datas;
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                current_limit.push([
                    date.getTime(),
                    datas[i].current_limit, // [gelix_lsj_230922] current_unbalance > current_limit 변경
                ]);
                current_unbalance.push([
                    date.getTime(),
                    datas[i].current_unbalance,
                ]);
                voltage_diff.push([date.getTime(), datas[i].voltage_diff]);
                voltage_unbalance.push([
                    date.getTime(),
                    datas[i].voltage_unbalance,
                ]);
                ch_I_backwash.push([date.getTime(), datas[i].ch_I_backwash]);
            }
            state.detailData.current_limit = current_limit;
            state.detailData.current_unbalance = current_unbalance;
            state.detailData.voltage_diff = voltage_diff;
            state.detailData.voltage_unbalance = voltage_unbalance;
            state.detailData.ch_I_backwash = ch_I_backwash;
        },
        equipCount(state, datas) {
            state.equipCount = datas[0].eq_on;
        },
        distribution(state, { datas, index }) {
            state.modelList[index].distribution.flow_rate = [];
            state.modelList[index].distribution.pressure = [];

            datas.filter((list) => {
                if (list.backwash_blower_id === state.modelList[index].id) {
                    state.modelList[index].distribution.flow_rate.push(
                        list.flow_rate
                    );
                    state.modelList[index].distribution.pressure.push(
                        list.pressure
                    );
                }
            });
        },
    },
    actions: {
        handleGraphData({ rootState, state, commit, dispatch }) {
            const params = {
                endDate: state.endDate,
                startDate: state.startDate,
            };

            axios
                .post(
                    `${rootState.globalIP}/api/v1/backWashBlower/currentInfo`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;

                    let dataArr_1 = [];
                    let dataArr_2 = [];

                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.backwash_blower_id;
                        if (idName === state.modelList[0].id)
                            dataArr_1.push(obj);
                        if (idName === state.modelList[1].id)
                            dataArr_2.push(obj);
                    }

                    commit('handleGraphData', {
                        datas: dataArr_1,
                        index: 0,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_2,
                        index: 1,
                    });
                });

            //알람
            axios
                .get(`${rootState.globalIP}/api/v1/backWashBlower/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });

            dispatch('onEquipCount');
            dispatch('getPumpInfo');
            dispatch('distribution', 0);
            dispatch('distribution', 1);
        },

        //가동대수조회
        onEquipCount({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/backWashBlower/count`)
                .then((data) => {
                    commit('equipCount', data.data.datas);
                });
        },
        //분포도조회
        distribution({ rootState, state, commit }, index) {
            const params = {
                endDate: state.endDate,
                id: state.modelList[index].id,
                startDate: state.startDate,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/backWashBlower/distribution`,
                    params
                )
                .then((data) => {
                    commit('distribution', { datas: data.data.datas, index });
                });
        },

        //세부페이지 전류 조회
        handleDatePicker({ rootState, state, commit, dispatch }) {
            const params = {
                endDate: state.pickDate.to,
                startDate: state.pickDate.from,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/backWashBlower/detailInfo`,
                    params
                )
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.backwash_blower_id;
                        if (idName === state.id) dataArr_1.push(obj);
                    }

                    commit('handleDatePickGraph', dataArr_1);
                });
            dispatch('getPumpInfo');
        },

        //상태정보 조회
        getPumpInfo({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/backWashBlower/blowerInfo`)
                .then((data) => commit('getPumpInfo', data.data.datas));
        },
    },
};

export default monitor11;
