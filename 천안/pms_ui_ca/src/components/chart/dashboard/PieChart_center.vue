<template>
    <div>
    <v-chart class="piechart" :option="option" autoresize id="echart"/>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import VChart, { THEME_KEY } from 'vue-echarts';
import { defineComponent, watch } from 'vue';
import { useStore } from "vuex";


export default defineComponent({
    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: 'dark',
    },
    setup() {
        const store = useStore();
        let normalValue = store.state.process.map(data => {
            if(data.selected){
                return data.normal;
            }
        }).filter(x => x !== undefined)
        let errValue = store.state.process.map(data => {
            if(data.selected){
                return data.err;
            }
        }).filter(x => x !== undefined)

        watch(store.state.process, () => {
        //    normalValue = store.state.process.map(data => {
        //     if(data.selected){
        //         return data.normal;
        //     }
        // }).filter(x => x !== undefined)
        // errValue = store.state.process.map(data => {
        //     if(data.selected){
        //         return data.err;
        //     }
        // }).filter(x => x !== undefined)
        store.getters.normalValue;
        store.getters.errValue;
        })
        

        let trafficWay = [
            {
                name: '정상',
                value: normalValue,
            },
            {
                name: '이상',
                value: errValue,
            },
        ];

        let data = [];
        const color = [new echarts.graphic.LinearGradient(
                    0, 1, 0, 0,
                    [{
                            offset: 0,
                            color: '#9E98FC'
                        },
                        {
                            offset: 0.3,
                            color: '#4386FA'
                        },
                        {
                            offset: 0.4,
                            color: '#389AF3'
                        },
                        {
                            offset: 0.65,
                            color: '#22C7E6'
                        },
                        {
                            offset: 0.75,
                            color: '#3BA2ED'
                        },
                        {
                            offset: 0.9,
                            color: '#567DF4'
                        },
                         {
                            offset: 1,
                            color: '#567DF4'
                        }
                    ]
                ), new echarts.graphic.LinearGradient(
                    0, 1, 0, 0,
                    [{
                            offset: 0,
                            color: '#FF075B'
                        },
                        {
                            offset: 1,
                            color: '#D52350'
                        }
                    ]
                )];

             

        for (var i = 0; i < trafficWay.length; i++) {
            data.push({
                value: trafficWay[i].value,
                name: trafficWay[i].name,
                itemStyle: {
                    normal: {
                        color: color[i],
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
        legend:{
            show:false,
            right:0,
            top:0,
            orient: 'vertical',
            itemHeight: 6,
             textStyle:{
                color: '#fff',
                fontSize: 10
            }
        },
    series: [
        {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['50%', '75%'],
            hoverAnimation: false,
            data: [{
                value: store.getters.normalValue,
                name: '정상',
                itemStyle: {
                    normal: {
                        color: color[0],
                    },
                },
            },
            {
                value: store.getters.errValue,
                name: '이상',
                itemStyle: {
                    normal: {
                        color: color[1],
                    },
                },
            }],
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
                                for (var i = 0; i < trafficWay.length; i++) {
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
                            }
                             },
                             labelLine: {
                            length: 20,
                            length2: 40,
                            show: true,
                            lineStyle:{
                                width:1,
                            }
                        },
                           
                    }
            }
        },
    ],
};


        return { option,store };
    },
});
</script>
