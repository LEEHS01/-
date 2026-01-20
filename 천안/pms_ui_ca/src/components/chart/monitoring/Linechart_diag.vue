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
import { ref, reactive, watch, computed } from 'vue';
import moment from 'moment';

export default {
    props: ['title', 'detailData', 'name1'],
    setup(props) {
        const store = useStore();
        const TITLE = ref(props.title);
        const state = reactive({
            current: computed(() => props.detailData),
            name1: computed(() => props.name1),
        });
        // console.log(state.current)

        watch(state, () => {
            // console.log('state:::');
            option.series[1].data = state.current ? state.current : [];
        });
        // console.log(option.series)


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
                    // console.log(obj, 'obj!!!!!')
                    for (i = 0; i < obj.length; i++) {
                        let targetObj = obj[i];
                        let value = targetObj.value[1];
                        // console.log(targetObj.axisValue);
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
                show: false,
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
                nameTextStyle: {
                    // fontSize: 12,
                    fontWeight: 'normal',
                },
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
                name: '속도',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    // fontSize: 12,
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
                max: 1.5,
                // max: function(value) {
                //     return Math.floor(value.max * 100) / 100 + 1;
                // },
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
                // fontSize: 16,
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
                                yAxis: 1,
                                label: {
                                    show: true,
                                    position: 'end',
                                    formatter: function() {
                                        return '임계선';
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
            ],
        });

        


        return { store, option, TITLE };
    },
};
</script>
