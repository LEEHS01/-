<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">절감목표 달성 현황</span>
      <div class="title_line"></div>
    </div>

    <div class="contents">
      <div class="fL div-new " style="height: calc(50% - 5px); width: calc(100% - 60px); margin-right: 10px; padding: 15px 25px; font-family: 'KHNPHDRegular';">

        <div style="width:100%; height: 20px; margin: 10px 0 20px 0;">
          <div class="title_show" style="width: 20%; height: 100%;"></div>
        </div>

        <div style="width:100%; height: 20px; margin:10px 0 10px 0;">
          <div v-for="(month, idx) in state.months1" :key="idx" class="month"> {{ month }}</div>
          <div class="month1">6월</div>
          <div style="float:right; color:white; opacity:0.5; font-size: 12px; margin: 6px 10px 0px 0px;">단위 : KWH</div>
        </div>

        <div class="month_div">
          <div v-for="(month, idx) in state.monthly1" :key=idx class="showwant">
            <div class="month_left">
              <div class="row1">
                <div class="posif">목표량</div>
                <div class=" bottom_middle_val">{{ month.goal }}</div>
              </div>
              <div class="row1">
                <div class="posif">사용량</div>
                <div class=" bottom_middle_val">{{ month.use }}</div>
              </div>
            </div>
            <div class="month_right">
              <div class="persent">{{ month.per }}%</div>
            </div>
          </div>
        </div>

        <div style="width:100%; height: 20px; margin:20px 0 10px 0;">
          <div v-for="(month, index) in state.months2" :key="index" class="month"> {{ month }}</div>
        </div>

        <div class="month_div">
          <div v-for="(month, idx) in state.monthly2" :key=idx class="showwant">
            <div class="month_left">
              <div class="row1">
                <div class="posif">목표량</div>
                <div class=" bottom_middle_val">{{ month.goal }}</div>
              </div>
              <div class="row1">
                <div class="posif">사용량</div>
                <div class=" bottom_middle_val">{{ month.use }}</div>
              </div>
            </div>
            <div class="month_right">
              <div class="persent">{{ month.per }}%</div>
            </div>
          </div>
        </div>

        <div style="width:100%; height: 20px; margin: 20px 0 10px 0; ">
          <div class="title_show2" style="width: 20%; height: 100%;"></div>
        </div>
      </div>

      <div class="fL table_s ">
        <div class="bottom_title">금월 목표대비 사용량</div>
        <div class="bottom_bar"></div>
        <div class="bottom_middle_area">
          <div class="bottom_middle_gauge" style="height: 155px; overflow: hidden;">
            <div class="pie_chart1"></div>
          </div>

          <img src="@/assets/img/gauge_f.png" alt="" class="bottom_middle_gauge">

          <div class="bottom_cir"></div>
        </div>
        <div class="bottom_val">{{ state.thisMonthPer }} %</div>
        <div class="bottom_line_val">
          <div style="color:white; text-align: center; font-size: 20px; font-weight: bolder; font-family: 'KHNPHUotfR';">
            사용량&nbsp;
            <span>{{ state.thisMonthUse }} kWh</span> &nbsp;목표량&nbsp;
            <span>{{ state.thisMonthGoal }} kWh</span>
          </div>
        </div>
      </div>

      <div class="fL table_s ">
        <div class="bottom_title fL">목표대비 탄소 저감량</div>
        <div class="bottom_middle fL">
          <div class="bottom_row1">
            <div class="bottom_col1">
              <span>목표 전력 사용량</span>
            </div>
            <div class="col2">
              <span class="bottom_middle_val">{{ state.goalPower }}</span><span class="table_unit">kWh</span>
            </div>
          </div>

          <div class="bottom_row1">
            <div class="bottom_col1">
              <span>전력 사용량</span>
            </div>
            <div class="col2">
              <span class="bottom_middle_val">{{ state.usePower }}</span><span class="table_unit">kWh</span>
            </div>
          </div>

          <div class="bottom_row1">
            <div class="bottom_col1">
              <span>CO2 발생량</span>
            </div>
            <div class="col2">
              <span class="bottom_middle_val">{{ state.useCo2 }}</span><span class="table_unit">kg</span>
            </div>
          </div>

          <div class="bottom_row1">
            <div class="bottom_col1">
              <span>목표대비 CO2 저감량</span>
            </div>
            <div class="col2">
              <span class="bottom_middle_val">{{ state.goalVsCo2 }}</span><span class="table_unit">kg</span>
            </div>
          </div>
        </div>
        <div class="bottom_line_val">
          <div style="color:white; text-align: center; font-size: 18px; font-family: 'KHNPHUotfR'; font-weight: bolder;">
            CO2발생량&nbsp;
            <span>{{ state.useCo2 }} kg</span> &nbsp;CO2절감량&nbsp;
            <span>{{ state.goalVsCo2 }} kg</span>
          </div>
        </div>
      </div>

      <div class="fL div-new " style="height:365px; width:34.6%; margin: 6px 0 0 0; padding: 0 10px 10px 10px;">
        <div style="width:96%; height:98%; display:inline-block;">
          <div id="mainChart" class="items4ChartArea"></div>
        </div>
        <div style="width:3%; height:98%; display:inline-block;">
          <img src="@/assets/img/image_01.png" style="margin-top: 640%; float:right;">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { comma, nc } from '@/utils/utils.js'
import axios from 'axios'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

export default {
  setup () {
    const tempResponse = [{
      '1월': 0.0,
      '2월': 0.0,
      '3월': 891430.0,
      '4월': 0.0,
      '5월': 0.0,
      '6월': 671430.0,
      '7월': 0.0,
      '8월': 0.0,
      '9월': 0.0,
      '10월': 0.0,
      '11월': 0.0,
      '12월': 0.0,
      year: '2023',
      '1m': 1234570.0,
      '2m': 1234570.0,
      '3m': 1234570.0,
      '4m': 1234570.0,
      '5m': 1234570.0,
      '6m': 1234570.0,
      '7m': 1234570.0,
      '8m': 1234570.0,
      '9m': 1234570.0,
      '10m': 1234570.0,
      '11m': 1234570.0,
      '12m': 1234570.0
    }]

    const state = reactive({
      months1: ['1월', '2월', '3월', '4월', '5월'],
      months2: ['7월', '8월', '9월', '10월', '11월', '12월'],
      monthly1: [{ goal: '43,000', use: '42,913', per: '0.2' }, { goal: '43,000', use: '42,913', per: '0.2' }, { goal: '43,000', use: '42,913', per: '0.2' },
        { goal: '43,000', use: '42,913', per: '0.2' }, { goal: '43,000', use: '42,913', per: '0.2' }, { goal: '43,000', use: '42,913', per: '0.2' }
      ],
      monthly2: [{ goal: '43,000', use: '42,913', per: '0.2' }, { goal: '43,000', use: '42,913', per: '0.2' }, { goal: '43,000', use: '42,913', per: '0.2' },
        { goal: '43,000', use: '42,913', per: '0.2' }, { goal: '43,000', use: '42,913', per: '0.2' }, { goal: '43,000', use: '42,913', per: '0.2' }
      ],
      thisMonthGoal: '43,444',
      thisMonthUse: '26,000',
      thisMonthPer: '60',
      goalPower: '731,169',
      usePower: '731,169',
      useCo2: '731,169',
      goalVsCo2: '731,169'
    })

    const pieBackground = ref('')

    const getUsageData = () => {
      // eslint-disable-next-line no-new-object
      const params = new Object()
      const year = new Date().getFullYear()

      for (let i = 1; i < 13; i++) {
        if (String(i).length === 1) {
          i = '0' + i
        }
        params['mStr' + i] = year + '-' + i + '-01 00:00:00'
        params['mEnd' + i] = year + '-' + i + '-31 23:59:00'
      }
      params.year = year

      axios
        .post(
          `${process.env.VUE_APP_HOST_IP}/api/getUsageData`,
          params
        )
        .then((resp) => {
          // (TODO Pie Chart 표시를 위해 임시로 데이터 입력
          // if (resp.data[0]['6월'] === 0 || resp.data[0]['6월'] === null) {
          //   resp.data[0]['6월'] = 654321
          // }
          // if (resp.data[0]['7월'] === 0 || resp.data[0]['7월'] === null) {
          //   resp.data[0]['7월'] = 564321
          // }
          // )TODO Pie Chart 표시를 위해 임시로 데이터 입력

          setUsage(resp.data)
          drawChart(resp.data)
        })
        .catch((error) => {
          if (error.response) {
            // console.log(error.response.data)
            // console.log(error.response.status)
          }
          setUsage(tempResponse)
          drawChart(tempResponse)
        })
    }

    const drawPieChart = (max, className) => {
      let i = 1
      const func = setInterval(function () {
        if (i < max) {
          pieBackground.value = 'conic-gradient(#01ffff ' + i + '%, #183567 0%, #183567 0%, #183567 0%)'
          i++
        } else {
          clearInterval(func)
        }
      }, 100)
    }

    const setMonthUsage = (month, monthVal, useVal, goalVal) => {
      monthVal.use = nc(useVal) ? useVal : 0
      monthVal.goal = nc(goalVal) ? goalVal : 0
      monthVal.per = monthVal.use / monthVal.goal * 100
      monthVal.per = nc(monthVal.per) ? monthVal.per : 0

      if (monthVal.per === Infinity) {
        monthVal.per = 0
      } else {
        monthVal.per = monthVal.per.toFixed(1).toString()
      }
      monthVal.use = comma(monthVal.use.toFixed(0))
      monthVal.goal = comma(monthVal.goal)

      const thismonth = new Date().getMonth() + 1
      if (month === thismonth) {
        state.thisMonthGoal = monthVal.goal
        state.thisMonthUse = monthVal.use
        state.thisMonthPer = monthVal.per

        state.goalPower = monthVal.goal
        state.usePower = monthVal.use
        state.useCo2 = comma((useVal * 0.4663).toFixed(0))
        state.goalVsCo2 = comma((goalVal * 0.4663 - useVal * 0.4663).toFixed(0))

        drawPieChart(monthVal.per / 2, '.pie_chart1')
      }
    }

    const setUsage = (data) => {
      // console.log('[setUsage]', data);

      for (let i = 1; i < 7; i++) {
        // console.log('JJJ>' + i);
        setMonthUsage(i, state.monthly1[i - 1], data[0][i + '월'], data[0][i + 'm'])
        setMonthUsage(i + 6, state.monthly2[i - 1], data[0][(i + 6) + '월'], data[0][(i + 6) + 'm'])
      }
    }

    const drawChart = (data) => {
      try {
        // console.log('[drawChart]', data);

        let x = Object.keys(data[0])
        x = x.filter(function (x) {
          return x.indexOf('월') !== -1
        })

        const y1 = []
        const y2 = []
        for (const i in data[0]) {
          if (i.indexOf('월') !== -1) {
            y2.push(data[0][i])
          } else {
            y1.push(data[0][i])
          }
        }

        const trace1 = {
          x: x,
          y: y1,
          type: 'bar',
          name: '목표량',
          marker: {
            color: 'rgb(49,130,189)',
            opacity: 0.7
          }
        }

        const trace2 = {
          x: x,
          y: y2,
          type: 'bar',
          name: '사용량',
          marker: {
            color: 'rgb(204,204,204)',
            opacity: 0.5
          }
        }

        const chartData = [trace1, trace2]

        const plotLayout = {
          height: 370,
          legend: { font: { color: '#FFF' }, orientation: 'h' },
          showlegend: true,
          margin: { t: 20, l: 70, r: 10, b: 30 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          yaxis2: { side: 'right', color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }

        Plotly.newPlot('mainChart', chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    onMounted(() => {
      getUsageData()
    })

    return {
      state,
      pieBackground
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/layout.scss';
@import '@/style/component/title.scss';
.contents-body {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}

.title_wrap {
  display: flex;
  flex-direction: row;
}

.title_show {
  background-image: url("@/assets/img/dot_road.png");
  background-size: 100% 35%;
  background-repeat: no-repeat;
  background-position: center;
  float: left;
}

.title_show2 {
  background-image: url("@/assets/img/dot_road.png");
  background-size: 100% 35%;
  background-repeat: no-repeat;
  background-position: center;
  float: right;
  transform: rotate(180deg);
}

.contents {
  height: calc(100% - 50px);
}

.row1 {
  height: 100%;
  display: flex;
  align-items: center;
}

.month {
  color: white;
  width: calc(100% / 6);
  height: 20px;
  display: inline-block;
  /* margin: 0 0 0 1px; */
  font-weight: bolder;
  font-size: 18px;
}

.month1 {
  color: white;
  width: 11.3%;
  height: 20px;
  display: inline-block;
  /* margin: 0 0 0 1px; */
  font-weight: bolder;
  font-size: 18px;
}

.div-new {
  background-image: url("@/assets/img/div_new.png");
  background-size: 100% 100%;
  display: inline-block;
}

.showwant {
  background-image: url("@/assets/img/soure_pump.png");
  width: calc(100%/6);
  height: 100%;
  background-repeat: no-repeat;
  background-size: 97% 100%;
}

.posif {
  width: 26%;
  color: skyblue;
  display: inline-block;
  margin: 0px 0px 0px 10px;
  font-weight: bolder;
}

.persent {
  color: white;
  font-size: 20px;
  font-weight: bolder;
}

.table_s {
  background-image: url("@/assets/img/table_s.png");
  background-size: 100% 100%;
  height: 365px;
  width: 30.5%;
  margin: 5px 5px 0 0;
  padding: 0 10px 10px 10px;
  position: relative;
}

div::-webkit-scrollbar-track {
  background-color: #15284e !important;
}

.tui-grid-cell-header.tui-grid-cell-selected {
  background-color: #15284e !important;
}

.month_left {
  float: left;
  width: 65%;
  height: 50%;
}

.month_right {
  float: left;
  width: 28%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.month_div {
  width: 100%;
  height: 30%;
  display: flex;
  margin-bottom: 10px;
}

.bottom_title {
  width: 100%;
  height: 26%;
  font-size: 174%;
  color: white;
  text-align: center;
  line-height: 120px;
  font-family: 'KHNPHDRegular';
}

.bottom_middle {
  display: flex;
  height: 170px;
  flex-direction: column;
  width: 100%;
}

.bottom_row1 {
  display: flex;
  height: 40px;
  width: 100%;
  margin-left: 12%;
}

.bottom_col1 {
  text-shadow: 0 0 9px #5cafff;
  font-size: 19px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #c3eaff;
  width: 180px;
  text-align: left;
  font-family: 'KHNPHUotfR';
  display: flex;
  align-items: flex-end;
}

.bottom_middle_val {
  text-shadow: 0 0 9px #5cafff;
  font-size: 19px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #fff;
  width: 65%;
  font-family: 'LAB디지털';
}

.table_unit {
  font-size: 16px;
  color: #a4ceed;
  font-family: 'KHNPHDRegular';
  margin-left: 14px;
}

.bottom_bar {
  width: 3%;
  height: 45%;
  float: left;
  background: url("@/assets/img/image_01.png");
  background-repeat: no-repeat;
}

.bottom_middle_area {
  width: 100%;
  height: 120px;
  position: relative;
  top: 28px;
}

.bottom_middle_gauge {
  width: 310px;
  opacity: 0.5;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}

.bottom_val {
  width: 98%;
  color: white;
  font-size: 44px;
  text-align: center;
  z-index: 1;
  position: absolute;
  font-family: 'LAB디지털';
}

.bottom_line_val {
  width: 96%;
  position: absolute;
  bottom: 36px;
}

.bottom_cir {
  background: #173770;
  display: block;
  position: absolute;
  top: 83%;
  left: 50%;
  width: 156px;
  height: 80px;
  border-radius: 150px 150px 0 0;
  text-align: center;
  line-height: 200px;
  font-size: 30px;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.pie_chart1 {
  width: 305px;
  height: 305px;
  transition: 0.3s;
  display: block;
  position: absolute;
  top: 100%;
  border-radius: 50%;
  line-height: 200px;
  font-size: 30px;
  transform: translate(-50%, -50%) rotate( -90deg);
  z-index: 1;
  left: 50%;
  background: v-bind(pieBackground);
}

.col2 {
  text-align: right;
  width: 238px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>
