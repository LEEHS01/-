<template>
    <div>
        <div class="title-box">
            <img src="@/assets/circle.svg" alt="" />
            <p>전체</p>
        </div>
        <!-- <Frame /> -->
        <v-chart class="piechart" :option="option" autoresize />
        <p class="text">정상</p>
    </div>
</template>

<script>
// import Frame from '@/components/component/BoxFrame.vue';
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
        // Frame,
    },
    provide: {
        [THEME_KEY]: 'dark',
    },
    setup() {
        const store = useStore();

        const normalValue = store.state.process
            .map((item) => item.normal)
            .reduce((a, b) => a + b, 0);
        const errValue = store.state.process
            .map((item) => item.err)
            .reduce((a, b) => a + b, 0);

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

        const normalPercentage = ((normal / (normal + error)) * 100).toFixed(0);

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
                    fontSize: 10,
                },
            },
            series: [
                {
                    type: 'liquidFill',
                    radius: '70%',
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
                    radius: ['75%', '90%'],
                    hoverAnimation: false,
                    data: data,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                color: '#fff',
                                fontSize: 12,
                                lineHeight: 14,
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
                                        (params.value / total) *
                                        100
                                    ).toFixed(0);
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
