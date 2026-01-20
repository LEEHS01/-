<template>
  <div class="pipe3_background">
    <div class="pipe3_wrap">
      <div class="pipe_wrap">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div id="745-617-VVB-8860" :class="valve1Class1"></div>
            <!-- 밸브1 개도율  -->
            <div v-if="info.rate" class="pipe_left_line1-3" >{{ valve1Val1 }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입 유량  -->
            <!-- <div class="pipe_left_line3-1" ></div> -->
            <div id="745-617-VVB-8862" :class="valve1Class2" style="margin-left: 40%;"></div>
            <!-- 밸브2 개도율 -->
            <div v-if="info.rate" class="pipe_left_line3-3" >{{ valve1Val2 }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 물 수위 -->
          <div class="pipe_left_line3" style="width: 100%; margin: 0;">
            <!--   -->
            <div id="745-617-LEI-8850" class="pipe_left_line3-3" style="width: 100%;">{{ waterLv1Val1 }}</div>
          </div>
          <div class="pipe_left_line3" style="width: 100%; margin: 0;">
            <!--   -->
            <div id="745-617-LEI-8851" class="pipe_left_line3-3" style="width: 100%;">{{ waterLv1Val2 }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1"> {{ this.info.name }} </div>
          <!-- 유출 유량 -->
          <div v-if="info.flow" id="745-617-FRI-8851" class="pipe_right_line2 ">{{ outFlow1 }}</div>
        </div>
      </div>
    </div>
    <!-- 남양 5-2 -->
    <div class="pipe3_wrap">
      <div class="pipe_wrap">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line3" style="margin-top: 3%;">
            <!-- 유입 유량  -->
            <div id="745-617-FRI-8850" class="pipe_left_line3-1">{{ inFlow2 }}</div>
            <div id="745-617-VVB-8864" :class="valve2Class1"></div>
            <!-- 밸브2 개도율  -->
            <div v-if="info.rate" class="pipe_left_line3-3" >{{ valve2Val2 }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 물 수위 -->
          <div class="pipe_left_line3" style="width: 100%; margin: 0;">
            <!--   -->
            <div id="745-617-LEI-8854" class="pipe_left_line3-3" style="width: 100%;">{{ waterLv2Val1 }}</div>
          </div>
          <div class="pipe_left_line3" style="width: 100%; margin: 0;">
            <!--   -->
            <div id="745-617-LEI-8855" class="pipe_left_line3-3" style="width: 100%;">{{ waterLv2Val2 }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1"></div>
          <!-- 유출유량  -->
          <div v-if="info.flow" id="745-617-FRI-8852" class="pipe_right_line2">{{ outFlow2 }}</div>
        </div>
      </div>
    </div>
    <!-- 남양 5-3 -->
    <div class="pipe3_wrap">
      <div class="pipe_wrap">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div id="745-617-VVB-8856" :class="valve3Class1"></div>
            <!-- 밸브1 개도율  -->
            <div v-if="info.rate" class="pipe_left_line1-3">{{ valve3Val1 }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입 유량  -->
            <!-- <div id = "745-617-FRI-8850" class="pipe_left_line3-1" ></div> -->
            <div class="pipe_left_line1-1"></div>
            <div id="745-617-VVB-8858" :class="valve3Class2"></div>
            <!-- 밸브2 개도율  -->
            <div v-if="info.rate" class="pipe_left_line3-3">{{ valve3Val2 }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 물 수위 -->
          <div class="pipe_left_line3" style="width: 100%; margin: 0;">
            <!--   -->
            <div id="745-617-LEI-8852" class="pipe_left_line3-3" style="width: 100%;">{{ waterLv3Val1 }}</div>
          </div>
          <div class="pipe_left_line3" style="width: 100%; margin: 0;">
            <!--   -->
            <div id="745-617-LEI-8853" class="pipe_left_line3-3" style="width: 100%;">{{ waterLv3Val2 }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1"></div>
          <!-- 유출유량  -->
          <div v-if="info.flow" id = "745-617-FRI-8852" class="pipe_right_line2 ">{{ outFlow3 }}</div>
        </div>
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
    const valve1Class1 = ref('')
    const valve1Class2 = ref('')
    const valve2Class1 = ref('')
    const valve2Class2 = ref('')
    const valve3Class1 = ref('')
    const valve3Class2 = ref('')
    const valve1Val1 = ref('')
    const valve1Val2 = ref('')
    const valve2Val1 = ref('')
    const valve2Val2 = ref('')
    const valve3Val1 = ref('')
    const valve3Val2 = ref('')
    const inFlow1 = ref('')
    const inFlow2 = ref('')
    const inFlow3 = ref('')
    const outFlow1 = ref('')
    const outFlow2 = ref('')
    const outFlow3 = ref('')
    const waterLv1Val1 = ref('')
    const waterLv1Val2 = ref('')
    const waterLv2Val1 = ref('')
    const waterLv2Val2 = ref('')
    const waterLv3Val1 = ref('')
    const waterLv3Val2 = ref('')

    const updateData = (data) => {
      // if (data && nc(data.FC_VAL) && nc(data.FO_VAL)) {
      //   if ((data.FC_VAL === '1.0' && data.FO_VAL === '0.0') ||
      //     (data.FC_VAL === '1.0000' && data.FO_VAL === '0.0000)')) {
      //     valve1Class1.value = 'valve_off'
      //     valve1Class2.value = 'valve_off'
      //     valve2Class1.value = 'valve_off'
      //     valve2Class2.value = 'valve_off'
      //     valve3Class1.value = 'valve_off'
      //     valve3Class2.value = 'valve_off'
      //   } else {
      //     valve1Class1.value = 'valve_on'
      //     valve1Class2.value = 'valve_on'
      //     valve2Class1.value = 'valve_on'
      //     valve2Class2.value = 'valve_on'
      //     valve3Class1.value = 'valve_on'
      //     valve3Class2.value = 'valve_on'
      //   }
      // }
      valve1Class1.value = 'valve_off'
      valve1Class2.value = 'valve_off'
      valve2Class1.value = 'valve_off'
      valve2Class2.value = 'valve_off'
      valve3Class1.value = 'valve_off'
      valve3Class2.value = 'valve_off'

      if (data && nc(data.FC_VAL) && nc(data.FO_VAL)) {
        inFlow1.value = comma(Number(data.IN_FLW_VAL).toFixed(0))
        inFlow2.value = comma(Number(data.IN_FLW_VAL).toFixed(0))
        inFlow3.value = comma(Number(data.IN_FLW_VAL).toFixed(0))
      } else {
        inFlow1.value = '0'
        inFlow2.value = '0'
        inFlow3.value = '0'
      }

      if (data && nc(data.OUT_FLW_VAL)) {
        outFlow1.value = comma(Number(data.OUT_FLW_VAL).toFixed(0))
        outFlow2.value = comma(Number(data.OUT_FLW_VAL).toFixed(0))
        outFlow3.value = comma(Number(data.OUT_FLW_VAL).toFixed(0))
      } else {
        outFlow1.value = '0'
        outFlow2.value = '0'
        outFlow3.value = '0'
      }

      if (data && nc(data.LEI_VAL)) {
        waterLv1Val1.value = comma(Number(data.LEI_VAL).toFixed(0))
        waterLv1Val2.value = comma(Number(data.LEI_VAL).toFixed(0))
        waterLv2Val1.value = comma(Number(data.LEI_VAL).toFixed(0))
        waterLv2Val2.value = comma(Number(data.LEI_VAL).toFixed(0))
        waterLv3Val1.value = comma(Number(data.LEI_VAL).toFixed(0))
        waterLv3Val2.value = comma(Number(data.LEI_VAL).toFixed(0))
      } else {
        waterLv1Val1.value = '0'
        waterLv1Val2.value = '0'
        waterLv2Val1.value = '0'
        waterLv2Val2.value = '0'
        waterLv3Val1.value = '0'
        waterLv3Val2.value = '0'
      }

      if (data && nc(data.POI_VAL)) {
        valve1Val1.value = comma(Number(data.POI_VAL).toFixed(0))
        valve1Val2.value = comma(Number(data.POI_VAL).toFixed(0))
        valve2Val1.value = comma(Number(data.POI_VAL).toFixed(0))
        valve2Val2.value = comma(Number(data.POI_VAL).toFixed(0))
        valve3Val1.value = comma(Number(data.POI_VAL).toFixed(0))
        valve3Val2.value = comma(Number(data.POI_VAL).toFixed(0))
      } else {
        valve1Val1.value = '0'
        valve1Val2.value = '0'
        valve2Val1.value = '0'
        valve2Val2.value = '0'
        valve3Val1.value = '0'
        valve3Val2.value = '0'
      }
    }

    return {
      valve1Class1,
      valve1Class2,
      valve2Class1,
      valve2Class2,
      valve3Class1,
      valve3Class2,
      valve1Val1,
      valve1Val2,
      valve2Val1,
      valve2Val2,
      valve3Val1,
      valve3Val2,
      inFlow1,
      inFlow2,
      inFlow3,
      outFlow1,
      outFlow2,
      outFlow3,
      waterLv1Val1,
      waterLv1Val2,
      waterLv2Val1,
      waterLv2Val2,
      waterLv3Val1,
      waterLv3Val2,
      updateData
    }
  }
}
</script>
