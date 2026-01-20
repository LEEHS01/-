<template>
    <div class="chart">
        <v-chart class="scatterchart" :option="option" autoresize />
    </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';
import bgData from '@/assets/data/SSN.json';

export default {
    props: ['data', 'flow_rate', 'pressure', 'color'],
    setup(props) {
        let dataLevel1 = [];
        let dataLevel2 = [];

        let level1CntP = bgData['Q_1'].length;
        for (let i = 0; i < level1CntP; i++) {
            if (i % 20 == 0) {
                let x = bgData['Q_1'][i];
                let y = bgData['P_1'][i];
                let l_arr = [x, y];
                dataLevel1.push(l_arr);
            }
        }
        let level2CntP = bgData['Q_2'].length;
        for (let i = 0; i < level2CntP; i++) {
            if (i % 20 == 0) {
                let x = bgData['Q_2'][i];
                let y = bgData['P_2'][i];
                let l_arr = [x, y];
                dataLevel2.push(l_arr);
            }
        }

        let dataLevel1_95 = [];
        let dataLevel1_90 = [];
        let dataLevel1_80 = [];
        let dataLevel1_70 = [];
        let dataLevel2_95 = [];
        let dataLevel2_90 = [];
        let dataLevel2_80 = [];
        let dataLevel2_70 = [];

        let level1Cnt = bgData['x_95_1'].length;
        for (let i = 0; i < level1Cnt; i++) {
            dataLevel1_95.push([bgData['x_95_1'][i], bgData['y_95_1'][i]]);
            dataLevel1_90.push([bgData['x_90_1'][i], bgData['y_90_1'][i]]);
            dataLevel1_80.push([bgData['x_80_1'][i], bgData['y_80_1'][i]]);
            dataLevel1_70.push([bgData['x_70_1'][i], bgData['y_70_1'][i]]);
        }
        let level2Cnt = bgData['x_95_2'].length;
        for (let i = 0; i < level2Cnt; i++) {
            dataLevel2_95.push([bgData['x_95_2'][i], bgData['y_95_2'][i]]);
            dataLevel2_90.push([bgData['x_90_2'][i], bgData['y_90_2'][i]]);
            dataLevel2_80.push([bgData['x_80_2'][i], bgData['y_80_2'][i]]);
            dataLevel2_70.push([bgData['x_70_2'][i], bgData['y_70_2'][i]]);
        }

        const colorSetting = (val) => {
            if (val === 1) return '#ff9100';
            if (val === 2) return '#47ff51';
            if (val === 3) return '#0048ff';
        };

        const state = reactive({
            flow_rate: computed(() => props.flow_rate),
            pressure: computed(() => props.pressure),
            data: computed(() => props.data),
            color: computed(() => props.color),
        });

        watch(state, () => {
            // console.log('state.color :: ' + state.color);
            if (state.data) {
              option.series[10].data = state.data;
              option.series[11].data =
                  state.data.length === 0
                      ? []
                      : [state.data[state.data.length - 1]];
              option.series[11].itemStyle.color = colorSetting(state.color);
              // option.series[0].data = state.flow_rate;
              // option.series[1].data = state.pressure;
            }
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
                    name: 'data',
                    data: dataLevel1,
                    type: 'scatter',
                    symbolSize: 1,
                    itemStyle: {
                        color: '#911F2722',
                    },
                    large: true,
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: 'data',
                    data: dataLevel2,
                    type: 'scatter',
                    symbolSize: 1,
                    itemStyle: {
                        color: '#05505222',
                    },
                    large: true,
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: '',
                    data: dataLevel1_95,
                    // data: [
                    // 	[-11.25606333903737, 5.7310041759318855],
                    // 	[12.410229134821885, -6.316952550564456]
                    // ],
                    showSymbol: false,
                    smooth: true,
                    type: 'line',
                    lineStyle: {
                        width: 1,
                        // color: 'rgba(64, 176, 235, 1)',
                        // color: '#ff0000',
                        color: '#911F27',
                    },
                    areaStyle: {
                        // color: '#ff000022',
                        color: '#911F2722',
                        opacity: 1,
                    },
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: '',
                    data: dataLevel2_95,
                    showSymbol: false,
                    smooth: true,
                    type: 'line',
                    lineStyle: {
                        width: 1,
                        color: '#055052',
                    },
                    areaStyle: {
                        color: '#05505222',
                        opacity: 1,
                    },
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: '',
                    data: dataLevel1_90,
                    showSymbol: false,
                    smooth: true,
                    type: 'line',
                    lineStyle: {
                        width: 1,
                        // color: 'rgba(64, 176, 235, 1)',
                        // color: '#ff0000',
                        color: '#911F27',
                    },
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: '',
                    data: dataLevel2_90,
                    showSymbol: false,
                    smooth: true,
                    type: 'line',
                    lineStyle: {
                        width: 1,
                        color: '#055052',
                    },
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: '',
                    data: dataLevel1_80,
                    showSymbol: false,
                    smooth: true,
                    type: 'line',
                    lineStyle: {
                        width: 1,
                        // color: 'rgba(64, 176, 235, 1)',
                        // color: '#ff0000',
                        color: '#911F27',
                    },
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: '',
                    data: dataLevel2_80,
                    showSymbol: false,
                    smooth: true,
                    type: 'line',
                    lineStyle: {
                        width: 1,
                        color: '#055052',
                    },
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: '',
                    data: dataLevel1_70,
                    showSymbol: false,
                    smooth: true,
                    type: 'line',
                    lineStyle: {
                        width: 1,
                        // color: 'rgba(64, 176, 235, 1)',
                        // color: '#ff0000',
                        color: '#911F27',
                    },
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: '',
                    data: dataLevel2_70,
                    showSymbol: false,
                    smooth: true,
                    type: 'line',
                    lineStyle: {
                        width: 1,
                        color: '#055052',
                    },
                    tooltip: {
                        show: false,
                    },
                    animation: false,
                },
                {
                    name: 'value',
                    data: state.data,
                    type: 'scatter',
                    symbolSize: 1,
                    itemStyle: {
                        color: '#04E0F3',
                    },
                    large: true,
                    tooltip: {
                        formatter() {
                            return '';
                        },
                    },
                    animation: false,
                },
                {
                    name: 'value2',
                    data: [],
                    type: 'scatter',
                    symbolSize: 10,
                    itemStyle: {
                        color: colorSetting(state.color),
                        opacity: 1,
                    },
                    tooltip: {
                        formatter() {
                            return '';
                        },
                    },
                    animation: false,
                },
            ],
        });

        return { option };
    },
};
</script>
