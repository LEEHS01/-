<template>
  <div class="main">
    <!-- Top 공정 네이게이터 -->
    <div class="top-center">
      <div class="top-center__contents">
        <TopNavigator/>
      </div>
    </div>
    <!-- Top 제목, 운전모드 -->
    <div class="top">
      <div class="title">혼화응집<p>세부 현황</p></div>
      <div class="right">
        <div class="right-contents">
          <div class="right-contents__text-first">AI 운전 모드</div>
          <div class="right-contents__btn-first">
            <div class="control_box_operation">
              <div v-if="$store.state.indMixing.latest.ai_opr === 2" class="control_box_operation__btn control_box_operation__btn--on">AI</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(20, 2)">AI</div>
              <div v-if="$store.state.indMixing.latest.ai_opr === 1" class="control_box_operation__btn control_box_operation__btn--on">AI추천</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(20, 1)">AI추천</div>
              <div v-if="$store.state.indMixing.latest.ai_opr === 0" class="control_box_operation__btn control_box_operation__btn--on">AI분석</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(20, 0)">AI분석</div>
            </div>
          </div>
        </div>
        <!-- g값 상/하한 -->
        <div class="g-value">
          <div class="g-value__title">
            <div class="g-value__text"></div>
            <div class="g-value__text">상한<span>(S<sup>-1</sup>)</span></div>
            <div class="g-value__text">하한<span>(S<sup>-1</sup>)</span></div>
          </div>
          <div class="g-value__num">
            <div class="g-value__text">#1</div>
            <div class="g-value__input-box">
              <input type="text" v-if="this.$store.state.indMixing.jiModifyMode" 
              :value="this.$store.state.indMixing.latestModify.d_g_step1_max" v-on:input="updateInput($event, 'd_g_step1_max')" maxlength="4">
              <span class="g-value__text-num" v-else>{{ this.$store.state.indMixing.latestModify.d_g_step1_max | numFormat('0.0') }}</span>
            </div>
            <div class="g-value__input-box">
              <input type="text" v-if="this.$store.state.indMixing.jiModifyMode" 
              :value="this.$store.state.indMixing.latestModify.d_g_step1_min" v-on:input="updateInput($event, 'd_g_step1_min')" maxlength="4">
              <span class="g-value__text-num" v-else>{{ this.$store.state.indMixing.latestModify.d_g_step1_min | numFormat('0.0') }}</span>
            </div>
          </div>
          <div class="g-value__num">
            <div class="g-value__text">#2</div>
            <div class="g-value__input-box">
              <input type="text" class="top-one-contents-value__input" v-if="this.$store.state.indMixing.jiModifyMode" 
              :value="this.$store.state.indMixing.latestModify.d_g_step2_max" v-on:input="updateInput($event, 'd_g_step2_max')" maxlength="4">
              <span class="g-value__text-num" v-else>{{ this.$store.state.indMixing.latestModify.d_g_step2_max | numFormat('0.0') }}</span>
            </div>
            <div class="g-value__input-box">
              <input type="text" v-if="this.$store.state.indMixing.jiModifyMode" 
              :value="this.$store.state.indMixing.latestModify.d_g_step2_min" v-on:input="updateInput($event, 'd_g_step2_min')" maxlength="4">
              <span class="g-value__text-num" v-else>{{ this.$store.state.indMixing.latestModify.d_g_step2_min | numFormat('0.0') }}</span>
            </div>
          </div>
          <div class="g-value__num">
            <div class="g-value__text">#3</div>
            <div class="g-value__input-box">
              <input type="text" v-if="this.$store.state.indMixing.jiModifyMode" 
              :value="this.$store.state.indMixing.latestModify.d_g_step3_max" v-on:input="updateInput($event, 'd_g_step3_max')" maxlength="4">
              <span class="g-value__text-num" v-else>{{ this.$store.state.indMixing.latestModify.d_g_step3_max | numFormat('0.0') }}</span>
            </div>
            <div class="g-value__input-box">
              <input type="text" v-if="this.$store.state.indMixing.jiModifyMode" 
              :value="this.$store.state.indMixing.latestModify.d_g_step3_min" v-on:input="updateInput($event, 'd_g_step3_min')" maxlength="4">
              <span class="g-value__text-num" v-else>{{ this.$store.state.indMixing.latestModify.d_g_step3_min | numFormat('0.0') }}</span>
            </div>
          </div>
          <div class="right-contents__icon">
            <div v-if="$store.state.login.user.tkn !== null" class="custom-icon" @click="updateControl">
              <div :class="[ this.$store.state.indMixing.jiModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
            </div>
            <div v-if="this.$store.state.indMixing.jiModifyMode" class="custom-cancel-icon" @click="cancelControl">
              <div class='custom-cancel-icon__cancel'></div>
            </div>
          </div>
        </div>        
      </div>
    </div>
    <div class="contents">
      <!-- 혼화응집 공정 이미지 -->
      <div class="contents__left">
        <IndMtccLeftContents/>
      </div>
      <!-- 혼화응집 주요인자, AI응집기 설정 속도 예측, 차트 -->
      <div class="contents__right">
        <IndMtccRightContents/>
      </div>
      <!-- 자동모드 상세 팝업 -->
      <AutoModeDetailPopup/>
    </div>
  </div>  
</template>
<script>
import IndMtccLeftContents from '@/components/indMixingTank/IndMtccLeftContents' 
import IndMtccRightContents from '@/components/indMixingTank/IndMtccRightContents' 
import { SET_OVERLAY } from '@/store'
import { GET_INDMIXING_LATEST, PUT_MIXING_HISTORY_FC_SP, PUT_INDMIXING_CONTROL_AI } from '@/store/modules/indMixing'
import { PUT_RAW_HISTORY_TE } from '@/store/modules/raw'
import { OPEN_AI_MODE_DIALOG } from '@/store/modules/dialog'
import TopNavigator from '@/components/core/TopNavigator'
import AutoModeDetailPopup from '@/components/dialog/AutoModeDetailPopup'
export default {
  name:'IndMtccAlgorithm',
  components: {
    IndMtccLeftContents,
    IndMtccRightContents,
    TopNavigator,
    AutoModeDetailPopup
  },
  methods: {
    /**
     * AI운전모드 변경시 
     * AI운전모드 확인 Dialog 오픈
     * 
     * @param index 공정 index
     * @param expectedValue 변경하고자 하는 운전모드
     */
    onClickAICheckbox: function(index, expectedValue) {
      if( this.$store.state.login.user.tkn !== null ) {
        this.$store.state.selectedBuildingIndex = index
        this.$store.dispatch('dialog/' + OPEN_AI_MODE_DIALOG, expectedValue)
      }
    },
    dataDetail: function() {
      this.$store.state.indMixing.processStep = 1
      this.$store.state.selectedBuildingIndex = 20
      this.$store.state.indMixing.isModifyMode = false
      this.$store.commit(SET_OVERLAY, true)
      Promise.all([
        this.$store.dispatch(GET_INDMIXING_LATEST),
        this.$store.dispatch(PUT_RAW_HISTORY_TE, this.$store.state.indMixing.processStep),
        this.$store.dispatch(PUT_MIXING_HISTORY_FC_SP)
      ]).finally(() => {
        this.$store.state.dialog.aiMode.d_g_value_ctr_flag = this.$store.state.indMixing.latest.d_g_value_ctr_flag
        this.$store.commit(SET_OVERLAY, false)
      })
      
      this.timer = setInterval(() => {
        this.$store.dispatch(GET_INDMIXING_LATEST),
        this.$store.dispatch(PUT_RAW_HISTORY_TE, this.$store.state.indMixing.processStep),
        this.$store.dispatch(PUT_MIXING_HISTORY_FC_SP)
      }, 60 * 1000)
    },
    /**
     * 사용자 설정 업데이트 버튼 선택시 
     * 유효성 검사 후 사용자 설정 업데이트 API 요청
     */
     updateControl: function() {      
      let min = 0
      let max = 100
      if (this.$store.state.indMixing.jiModifyMode) {
        if (this.$store.state.indMixing.latestModify.d_g_step1_min === ''
          || this.$store.state.indMixing.latestModify.d_g_step1_max === ''
          || this.$store.state.indMixing.latestModify.d_g_step2_min === ''
          || this.$store.state.indMixing.latestModify.d_g_step2_max === ''
          || this.$store.state.indMixing.latestModify.d_g_step3_min === ''
          || this.$store.state.indMixing.latestModify.d_g_step3_max === ''
          ) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else if (parseInt(this.$store.state.indMixing.latestModify.d_g_step1_min) <= min 
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step1_min) >= max
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step1_max) <= min
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step1_max) >= max
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step2_min) <= min
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step2_min) >= max
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step2_max) <= min
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step2_max) >= max
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step3_min) <= min
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step3_min) >= max
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step3_max) <= min
                  || parseInt(this.$store.state.indMixing.latestModify.d_g_step3_max) >= max
                  ) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '설정 범위', text2: min + ' ~ ' + max })
        } else {
          let obj = {}
          obj.jiModifyMode = this.$store.state.indMixing.jiModifyMode
          obj.d_g_step1_min = parseFloat(this.$store.state.indMixing.latestModify.d_g_step1_min)
          obj.d_g_step1_max = parseFloat(this.$store.state.indMixing.latestModify.d_g_step1_max)
          obj.d_g_step2_min = parseFloat(this.$store.state.indMixing.latestModify.d_g_step2_min)
          obj.d_g_step2_max = parseFloat(this.$store.state.indMixing.latestModify.d_g_step2_max)
          obj.d_g_step3_min = parseFloat(this.$store.state.indMixing.latestModify.d_g_step3_min)
          obj.d_g_step3_max = parseFloat(this.$store.state.indMixing.latestModify.d_g_step3_max)
          this.$store.dispatch(PUT_INDMIXING_CONTROL_AI, obj)
          this.$store.state.indMixing.jiModifyMode = !this.$store.state.indMixing.jiModifyMode
        }
      } else {
        this.$store.state.indMixing.jiModifyMode = !this.$store.state.indMixing.jiModifyMode
      }
    },
    cancelControl: function() {
      this.$store.state.indMixing.latestModify = Object.assign({}, this.$store.state.indMixing.latest)
      this.$store.state.indMixing.jiModifyMode = !this.$store.state.indMixing.jiModifyMode
    },
    /**
     * 사용자 설정 input 값이 변경 되는 경우
     * 
     * @param event change 이벤트
     * @param key 변경되는 값
     */
     updateInput: function (event, key) {
      this.$store.state.indMixing.latestModify[key] = event.target.value
    },
  },
  /**
   * 마운트시 실행되는 함수
   * 혼화응집에 필요한 API를 주기적으로 요청함
   */
  mounted: function() {
    this.dataDetail()
  },
  watch: {
    '$store.state.indMixing.selectedFCLocation': function() {
      //20260421 펜타 하자보수 시각화 수정 요청 작업자 : 온더시스 이현수 / 1~10지 추가로인한 딜레이 발생으로 NULL 처리 때문에 해당코드에서 오류발생
      //this.dataDetail()
    }
  },
  /**
   * 마운트 해제시 
   * API 요청 타이머 해제
   */
  destroyed: function () {
    clearInterval(this.timer)
  }
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
  height: 795px;
  padding: 0 40px 0 70px;
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
  .g-value {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    width: 235px;
    &__title {
      width: 65px;
    }
    &__text {
      height: 25px;
      margin-bottom: 3px;
      text-align: center;
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
  .title-down{
    position: absolute;
    width: 177px;
    height: 53px;
    background-image: url('../../assets/percolation/title_down.png');
    left: 35px;
    top: 167px;
    &__text{
      text-shadow: 0 0 9px #5cafff;
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 3;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
    }
    &__digital{
      text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
      font-family: "LAB디지털" !important;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.17;
      letter-spacing: normal;
      text-align: center;
      color: #ccf1ff;
      margin: 0 5px;
    }
  }
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
  .right-contents {
    &__icon {
      top: 86px;
      right: 20px;
    }
  }
  // .right{
  //   width: 190px;
  //   margin-left: auto;
  //   margin-right: 29px;
  //   .right-contents{
  //     display: flex;
  //     width: 100%;
  //     margin-top: 20px;
  //     &__text-first{
  //       text-shadow: 0 0 9px #5cafff;
  //       font-family: "KHNPHUotfR";
  //       font-size: 18px;
  //       font-weight: normal;
  //       font-stretch: normal;
  //       font-style: normal;
  //       letter-spacing: normal;
  //       text-align: left;
  //       color: #c3eaff;
  //     }
  //     &__btn-first{
  //       width: 60px;
  //       height: 28px;
  //       margin-left: auto;
  //       .checkbox{
  //         position:relative;
  //         cursor:pointer;
  //         appearance:none;
  //         width:60px;
  //         height:28px;
  //         border-radius: 14px;
  //         border: solid 1px #417290;
  //         background-color: rgba(139, 194, 240, 0.25);
  //         outline:none;
  //         transition:0.3s;
  //       }
  //       .checkbox::before{
  //         content:"OFF";
  //         position:absolute;
  //         height:22px;
  //         width:29px;
  //         border-radius:11px;
  //         background:#b4dffa;
  //         top:2px;
  //         left:2px;
  //         transition:0.3s ease-in-out;
  //         font-size: 11px;
  //         font-family: KHNPHUotfR;
  //         font-weight: normal;
  //         font-stretch: normal;
  //         font-style: normal;
  //         line-height: 2;
  //         letter-spacing: normal;
  //         text-align: center;
  //         color: #19274e;
  //         background-color: rgba(122, 155, 175, 0.25);
  //       }
  //       .checkbox:checked::before{
  //         content:"AI";
  //         transform:translateX(25px);
  //         background:#b4dffa;
  //       }
  //       .checkbox:checked{
  //         border-color:#b4dffa;
  //       } 
  //     }
  //     &__text-second{
  //       text-shadow: 0 0 9px #5cafff;
  //       font-family: "KHNPHUotfR";
  //       font-size: 18px;
  //       font-weight: normal;
  //       font-stretch: normal;
  //       font-style: normal;
  //       letter-spacing: normal;
  //       text-align: left;
  //       color: #80b6ff;
  //     }
  //     &__btn-second{
  //       width: 60px;
  //       height: 28px;
  //       margin-left: auto;
  //       .checkbox{
  //         position:relative;
  //         cursor:pointer;
  //         appearance:none;
  //         width:60px;
  //         height:28px;
  //         border-radius: 14px;
  //         border: solid 1px #417290;
  //         background-color: rgba(139, 194, 240, 0.25);
  //         outline:none;
  //         transition:0.3s;
  //       }
  //       .checkbox::before{
  //         content:"OFF";
  //         position:absolute;
  //         height:22px;
  //         width:29px;
  //         border-radius:11px;
  //         background-color: rgba(122, 155, 175, 0.25);
  //         top:2px;
  //         left:2px;
  //         transition:0.3s ease-in-out;
  //         font-size: 11px;
  //         font-family: KHNPHUotfR;
  //         font-weight: normal;
  //         font-stretch: normal;
  //         font-style: normal;
  //         line-height: 2;
  //         letter-spacing: normal;
  //         text-align: center;
  //         color: #19274e;
  //       }
  //       .checkbox:checked::before{
  //         content:"AI";
  //         transform:translateX(25px);
  //         background:#80b6ff;
          
  //       }
  //       .checkbox:checked{
  //         border-color:#80b6ff;
  //       } 
  //     }
  //   }
  // }
}
</style>