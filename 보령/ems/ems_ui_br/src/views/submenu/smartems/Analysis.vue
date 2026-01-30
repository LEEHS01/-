<template>
  <div class="title_wrap">
    <span class="title">송수펌프 제어 분석</span>
    <div class="title_line"></div>
    <div style="height: 100%">
      <TabItem v-for="item in list"
      v-bind="item" :key="item.id" :id="item.id" :label="item.label" :currentId="currentId"
      @update:currentId="currentId = $event" />
    </div>
  </div>
  <component :is="currentComponent"/>
</template>

<script>
import { ref, computed } from 'vue'
import TabItem from '@/components/common/TabItem.vue'
import AnalysisBR from '@/components/AI/analysis/AnalysisBR.vue'
import AnalysisSS from '@/components/AI/analysis/AnalysisSS.vue'
import AnalysisCY from '@/components/AI/analysis/AnalysisCY.vue'
import AnalysisHS from '@/components/AI/analysis/AnalysisHS.vue'

// data가 어떻게 들어오는지 확인 후 로직의 변경이 필요합니다.

export default {
  components: {
    TabItem,
    AnalysisBR,
    AnalysisSS,
    AnalysisCY,
    AnalysisHS
  },
  setup (props, { emit }) {
    const currentId = ref(1)
    const list = ref([
      { id: 1, label: '보령(정)' },
      { id: 3, label: '청양(가)' },
      { id: 4, label: '홍성(가)' },
      { id: 2, label: '서산(가)' }
    ])
    const current = computed(() => {
      return list.value.find((el) => el.id === currentId.value) || {}
    })

    const currentComponent = computed(() => {
      switch (currentId.value) {
        case 1:
          return 'AnalysisBR'
        case 2:
          return 'AnalysisSS'
        case 3:
          return 'AnalysisCY'
        case 4:
          return 'AnalysisHS'
        default:
          return ''
      }
    })

    return {
      list,
      currentId,
      current,
      currentComponent
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';
</style>
