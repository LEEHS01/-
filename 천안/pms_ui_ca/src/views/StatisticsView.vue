<template>
    <div class="monitor-20">
        
        <Header class="header" />
        <div class="main_title">종합 구성 및 알람 현황</div>
        <div class="content">
            <div class="content-top">
                <div class="chart_area1">
                    <div class="header">설비별 상태 현황</div>
                    <div>
                        <span style="font-size: small;">정상 댓수: {{facStactisNormal}} 대 / </span>
                        <span style="font-size: small;">이상: {{facStactisAbNormal}} 대</span>
                    </div>
                    <div ref="donutRef"></div>
                </div>
                <div class="chart_area2">
                    <div class="header">진단별 상태 현황</div>
                    <div>
                        <span style="font-size: small;">진단 횟수: {{diagStatisticsCnt}} 건 / </span>
                        <span style="font-size: small;">정상: {{diagStatisticsNormal}} 건 / </span>
                        <span style="font-size: small;">알람: {{diagStatisticsAbNormal}} 건</span>
                    </div>
                    <div ref="donutRef2"></div>
                </div>
                <div class="chart_area3">
                    <div class="header">결함별 알람 현황</div>
                    <div ref="barRef"></div>
                </div>
                <div class="chart_area4">
                    <div class="header">주간 알람 추이 현황</div>
                    <div ref="barRef2"></div>
                </div>
            </div>
            <div class="content-bottom">
                <div class="main_title">알람 테이블</div>
                <div class="calender-container">
                    <div class="search">
                        <input
                            @click="state.datePop"
                            readonly
                            :value="state.startStr"
                        />
                        <span>~</span>
                        <input @click="state.datePop" readonly :value="state.endStr" />
                        <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                            v-model="state.datePop"
                        >
                            <q-date v-model="state.date" range mask="YYYY-MM-DD" @range-end="updateInputDate">
                                <div class="row items-center justify-end"></div>
                            </q-date>
                        </q-popup-proxy>
                    </div>
                    <button class="button" @click="searchDate">Search</button>
                </div>
                <div class="row-name">
                    <span>시간</span>
                    <span >설비명</span>
                    <span>설비정보</span>
                    <span>진단상태</span>
                    <span>알람상태</span>
                </div>
                <div class="alarm-content-container">
                    <div class="alarm-content" 
                        v-for="(alarm) 
                        in store.state.monitor20.alarmListData" 
                        :key="alarm.id"
                    >
                        <div class="alarm-row-name">
                            <span>{{alarm.DATE}}</span>
                            <span>{{alarm.hogi}}</span>
                            <span>{{alarm.gbn}}</span>
                            <span>{{alarm.alarm_types}}</span>
                            <span>{{alarm.alarm_status}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { useStore } from 'vuex';
import Header from '@/components/menu/Header.vue';
import { onMounted, reactive, ref } from 'vue';
import moment from 'moment';
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

// import axios from 'axios';
// import Scatter from '@/components/chart/monitoring/Scatter_PTK.vue';
// import Scatter2 from '@/components/chart/monitoring/Scatter_SSN.vue';
export default {
    components: {
        Header

        // Scatter,
        // Scatter2,
        // Linechart2,
    },
    setup() {
        const store = useStore();
        // const route = useRoute();
        const visibleToggle = () => {
            store.state.alertVisible = !store.state.alertVisible;
        };

        const donutRef = ref(null)
        const donutRef2 = ref(null)
        const barRef = ref(null)
        const barRef2 = ref(null)
        const facStactisNormal = ref(0)
        const facStactisAbNormal = ref(0)
        const diagStatisticsCnt = ref(0)
        const diagStatisticsNormal = ref(0)
        const diagStatisticsAbNormal = ref(0)

        const chartColor = ['#6D5495', '#a866ad', '#846EFF', '#C2AFFF', '#EF5656', '#EA6464', '#4931D3', '#9C98B2', '#3B0A89', '#B64B8D', '#9922AF', '#490755']
        
        const donutChart = () => {
            // console.log(store.state.monitor20)
            const data = store.state.monitor20.facStatisticsData
            try {
                const values = [parseInt(data[0].normal), parseInt(data[0].abnormal)]
                facStactisNormal.value = parseInt(data[0].normal)
                facStactisAbNormal.value = parseInt(data[0].abnormal)
                const labels = ['정상', '비정상']

                const pieData = [{
                values: values,
                labels: labels,
                marker: {
                    colors: chartColor
                },
                hole: 0.4,
                type: 'pie',
                hoverinfo: 'label+percent',
                textfont: { family: 'KHNPHDRegular', color: '#FFF' }
                }]

                const pieLayout = {
                legend: { font: { color: '#FFF' } },
                showlegend: true,
                height: 270,
                width : 300,
                margin: { t: 40, l: 40, r: 40, b: 70 },
                plot_bgcolor: 'transparent',
                paper_bgcolor: 'transparent',
                font: { family: 'KHNPHDRegular' }
                }

                Plotly.newPlot(donutRef.value, pieData, pieLayout)
            } catch (err) {
                log.logError(err.message);
            }
        }

        const donutChart2 = () => {
            const data = store.state.monitor20.diagStatisticsData
            try {
                const values = [parseInt(data[0].normal), parseInt(data[0].abnormal)]
                diagStatisticsCnt.value =  parseInt(data[0].tot_cnt)
                diagStatisticsNormal.value =  parseInt(data[0].normal)
                diagStatisticsAbNormal.value =  parseInt(data[0].abnormal)
                const labels = ['정상', '알람']

                const pieData = [{
                values: values,
                labels: labels,
                marker: {
                    colors: chartColor
                },
                hole: 0.4,
                type: 'pie',
                hoverinfo: 'label+percent',
                textfont: { family: 'KHNPHDRegular', color: '#FFF' }
                }]

                const pieLayout = {
                legend: { font: { color: '#FFF' } },
                showlegend: true,
                height: 270,
                width : 300,
                margin: { t: 40, l: 40, r: 40, b: 70 },
                plot_bgcolor: 'transparent',
                paper_bgcolor: 'transparent',
                font: { family: 'KHNPHDRegular' }
                }

                Plotly.newPlot(donutRef2.value, pieData, pieLayout)
            } catch (err) {
                log.logError(err.message);
            }
        }

        const barChart = () => {
            const data = store.state.monitor20.defectAlarmAllData;  // 첫 번째 데이터만 사용
            try {
                const values = [];
                const labels = [];
                
                // 텍스트를 지정한 길이로 나누는 함수
                const wrapText = (text, maxLength) => {
                    if (text.length <= maxLength) return text;
                    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
                    return text.match(regex).join('<br>');  // Plotly에서 줄 바꿈은 <br>로 처리
                };

                data.forEach(item => {
                    let label = item.key.replace('알람', '');  // "알람" 글자를 제거
                    label = wrapText(label, 6);  // 10자를 기준으로 줄 바꿈
                    labels.push(label);
                    values.push(parseInt(item.value));
                });

                const barData = [{
                    x: labels,
                    y: values,
                    type: 'bar',
                    marker: {
                        color: '#EF5656',
                        width: 0.1
                    },
                    orientation: 'v'
                }];

                const barLayout = {
                    height: 270,
                    width: 430,
                    margin: { t: 10, l: 70, r: 70, b: 60 },
                    legend: { font: { color: '#FFF' } },
                    plot_bgcolor: 'transparent',
                    paper_bgcolor: 'transparent',
                    xaxis: { 
                        color: '#FFF', 
                        showline: true, 
                        showgrid: false,
                        tickmode: 'array',
                        tickvals: labels,
                        ticktext: labels.map(label => label.replace(/\s+/g, '<br>'))  // Plotly에서 줄 바꿈 처리
                    },
                    yaxis: { 
                        color: '#FFF', 
                        showline: true, 
                        showgrid: false, 
                        fixedrange: false, 
                        exponentformat: 'none' 
                    },
                    font: { family: 'KHNPHDRegular' },
                    bargap: 0.8,
                    bargroupgap: 0.2
                };

                Plotly.newPlot(barRef.value, barData, barLayout);
            } catch (err) {
                log.logError(err.message);
            }
        }

        const barChart2 = () => {

            const data = store.state.monitor20.weeklyAlarmData
            try {
                const values = []
                const labels = []
                for (let i = 0; i < data.length; i++) {
                values.push(data[i].broken_cnt)
                labels.push(data[i].date)
                
                }

                const barData = [
                    {
                        x: labels,
                        y: values,
                        type: 'scatter',  // 'line'이 아닌 'scatter'로 설정
                        mode: 'lines+markers',  // 선과 마커를 모두 표시
                        marker: {
                            color: '#EF5656',
                            size: 8  // 마커 크기 설정
                        },
                        line: {
                            color: '#EF5656',
                            width: 1.0
                        },
                        orientation: 'v'
                    }
                ];

                const barLayout = {
                height: 270,
                width: 730,
                margin: { t: 10, l: 70, r: 70, b: 60 },
                legend: { font: { color: '#FFF' } },
                plot_bgcolor: 'transparent',
                paper_bgcolor: 'transparent',
                xaxis: { color: '#FFF', showline: true, showgrid: false, tickvals: labels,  ticktext: labels},
                yaxis: { color: '#FFF', showline: true, showgrid: false, fixedrange: false, exponentformat: 'none' },
                font: { family: 'KHNPHDRegular' },
                bargap: 0.8,
                bargroupgap:0.2
                }

                Plotly.newPlot(barRef2.value, barData, barLayout)
            } catch (err) {
                log.logError(err.message);
            }
        }

        const state = reactive({
            datePop: false,
            date: {
                from: '',
                to: '',
            },
            startStr: '',
            endStr: '',
        })

        const todayDate = () => {
            state.date.from = store.state.monitor20.startDate.split(' ')[0];
            state.date.to = store.state.monitor20.endDate.split(' ')[0];
            state.startStr = state.date.from;
            state.endStr = state.date.to;
        };

        const updateInputDate = () => {
            if (state.date.from && state.date.to) {
                state.startStr = state.date.from;
                state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230921] from, to를 같은 날짜로 선택 시 처리
                state.startStr = state.date;
                state.endStr = state.date;
            }
        };

        const searchDate = () => {
            dateToNumber();
            store.dispatch('monitor20/fetchAlarmList');
        };

        const dateToNumber = () => {
            if (state.date.from && state.date.to) {
                store.state.monitor20.pickDate.from = Number(
                    state.date.from.replaceAll('-', '')
                );
                store.state.monitor20.pickDate.to = Number(
                    state.date.to.replaceAll('-', '')
                );
                state.startStr = state.date.from;
                state.endStr = state.date.to;
            } else if (state.date) {
              // [gelix_lsj_230921] from, to를 같은 날짜로 선택 시 처리
              store.state.monitor20.pickDate.from = Number(
                  state.date.replaceAll('-', '')
              );
              store.state.monitor20.pickDate.to = Number(
                  state.date.replaceAll('-', '')
              );
              state.startStr = state.date;
              state.endStr = state.date;
            }
        };

        onMounted(async () => {
            let isLocal = false;
            if (!isLocal) {
                let currentTime = new Date();
                // let currentTime = new Date('2023-03-14 00:00:00');
                let startDate = moment(
                    currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
                ).format('yyyy-MM-DD HH:mm:ss');
                let endDate = moment(currentTime.getTime()).format(
                    'yyyy-MM-DD HH:mm:ss'
                );
                store.state.monitor20.startDate = startDate;
                store.state.monitor20.endDate = endDate;
            }
            todayDate()
            dateToNumber()
            await store.dispatch('monitor20/fetchFacStatistics');
            await store.dispatch('monitor20/fetchDiagStatistics');
            await store.dispatch('monitor20/fetchDefectAlarmAll');
            await store.dispatch('monitor20/fetchWeeklyAlarm');
            await store.dispatch('monitor20/fetchAlarmList');
            // store.dispatch('monitor20/handleGraphData');
            // store.dispatch('monitor20/flowPressure');
            // store.dispatch('monitor20/distribution');
            donutChart()
            donutChart2()
            barChart()
            barChart2()
        });

        
        
        return {
            visibleToggle,
            updateInputDate,
            searchDate,
            state,
            store,
            donutRef,
            donutRef2,
            barRef,
            barRef2,
            facStactisNormal,
            facStactisAbNormal,
            diagStatisticsCnt,
            diagStatisticsNormal,
            diagStatisticsAbNormal
        };
    },
};
</script>

<style></style>
