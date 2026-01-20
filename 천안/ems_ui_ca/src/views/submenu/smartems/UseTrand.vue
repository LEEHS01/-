<template>
  <div class="title_wrap">
    <span class="title">사용량 트렌드</span>
    <div class="title_line"></div>
  </div>
  <div style="width: 100%; height: calc(100% - 60px); margin-top: 20px; float: left;">
    <div style="height: calc(55% - 20px); width: calc(100% - 20px); padding: 0 10px 10px 10px; margin-bottom: 10px;">
      <div class="fL div-middle plate_img" style="height: 100%; width: calc(60% - 30px); margin-right: 10px; padding: 0 10px 10px 10px;">
        <div style="padding: 0 10px 10px 10px; width: calc(100% - 20px); height: calc(100% - 10px);">
          <div class="div_title">전력 사용량</div>
          <div style="width: 93%; height: 40px; display: flex; align-items: center; margin: 5px 0; justify-content: flex-end;">
            <span style="float:left">
              <div class="date_design">
                <select class="drop-down" v-model="selectedDateMode" @change="changeDateMode">
                  <option v-for="(dateMode, idx) in dateModeList" :key="idx" :value="dateMode.value">
                    {{dateMode.text}}
                  </option>
                </select>
              </div>
            </span>
            <span style="float:left" class="calArea">
              <div class="date_design DateTime">
                <CalendarFormat :calendarMode = selectedDateMode @changeDate="changeStartDate" />
              </div>
            </span>
            <span style="float:left" class="calArea">
              <div class="date_design DateTime">
                <CalendarFormat :calendarMode = selectedDateMode @changeDate="changeEndDate" />
              </div>
            </span>
            <span class="buttonArea fL">
              <span class="button" @click="spinnerFunction()">조회</span>
            </span>
          </div>
          <div ref="plotRef" style="height: calc(100% - 90px);"></div>
        </div>
      </div>
      <div class="fL div-middle plate_img" style="height: 100%; width: calc(40% - 20px); padding: 0 10px 10px 10px;">
        <div style="padding: 0 10px 10px 10px; width: calc(100% - 20px); height: calc(100% - 10px);">
          <div class="div_title">최대 피크 현황</div>
          <div style="width: 100%; height: 40px; display: flex; align-items: center; margin: 5px 0;"></div>
          <div ref="barRef" style="height: calc(90% - 50px);"></div>
        </div>
      </div>
    </div>
    <div style="height: calc(43% - 10px); width: calc(100% - 20px); padding: 0 10px 10px 10px;">
      <div class="fL" :style="{ height: '100%', width: 'calc(100% / 3)' }">
        <div class="div_title" style="margin-top: 20px; margin-bottom: 3px;">금일 누적 전기 사용량</div>
        <div style="height: calc(100% - 60px);">
          <div class="div-small div_small">
            <div class="bottom_all1">전체</div>
            <div class="bottom_all2">사용량 <span class="bottom_all2_value" v-html="todayTkWh"></span>kWh </div>
            <div class="bottom_all2">비용 <span class="bottom_all2_value" v-html="todayTcost"></span>원 </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">경부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: todayLkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: todayLcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ todayLkWhPer }}</div>
              <div class="bottom_all3_1">{{ todayLcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="todayLkWh"></div>
              <div class="bottom_all3_1" v-html="todayLcost"></div>
            </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">중부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: todayMkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: todayMcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ todayMkWhPer }}</div>
              <div class="bottom_all3_1">{{ todayMcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="todayMkWh"></div>
              <div class="bottom_all3_1" v-html="todayMcost"></div>
            </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">최대부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: todayHkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: todayHcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ todayHkWhPer }}</div>
              <div class="bottom_all3_1">{{ todayHcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="todayHkWh"></div>
              <div class="bottom_all3_1" v-html="todayHcost"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="fL" style="height: 100%; width:calc(100% / 3)">
        <div class="div_title" style="margin-top: 20px; margin-bottom: 3px;">금월 누적 전기 사용량</div>
        <div style="height: calc(100% - 60px);">
          <div class="div-small div_small">
            <div class="bottom_all1"> 전체</div>
            <div class="bottom_all2">사용량 <span class="bottom_all2_value" v-html="monthTkWh"></span>kWh </div>
            <div class="bottom_all2">비용 <span class="bottom_all2_value" v-html="monthTcost"></span>원 </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">경부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: monthLkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: monthLcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ monthLkWhPer }}</div>
              <div class="bottom_all3_1">{{ monthLcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="monthLkWh"></div>
              <div class="bottom_all3_1" v-html="monthLcost"></div>
            </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">중부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: monthMkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: monthMcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ monthMkWhPer }}</div>
              <div class="bottom_all3_1">{{ monthMcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="monthMkWh"></div>
              <div class="bottom_all3_1" v-html="monthMcost"></div>
            </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">최대부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: monthHkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: monthHcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ monthHkWhPer }}</div>
              <div class="bottom_all3_1">{{ monthHcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="monthHkWh"></div>
              <div class="bottom_all3_1" v-html="monthHcost"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="fL" style="height: 100%; width:calc(100% / 3)">
        <div class="div_title" style="margin-top: 20px;margin-bottom: 3px;">금년 누적 전기 사용량</div>
        <div style="height: calc(100% - 60px);">
          <div class="div-small div_small">
            <div class="bottom_all1"> 전체</div>
            <div class="bottom_all2">사용량 <span class="bottom_all2_value" v-html="yearTkWh"></span>kWh </div>
            <div class="bottom_all2">비용 <span class="bottom_all2_value" v-html="yearTcost"></span>원 </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">경부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: yearLkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: yearLcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ yearLkWhPer }}</div>
              <div class="bottom_all3_1">{{ yearLcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="yearLkWh"></div>
              <div class="bottom_all3_1" v-html="yearLcost"></div>
            </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">중부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: yearMkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: yearMcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ yearMkWhPer }}</div>
              <div class="bottom_all3_1">{{ yearMcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="yearMkWh"></div>
              <div class="bottom_all3_1" v-html="yearMcost"></div>
            </div>
          </div>
          <div class="div-small div_small">
            <div class="bottom_all1">최대부하</div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">사용량</div>
              <div class="bottom_all3_1">비용</div>
            </div>
            <div class="bottom_all4">
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: yearHkWhPerImg }"></div>
              </div>
              <div class="bottom_all3_1" style="position: relative;">
                <div class="percent_bar_bg"></div>
                <div class="percent_bar" :style="{ width: yearHcostPerImg }"></div>
              </div>
            </div>
            <div class="bottom_all3">
              <div class="bottom_all3_1">{{ yearHkWhPer }}</div>
              <div class="bottom_all3_1">{{ yearHcostPer }}</div>
            </div>
            <div class="bottom_all5">
              <div class="bottom_all3_1" v-html="yearHkWh"></div>
              <div class="bottom_all3_1" v-html="yearHcost"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { comma, commaFont, nc } from '@/utils/utils.js'
import CalendarFormat from '@/components/common/CalendarFormat.vue'
import moment from 'moment'
import Plotly from 'plotly.js/dist/plotly.js'
import log from '@/logger.js'

export default {
  components: {
    CalendarFormat
  },
  setup (props, { emit }) {
    const store = useStore()
    const searchData = computed(() => store.getters['useTrand/getSelectUseTrandList'])

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
    const todayTkWh = ref('')
    const todayTcost = ref('')
    const todayLcost = ref('')
    const todayLkWh = ref('')
    const todayMkWh = ref('')
    const todayMcost = ref('')
    const todayHkWh = ref('')
    const todayHcost = ref('')
    const todayLkWhPer = ref('')
    const todayLcostPer = ref('')
    const todayMkWhPer = ref('')
    const todayMcostPer = ref('')
    const todayHkWhPer = ref('')
    const todayHcostPer = ref('')
    const todayLkWhPerImg = ref(null)
    const todayLcostPerImg = ref(null)
    const todayMkWhPerImg = ref(null)
    const todayMcostPerImg = ref(null)
    const todayHkWhPerImg = ref(null)
    const todayHcostPerImg = ref(null)
    const monthTkWh = ref('')
    const monthTcost = ref('')
    const monthLcost = ref('')
    const monthLkWh = ref('')
    const monthMkWh = ref('')
    const monthMcost = ref('')
    const monthHkWh = ref('')
    const monthHcost = ref('')
    const monthLkWhPer = ref('')
    const monthLcostPer = ref('')
    const monthMkWhPer = ref('')
    const monthMcostPer = ref('')
    const monthHkWhPer = ref('')
    const monthHcostPer = ref('')
    const monthLkWhPerImg = ref(null)
    const monthLcostPerImg = ref(null)
    const monthMkWhPerImg = ref(null)
    const monthMcostPerImg = ref(null)
    const monthHkWhPerImg = ref(null)
    const monthHcostPerImg = ref(null)
    const yearTkWh = ref('')
    const yearTcost = ref('')
    const yearLcost = ref('')
    const yearLkWh = ref('')
    const yearMkWh = ref('')
    const yearMcost = ref('')
    const yearHkWh = ref('')
    const yearHcost = ref('')
    const yearLkWhPer = ref('')
    const yearLcostPer = ref('')
    const yearMkWhPer = ref('')
    const yearMcostPer = ref('')
    const yearHkWhPer = ref('')
    const yearHcostPer = ref('')
    const yearLkWhPerImg = ref(null)
    const yearLcostPerImg = ref(null)
    const yearMkWhPerImg = ref(null)
    const yearMcostPerImg = ref(null)
    const yearHkWhPerImg = ref(null)
    const yearHcostPerImg = ref(null)

    const spinnerFunction = async () => {
      try {
        emit('update:isLoading', true)
        // 차트 초기화
        clearChartAndData()
        const param = {
          search: '',
          search2: '',
          search3: selectedDateMode.value
        }
        let data1 = []
        let peakMax = []
        let todayTcost = []
        let todayLcost = []
        let todayMcost = []
        let todayHcost = []
        let monthT = []
        let monthL = []
        let monthM = []
        let monthH = []
        let yearT = []
        let yearL = []
        let yearM = []
        let yearH = []

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

        await store.dispatch('useTrand/fetchSetSelectUseTrandList', param)

        if (searchData.value && searchData.value.length !== 0) {
          const arr = JSON.parse(JSON.stringify(searchData.value))
          if (arr.length === 0) {
            // console.log('searchData is empty')
            return
          }
          // console.log('arr: ', arr)
          data1 = arr.data1
          peakMax = arr.peak_max
          todayTcost = arr.todayTcost
          todayLcost = arr.todayLcost
          todayMcost = arr.todayMcost
          todayHcost = arr.todayHcost
          monthT = arr.monthT
          monthL = arr.monthL
          monthM = arr.monthM
          monthH = arr.monthH
          yearT = arr.yearT
          yearL = arr.yearL
          yearM = arr.yearM
          yearH = arr.yearH

          if (data1.length !== 0) {
            plotChart(data1)
          }
          if (peakMax[0].length !== 0) {
            barChart(peakMax[0])
          }

          todayHtml(todayTcost, todayLcost, todayMcost, todayHcost)
          monthHtml(monthT, monthL, monthM, monthH)
          yearHtml(yearT, yearL, yearM, yearH)
        } else {
          return false
        }
      } catch (err) {
        log.logError(err.message);
      } finally {
        emit('update:isLoading', false)
      }
    }

    const validateAndProcessData = (data, costValue, kWhValue, data1) => {
      if (!data) {
        costValue.value = ''
        kWhValue.value = ''
        return {
          costValue: '100%',
          kWhValue: '100%',
          kWhPercentage: '100%',
          costPercentage: '100%'
        }
      }

      if (data?.[0]?.cost !== null && data?.[0]?.value !== null) {
        costValue.value = commaFont(data[0].cost) + ' 원'
        kWhValue.value = commaFont(data[0].value.toFixed(0)) + ' kWh'
        const kWhPercentage = (data[0].value / data1?.[0]?.value ?? 1) * 100
        const costPercentage = (data[0].cost / data1?.[0]?.cost ?? 1) * 100
        return {
          costValue: costValue.value,
          kWhValue: kWhValue.value,
          kWhPercentage: kWhPercentage.toFixed(1) + '%',
          costPercentage: costPercentage.toFixed(1) + '%'
        }
      } else {
        return {
          costValue: '100%',
          kWhValue: '100%',
          kWhPercentage: '100%',
          costPercentage: '100%'
        }
      }
    }

    const todayHtml = (data1, data2, data3, data4) => {
      try {
        if (!data1) {
          todayTcost.value = ''
          todayTkWh.value = ''
        } else if (data1?.[0]?.cost !== null && data1?.[0]?.value !== null) {
          todayTcost.value = commaFont(data1[0].cost)
          todayTkWh.value = commaFont(data1[0].value.toFixed(0))
        }

        const todayL = validateAndProcessData(data2, todayLcost, todayLkWh, data1)
        todayLkWhPerImg.value = todayL.kWhPercentage
        todayLcostPerImg.value = todayL.costPercentage

        const todayM = validateAndProcessData(data3, todayMcost, todayMkWh, data1)
        todayMkWhPerImg.value = todayM.kWhPercentage
        todayMcostPerImg.value = todayM.costPercentage

        const todayH = validateAndProcessData(data4, todayHcost, todayHkWh, data1)
        todayHkWhPerImg.value = todayH.kWhPercentage
        todayHcostPerImg.value = todayH.costPercentage
      } catch (err) {
        log.logError(err.message);
      }
    }

    const monthHtml = (data1, data2, data3, data4) => {
      try {
        if (!data1) {
          monthTcost.value = ''
          monthTkWh.value = ''
        } else if (data1?.[0]?.cost !== null && data1?.[0]?.value !== null) {
          monthTcost.value = commaFont(data1[0].cost)
          monthTkWh.value = commaFont(data1[0].value.toFixed(0))
        }

        const monthL = validateAndProcessData(data2, monthLcost, monthLkWh, data1)
        monthLkWhPerImg.value = monthL.kWhPercentage
        monthLcostPerImg.value = monthL.costPercentage

        const monthM = validateAndProcessData(data3, monthMcost, monthMkWh, data1)
        monthMkWhPerImg.value = monthM.kWhPercentage
        monthMcostPerImg.value = monthM.costPercentage

        const monthH = validateAndProcessData(data4, monthHcost, monthHkWh, data1)
        monthHkWhPerImg.value = monthH.kWhPercentage
        monthHcostPerImg.value = monthH.costPercentage
      } catch (err) {
        log.logError(err.message);
      }
    }

    const yearHtml = (data1, data2, data3, data4) => {
      try {
        if (!data1) {
          yearTcost.value = ''
          yearTkWh.value = ''
        } else if (data1?.[0]?.cost !== null && data1?.[0]?.value !== null) {
          yearTcost.value = commaFont(data1[0].cost)
          yearTkWh.value = commaFont(data1[0].value.toFixed(0))
        }

        const yearL = validateAndProcessData(data2, yearLcost, yearLkWh, data1)
        yearLkWhPerImg.value = yearL.kWhPercentage
        yearLcostPerImg.value = yearL.costPercentage

        const yearM = validateAndProcessData(data3, yearMcost, yearMkWh, data1)
        yearMkWhPerImg.value = yearM.kWhPercentage
        yearMcostPerImg.value = yearM.costPercentage

        const yearH = validateAndProcessData(data4, yearHcost, yearHkWh, data1)
        yearHkWhPerImg.value = yearH.kWhPercentage
        yearHcostPerImg.value = yearH.costPercentage
      } catch (err) {
        log.logError(err.message);
      }
    }

    /* 차트 관련 API들 */
    const plotRef = ref(null)
    const barRef = ref(null)
    const chartColor = ['#6D5495', '#a866ad', '#846EFF', '#C2AFFF', '#EF5656', '#EA6464', '#4931D3', '#9C98B2', '#3B0A89', '#B64B8D', '#9922AF', '#490755']

    const clearChartAndData = () => {
      // 데이터 초기화
      todayHtml(0, 0, 0, 0)
      monthHtml(0, 0, 0, 0)
      yearHtml(0, 0, 0, 0)
      // 차트 초기화
      Plotly.purge(plotRef.value)
      Plotly.purge(barRef.value)
    }

    const plotChart = (data) => {
      try {
        const chartData = []
        const x = []
        const y = []

        for (let i = 0; i < data.length; i++) {
          if (data[i].val) {
            x.push(data[i].ts)
            y.push(comma(data[i].val.toFixed(0)))
          }
        }

        const plotLayout = {
          height: plotRef.value.clientHeight,
          legend: { font: { color: '#FFF' } },
          showlegend: false,
          margin: { t: 40, l: 80, r: 80, b: 30 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }

        chartData.push({ fill: 'tozeroy', mode: 'lines', x: x, y: y, visible: true, line: { shape: 'spline' } })
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

        Plotly.newPlot(plotRef.value, chartData, plotLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const barChart = (data) => {
      try {
        const barData = [{
          y: Object.values(data),
          x: Object.keys(data),
          type: 'bar',
          marker: {
            color: chartColor
          },
          orientation: 'v'
        }]

        const barLayout = {
          height: barRef.value.clientHeight,
          margin: { t: 40, l: 100, r: 100, b: 30 },
          legend: { font: { color: '#FFF' } },
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, fixedrange: true },
          font: { family: 'KHNPHDRegular' },
          annotations: []
        }

        for (let i = 0; i < Object.values(data).length; i++) {
          let value = Object.values(data)[i]
          if (nc(value)) {
            value = parseFloat(value.replace(/,/g, ''))
            const result = {
              x: Object.keys(data)[i],
              y: value,
              text: comma(value),
              showarrow: false,
              font: {
                family: 'LABDigital',
                size: 14,
                color: '#FFF'
              }
            }

            barLayout.annotations.push(result)
          }
        }

        Plotly.newPlot(barRef.value, barData, barLayout)
      } catch (err) {
        log.logError(err.message);
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

    onMounted(() => {
      getDateModeList()
      // 페이지 진입 시 오늘 날짜로 조회
      spinnerFunction()
    })

    return {
      dateModeList,
      selectedDateMode,
      startDate,
      endDate,
      todayTkWh,
      todayTcost,
      todayLcost,
      todayLkWh,
      todayMkWh,
      todayMcost,
      todayHkWh,
      todayHcost,
      todayLkWhPer,
      todayLcostPer,
      todayMkWhPer,
      todayMcostPer,
      todayHkWhPer,
      todayHcostPer,
      todayLkWhPerImg,
      todayLcostPerImg,
      todayMkWhPerImg,
      todayMcostPerImg,
      todayHkWhPerImg,
      todayHcostPerImg,
      monthTkWh,
      monthTcost,
      monthLcost,
      monthLkWh,
      monthMkWh,
      monthMcost,
      monthHkWh,
      monthHcost,
      monthLkWhPer,
      monthLcostPer,
      monthMkWhPer,
      monthMcostPer,
      monthHkWhPer,
      monthHcostPer,
      monthLkWhPerImg,
      monthLcostPerImg,
      monthMkWhPerImg,
      monthMcostPerImg,
      monthHkWhPerImg,
      monthHcostPerImg,
      yearTkWh,
      yearTcost,
      yearLcost,
      yearLkWh,
      yearMkWh,
      yearMcost,
      yearHkWh,
      yearHcost,
      yearLkWhPer,
      yearLcostPer,
      yearMkWhPer,
      yearMcostPer,
      yearHkWhPer,
      yearHcostPer,
      yearLkWhPerImg,
      yearLcostPerImg,
      yearMkWhPerImg,
      yearMcostPerImg,
      yearHkWhPerImg,
      yearHcostPerImg,
      plotRef,
      barRef,
      spinnerFunction,
      changeDateMode,
      changeStartDate,
      changeEndDate
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/layout.scss';
@import '~@/style/component/title.scss';

.div_small {
	height: calc(100%/ 4 - 5px);
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	text-align: center;
	background-image: url(@/assets/img/div_new.png);
}

.bottom_all1 {
	width: 20%;
	color: #fff;
	font-family: 'KHNPHDRegular';
	font-size: 16px;
}

.bottom_all2 {
	width: 40%;
	font-size: 14px;
	font-family: 'KHNPHDRegular';
	letter-spacing: normal;
	color: #c3eaff;
}

.bottom_all3 {
  width: 10%;
  height: 100%;
  font-size: 14px;
  font-family: "KHNPHDRegular";
  line-height: 30px;
  letter-spacing: normal;
  color: #c3eaff;
}

.bottom_all4 {
	width: 40%;
	height: 100%;
	font-size: 14px;
	font-family: 'KHNPHDRegular';
	letter-spacing: normal;
	color: #c3eaff;
}

.bottom_all5{
	width: 20%;
	font-size: 14px;
	font-family: 'KHNPHDRegular';
	letter-spacing: normal;
	color: #c3eaff;
}

.bottom_all2_value {
	font-family: LABDigital;
	font-size: 30px;
	margin: 0 5px;
}

.bottom_all3_1 {
	height: calc(50% - 20px);
	text-align: left;
	margin: 10px 5px;
}

.percent_bar_bg {
  position: absolute;
  background: url(@/assets/img/percent_bar_bg.png);
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  z-index: 4;
  mix-blend-mode: soft-light;
}

.percent_bar {
  position: absolute;
  background: url(@/assets/img/percent_bar.png);
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  z-index: 5;
  mix-blend-mode: difference;
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
