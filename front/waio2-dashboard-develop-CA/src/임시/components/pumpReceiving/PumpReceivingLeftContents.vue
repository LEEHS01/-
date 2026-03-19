<template>
  <div class="main">
    <div class="btn-tab">
        <div class="btn-tab__box-disabled" @click="$routingByIndex(1.1)">2단계공업</div>
        <div class="btn-tab__box-disabled" @click="$routingByIndex(1.2)">2단계생활</div>
        <div class="btn-tab__box-disabled" @click="$routingByIndex(1.3)">3단계</div>
        <div class="btn-tab__box-abled">펌프제어</div>
      </div>
    <div class="contents-img">
      <div class="pump-info">
        <div class="pump-info__on">ON</div>
        <div class="pump-info__off">OFF</div>
      </div>
      <div class="pump-contents">
        <div class="title-line horizontal"></div>
        <ul class="pump-contents__title">전동가압장 <p>1단계</p>
          <li v-for="(item, index) in $store.state.pumpReceiving.latest.b_pump_on_h1" :key="index" class="pump-contents__text" :class="[item === 0 ? 'off' : 'on']">
            {{ index.substring(1,2) }}
          </li>
        </ul>
        <div class="title-line vertical-one"></div>
        <ul class="pump-contents__title">전동가압장 <p>2단계</p>
          <li v-for="(item, index) in $store.state.pumpReceiving.latest.b_pump_on_h2" :key="index" class="pump-contents__text" :class="[item === 0 ? 'off' : 'on']">
            {{ index.substring(1,2) }}
          </li>
        </ul>
        <div class="title-line vertical-two"></div>
        <ul class="pump-contents__title">전동가압장 <p>3단계</p>
          <li v-for="(item, index) in $store.state.pumpReceiving.latest.b_pump_on_h3" :key="index" class="pump-contents__text" :class="[item === 0 ? 'off' : 'on']">
            {{ index.substring(1,2) }}
          </li>
        </ul>
      </div>
    </div>
  </div>  
</template>
<script>
export default {
  computed: {
    // 현재 주입되는 약품에 따라 1호기 애니메이션 여부
    getDisplayStyleFirst() {
      if (this.$store.state.indCoagulants.latest.c1_mm_fr) {
        if (this.$store.state.indCoagulants.latest.c1_mm_fr > 0) {
          return 'block'
        } else {
          return 'none'
        }
      }
      return 'none'
    },
    // 현재 주입되는 약품에 따라 2호기 애니메이션 여부
    getDisplayStyleSecond() {
      if (this.$store.state.indCoagulants.latest.c2_mm_fr) {
        if (this.$store.state.indCoagulants.latest.c2_mm_fr > 0) {
          return 'block'
        } else {
          return 'none'
        }
      }
      return 'none'
    }
  }
}
</script>
<style lang="scss" scoped>
.main{
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 592px;
  height: 100%;
  .btn-tab{
    display: flex;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.3;
    letter-spacing: normal;
    text-align: center;
    color: #061732;
    width: 520px;
    height: 45px;
    justify-content: space-evenly;
    align-items: center;
    .box-center-margin{
      // margin: 0 16px;
    }
    &__box-abled{
      width: 120px;
      height: 35px;
      box-shadow: 0 0 10px 0 rgba(172, 207, 255, 0.7);
      border: solid 1px #72a3d6;
      background-color: #447fbc;
      color: #fff;
      line-height: 35px;
      cursor: pointer;
    }
    &__box-disabled{
      width: 120px;
      height: 35px;
      border: solid 1px #457fbc;
      background-color: #1a3462;
      color: #a7c2e7;
      line-height: 35px;
      cursor: pointer;
    }
  }
  .contents-img{
    width: 100%;
    height: 142px;
    background-image: url('../../assets/ca_images/pump.png');
    background-position-x: center;
    background-position-y: 10px;
    margin-top: 50px;
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
      background: radial-gradient( #061732,#cb4455 );
      margin-right: 5px;
    }
    &__off::before {
      content: '';
      // display: block;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      background: radial-gradient( #061732,#1fa8b2 );
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
    margin-top: 170px;
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
</style>