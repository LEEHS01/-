<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="contents-body">
    <!-- title -->
    <div class="title_wrap">
      <span class="title">최적요금제 분석</span>
      <div class="title_line"></div>
    </div>

    <div class="costBg">
      <div class="fL div-box div_left_box div_side_box">
        <div class="div-line-top" style="margin-left: 12px; width:97%;"></div>
        <div class="border-small border_img" style="height:95%;">
          <div class="cal-box">
            <div class="cal_title_row">
              <span id="monthText" class="cal_tite_text"> {{ setTwoWord(state.month) }}</span>
              <span class="cal_tite_text"> 월 전력 사용량</span>
            </div>
            <div class="cal-row">
              <div class="nameTag">
                <span class="cal-title-font">용도</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value" style="width : 87%;">
                  <span class="marginR10" style="font-family: 'KHNPHDRegular'; font-size: 23px;">산업용 (을)</span>
                </div>
              </div>
            </div>

            <div class="cal-row">
              <div class="nameTag">
                <span class="cal-title-font">요금 적용 전력<br />(계약 전력)</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="PWR" class="marginR10">{{ store.state.cost.contractPower }}</span>
                </div>
                <span class="cal-unit contents_value_unit">kW</span>
              </div>
            </div>

            <div class="cal-row">
              <div class="nameTag">
                <span class="cal-title-font">데이터 누락율</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="DT_MSN_PRCNT" class="marginR10">{{ store.state.cost.dataMissing }}</span>
                </div>
                <span class="cal-unit contents_value_unit">%</span>
              </div>
            </div>

            <div class="cal-row">
              <div class="nameTag">
                <span class="cal-title-font">전력 사용량</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="TOT_PWR" class="marginR10">{{ store.state.cost.usedPower }}</span>
                </div>
                <span class="cal-unit contents_value_unit">kWh</span>
              </div>
            </div>

            <div class="cal-row">
              <div class="nameTag">
                <span class="cal-title-font">경부하 사용량</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="L_PWR" class="marginR10">{{ store.state.cost.lightLoadPower }}</span>
                </div>
                <span class="cal-unit contents_value_unit">kWh</span>
              </div>
            </div>

            <div class="cal-row">
              <div class="nameTag">
                <span class="cal-title-font">중간부하 사용량</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="M_PWR" class="marginR10">{{ store.state.cost.middleLoadPower }}</span>
                </div>
                <span class="cal-unit contents_value_unit">kWh</span>
              </div>
            </div>

            <div class="cal-row">
              <div class="nameTag">
                <span class="cal-title-font">최대부하 사용량</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="H_PWR" class="marginR10">{{ store.state.cost.highLoadPower }}</span>
                </div>
                <span class="cal-unit contents_value_unit">kWh</span>
              </div>
            </div>

            <div class="cal-row">
              <div class="nameTag" style="width:47%;">
                <span class="cal-title-font">사용 기간</span>
              </div>
              <div class="inputBox">
                <div class="date_design DateTime dtpFont">
                  <VueDatePicker
                    v-model="date"
                    month-picker
                    locale="ko"
                    :format="format"
                    :clearable="false"
                    @update:model-value="getMonthRateData"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="div-line-bottom" style="margin-left: 12px; margin-top : -17px; width:97%;"></div>
      </div>

      <div class="div_center_box">
        <div class="div_center_top">
          <div class="center_border center_border_img">
            <div class="center_border layerGreen" style="width:100%;"></div>
            <div class="center_toptitle"></div>
            <div class="center_contents cost_aura cost_main"></div>
            <div class="center_contents cost_spring"></div>
            <div class="center_contents cost_plate  cost_main"></div>
            <div class="center_contents cost_bottom"></div>

            <div class="center_contents main_text_box">
              <span class="main_font" style="line-height: 3;">{{ setTwoWord(state.month) }}월 </span>
              <span class="main_font" style="line-height: 3;">전체요금</span>
              <br>
              <span class="main_font" id="TOT_FEE_MAIN" style="font-family: 'LAB디지털' !important;font-size: 50px;">{{ store.state.cost.totalFee }}</span>
              <span class="main_font">원</span>
            </div>

          </div>
        </div>

        <div class="div_center_bottom">
          <div class="div-line-top"></div>
          <div class="center_bottom_box center_border">
            <div class="cost-box">
              <div id="seasonTitleArea" class="bottom_box_row">
                <div class="center_bottom_circle fL"></div>
                <div class="cal_season_btn cal_season_btn_font fR">{{store.state.cost.season}}</div>
              </div>

              <div id="infoA" style="overflow: auto; " class="bottom-box-row bottom-box-border seasonFont scrollbar ">
                <div v-for="(timeRate, index) in store.state.cost.seasonDataList " :key="index" class="time-rate">
                  <div class="time-rate-time">{{ timeRate.STN_TM }}시</div>
                  <div v-if="timeRate.TIMEZONE == 'L'" class="time-rate-light-load">경부하</div>
                  <div v-else-if="timeRate.TIMEZONE == 'M'" class="time-rate-mid-load">중부하</div>
                  <div v-else class="time-rate-high-load">최대부하</div>
                  <div class="time-rate-base">
                    <span> 기본요금 : </span>
                    <span class="time-rate-rate">{{ timeRate.BASE_RATE }}</span>
                    <span class="time-rate-unit">(원/kW)</span>
                  </div>
                  <div style="width: 40%;">
                    <span> 전기사용요금 : </span>
                    <span class="ime-rate-rate">{{ timeRate.ELCTR_RATE }}</span>
                    <span class="time-rate-unit">(원/kWh)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="div-line-bottom" style="width:97%; margin-top:-9px; margin-left:21px;"></div>
        </div>
      </div>

      <div class="fL div-box div_right_box div_side_box">
        <div class="div-line-top" style="width:97%;"></div>
        <div class="border-small border_img" style="height:95%;">
          <div class="cost-box">
            <div class="right-box-row right_title_row" style="height:15%;">
              <div class="select_btn_area">
                <div
                  id="ctgry0"
                  class="select_btn select_btn_font fL"
                  :class="[store.state.cost.rateIdx === 0 ?'selected' : '']"
                  @click="selectRate(0)">
                  선택 I
                </div>
                <div
                  id="ctgry1"
                  class="select_btn select_btn_font fL"
                  :class="[store.state.cost.rateIdx === 1 ?'selected' : '']"
                  @click="selectRate(1)">
                  선택 II
                </div>
                <div
                  id="ctgry2"
                  class="select_btn select_btn_font fL"
                  :class="[store.state.cost.rateIdx === 2 ?'selected' : '']"
                  @click="selectRate(2)">
                  선택 III
                </div>
              </div>
            </div>

            <div class="right-box-row">
              <div class="nameTag">
                <span class="cal-title-font">추천 요금제</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span class="" style="font-family: 'KHNPHDRegular'; font-size: 23px;">{{ store.state.cost.subRateCategory }}</span>
                </div>
                <span class="cal-unit contents_value_unit right-box-margin"></span>
              </div>
            </div>

            <div class="right-box-row">
              <div class="nameTag">
                <span class="cal-title-font">전체 요금</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span class="marginR10">{{ store.state.cost.totalFee }}</span>
                </div>
                <span class="cal-unit contents_value_unit right-box-margin">원</span>
              </div>
            </div>

            <div class="right-box-row">
              <div class="nameTag">
                <span class="cal-title-font">기본 요금</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span class="marginR10">{{ store.state.cost.baseFee }}</span>
                </div>
                <span class="cal-unit contents_value_unit right-box-margin">원</span>
              </div>
            </div>

            <div class="right-box-row">
              <div class="nameTag">
                <span class="cal-title-font">기타 요금</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="ETC_FEE" class="marginR10">{{ store.state.cost.etcFee }}</span>
                </div>
                <span class="cal-unit contents_value_unit right-box-margin">원</span>
              </div>
            </div>

            <div class="right-box-row">
              <div class="nameTag">
                <span class="cal-title-font">경부하 전력요금</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="L_ELCTR_FEE" class="marginR10">{{ store.state.cost.lightLoadFee }}</span>
                </div>
                <span class="cal-unit contents_value_unit right-box-margin">원</span>
              </div>
            </div>

            <div class="right-box-row">
              <div class="nameTag">
                <span class="cal-title-font">중간부하 전력요금</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="M_ELCTR_FEE" class="marginR10">{{ store.state.cost.middleLoadFee }}</span>
                </div>
                <span class="cal-unit contents_value_unit right-box-margin">원</span>
              </div>
            </div>

            <div class="right-box-row">
              <div class="nameTag">
                <span class="cal-title-font">최대부하 전력요금</span>
              </div>
              <div class="inputBox">
                <div class="contents_value_font  cal-value">
                  <span id="H_ELCTR_FEE" class="marginR10">{{ store.state.cost.highLoadFee }}</span>
                </div>
                <span class="cal-unit contents_value_unit right-box-margin">원</span>
              </div>
            </div>
          </div>
        </div>
        <div class="div-line-bottom" style="width:97%; margin-top:-12px;"></div>
      </div>

    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { setTwoWord } from '@/utils/utils.js'
import log from '@/logger.js'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: {
    VueDatePicker
  },
  setup () {
    const store = useStore()

    const date = reactive(new Date())
    const state = reactive({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      selectedRateIdx: 0
    })

    const format = (date) => {
      try {
        state.month = date.getMonth() + 1
        state.year = date.getFullYear()
        return `${state.year}년 ${setTwoWord(state.month)}월`
      } catch (err) {
        log.logError(err.message);
      }
    }

    const selectRate = (idx) => {
      try {
        store.dispatch('cost/changeRate', idx)
      } catch (err) {
        log.logError(err.message);
      }
    }

    const getMonthRateData = (date) => {
      store.dispatch('cost/fetchMonthRateData', `${date.year}-${setTwoWord(date.month + 1)}`)
    }

    const getRateData = async () => {
      await store.dispatch('cost/fetchRateInfo')
      store.dispatch('cost/fetchMonthRateData', `${state.year}-${setTwoWord(state.month)}`)
    }

    onMounted(() => {
      getRateData()
    })

    return {
      store,
      date,
      state,
      format,
      setTwoWord,
      selectRate,
      getMonthRateData
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/layout.scss';
@import '@/style/component/title.scss';

.dp__theme_light {
  --dp-background-color: #15284e;
  --dp-text-color: #ffffff;
  --dp-border-color: #489cf2;
  --dp-font-family: KHNPHDRegular;
  // --dp-font-size: 13px
  --dp-input-icon-padding: 50px;
}

.contents-body {
  width: 100%;
  height: 100%;
  margin-left: 15px;
}

.title_wrap {
  display: flex;
  flex-direction: row;
}

.costBg {
  width: 100%;
  height: 95%;
  background: url('@/assets/img/cost_bg.png') no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
}

.cal-title-font {
  text-shadow: 0 0 9px #5cafff;
  font-size: 18px;
  font-family: KHNPHDRegular;
  letter-spacing: normal;
  color: #c3eaff;
  padding-left: 16%;
  align-self: center;
}

.cal-unit {
  width: 25%;
  align-self: center;
  margin-left: 9px;
}

.cal-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 95%;
}

.cost-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.cal-row {
  height: calc(100%/ 9);
  display: flex;
  flex-direction: row;
}

.right-box-row {
  height: 11%;
  display: flex;
  flex-direction: row;
}

.cal-value {
  width: 70%;
  align-self: center;
}

.cal_season_btn {
  width: 9%;
  height: 60%;
  align-self: center;
  border: solid 1px #b4dffa;
  background-color: rgba(139, 194, 240, 0.25);
  cursor: pointer;
  border-radius: 4px;
  margin-right: 2%;
  margin-top: 1%;
}

.cal_season_btn_font {
  text-shadow: 0 0 9px #5cafff;
  font-size: 16px;
  /* 데이터 숫자는 30px~18px 사이 숫자 사용해야함 */
  color: #fff;
  font-family: 'KHNPHDRegular';
  text-align: center;
  line-height: 2;
}

.contents_value_font {
  text-shadow: 0 0 9px #5cafff;
  font-size: 25px;
  /* 데이터 숫자는 30px~18px 사이 숫자 사용해야함 */
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #fff;
  font-family: "LAB디지털" !important;
  text-align: right;
}

.contents_value_unit {
  text-shadow: 0 0 9px #5cafff;
  font-size: 16px;
  /* 데이터 숫자는 30px~18px 사이 숫자 사용해야함 */
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #fff;
  font-family: 'KHNPHDRegular';
}

.div-box {
  display: flex;
  flex-direction: column;
}

.border_img {
  width: 97%;
  background-size: 100% 100%;
  height: 100%;
}

.div-box .border-small {
  background-image: url('@/assets/img/box_bg_small.png');
}

.right-box-margin {
  margin-right: 0%;
}

.div_center_box {
  display: flex;
  width: 54%;
  height: 77%;
  flex-direction: column;
  align-self: center;
}

.div_side_box {
  width: 23%;
  height: 77%;
  align-self: center;
}

.div_left_box {
  margin-left: 2%;
}

.div_right_box {
  margin-right: 2%;
  align-items: self-end;
}

.div_center_top {
  height: 60%;
  width: 100%;
  text-align: center;
  position: relative;
}

.div_center_bottom {
  height: 38%;
  width: 100%;
  margin-top: 2%;
  text-align: center;
  position: relative;
}

.fL {
  float: left;
}

.fR {
  float: right;
}

.center_border {
  width: 95%;
  height: 100%;
  display: inline-block;
}

.center_border_img {
  background-image: url('@/assets/img/box_bg_small.png');
  background-size: 100% 100%;
}

.center_contents {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.layerGreen {
  background-image: url('@/assets/img/layerGreen.png');
  background-size: 100% 100%;
}

.cost_aura {
  background-image: url('@/assets/img/cost_aura.png');
  background-size: 100% 100%;
  height: 85%;
  width: 50%;
}

.cost_spring {
  background-image: url('@/assets/img/cost_spring.png');
  background-size: 100% 100%;
  height: 42%;
  width: 56%;
  position: absolute;
  background-repeat: no-repeat;
  mix-blend-mode: color-dodge;
}

.cost_plate {
  background-image: url('@/assets/img/plate_aura.png');
  background-size: 100% 100%;
  height: 18%;
  width: 50%;
  margin-top: 10%;
}

.cost_bottom {
  background-image: url('@/assets/img/bottom_aura.png');
  background-size: 100% 100%;
  height: 24%;
  width: 69%;
  margin-top: 12%;
  mix-blend-mode: color-dodge;
  position: absolute;
  background-repeat: no-repeat;
}

.cost_main {
  mix-blend-mode: overlay;
  position: absolute;
  background-repeat: no-repeat;
}

.center_bottom_box {
  background-image: url('@/assets/img/box_bg_middle.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.center_toptitle {
  background-image: url('@/assets/img/squreTitle.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 20%;
  height: 6%;
  position: absolute;
  top: 4%;
  left: 4%;
}

.center_bottom_circle {
  background-image: url('@/assets/img/cost_circle.png');
  background-repeat: no-repeat;
  background-size: contain;
  width: 24%;
  height: 100%;
  margin-left: 1%;
}

.div-box .nameTag {
  width: 50%;
  height: 100%;
  display: flex;
  line-height: 20px;
}

.div-box .inputBox {
  width: 50%;
  height: 100%;
  display: flex;
}

.cal-title-font {
  text-shadow: 0 0 9px #5cafff;
  font-size: 18px;
  font-family: KHNPHDRegular;
  letter-spacing: normal;
  color: #c3eaff;
  padding-left: 16%;
  align-self: center;
}

.right_title_row {
  height: 15%;
  margin-top: 1%;
}

.dtpFont {
  width: 90%;
  align-self: center;
  text-align: center;
  text-shadow: 0 0 9px #5cafff;
  font-size: 16px;
}

.bottom-box-border {
  background: #00070c61;
  border-radius: 5px;
  width: 96%;
  height: 65%;
  margin: 0 2%;
}

.bottom_box_row {
  align-items: center;
  height: 20%;
  padding: 1%;
}

.main_font {
  text-shadow: 0 0 9px #000000;
  font-size: 40px;
  font-family: KHNPHDRegular;
  letter-spacing: normal;
  color: #fbfbfb;
  align-self: center;
  font-weight: 700;
}

.main_text_box {
  position: absolute;
  mix-blend-mode: color-dodge;
}

.cal_title_row {
  height: calc(100%/ 9);
  text-align: center;
}

.seasonFont {
  font-size: 18px;
  color: #d7d7d7cf;
  font-family: 'KHNPHDRegular';
  text-align: left;
}

.cal_tite_text {
  text-shadow: 0 0 9px #5cafff;
  font-size: 28px;
  font-family: KHNPHDRegular;
  letter-spacing: normal;
  color: #c3eaff;
  line-height: 63px;
  font-weight: bold;
}

.marginR10 {
  margin-right: 10px;
}

.select_btn_area {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.select_btn {
  width: 25%;
  height: 45%;
  align-self: center;
  border: solid 1px #b4dffa;
  background-color: rgb(138 154 168 / 25%);
  cursor: pointer;
  border-radius: 4px;
  margin-right: 3%;
  margin-left: 2%;
  line-height: 36px;
}

.select_btn_font {
  text-shadow: 0 0 9px #5cafff;
  font-size: 22px;
  color: #fff;
  font-family: 'KHNPHDBold';
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected {
	box-shadow: 0 0 10px 0 rgb(132 141 154 / 94%);
    background-color: rgb(226 242 255 / 40%) !important;
}

.time-rate {
  width: 100%;
  margin: 10px 0 15px 0;
  display: flex;
  justify-content: center;
}

.time-rate-time {
  width: 10%;
}

.time-rate-light-load {
  width: 12%;
  color: #00ff0096;
}

.time-rate-mid-load {
  width: 12%;
  color: #ffff0096;
}

.time-rate-high-load {
  width: 12%;
  color: #ff3333d9;
  font-weight: bolder;
}
.time-rate-base {
  width: 28%;
}

.time-rate-rate {
  font-family: LAB디지털;
  font-size: 22px;
}

.time-rate-unit {
  margin-left: 5px;
}
</style>
