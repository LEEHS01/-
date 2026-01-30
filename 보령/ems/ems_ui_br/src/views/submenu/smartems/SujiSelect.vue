<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">송수펌프 제어 트렌드</span>
      <div class="title_line"></div>
      <div style="height: 100%">
        <TabItem v-for="item in list"
        v-bind="item" :key="item.id" :id="item.id" :label="item.label" :currentId="currentId"
        @update:currentId="currentId = $event" />
      </div>
    </div>
    <component :is="currentComponent" @update:isLoading="setLoading" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import TabItem from '@/components/common/TabItem.vue'
import SujiSelectBR from '@/components/AI/sujiSelect/SujiSelectBR.vue'
import SujiSelectSS from '@/components/AI/sujiSelect/SujiSelectSS.vue'
import SujiSelectCY from '@/components/AI/sujiSelect/SujiSelectCY.vue'
import SujiSelectHS from '@/components/AI/sujiSelect/SujiSelectHS.vue'

export default {
  components: {
    TabItem,
    SujiSelectBR,
    SujiSelectSS,
    SujiSelectCY,
    SujiSelectHS
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
          return 'SujiSelectBR'
        case 2:
          return 'SujiSelectSS'
        case 3:
          return 'SujiSelectCY'
        case 4:
          return 'SujiSelectHS'
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

.contents-body {
  width: 100%;
  height: 100%;
  margin-left: 15px;
  background-image: url('@/assets/img/design_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
