<template>
  <div class="fL" style="width:70%">
    <div class="title_wrap">
      <span class="title" style="width:35%">송수펌프 제어 세부 현황</span>
      <div class="title_line" style="width:235px"></div>
      <div style="height: 100%; width: 59%;">
        <TabItem v-for="item in list"
          v-bind="item" :key="item.id"
          :id="item.id" :label="item.label" :currentId="currentId"
          @update:currentId="currentId = $event" />
      </div>
      <div class="detail_textWrap">
        <div class="detail_text" style="width: 20%;">데이터 수집시간</div>
        <span class="detail_value" style="width: 34%; text-align: left; font-family: 'KHNPHDRegular'">{{ getPumpTime }}</span>
        <!-- <div class="detail_text" style="width: 13%;">제어순서</div>
        <span class="detail_value" style="width: 14%; text-align: left;font-family: 'KHNPHDRegular'">{{ operateNum }}</span>
        <div class="detail_text" style="width: 13%;">운영모드</div>
        <span class="detail_value" style="width: 0%; text-align: left; font-family: 'KHNPHDRegular'">{{ operateMode }}</span> -->
      </div>
    </div>
  </div>
  <div class="title_wrap">
    <div class="detail_textWrap" style="text-shadow: 0 0 9px #5cafff;color: #c3eaff;font-size:14px;margin: 25px;">
      <span class="detail_value" style="text-align: left;font-family: 'KHNPHDRegular';margin-left: 94px;">유입유량</span>
      <span class="detail_value" style="text-align: left;font-family: 'KHNPHDRegular';margin-left: 84px;">개도율</span>
      <span class="detail_value" style="text-align: left;font-family: 'KHNPHDRegular';margin-left: 67px;">수위</span>
      <span class="detail_value" style="text-align: left;font-family: 'KHNPHDRegular'">유출유량</span>
    </div>
  </div>
  <component :is="currentComponent"
    @update:getPumpTime="setPumpTime"
    @update:operateNum="setOperateNum"
    @update:operateMode="setOperateMode" />
</template>

<script>
import { ref, computed } from 'vue'
import TabItem from '@/components/common/TabItem.vue'
import SongsuBR from '@/components/AI/songsu/SongsuBR.vue'
import SongsuSS from '@/components/AI/songsu/SongsuSS.vue'
import SongsuCY from '@/components/AI/songsu/SongsuCY.vue'
import SongsuHS from '@/components/AI/songsu/SongsuHS.vue'

export default {
  components: {
    TabItem,
    SongsuBR,
    SongsuSS,
    SongsuCY,
    SongsuHS
  },
  setup () {
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
      clearOperate()
      switch (currentId.value) {
        case 1:
          return 'SongsuBR'
        case 2:
          return 'SongsuSS'
        case 3:
          return 'SongsuCY'
        case 4:
          return 'SongsuHS'
        default:
          return ''
      }
    })
    const clearOperate = () => {
      getPumpTime.value = ''
      operateNum.value = ''
      operateMode.value = ''
    }

    const setPumpTime = (event) => {
      getPumpTime.value = event
    }
    const setOperateNum = (event) => {
      operateNum.value = event
    }
    const setOperateMode = (event) => {
      operateMode.value = event
    }

    const getPumpTime = ref('')
    const operateNum = ref('')
    const operateMode = ref('')

    return {
      list,
      currentId,
      getPumpTime,
      operateNum,
      operateMode,
      current,
      currentComponent,
      clearOperate,
      setPumpTime,
      setOperateNum,
      setOperateMode
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';

.detail_textWrap {
  width: calc(100% - 30px);
  display: flex;
  align-items: center;
  margin: 25px 15px;
  font-size: 16px;
  font-family: 'KHNPHDRegular';
  color: #fff
}
</style>
