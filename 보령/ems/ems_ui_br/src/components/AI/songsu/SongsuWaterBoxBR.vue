<template>
  <div class="right_title_div">
    <div
      class="div_type_btn div_type_btn_active"
      :style="[activeReservoirId === 0 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
      @click="selectReservoir(0)">
      서천
    </div>
    <div
      class="div_type_btn div_type_btn_active"
      :style="[activeReservoirId === 1 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
      @click="selectReservoir(1)">
      보령
    </div>
  </div>
  <div style="height: 95%" v-show="activeReservoirId === 0">
    <!-- 서천 배수지(유입:1, 밸브:6, 수위:6, 유출:1) -->
    <div class="pipe_background" style="height: 21%; margin-top: 10%;">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap" style="height: 70%; margin-top: 20px;">
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
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[0].inFlow[1] }}</div>
            <div :class="siteData[0].valveOnOff[2]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[0].valve[2] }}</div>
          </div>
          <!-- 밸브3 ~ 밸브6 개도율 렌더링 -->
          <div v-for="(valve, index) in siteData[0].valve.slice(3, 4)" :key="index" class="pipe_left_line3">
            <div :class="siteData[0].valveOnOff[index + 2]" style="margin-left: 45%"></div>
            <div class="pipe_left_line3-3">{{ valve }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 50%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위6 렌더링 -->
          <div v-for="(waterLv, index) in siteData[0].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[0].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 14%">{{ siteData[0].outFlow[0] }}</div>
          <div class="pipe_right_line2" style="height: 14%; margin-top: 10px;">{{ siteData[0].outFlow[1] }}</div>
          <div class="pipe_right_line2" style="height: 14%; margin-top: 10px;">{{ siteData[0].outFlow[2] }}</div>
        </div>
      </div>
    </div>
    <!-- 서면 배수지(유입:1, 밸브:0, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[1].inFlow[0] }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[1].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[1].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 38%">{{ siteData[1].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 비인 배수지(유입:1, 밸브:0, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[2].inFlow[0] }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[2].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[2].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 38%">{{ siteData[2].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 신서천화력 배수지(유입:1, 밸브:0, 수위:2) -->
    <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[3].inFlow[0] }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[3].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[3].siteName }}</div>
        </div>
      </div>
    </div>
  </div>
  <div style="height: 95%" v-show="activeReservoirId === 1">
    <!-- 창동신(배) 배수지(유입:1, 밸브:2, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height: 8%; margin-top: 10%;">
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
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[4].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[4].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 38%">{{ siteData[4].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 창동(배) 배수지(유입:2, 밸브:2, 수위:4, 유출:0) -->
    <div class="pipe_background" style="height: 20%">
      <div class="pipe_wrap" style="height: 80%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1" style="height: 25%">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[5].valveOnOff[0]" style="margin-left: 16%; margin-top: 13%;"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3" style="margin-top: 13%">{{ siteData[5].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3" style="height: 25%">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[5].inFlow[0] }}</div>
            <div :class="siteData[5].valveOnOff[1]" style="margin-top: 20%"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3" style="margin-top: 20%">{{ siteData[5].valve[1] }}</div>
          </div>
          <div class="pipe_left_line3" style="height: 25%; margin-top: 6%;">
            <!-- 유입2 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[5].inFlow[1] }}</div>
            <div :class="siteData[5].valveOnOff[2]" style="margin-top: 20%"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3" style="margin-top: 20%">{{ siteData[5].valve[2] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 65%"></div>
        <div class="pipe_left_wrap pipe_right_water" style="margin-top: 20px;">
          <!-- 수위1 ~ 수위4 렌더링 -->
          <div v-for="(waterLv, index) in siteData[5].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[5].siteName }}</div>
        </div>
      </div>
    </div>
    <!-- 성주 배수지(유입:1, 밸브:2, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[6].inFlow[0] }}</div>
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
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 38%">{{ siteData[6].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 대천 배수지(유입:1, 밸브:1, 수위:1, 유출:1) -->
    <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[7].valveOnOff[0]" style="margin-left: 16%; margin-top: 13%;"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3" style="margin-top: 13%;">{{ siteData[7].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[7].inFlow[0] }}</div>
            <div :class="siteData[7].valveOnOff[1]"></div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 -->
          <div class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%; margin-top: 50%;">{{ siteData[7].waterLv[0] }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[7].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 38%">{{ siteData[7].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 신보령화력 배수지(유입:1, 밸브:0, 수위:2, 유출:0) -->
    <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[8].inFlow[0] }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[8].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[8].siteName }}</div>
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
        // 서천 변수(유입:1, 밸브:6, 수위:6, 유출:1)
        siteName: '서천(배)',
        inFlow: ['', ''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', '', '', '', ''],
        waterLv: ['', '', '', '', '', ''],
        outFlow: ['', '', ''],
        tagList: {
          inFlow: ['600-359-FRI-8709', '600-359-FRI-8711'],
          valve: ['600-359-POI-8715', '600-359-POI-8714', '600-359-POI-8718', '600-359-POI-8719'],
          waterLv: ['600-359-LEI-8641', '600-359-LEI-8729', '600-359-LEI-8642', '600-359-LEI-8730', '600-359-LEI-8731', '600-359-LEI-8732'],
          outFlow: ['600-359-FRI-8705', '600-359-FRI-8712','600-359-FRI-8713']
        }
      },
      {
        // 서면 변수(유입:1, 밸브:0, 수위:2, 유출:1)
        siteName: '서면',
        inFlow: [''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-359-FRI-8706'],
          waterLv: ['600-359-LEI-8723', '600-359-LEI-8724'],
          outFlow: ['600-359-FRI-8702']
        }
      },
      {
        // 비인 변수(유입:1, 밸브:0, 수위:2, 유출:1)
        siteName: '비인',
        inFlow: [''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-359-FRI-8704'],
          waterLv: ['600-359-LEI-8725', '600-359-LEI-8726'],
          outFlow: ['600-359-FRI-8703']
        }
      },
      {
        // 비인 변수(유입:1, 밸브:0, 수위:2, 유출:1)
        siteName: '신서천화력수처리실',
        inFlow: [''],
        waterLv: ['', ''],
        tagList: {
          inFlow: ['600-360-FRI-1000'],
          waterLv: ['600-360-LEI-1000', '600-360-LEI-1001']
        }
      },
      {
        // 창동신(배) 변수(유입:1, 밸브:2, 수위:2, 유출:1)
        siteName: '창동신 (배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['900-359-FRI-9044'],
          valve: ['600-359-POI-8632', '600-359-POI-8633'],
          waterLv: ['600-359-LEI-8401', '600-359-LEI-8413'],
          outFlow: ['900-359-FRI-9045']
        }
      },
      {
        // 창동(배) 변수(유입:2, 밸브:3, 수위:3, 유출:1)
        siteName: '창동(배)',
        inFlow: ['', ''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', ''],
        waterLv: ['', '', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['900-359-FRI-9027', '900-359-FRI-9028'],
          valve: ['600-359-POI-8401', '600-359-POI-8411', '600-359-POI-8412'],
          waterLv: ['600-359-LEI-8401', '600-359-LEI-8411', '600-359-LEI-8412'],
          outFlow: ['900-359-FRI-9031']
        }
      },
      {
        // 성주 변수(유입:1, 수위:2, 유출:1)
        siteName: '성주(배)',
        inFlow: [''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['900-359-FRI-9009'],
          waterLv: ['900-359-LEI-9001', '900-359-LEI-9002'],
          outFlow: ['900-359-FRI-9011']
        }
      },
      {
        // 대천 변수(유입:1, 밸브:1, 수위:1, 유출:1)
        siteName: '대천(배)',
        inFlow: [''],
        valveOnOff: ['valve_off'],
        valve: [''],
        waterLv: [''],
        outFlow: [''],
        tagList: {
          inFlow: ['900-359-FRI-9005'],
          valve: ['600-359-POI-8701'],
          waterLv: ['600-359-LEI-8301'],
          outFlow: ['900-359-FRI-9007']
        }
      },
      {
        // 신보령화력 변수(유입:1, 밸브:0, 수위:2, 유출:0)
        siteName: '신보령화력(배)',
        inFlow: [''],
        waterLv: ['', ''],
        tagList: {
          inFlow: ['600-359-FRI-8915'],
          waterLv: ['600-359-LEI-8915', '600-359-LEI-8916']
        }
      }
    ])

    const update = (tagList, data, dataKey, tagKey, resultKey, fixed) => {
      if (tagList) {
        for (let i = 0; i < tagList.length; i++) {
          const tag = tagList[i]
          const result = data.find(item => item[tagKey].includes(tag))
          
          if (result && nc(result[resultKey])) 
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
      updateData,
      selectReservoir
    }
  }
}
</script>
