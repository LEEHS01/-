<template>
  <div v-if="this.$store.state.dialog.autoModeCrt.visible" class="main">
    <div class="popup-main">
      <div class="popup-contents">
        <div class="top">
          <div class="top__img"></div>
          <div class="top__title">교반강도(G)자동모드 상세</div>
          <div class="top__exit-btn" @click="closePopup()"></div>
        </div>         
        <div class="top-title">보정 계수</div>

        <div class="value-contents">
          <div class="value-contents__wrap">
            <span>· #1</span>
            <div class="value-contents__num">
              <input type="text" :value="this.$store.state.dialog.autoModeCrt.d_g_step1_crt" v-on:input="updateInput($event, 'd_g_step1_crt')" maxlength="4">
            </div>
            <span>배</span>
          </div>
          <div class="value-contents__wrap">
            <span>· #2</span>
            <div class="value-contents__num">
              <input type="text" :value="this.$store.state.dialog.autoModeCrt.d_g_step2_crt" v-on:input="updateInput($event, 'd_g_step2_crt')" maxlength="4">
            </div>
            <span>배</span>
          </div>
          <div class="value-contents__wrap">
            <span>· #3</span>
            <div class="value-contents__num">
              <input type="text" :value="this.$store.state.dialog.autoModeCrt.d_g_step3_crt" v-on:input="updateInput($event, 'd_g_step3_crt')" maxlength="4">
            </div>
            <span>배</span>
          </div>
        </div>
        <div class="btn-wrap">
          <button class="btn-wrap__save" @click="updateControl()">저장</button>
          <button class="btn-wrap__cancel" @click="closePopup()">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script> 
import { CLOSE_MIXING_CRT_POPUP, PUT_MIXING_CONTROL_INIT } from '@/store/modules/dialog'
export default {
  name: 'AutoModeDetailPopup',
  data: () => ({
    timer: null, // API 요청 타이머
  }),
  computed: {
  },
  methods: {
    /**
     * 사용자 설정 input 값이 변경 되는 경우
     * 
     * @param event change 이벤트
     * @param key 변경되는 값
     */
     updateInput: function (event, key) {
      this.$store.state.dialog.autoModeCrt[key] = event.target.value
    },
    updateControl: function() {
      let min = 0
      let max = 10
      if (this.$store.state.dialog.autoModeCrt.visible) {
        if (this.$store.state.dialog.autoModeCrt.d_g_step1_crt === ''
          || this.$store.state.dialog.autoModeCrt.d_g_step2_crt === ''
          || this.$store.state.dialog.autoModeCrt.d_g_step3_crt === '') {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else if (parseInt(this.$store.state.dialog.autoModeCrt.d_g_step1_crt) <= min 
                  || parseInt(this.$store.state.dialog.autoModeCrt.d_g_step1_crt) >= max
                  || parseInt(this.$store.state.dialog.autoModeCrt.d_g_step2_crt) <= min
                  || parseInt(this.$store.state.dialog.autoModeCrt.d_g_step2_crt) >= max
                  || parseInt(this.$store.state.dialog.autoModeCrt.d_g_step3_crt) <= min
                  || parseInt(this.$store.state.dialog.autoModeCrt.d_g_step3_crt) >= max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '설정 범위', text2: min + ' ~ ' + max })
        } else {
          let obj = {}
          obj.autoModeCrt = this.$store.state.dialog.autoModeCrt.visible
          obj.d_g_step1_crt = parseFloat(this.$store.state.dialog.autoModeCrt.d_g_step1_crt)
          obj.d_g_step2_crt = parseFloat(this.$store.state.dialog.autoModeCrt.d_g_step2_crt)
          obj.d_g_step3_crt = parseFloat(this.$store.state.dialog.autoModeCrt.d_g_step3_crt)
          this.$store.dispatch('dialog/' + PUT_MIXING_CONTROL_INIT, obj)
          this.$store.state.dialog.autoModeCrt.visible = !this.$store.state.dialog.autoModeCrt.visible
        }
      } else {
        this.$store.state.dialog.autoModeCrt.visible = !this.$store.state.dialog.autoModeCrt.visible
      }
    },
    /**
     * 팝업이 닫힘 버튼 선택시 
     * 타이머 종료
     */
    closePopup: function () {
      this.$store.commit('dialog/' + CLOSE_MIXING_CRT_POPUP)
    },
  },
  created: function () {
    // console.log(this.$options.name + ' created')
  },
  /**
   * 마운트시 
   * fullscreenchange 이벤트 등록
   */
  // mounted: function () {
  //   console.log(this.$options.name + ' mounted')
  //   window.addEventListener('fullscreenchange', this.fullscreenchanged)
  // },
  /**
   * 마운트 해제시 
   * fullscreenchange 이벤트 해제
   */
  // beforeDestroy () { window.removeEventListener('fullscreenchange', this.fullscreenchanged) },
  destroyed: function () {
    console.log(this.$options.name + ' destoryed')
  },
  updated: function () {
    console.log(this.$options.name + ' updated')
  },
  watch: {
    // 팝업 열림/닫힘 값 변화 감지
    '$store.state.dialog.autoModeCrt.visible': function (newVal) {
      if (newVal) {
        this.timer = setInterval( () => {
           Promise.all([
            // this.$store.dispatch(GET_SEDIMENTATION_LOCATION_BY_JI, { numJi: this.$store.state.sedimentation.popup.numJi })
          ])
        }, 1000 * 60)
      }
    }
  }
} 
</script>
<style lang="scss" scoped>
.main{
  position: absolute;
  top: -85px;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 1190px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30,37,61,0.8);
  .popup-main{
    display: flex;
    width: 450px;
    height: 410px;
    justify-content: center;
    align-items: center;
    // background-image: url('../../assets/sedimentation/popup_main.png');
    .popup-contents{
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url('../../assets/as_images/pump-bg.png');
      background-size: 100% 100%;
      padding: 30px 25px;
      .top-title{
        height: 53px;
        margin-top: 25px;
        background-image: url('../../assets/sedimentation/bottom_title_img.png');
        text-shadow: 0 0 9px #5cafff;
        font-size: 18px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        background-position: 50%;
        &__num {
          font-family: "LAB디지털" !important;
          font-size: 32px;
          color: #b4dffb;
          margin-left: 20px;
          vertical-align: middle;
        }
      }
      .value-contents {
        width: 250px;
        margin: 30px auto;
        &__wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          > span {
            color: #fff;
          }
        }
        &__num {
          display: flex;
          align-items: center;
          justify-content: center;
          border: solid 1px rgba(157, 191, 255, 0.3);
          width: 85px;
          margin: 0 20px;
          text-align: center;
          > span {
            color: #fff;
          }
          > input {
            width: 80px;
            // height: 30px;
            color: #c3eaff;
            text-align: center;
            }
          }
      }
      .btn-wrap {
        display: flex;
        justify-content: center;
        > button {
          width: 85px;
          height: 38px;
          margin: 0 3px;
        }
        &__save {
          background-color: #457fbc;
          color: #fff;
        }
        &__cancel {
          border: 1px solid #457fbc;
          color: #b4dffb;
        }
      }
      .top{
        display: flex;
        width: 100%;
        height: 30px;
        &__img{
          width: 19px;
          height: 30px;
          background-image: url('../../assets/sedimentation/top_title_img.png');
        }
        &__title{
          margin-left: 10px;
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: left;
          color: #b4dffb;
        }
        &__exit-btn{
          margin-left: auto;
          width: 24px;
          height: 30px;
          background-image: url('../../assets/sedimentation/exit_btn.png');
          background-position-y: center;
          cursor: pointer;
          z-index: 9;
        }
      }  
    }
  }
}
</style>