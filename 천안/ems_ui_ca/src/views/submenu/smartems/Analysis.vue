<template>
  <div class="title_wrap">
    <span class="title">송수펌프 제어 분석</span>
    <div class="title_line"></div>
  </div>
  <div class="analysis_container">
    <div class="fL container2">
      <div class="div_title" style="width: 29%; display: inline-block;">운영현황</div>
      <div class="div_title" style="width: 70%; display: inline-block;">주요인자</div>
      <!-- 펌프 시작 -->
      <div class="fL pump_start">
        <div class="pump_start_2">
          <div class="fL" style="height: 100%; width: 100%">
            <div class="fL" style="height: 55px; width: 100%;display: flex;align-items: center;padding: 15px 0 30px">
              <div class="fL pump_1">천안</div>
              <div class="fL pump_1_label">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 20%">관압</div>
                  <span class="detail_value" id="정속관압" style="text-align: right;">{{ dataList.c_pipe_press == null? 0 : fixed(dataList.c_pipe_press)}}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 20%;">유량</div>
                  <span class="detail_value" id="정속유량" style="text-align: right;">{{dataList.c_pipe_flux == null? 0 : fixed(dataList.c_pipe_flux)}}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- Left 중간 부분 opacity_p1 -->
            <!-- :style="{ opacity: p_img3_css, height: 'calc(100% / 2 - 10px)', width: 'calc(100% / 2 - 75px)', 'background-size': '80% !important' }" -->
            <div class="fL leftPumpMiddle">
              <div class="pump_area_h3_ca pump_img fL" :style="{opacity: dataList.opacity[2], 'background-size': '40% !important'}">#1</div>
              <div class="pump_area_h3_ca pump_img fL" :style="{opacity: dataList.opacity[3], 'background-size': '40% !important'}">#2</div>
              <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                <span class="input_design" style="margin-right: 10px;">{{ dataList.FREQ2 == null ? 0 : fixed(dataList.FREQ2) }}</span>Hz
              </div>
              <div class="pump_area_h3_ca pump_img fL" :style="{opacity: dataList.opacity[4], 'background-size': '40% !important'}">#3</div>
              <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                <span class="input_design" style="margin-right: 10px;">{{ dataList.FREQ3 == null ? 0 : fixed(dataList.FREQ3) }}</span>Hz
              </div>
            </div>
            <!-- Left 하단 부분 -->
            <div class="fL leftPumpBottom">
              <div class=" fL" style="height: 55px; width: 100%;display: flex;align-items: center;padding: 10px 0 30px;">
                <div class="fL item">목천</div>
                <div class="fL pump_1_label">
                  <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                    <div class="detail_text" style="width: 20%">관압</div>
                    <span class="detail_value" style="text-align: right;">{{ dataList.m_pipe_press == null? 0 : fixed(dataList.m_pipe_press)}}</span>
                    <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                  </div>
                  <div class="detail_textWrap" style="margin: 0;">
                    <div class="detail_text" style="width: 20%;">유량</div>
                    <span class="detail_value" style="text-align: right;">{{ dataList.m_pipe_flux == null? 0 : fixed(dataList.m_pipe_flux)}}</span>
                    <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                  </div>
                </div>
              </div>
              <!-- 하단 image 부분 -->
              <div class="fL" style="height: calc(100% - 75px); width: calc(100% - 15px);  margin-left: 15px;">
                <div class="pump_area_h2_ca pump_img fL" :style="{opacity: dataList.opacity[0], 'background-size' : '40% !important'}">#1</div>
                <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;margin-bottom: 5px;">
                  <span class="input_design" style="margin-right: 10px;" id="FREQ3">{{ dataList.FREQ0 == null ? 0 : fixed(dataList.FREQ0) }}</span>Hz
                </div>
                <div class="pump_area_h2_ca pump_img fL" :style="{opacity: dataList.opacity[1], 'background-size' : '40% !important'}">#2</div>
                <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                  <span class="input_design" style="margin-right: 10px;" id="FREQ3">{{ dataList.FREQ1 == null ? 0 : fixed(dataList.FREQ1) }}</span>Hz
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 주요 인자 (벨브 시작) -->
      <div class="fL container_middle">
        <img src="@/assets/img/toptitle.png">
        <div style="height: 15%; width: 100%;"></div>
        <analpipeMC :name="'목천(신)'" :ref="box[0]" />
        <div style="height: 10%; width: 100%;"></div>
        <analpipeMC2 :name="'목천(구)'" :ref="box[1]" />
        <div style="height: 10%; width: 100%;"></div>
        <analpipeDL :name="'독립기념관'" style="text-align: center;" :ref="box[2]" />
      </div>
    </div>
    <!-- right 부분 -->
    <div class="analysis_right fL">
      <div class="fL" style="width: 100%; height: calc(36% - 15px); margin-bottom: 15px;">
        <div class="div_title">분기점 현황</div>
        <div class="background-image">
          <div class="detail_textWrap">
            <div class="detail_text">목천(가) 분기 유출 압력</div>
            <span class="detail_value" id="최요관2">{{ dataList.divergeInfo[0] == null ? 0 : fixed(dataList.divergeInfo[0]) }}</span>
          </div>
        </div>
      </div>
      <div class="fL" style="width: 100%; height: calc(60% - 15px); margin-bottom: 15px;">
        <div class="div_title">송수 펌프 제어</div>
        <div class="section">
          <p>정수장 토출 관압</p>
          <div class="image-container">
            <div class="detail_textWrap">
              <div class="detail_text">천안 관압</div>
              <span class="detail_value" id="정속관압1">{{dataList.c_pipe_press == null ? 0 : fixed(dataList.c_pipe_press)}}</span>
              <span class="detail_text" style="margin-left: 10px;font-size:14px">kg/cm2</span>
            </div>
            <div class="detail_textWrap">
              <div class="detail_text">목천 관압</div>
              <span class="detail_value" id="송산관압1">{{dataList.m_pipe_press == null ? 0 : fixed(dataList.m_pipe_press)}}</span>
              <span class="detail_text" style="margin-left: 10px;font-size:14px">kg/cm2</span>
            </div>
          </div>
        </div>
        <div class="section">
          <p>펌프 가동 대수</p>
          <div class="image-container">
            <div class="detail_textWrap">
              <div class="detail_text">천안 펌프</div>
              <span class="detail_value" id="정속가동대수">{{dataList.constant_cnt == null ? 0 : dataList.constant_cnt}}</span>
              <span class="detail_text" style="margin-left: 10px;font-size:14px;">대</span>
            </div>
            <div class="detail_textWrap">
              <div class="detail_text">목천 펌프</div>
              <span class="detail_value" id="변속가동대수" >{{ dataList.shift_cnt == null ? 0 : dataList.shift_cnt}}</span>
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
            <div class="fL" style="height: 55px; width: 100%;display: flex;align-items: center;padding: 15px 0 30px">
              <div class="fL pump_1">천안</div>
              <div class="fL pump_1_label">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 20%">관압</div>
                  <span class="detail_value" id="정속관압" style="text-align: right;">{{ dataList.c_TUBE_PRSR_PRDCT == null ? 0 : fixed(dataList.c_TUBE_PRSR_PRDCT) }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 20%;">유량</div>
                  <span class="detail_value" id="정속유량" style="text-align: right;">{{ dataList.c_PRDCT_MEAN == null ? 0 : fixed(dataList.c_PRDCT_MEAN) }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- Left 중간 부분 opacity_p1 -->
            <!-- :style="{ opacity: p_img3_css, height: 'calc(100% / 2 - 10px)', width: 'calc(100% / 2 - 75px)', 'background-size': '80% !important' }" -->
            <div class="fL leftPumpMiddle">
              <div class="pump_area_h3_ca pump_img fL" :style="{opacity: dataList.c_img0_css, 'background-size': '40% !important'}">#1</div>
              <div class="pump_area_h3_ca pump_img fL" :style="{opacity: dataList.c_img1_css, 'background-size': '40% !important'}">#2</div>
              <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                <span class="input_design" style="margin-right: 10px;">{{  dataList.p_FREQ0 == null ? 0 : fixed(dataList.p_FREQ0) }}</span>Hz
              </div>
              <div class="pump_area_h3_ca pump_img fL" :style="{opacity: dataList.c_img2_css, 'background-size': '40% !important'}">#3</div>
              <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                <span class="input_design" style="margin-right: 10px;">{{ dataList.p_FREQ1 == null ? 0 : fixed(dataList.p_FREQ1)}}</span>Hz
              </div>
            </div>
            <!-- Left 하단 부분 -->
            <div class="fL leftPumpBottom">
              <div class=" fL" style="height: 55px; width: 100%;display: flex;align-items: center;padding: 10px 0 30px;">
                <div class="fL item">목천</div>
                <div class="fL pump_1_label">
                  <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                    <div class="detail_text" style="width: 20%">관압</div>
                    <span class="detail_value" style="text-align: right;">{{ dataList.m_TUBE_PRSR_PRDCT == null ? 0 : fixed(dataList.m_TUBE_PRSR_PRDCT) }}</span>
                    <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                  </div>
                  <div class="detail_textWrap" style="margin: 0;">
                    <div class="detail_text" style="width: 20%;">유량</div>
                    <span class="detail_value" style="text-align: right;">{{ dataList.m_PRDCT_MEAN == null ? 0 : fixed(dataList.m_PRDCT_MEAN) }}</span>
                    <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                  </div>
                </div>
              </div>
              <!-- 하단 image 부분 -->
              <div class="fL" style="height: calc(100% - 75px); width: calc(100% - 15px);  margin-left: 15px;">
                <div class="pump_area_h2_ca pump_img fL" :style="{opacity: dataList.m_img3_css, 'background-size' : '40% !important'}">#1</div>
                <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;margin-bottom: 5px;">
                  <span class="input_design" style="margin-right: 10px;" id="FREQ3">{{  dataList.p_FREQ2 == null ? 0 : fixed(dataList.p_FREQ2) }}</span>Hz
                </div>
                <div class="pump_area_h2_ca pump_img fL" :style="{opacity: dataList.m_img4_css, 'background-size' : '40% !important'}">#2</div>
                <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                  <span class="input_design" style="margin-right: 10px;" id="FREQ3">{{  dataList.p_FREQ3 == null ? 0 : fixed(dataList.p_FREQ3) }}</span>Hz
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 분석 결과 끝 -->
    <!-- <div class="fL" style="width:calc(46% - 20px); height: 30%; margin: 0 0 0 15px;">
      <div class="div_title">에너지 절감 트렌드</div>
      <div class="fL" style="width:100%;height: calc(100% - 40px);">
        <BarChart />
        <bar-chart></bar-chart>
      </div>
    </div> -->
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import log from '@/logger.js'
import analpipe from '@/components/Pipe/analsysPipe.vue'
import analpipeMC from '@/components/Pipe/analsysPipeMC.vue'
import analpipeMC2 from '@/components/Pipe/analsysPipeMC2.vue'
import analpipeDL from '@/components/Pipe/analsysPipeDL.vue'
import BarChart from '@/components/Chart/BarChart.vue'

export default ({
  components: { BarChart, analpipe, analpipeMC, analpipeMC2, analpipeDL},
  setup () {
    const store = useStore()
    const box = reactive([])
    const boxLen = 3
    for (let i = 0; i < boxLen; i++) {
      box[i] = ref(null)
    }
    const executeInterval = ref(null)

    const PumpDataInfo = computed(() => store.getters['mariadb/getPump'])
    const PredictionInfo = computed(() => store.getters['mariadb/getPrediction'])
    const ValveInfo = computed(() => store.getters['mariadb/getSelectValveData'])

    const dataList = reactive({

      c_TUBE_PRSR_PRDCT: 0.00,
      m_TUBE_PRSR_PRDCT: 0.00,
      c_PRDCT_MEAN: 0.00,
      m_PRDCT_MEAN: 0.00,

      // 분석결과 변속 펌프 Hz값
      p_FREQ0: 0.00,
      p_FREQ1: 0.00,
      p_FREQ2: 0.00,
      p_FREQ3: 0.00,

      // 운영현황 변속 펌프 Hz값
      FREQ0: 0.00,
      FREQ1: 0.00,
      FREQ2: 0.00,
      FREQ3: 0.00,
      // 정속 관압
      c_pipe_press: 0.0,
      c_pipe_flux: 0.0,
      m_pipe_press: 0.0,
      m_pipe_flux: 0.0,

      // 정, 변속 가동 대수
      constant_cnt: 0,
      shift_cnt: 0,

      // opacity
      c_img0_css: 0.4,
      c_img1_css: 0.4,
      c_img2_css: 0.4,
      m_img3_css: 0.4,
      m_img4_css: 0.4,

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
      divergeInfo: [0]
    })

    const getData = async () => {
      try {
        getPump()
        getPrediction()
      } catch (err) {
        // console.log('err :', err)
      }
    }

    const getPump = async () => {
      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []
      let data5 = []
      let data7 = []

      await store.dispatch('mariadb/fetchGetPumpData')
      if (PumpDataInfo.value) {
        data1 = PumpDataInfo.value.data1
        data2 = PumpDataInfo.value.data2
        data3 = PumpDataInfo.value.data3
        data4 = PumpDataInfo.value.data4
        data5 = PumpDataInfo.value.data5
        data7 = PumpDataInfo.value.data7

        // 펌프 가동 상태
        for (let i = 0; i < data1.length; i++) {
          if (data1[i].VALUE === '0.0' || data1[i].VALUE === '0.0000') {
            dataList.opacity[i] = 0.25
          } else {
            dataList.opacity[i] = 1
          }
        }

        // 펌프 관련 값
        // NAME으로 넘어오는 data값을 아직 모르는 상황 --> NAME값을 알고나면 변경해줘야 한다.
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].NAME === '천안방면관압') {
            dataList.c_pipe_press = data2[i].VALUE
          } else if (data2[i].NAME === '목천방면관압') {
            dataList.m_pipe_press = data2[i].VALUE
          }
        }

        for (let i = 0; i < data3.length; i++) {
          if (data3[i].NAME === '천안유량') {
            dataList.c_pipe_flux = data3[i].VALUE
          } else if (data3[i].NAME === '목천유량') {
            dataList.m_pipe_flux = data3[i].VALUE
          }
        }

        for (let i = 0; i < data4.length; i++) {
          dataList[`FREQ${i}`] = data4[i].VALUE
        }

        // 펌프 가동 대수
        dataList.constant_cnt = data5[0].정속가동대수
        dataList.shift_cnt = data5[0].변속가동대수
        // 분기점 현황
        for (let i = 0; i < data7.length; i++) {
          dataList.divergeInfo[i] = data7[i].value
        }
      } else {
        return false
      }
    }

    const getPrediction = async () => {
      await store.dispatch('mariadb/fetchPredictionData')
      let data3 = []
      if (PredictionInfo.value) {
        try {
          data3 = PredictionInfo.value.data3
          dataList.c_TUBE_PRSR_PRDCT = data3[0]['천안분석결과예상관압']
          dataList.c_PRDCT_MEAN = data3[0]['천안분석결과예상유량']
          dataList.m_TUBE_PRSR_PRDCT = data3[0]['목천분석결과예상관압']
          dataList.m_PRDCT_MEAN = data3[0]['목천분석결과예상유량']

          // FREQ1~3 까지 데이터 매칭이 필요
          dataList.p_FREQ0 = data3[0]['변속펌프2주파수운영_천안']
          dataList.p_FREQ1 = data3[0]['변속펌프3주파수운영_천안']
          dataList.p_FREQ2 = data3[0]['변속펌프1주파수운영_목천']
          dataList.p_FREQ3 = data3[0]['변속펌프2주파수운영_목천']

          if (data3[0]['정속펌프1가동상태운영_천안'] === '1.0' || data3[0]['정속펌프1가동상태운영_천안'] === '1' || data3[0]['정속펌프1가동상태운영_천안'] === '1.000' || data3[0]['정속펌프1가동상태운영_천안'] === 1) {
            dataList.c_img0_css = 1
          } else {
            dataList.c_img0_css = 0.25
          }

          if (data3[0]['변속펌프2가동상태운영'] === '1.0' || data3[0]['변속펌프2가동상태운영'] === '1' || data3[0]['변속펌프2가동상태운영'] === '1.000' || data3[0]['변속펌프2가동상태운영'] === 1) {
            dataList.c_img1_css = 1
          } else {
            dataList.c_img1_css = 0.25
          }

          if (data3[0]['변속펌프3가동상태운영'] === '1.0' || data3[0]['변속펌프3가동상태운영'] === '1' || data3[0]['변속펌프3가동상태운영'] === '1.000' || data3[0]['변속펌프3가동상태운영'] === 1) {
            dataList.c_img2_css = 1
          } else {
            dataList.c_img2_css = 0.25
          }

          if (data3[0]['변속펌프1가동상태운영_목천'] === '1.0' || data3[0]['변속펌프1가동상태운영_목천'] === '1' || data3[0]['변속펌프1가동상태운영_목천'] === '1.000' || data3[0]['변속펌프1가동상태운영_목천'] === 1) {
            dataList.m_img3_css = 1
          } else {
            dataList.m_img3_css = 0.25
          }

          if (data3[0]['변속펌프2가동상태운영_목천'] === '1.0' || data3[0]['변속펌프2가동상태운영_목천'] === '1' || data3[0]['변속펌프2가동상태운영_목천'] === '1.000' || data3[0]['변속펌프2가동상태운영_목천'] === 1) {
            dataList.m_img4_css = 1
          } else {
            dataList.m_img4_css = 0.25
          }

          dataList.annex = data3[0]['최소요구관압분기점']
          dataList.annex2 = data3[0]['최소요구관압정수장']
        } catch (err) {
          log.logError(err.message);
        }

        getValve()
      } else {
        return false
      }
    }

    const getValve = async () => {
      const Pipebox = []
      const MCbox = []
      const MC2box = []
      const DLbox = []

      try {
        await store.dispatch('mariadb/fetchSelectValveData')
        if (ValveInfo.value.length !== 0 && ValveInfo.value) {
          for (let i = 0; i < ValveInfo.value.length; i++) {
            if (ValveInfo.value[i].TNK_GRP_NM.includes('목천(신)')) {
              MCbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('목천(구)')) {
              MC2box.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('독립')) {
              DLbox.push(ValveInfo.value[i])
            }
          }
          Pipebox.push(MCbox, MC2box, DLbox)
          for (let i = 0; i < boxLen; i++) {
            const component = box[i].value
            if (component && component.updateData) {
              component.updateData(Pipebox[i])
            }
          }
        } else {
          // console.log('No')
        }
      } catch (err) {
        log.logError(err.message);
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
      executeInterval.value = setInterval(executeApis, 10000)
    })

    onUnmounted(() => {
      clearInterval(executeInterval.value)
    })
    return {
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
    height: calc(60% - 50px);
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
    height: 48%;
    width: calc(100% - 15px);
    margin-left: 15px;
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

.pump_area_h2_ca {
  height: calc(100%/ 3);
  width: calc(100%);
}

.pump_area_h3_ca {
  height: calc(100%/ 4);
  width: calc(100%);
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
  height: calc(70% - 40px);
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
