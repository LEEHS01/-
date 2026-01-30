<template>
    <div class="chart">
        <v-chart class="linechart" :option="option" autoresize />
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { useStore } from 'vuex';
import { reactive, computed, watch } from 'vue';
import moment from 'moment';

export default {
    props: ['elecData', 'max', 'threadHold'],
    setup(props) {
        const store = useStore();
        const state = reactive({
            current: computed(() => props.elecData),
            max: computed(() => Number(props.max)),
            threadHold: computed(() => Number(props.threadHold)),
        });

        watch(state, () => {
            option.xAxis.data = [];
            option.series[1].data = state.current ? state.current : [];
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
                    fontSize: 16,
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
                formatter: (obj) => {
                    let l_str = '';
                    let i = 0;
                    for (i = 0; i < obj.length; i++) {
                        let targetObj = obj[i];
                        let value = targetObj.value[1];
                        if (value === undefined) value = '-';
                        if (i === 0) {
                            l_str +=
                                moment(targetObj.axisValue).format(
                                    'yyyy-MM-DD HH:mm:ss'
                                ) + '<br>';
                            if (isNaN(targetObj.value[1]) === false) {
                                l_str += targetObj.seriesName + ' : ';
                                l_str += value + '<br>';
                            }
                        } else if (i === obj.length - 1) {
                            l_str += targetObj.seriesName + ' : ';
                            l_str += value;
                        } else {
                            if (isNaN(targetObj.value[1]) === false) {
                                l_str += targetObj.seriesName + ' : ';
                                l_str += value + '<br>';
                            }
                        }
                    }
                    return l_str;
                },
            },
            legend: {
                show: false,
            },
            grid: {
                // top: '20',
                // left: '60',
                // right: '60',
                // bottom: '30',
                left: '7%',
                right: '7%',
                top: '7%',
                bottom: '5%',
                containLabel: true,
            },
            xAxis: {
                name: '시간',
                // nameLocation: 'middle',
                // nameGap: 30,
                nameTextStyle: {
                    fontSize: 12,
                    fontWeight: 'normal',
                },
                // type: 'category',
                type: 'time',
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
                    },
                    formatter: {
                        year: '{yyyy}',
                        month: '{MMM}',
                        day: '{MM}-{dd}',
                        hour: '{HH}:{mm}',
                        minute: '{HH}:{mm}',
                        second: '{HH}:{mm}:{ss}',
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
                name: '전류(A)',
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: {
                    fontSize: 12,
                    fontWeight: 'normal',
                },
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
                    },
                    formatter: {
                        year: '{yyyy}',
                        month: '{MMM}',
                        day: '{dayStyle|{MM}-{dd}}',
                        hour: '{hourStyle|{HH}:{mm}}',
                        minute: '{HH}:{mm}',
                        second: '{HH}:{mm}:{ss}',
                    },
                    rich: {
                        dayStyle: {
                            fontWeight: 'bold',
                        },
                        hourStyle: {
                            fontWeight: 'normal',
                        },
                    },
                },
                axisTick: {
                    show: false,
                },
                max: state.max,
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                },
            ],
            textStyle: {
                color: '#5D96C4',
                // padding: 2,
                fontSize: 16,
                fontWeight: 'bold',
            },
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
                            show: true,
                            position: 'end',
                        },
                        data: [
                            {
                                yAxis: state.threadHold,
                                label: {
                                    show: true,
                                    position: 'end',
                                    formatter: function() {
                                        return '임계선';
                                    },
                                    color: '#f00',
                                    // padding: 2,
                                    fontSize: 14,
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
