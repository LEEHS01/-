import axios from 'axios';

const monitor10 = {
    namespaced: true,
    state: {
        selectModel: '여과역세펌프 #1',
        modelList: [
            {
                title: '여과역세펌프 #1',
                id: 'filter_backwash_pump_01',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
                },
                distribution: [],
            },
            {
                title: '여과역세펌프 #2',
                id: 'filter_backwash_pump_02',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
                },
            },
            {
                title: '여과역세펌프 #3',
                id: 'filter_backwash_pump_03',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
                },
            },
            {
                title: '여과역세펌프 #4',
                id: 'filter_backwash_pump_04',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
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
        id: 'filter_backwash_pump_01',
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
        distribution(state, datas) {
            state.modelList[0].distribution = [];
            for (let i = 0; i < datas.length; i++) {
                let obj = datas[i];
                // if (i % 2 == 0) {
                if (obj.flow_rate >= 1 && obj.pressure >= 1) {
                    state.modelList[0].distribution.push([
                        obj.flow_rate,
                        obj.pressure,
                    ]);
                }
                // }
            }
            // datas.filter((list) => {
            //     if (list.filter_backwash_pump_id === state.modelList[0].id) {
            //         state.modelList[0].distribution.flow_rate.push(
            //             list.flow_rate
            //         );
            //         state.modelList[0].distribution.pressure.push(
            //             list.pressure
            //         );
            //     }
            // });
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
                    `${rootState.globalIP}/api/v1/filterBackWash/currentInfo`,
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
                        let idName = obj.filter_backwash_pump_id;
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
                .get(`${rootState.globalIP}/api/v1/filterBackWash/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });

            dispatch('onEquipCount');
            dispatch('getPumpInfo');
            dispatch('distribution');
        },

        //가동대수조회
        onEquipCount({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/filterBackWash/count`)
                .then((data) => {
                    commit('equipCount', data.data.datas);
                });
        },
        //분포도조회
        distribution({ rootState, state, commit }) {
            const params = {
                endDate: state.endDate,
                id: state.modelList[0].id,
                startDate: state.startDate,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/filterBackWash/distribution`,
                    params
                )
                .then((data) => {
                    commit('distribution', data.data.datas);
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
                    `${rootState.globalIP}/api/v1/filterBackWash/detailInfo`,
                    params
                )
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.filter_backwash_pump_id;
                        if (idName === state.id) dataArr_1.push(obj);
                    }

                    commit('handleDatePickGraph', dataArr_1);
                });
            dispatch('getPumpInfo');
        },

        //상태정보 조회
        getPumpInfo({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/filterBackWash/info`)
                .then((data) => commit('getPumpInfo', data.data.datas));
        },
    },
};

export default monitor10;
