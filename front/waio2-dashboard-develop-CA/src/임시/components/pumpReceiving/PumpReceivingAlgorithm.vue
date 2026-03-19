<template>
  <div class="main">
    <!-- Top 네비게이터 -->
    <div class="top-center">
      <div class="top-center__contents">
        <TopNavigator/>
      </div>
    </div>
    <!-- Top 제목, 운전 모드 제어 -->
    <div class="top">
      <div class="title">펌프 제어<p>세부 현황</p></div>
      <div class="right">
        <div class="right-contents">
          <div class="right-contents__text-first">AI 운전 모드</div>
          <div class="right-contents__btn-first">
            <div class="btn-contents__btn">
              <div class="control_box_operation">
                <div v-if="$store.state.pumpReceiving.latest.ai_opr === 2" class="control_box_operation__btn control_box_operation__btn--on">AI</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(1.4, 2)">AI</div>
              <div v-if="$store.state.pumpReceiving.latest.ai_opr === 1" class="control_box_operation__btn control_box_operation__btn--on">AI추천</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(1.4, 1)">AI추천</div>
              <div v-if="$store.state.pumpReceiving.latest.ai_opr === 0" class="control_box_operation__btn control_box_operation__btn--on">AI분석</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(1.4, 0)">AI분석</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contents">
      <!-- 왼쪽 현재 전동가압장 상태 -->
      <div class="contents__left">
        <PumpReceivingLeftContents/>
      </div>
      <!-- 오른쪽 주요인자, 알고리즘 예측, 예측결과, 원수 유입 유량 예측 -->
      <div class="contents__right">
        <PumpReceivingRightContents/>
        <!-- 펌프 팝업 추가 -->
        <PumpDetailPopup />
      </div>
    </div>
  </div>  
</template>
<script>
import PumpReceivingLeftContents from '@/components/pumpReceiving/PumpReceivingLeftContents' 
import PumpReceivingRightContents from '@/components/pumpReceiving/PumpReceivingRightContents'
import { SET_OVERLAY } from '@/store'
import { GET_PUMPRECEIVING_LATEST } from '@/store/modules/pumpReceiving'
import { PUT_CLEAR_HISTORY_LEVEL } from '@/store/modules/fstClear' 
import TopNavigator from '@/components/core/TopNavigator'
import { OPEN_AI_MODE_DIALOG } from '@/store/modules/dialog'
import PumpDetailPopup from '@/components/pumpReceiving/PumpDetailPopup'
import { CLOSE_POPUP } from '@/store/modules/pumpReceiving'
export default {
  name:'CgAlgorithm',
  data: () => ({
    intervalTime: 60 * 1000 // API 요청 주기
  }),
  components: {
    PumpReceivingLeftContents,
    PumpReceivingRightContents,
    TopNavigator,
    PumpDetailPopup
  },
  methods: {
    /**
     * AI 운전모드 클릭시
     * 운전모드 변경 Dialog 오픈
     * 
     * @param index 공정index
     * @expectedValue 변경할 운전모드
     */
    onClickAICheckbox: function(index, expectedValue) {
      if( this.$store.state.login.user.tkn !== null ) {
        this.$store.state.selectedBuildingIndex = index
        this.$store.dispatch('dialog/' + OPEN_AI_MODE_DIALOG, expectedValue)
      }
    }
  },
  /**
   * 마운트시 실행되는 함수
   * 약품 공정에 필요한 API를 주기적으로 요청
   */
  mounted: function() {
    this.$store.state.selectedBuildingIndex = 1.4
    this.$store.commit(SET_OVERLAY, true)
    Promise.all([
        this.$store.dispatch(GET_PUMPRECEIVING_LATEST),
        this.$store.dispatch(PUT_CLEAR_HISTORY_LEVEL)
    ]).finally(() => {
        this.$store.commit(SET_OVERLAY, false)
    })

    this.timer = setInterval(() => {
      this.$store.dispatch(GET_PUMPRECEIVING_LATEST),
      this.$store.dispatch(PUT_CLEAR_HISTORY_LEVEL)
    }, 60 * 1000)
  },
  // 마운트 해제시 API 요청 타이머 해제
  destroyed: function () {
    clearInterval(this.timer)
  },
  closePopup: function () {
    this.$store.dispatch('pumpReceiving/' + CLOSE_POPUP)
  },
}
</script>
<style lang="scss" scoped>
.bottom{
  display: flex;
  width: 100%;
  height: 392px;
}
.contents{
  display: flex;
  width: 100%;
  height: 840px;
  padding: 0 40px;
}
.top-center{
  display: flex;
  justify-content: center;
  position: absolute;
  top:-76px;
  left: 159px;
  width: 1585px;
  height: 249px;
  background-image: url('../../assets/splashdown/top_center_background.png');
  .timer{
    width: 72px;
    height: 72px;
    margin-top: 110px;
    margin-right: 14px;
  }
  &__contents{
    margin-top: 100px;
  }
}
.top{
  display: flex;
  width: 100%;
  height: 173px;
  .title{
    width: 230px;
    background-position: 68px 25px;
    background-image: url('../../assets/ca_images/main_title.png');
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
  // 정수지 목표 수위 박스
  .contents-purify {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 87%;
    margin: 15px 0 0 0;
    &__input-box {
      > input {
        padding: 5px;
        margin: 0;
        width: 57px;
        height: 28px;
        border: solid 1px rgba(157, 191, 255, 0.3);
        outline: none;
        font-family: "LAB디지털" !important;
        text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
        color: #ccf1ff;
        font-size: 24px;
        text-align: right;
      }
    }
    &__text {
      font-family: KHNPHUotfR;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      &--title {
        text-shadow: 0 0 9px #5cafff;
        line-height: 1.07;
        color: #fff;
      }
      &--num {
        padding: 0 7.5px 0 0;
        text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
        font-family: "LAB디지털" !important;
        font-size: 24px;
        line-height: 1.21;
        text-align: right;
        color: #ccf1ff;
      }
      &--degree {
        line-height: 2.43;
        text-align: left;
        color: #417db9;
      }
      &--input {
        text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
        font-family: "LAB디지털" !important;
        font-size: 24px;
        line-height: 1.21;
        text-align: center;
        color: #ccf1ff;
      }
    }
    .flex-container {
      height: 35px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .modify-button {
      position: absolute;
      top: 5px;
      right: -40px;
      cursor: pointer;
    }
  }
</style>