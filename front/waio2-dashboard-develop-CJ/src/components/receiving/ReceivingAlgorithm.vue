<template>
  <div class="main">
    <!-- 공정 제목, 네비게이터, AI 운전모드, EMS 운전모드 제어 -->
    <div class="top">
      <!-- 탑 네비게이터 -->
      <div class="top-center">
        <div class="top-center__contents">
          <TopNavigator/>
        </div>
      </div>
      <!-- 제목 -->
      <div class="title">2단계착수 <p>세부 현황</p></div>
      <!-- 우측 AI & EMS 운전 모드 -->
      <div class="right">
        <div class="right-contents">
          <div class="right-contents__text-first">AI 운전 모드</div>
          <div class="right-contents__btn-first">
            <div class="control_box_operation">
              <div v-if="$store.state.receiving.latest.ai_opr === 2" class="control_box_operation__btn control_box_operation__btn--on">AI</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(1, 2)">AI</div>
              <div v-if="$store.state.receiving.latest.ai_opr === 1" class="control_box_operation__btn control_box_operation__btn--on">AI추천</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(1, 1)">AI추천</div>
              <div v-if="$store.state.receiving.latest.ai_opr === 0" class="control_box_operation__btn control_box_operation__btn--on">AI분석</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(1, 0)">AI분석</div>
            </div>
          </div>
        </div>
          <!-- 정수지 목표 수위/개도율 변화 -->
          <div class="right-value">
            <div class="right-value__title">
              <div class="right-value__text"></div>
              <div class="right-value__text">정수지 목표 수위<span>(m)</span></div>
              <div class="right-value__text">개도율 변화<span>(%)</span></div>
            </div>
            <div class="right-value__num">
              <div class="right-value__text">최대</div>
              <!-- 정수지 목표 수위 최대 -->
              <div class="right-value__input-box" :class="{'': this.$store.state.indReceiving.isModifyMode}">
                <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
                :value="this.$store.state.receiving.latestModify.h_target_le_max" v-on:input="updateInput($event, 'h_target_le_max')"/>
                <span class="right-value__text-num" v-else>
                  {{ this.$store.state.receiving.latestModify.h_target_le_max | numFormat('0.0') }}
                </span>
              </div>
              <!-- 개도율 변화 최대 -->
              <div class="right-value__input-box">
                <input v-if="this.$store.state.receiving.isModifyMode" type="text"
                :value="this.$store.state.receiving.latestModify.b_valve_max"  v-on:input="updateInput($event, 'b_valve_max')"/>
                <span v-else class="right-value__text-num">{{ this.$store.state.receiving.latestModify.b_valve_max | numFormat('0.0') }}</span>
              </div>
            </div>
            <div class="right-value__num">
              <div class="right-value__text">최소</div>
              <!-- 정수지 목표 수위 최소 -->
              <div class="right-value__input-box" :class="{'': this.$store.state.indReceiving.isModifyMode}">
                <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
                :value="this.$store.state.receiving.latestModify.h_target_le_min" v-on:input="updateInput($event, 'h_target_le_min')"/>
                <span v-else class="right-value__text-num">
                  {{ this.$store.state.receiving.latestModify.h_target_le_min | numFormat('0.0') }}
                </span>
              </div>
              <!-- 개도율 변화 최소 -->
              <div class="right-value__input-box">
                <input v-if="this.$store.state.receiving.isModifyMode" type="text"
                :value="this.$store.state.receiving.latestModify.b_valve_min"  v-on:input="updateInput($event, 'b_valve_min')"/>
                <span v-else class="right-value__text-num">{{ this.$store.state.receiving.latestModify.b_valve_min | numFormat('0.0') }}</span>
              </div>
            </div>
            <div v-if="$store.state.login.user.tkn !== null" class="modify-button">
              <div class="custom-icon" @click="updateControl">
                <div :class="[ this.$store.state.receiving.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
              </div>
              <div v-if="this.$store.state.receiving.isModifyMode" class="custom-cancel-icon" style="margin-top: 5px;" @click="cancelControl">
                <div class='custom-cancel-icon__cancel'></div>
              </div>
            </div>
          </div>                   
        <!-- 정수지 목표 수위 -->
        <!-- <div class="contents-purify">
          <div class="flex-container">
            <div class="contents-purify__text--title">정수지 최대 목표 수위</div>
            <div class="contents-purify__input-box" :class="{'': this.$store.state.receiving.isModifyMode}">
              <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
              :value="this.$store.state.receiving.latestModify.h_target_le_max" v-on:input="updateInput($event, 'h_target_le_max')"/>
              <span class="contents-purify__text--num" v-else>
                {{ this.$store.state.receiving.latestModify.h_target_le_max | numFormat('0.0') }}
                </span>
                <span class="contents-purify__text--degree">m</span>
            </div>
          </div>
          <div class="flex-container">
            <div class="contents-purify__text--title">정수지 최저 목표 수위</div>
            <div class="contents-purify__input-box" :class="{'': this.$store.state.receiving.isModifyMode}">
              <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
              :value="this.$store.state.receiving.latestModify.h_target_le_min" v-on:input="updateInput($event, 'h_target_le_min')"/>
              <span class="contents-purify__text--num" v-else>
                {{ this.$store.state.receiving.latestModify.h_target_le_min | numFormat('0.0') }}
              </span>
              <span class="contents-purify__text--degree">m</span>
            </div>
          </div>
          <div v-if="$store.state.login.user.tkn !== null" class="modify-button">
            <div class="custom-icon" @click="updateControl">
              <div :class="[ this.$store.state.receiving.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
            </div>
            <div v-if="this.$store.state.receiving.isModifyMode" class="custom-cancel-icon" style="margin-top: 8px;" @click="cancelControl">
              <div class='custom-cancel-icon__cancel'></div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <!-- 중앙 컨텐츠 -->
    <div class="btn-tab">
        <div class="btn-tab__box-disabled box-center-margin" @click="$routingByIndex(22)">1단계공업</div>
        <div class="btn-tab__box-abled box-center-margin" @click="$routingByIndex(1)">2단계생활</div>
        <div class="btn-tab__box-disabled box-center-margin" @click="$routingByIndex(25)">펌프</div>
    </div>
    <div class="contents">
      <ReceivingRightContents/>
    </div>
    <!-- 하단 차트 -->
    <div class="bottom">
      <ReceivingHighchart/>
    </div>
  </div>  
</template>

<script>
import ReceivingRightContents from '@/components/receiving/ReceivingRightContents' 
import ReceivingHighchart from '@/components/receiving/ReceivingHighchart'
import { SET_OVERLAY } from '@/store'
import { GET_RECEIVING_LATEST, PUT_RECEIVING_CONTROL } from '@/store/modules/receiving' 
import { PUT_CLEAR_HISTORY_LEVEL } from '@/store/modules/clear' 
import { OPEN_AI_MODE_DIALOG } from '@/store/modules/dialog'
import TopNavigator from '@/components/core/TopNavigator'
export default {
  name:'ReceivingAlgorithm',
  data: () => ({
    timer: null, // API 요청 타이머
  }),
  components: {
    ReceivingRightContents,
    ReceivingHighchart,
    TopNavigator
  },
  methods: {
    /**
     * AI 운전모드 변경시 실행되는 함수
     * 운전모드 변경 확인 Dialog를 띄움
     */
    onClickAICheckbox: function(index, expectedValue) {
      if( this.$store.state.login.user.tkn !== null ) {
        this.$store.state.selectedBuildingIndex = index
        this.$store.dispatch('dialog/' + OPEN_AI_MODE_DIALOG, expectedValue)
      }
    },
    updateInput: function (event, key) {
      this.$store.state.receiving.latestModify[key] = event.target.value
    },
    updateControl: function() {      
      let waterLevel_min = 0
      let waterLevel_max = 10
      let b_min = 0
      let b_max = 100
      if (this.$store.state.receiving.isModifyMode) {
        if (this.$store.state.receiving.latestModify.h_target_le_max === ''
          || this.$store.state.receiving.latestModify.h_target_le_min === ''
          || this.$store.state.receiving.latestModify.b_valve_max === ''
          || this.$store.state.receiving.latestModify.b_valve_min === '') {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else if (parseFloat(this.$store.state.receiving.latestModify.h_target_le_max) < waterLevel_min || parseFloat(this.$store.state.receiving.latestModify.h_target_le_max) > waterLevel_max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '정수지 목표 수위 설정 범위', text2: waterLevel_min + ' ~ ' + waterLevel_max })
        } else if (parseFloat(this.$store.state.receiving.latestModify.b_valve_min) < b_min || parseFloat(this.$store.state.receiving.latestModify.b_valve_min) > b_max
        || parseFloat(this.$store.state.receiving.latestModify.b_valve_max) < b_min || parseFloat(this.$store.state.receiving.latestModify.b_valve_max) > b_max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '개도율 변화 설정 범위', text2: b_min + ' ~ ' + b_max })
        } else {
          let obj = {}
          obj.h_target_le_max = parseFloat(this.$store.state.receiving.latestModify.h_target_le_max).toFixed(1)
          obj.h_target_le_min = parseFloat(this.$store.state.receiving.latestModify.h_target_le_min).toFixed(1)
          obj.b_valve_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_max).toFixed(1)
          obj.b_valve_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_min).toFixed(1)
          this.$store.dispatch(PUT_RECEIVING_CONTROL, obj)
          this.$store.state.receiving.isModifyMode = !this.$store.state.receiving.isModifyMode
          this.$store.state.receiving.latest.h_target_le_max = parseFloat(this.$store.state.receiving.latestModify.h_target_le_max).toFixed(1)
          this.$store.state.receiving.latest.h_target_le_min = parseFloat(this.$store.state.receiving.latestModify.h_target_le_min).toFixed(1)
          this.$store.state.receiving.latest.b_valve_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_max).toFixed(1)
          this.$store.state.receiving.latest.b_valve_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_min).toFixed(1)
        }
      } else {
        this.$store.state.receiving.isModifyMode = !this.$store.state.receiving.isModifyMode
      }
    },
    clickControl: function() {
      this.$store.state.receiving.isModifyMode = !this.$store.state.receiving.isModifyMode
    },
    cancelControl: function() {
      this.$store.state.receiving.latestModify = Object.assign({}, this.$store.state.receiving.latest)
      this.$store.state.receiving.isModifyMode = !this.$store.state.receiving.isModifyMode
    },
  },

  /**
   * 마운트 되는 경우 실행되는 함수
   * 1분 간격으로 API 요청하는 타이머 설정
   */
  mounted: function() {
    this.$store.state.selectedBuildingIndex = 1
    this.$store.commit(SET_OVERLAY, true)
    Promise.all([
      this.$store.dispatch(GET_RECEIVING_LATEST),
      this.$store.dispatch(PUT_CLEAR_HISTORY_LEVEL, {processStep : this.$store.state.receiving.processStep})
    ]).finally(() => {
      this.$store.commit(SET_OVERLAY, false)
    })
    
    this.timer = setInterval(() => {
      this.$store.dispatch(GET_RECEIVING_LATEST),
      this.$store.dispatch(PUT_CLEAR_HISTORY_LEVEL, {processStep : this.$store.state.receiving.processStep})
    }, 60 * 1000)
  },
  /**
   * 헤제되는 경우 타이머 해제
   */
  destroyed: function () {
    clearInterval(this.timer)
  }
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
    width: 386px;
    height: 45px;
    justify-content: space-evenly;
    align-items: center;
    position: absolute;
    left: 145px;
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
// 상단 컨테이너
.top{
  display: flex;
  width: 100%;
  height: 173px;
  // 네비게이터
  .top-center{
    display: flex;
    justify-content: center;
    position: absolute;
    top:-76px;
    left: 159px;
    width: 1585px;
    height: 249px;
    background-image: url('../../assets/splashdown/top_center_background.png');
    &__contents {
      margin-top: 100px;
    }
  }
  // 제목
  .title{
    width: 230px;
    background-position: 68px 25px;
    background-image: url('../../assets/as_images/main_title.png');
    letter-spacing: 0 !important;
    text-align:left;
    line-height: 1.5;
    font-weight: 600;
    height: 100%;
    text-shadow: 0 0 9px #5cafff;
    font-family: "KHNPHUotfR";
    font-size: 30px !important;
    font-stretch: normal;
    font-style: normal;
    color: #fff;
    margin-left: 55px;
    margin-top: 35px;
  }
  p {
    font-size: 24px;
    font-weight: 300;
  }
}

// 중앙 컨텐츠
.contents{
  display: flex;
  width: 100%;
  height: 430px;
  padding: 0 40px;
}

// AI 운전모드, EMS 운전모드 제어 박스
.control_box_operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 140px;
  height: 28px;
  padding: 0px 1px;
  border-radius: 14px;
  background-color: rgba(139, 194, 240, 0.25);
  &__btn {
    height: 22px;
    color: #19274e;
    font-size: 11px;
    margin: 0px 1px;
    padding: 4px 10px 4px 10px;
    border-radius: 11px;
    cursor: pointer;
    &--on {
      box-shadow: 0 0 6px 0 #e8faff;
      background-color: #b4dffa;
    }
    &--off {
      background-color: #417290;
    }
  }
}
.right-value {
  display: flex;
  margin-top: 10px;
  &__title {
    margin-right: 3px;
  }
  &__text {
    height: 25px;
    margin-bottom: 3px;
      text-align: right;
    color: #fff;
    > span {
      color: #6c9ed1;
      font-size: 12px;
      margin-left: 5px;
    }
  }
  &__text-num {
      text-align: center;
    color: #c3eaff;
    }
  &__num {
    width: 55px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__input-box {
    width: 52px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3px;
    > input {
      width: 52px;
      height: 24px;
      color: #c3eaff;
      text-align: center;
      outline: none;
      border: solid 1px rgba(157, 191, 255, 0.3);
    }
  }
  }
  .modify-button {
    position: absolute;
  top: 85px;
  right: 8px;
    cursor: pointer;
  }
.btn-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #b4dffa;
}
// 하단 컨테이너
.bottom{
  display: flex;
  width: 100%;
  height: 392px;
  // margin-top: 30px;
}
</style>