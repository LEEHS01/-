<template>
  <!-- 탑 네이게이터 공정 이미지 -->
  <div class="top-navi-main" :style="ImageURL">
    <!-- 착수 -->
    <div class="sector1" @click="$routingByIndex(22)"></div>
    <!-- 전차염 -->
    <div class="sector2" @click="$routingByIndex(24)"></div>
    <!-- 공업약품 -->
    <div class="sector3" @click="$routingByIndex(2)"></div>
    <!-- 공업혼화응집 -->
    <div class="sector4" @click="$routingByIndex(20)"></div>
    <!-- 공업침전 -->
    <div class="sector5" @click="$routingByIndex(21)"></div>
    <!-- 중차염 -->
    <div class="sector6" @click="$routingByIndex(7.2)"></div>
    <!--공업여과 -->
    <div class="sector7" @click="$routingByIndex(23)"></div> 
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
        case 22: //1단계 공업 착수
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_01.png")})`
          }
        case 2: //1단계 공업 약품
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_02.png")})`
          }
        case 20: //1단계 공업 혼화응집
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_03.png")})`
          }
        case 21: //1단계 공업 침전
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_05.png")})`
          }
        case 23: //1단계 공업 여과
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_06.png")})`
          }
        case 7:
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_04.png")})`
          }
        case 7.1:
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_04.png")})`
        }
        case 7.2:
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_07.png")})`
        }
        case 7.3:
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_08.png")})`
        }
        case 1://생활착수
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_01.png")})`
        }
        case 19: //생활약품
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_02.png")})`
          }
        case 3: //생활혼화응집
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_03.png")})`
          }
        case 4: //생활침전
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_05.png")})`
        }
        case 5: //생활여과
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_06.png")})`
        }
        case 24://1차소독
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_04.png")})`
        }
        case 25: // 착수 펌프
          return {
            backgroundImage: `url(${require("@/assets/cj_images/top_navi_01.png")})`
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