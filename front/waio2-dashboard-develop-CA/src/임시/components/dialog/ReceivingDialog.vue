<template>
  <div v-if="this.$store.state.dialog.receivingFlag.visible" class="popup">
    <div class="popup__inner">
      <div class="popup__title">
        <div class="popup__icon"></div>
        <span>착수 2단계공업</span>
      </div>
      <div class="popup__body">
        <span v-if="this.$store.state.fstReceiving.latest.b_back_in_fr_flag === 0" class="popup__body--large">회수 유량을 사용하시겠습니까?</span>
        <span v-if="this.$store.state.fstReceiving.latest.b_back_in_fr_flag === 1" class="popup__body--large">회수 유량을 미사용하시겠습니까?</span>
      </div>
      <div class="popup__bottom">
        <div class="btn btn--cancel" @click="closePopup()">취소</div>
        <div class="btn btn--change" @click="changeAIMode()">변경</div>
      </div>
    </div>
  </div>
</template>
<script>
import { CLOSE_RECEIVING_DIALOG } from '@/store/modules/dialog'
import { PUT_FSTRECEIVING_CONTROL_FLAG } from '../../store/modules/fstReceiving'
export default {
  data: () => ({
  }),
  methods: {
    closePopup: function () {
      this.$store.dispatch('dialog/' + CLOSE_RECEIVING_DIALOG)
    },
    changeAIMode: function () {
      let _flag = this.$store.state.fstReceiving.latest.b_back_in_fr_flag === 0 ? 1 : 0
      this.$store.dispatch(PUT_FSTRECEIVING_CONTROL_FLAG, { b_back_in_fr_flag : _flag })
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