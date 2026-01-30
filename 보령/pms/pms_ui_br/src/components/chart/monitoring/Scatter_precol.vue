<template>
    <div class="chart">
        <v-chart class="scatterchart" :option="option" autoresize />
    </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';
import bgData from '@/assets/data/precol_rev.json';

export default {
    props: ['data', 'distribution'],
    setup(props) {
        let dataLevel1 = [];
        let dataLevel2 = [];
        let dataLevel3 = [];

        let level1Cnt = bgData['Q_1'].length;
        for (let i = 0; i < level1Cnt; i++) {
            if (i % 10 == 0) {
                let x = bgData['Q_1'][i];
                let y = bgData['P_1'][i];
                let l_arr = [x, y];
                dataLevel1.push(l_arr);
            }
        }
        let level2Cnt = bgData['Q_1'].length;
        for (let i = 0; i < level2Cnt; i++) {
            if (i % 10 == 0) {
                let x = bgData['Q_2'][i];
                let y = bgData['P_2'][i];
                let l_arr = [x, y];
                dataLevel2.push(l_arr);
            }
        }
        let level3Cnt = bgData['Q_3'].length;
        for (let i = 0; i < level3Cnt; i++) {
            if (i % 10 == 0) {
                let x = bgData['Q_3'][i];
                let y = bgData['P_3'][i];
                let l_arr = [x, y];
                dataLevel3.push(l_arr);
            }
        }

        const state = reactive({
            // flow_rate: computed(() => props.distribution.flow_rate),
            // pressure: computed(() => props.distribution.pressure),
            data: computed(() => props.data),
        });

        watch(state, () => {
            // state.flow_rate = [];
            // state.pressure = [];
            // option.series[0].data = state.flow_rate;
            // option.series[1].data = state.pressure;
            option.series[3].data = state.data ? state.data : [];
        });

        const option = reactive({
            backgroundColor: 'rgba(0,0,0,0)',
            title: {
                // text: 'Health Feature Space',
                textStyle: {
                    color: '#fff',
                },
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderWidth: 1,
                borderColor: 'rgba(25,163,223, 0.5)',
                textStyle: {
                    color: '#eee',
                    fontSize: 12,
                },
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(126,199,255,0)', // 0% 处的颜色
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(126,199,255,1)', // 100% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(126,199,255,0)', // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                    },
                },
                formatter: '{a} : {c}',
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                },
            ],
            legend: {
                right: '0',
                top: 26,
                data: ['Normal', 'Warning', 'Critical', 'Fault'],
                textStyle: {
                    color: '#fff',
                },
            },
            xAxis: {
                name: '유량(㎥/min)',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#5D96C4',
                },
                axisLabel: {
                    color: '#5D96C4',
                    fontStyle: {
                        fontSize: 10,
                    },
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#192B45',
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#192B45',
                    },
                },
                min: 0,
            },
            yAxis: {
                name: '압력(kgf/㎥)',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#5D96C4',
                },
                axisLabel: {
                    color: '#5D96C4',
                    fontStyle: {
                        fontSize: 10,
                    },
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#192B45',
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#192B45',
                    },
                },
                scale: true,
            },
            grid: {
                left: '10%',
                right: '5%',
                top: '5%',
                bottom: '10%',
                containLabel: true,
            },
            series: [
                // {
                //     name: '유량',
                //     data: state.flow_rate,
                //     type: 'scatter',
                //     symbolSize: 2,
                //     itemStyle: {
                //         color: '#2B56D3',
                //     },
                //     large: true,
                //     tooltip: {
                //         formatter() {
                //             return '';
                //         },
                //     },
                //     animation: false,
                //     animationThreshold: 10000,
                // },
                {
                    name: 'data',
                    data: dataLevel1,
                    type: 'scatter',
                    symbolSize: 2,
                    itemStyle: {
                        color: '#911F27',
                    },
                    large: true,
                    tooltip: {
                        show: false,
                    },
                },
                {
                    name: 'data',
                    data: dataLevel2,
                    type: 'scatter',
                    symbolSize: 2,
                    itemStyle: {
                        color: '#055052',
                    },
                    large: true,
                    tooltip: {
                        show: false,
                    },
                },
                {
                    name: 'data',
                    data: dataLevel3,
                    type: 'scatter',
                    symbolSize: 2,
                    itemStyle: {
                        color: '#193498',
                    },
                    large: true,
                    tooltip: {
                        show: false,
                    },
                },
                {
                    name: 'value',
                    data: state.data,
                    type: 'scatter',
                    symbolSize: 2,
                    itemStyle: {
                        color: '#04E0F3',
                    },
                    large: true,
                    tooltip: {
                        formatter() {
                            return '';
                        },
                    },
                },
            ],
        });

        return { option };
    },
};
</script>
