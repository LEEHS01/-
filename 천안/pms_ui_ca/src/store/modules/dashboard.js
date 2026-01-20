import axios from 'axios';
import log from '@/logger.js'

const dashboard = {
    namespaced: true,
    state: {
        idx: 0,
        facNormalValue: 136,
        facErrValue: 0,
        alarmInfo: [],
        nullDataAlarmInfo: [],
        processList: [
            {
                list: [
                    {
                        title: '유입밸브',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                id: 'water_controll_valve_01',
                                value: '-',
                            },
                            {
                                title: '#2',
                                status: true,
                                id: 'water_controll_valve_02',
                                value: '-',
                            },
                        ],
                    },
                    {
                        title: '약품펌프',
                        elec: [
                            {
                                title: 'PAC #1',
                                status: true,
                                value: '-',
                                id: 'pac_tube_pump_01',
                            },
                            {
                                title: 'PAC #2',
                                status: true,
                                value: '-',
                                id: 'pac_tube_pump_02',
                            },
                            {
                                title: 'PAC #3',
                                status: true,
                                value: '-',
                                id: 'pac_tube_pump_03',
                            },
                            {
                                title: 'PAHCS #1',
                                status: true,
                                value: '-',
                                id: 'pahcs_tube_pump_01',
                            },
                            {
                                title: 'PAHCS #2',
                                status: true,
                                value: '-',
                                id: 'pahcs_tube_pump_02',
                            },
                            {
                                title: 'PAHCS #3',
                                status: true,
                                value: '-',
                                id: 'pahcs_tube_pump_03',
                            },
                        ],
                    },
                    {
                        title: '급수펌프',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'auto_water_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'auto_water_pump_01',
                            },
                            {
                                title: '#3',
                                status: true,
                                value: '-',
                                id: 'auto_water_pump_01',
                            },
                            {
                                title: '#4',
                                status: true,
                                value: '-',
                                id: 'auto_water_pump_01',
                            },
                        ],
                    },
                ],
            },
            {
                list: [
                    {
                        title: '급속분사교반기',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'rapid_agitator_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'rapid_agitator_02',
                            },
                        ],
                    },
                    {
                        title: '응집기',
                        elec: [
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'agglomerate_01',
                            },
                            {
                                title: '#3',
                                status: true,
                                value: '-',
                                id: 'agglomerate_02',
                            },
                            {
                                title: '#4',
                                status: true,
                                value: '-',
                                id: 'agglomerate_03',
                            },
                            {
                                title: '#5',
                                status: true,
                                value: '-',
                                id: 'agglomerate_04',
                            },
                            {
                                title: '#6',
                                status: true,
                                value: '-',
                                id: 'agglomerate_05',
                            },
                            {
                                title: '#7',
                                status: true,
                                value: '-',
                                id: 'agglomerate_06',
                            },
                            {
                                title: '#8',
                                status: true,
                                value: '-',
                                id: 'agglomerate_07',
                            },
                            {
                                title: '#9',
                                status: true,
                                value: '-',
                                id: 'agglomerate_08',
                            },
                        ],
                    },
                    {
                        title: '슬러지수집기',
                        elec: [
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'sludge_collector_01',
                            },
                            {
                                title: '#3',
                                status: true,
                                value: '-',
                                id: 'sludge_collector_01',
                            },
                            {
                                title: '#4',
                                status: true,
                                value: '-',
                                id: 'sludge_collector_01',
                            },
                            {
                                title: '#5',
                                status: true,
                                value: '-',
                                id: 'sludge_collector_01',
                            },
                            {
                                title: '#6',
                                status: true,
                                value: '-',
                                id: 'sludge_collector_02',
                            },
                            {
                                title: '#7',
                                status: true,
                                value: '-',
                                id: 'sludge_collector_02',
                            },
                            {
                                title: '#8',
                                status: true,
                                value: '-',
                                id: 'sludge_collector_02',
                            },
                            {
                                title: '#9',
                                status: true,
                                value: '-',
                                id: 'sludge_collector_02',
                            },
                        ],
                    },
                ],
            },
            {
                list: [
                    {
                        title: '여과역세펌프',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'filter_backwash_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'filter_backwash_pump_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                value: '-',
                                id: 'filter_backwash_pump_03',
                            },
                            {
                                title: '#4',
                                status: true,
                                value: '-',
                                id: 'filter_backwash_pump_04',
                            },
                        ],
                    },
                    {
                        title: 'GAC역세펌프',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'gac_backwash_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'gac_backwash_pump_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                value: '-',
                                id: 'gac_backwash_pump_03',
                            },
                        ],
                    },
                    {
                        title: '역세송풍기',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'backwash_blower_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'backwash_blower_02',
                            },
                        ],
                    },
                ],
            },
            {
                list: [
                    {
                        title: '오존발생기',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'ozone_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'ozone_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                value: '-',
                                id: 'ozone_03',
                            },
                        ],
                    },
                    {
                        title: '모티브펌프',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'motif_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'motif_pump_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                value: '-',
                                id: 'motif_pump_03',
                            },
                            {
                                title: '#4',
                                status: true,
                                value: '-',
                                id: 'motif_pump_04',
                            },
                        ],
                    },
                    {
                        title: '냉각수펌프',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'cooling_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'cooling_pump_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                value: '-',
                                id: 'cooling_pump_03',
                            },
                            {
                                title: '#4',
                                status: true,
                                value: '-',
                                id: 'cooling_pump_04',
                            },
                        ],
                    },
                    {
                        title: '차염발생기',
                        elec: [
                            {
                                title: '#1',
                                status: true,
                                value: '-',
                                id: 'test_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                value: '-',
                                id: 'test_02',
                            },
                        ],
                    },
                ],
            },
            {
                list: [
                    {
                        title: '기동반',
                        elec: [
                            {
                                title: '평택 #1',
                                status: true,
                                value: '-',
                                id: 'pump_board_01',
                            },
                            {
                                title: '평택 #2',
                                status: true,
                                value: '-',
                                id: 'pump_board_02',
                            },
                            {
                                title: '평택 #3',
                                status: true,
                                value: '-',
                                id: 'pump_board_03',
                            },
                            {
                                title: '평택 #4',
                                status: true,
                                value: '-',
                                id: 'pump_board_04',
                            },
                        ],
                    },
                    {
                        title: '변압기반',
                        elec: [
                            {
                                title: '메인 #1',
                                status: true,
                                value: '-',
                                id: 'transformer_01',
                            },
                            {
                                title: '메인 #2',
                                status: true,
                                value: '-',
                                id: 'transformer_02',
                            },
                            {
                                title: '펌프 #1',
                                status: true,
                                value: '-',
                                id: 'transformer_03',
                            },
                            {
                                title: '펌프 #2',
                                status: true,
                                value: '-',
                                id: 'transformer_04',
                            },
                        ],
                    },
                    {
                        title: 'VAC반',
                        elec: [
                            {
                                title: 'A3 #1',
                                status: true,
                                value: '-',
                                id: 'vcb_01',
                            },
                            {
                                title: 'A4 #2',
                                status: true,
                                value: '-',
                                id: 'vcb_02',
                            },
                            {
                                title: 'MA1 #3',
                                status: true,
                                value: '-',
                                id: 'vcb_03',
                            },
                            {
                                title: 'B3 #4',
                                status: true,
                                value: '-',
                                id: 'vcb_04',
                            },
                            {
                                title: 'B4 #5',
                                status: true,
                                value: '-',
                                id: 'vcb_05',
                            },
                            {
                                title: 'MA2 #6',
                                status: true,
                                value: '-',
                                id: 'vcb_06',
                            },
                        ],
                    },
                ],
            },
        ],
        motorInfo: [
            {
                alarm: false,
                id: 'motor_01',
                scadaId: 'pump_scada_01',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_02',
                scadaId: 'pump_scada_02',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_03',
                scadaId: 'pump_scada_03',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_04',
                scadaId: 'pump_scada_04',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_05',
                scadaId: 'pump_scada_05',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_06',
                scadaId: 'pump_scada_06',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_07',
                scadaId: 'pump_scada_07',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_08',
                scadaId: 'pump_scada_08',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_09',
                scadaId: 'pump_scada_09',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_10',
                scadaId: 'pump_scada_10',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_11',
                scadaId: 'pump_scada_11',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_12',
                scadaId: 'pump_scada_12',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_13',
                scadaId: 'pump_scada_13',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_14',
                scadaId: 'pump_scada_14',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_15',
                scadaId: 'pump_scada_15',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_16',
                scadaId: 'pump_scada_16',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_17',
                scadaId: 'pump_scada_17',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_18',
                scadaId: 'pump_scada_18',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
            {
                alarm: false,
                id: 'motor_19',
                scadaId: 'pump_scada_19',
                brg_motor_de_temp: 0,
                brg_motor_nde_temp: 0,
                brg_pump_de_temp: 0,
                brg_pump_nde_temp: 0,
                motor_de_rms_amp: 0,
                motor_nde_rms_amp: 0,
                pump_de_rms_amp: 0,
                pump_nde_rms_amp: 0,
            },
        ],
        processStatus: [
            {
                title: '착수',
                list: [
                    {
                        title: '착수정 유입밸브',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'water_controll_valve_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'water_controll_valve_02',
                            },
                        ],
                    },
                ],
            },
            {
                title: '약품',
                list: [
                    {
                        title: '약품펌프',
                        items: [
                            {
                                title: 'PAC #1',
                                status: true,
                                eqon: false,
                                id: 'pac_tube_pump_01',
                            },
                            {
                                title: 'PAC #2',
                                status: true,
                                eqon: false,
                                id: 'pac_tube_pump_02',
                            },
                            {
                                title: 'PAC #3',
                                status: true,
                                eqon: false,
                                id: 'pac_tube_pump_03',
                            },
                            {
                                title: 'PAHCS #1',
                                status: true,
                                eqon: false,
                                id: 'pahcs_tube_pump_01',
                            },
                            {
                                title: 'PAHCS #2',
                                status: true,
                                eqon: false,
                                id: 'pahcs_tube_pump_02',
                            },
                            {
                                title: 'PAHCS #3',
                                status: true,
                                eqon: false,
                                id: 'pahcs_tube_pump_03',
                            },
                        ],
                    },
                    {
                        title: '자동급수펌프',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'auto_water_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'auto_water_pump_01',
                            },
                            {
                                title: '#3',
                                status: true,
                                eqon: false,
                                id: 'auto_water_pump_01',
                            },
                            {
                                title: '#4',
                                status: true,
                                eqon: false,
                                id: 'auto_water_pump_01',
                            },
                        ],
                    },
                ],
            },
            {
                title: '혼화/응집',
                list: [
                    {
                        title: '급속분사교반기',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'rapid_agitator_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'rapid_agitator_02',
                            },
                        ],
                    },
                    {
                        title: '응집기',
                        items: [
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'agglomerate_01',
                            },
                            {
                                title: '#3',
                                status: true,
                                eqon: false,
                                id: 'agglomerate_02',
                            },
                            {
                                title: '#4',
                                status: true,
                                eqon: false,
                                id: 'agglomerate_03',
                            },
                            {
                                title: '#5',
                                status: true,
                                eqon: false,
                                id: 'agglomerate_04',
                            },
                            {
                                title: '#6',
                                status: true,
                                eqon: false,
                                id: 'agglomerate_05',
                            },
                            {
                                title: '#7',
                                status: true,
                                eqon: false,
                                id: 'agglomerate_06',
                            },
                            {
                                title: '#8',
                                status: true,
                                eqon: false,
                                id: 'agglomerate_07',
                            },
                            {
                                title: '#9',
                                status: true,
                                eqon: false,
                                id: 'agglomerate_08',
                            },
                        ],
                    },
                ],
            },
            {
                title: '침전',
                list: [
                    {
                        title: '침전슬러지수집기',
                        items: [
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'sludge_collector_01_2',
                            },
                            {
                                title: '#3',
                                status: true,
                                eqon: false,
                                id: 'sludge_collector_01_3',
                            },
                            {
                                title: '#4',
                                status: true,
                                eqon: false,
                                id: 'sludge_collector_01_4',
                            },
                            {
                                title: '#5',
                                status: true,
                                eqon: false,
                                id: 'sludge_collector_01_5',
                            },
                            {
                                title: '#6',
                                status: true,
                                eqon: false,
                                id: 'sludge_collector_02_6',
                            },
                            {
                                title: '#7',
                                status: true,
                                eqon: false,
                                id: 'sludge_collector_02_7',
                            },
                            {
                                title: '#8',
                                status: true,
                                eqon: false,
                                id: 'sludge_collector_02_8',
                            },
                            {
                                title: '#9',
                                status: true,
                                eqon: false,
                                id: 'sludge_collector_02_9',
                            },
                        ],
                    },
                ],
            },
            {
                title: '여과',
                list: [
                    {
                        title: '여과역세펌프',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'filter_backwash_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'filter_backwash_pump_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                eqon: false,
                                id: 'filter_backwash_pump_03',
                            },
                            {
                                title: '#4',
                                status: true,
                                eqon: false,
                                id: 'filter_backwash_pump_04',
                            },
                        ],
                    },
                    {
                        title: '역세송풍기',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'backwash_blower_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'backwash_blower_02',
                            },
                        ],
                    },
                ],
            },
            {
                title: 'GAC여과',
                list: [
                    {
                        title: 'GAC역세펌프',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'gac_backwash_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'gac_backwash_pump_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                eqon: false,
                                id: 'gac_backwash_pump_03',
                            },
                        ],
                    },
                ],
            },
            //id 아직 부여 안됨
            {
                title: '소독',
                list: [
                    {
                        title: '차염발생기',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'aa_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'aa_01',
                            },
                        ],
                    },
                ],
            },
            {
                title: '송수',
                list: [
                    {
                        title: '송수펌프모터',
                        items: [
                            {
                                title: '평택 #1',
                                status: true,
                                eqon: false,
                                id: 'motor_01',
                                scadaId: 'pump_scada_01',
                            },
                            {
                                title: '평택 #2',
                                status: true,
                                eqon: false,
                                id: 'motor_02',
                                scadaId: 'pump_scada_02',
                            },
                            {
                                title: '평택 #3',
                                status: true,
                                eqon: false,
                                id: 'motor_03',
                                scadaId: 'pump_scada_03',
                            },
                            {
                                title: '평택 #4',
                                status: true,
                                eqon: false,
                                id: 'motor_04',
                                scadaId: 'pump_scada_04',
                            },
                            {
                                title: '송산 #1',
                                status: true,
                                eqon: false,
                                id: 'motor_06',
                                scadaId: 'pump_scada_05',
                            },
                            {
                                title: '송산 #2',
                                status: true,
                                eqon: false,
                                id: 'motor_05',
                                scadaId: 'pump_scada_06',
                            },
                        ],
                    },
                    {
                        title: '펌프기동반',
                        items: [
                            {
                                title: '평택 #1',
                                status: true,
                                eqon: false,
                                id: 'pump_board_01',
                            },
                            {
                                title: '평택 #2',
                                status: true,
                                eqon: false,
                                id: 'pump_board_02',
                            },
                            {
                                title: '평택 #3',
                                status: true,
                                eqon: false,
                                id: 'pump_board_03',
                            },
                            {
                                title: '평택 #4',
                                status: true,
                                eqon: false,
                                id: 'pump_board_04',
                            },
                        ],
                    },
                    {
                        title: '변압기반',
                        items: [
                            {
                                title: '메인 #1',
                                status: true,
                                eqon: false,
                                id: 'transformer_01',
                            },
                            {
                                title: '메인 #2',
                                status: true,
                                eqon: false,
                                id: 'transformer_02',
                            },
                            {
                                title: '평택 #1',
                                status: true,
                                eqon: false,
                                id: 'transformer_03',
                            },
                            {
                                title: '평택 #2',
                                status: true,
                                eqon: false,
                                id: 'transformer_04',
                            },
                        ],
                    },
                    {
                        title: 'VCB반',
                        items: [
                            {
                                title: 'EHV-A3 #1',
                                status: true,
                                eqon: false,
                                id: 'vcb_01',
                            },
                            {
                                title: 'EHV-A4 #2',
                                status: true,
                                eqon: false,
                                id: 'vcb_02',
                            },
                            {
                                title: 'HV-MA1 #3',
                                status: true,
                                eqon: false,
                                id: 'vcb_03',
                            },
                            {
                                title: 'EHV-B3 #4',
                                status: true,
                                eqon: false,
                                id: 'vcb_04',
                            },
                            {
                                title: 'EHV-B4 #5',
                                status: true,
                                eqon: false,
                                id: 'vcb_05',
                            },
                            {
                                title: 'HV-MA2 #6',
                                status: true,
                                eqon: false,
                                id: 'vcb_06',
                            },
                        ],
                    },
                ],
            },
            //id 아직 부여 안됨
            {
                title: '오존',
                list: [
                    {
                        title: '오존발생기',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'onzon_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'onzon_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                eqon: false,
                                id: 'onzon_03',
                            },
                        ],
                    },
                    {
                        title: '모티브펌프',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'motif_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'motif_pump_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                eqon: false,
                                id: 'motif_pump_03',
                            },
                            {
                                title: '#4',
                                status: true,
                                eqon: false,
                                id: 'motif_pump_04',
                            },
                        ],
                    },
                    {
                        title: '냉각수펌프',
                        items: [
                            {
                                title: '#1',
                                status: true,
                                eqon: false,
                                id: 'cooling_pump_01',
                            },
                            {
                                title: '#2',
                                status: true,
                                eqon: false,
                                id: 'cooling_pump_02',
                            },
                            {
                                title: '#3',
                                status: true,
                                eqon: false,
                                id: 'cooling_pump_03',
                            },
                            {
                                title: '#4',
                                status: true,
                                eqon: false,
                                id: 'cooling_pump_04',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    getters: {},
    mutations: {
        facStatistics(state, datas) {
            try {
                state.facNormalValue = (datas[0].normal != null) ? datas[0].normal : 0
                state.facErrValue = (datas[0].abnormal != null) ? datas[0].abnormal : 0
            } catch (err) {
                state.facNormalValue = 0
                state.facErrValue = 0

            }
        },
        pumpBearingAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [
                    {
                        pump_scada_id: 'pump_scada_01',
                        brg_motor_de_temp: 2,
                        brg_motor_nde_temp: 0,
                        brg_pump_de_temp: 2,
                        brg_pump_nde_temp: 3,
                    },
                    {
                        pump_scada_id: 'pump_scada_02',
                        brg_motor_de_temp: 3,
                        brg_motor_nde_temp: 0,
                        brg_pump_de_temp: 2,
                        brg_pump_nde_temp: 4,
                    },
                    {
                        pump_scada_id: 'pump_scada_03',
                        brg_motor_de_temp: 1,
                        brg_motor_nde_temp: 0,
                        brg_pump_de_temp: 2,
                        brg_pump_nde_temp: 1,
                    },
                    {
                        pump_scada_id: 'pump_scada_04',
                        brg_motor_de_temp: 2,
                        brg_motor_nde_temp: 0,
                        brg_pump_de_temp: 5,
                        brg_pump_nde_temp: 6,
                    },
                    {
                        pump_scada_id: 'pump_scada_05',
                        brg_motor_de_temp: 5,
                        brg_motor_nde_temp: 1,
                        brg_pump_de_temp: 2,
                        brg_pump_nde_temp: 7,
                    },
                    {
                        pump_scada_id: 'pump_scada_06',
                        brg_motor_de_temp: 7,
                        brg_motor_nde_temp: 9,
                        brg_pump_de_temp: 2,
                        brg_pump_nde_temp: 1,
                    },
                    {
                        pump_scada_id: 'pump_scada_07',
                        brg_motor_de_temp: 8,
                        brg_motor_nde_temp: 8,
                        brg_pump_de_temp: 2,
                        brg_pump_nde_temp: 1,
                    },
                    {
                        pump_scada_id: 'pump_scada_08',
                        brg_motor_de_temp: 9,
                        brg_motor_nde_temp: 8,
                        brg_pump_de_temp: 2,
                        brg_pump_nde_temp: 1,
                    },
                    {
                        pump_scada_id: 'pump_scada_09',
                        brg_motor_de_temp: 9,
                        brg_motor_nde_temp: 9,
                        brg_pump_de_temp: 2,
                        brg_pump_nde_temp: 1,
                    },
                ];
            } else {
                result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            for (let i = 0; i < state.motorInfo.length; i++) {
                let obj = state.motorInfo[i];
                let index = result.findIndex(
                    (x) => x.pump_scada_id === obj.scadaId
                );
                state.motorInfo[i].brg_motor_de_temp = '-';
                state.motorInfo[i].brg_motor_nde_temp = '-';
                state.motorInfo[i].brg_pump_de_temp = '-';
                state.motorInfo[i].brg_pump_nde_temp = '-';
                if (index >= 0) {
                    state.motorInfo[i].brg_motor_de_temp =
                        Math.floor(result[index].brg_motor_de_temp * 10) / 10;
                    state.motorInfo[i].brg_motor_nde_temp =
                        Math.floor(result[index].brg_motor_nde_temp * 10) / 10;
                    state.motorInfo[i].brg_pump_de_temp =
                        Math.floor(result[index].brg_pump_de_temp * 10) / 10;
                    state.motorInfo[i].brg_pump_nde_temp =
                        Math.floor(result[index].brg_pump_nde_temp * 10) / 10;
                }
            }
            // }
        },
        motorDataAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [
                    {
                        moter_id: 'motor_01',
                        motor_de_rms_amp: 2,
                        motor_nde_rms_amp: 0,
                        pump_de_rms_amp: 2,
                        pump_nde_rms_amp: 3,
                    },
                    {
                        moter_id: 'motor_02',
                        motor_de_rms_amp: 3,
                        motor_nde_rms_amp: 0,
                        pump_de_rms_amp: 2,
                        pump_nde_rms_amp: 4,
                    },
                    {
                        moter_id: 'motor_03',
                        motor_de_rms_amp: 1,
                        motor_nde_rms_amp: 0,
                        pump_de_rms_amp: 2,
                        pump_nde_rms_amp: 1,
                    },
                    {
                        moter_id: 'motor_04',
                        motor_de_rms_amp: 2,
                        motor_nde_rms_amp: 0,
                        pump_de_rms_amp: 5,
                        pump_nde_rms_amp: 6,
                    },
                    {
                        moter_id: 'motor_05',
                        motor_de_rms_amp: 5,
                        motor_nde_rms_amp: 1,
                        pump_de_rms_amp: 2,
                        pump_nde_rms_amp: 7,
                    },
                    {
                        moter_id: 'motor_06',
                        motor_de_rms_amp: 7,
                        motor_nde_rms_amp: 9,
                        pump_de_rms_amp: 2,
                        pump_nde_rms_amp: 1,
                    },
                ];
            } else {
                result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            for (let i = 0; i < state.motorInfo.length; i++) {
                let obj = state.motorInfo[i];
                let index = result.findIndex((x) => x.moter_id === obj.id);
                state.motorInfo[i].motor_de_rms_amp = '-';
                state.motorInfo[i].motor_nde_rms_amp = '-';
                state.motorInfo[i].pump_de_rms_amp = '-';
                state.motorInfo[i].pump_nde_rms_amp = '-';
                if (index >= 0) {
                    state.motorInfo[i].motor_de_rms_amp =
                        Math.floor(result[index].motor_de_rms_amp * 1000) /
                        1000;
                    state.motorInfo[i].motor_nde_rms_amp =
                        Math.floor(result[index].motor_nde_rms_amp * 1000) /
                        1000;
                    state.motorInfo[i].pump_de_rms_amp =
                        Math.floor(result[index].pump_de_rms_amp * 1000) / 1000;
                    state.motorInfo[i].pump_nde_rms_amp =
                        Math.floor(result[index].pump_nde_rms_amp * 1000) /
                        1000;
                }
            }
            // }
        },
        motorAlarm(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                let sample = [
                    { id: 'motor_01', Alarm: 0 },
                    { id: 'motor_04', Alarm: 1 },
                ];
                result = sample.filter((data) => data.Alarm > 0);
            } else {
                result = datas.filter((data) => data.Alarm > 0);
                // result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            for (let i = 0; i < state.motorInfo.length; i++) {
                let obj = state.motorInfo[i];
                let index = result.findIndex((x) => x.id === obj.id);
                state.motorInfo[i].alarm = false;
                if (index >= 0) {
                    state.motorInfo[i].alarm = true;
                }
            }
            // }
        },
        pumpAlarmAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [{ id: 'vcb_01', Alarm: 1 }];
            } else {
                result = datas.filter((data) => data.Alarm > 0);
                // result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            let groupObj = state.processList[4];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[4].list[j].elec[k].status = true;
                    if (index >= 0) {
                        state.processList[4].list[j].elec[k].status = false;
                    }
                }
            }
            // }
        },
        ozoneAlarmAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [{ id: 'cooling_pump_01', Alarm: 1 }];
            } else {
                result = datas.filter((data) => data.Alarm > 0);
                // result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            let groupObj = state.processList[3];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[3].list[j].elec[k].status = true;
                    if (index >= 0) {
                        state.processList[3].list[j].elec[k].status = false;
                    }
                }
            }
            // }
        },
        filterAlarmAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [
                    { id: 'filter_backwash_pump_01', Alarm: 1 },
                    { id: 'filter_backwash_pump_02', Alarm: 0 },
                ];
            } else {
                result = datas.filter((data) => data.Alarm > 0);
                // result = datas;
            }
            let groupObj = state.processList[2];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[2].list[j].elec[k].status = true;
                    if (index >= 0) {
                        state.processList[2].list[j].elec[k].status = false;
                    }
                }
            }
        },
        rapidAggloSludgeAlarmAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [{ id: 'agglomerate_02', Alarm: 1 }];
            } else {
                result = datas.filter((data) => data.Alarm > 0);
                // result = datas;
            }
            let groupObj = state.processList[1];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[1].list[j].elec[k].status = true;
                    if (index >= 0) {
                        state.processList[1].list[j].elec[k].status = false;
                    }
                }
            }
        },
        waterAlarmAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [
                    { id: 'water_controll_valve_01', Alarm: 1 },
                    { id: 'pac_tube_pump_02', Alarm: 1 },
                ];
            } else {
                result = datas.filter((data) => data.Alarm > 0);
                // result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            let groupObj = state.processList[0];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[0].list[j].elec[k].status = true;
                    if (index >= 0) {
                        state.processList[0].list[j].elec[k].status = false;
                    }
                }
            }
            // }
        },
        pumpTransVcbAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [{ id: 'transformer_04', dbm_avg: 0.23 }];
            } else {
                result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            let groupObj = state.processList[4];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[4].list[j].elec[k].value = '-';
                    if (index >= 0) {
                        state.processList[4].list[j].elec[k].value = Number(
                            result[index].dbm_avg
                        ).toFixed(1);
                    }
                }
            }
            // }
        },
        motifCoolAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [{ id: 'cooling_pump_04', current: 0.23 }];
            } else {
                result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            let groupObj = state.processList[3];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[3].list[j].elec[k].value = '-';
                    if (index >= 0) {
                        state.processList[3].list[j].elec[k].value = Number(
                            result[index].current
                        ).toFixed(1);
                    }
                }
            }
            // }
        },
        filterGacAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [{ id: 'gac_backwash_pump_03', current: 0.23 }];
            } else {
                result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            let groupObj = state.processList[2];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[2].list[j].elec[k].value = '-';
                    if (index >= 0) {
                        state.processList[2].list[j].elec[k].value = Number(
                            result[index].current
                        ).toFixed(1);
                    }
                }
            }
            // }
        },
        rapidAggloSludgeAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [
                    { id: 'rapid_agitator_02', current: 0.23 },
                    { id: 'agglomerate_04', current: 0.1 },
                    { id: 'sludge_collector_01', current: 0.1 },
                    { id: 'agglomerate_08 ', current: 0.4 },
                ];
            } else {
                result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            let groupObj = state.processList[1];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    if (obj.id.indexOf('sludge') === -1) {
                        let index = result.findIndex((x) => x.id === obj.id);
                        state.processList[1].list[j].elec[k].value = '-';
                        if (index >= 0) {
                            state.processList[1].list[j].elec[k].value = Number(
                                result[index].current
                            ).toFixed(1);
                        }
                    }
                }
            }
            // }
        },
        waterPacAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [
                    {
                        id: 'water_controll_valve_01',
                        electric_current: 0.2334434,
                    },
                    { id: 'pac_tube_pump_01', electric_current: 0.1 },
                    { id: 'pac_tube_pump_02', electric_current: 0.1 },
                    { id: 'pac_tube_pump_03', electric_current: 0.4 },
                ];
            } else {
                result = datas;
            }
            // for (let i = 0; i < state.processList.length; i++) {
            let groupObj = state.processList[0];
            for (let j = 0; j < groupObj.list.length; j++) {
                let listObj = groupObj.list[j];
                for (let k = 0; k < listObj.elec.length; k++) {
                    let obj = listObj.elec[k];
                    let index = result.findIndex((x) => x.id === obj.id);
                    state.processList[0].list[j].elec[k].value = '-';
                    if (index >= 0) {
                        state.processList[0].list[j].elec[k].value = Number(
                            result[index].electric_current
                        ).toFixed(1);
                        // Math.floor(result[index].electric_current * 10) / 10;
                    }
                }
            }
            // }
        },
        torqueInfo(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                let sample = [
                    {
                        id: 'sludge_collector_02',
                        torque_1: 2,
                        torque_2: 3,
                        torque_3: 4,
                        torque_4: 5,
                    },
                    {
                        id: 'sludge_collector_02',
                        torque_1: 6,
                        torque_2: 7,
                        torque_3: 8,
                        torque_4: 9,
                    },
                ];
                result = sample;
            } else {
                result = datas;
                // result = datas;
            }
            let groupObj = state.processList[1].list[2];
            for (let k = 0; k < groupObj.elec.length; k++) {
                let obj = groupObj.elec[k];
                let index = result.findIndex((x) => x.id === obj.id);
                if (index === 0) {
                    state.processList[1].list[2].elec[0].value = Number(
                        result[index].torque_1
                    ).toFixed(1);
                    state.processList[1].list[2].elec[1].value = Number(
                        result[index].torque_2
                    ).toFixed(1);
                    state.processList[1].list[2].elec[2].value = Number(
                        result[index].torque_3
                    ).toFixed(1);
                    state.processList[1].list[2].elec[3].value = Number(
                        result[index].torque_4
                    ).toFixed(1);
                } else {
                    state.processList[1].list[2].elec[4].value = Number(
                        result[index].torque_1
                    ).toFixed(1);
                    state.processList[1].list[2].elec[5].value = Number(
                        result[index].torque_2
                    ).toFixed(1);
                    state.processList[1].list[2].elec[6].value = Number(
                        result[index].torque_3
                    ).toFixed(1);
                    state.processList[1].list[2].elec[7].value = Number(
                        result[index].torque_4
                    ).toFixed(1);
                }
            }
            // }
        },
        operationAll(state, datas) {
            let result = [];
            let isLocal = false;
            if (isLocal) {
                let sampleData = [
                    { id: 'agglomerate_01_1_1', eq_on: 1 },
                    { id: 'agglomerate_03_1_1', eq_on: 1 },
                ];
                result = sampleData;
            } else {
                result = datas.filter((data) => data.eq_on > 0);
            }
            for (let i = 0; i < state.processStatus.length; i++) {
                let groupObj = state.processStatus[i];
                for (let j = 0; j < groupObj.list.length; j++) {
                    let listObj = groupObj.list[j];
                    for (let k = 0; k < listObj.items.length; k++) {
                        let obj = listObj.items[k];
                        let index = result.findIndex((x) => {
                            let findScada = x.id.indexOf('scada');
                            if (findScada >= 0) {
                                return x.id === obj.scadaId;
                            } else {
                                let findAgglomerate = x.id.indexOf(
                                    'agglomerate'
                                );
                                if (findAgglomerate >= 0) {
                                    let id = x.id.substr(0, x.id.length - 4);
                                    return id === obj.id;
                                } else {
                                    return x.id === obj.id;
                                }
                                // return x.id === obj.id;
                            }
                        });

                        state.processStatus[i].list[j].items[k].eqon = false;
                        if (index >= 0) {
                            state.processStatus[i].list[j].items[k].eqon = true;
                        }
                    }
                }
            }
        },
        alarmDataAll(state, datas) {
            let isSample = false;
            let result = [];
            if (isSample) {
                result = [{ id: 'pump_board_01' }, { id: 'pump_board_02' }];
                state.alarmInfo = result.map((data) => data.id.split('_')[0]);
            } else {
                result = datas.filter((data) => data.Alarm > 0);
                state.alarmInfo = result.map((data) => data.id.split('_')[0]);
            }

            for (let i = 0; i < state.processStatus.length; i++) {
                let groupObj = state.processStatus[i];
                for (let j = 0; j < groupObj.list.length; j++) {
                    let listObj = groupObj.list[j];
                    for (let k = 0; k < listObj.items.length; k++) {
                        let obj = listObj.items[k];
                        let index = result.findIndex((x) => x.id === obj.id);
                        state.processStatus[i].list[j].items[k].status = true;
                        if (index >= 0) {
                            state.processStatus[i].list[j].items[
                                k
                            ].status = false;
                        }
                    }
                }
            }
        },
        nullDataAlarmInfo(state, datas) {
            state.nullDataAlarmInfo = datas
         },
    },
    actions: {
        facStatistics({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/statistics/facStatistics`)
                .then((data) => commit('facStatistics', data.data.datas))
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        torqueInfo({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/sludge/torqueInfo`)
                .then((data) => commit('torqueInfo', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        pumpBearingAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/pumpBearingAll`)
                .then((data) => commit('pumpBearingAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        motorDataAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/motorDataAll`)
                .then((data) => commit('motorDataAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        motorAlarm({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/motorAlarm`)
                .then((data) => commit('motorAlarm', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        pumpAlarmAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/pumpAlarmAll`)
                .then((data) => commit('pumpAlarmAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        ozoneAlarmAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/ozoneAlarmAll`)
                .then((data) => commit('ozoneAlarmAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        filterAlarmAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/filterAlarmAll`)
                .then((data) => commit('filterAlarmAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        rapidAggloSludgeAlarmAll({ rootState, commit }) {
            try {
                axios
                .get(
                    `${rootState.globalIP}/api/v1/main/rapidAggloSludgeAlarmAll`
                )
                .then((data) =>
                    commit('rapidAggloSludgeAlarmAll', data.data.datas)
                )
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        waterAlarmAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/waterAlarmAll`)
                .then((data) => commit('waterAlarmAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        pumpTransVcbAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/pumpTransVcbAll`)
                .then((data) => commit('pumpTransVcbAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        motifCoolAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/motifCoolAll`)
                .then((data) => commit('motifCoolAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        filterGacAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/filterGacAll`)
                .then((data) => commit('filterGacAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        rapidAggloSludgeAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/rapidAggloSludgeAll`)
                .then((data) => commit('rapidAggloSludgeAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        waterPacAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/waterPacAll`)
                .then((data) => commit('waterPacAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        alarmDataAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/alarmDataAll`)
                .then((data) => commit('alarmDataAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        nullDataAlarmInfo({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/nullDataAlarmInfo`)
                .then((data) => commit('nullDataAlarmInfo', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
        },
        operationAll({ rootState, commit }) {
            try {
                axios
                .get(`${rootState.globalIP}/api/v1/main/operationAll`)
                .then((data) => commit('operationAll', data.data.datas))
                // [gelix_lsj_230925] 예외처리
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
            } catch (err) {
                log.logError(err.message);
            }
            
        },
    },
};

export default dashboard;
