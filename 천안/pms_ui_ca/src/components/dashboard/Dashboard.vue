<template>
  <div class="dashboard-container">
    <DashboardInfo />
    <WaterFlow />

    <div class="pieChart-box">
      <Pie :key="store.state.dashboard.facNormalValue"/>
    </div>
    <div class="map-contents">
      <!-- 착수 건물 -->
      <div
        class="map-contents__splashdown"
        :class="[store.state.selectedBuildingIndex === 1 ? 'zIndex10': '',
          store.state.selectedBuildingIndex > 0 && store.state.selectedBuildingIndex !== 1 ? 'opacity50' : '']"
      >
        <div
          class="splashdown-text"
        >
          착수
        </div>
        <img
          class="down"
          :class="[store.state.selectedBuildingIndex === 1 ? 'building-unvisible': 'building-visible']"
          src="@/assets/ca_images/ca_box_01.png"
        />
        <img
          class="up"
          :class="[store.state.selectedBuildingIndex === 1 ? 'building-visible': 'building-unvisible']"
          src="@/assets/ca_images/ca_box_01_up.png"
        />
        <!-- <img
          class="aurora_splashdown"
          :class="[store.state.selectedBuildingIndex === 1 ? 'building-unvisible': 'building-visible']"
          src="@/assets/dashboard_icons/bottom-aurora.png"
        /> -->
      </div>
      <!-- <div
        class="cube splashdown_cube"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']"
        @click="goRouter('WaterControlView')"
      >
      <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('water') >= 0? 'alert': '']"
        >
          유입<br />V
        </div>
      </div> -->

      <!-- 약품 건물 -->
      <div
        class="map-contents__drug"
        :class="[store.state.selectedBuildingIndex === 2 ? 'zIndex10': '',
          store.state.selectedBuildingIndex > 0 && store.state.selectedBuildingIndex !== 2 ? 'opacity50' : '']"
      >
        <div
          class="drug-text"
        >
          약품
        </div>
        <img
          class="down"
          :class="[store.state.selectedBuildingIndex === 2 ? 'building-unvisible': 'building-visible']"
          src="@/assets/ca_images/ca_box_02.png"
        />
        <img
          class="up"
          :class="[store.state.selectedBuildingIndex === 2 ? 'building-visible': 'building-unvisible']"
          src="@/assets/ca_images/ca_box_02_up.png"
        />
        <!-- <img
          class="aurora_drug"
          :class="[store.state.selectedBuildingIndex === 2 ? 'building-unvisible': 'building-visible']"
          src="@/assets/dashboard_icons/bottom-aurora.png"
        /> -->
      </div>
      <!-- <div
        class="cube drug_cube"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']"
        @click="goRouter('PacTubeView')"
      >
        <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('pac') >= 0 ? 'alert' : '',
            store.state.dashboard.alarmInfo.indexOf('pahcs') >= 0 ? 'alert' : '']"
        >
          약품<br />펌프
        </div>
      </div>
      <div
        class="cube drug_cube2"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']"
        @click="goRouter('AutoWaterView')"
      >
        <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('auto') >= 0 ? 'alert' : '']"
        >
          급수<br />P
        </div>
      </div> -->

      <!-- 침전&혼화응집 건물 -->
      <div
        class="map-contents__sedimentation-mix"
        :class="[store.state.selectedBuildingIndex === 3 || store.state.selectedBuildingIndex === 4 ? 'zIndex10': '',
          store.state.selectedBuildingIndex > 0 && store.state.selectedBuildingIndex !== 3 && store.state.selectedBuildingIndex !== 4 ? 'opacity50' : '']"
      >
        <div
          class="sedimentation-text"
          :class="[store.state.selectedBuildingIndex === 3 ? 'opacity50': '']"
        >
          침전
        </div>
        <div
          class="mix-text"
          :class="[store.state.selectedBuildingIndex === 4 ? 'opacity50': '']"
        >
          혼화응집
        </div>
        <img
          class="down"
          :class="[store.state.selectedBuildingIndex === 3 || store.state.selectedBuildingIndex === 4 ? 'building-unvisible': 'building-visible']"
          src="@/assets/ca_images/ca_box_04.png"
        />
        <img
          class="up"
          :class="[store.state.selectedBuildingIndex === 3 || store.state.selectedBuildingIndex === 4 ? 'building-visible': 'building-unvisible']"
          src="@/assets/ca_images/ca_box_04_up.png"
        />
        <!-- <img
          class="aurora_sedimentation"
          :class="[store.state.selectedBuildingIndex === 4 ? 'building-unvisible': 'building-visible',
            store.state.selectedBuildingIndex === 3 ? 'opacity0' : '']"
          src="@/assets/dashboard_icons/bottom-aurora.png"
        />
        <img
          class="aurora_mix"
          :class="[store.state.selectedBuildingIndex === 3 ? 'building-unvisible': 'building-visible',
            store.state.selectedBuildingIndex === 4 ? 'opacity0' : '']"
          src="@/assets/dashboard_icons/bottom-aurora.png"
        /> -->
      </div>
      <!-- <div
        class="cube mix_cube"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']"
        @click="goRouter('RapidAgitatorView')"
      >
        <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('rapid') >= 0 ? 'alert' : '']"
        >
          혼화기
        </div>
      </div>
      <div
        class="cube mix_cube2"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible' : 'building-visible']"
        @click="goRouter('AgglomerateView')"
      >
        <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('agglomerate') >= 0 ? 'alert' : '']"
        >
          응집기
        </div>
      </div>
      <div
        class="cube sedimentation_cube"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']"
        @click="goRouter('SludgeCollectorView')"
      >
        <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('sludge') >= 0 ? 'alert' : '']"
        >
          슬러지<br />수집기
        </div>
      </div> -->

      <!-- 여과 건물 -->
      <div
        class="map-contents__percolation"
        :class="[store.state.selectedBuildingIndex === 5 ? 'zIndex10': '',
          store.state.selectedBuildingIndex > 0 && store.state.selectedBuildingIndex !== 5 ? 'opacity50' : '']"
      >
        <div
          class="percolation-text"
        >
          여과
        </div>
        <img
          class="down"
          :class="[store.state.selectedBuildingIndex === 5 ? 'building-unvisible': 'building-visible']"
          src="@/assets/ca_images/ca_box_03.png"
        />
        <img
          class="up"
          :class="[store.state.selectedBuildingIndex === 5 ? 'building-visible': 'building-unvisible']"
          src="@/assets/ca_images/ca_box_03_up.png"
        />
        <!-- <img
          class="aurora_percolation"
          :class="[store.state.selectedBuildingIndex === 5 ? 'building-unvisible': 'building-visible']"
          src="@/assets/dashboard_icons/bottom-aurora.png"
        /> -->
      </div>
      <!-- <div
        class="cube percolation_cube"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']"
        @click="goRouter('FilterBackWashView')"
      >
        <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('filter') >= 0 ? 'alert' : '']"
        >
          역세<br />P
        </div>
      </div>
      <div
        class="cube percolation_cube2"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']"
        @click="goRouter('BackWashBlowerView')"
      >
        <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('backwash') >= 0 ? 'alert' : '']"
        >
          역세<br />B
        </div>
      </div> -->

      <!-- 소독 건물 -->
      <div
        class="map-contents__disinfection"
        :class="[store.state.selectedBuildingIndex === 6 ? 'zIndex10': '',
          store.state.selectedBuildingIndex > 0 && store.state.selectedBuildingIndex !== 6 ? 'opacity50' : '']"
      >
        <div
          class="disinfection-text"
        >
          소독
        </div>
        <img
          class="down"
          :class="[store.state.selectedBuildingIndex === 6 ? 'building-unvisible': 'building-visible']"
          src="@/assets/ca_images/ca_box_06.png"
        />
        <img
          class="up"
          :class="[store.state.selectedBuildingIndex === 6 ? 'building-visible': 'building-unvisible']"
          src="@/assets/ca_images/ca_box_06_up.png"
        />
        <!-- <img
          class="aurora_disinfection"
          :class="[store.state.selectedBuildingIndex === 6 ? 'building-unvisible': 'building-visible']"
          src="@/assets/dashboard_icons/bottom-aurora.png"
        /> -->
      </div>
      <!-- 소독 회전 아이콘 -->
      <!-- <div
        class="cube disinfection_cube"
        :class="[store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']"
        @click="goRouter('WaterControlView')"
      >
      <div
          class="cube__inner"
          :class="[store.state.dashboard.alarmInfo.indexOf('water') >= 0? 'alert': '']"
        >
          차염<br />발생기
        </div>
      </div> -->
    </div>
    <!-- <Popup1 v-if="store.state.selectedBuildingIndex === 1" />
    <Popup2 v-if="store.state.selectedBuildingIndex === 2" />
    <Popup3 v-if="store.state.selectedBuildingIndex === 3" />
    <Popup4 v-if="store.state.selectedBuildingIndex === 4" />
    <Popup5 v-if="store.state.selectedBuildingIndex === 5" />
    <Popup6 v-if="store.state.selectedBuildingIndex === 6" />
    <Popup7 v-if="store.state.selectedBuildingIndex === 7" />
    <Popup5 v-if="store.state.selectedBuildingIndex === 8" /> -->
  </div>
</template>

<script>
import DashboardInfo from '@/components/dashboard/DashboardInfo.vue';
import WaterFlow from '@/components/dashboard/WaterFlow.vue';
// import Popup1 from '@/components/dashboard/popup/Popup1.vue';
// import Popup2 from '@/components/dashboard/popup/Popup2.vue';
// import Popup3 from '@/components/dashboard/popup/Popup3.vue';
// import Popup4 from '@/components/dashboard/popup/Popup4.vue';
// import Popup5 from '@/components/dashboard/popup/Popup5.vue';
// import Popup6 from '@/components/dashboard/popup/Popup6.vue';
// import Popup7 from '@/components/dashboard/popup/Popup7.vue';
import { useStore } from 'vuex';
import Pie from '@/components/chart/dashboard/PieChart_main.vue';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';

export default {
  components: {
    DashboardInfo,
    WaterFlow,
    // Popup1,
    // Popup2,
    // Popup3,
    // Popup4,
    // Popup5,
    // Popup6,
    // Popup7,
    Pie,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const onBuildingMouseover = (index) => {
      store.state.selectedBuildingIndex = index;
      store.state.dashboard.idx = index - 1;
    };

    const onBuildingMouseout = () => {
      store.state.selectedBuildingIndex = 0;
    };

    const goRouter = (value) => {
      router.push(value);
    };

    let dashInterval = null
    const refreshDashboard = () => {
      dashInterval = setInterval(async () => {
        await store.dispatch('dashboard/facStatistics');
        await store.dispatch('dashboard/motorAlarm');
        await store.dispatch('dashboard/motorDataAll');
        await store.dispatch('dashboard/pumpBearingAll');
        await store.dispatch('dashboard/alarmDataAll');
        await store.dispatch('dashboard/operationAll');
      }, 300000)
    }

    onMounted(() => {
      store.dispatch('dashboard/facStatistics');
      store.dispatch('dashboard/alarmDataAll');
      store.dispatch('dashboard/operationAll');
      refreshDashboard()
    });

    onUnmounted(() => {
      // console.log('Dashboard' + ' destoryed')
      if (dashInterval !== null) {
        clearInterval(dashInterval)
      }
    })

    return { store, onBuildingMouseover, onBuildingMouseout, goRouter };
  },
};
</script>

<style scoped lang="scss">
.dashboard-container {
  background: url("~@/assets/ca_images/main_bg.png") no-repeat;
  background-size: cover;
  width: 1503px;
  height: 990px;
  overflow-y: auto;

  .pieChart-box {
    position: absolute;
    width: 540px;
    height: 350px;
    top: 0;
    left: 70px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  }
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
  top: 170px;
  // width: 1509px;
  // height: 763px;
  margin-top: 80px;
  margin-left: 50px;
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
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 80px;
  height: 80px;
  -webkit-animation: updown 2s ease-in-out 0s infinite alternate;
  animation: updown 2s ease-in-out 0s infinite alternate;
  &__inner {
    width: 80px;
    height: 80px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    line-height: 24px;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 80px;
    background: radial-gradient(
        rgba(83, 146, 219, 0),
        rgba(83, 146, 219, 0),
        rgba(83, 146, 219, 0),
        rgba(83, 146, 219, 1),
        rgba(83, 146, 219, 1)
    ) !important;
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
.disinfection_cube {
  top: 300px;
  left: 1090px;
  cursor: pointer;
}
// 여과 아이콘
.percolation_cube {
  top: 270px;
  left: 380px;
  cursor: pointer;
}
.percolation_cube2 {
  top: 270px;
  left: 460px;
  cursor: pointer;
}
.percolation2_cube {
  top: 110px;
  left: 150px;
  cursor: pointer;
}
.percolation2_cube2 {
  top: 110px;
  left: 230px;
  cursor: pointer;
}
// 송수 아이콘
.pump_cube {
  top:389px;
  left:838px;
  cursor: pointer;
}
// 약품 아이콘
.drug_cube {
  top: -26px;
  left: 1150px;
  cursor: pointer;
}
.drug_cube2 {
  top:-26px;
  left: 1230px;
  cursor: pointer;
}
// 착수 아이콘
.splashdown_cube {
  top: -139px;
  left: 997px;
  cursor: pointer;
}
// 침전 아이콘
.sedimentation_cube {
  z-index: 2;
  top: 97px;
  left: 762px;
  cursor: pointer;
}
.sedimentation2_cube {
  z-index: 2;
  top: 220px;
  left: 330px;
  cursor: pointer;
}

// 혼화응집 아이콘
.mix_cube {
  top: 36px;
  left: 840px;
  cursor: pointer;
}
// 혼화응집2 아이콘
.mix_cube2 {
  top: 36px;
  left: 920px;
  cursor: pointer;
}
.mix2_cube {
  top: 181px;
  left: 405px;
  cursor: pointer;
}
// 혼화응집2 아이콘
.mix2_cube2 {
  top: 181px;
  left: 485px;
  cursor: pointer;
}
</style>
