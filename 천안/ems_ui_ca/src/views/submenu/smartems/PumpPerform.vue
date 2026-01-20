<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">송수펌프 가동이력</span>
      <div class="title_line"></div>
    </div>
    <div style="width: 98.6%; height: 40px">
      <span class="buttonArea" style="float: right" @click="search">
        <span class="button">조회 </span>
      </span>
      <span style="float: right" class="calArea">
        <div class="date_design DateTime">
          <CalendarFormat :calendarMode="selectedDateMode" @changeDate="changeEndDate" />
        </div>
      </span>
      <span style="float: right" class="calArea">
        <div class="date_design DateTime">
          <CalendarFormat :calendarMode="selectedDateMode" @changeDate="changeStartDate" />
        </div>
      </span>
      <span style="float: right">
        <div class="date_design">
          <select class="drop-down" v-model="selectedDateMode" @change="changeDateMode">
            <option v-for="(dateMode, idx) in dateModeList" :key="idx" :value="dateMode.value">
              {{ dateMode.text }}
            </option>
          </select>
        </div>
      </span>
    </div>
    <!-- 상자 부분 -->
    <div style="height: calc(100% - 90px); width: 100%">
      <div class="fL" style="width: 100%; height: 40%; margin-top: 10px">
        <template v-if="percentList && percentList.length > 0">
          <PerfomBox v-for="(item, index) in percentList" :key="index" :info="{ data: item, ratedData: ratedData[index] }" />
        </template>
        <!-- 데이터가 없을때 보여주기 위해서 이름만 설정해 놓은 box 디자인임 -->
        <template v-else>
          <PerfomBox2 :info="{ name: '천안정수장천안정펌프1', ratedData: ratedData[0] }" />
          <PerfomBox2 :info="{ name: '천안정수장천안정펌프2', ratedData: ratedData[1] }" />
          <PerfomBox2 :info="{ name: '천안정수장천안정펌프3', ratedData: ratedData[2] }" />
          <PerfomBox2 :info="{ name: '목천가압장목천펌프1', ratedData: ratedData[3] }" />
          <PerfomBox2 :info="{ name: '목천가압장목천펌프2', ratedData: ratedData[4] }" />
        </template>
      </div>
      <!-- 하단 부분 -->
      <div class="itemsWrap1 fL" style="width: 100%;">
        <div style="display: flex;">
            <div class="div_title title-text" style="margin-left: 1%;">펌프 전력/주파수 트렌드</div>
            <div class="div_title title-text" style="margin-left: 29%;">펌프 가동 트렌드</div>
        </div>
        <div class="div-middle fL" style="
            width: calc(50% - 10px);
            margin-right: 10px;
            background-image: none;
          ">
          <div ref="chart2Ref" class="items4ChartArea" style="height: 50%; margin-bottom: 5%;"></div>
          <div ref="chart3Ref" class="items4ChartArea" style="height: 50%"></div>
        </div>
        <div class="div-middle fL" style="width: calc(50% - 10px); background-image: none">
          <div ref="chart1Ref" class="items4ChartArea" style="height: 100%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import moment from 'moment'
import PerfomBox from '@/components/AI/pumpPerform/PumpPerformBox.vue'
import PerfomBox2 from '@/components/AI/pumpPerform/PumpPerformBoxEx.vue'
import CalendarFormat from '@/components/common/CalendarFormat.vue'
import { useStore } from 'vuex'
import Plotly from 'plotly.js/dist/plotly.js'
import { groupBy, unique } from '@/utils/utils.js'
import log from '@/logger.js'

export default {
  components: {
    CalendarFormat,
    PerfomBox,
    PerfomBox2
  },
  setup (props, { emit }) {
    const store = useStore()
    const chartColor = ['#6D5495', '#a866ad', '#846EFF', '#C2AFFF', '#EF5656', '#EA6464', '#4931D3', '#9C98B2', '#3B0A89', '#B64B8D', '#9922AF', '#490755']
    const dateModeData = [
      { text: '시', value: 'h' },
      { text: '일', value: 'd' },
      { text: '월', value: 'm' },
      { text: '년', value: 'y' }
    ]
    const percentList = ref([])
    const ratedData = ref([
      { pumpingHead: '67', flow: '2652' },
      { pumpingHead: '67', flow: '2652' },
      { pumpingHead: '67', flow: '2652' },
      { pumpingHead: '67', flow: '1080' },
      { pumpingHead: '67', flow: '1080' }
    ])
    const dateModeList = ref([])
    const selectedDateMode = ref(dateModeData[0].value)
    const getDateModeList = () => {
      for (const dateMode of dateModeData) {
        dateModeList.value.push(dateMode)
      }
    }

    let startDate = new Date()
    let endDate = new Date()

    const changeDateMode = () => {
      startDate = new Date()
      endDate = new Date()
    }

    const changeStartDate = (date) => {
      startDate = date
    }

    const changeEndDate = (date) => {
      endDate = date
    }

    const searchData = computed(() => store.getters['pumpPerform/getSearch'])

    const search = async () => {
      try {
        emit('update:isLoading', true)
        clearChartAndCanvas()
        const param = {
          search: null,
          search2: null,
          search4: selectedDateMode.value
        }
        param.search = moment(startDate).format('YYYY-MM-DD')
        param.search2 = moment(endDate).format('YYYY-MM-DD')
        await store.dispatch('pumpPerform/fetchPumpSearch', param)
        if (searchData.value) {
          const arr = JSON.parse(JSON.stringify(searchData.value))
          if (arr) {
            if (arr.data1.length > 0) {
              gauge(arr.data1)
              heatmapChart(arr.data1)
            }
            if (arr.data2.length > 0) {
              lineChart(arr.data2)
            }
            if (arr.data3.length > 0) {
              lineChart2(arr.data3)
            }
          } else {
            // console.log('no data')
          }
        }
      } catch (err) {
        log.logError(err.message);
      } finally {
        emit('update:isLoading', false)
      }
    }

    const clearChartAndCanvas = () => {
      // 퍼센트 박스 초기화
      percentList.value = []
      // 차트 초기화
      Plotly.purge(chart1Ref.value)
      Plotly.purge(chart2Ref.value)
      Plotly.purge(chart3Ref.value)
    }

    const chart1Ref = ref(null)
    const chart2Ref = ref(null)
    const chart3Ref = ref(null)

    const heatmapChart = async (data) => {
      try {
        let categories = []
        for (let i = 0; i < data.length; i++) {
          categories.push(data[i].ts)
        }
        categories = unique(categories)
        data = await groupBy(data, 'name')

        const z = []
        for (const i in data) {
          const value = data[i].map(item => {
            return item.value
          })
          z.push(value)
        }
        const colorscaleValue = [
          [0, 'transparent'],
          [0.5, '#3399CC'],
          [1, '#3366CC']
        ]

        const plotLayout = {
          height: 375,
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 20, l: 80, r: 80, b: 30 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M', tickfont: { size: 9 } },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true, tickfont: { size: 9 } },
          font: { family: 'KHNPHDRegular' }
        }
        const chartData = [{ ygap: 10, type: 'heatmap', z: z.reverse(), x: categories, y: Object.keys(data).reverse(), showscale: false, colorscale: colorscaleValue }]
        if (selectedDateMode.value === 'h') {
          plotLayout.xaxis.tickformat = '%Y-%m-%d %H:%M'
        } else if (selectedDateMode.value === 'd') {
          plotLayout.xaxis.tickformat = '%Y-%m-%d'
        } else if (selectedDateMode.value === 'm') {
          plotLayout.xaxis.tickformat = '%Y-%m'
        } else {
          plotLayout.xaxis.tickformat = '%Y'
        }
        Plotly.newPlot(chart1Ref.value, chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const lineChart = async (data) => {
      try {
        let categories = []
        for (let i = 0; i < data.length; i++) {
          categories.push(data[i].ts)
        }
        categories = unique(categories)
        data = await groupBy(data, 'name')

        let cnt = 0
        const chartData = []
        for (const i in data) {
          const value = []
          for (let j = 0; j < data[i].length; j++) {
            value.push(Number(data[i][j].value))
          }
          chartData.push({ fill: 'tozeroy', mode: 'lines', name: i, x: categories, y: value, visible: true, line: { shape: 'spline', color: chartColor[cnt] } })
          cnt++
        }

        const plotLayout = {
          height: 170,
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 20, l: 80, r: 80, b: 20 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M', tickfont: { size: 9 } },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }

        if (selectedDateMode.value === 'h') {
          plotLayout.xaxis.tickformat = '%Y-%m-%d %H:%M'
        } else if (selectedDateMode.value === 'd') {
          plotLayout.xaxis.tickformat = '%Y-%m-%d'
        } else if (selectedDateMode.value === 'm') {
          plotLayout.xaxis.tickformat = '%Y-%m'
        } else {
          plotLayout.xaxis.tickformat = '%Y'
        }
        plotLayout.yaxis.title = 'kWh'
        Plotly.newPlot(chart2Ref.value, chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const lineChart2 = async (data) => {
      try {
        let categories = []
        for (let i = 0; i < data.length; i++) {
          categories.push(data[i].ts)
        }
        categories = unique(categories)
        data = await groupBy(data, 'name')

        let cnt = 0
        const chartData = []
        for (const i in data) {
          const value = []
          for (let j = 0; j < data[i].length; j++) {
            value.push(Number(data[i][j].value))
          }
          chartData.push({ mode: 'lines', name: i, x: categories, y: value, visible: true, line: { shape: 'spline', color: chartColor[cnt] } })
          cnt++
        }

        const plotLayout = {
          height: 150,
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 10, l: 80, r: 80, b: 20 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M', tickfont: { size: 9 } },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }
        plotLayout.yaxis.title = 'Hz'
        if (selectedDateMode.value === 'h') {
          plotLayout.xaxis.tickformat = '%Y-%m-%d %H:%M'
        } else if (selectedDateMode.value === 'd') {
          plotLayout.xaxis.tickformat = '%Y-%m-%d'
        } else if (selectedDateMode.value === 'm') {
          plotLayout.xaxis.tickformat = '%Y-%m'
        } else {
          plotLayout.xaxis.tickformat = '%Y'
        }
        Plotly.newPlot(chart3Ref.value, chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }
    const gauge = async (data) => {
      try {
        data = await groupBy(data, 'name')
        const tempList = []
        for (const i in data) {
          let cnt = 0
          for (let j = 0; j < data[i].length; j++) {
            if (parseFloat(data[i][j].value) === 1) {
              cnt++
            }
          }
          tempList.push({ name: i, val: cnt / data[i].length })
        }
        percentList.value = tempList
      } catch (err) {
        log.logError(err.message);
      }
    }

    onMounted(() => {
      getDateModeList()
      search()
    })

    return {
      percentList,
      selectedDateMode,
      dateModeList,
      ratedData,
      chart1Ref,
      chart2Ref,
      chart3Ref,
      changeDateMode,
      changeStartDate,
      changeEndDate,
      search
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';

.contents-body {
  width: 100%;
  height: 100%;
  margin-left: 15px;
}

.drop-down {
  color: white;
  background-color: #15284e;
  border-color: #489cf2;
  width: 100%;
  height: 100%;
  font-family: 'KHNPHDRegular';
  font-size: 14px;
  padding: 4px 10px 4px 15px;
  border-radius: 4px;
}

.fL {
  float: left;
}

.title-text {
  width: 20%;
  margin-top: 1.5%;
  margin-bottom: 1%;
  text-align: center;
}
</style>
