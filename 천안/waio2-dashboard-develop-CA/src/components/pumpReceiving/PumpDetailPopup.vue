<template>
  <div v-if="this.$store.state.pumpReceiving.popup.visible" class="main">
    <div class="popup-main">
      <div class="popup-contents">
        <div class="top">
          <div class="top__img"></div>
          <div class="top__title">AI 펌프 총 가동 대수 예측 상세</div>
          <div class="top__exit-btn" @click="closePopup()"></div>
        </div>         
        <div class="top-title">총 가동 대수 예측
          <span class="top-title__num">{{ this.$store.state.pumpReceiving.latest.ai_b_pump_cnt | numFormat('0') }}</span>
        </div>
        <div class="contents-img">
          <div class="pump-info">
            <div class="pump-info__on">ON</div>
            <div class="pump-info__off">OFF</div>
          </div>
          <div class="pump-contents">
            <div class="title-line horizontal"></div>
            <ul class="pump-contents__title">전동가압장 <p>1단계</p>
              <li v-for="(item, index) in $store.state.pumpReceiving.latest.ai_b_pump_cb_h1" :key="index" class="pump-contents__text" :class="[item === 0 ? 'off' : 'on']">
              {{ index.substring(1,2) }}
              </li>
            </ul>
            <div class="title-line vertical-one"></div>
            <ul class="pump-contents__title">전동가압장 <p>2단계</p>
              <li v-for="(item, index) in $store.state.pumpReceiving.latest.ai_b_pump_cb_h2" :key="index" class="pump-contents__text" :class="[item === 0 ? 'off' : 'on']">
                {{ index.substring(1,2) }}
              </li>
            </ul>
            <div class="title-line vertical-two"></div>
            <ul class="pump-contents__title">전동가압장 <p>3단계</p>
              <li v-for="(item, index) in $store.state.pumpReceiving.latest.ai_b_pump_cb_h3" :key="index" class="pump-contents__text" :class="[item === 0 ? 'off' : 'on']">
                {{ index.substring(1,2) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script> 
import { CLOSE_POPUP } from '@/store/modules/pumpReceiving'
export default {
  name: 'PumpDetailPopup',
  data: () => ({
    timer: null, // API 요청 타이머
  }),
  computed: {
  },
  methods: {
    /**
     * 팝업이 닫힘 버튼 선택시 
     * 타이머 종료
     */
    closePopup: function () {
      clearInterval(this.timer)
      this.$store.commit('pumpReceiving/' + CLOSE_POPUP)
    },
  },
  created: function () {
    console.log(this.$options.name + ' created')
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
    '$store.state.pumpReceiving.popup.visible': function (newVal) {
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
    width: 697px;
    height: 953px;
    justify-content: center;
    align-items: center;
    // background-image: url('../../assets/sedimentation/popup_main.png');
    .popup-contents{
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url('../../assets/ca_images/pump-bg.png');
      padding: 40px 25px;
      .top-title{
        width: 230px;
        height: 53px;
        margin-top: 25px;
        padding-left: 30px;
        background-image: url('../../assets/sedimentation/bottom_title_img.png');
        text-shadow: 0 0 9px #5cafff;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        color: #fff;
        &__num {
          font-family: "LAB디지털" !important;
          font-size: 32px;
          color: #b4dffb;
          margin-left: 20px;
          vertical-align: middle;
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
      .contents-img{
        width: 100%;
        height: 142px;
        background-image: url('../../assets/ca_images/pump.png');
        background-position-x: center;
        background-position-y: 10px;
        // margin-top: 50px;
      }
      .pump-info {
        display: flex;
        justify-content: flex-end;
        margin-right: 37px;
        &__on, &__off {
          margin-right: 10px;
        }
        &__on::before {
          content: '';
          // display: block;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          background: radial-gradient( #123169,#cb4455 );
          margin-right: 5px;
        }
        &__off::before {
          content: '';
          // display: block;
          border-radius: 50%;
          width: 15px;
          height: 15px;
          background: radial-gradient( #123169,#1fa8b2 );
          margin-right: 5px;
        }
      }
      .pump-info > div {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 14px;
      }
      .pump-contents {
        width: 592px;
        margin: 170px auto 0;
        display: flex;
        justify-content: space-evenly;
        position: relative;
        &__title {
          position: relative;
          color: #fff;
          text-shadow: 0 0 9px #5cafff;
          display: flex;
          flex-direction: column;
          padding: 0;
        }
        &__title p {
          text-align: center;
          font-size: 18px;
          margin-bottom: 20px;
        }
        &__text {
          list-style: none;
          width: 70px;
          height: 31px;
          line-height: 31px;
          text-align: center;
          margin: 18px 0;
        }
        .off {
          color: #43d3e3;
          background-image: url(../../assets/ca_images/pump_off.png);
          }
        .on {
          color: #f898aa;
          background-image: url(../../assets/ca_images/pump_on.png);
          }
      }
      .pump-contents .title-line {
        position: absolute;
        display: inline-block;
        background: linear-gradient(#25366b 0%, #66a6ff 50%, #25366b 100%);
        // rotate: 90deg;
      }
      .pump-contents .vertical-one {
        // transform: rotate(90deg);
        width: 1px;
        height: 560px;
        top: -10px;
        left: 209px;
      }
      .pump-contents .vertical-two {
        // transform: rotate(90deg);
        width: 1px;
        height: 560px;
        top: -10px;
        left: 376px;
      }
      .pump-contents .horizontal {
        transform: rotate(90deg);
        width: 1px;
        height: 570px;
        top: -219px;
        left: 308px;
      }      
    }
  }
}
</style>