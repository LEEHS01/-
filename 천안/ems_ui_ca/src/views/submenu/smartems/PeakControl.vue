<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">전력피크 분석</span>
      <div class="title_line"></div>
    </div>
    <div style="width: 100%; height: calc(100% - 50px);">
      <div class="detail_L_wrap fL" style="width: calc(35% - 15px);">
        <!-- detail-L -->
        <div class="div_left_area left_bg">
          <!-- top -->
          <div class="left_topbottom left_top_align ">
            <div class="text_title_base">
              <div class="text_title">
                <span class="text_title_font">총 순시 전력</span>
              </div>
              <div class="text_val">
                <span class="text_val_font">{{ totalPWI }}</span>
                <span class="text_val_unit">kW</span>
              </div>
            </div>
          </div>
          <!-- middle -->
          <div class="left_middle">
            <div class="middle_border"></div>
            <div class="left_div_center">
              <div class="left_arrow_img fL blinkingY_down"></div>
              <div class="fL" style="width: 22%;  height: 100%;"></div>
              <div class="right_arrow_img fL blinkingY_up"></div>
              <div class="cal-title-font fL left_center" style="padding-left: 0"> 전력 피크 예상 시간
                <span style="font-size: 26px; margin-bottom: 20px;">{{ peakTime }}</span>
              </div>
            </div>
            <!-- middle contents -->
            <div class="middle_contents_base">
              <div class="middle_title">
                <span class="text_title_font">목표 피크 전력</span>
              </div>
              <div class="middle_val input_box">
                <span class="text_val_font">{{ peakGoal }}</span>
                <span class="text_val_unit">kW</span>
              </div>
            </div>
          </div>
          <!-- bottom-area -->
          <div class="left_topbottom left_bottom_align ">
            <div class="text_title_base">
              <div class="text_title">
                <span class="text_title_font">요금 적용 전력</span>
              </div>
              <div class="text_val">
                <span class="text_val_font">{{ tariff }}</span>
                <span class="text_val_unit">kW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- detail-R -->
      <div class=" detail_R_wrap fL" style="margin-top:23px;height: calc(100% - 23px);width: 65%; ">
        <div class="detail_R_h48_w45 fL">
          <div class="div_title">주요 인자</div>
          <div class="detail_R_innerWrap" style="position: relative; margin-top: 34px;">
            <div class="detail_textWrap">
              <div class="detail_text">총 순시 전력</div>
              <div class="detail_value">{{ totalPWI }}</div>
              <span style="font-size:14px" class="text_val_unit">kW</span>
            </div>
            <div class="detail_textWrap">
              <div class="detail_text">송수 펌프 순시 전력</div>
              <div class="detail_value">{{ pumpPWI }}</div>
              <span style="font-size:14px" class="text_val_unit">kW</span>
            </div>
            <div class="detail_textWrap">
              <div class="detail_text">요금 적용 전력</div>
              <div class="detail_value">{{ tariff }}</div>
              <span style="font-size:14px" class="text_val_unit">kW</span>
            </div>
            <div class="plate_area"></div>
          </div>
        </div>
        <!-- + 이미지 -->
        <div class="plus_img star fL"></div>
        <div class="detail_R_h48_w45 fL" style="margin-left: 111px;">
          <div class="div_title">펌프사용 전력량 예측</div>
          <div class="detail_R_innerWrap">
            <div class="right_title_div" style="height: 12%;">
              <div ref="tab1Ref" class="div_type_btn div_type_btn_active" style="cursor:pointer" @click="getChart(1)">천안(정)</div>
              <div ref="tab2Ref" class="div_type_btn div_type_btn_active" style="cursor:pointer" @click="getChart(2)">목천(가)</div>
            </div>
            <div ref="chart2Ref" class="items4ChartArea" style=" height: 100%;"></div>
          </div>
        </div>
        <!-- bottom 영역 -->
        <div class="detail_R_h48_w45  fL" style="width:100%">
          <div class="div_title">전력 피크 예상 시간</div>
          <div class="detail_R_innerWrap">
            <div ref="chartRef" class="items4ChartArea" style=" height: 100%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { comma } from '@/utils/utils.js'
import moment from 'moment'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

export default ({
  setup () {
    const store = useStore()
    const searchData = computed(() => store.getters['peakControl/getpeakctrl'])
    const peakSelectData = computed(() => store.getters['peak/getPeakSelect']) // peak store 사용(추후 필요하다면 분리)
    const peakGoalData = computed(() => store.getters['peak/getPeakGoal']) // peak store 사용(추후 필요하다면 분리)
    const pumpChart = computed(() => store.getters['peakControl/getPumpSelect'])
    const costPeakData = computed(() => store.getters['peak/getCostPeak'])

    const totalPWI = ref('')
    const peakGoal = ref('')
    const tariff = ref('')
    const pumpPWI = ref('')
    const peakTime = ref('')
    const tab1Ref = ref(null)
    const tab2Ref = ref(null)
    const chartRef = ref(null)
    const chart2Ref = ref(null)

    const getData = async () => {
      try {
        await leftData()
        await getChart(1)
      } catch (err) {
        log.logError(err.message)
      }
    }

    const getChart = async (param) => {
      try {
        const plotLayout = {
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 20, l: 40, r: 10, b: 30 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%m-%d %H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          yaxis2: { side: 'right', color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }

        const chartDataList = []
        let data1 = []
        // let data2 = []
        await store.dispatch('peakControl/fetchPumpSelect')
        if (pumpChart.value) {
          data1 = pumpChart.value.data1
          // data2 = pumpChart.value.data2
        }
        const tab1Data = data1.filter(function (data1) {
          return data1.PMP_GRP === 1
        })

        const tab2Data = data1.filter(function (data1) {
          return data1.PMP_GRP === 2
        })

        // let hzData = data2.filter(function (data2) {
        //   return data2.PMP_GRP === 2
        // })
        // hzData = hzData.filter(function (hzData) {
        //   return hzData.YN === 1
        // })

        const x = []
        // const y1 = []
        const y2 = []
        // const y3 = []
        // const y4 = []
        if (param === 1) {
          tab1Ref.value.style.opacity = '1'
          tab2Ref.value.style.opacity = '0.3'
          for (let i = 0; i < tab1Data.length; i++) {
            // 기존 소스에 예상전력 차트만 표시, 추후 필요하다면 예상유량, 예상관압 적용
            // y3[i] = tab1Data[i].TUBE_PRSR_PRDCT
            y2[i] = tab1Data[i].PWR_PRDCT
            // y1[i] = tab1Data[i].PRDCT_MEAN
            x[i] = tab1Data[i].PRDCT_TIME
          }
          // chartDataList.push({ fill: 'tozeroy', mode: 'lines', name: '예상유량', x: x, y: y1, visible: true, line: { shape: 'spline', color: '#a748bd' } })
          chartDataList.push({ fill: 'tozeroy', mode: 'lines', name: '예상전력', x: x, y: y2, visible: true, line: { shape: 'spline', color: '#485fa8' } })
          // chartDataList.push({ fill: '', yaxis: 'y2', mode: 'lines', name: '예상관압', x: x, y: y3, visible: true, line: { dash: 'dash', color: '#EF5656' } })
        } else if (param === 2) {
          tab2Ref.value.style.opacity = '1'
          tab1Ref.value.style.opacity = '0.3'
          for (let i = 0; i < tab2Data.length; i++) {
            // 기존 소스에 예상전력 차트만 표시, 추후 필요하다면 예상유량, 예상관압, 주파수 적용
            // y4[i] = hzData[i].FREQ
            // y3[i] = tab2Data[i].TUBE_PRSR_PRDCT
            y2[i] = tab2Data[i].PWR_PRDCT
            // y1[i] = tab2Data[i].PRDCT_MEAN
            x[i] = tab2Data[i].PRDCT_TIME
          }
          // chartDataList.push({ fill: 'tozeroy', mode: 'lines', name: '예상유량', x: x, y: y1, visible: true, line: { shape: 'spline', color: '#a748bd' } })
          chartDataList.push({ fill: 'tozeroy', mode: 'lines', name: '예상전력', x: x, y: y2, visible: true, line: { shape: 'spline', color: '#485fa8' } })
          // chartDataList.push({ fill: '', yaxis: 'y2', mode: 'lines', name: '예상관압', x: x, y: y3, visible: true, line: { dash: 'dash', color: '#EF5656' } })
          // chartDataList.push({ fill: '', yaxis: 'y2', mode: 'lines', name: '주파수', x: x, y: y4, visible: true, line: { dash: 'dash', color: '#ffd77a' } })
        }
        Plotly.newPlot(chart2Ref.value, chartDataList, plotLayout)
      } catch (err) {
        log.logError(err.message)
      }
    }

    const leftData = async () => {
      try {
        await store.dispatch('peakControl/fetchPeakCntData')
        if (searchData.value && searchData.value.length > 0) {
          totalPWI.value = comma(searchData.value[0].총순시전력.toFixed(0))
          pumpPWI.value = comma(searchData.value[0].펌프순시전력.toFixed(0))
          tariff.value = comma(searchData.value[0].요금적용전력.toFixed(0))
          peakGoal.value = comma(searchData.value[0].목표피크전력.toFixed(0))
        }
      } catch (err) {
        log.logError(err.message)
      }
    }

    const peakChart = async () => {
      try {
        let data = []
        const param = {
          search: null,
          search2: null,
          search3: null
        }
        param.search = paramTime()
        param.search2 = moment().format('YYYYMMDD') + '000000'
        param.search3 = moment().format('YYYYMMDD') + '235900'
        await store.dispatch('peak/fetchPeakSelect', param)

        if (peakSelectData.value && peakSelectData.value.length > 0) {
          data = peakSelectData.value
        } else {
          return
        }

        const chartDataList = []
        const peakTimeList = []
        const categorietab2Data = []
        const gnrtdPwr = []
        const prdctPwr = []
        const maxLine = []
        const costLine = []
        const peakGoal = await selectPeakGoal()
        const costPeak = await selectCostPeak()

        for (let i = 0; i < data.length; i++) {
          categorietab2Data[i] = data[i].DATE
          gnrtdPwr[i] = data[i].GNRTD_PWR
          prdctPwr[i] = data[i].PRDCT_PWR
          maxLine[i] = peakGoal
          costLine[i] = costPeak
          if (data[i].PEAK_YN === '1') {
            peakTimeList.push(data[i].DATE.substring(11, 17))
          }
        }
        chartDataList.push({ fill: 'tozeroy', mode: 'lines', name: '발생전력', x: categorietab2Data, y: gnrtdPwr, visible: true, line: { shape: 'spline', color: '#a748bd' } })
        chartDataList.push({ fill: 'tozeroy', mode: 'lines', name: '예상전력', x: categorietab2Data, y: prdctPwr, visible: true, line: { shape: 'spline', color: '#f7d6ff' }, opacity: 0.1 })
        chartDataList.push({ mode: 'dash', name: '목표치 피크', x: categorietab2Data, y: maxLine, showlegend: false, line: { color: '#EF5656', dash: 'dash' } })
        chartDataList.push({ mode: 'dash', name: '요금적용전력', x: categorietab2Data, y: costLine, showlegend: false, line: { color: '#F9C21B', dash: 'dash' } })
        const plotLayout = {
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 20, l: 70, r: 10, b: 30 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%m-%d %H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }
        Plotly.newPlot(chartRef.value, chartDataList, plotLayout)

        let i = 0
        if (peakTimeList.length > 0) {
          setInterval(function () {
            peakTime.value = peakTimeList[i % peakTimeList.length] + '시'
            i = (i + 1) % peakTimeList.length
          }, 5000)
        } else {
          peakTime.value = '없음'
        }
      } catch (err) {
        console.log(err)
        log.logError(err.message)
      }
    }

    const paramTime = () => {
      const dateInfo = new Date()
      const hour = plusZeroDay(dateInfo.getHours())
      const min = plusZeroDay(dateInfo.getMinutes())
      const year = dateInfo.getFullYear()
      const month = plusZeroDay(dateInfo.getMonth() + 1)
      const date = plusZeroDay(dateInfo.getDate())
      const timeFlag = min - (min % 15)

      return `${year}-${month}-${date} ${hour}:${plusZeroDay(timeFlag)}:00`
    }

    const plusZeroDay = (value) => {
      return value.toString().padStart(2, '0')
    }

    const selectPeakGoal = async () => {
      try {
        let data = []
        await store.dispatch('peak/fetchPeakGoal')
        if (peakGoalData.value && peakGoalData.value.length > 0) {
          data = peakGoalData.value
          return data[0].value
        }
      } catch (err) {
        log.logError(err.message)
      }
    }

    const selectCostPeak = async () => {
      try {
        let data = []
        await store.dispatch('peak/fetchCostPeak')
        if (costPeakData.value && costPeakData.value.length > 0) {
          // console.log(typeof (costPeakData.value[0].PWR))
          data = costPeakData.value[0].PWR
          return data
        }
      } catch (err) {
        log.logError(err.message)
      }
    }

    onMounted(() => {
      getData()
      peakChart()
    })

    return {
      totalPWI,
      peakGoal,
      tariff,
      pumpPWI,
      peakTime,
      tab1Ref,
      tab2Ref,
      chartRef,
      chart2Ref,
      getChart
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';
@import '~@/style/AI/peakcontrol.css';

.plus_img {
  height: 5%;
  width: 3%;
  position: absolute;
  top: 32.5%;
  left: 66.5%;
  color: #fff;
  font-size: 33px;
  background: url('@/assets/img/plus.png') no-repeat;
  background-size: 100% 100%;
}

.right_arrow_img {
  width: 39%;
  height: 102%;
  background: url('@/assets/img/dr/02_arrow_high.png') no-repeat;
  background-position: left;
  background-size: 41%;
}

.left_arrow_img {
  width: 39%;
  height: 99%;
  background: url('@/assets/img/dr/02_arrow_low.png') no-repeat;
  background-position: right;
  background-size: 41%;
}

.contents-body {
  height: 100%;
  width: 100%;
  margin-left: 15px;
}

.star{
  -webkit-animation: star 3s linear infinite;
   -moz-animation: star 3s linear infinite;
   animation: star 3s linear infinite;
}
 @-webkit-keyframes star{
  0%{opacity: 0;}
  20%{opacity:0;}
  40% {opacity:0.5; }
  60%{opacity: 1;  }
  80%{opacity: 0.5; }
  100%{opacity: 0;}
}
@-moz-keyframes star{
 0%{opacity: 0;}
  20%{opacity:0;}
  40% {opacity:0.5; }
  60%{opacity: 1;  }
  80%{opacity: 0.5; }
  100%{opacity: 0;}
}
 @keyframes star{
  0%{opacity: 0;}
  20%{opacity:0;}
  40% {opacity:0.5; }
  60%{opacity: 1;  }
  80%{opacity: 0.5; }
  100%{opacity: 0;}
}
</style>
