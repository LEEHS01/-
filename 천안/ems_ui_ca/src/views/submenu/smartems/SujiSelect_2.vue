<template>
  <div class="title_wrap">
    <span class="title">주요 배수지 수위 현황</span>
    <div class="title_line"></div>
  </div>
  <!-- 상단 조회 영역 -->
  <div class="sujiSelect_container">
    <span class="buttonArea fL">
      <div class="date_design DateTime">
        <CalendarFormat :calendarMode="'d'" @changeDate="changeStartDate" />
      </div>
    </span>
    <span class="buttonArea fL" @click="search">
      <span class="button">조회</span>
    </span>
  </div>
  <div class="" style="width:calc(15% - 3px);height: calc(84% - 41px);float:left; padding-left: 20px;">
    <div class="div_title">배수지 현황</div>
    <div class="basuji_img">
      <div class="img_2" id="basujiList" style="align-items: center; color: #ffffff; font-family: KHNPHDRegular; font-size: 19px;">
        <option class="btn_design" v-for="(item, idx) in basujiDataList" :key="idx" :value="item.TNK_GRP_NM" :style="selectItemStyle(idx)" @click="handleClick(idx, item.TNK_GRP_NM)">
          {{ item.TNK_GRP_NM }}
        </option>
      </div>
    </div>
  </div>
  <div class="blinking basuji_img_arrow"></div>
  <!-- 수위 별 트랜드 -->
  <div class="div-middle plate_img fL" style="margin-left:10px;width:calc(50% - 10px);height: calc(49% - 26px);">
    <div class="div_title">수위 트렌드</div>
    <div ref="lineRef" id="line" class="items4ChartArea basuji_height"></div>
  </div>
  <div class="div-middle plate_img fL" style="margin-left:10px;width:calc(29% - 10px);height: calc(49% - 26px);">
    <div class="div_title">배수지별 수위 분포</div>
    <div ref="donutRef" id="donut" class="items4ChartArea basuji_height"></div>
  </div>
  <div class="div-middle plate_img fL" style="margin-left:10px;width:calc(79% - 10px);height: calc(42% - 26px);margin-top: 10px;">
    <div class="div_title">배수지별 수위 순시</div>
    <div id="sujiSunsi" style="height:calc(100% - 60px);padding: 10px; display: flex;  flex-direction: row;   flex-wrap: wrap;   align-items: center;   justify-content: center;">
      <!-- baesuji sunfi area -->
      <div v-for="item in baeSujiSunsiList" :key="item.TNK_GRP_NM" class="div-small div_small" style="width: calc(100% / 5 - 20px); display: inline-block; margin-left: 10px">
        <div class="bottom_all1">{{ item.TNK_GRP_NM }}</div>
        <div class="bottom_all2">
          <span v-if="nc(item['수위'])" class="bottom_all2_value">{{ item.수위 }} m</span>
          <span v-else class="bottom_all2_value"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import CalendarFormat from '@/components/common/CalendarFormat.vue'
import moment from 'moment'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

export default {
  components: {
    CalendarFormat
  },
  setup (props, { emit }) {
    const lineRef = ref(null)
    const donutRef = ref(null)
    const reservoirData = [
      { text: '한화토탈', value: 'h_total' },
      { text: '석문공단', value: 'suckmoon' },
      { text: '대한전선', value: 'daehan' },
      { text: '대산', value: 'daesan' },
      { text: '현대오일뱅크', value: 'hyundai' },
      { text: '서산2', value: 'seosan2' },
      { text: '서산1', value: 'seosan1' },
      { text: '대산 CGN', value: 'd_cgn' },
      { text: '송악2', value: 'song2' },
      { text: '남산', value: 'namsan' },
      { text: '송악2 일반산단', value: 'song2_nomal' }
    ]

    const baeSujiSunsiList = ref([])
    let baeSujiSunsi = []
    let baesujiSetting = []

    const reservoirList = ref([])
    const selectedData = ref(reservoirData[0].value)
    const getReservoirList = () => {
      for (const dataMode of reservoirData) {
        reservoirList.value.push(dataMode)
      }
    }

    const basujiDataList = ref([])
    const getBasujiList = () => {
      for (const basuji of baesujiSetting) {
        basujiDataList.value.push(basuji)
      }
    }

    let startDate = new Date()
    const changeStartDate = (date) => {
      startDate = date
    }

    const search = async () => {
      try {
        clearChart()
        let zoneData = []
        zoneData = JSON.parse(JSON.stringify(ComboList.value))
        if (zoneData != null && zoneData.length > 0) {
          // console.log('tag: ', zoneData[selectedTtemIndex.value].LEI_TAG)
          selectBtn(zoneData[selectedTtemIndex.value].LEI_TAG)
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const clearChart = () => {
      // 차트 초기화
      Plotly.purge(lineRef.value)
      Plotly.purge(donutRef.value)
    }

    /**
     *  1. 페이지 로드 DaySelect(); basujiList(0); sujiSunsi(); 함수 실행
     */
    const store = useStore()
    const ComboList = computed(() => store.getters['sujiSelect2/getCombo'])
    const BasujiList = computed(() => store.getters['sujiSelect2/getBasuji'])
    const DaySelect = () => {
      startDate = new Date()
    }

    const comboSelect = async () => {
      // server에서 데이터 가져와서 combobox 데이터 생성 구간
      try {
        const List = []
        await store.dispatch('sujiSelect2/fetchComboList')
        const result = JSON.parse(JSON.stringify(ComboList.value))
        if (result.length === 0) {
          // console.log('ComboList is empty')
          return
        }
        // console.log('ComboList: ', result)
        for (let i = 0; i < result.length; i++) {
          List.push({ text: result[i].TNK_GRP_NM, value: result[i].TNK_GRP_NM })
        }
        await basujiList(0)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const basujiList = async (idx) => {
      try {
        let Zone = []
        // await store.dispatch('sujiSelect2/fetchComboList');
        // console.log(ComboList.value)
        Zone = JSON.parse(JSON.stringify(ComboList.value))
        if (Zone.length === 0) {
          // console.log('ComboList is empty')
          return
        }
        // reservoirData = [];
        baesujiSetting = []
        for (let i = 0; i < Zone.length; i++) {
          baesujiSetting.push({
            idx: Zone[i].TNK_GRP_IDX,
            TNK_GRP_NM: Zone[i].TNK_GRP_NM
          })
        }
        getBasujiList()
        selectBtn(Zone[idx].LEI_TAG)
      } catch (err) {
        log.logError(err.message);
      }
    }
    const handleClick = (idx, value) => {
      try {
        selectedTtemIndex.value = idx
        let zoneData = []
        const zone = []
        zoneData = JSON.parse(JSON.stringify(ComboList.value))
        if (zoneData != null && zoneData.length > 0) {
          for (let i = 0; i < zoneData.length; i++) {
            if (value === zoneData[i].TNK_GRP_NM) {
              zone.push(zoneData[i])
            }
          }
        }
        selectBtn(zone[0].LEI_TAG)
      } catch (err) {
        log.logError(err.message);
      }
    }

    // promise test 진행 후 완료 되면 밑 함수 제거
    const sujiSunsi = () => {
      try {
        baeSujiSunsiList.value = []
        return new Promise((resolve, reject) => {
          for (let i = 0; i < baeSujiSunsi.length; i++) {
            const item = baeSujiSunsi[i]
            const data = { TNK_GRP_NM: item.TNK_GRP_NM, 수위: item['수위'] }
            baeSujiSunsiList.value.push(data)
          }
          resolve()
        })
      } catch (err) {
        log.logError(err.message);
      }
    }

    // const sujiSunsi = (value) => {
    //   baeSujiSunsiList.length = 0; // 기존 데이터 초기화해야
    //   for(let i=0; i<baeSujiSunsi.length; i++) {
    //     const item = baeSujiSunsi[i];
    //     const data = {
    //       TNK_GRP_NM: item.TNK_GRP_NM,
    //       수위: item['수위']
    //     };
    //     baeSujiSunsiList.push(data);
    //   }
    //   console.log('sujiSunsi > ', baeSujiSunsiList)
    // }

    const selectBtn = async (tag) => {
      try {
        emit('update:isLoading', true)
        const param = {
          search: '',
          search2: tag
        }
        param.search = moment(startDate).format('YYYY-MM-DD')
        await store.dispatch('sujiSelect2/fetchBasujiList', param)
        let data1 = []
        let data2 = []
        let result
        if (BasujiList.value != null) {
          result = JSON.parse(JSON.stringify(BasujiList.value))
          if (result.length === 0) {
            // console.log('BasujiList is empty')
            return
          }
          // console.log('BasujiList: ', result)
          data1 = result.data1
          data2 = result.data2
          baeSujiSunsi = result.data3
          if (baeSujiSunsi.length > 0) {
            sujiSunsi()
          }
          if (data1.length > 0) {
            lineChart(data1)
          } else {
            Plotly.purge(lineRef.value)
          }
          if (data2.length > 0) {
            donutChart(data2)
          } else {
            Plotly.purge(donutRef.value)
          }
        }
      } catch (err) {
        log.logError(err.message);
      } finally {
        emit('update:isLoading', false)
      }
    }

    const donutChart = (data) => {
      const chartColor = ['#6D5495', '#a866ad', '#846EFF', '#C2AFFF', '#EF5656', '#EA6464', '#4931D3', '#9C98B2', '#3B0A89', '#B64B8D', '#9922AF', '#490755']
      const pieLayout = {
        legend: { font: { color: '#FFF' } },
        height: donutRef.value.clientHeight,
        margin: { t: 30, l: 70, r: 30, b: 30 },
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        font: { family: 'KHNPHDRegular' }
      }
      const values = []
      const labels = []
      for (let i = 0; i < data.length; i++) {
        values.push(data[i].수위)
        labels.push(data[i].TNK_GRP_NM)
      }
      const pieData = [{
        values: values,
        labels: labels,
        marker: {
          colors: chartColor
        },
        hole: 0.4,
        type: 'pie',
        hoverinfo: 'label_percent',
        textfont: { family: 'KHNPHDRegular', color: '#FFF' }
      }]
      Plotly.newPlot(donutRef.value, pieData, pieLayout)
    }

    const lineChart = (data) => {
      const plotLayout = {
        height: lineRef.value.clientHeight,
        legend: { font: { color: '#fff' } },
        showlegend: false,
        margin: { t: 40, l: 80, r: 80, b: 80 },
        modebar: { activecolor: 'blue' },
        hovermode: 'x',
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%H:%M' },
        yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
        font: { family: 'KHNPHDReqular' }
      }
      const x = []
      const y = []
      const chartData = []
      for (let i = 0; i < data.length; i++) {
        x.push(data[i].ts)
        y.push(data[i].VALUE) // gelix_lsj value > VALUE 변경
      }
      chartData.push({ mode: 'lines', name: '', x: x, y: y, visible: true, line: { shape: 'spline' } })
      plotLayout.yaxis.title = 'm'
      Plotly.newPlot(lineRef.value, chartData, plotLayout)
    }

    const nc = (value) => {
      let flag = false
      if (value !== undefined && value !== 'undefined' && value !== 'null' && value !== '') {
        flag = true
      }
      return flag
    }

    onMounted(() => {
      getReservoirList()
      DaySelect()
      comboSelect()
    })

    const selectedTtemIndex = ref(0)
    const selectItemStyle = computed(() => {
      return (index) => ({
        width: 'calc(100% - 10px)',
        height: '40px',
        color: '#fff',
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: '40px',
        background: selectedTtemIndex.value === index ? `url(${require('@/assets/img/div_new.png')}) no-repeat center` : 'none',
        backgroundSize: selectedTtemIndex.value === index ? '100% 100%' : 'none',
        border: selectedTtemIndex.value === index ? '2px solid #ffffff8a' : 'none'
      })
    })

    return {
      baeSujiSunsiList,
      basujiDataList,
      basujiList,
      lineRef,
      donutRef,
      selectedData,
      getBasujiList,
      nc,
      sujiSunsi,
      handleClick,
      changeStartDate,
      search,
      selectItemStyle
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';

.btn_design:hover {
  cursor: pointer;
}

.basuji_img {
  height: 100%;
  padding: 5%;
  background: url('@/assets/img/analysis/table_bg_03.png');
  background-size: 100% 100%;
  background-position: bottom;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .img_2 {
    width: inherit;
    height: inherit;
    margin: 10px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
}

.basuji_img_arrow {
  width: calc(5% - 3px);
  margin-top: 50px;
  height: calc(67% - 26px);
  background: url('@/assets/img/ai_arrow_right.png') no-repeat;
  background-size: 100% 50%;
  background-position: center;
  float: left;
  mix-blend-mode: color-dodge;
}

.basuji_height {
  height: calc(100% - 40px);
  width: 100%;
}

.sujiSelect_container {
  display: flex;
  justify-content: flex-end;
  margin-right: 42px;
  margin-left: 22px;
  align-items: center;
  width: 99%;
  height: 40px;
  margin-top: 20px;
}

.div_small {
  height: calc(100% / 3 - 5px);
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  text-align: center;
}

.div-small {
  width: calc(100% - 10px);
  height: calc(100% / 3 - 15px);
  background-image: url('@/assets/img/box_bg_small.png');
  background-size: 100% 100%;
  float: left;
  display: flex !important;
  justify-content: center;
}

.bottom_all1 {
  color: #fff;
  font-family: 'KHNPHDRegular';
  font-size: 20px;
  width: 40%;
  text-align: right;
}

.bottom_all2 {
  font-size: 18px;
  width: 55%;
  font-family: 'KHNPHDRegular';
  letter-spacing: normal;
  color: #c3eaff;
}

.bottom_all2_value {
  font-family: LABDigital;
  font-size: 25px;
  margin: 0 5px;
  color: #fff;
}

.plate_img {
  background: url('@/assets/img/plate_img.png') no-repeat;
  background-position: bottom;
  background-size: 95% calc(19% - 40px);
}
</style>
