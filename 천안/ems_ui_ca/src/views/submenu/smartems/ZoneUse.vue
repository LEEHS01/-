<template>
  <div class="title_wrap">
    <span class="title">시설별 사용량</span>
    <div class="title_line"></div>
  </div>
  <div style="width:97.6%;height:40px">
    <span class="buttonArea" style="float:right">
      <span class="button" @click="fillBox()">조회</span>
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
  <div class="contents">
    <div class="main">
      <div class="water-h-flow-@/assets/img one fadein">
        <div class="buble delay1"></div>
      </div>
      <div class="water-h-flow-@/assets/img two fadein">
        <div class="buble delay1"></div>
      </div>
      <div class="water-h-flow-@/assets/img three fadein">
        <div class="buble delay1"></div>
      </div>
      <div class="water-h-flow-@/assets/img four fadein">
        <div class="buble delay1"></div>
      </div>
      <div class="water-h-flow-@/assets/img five fadein">
        <div class="buble delay1"></div>
      </div>
      <div class="water-h-flow-@/assets/img six fadein">
        <div class="buble delay1"></div>
      </div>
      <div class="contents-container">
        <div class="left_box" style="width: 25%">
          <div class="fL" style="width: 45%; height: 100%;">
            <div class="box" style="margin: 30px 0; height: calc(50% - 80px); padding: 0 15px; width: calc(100% - 30px);">
              <div class="bottom-information">순시전력</div>
              <div class="bottom-information">전력량</div>
              <div class="bottom-information">시간당 최대전력</div>
              <div class="bottom-information">최대 전력 시간대</div>
            </div>
          </div>
          <div class="fR contents-box paddingfix" style="width: 55%; height: 100%;">
            <div class="box">
              <div class="box-contents-title img-position-top">농축조동</div>
              <div class="box-value-contents" style="margin-top: 20px;">
                <div class="box-value-contents__value" style="color: yellow">{{ boxData.data_농축조동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('농축조동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_농축조동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_농축조동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_농축조동_최대전력시간 }}</div>
              </div>
            </div>
            <div class="box box_bottom">
              <div class="box-value-contents" style="margin-top: 21px;">
                <div class="box-value-contents__value" style="color: yellow">{{ boxData.data_배출수동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('배출수동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_배출수동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_배출수동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_배출수동_최대전력시간 }}</div>
              </div>
              <div class="box-contents-title img-position-bottom" style="margin: 20px 0 0 0;">배출수동</div>
            </div>
          </div>
        </div>
        <div class="middle_box" style="width: 12.5%">
          <div class="contents-box">
            <div class="box">
              <div class="box-contents-title img-position-top">송수펌프동</div>
              <div class="box-value-contents" style="margin-top: 20px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_송수펌프동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('송수펌프동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_송수펌프동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_송수펌프동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_송수펌프동_최대전력시간 }}</div>
              </div>
            </div>
            <div class="box box_bottom">
              <div class="box-value-contents" style="margin-top: 21px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_약품동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('약품동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_약품동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_약품동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_약품동_최대전력시간 }}</div>
              </div>
              <div class="box-contents-title img-position-bottom" style="margin: 20px 0 0 0;">약품동</div>
            </div>
          </div>
        </div>
        <div class="middle_box" style="width: 12.5%">
          <div class="contents-box">
            <div class="box">
              <div class="box-contents-title img-position-top">여과지동</div>
              <div class="box-value-contents" style="margin-top: 20px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_여과지동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('여과지동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_여과지동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_여과지동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_여과지동_최대전력시간 }}</div>
              </div>
            </div>
            <div class="box box_bottom">
              <div class="box-value-contents" style="margin-top: 21px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_응집침전지동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('응집침전지동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_응집침전지동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_응집침전지동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_응집침전지동_최대전력시간 }}</div>
              </div>
              <div class="box-contents-title img-position-bottom" style="margin: 20px 0 0 0;">응집침전지동</div>
            </div>
          </div>
        </div>
        <div class="middle_box" style="width: 12.5%">
          <div class="contents-box">
            <div class="box">
              <div class="box-contents-title img-position-top">탈수기동</div>
              <div class="box-value-contents" style="margin-top: 20px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_탈수기동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('탈수기동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_탈수기동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_탈수기동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_탈수기동_최대전력시간 }}</div>
              </div>
            </div>
            <div class="box box_bottom">
              <div class="box-value-contents" style="margin-top: 21px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_3단계농축슬러지펌프동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('3단계농축슬러지펌프동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계농축슬러지펌프동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계농축슬러지펌프동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_3단계농축슬러지펌프동_최대전력시간 }}</div>
              </div>
              <div class="box-contents-title img-position-bottom" style="margin: 20px 0 0 0;">3단계농축슬러지펌프동</div>
            </div>
          </div>
        </div>
        <div class="middle_box" style="width: 12.5%">
          <div class="contents-box">
            <div class="box">
              <div class="box-contents-title img-position-top">3단계송수펌프동</div>
              <div class="box-value-contents" style="margin-top: 20px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_3단계송수펌프동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('3단계송수펌프동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계송수펌프동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계송수펌프동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_3단계송수펌프동_최대전력시간 }}</div>
              </div>
            </div>
            <div class="box box_bottom">
              <div class="box-value-contents" style="margin-top: 21px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_3단계여과지동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('3단계여과지동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계여과지동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계여과지동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_3단계여과지동_최대전력시간 }}</div>
              </div>
              <div class="box-contents-title img-position-bottom" style="margin: 20px 0 0 0;">3단계여과지동</div>
            </div>
          </div>
        </div>
        <div class="right_box" style="width: 25%">
          <div class="fL contents-box" style="width: 55%; height: 100%;">
            <div class="box">
              <div class="box-contents-title img-position-top">3단계정수지동</div>
              <div class="box-value-contents" style="margin-top: 20px;">
                <div class="box-value-contents__value" style="color: yellow">{{ boxData.data_3단계정수지동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('3단계정수지동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계정수지동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계정수지동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_3단계정수지동_최대전력시간 }}</div>
              </div>
            </div>
            <div class="box box_bottom">
              <div class="box-value-contents" style="margin-top: 21px;">
                <div class="box-value-contents__value" :style="{ color: 'yellow' }">{{ boxData.data_3단계착수정동_순시전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
                <div class="chart-icon" @click="sunsiChart('3단계착수정동')"></div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계착수정동_전력량 }}</div>
                <div class="box-value-contents__unit">kWh</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value">{{ boxData.data_3단계착수정동_최대전력 }}</div>
                <div class="box-value-contents__unit">kW</div>
              </div>
              <div class="box-value-contents">
                <div class="box-value-contents__value date_text" style="width: 100%; text-align: center;">{{ boxData.data_3단계착수정동_최대전력시간 }}</div>
              </div>
              <div class="box-contents-title img-position-bottom" style="margin: 20px 0 0 0;">3단계착수정동</div>
            </div>
          </div>
          <div class="fR" style="width: 45%; height: 100%;">
            <div class="box" style="margin: 60px 0 0 0; height: calc(50% - 60px); padding: 0 0 0 25px; width: calc(100% - 25px);">
              <div class="box-top-title">총 전력량</div>
              <div class="box-bottom">
                <div class="box-bottom__value">{{ totalValue }}</div>
                <div class="box-bottom__unit">kWh</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="width: 100%; height: calc(40% - 10px); margin-top: 10px;">
    <div class="fL" style="width: calc(20% - 10px);">
      <div class="div_title fontContent">합계</div>
      <div class="div-small plate_img" style="margin-right: 10px;">
        <div ref="barRef" class="items4ChartArea"></div>
      </div>
    </div>
    <div class="fL" style="width: calc(20% - 10px);">
      <div class="div_title fontContent">분포도</div>
      <div class="div-small plate_img" style="margin-right: 10px;">
        <div ref="donutRef" class="items4ChartArea"></div>
      </div>
    </div>
    <div class="fL" style="width: 60%;">
      <div class="div_title fontContent">트렌드</div>
      <div class="div-middle plate_img">
        <div ref="lineRef" class="items4ChartArea"></div>
      </div>
    </div>
  </div>
  <div>
    <transition name="modal" appear v-show="showModal">
      <div class="modal modal-overlay" @click.self="closeModal">
        <div class="modal-window">
          <div class="modal-content">
            <div class="chart-popup">
              <div ref="sunsiRef"></div>
            </div>
          </div>
          <footer class="modal-footer">
            <div class="footer">
              <button @click="closeModal">X</button>
            </div>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { comma, groupBy } from '@/utils/utils.js'
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
    const sunsiData = computed(() => store.getters['zoneUse/getSisul_sunsi'])
    const sunsiChartData = computed(() => store.getters['zoneUse/getSunsiChart'])
    const searchData = computed(() => store.getters['zoneUse/getSelectZoneUseList'])

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
    const boxData = reactive({
      data_농축조동_전력량: '',
      data_농축조동_최대전력: '',
      data_농축조동_최대전력시간: '',
      data_농축조동_순시전력: '',
      data_배출수동_전력량: '',
      data_배출수동_최대전력: '',
      data_배출수동_최대전력시간: '',
      data_배출수동_순시전력: '',
      data_송수펌프동_전력량: '',
      data_송수펌프동_최대전력: '',
      data_송수펌프동_최대전력시간: '',
      data_송수펌프동_순시전력: '',
      data_약품동_전력량: '',
      data_약품동_최대전력: '',
      data_약품동_최대전력시간: '',
      data_약품동_순시전력: '',
      data_여과지동_전력량: '',
      data_여과지동_최대전력: '',
      data_여과지동_최대전력시간: '',
      data_여과지동_순시전력: '',
      data_응집침전지동_전력량: '',
      data_응집침전지동_최대전력: '',
      data_응집침전지동_최대전력시간: '',
      data_응집침전지동_순시전력: '',
      data_탈수기동_전력량: '',
      data_탈수기동_최대전력: '',
      data_탈수기동_최대전력시간: '',
      data_탈수기동_순시전력: '',
      data_3단계농축슬러지펌프동_전력량: '',
      data_3단계농축슬러지펌프동_최대전력: '',
      data_3단계농축슬러지펌프동_최대전력시간: '',
      data_3단계농축슬러지펌프동_순시전력: '',
      data_3단계여과지동_전력량: '',
      data_3단계여과지동_최대전력: '',
      data_3단계여과지동_최대전력시간: '',
      data_3단계여과지동_순시전력: '',
      data_3단계착수정동_전력량: '',
      data_3단계착수정동_최대전력: '',
      data_3단계착수정동_최대전력시간: '',
      data_3단계착수정동_순시전력: ''
    })
    const totalValue = ref('')
    const barRef = ref(null)
    const donutRef = ref(null)
    const lineRef = ref(null)
    const sunsiRef = ref(null)

    const spinnerFunction = async () => {
      try {
        emit('update:isLoading', true)
        clearChartAndData()
        const param = {
          search: '',
          search2: '',
          search3: selectedDateMode.value
        }
        let data1 = []
        let data2 = []

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

        await store.dispatch('zoneUse/fetchSelectZoneUseList', param)
        if (searchData.value && searchData.value.length !== 0) {
          const arr = JSON.parse(JSON.stringify(searchData.value))
          if (arr.length === 0) {
            return
          }
          data1 = arr.data1
          data2 = arr.data2
          if (data1.length > 0 && data2.length > 0) {
            htmlMapping(data1, data2)
            lineChart(data1)
            donutChart(data2)
            barChart(data2)
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

    const htmlMapping = (data, data2) => {
      try {
        const groupedData1 = groupBy(data, 'zone_name')
        const groupedData2 = groupBy(data2, 'zone_name')
        const yMax = {}
        let sum = 0

        for (const i in groupedData1) {
          const maxValue = Math.max(...groupedData1[i].map((o) => o.y))
          yMax[i] = maxValue

          boxData[`data_${i}_전력량`] = comma(Number(groupedData2[i][0].y).toFixed(0)) // 전력량
          boxData[`data_${i}_최대전력`] = comma(Number(yMax[i]).toFixed(0)) // 시간당 최대전력
          sum += groupedData2[i][0].y

          const maxItem = groupedData1[i].find(item => item.y === maxValue)
          if (maxItem) {
            boxData[`data_${i}_최대전력시간`] = maxItem.x // 최대 전력 시간대
          }
        }

        totalValue.value = comma(sum.toFixed(0)) // 총 전력량
      } catch (err) {
        log.logError(err.message);
      }
    }

    /* 차트 관련 API들 */
    const clearChartAndData = () => {
      // 데이터 초기화
      for (const key in boxData) {
        boxData[key] = ''
      }
      totalValue.value = ''
      // 차트 초기화
      Plotly.purge(barRef.value)
      Plotly.purge(donutRef.value)
      Plotly.purge(lineRef.value)
    }

    const chartColor = ['#6D5495', '#a866ad', '#846EFF', '#C2AFFF', '#EF5656', '#EA6464', '#4931D3', '#9C98B2', '#3B0A89', '#B64B8D', '#9922AF', '#490755']
    const lineChart = (data) => {
      try {
        const tagGroup = groupBy(data, 'zone_name')
        const chartData = []
        let cnt = 0

        for (const i in tagGroup) {
          const x = []
          const y = []
          for (let j = 0; j < tagGroup[i].length; j++) {
            x.push(tagGroup[i][j].x)
            y.push(tagGroup[i][j].y)
          }
          if (cnt === 0) {
            chartData.push({
              fill: 'tozeroy',
              mode: 'lines',
              name: i,
              x: x,
              y: y,
              visible: true,
              line: { shape: 'spline', color: chartColor[cnt] }
            })
          } else {
            chartData.push({
              fill: 'tozeroy',
              mode: 'lines',
              name: i,
              x: x,
              y: y,
              visible: 'legendonly',
              line: { shape: 'spline', color: chartColor[cnt] }
            })
          }
          cnt++
        }

        const plotLayout = {
          height: 300,
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

        frame(chartData)
        Plotly.newPlot(lineRef.value, chartData, plotLayout).then(function () {
          Plotly.animate(lineRef.value, frame(chartData), { transition: { duration: 0 }, frame: { duration: 0, redraw: false } })
        })

        const myPlot = lineRef.value
        myPlot.on('plotly_click', function (data) {
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].visible = 'legendonly'
          }
          data.data[data.curveNumber].visible = true
          if (selectedDateMode.value === 'h') {
            plotLayout.xaxis.tickformat = '%Y-%m-%d %H:%M'
          } else if (selectedDateMode.value === 'd') {
            plotLayout.xaxis.tickformat = '%Y-%m-%d'
          } else if (selectedDateMode.value === 'm') {
            plotLayout.xaxis.tickformat = '%Y-%m'
          } else {
            plotLayout.xaxis.tickformat = '%Y'
          }

          Plotly.relayout(lineRef.value)
        })
      } catch (err) {
        log.logError(err.message);
      }
    }

    const donutChart = (data) => {
      try {
        const values = []
        const labels = []
        for (let i = 0; i < data.length; i++) {
          values.push(data[i].y)
          labels.push(data[i].zone_name)
        }
        const pieData = [
          {
            values: values,
            labels: labels,
            marker: {
              colors: chartColor
            },
            hole: 0.4,
            type: 'pie',
            hoverinfo: 'label+percent',
            textfont: { family: 'KHNPHDRegular', color: '#FFF' }
          }
        ]
        const pieLayout = {
          legend: { font: { color: '#FFF' } },
          height: 300,
          margin: { t: 30, l: 30, r: 30, b: 30 },
          showlegend: false,
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
          labels.push(data[i].zone_name)
        }

        const barData = [
          {
            y: labels,
            x: values,
            type: 'bar',
            marker: {
              color: chartColor
            },
            orientation: 'h'
          }
        ]

        const barLayout = {
          height: 300,
          margin: { t: 30, l: 90, r: 20, b: 30 },
          legend: { font: { color: '#FFF' } },
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }

        Plotly.newPlot(barRef.value, barData, barLayout)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const sunsiChart = async (name) => {
      try {
        const param = {
          search: name
        }

        await store.dispatch('zoneUse/fetchSunsiChart', param)
        if (sunsiChartData.value && sunsiChartData.value.length !== 0) {
          showModal.value = true
        } else {
          return false
        }

        const result = JSON.parse(JSON.stringify(sunsiChartData.value))
        if (result.length === 0) {
          return
        }

        const chartDataArr = []
        const x = []
        const y = []

        for (let i = 0; i < result.length; i++) {
          x.push(result[i].x)
          y.push(result[i].y)
        }

        chartDataArr.push({
          mode: 'lines',
          name: result[0].zone_name,
          x: x,
          y: y,
          visible: true,
          line: { shape: 'spline' }
        })
        const plotLayout = {
          height: 300,
          legend: { font: { color: '#FFF' } },
          showlegend: true,
          margin: { t: 40, l: 80, r: 80, b: 80 },
          modebar: { activecolor: 'blue' },
          hovermode: 'x',
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { color: '#FFF', showline: true, showgrid: false, tickformat: '%Y-%m-%d %H:%M' },
          yaxis: { color: '#FFF', showline: true, showgrid: false, exponentformat: 'none', fixedrange: true },
          font: { family: 'KHNPHDRegular' }
        }
        plotLayout.yaxis.title = 'kW'

        Plotly.newPlot(sunsiRef.value, chartDataArr, plotLayout)
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

    const getSunsiData = async () => {
      try {
        await store.dispatch('zoneUse/fetchSisul_sunsi')
        if (sunsiData.value && sunsiData.value.length > 0) {
          const result = JSON.parse(JSON.stringify(sunsiData.value))
          // 현재 순시전력 연동
          result.forEach((item) => {
            const zoneName = `data_${item.zone_name}_순시전력`
            boxData[zoneName] = item.y
          })
        }
      } catch (err) {
        log.logError(err.message);
      }
    }
    // 팝업 차트 관련
    const showModal = ref(false)

    const closeModal = (data) => {
      showModal.value = false
      sunsiRef.value = ref(null)
    }

    const fillBox = async () => {
      await spinnerFunction()
      await getSunsiData()
    }

    onMounted(() => {
      getDateModeList()
      // getSunsiData()
      // // 페이지 진입 시 오늘 날짜로 조회
      // spinnerFunction()
      fillBox()
    })

    return {
      dateModeList,
      selectedDateMode,
      startDate,
      endDate,
      boxData,
      totalValue,
      barRef,
      donutRef,
      lineRef,
      sunsiRef,
      showModal,
      fillBox,
      spinnerFunction,
      sunsiChart,
      changeDateMode,
      changeStartDate,
      changeEndDate,
      closeModal
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/layout.scss';
@import '~@/style/component/title.scss';

/*div 박스 테두리 이미지*/
.div-middle {
	width: calc(100% - 10px);
	height: calc(100% - 40px);
	background-color: 'transparent';
	background-image: url(@/assets/img/box_bg_middle.png);
	background-size: 100% 100%;
}

.div-small {
	width: calc(100% - 10px);
	height: calc(100% - 40px);
	background-color: 'transparent';
	background-image: url(@/assets/img/box_bg_small.png);
	background-size: 100% 100%;
}

.contents {
	display: flex;
	width: 100%;
	height: calc(60% - 90px);
}

.main {
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
}

.contents-container {
	display: flex;
	width: 1826px;
	height: 369px;
}

.contents-container .contents-box-other {
	width: 9%;
	height: 100%;
}

.contents-container .contents-box {
	/* width: 20%;
    height: 100%;
    margin: 0 auto; */
	height: 100%;
	margin: 0 auto;
}

.contents-container .box {
	display: flex;
	flex-flow: column;
	align-items: center;
	width: 100%;
	height: 50%;
	margin: -26px 0 55px 0;
}

.contents-container .box .box-contents-title {
	height: 40px;
    background: url(@/assets/img/title_bar.png) no-repeat;
    background-size: 100% 100%;
    mix-blend-mode: luminosity;
    color: #ffffff;
    font-family: 'KHNPHDBold';
    font-size: 18px;
    text-shadow: 0 0 10px #000;
    line-height: 2;
    text-indent: 3%;
    width:100%;
    text-align:center
}

.contents-container .box .box-value-contents {
	display: flex;
	width: 100%;
	height:27px;
}

.contents-container .box .box-value-contents__value {
	width: 50%;
	text-shadow: 0 0 9px #5cafff;
	font-size: 19px; /* 데이터 숫자는 30px~18px 사이 숫자 사용해야함 */
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.56;
	letter-spacing: normal;
	text-align: right;
	color: #fff;
	font-family: "LAB디지털" !important;
}

.contents-container .box .box-value-contents__unit {
	width: 25%;
	margin-left: 15.5px;
	font-size: 18px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.79;
	letter-spacing: normal;
	text-align: left;
	color: #a4ceed;
}

.contents-container .box .box-top-title {
	text-shadow: 0 0 9px #5cafff;
	font-size: 20px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.56;
	letter-spacing: normal;
	text-align: right;
	width: 85%;
	color: #fff;
}

.contents-container .box .box-bottom {
	display: flex;
	width: 90%;
	height: 43px;
	margin-top: 10px;
	-o-object-fit: contain;
	object-fit: contain;
	border: solid 1px rgb(72 156 242);
	border-radius: 5px;
}

.contents-container .box .box-bottom__value {
	width: 80%;
	text-shadow: 0 0 5px rgb(209 250 255/ 50%);
	font-family: "LAB디지털" !important;
	font-size: 24px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.6;
	letter-spacing: normal;
	text-align: right;
	color: #ffffff;
}

.contents-container .box .box-bottom__unit {
	margin: 0 5px 0 10px;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 2.7;
	letter-spacing: normal;
	text-align: left;
	color: #417db9;
}

.contents-container .box .bottom-information {
	width: 80%;
	background-position-y: center;
	background-position-x: 20px;
	text-shadow: 0 0 9px #5cafff;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.7;
	letter-spacing: normal;
	text-align: right;
	color: #ffffff;
}

.contents-container .other-bottom-padding {
	padding-top: 36px;
}

.date_text {
	color: #c3eaff !important;
	font-size: 18px !important;
}

.one {
	position: absolute;
	width: 120px;
	height: 8px;
	left: 100px;
	animation: 4s fadein;
}

.two {
	position: absolute;
	width: 120px;
	height: 8px;
	left: 400px;
}

.three {
	position: absolute;
	width: 120px;
	height: 8px;
	left: 700px;
}

.four {
	position: absolute;
	width: 120px;
	height: 8px;
	left: 1000px;
}

.five {
	position: absolute;
	width: 120px;
	height: 8px;
	left: 1300px;
}

.six {
	position: absolute;
	width: 120px;
	height: 8px;
	right: 160px;
}

.buble {
	background-image: url("@/assets/img/pipe_elec.png");
	background-size: 100% 100%;
	width: 20px;
	height: 20px;
	position: absolute;
	left: 120px;
	top: -7px;
	transform: rotate(45deg);
}

.delay1 {
	animation: 3s slide-right;
	animation-delay: 0s;
	animation-iteration-count: infinite;
}

.fadein {
	animation: 3s fadein;
	animation-delay: 0s;
	animation-iteration-count: infinite;
}

@keyframes slide-right {from { margin-left:-200px;}to {margin-left: 0%;}}
@keyframes fadein { 0% {opacity: 0;}50%{opacity:1;}100%{opacity:0;}}

.box_bottom {
	justify-content: flex-end;
	margin: -17px 0 -15px 0 !important;
}

.left_box {
	background: url(@/assets/img/left_box.png);
	background-size: 100% 100%;
}

.left_box:after {
	opacity: 0.5 !important;;
}

.middle_box {
	background: url(@/assets/img/middle_box.png);
	background-size: 100% 100%;
}

.right_box {
	background: url(@/assets/img/right_box.png);
	background-size: 100% 100%;
}

.fL {
	float: left;
  height: 100%;
}

.fR {
	float: right;
}

.fontContent {
    font-family: KHNPHDRegular;
    font-size: 18px;
    color: white;
    text-shadow: 0 0 9px #5cafff;
}

.chart-icon {
  background-image: url("@/assets/img/chartIcon.png");
  background-size: 100% 100%;
  width: 35px;
  height: 25px;
  margin-top: 5px;
  cursor: pointer;
}

.chart-popup {
  background-image: url("@/assets/img/img03.png");
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
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
  }

  &-content {
    padding: 10px 20px;
  }

  &-footer {
    background: #ccc;
    padding: 10px;
    text-align: right;
  }
}

// 오버레이 트랜지션
.modal-enter-active, .modal-leave-active {
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

.modal-enter, .modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
