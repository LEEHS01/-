import axios from 'axios';

const monitor14 = {
    namespaced: true,
    state: {
        selectModel: '냉각수펌프 #1',
        modelList: [
            {
                title: '냉각수펌프 #1',
                id: 'cooling_pump_01',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: ' ',
                    outflow_temp: ' ',
                },
            },
            {
                title: '냉각수펌프 #2',
                id: 'cooling_pump_02',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: ' ',
                    outflow_temp: ' ',
                },
            },
            {
                title: '냉각수펌프 #3',
                id: 'cooling_pump_03',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: ' ',
                    outflow_temp: ' ',
                },
            },
            {
                title: '냉각수펌프 #4',
                id: 'cooling_pump_04',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: ' ',
                    outflow_temp: ' ',
                },
            },
        ],
        detailData: {
            current_limit: [],
            current_unbalance: [],
            voltage_diff: [],
            voltage_unbalance: [],
        },
        // startDate: '',
        // endDate: '',
        startDate: '2021-10-01 00:00:00',
        endDate: '2021-10-31 00:00:00',
        id: 'cooling_pump_01',
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
                state.modelList[i].status = {
                    eq_on: datas[i].eq_on,
                    outflow_temp: datas[i].outflow_temp,
                    flowmeter: datas[i].flowmeter,
                };
            }
        },
        handleDatePickGraph(state, datas) {
            state.detailData.current_limit = [];
            state.detailData.current_unbalance = [];
            state.detailData.voltage_diff = [];
            state.detailData.voltage_unbalance = [];
            let current_limit = [];
            let current_unbalance = [];
            let voltage_diff = [];
            let voltage_unbalance = [];
            // let datas = data.datas;
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                current_limit.push([date.getTime(), datas[i].current_limit]);
                current_unbalance.push([
                    date.getTime(),
                    datas[i].current_unbalance,
                ]);
                voltage_diff.push([date.getTime(), datas[i].voltage_diff]);
                voltage_unbalance.push([
                    date.getTime(),
                    datas[i].voltage_unbalance,
                ]);
            }
            state.detailData.current_limit = current_limit;
            state.detailData.current_unbalance = current_unbalance;
            state.detailData.voltage_diff = voltage_diff;
            state.detailData.voltage_unbalance = voltage_unbalance;
        },
        equipCount(state, datas) {
            state.equipCount = datas[0].eq_on;
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
                    `${rootState.globalIP}/api/v1/coolingPump/currentInfo`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;

                    let dataArr_1 = [];
                    let dataArr_2 = [];
                    let dataArr_3 = [];
                    let dataArr_4 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.cooling_pump_id;
                        if (idName === state.modelList[0].id)
                            dataArr_1.push(obj);
                        if (idName === state.modelList[1].id)
                            dataArr_2.push(obj);
                        if (idName === state.modelList[2].id)
                            dataArr_3.push(obj);
                        if (idName === state.modelList[3].id)
                            dataArr_4.push(obj);
                    }

                    commit('handleGraphData', {
                        datas: dataArr_1,
                        index: 0,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_2,
                        index: 1,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_3, // [gelix_lsj_230922] dataArr_2 > dataArr_3 변경
                        index: 2,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_4, // [gelix_lsj_230922] dataArr_3 > dataArr_4 변경
                        index: 3,
                    });
                });

            //알람
            axios
                .get(`${rootState.globalIP}/api/v1/coolingPump/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });

            // dispatch('onEquipCount')
            dispatch('getPumpInfo');
        },

        //가동대수조회
        onEquipCount({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/motifPump/count`)
                .then((data) => {
                    commit('equipCount', data.data.datas);
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
                    `${rootState.globalIP}/api/v1/coolingPump/detailInfo`,
                    params
                )
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.cooling_pump_id;
                        if (idName === state.id) dataArr_1.push(obj);
                    }

                    commit('handleDatePickGraph', dataArr_1);
                });
            dispatch('getPumpInfo');
        },

        //상태정보 조회
        getPumpInfo({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/coolingPump/coolingPumpInfo`)
                .then((data) => commit('getPumpInfo', data.data.datas));
        },
    },
};

export default monitor14;
