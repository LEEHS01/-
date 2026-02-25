<template>
  <div v-if="this.$store.state.dialog.aiModeOfFilterJi.visible" class="popup">
    <div class="popup__inner" v-if="this.$store.state.dialog.aiModeOfFilterJi.filterIndex == 1">
      <div class="popup__title">
        <div class="popup__icon"></div>
        <span>여과 {{ this.$store.state.dialog.aiModeOfFilterJi.number }}지</span>
      </div>
      <div class="popup__body">
        <span v-if="this.$store.state.indFilter.latest.f_loc_operation_mode['location' + this.$store.state.dialog.aiModeOfFilterJi.number] === 0" class="popup__body--large">운영모드를 ON 하시겠습니까?</span>
        <span v-if="this.$store.state.indFilter.latest.f_loc_operation_mode['location' + this.$store.state.dialog.aiModeOfFilterJi.number] === 1" class="popup__body--large">운영모드를 OFF 하시겠습니까?</span>
      </div>
      <div class="popup__bottom">
        <div class="btn btn--cancel" @click="closePopup()">취소</div>
        <div class="btn btn--change" @click="changeAIMode()">변경</div>
      </div>
    </div>
    <div class="popup__inner" v-else>
      <div class="popup__title">
        <div class="popup__icon"></div>
        <span>여과 {{ this.$store.state.dialog.aiModeOfFilterJi.number }}지</span>
      </div>
      <div class="popup__body">
        <span v-if="this.$store.state.filter.latest.f_loc_operation_mode['location' + this.$store.state.dialog.aiModeOfFilterJi.number] === 0" class="popup__body--large">운영모드를 ON 하시겠습니까?</span>
        <span v-if="this.$store.state.filter.latest.f_loc_operation_mode['location' + this.$store.state.dialog.aiModeOfFilterJi.number] === 1" class="popup__body--large">운영모드를 OFF 하시겠습니까?</span>
      </div>
      <div class="popup__bottom">
        <div class="btn btn--cancel" @click="closePopup()">취소</div>
        <div class="btn btn--change" @click="changeAIMode()">변경</div>
      </div>
    </div>
  </div>
</template>
<script>
import { CLOSE_AI_MODE_OF_FILTER_JI_DIALOG } from '@/store/modules/dialog'
import { PUT_FILTER_CONTROL_LOCATION } from '../../store/modules/filter'
import { PUT_INDFILTER_CONTROL_LOCATION } from '../../store/modules/indFilter'
export default {
  data: () => ({
  }),
  methods: {
    closePopup: function () {
      this.$store.dispatch('dialog/' + CLOSE_AI_MODE_OF_FILTER_JI_DIALOG)
    },
    changeAIMode: function () {
      let _data = {}
      _data.numJi = this.$store.state.dialog.aiModeOfFilterJi.number
      if(this.$store.state.dialog.aiModeOfFilterJi.filterIndex == 1){
        _data.ai = this.$store.state.indFilter.latest.f_loc_operation_mode['location' + this.$store.state.dialog.aiModeOfFilterJi.number] === 0 ? 1 : 0
        this.$store.dispatch(PUT_INDFILTER_CONTROL_LOCATION, _data)
      }else{
        _data.ai = this.$store.state.filter.latest.f_loc_operation_mode['location' + this.$store.state.dialog.aiModeOfFilterJi.number] === 0 ? 1 : 0
        this.$store.dispatch(PUT_FILTER_CONTROL_LOCATION, _data)
      }
    }
  },
  mounted: function() {
  },
  destroyed: function() {
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