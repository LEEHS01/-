<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">송수펌프 가동이력</span>
      <div class="title_line"></div>
      <div style="height: 100%">
        <TabItem
        v-for="item in list"
        v-bind="item" :key="item.id"
        :id="item.id" :label="item.label" :currentId="currentId"
        @update:currentId="currentId = $event"
        />
      </div>
    </div>
    <component :is="currentComponent" @update:isLoading="setLoading" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import TabItem from '@/components/common/TabItem.vue'
import PumpPerformBR from '@/components/AI/pumpPerform/PumpPerformBR.vue'
import PumpPerformSS from '@/components/AI/pumpPerform/PumpPerformSS.vue'
import PumpPerformCY from '@/components/AI/pumpPerform/PumpPerformCY.vue'
import PumpPerformHS from '@/components/AI/pumpPerform/PumpPerformHS.vue'

export default {
  components: {
    TabItem,
    PumpPerformBR,
    PumpPerformSS,
    PumpPerformCY,
    PumpPerformHS
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
          return 'PumpPerformBR'
        case 2:
          return 'PumpPerformSS'
        case 3:
          return 'PumpPerformCY'
        case 4:
          return 'PumpPerformHS'
        default:
          return ''
      }
    })

    const setLoading = (event) => {
      emit('update:isLoading', event)
    }

    return {
      list,
      currentId,
      current,
      currentComponent,
      setLoading
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';

.contents-body {
  width: 100%;
  height: 100%;
  margin-left: 15px;
}
</style>
