<template>
    <div class="chart">
        <v-chart class="linechart" :option="option" autoresize />
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { useStore } from 'vuex';
import { reactive, computed, watch } from 'vue';

export default {
    props: ['elecData'],
    setup(props) {
        const store = useStore();
        const state = reactive({
            current: computed(() => props.elecData.current),
            acq_date: computed(() => props.elecData.acq_date),
        });

        watch(state, () => {
            option.xAxis.data = [];
            option.series[1].data = state.current ? state.current : [];
            for (let i = 0; i < state.acq_date.length; i++) {
                option.xAxis.data.push(state.acq_date[i].time);
            }
        });

        const option = reactive({
            backgroundColor: 'rgba(0,0,0,0)',
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
                formatter: (p) => {
                    return `현재값 : ${p[0].value} <br/> 일시 :  `;
                },
            },
            legend: {
                show: false,
            },
            grid: {
                top: 5,
                left: '30',
                right: '10',
                bottom: 20,
                // containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitNumber: 3,
                axisLine: {
                    lineStyle: {
                        color: '#5D96C4',
                    },
                },
                axisLabel: {
                    show: true,
                    fontStyle: {
                        color: '#5D96C4',
                        fontSize: 10,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#192B45',
                    },
                },
                axisTick: {
                    show: true,
                },
                data: [],
            },
            yAxis: {
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#192B45',
                    },
                },
                splitNumber: 3,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#5D96C4',
                    },
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#5D96C4',
                        padding: 2,
                        fontSize: 8,
                    },
                    formatter: function(value) {
                        if (value === 0) {
                            return value;
                        }
                        return value;
                    },
                },
                axisTick: {
                    show: false,
                },
                max: function(value) {
                    return value.max + 1;
                },
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                },
            ],
            series: [
                {
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 4,
                    itemStyle: {
                        normal: {
                            type: 'dashed',
                            color: '#FF4369',
                            lineStyle: {
                                color: 'yellow',
                            },
                        },
                    },
                    markLine: {
                        symbol: 'none',
                        silent: true,
                        label: {
                            position: 'start',
                        },
                        data: [
                            {
                                yAxis: 1,
                                label: {
                                    show: false,
                                    position: '',
                                },
                            },
                        ],
                    },
                },
                {
                    type: 'line',
                    symbol: 'circle',
                    showAllSymbol: true,
                    symbolSize: 0,
                    smooth: true,
                    lineStyle: {
                        normal: {
                            width: 2,
                            color: 'rgba(25,163,223,1)',
                        },
                        borderColor: 'rgba(0,0,0,.4)',
                    },
                    itemStyle: {
                        color: 'rgba(25,163,223,1)',
                        borderColor: '#646ace',
                        borderWidth: 2,
                    },
                    tooltip: {
                        show: true,
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: 'rgba(25,163,223,.3)',
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(25,163,223, 0)',
                                    },
                                ],
                                false
                            ),
                            shadowColor: 'rgba(25,163,223, 0.5)',
                            shadowBlur: 20,
                        },
                    },
                    data: [],
                },
            ],
        });

        return { store, option, state };
    },
};
</script>
