<template>
  <div class="main">
    <div class="main__left">
      <InputFormComponent />
      <ResultComponent />
    </div>
    <div class="main__right">
      <SearchComponent />
      <!--  -->
    </div>
  </div>
</template>

<script>
import InputFormComponent from '@/components/indCoagulants/simulation/InputFormComponent'
import ResultComponent from '@/components/indCoagulants/simulation/ResultComponent'
import SearchComponent from '@/components/indCoagulants/simulation/SearchComponent'
import { GET_INDCOAGULANT_LATEST } from '@/store/modules/indCoagulants'
import { SET_OVERLAY } from '@/store'
export default {
  name: 'IndCgSimulation',
  data: () => ({
    intervalTime: 60 * 1000, // API 요청 주기
    timer: null,
  }),
  components: {
    InputFormComponent,
    ResultComponent,
    SearchComponent
  },
  mounted: function () {
    this.$store.commit(SET_OVERLAY, true)
    Promise.all([
      this.$store.dispatch(GET_INDCOAGULANT_LATEST)
    ]).finally(() => {
      this.$store.commit(SET_OVERLAY, false)
    })

    this.timer = setInterval(() => {
      this.$store.dispatch(GET_INDCOAGULANT_LATEST)
    }, this.intervalTime)
  },
  // 마운트 해제시 API 요청 타이머 해제
  destroyed: function () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
.main {
  display: flex;
  margin: 34px 34px 25px 52px;
  justify-content: space-between;
  &__left {
    width: 501px;
  }
  &__right {
    width: 1320px;
  }
}

</style>