<template>
    <div class="chart">
        <div class="titlebox">
            <img src="@/assets/subtitleicon.svg" alt="" />
            <span>{{ TITLE }}</span>
        </div>
        <v-chart class="linechart" :option="option" autoresize />
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { useStore } from 'vuex';
import { ref } from 'vue';
import axios from 'axios';

export default {
    props: ['title'],
    data() {
        let data = [];

        for (let i = 0; i <= 360; i++) {
            let t = (i / 180) * Math.PI;
            let r = Math.sin(2 * t) * Math.cos(2 * t);
            data.push([r, i]);
        }

        return {
            option: {
                backgroundColor: 'rgba(0,0,0,0)',
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#000',
                    textStyle: {
                        color: '#fff',
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
                    borderWidth: 0,
                },
                legend: {
                    show: false,
                },
                grid: {
                    top: '10%',
                    left: '7%',
                    right: '5%',
                    bottom: '15%',
                    // containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#192B45',
                            },
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#5D96C4',
                                padding: 2,
                                fontSize: 8,
                            },
                            formatter: function(data) {
                                return data;
                            },
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#192B45',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        data: [],
                    },
                ],
                yAxis: [
                    {
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
                                color: '#233653',
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
                        max: 0.2,
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
                                    yAxis: 0.1,
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
                        symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
                        showAllSymbol: true,
                        symbolSize: 0,
                        smooth: true,
                        lineStyle: {
                            normal: {
                                width: 2,
                                color: 'rgba(25,163,223,1)', // 线条颜色
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
                            //区域填充样式
                            normal: {
                                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
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
                                shadowColor: 'rgba(25,163,223, 0.5)', //阴影颜色
                                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                            },
                        },
                        data: [],
                    },
                ],
            },
        };
    },
    mounted() {
        // let param = {
        //     endDt: encodeURIComponent('2021-07-30 14:32:00'),
        //     startDt: encodeURIComponent('2021-07-07 14:23:41'),
        // };
        axios
            // .get(
            //     'http://192.168.10.198:8081/api/v1/waterControl/find/water_controll_valve_01?endDt=2021-07-30%2000%3A00%3A00&startDt=2021-07-07%2000%3A00%3A00'
            // )
            .get(
                'http://10.15.32.151:30011/api/v1/waterControl/find/water_controll_valve_01?endDt=2021-10-15%2000%3A00%3A00&startDt=2021-10-01%2000%3A00%3A00'
            )
            .then((res) => {
                var dataArr = res.data.datas;
                var arr_1 = [];
                var arr_2 = [];
                for (var i = 0; i < dataArr.length; i++) {
                    var obj = dataArr[i];
                    arr_1.push(obj.acqDate);
                    arr_2.push(obj.volveVoltageVariance);
                }
                this.option.xAxis[0].data = arr_1;
                this.option.series[1].data = arr_2;
                // let data = [];
                // for (let i = 0; i <= 360; i++) {
                //     let t = (i / 180) * Math.PI;
                //     let r = Math.sin(3 * t) * Math.cos(3 * t);
                //     data.push([r, i]);
                // }
                // this.option.series[0].data = data;
            });
    },
    methods: {},
    setup(props) {
        const store = useStore();
        const TITLE = ref(props.title);
        return { store, TITLE };
    },
};
</script>
