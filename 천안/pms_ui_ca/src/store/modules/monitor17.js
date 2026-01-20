import axios from 'axios';

const monitor17 = {
    namespaced: true,
    state: {
        selectModel: 'Main TR#1',
        modelList: [
            {
                title: 'Main TR#1',
                id: 'transformer_01',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: false,
                    temp_1: 0,
                    temp_2: 0,
                    temp_3: 0,
                    temp_4: 0,
                    temp_5: 0,
                    temp_6: 0,
                    temp_7: 0,
                    temp_8: 0,
                    temp_9: 0,
                    temp_10: 0,
                    temp_11: 0,
                    temp_12: 0,
                    temp_13: 0,
                    temp_14: 0,
                    temp_15: 0,
                    temp_16: 0,
                    temp_17: 0,
                    temp_18: 0,
                    temp_19: 0,
                    temp_20: 0,
                },
            },
            {
                title: 'Main TR#2',
                id: 'transformer_02',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: false,
                    temp_1: 0,
                    temp_2: 0,
                    temp_3: 0,
                    temp_4: 0,
                    temp_5: 0,
                    temp_6: 0,
                    temp_7: 0,
                    temp_8: 0,
                    temp_9: 0,
                    temp_10: 0,
                    temp_11: 0,
                    temp_12: 0,
                    temp_13: 0,
                    temp_14: 0,
                    temp_15: 0,
                    temp_16: 0,
                    temp_17: 0,
                    temp_18: 0,
                    temp_19: 0,
                    temp_20: 0,
                },
            },
            {
                title: '저압(송수)TR#1',
                id: 'transformer_03',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: false,
                    temp_1: 0,
                    temp_2: 0,
                    temp_3: 0,
                    temp_4: 0,
                    temp_5: 0,
                    temp_6: 0,
                    temp_7: 0,
                    temp_8: 0,
                    temp_9: 0,
                    temp_10: 0,
                    temp_11: 0,
                    temp_12: 0,
                    temp_13: 0,
                    temp_14: 0,
                    temp_15: 0,
                    temp_16: 0,
                    temp_17: 0,
                    temp_18: 0,
                    temp_19: 0,
                    temp_20: 0,
                },
            },
            {
                title: '저압(송수)TR#2',
                id: 'transformer_04',
                current: [],
                avarage: 0,
                alarm: false,
                status: {
                    eq_on: false,
                    temp_1: 0,
                    temp_2: 0,
                    temp_3: 0,
                    temp_4: 0,
                    temp_5: 0,
                    temp_6: 0,
                    temp_7: 0,
                    temp_8: 0,
                    temp_9: 0,
                    temp_10: 0,
                    temp_11: 0,
                    temp_12: 0,
                    temp_13: 0,
                    temp_14: 0,
                    temp_15: 0,
                    temp_16: 0,
                    temp_17: 0,
                    temp_18: 0,
                    temp_19: 0,
                    temp_20: 0,
                },
            },
        ],
        detailData: {
            dbm: [],
            pps: [],
            max_in: [],
            max_out: [],
        },
        // startDate: '',
        // endDate: '',
        startDate: '2021-10-01 00:00:00',
        endDate: '2021-10-31 00:00:00',
        id: 'transformer_01',
        pickDate: {
            from: 0,
            to: 0,
        },
        pumpStatus: {},
        equipCount: 0,
        selectIdx: 0,
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
                current.push([date.getTime(), datas[i].dbm_avg]);
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
          // console.log(datas);
          // [gelix_lsj_230920] id 체크 후에 modelList 넣기 및 소스 간결화 
          const statusFields = Array.from({ length: 20 }, (_, i) => `temp_${i + 1}`);
          for (const model of state.modelList) {
              const matchingData = datas.find(data => data.transformer_id === model.id);
              if (matchingData) {
                model.status = {
                  eq_on: matchingData.eq_on,
                  ...statusFields.reduce((acc, field) => {
                      acc[field] = matchingData[field] || 0;
                      return acc;
                  }, {})
                };
              }
          }
        },
        handleDatePickGraph(state, datas) {
            state.detailData.dbm = [];
            state.detailData.pps = [];
            state.detailData.max_in = [];
            state.detailData.max_out = [];
            let dbm = [];
            let pps = [];
            let max_in = [];
            let max_out = [];
            // let datas = data.datas;
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                dbm.push([date.getTime(), datas[i].dbm]);
                pps.push([date.getTime(), datas[i].pps]);
                max_in.push([date.getTime(), datas[i].max_in]);
                max_out.push([date.getTime(), datas[i].max_out]);
            }
            state.detailData.dbm = dbm;
            state.detailData.pps = pps;
            state.detailData.max_in = max_in;
            state.detailData.max_out = max_out;
        },
        equipCount(state, datas) {
            state.equipCount = datas[0].eq_on;
        },
    },
    actions: {
        handleGraphData({ rootState, state, commit }) {
            const params = {
                endDate: state.endDate,
                startDate: state.startDate,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/transformers/disCharge`,
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
                        let idName = obj.transformer_id;
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
                        datas: dataArr_3,
                        index: 2,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_4,
                        index: 3,
                    });
                });

            //알람
            axios
                .get(`${rootState.globalIP}/api/v1/transformers/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alramIsTrue', datas);
                    }
                });
        },

        //세부페이지 전류 조회
        handleDatePicker({ rootState, state, commit }) {
            const params = {
                endDate: state.pickDate.to,
                startDate: state.pickDate.from,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/transformers/detailInfo`,
                    params
                )
                .then((data) => {
                    let datas = data.data.datas;

                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.transformer_id;
                        if (idName === state.id) dataArr_1.push(obj);
                    }

                    commit('handleDatePickGraph', dataArr_1);
                });
        },

        //상태정보 조회
        getPumpInfo({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/transformers/info`)
                .then((data) => commit('getPumpInfo', data.data.datas));
        },
    },
};

export default monitor17;
