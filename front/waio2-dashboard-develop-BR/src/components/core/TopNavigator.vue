<template>
  <!-- 탑 네이게이터 공정 이미지 -->
  <div class="top-navi-main" :style="ImageURL">
    <!-- 착수 -->
    <div class="sector1" @click="$routingByIndex(1)"></div>
    <!-- 전차염 -->
    <div class="sector2" @click="$routingByIndex(7)"></div>
    <!-- 생활약품 -->
    <div class="sector3" @click="$routingByIndex(2)"></div>
    <!-- 생활혼화응집 -->
    <div class="sector4" @click="$routingByIndex(3)"></div>
    <!-- 생활침전 -->
    <div class="sector5" @click="$routingByIndex(4)"></div>
    <!-- 중차염 -->
    <div class="sector6" @click="$routingByIndex(8)"></div>
    <!-- 생활여과 -->
    <div class="sector7" @click="$routingByIndex(5)"></div> 
    <!-- 후차염 -->
    <div class="sector9" @click="$routingByIndex(9)"></div>
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
        case 1:
          return {
            backgroundImage: `url(${require("@/assets/br_images/top_navi_01.png")})`
          }
        // 약품
        case 2:
          return {
            backgroundImage: `url(${require("@/assets/br_images/top_navi_02.png")})`
          }
        //혼화응집
        case 3:
          return {
            backgroundImage: `url(${require("@/assets/br_images/top_navi_03.png")})`
          }
         //침전 
        case 4:
          return {
            backgroundImage: `url(${require("@/assets/br_images/top_navi_05.png")})`
          }
        // 여과
        case 5:
          return {
            backgroundImage: `url(${require("@/assets/br_images/top_navi_06.png")})`
          }
        //전차염 
        case 7:
          return{
            backgroundImage: `url(${require("@/assets/br_images/top_navi_04.png")})`
          }
        //중차염
        case 8:
          return {
            backgroundImage: `url(${require("@/assets/br_images/top_navi_07.png")})`
          }
        //후차염
        case 9:
          return {
            backgroundImage: `url(${require("@/assets/br_images/top_navi_08.png")})`
          }
        default:
          return "../../assets/br_images/top_navi_01.png"
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
</style>