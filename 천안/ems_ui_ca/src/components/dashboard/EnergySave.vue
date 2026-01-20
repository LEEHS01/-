<template>
<!-- 에너지 절감 현황 시작 -->
<div class="contents">
  <div class="content">
    <div class="green-round" ><span>절감</span><span>현황</span></div>
  </div>
  <!-- 전력 절감 시작 -->
  <div class="energy-save">
    <div class="h30px w100 flex-center-between" >
    <div class="content-text-box">전력절감</div>
    <div class="content-value-box" style="width: 130px;">
    </div>
    </div>

    <!-- 금일 -->
    <div class="h90 w100 flex-center-between __web-inspector-hide-shortcut__ ">
    <div class = "animation-title">
      <div class = "fL animation-item"  style = "display:block">
      <div style = "display:flex;">
        <div class=" w100 flex-center-between justify-start">
        <div class="content-text-box">전일</div>
        <div class="content-value-box" >
          <span>{{ comma(store.state.dashboard.daySavingKwh .toFixed(0)) }}</span><span class="unit">kWh</span>
        </div>
        </div>
      </div>
      </div>

      <div class = "fL animation-item"  style = "display:block">
      <div style = "display:flex;">
        <div class=" w100 flex-center-between justify-start">
        <div class="content-text-box">금월</div>
        <div class="content-value-box" >
          <span>{{ comma(store.state.dashboard.monthSavingKwh .toFixed(0)) }}</span><span class="unit">kWh</span>
        </div>
        </div>
      </div>
      </div>

      <div class = "fL animation-item"  style = "display:block">
      <div style = "display:flex;">
        <div class=" w100 flex-center-between justify-start">
        <div class="content-text-box">금년</div>
        <div class="content-value-box" >
          <span>{{ comma(store.state.dashboard.yearSavingKwh .toFixed(0)) }}</span><span class="unit">kWh</span>
        </div>
        </div>
      </div>
      </div>

      <div class = "fL animation-item"  style = "display:block">
      <div style = "display:flex;">
        <div class=" w100 flex-center-between justify-start">
        <div class="content-text-box">전일</div>
        <div class="content-value-box" >
          <span>{{ comma(store.state.dashboard.daySavingKwh .toFixed(0)) }}</span><span class="unit">kWh</span>
        </div>
        </div>
      </div>
      </div>

    </div>
    </div>
  </div>
  <!-- 전력 절감 끝 -->

  <!-- 탄소 저감 시작 -->
  <div class="energy-save">
    <div class="h30px w100 flex-center-between" >
    <div class="content-text-box">탄소저감</div>
    <div class="content-value-box" style="width: 130px;">
    </div>
    </div>

    <!-- 금일 -->
    <div class="h90 w100 flex-center-between __web-inspector-hide-shortcut__">
    <div class = "animation-title">

      <div class = "fL animation-item"  style = "display:block">
      <div style = "display:flex;">
        <div class=" w100 flex-center-between justify-start">
        <div class="content-text-box">전일</div>
        <div class="content-value-box" >
          <span>{{ comma(store.state.dashboard.daySavingCo2 .toFixed(0)) }}</span><span class="unit">kg</span>
        </div>
        </div>
      </div>
      </div>

      <div class = "fL animation-item"  style = "display:block">
      <div style = "display:flex;">
        <div class=" w100 flex-center-between justify-start">
        <div class="content-text-box">금월</div>
        <div class="content-value-box" >
          <span>{{ comma(store.state.dashboard.monthSavingCo2 .toFixed(0)) }}</span><span class="unit">kg</span>
        </div>
        </div>
      </div>
      </div>

      <div class = "fL animation-item"  style = "display:block">
      <div style = "display:flex;">
        <div class=" w100 flex-center-between justify-start">
        <div class="content-text-box">금년</div>
        <div class="content-value-box" >
          <span>{{ comma(store.state.dashboard.yearSavingCo2 .toFixed(0)) }}</span><span class="unit">kg</span>
        </div>
        </div>
      </div>
      </div>

      <div class = "fL animation-item"  style = "display:block">
      <div style = "display:flex;">
        <div class=" w100 flex-center-between justify-start">
        <div class="content-text-box">전일</div>
        <div class="content-value-box" >
          <span>{{ comma(store.state.dashboard.daySavingCo2 .toFixed(0)) }}</span><span class="unit">kg</span>
        </div>
        </div>
      </div>
      </div>

    </div>
    </div>

  </div>
  <!-- 탄소 저감 끝 -->
</div>
<!-- 에너지 절감 현황 끝 -->

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

.energy-save{
  background: url('@/assets/img/dashboard/dash_top.png') no-repeat;
  background-size: 100% 100%;
  width: 180px;
  padding: 0px 25px;
  margin-right: 10px
}

</style>
