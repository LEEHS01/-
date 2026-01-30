<template>
  <div class="right_title_div">
    <div
      class="div_type_btn div_type_btn_active"
      :style="[activeReservoirId === 0 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
      @click="selectReservoir(0)">
      대산
    </div>
    <div
      class="div_type_btn div_type_btn_active"
      :style="[activeReservoirId === 1 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
      @click="selectReservoir(1)">
      당진
    </div>
    <div
      class="div_type_btn div_type_btn_active"
      :style="[activeReservoirId === 2 ? 'cursor:pointer; opacity: 1;' : 'cursor:pointer; opacity: 0.3;']"
      @click="selectReservoir(2)">
      태안
    </div>
  </div>
  <!-- 당진 -->
  <div style="height: 95%" v-show="activeReservoirId === 0">
    <!-- 성연 배수지(유입:1, 밸브:2, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height: 8%; margin-top: 10%">
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
          <div class="pipe_right_line2" style="height: 38%">{{ siteData[0].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 지곡 배수지(유입:1, 밸브:2, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height:11%">
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
          <div class="pipe_right_line1" style="height: 25%" >{{ siteData[1].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 28%; margin-bottom: 5%" >{{ siteData[1].outFlow[0] }}</div>
          <div class="pipe_right_line2" style="height: 28%">{{ siteData[1].outFlow[1] }}</div>
        </div>
      </div>
    </div>
    <!-- 무장 배수지(유입:1, 밸브:2, 수위:2, 유출:1) -->
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
    <!-- 대산 배수지(유입:1, 밸브:2, 수위:2, 유출:1) -->
    <div class="pipe_background" style="height: 11%">
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
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[3].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1" style="height: 25%">{{ siteData[3].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 28%; margin-bottom: 5%">{{ siteData[3].outFlow[0] }}</div>
          <div class="pipe_right_line2" style="height: 28%">{{ siteData[3].outFlow[1] }}</div>
        </div>
      </div>
    </div>
  </div>
  <div style="height: 95%" v-show="activeReservoirId === 1">
    <!-- 행정광역 배수지(유입:0, 밸브:2, 수위:5, 유출:2) -->
    <div class="pipe_background" style="height: 19%; margin-top: 10%;">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1" style="height: 20%">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[4].valveOnOff[0]" style="margin-left: 16%;"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3" >{{ siteData[4].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3" style="height: 20%">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[4].inFlow[0] }}</div>
            <div :class="siteData[4].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[4].valve[1] }}</div>
          </div>
          <div class="pipe_left_line1" style="height: 20%">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[4].valveOnOff[2]" style="margin-left: 16%;"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[4].valve[2] }}</div>
          </div>
          <div class="pipe_left_line1" style="height: 20%">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[4].valveOnOff[3]" style="margin-left: 16%;"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3" >{{ siteData[4].valve[3] }}</div>
          </div>
          <div class="pipe_left_line1" style="height: 20%">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[4].valveOnOff[4]" style="margin-left: 16%;"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[4].valve[4] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 50%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위5 렌더링 -->
          <div v-for="(waterLv, index) in siteData[4].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[4].siteName }}</div>
          <!-- 유출1,2 유량 -->
          <div class="pipe_right_line2" style="height: 17%; margin-top: -35%;">{{ siteData[4].outFlow[0] }}</div>
          <div class="pipe_right_line2" style="height: 17%; margin-top: 32%;">{{ siteData[4].outFlow[1] }}</div>
        </div>
      </div>
    </div>
    <!-- 석문공단 배수지(유입:2, 밸브:3, 수위:3, 유출:1) -->
    <div class="pipe_background" style="height: 11.5%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[5].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[5].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[5].inFlow[0] }}</div>
            <div :class="siteData[5].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[5].valve[1] }}</div>
          </div>
          <div class="pipe_left_line3">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[5].valveOnOff[2]" style="margin-left: 16%"></div>
            <!-- 밸브3 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[5].valve[2] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 75%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위3 렌더링 -->
          <div v-for="(waterLv, index) in siteData[5].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[5].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 27%">{{ siteData[5].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 당진화력 배수지(유입:1, 밸브:4, 수위:2) -->
    <div class="pipe_background" style="height: 21%;">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap" style="height: 70%; margin-top: 20px;">
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
          <div class="pipe_left_line3">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[6].valveOnOff[2]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[6].valve[2] }}</div>
          </div>
          <!-- 밸브3 ~ 밸브6 개도율 렌더링 -->
          <div v-for="(valve, index) in siteData[6].valve.slice(3, 4)" :key="index" class="pipe_left_line3">
            <div :class="siteData[6].valveOnOff[index + 2]" style="margin-left: 45%"></div>
            <div class="pipe_left_line3-3">{{ valve }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 50%"></div>
        <div class="pipe_left_wrap pipe_right_water" style="height: 33%; margin-top: 57px">
          <!-- 수위1 ~ 수위6 렌더링 -->
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
  <!-- 태안 #1 -->
  <div style="height: 95%" v-show="activeReservoirId === 2">
    <!-- 동문(유입:1, 밸브:0, 수위:3, 유출:1) -->
    <div class="pipe_background" style="height: 11.5%; margin-top: 10%;">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[7].valveOnOff[0]" style="margin-left: 16%"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3">{{ siteData[7].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1">{{ siteData[7].inFlow[0] }}</div>
            <div :class="siteData[7].valveOnOff[1]"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[7].valve[1] }}</div>
          </div>
          <div class="pipe_left_line3">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[7].valveOnOff[2]" style="margin-left: 16%"></div>
            <!-- 밸브3 개도율 -->
            <div class="pipe_left_line3-3">{{ siteData[7].valve[2] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 75%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위3 렌더링 -->
          <div v-for="(waterLv, index) in siteData[7].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[7].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 26%">{{ siteData[7].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 남문(유입:1, 밸브:2, 수위:4, 유출:1) -->
    <div class="pipe_background" style="height: 15%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1" style="height: 30%">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[8].valveOnOff[0]" style="margin-left: 16%; margin-top: 8%; height: 82%;"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3" style="margin-top: 8%; height: 75%;">{{ siteData[8].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3" style="height: 30%">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1" style="height: 75%;">{{ siteData[8].inFlow[0] }}</div>
            <div :class="siteData[8].valveOnOff[1]" style="margin-top: 18%; height: 82%;"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3" style="margin-top: 18%; height: 75%;">{{ siteData[8].valve[1] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 75%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위4 렌더링 -->
          <div v-for="(waterLv, index) in siteData[8].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[8].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 20%">{{ siteData[8].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 안면(유입:1, 밸브:3, 수위:4, 유출:1) -->
    <div class="pipe_background" style="height: 15%">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1" style="height: 30%">
            <div class=" pipe_left_line1-1"></div>
            <div :class="siteData[9].valveOnOff[0]" style="margin-left: 16%; margin-top: 2%; height: 82%;"></div>
            <!-- 밸브1 개도율 -->
            <div class="pipe_left_line1-3" style="margin-top: 2%; height: 75%;">{{ siteData[9].valve[0] }}</div>
          </div>
          <div class="pipe_left_line3" style="height: 30%">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1" style="height: 75%;">{{ siteData[9].inFlow[0] }}</div>
            <div :class="siteData[9].valveOnOff[1]" style="margin-top: 5%; height: 82%;"></div>
            <!-- 밸브2 개도율 -->
            <div class="pipe_left_line3-3" style="margin-top: 5%; height: 75%;">{{ siteData[9].valve[1] }}</div>
          </div>
          <div class="pipe_left_line3" style="height: 30%">
            <div :class="siteData[9].valveOnOff[2]" style="margin-left: 45%; margin-top: 8%; height: 82%;"></div>
            <!-- 밸브3 개도율 -->
            <div class="pipe_left_line3-3" style="margin-top: 8%; height: 75%;">{{ siteData[9].valve[2] }}</div>
          </div>
        </div>
        <div class="pipe_center" style="background-size: 100% 75%"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위4 렌더링 -->
          <div v-for="(waterLv, index) in siteData[9].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[9].siteName }}</div>
          <!-- 유출1 유량 -->
          <div class="pipe_right_line2" style="height: 20%">{{ siteData[9].outFlow[0] }}</div>
        </div>
      </div>
    </div>
    <!-- 태안화력(유입:1, 밸브:0, 수위:2, 유출:0) -->
    <div class="pipe_background" style="height: 8%;">
      <div class="pipe_wrap" style="height: 100%">
        <div class="pipe_left_wrap">
          <div class="pipe_left_line1">
            <div class=" pipe_left_line1-1"></div>
          </div>
          <div class="pipe_left_line3" style="height: 30%;">
            <!-- 유입1 유량 -->
            <div class="pipe_left_line3-1" style="height: 150%;">{{ siteData[10].inFlow[0] }}</div>
          </div>
        </div>
        <div class="pipe_center"></div>
        <div class="pipe_left_wrap pipe_right_water">
          <!-- 수위1 ~ 수위2 렌더링 -->
          <div v-for="(waterLv, index) in siteData[10].waterLv" :key="index" class="pipe_left_line3" style="width: 100%; margin: 0;">
            <div class="pipe_left_line3-3" style="width: 100%;">{{ waterLv }}</div>
          </div>
        </div>
        <div class="pipe_right_wrap">
          <div class="pipe_right_line1">{{ siteData[10].siteName }}</div>
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
      // 대산
      {
        // 성연 변수(유입:1, 밸브:2, 수위:2, 유출:1)
        siteName: '성연(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-500-FRI-9700'],
          valve: ['600-500-POI-9702', '600-500-POI-9701'],
          waterLv: ['600-500-LEI-9701', '600-500-LEI-9700'],
          outFlow: ['600-500-FRI-9701']
        }
      },
      {
        // 지곡 변수(유입:1, 밸브:2, 수위:2, 유출:1)
        siteName: '지곡(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: ['', ''],
        tagList: {
          inFlow: ['600-500-FRI-8500'],
          valve: ['600-500-POI-8500', '600-500-POI-8501'],
          waterLv: ['600-500-LEI-8500', '600-500-LEI-8501'],
          outFlow: ['600-500-FRI-8501', '600-500-FRI-8504']
        }
      },
      {
        // 무장 변수(유입:1, 밸브:2, 수위:2, 유출:1)
        siteName: '무장(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-500-FRI-9500'],
          valve: ['600-500-POI-9500', '600-500-POI-9501'],
          waterLv: ['600-500-LEI-9500', '600-500-LEI-9501'],
          outFlow: ['600-500-FRI-9501']
        }
      },
      {
        // 대산 변수(유입:1, 밸브:2, 수위:2, 유출:1)
        siteName: '대산(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', ''],
        outFlow: ['', ''],
        tagList: {
          inFlow: ['600-457-FRI-8600'],
          valve: ['600-500-POI-8601', '600-500-POI-8600'],
          waterLv: ['600-500-LEI-8600', '600-500-LEI-8601'],
          outFlow: ['600-500-FRI-8601', '600-500-FRI-8701']
        }
      },
      // 당진
      {
        // 행정광역 변수(유입:0, 밸브:2, 수위:5, 유출:2)
        siteName: '행정광역(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', '', '', ''],
        waterLv: ['', '', '', '', ''],
        outFlow: ['', ''],
        tagList: {
          inFlow: ['600-457-FRI-8301'],
          valve: ['600-457-POI-8761', '600-457-POI-8770', '600-457-POI-8771', '600-457-POI-8760', '600-457-POI-8762'],
          waterLv: ['600-457-LEI-8660', '600-457-LEI-8770', '600-457-LEI-8771', '600-457-LEI-8760', '600-457-LEI-8762'],
          outFlow: ['600-457-FRI-8302', '600-457-FRI-8303']
        }
      },
      {
        // 석문공단 변수(유입:2, 밸브:3, 수위:3, 유출:1)
        siteName: '석문공단(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', ''],
        waterLv: ['', '', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-359-FRI-8910'],
          valve: ['600-359-POI-8901', '600-359-POI-8902', '600-359-POI-8903'],
          waterLv: ['600-359-LEI-8902', '600-359-LEI-8903', '600-359-LEI-8904'],
          outFlow: ['600-359-FRQ-8901']
        }
      },
      {
        // 당진화력 변수(유입:1, 밸브:4, 수위:2, 유출:0)
        siteName: '당진화력',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', '', ''],
        waterLv: ['', ''],
        tagList: {
          inFlow: ['600-457-FRI-8721'],
          valve: ['600-457-POI-8712', '600-457-POI-8714', '600-457-POI-8713', '600-457-POI-8715'],
          waterLv: ['600-457-LEI-8721', '600-457-LEI-8722']
        }
      },
      // 태안
      {
        // 동문 변수(유입:1, 밸브:0, 수위:3, 유출:1)
        siteName: '동문(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', ''],
        waterLv: ['', '', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-457-FRI-9382'],
          valve: ['600-457-POI-9380', '600-457-POI-9381', '600-457-POI-9382'],
          waterLv: ['600-457-LEI-9380', '600-457-LEI-9381', '600-457-LEI-9382'],
          outFlow: ['600-457-FRI-9381']
        }
      },
      {
        // 남문 변수(유입:1, 밸브:2, 수위:4, 유출:1)
        siteName: '남문(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off'],
        valve: ['', ''],
        waterLv: ['', '', '', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-457-FRI-8902'],
          valve: ['600-457-POI-8803', '600-457-POI-8804'],
          waterLv: ['600-457-LEI-8914', '600-457-LEI-8917', '600-457-LEI-8916', '600-457-LEI-8915'],
          outFlow: ['600-457-FRI-8901']
        }
      },
      {
        // 안면 변수(유입:1, 밸브:3, 수위:4, 유출:1)
        siteName: '안면(배)',
        inFlow: [''],
        valveOnOff: ['valve_off', 'valve_off', 'valve_off'],
        valve: ['', '', ''],
        waterLv: ['', '', '', ''],
        outFlow: [''],
        tagList: {
          inFlow: ['600-457-FRI-8910'],
          valve: ['600-457-POI-8814', '600-457-POI-8815', '600-457-POI-8816'],
          waterLv: ['600-457-LEI-8920', '600-457-LEI-8921', '600-457-LEI-8922', '600-457-LEI-8935'],
          outFlow: ['600-457-FRI-8911']
        }
      },
      {
        // 태안화력 변수(유입:0, 밸브:0, 수위:2, 유출:0)
        siteName: '태안화력(배)',
        inFlow: [''],
        waterLv: ['', ''],
        tagList: {
          inFlow: ['600-457-FRI-8682'],
          waterLv: ['600-457-LEI-8666', '600-457-LEI-8692']
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
        activeReservoirId.value = (activeReservoirId.value + 1) % 3
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
