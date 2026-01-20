<template>
    <div class="charts">
        <div class="title-box">
            <img src="@/assets/circle.svg" alt="" />
            <!-- <p>설비현황 통계</p> -->
            <p>실시간 설비 현황</p>
        </div>
        <Frame />
        <v-chart class="piechart" :option="option" autoresize />
        <p class="text">정상</p>
    </div>
</template>

<script>
import Frame from '@/components/component/BoxFrame.vue';
import * as echarts from 'echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import 'echarts-liquidfill';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

export default defineComponent({
    components: {
        VChart,
        Frame,
    },
    provide: {
        [THEME_KEY]: 'dark',
    },
    setup() {
        const store = useStore();

        // const normalValue = store.state.process
        //     .map((item) => item.normal)
        //     .reduce((a, b) => a + b, 0);
        // const errValue = store.state.process
        //     .map((item) => item.err)
        //     .reduce((a, b) => a + b, 0);

        const normalValue = Number(store.state.dashboard.facNormalValue)
        const errValue = Number(store.state.dashboard.facErrValue)

        const trafficWay = [
            {
                name: '정상',
                value: normalValue,
            },
            {
                name: '이상',
                value: errValue,
            },
        ];

        const normal = trafficWay.filter((data) => data.name === '정상')[0]
            .value;
        const error = trafficWay.filter((data) => data.name === '이상')[0]
            .value;

        const normalPercentage = ((normal + error) == 0 ) ? 0 : ((normal / (normal + error)) * 100).toFixed(1) 

        const data = [];
        const borderColor = ['#1464EF', '#ED1874'];
        const color = [
            new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                    offset: 0,
                    color: '#08286d96',
                },
                {
                    offset: 1,
                    color: '#1a95fa67',
                },
            ]),
            new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                    offset: 0,
                    color: '#52062381',
                },
                {
                    offset: 1,
                    color: '#f30e667c',
                },
            ]),
        ];
        const shadowColor = ['#1464EF', '#ED1874'];

        for (var i = 0; i < trafficWay.length; i++) {
            data.push({
                value: trafficWay[i].value,
                name: trafficWay[i].name,
                itemStyle: {
                    normal: {
                        borderWidth: 2,
                        shadowBlur: 5,
                        borderColor: borderColor[i],
                        color: color[i],
                        shadowColor: shadowColor[i],
                    },
                },
            });
        }

        const option = {
            backgroundColor: 'rgba(0,0,0,0)',
            title: {
                text: '',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 25,
                    color: 'rgb(97, 142, 205)',
                },
            },
            legend: {
                show: true,
                right: 0,
                top: 0,
                orient: 'vertical',
                itemHeight: 6,
                textStyle: {
                    color: '#fff',
                    fontSize: 14,
                },
            },
            series: [
                {
                    type: 'liquidFill',
                    radius: '60%',
                    center: ['48%', '50%'],
                    data: [
                        normalPercentage * 0.01,
                        normalPercentage * 0.01 - 0.1,
                        normalPercentage * 0.01 - 0.25,
                    ],
                    backgroundStyle: {
                        borderWidth: 1,
                        color: '#191E36',
                    },
                    label: {
                        normal: {
                            formatter: '\n' + normalPercentage + '%',
                            textStyle: {
                                fontSize: 45,
                                lineHeight: 30,
                                textShadowColor: 'rgba(0,0,0,0.2)',
                                textShadowBlur: 8,
                                textShadowOffsetX: 2,
                                textShadowOffsetY: 2,
                            },
                        },
                    },
                    outline: {
                        show: false,
                    },
                },
                {
                    type: 'pie',
                    center: ['48%', '50%'],
                    radius: ['65%', '80%'],
                    hoverAnimation: false,
                    data: data,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                color: '#fff',
                                fontSize: 16,
                                lineHeight: 20,
                                align: 'center',

                                formatter: (params) => {
                                    var percent = 0;
                                    var total = 0;
                                    for (
                                        var i = 0;
                                        i < trafficWay.length;
                                        i++
                                    ) {
                                        total += trafficWay[i].value;
                                    }
                                    percent = (
                                        total == 0 ? 0 : 
                                        (params.value / total) *
                                        100
                                    ).toFixed(1);
                                    if (params.name !== '') {
                                        return (
                                            params.name +
                                            '\n' +
                                            percent +
                                            '%' +
                                            '\n' +
                                            params.value +
                                            '대'
                                        );
                                    } else {
                                        return '';
                                    }
                                },
                            },
                            labelLine: {
                                length: -10,
                                length2: 80,
                                show: true,
                                lineStyle: {
                                    width: 3,
                                },
                            },
                        },
                    },
                },
            ],
        };

        return { option, store };
    },
});
</script>

<style lang="scss" scoped>
.charts {
    width: 100%;
    height: 100%;
    background: #05223b93;
    border: 1px solid #2660ab;
    border-radius: 12px;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px 15px;

    .title-box {
        font-size: 18px;
        display: flex;
        align-items: center;
        height: 15%;
        color: #c8d7e9;
        text-shadow: 0px 0px 10px #24baff;

        img {
            width: 16px;
            margin-right: 8px;
        }
    }

    .piechart {
        width: 100%;
        position: relative;
        flex: 1;
    }
    .text {
        position: absolute;
        top: 45%;
        left: 48%;
        color: white;
        transform: translate(-50%, -50%);
        text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    }
}
</style>
