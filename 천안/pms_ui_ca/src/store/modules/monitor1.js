import axios from 'axios';
import PTK from '@/assets/data/PTK.json';
import SSN from '@/assets/data/SSN.json';
import sampleData from '@/assets/data/sample.json';



const monitor1 = {
    namespaced: true,
    state: {
        selectModel: '전동1계통 송수펌프모터 #1',
        modelList: [
            {
                title: '전동1계통 송수펌프모터 #1',
                id: 'motor_01',
                scada_id: 'pump_scada_01',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 0,
                visible: false,
            },
            {
                title: '전동1계통 송수펌프모터 #2',
                id: 'motor_02',
                scada_id: 'pump_scada_02',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 1,
                visible: false,
            },
            {
                title: '전동1계통 송수펌프모터 #3',
                id: 'motor_03',
                scada_id: 'pump_scada_03',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 2,
                visible: false,
            },
            {
                title: '전동1계통 송수펌프모터 #4',
                id: 'motor_04',
                scada_id: 'pump_scada_04',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 3,
                visible: false,
            },
            {
                title: '전동1계통 송수펌프모터 #5',
                id: 'motor_05',
                scada_id: 'pump_scada_05',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 4,
                visible: false,
            },
            {
                title: '전동2계통 송수펌프모터 #1',
                id: 'motor_06',
                scada_id: 'pump_scada_06',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 5,
                visible: false,
            },
            {
                title: '전동2계통 송수펌프모터 #2',
                id: 'motor_07',
                scada_id: 'pump_scada_07',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 6,
                visible: false,
            },
            {
                title: '전동2계통 송수펌프모터 #3',
                id: 'motor_08',
                scada_id: 'pump_scada_08',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 7,
                visible: false,
            },
            {
                title: '전동2계통 송수펌프모터 #4',
                id: 'motor_09',
                scada_id: 'pump_scada_09',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 8,
                visible: false,
            },
            {
                title: '전동2계통 송수펌프모터 #5',
                id: 'motor_10',
                scada_id: 'pump_scada_10',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 9,
                visible: false,
            },
            {
                title: '전동2계통 송수펌프모터 #6',
                id: 'motor_11',
                scada_id: 'pump_scada_11',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 10,
                visible: false,
            },
            {
                title: '전동2계통 송수펌프모터 #7',
                id: 'motor_12',
                scada_id: 'pump_scada_12',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 11,
                visible: false,
            },
            {
                title: '전동3계통 송수펌프모터 #1',
                id: 'motor_13',
                scada_id: 'pump_scada_13',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 12,
                visible: false,
            },
            {
                title: '전동3계통 송수펌프모터 #2',
                id: 'motor_14',
                scada_id: 'pump_scada_14',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 13,
                visible: false,
            },
            {
                title: '전동3계통 송수펌프모터 #3',
                id: 'motor_15',
                scada_id: 'pump_scada_15',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 14,
                visible: false,
            },
            {
                title: '전동3계통 송수펌프모터 #4',
                id: 'motor_16',
                scada_id: 'pump_scada_16',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 15,
                visible: false,
            },
            {
                title: '전동3계통 송수펌프모터 #5',
                id: 'motor_17',
                scada_id: 'pump_scada_17',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 16,
                visible: false,
            },
            {
                title: '전동3계통 송수펌프모터 #6',
                id: 'motor_18',
                scada_id: 'pump_scada_18',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 17,
                visible: false,
            },
            {
                title: '전동3계통 송수펌프모터 #7',
                id: 'motor_19',
                scada_id: 'pump_scada_19',
                motor_de_amp: [],
                motor_nde_amp: [],
                pump_de_amp: [],
                pump_nde_amp: [],
                motor_de_amp_val: 0,
                motor_nde_amp_val: 0,
                pump_de_amp_val: 0,
                pump_nde_amp_val: 0,
                eq_on: true,
                alarm: false,
                select: false,
                idx: 18,
                visible: false,
            },
        ],
        detailData: {
            motor_de_rms_amp: [],
            motor_nde_rms_amp: [],
            motor_misalignment_amp: [],
            motor_unbalance_amp: [],
            motor_rotor_amp: [],
            motor_de_amp: [],
            motor_nde_amp: [],
            pump_de_rms_amp: [],
            pump_nde_rms_amp: [],
            pump_cavatation_amp: [],
            pump_impeller_amp: [],
            pump_de_amp: [],
            pump_nde_amp: [],
            //bearingTemp
            P_NDE_bearing_temp: [],
            P_DE_bearing_temp: [],
            M_NDE_bearing_temp: [],
            M_DE_bearing_temp: [],
            //wind 필요
            winding_tempR: [],
            winding_tempT: [],
            winding_tempS: [],
            //vibrationGraph
            motor_de_rms_amp_csv: [],
            motor_nde_rms_amp_csv: [],
            pump_de_rms_amp_csv: [],
            pump_nde_rms_amp_csv: [],
            pump_motor_rms_amp_csv: [],
            // Alarm
            m_bearing_alarm: 0,
            p_bearing_alarm: 0,
            m_ban_bearing_alarm: 0,
            p_ban_bearing_alarm: 0,
            rotorbar_alarm: 0,
            vane_alarm: 0,
            unbalance_alarm: 0,
            misaligment_alarm: 0,
            cavitation_alarm: 0,
        },
        centerId:'전동1(가)',
        id: 'motor_01',
        scada_id: 'pump_scada_01',
        // startDate: '',
        // endDate: '',
        startDate: '2021-10-21 10:00:00',
        endDate: '2021-10-30 16:00:00',
        pickDate: {
            from: 0,
            to: 0,
        },
        scada_01: {
            flow_rate_val: 0,
            pressure_val: 0,
            data: [],
            running: 0,
            comp: PTK,
            flow_rate: [],
            pressure: [],
        },
        scada_05: {
            flow_rate_val: 0,
            pressure_val: 0,
            data: [],
            running: 0,
            comp: SSN,
            flow_rate: [],
            pressure: [],
        },
        sampleData: {
            motor_de_rms_amp: [],
            motor_nde_rms_amp: [],
            pump_de_rms_amp: [],
            pump_nde_rms_amp: [],
            motor: [],
            idx: '1',
        },
        mode: false,
        tabIndex: 1,  // gelix_lsj tab index
    },
    getters: {},
    mutations: {
        bearingTempInfo(state, data) {
            state.detailData.P_NDE_bearing_temp = [];
            state.detailData.M_NDE_bearing_temp = [];
            state.detailData.M_DE_bearing_temp = [];
            state.detailData.P_DE_bearing_temp = [];
            let P_NDE_bearing_temp = [];
            let M_NDE_bearing_temp = [];
            let M_DE_bearing_temp = [];
            let P_DE_bearing_temp = [];
            let datas = data.datas;
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                P_NDE_bearing_temp.push([
                    date.getTime(),
                    datas[i].P_NDE_bearing_temp,
                ]);
                M_NDE_bearing_temp.push([
                    date.getTime(),
                    datas[i].M_NDE_bearing_temp,
                ]);
                M_DE_bearing_temp.push([
                    date.getTime(),
                    datas[i].M_DE_bearing_temp,
                ]);
                P_DE_bearing_temp.push([
                    date.getTime(),
                    datas[i].P_DE_bearing_temp,
                ]);
            }
            state.detailData.P_NDE_bearing_temp = P_NDE_bearing_temp;
            state.detailData.M_NDE_bearing_temp = M_NDE_bearing_temp;
            state.detailData.M_DE_bearing_temp = M_DE_bearing_temp;
            state.detailData.P_DE_bearing_temp = P_DE_bearing_temp;
        },
        windingTempInfo(state, data) {
            state.detailData.winding_tempR = [];
            state.detailData.winding_tempT = [];
            state.detailData.winding_tempS = [];
            let winding_tempR = [];
            let winding_tempT = [];
            let winding_tempS = [];
            let datas = data.datas;
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                winding_tempR.push([date.getTime(), datas[i].winding_tempR]);
                winding_tempT.push([date.getTime(), datas[i].winding_tempT]);
                winding_tempS.push([date.getTime(), datas[i].winding_tempS]);
            }
            state.detailData.winding_tempR = winding_tempR;
            state.detailData.winding_tempT = winding_tempT;
            state.detailData.winding_tempS = winding_tempS;
        },
        vibrationGraph(state, data) {
            state.detailData.pump_motor_rms_amp_csv = [];
            let pump_motor_rms_amp_csv = [];
            
            let datas = data.datas;
                       
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                let pumpmotor = datas[i].moter_id;

                // 날짜를 "YYYY-MM-DD HH:mm:ss" 형식으로 변환
                let formattedDate = date.toISOString().slice(0, 19).replace('T', ' '); // ISO 형식에서 시각까지 포함

                pump_motor_rms_amp_csv.push([formattedDate,
                                             pumpmotor,
                                             datas[i].motor_de_rms_amp, 
                                             datas[i].motor_nde_rms_amp,
                                             datas[i].pump_de_rms_amp,
                                             datas[i].pump_nde_rms_amp
                                            ]);
            }
            
            state.detailData.pump_motor_rms_amp_csv = pump_motor_rms_amp_csv;
        },
        motorDetails(state, data) {
            //    m.DE_rms_amp : 모터 부하 총진동량
            //    m.NDE_rms_amp : 모터 반 부하 총진동량
            //    m.misalignment_amp : 모터 축정렬
            //    m.unbalance_amp : 모터 불평형
            //    m.rotor_amp : 모터 회전자
            //    m.de_amp : 모터 부하 베어링
            //    m.NDE_amp : 모터 반부하 베어링
            //    p.DE_rms_amp : 펌프 부하 총진동량
            //    p.NDE_rms_amp : 펌프 반 부하 총진동량
            //    p.cavitation_amp : 펌프 케비테이션
            //    p.impeller_amp : 펌프 임펠러
            //    p.DE_amp : 펌프 부하 베어링
            //    p.NDE_amp : 펌프 반부하 베어링
            state.detailData.motor_de_rms_amp = [];
            state.detailData.motor_nde_rms_amp = [];
            state.detailData.motor_misalignment_amp = [];
            state.detailData.motor_unbalance_amp = [];
            state.detailData.motor_rotor_amp = [];
            state.detailData.motor_de_amp = [];
            state.detailData.motor_nde_amp = [];
            state.detailData.pump_de_rms_amp = [];
            state.detailData.pump_nde_rms_amp = [];
            state.detailData.pump_cavatation_amp = [];
            state.detailData.pump_impeller_amp = [];
            state.detailData.pump_de_amp = [];
            state.detailData.pump_nde_amp = [];
            
            state.detailData.m_bearing_alarm = 0;
            state.detailData.p_bearing_alarm = 0;
            state.detailData.m_ban_bearing_alarm = 0;
            state.detailData.p_ban_bearing_alarm = 0;
            state.detailData.rotorbar_alarm = 0;
            state.detailData.vane_alarm = 0;
            state.detailData.unbalance_alarm = 0;
            state.detailData.misaligment_alarm = 0;
            state.detailData.cavitation_alarm = 0;

            let motor_de_rms_amp = [];
            let motor_nde_rms_amp = [];
            let motor_misalignment_amp = [];
            let motor_unbalance_amp = [];
            let motor_rotor_amp = [];
            let motor_de_amp = [];
            let motor_nde_amp = [];
            let pump_de_rms_amp = [];
            let pump_nde_rms_amp = [];
            let pump_cavatation_amp = [];
            let pump_impeller_amp = [];
            let pump_de_amp = [];
            let pump_nde_amp = [];
            let datas = data.datas;
            let lastTime = 0;
            // let lastObj = {};

            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                motor_de_rms_amp.push([
                    date.getTime(),
                    datas[i].motor_de_rms_amp,
                ]);
                motor_nde_rms_amp.push([
                    date.getTime(),
                    datas[i].motor_nde_rms_amp,
                ]);
                motor_misalignment_amp.push([
                    date.getTime(),
                    datas[i].motor_misalignment_amp,
                ]);
                motor_unbalance_amp.push([
                    date.getTime(),
                    datas[i].motor_unbalance_amp,
                ]);
                motor_rotor_amp.push([
                    date.getTime(),
                    datas[i].motor_rotor_amp,
                ]);
                motor_de_amp.push([date.getTime(), datas[i].motor_de_amp]);
                motor_nde_amp.push([date.getTime(), datas[i].motor_nde_amp]);
                pump_de_rms_amp.push([
                    date.getTime(),
                    datas[i].pump_de_rms_amp,
                ]);
                pump_nde_rms_amp.push([
                    date.getTime(),
                    datas[i].pump_nde_rms_amp,
                ]);
                pump_cavatation_amp.push([
                    date.getTime(),
                    datas[i].pump_cavatation_amp,
                ]);
                pump_impeller_amp.push([
                    date.getTime(),
                    datas[i].pump_impeller_amp,
                ]);
                pump_de_amp.push([date.getTime(), datas[i].pump_de_amp]);
                pump_nde_amp.push([date.getTime(), datas[i].pump_nde_amp]);
                if (i === datas.length - 1) {
                    lastTime = date.getTime();
                    // lastObj = datas[i];
                }
                if (datas[i].NDE_BPFO_alarm >= 1) {
                    state.detailData.m_ban_bearing_alarm = datas[i].NDE_BPFO_alarm;
                }
                if (datas[i].NDE_BPFI_alarm >= 1) {
                    state.detailData.p_ban_bearing_alarm = datas[i].NDE_BPFI_alarm;
                }
                if (datas[i].de_bpfo_alarm >= 1) {
                    state.detailData.m_bearing_alarm = datas[i].de_bpfo_alarm;
                }
                if (datas[i].DE_BPFI_alarm >= 1) {
                    state.detailData.p_bearing_alarm = datas[i].DE_BPFI_alarm;
                }
                if (datas[i].rotor_alarm >= 1) {
                    state.detailData.rotorbar_alarm = datas[i].rotor_alarm;
                }
                if (datas[i].impeller_alarm >= 1) {
                    state.detailData.vane_alarm = datas[i].impeller_alarm;
                }
                if (datas[i].unbalance_alarm >= 1) {
                    state.detailData.unbalance_alarm = datas[i].unbalance_alarm;
                }
                if (datas[i].misalignment_alarm >= 1) {
                    state.detailData.misaligment_alarm = datas[i].misalignment_alarm;
                }
                if (datas[i].cavitation_alarm >= 1) {
                    state.detailData.cavitation_alarm = datas[i].cavitation_alarm;
                }
            }
            state.detailData.motor_de_rms_amp = motor_de_rms_amp;
            state.detailData.motor_nde_rms_amp = motor_nde_rms_amp;
            state.detailData.motor_misalignment_amp = motor_misalignment_amp;
            state.detailData.motor_unbalance_amp = motor_unbalance_amp;
            state.detailData.motor_rotor_amp = motor_rotor_amp;
            state.detailData.motor_de_amp = motor_de_amp;
            state.detailData.motor_nde_amp = motor_nde_amp;
            state.detailData.pump_de_rms_amp = pump_de_rms_amp;
            state.detailData.pump_nde_rms_amp = pump_nde_rms_amp;
            state.detailData.pump_cavatation_amp = pump_cavatation_amp;
            state.detailData.pump_impeller_amp = pump_impeller_amp;
            state.detailData.pump_de_amp = pump_de_amp;
            state.detailData.pump_nde_amp = pump_nde_amp;
            const crypto = require("crypto"); 
            if (state.mode === true) {
                if (state.sampleData.idx === 0 || state.sampleData.idx === 1) {
                    state.sampleData.motor_de_rms_amp = [];
                    state.sampleData.motor_nde_rms_amp = [];
                    state.sampleData.pump_de_rms_amp = [];
                    state.sampleData.pump_nde_rms_amp = [];
                    state.sampleData.motor = [];
                    if (state.sampleData.motor_de_rms_amp.length === 0) {
                        // let addNum = 0;
                        for (let i = 0; i < sampleData.length; i++) {
                            let obj = sampleData[i];
                            let addTime = lastTime + 10 * 60 * 1000 * (i + 1);
                            // let addObj = lastObj;
                            // let random1 = (Math.random() * 4) / 30;
                            // let random2 = (Math.random() * 12) / 30;
                            // let random3 = (Math.random() * 3) / 30;
                            // let random4 = (Math.random() * 3) / 30;
                            let randomBytes = crypto.randomBytes(4);
                            let random5 = 1 + Buffer.from(randomBytes).readUInt32BE(0) / 0xFFFFFFFF * 0.5;
                            // val1 += random1;
                            // val2 += random2;
                            // val3 += random3;
                            // val4 += random4;
                            // val5 += random5;
                            // addNum += random2;
                            state.sampleData.motor_de_rms_amp.push([
                                addTime,
                                obj.motor_de_rms_amp,
                            ]);
                            state.sampleData.motor_nde_rms_amp.push([
                                addTime,

                                obj.motor_nde_rms_amp,
                            ]);
                            state.sampleData.pump_de_rms_amp.push([
                                addTime,
                                obj.pump_de_rms_amp,
                            ]);
                            state.sampleData.pump_nde_rms_amp.push([
                                addTime,
                                obj.pump_nde_rms_amp,
                            ]);
                            state.sampleData.motor.push([addTime, random5]);
                        }
                        // console.log(state.sampleData);
                    }

                    /////////////////

                    state.detailData.pump_de_rms_amp = state.detailData.pump_de_rms_amp.concat(
                        state.sampleData.pump_de_rms_amp
                    );
                    state.detailData.pump_nde_rms_amp = state.detailData.pump_nde_rms_amp.concat(
                        state.sampleData.pump_nde_rms_amp
                    );
                    state.detailData.motor_de_rms_amp = state.detailData.motor_de_rms_amp.concat(
                        state.sampleData.motor_de_rms_amp
                    );
                    state.detailData.motor_nde_rms_amp = state.detailData.motor_nde_rms_amp.concat(
                        state.sampleData.motor_nde_rms_amp
                    );
                    // state.detailData.motor_nde_rms_amp = state.detailData.motor_nde_rms_amp.concat(
                    //     state.sampleData.motor_nde_rms_amp
                    // );
                    state.detailData.motor_misalignment_amp = state.detailData.motor_misalignment_amp.concat(
                        state.sampleData.motor
                    );
                }
            }
        },
        handleGraphData(state, { datas, index }) {
            state.modelList[index].motor_de_amp = [];
            state.modelList[index].motor_nde_amp = [];
            state.modelList[index].pump_de_amp = [];
            state.modelList[index].pump_nde_amp = [];
            let motor_de_amp = [];
            let motor_nde_amp = [];
            let pump_de_amp = [];
            let pump_nde_amp = [];
            let lastTime = 0;
            // let lastObj = {};
            for (let i = 0; i < datas.length; i++) {
                let date = new Date(datas[i].acq_date);
                motor_de_amp.push([date.getTime(), datas[i].motor_de_rms_amp]);
                motor_nde_amp.push([
                    date.getTime(),
                    datas[i].motor_nde_rms_amp,
                ]);

                pump_de_amp.push([date.getTime(), datas[i].pump_de_rms_amp]);
                pump_nde_amp.push([date.getTime(), datas[i].pump_nde_rms_amp]);
                if (i === datas.length - 1) {
                    lastTime = date.getTime();
                    // lastObj = datas[i];
                }
            }

            if (state.sampleData.motor_de_rms_amp.length === 0) {
                // let addNum = 0;
                // let val1 = 0;
                // let val2 = 0;
                // let val3 = 0;
                // let val4 = 0;
                // let val5 = 0;
                for (var i = 0; i < sampleData.length; i++) {
                    let obj = sampleData[i];
                    let addTime = lastTime + 10 * 60 * 1000 * (i + 1);
                    // let addObj = lastObj;
                    // let random1 = (Math.random() * 4) / 30;
                    // let random2 = (Math.random() * 12) / 30;
                    // let random3 = (Math.random() * 3) / 30;
                    // let random4 = (Math.random() * 3) / 30;
                    // let random5 = 1 + Math.random() * 0.5;
                    let randomBytes = crypto.randomBytes(4);
                    let random5 = 1 + Buffer.from(randomBytes).readUInt32BE(0) / 0xFFFFFFFF * 0.5;
                    state.sampleData.motor_de_rms_amp.push([
                        addTime,
                        // addObj.motor_de_rms_amp + random1,
                        obj.motor_de_rms_amp,
                    ]);
                    state.sampleData.motor_nde_rms_amp.push([
                        addTime,
                        // addObj.motor_nde_rms_amp + random4,
                        obj.motor_nde_rms_amp,
                    ]);
                    state.sampleData.pump_de_rms_amp.push([
                        addTime,
                        // addObj.pump_de_rms_amp + random3,
                        obj.pump_de_rms_amp,
                    ]);
                    state.sampleData.pump_nde_rms_amp.push([
                        addTime,
                        // addObj.pump_nde_rms_amp + random2,
                        obj.pump_nde_rms_amp,
                    ]);
                    // state.sampleData.motor.push([addTime, random5]);
                    state.sampleData.motor.push([addTime, random5]);
                }
                // console.log(state.sampleData);
            }
            if (datas.length !== 0) {
                state.modelList[index].motor_de_amp_val = Number(
                    motor_de_amp[datas.length - 1][1]
                ).toFixed(2);
                state.modelList[index].motor_nde_amp_val = Number(
                    motor_nde_amp[datas.length - 1][1]
                ).toFixed(2);
                state.modelList[index].pump_de_amp_val = Number(
                    pump_de_amp[datas.length - 1][1]
                ).toFixed(2);
                state.modelList[index].pump_nde_amp_val = Number(
                    pump_nde_amp[datas.length - 1][1]
                ).toFixed(2);
            } else {
                state.modelList[index].motor_de_amp_val = 0;
                state.modelList[index].motor_nde_amp_val = 0;
                state.modelList[index].pump_de_amp_val = 0;
                state.modelList[index].pump_nde_amp_val = 0;
            }

            state.modelList[index].motor_de_amp = motor_de_amp;
            state.modelList[index].motor_nde_amp = motor_nde_amp;
            state.modelList[index].pump_de_amp = pump_de_amp;
            state.modelList[index].pump_nde_amp = pump_nde_amp;
        },
        runningInfo(state, datas) {
            if (datas.length > 0) {
                for (let i = 0; i < state.modelList.length; i++) {
                    let index = datas.findIndex((x) => x.pump_scada_id.slice(-2) === state.modelList[i].scada_id.slice(-2));
                    if (index >= 0) 
                        state.modelList[i].eq_on = datas[index].eq_on;
                    else
                        state.modelList[i].eq_on = false;
                }
            } else {
                for (let i = 0; i < state.modelList.length; i++) {
                    state.modelList[i].eq_on = false;
                }
            }
        },
        // runningInfo(state, datas) {
        //     let cnt = 0;
        //     let cnt2 = 0;
        //     for (let i = 0; i < datas.length; i++) {
        //         let index = datas.findIndex((x) => x.moter_id === state.modelList[i].id);
        //         state.modelList[i].eq_on = datas[i].eq_on;
        //         if (i < 4) {
        //             if (datas[i].eq_on) cnt++;
        //         } else {
        //             if (datas[i].eq_on) cnt2++;
        //         }
        //     }
        //     state.scada_01.running = cnt;
        //     state.scada_05.running = cnt2;
        // },
        alarmIsTrue(state, datas) {
            state.modelList.filter((list) => {
                let index = datas.findIndex((x) => x.moter_id === list.id);
                // if (index >= 0) list.alarm = true;
                if (index >= 0) {
                    list.alarm = datas[index].Alarm;
                }
            });
        },
        flowPressure(state, { datas, type }) {
            // console.log('datas ::::: ' + datas.length);
            // console.log('str ::::: ' + type);
            if (type === '평택') {
                if (datas.length === 0) {
                    state.scada_01.pressure = 0;
                    state.scada_01.flow_rate = 0;
                } else {
                    state.scada_01.pressure_val = datas[0].pressure;
                    state.scada_01.flow_rate_val = datas[0].flow_rate;
                }
            }
            if (type === '송산') {
                if (datas.length === 0) {
                    state.scada_05.pressure_val = 0;
                    state.scada_05.flow_rate_val = 0;
                } else {
                    state.scada_05.pressure_val = datas[0].pressure;
                    state.scada_05.flow_rate_val = datas[0].flow_rate;
                }
            }
        },
        distribution(state, { datas, type }) {
            // console.log('datas :: ' + datas.length);
            // console.log('str :: ' + type);
            if (type === '평택') {
                if (datas.length === 0) {
                    state.scada_01.flow_rate = [];
                    state.scada_01.pressure = [];
                    state.scada_01.data = [];
                } else {
                    state.scada_01.flow_rate = [];
                    state.scada_01.pressure = [];
                    state.scada_01.data = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        if (i % 2 == 0) {
                            state.scada_01.data.push([
                                obj.flow_rate,
                                obj.pressure,
                            ]);
                        }
                    }
                    // datas.filter((list) => {
                    //     state.scada_01.flow_rate.push(list.flow_rate);
                    //     state.scada_01.pressure.push(list.pressure);
                    // });
                }
            }
            if (type === '송산') {
                if (datas.length === 0) {
                    state.scada_05.flow_rate = [];
                    state.scada_05.pressure = [];
                    state.scada_05.data = [];
                } else {
                    state.scada_05.flow_rate = [];
                    state.scada_05.pressure = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        if (i % 2 == 0) {
                            state.scada_05.data.push([
                                obj.flow_rate,
                                obj.pressure,
                            ]);
                        }
                    }
                    // datas.filter((list) => {
                    //     state.scada_05.flow_rate.push(list.flow_rate);
                    //     state.scada_05.pressure.push(list.pressure);
                    // });
                }
            }
        },
    },
    actions: {
        flowPressure({ rootState, commit }) {
            axios
                .get(
                    `${rootState.globalIP}/api/v1/motor/flowPressure/pump_scada_01`
                )
                .then((data) =>
                    commit('flowPressure', {
                        datas: data.data.datas,
                        type: '평택',
                    })
                );
            axios
                .get(
                    `${rootState.globalIP}/api/v1/motor/flowPressure/pump_scada_05`
                )
                .then((data) =>
                    commit('flowPressure', {
                        datas: data.data.datas,
                        type: '송산',
                    })
                );
        },
        distribution({ rootState, state, commit }) {
            const params = {
                endDate: state.endDate,
                id: 'pump_scada_01',
                startDate: state.startDate,
            };
            axios
                .post(`${rootState.globalIP}/api/v1/motor/distribution`, params)
                .then((data) => {
                    const datas = data.data.datas;
                    // let dataArr_1 = [];
                    // for (let i = 0; i < datas.length; i++) {
                    //     let obj = datas[i];
                    //     dataArr_1.push(obj);
                    // }
                    commit('distribution', {
                        datas: datas,
                        type: '평택',
                    });
                });
            const params2 = {
                endDate: state.endDate,
                id: 'pump_scada_05',
                startDate: state.startDate,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/motor/distribution`,
                    params2
                )
                .then((data) => {
                    const datas = data.data.datas;
                    // let dataArr_1 = [];
                    // for (let i = 0; i < datas.length; i++) {
                    //     let obj = datas[i];
                    //     dataArr_1.push(obj);
                    // }
                    commit('distribution', {
                        datas: datas,
                        type: '송산',
                    });
                });
        },
        bearingTempInfo({ rootState, state, commit }) {
            const params = {
                endDate: state.pickDate.to,
                id: state.scada_id,
                startDate: state.pickDate.from,
            };
            // console.log('bearingTempInfo');
            axios
                .post(
                    `${rootState.globalIP}/api/v1/motor/bearingTempInfo`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;
                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        dataArr_1.push(obj);
                    }
                    commit('bearingTempInfo', {
                        datas: dataArr_1,
                        index: state.scada_id,
                    });
                });
        },
        windingTempInfo({ rootState, state, commit }) {
            const params = {
                endDate: state.pickDate.to,
                id: state.scada_id,
                startDate: state.pickDate.from,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/motor/windingTempInfo`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;
                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        dataArr_1.push(obj);
                    }
                    commit('windingTempInfo', {
                        datas: dataArr_1,
                        index: state.scada_id,
                    });
                });
        },
        vibrationGraph({ rootState, state, commit }) {
            const params = {
                endDate: state.pickDate.to,
                id: state.scada_id,
                startDate: state.pickDate.from,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/motor/vibrationGraph`,
                    params
                )
                .then((data) => {
                    const datas = data.data.datas;
                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        dataArr_1.push(obj);
                    }
                    commit('vibrationGraph', {
                        datas: dataArr_1,
                        index: state.scada_id,
                    });
                });
        },
        motorDetails({ rootState, state, commit }) {
            const params = {
                endDate: state.pickDate.to,
                id: state.id,
                centerId: state.centerId,
                startDate: state.pickDate.from,
            };
            axios
                .post(`${rootState.globalIP}/api/v1/motor/motorDetails`, params)
                .then((data) => {
                    const datas = data.data.datas;
                    let dataArr_1 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        dataArr_1.push(obj);
                    }
                    commit('motorDetails', {
                        datas: dataArr_1,
                        index: state.id,
                    });
                });
        },
        handleGraphData({ rootState, state, commit }) {
            const params = {
                endDate: state.endDate,
                startDate: state.startDate,
            };
            axios
                .post(
                    `${rootState.globalIP}/api/v1/motor/vibrationGraph`,
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
                    let dataArr_9 = [];
                    let dataArr_10 = [];
                    let dataArr_11 = [];
                    let dataArr_12 = [];
                    let dataArr_13 = [];
                    let dataArr_14 = [];
                    let dataArr_15 = [];
                    let dataArr_16 = [];
                    let dataArr_17 = [];
                    let dataArr_18 = [];
                    let dataArr_19 = [];
                    for (let i = 0; i < datas.length; i++) {
                        let obj = datas[i];
                        let idName = obj.moter_id;
                        if (idName === 'motor_01') dataArr_1.push(obj);
                        if (idName === 'motor_02') dataArr_2.push(obj);
                        if (idName === 'motor_03') dataArr_3.push(obj);
                        if (idName === 'motor_04') dataArr_4.push(obj);
                        if (idName === 'motor_05') dataArr_5.push(obj);
                        if (idName === 'motor_06') dataArr_6.push(obj);
                        if (idName === 'motor_07') dataArr_7.push(obj);
                        if (idName === 'motor_08') dataArr_8.push(obj);
                        if (idName === 'motor_09') dataArr_9.push(obj);
                        if (idName === 'motor_10') dataArr_10.push(obj);
                        if (idName === 'motor_11') dataArr_11.push(obj);
                        if (idName === 'motor_12') dataArr_12.push(obj);
                        if (idName === 'motor_13') dataArr_13.push(obj);
                        if (idName === 'motor_14') dataArr_14.push(obj);
                        if (idName === 'motor_15') dataArr_15.push(obj);
                        if (idName === 'motor_16') dataArr_16.push(obj);
                        if (idName === 'motor_17') dataArr_17.push(obj);
                        if (idName === 'motor_18') dataArr_18.push(obj);
                        if (idName === 'motor_19') dataArr_19.push(obj);
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
                    commit('handleGraphData', {
                        datas: dataArr_9,
                        index: 8,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_10,
                        index: 9,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_11,
                        index: 10,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_12,
                        index: 11,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_13,
                        index: 12,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_14,
                        index: 13,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_15,
                        index: 14,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_16,
                        index: 15,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_17,
                        index: 16,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_18,
                        index: 17,
                    });
                    commit('handleGraphData', {
                        datas: dataArr_19,
                        index: 18,
                    });

                });
        },
        //가동중 조회
        runningInfo({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/motor/runningInfo`)
                .then((data) => commit('runningInfo', data.data.datas));
        },
        alarm({ rootState, commit }) {
            axios
                .get(`${rootState.globalIP}/api/v1/motor/alarm`)
                .then((data) => {
                    const datas = data.data.datas;
                    if (datas.length !== 0) {
                        commit('alarmIsTrue', datas);
                    }
                });
        },
    },
};

export default monitor1;
