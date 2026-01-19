<template>
  <div class="popup-info">
    <div class="popup-top-edge"></div>
    <div class="popup-bottom-edge"></div>
    <div class="popup-contents">
      <div class="popup-contents__img"></div>
      <div class="popup-text">
        <div class="popup-text__title">2단계생활 소독 전차염</div>
        <div class="popup-text__underbar"></div>
        <div class="popup-data">
          <div class="popup-data__text">· 기온</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.g_tei | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;">°C</span>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 수온</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.b_te | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;">°C</span>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 정수 탁도</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.h_tb | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;">NTU</span>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 정수 pH</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.h_ph | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;"></span>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 원수 유입 유량</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.b_in_fr | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;">m<sup>3</sup>/h</span>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 혼화지 잔류 염소</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.g_d_residual_cl | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;">ppm</span>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 침전지 잔류 염소</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.g_e_residual_cl | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;">ppm</span>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 중차염 주입률</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.g_peri_chol_rate | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;">ppm</span>
        </div>
        <div class="popup-data">
          <div class="popup-data__text">· 현재 주입률</div>
          <div class="popup-data__value">{{ this.$store.state.sndDisinfection.latest.g_pre_chol_rate | numFormat('0.00') }}</div>
          <span style="width: 36px; font-size: 12px;">ppm</span>
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
  left: 30px;
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
      background-image: url('../../../assets/dashboard_img/popup/icon8.png');
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
        justify-content: space-between;
        width: 267px;
        margin: 2px 0;
        font-size: 16px;
        &__value{
          width: 65px;
         text-align: right;
        }
        &__text{
          width: 140px;
        }
      }
    }
  }
}
@keyframes move-up-building {
  0% {
    transform: translateY(480px)
  }
  100% {
    transform: translateY(0px)
  }
}
</style>