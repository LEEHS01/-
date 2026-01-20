<template>
  <div class="title_wrap">
    <span class="title">설비별 사용량</span>
    <div class="title_line"></div>
  </div>
  <div style="width:97.6%;height:32px; margin-bottom: 10px;">
    <span class="buttonArea" style="float:right">
      <span class="button" @click="spinnerFunction()">조회</span>
    </span>
    <span style="float:right" class="calArea">
      <div class="date_design DateTime">
        <CalendarFormat :calendarMode = selectedDateMode @changeDate="changeEndDate" />
      </div>
    </span>
    <span style="float:right" class="calArea">
      <div class="date_design DateTime">
        <CalendarFormat :calendarMode = selectedDateMode @changeDate="changeStartDate" />
      </div>
    </span>
    <span style="float:right">
      <div class="date_design">
        <select class="drop-down" v-model="selectedDateMode" @change="changeDateMode">
          <option v-for="(dateMode, idx) in dateModeList" :key="idx" :value="dateMode.value">
            {{dateMode.text}}
          </option>
        </select>
      </div>
    </span>
  </div>
  <div style="width: 1%; height: calc(53% - 26px); float: left;"></div>
  <div style="width: calc(17% - 3px); height: calc(53% - 26px); float: left;">
    <div class="div_title">시설 현황</div>
    <div class="zone-list">
      <div v-for="(zone, index) in zoneData" :key="index" class="fontContent" :style="zoneItemStyle(index)" @click="selectZone(index)">
        {{ zone }}
      </div>
    </div>
  </div>
  <div class="blinking"></div>
  <div style="margin-left: 10px; height: calc(53% - 26px); width: calc(23% - 10px); float: left;">
    <div class="div_title">설비 목록</div>
    <div class="zone-list">
      <div :style="{ width: 'calc(100% - 20px)', margin: '10px', overflow: 'auto' }">
        <div v-for="(fac, index) in facData" :key="index" class="fontContent" :style="facItemStyle(index)" @click="selectFac(index)">
          {{ fac.fac }}
        </div>
      </div>
    </div>
  </div>
  <div class="blinking"></div>
  <div class="div-middle fL trend">
    <div class="div_title">설비 트렌드</div>
    <div ref="lineRef" class="items4ChartArea"></div>
  </div>
  <div class="div-middle fL sum">
    <div class="div_title">설비별 합계</div>
    <div ref="barRef" class="items4ChartArea"></div>
  </div>
  <div class="div-middle fL distribution">
    <div class="div_title">분포</div>
    <div ref="donutRef" class="items4ChartArea"></div>
  </div>
  <div class="div-middle fL power">
    <div class="div_title">순시 전력</div>
    <div ref="line2Ref" class="items4ChartArea"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { groupBy } from '@/utils/utils.js'
import CalendarFormat from '@/components/common/CalendarFormat.vue'
import moment from 'moment'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

export default {
  components: {
    CalendarFormat
  },
  setup (props, { emit }) {
    const route = useRoute()
    const store = useStore()
    const zoneListData = computed(() => store.getters['facUse/getSelectZone'])
    const facListData = computed(() => store.getters['facUse/getSelectFac'])
    const searchData = computed(() => store.getters['facUse/getSelectFacUseList'])
    const facSunsiData = computed(() => store.getters['facUse/getSelectFacSunsi'])

    const dateModeData = [
      { text: '시', value: 'h' },
      { text: '일', value: 'd' },
      { text: '월', value: 'm' },
      { text: '년', value: 'y' }
    ]

    const dateModeList = ref([])
    const selectedDateMode = ref(dateModeData[0].value)
    const startDate = ref(new Date())
    const endDate = ref(new Date())
    const selectedZoneIndex = ref(-1)
    const selectedFacIndex = ref(-1)
    const zoneData = ref([])
    const facData = ref([])
    const lineRef = ref(null)
    const barRef = ref(null)
    const donutRef = ref(null)
    const line2Ref = ref(null)

    const spinnerFunction = async () => {
      emit('update:isLoading', true)
      await selectZone(0)
      emit('update:isLoading', false)
    }

    const fetchZoneData = async () => {
      try {
        await store.dispatch('facUse/fetchSelectZone')
        if (zoneListData.value && zoneListData.value.length > 0) {
          const result = JSON.parse(JSON.stringify(zoneListData.value))
          if (result.length === 0) {
            return
          }
          zoneData.value = result.map(list => list.ZONE_NAME)
          // console.log('JJJ> [FacUse]fetchZoneData: query', route.query)
          if (Object.keys(route.query).includes('zoneName')) {
            const queryIdx = zoneData.value.indexOf(route.query.zoneName)
            selectZone(queryIdx > 0 ? queryIdx : 0)
            fetchFacData(queryIdx > 0 ? queryIdx : 0)
          } else {
            selectZone(0)
            fetchFacData(0)
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const fetchFacData = async (index) => {
      try {
        facData.value = []
        const param = {
          search: zoneData.value[index]
        }
        await store.dispatch('facUse/fetchSelectFac', param)
        if (facListData.value && facListData.value.length > 0) {
          const arr = JSON.parse(JSON.stringify(facListData.value))
          if (arr.length > 0) {
            facData.value = arr
            selectFac(0)
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const selectZone = async (index) => {
      try {
        emit('update:isLoading', true)
        // 차트 초기화
        clearChart()
        selectedZoneIndex.value = index
        selectedFacIndex.value = -1
        fetchFacData(index)
        // 해당 시설의 설비별 합계, 분포, 순시 전력 차트
        const param = {
          search: '',
          search2: '',
          search3: zoneData.value[index],
          search4: '',
          search5: selectedDateMode.value
        }

        let data = []
        if (selectedDateMode.value === 'h' || selectedDateMode.value === 'd') {
          param.search = moment(startDate.value).format('YYYY-MM-DD')
          param.search2 = moment(endDate.value).format('YYYY-MM-DD')
        } else if (selectedDateMode.value === 'm') {
          param.search = moment(startDate.value).format('YYYY-MM')
          param.search2 = moment(endDate.value).format('YYYY-MM')
        } else if (selectedDateMode.value === 'y') {
          param.search = moment(startDate.value).format('YYYY')
          param.search2 = moment(endDate.value).format('YYYY')
        }

        await store.dispatch('facUse/fetchSelectFacUseList', param)
        if (searchData.value && searchData.value.length !== 0) {
          const arr = JSON.parse(JSON.stringify(searchData.value))
          data = arr.data2
          if (data.length !== 0) {
            donutChart(data)
            barChart(data)
          }
        } else {
          return false
        }

        let sunsiData = []
        await store.dispatch('facUse/fetchSelectFacSunsi', { search: zoneData.value[index] })
        if (facSunsiData.value && facSunsiData.value.length !== 0) {
          sunsiData = JSON.parse(JSON.stringify(facSunsiData.value))
          if (sunsiData.length !== 0) {
            lineChart2(sunsiData)
          }
        } else {
          return false
        }
      } catch (err) {
        log.logError(err.message);
      } finally {
        emit('update:isLoading', false)
      }
    }

    const selectFac = async (index) => {
      try {
        emit('update:isLoading', true)
        // 트렌드 차트 초기화
        Plotly.purge(lineRef.value)

        if (facData.value.length > 0) {
          selectedFacIndex.value = index
          // 해당 설비의 설비 트렌드 차트
          const param = {
            search: '',
            search2: '',
            search3: '',
            search4: facData.value[index].fac,
            search5: selectedDateMode.value
          }
          let data = []
          if (selectedDateMode.value === 'h' || selectedDateMode.value === 'd') {
            param.search = moment(startDate.value).format('YYYY-MM-DD')
            param.search2 = moment(endDate.value).format('YYYY-MM-DD')
          } else if (selectedDateMode.value === 'm') {
            param.search = moment(startDate.value).format('YYYY-MM')
            param.search2 = moment(endDate.value).format('YYYY-MM')
          } else if (selectedDateMode.value === 'y') {
            param.search = moment(startDate.value).format('YYYY')
            param.search2 = moment(endDate.value).format('YYYY')
          }

          await store.dispatch('facUse/fetchSelectFacUseList', param)
          if (searchData.value && searchData.value.length !== 0) {
            const arr = JSON.parse(JSON.stringify(searchData.value))
            data = arr.data1
            if (data.length !== 0) {
              lineChart(data)
            }
          } else {
            return false
          }
        }
      } catch (err) {
        log.logError(err.message);
      } finally {
        emit('update:isLoading', false)
      }
    }

    const getDateModeList = () => {
      dateModeList.value = [...dateModeData]
    }

    const changeDateMode = () => {
      startDate.value = new Date()
      endDate.value = new Date()
    }

    const changeStartDate = (date) => {
      startDate.value = date
    }

    const changeEndDate = (date) => {
      endDate.value = date
    }

    /* 차트 관련 API들 */
    const clearChart = () => {
      // 차트 초기화
      Plotly.purge(lineRef.value)
      Plotly.purge(line2Ref.value)
      Plotly.purge(donutRef.value)
      Plotly.purge(barRef.value)
    }

    const chartColor = ['#6D5495', '#a866ad', '#846EFF', '#C2AFFF', '#EF5656', '#EA6464', '#4931D3', '#9C98B2', '#3B0A89', '#B64B8D', '#9922AF', '#490755']
    const lineChart = (data) => {
      try {
        const tagGroup = groupBy(data, 'fac_name')
        const chartData = []
        let cnt = 0

        for (const i in tagGroup) {
          const x = []
          const y = []

          for (let j = 0; j < tagGroup[i].length; j++) {
            x.push(tagGroup[i][j].x)
            y.push(tagGroup[i][j].Y)
          }
          chartData.push({ fill: 'tozeroy', mode: 'lines', name: i, x: x, y: y, visible: true, line: { shape: 'spline', color: chartColor[cnt] } })
          cnt++
        }

        const plotLayout = {
          height: 400,
          legend: { font: { color: '#FFF' } },
          showlegend: false,
          margin: { t: 80, l: 80, r: 80, b: 80 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }

        plotLayout.yaxis.title = 'kWh'
        if (selectedDateMode.value === 'h') {
          plotLayout.xaxis.tickformat = '%Y-%m-%d %H:%M'
        } else if (selectedDateMode.value === 'd') {
          plotLayout.xaxis.tickformat = '%Y-%m-%d'
        } else if (selectedDateMode.value === 'm') {
          plotLayout.xaxis.tickformat = '%Y-%m'
        } else {
          plotLayout.xaxis.tickformat = '%Y'
        }
        Plotly.newPlot(lineRef.value, chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const lineChart2 = (data) => {
      try {
        const tagGroup = groupBy(data, 'fac_name')
        const chartData = []
        let cnt = 0
        for (const i in tagGroup) {
          const x = []
          const y = []

          for (let j = 0; j < tagGroup[i].length; j++) {
            x.push(tagGroup[i][j].x)
            y.push(tagGroup[i][j].y)
          }
          chartData.push({ mode: 'lines', name: i, x: x, y: y, visible: true, line: { shape: 'spline', color: chartColor[cnt] } })
          cnt++
        }

        const plotLayout = {
          height: 270,
          width: 900,
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 30, l: 80, r: 30, b: 90 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }

        plotLayout.yaxis.title = 'kW'
        Plotly.newPlot(line2Ref.value, chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const donutChart = (data) => {
      try {
        const values = []
        const labels = []
        let allValue = 0
        let per = 0
        let other = 0
        for (let i = 0; i < data.length; i++) {
          allValue = allValue + data[i].y
        }
        let dataSort = []
        dataSort = data.sort(function (a, b) {
          return b.y - a.y
        })
        for (let i = 0; i < dataSort.length; i++) {
          per = per + (dataSort[i].y / allValue * 100)
          if (data.length > 4) {
            if (per < 96) {
              values.push(dataSort[i].y)
              labels.push(dataSort[i].fac_name)
            } else {
              other = other + dataSort[i].y
            }
          } else {
            values.push(dataSort[i].y)
            labels.push(dataSort[i].fac_name)
          }
        }
        if (other !== 0) {
          values.push(other)
          labels.push('기타')
        }

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

    const barChart = (data) => {
      try {
        const values = []
        const labels = []
        for (let i = 0; i < data.length; i++) {
          values.push(data[i].y)
          labels.push(data[i].fac_name)
        }

        const barData = [
          {
            x: labels,
            y: values,
            type: 'bar',
            marker: {
              color: chartColor
            },
            orientation: 'v'
          }
        ]

        const barLayout = {
          height: 270,
          margin: { t: 40, l: 70, r: 70, b: 70 },
          legend: { font: { color: '#FFF' } },
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false },
          yaxis: { color: '#FFF', showline: true, showgrid: false, fixedrange: false, exponentformat: 'none' },
          font: { family: 'KHNPHDRegular' }
        }

        Plotly.newPlot(barRef.value, barData, barLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    onMounted(() => {
      getDateModeList()
      fetchZoneData()
    })

    const zoneItemStyle = computed(() => {
      return (index) => ({
        width: 'calc(100% - 4px)',
        height: '40px',
        color: '#fff',
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: '40px',
        background: selectedZoneIndex.value === index ? `url(${require('@/assets/img/div_new.png')}) no-repeat center` : 'none',
        backgroundSize: selectedZoneIndex.value === index ? '100% 100%' : 'none',
        border: selectedZoneIndex.value === index ? '2px solid #ffffff8a' : 'none'
      })
    })

    const facItemStyle = computed(() => {
      return (index) => ({
        width: 'calc(100% - 4px)',
        height: '40px',
        color: '#fff',
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: '40px',
        background: selectedFacIndex.value === index ? `url(${require('@/assets/img/div_new.png')}) no-repeat center` : 'none',
        backgroundSize: selectedFacIndex.value === index ? '100% 100%' : 'none',
        border: selectedFacIndex.value === index ? '2px solid #ffffff8a' : 'none'
      })
    })

    return {
      dateModeList,
      selectedDateMode,
      startDate,
      endDate,
      zoneData,
      facData,
      lineRef,
      barRef,
      donutRef,
      line2Ref,
      spinnerFunction,
      selectZone,
      selectFac,
      changeDateMode,
      changeStartDate,
      changeEndDate,
      zoneItemStyle,
      facItemStyle
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/layout.scss';
@import '~@/style/component/title.scss';

.fontContent {
    font-family: KHNPHDRegular;
    font-size: 18px;
    color: white;
    text-shadow: 0 0 9px #5cafff;
}

.zone-list {
  height: calc(90% - 40px);
  padding: 5%;
  overflow: auto;
  background-image: url(@/assets/img/analysis/table_bg_03.png);
  background-size: 100% 100%;
  background-position: bottom;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.blinking {
  width: calc(3% - 3px);
  height: calc(53% - 26px);
  float: left;
  mix-blend-mode: color-dodge;
  background-image: url('@/assets/img/ai_arrow_right.png');
  background-size: 100% 100%;
}

.trend {
  background: none !important;
  margin-left: 10px;
  width: calc(52% - 10px);
  height: calc(53% - 26px);
}

.sum {
  background: none !important;
  margin-top: 20px;
  margin-left: 10px;
  width: calc(24% - 10px);
  height: calc(43% - 62px);
}

.distribution {
  background: none !important;
  margin-top: 20px;
  margin-left: 10px;
  width: calc(25% - 10px);
  height: calc(43% - 62px);
}

.power {
  background: none !important;
  margin-top: 20px;
  margin-left: 10px;
  width: calc(50% - 10px);
  height: calc(43% - 62px);
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

</style>
