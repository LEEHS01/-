<template>
  <div class="analysis_container">
    <div class="fL container2">
      <div class="div_title" style="width: 29%; display: inline-block;">운영현황</div>
      <div class="div_title" style="width: 70%; display: inline-block;">주요인자</div>
      <!-- 펌프 시작 -->
      <div class="fL pump_start">
        <div class="pump_start_2">
          <div class="fL" style="height: 100%; width: 100%">
            <div class="fL" style="height: 55px; width: 100%;display: flex;align-items: center;padding: 15px 0 10px 0;">
              <div class="fL pump_1">보령</div>
              <div class="fL pump_1_label">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 20%">관압</div>
                  <span class="detail_value" id="정속관압" style="text-align: right;">{{ dataList.v_pipe_press == null? 0 : fixed(dataList.v_pipe_press) }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 20%;">유량</div>
                  <span class="detail_value" id="정속유량" style="text-align: right;">{{ dataList.c_pipe_flux == null? 0 : fixed(dataList.c_pipe_flux) }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- Left 중간 부분 opacity_p1 -->
            <!-- :style="{ opacity: b_img3_css, height: 'calc(100% / 2 - 10px)', width: 'calc(100% / 2 - 10px)', 'background-size': '70% !important' }" -->
            <div class="fL leftPumpMiddle">
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[0], 'background-size': '50% !important'}">#1</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[1], 'background-size': '50% !important'}">#2</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[2], 'background-size': '50% !important'}">#3</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[3], 'background-size': '50% !important'}">#4</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[4], 'background-size': '50% !important'}">#5</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[5], 'background-size': '50% !important'}">#6</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 주요 인자 (벨브 시작) -->
      <div class="fL container_middle">
        <div style="display: flex; flex-direction: row;">
          <img src="@/assets/img/toptitle.png" style="margin-right: 30px;">
          <div style="height: 45px; display: flex; flex-direction: row; ">
            <TabItem v-for="item in list"
            v-bind="item" :key="item.id" :id="item.id" :label="item.label" :currentId="currentId"
            @update:currentId="currentId = $event" @click="selectCurrentId(currentId)"/>
          </div>

        </div>
        <div v-show="currentId==0" style="height: 20%;"></div>
        <analpipeSC v-show="currentId==0" :name="'서천'" :ref="box[0]" />
        <div v-show="currentId==1" style="height: 25%;"></div>
        <analpipeNSCH v-show="currentId==1" :name="'신서천화력'" :ref="box[1]"  />
        <analpipeSMBI v-show="currentId==1" :name1="'비인'" :name2="'서면'" :ref="box[2]" />
        <div v-show="currentId==2" style="height: 25%;"></div>
        <analpipeCDDC v-show="currentId==2" :name1="'창동(배)'" :name2="'대천'" :ref="box[3]"  />
        <div v-show="currentId==3" style="height: 25%;"></div>
        <analpipeNBRH v-show="currentId==3" :name="'신보령화력'" :ref="box[4]"  />
        <analpipeCDSJ v-show="currentId==3" :name1="'창동신(배)'" :name2="'성주'" :ref="box[5]" />
      </div>
    </div>
    <!-- right 부분 -->
    <div class="analysis_right fL">
      <div class="fL" style="width: 100%; height: calc(36% - 15px); margin-bottom: 15px;">
        <div class="div_title">분기점 현황</div>
        <div class="background-image">
          <div class="detail_textWrap" style="margin: 17px 15px;">
            <div class="detail_text">홍성(가) 유입유량</div>
            <span class="detail_value" >{{ dataList.divergeInfo[0] == null ? 0 : fixed(dataList.divergeInfo[0]) }}</span>
          </div>
          <div class="detail_textWrap" style="margin: 17px 15px;">
            <div class="detail_text">청양(가) 분기압력</div>
            <span class="detail_value" >{{ dataList.divergeInfo[1] == null ? 0 : fixed(dataList.divergeInfo[1]) }}</span>
          </div>
          <div class="detail_textWrap" style="margin: 17px 15px;">
            <div class="detail_text">서천관말 분기압력</div>
            <span class="detail_value" >{{ dataList.divergeInfo[2] == null ? 0 : fixed(dataList.divergeInfo[2]) }}</span>
          </div>
          <div class="detail_textWrap" style="margin: 17px 15px;">
            <div class="detail_text">송수터널 후단압력</div>
            <span class="detail_value" >{{ dataList.divergeInfo[3] == null ? 0 : fixed(dataList.divergeInfo[3]) }}</span>
          </div>
        </div>

      </div>
      <div class="fL" style="width: 100%; height: calc(60% - 15px); margin-bottom: 15px;">
        <div class="div_title">송수 펌프 제어</div>
        <div class="section">
          <p>정수장 토출 관압</p>
          <div class="image-container">
            <div class="detail_textWrap">
              <div class="detail_text">보령 관압</div>
              <span class="detail_value" id="정속관압1">{{ dataList.v_pipe_press == null ? 0 : fixed(dataList.v_pipe_press) }}</span>
              <span class="detail_text" style="margin-left: 10px;font-size:14px">kg/cm2</span>
            </div>
          </div>
        </div>
        <div class="section">
          <p>펌프 가동 대수</p>
          <div class="image-container">
            <div class="detail_textWrap">
              <div class="detail_text">보령 펌프</div>
              <span class="detail_value" id="정속가동대수">{{ dataList.pump_cnt == null ? 0 : dataList.pump_cnt}}</span>
              <span class="detail_text" style="margin-left: 10px;font-size:14px;">대</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="arrow_container blinking fL"></div>
    <!-- 분석 결과 -->
    <div class="fL" style="width:calc(20% - 20px);height: 100%;margin: 0 0 0 15px;">
      <div class="div_title">분석 결과</div>
      <div class="fL pump_start" style="width: 100%;">
        <div class="pump_start_2">
          <div class="fL" style="height: 100%; width: 100%">
            <div class="fL" style="height: 55px; width: 100%;display: flex;align-items: center;padding: 15px 0 10px 0;">
              <div class="fL pump_1">보령</div>
              <div class="fL pump_1_label">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 20%">관압</div>
                  <span class="detail_value" id="정속관압" style="text-align: right;">{{ dataList.b_TUBE_PRSR_PRDCT == null ? 0 : fixed(dataList.b_TUBE_PRSR_PRDCT) }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 20%;">유량</div>
                  <span class="detail_value" id="정속유량" style="text-align: right;">{{ dataList.b_PRDCT_MEAN == null? 0 : fixed(dataList.b_PRDCT_MEAN) }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- Left 중간 부분 opacity_p1 -->
            <!-- :style="{ opacity: b_img3_css, height: 'calc(100% / 2 - 10px)', width: 'calc(100% / 2 - 10px)', 'background-size': '70% !important' }" -->
            <div class="fL leftPumpMiddle">
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.b_img0_css, 'background-size': '40% !important'}">#1</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.b_img1_css, 'background-size': '40% !important'}">#2</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.b_img2_css, 'background-size': '40% !important'}">#3</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.b_img3_css, 'background-size': '40% !important'}">#4</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.b_img4_css, 'background-size': '40% !important'}">#5</div>
              <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.b_img5_css, 'background-size': '40% !important'}">#6</div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- 분석 결과 끝 -->
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import analpipeSC from '@/components/Pipe/analsysPipeSC.vue'
import analpipeCDSJ from '@/components/Pipe/analsysPipeCDSJ.vue'
import analpipeCDDC from '@/components/Pipe/analsysPipeCDDC.vue'
import analpipeSMBI from '@/components/Pipe/analsysPipeSMBI.vue'
import analpipeNSCH from '@/components/Pipe/analsysPipeNSCH.vue'
import analpipeNBRH from '@/components/Pipe/analsysPipeNBRH.vue'
import BarChart from '@/components/Chart/BarChart.vue'
import TabItem from '@/components/common/TabItem.vue'

export default ({
  components: { BarChart, analpipeSC, analpipeCDSJ, analpipeCDDC, analpipeSMBI, analpipeNSCH, analpipeNBRH, TabItem },
  setup () {
    const store = useStore()
    const currentId = ref(0)
    const list = ref([
      { id: 0, label: '서천#1' },
      { id: 1, label: '서천#2' },
      { id: 2, label: '보령#1' },
      { id: 3, label: '보령#2' }
    ])
    const current = computed(() => {
      return list.value.find((el) => el.id === currentId.value) || {}
    })

    const selectCurrentId = (data) => {
      currentId.value = data
      clearInterval(intervalId)
    }
    let intervalId
    const tabInterval = () => {
      intervalId = setInterval(() => {
        currentId.value = (currentId.value + 1) % 4
      }, 5000)
    }
    const box = reactive([])
    const boxLen = 6
    for (let i = 0; i < boxLen; i++) {
      box[i] = ref(null)
    }
    const executeInterval = ref(null)
    const areaName = '보령_정'

    const PumpDataInfo = computed(() => store.getters['mariadb/getPump'])
    const PredictionInfo = computed(() => store.getters['mariadb/getPrediction'])
    const ValveInfo = computed(() => store.getters['mariadb/getSelectValveData'])

    const dataList = reactive({
      b_TUBE_PRSR_PRDCT: 0.00,
      b_PRDCT_MEAN: 0.00,

      // 보령 관압
      v_pipe_press: 0.0,
      c_pipe_flux: 0.0,

      // 정, 변속 가동 대수
      pump_cnt: 0,
      // opacity
      b_img0_css: 0.4,
      b_img1_css: 0.4,
      b_img2_css: 0.4,
      b_img3_css: 0.4,
      b_img4_css: 0.4,
      b_img5_css: 0.4,
      // opacity - 평택계통 1~5
      opacity: [
        { a: 0.4 },
        { b: 0.4 },
        { c: 0.4 },
        { d: 0.4 },
        { e: 0.4 },
        { f: 0.4 }
      ],
      opacity_1: 0.4,
      opacity_2: 0.4,
      opacity_3: 0.4,
      opacity_4: 0.4,
      opacity_5: 0.4,
      divergeInfo: [0, 0, 0, 0]
    })

    const getData = async () => {
      try {
        getPump()
        getPrediction()
      } catch (err) {
        console.log('err :', err)
      }
    }

    const getPump = async () => {
      let data1 = []
      let data2 = []
      let data3 = []
      // let data4 = []
      let data5 = []
      let data7 = []

      await store.dispatch('mariadb/fetchGetPumpData', areaName)
      if (PumpDataInfo.value) {
        data1 = PumpDataInfo.value.data1
        data2 = PumpDataInfo.value.data2
        data3 = PumpDataInfo.value.data3
        // data4 = PumpDataInfo.value.data4
        data5 = PumpDataInfo.value.data5
        data7 = PumpDataInfo.value.data7

        // 펌프 가동 상태
        for (let i = 0; i < data1.length; i++) {
          if (parseFloat(data1[i].VALUE) === 0) {
            dataList.opacity[i] = 0.25
          } else {
            dataList.opacity[i] = 1
          }
        }

        // 펌프 관련 값
        // NAME으로 넘어오는 data값을 아직 모르는 상황 --> NAME값을 알고나면 변경해줘야 한다.
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].NAME === '보령관압') {
            dataList.v_pipe_press = data2[i].VALUE
          }
        }

        for (let i = 0; i < data3.length; i++) {
          if (data3[i].NAME === '보령(정) 유출유량 순시') {
            dataList.c_pipe_flux = data3[i].VALUE
          }
        }

        // 펌프 가동 대수
        dataList.pump_cnt = data5[0].가동대수

        // 분기점 현황
        for (let i = 0; i < data7.length; i++) {
          dataList.divergeInfo[i] = data7[i].value
        }
      } else {
        return false
      }
    }

    const getPrediction = async () => {
      await store.dispatch('mariadb/fetchPredictionData', areaName)
      let data3 = []
      if (PredictionInfo.value) {
        try {
          data3 = PredictionInfo.value.data3
          dataList.b_TUBE_PRSR_PRDCT = fixed(data3[0]['보령분석결과예상관압'])
          dataList.b_PRDCT_MEAN = data3[0]['보령분석결과예상유량']

          // 데이터 값에 따른 펌프별 데이터 패칭이 다시 필요하다.
          if (parseFloat(data3[0]['정속펌프1가동상태운영_보령']) === 1) {
            dataList.b_img0_css = 1
          } else {
            dataList.b_img0_css = 0.25
          }

          if (parseFloat(data3[0]['정속펌프2가동상태운영_보령']) === 1) {
            dataList.b_img1_css = 1
          } else {
            dataList.b_img1_css = 0.25
          }

          if (parseFloat(data3[0]['정속펌프3가동상태운영_보령']) === 1) {
            dataList.b_img2_css = 1
          } else {
            dataList.b_img2_css = 0.25
          }

          if (parseFloat(data3[0]['정속펌프4가동상태운영_보령']) === 1) {
            dataList.b_img3_css = 1
          } else {
            dataList.b_img3_css = 0.25
          }

          if (parseFloat(data3[0]['정속펌프5가동상태운영_보령']) === 1) {
            dataList.b_img4_css = 1
          } else {
            dataList.b_img4_css = 0.25
          }

          if (parseFloat(data3[0]['정속펌프6가동상태운영_보령']) === 1) {
            dataList.b_img5_css = 1
          } else {
            dataList.b_img5_css = 0.25
          }

          dataList.annex = data3[0]['최소요구관압분기점']
          dataList.annex2 = data3[0]['최소요구관압정수장']
        } catch (err) {
          console.log(err)
        }

        getValve()
      } else {
        return false
      }
    }

    const getValve = async () => {
      const Pipebox = []
      const SCbox = []
      const NSCHbox = []
      const SMBIbox = []
      const CDDCbox = []
      const NBRHbox = []
      const CDSJbox = []
      try {
        await store.dispatch('mariadb/fetchSelectValveData')
        if (ValveInfo.value.length !== 0 && ValveInfo.value) {
          for (let i = 0; i < ValveInfo.value.length; i++) {
            if (ValveInfo.value[i].TNK_GRP_NM.includes('신서천화력')) {
              NSCHbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('서천')) {
              SCbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('서면')) {
              SMBIbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('비인')) {
              SMBIbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('창동(배)')) {
              CDDCbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('대천')) {
              CDDCbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('신보령화력')) {
              NBRHbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('창동신(배)')) {
              CDSJbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('성주')) {
              CDSJbox.push(ValveInfo.value[i])
            }
          }
          Pipebox.push(SCbox, NSCHbox, SMBIbox, CDDCbox, NBRHbox, CDSJbox)
          for (let i = 0; i < boxLen; i++) {
            const component = box[i].value
            if (component && component.updateData) {
              component.updateData(Pipebox[i])
            }
          }
        } else {
          console.log('No')
        }
      } catch (err) {
        console.log(err)
      }
    }

    const executeApis = () => {
      getData()
    }

    const fixed = (val) => {
      return Number(Number(val).toFixed(2))
    }

    onMounted(() => {
      executeApis()
      // 60초마다 데이터 갱신 및 AI 팝업 확인
      executeInterval.value = setInterval(executeApis, 60000)
      tabInterval()
    })

    onUnmounted(() => {
      clearInterval(executeInterval.value)
    })
    return {
      list,
      currentId,
      current,
      selectCurrentId,
      dataList,
      PumpDataInfo,
      getPrediction,
      PredictionInfo,
      getValve,
      boxLen,
      box,
      fixed
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';
@import '~@/style/AI/songsu.css';

/** 분석결과 css */
.result_container {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 20px;
  color: white;

  .result_container2 {
    height: calc(65% - 50px);
    width: 100%;
    margin-bottom: 15px;

    .result_container3 {
      height: 55px;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 5px 0;

      .r_circle_1 {
        width: 25%;
        height: 100%;
        font-size: 16px;
        background: url('@/assets/img/r_circle.png') no-repeat;
        background-position: center;
        background-size: contain;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .r_circle_2 {
    width: 25%;
    height: 100%;
    font-size: 16px;
    background: url('@/assets/img/r_circle.png') no-repeat;
    background-position: center;
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .r_circle_place {
    width: 75%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

/** 분석결과 css 끝 */
.arrow_container {
  width: 6%;
  height: 66%;
  background: url('@/assets/img/ai_arrow_right.png') no-repeat;
  background-position: center;
  background-size: 80% 60%;
  mix-blend-mode: color-dodge;
}

.analysis_container {
  overflow-y: hidden;
  width: calc(100% - 20px);
  height: calc(100% - 74px);
  padding: 10px;
  font-family: 'KHNPHDRegular';
  color: #fff;

  .container2 {
    width: 50%;
    height: 100%;
  }
}

.pump_1 {
  width: 25%;
  height: 100%;
  font-size: 16px;
  background: url('@/assets/img/r_circle.png') no-repeat;
  background-position: center;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pump_1_label {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pump_start {
  width: 30%;
  height: calc(100% - 40px);

  .pump_start_2 {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 20px;
    color: white;
  }

  .leftPumpMiddle {
    // height: calc(100% - 80px);
    height: 85%;
    width: calc(100% - 15px);
    margin: 20px 15px;
  }

  .leftPumpBottom {
    height: 42%;
    width: calc(100% - 2px);
  }

  .item {
    width: 25%;
    height: 100%;
    font-size: 16px;
    background: url('@/assets/img/r_circle.png') no-repeat;
    background-position: center;
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.detail_textWrap {
  width: calc(100% - 11px);
  display: flex;
  align-items: center;
  margin: 25px 15px;
  font-size: 18px;
  font-family: 'KHNPHDRegular';
  color: #fff;
}

.pump_area_h4 {
  height: calc(100%/ 6);
  width: calc(100%);
}

.pump_area_h35 {
  height: calc(100%/ 5);
  width: 100%;
}

.pump_img {
  background: url('@/assets/img/peakcontrol/pump_peakcontrol.png') no-repeat;
  background-size: 49%;
  background-position: center;
  text-align: left;
  text-indent: 5%;
  mix-blend-mode: color-dodge;
}

/** 벨브 시작 css */
.container_middle {
  width: calc(70% - 15px);
  height: 50%;
  margin: 2% 0 0 15px;
  color: #fff;
  font-family: 'KHNPHDRegular';
  font-size: 15px;

  img {
    width: 150px;
    height: 25px;
  }
}

/** 벨프 이미지 */
.analysis_right {
  width: calc(20% - 20px);
  height: 100%;
  margin: 0 0 0 15px;

  .background-image {
    height: calc(100% + 28px);
    width: 100%;
    background: url('@/assets/img/plate_img.png') no-repeat;
    background-size: 100%;
    background-position: center;
  }
}

.image-container {
  width: 100%;
  height: 106%;
  background: url('@/assets/img/plate_img.png') no-repeat;
  background-position: center;
  background-size: 100%;
}

.section {
  height: calc(100% / 2 - 40px);
  width: 100%;
  margin-bottom: 21px;
}
</style>
