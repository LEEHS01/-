<template>
  <div v-if="this.$store.state.dialog.aiMode.visible" class="popup">
    <!-- 전체 공정 AI 모드 변경-->
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
    <!-- 일반 공정 모드 변경-->
    <div v-else class="popup__inner">
    <div class="popup__title">
      <div class="popup__icon"></div>
      <span>{{ this.GetTitle + ' ' }}</span>
    </div>
    <div class="popup__body">
      <!-- <span class="popup__body--large">{{ this.IsAIMode ? 'AI분석모드' : 'AI모드'}}</span>로 변경하시겠습니까? -->
      <span v-if="this.$store.state.dialog.aiMode.expectedValue === 0" class="popup__body--large">AI분석모드로 변경하시겠습니까?</span>
      <span v-if="this.$store.state.dialog.aiMode.expectedValue === 1" class="popup__body--large">AI추천모드로 변경하시겠습니까?</span>
      <span v-if="this.$store.state.dialog.aiMode.expectedValue === 2" class="popup__body--large">AI모드로 변경하시겠습니까?</span>
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
import { PUT_MIXING_CONTROL_OPERATION } from '@/store/modules/mixing'
import { PUT_FSTRECEIVING_CONTROL_OPERATION } from '@/store/modules/fstReceiving'
import { PUT_SNDRECEIVING_CONTROL_OPERATION } from '@/store/modules/sndReceiving'
import { PUT_TRDRECEIVING_CONTROL_OPERATION } from '@/store/modules/trdReceiving'
import { PUT_PUMPRECEIVING_CONTROL_OPERATION } from '@/store/modules/pumpReceiving'
import { PUT_FSTDISINFECTION_CONTROL_OPERATION_PRE } from '@/store/modules/fstDisinfection'
import { PUT_SNDDISINFECTION_CONTROL_OPERATION_PRE } from '@/store/modules/sndDisinfection'
import { PUT_SNDDISINFECTION_CONTROL_OPERATION_PERI } from '@/store/modules/sndDisinfection'
import { PUT_SNDDISINFECTION_CONTROL_OPERATION_POST } from '@/store/modules/sndDisinfection'
import { PUT_TRDDISINFECTION_CONTROL_OPERATION_PRE } from '@/store/modules/trdDisinfection'
import { PUT_TRDDISINFECTION_CONTROL_OPERATION_PERI } from '@/store/modules/trdDisinfection'
import { PUT_TRDDISINFECTION_CONTROL_OPERATION_POST } from '@/store/modules/trdDisinfection'
import { PUT_SEDIMENTATION_CONTROL_OPERATION } from '@/store/modules/sedimentation'
import { PUT_FILTER_CONTROL_OPERATION } from '@/store/modules/filter'
import { PUT_COAGULANTS_CONTROL_OPERATION } from '@/store/modules/coagulants'
import { PUT_INDMIXING_CONTROL_OPERATION } from '@/store/modules/indMixing'
import { PUT_TRTINDMIXING_CONTROL_OPERATION } from '@/store/modules/trtIndMixing'
import { PUT_INDCOAGULANTS_CONTROL_OPERATION } from '@/store/modules/indCoagulants'
import { PUT_TRTINDCOAGULANTS_CONTROL_OPERATION } from '@/store/modules/trtIndCoagulants'
import { PUT_INDSEDIMENTATION_CONTROL_OPERATION } from '@/store/modules/indSedimentation'
import { PUT_TRTINDSEDIMENTATION_CONTROL_OPERATION } from '@/store/modules/trtIndSedimentation'
import { PUT_TRDFILTER_CONTROL_OPERATION } from '@/store/modules/trdFilter'

export default {
  data: () => ({
  }),
  computed: {
    GetTitle() {
      switch(this.$store.state.selectedBuildingIndex) {
        case 1.1:
          return '2단계공업 착수'
        case 1.2:
          return '2단계생활 착수'
        case 1.3:
          return '3단계 착수'
        case 1.4:
          return '펌프제어 착수'
        case 2:
          return '2단계생활 약품'
        case 3:
          return '2단계생활 혼화응집'
        case 4:
          return '2단계생활 침전'
        case 5:
          return '2단계생활 여과'
        case 7.1:
          return '2단계공업 (전)소독'
        case 7.2:
          return '2단계생활 (전)소독'
        case 7.3:
          return '3단계 (전)소독'
        case 7.4:
          return '2단계생활 (중)소독'
        case 7.5:
          return '3단계 (중)소독'
        case 7.6:
          return '2단계생활 (후)소독'
        case 7.7:
          return '3단계 (후)소독'
        case 16:
          return '3단계 약품'
        case 17:
          return '3단계 혼화응집'
        case 18:
          return '3단계 침전'
        case 19:
          return '2단계공업 약품'
        case 20:
          return '2단계공업 혼화응집'
        case 21:
          return '2단계공업 침전'
        case 22:
          return '3단계 여과'
        default:
          return ''
      }
    },
    SelectedBuildingURL() {
      console.log(this.$store.state.selectedBuildingIndex)
      switch(this.$store.state.selectedBuildingIndex) {
        case 1.1:
          return PUT_FSTRECEIVING_CONTROL_OPERATION
        case 1.2:
          return PUT_SNDRECEIVING_CONTROL_OPERATION
        case 1.3:
          return PUT_TRDRECEIVING_CONTROL_OPERATION
        case 1.4:
          return PUT_PUMPRECEIVING_CONTROL_OPERATION
        case 2:
          return PUT_COAGULANTS_CONTROL_OPERATION
        case 3:
          return PUT_MIXING_CONTROL_OPERATION
        case 4:
          return PUT_SEDIMENTATION_CONTROL_OPERATION
        case 5:
          return PUT_FILTER_CONTROL_OPERATION
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
        case 7.1: // 2단계공업 전차염
          return PUT_FSTDISINFECTION_CONTROL_OPERATION_PRE
        case 7.2: // 2단계생활 전차염
          return PUT_SNDDISINFECTION_CONTROL_OPERATION_PRE
        case 7.3: // 3단계 전차염
          return PUT_TRDDISINFECTION_CONTROL_OPERATION_PRE
        case 7.4: // 2단계생활 중차염
          return PUT_SNDDISINFECTION_CONTROL_OPERATION_PERI
        case 7.5: // 3단계 중차염
          return PUT_TRDDISINFECTION_CONTROL_OPERATION_PERI
        case 7.6: // 2단계생활 후차염
          return PUT_SNDDISINFECTION_CONTROL_OPERATION_POST
        case 7.7: // 3단계 후차염
          return PUT_TRDDISINFECTION_CONTROL_OPERATION_POST
        case 16: // 공업3차 약품
          return PUT_TRTINDCOAGULANTS_CONTROL_OPERATION
        case 17: // 공업3차 혼화응집
          return PUT_TRTINDMIXING_CONTROL_OPERATION
        case 18: // 공업3차 침전
          return PUT_TRTINDSEDIMENTATION_CONTROL_OPERATION
        case 19: // 공업약품
          return PUT_INDCOAGULANTS_CONTROL_OPERATION
        case 20: // 공업혼화응집
          return PUT_INDMIXING_CONTROL_OPERATION
        case 21: // 공업침전
          return PUT_INDSEDIMENTATION_CONTROL_OPERATION
        case 22: // 3차여과
          return PUT_TRDFILTER_CONTROL_OPERATION
        default:
          return ''
      }
    }
  },
  methods: {
    closePopup: function () {
      this.$store.dispatch('dialog/' + CLOSE_ALL_AI_MODE_DIALOG)
      this.$store.state.dialog.aiMode.changeAllAIMode = false
    },
    changeAIMode: function () {
      this.$store.dispatch(this.SelectedBuildingURL, { operation: this.$store.state.dialog.aiMode.expectedValue })
    },
    changeAllAIMode: function () {
      this.$store.dispatch('dialog/' + CHANGE_ALL_AI_MODE)
    },
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
    height: 213px;
    background-image: url('../../assets/dialog/background.png');
    padding: 25px;
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