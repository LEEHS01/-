<!-- eslint-disable vue/multi-word-component-names -->
<template>
<div class="dashboard-container">
  <WaterFlow/>
  <div class="dash-left">
    <div class="left-contents">
      <PowerConsumption />
      <EnergySave />

      <!-- 공정별 건물 배치 -->
      <div class="map-contents">
        <!-- 착수 건물 -->
        <div
          class="map-contents__splashdown"
          :class="[store.state.dashboard.selectedBdIdx === 1 ? 'zIndex10': '',
            store.state.dashboard.selectedBdIdx > 0 && store.state.dashboard.selectedBdIdx !== 1 ? 'opacity50' : '']"
        >
          <div
            class="splashdown-text"
            @mouseover="onBuildingMouseover('3단계착수정동', 1)"
            @mouseout="onBuildingMouseout"
            @click="onBuildingMouseClick('3단계착수정동', 1)"
          >
            착수
          </div>
          <img
            class="down"
            :class="[store.state.dashboard.selectedBdIdx === 1 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/ca_images/ca_box_01.png"
          />
          <img
            class="up"
            :class="[store.state.dashboard.selectedBdIdx === 1 ? 'building-visible': 'building-unvisible']"
            src="@/assets/img/ca_images/ca_box_01_up.png"
          />
          <img
            class="aurora_splashdown"
            :class="[store.state.dashboard.selectedBdIdx === 1 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/dashboard/bottom-aurora.png"
          />
        </div>
        <!-- 착수 회전 아이콘 -->
        <div
          class="cube splashdown_cube"
          :class="[store.state.dashboard.selectedBdIdx > 0 ? 'building-unvisible': 'building-visible']"
        >
          <div class="cube__inner">
            <div class="cube__noimg">
              <div class="cube__icon">
                <span class="main_per_font">{{ store.state.dashboard.zonePer.Z착수 }}</span>
                <span class="main_per_unit">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 약품 건물 -->
        <div
          class="map-contents__drug"
          :class="[store.state.dashboard.selectedBdIdx === 2 ? 'zIndex10': '',
            store.state.dashboard.selectedBdIdx > 0 && store.state.dashboard.selectedBdIdx !== 2 ? 'opacity50' : '']"
        >
          <div
            class="drug-text"
            @mouseover="onBuildingMouseover('약품동', 2)"
            @mouseout="onBuildingMouseout"
            @click="onBuildingMouseClick('약품동', 2)"
          >
            약품
          </div>
          <img
            class="down"
            :class="[store.state.dashboard.selectedBdIdx === 2 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/ca_images/ca_box_02.png"
          />
          <img
            class="up"
            :class="[store.state.dashboard.selectedBdIdx === 2 ? 'building-visible': 'building-unvisible']"
            src="@/assets/img/ca_images/ca_box_02_up.png"
          />
          <img
            class="aurora_drug"
            :class="[store.state.dashboard.selectedBdIdx === 2 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/dashboard/bottom-aurora.png"
          />
        </div>
        <!-- 약품 회전 아이콘 -->
        <div
          class="cube drug_cube"
          :class="[store.state.dashboard.selectedBdIdx > 0 ? 'building-unvisible': 'building-visible']"
        >
          <div class="cube__inner">
            <div class="cube__noimg">
              <div class="cube__icon">
                <span class="main_per_font">{{ store.state.dashboard.zonePer.Z약품 }}</span>
                <span class="main_per_unit">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 침전&혼화응집 건물 -->
        <div
          class="map-contents__sedimentation-mix"
          :class="[store.state.dashboard.selectedBdIdx === 3 || store.state.dashboard.selectedBdIdx === 4 ? 'zIndex10': '',
            store.state.dashboard.selectedBdIdx > 0 && store.state.dashboard.selectedBdIdx !== 3 && store.state.dashboard.selectedBdIdx !== 4 ? 'opacity50' : '']"
        >
          <div
            class="sedimentation-text"
            :class="[store.state.dashboard.selectedBdIdx === 3 ? 'opacity50': '']"
            @mouseover="onBuildingMouseover('응집침전지동', 4)"
            @mouseout="onBuildingMouseout"
            @click="onBuildingMouseClick('응집침전지동', 4)"
          >
            침전
          </div>
          <div
            class="mix-text"
            :class="[store.state.dashboard.selectedBdIdx === 4 ? 'opacity50': '']"
            @mouseover="onBuildingMouseover('응집침전지동', 3)"
            @mouseout="onBuildingMouseout"
            @click="onBuildingMouseClick('응집침전지동', 3)"
          >
            혼화응집
          </div>
          <img
            class="down"
            :class="[store.state.dashboard.selectedBdIdx === 3 || store.state.dashboard.selectedBdIdx === 4 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/ca_images/ca_box_04.png"
          />
          <img
            class="up"
            :class="[store.state.dashboard.selectedBdIdx === 3 || store.state.dashboard.selectedBdIdx === 4 ? 'building-visible': 'building-unvisible']"
            src="@/assets/img/ca_images/ca_box_04_up.png"
          />
          <img
            class="aurora_sedimentation"
            :class="[store.state.dashboard.selectedBdIdx === 4 ? 'building-unvisible': 'building-visible',
              store.state.dashboard.selectedBdIdx === 3 ? 'opacity0' : '']"
            src="@/assets/img/dashboard/bottom-aurora.png"
          />
          <img
            class="aurora_mix"
            :class="[store.state.dashboard.selectedBdIdx === 3 ? 'building-unvisible': 'building-visible',
              store.state.dashboard.selectedBdIdx === 4 ? 'opacity0' : '']"
            src="@/assets/img/dashboard/bottom-aurora.png"
          />
        </div>
        <!-- 혼화응집 회전 아이콘 -->
        <div
          class="cube mix_cube"
          :class="[store.state.dashboard.selectedBdIdx > 0 ? 'building-unvisible': 'building-visible']"
        >
          <div class="cube__inner">
            <div class="cube__noimg">
              <div class="cube__icon">
                <span class="main_per_font">{{ store.state.dashboard.zonePer.Z혼화응집 }}</span>
                <span class="main_per_unit">%</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 침전 회전 아이콘 -->
        <div
          class="cube sedimentation_cube"
          :class="[store.state.dashboard.selectedBdIdx > 0 ? 'building-unvisible': 'building-visible']"
        >
          <div class="cube__inner">
            <div class="cube__noimg">
              <div class="cube__icon">
                <span class="main_per_font">{{ store.state.dashboard.zonePer.Z침전 }}</span>
                <span class="main_per_unit">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 여과 건물 -->
        <div
          class="map-contents__percolation"
          :class="[store.state.dashboard.selectedBdIdx === 5 ? 'zIndex10': '',
            store.state.dashboard.selectedBdIdx > 0 && store.state.dashboard.selectedBdIdx !== 5 ? 'opacity50' : '']"
        >
          <div
            class="percolation-text"
            @mouseover="onBuildingMouseover('3단계여과지동', 5)"
            @mouseout="onBuildingMouseout"
            @click="onBuildingMouseClick('3단계여과지동', 5)"
          >
            여과
          </div>
          <img
            class="down"
            :class="[store.state.dashboard.selectedBdIdx === 5 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/ca_images/ca_box_03.png"
          />
          <img
            class="up"
            :class="[store.state.dashboard.selectedBdIdx === 5 ? 'building-visible': 'building-unvisible']"
            src="@/assets/img/ca_images/ca_box_03_up.png"
          />
          <img
            class="aurora_percolation"
            :class="[store.state.dashboard.selectedBdIdx === 5 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/dashboard/bottom-aurora.png"
          />
        </div>
        <!-- 여과 회전 아이콘 -->
        <div
          class="cube percolation_cube"
          :class="[store.state.dashboard.selectedBdIdx > 0 ? 'building-unvisible': 'building-visible']"
        >
          <div class="cube__inner">
            <div class="cube__noimg">
              <div class="cube__icon">
                <span class="main_per_font">{{ store.state.dashboard.zonePer.Z여과 }}</span>
                <span class="main_per_unit">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 소독 -->
        <div
          class="map-contents__disinfection"
          :class="[store.state.dashboard.selectedBdIdx === 8 ? 'zIndex10': '',
            store.state.dashboard.selectedBdIdx > 0 && store.state.dashboard.selectedBdIdx !== 6 ? 'opacity50' : '']"
        >
          <div
            class="disinfection-text"
            @mouseover="onBuildingMouseover('송수펌프동', 6)"
            @mouseout="onBuildingMouseout"
            @click="onBuildingMouseClick('송수펌프동', 6)"
          >
            소독
          </div>
          <img
            class="down"
            :class="[store.state.dashboard.selectedBdIdx === 6 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/ca_images/ca_box_06.png"
          />
          <img
            class="up"
            :class="[store.state.dashboard.selectedBdIdx === 6 ? 'building-visible': 'building-unvisible']"
            src="@/assets/img/ca_images/ca_box_06_up.png"
          />
          <img
            class="aurora_disinfection"
            :class="[store.state.dashboard.selectedBdIdx === 6 ? 'building-unvisible': 'building-visible']"
            src="@/assets/img/dashboard/bottom-aurora.png"
          />
        </div>
        <!-- 소독 아이콘 -->
        <div
          class="cube disinfection_cube"
          :class="[store.state.dashboard.selectedBdIdx > 0 ? 'building-unvisible': 'building-visible']"
        >
          <div class="cube__inner">
            <div class="cube__noimg">
              <div class="cube__icon">
                <span class="main_per_font">{{ store.state.dashboard.zonePer.Z소독 }}</span>
                <span class="main_per_unit">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <HoverInfo ref="hoverInfo"/>
  </div>

  <div class="dash-right">
    <DashboardInfo ref="dashInfo"/>
  </div>
</div>
</template>

<script setup>
import WaterFlow from '@/components/dashboard/WaterFlow'
import DashboardInfo from '@/components/dashboard/DashboardInfo'
import PowerConsumption from '@/components/dashboard/PowerConsumption'
import EnergySave from '@/components/dashboard/EnergySave'
import HoverInfo from '@/components/dashboard/HoverInfo'

import { ref, onMounted, onUnmounted, defineExpose } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const hoverInfo = ref(null)
const dashInfo = ref(null)

let dashInterval = null

/**
 * EMS 페이지로 이동하는 함수
 * '_self' 옵션으로 새롭게 창을 띄우지 않고 이동
 */
const onClickSending = () => {
  // window.open(SERVICE_URL.EMS + '/analysis', "_self")
}
/**
 * 선택한 페이지로 이동하는 함수
 * Vue Router를 통해 선택한 페이지로 이동
 *
 * @param value 선택한 건물명
 * @param index 선택한 페이지 index
 */
const onBuildingMouseClick = (value, index) => {
  // console.log(value);
  router.push({
    name: 'facUse',
    query: {
      zoneName: value
    }
  })
}
/**
 * 건물에 마우스를 올렸을 때 발생하는 이벤트 함수
 * 선택된 건물로 상태값을 변경
 *
 * @param index 선택한 공정 index
 */
const onBuildingMouseover = (facName, index) => {
  store.state.dashboard.selectedBdIdx = index
  hoverInfo.value.getFacInfo(facName)
}
/**
 * 건물에서 마우스가 벗어났을 때 발생하는 이벤트 함수
 * 선택된 건물 상태 값을 없음(0)으로 변경
 */
const onBuildingMouseout = () => {
  store.state.dashboard.selectedBdIdx = 0
  // console.log('JJJ> onBuildingMouseout()');
}

const prepareData = async () => {
  await store.dispatch('dashboard/getZoneUseList')
}

const refreshDashboard = () => {
  dashInterval = setInterval(async () => {
    await prepareData()
    await dashInfo.value.resetActiveReservoir()
    await dashInfo.value.getDashInfo()
  }, 60000)
}

/**
 * Dashboard.vue가 마운트 됐을 때 실행되는 함수
 * 1분 간격으로 API 호출하는 interval 등록
 */
onMounted(() => {
  prepareData()
  refreshDashboard()
})

/**
 * Dashboard.vue가 제거될 때 실행되는 함수
 * 마운트에서 등록해 놓은 API 호출 interval 제거
 */
onUnmounted(() => {
  // console.log('Dashboard' + ' destoryed')
  if (dashInterval !== null) {
    clearInterval(dashInterval)
  }
})

defineExpose({
  store,
  onBuildingMouseClick,
  onBuildingMouseover,
  onBuildingMouseout
})
</script>

<style lang="scss" scoped>
@import '@/style/layout.scss';
@import '@/style/component/title.scss';
@import '@/style/component/dashboard.scss';
.dashboard-container {
  background-image: url('@/assets/img/ca_images/main_bg.png');
  background-size: cover;
  // width: 1503px;
  // height: 990px;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  margin-left: 10px;
  overflow-y: auto;
}
.main_per_font {
  font-family: LABDigital !important;
  font-size: 20px;
  color: #c3eaff;
  letter-spacing: 1px;
  line-height: 111px;
}
.main_per_unit {
  font-family: LABDigital !important;
  font-size: 22px;
  color: #c3eaff;
  letter-spacing: 1px;
  line-height: 106px;
}

// 공정 건물 안 보이도록 함
.building-unvisible {
  display: none !important;
}
// 공정 건물을 보이도록 함
.building-visible {
  display: block !important;
}
// 레이어 10층
.zindex10 {
  z-index: 10;
}
// 불투명도 0
.opacity0 {
  opacity: 0 !important;
}
// 불투명도 50%
.opacity50 {
  opacity: 0.5 !important;
}
// 불투명도 100%
.opacity100 {
  opacity: 1 !important;
}
// 대시보드 건물 레이아웃
.map-contents {
  position: absolute;
  top: 226.5px;
  margin-top: 70px;
  margin-left: -45px;
  // width: 1509px;
  // height: 763px;
  img {
    position: absolute;
  }
  // 착수 건물
  &__splashdown{
    z-index: 3;
    position: absolute;
    left: 929px;
    top: -68px;
    width: 205px;
    height: 159px;
    clip-path: polygon(0 -36%, 100% -36%, 100% 88%, 58% 111%, 0 81%);
    // 마우스 오버시 건물 Up
    .up{
      position: absolute;
      top: -46px;
      // left: -30px;
      animation: splashdown-up 1s ease-in-out 0s normal;
    }
    // 마우스 오버시 건물 Up keyframes
    @keyframes splashdown-up {
      0% {
        transform: translateY(47px);
      }
      100% {
        transform: translateY(0);
      }
    }
    // 아이콘 하단에 반짝이는 빛
    .aurora_splashdown{
      pointer-events:none;
      top: -20px;
      left: 52px;
      animation: blink 3s infinite alternate;
    }
    // 착수 텍스트
    .splashdown-text {
      position: absolute;
      left: -16px;
      top: 43px;
      width: 250px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;    
    }
  }
  // 약품 건물
  &__drug{
    z-index: 2;
    position: absolute;
    left: 1128px;
    top: 25px;
    width: 205px;
    height: 166px;
    // clip-path: polygon(0 -40%, 100% -40%, 100% 72%, 80% 90%, 40% 101%, 0 81%);
    clip-path: polygon(0 -36%, 100% -36%, 100% 85%, 58% 112%, 0 78%);
    .up{
      position: absolute;
      top: -48px;
      // left: -28px;
      animation: drug-up 1s ease-in-out 0s normal;
    }
    @keyframes drug-up {
      0% {
        transform: translateY(47px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_drug{
      pointer-events:none;
      top: -2px;
      left: 44px;
      animation: blink 3s infinite alternate;
    }
    .drug-text {
      position: absolute;
      left: -25px;
      top: 66px;
      width: 250px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
  }
  //침전&혼화응집 건물
  &__sedimentation-mix{
    z-index: 1;
    position: absolute;
    left: 437px;
    top: 50px;
    width: 738px;
    height: 403px;
    clip-path: polygon(0 -36%, 100% -36%, 100% 65%, 58% 101%, 0 48%);
    .up{
      position: absolute;
      top: -49px;
      // left: -30px;
      animation: sedimentation-mix-up 1s ease-in-out 0s normal;
    }
    @keyframes sedimentation-mix-up {
      0% {
        transform: translateY(48px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_sedimentation{
      pointer-events:none;
      top: 96px;
      left: 310px;
      animation: blink 3s infinite alternate;
    }
    .aurora_mix{
      pointer-events:none;
      top: 35px;
      left: 423px;
      animation: blink 3s infinite alternate;
    }
    .sedimentation-text {
      position: absolute;
      left: 241px;
      top: 163px;
      width: 250px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
    .mix-text {
      position: absolute;
      left: 358px;
      top: 104px;
      width: 250px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor:pointer;
    }
  }
    // 여과 건물
    &__percolation{
    z-index: 2;
    position: absolute;
    left: 197px;
    top: 264px;
    width: 544px;
    height: 328px;
    clip-path: polygon(0 -36%, 100% -36%, 100% 82%, 71% 105%, 0 40%);
    .up {
      position: absolute;
      // left: -30px;
      top: -50px;
      animation: percolation-up 1s ease-in-out 0s normal;
    }
    @keyframes percolation-up {
      0% {
        transform: translateY(49px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_percolation{
      pointer-events:none;
      top: 53px;
      left: 211px;
      animation: blink 3s infinite alternate;
    }
    .percolation-text{
      position: absolute;
      left: 141px;
      top: 121px;
      width: 250px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
  }
  // 소독 건물
  &__disinfection{
    position: absolute;
    left: 1075px;
    top: 381px;
    width: 206px;
    height: 139px;
    clip-path: polygon(0 -36%, 100% -37%, 100% 81%, 42% 120%, 0 89%);
    .up{
      position: absolute;
      top:-42px;
      // left: -24px;
      animation: disinfection-up 1s ease-in-out 0s normal;
    }
    @keyframes disinfection-up {
      0% {
        transform: translateY(42px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_disinfection{
      pointer-events:none;
      top: -29px;
      animation: blink 3s infinite alternate;
    }
    .disinfection-text {
      position: absolute;
      left: -6px;
      top: 38px;
      width: 130px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
  }
}

// 공정별 아이콘
// 위 아래로 움직이는 아이콘
.cube {
  z-index: 5;
  pointer-events:none;  
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 80px;
  height: 80px;
  -webkit-animation: updown 2s ease-in-out 0s infinite alternate;
  animation: updown 2s ease-in-out 0s infinite alternate;
  // 아이콘 테투리 원
  &__inner {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('@/assets/img/dashboard/cube_back.png');
  }
  // 아이콘 3차원
  &__noimg {
    width: 80px;
    height: 80px;
    // -webkit-transform-style: preserve-3d;
    // -webkit-transform: rotateX(0) rotateY(0) rotateZ(0);

    // transform-style: preserve-3d;
    // transform: rotateX(0) rotateY(0) rotateZ(0);
    // // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
    // -webkit-animation: turn 5s linear 0s infinite normal;
    // animation: turn 5s linear 0s infinite normal;
  }
  &__icon {
    width: 80px;
    height: 80px;
    position: absolute;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
// 회전 keyframe
@-webkit-keyframes turn {
  0% {
    -webkit-transform: rotateY(0);
  }
  100% {
    -webkit-transform: rotateY(360deg);
  }
}
@keyframes turn {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(360deg);
  }
}

// 위아래 둥실둥실 keyframe
@keyframes updown {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(20px);
  }
}
@-webkit-keyframes updown {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(20px);
  }
}

// 반짝반짝 keyframe
@keyframes blink {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
// 소독 아이콘
.disinfection_cube{
  top: 300px;
  left: 1090px;
  .back_disinfection{
    background-image: url('@/assets/img/dashboard/cube_disinfection_icon.png');
  }
}
// 여과 아이콘
.percolation_cube{
  top: 270px;
  left: 423px;
  .back_percolation{
    background-image: url('@/assets/img/dashboard/cube_percolation_icon.png');
  }
}
// 약품 아이콘
.drug_cube{
  top: -26px;
  left: 1186px;
  .back_drug{
    background-image: url('@/assets/img/dashboard/cube_drug_icon.png');
  }
}
// 착수 아이콘
.splashdown_cube{
  top: -139px;
  left: 997px;
  .back_splashdown{
    background-image: url('@/assets/img/dashboard/cube_splashdown_icon.png');
  }
}
// 침전 아이콘
.sedimentation_cube{
  z-index: 2;
  top: 97px;
  left: 762px;
  .back_sedimentation{
    background-image: url('@/assets/img/dashboard/cube_sedimentation_icon.png');
  }
}
// 혼화응집 아이콘
.mix_cube{
  top: 36px;
  left: 874px;
  .back_mix{
    background-image: url('@/assets/img/dashboard/cube_mix_icon.png');
  }
}
// 혼화응집2 아이콘
// .mix_cube2 {
//   top: 181px;
//   left: 445px;
//   .back_mix {
//     background-image: url('@/assets/img/dashboard/cube_mix_icon.png');
//   }
// }
.percolation_cube2 {
  top: 110px;
  left: 185px;
  .back_percolatio {
    background-image: url('@/assets/img/dashboard/cube_percolation_icon.png');
  }
}

</style>
