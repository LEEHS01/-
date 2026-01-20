<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">전력피크 세부 현황</span>
      <div class="title_line"></div>
    </div>
    <div style="display: flex; align-items: center; width: 100%; height: 40px; margin-top: 20px;">
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
    <transition name="modal" appear v-show="showModal">
    <div class="modal modal-overlay">
      <div class="modal-window">
        <div class="modal-content">
          <div class="k-window" style="padding-top: 0px;min-width: 90px; min-height: 50px; width: 463px; height: 213px;">
            <div style="padding: 25px; height: 100%; width: 100%; box-sizing: border-box;">
              <div class="popup__title">
                <div class="popup__icon"></div>
                <span id="pop2_title">알림</span>
              </div>
              <div class="popoup__body">
                <span style="font-size: 20px; color: white;">{{ popupMsg }}</span>
              </div>
              <div class="popup_button">
                <div class="popup__btn popup__btn__change" @click="closePop">확인</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>

<script>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { comma, uncomma, plusZeroDay } from '@/utils/utils.js'
import moment from 'moment'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

export default {
  setup () {
    const store = useStore()
    const peakSelectData = computed(() => store.getters['peak/getPeakSelect'])
    const peakGoalData = computed(() => store.getters['peak/getPeakGoal'])
    const peakFacData = computed(() => store.getters['peak/getPeakFac'])
    const nowPeakData = computed(() => store.getters['peak/getNowPeak'])
    const costPeakData = computed(() => store.getters['peak/getCostPeak'])

    const spendTime = ref('')
    const spendValues = ref([])
    const MyTimerRef = ref(null)
    const displayValue = ref('')
    const chartRef = ref(null)
    const executeInterval = ref(null)
    // popup
    const showModal = ref(false)
    const popupMsg = ref('')

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
      try {
        const param = {
          search: moment().format('YYYY-MM-DD HH:mm:ss'),
          search2: moment().format('YYYYMMDD') + '000000',
          search3: moment().format('YYYYMMDD') + '235900'
        }
        await store.dispatch('peak/fetchPeakSelect', param)
        if (peakSelectData.value && peakSelectData.value.length > 0) {
          barChart(peakSelectData.value)
          checkPeakAlarm(peakSelectData.value)
        }
        spendList(moment().format('YYYY-MM-DD HH:00:00'))
      } catch (err) {
        log.logError(err.message);
      }
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

    const checkPeakAlarm = async (data) => {
      // 전력 피크 발생 시 알람
      // 기존 소스에서는 구현만 되어있고 사용안하지만 테스트를 위해 적용, 추후 최종 적용 여부 결정
      try {
        await store.dispatch('peak/fetchNowPeak')
        if (nowPeakData.value && nowPeakData.value.length > 0) {
          const nowPeak = JSON.parse(JSON.stringify(nowPeakData.value))
          const peakGoal = await selectPeakGoal()

          if (Number(nowPeak[0].VALUE) > Number(peakGoal)) {
            // 1차 알람 체크
            popupMsg.value = '전력이 목표 피크치를 초과했습니다.'
            showModal.value = true
          } else {
            // 2차, 3차, 4차 알람 체크
            const timeIntervals = [10, 60, 120]
            for (const interval of timeIntervals) {
              const flag = alarmFlag(data, nowTime(interval), peakGoal)
              if (flag) {
                popupMsg.value = `${interval}분 후 예상전력이 목표 피크치를 초과합니다.`
                showModal.value = true
                break
              }
            }
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const alarmFlag = (data, time, peakGoal) => {
      const list = []
      let flag = false

      for (let i = 0; i < data.length; i++) {
        const prdctPwr = uncomma(data[i].PRDCT_PWR)

        if (!isNaN(prdctPwr) && Number(prdctPwr) > Number(peakGoal)) {
          list.push(data[i].DATE)
        }
      }

      for (let i = 0; i < list.length; i++) {
        if (list[i] === time.value) {
          flag = true
        }
      }

      return flag
    }

    const nowTime = (minutesToAdd) => {
      const dateInfo = new Date()
      dateInfo.setMinutes(dateInfo.getMinutes() + minutesToAdd)
      const hour = plusZeroDay(dateInfo.getHours())
      const min = plusZeroDay(dateInfo.getMinutes())
      const year = dateInfo.getFullYear()
      const month = plusZeroDay(dateInfo.getMonth() + 1)
      const date = plusZeroDay(dateInfo.getDate())

      return `${year}-${month}-${date} ${hour}:${min}:00`
    }

    // popup close..
    const closePop = () => {
      showModal.value = false
    }

    const executeApis = () => {
      updatePeakData()
    }

    onMounted(() => {
      timerMounted()
      updatePeakData()
      // 1분 주기로 피크 데이터 업데이트
      executeInterval.value = setInterval(executeApis, 60000)
    })

    onUnmounted(() => {
      clearInterval(executeInterval.value)
    })

    return {
      spendTime,
      MyTimerRef,
      displayValue,
      chartRef,
      spendValues,
      showModal,
      popupMsg,
      closePop
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
  margin-left: 52%;
}

.font_timer {
  font-family: 'LABDigital' !important;
  font-size: 25px;
  color: #c3eaff;
  letter-spacing: 1px;
  line-height: 111px;
}

.modal {
  &.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  &-window {
    background-color: transparent;
    border-radius: 4px;
    overflow: hidden;
  }
}

// 오버레이 트랜지션
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // 오버레이에 포함되어 있는 모달 윈도의 트랜지션
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// 딜레이가 적용된 모달 윈도가 제거된 후에 오버레이가 사라짐
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
