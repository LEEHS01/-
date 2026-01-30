<template>
  <div class="right_title_div">
    <div
      class="div_type_btn div_type_btn_active"
      :style="[activeReservoirId === 0 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
      @click="selectReservoir(0)">
      서산
    </div>
    <div
      class="div_type_btn div_type_btn_active"
      :style="[activeReservoirId === 1 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
      @click="selectReservoir(1)">
      예산
    </div>
  </div>
  <!-- 서산 -->
  <div style="height: 95%" v-show="activeReservoirId === 0">
    <!-- 수석(저)(유입:1, 밸브:2, 수위:2, 유출:0) -->
    <div class="pipe_background" style="height: 8%; margin-top: 10%;">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[0].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[0].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[0].inFlow[0] }}</div>
            <div :class="siteData[0].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[0].valve[1] }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[0].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[0].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 40%">{{ siteData[0].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 오학(유입:1, 밸브:0, 수위:4, 유출:2) -->
    <div class="pipe_background" style="height: 15%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1" style="height: 30%">
          </div>
          <div class="pipe_left_line3" style="height: 30%">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1" style="height: 75%;">{{ siteData[1].inFlow[0] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 75%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위4 렌더링 -->
          <div v-for="(waterLv, index) in siteData[1].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[1].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 20%">{{ siteData[1].outFlow[0] }}</div>
          <div class="pipe_right_line2" style="height: 20%; margin-top: 10px;">{{ siteData[1].outFlow[1] }}</div>
        </div>
      </div>
    </div>
    <!-- 수석(고)(유입:1, 밸브:4, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height: 21%;">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap" style="height: 70%; margin-top: 20px;">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[2].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[2].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[2].inFlow[0] }}</div>
            <div :class="siteData[2].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[2].valve[1] }}</div>
          </div>
          <div class="pipe_left_line3">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[2].valveOnOff[2]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[2].valve[2] }}</div>
          </div>
          <!-- 밸브3 ~ 밸브6 개도율 렌더링 -->
          <div v-for="(valve, index) in siteData[2].valve.slice(3, 4)" :key="index" class="pipe_left_line3">
            <div :class="siteData[2].valveOnOff[index + 2]" style="margin-left: 45%"></div>
            <div class="pipe_left_line3-3">{{ valve }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 50%"></div>
        <div class="pipe_left_wrap pipe_right_water" style="height: 33%; margin-top: 57px">
          <!-- 수위1 ~ 수위6 렌더링 -->
          <div v-for="(waterLv, index) in siteData[2].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[2].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 14%">{{ siteData[2].outFlow[0] }}</div>
        </div>
      </div>
    </div>
  </div>
  <!-- 당진 -->
  <div style="height: 95%" v-show="activeReservoirId === 1">
    <!-- 내포신도시(유입:1, 밸브:3, 수위:3, 유출:1) -->
    <div class="pipe_background" style="height: 12%; margin-top: 10%;">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[3].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[3].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[3].inFlow[0] }}</div>
            <div :class="siteData[3].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[3].valve[1] }}</div>
          </div>
          <div class="pipe_left_line3">
            <div :class="siteData[3].valveOnOff[2]" style="margin-left: 45%;"></div>
            <!-- 밸브3 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[3].valve[2] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 75%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위3 렌더링 -->
          <div v-for="(waterLv, index) in siteData[3].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1" style="font-size: 12px;">{{ siteData[3].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 27%">{{ siteData[3].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 홍동(유입:1, 밸브:3, 수위:3, 유출:1) -->
    <div class="pipe_background" style="height: 12%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[4].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[4].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[4].inFlow[0] }}</div>
            <div :class="siteData[4].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[4].valve[1] }}</div>
          </div>
          <div class="pipe_left_line3">
            <div :class="siteData[4].valveOnOff[2]" style="margin-left: 45%;"></div>
            <!-- 밸브3 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[4].valve[2] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 75%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위3 렌더링 -->
          <div v-for="(waterLv, index) in siteData[4].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1" style="font-size: 12px;">{{ siteData[4].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 20%">{{ siteData[4].outFlow[0] }}</div>
          <div class="pipe_right_line2" style="height: 20%; margin-top: 10px;">{{ siteData[4].outFlow[1] }}</div>
        </div>
      </div>
    </div>
    <!-- 남장(유입:0, 밸브:2, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[5].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[5].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <div class="pipe_left_line3-1">{{ siteData[5].inFlow[0] }}</div>
            <div :class="siteData[5].valveOnOff[1]" ></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[5].valve[1] }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[5].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1" style="font-size: 13px;">{{ siteData[5].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 32%">{{ siteData[5].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 삽교(유입:1, 밸브:2, 수위:2, 유출:0) -->
    <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[6].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[6].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[6].inFlow[0] }}</div>
            <div :class="siteData[6].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[6].valve[1] }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[6].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[6].siteName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { comma, nc } from '@/utils/utils.js'

export default {
  setup () {
    const activeReservoirId = ref(0)
    const siteData = reactive([
      {
        // 수석(저) 변수(유입:1, 밸브:2, 수위:2, 유출:1)
        siteName: '수석(저)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-500-FRI-8205'],
          valve: ['600-500-POC-8204', '600-500-POC-8205'],
          waterLv: ['600-500-LEI-8202', '600-500-LEI-8203'],
          outFlow: ['600-500-FRQ-8108']
        }
      },
      {
        // 오학 변수(유입:1, 밸브:2, 수위:4, 유출:1)
        siteName: '오학',
        inFlow: [''],
        waterLv: ['', '', '', ''],
        outFlow: ['', ''],
        tagList: {
          inFlow: ['600-500-FRI-8502'],
          waterLv: ['600-500-LEI-8301', '600-500-LEI-8302', '600-500-LEI-8303', '600-500-LEI-8304'],
          outFlow: ['600-500-FRI-8300', '600-500-FRI-8301']
        }
      },
      {
        // 수석(고) 변수(유입:1, 밸브:4, 수위:2, 유출:1)
        siteName: '수석(고)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', '', ''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-500-FRI-8606'],
          valve: ['600-500-POI-8104', '600-500-POI-8101', '600-500-POI-8103', '600-500-POI-8100'],
          waterLv: ['600-500-LEI-8100', '600-500-LEI-8101'],
          outFlow: ['600-500-FRI-8102']
        }
      },
      {
        // 내포신도시 변수(유입:1, 밸브:3, 수위:3, 유출:1)
        siteName: '내포신도시(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', ''],
        waterLv: ['', '', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-456-FRI-8773'],
          valve: ['600-456-POI-8911', '600-456-POI-8912', '600-456-POI-8913'],
          waterLv: ['600-456-LEI-8773', '600-456-LEI-8774', '600-456-LEI-8775'],
          outFlow: ['600-456-FRI-8774']
        }
      },
      {
        // 홍동 변수(유입:1, 밸브:3, 수위:3, 유출:2)
        siteName: '홍동(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', ''],
        waterLv: ['', '', ''],
        outFlow: ['', ''],
        tagList: {
          inFlow: ['600-456-FRI-8771'],
          valve: ['600-456-POI-8771', '600-456-POI-8772', '600-456-POI-8025'],
          waterLv: ['600-456-LEI-8771', '600-456-LEI-8772', '600-456-LEI-9004'],
          outFlow: ['600-456-FRI-8772', '600-456-FRI-8926']
        }
      },
      {
        // 남장 변수(유입:0, 밸브:2, 수위:2, 유출:1)
        siteName: '남장(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-456-FRI-8662'],
          valve: ['600-456-POI-8661', '600-456-POI-8673'],
          waterLv: ['600-456-LEI-8617', '600-456-LEI-8500'],
          outFlow: ['600-456-FRI-8786']
        }
      },
      {
        // 삽교 변수(유입:1, 밸브:2, 수위:2, 유출:0)
        siteName: '삽교(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        tagList: {
          inFlow: ['600-456-FRI-8673'],
          valve: ['600-456-POI-8671', '600-456-POI-8672'],
          waterLv: ['600-456-LEI-8671', '600-456-LEI-8672']
        }
      }
    ])

    const update = (tagList, data, dataKey, tagKey, resultKey, fixed) => {
      if (tagList) {
        for (let i = 0; i < tagList.length; i++) {
          const tag = tagList[i]
          const result = data.find(item => item[tagKey].includes(tag))
          // if (result && nc(result[resultKey])) 
          {
            const value = Number(result[resultKey]).toFixed(fixed)
            dataKey[i] = !isNaN(value) ? value : '-'
          }
        }
      }
    }

    const updateValveOnOff = (tagList, data, dataKey, tagKey) => {
      if (tagList) {
        const FC_VAL = 'FC_VAL'
        const FO_VAL = 'FO_VAL'
        for (let i = 0; i < tagList.length; i++) {
          const tag = tagList[i]
          const result = data.find(item => item[tagKey].includes(tag))
          if (result && nc(result[FC_VAL]) && nc(result[FO_VAL])) {
            if ((result[FC_VAL] === '1.0' && result[FO_VAL] === '0.0') ||
              (result[FC_VAL] === '1.0000' && result[FO_VAL] === '0.0000)')) {
              dataKey[i] = 'valve_off'
            } else {
              dataKey[i] = 'valve_on'
            }
          }
        }
      }
    }

    const updateData = (data) => {
      console.log('updateData: ', data)
      for (const site of siteData) {
        // 유입유량 업데이트
        update(site.tagList.inFlow, data, site.inFlow, 'IN_FLW_TAG', 'IN_FLW_VAL', 1)
        // 밸브 on/off 업데이트
        updateValveOnOff(site.tagList.valve, data, site.valveOnOff, 'POI_TAG', 0)
        // 밸브 개도율 업데이트
        update(site.tagList.valve, data, site.valve, 'POI_TAG', 'POI_VAL', 0)
        // 수위 업데이트
        update(site.tagList.waterLv, data, site.waterLv, 'LEI_TAG', 'LEI_VAL', 2)
        // 유출유량 업데이트
        update(site.tagList.outFlow, data, site.outFlow, 'OUT_FLW_TAG', 'OUT_FLW_VAL', 1)
      }
    }

    const selectReservoir = (data) => {
      activeReservoirId.value = data
      clearInterval(intervalId)
    }

    let intervalId
    const startTabInterval = () => {
      intervalId = setInterval(() => {
        activeReservoirId.value = (activeReservoirId.value + 1) % 2
      }, 5000)
    }

    onMounted(() => {
      startTabInterval()
    })

    onBeforeUnmount(() => {
      clearInterval(intervalId)
    })

    return {
      activeReservoirId,
      siteData,
      selectReservoir,
      updateData
    }
  }
}
</script>
