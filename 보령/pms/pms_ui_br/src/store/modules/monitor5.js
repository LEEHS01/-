import axios from 'axios';

const monitor5 = {
    namespaced: true,
    state: {
        selectModel: 'PAHCS튜브펌프 #1',
        modelList: [
            {
                title: 'PAHCS튜브펌프 #1',
                id: 'pahcs_tube_pump_01',
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
                title: 'PAHCS튜브펌프 #2',
                id: 'pahcs_tube_pump_02',
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
                title: 'PAHCS튜브펌프 #3',
                id: 'pahcs_tube_pump_03',
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
            current: [],
            pahcs_ch_single_i: [],
            diff_voltage: [],
        },
        // startDate: '',
        // endDate: '',
        startDate: '2021-10-01 00:00:00',
        endDate: '2021-10-31 00:00:00',
        id: 'pahcs_tube_pump_01',
        pickDate: {
            from: 0,
            to: 0,
        },
        pumpStatus: {},
    },
    getters: {
        selectModelStatus: (state) => {
            let data = {
                eq_on: state.modelList.filter((list) => list.id === state.id)[0]
                    .status.eq_on,
                flowppm: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].status.flowppm,
                flowmeter: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].status.flowmeter,
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
        //알람조회
        alramIsTrue(state, datas) {
            state.modelList.filter((list) => {
                if (list.id === datas.id) list.alram = true;
            });
        },
        handleDatePickGraph(state, datas) {
            state.detailData.current = [];
            state.detailData.diff_voltage = [];
            state.detailData.pahcs_ch_single_i = [];
            let current = [];
            let diff_voltage = [];
            let pahcs_ch_single_i = [];
            // let datas = data.datas;
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                current.push([date.getTime(), datas[i].current]);
                diff_voltage.push([date.getTime(), datas[i].diff_voltage]);
                pahcs_ch_single_i.push([
                    date.getTime(),
                    datas[i].pahcs_ch_single_i,
                ]);
            }
            state.detailData.current = current;
            state.detailData.diff_voltage = diff_voltage;
            state.detailData.pahcs_ch_single_i = pahcs_ch_single_i;
        },
        pahcsTubeInfo(state, datas) {
            for (let i = 0; i < datas.length; i++) {
                state.modelList[i].status = {
                    eq_on: datas[i].eq_on,
                    flowmeter: datas[i].flowmeter,
                    flowppm: datas[i].flowppm,
                };
            }
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
                    `${rootState.globalIP}/api/v1/pahcsTube/currentInfo`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;
                    let dataArr_1 = [];
                    let dataArr_2 = [];
                    let dataArr_3 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.pahcs_tube_pump_id;
                        if (idName === state.modelList[0].id)
                            dataArr_1.push(obj);
                        if (idName === state.modelList[1].id)
                            dataArr_2.push(obj);
                        if (idName === state.modelList[2].id)
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
                .get(`${rootState.globalIP}/api/v1/pahcsTube/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });

            dispatch('pahcsTubeInfo');
        },

        //세부페이지 전류 조회
        handleDatePicker({ rootState, state, commit, dispatch }) {
            const params = {
                endDate: state.pickDate.to,
                startDate: state.pickDate.from,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/pahcsTube/detailInfo`,
                    params
                )
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.pahcs_tube_pump_id;
                        if (idName === state.id) dataArr_1.push(obj);
                    }

                    commit('handleDatePickGraph', dataArr_1);
                });
            dispatch('pahcsTubeInfo');
        },

        //상태정보 조회
        pahcsTubeInfo({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/pahcsTube/pahcsTubeInfo`)
                .then((data) => commit('pahcsTubeInfo', data.data.datas));
        },
    },
};

export default monitor5;
