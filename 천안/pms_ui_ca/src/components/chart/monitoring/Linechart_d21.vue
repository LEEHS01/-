<template>
    <div class="chart">
        <div class="titlebox">
            <img src="@/assets/subtitleicon.svg" alt="" />
            <span style="font-size: 18px;">{{ TITLE.split('-')[0] }}</span
            >&nbsp;
            <span>{{ TITLE.split('-')[1] }}</span>
        </div>
        <v-chart class="linechart" :option="option" autoresize />
    </div>
</template>

<script>
// import * as echarts from 'echarts';
import { useStore } from 'vuex';
import { ref, reactive, computed, watch } from 'vue';
import moment from 'moment';

export default {
    props: ['title', 'detailData1', 'detailData2', 'name1', 'name2'],
    setup(props) {
        const store = useStore();
        const TITLE = ref(props.title);
        const state = reactive({
            current1: computed(() => props.detailData1),
            current2: computed(() => props.detailData2),
            name1: computed(() => props.name1),
            name2: computed(() => props.name2),
        });

        watch(state, () => {
            // console.log('state:::');
            option.series[1].data = state.current1 ? state.current1 : [];
            option.series[2].data = state.current2 ? state.current2 : [];
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
                                    color: 'rgba(126,199,255,0)',
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(126,199,255,1)',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(126,199,255,0)',
                                },
                            ],
                            global: false, //
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
                // formatter: (p) => {
                //     return `현재값 : ${p[0].value} <br/> 일시 :  `;
                // },
            },
            legend: {
                // show: true,
                // icon: 'roundRect',
                type: 'scroll',
                // orient: 'horizontal',
                // bottom: 0,
                show: true,
                // pageTextStyle: {
                //     color: '#fff',
                // },
                // pageIconColor: '#fff',
                // pageIconSize: 8,
                textStyle: {
                    color: '#fff',
                },
                inactiveColor: '#444',
            },
            grid: {
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '18%',
                // containLabel: true
            },
            xAxis: {
                name: '시간',
                type: 'time',
                boundaryGap: false,
                // splitNumber: 3,
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
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#192B45',
                    },
                },
                axisTick: {
                    show: true,
                },
            },
            yAxis: {
                name: 'rms(mm/s)',
                nameLocation: 'middle',
                nameGap: 30,
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
                    let max = 7;
                    if (value.max > 7) max = Math.floor(value.max) + 1;
                    return max;
                },
            },
            textStyle: {
                color: '#5D96C4',
                // padding: 2,
                // fontSize: 16,
                // fontWeight: 'bold',
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
                            show: true,
                            position: 'end',
                        },
                        data: [
                            {
                                yAxis: 6.1,
                                label: {
                                    show: true,
                                    position: 'end',
                                    formatter: function() {
                                        return '결함';
                                    },
                                    color: '#f00',
                                },
                            },
                        ],
                    },
                },
                {
                    name: state.name1,
                    type: 'line',
                    symbol: 'circle',
                    showAllSymbol: true,
                    symbolSize: 0,
                    smooth: true,
                    // lineStyle: {
                    //     normal: {
                    //         width: 2,
                    //         color: 'rgba(25,163,223,1)',
                    //     },
                    //     borderColor: 'rgba(0,0,0,.4)',
                    // },
                    // itemStyle: {
                    //     color: 'rgba(25,163,223,1)',
                    //     borderColor: '#646ace',
                    //     borderWidth: 2,
                    // },
                    tooltip: {
                        show: true,
                    },
                    data: [],
                },
                {
                    name: state.name2,
                    type: 'line',
                    symbol: 'circle',
                    showAllSymbol: true,
                    symbolSize: 0,
                    smooth: true,
                    // lineStyle: {
                    //     normal: {
                    //         width: 2,
                    //         color: 'rgba(25,163,223,1)',
                    //     },
                    //     borderColor: 'rgba(0,0,0,.4)',
                    // },
                    // itemStyle: {
                    //     color: 'rgba(25,163,223,1)',
                    //     borderColor: '#646ace',
                    //     borderWidth: 2,
                    // },
                    tooltip: {
                        show: true,
                    },
                    data: [],
                },
            ],
        });

        return { store, option, TITLE };
    },
};
</script>
