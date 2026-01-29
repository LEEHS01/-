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
      <div class="title">착수<p>세부 현황</p></div>
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
        <div class="modBtnWrap">
          <button class="modBtn" @click="onClickModReceiving()">사용자제어 설정</button>
        </div>
        <!-- 정수지 목표 수위/개도율 변화 -->
        <!-- <div class="right-value">
          <div class="right-value__title">
            <div class="right-value__text"></div>
            <div class="right-value__text">정수지 목표 수위<span>(m)</span></div>
            <div class="right-value__text">가이드 베인 변화<span>(%)</span></div>
            <div class="right-value__text">바이패스 변화<span>(%)</span></div>
          </div>
          <div class="right-value__num">
            <div class="right-value__input-box">
              <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
              :value="this.$store.state.receiving.latestModify.h_target_le_max" v-on:input="updateInput($event, 'h_target_le_max')"/>
              <span class="right-value__text-num" v-else>
                {{ this.$store.state.receiving.latestModify.h_target_le_max | numFormat('0.0') }}
              </span>
            </div>
            <div class="right-value__input-box">
              <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
              :value="this.$store.state.receiving.latestModify.b_valve_gv_max" v-on:input="updateInput($event, 'b_valve_gv_max')"/>
              <span class="right-value__text-num" v-else>
                {{ this.$store.state.receiving.latestModify.b_valve_gv_max | numFormat('0.0') }}
              </span>
            </div>
            <div class="right-value__input-box">
              <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
              :value="this.$store.state.receiving.latestModify.b_valve_bypass_max" v-on:input="updateInput($event, 'b_valve_bypass_max')"/>
              <span class="right-value__text-num" v-else>
                {{ this.$store.state.receiving.latestModify.b_valve_bypass_max | numFormat('0.0') }}
              </span>
            </div>
          </div>
          <div class="right-value__num">
            <div class="right-value__input-box">
              <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
              :value="this.$store.state.receiving.latestModify.h_target_le_min" v-on:input="updateInput($event, 'h_target_le_min')"/>
              <span class="right-value__text-num" v-else>
                {{ this.$store.state.receiving.latestModify.h_target_le_min | numFormat('0.0') }}
              </span>
            </div>
            <div class="right-value__input-box">
              <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
              :value="this.$store.state.receiving.latestModify.b_valve_gv_min" v-on:input="updateInput($event, 'b_valve_gv_min')"/>
              <span class="right-value__text-num" v-else>
                {{ this.$store.state.receiving.latestModify.b_valve_gv_min | numFormat('0.0') }}
              </span>
            </div>
            <div class="right-value__input-box">
              <input v-if="this.$store.state.receiving.isModifyMode" type="text" 
              :value="this.$store.state.receiving.latestModify.b_valve_bypass_min" v-on:input="updateInput($event, 'b_valve_bypass_min')"/>
              <span class="right-value__text-num" v-else>
                {{ this.$store.state.receiving.latestModify.b_valve_bypass_min | numFormat('0.0') }}
              </span>
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
        </div>     -->
      </div>
    </div>
    <!-- 중앙 컨텐츠 -->
    <div class="contents">
      <ReceivingRightContents/>
    </div>
    <!-- 하단 차트 -->
    <div class="bottom">
      <ReceivingHighchart/>
    </div>
    <!-- 사용자제어 입력 팝업 -->
    <ReceivingPopup/>
  </div>  
</template>

<script>
import ReceivingRightContents from '@/components/receiving/ReceivingRightContents' 
import ReceivingHighchart from '@/components/receiving/ReceivingHighchart'
import { SET_OVERLAY } from '@/store'
import { GET_RECEIVING_LATEST, PUT_RECEIVING_CONTROL_LEVEL } from '@/store/modules/receiving' 
import { PUT_CLEAR_HISTORY_LEVEL } from '@/store/modules/clear' 
import { OPEN_AI_MODE_DIALOG } from '@/store/modules/dialog'
import TopNavigator from '@/components/core/TopNavigator'
import ReceivingPopup from '@/components/dialog/ReceivingPopup'
export default {
  name:'ReceivingAlgorithm',
  data: () => ({
    timer: null, // API 요청 타이머
  }),
  components: {
    ReceivingRightContents,
    ReceivingHighchart,
    TopNavigator,
    ReceivingPopup
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
        || this.$store.state.receiving.latestModify.b_valve_gv_max === ''
        || this.$store.state.receiving.latestModify.b_valve_gv_min === ''
        || this.$store.state.receiving.latestModify.b_valve_bypass_max === ''
        || this.$store.state.receiving.latestModify.b_valve_bypass_min === '') {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else if (parseFloat(this.$store.state.receiving.latestModify.h_target_le_min) < waterLevel_min || parseFloat(this.$store.state.receiving.latestModify.h_target_le_max) > waterLevel_max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '정수지 목표 수위 설정 범위', text2: waterLevel_min + ' ~ ' + waterLevel_max })
        } else if (parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_min) < b_min || parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_max) > b_max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '개도율 변화 설정 범위', text2: b_min + ' ~ ' + b_max })
        } else if (parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_min) < b_min || parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_max) > b_max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '개도율 변화 설정 범위', text2: b_min + ' ~ ' + b_max })
        } else {
          let obj = {}
          obj.h_target_le_max = parseFloat(this.$store.state.receiving.latestModify.h_target_le_max).toFixed(1)
          obj.h_target_le_min = parseFloat(this.$store.state.receiving.latestModify.h_target_le_min).toFixed(1)
          obj.b_valve_gv_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_max).toFixed(1)
          obj.b_valve_gv_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_min).toFixed(1)
          obj.b_valve_bypass_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_max).toFixed(1)
          obj.b_valve_bypass_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_min).toFixed(1)
          this.$store.dispatch(PUT_RECEIVING_CONTROL_LEVEL, obj)
          this.$store.state.receiving.isModifyMode = !this.$store.state.receiving.isModifyMode
          this.$store.state.receiving.latest.h_target_le_max = parseFloat(this.$store.state.receiving.latestModify.h_target_le_max).toFixed(1)
          this.$store.state.receiving.latest.h_target_le_min = parseFloat(this.$store.state.receiving.latestModify.h_target_le_min).toFixed(1)
          this.$store.state.receiving.latest.b_valve_gv_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_max).toFixed(1)
          this.$store.state.receiving.latest.b_valve_gv_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_min).toFixed(1)
          this.$store.state.receiving.latest.b_valve_bypass_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_max).toFixed(1)
          this.$store.state.receiving.latest.b_valve_bypass_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_min).toFixed(1)
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

    onClickModReceiving: function() {
      if (this.$store.state.login.user.tkn !== null) {
        this.$store.state.dialog.receiving.visible = true
        this.$store.state.receiving.isModifyMode = true
      }
    }
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
      this.$store.dispatch(PUT_CLEAR_HISTORY_LEVEL)
    ]).finally(() => {
      this.$store.commit(SET_OVERLAY, false)
    })
    
    this.timer = setInterval(() => {
      this.$store.dispatch(GET_RECEIVING_LATEST),
      this.$store.dispatch(PUT_CLEAR_HISTORY_LEVEL)
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
// 상단 컨테이너
.top{
  display: flex;
  width: 100%;
  height: 173px;
  .modBtnWrap {
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }
  .modBtn {
    width: 180px;
    height: 38px;
    background-color: #375370;
    border: 1px solid #b4dffa;
    color: #fff;
    font-size: 14px;
  }
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
    background-image: url('../../assets/br_images/main_title.png');
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
  top: 60px;
  right: 10px;
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
}
</style>