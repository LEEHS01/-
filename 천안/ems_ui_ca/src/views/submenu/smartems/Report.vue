<template>
  <div class="report-contents-body">
    <div class="title_wrap">
      <span class="title">일일 보고서</span>
      <div class="title_line"></div>
    </div>
    <div class="report-search-bar">
      <div class="date_design DateTime">
        <CalendarFormat :calendarMode="'d'" @changeDate="startDate = $event" />
      </div>
      <div class="buttonArea">
        <span class="button" @click="search">조회</span>
      </div>
      <div class="buttonArea">
        <span class="button" @click="excelBtn">엑셀</span>
      </div>
    </div>
    <!-- 전력 사용량 -->
    <div class="itemsWrap1 fL" style="width: 100%; height: 40px;">
      <div class="div_title">전력 사용량</div>
    </div>
    <div class="itemsWrap1 fL" style="width: 100%; height: 195px;">
      <div class="div-big fL" style="background-image: none; width: calc(100% - 10px);">
        <div class="div-line-top"></div>
        <div style="margin-top: 15px; height: 100%">
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            class=ag-theme-alpine
            :headerHeight="36"
            :rowHeight="30"
            :columnDefs="powerUseDefs"
            @grid-ready="onGridReady($event, 'powerUse')"
            :rowData="powerUseData">
          </ag-grid-vue>
        </div>
      </div>
    </div>
    <!-- 시설별 사용량 -->
    <div class="itemsWrap1 fL" style="width: 100%; height: 40px; margin-top: 60px">
      <div class="div_title">시설별 사용량</div>
    </div>
    <div class="itemsWrap1 fL" style="width: 100%; height: 160px;">
      <div class="div-big fL" style="background-image: none; width: calc(100% - 10px);">
        <div class="div-line-top"></div>
        <div style="margin-top: 15px; height: 100%">
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            class=ag-theme-alpine
            :headerHeight="36"
            :rowHeight="30"
            :columnDefs="facUseDefs"
            @grid-ready="onGridReady($event, 'facUse')"
            :rowData="facUseData">
          </ag-grid-vue>
        </div>
      </div>
    </div>
    <!-- 펌프 가동 이력 -->
    <div class="itemsWrap1 fL" style="width: 100%; height: 40px; margin-top: 60px">
      <div class="div_title">펌프 가동이력</div>
    </div>
    <div class="itemsWrap1 fL" style="width: 100%; height: 255px;">
      <div class="div-big fL" style="background-image: none; width: calc(100% - 10px);">
        <div class="div-line-top"></div>
        <div style="margin-top: 15px; height: 100%">
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            class=ag-theme-alpine
            :headerHeight="36"
            :rowHeight="30"
            :columnDefs="pumpOperationDefs"
            @grid-ready="onGridReady($event, 'pumpOperation')"
            :rowData="pumpOperationData">
          </ag-grid-vue>
        </div>
      </div>
    </div>
    <!-- 가동 트렌드 -->
    <div class="itemsWrap1 fL" style="width: 100%; height: 40px; margin-top: 60px">
      <div class="div_title">가동 트렌드</div>
    </div>
    <div class="itemsWrap1 fL" style="width: 100%; height: 200px">
      <div class="div-middle fL" style="background-image: none; width: calc(100% - 10px);">
        <div ref="heatmapChartRef" class="items4ChartArea" style="height: 100%;"></div>
      </div>
    </div>
    <!-- 주요 배수지 수위(m) -->
    <div class="itemsWrap1 fL" style="width: 100%; height: 40px; margin-top: 60px">
      <div class="div_title">주요 배수지 수위 (m)</div>
    </div>
    <div class="itemsWrap1 fL" style="width: 100%; height: 165px;">
      <div class="div-big fL" style="background-image: none; width: calc(100% - 10px);">
        <div class="div-line-top"></div>
        <div style="margin-top: 15px; height: 100%">
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            class=ag-theme-alpine
            :headerHeight="36"
            :rowHeight="30"
            :columnDefs="waterLevelDefs"
            @grid-ready="onGridReady($event, 'waterLevel')"
            :rowData="waterLevelData">
          </ag-grid-vue>
        </div>
      </div>
    </div>
    <!-- 수위 트렌드 -->
    <div class="itemsWrap1 fL" style="width: 100%; height: 40px; margin-top: 60px">
      <div class="div_title">수위 트렌드</div>
    </div>
    <div class="itemsWrap1 fL" style="width: 100%; height: 200px">
      <div class="div-middle fL" style="background-image: none; width: calc(100% - 10px);">
        <div ref="trendChartRef" class="items4ChartArea" style="height: 100%;"></div>
      </div>
    </div>
    <!-- 시간대별 전력사용현황 (kWh) -->
    <div class="itemsWrap1 fL" style="width: 100%; height: 40px; margin-top: 60px">
      <div class="div_title">시간대별 전력사용현황 (kWh)</div>
    </div>
    <div class="itemsWrap1 fL" style="width: 100%; height: 760px;">
      <div class="detail_textWrap">
        <div class="detail_text" style="width: 8%;">전력 피크값 (kW)</div>
        <span class="detail_value" style="width: 10%; text-align: left; font-family: 'KHNPHDRegular'">{{ peakValue }}</span>
        <div class="detail_text" style="width: 10%;">목표설정 피크값 (kW)</div>
        <span class="detail_value" style="width: 10%; text-align: left; font-family: 'KHNPHDRegular'">{{ peakGoal }}</span>
      </div>
      <div class="div-big fL" style="background-image: none; width: calc(100% - 10px);">
        <div class="div-line-top"></div>
        <div style="margin-top: 15px; height: 100%">
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            class=ag-theme-alpine
            :headerHeight="36"
            :rowHeight="30"
            :columnDefs="timeZonePwrUseDefs"
            @grid-ready="onGridReady($event, 'timeZonePwrUse')"
            :rowData="timeZonePwrUseData">
          </ag-grid-vue>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import CalendarFormat from '@/components/common/CalendarFormat.vue'
import { groupBy, unique, comma } from '@/utils/utils.js'
import moment from 'moment'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridVue } from 'ag-grid-vue3'
import XLSX from 'xlsx-js-style'

export default ({
  components: {
    CalendarFormat,
    AgGridVue
  },
  setup (props, { emit }) {
    const store = useStore()
    const reportData = computed(() => store.getters['report/getSelectReport'])
    const performList = computed(() => store.getters['report/getSelectPerformList'])
    const peakGoalData = computed(() => store.getters['peak/getPeakGoal']) // peak store 사용(추후 필요하다면 분리)

    const startDate = ref(new Date())
    const peakValue = ref()
    const peakGoal = ref()

    const search = async () => {
      try {
        emit('update:isLoading', true)
        const param = {
          search: moment(startDate.value).format('YYYYMMDD'),
          search2: moment(startDate.value).subtract(1, 'days').format('YYYYMMDD'),
          search3: moment(startDate.value).format('YYYY-MM-DD'),
          search4: moment(startDate.value).subtract(1, 'days').format('YYYY-MM-DD'),
          search5: moment(startDate.value).format('YYYYMM'),
          search6: moment(startDate.value).format('YYYY'),
          search7: moment(startDate.value).format('YYYY-MM')
        }

        await store.dispatch('report/fetchSelectReport', param)
        if (reportData.value) {
          const arr = JSON.parse(JSON.stringify(reportData.value))
          powerUseGrid(arr.data1) // 전력 사용량 그리드
          facUseGrid(arr.data2) // 시설별 사용량 그리드
          pumpOperationGrid(arr.data3) // 펌프 가동이력 그리드
          waterLevelGrid(arr.data4) // 주요 배수지 수위 그리드
          trendChart(arr.data5) // 수위 트렌드 차트
          timeZonePwrUseGrid(arr.data6) // 시간대별 전력사용현황 그리드

          peakValue.value = arr.data7[0].peak // 전력 피크값
          peakGoal.value = await selectPeakGoal() // 목표설정 피크값
        } else {
          return false
        }

        const param2 = {
          search: moment(startDate.value).format('YYYY-MM-DD'),
          search2: moment(startDate.value).format('YYYY-MM-DD'),
          search3: 'PMB_TAG',
          search4: 'h'
        }

        await store.dispatch('report/fetchSelectPerformList', param2)
        if (performList.value) {
          const data = JSON.parse(JSON.stringify(performList.value))
          heatmapChart(data) // 가동 트렌드 차트
        } else {
          return false
        }
      } catch (err) {
        log.logError(err.message);
      } finally {
        emit('update:isLoading', false)
      }
    }

    let cellWidth = 1844 / 9
    const powerUseDefs = ref([
      { headerName: '구분', field: 'ROW', width: cellWidth, suppressMovable: true },
      {
        headerName: '시간대별 전력 사용량 (kWh)',
        children: [
          { headerName: '경부하', field: 'l_kwh', width: cellWidth, suppressMovable: true },
          { headerName: '중간부하', field: 'm_kwh', width: cellWidth, suppressMovable: true },
          { headerName: '최대부하', field: 'h_kwh', width: cellWidth, suppressMovable: true }
        ],
        suppressMovable: true
      },
      {
        headerName: '시간대별 전력 사용량 비율 (%)',
        children: [
          { headerName: '경부하', field: 'l_kwh_p', width: cellWidth, suppressMovable: true },
          { headerName: '중간부하', field: 'm_kwh_p', width: cellWidth, suppressMovable: true },
          { headerName: '최대부하', field: 'h_kwh_p', width: cellWidth, suppressMovable: true }
        ],
        suppressMovable: true
      },
      { headerName: '에너지 절감량 (kWh)', field: 'savingkwh', width: cellWidth, suppressMovable: true },
      { headerName: '탄소 저감량 (tCO2)', field: 'savingCo2', width: cellWidth, suppressMovable: true }
    ])
    const powerUseData = ref([])
    const powerUseGrid = (data) => {
      if (data && data.length > 0) {
        powerUseData.value = data
      } else {
        // console.log('powerUseGrid: data is empty')
      }
    }

    cellWidth = 1844 / 10
    const facUseDefs = ref([
      { headerName: '구분', field: 'ROW', width: cellWidth, suppressMovable: true },
      { headerName: '총전력량', field: 't_kwh', width: cellWidth, suppressMovable: true },
      { headerName: '송수펌프동', field: 'kwh_1', width: cellWidth, suppressMovable: true },
      { headerName: '관리동', field: 'kwh_2', width: cellWidth, suppressMovable: true },
      { headerName: '오존설비동', field: 'kwh_3', width: cellWidth, suppressMovable: true },
      { headerName: '급속여과지동', field: 'kwh_4', width: cellWidth, suppressMovable: true },
      { headerName: '탈수기동', field: 'kwh_5', width: cellWidth, suppressMovable: true },
      { headerName: '활성탄흡착지동', field: 'kwh_6', width: cellWidth, suppressMovable: true },
      { headerName: '약품투입동', field: 'kwh_7', width: cellWidth, suppressMovable: true },
      { headerName: '차염설비동', field: 'kwh_8', width: cellWidth, suppressMovable: true }
    ])
    const facUseData = ref([])
    const facUseGrid = (data) => {
      if (data && data.length > 0) {
        facUseData.value = data
        facUseData.value.forEach((item) => {
          for (const key in item) {
            if (typeof item[key] === 'number') {
              item[key] = comma(item[key])
            }
          }
        })
      } else {
        // console.log('facUseGrid: data is empty')
      }
    }

    cellWidth = 1104 / 5
    const pumpOperationDefs = ref([
      { headerName: '구분', field: 'ROW', width: 185, suppressMovable: true },
      {
        headerName: '천안 송수펌프 전력사용량 (kWh)',
        children: [ // 추후 정수장에 맞게 field명 수정 필요
          { headerName: '1호기', field: 'p_1', width: cellWidth, suppressMovable: true },
          { headerName: '2호기', field: 'p_2', width: cellWidth, suppressMovable: true },
          { headerName: '3호기', field: 'p_3', width: cellWidth, suppressMovable: true }
        ],
        suppressMovable: true
      },
      {
        headerName: '목천 송수펌프 전력사용량 (kWh)',
        children: [ // 추후 정수장에 맞게 field명 수정 필요
          { headerName: '1호기', field: 's_1', width: cellWidth, suppressMovable: true },
          { headerName: '2호기', field: 's_2', width: cellWidth, suppressMovable: true }
        ],
        suppressMovable: true
      },
      { headerName: '유효합계 (kWh)', field: 't_kwh', width: 185, suppressMovable: true },
      { headerName: '용수공급량 (m3)', field: 'm3', width: 185, suppressMovable: true },
      { headerName: '원단위 (kWh/m3)', field: 't_k_m3', width: 185, suppressMovable: true }
    ])
    const pumpOperationData = ref([])
    const pumpOperationGrid = (data) => {
      if (data && data.length > 0) {
        pumpOperationData.value = data
      } else {
        // console.log('pumpOperationGrid: data is empty')
      }
    }

    cellWidth = 1844 / 9
    const waterLevelDefs = ref([
      { headerName: '구분', field: 'ROW', width: cellWidth, suppressMovable: true },
      {
        headerName: '소정1',
        children: [ // 추후 정수장에 맞게 field명 수정 필요
          { headerName: '1지', field: 'a_1', width: cellWidth, suppressMovable: true },
          { headerName: '2지', field: 'a_2', width: cellWidth, suppressMovable: true }
        ],
        suppressMovable: true
      },
      {
        headerName: '풍세산단',
        children: [ // 추후 정수장에 맞게 field명 수정 필요
          { headerName: '1지', field: 'b_1', width: cellWidth, suppressMovable: true },
          { headerName: '2지', field: 'b_2', width: cellWidth, suppressMovable: true }
        ],
        suppressMovable: true
      },
      {
        headerName: '목천',
        children: [ // 추후 정수장에 맞게 field명 수정 필요
          { headerName: '1지', field: 'c_1', width: cellWidth, suppressMovable: true },
          { headerName: '2지', field: 'c_2', width: cellWidth, suppressMovable: true }
        ],
        suppressMovable: true
      },
      {
        headerName: '독립기념관',
        children: [ // 추후 정수장에 맞게 field명 수정 필요
          { headerName: '1지', field: 'd_1', width: cellWidth, suppressMovable: true },
          { headerName: '2지', field: 'd_2', width: cellWidth, suppressMovable: true }
        ],
        suppressMovable: true
      }
    ])
    const waterLevelData = ref([])
    const waterLevelGrid = (data) => {
      if (data && data.length > 0) {
        waterLevelData.value = data
      } else {
        // console.log('waterLevelGrid: data is empty')
      }
    }

    cellWidth = 1844 / 3
    const timeZonePwrUseDefs = ref([
      { headerName: '구분', field: 'DATE', width: cellWidth, suppressMovable: true },
      { headerName: 'CBL', field: 'CBL', width: cellWidth, suppressMovable: true },
      { headerName: '사용량', field: 'val', width: cellWidth, suppressMovable: true }
    ])
    const timeZonePwrUseData = ref([])
    const timeZonePwrUseGrid = (data) => {
      if (data && data.length > 0) {
        timeZonePwrUseData.value = data
        timeZonePwrUseData.value.forEach((item) => {
          for (const key in item) {
            if (typeof item[key] === 'number') {
              item[key] = comma(item[key])
            }
          }
        })
      } else {
        // console.log('waterLevelGrid: data is empty')
      }
    }

    const heatmapChartRef = ref(null)
    const heatmapChart = (data) => {
      try {
        if (!data || data.length === 0) {
          // console.log('heatmapChart: data is empty')
          return
        }

        data.push(data.shift())
        data.push(data.shift())

        let categories = []
        for (let i = 0; i < data.length; i++) {
          categories.push(data[i].ts)
        }
        categories = unique(categories)
        data = groupBy(data, 'name')

        const z = []
        for (const i in data) {
          const value = data[i].map(item => {
            if (i === '평택계통4') {
              if (item.value === '1.0' || item.value === '1.0000') {
                return Number(item.value) - 0.25
              }
            } else if (i === '송산계통1' || i === '송산계통2') {
              if (item.value === '1.0' || item.value === '1.0000') {
                return Number(item.value) - 0.5
              }
            }
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
          height: 250,
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 20, l: 80, r: 80, b: 30 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }
        const chartData = [{ ygap: 10, type: 'heatmap', z: z.reverse(), x: categories, y: Object.keys(data).reverse(), showscale: false, colorscale: colorscaleValue }]
        plotLayout.xaxis.tickformat = '%Y-%m-%d %H:%M'

        Plotly.newPlot(heatmapChartRef.value, chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const trendChartRef = ref(null)
    const trendChart = (data) => {
      try {
        if (!data || data.length === 0) {
          // console.log('trendChart: data is empty')
          return
        }

        const chartColor = ['#6D5495', '#a866ad', '#846EFF', '#C2AFFF', '#EF5656', '#EA6464', '#4931D3', '#9C98B2', '#3B0A89', '#B64B8D', '#9922AF', '#490755']
        const plotLayout = {
          height: 250,
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 40, l: 80, r: 80, b: 30 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }

        const tagGroup = groupBy(data, 'tagname')
        const chartData = []
        let cnt = 0

        for (const i in tagGroup) {
          const x = []
          const y = []

          for (let j = 0; j < tagGroup[i].length; j++) {
            x.push(tagGroup[i][j].ts)
            y.push(tagGroup[i][j].val)
          }

          chartData.push({
            fill: 'tozeroy',
            mode: 'lines',
            name: i,
            x: x,
            y: y,
            visible: true,
            line: { shape: 'spline', color: chartColor[cnt] }
          })

          cnt++
        }

        plotLayout.yaxis.title = 'm3'
        Plotly.newPlot(trendChartRef.value, chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const getWorksheet = (data, api, shiftNum) => {
      const grid = [...data]
      const columns = api || []
      const excHeader = columns.reduce((headerObj, column) => {
        headerObj[column.colDef.field] = column.colDef.headerName
        return headerObj
      }, {})

      for (let i = 0; i < shiftNum; i++) {
        grid.unshift(excHeader)
      }

      const newWorksheet = XLSX.utils.json_to_sheet(grid, { skipHeader: true }) || null

      if (newWorksheet) {
        // 엑셀 워크시트의 모든 셀에 border 적용
        const cellStyle = {
          border: {
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } }
          }
        }

        const range = XLSX.utils.decode_range(newWorksheet['!ref'])
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
            const cell = newWorksheet[cellAddress] || { t: 's', v: '' }
            if (cell.v === null) {
              cell.v = ''
              cell.t = 's'
            }
            cell.s = cellStyle
            newWorksheet[cellAddress] = cell
          }
        }
      }

      return newWorksheet
    }

    const excelBtn = () => {
      const colWidth = 147
      // 1. 전력 사용량 그리드
      const newWorksheet1 = getWorksheet(powerUseData.value, gridColumnApi.powerUse, 2)
      newWorksheet1.B1 = { t: 's', v: '시간대별 전력 사용량 (kWh)' }
      newWorksheet1.E1 = { t: 's', v: '시간대별 전력 사용량 비율 (%)' }

      const merge1 = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } },
        { s: { r: 0, c: 7 }, e: { r: 1, c: 7 } },
        { s: { r: 0, c: 8 }, e: { r: 1, c: 8 } }
      ]
      newWorksheet1['!merges'] = merge1
      newWorksheet1['!cols'] = Array(9).fill({ wpx: colWidth })

      // 2. 시설별 사용량 그리드
      const newWorksheet2 = getWorksheet(facUseData.value, gridColumnApi.facUse, 1)
      newWorksheet2['!cols'] = Array(10).fill({ wpx: colWidth })

      // 3. 펌프 가동이력 그리드
      const newWorksheet3 = getWorksheet(pumpOperationData.value, gridColumnApi.pumpOperation, 2)
      newWorksheet3.B1 = { t: 's', v: '천안 송수펌프 전력사용량 (kWh)' }
      newWorksheet3.E1 = { t: 's', v: '목천 송수펌프 전력사용량 (kWh)' }

      const merge3 = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } },
        { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } },
        { s: { r: 0, c: 7 }, e: { r: 1, c: 7 } },
        { s: { r: 0, c: 8 }, e: { r: 1, c: 8 } }
      ]
      newWorksheet3['!merges'] = merge3
      newWorksheet3['!cols'] = Array(9).fill({ wpx: colWidth })

      // 4. 주요 배수지 수위 그리드
      const newWorksheet4 = getWorksheet(waterLevelData.value, gridColumnApi.waterLevel, 2)
      newWorksheet4.B1 = { t: 's', v: '소정1' }
      newWorksheet4.D1 = { t: 's', v: '풍세산단' }
      newWorksheet4.F1 = { t: 's', v: '목천' }
      newWorksheet4.H1 = { t: 's', v: '독립기념관' }

      const merge4 = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } },
        { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } },
        { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } },
        { s: { r: 0, c: 7 }, e: { r: 0, c: 8 } }
      ]
      newWorksheet4['!merges'] = merge4
      newWorksheet4['!cols'] = Array(9).fill({ wpx: colWidth })

      // 5. 시간대별 전력사용현황 그리드
      const newWorksheet5 = getWorksheet(timeZonePwrUseData.value, gridColumnApi.timeZonePwrUse, 1)
      newWorksheet5['!cols'] = Array(3).fill({ wpx: colWidth })

      // 시트 및 엑셀 데이터 생성
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, newWorksheet1, '전력 사용량')
      XLSX.utils.book_append_sheet(wb, newWorksheet2, '시설별 사용량')
      XLSX.utils.book_append_sheet(wb, newWorksheet3, '펌프 가동이력')
      XLSX.utils.book_append_sheet(wb, newWorksheet4, '주요 배수지 수위 (m)')
      XLSX.utils.book_append_sheet(wb, newWorksheet5, '시간대별 전력사용현황 (kWh)')

      // 엑셀 파일 저장
      const fileName = '보고서_' + moment(startDate.value).format('YYYYMMDD') + '.xlsx'
      XLSX.writeFile(wb, fileName)
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

    const gridColumnApi = []
    const onGridReady = (params, name) => {
      if (name) {
        gridColumnApi[name] = params.columnApi.getColumns()
      }
    }

    onMounted(() => {
      // 페이지 진입 시 오늘 날짜로 조회
      search()
    })

    return {
      startDate,
      peakValue,
      peakGoal,
      powerUseDefs,
      powerUseData,
      facUseDefs,
      facUseData,
      pumpOperationDefs,
      pumpOperationData,
      waterLevelDefs,
      waterLevelData,
      timeZonePwrUseDefs,
      timeZonePwrUseData,
      heatmapChartRef,
      trendChartRef,
      gridColumnApi,
      search,
      excelBtn,
      onGridReady
    }
  }
})
</script>

<style lang="scss">
@import '~@/style/layout.scss';
@import '~@/style/component/title.scss';

.report-contents-body {
  height: 100%;
  width: 100%;
  margin-left: 15px;
  background-image: url("@/assets/img/img03.png");
  background-size: 100% 300%;
  overflow-y: scroll;
}

.report-search-bar {
  display: flex;
  align-items: center;
  height: 40px;
  margin-top: 20px;
  justify-content: flex-end;
  margin-right: 20px;
}

div::-webkit-scrollbar-track {
  background-color: #15284e !important;
}

.ag-theme-alpine {
  --ag-foreground-color: white;
  --ag-background-color: rgb(234, 234, 234, / 0%);
  --ag-header-foreground-color: white;
  --ag-header-background-color: #15284e;
  --ag-header-column-resize-handle-color: white;
  --ag-header-column-separator-display: block;
  --ag-header-column-separator-height: 105px;
  --ag-header-column-separator-color: white;
  --ag-row-border-color: #33a2ff;
  --ag-cell-horizontal-border: solid #33a2ff;
  --ag-odd-row-background-color: rgb(0, 0, 0, 0.03);
  --ag-font-size: 16px;
  --ag-font-family: 'KHNPHDRegular';

  .ag-header-group-cell {
    justify-content: center;
  }

  .ag-header-cell-label {
    justify-content: center;
  }

  .ag-row .ag-cell {
    text-align: center;
  }
}
</style>
