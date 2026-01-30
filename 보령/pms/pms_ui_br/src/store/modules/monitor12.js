import axios from 'axios';

const monitor12 = {
    namespaced: true,
    state: {
        selectModel: 'GAC역세펌프 #1',
        modelList: [
            {
                title: 'GAC역세펌프 #1',
                id: 'gac_backwash_pump_01',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
                    speed: '',
                },
                distribution: [],
            },
            {
                title: 'GAC역세펌프 #2',
                id: 'gac_backwash_pump_02',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
                    speed: '',
                },
            },
            {
                title: 'GAC역세펌프 #3',
                id: 'gac_backwash_pump_03',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flow_rate: '',
                    pressure: '',
                    speed: '',
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
        id: 'gac_backwash_pump_01',
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
            let current_limit = [];
            let current_unbalance = [];
            let voltage_diff = [];
            let voltage_unbalance = [];
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
            // state.modelList[index].distribution.flow_rate = [];
            // state.modelList[index].distribution.pressure = [];

            // for (let i = 0; i < datas.length; i++) {
            //     state.modelList[index].distribution.flow_rate.push(
            //         datas[i].flow_rate
            //     );
            //     state.modelList[index].distribution.pressure.push(
            //         datas[i].pressure
            //     );
            // }
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
                    `${rootState.globalIP}/api/v1/gacBackwash/currentInfo`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;

                    let dataArr_1 = [];
                    let dataArr_2 = [];
                    let dataArr_3 = [];

                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.gac_backwash_pump_id;
                        if (idName === state.modelList[0].id)
                            dataArr_1.push(obj);
                        if (idName === state.modelList[1].id)
                            dataArr_2.push(obj);
                        if (idName === state.modelList[1].id)
                            dataArr_3.push(obj);
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
                        datas: dataArr_3,
                        index: 2,
                    });
                });

            //알람
            axios
                .get(`${rootState.globalIP}/api/v1/gacBackwash/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });

            dispatch('onEquipCount') // [gelix_lsj_230922] onEquipCount 사용하여 운영대수 조회하도록 변경
            dispatch('getPumpInfo');
            dispatch('distribution', 0);
        },

        //가동대수조회
        onEquipCount({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/gacBackwash/backwashCount`)
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
                    `${rootState.globalIP}/api/v1/gacBackwash/distribution`,
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
                    `${rootState.globalIP}/api/v1/gacBackwash/detailInfo`,
                    params
                )
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.gac_backwash_pump_id;
                        if (idName === state.id) dataArr_1.push(obj);
                    }

                    commit('handleDatePickGraph', dataArr_1);
                });
            dispatch('getPumpInfo');
        },

        //상태정보 조회
        getPumpInfo({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/gacBackwash/backwashInfo`)
                .then((data) => commit('getPumpInfo', data.data.datas));
        },
    },
};

export default monitor12;
