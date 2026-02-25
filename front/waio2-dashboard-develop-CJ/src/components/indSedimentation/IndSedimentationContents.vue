<template>
  <div>
    <div class="btn-tab">
      <div class="btn-tab__box-abled">1단계공업</div>
      <div class="btn-tab__box-disabled"  @click="$routingByIndex(4)">2단계생활</div>
    </div>
    <div class="center-container">
      <div class="arrow-animate-one"></div>
      <div class="arrow-animate-two"></div>
      <!-- 침전지 배차 위치 -->
      <div class="line-img">
        <!-- 1지 -->
        <div class="line-contents" v-bind:style="disabledJi(1)">
          <div class="line-contents__title" @click="openSbPopup(1)">1지</div>
          <div :class="[ this.$store.getters['indSedimentation/isOpenInBalValve1'] ? 'line-contents__on-img' : 'line-contents__off-img' ]"></div>
          <div class="line-contents-value">
            <div class="line-contents-value__top" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc1_f * this.scDividedValue)) + 'px' }"></div>
            <div class="line-contents-value__bottom" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc1_b * this.scDividedValue)) + 'px' }"></div>
          </div>
          <div class="line-contents__btn">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set1 === 1" src="../../assets/sedimentation/btn_ai_on.png" @click="openAiModeDialogOfJi(1)" alt="on">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set1 === 0" src="../../assets/sedimentation/btn_ai_off.png" @click="openAiModeDialogOfJi(1)" alt="off">
          </div>
        </div>
        <!-- 2지 -->
        <div class="line-contents" v-bind:style="disabledJi(2)">
          <div class="line-contents__title" @click="openSbPopup(2)">2지</div>
          <div :class="[ this.$store.getters['indSedimentation/isOpenInBalValve2'] ? 'line-contents__on-img' : 'line-contents__off-img' ]"></div>
          <div class="line-contents-value">
            <div class="line-contents-value__top" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc2_f * this.scDividedValue)) + 'px' }"></div>
            <div class="line-contents-value__bottom" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc2_b * this.scDividedValue)) + 'px' }"></div>
          </div>
          <div class="line-contents__btn">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set2 === 1" src="../../assets/sedimentation/btn_ai_on.png" @click="openAiModeDialogOfJi(2)" alt="on">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set2 === 0" src="../../assets/sedimentation/btn_ai_off.png" @click="openAiModeDialogOfJi(2)" alt="off">
          </div>
        </div>
        <!-- 3지 -->
        <div class="line-contents" v-bind:style="disabledJi(3)">
          <div class="line-contents__title" @click="openSbPopup(3)">3지</div>
          <div :class="[ this.$store.getters['indSedimentation/isOpenInBalValve3'] ? 'line-contents__on-img' : 'line-contents__off-img' ]"></div>
          <div class="line-contents-value">
            <div class="line-contents-value__top" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc3_f * this.scDividedValue)) + 'px' }"></div>
            <div class="line-contents-value__bottom" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc3_b * this.scDividedValue)) + 'px' }"></div>
          </div>
          <div class="line-contents__btn">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set3 === 1" src="../../assets/sedimentation/btn_ai_on.png" @click="openAiModeDialogOfJi(3)" alt="on">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set3 === 0" src="../../assets/sedimentation/btn_ai_off.png" @click="openAiModeDialogOfJi(3)" alt="off">
          </div>
        </div>
        <!-- 4지 -->
        <div class="line-contents" v-bind:style="disabledJi(4)">
          <div class="line-contents__title" @click="openSbPopup(4)">4지</div>
          <div :class="[ this.$store.getters['indSedimentation/isOpenInBalValve4'] ? 'line-contents__on-img' : 'line-contents__off-img' ]"></div>
          <div class="line-contents-value">
            <div class="line-contents-value__top" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc4_f * this.scDividedValue)) + 'px' }"></div>
            <div class="line-contents-value__bottom" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc4_b * this.scDividedValue)) + 'px' }"></div>
          </div>
          <div class="line-contents__btn">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set4 === 1" src="../../assets/sedimentation/btn_ai_on.png" @click="openAiModeDialogOfJi(4)" alt="on">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set4 === 0" src="../../assets/sedimentation/btn_ai_off.png" @click="openAiModeDialogOfJi(4)" alt="off">
          </div>
        </div>
              <!-- 5지 -->
        <div class="line-contents" v-bind:style="disabledJi(5)">
          <div class="line-contents__title" @click="openSbPopup(5)">5지</div>
          <div :class="[ this.$store.getters['indSedimentation/isOpenInBalValve5'] ? 'line-contents__on-img' : 'line-contents__off-img' ]"></div>
          <div class="line-contents-value">
            <div class="line-contents-value__top" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc5_f * this.scDividedValue)) + 'px' }"></div>
            <div class="line-contents-value__bottom" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc5_b * this.scDividedValue)) + 'px' }"></div>
          </div>
          <div class="line-contents__btn">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set5 === 1" src="../../assets/sedimentation/btn_ai_on.png" @click="openAiModeDialogOfJi(5)" alt="on">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set5 === 0" src="../../assets/sedimentation/btn_ai_off.png" @click="openAiModeDialogOfJi(5)" alt="off">
          </div>
        </div>
        <!-- 6지 -->
        <div class="line-contents" v-bind:style="disabledJi(6)">
          <div class="line-contents__title" @click="openSbPopup(6)">6지</div>
          <div :class="[ this.$store.getters['indSedimentation/isOpenInBalValve6'] ? 'line-contents__on-img' : 'line-contents__off-img' ]"></div>
          <div class="line-contents-value">
            <div class="line-contents-value__top" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc6_f * this.scDividedValue)) + 'px' }"></div>
            <div class="line-contents-value__bottom" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc6_b * this.scDividedValue)) + 'px' }"></div>
          </div>
          <div class="line-contents__btn">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set6 === 1" src="../../assets/sedimentation/btn_ai_on.png" @click="openAiModeDialogOfJi(6)" alt="on">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set6 === 0" src="../../assets/sedimentation/btn_ai_off.png" @click="openAiModeDialogOfJi(6)" alt="off">
          </div>
        </div>
        <!-- 7지 -->
        <div class="line-contents" v-bind:style="disabledJi(7)">
          <div class="line-contents__title" @click="openSbPopup(7)">7지</div>
          <div :class="[ this.$store.getters['indSedimentation/isOpenInBalValve7'] ? 'line-contents__on-img' : 'line-contents__off-img' ]"></div>
          <div class="line-contents-value">
            <div class="line-contents-value__top" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc7_f * this.scDividedValue)) + 'px' }"></div>
            <div class="line-contents-value__bottom" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc7_b * this.scDividedValue)) + 'px' }"></div>
          </div>
          <div class="line-contents__btn">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set7 === 1" src="../../assets/sedimentation/btn_ai_on.png" @click="openAiModeDialogOfJi(7)" alt="on">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set7 === 0" src="../../assets/sedimentation/btn_ai_off.png" @click="openAiModeDialogOfJi(7)" alt="off">
          </div>
        </div>
        <!-- 8지 -->
        <div class="line-contents" v-bind:style="disabledJi(8)">
          <div class="line-contents__title" @click="openSbPopup(8)">8지</div>
          <div :class="[ this.$store.getters['indSedimentation/isOpenInBalValve8'] ? 'line-contents__on-img' : 'line-contents__off-img' ]"></div>
          <div class="line-contents-value">
            <div class="line-contents-value__top" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc8_f * this.scDividedValue)) + 'px' }"></div>
            <div class="line-contents-value__bottom" :style="{ backgroundPositionX: (-5 + ($store.state.indSedimentation.latest.e_sc8_b * this.scDividedValue)) + 'px' }"></div>
          </div>
          <div class="line-contents__btn">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set8 === 1" src="../../assets/sedimentation/btn_ai_on.png" @click="openAiModeDialogOfJi(8)" alt="on">
            <img v-if="this.$store.state.indSedimentation.latest.e_sc_set8 === 0" src="../../assets/sedimentation/btn_ai_off.png" @click="openAiModeDialogOfJi(8)" alt="off">
          </div>
        </div>
        <!-- 배차 거리 -->
        <div class="line-unit">
          <div class="line-box">
            <div class="line-box__unit margin0">0</div>
            <div class="line-box__unit">{{ this.$store.state.indSedimentation.latestModify.e_set_lt / 9 | numFormat('0') }}</div>
            <div class="line-box__unit">{{ this.$store.state.indSedimentation.latestModify.e_set_lt / 3 | numFormat('0') }}</div>
            <div class="line-box__unit">{{ this.$store.state.indSedimentation.latestModify.e_set_lt }}</div>
          </div>
        </div>
      </div>
      <div class="last-container">
        <!-- 주요인자 -->
        <div class="first marginleft">
          <div class="first__title">
            <div class="text">주요인자</div>
          </div>
          <div class="first-result-contents">
            <div class="result-value">
              <div class="result-text">
                <div class="result-text__pink">· 원수 유입 유량</div>
                <div class="result-text__white">{{ this.$store.state.indSedimentation.latest.b_in_fr | numFormat('0,0')}}</div>
                <div class="result-text__thin">m<sup>3</sup>/h</div>
              </div>
              <div class="result-text">
                <div class="result-text__pink">· 원수 탁도</div>
                <div class="result-text__white">{{ this.$store.state.indSedimentation.latest.b_tb | numFormat('0.00') }}</div>
                <div class="result-text__thin">NTU</div>
              </div>
              <div class="result-text">
                <div class="result-text__pink">· 약품</div>
                <div class="result-text__white">{{ this.$store.state.indSedimentation.latest.c_cf_coagulant }}</div>
                <div class="result-text__thin"></div>
              </div>
              <div class="result-text">
                <div class="result-text__pink">· 약품 주입량</div>
                <div class="result-text__white">{{ this.$store.state.indSedimentation.latest.c_mm_fr | numFormat('0.00') }}</div>
                <div class="result-text__thin">ℓ/h</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 알고리즘 예측 -->
        <div class="first two">
          <div class="first__title">
            <div class="text marginleft">알고리즘 예측</div>
          </div>
          <div class="second-result-contents">
            <div class="little-title">AI 슬러지 발생량 예측</div>
            <div class="value-box">
              <div class="value-box__value">
                {{ this.$store.state.indSedimentation.latest.ai_e1_sludge | numFormat('0.00') }}
                <div class="value-box__unit">ton/day</div>
              </div>
            </div>
            <div class="value-bottom-img"></div>
          </div>
        </div>
        <!-- 예측 결과 -->
        <div class="first three">
          <div class="first__title">
            <div class="text">예측결과</div>
            <div class=first__timerbox-outter>
              <div class="timerbox">
                {{ this.$store.state.indSedimentation.latest.upd_ti | moment('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </div>
          </div>
          <div class="legend-box">
            <div class="legend-box__legend legend-box__legend--schedule">운영스케줄</div>
            <div class="legend-box__legend legend-box__legend--bw">인발시작시간</div>
          </div>
          <div class="last-result-contents">
            <div class="little-title">수집기 운영 스케줄</div>
            <ESCScheduleChart />
          </div>
        </div>
      </div>
      <!-- 짐천지 지별 상세 팝업 -->
      <IndSedimentationPopup :popupScDividedValue = "this.popupScDividedValue" />
    </div>
  </div>
</template>
<script>
import IndSedimentationPopup from '@/components/indSedimentation/IndSedimentationPopup'
import ESCScheduleChart from '@/components/indSedimentation/chart/ESCScheduleChart'
import { SET_OVERLAY } from '@/store'
import { GET_SEDIMENTATION_LOCATION_BY_JI } from '@/store/modules/indSedimentation'
// import Highcharts from 'highcharts'
// import xrangeInit from 'highcharts/modules/xrange'
import { OPEN_AI_MODE_OF_JI_DIALOG } from '../../store/modules/dialog'
// xrangeInit(Highcharts)

// Highcharts.setOptions({
//   global: {
//     useUTC: false
//   },
//   lang: {
//     thousandsSep: ','
//   }
// })
export default {
  name:'IndSedimentationContents',
  data: () => ({
    scDividedValue: 4.0, // 대차 위치 계산 상수
    popupScDividedValue: 6.3 // 팝업 대차 위치 계산 상수
  }),
  components: {
    IndSedimentationPopup,
    ESCScheduleChart
  },
  computed: {
  },
  methods: {
    /**
     * 지 버튼을 눌렀을 때
     * 침전지 상세 팝업 오픈
     * 
     * @param index 지
     */
    openSbPopup: function (index) {
      let obj = {}
      obj.numJi = index

      this.$store.commit(SET_OVERLAY, true)
      Promise.all([
        this.$store.dispatch(GET_SEDIMENTATION_LOCATION_BY_JI, obj),
        // this.$store.dispatch(PUT_SEDIMENTATION_INTERFACE, obj)
      ]).finally(() => {
        this.$store.commit(SET_OVERLAY, false)
      })
    },
    /**
     * 지별 운전모드 제어를 눌렀을 때
     * 제어 확인 Dialog 오픈
     */
    openAiModeDialogOfJi: function (numJi) {
      this.$store.state.dialog.aiModeOfJi.number = numJi
      this.$store.dispatch('dialog/' + OPEN_AI_MODE_OF_JI_DIALOG)
    },
    disabledJi: function(numJi) {
      let opacity = 0.2
      let pointerEvents = 'none'
      let style = ''
      if(this.$store.state.indSedimentation.latest['e_operation_mode_' + numJi] == 0) {
        style = {opacity, pointerEvents}
      }
      return style
    }
  },
  /**
   * 마운트 시
   * fullscreenchange 이벤트 등록
   */
  mounted: function () {
    // window.addEventListener('fullscreenchange', this.fullscreenchanged)
  },
  
  /**
   * 마운트 해제시
   * fullscreenchange 이벤트 해제
   */
  // beforeDestroy () { window.removeEventListener('fullscreenchange', this.fullscreenchanged) },
  // watch: {
  //   "$store.state.sedimentaion.latest.update_time": function(newVal, oldVal) {
  //     console.log("watch!!!!")
  //     if (newVal !== oldVal) {
  //       this.rangeTest()
  //     }
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.btn-tab{
    display: flex;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.3;
    letter-spacing: normal;
    text-align: center;
    color: #061732;
    width: 260px;
    height: 45px;
    justify-content: space-evenly;
    align-items: center;
    position: absolute;
    left: 157px;
    .box-center-margin{
      // margin: 0 16px;
    }
    &__box-abled{
      width: 120px;
      height: 35px;
      box-shadow: 0 0 10px 0 rgba(172, 207, 255, 0.7);
      border: solid 1px #72a3d6;
      background-color: #447fbc;
      color: #fff;
      line-height: 35px;
      cursor: pointer;
    }
    &__box-disabled{
      width: 120px;
      height: 35px;
      border: solid 1px #457fbc;
      background-color: #1a3462;
      color: #a7c2e7;
      line-height: 35px;
      cursor: pointer;
    }
 }
.two{
  position: relative;
  left: -25px;
}
.three{
  width: 582px !important;
  position: relative;
  left: -60px;
}
.little-title{
  width: 197px;
  height: 39px;
  background-image: url('../../assets/sedimentation/little_title.png');
  text-shadow: 0 0 9px #5cafff;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.5;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  padding-left: 29px;
}
.line-unit{
  display: flex;
  width: 100%;
  height: 25px;
  padding-left: 46px;
  margin-bottom: 8px;
  justify-content: flex-end;
  .line-box{
    display: flex;
    width: 315px;
    margin-right: 56px;
    &__unit{
      margin-left: auto;
      opacity: 1;
      font-family: "KHNPHUotfR";
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      text-align: center;
      line-height: 1.5;
      letter-spacing: normal;
      color: #d3e7ff;
    }
    .margin0{
      margin: 0 !important;
    }
  }
}
.line-img{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 516.8px;
  height: 442.1px;
  margin-top: 70px;
  .line-contents{
    display: flex;
    width: 100%;
    height: 40px;
    margin-left: 34px;
    &__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 55px;
      height: 100%;
      cursor: pointer;
    }
    &__title{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 59px;
      height: 100%;
      background-image: url('../../assets/sedimentation/small_title.png');
      text-shadow: 0 0 9px #5cafff;
      font-size: 16px;
      text-align: center;
      color: #c3eaff;
      cursor: pointer;
    }
    &__on-img{
      width: 61px;
      height: 100%;
      background-image: url('../../assets/sedimentation/valve_img_on.png');
      background-position: center;
      margin-left: -5px;
    }
    &__off-img {
      width: 61px;
      height: 100%;
      background-image: url('../../assets/sedimentation/valve_img_off.png');
      background-position: center;
      margin-left: -5px;
    }
    .line-contents-value{
      width: 315px;
      height: 40px;
      background-image: url('../../assets/sedimentation/valve_value.png');
      background-size: 100% 100%;
      &__top{
        width: 315px;
        height: 20px;
        background-image: url('../../assets/sedimentation/top_img.png');
        background-position: center;
      }
      &__bottom{
        width: 315px;
        height: 20px;
        background-image: url('../../assets/sedimentation/bottom_img.png');
        background-position-y: -5px;
        background-position-x: right;
      }
    }
  }
}
.arrow-animate-one{
  position: absolute;
  top: 261px;
  left: 864px;
  background-image: url('../../assets/splashdown/arrow_img.png');
  width: 85px;
  height: 356px;
  animation-name: big-arrow-one;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes big-arrow-one{ 
  0% {opacity:0; transform: translateX(-5px);}
  12% {opacity:0.5; transform: translateX(-2px);}
  24% {opacity:1; transform: translateX(0px);}
  36% {opacity:0.5; transform: translateX(2px);}
  48% {opacity:0; transform: translateX(5px);}
  60% {opacity:0;}
  72% {opacity:0;}
  84% {opacity:0;}
  100% {opacity:0;}
}
.arrow-animate-two {
  position: absolute;
  top: 261px;
  z-index: 10;
  left: 1225px;
  background-image: url('../../assets/splashdown/arrow_img.png');
  width: 85px;
  height: 356px;
  animation-name: big-arrow-two;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes big-arrow-two{ 
  0% {opacity:0;}
  12% {opacity:0;}
  24% {opacity:0;}
  36% {opacity:0;}
  48% {opacity:0; transform: translateX(-5px);}
  60% {opacity:0.5; transform: translateX(-2px);}
  72% {opacity:1; transform: translateX(0px);}
  84% {opacity:0.5; transform: translateX(2px);}
  100% {opacity:0; transform: translateX(5px);}
}
.width120{
  width: 120px !important;
}
.second-result-contents{
  width: 424px;
  height: 356px;
  margin-top: 20px;
  background-image: url('../../assets/splashdown/second_result_background.png');
}
.last-result-contents{
  width: 582px;
  height: 356px;
  margin-top: 20px;
  background-image: url('../../assets/sedimentation/last_background.png');
  .chart{
    width: 582px;
    height: 300px;
    background-image: url('../../assets/splashdown/chart_example.png');
    background-size: contain;
  }
}
.paddingtop{
  padding-top: 20px;
}
.marginleft{
  margin-left: 16px !important;
}
.margintop{
  margin-top: 30px;
}
.value-bottom-img{
  height: 36px;
  background-image: url('../../assets/splashdown/value_bottom.png');
  background-position-x: 18px;
  margin-top: -24px;
}
.value-box{
  display: flex;
  flex-direction: column;
  width: 280px;
  justify-content: center;
  margin-top: 76px;
  &__value{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
    font-family: "LAB디지털" !important;
    font-size: 40px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: right;
    color: #ccf1ff;
  }
  &__unit{
    width: 47px;
    margin-left: 10px;
    font-family: "KHNPHUotfR";
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    margin-top: 23px;
    letter-spacing: normal;
    text-align: left;
    color: #417db9;
  }
}
.value-box-meter-outer {
  display: flex;
  .value-box-meter{
    display: flex;
    width: 170px;
    justify-content: center;
    margin-top: 10px;
    &__value{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 30px;
      text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
      font-family: "LAB디지털" !important;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: right;
      color: #ccf1ff;
    }
    &__img-underline{
      position: absolute;
      left: -20px;
      bottom: 0px;
      width: 99px;
      height: 7px;
      background-image: url('../../assets/splashdown/meter_underline.png');
    }
    &__unit{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 47px;
      font-family: "KHNPHUotfR";
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      color: #417db9;
    }
  }
}
.contents-title{
  display: flex;
  justify-content: center;
  &__img{
    width: 47px;
    height: 34px;
    background-image: url('../../assets/splashdown/result_arrow.png');
  }
  &__text{
    text-shadow: 0 0 9px #5cafff;
    font-family: "KHNPHUotfR";
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.3;
    letter-spacing: normal;
    text-align: left;
    color: #c3eaff;
  }
}
.center-container{
  display: flex;
  width: 100%;
  height: 100%;
  .last-container{
    display: flex;
    flex: 1;
    width: 63%;
    .first{
      width: 420px;
      .legend-box{
        position:absolute;
        right: 0px;
        display: flex;
        margin-top: 12px;
        margin-right: 15px;
        margin-left: auto;
        flex: 1;
        justify-content: flex-end;
        &__legend {
          height: 20px;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: center;
          color: #fff;
          &:before {
            content: "";
            display: inline-block;
            justify-content: center;
            align-items: center;
            width: 15px;
            height: 7px;
            margin-right: 5px;
          }
          &--schedule:before {
            background-color:rgb(180, 223, 251)
          }
          &--bw:before {
            margin-left: 10px;
            background-color:red
          }
        }
        .on {
          box-shadow: 0 0 10px 0 rgba(172, 207, 255, 0.7);
          border: solid 1px #b4dffa;
          background-color: rgba(139, 194, 240, 0.4);
        }
      }
      &__timerbox-outter {
        display: flex;
        position: relative;
        margin-left: auto;
        top: -3px;
      }
      &__title{
        display: flex;
        align-items: center;
        margin-right: auto;
        width: 570px;
        height: 53px;
        background-image: url('../../assets/splashdown/result_title.png');
        .text{
          width: 170px;
          text-shadow: 0 0 9px #5cafff;
          font-family: "KHNPHUotfR";
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 2.5;
          letter-spacing: normal;
          text-align: center;
          color: #fff;
        }
      }
      .first-result-contents{
        width: 458px;
        height: 356px;
        margin-top: 20px;
        background-image: url('../../assets/splashdown/result_background.png');
        .result-value{
          position: relative;
          top: 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          padding: 10px 0;
          width: 339px;
          height: 313px;
          background-image: url('../../assets/drugInjection/value_factor.png');
          background-size: 100% 100%;
          .result-text{
            display: flex;
            width:100%;
            height: 30px;
            font-family: "KHNPHUotfR";
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            &__pink{
              width: 170px;
              margin-left: 15px;
              text-shadow: 0 0 9px #5cafff;
              font-size: 18px;
              text-align: left;
              color: #9fc4ff;
            }
            &__white{
              margin-left: auto;
              text-shadow: 0 0 9px #5cafff;
              font-size: 20px;
              text-align: left;
              color: #fff;
            }
            &__thin{
              width: 48px;
              margin-right: 10px;
              margin-left: 7px;
              font-size: 14px;
              line-height: 2.5;
              text-align: left;
              color: #417db9;
            }
          }
        }
      }
    }
  }
}
</style>