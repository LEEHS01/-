<template>
  <div class="popup-info">
    <div class="popup-top-edge"></div>
    <div class="popup-bottom-edge"></div>
    <div class="popup-contents">
      <div class="popup-contents__img"></div>
      <div class="popup-text">
        <div class="popup-text__title">혼화응집</div>
        <div class="popup-text__underbar"></div>
        <div class="popup-data">
          <div class="popup-data__text">· 교반강도(G) 1지 #1</div>
          <div class="popup-data__value">{{ this.$store.state.dashboard[this.$store.state.dashboard.processStep].mixingLatest.d_g_value1_1 | numFormat('0.00') }}<span>sec<sup>-1</sup></span></div>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 교반강도(G) 1지 #2</div>
          <div class="popup-data__value">{{ this.$store.state.dashboard[this.$store.state.dashboard.processStep].mixingLatest.d_g_value1_2 | numFormat('0.00') }}<span>sec<sup>-1</sup></span></div>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 교반강도(G) 1지 #3</div>
          <div class="popup-data__value">{{ this.$store.state.dashboard[this.$store.state.dashboard.processStep].mixingLatest.d_g_value1_3 | numFormat('0.00') }}<span>sec<sup>-1</sup></span></div>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 원수 수온</div>
          <div class="popup-data__value">{{ this.$store.state.dashboard[this.$store.state.dashboard.processStep].mixingLatest.b_te | numFormat('0.00') }}<span>℃</span></div>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 동점성 계수</div>
          <div class="popup-data__value">{{ this.$store.state.dashboard[this.$store.state.dashboard.processStep].mixingLatest.d_ki_dv }}<span>m2/sec</span></div>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 패들면적</div>
          <div class="popup-data__value">{{ this.$store.state.dashboard[this.$store.state.dashboard.processStep].mixingLatest.d_anr | numFormat('0.00') }}<span>m<sup>2</sup></span></div>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 조 체적</div>
          <div class="popup-data__value">{{ this.$store.state.dashboard[this.$store.state.dashboard.processStep].mixingLatest.d_v | numFormat('0.00') }}<span>m<sup>3</sup></span></div>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 침전지 탁도</div>
          <div class="popup-data__value">{{ this.$store.state.dashboard[this.$store.state.dashboard.processStep].mixingLatest.d_tb_e | numFormat('0.00') }}<span>NTU</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-info {
  z-index: 100;
  position: fixed;
  bottom: 11px;
  right: 432px;
  width: 511px;
  box-shadow: 0 0 10px 0 #accfff;
  background-color: rgb(19, 47, 78);
  animation: move-up-building 1s ease-in-out 0s normal backwards;
  .popup-top-edge{
    position: absolute;
    top:1px;
    margin: 4px;
    width: 98%;
    height: 11px;
    background-image: url('../../../assets/dashboard_img/dashboard_popup_topbar.png');
    background-size: 100%;
    background-position: center;
  }
  .popup-bottom-edge{
    position: absolute;
    bottom:1px;
    margin: 4px;
    width: 98%;
    height: 11px;
    background-image: url('../../../assets/dashboard_img/dashboard_popup_underbar.png');
    background-size: 100%;
    background-position: center;
  }
  .popup-contents{
    display: flex;
    width: 100%;
    height: 100%;
    &__img{
      width: 230px;
      background-image: url('../../../assets/dashboard_img/popup/icon3.png');
      background-position: center;
      background-repeat: no-repeat;
    }
    .popup-text{
      padding: 45px 0;
      width: 320px;
      height: 100%;
      text-shadow: 0 0 9px #5cafff;
      font-family: KHNPHUotfR;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      color: #fff;
      &__title{
        width: 100%;
        font-size: 20px;
        line-height: 1.1;
      }
      &__underbar{
        margin: 6px 0;
        width: 232px;
        height: 10px;
        background-image: url('../../../assets/dashboard_img/popup_underbar.png');
      }
      .popup-data{
        display: flex;
        width: 320px;
        margin: 2px 0;
        font-size: 16px;
        &__text{
          width: 50%;
        }
        &__value > span {
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
@keyframes move-up-building {
  0% {
    transform: translateY(270px)
  }
  100% {
    transform: translateY(0px)
  }
}
</style>