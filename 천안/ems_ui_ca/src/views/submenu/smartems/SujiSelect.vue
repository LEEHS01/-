<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">송수펌프 제어 트렌드</span>
      <div class="title_line"></div>
    </div>
    <div class="frst_Area">
      <span class="fL">
        <div class="date_design">
          <select class="drop-down" v-model="selectedDateMode" @change="changeDateMode">
            <option v-for="(dateMode, idx) in dateModeList" :key="idx" :value="dateMode.value">
              {{dateMode.text}}
            </option>
          </select>
        </div>
      </span>
      <span class="fL calArea">
        <div class="date_design DateTime">
          <CalendarFormat :calendarMode=selectedDateMode @changeDate="changeStartDate" />
        </div>
      </span>
      <span class="fL calArea">
        <div class="date_design DateTime">
          <CalendarFormat :calendarMode=selectedDateMode @changeDate="changeEndDate" />
        </div>
      </span>
      <span class="fL">
        <div class="date_design DateTime">
          <select class="drop-down" v-model="selectedSuji">
            <option v-for="(suji, idx) in sujiList" :key="idx" :value="suji">
              {{suji}}
            </option>
          </select>
        </div>
      </span>
      <span class="buttonArea fL" @click="search">
        <span class="button"> 조회 </span>
      </span>
    </div>
    <div class="itemsWrap1 fL" style="width: 59%; height: calc(100% - 130px);">
      <div class="div-big fL" style="margin-right: 10px; background-image: none">
        <div style="margin-right: 10px; background-image: none;"></div>
        <!-- chart w, h -->
        <div ref="chart1Ref" class="chartArea" style="height: calc(100% / 6)"></div>
        <div ref="chart2Ref" class="chartArea" style="height: calc(100% / 6)"></div>
        <div ref="chart3Ref" class="chartArea" style="height: calc(100% / 6)"></div>
        <div ref="chart4Ref" class="chartArea" style="height: calc(100% / 6)"></div>
        <div ref="chart5Ref" class="chartArea" style="height: calc(100% / 6)"></div>
        <div ref="chart6Ref" class="chartArea" style="height: calc(100% / 6)"></div>
      </div>
    </div>
    <div class="itemsWrap1 fL" style="width: 40%; height: calc(100% - 130px);">
      <div class="margin-left3 sub_bottom_left">
        <div class="div_title">주요 인자 순시값</div>
        <div class="table_bg_right">
          <div style="width: 88%; height: calc(98% - 80px); padding: 5% 6%;">
            <div class="scan_line scanning"></div>
            <div class="spend_text_wrap">
              <span class="spend_tagname">배수지 수위</span>
              <span class="spend_value">{{ formattedData.수위 }}</span>
              <span class="spend_unit">m</span>
            </div>
            <div class="spend_text_wrap">
              <span class="spend_tagname">배수지 유입 유량</span>
              <span class="spend_value">{{ formattedData.유입유량 }}</span>
              <span class="spend_unit">m3</span>
            </div>
            <div class="spend_text_wrap">
              <span class="spend_tagname">배수지 유입 밸브 상태</span>
              <span class="spend_value">{{ formattedData.밸브상태 }}</span>
              <span class="spend_unit"></span>
            </div>
            <div class="spend_text_wrap">
              <span class="spend_tagname">송수 펌프 유출 유량</span>
              <span class="spend_value">{{ formattedData.유출유량 }}</span>
              <span class="spend_unit">m3</span>
            </div>
            <div class="spend_text_wrap">
              <span class="spend_tagname">정속 펌프 토출 관압</span>
              <span class="spend_value">{{ formattedData.정속토출관압 }}</span>
              <span class="spend_unit">kg/cm2</span>
            </div>
            <div class="spend_text_wrap">
              <span class="spend_tagname">정속 펌프 가동 대수</span>
              <span class="spend_value">{{ formattedData.정속가동대수 }}</span>
              <span class="spend_unit">대</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { nc, commaFont, groupBy } from '@/utils/utils.js'
import CalendarFormat from '@/components/common/CalendarFormat.vue'
import moment from 'moment'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

export default {
  components: {
    CalendarFormat
  },
  setup (props, { emit }) {
    let dataList = []
    const chart1Ref = ref(null)
    const chart2Ref = ref(null)
    const chart3Ref = ref(null)
    const chart4Ref = ref(null)
    const chart5Ref = ref(null)
    const chart6Ref = ref(null)
    const plotLayout = {
      height: 124,
      legend: { font: { color: '#FFF' } },
      showlegend: false,
      margin: { t: 30, l: 80, r: 80, b: 20 },
      modebar: { activecolor: 'blue' },
      hovermode: 'x',
      plot_bgcolor: 'transparent',
      paper_bgcolor: 'transparent',
      xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M' },
      yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
      font: { family: 'KHNPHDRegular' }
    }

    const sujiData = [
      {
        TNK_GRP_NM: '광덕면',
        PMP_GRP_NM: '천안'
      },
      {
        TNK_GRP_NM: '소정1',
        PMP_GRP_NM: '천안'
      },
      {
        TNK_GRP_NM: '소정2',
        PMP_GRP_NM: '천안'
      },
      {
        TNK_GRP_NM: '풍세산단(생활)',
        PMP_GRP_NM: '천안'
      },
      {
        TNK_GRP_NM: '목천(신)',
        PMP_GRP_NM: '천안'
      },
      {
        TNK_GRP_NM: '목천(구)',
        PMP_GRP_NM: '목천'
      },
      {
        TNK_GRP_NM: '독립기념관',
        PMP_GRP_NM: '목천'
      }
    ]
    const dateModeData = [
      { text: '시', value: 'h' },
      { text: '일', value: 'd' },
      { text: '월', value: 'm' },
      { text: '년', value: 'y' }
    ]

    const initialFormattedData = {
      수위: '',
      유입유량: '',
      밸브상태: '',
      유출유량: '',
      정속토출관압: '',
      정속가동대수: ''
    }

    const formattedData = ref(initialFormattedData)

    const sujiList = ref([])
    const selectedSuji = ref(sujiData[0].TNK_GRP_NM)
    const getSujiList = () => {
      for (const suji of sujiData) {
        sujiList.value.push(suji.TNK_GRP_NM)
      }
    }

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
      // console.log('startDate:' + date)
    }

    const changeEndDate = (date) => {
      endDate = date
      // console.log('endDate:' + date)
    }

    // chart method
    const search = async () => {
      try {
        emit('update:isLoading', true)
        const param = {
          search: null,
          search2: selectedSuji.value,
          search3: selectedDateMode.value,
          search4: null
        }
        if (selectedDateMode.value === 'h' || selectedDateMode.value === 'd') {
          param.search = moment(startDate).format('YYYY-MM-DD')
          param.search4 = moment(endDate).format('YYYY-MM-DD')
        } else if (selectedDateMode.value === 'm') {
          param.search = moment(startDate).format('YYYY-MM')
          param.search4 = moment(endDate).format('YYYY-MM')
        } else if (selectedDateMode.value === 'y') {
          param.search = moment(startDate).format('YYYY')
          param.search4 = moment(endDate).format('YYYY')
        }

        await store.dispatch('sujiSelect/fetchSelect', param)
        searchResult()
      } catch (err) {
        log.logError(err.message);
      } finally {
        emit('update:isLoading', false)
      }
    }

    const searchResult = () => {
      let result = []
      let data1 = []
      let data2 = []
      let data3A = []
      let data3B = []
      let data4 = []
      let data5 = []
      let data6 = []
      let data7 = []
      dataList = []
      result = JSON.parse(JSON.stringify(selectData.value))
      if (result != null && result.length !== 0) {
        data1 = result.data1
        data2 = result.data2
        data3A = result.data3_1
        data3B = result.data3_2
        data4 = result.data4
        data5 = result.data5
        data6 = result.data6
        data7 = result.data7
      }
      dataList.push(data1)
      dataList.push(data2)
      dataList.push(data3A)
      dataList.push(data3B)
      dataList.push(data4)
      dataList.push(data5)
      LineChart(data1, data2, data3A, data3B, data4, data5, data6)
      htmlRight(data7[0])
    }

    const htmlRight = (data) => {
      try {
        formattedData.value = { ...initialFormattedData }
        if (nc(data['수위'])) {
          formattedData.value.수위 = commaFont(Number(data['수위']).toFixed(2))
        }
        formattedData.value.유입유량 = data['유입유량']
        formattedData.value.밸브상태 = commaFont(Number(data['밸브상태']).toFixed(0))
        formattedData.value.유출유량 = data['유출유량']
        formattedData.value.정속토출관압 = commaFont(Number(data['정속토출관압']).toFixed(2))
        formattedData.value.정속가동대수 = data['정속가동대수']
      } catch (err) {
        log.logError(err.message);
      }
    }

    // Line Chart func
    const LineChart = (data1, data2, data3A, data3B, data4, data5, data6) => {
      let x = []
      let y = []
      let chartData = []
      for (let i = 0; i < data1.length; i++) {
        x.push(data1[i].ts)
        y.push(data1[i].value)
      }
      chartData.push({ fill: 'tozeroy', mode: 'lines', name: '', x: x, y: y, visible: true, line: { shape: 'spline' } })

      // plotLayout 설정
      plotLayout.yaxis.title = 'm'
      plotLayout.title = {
        text: '배수지 수위',
        font: {
          family: 'KHNPHDRegular',
          size: 10,
          color: '#b8e3c5'
        },
        pad: { b: 0, l: 0, r: 0, t: 0 }
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

      Plotly.newPlot(chart1Ref.value, chartData, plotLayout)
      // -----------1번 차트------------
      x = []; y = []
      chartData = []
      for (let i = 0; i < data2.length; i++) {
        x.push(data2[i].ts)
        y.push(data2[i].value)
      }
      chartData.push({ fill: 'tozeroy', mode: 'lines', name: '', x: x, y: y, visible: true, line: { shape: 'spline' } })
      plotLayout.title = {
        text: '배수지 유입유량',
        font: {
          family: 'KHNPHDRegular',
          size: 10,
          color: '#b8e3c5'
        }
      }
      plotLayout.yaxis.title = 'm3'
      Plotly.newPlot(chart2Ref.value, chartData, plotLayout)
      // -----------2번 차트------------
      x = []; y = []
      chartData = []
      for (let i = 0; i < data3A.length; i++) {
        if (data3A[i].value === '0' && data3B[i].value === '0') {
          y.push(50)
        } else if (data3A[i].value === '0' && data3B[i].value === '1') {
          y.push(0)
        } else {
          y.push(100)
        }
        x.push(data3A[i].ts)
      }
      chartData.push({ fill: 'tozeroy', mode: 'lines', name: '', x: x, y: y, visible: true, line: { shape: 'spline' } })
      plotLayout.title = {
        text: '배수지 유입밸브 상태 (0: Full Close, 50: half, 100: Full Open)',
        font: {
          family: 'KHNPHDRegular',
          size: 10,
          color: '#b8e3c5'
        }
      }
      plotLayout.yaxis.title = ''
      Plotly.newPlot(chart3Ref.value, chartData, plotLayout)
      // ----------3번 차트--------------
      x = []; y = []
      chartData = []
      for (let i = 0; i < data4.length; i++) {
        x.push(data4[i].ts)
        y.push(data4[i].value)
      }

      chartData.push({ fill: 'tozeroy', mode: 'lines', name: '', x: x, y: y, visible: true, line: { shape: 'spline' } })
      plotLayout.yaxis.title = 'm3'
      plotLayout.title = {
        text: '송수펌프 유출유량',
        font: {
          family: 'KHNPHDRegular',
          size: 10,
          color: '#b8e3c5'
        }
      }
      Plotly.newPlot(chart4Ref.value, chartData, plotLayout)
      // ----------4번 차트------------
      x = []; y = []
      chartData = []
      for (let i = 0; i < data5.length; i++) {
        x.push(data5[i].ts)
        y.push(data5[i].value)
      }

      chartData.push({ fill: 'tozeroy', mode: 'lines', name: '', x: x, y: y, visible: true, line: { shape: 'spline' } })
      plotLayout.yaxis.title = ''
      plotLayout.title = {
        text: '정속 펌프 토출 관압',
        font: {
          family: 'KHNPHDRegular',
          size: 10,
          color: '#b8e3c5'
        }
      }

      plotLayout.yaxis.title = 'kg/cm2'
      Plotly.newPlot(chart5Ref.value, chartData, plotLayout)
      // -----------5번 차트----------------
      data6 = groupBy(data6, 'ts')
      x = []; y = []
      chartData = []
      for (const i in data6) {
        x.push(i)
        let sum = 0
        for (let j = 0; j < data6[i].length; j++) {
          if (data6[i][j].tagname === '881-355-PMB-4111') { // gelix_lsj 임시 tagname 사용, 추후 확정 필요
            data6[i][j].value = Number(data6[i][j].value) * 0.5
          }
          sum += Number(data6[i][j].value)
        }
        y.push(sum)
      }

      chartData.push({ fill: 'tozeroy', mode: 'lines', name: '', x: x, y: y, visible: true, line: { shape: 'spline' } })
      plotLayout.yaxis.title = ''
      plotLayout.title = {
        text: '정속 펌프대수',
        font: {
          family: 'KHNPHDRegular',
          size: 10,
          color: '#b8e3c5'
        }
      }
      plotLayout.yaxis.title = '대'
      Plotly.newPlot(chart6Ref.value, chartData, plotLayout)
      // -------6번 차트--------------
    }

    const store = useStore()
    const selectData = computed(() => store.getters['sujiSelect/getSelect'])

    onMounted(() => {
      getSujiList()
      getDateModeList()
      // 페이지 진입 시 오늘 날짜로 조회
      search()
    })

    return {
      chart1Ref,
      chart2Ref,
      chart3Ref,
      chart4Ref,
      chart5Ref,
      chart6Ref,
      plotLayout,
      dataList,
      sujiList,
      selectedSuji,
      dateModeList,
      selectedDateMode,
      selectData,
      formattedData,
      changeDateMode,
      changeStartDate,
      changeEndDate,
      search,
      searchResult,
      LineChart
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
  background-image: url('@/assets/img/design_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
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

.table_bg_right {
  height: calc(80% - 40px);
  width: 100%;
  background: url('@/assets/img/analysis/table_bg_02.png') no-repeat;
  background-position: center;
  background-size: 100% 100%;
  color: #fff;
  font-family: 'KHNPHDRegular';
  font-size: 18px;
}

.frst_Area {
  display: flex;
  align-items: center;
  width: 54.3%;
  height: 40px;
  margin-top: 20px;
  justify-content: flex-end;
}

.itemsWrap1 {
  width: 100%;
  float: left;
  margin: 5px 0 0 0;
}

.sub_bottom_left {
  width: 100%;
  height: 99%;
  background: url('@/assets/img/cost_spring.png') no-repeat;
  background-position: bottom;
}

.margin-left3 {
  margin-left: 3%;
}

.spend_text_wrap {
  width: 100%;
  height: 17%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spend_tagname {
  width: 45%;
}

.spend_value {
  width: 15%;
  font-family: 'LAB디지털';
  font-size: 20px;
  text-align: right;
}

.spend_unit {
  width: 10%;
  margin-left: 10px;
  text-align: left;
  text-shadow: 0 0 9px #5cafff;
  color: #c3eaff;
}
</style>
