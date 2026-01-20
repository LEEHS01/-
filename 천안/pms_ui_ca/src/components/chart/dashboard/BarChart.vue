<template>
   <div class="child-chart">
        <div class="chart-title">
            <div class="circle"></div>
            <div class="title">{{ title }}</div>
        </div>
        <v-chart class="child" :option="option" autoresize />
        <div class="chart-infobox">
            <div class="info">
                <p class="label">정상:</p>
                <span class="per blue">{{normalPer}}%</span>
                <span>({{normal}}건)</span>
            </div>
            <div class="info">
                <p class="label">이상:</p>
                <span class="per yellow">{{errPer}}%</span>
                <span>({{err}}건)</span>
            </div>
        </div>
   </div>
</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import 'echarts-liquidfill'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { defineComponent, ref } from 'vue';

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
    },
        props:['name' , 'value', 'value2'],
    provide: {
        [THEME_KEY]: 'dark',
    },
    setup(props) {
        const normal = ref(props.value);
        const err = ref(props.value2);
        const title = ref(props.name)
        const normalPer = parseInt((normal.value / (normal.value + err.value) * 100).toFixed(0))
        const errPer = parseInt((err.value / (normal.value + err.value) * 100).toFixed(0))

const barWidth = 20;
const color1 = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    type: 'linear',
    global: false,
    colorStops: [
        {
            //第一节下面
            offset: 0,
            color: '#1C98CD',
        },
        {
            offset: 1,

            color: 'rgba(61,187,255,.16)',
        },
    ],
};
const color2 = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    type: 'linear',
    global: false,
    colorStops: [
        {
            //第一节下面
            offset: 0,
            color: '#E7AB47',
        },
        {
            offset: 1,
            color: 'rgba(255,164,41,.16)',
        },
    ],
};
    const option = {
    backgroundColor: 'rgba(0,0,0,0)', 
    legend: {
        show:false,
    },
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'none',
        },
        formatter: function () {
            var resultTooltip =
                "<div style='background:rgba(13,5,30,.3);padding:6px;border-radius:4px;'>" +
                "<div style='text-align:center;'>" +
                props.name +
                '</div>' +
                "<div style='padding-top:5px;'>" +
                "<span style='display:inline-block;border-radius:4px;width:20px;height:10px;background-color:rgba(61,187,255,.3);border: 2px solid #3eb6f5;'></span>" +
                "<span style=''> " +
                '정상' +
                ': </span>' +
                "<span style=''>" +
                 props.value +
                '</span><span>%</span>' +
                '</div>' +
                "<div style='padding-top:5px;'>" +
                "<span style='display:inline-block;border-radius:4px;width:20px;height:10px;background-color:rgba(255,164,41,.3);border: 2px solid #ffc241;'></span>" +
                "<span style=''> " +
                '이상' +
                ': </span>' +
                "<span style=''>" +
                 props.value2 ;
            return resultTooltip;
        },
    },
   
    grid: {
        top: '0%',
        left: '5%',
        bottom: '0',
        right: '5%',
    },
    animation: false,
    yAxis: [
        {   
            type: 'category',
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(0,228,255,1)',
                },
            },
            axisLabel: {
                inside: false,
                textStyle: {
                    color: '#fff',
                    fontWeight: 'normal',
                    fontSize: 12,
                },
                margin: 20, //刻度标签与轴线之间的距离。
            },
        },
        {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitArea: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            data: props.name,
        },
    ],
    xAxis: [
        {
            show: false,
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff',
                },
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,228,255,1)',
                },
            },
            axisLine: {
                show: false,
            },
        },
    ],
    series: [
        {
            name: '정상',
            type: 'bar',
            stack:'on',
            barWidth: barWidth,
            itemStyle: {
                //
                // color: '',
                color: color1,
                borderColor: color1,
                borderWidth: 1,
                borderType: 'solid',
            },
            // label: {
            //     show: true,
            //     formatter: '{c}' + '%',
            //     position: 'left',
            //     color: 'rgba(119,167,255,1)',
            //     fontSize: 12,
            //     textAlign: 'center',
            // },
            zlevel: 2,
            data: [normalPer]
        },
        {
            name: '이상',
            type: 'bar',
            stack:'on',
            barWidth: barWidth,
            itemStyle: {
                // color: 'rgba(255,164,41,.16)',
                color: color2,
                borderColor: color2,
                borderWidth: 1,
                borderType: 'solid',
            },
            // label: {
            //     show: true,
            //     formatter: '{c}' + '%',
            //     position: 'right',
            //     color: 'rgba(255,228,59,1)',
            //     fontSize: 12,
            //     textAlign: 'center',
            // },
            zlevel: 2,
            data: [errPer]
        },
        {
            name: '정상',
            type: 'bar',
            stack:'on',
            yAxisIndex: 1,
            data: [normalPer],
            zlevel: 1,
            barWidth: barWidth,
            itemStyle: {
                normal: {
                    color: 'rgba(61,187,255,.16)',
                },
            },
        },
        {
            name: '이상',
            type: 'bar',
            stack:'on',
            yAxisIndex: 1,
            data: [errPer],
            zlevel: 1,
            barWidth: barWidth,
            itemStyle: {
                normal: {
                    color: 'rgba(255,164,41,.16)',
                },
            },
        },
        {
            name: '정상',
            type: 'pictorialBar',
            stack:'on',
            symbolSize: [barWidth, 8],
            symbolOffset: [-10, 0],
            z: 12,
             symbolRotate:90,
            color: 'rgba(85, 201, 255, 0.4)',
            data: [
                {
                    name: '',
                    value: '100',
                },
        
            ],
        },
        {
            name: '이상',
            type: 'pictorialBar',
            symbolSize: [barWidth, 10],
            symbolOffset: [10, 0],
            z: 12,
            color: 'rgba(255, 223, 41, 0.4)',
            symbolRotate: 90,
            data: [
                {
                    name: '',
                    value: '100',
                     symbolPosition: 'end'
                },
            
            ],
        },
         {
            name: '이상',
            type: 'pictorialBar',
             symbolRotate:90,
            symbolSize: [barWidth, 10],
            symbolOffset: [10, 0],
            z: 20,
            zlevel:20,
            color: '#ffc241',

            data: [
                {
                    name: '',
                    value: normalPer,
                    symbolPosition: 'end',
                },
            
            ],
        },
        // 头
        {
            name: '정상',
            type: 'effectScatter',
            rippleEffect: {
                period: 1,
                scale: 4,
                brushType: 'fill',
            },
            symbolRotate:90,
            z: 20,
            zlevel: 3,
            symbolPosition: 'end',
            // symbol: path,
            symbolSize: [10, 4],
            symbolOffset: [0],
            itemStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, .3)',
                    shadowBlur: 5,
                    shadowOffsetY: 3,
                    shadowOffsetX: 0,
                    color: 'rgba(85, 201, 255, 0.8)',
                },
            },
            data: [
                {
                    name: '',
                    value: 0,
                    symbolPosition: 'end',
                },
            ],
        },
        {
            name: '이상',
            type: 'effectScatter',
            rippleEffect: {
                period: 1,
                scale: 4,
                brushType: 'fill',
            },
             symbolRotate:90,
            z: 20,
            zlevel: 2,
            symbolPosition: 'end',
            // symbol: path,
            symbolSize: [10, 4],
            symbolOffset: [0, 0],
            itemStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, .3)',
                    shadowBlur: 5,
                    shadowOffsetY: 3,
                    shadowOffsetX: 0,
                    color: 'rgba(255, 223, 41, 0.8)',
                },
            },
            data: [
                {
                    name: '',
                    value: 100,
                    symbolPosition: 'end',
                },
            ],
        },
    ],
};

        return { option , title ,normal, err, normalPer, errPer};
    },
});
</script>
