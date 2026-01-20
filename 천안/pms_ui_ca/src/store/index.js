import * as mutations from './mutations';
import * as actions from './actions';

import dashboard from './modules/dashboard'; //대시보드
import monitor2 from './modules/monitor2'; //펌프기동반
import monitor3 from './modules/monitor3'; //착수유입밸브
import monitor6 from './modules/monitor6'; //자동급수펌프
import monitor1 from './modules/monitor1';
import monitor4 from './modules/monitor4'; //PAC튜브펌프
import monitor5 from './modules/monitor5'; //PAHCS튜브펌프
import monitor7 from './modules/monitor7'; //급속분사교반기
import monitor8 from './modules/monitor8'; //응집기
import monitor9 from './modules/monitor9'; //슬러지수집기
import monitor10 from './modules/monitor10'; //여과역세펌프
import monitor11 from './modules/monitor11'; //여과역세송풍기
import monitor12 from './modules/monitor12'; //GAC역세펌프
import monitor13 from './modules/monitor13'; //모티브펌프
import monitor14 from './modules/monitor14'; //냉각수펌프
import monitor17 from './modules/monitor17'; //변압기반
import monitor18 from './modules/monitor18'; //VCB반
import monitor19 from './modules/monitor19'; //정밀진단
import monitor20 from './modules/monitor20'; //통계이력

import { createStore } from 'vuex';

export default createStore({
    state: {
        selectedBuildingIndex: 0,
        idx: 0,
        dataReload: 0,
        globalIP: window.globalIP,
        leftDrawerOpen: true,
        alertVisible: false,
        process: [
            {
                title: '착수',
                normal: 10,
                err: 0,
                selected: true,
                img: 'icon1',
            },
            {
                title: '약품',
                normal: 10,
                err: 0,
                selected: false,
                img: 'icon2',
            },
            {
                title: '혼화/응집',
                normal: 66,
                err: 0,
                selected: false,
                img: 'icon3',
            },
            {
                title: '침전',
                normal: 8,
                err: 0,
                selected: false,
                img: 'icon4',
            },
            {
                title: '오존',
                normal: 11,
                err: 0,
                selected: false,
                img: 'icon5',
            },
            {
                title: '여과',
                normal: 6,
                err: 0,
                selected: false,
                img: 'icon5',
            },
            {
                title: 'GAC여과',
                normal: 3,
                err: 0,
                selected: false,
                img: 'icon6',
            },
            {
                title: '소독',
                normal: 2,
                err: 0,
                selected: false,
                img: 'icon7',
            },
            {
                title: '송수',
                normal: 20,
                err: 0,
                selected: false,
                img: 'icon8',
            },
        ],
        pumpMotor: [
            {
                name: '1',
                status: false,
                list: '송수모터/펌프 #1',
            },
            {
                name: '2',
                status: true,
                list: '송수모터/펌프 #2',
            },
            {
                name: '3',
                status: true,
                list: '송수모터/펌프 #3',
            },
            {
                name: '4',
                status: true,
                list: '송수모터/펌프 #4',
            },
            {
                name: '5',
                status: true,
                list: '송수모터/펌프 #5',
            },
            {
                name: '6',
                status: true,
                list: '송수모터/펌프 #6',
            },
            {
                name: '7',
                status: true,
                list: '송수모터/펌프 #7',
            },
            {
                name: '8',
                status: true,
                list: '송수모터/펌프 #8',
            },
            {
                name: '9',
                status: true,
                list: '송수모터/펌프 #9',
            },
            {
                name: '10',
                status: true,
                list: '송수모터/펌프 #10',
            },
        ],
        alertList: [
            // {
            //     num: 1,
            //     time: '2021-06-15 15:00',
            //     list: '착수정 유입 조절 밸브 #1',
            //     info: '-',
            //     status: '전압이상',
            // },
            // {
            //     num: 2,
            //     time: '2021-06-15 15:00',
            //     list: '착수정 유입 조절 밸브 #2',
            //     info: '-',
            //     status: '전압이상',
            // },
            // {
            //     num: 3,
            //     time: '2021-06-15 15:00',
            //     list: '착수정 유입 조절 밸브 #3',
            //     info: '-',
            //     status: '전압이상',
            // },
            // {
            //     num: 4,
            //     time: '2021-06-15 15:00',
            //     list: '착수정 유입 조절 밸브 #4',
            //     info: '-',
            //     status: '전압이상',
            // },
        ],
        pieNormalData: 0,
        pieErrData: 0,
        motors: [
            {
                id: 'motor_01',
                scada_id: 'pump_scada_01',
                name: '평택계통 #1',
                select: true,
            },
            {
                id: 'motor_02',
                scada_id: 'pump_scada_02',
                name: '평택계통 #2',
                select: false,
            },
            {
                id: 'motor_03',
                scada_id: 'pump_scada_03',
                name: '평택계통 #3',
                select: false,
            },
            {
                id: 'motor_04',
                scada_id: 'pump_scada_04',
                name: '평택계통 #4',
                select: false,
            },
            {
                id: 'motor_05',
                scada_id: 'pump_scada_05',
                name: '송산계통 #5',
                select: false,
            },
            {
                id: 'motor_06',
                scada_id: 'pump_scada_06',
                name: '송산계통 #6',
                select: false,
            },
        ],
    },
    getters: {
        normalValue: (state) => {
            let normal = state.process
                .map((data) => {
                    if (data.selected) {
                        return data.normal;
                    }
                })
                .filter((x) => x !== undefined);
            return (state.pieNormalData = normal[0]);
        },
        errValue: (state) => {
            let err = state.process
                .map((data) => {
                    if (data.selected) {
                        return data.err;
                    }
                })
                .filter((x) => x !== undefined);
            return (state.pieErrData = err[0]);
        },
    },
    mutations: mutations,
    actions: actions,
    modules: {
        dashboard,
        monitor1,
        monitor2,
        monitor3,
        monitor4,
        monitor5,
        monitor6,
        monitor7,
        monitor8,
        monitor9,
        monitor10,
        monitor11,
        monitor12,
        monitor13,
        monitor14,
        monitor17,
        monitor18,
        monitor19,
        monitor20

    },
});
