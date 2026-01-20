import axios from 'axios';

const monitor9 = {
    namespaced: true,
    state: {
        selectModel: '침전슬러지수집기 #1',
        modelList: [
            {
                title: '침전슬러지수집기 #1',
                id: 'sludge_collector_01',
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
        id: 'sludge_collector_01',
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
        getPumpInfo(state, datas) {
            for (let i = 0; i < datas.length; i++) {
                state.modelList[i].status = {
                    eq_on: datas[i].eq_on,
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
    },
    actions: {
        handleGraphData({ rootState, state, commit, dispatch }) {
            const params = {
                endDate: state.endDate,
                startDate: state.startDate,
            };

            axios
                .post(`${rootState.globalIP}/api/v1/sludge/currentInfo`, params)
                .then((data) => {
                    const datas = data.data.datas;

                    let dataArr = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.sludge_collector_id;
                        if (idName === state.modelList[0].id) dataArr.push(obj);
                    }

                    commit('handleGraphData', {
                        datas: dataArr,
                        index: 0,
                    });
                })
                // [gelix_lsj_230922] db에 관련 table 및 column이 없어 예외처리
                .catch(function (error) {
                    if (error.response) {
                        // console.log(error.response.data)
                    }
                    else if (error.request) {
                        // console.log(error.request)
                    }
                    else {
                        // console.log('Error', error.message)
                    }
                })

            //알람
            axios
                .get(`${rootState.globalIP}/api/v1/sludge/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                })
                // [gelix_lsj_230922] db에 관련 table 및 column이 없어 예외처리
                .catch(function (error) {
                    if (error.response) {
                        // console.log(error.response.data)
                    }
                    else if (error.request) {
                        // console.log(error.request)
                    }
                    else {
                        // console.log('Error', error.message)
                    }
                })

            dispatch('onEquipCount');
            dispatch('getPumpInfo');
        },

        //가동대수조회
        onEquipCount({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/sludge/sludgeInfo`)
                .then((data) => {
                    commit('equipCount', data.data.datas);
                })
                // [gelix_lsj_230922] db에 관련 table 및 column이 없어 예외처리
                .catch(function (error) {
                    if (error.response) {
                        // console.log(error.response.data)
                    }
                    else if (error.request) {
                        // console.log(error.request)
                    }
                    else {
                        // console.log('Error', error.message)
                    }
                })
        },

        //세부페이지 전류 조회
        handleDatePicker({ rootState, state, commit }) {
            const params = {
                endDate: state.endDate,
                startDate: state.startDate,
            };
            axios
                .post(`${rootState.globalIP}/api/v1/sludge/detailInfo`, params)
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.agglomerate_id;
                        if (idName === state.id) dataArr.push(obj);
                    }

                    commit('handleDatePickGraph', dataArr);
                })
                // [gelix_lsj_230922] db에 관련 table 및 column이 없어 예외처리
                .catch(function (error) {
                    if (error.response) {
                        // console.log(error.response.data)
                    }
                    else if (error.request) {
                        // console.log(error.request)
                    }
                    else {
                        // console.log('Error', error.message)
                    }
                })
            // dispatch('getPumpInfo');
        },

        //상태정보 조회
        getPumpInfo({ rootState, commit }) {
            axios
                .get(
                    `${rootState.globalIP}/api/v1/rapidAgitator/rapidAgitatorInfo`
                )
                .then((data) => commit('getPumpInfo', data.data.datas));
        },
    },
};

export default monitor9;
