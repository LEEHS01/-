<template>
  <div v-if="this.$store.state.dialog.aiMode.visible" class="popup">
    <div v-if="this.$store.state.dialog.aiMode.changeAllAIMode" class="popup__inner">
      <div class="popup__title">
        <div class="popup__icon"></div>
        <span>전체 공정</span>
      </div>
      <div class="popup__body">
        <!-- <span class="popup__body--large">{{ this.IsAIMode ? 'AI분석모드' : 'AI모드'}}</span>로 변경하시겠습니까? -->
        <span v-if="this.$store.state.dialog.aiMode.expectedValue === 0" class="popup__body--large">전체 공정을 AI분석모드로 변경하시겠습니까?</span>
        <span v-if="this.$store.state.dialog.aiMode.expectedValue === 1" class="popup__body--large">전체 공정을 AI추천모드로 변경하시겠습니까?</span>
        <span v-if="this.$store.state.dialog.aiMode.expectedValue === 2" class="popup__body--large">전체 공정을 AI모드로 변경하시겠습니까?</span>
      </div>
      <div class="popup__bottom">
        <div class="btn btn--cancel" @click="closePopup()">취소</div>
        <div class="btn btn--change" @click="changeAllAIMode()">변경</div>
      </div>
    </div>
    <div v-else class="popup__inner">
      <div class="popup__title">
        <div class="popup__icon"></div>
        <span>{{ this.GetTitle + ' ' }}</span>
      </div>
      <div class="popup__body">
        <span v-if="this.$store.state.dialog.aiMode.expectedValue === 0" class="popup__body--large">AI분석모드로 변경하시겠습니까?</span>
        <span v-if="this.$store.state.dialog.aiMode.expectedValue === 1" class="popup__body--large">AI추천모드로 변경하시겠습니까?</span>
        <span v-if="this.$store.state.dialog.aiMode.expectedValue === 2" class="popup__body--large">AI모드로 변경하시겠습니까?</span>
        <span v-if="this.$store.state.dialog.aiMode.d_g_value_ctr_flag == 0" class="popup__body--large">
          수동모드로 변경하시겠습니까?<br/>교반강도(G)값을 입력해주세요.
        </span>
        <span v-if="this.$store.state.dialog.aiMode.d_g_value_ctr_flag == 1" class="popup__body--large">
          자동모드로 변경하시겠습니까?
        </span>
      </div>
      <div class="popup__bottom">
        <div class="btn btn--cancel" @click="closePopup()">취소</div>
        <div class="btn btn--change" @click="changeAIMode()">변경</div>
      </div>
    </div>
  </div>  
</template>
<script>
import { CLOSE_ALL_AI_MODE_DIALOG, CHANGE_ALL_AI_MODE } from '@/store/modules/dialog'
import { PUT_MIXING_CONTROL_OPERATION, GET_MIXING_LATEST, PUT_MIXING_CONTROL_AI } from '@/store/modules/mixing'
import { PUT_INDMIXING_CONTROL_OPERATION, GET_INDMIXING_LATEST, PUT_INDMIXING_CONTROL_AI } from '@/store/modules/indMixing'
import { PUT_TRTINDMIXING_CONTROL_OPERATION, GET_TRTINDMIXING_LATEST, PUT_TRTINDMIXING_CONTROL_AI } from '@/store/modules/trtIndMixing'
import { PUT_RECEIVING_CONTROL_OPERATION } from '@/store/modules/receiving'
import { PUT_DISINFECTION_CONTROL_OPERATION_PRE } from '@/store/modules/disinfection'
import { PUT_DISINFECTION_CONTROL_OPERATION_POST } from '@/store/modules/disinfection'
import { PUT_SEDIMENTATION_CONTROL_OPERATION } from '@/store/modules/sedimentation'
import { PUT_FILTER_CONTROL_OPERATION } from '@/store/modules/filter'
import { PUT_GAC_CONTROL_OPERATION } from '@/store/modules/gac'
import { PUT_COAGULANTS_CONTROL_OPERATION } from '@/store/modules/coagulants'
import { PUT_INDCOAGULANTS_CONTROL_OPERATION } from '@/store/modules/indCoagulants'
import { PUT_TRTINDCOAGULANTS_CONTROL_OPERATION } from '@/store/modules/trtIndCoagulants'
import { PUT_OZONE_CONTROL_OPERATION } from '@/store/modules/ozone'

export default {
  data: () => ({
  }),
  computed: {
    GetTitle() {
      switch(this.$store.state.selectedBuildingIndex) {
        case 1:
          if (this.$store.state.dialog.aiMode.processStep === 1) {
            return '1단계공업 펌프'
          } else if (this.$store.state.dialog.aiMode.processStep === 2) {
            return '2단계생활 착수'
          } else if (this.$store.state.dialog.aiMode.processStep === 3) {
            return '3단계공업 착수'
          } else {
            return '착수'
          }
        case 2:
          return '2단계생활 약품'
        case 3:
          return '2단계생활 혼화응집'
        case 4:
          return '2단계생활 침전'
        case 5:
          return '2단계 여과'
        case 6:
          return 'GAC여과'
        // case 7:
        //   if (this.$store.state.dialog.aiMode.disinfectionIndex === 'pre') {
        //     return '소독 전염소'
        //   } else if (this.$store.state.dialog.aiMode.disinfectionIndex === 'peri') {
        //     return '소독 중염소'
        //   } else if (this.$store.state.dialog.aiMode.disinfectionIndex === 'post') {
        //     return '소독 후염소'
        //   } else {
        //     return '소독'
        //   }
        case 7.1:
          return '소독 전차염'
        case 7.4:
          return '소독 전차염'
        case 7.5:
          return '소독 전차염'
        case 7.3:
          return '소독 후차염'
        case 11:
          return '오존'
        case 16:
          return '3단계공업 약품'
        case 17:
          return '3단계공업 혼화응집'
        case 18:
          return '3단계공업 침전'
        case 19:
          return '1단계공업 약품'
        case 20:
          return '1단계공업 혼화응집'
        case 21:
          return '1단계공업 침전'
        default:
          return '전체 공정'
      }
    },
    SelectedBuildingURL() {
      switch(this.$store.state.selectedBuildingIndex) {
        case 1:
          return PUT_RECEIVING_CONTROL_OPERATION
        case 2:
          return PUT_COAGULANTS_CONTROL_OPERATION
        case 3:
          return PUT_MIXING_CONTROL_OPERATION
        case 4:
          return PUT_SEDIMENTATION_CONTROL_OPERATION
        case 5:
          return PUT_FILTER_CONTROL_OPERATION
        case 6:
          return PUT_GAC_CONTROL_OPERATION
        // case 7:
        //   if (this.$store.state.dialog.aiMode.disinfectionIndex === 'pre') {
        //     return PUT_DISINFECTION_CONTROL_OPERATION_PRE
        //   } else if (this.$store.state.dialog.aiMode.disinfectionIndex === 'peri') {
        //     return PUT_DISINFECTION_CONTROL_OPERATION_PERI
        //   } else if (this.$store.state.dialog.aiMode.disinfectionIndex === 'post') {
        //     return PUT_DISINFECTION_CONTROL_OPERATION_POST
        //   } else {
        //     return ''
        //   }
        case 7.1:
          return PUT_DISINFECTION_CONTROL_OPERATION_PRE
        case 7.4:
          return PUT_DISINFECTION_CONTROL_OPERATION_PRE
        case 7.5:
          return PUT_DISINFECTION_CONTROL_OPERATION_PRE
        case 7.3:
          return PUT_DISINFECTION_CONTROL_OPERATION_POST
        case 11:
          return PUT_OZONE_CONTROL_OPERATION
        case 16: // 공업3차 약품
          return PUT_TRTINDCOAGULANTS_CONTROL_OPERATION
        case 17: // 공업3차 혼화응집
          return PUT_TRTINDMIXING_CONTROL_OPERATION
        case 18: // 공업3차 침전
          return PUT_SEDIMENTATION_CONTROL_OPERATION
        case 19: // 공업약품
          return PUT_INDCOAGULANTS_CONTROL_OPERATION
        case 20: // 공업혼화응집
          return PUT_INDMIXING_CONTROL_OPERATION
        case 21: // 공업침전
          return PUT_SEDIMENTATION_CONTROL_OPERATION
        default:
          return ''
      }
    }
  },
  methods: {
    closePopup: function () {
      if(this.$store.state[this.$store.state.dialog.aiMode.mixingStep] !== undefined) {
        this.$store.state.dialog.aiMode.d_g_value_ctr_flag = this.$store.state[this.$store.state.dialog.aiMode.mixingStep].latest.d_g_value_ctr_flag
      }
      this.$store.dispatch('dialog/' + CLOSE_ALL_AI_MODE_DIALOG)
    },
    changeAIMode: function () {
      if(this.$store.state.dialog.aiMode.d_g_value_ctr_flag != null) {
        let mixingStep = this.$store.state[this.$store.state.dialog.aiMode.mixingStep];
        mixingStep.isModifyMode = false
        
        if(this.$store.state.dialog.aiMode.d_g_value_ctr_flag == 1) { // 자동모드
          this.$store.dispatch(mixingStep.processStep == 1 ? PUT_INDMIXING_CONTROL_AI : mixingStep.processStep == 2 ? PUT_MIXING_CONTROL_AI : PUT_TRTINDMIXING_CONTROL_AI, { d_g_value_ctr_flag : this.$store.state.dialog.aiMode.d_g_value_ctr_flag })
          this.$store.dispatch(mixingStep.processStep == 1 ? GET_INDMIXING_LATEST : mixingStep.processStep == 2 ? GET_MIXING_LATEST : GET_TRTINDMIXING_LATEST)
          for(let i = 1; i <= 3; i++) {
            mixingStep.latestModify[`d_g_value`+ i] = mixingStep.latest[`d_g_value`+ i] 
          }
          
        } else { // 수동모드
          this.$store.state.indMixing.isModifyMode = !this.$store.state.indMixing.isModifyMode
          for(let key in this.$store.state[this.$store.state.dialog.aiMode.mixingStep].latest.d_value) {
            this.$store.state[this.$store.state.dialog.aiMode.mixingStep].latestModify[key] = this.$store.state[this.$store.state.dialog.aiMode.mixingStep].latest.d_value[key]
          }
        }
        this.$store.dispatch('dialog/' + CLOSE_ALL_AI_MODE_DIALOG)
      } else {
        this.$store.state.disinfection.selectedDisinfectionIndex = this.$store.state.dialog.aiMode.disinfectionIndex == 'post' ? 3 : 1
        this.$store.dispatch(this.SelectedBuildingURL, { operation: this.$store.state.dialog.aiMode.expectedValue, processStep: this.$store.state.dialog.aiMode.processStep })
      }
    },
     changeAllAIMode: function () {
      this.$store.dispatch('dialog/' + CHANGE_ALL_AI_MODE)
    }
  },
  mounted: function() {
  },
  destroyed: function() {
  },
  watch: {
    '$store.state.dialog.aiMode.visible': function (newVal) {
      if (newVal) {
        if (this.$store.state.dialog.aiMode.expectedValue === 0) {
          this.$speak("AI분석모드로 변경하시겠습니까?")
        } else if (this.$store.state.dialog.aiMode.expectedValue === 1) {
          this.$speak("AI추천모드로 변경하시겠습니까?")
        } else if (this.$store.state.dialog.aiMode.expectedValue === 2) {
          this.$speak("AI모드로 변경하시겠습니까?")
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.popup{
  position: absolute;
  // top: -85px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(30,37,61,0.8);
  z-index: 200;
  &__inner{
    width: 463px;
    // height: 213px;
    background-image: url('../../assets/dialog/background.png');
    padding: 25px;
    background-size: 100% 100%;
  }
  &__title {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    font-size: 24px;
    color: #b4dffb;
  }
  &__icon {
    width: 17px;
    height: 28px;
    margin-right: 15px;
    background-image: url('../../assets/dialog/ai_header_icon.png');
    background-size: 100% 100%;
  }
  &__body {
    padding: 10px 15px;
    font-size: 16px;
    color: #fff;
    &--large {
      font-size: 20px;
      word-break: keep-all;
    }
  }
  &__bottom {
    display:flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 15px;
  }
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 105px;
  height: 34px;
  font-size: 15px;
  color: white;
  margin: 0px 10px;
  cursor: pointer;
  &--cancel {
    border: solid 1px #b4dffa;
    background-color: rgba(185, 255, 250, 0.25);
  }
  &--change {
    border: solid 1px #b4dffa;
    background-color: rgba(139, 194, 240, 0.25);
  }
}
</style>