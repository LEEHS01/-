<template>
<!-- hover 될 때 표시될 화면 -->
<div class="hover-info"
  :class="[store.state.dashboard.selectedBdIdx === 0 ? 'main-info-down': 'main-info-up']"
  :style="[store.state.dashboard.selectedBdIdx === 0 ? 'display: none;': 'display: block;']">
<!-- <div class="hover-info main-info-up" style="display: block;"> -->

  <div class="dash-border-img div-small">
    <div class="bottom-fac-title">
      <div class="bottom-fac-lsit-cont1 fL">
        <span>{{ store.state.dashboard.selectedBdName }}  주요 설비</span> TOP 3
      </div>
      <div class="bottom-fac-lsit-cont2 fR">
        <span class="elec-use-unit-font" style=" font-size: 15px;">전력소비 : </span>
        <span style="font-family: LABDigital; font-size: 19px;">{{ store.state.dashboard.selectedBdPowerUsage }}</span>
        <span class="elec-use-unit-font">kWh</span>
      </div>
    </div>
    <div class="chart-div">
      <div class="chart-bar-div fL">
        <div style="width: 86%;height: 50%;display: flex;align-items: center;">
          <div class="bottom-all1 fL">{{ store.state.dashboard.facData[0].description }}</div>
          <div class="bottom-all1 fR" style="width: 43%; text-align: right;">
            <span class="bottom-fac-font-num">{{ comma(store.state.dashboard.facData[0].value.toFixed(0)) }}</span>
            <span class="bottom-fac-font-unit">kWh</span>
          </div>
        </div>
        <div class="bottom-all4 fL">
          <div class="bottom-all3-1" style="position: relative;">
            <div class="chart-bar-base"></div>
            <div class="chartTop0 chart-bar"></div>
          </div>
        </div>
      </div>
      <div class="chart-bar-div fL">
        <div style="width: 86%;height: 50%;display: flex;align-items: center;">
          <div class="bottom-all1 fL">{{ store.state.dashboard.facData[1].description }}</div>
          <div class="bottom-all1 fR" style="width: 43%; text-align: right;">
            <span class="bottom-fac-font-num">{{ comma(store.state.dashboard.facData[1].value.toFixed(0)) }}</span>
            <span class="bottom-fac-font-unit">kWh</span></div>
        </div>
        <div class="bottom-all4 fL">
          <div class="bottom-all3-1" style="position: relative;">
            <div class="chart-bar-base"></div>
            <div class="chartTop1 chart-bar"></div>
          </div>
        </div>
      </div>
      <div class="chart-bar-div fL">
        <div style="width: 86%;height: 50%;display: flex;align-items: center;">
          <div class="bottom-all1 fL">{{ store.state.dashboard.facData[2].description }}</div>
          <div class="bottom-all1 fR" style="width: 43%; text-align: right;">
            <span class="bottom-fac-font-num">{{ comma(store.state.dashboard.facData[2].value.toFixed(0)) }}</span>
            <span class="bottom-fac-font-unit">kWh</span></div>
        </div>
        <div class="bottom-all4 fL">
          <div class="bottom-all3-1" style="position: relative;">
            <div class="chart-bar-base"></div>
            <div class="chartTop2 chart-bar"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted, computed, defineExpose } from 'vue'
import { useStore } from 'vuex'
import { comma } from '@/utils/utils.js'
import moment from 'moment'
import log from '@/logger.js'

const store = useStore()

const top1Background = ref('10% 100%')
const top2Background = ref('10% 100%')
const zoneList = computed(() => store.getters['dashboard/getZoneList'])

const getFacInfo = async (BdCode) => {
  const param = {
    date: moment().format('YYYY-MM-DD'),
    zone_code: BdCode
  }

  store.state.dashboard.selectedBdName = BdCode

  await store.dispatch('dashboard/getTop3', param)
  setFacTop3(BdCode, store.state.dashboard.facData)
}

const setFacTop3 = (zoneCode, data) => {
  try {
    const max = data[0].value

    top1Background.value = (data[1].value * 100 / max) + '% 100%'
    top2Background.value = (data[2].value * 100 / max) + '% 100%'

    if (zoneList.value === null) {
      store.state.dashboard.selectedBdPowerUsage = 0
    } else {
      zoneList.value.forEach(zone => {
        if (zone.zone_name === zoneCode) {
          store.state.dashboard.selectedBdPowerUsage = Number(zone.y)
        }
      })
    }
  } catch (err) {
    log.logError(err.message);
  }
}

onMounted(() => {
  getFacInfo('착수동')
})

defineExpose({
  store,
  getFacInfo,
  comma,
  top1Background,
  top2Background
})
</script>

<style lang="scss" scoped>
@import '@/style/layout.scss';
@import '@/style/component/title.scss';

.hover-info {
  width: 35%;
  height: 35%;
  position: relative;
  float: left;
  top: 39.5%;
  left: 42%;
  // display: block;
  z-index: 15;
}

.dash-border-img{
  background: url('@/assets/img/00_table_bg.png') no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.div-small {
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.bottom-fac-title{
  width: 89%;
  height: 16%;
  margin-top: 20px;
  // display: flex;
  // align-content: flex-start;
  // justify-content: space-around;
  // align-items: center;
}

.bottom-fac-lsit-cont1{
  width: 100%;
  font-size: 17px;
  font-family: 'KHNPHDRegular';
  color: #24ABE2;
  line-height: 43px;
  font-weight: bold;
}

.bottom-fac-lsit-cont2{
  font-size: 17px;
  font-family: 'KHNPHDRegular';
  color: #24ABE2;
  line-height: 43px;
  font-weight: bold;
  margin-top: -15px;
}

.elec-use-unit-font {
  font-family: KHNPHDRegular;
  font-size: 14px;
  color: #fff;
  margin-right: 20px;
}

.chart-div {
  width: 89%;
  height: 75%;
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.chart-bar {
  position: absolute;
  background: url('@/assets/img/percent_bar.png');
  // background-size: 21% 100%;
  width: 100%;
  height: 100%;
  z-index: 17;
  background-repeat: no-repeat;
  transition: all linear .3s;
}

.chart-bar-base {
  position: absolute;
  background: url('@/assets/img/percent_bar_bg.png');
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  z-index: 16;
}

.chart-bar-div {
  width: 100%;
  height: calc(85%/3);
  margin-left: 21px;
}

.chartTop0 {
  background-size: 100% 100%;
}

.chartTop1 {
  background-size: v-bind(top1Background);
}

.chartTop2 {
  background-size: v-bind(top2Background);
}

.bottom-all1 {
  width: 54%;
  color: #fff;
  font-family: 'KHNPHDRegular';
  font-size: 14px;
  text-align: left;
  margin-left: 6px;
}

.bottom-all2 {
  width: 40%;
  font-size: 15px;
  font-family: 'KHNPHDRegular';
  letter-spacing: normal;
  color: #c3eaff;
}

.bottom-all3 {
  width: 10%;
  font-size: 15px;
  font-family: 'KHNPHDRegular';
  letter-spacing: normal;
  color: #c3eaff;
}

.bottom-all3-1 {
  height: 43%;
  text-align: left;
  margin: 10px 5px;
}

.bottom-all4 {
  width: 87%;
  height: 49%;
  font-size: 15px;
  font-family: 'KHNPHDRegular';
  letter-spacing: normal;
  color: #c3eaff;
}

.main-info-up {
  -webkit-animation: up 0.5s linear;
  -moz-animation: up 0.5s linear;
  animation: up 0.5s linear;
}
@-webkit-keyframes up {
  0% {
    opacity:0;
    transform: translateY(50px);
  }
  100% {
    opacity:1;
    transform: translateY(0px);
  }
}
@-moz-keyframes up {
  0% {
    opacity:0;
    transform: translateY(50px);
  }
  100% {
    opacity:1;
    transform: translateY(0px);
  }
}
@keyframes up {
  0% {
    opacity:0;
    transform: translateY(50px);
  }
  100% {
    opacity:1;
    transform: translateY(0px);
  }
}
.main-info-down {
  -webkit-animation: down 0.5s forwards ;
  -moz-animation: down 0.5s forwards ;
  animation: down 0.5s forwards ;
}
@-webkit-keyframes down {
  0% {
    opacity:1;
    transform: translateY(0px);
  }
  100% {
    opacity:0;
    transform: translateY(50px);
  }
}
@-moz-keyframes down {
  0% {
    opacity:1;
    transform: translateY(0px);
  }
  100% {
    opacity:0;
    transform: translateY(50px);
  }
}
@keyframes down {
  0% {
    opacity:1;
    transform: translateY(0px);
  }
  100% {
    opacity:0;
    transform: translateY(50px);
  }
}
</style>
