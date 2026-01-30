import axios from 'axios';

const monitor6 = {
    namespaced: true,
    state: {
        selectModel: '자동급수펌프 #1',
        modelList: [
            {
                title: '자동급수펌프 #1',
                id: 'auto_water_pump_01',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    pressure_setting_value: '',
                    eq_on: true,
                    pressure_operation: '',
                    pressure_suction: '',
                },
            },
            {
                title: '자동급수펌프 #2',
                id: 'auto_water_pump_02', // [gelix_lsj_231012] auto_water_pump_01 > auto_water_pump_02 변경
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    pressure_setting_value: '',
                    eq_on: true,
                    pressure_operation: '',
                    pressure_suction: '',
                },
            },
            {
                title: '자동급수펌프 #3',
                id: 'auto_water_pump_03', // [gelix_lsj_231012] auto_water_pump_01 > auto_water_pump_03 변경
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    pressure_setting_value: '',
                    eq_on: true,
                    pressure_operation: '',
                    pressure_suction: '',
                },
            },
            {
                title: '자동급수펌프 #4',
                id: 'auto_water_pump_04', // [gelix_lsj_231012] auto_water_pump_01 > auto_water_pump_04 변경
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    pressure_setting_value: '',
                    eq_on: true,
                    pressure_operation: '',
                    pressure_suction: '',
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
        id: 'auto_water_pump_01',
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
            state.modelList.filter((list) => {
                if (list.id === datas[0].auto_water_pump_id) {
                    list.status.eq_on = datas[0].eq_on;
                    list.status.pressure_setting_value =
                        datas[0].pressure_setting_value;
                    list.status.pressure_operation =
                        datas[0].pressure_operation;
                    list.status.pressure_suction = datas[0].pressure_suction;
                }
            });
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
                    datas[i].current_limit, // [gelix_lsj_231012] current_unbalance > current_limit 변경
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
    },
    actions: {
        handleGraphData({ rootState, state, commit, dispatch }) {
            const params = {
                endDate: state.endDate,
                startDate: state.startDate,
            };

            axios
                .post(
                    `${rootState.globalIP}/api/v1/autoWater/currentInfo`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;
                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.auto_water_pump_id;
                        if (idName === state.modelList[0].id)
                            dataArr_1.push(obj);
                    }
                    commit('handleGraphData', {
                        datas: dataArr_1,
                        index: 0,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_1,
                        index: 1,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_1,
                        index: 2,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_1,
                        index: 3,
                    });
                });

            //알람
            axios
                .get(`${rootState.globalIP}/api/v1/autoWater/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });

            dispatch('getPumpInfo');
        },

        //세부페이지 전류 조회
        handleDatePicker({ rootState, state, commit, dispatch }) {
            const params = {
                endDate: state.pickDate.to,
                startDate: state.pickDate.from,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/autoWater/detailInfo`,
                    params
                )
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.auto_water_pump_id;
                        if (idName === state.id) dataArr_1.push(obj);
                    }
                    commit('handleDatePickGraph', dataArr_1);
                });
            dispatch('getPumpInfo');
        },

        //상태정보 조회
        getPumpInfo({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/autoWater/waterPumpInfo`)
                .then((data) => commit('getPumpInfo', data.data.datas));
        },
    },
};

export default monitor6;
