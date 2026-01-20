<template>
  <div class="detail_textWrap" style="text-shadow: 0 0 9px #5cafff;color: #c3eaff; font-size:14px; margin: 3%;">
    <span class="detail_value"  style="text-align: left;font-family: 'KHNPHDRegular';" >유입유량</span>
    <span class="detail_value"  style="text-align: left;font-family: 'KHNPHDRegular'; margin-left: 23%;" >개도율</span>
    <span class="detail_value"  style="text-align: left;font-family: 'KHNPHDRegular'; margin-left: 26%;" >수위</span>
    <span class="detail_value"  style="text-align: left;font-family: 'KHNPHDRegular'; margin-left: 9%;" >유출유량</span>
  </div>
  <!-- 목천(신) 배수지(유입:1, 밸브:1, 수위:1, 유출:0) -->
  <div class="pipe_background" style="height: 8%;">
    <div class="pipe_wrap" style="height: 100%">
      <div class="pipe_left_wrap">
        <div class="pipe_left_line1">
          <div class=" pipe_left_line1-1"></div>
          <div :class="siteData[0].valveOnOff[0]" style="margin-left: 16%; margin-top: 13%;"></div>
          <!-- 밸브1 개도율 -->
          <div class="pipe_left_line1-3" style="margin-top: 13%;">{{ siteData[0].valve[0] }}</div>
        </div>
        <div class="pipe_left_line3">
          <!-- 유입1 유량 -->
          <div class="pipe_left_line3-1">{{ siteData[0].inFlow[0] }}</div>
          <div :class="siteData[0].valveOnOff[1]"></div>
        </div>
      </div>
      <div class="pipe_center"></div>
      <div class="pipe_left_wrap pipe_right_water">
        <!-- 수위1 -->
        <div class="pipe_left_line3" style="width: 100%; margin: 0;">
          <div class="pipe_left_line3-3" style="width: 100%; margin-top: 50%;">{{ siteData[0].waterLv[0] }}</div>
        </div>
      </div>
      <div class="pipe_right_wrap">
        <div class="pipe_right_line1">{{ siteData[0].siteName }}</div>
      </div>
    </div>
  </div>
  <div class="detail_textWrap" style="text-shadow: 0 0 9px #5cafff;color: #c3eaff; font-size:14px; margin: 3%; margin-top: 90%;">
    <span class="detail_value"  style="text-align: left;font-family: 'KHNPHDRegular';" >유입유량</span>
    <span class="detail_value"  style="text-align: left;font-family: 'KHNPHDRegular'; margin-left: 23%;" >개도율</span>
    <span class="detail_value"  style="text-align: left;font-family: 'KHNPHDRegular'; margin-left: 26%;" >수위</span>
    <span class="detail_value"  style="text-align: left;font-family: 'KHNPHDRegular'; margin-left: 9%;" >유출유량</span>
  </div>
  <!-- 목천(구) 배수지(유입:1, 밸브:0, 수위:2, 유출:0) -->
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
      </div>
    </div>
  </div>
  <!-- 독립기념관 배수지(유입:1, 밸브:1, 수위:2, 유출:0) -->
  <div class="pipe_background" style="height: 8%">
    <div class="pipe_wrap" style="height: 100%">
      <div class="pipe_left_wrap">
        <div class="pipe_left_line1">
          <div class=" pipe_left_line1-1"></div>
          <div :class="siteData[2].valveOnOff[0]" style="margin-left: 16%; margin-top: 8%;"></div>
          <!-- 밸브1 개도율 -->
          <div class="pipe_left_line1-3" style="margin-top: 8%;">{{ siteData[2].valve[0] }}</div>
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
        // 목천(신) 변수(유입:1, 밸브:1, 수위:1, 유출:0)
        siteName: '목천(신)(배)',
        inFlow: [''],
        valveOnOff: ['valve_off'],
        valve: [''],
        waterLv: [''],
        tagList: {
          inFlow: ['881-355-FRI-8051'],
          valve: ['881-355-POI-8118'],
          waterLv: ['881-355-LEI-8116']
        }
      },
      {
        // 목천(구) 변수(유입:1, 밸브:0, 수위:2, 유출:0)
        siteName: '목천(구)(배)',
        inFlow: [''],
        waterLv: ['', ''],
        tagList: {
          inFlow: ['881-455-FRI-8083'],
          waterLv: ['881-455-LEI-8090', '881-455-LEI-8091']
        }
      },
      {
        // 독립기념관 변수(유입:1, 밸브:1, 수위:2, 유출:0)
        siteName: '독립기념관(배)',
        inFlow: [''],
        valveOnOff: ['valve_off'],
        valve: [''],
        waterLv: ['', ''],
        tagList: {
          inFlow: ['881-455-FRI-8085'],
          valve: ['881-455-POI-8080'],
          waterLv: ['881-455-LEI-8080', '881-455-LEI-8081']
        }
      }
    ])

    const update = (tagList, data, dataKey, tagKey, resultKey, fixed) => {
      if (tagList) {
        for (let i = 0; i < tagList.length; i++) {
          const tag = tagList[i]
          const result = data.find(item => item[tagKey].includes(tag))
          if (result && nc(result[resultKey])) {
            const value = Number(result[resultKey]).toFixed(fixed)
            dataKey[i] = !isNaN(value) ? value : ''
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
      // console.log('updateData: ', data)
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
