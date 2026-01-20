import axios from 'axios';

const monitor8 = {
    namespaced: true,
    state: {
        selectModel: '응집기 #2',
        modelList: [
            {
                title: '응집지 #2',
                id: 'agglomerate_01',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: '',
                    flowppm: '',
                },
            },
            {
                title: '응집지 #3',
                id: 'agglomerate_02',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: '',
                    flowppm: '',
                },
            },
            {
                title: '응집지 #4',
                id: 'agglomerate_03',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: '',
                    flowppm: '',
                },
            },
            {
                title: '응집지 #5',
                id: 'agglomerate_04',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: '',
                    flowppm: '',
                },
            },
            {
                title: '응집지 #6',
                id: 'agglomerate_05',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: '',
                    flowppm: '',
                },
            },
            {
                title: '응집지 #7',
                id: 'agglomerate_06',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: '',
                    flowppm: '',
                },
            },
            {
                title: '응집지 #8',
                id: 'agglomerate_07',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: '',
                    flowppm: '',
                },
            },
            {
                title: '응집지 #9',
                id: 'agglomerate_08',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: true,
                    flowmeter: '',
                    flowppm: '',
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
        id: 'agglomerate_01',
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
                pressure_setting_value: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].status.pressure_setting_value,
                pressure_operation: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].status.pressure_operation,
                pressure_suction: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].status.pressure_suction,
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
        getPumpInfo(state, { datas, idx }) {
            if (datas[0].eq_on > 0) {
                state.modelList[idx].status.eq_on = true;
            } else {
                state.modelList[idx].status.eq_on = false;
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
                    datas[i].current_limit, // [gelix_lsj_231004] current_unbalance > current_limit 변경
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
    },
    actions: {
        handleGraphData({ rootState, state, commit, dispatch }) {
            const params = {
                endDate: state.endDate,
                startDate: state.startDate,
            };

            axios
                .post(
                    `${rootState.globalIP}/api/v1/agglomerate/currentInfo`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;

                    let dataArr_1 = [];
                    let dataArr_2 = [];
                    let dataArr_3 = [];
                    let dataArr_4 = [];
                    let dataArr_5 = [];
                    let dataArr_6 = [];
                    let dataArr_7 = [];
                    let dataArr_8 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.agglomerate_id;
                        if (idName === state.modelList[0].id)
                            dataArr_1.push(obj);
                        if (idName === state.modelList[1].id)
                            dataArr_2.push(obj);
                        if (idName === state.modelList[2].id)
                            dataArr_3.push(obj);
                        if (idName === state.modelList[3].id)
                            dataArr_4.push(obj);
                        if (idName === state.modelList[4].id)
                            dataArr_5.push(obj);
                        if (idName === state.modelList[5].id)
                            dataArr_6.push(obj);
                        if (idName === state.modelList[6].id)
                            dataArr_7.push(obj);
                        if (idName === state.modelList[7].id)
                            dataArr_8.push(obj);
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
                    commit('handleGraphData', {
                        datas: dataArr_4,
                        index: 3,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_5,
                        index: 4,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_6,
                        index: 5,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_7,
                        index: 6,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_8,
                        index: 7,
                    });
                });

            //알람
            axios
                .get(`${rootState.globalIP}/api/v1/agglomerate/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });

            dispatch('onEquipCount');
            dispatch('getPumpInfo');
        },

        //가동대수조회
        onEquipCount({ rootState, commit }) {
            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateCount`
                )
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
                    `${rootState.globalIP}/api/v1/agglomerate/detailInfo`,
                    params
                )
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.agglomerate_id;
                        if (idName === state.id) dataArr.push(obj);
                    }

                    commit('handleDatePickGraph', dataArr);
                });
            dispatch('getPumpInfo');
        },

        //상태정보 조회
        getPumpInfo({ rootState, state, commit }) {
            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateInfo/${state.modelList[0].id}`
                )
                .then((data) =>
                    commit('getPumpInfo', { datas: data.data.datas, idx: 0 })
                );

            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateInfo/${state.modelList[1].id}`
                )
                .then((data) =>
                    commit('getPumpInfo', { datas: data.data.datas, idx: 1 })
                );

            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateInfo/${state.modelList[2].id}`
                )
                .then((data) =>
                    commit('getPumpInfo', { datas: data.data.datas, idx: 2 })
                );

            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateInfo/${state.modelList[3].id}`
                )
                .then((data) =>
                    commit('getPumpInfo', { datas: data.data.datas, idx: 3 })
                );

            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateInfo/${state.modelList[4].id}`
                )
                .then((data) =>
                    commit('getPumpInfo', { datas: data.data.datas, idx: 4 })
                );

            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateInfo/${state.modelList[5].id}`
                )
                .then((data) =>
                    commit('getPumpInfo', { datas: data.data.datas, idx: 5 })
                );

            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateInfo/${state.modelList[6].id}`
                )
                .then((data) =>
                    commit('getPumpInfo', { datas: data.data.datas, idx: 6 })
                );

            axios
                .get(
                    `${rootState.globalIP}/api/v1/agglomerate/agglomerateInfo/${state.modelList[7].id}`
                )
                .then((data) =>
                    commit('getPumpInfo', { datas: data.data.datas, idx: 7 })
                );
        },
    },
};

export default monitor8;
