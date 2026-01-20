import axios from 'axios';

const monitor3 = {
    namespaced: true,
    state: {
        selectModel: '착수정유입밸브 #1',
        modelList: [
            {
                title: '착수정유입밸브 #1',
                id: 'water_controll_valve_01',
                current: [],
                avarage: 0,
                alarm: false,
                eq_open: false,
                status: {
                    variance: '',
                    overcurrent: '',
                },
            },
            {
                title: '착수정유입밸브 #2',
                id: 'water_controll_valve_02',
                current: [],
                avarage: 0,
                alarm: false,
                eq_open: false,
                status: {
                    variance: '',
                    overcurrent: '',
                },
            },
        ],
        detailData: {
            current: [],
            volve_voltage_variance: [],
        },
        // startDate: '',
        // endDate: '',
        startDate: '2021-10-01 00:00:00',
        endDate: '2021-10-31 00:00:00',
        id: 'water_controll_valve_01',
        pickDate: {
            from: 0,
            to: 0,
        },
    },
    getters: {
        selectModelStatus: (state) => {
            let data = {
                eq_open: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].eq_open,
                status: state.modelList.filter(
                    (list) => list.id === state.id
                )[0].status,
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
                current.push([date.getTime(), datas[i].electric_current]);
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
                // [gelix_lsj_231012] datas 배열 처리 및 id > water_controll_valve_id 변경
                datas.filter((data) => {
                  if (list.id === data.water_controll_valve_id) list.alram = true;
                });
            });
        },
        eqopenIsTrue(state, datas) {
            state.modelList.filter((list) => {
                // [gelix_lsj_231012] datas 배열 처리 및 id > water_controll_valve_id 변경
                datas.filter((data) => {
                  if (list.id === data.water_controll_valve_id) list.eq_open = true;
                });
            });
        },
        statusInfo(state, datas) {
            state.modelList.filter((list) => {
                if (list.id === datas.water_controll_valve_id) {
                    list.status = {
                        variance: datas.volve_voltage_variance_alarm,
                        overcurrent: datas.volve_overcurrent_alarm,
                    };
                }
            });
        },
        handleDatePickGraph1(state, datas) {
            state.detailData.current = [];
            let current = [];
            // let datas = data.datas;
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                current.push([date.getTime(), datas[i].current]);
            }
            state.detailData.current = current;
        },
        handleDatePickGraph2(state, datas) {
            state.detailData.volve_voltage_variance = [];
            let volve_voltage_variance = [];
            // let datas = data.datas;
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                volve_voltage_variance.push([
                    date.getTime(),
                    datas[i].volve_voltage_variance,
                ]);
            }
            state.detailData.volve_voltage_variance = volve_voltage_variance;
        },
    },
    actions: {
        handleGraphData({ rootState, state, commit }) {
            const params = {
                endDate: state.endDate,
                id: state.modelList[0].id,
                startDate: state.startDate,
            };

            const params2 = {
                endDate: state.endDate,
                id: state.modelList[1].id,
                startDate: state.startDate,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/waterControl/currentGraph`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;
                    commit('handleGraphData', { datas, index: 0 });
                });

            axios
                .post(
                    `${rootState.globalIP}/api/v1/waterControl/currentGraph`,
                    params2
                )
                .then((data) => {
                    const datas = data.data.datas;
                    commit('handleGraphData', { datas, index: 1 });
                });

            //개폐여부
            axios
                .get(`${rootState.globalIP}/api/v1/waterControl/eqOpen`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('eqopenIsTrue', datas);
                    }
                });
            //알람
            axios
                .get(`${rootState.globalIP}/api/v1/waterControl/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });
        },

        handleDatePicker({ rootState, state, commit }) {
            const params = {
                endDate: state.pickDate.to,
                id: state.id,
                startDate: state.pickDate.from,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/waterControl/overCurrentGraph`,
                    params
                )
                .then((data) => {
                    commit('handleDatePickGraph1', data.data.datas);
                });

            axios
                .post(
                    `${rootState.globalIP}/api/v1/waterControl/voltageFluctuationGraph`,
                    params
                )
                .then((data) => {
                    commit('handleDatePickGraph2', data.data.datas);
                });

            //상태정보
            axios
                .get(`${rootState.globalIP}/api/v1/waterControl/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('statusInfo', datas);
                    }
                });
        },
    },
};

export default monitor3;
