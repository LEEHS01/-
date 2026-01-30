<template>
  <div class="title_wrap">
    <span class="title">주요 배수지 수위 현황</span>
    <div class="title_line"></div>
    <div style="height: 100%">
      <TabItem v-for="item in list"
      v-bind="item" :key="item.id" :id="item.id" :label="item.label" :currentId="currentId"
      @update:currentId="currentId = $event" />
    </div>
  </div>
  <component :is="currentComponent" @update:isLoading="setLoading" />
</template>

<script>
import { ref, computed } from 'vue'
import TabItem from '@/components/common/TabItem.vue'
import SujiSelect2BR from '@/components/AI/sujiSelect2/SujiSelect_2BR.vue'
import SujiSelect2SS from '@/components/AI/sujiSelect2/SujiSelect_2SS.vue'
import SujiSelect2CY from '@/components/AI/sujiSelect2/SujiSelect_2CY.vue'
import SujiSelect2HS from '@/components/AI/sujiSelect2/SujiSelect_2HS.vue'

export default {
  components: {
    TabItem,
    SujiSelect2BR,
    SujiSelect2SS,
    SujiSelect2CY,
    SujiSelect2HS
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
          return 'SujiSelect2BR'
        case 2:
          return 'SujiSelect2SS'
        case 3:
          return 'SujiSelect2CY'
        case 4:
          return 'SujiSelect2HS'
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
@import '~@/style/layout.scss';
</style>
