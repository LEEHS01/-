<template>
<!-- 전력 소비 현황 시작 -->
<div class="contents">
  <div class="content">
    <div class="blue-round"><span>소비</span><span>현황</span></div>
  </div>
  <div class="consumptions">
    <div class="h30px w100 flex-center-between">
      <div class="content-text-box">전력소비</div>
      <div class="content-value-box" style="width: 200px;">
        <span style="font-size: 22px;">{{ comma(store.state.dashboard.nowUse.toFixed(0)) }}</span><span class="unit">kW</span>
      </div>
    </div>

    <div class="h90 w100 flex-center-between __web-inspector-hide-shortcut__ ">
      <div class="animation-title">
        <div class="fL animation-item" style="display:block">
          <div style="display:flex;">
            <div class=" w50 flex-center-between justify-start">
              <div class="content-text-box" style=" width: 60px;">전일</div>
              <div class="content-value-box">
                <span>{{ comma(store.state.dashboard.yesterdayUse.toFixed(0)) }}</span><span class="unit">kWh</span>
              </div>
            </div>
            <div class=" w50 flex-center-between ">
              <div class="content-text-box" style=" margin-left: 25px;">목표대비</div>
              <div class="content-value-box">
                <span>{{ comma(store.state.dashboard.dayPer.toFixed(2)) }}</span><span class="unit">%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fL animation-item" style="display:block">
          <div style="display:flex;">
            <div class=" w50 flex-center-between justify-start">
              <div class="content-text-box" style=" width: 60px;">금월</div>
              <div class="content-value-box">
                <span>{{ comma(store.state.dashboard.monthUse.toFixed(0)) }}</span><span class="unit">kWh</span>
              </div>
            </div>
            <div class=" w50 flex-center-between ">
              <div class="content-text-box" style=" margin-left: 25px;">목표대비</div>
              <div class="content-value-box">
                <span>{{ comma(store.state.dashboard.monthPer.toFixed(2)) }}</span><span class="unit">%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fL animation-item" style="display:block">
          <div style="display:flex;">
            <div class=" w50 flex-center-between justify-start">
              <div class="content-text-box" style=" width: 60px;">금년</div>
              <div class="content-value-box">
                <span>{{ comma(store.state.dashboard.yearUse.toFixed(0)) }}</span><span class="unit">kWh</span>
              </div>
            </div>
            <div class=" w50 flex-center-between ">
              <div class="content-text-box" style=" margin-left: 25px;">목표대비</div>
              <div class="content-value-box">
                <span>{{ comma(store.state.dashboard.yearPer.toFixed(2)) }}</span><span class="unit">%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fL animation-item" style="display:block">
          <div style="display:flex;">
            <div class=" w50 flex-center-between justify-start">
              <div class="content-text-box" style=" width: 60px;">전일</div>
              <div class="content-value-box">
                <span>{{ comma(store.state.dashboard.yesterdayUse.toFixed(0)) }}</span><span class="unit">kWh</span>
              </div>
            </div>
            <div class=" w50 flex-center-between ">
              <div class="content-text-box" style=" margin-left: 25px;">목표대비</div>
              <div class="content-value-box">
                <span>{{ comma(store.state.dashboard.dayPer.toFixed(2)) }}</span><span class="unit">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- 전력 소비 현황 끝 -->
</template>

<script>
import { useStore } from 'vuex'
import { comma } from '@/utils/utils.js'

export default {
  setup () {
    const store = useStore()

    return {
      store,
      comma
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/component/dashboard.scss';
.consumptions {
  background: url('@/assets/img/dashboard/dash_top.png') no-repeat;
  background-size: 100% 100%;
  width: 420px;
  height: 100%;
  padding: 0px 25px;
  color: #fff;
  text-shadow: 0 0 9px #5cafff;
  font-family: 'KHNPHDRegular';
  display: flex;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
