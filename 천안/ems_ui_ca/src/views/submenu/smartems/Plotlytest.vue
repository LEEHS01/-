<template>
    <div style="color: white">
        <v-chart class="piechart" :option="option" autoresize />
    </div>
</template>

<script>
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


use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);


export default {
     components: {
        VChart,
    },
     provide: {
        [THEME_KEY]: 'dark',
    },
    setup() {
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
                         0.01,
                         0.01 - 0.1,
                         0.01 - 0.25,
                    ],
                    backgroundStyle: {
                        borderWidth: 1,
                        color: '#191E36',
                    },
                    label: {
                        normal: {
                            formatter: '\n'+ '%',
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
        return { option };
    },
}
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