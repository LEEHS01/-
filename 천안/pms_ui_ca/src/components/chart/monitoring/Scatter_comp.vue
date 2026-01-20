<template>
    <div class="chart">
        <v-chart class="scatterchart" :option="option" autoresize />
    </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';

export default {
    props: ['distribution', 'comp'],
    setup(props) {
        const state = reactive({
            flow_rate: computed(() => props.distribution.flow_rate),
            pressure: computed(() => props.distribution.pressure),
            comp: computed(() => props.comp),
        });

        // console.log(state.comp['P']);
        let dataLevel1 = [];

        let level1Cnt = state.comp['Q'].length / 10;
        for (let i = 0; i < level1Cnt; i++) {
            let x = state.comp['Q'][i];
            let y = state.comp['P'][i];
            let l_arr = [x, y];
            dataLevel1.push(l_arr);
        }

        // console.log(state.comp);
        watch(state, () => {
            option.series[0].data = state.flow_rate ? state.flow_rate : [];
            option.series[1].data = state.pressure ? state.pressure : [];
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
                {
                    name: '유량',
                    data: state.flow_rate,
                    type: 'scatter',
                    symbolSize: 2,
                    itemStyle: {
                        color: '#2B56D3',
                    },
                    large: true,
                    tooltip: {
                        formatter() {
                            return '';
                        },
                    },
                    animation: false,
                    animationThreshold: 10000,
                },
                {
                    name: '압력',
                    data: state.pressure,
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
                {
                    name: 'data',
                    data: dataLevel1,
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
            ],
        });

        return { option };
    },
};
</script>
