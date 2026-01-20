<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">목표 전력피크</span>
      <div class="title_line"></div>
    </div>
    <div style="display: flex; align-items: center; width: 100%; height: 40px; margin-top: 20px;">
      <div class="detail_text" style="width: 8%;margin-left: 32px;">피크치 설정</div>
      <input style="margin-top:5px;" class="top_textinput fL" type="text" v-model="peakGoal"/>
      <span class="buttonArea fL" sylte="width:70px">
        <span class="button" style="margin-top:2px;" @click="updatePeakGoal">저장</span>
      </span>
      <span class="refresh_img"></span>
      <span class="font_timer" ref="MyTimerRef">{{ displayValue }}</span>
    </div>
    <div class="itemsWrap1 fL" style="width: 59%; height: calc(100% - 130px)">
      <div class="div-middle fL" style="height: calc(100% - 10px); margin-bottom: 20px;">
        <div class="div-line-top"></div>
        <div ref="chartRef" class="items4ChartArea" style="height: 100%; margin-left: 30px"></div>
        <div class="div-line-bottom" style="height: 5px"></div>
      </div>
    </div>
    <div class="itemsWrap1 fL" style="width: 40%; height: calc(100% - 130px)">
      <div class="margin-left3 sub_bottom_left cost_spring_area">
        <div class="div_title">
          <span style="margin-left: 20px">{{ spendTime }}</span>시 주요 전력 소비 설비
        </div>
        <div class="peak_right_box">
          <div style="width: 88%; height: calc(98% - 80px); padding: 5% 6%">
            <div class="scan_line scanning"></div>
            <div class="spend_text_wrap" style="height: 10%">
              <span class="spend_tagname" style="text-shadow: 0 0 9px #5cafff; color: #c3eaff">설비명</span>
              <span class="spend_text" style="text-align: center">소비 전력</span>
            </div>
            <div v-for="item in spendValues" :key="item.tagId" class="spend_text_wrap">
              <span class="spend_tagname spend_co1">{{ item.tagname }}</span>
              <span class="spend_value">{{ item.kWVALUE }}</span>
              <span class="spend_unit">kW</span>
            </div>
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

export default {
  setup () {
    const store = useStore()
    const peakSelectData = computed(() => store.getters['peak/getPeakSelect'])
    const peakGoalData = computed(() => store.getters['peak/getPeakGoal'])
    const updatePeakGoalData = computed(() => store.getters['peak/getUpdatePeakGoal'])
    const peakFacData = computed(() => store.getters['peak/getPeakFac'])
    const costPeakData = computed(() => store.getters['peak/getCostPeak'])

    const peakGoal = ref('')
    const spendTime = ref('')
    const spendValues = ref([])
    const MyTimerRef = ref(null)
    const displayValue = ref('')
    const chartRef = ref(null)

    const updatePeakGoal = async () => {
      if (!peakGoal.value || peakGoal.value === '') {
        alert('적용할 피크치를 입력해주세요')
        return
      }

      const intPeakGoal = parseInt(peakGoal.value)
      if (isNaN(intPeakGoal) || intPeakGoal !== parseFloat(peakGoal.value)) {
        alert('적용할 피크치를 정수로 입력해주세요')
        return
      }

      try {
        const confirmFlag = confirm('저장하시겠습니까?')
        if (confirmFlag) {
          await store.dispatch('peak/fetchUpdatePeakGoal', peakGoal.value)
          if (updatePeakGoalData.value && updatePeakGoalData.value.length !== 0) {
            const jsonData = JSON.parse(JSON.stringify(updatePeakGoalData.value))
            if (jsonData.message !== 'ok') {
              // console.log('action: fetchUpdatePeakGoal', ' error message: ', jsonData.message)
              return
            }
          }
          alert('저장되었습니다.')
          updatePeakData()
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const startTimer = (duration, display) => {
      let timer = duration
      let minutes = null
      let seconds = null
      setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10)
        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds

        displayValue.value = `${minutes}:${seconds}`
        if (--timer < 0) {
          timer = duration
        }
      }, 1000)
    }

    const timerMounted = () => {
      const minutes = 15
      const fiveMinutes = (60 * minutes) - 1
      const display = MyTimerRef.value

      startTimer(fiveMinutes, display)
    }

    const updatePeakData = async () => {
      const param = {
        search: moment().format('YYYY-MM-DD HH:mm:ss'),
        search2: moment().format('YYYYMMDD') + '000000',
        search3: moment().format('YYYYMMDD') + '235900'
      }
      await store.dispatch('peak/fetchPeakSelect', param)
      if (peakSelectData.value && peakSelectData.value.length > 0) {
        barChart(peakSelectData.value)
      }
      spendList(moment().format('YYYY-MM-DD HH:00:00'))
    }

    const barChart = async (data) => {
      const categories = []
      const gnrtdPwr = []
      const prdctPwr = []
      const maxLine = []
      const costLine = []
      const peakGoal = await selectPeakGoal()
      const costPeak = await selectCostPeak()

      for (let i = 0; i < data.length; i++) {
        categories[i] = data[i].DATE
        gnrtdPwr[i] = data[i].GNRTD_PWR
        prdctPwr[i] = data[i].PRDCT_PWR
        maxLine[i] = peakGoal
        costLine[i] = costPeak
      }

      const plotData = [{
        fill: 'tozeroy',
        mode: 'lines',
        y: gnrtdPwr,
        x: categories,
        name: '발생전력',
        line: { shape: 'spline', color: '#a748bd' }
      },
      {
        fill: 'tozeroy',
        mode: 'lines',
        y: prdctPwr,
        x: categories,
        name: '예상전력',
        line: { shape: 'spline', color: '#f7d6ff' },
        opacity: 0.1
      },
      {
        mode: 'dash',
        y: maxLine,
        x: categories,
        name: '목표치 피크',
        line: { color: '#EF5656', dash: 'dash' },
        showlegend: false
      },
      {
        mode: 'dash',
        y: costLine,
        x: categories,
        name: '요금적용전력',
        line: { color: '#F9C21B', dash: 'dash' },
        showlegend: false
      }]
      const excessTime = []
      for (let i = 0; i < gnrtdPwr.length; i++) {
        if (gnrtdPwr[i] > '2000') {
          excessTime.push({
            type: 'rect',
            xref: 'paper',
            yref: 'paper',
            x0: Number(i / 24),
            y0: 0,
            x1: Number((i + 1) / 24),
            y1: 1,
            fillcolor: '#EC7063',
            opacity: 0.2,
            line: {
              width: 0
            }
          })
        }
      }

      const plotLayout = {
        legend: { font: { color: '#FFF' } },
        showlegend: true,
        margin: { t: 40, l: 80, r: 80, b: 30 },
        modebar: { activecolor: 'blue' },
        hovermode: 'x',
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%H:%M' },
        yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
        font: { family: 'KHNPHDRegular' },
        shapes: excessTime
      }

      plotLayout.yaxis.title = 'KW'
      Plotly.newPlot(chartRef.value, plotData, plotLayout)

      const myPlot = chartRef.value
      myPlot.on('plotly_click', function (data) {
        const param = {
          search: data.points[0].x + ':00'
        }
        spendList(param.search)
      })
    }

    const spendList = async (param) => {
      try {
        spendValues.value = []
        let result = []
        await store.dispatch('peak/fetchPeakFac', param)
        result = peakFacData.value
        spendTime.value = param.substr(11, 2)

        if (result.length !== 0) {
          for (let i = 0; i < result.length; i++) {
            const tagId = `spendTag${i}`
            const valueId = `spendValue${i}`
            const tagname = result[i].tagname
            const kWVALUE = comma(Number(result[i].kWVALUE).toFixed(0))
            spendValues.value.push({ tagId, valueId, tagname, kWVALUE })
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
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
        log.logError(err.message);
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
        log.logError(err.message);
      }
    }

    onMounted(() => {
      timerMounted()
      updatePeakData()
    })

    return {
      peakGoal,
      spendTime,
      MyTimerRef,
      displayValue,
      chartRef,
      spendValues,
      updatePeakGoal
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';

.contents-body {
  left: 18px;
  float: left;
  width: 100%;
  height: 100%;
  margin: 10px;
  background: url('@/assets/img/design_bg.png') no-repeat;
  background-size: 100% 100%;
}

.peak_right_box {
  height: calc(80% - 40px);
  width: 100%;
  background: url('@/assets/img/analysis/table_bg_02.png') no-repeat;
  background-position: center;
  background-size: 100% 100%;
  color: #fff;
  font-family: 'KHNPHDRegular';
  font-size: 18px;
}

.cost_spring_area {
  background: url('@/assets/img/cost_spring.png') no-repeat;
  background-position: bottom;
}

/** peak css */
.itemsWrap1 {
  width: 100%;
  float: left;
  margin: 5px 0 0 0;
}

.sub_bottom_left {
  width: 100%;
  height: 99%;
}

.margin-left3 {
  margin-left: 3%;
}

.spend_text_wrap {
  width: 100%;
  height: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spend_tagname {
  width: 55%;
}

.spend_text {
  width: 15%;
  text-shadow: 0 0 9px #5cafff;
  color: #c3eaff;
  text-align: right;
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

.spend_co1 {
  text-shadow: 0 0 9px #5cafff;
  font-size: 18px;
  font-family: 'KHNPHDRegular';
  letter-spacing: normal;
  color: #c3eaff;
  align-self: center;
}

.refresh_img {
  background: url('@/assets/img/refresh.png') no-repeat;
  background-size: 100% 100%;
  background-position: center;
  width: 55px;
  height: 55px;
  margin-left: 30%;
}

.font_timer {
  font-family: 'LABDigital' !important;
  font-size: 25px;
  color: #c3eaff;
  letter-spacing: 1px;
  line-height: 111px;
}

.top_textinput {
  height: 27px;
  width: 150px;
  display: inline-block;
  border: 1px solid #489cf2;
  background-color: #15284e;
  color: #fff;
  font-family: 'LAB디지털';
  font-size: 18px;
  letter-spacing: 3px;
  text-align: right;
  padding: 0 10px;
  border-radius: 3px;
}
</style>
