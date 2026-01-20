<template>
  <div class="dash_info">
    <div class="dash_border_long_img div_right">
      <div class="right_box1">
        <PumpSwiper ref="pumpSwiper"/>
      </div>

      <div class="right_box2">
        <div class="right_title_div">
          <span class="right_title_font fL" style="cursor: pointer;" @click="movePage('songsu')">주요배수지 현황</span>
          <div class="fL title_objline_img right_title_img_div"></div>
        </div>

        <div class="right_title_div" style="height: 15%;">
          <div
            class="div_type_btn div_type_btn_active"
            :style="[state.activeReservoirId === 0 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
            @click="selectReservoir(0)">
            {{ reservoirName[0] }}
          </div>
          <div
            class="div_type_btn div_type_btn_active"
            :style="[state.activeReservoirId === 1 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
            @click="selectReservoir(1)">
            {{ reservoirName[1] }}
          </div>
          <div
            class="div_type_btn div_type_btn_active"
            :style="[state.activeReservoirId === 2 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
            @click="selectReservoir(2)">
            {{ reservoirName[2] }}
          </div>
        </div>

        <div class="dashinfo-pump-div" style="color: #fff; font-family: 'KHNPHDRegular'; font-size: 13px;">
          <div style="height: calc(100%/ 2); width: 100%; margin-top:10px">
            <div class="pipe_name fL">
              <span class="right_title_font fL" style="font-size: 13px; margin-top: -15px">{{ state.activeReservoirName }}
              </span>
            </div>
            <div class="pipe_first_wrap fL">
              <div class="pipe_first_wrap2">유입유량
                <div class="input_box fL first_box">
                  <span class="input_value"> {{ state.valve[0].inFlow }} </span>m3/h
                </div>
              </div>
              <div class="pipe_first fL">
              </div>
            </div>
            <div class="pipe_con fL">
              <!-- <div v-show="state.activeReservoirId === 0" class="pipe_un_y">
              </div> -->
            </div>
            <div class="pipe_center_wrap fL">
              <div class="pipe_center_top fL">
                <div :class="[state.valve[0].status[0] ? 'dashinfo-valve-on fL' : 'dashinfo-valve-off fL']">
                </div>
                <div class="input_box input_box_rate fL">
                  <span class="input_value_rate"> {{ state.valve[0].openRate[0] }} </span>%
                </div>
                <div class="pipe_line fL">
                  <div :class="[state.valve[0].status[0] ? 'pipe_line_arrow blinking' : '']">
                  </div>
                </div>
              </div>
              <div class="pipe_center_bottom fL">
                <div :class="[state.valve[0].status[1] ? 'dashinfo-valve-on fL' : 'dashinfo-valve-off fL']">
                </div>
                <div class="input_box input_box_rate fL ">
                  <span class="input_value_rate"> {{ state.valve[0].openRate[1] }} </span>%
                </div>
                <div class="pipe_line fL">
                  <div :class="[state.valve[0].status[1] ? 'pipe_line_arrow blinking' : '']">
                  </div>
                </div>
              </div>
            </div>
            <div class="pipe_last_wrap  fL">
              <div class="water_wrap">
                <div class="input_box input_water_top fL">
                  <span class="input_value"> {{ state.valve[0].waterLevel[0] }} </span>m
                </div>
                <div class="input_box input_water_bottom fL">
                  <span class="input_value"> {{ state.valve[0].waterLevel[1] }} </span>m
                </div>
              </div>
            </div>
            <div class="pipe_last_wrap fL">
              <div class="pipe_last_wrap2">
                유출유량
                <div class="input_box bm10 fL">
                  <span class="input_value"> {{ state.valve[0].outFlow }} </span> m3/h
                </div>
                <div class=" pipe_last fL">
                  <div :class="[state.valve[0].status[0] || state.valve[0].status[1] ? 'pipe_last_arrow blinking' : '']">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div v-show="state.activeReservoirId === 0" style="height: calc(100%/ 2);width: 100%;margin-bottom: 15px;">
            <div class="pipe_name fL">
            </div>
            <div class="pipe_first_wrap fL">
              <div class="pipe_first_wrap2">
                유입유량
                <div class="input_box fL first_box">
                  <span class="input_value"> {{ state.valve[1].inFlow }} </span>m3/h
                </div>
              </div>
              <div class=" pipe_first fL">
              </div>
            </div>
            <div class="pipe_con fL">
            </div>
            <div class="pipe_center_wrap fL">
              <div class="pipe_center_top fL">
                <div :class="[state.valve[1].status[0] ? 'dashinfo-valve-on fL' : 'dashinfo-valve-off fL']">
                </div>
                <div class="input_box input_box_rate fL">
                  <span class="input_value_rate"> {{ state.valve[1].openRate[0] }} </span>%
                </div>
                <div class="pipe_line fL">
                  <div :class="[state.valve[1].status[0] ? 'pipe_line_arrow blinking' : '']">
                  </div>
                </div>
              </div>
              <div class="pipe_center_bottom fL">
                <div :class="[state.valve[1].status[1] ? 'dashinfo-valve-on fL' : 'dashinfo-valve-off fL']">
                </div>
                <div class="input_box input_box_rate fL">
                  <span class="input_value_rate"> {{ state.valve[1].openRate[1] }} </span>%
                </div>
                <div class="pipe_line fL">
                  <div :class="[state.valve[1].status[1] ? 'pipe_line_arrow blinking' : '']">
                  </div>
                </div>
              </div>
            </div>
            <div class="pipe_last_wrap  fL">
              <div class="water_wrap">
                <div class="input_box input_water_top fL">
                  <span class="input_value"> {{ state.valve[1].waterLevel[0] }} </span>m
                </div>
                <div class="input_box input_water_bottom fL">
                  <span class="input_value"> {{ state.valve[1].waterLevel[1] }} </span>m
                </div>
              </div>
            </div>
            <div class="pipe_last_wrap fL">
              <div class="pipe_last_wrap2">유출유량
                <div class="input_box bm10 fL">
                  <span class="input_value"> {{ state.valve[1].outFlow }} </span> m3/h
                </div>
                <div class=" pipe_last fL">
                  <div :class="[state.valve[1].status[0] || state.valve[1].status[1] ? 'pipe_last_arrow blinking' : '']">
                  </div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <div class="right_box3" style="height: 29%;">
        <div class="right_title_div">
          <span class="right_title_font fL" style="cursor: pointer; " @click="movePage('peakControl')">피크 제어</span>
          <div class="fL title_objline_img2 right_title_img_div2"></div>
        </div>
        <div class="right_title_div" style="height: 12%;">
          <div class="div_type_btn div_type_btn_active" style="cursor:pointer" @click="drawPeakChart()">피크 제어</div>
        </div>
        <div class="dashinfo-pump-div">
          <div id="mainChart" class="items4ChartArea"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { comma } from '@/utils/utils.js'
import PumpSwiper from '@/components/dashboard/PumpSwiper'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

export default {
  components: {
    PumpSwiper
  },

  setup (props, context) {
    const store = useStore()
    const router = useRouter()

    const pumpSwiper = ref(null)

    const reservoirName = ['목천(신)', '독립기념관', '목천(구)']
    const state = reactive({
      activeReservoirId: 0,
      activeReservoirName: reservoirName[0],
      reservoirInterval: null,
      valve: [
        {
          name: '',
          inFlow: 0,
          outFlow: 0,
          waterLevel: [0, 0, 0, 0],
          openRate: [0, 0, 0, 0],
          status: [0, 1, 0, 0]
        },
        {
          name: '',
          inFlow: 0,
          outFlow: 0,
          waterLevel: [0, 0, 0, 0],
          openRate: [0, 0, 0, 0],
          status: [0, 0, 0, 0]
        }
      ]
    })

    const peakGoal = computed(() => store.getters['dashboard/getPeakGoal'])
    const peakData = computed(() => store.getters['dashboard/getPeakData'])
    const costPeakData = computed(() => store.getters['dashboard/getCostPeak'])

    const movePage = (value, index) => {
      // console.log(value);
      router.push(value)
    }

    // TODO 천안정수장 배수지에 맞게 수정 필요, 임시 코드임
    const selectReservoir = (reservoirId) => {
      try {
        state.activeReservoirId = reservoirId
        state.activeReservoirName = reservoirName[state.activeReservoirId]
        if (store.state.dashboard.valveData.length !== 0) {
          const valveData = []
          if (reservoirId === 0) {
            valveData.push(store.state.dashboard.valveData[0])
          } else if (reservoirId === 1) {
            valveData.push(store.state.dashboard.valveData[1])
            valveData.push(store.state.dashboard.valveData[2])
          } else {
            valveData.push(store.state.dashboard.valveData[3])
            valveData.push(store.state.dashboard.valveData[4])
          }

          valveData.forEach((valve, idx) => {
            const idx1 = parseInt(idx / 2)
            const idx2 = idx % 2

            if (!(idx2 % 2)) {
              state.valve[idx1].name = valve.TNK_GRP_NM
              state.valve[idx1].inFlow = comma(Number(valve.유입유량).toFixed(0))
              state.valve[idx1].outFlow = comma(Number(valve.유출유량).toFixed(0))
            }

            state.valve[idx1].waterLevel[idx2] = comma(Number(valve.수위).toFixed(2))

            const rate = (valve.개도율 !== undefined && valve.개도율 !== null) ? valve.개도율.split(',') : ['0', '0']
            // state.valve[idx1].openRate[idx2] = comma(Number(rate[idx2]).toFixed(2))
            state.valve[idx1].openRate[idx2] = comma(Number(rate[0]).toFixed(2)) // TODO selectValve 개도율 데이터 형태 논의 필요

            const fo = (valve.FO !== undefined && valve.FO !== null) ? valve.FO.split(',') : ['0', '0']
            const fc = (valve.FC !== undefined && valve.FC !== null) ? valve.FC.split(',') : ['0', '0']

            // state.valve[idx1].status[idx2] = (Number(fo[idx2]) === 0 && Number(fc[idx2]) === 1) ? 0 : 1
            state.valve[idx1].status[idx2] = (Number(fo[0]) === 0 && Number(fc[0]) === 1) ? 0 : 1
          })
        }
        // console.log(state.valve);
      } catch (err) {
        log.logError(err.message);
      }
    }

    const rotateReservoir = () => {
      state.reservoirInterval = setInterval(() => {
        state.activeReservoirId = (state.activeReservoirId + 1) % 3
        selectReservoir(state.activeReservoirId)
      }, 5000)
    }

    const resetActiveReservoir = () => {
      state.activeReservoirId = 0
      state.activeReservoirName = reservoirName[state.activeReservoirId]
      if (state.reservoirInterval !== null) {
        clearInterval(state.reservoirInterval)
      }
    }

    const frame = (chartData) => {
      const frames = []
      const x = chartData[0].x
      const y = chartData[0].y
      const n = chartData[0].x.length
      for (let i = 0; i < n; i++) {
        const frameData = {
          x: x.slice(0, i + 1),
          y: y.slice(0, i + 1)
        }
        frames.push({ data: [frameData] })
      }
      return frames
    }

    const drawPeakChart = async () => {
      const chartData = []
      let plotLayout = ''
      const excessTime = []
      const categoriesData = []
      const gnrtdPwr = []
      const prdctPwr = []
      const maxLine = []
      const costLine = []
      const config = {
        toImageButtonOptions: {
          format: 'jpeg', // one of png, svg, jpeg, webp
          filename: 'chart_image',
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      }
      // console.log(costPeakData.value)
      for (let i = 0; i < peakData.value.length; i++) {
        categoriesData[i] = peakData.value[i].DATE
        gnrtdPwr[i] = peakData.value[i].GNRTD_PWR
        prdctPwr[i] = peakData.value[i].PRDCT_PWR
        maxLine[i] = peakGoal.value
        costLine[i] = costPeakData.value
      }

      chartData.push({ fill: 'tozeroy', mode: 'lines', name: '발생전력', x: categoriesData, y: gnrtdPwr, visible: true, line: { shape: 'spline', color: '#a748bd' } })
      chartData.push({ fill: 'tozeroy', mode: 'lines', name: '예상전력', x: categoriesData, y: prdctPwr, visible: true, line: { shape: 'spline', color: '#f7d6ff' }, opacity: 0.1 })
      chartData.push({ mode: 'dash', name: '목표치 피크', x: categoriesData, y: maxLine, visible: true, line: { color: '#EF5656', dash: 'dash' }, showlegend: false })
      chartData.push({ mode: 'dash', name: '요금적용전력', x: categoriesData, y: costLine, visible: true, line: { color: '#F9C21B', dash: 'dash' }, showlegend: false })

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
      plotLayout = {
        height: 190,
        legend: { font: { color: '#FFF' } },
        showlegend: true,
        margin: { t: 20, l: 40, r: 10, b: 80 },
        modebar: { activecolor: 'blue' },
        hovermode: 'x',
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%H:%M' },
        yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
        font: { family: 'KHNPHDRegular' },
        shapes: excessTime
      }

      try {
        frame(chartData)

        Plotly.newPlot('mainChart', chartData, plotLayout, config).then(function () {
          Plotly.animate('mainChart', frame(chartData), { transition: { duration: 0 }, frame: { duration: 0, redraw: false } })
        })
      } catch (err) {
        log.logError(err.message);
      }
    }

    const prepareData = async () => {
      await store.dispatch('dashboard/getPeakData')
      await store.dispatch('dashboard/getPeakGoal')
      await store.dispatch('dashboard/getNowElec')
      await store.dispatch('dashboard/getPumpStatus')
      await store.dispatch('dashboard/getValveData')
      await store.dispatch('dashboard/getCostPeak')
    }

    // const selectCostPeak = async () => {
    //   try {
    //     let data = []
    //     await store.dispatch('dashboard/fetchCostPeak')
    //     if (costPeakData.value && costPeakData.value.length > 0) {
    //       console.log(typeof (costPeakData.value[0].PWR))
    //       data = costPeakData.value[0].PWR
    //       return data
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }

    const getDashInfo = async () => {
      try {
        await prepareData()
        await drawPeakChart()
        await selectReservoir(0)
        rotateReservoir()
        pumpSwiper.value.setPumpList(store.state.dashboard.pumps)
        // console.log('JJJ> getDashInfo')
      } catch (err) {
        log.logError(err.message);
      }
    }

    onMounted(() => {
      getDashInfo()
    })

    onUnmounted(() => {
      // console.log('DashboardInfo' + ' destoryed')
      if (state.reservoirInterval !== null) {
        clearInterval(state.reservoirInterval)
      }
    })

    context.expose({ getDashInfo, resetActiveReservoir })

    return {
      state,
      reservoirName,
      pumpSwiper,
      selectReservoir,
      drawPeakChart,
      getDashInfo,
      resetActiveReservoir,
      movePage
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/layout.scss';
@import '@/style/component/title.scss';
@import '@/style/component/dashboard.scss';

.dash_info {
  height: 100%;
  width: 100%;
}

.dash_border_long_img{
background: url('@/assets/img/00_table_bg_long.png') no-repeat;
background-position: center;
background-size: 100% 104%;
}

.div_right {
  width: 100%;
  height: 99%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.right_box1 {
  width: 83%;
  height: 30%;
  align-self: center;
  display: flex;
  flex-direction: column;
}

.right_box2 {
  width: 83%;
  height: 33%;
  align-self: center;
}

.right_box3 {
  width: 83%;
  height: 30%;
  align-self: center;
}

.title_objline_img {
  background: url('@/assets/img/00_title_objline.png') no-repeat;
  background-size: 100% 100%;
  mix-blend-mode: overlay;
}

.title_objline_img2 {
  background: url('@/assets/img/00_title_objline2.png') no-repeat;
  background-size: 100% 100%;
  mix-blend-mode: overlay;
}

.right_title_img_div {
  width: 59%;
  height: 26%;
  margin-top: 19px;
  margin-left: 16px;
}

.right_title_img_div2 {
  width: 73%;
  height: 26%;
  margin-top: 19px;
  margin-left: 16px;
}

.rotate {
  animation: rotation 4s;
  animation-delay: 2s;
  animation-iteration-count: infinite;
}

@keyframes rotation {
  from {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(270deg);
  }
}

@keyframes fade-in-bottom {
  0% {
    transform: translateY(0);
    opacity: 0
  }
  100% {
    transform: translateY(0);
    opacity: 1
  }
}

@keyframes slide-top {
  0% {
    transform: translateY(0)
  }
  100% {
    transform: translateY(-60%)
  }
}

@keyframes persent-top {
  0% {
    transform: translateY(0)
  }
  100% {
    transform: translateY(-10%)
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 주요 배수지현황 css */
.water_wrap {
  width: 100%;
  height: 100%;
  background: url('@/assets/img/analysis/watertank_big.png') no-repeat;
  background-size: contain;
  background-position: center;
  margin: 0 0 0 -16%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.input_water_top {
  width: 83% !important;
  margin: 0 0 3% 0 !important;
  background-color: #15284e54 !important;
}

.input_water_bottom {
  width: 83% !important;
  margin: 0 0 30% 0 !important;
  background-color: #15284e54 !important;
}

.input_box_rate {
  width: 40% !important;
  height: 25% !important;
  margin: 8px 0 0 -10%;
}

.input_box {
  height: 25px;
  width: 150%;
  margin-left: -6px;
  font-size: 1px;
  border-radius: 3px;
  border: 1px solid #489cf2;
  background-color: #15284e;
  color: #a4ceed;
  text-align: center;
  font-family: 'KHNPHDRegular';
  display: flex;
  align-items: center;
  justify-content: center;
}

.bm10 {
  margin-bottom: 10%;
}

.input_value {
  font-family: 'LAB디지털' !important;
  margin-right: 2px;
  font-size: 15px;
  color: #fff;
}

.input_value_rate {
  font-family: 'LAB디지털' !important;
  margin-right: 2px;
  font-size: 12px;
  color: #fff;
}

.pipe_line {
  width: 47%;
  height: 36%;
  text-align: center;
  background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
  background-size: 100% 12px;
  background-position: center;
  margin: 1.5% 0 0 -7%;
}

.pipe_line_arrow {
  background: url('@/assets/img/analysis/pipeline_arrow.png') no-repeat;
  width: 100%;
  height: 100%;
  mix-blend-mode: color-dodge;
  background-position: center;
}

.pipe_first_wrap {
  width: 18%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
}

.pipe_first_wrap2 {
  width: 70%;
  margin-top: -30%;
}

.pipe_last_wrap {
  width: 15%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: flex-end;
}

.pipe_last_wrap2 {
  width: 87%;
  height: 70%;
}

.pipe_center_wrap {
  height: 100%;
  width: 20%;
  margin-left: -1%;
}

.pipe_center_top {
  width: 100%;
  height: 50%;
  text-align: center;
}

.pipe_center_bottom {
  width: 100%;
  height: 50%;
  text-align: center;
  margin-top: -10%;
}

.pipe_name {
  width: 15%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: center */
  ;
  align-items: center;
}

.pipe_first {
  width: 30%;
  height: 25px;
  background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
  background-size: 100% 15px;
}

.pipe_con {
  width: 5%;
  height: 77.5%;
  text-align: center;
  background: url('@/assets/img/analysis/pipeline_two.png') no-repeat;
  background-size: 105% 64%;
  background-position: bottom;
}

.pipe_un_y {
  background: url('@/assets/img/analysis/pipeline_un_y.png') no-repeat;
  width: 61%;
  height: 94%;
  margin-top: 350%;
  margin-left: 0%;
}

.pipe_last {
  width: 160%;
  margin: 0 0 0 -20%;
  height: 12px;
  background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
  background-size: 100% 12px;
}

.pipe_last_arrow {
  background: url('@/assets/img/analysis/pipeline_arrow.png') no-repeat;
  width: 100%;
  height: 100%;
  mix-blend-mode: color-dodge;
  position: relative;
  left: 40px;
}

/* 벨브 색상 */

.dashinfo-valve-on {
  width: 50%;
  height: 100%;
  text-align: center;
  background: url('@/assets/img/analysis/03_2_valve_active.png') no-repeat;
  background-position: center;
  background-size: 86%;
}

.dashinfo-valve-off {
  width: 50%;
  height: 100%;
  text-align: center;
  background: url('@/assets/img/analysis/03_2_valve_disable2.png') no-repeat;
  background-position: center;
  background-size: 86%;
}

.div_type_btn_active {
  background: url('@/assets/img/pump_O/disable_false.png');
  mix-blend-mode: hard-light;
}

.div_type_btn {
  width: 79px;
  height: 25px;
  float: left;
  background: url('@/assets/img/pump_O/disable_true.png');
  line-height: 25px;
  background-size: 100% 100% !important;
  font-size: 13px;
  font-family: 'KHNPHDRegular';
  color: #fff;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.first_box {
  margin-left: -27px;
  width: 150%;
}
</style>
