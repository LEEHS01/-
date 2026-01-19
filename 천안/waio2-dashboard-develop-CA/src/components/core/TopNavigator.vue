<template>
  <!-- 탑 네이게이터 공정 이미지 -->
  <div class="top-navi-main" :style="ImageURL">
    <!-- 착수 -->
    <div class="sector1" @click="$routingByIndex(1.1)"></div>
    <!-- 전차염 -->
    <div class="sector2" @click="$routingByIndex(7.1)"></div>
    <!-- 약품 -->
    <div class="sector3" @click="$routingByIndex(19)"></div>
    <!-- 혼화응집 -->
    <div class="sector4" @click="$routingByIndex(20)"></div>
    <!-- 침전 -->
    <div class="sector5" @click="$routingByIndex(21)"></div>
    <!-- 중차염 -->
    <div class="sector6" @click="$routingByIndex(7.4)"></div>
    <!-- 생활여과 -->
    <div class="sector7" @click="$routingByIndex(5)"></div> 
    <!-- 후차염 -->
    <div class="sector9" @click="$routingByIndex(7.6)"></div>
  </div>
</template>
<script>
export default {
  data: () => ({
  }),
  computed: {
    // 선택된 공정에 따라 활성화된 이미지 반환
    ImageURL() {
      switch(this.$store.state.selectedBuildingIndex) {
       // 착수
        case 1.1:
        case 1.2:
        case 1.3:
        case 1.4:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_01.png")})`
          }
        // 약품
        case 2:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_02.png")})`
          }
        //혼화응집
        case 3:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_03.png")})`
          }
         //침전 
        case 4:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_05.png")})`
          }
        // 여과
        case 5:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_06.png")})`
          }
        //전차염 
        case 7.1:
        case 7.2:
        case 7.3:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_04.png")})`
          }
         //중차염   
        case 7.4:
        case 7.5:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_07.png")})`
          }
        // 후차염
        case 7.6:
        case 7.7:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_08.png")})`
          }
        //3단계 
        case 16:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_02.png")})`
          }
        case 17:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_03.png")})`
          }
        case 18:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_05.png")})`
          }
        //2단계 
        case 19:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_02.png")})`
          }
        case 20:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_03.png")})`
          }
        case 21:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_05.png")})`
          }
        case 22:
          return {
            backgroundImage: `url(${require("@/assets/ca_images/top_navi_06.png")})`
          }
        default:
          return "../../assets/as_images/top_navi_01.png"
      }
    }
  }
}
</script>
<style lang="scss">
.top-navi-main{
    display: flex;
    width: 1178px;
    height: 118px;
    > div {
      cursor: pointer;
    }
  }
  // 착수
  .sector1{
  position: relative;
  width: 55px;
  height: 64px;
  top: 11px;
  left: 2px;
}
// 전차염
.sector2{
  position: relative;
  width: 44px;
  height: 55px;
  top: 11px;
  left: 100px;
}
// 약품
.sector3{
  position: relative;
  width: 56px;
  height: 69px;
  top: 17px;
  left: 195px;
}
// 혼화응집
.sector4{
  position: relative;
  width: 53px;
  height: 64px;
  top: 16px;
  left: 288px;
}
// 침전
.sector5{
  position: relative;
  width: 107px;
  height: 63px;
  top: 18px;
  left: 383px;
}
// 중차염
.sector6{
  position: relative;
  width: 44px;
  height: 55px;
  top: 11px;
  left: 475px;
}
// 여과
.sector7{
  position: relative;
  width: 106px;
  height: 65px;
  top: 17px;
  left: 569px;
}
// 후차염
.sector9{
  position: relative;
  width: 44px;
  height: 55px;
  top: 11px;
  left: 661px;
}
// .sector16{
//   position: relative;
//   width: 51px;
//   height: 62px;
//   top: 15px;
//   left: 503px;
// }
// .sector17{
//   position: relative;
//   width: 56px;
//   height: 64px;
//   top: 15px;
//   left: 545px;
// }
// .sector18{
//   position: relative;
//   width: 96px;
//   height: 64px;
//   top: 15px;
//   left: 580px;
// }
// .sector19{
//   position: relative;
//   width: 51px;
//   height: 62px;
//   top: 15px;
//   left: -60px;
// }
// .sector20{
//   position: relative;
//   width: 56px;
//   height: 64px;
//   top: 15px;
//   left: -41px;
// }
// .sector21{
//   position: relative;
//   width: 96px;
//   height: 64px;
//   top: 15px;
//   left: -7px;
// }
</style>