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
import { PUT_RECEIVING_CONTROL_OPERATION } from '@/store/modules/receiving'
import { PUT_DISINFECTION_CONTROL_OPERATION_PRE } from '@/store/modules/disinfection'
import { PUT_DISINFECTION_CONTROL_OPERATION_PERI } from '@/store/modules/midDisinfection'
import { PUT_DISINFECTION_CONTROL_OPERATION_POST } from '@/store/modules/postDisinfection'
import { PUT_SEDIMENTATION_CONTROL_OPERATION } from '@/store/modules/sedimentation'
import { PUT_FILTER_CONTROL_OPERATION } from '@/store/modules/filter'
//import { PUT_GAC_CONTROL_OPERATION } from '@/store/modules/gac'
import { PUT_COAGULANTS_CONTROL_OPERATION } from '@/store/modules/coagulants'
//import { PUT_OZONE_CONTROL_OPERATION } from '@/store/modules/ozone'
export default {
  data: () => ({
  }),
  computed: {
    GetTitle() {
      switch(this.$store.state.selectedBuildingIndex) {
        case 1:
          return '착수'
        case 2:
          return '약품'
        case 3:
          return '혼화응집'
        case 4:
          return '침전'
        case 5:
          return '여과'
        case 6:
          return 'GAC여과'
        case 7:
          return '소독 전차염'
        case 8:
          return '소독 중차염'
        case 9:
          return '소독 후차염'
        case 11:
          return '오존'
        default:
          return ''
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
        //case 6:
        //  return PUT_GAC_CONTROL_OPERATION
        case 7:
          return PUT_DISINFECTION_CONTROL_OPERATION_PRE
        case 8:
          return PUT_DISINFECTION_CONTROL_OPERATION_PERI
        case 9:
          return PUT_DISINFECTION_CONTROL_OPERATION_POST
        //case 11:
        //  return PUT_OZONE_CONTROL_OPERATION
        default:
          return ''
      }
    }
  },
  methods: {
    closePopup: function () {
      this.$store.dispatch('dialog/' + CLOSE_ALL_AI_MODE_DIALOG)
    },
    changeAllAIMode: function () {
      this.$store.dispatch('dialog/' + CHANGE_ALL_AI_MODE)
    },
    changeAIMode: function () {
      
      let bIdx = this.$store.state.selectedBuildingIndex
      let pStep = 0
      let disIdx = 0

      switch(bIdx) {
        case 1:
          pStep = this.$store.state.receiving.processStep
          break
        case 2:
          pStep = this.$store.state.coagulants.processStep
          break
        case 3:
          pStep = this.$store.state.mixing.processStep
          break
        case 4:
          pStep = this.$store.state.sedimentation.processStep
          break
        case 5:
          pStep = this.$store.state.filter.processStep
          break
        case 7:
          pStep = this.$store.state.disinfection.processStep
          disIdx = this.$store.state.disinfection.selectedDisinfectionIndex
          break
        case 8:
          pStep = this.$store.state.midDisinfection.processStep
          disIdx = this.$store.state.midDisinfection.selectedDisinfectionIndex
          break
        case 9:
          pStep = this.$store.state.postDisinfection.processStep
          disIdx = this.$store.state.postDisinfection.selectedDisinfectionIndex
          break
      }
      if(disIdx === 0){
        this.$store.dispatch(this.SelectedBuildingURL, { operation: this.$store.state.dialog.aiMode.expectedValue, processStep : pStep })
      }else{
        this.$store.dispatch(this.SelectedBuildingURL, { operation: this.$store.state.dialog.aiMode.expectedValue, processStep : pStep
        ,selectedDisinfectionIndex : disIdx })
      }
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