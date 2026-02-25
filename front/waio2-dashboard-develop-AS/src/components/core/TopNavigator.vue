<template>
  <!-- 탑 네이게이터 공정 이미지 -->
  <div class="top-navi-main" :style="ImageURL">
    <!-- 1단계착수 -->
    <div class="sector1" @click="$routingByIndex(22)"></div>
    <!-- 전차염 -->
    <div class="sector2" @click="$routingByIndex(7.1)"></div>
    <!-- 1단계약품 -->
    <div class="sector3" @click="$routingByIndex(19)"></div>
    <!-- 1단계혼화응집 -->
    <div class="sector4" @click="$routingByIndex(20)"></div>
    <!-- 1단계침전 -->
    <div class="sector5" @click="$routingByIndex(21)"></div>
    <!-- 중차염 -->
    <!-- <div class="sector6" @click="$routingByIndex(7.2)"></div> -->
    <!-- 여과 -->
    <div class="sector7" @click="$routingByIndex(5)"></div> 
    <!-- 후차염 -->
    <div class="sector9" @click="$routingByIndex(7.3)"></div> 
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
        case 1: // 착수
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_01.png")})`
          }
        case 2: //생활약품
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_02.png")})`
          }
        case 19: //공업약품
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_02.png")})`
          }
        case 16: //공업3차약품
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_02.png")})`
          }
        case 3: //생활혼화응집
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_03.png")})`
          }
        case 4: // 생활침전
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_05.png")})`
          }  
        case 17: //공업3차혼화응집
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_03.png")})`
          }
        case 18: // 공업3차침전
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_05.png")})`
          }  
        case 20: //공업혼화응집
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_03.png")})`
          }
        case 21: // 공업침전
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_05.png")})`
          }  
        case 5: // 여과
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_06.png")})`
          }
        case 7.1: //전차염
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_04.png")})`
          }
        case 7.4: //전차염
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_04.png")})`
          }
        case 7.5: //전차염
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_04.png")})`
          }
        // case 7.2: //중차염
        //   return {
        //     backgroundImage: `url(${require("@/assets/as_images/top_navi_07.png")})`
        //   }
        case 7.3: //후차염
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_08.png")})`
          }
        case 7.6: //후차염
          return {
            backgroundImage: `url(${require("@/assets/as_images/top_navi_08.png")})`
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
      // border: 1px solid #fff;
    }
  }
// 착수
.sector1{
  position: relative;
  width: 61px;
  height: 64px;
  top: 15px;
  left: 0px;
}
// 전차염
.sector2{
  position: relative;
  width: 44px;
  height: 55px;
  top: 11px;
  left: 117px;
}
// 약품
.sector3{
  position: relative;
  width: 56px;
  height: 69px;
  top: 17px;
  left: 236px;
}
// 혼화응집
.sector4{
  position: relative;
  width: 57px;
  height: 64px;
  top: 16px;
  left: 351px;
}
// 침전
.sector5{
  position: relative;
  width: 107px;
  height: 63px;
  top: 18px;
  left: 466px;
}
// 중차염
// .sector6{
//   position: relative;
//   width: 44px;
//   height: 55px;
//   top: 11px;
//   left: 475px;
// }
// 여과
.sector7{
  position: relative;
  width: 106px;
  height: 65px;
  top: 17px;
  left: 581px;
}
// 후차염
.sector9{
  position: relative;
  width: 44px;
  height: 55px;
  top: 11px;
  left: 696px;
}
</style>