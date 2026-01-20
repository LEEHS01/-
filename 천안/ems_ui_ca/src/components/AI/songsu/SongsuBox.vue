<template>
  <div class="pipe_background">
    <div class="pipe_wrap">
      <div class="pipe_left_wrap">
        <div class="pipe_left_line1">
          <div class=" pipe_left_line1-1"></div>
          <div id="745-617-VVB-8975" :class="valveClass1">
          </div>
          <!-- 밸브1 개도율 -->
          <div v-if="info.rate" id="745-617-POI-8920" class="pipe_left_line1-3">{{ valve1 }}</div>
        </div>
        <div class="pipe_left_line3">
          <!-- 유입 유량 -->
          <div id="745-617-FRI-8975" class="pipe_left_line3-1">{{ inFlow }}</div>
          <div id="745-617-VVB-8977" :class="valveClass2"></div>
          <!-- 밸브2 개도율 -->
          <div v-if="info.rate" id="745-617-POI-8921" class="pipe_left_line3-3">{{ valve2 }}</div>
        </div>
      </div>
      <div class="pipe_center"></div>
      <div class="pipe_left_wrap pipe_right_water">
        <!-- 물 수위 -->
        <div class="pipe_left_line3" style="width: 100%; margin: 0;">
          <!--   -->
          <div id="745-617-LEI-8975" class="pipe_left_line3-3" style="width: 100%;">{{ waterLv1 }}</div>
        </div>
        <div class="pipe_left_line3" style="width: 100%; margin: 0;">
          <!--   -->
          <div id="745-617-LEI-8976" class="pipe_left_line3-3" style="width: 100%;">{{ waterLv2 }}</div>
        </div>
      </div>
      <div class="pipe_right_wrap">
        <div class="pipe_right_line1"> {{ info.name }}</div>
        <!-- 유출 유량 -->
        <div v-if="info.flow" id="745-617-FRI-8976" class="pipe_right_line2">{{ outFlow }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { comma, nc } from '@/utils/utils.js'

export default {
  props: ['info'],
  setup () {
    const valveClass1 = ref('')
    const valveClass2 = ref('')
    const valve1 = ref('')
    const valve2 = ref('')
    const inFlow = ref('')
    const outFlow = ref('')
    const waterLv1 = ref('')
    const waterLv2 = ref('')

    const updateData = (data) => {
      if (data && nc(data.FC_VAL) && nc(data.FO_VAL)) {
        if ((data.FC_VAL === '1.0' && data.FO_VAL === '0.0') ||
          (data.FC_VAL === '1.0000' && data.FO_VAL === '0.0000)')) {
          valveClass1.value = 'valve_off'
          valveClass2.value = 'valve_off'
        } else {
          valveClass1.value = 'valve_on'
          valveClass2.value = 'valve_on'
        }
      }

      if (data && nc(data.IN_FLW_VAL)) {
        inFlow.value = comma(Number(data.IN_FLW_VAL).toFixed(0))
      } else {
        inFlow.value = '0'
      }

      if (data && nc(data.OUT_FLW_VAL)) {
        outFlow.value = comma(Number(data.OUT_FLW_VAL).toFixed(0))
      } else {
        outFlow.value = '0'
      }

      if (data && nc(data.LEI_VAL)) {
        waterLv1.value = comma(Number(data.LEI_VAL).toFixed(0))
        waterLv2.value = comma(Number(data.LEI_VAL).toFixed(0))
      } else {
        waterLv1.value = '0'
        waterLv2.value = '0'
      }

      if (data && nc(data.POI_VAL)) {
        valve1.value = comma(Number(data.POI_VAL).toFixed(0))
        valve2.value = comma(Number(data.POI_VAL).toFixed(0))
      } else {
        valve1.value = '0'
        valve2.value = '0'
      }
    }

    return {
      valveClass1,
      valveClass2,
      valve1,
      valve2,
      inFlow,
      outFlow,
      waterLv1,
      waterLv2,
      updateData
    }
  }
}
</script>
