<template>
  <!-- 청양 배수지(유입:0, 밸브:0, 수위:2, 유출:0) -->
  <div class="pipe_background" style="height: 8%; margin-top: 10%;">
    <div class="pipe_wrap" style="height: 100%">
      <div class="pipe_left_wrap">
        <div class="pipe_left_line1">
          <div class=" pipe_left_line1-1"></div>
        </div>
        <div class="pipe_left_line3"></div>
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
      </div>
    </div>
  </div>
  <!-- 화성청양 배수지(유입:1, 밸브:2, 수위:2, 유출:1) -->
  <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[1].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[1].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[1].inFlow[0] }}</div>
            <div :class="siteData[1].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[1].valve[1] }}</div>
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
  <!-- 청라 배수지(유입:1, 밸브:2, 수위:2, 유출:1) -->
  <div class="pipe_background" style="height: 8%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
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
  <!-- 청양(가)흡수정 배수지(유입:0, 밸브:0, 수위:2, 유출:0) -->
  <div class="pipe_background" style="height: 8%;">
    <div class="pipe_wrap" style="height: 100%">
      <div class="pipe_left_wrap">
        <div class="pipe_left_line1">
          <div class=" pipe_left_line1-1"></div>
        </div>
        <div class="pipe_left_line3"></div>
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
</template>

<script>
import { reactive } from 'vue'
import { comma, nc } from '@/utils/utils.js'

export default {
  setup () {
    const siteData = reactive([
      {
        // 청양 변수(유입:0, 밸브:0, 수위:2, 유출:0)
        siteName: '청양(배)',
        waterLv: ['', ''],
        tagList: {
          waterLv: ['600-459-LEI-8003', '600-459-LEI-8004']
        }
      },
      {
        // 화성청양 변수(유입:1, 밸브:2, 수위:2, 유출:1)
        siteName: '화성청양(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-359-FRI-8904'],
          valve: ['600-359-POC-8907', '600-359-POC-8908'],
          waterLv: ['600-359-LEI-8908', '600-359-LEI-8909'],
          outFlow: ['600-359-FRI-8905']
        }
      },
      {
        // 청라 변수(유입:1, 밸브:2, 수위:2, 유출:1)
        siteName: '청라(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['900-359-FRI-9035'],
          valve: ['600-457-POI-8744', '600-457-POI-8745'],
          waterLv: ['600-459-LEI-8101', '600-459-LEI-8102'],
          outFlow: ['900-359-FRI-9037']
        }
      },
      {
        // 청양(가)흡수정 변수(유입:0, 밸브:0, 수위:2, 유출:0)
        siteName: '청양(가)흡수정',
        waterLv: ['', ''],
        tagList: {
          waterLv: ['600-459-LEI-8001', '600-459-LEI-8002']
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

    return {
      siteData,
      updateData
    }
  }
}
</script>
