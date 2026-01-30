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
               <div class="fL pump_1">당진+대산</div>
               <div class="fL pump_1_label">
                 <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                   <div class="detail_text" style="width: 20%">관압</div>
                   <span class="detail_value" id="정속관압" style="text-align: right;">{{ dataList.d_pipe_press == null? 0 : fixed( dataList.d_pipe_press)}}</span>
                   <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                 </div>
                 <div class="detail_textWrap" style="margin: 0;">
                   <div class="detail_text" style="width: 20%;">유량</div>
                   <span class="detail_value" id="정속유량" style="text-align: right;">{{ dataList.d_pipe_flux == null? 0 : fixed(dataList.d_pipe_flux)}}</span>
                   <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                 </div>
               </div>
             </div>
             <!-- Left 중간 부분 opacity_p1 -->
             <!-- :style="{ opacity: d_img3_css, height: 'calc(100% / 2 - 10px)', width: 'calc(100% / 2 - 75px)', 'background-size': '80% !important' }" -->
             <div class="fL leftPumpMiddle">
               <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[0], 'background-size': '35% !important'}">#1</div>
               <div v-show="dataList.opacity[0] === 1" class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                 <span class="input_design" style="margin-right: 10px;">{{ dataList.FREQ0 == null ? 0 : fixed(dataList.FREQ0) }}</span>Hz
               </div>
               <div v-show="dataList.opacity[0] === 0.25" class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                 <span class="input_design" style="margin-right: 10px;">0</span>Hz
               </div>
               <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[1], 'background-size': '35% !important'}">#2</div>
               <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[2], 'background-size': '35% !important'}">#3</div>
               <div v-show="dataList.opacity[2] === 1" class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                 <span class="input_design" style="margin-right: 10px;">{{ dataList.FREQ1 == null ? 0 : fixed(dataList.FREQ1) }}</span>Hz
               </div>
               <div v-show="dataList.opacity[2] === 0.25" class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                 <span class="input_design" style="margin-right: 10px;">0</span>Hz
               </div>
               <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.opacity[3], 'background-size': '35% !important'}">#4</div>
             </div>
             <!-- Left 하단 부분 -->
             <div class="fL leftPumpBottom">
               <div class=" fL" style="height: 55px; width: 100%;display: flex;align-items: center;padding: 5px 0;">
                 <div class="fL item">태안</div>
                 <div class="fL pump_1_label">
                   <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                     <div class="detail_text" style="width: 20%">관압</div>
                     <span class="detail_value" style="text-align: right;">{{dataList.t_pipe_press == null? 0 : fixed(dataList.t_pipe_press)}}</span>
                     <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                   </div>
                   <div class="detail_textWrap" style="margin: 0;">
                     <div class="detail_text" style="width: 20%;">유량</div>
                     <span class="detail_value" style="text-align: right;">{{ dataList.t_pipe_flux == null? 0 : fixed(dataList.t_pipe_flux)}}</span>
                     <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                   </div>
                 </div>
               </div>
               <!-- 하단 image 부분 -->
               <div class="fL" style="height: calc(100% - 75px); width: calc(100% - 15px);  margin-left: 15px;">
                 <div class="pump_area_h35 pump_img fL" :style="{opacity: dataList.opacity[4], 'background-size': '35% !important'}">#1</div>
                 <div v-show="dataList.opacity[4] === 1" class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                   <span class="input_design" style="margin-right: 10px;">{{ dataList.FREQ2 == null ? 0 : fixed(dataList.FREQ2) }}</span>Hz
                 </div>
                 <div v-show="dataList.opacity[4] === 0.25" class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                   <span class="input_design" style="margin-right: 10px;">0</span>Hz
                 </div>
                 <div class="pump_area_h35 pump_img fL" :style="{opacity: dataList.opacity[5], 'background-size': '35% !important'}">#2</div>
                 <div class="pump_area_h35 pump_img fL" :style="{opacity: dataList.opacity[6], 'background-size': '35% !important'}">#3</div>
                 <div class="pump_area_h35 pump_img fL" :style="{opacity: dataList.opacity[7], 'background-size': '35% !important'}">#4</div>
               </div>
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
        <!-- 대산 -->
         <div v-show="currentId==0" style="height: 10%; width: 100%;"></div>
         <analpipe v-show="currentId==0" :name="'성연'" :ref="box[1]" />
         <analpipe v-show="currentId==0" :name="'지곡'" :ref="box[2]" />
         <analpipe v-show="currentId==0" :name="'무장'" :ref="box[3]" />
         <analpipe v-show="currentId==0" :name="'대산'" :ref="box[4]" />
         <!-- 당진 #1 -->
         <analsysPipeDGHR v-show="currentId==1" :name="'당진화력'" :ref="box[6]" />
         <analpipeSMGD v-show="currentId==1" :name="'석문공단'" :ref="box[5]" />
         <!-- 당진 #2 -->
         <analpipeHG v-show="currentId==2" :name="'행정광역'" :ref="box[0]" />
         <!-- 태안 #1 -->
         <!-- <analpipe v-show="currentId==3" :name="'부석'" :ref="box[6]" /> -->
         <div v-show="currentId==3" style="height: 10%; width: 100%;"></div>
         <analpipeDM v-show="currentId==3" :name="'동문'" :ref="box[7]" />
         <div v-show="currentId==3" style="height: 25%; width: 100%;"></div>
         <analpipeNM v-show="currentId==3" :name="'남문'" :ref="box[8]" />
         <!-- 태안 #2 -->
         <div v-show="currentId==4" style="height: 10%; width: 100%;"></div>
         <analsysPipeTAHR v-show="currentId==4" :name="'태안화력'" :ref="box[9]" />
         <!-- <analpipeSO v-show="currentId==4" :name="'신온'" :ref="box[10]" /> -->
         <analpipeAM v-show="currentId==4" :name="'안면'" :ref="box[10]" />
         <!-- 태안 #3 -->
         <!-- <div v-show="currentId==4" style="height: 10%; width: 100%;"></div>
         <analpipe v-show="currentId==4" :name="'정죽'" :ref="box[12]" />
         <analpipeSO v-show="currentId==4" :name="'소원'" :ref="box[13]" />
         <analpipeSO v-show="currentId==4" :name="'황촌'" :ref="box[14]" />
         <analpipeSO v-show="currentId==4" :name="'백사장'" :ref="box[15]" /> -->
       </div>
     </div>
     <!-- right 부분 -->
     <div class="analysis_right fL">
       <div class="fL" style="width: 100%; height: calc(36% - 15px); margin-bottom: 15px;">
         <div class="div_title">분기점 현황</div>
         <div class="background-image">
           <div class="detail_textWrap" v-show="currentId==0 || currentId==1">
             <div class="detail_text" >당진관말(분) 압력</div>
             <span class="detail_value">{{ dataList.divergeInfo[0] == null ? 0 : fixed(dataList.divergeInfo[0]) }}</span>
           </div>
           <div class="detail_textWrap" v-show="currentId==2 || currentId==3 || currentId==4">
             <div class="detail_text" >팔봉(분) 유출유량</div>
             <span class="detail_value">{{ dataList.divergeInfo[1] == null ? 0 : fixed(dataList.divergeInfo[1]) }}</span>
           </div>
           <div class="detail_textWrap" v-show="currentId==2 || currentId==3 || currentId==4">
             <div class="detail_text" >태안관말(분) 유량</div>
             <span class="detail_value">{{ dataList.divergeInfo[2] == null ? 0 : fixed(dataList.divergeInfo[2]) }}</span>
           </div>
           <div class="detail_textWrap" v-show="currentId==2 || currentId==3 || currentId==4">
             <div class="detail_text" >태안관말(분) 압력</div>
             <span class="detail_value">{{ dataList.divergeInfo[3] == null ? 0 : fixed(dataList.divergeInfo[3]) }}</span>
           </div>
         </div>
       </div>
       <div class="fL" style="width: 100%; height: calc(60% - 15px); margin-bottom: 15px;">
         <div class="div_title">송수 펌프 제어</div>
         <div class="section">
           <p>정수장 토출 관압</p>
           <div class="image-container">
             <div class="detail_textWrap">
               <div class="detail_text">당진 관압</div>
               <span class="detail_value" id="정속관압1">{{ dataList.d_pipe_press == null ? 0 : fixed(dataList.d_pipe_press)}}</span>
               <span class="detail_text" style="margin-left: 10px;font-size:14px">kg/cm2</span>
             </div>
             <div class="detail_textWrap">
               <div class="detail_text">태안 관압</div>
               <span class="detail_value" id="송산관압1">{{ dataList.t_pipe_press == null ? 0 : fixed(dataList.t_pipe_press)}}</span>
               <span class="detail_text" style="margin-left: 10px;font-size:14px">kg/cm2</span>
             </div>
           </div>
         </div>
         <div class="section">
           <p>펌프 가동 대수</p>
           <div class="image-container">
             <div class="detail_textWrap">
               <div class="detail_text">당진 펌프</div>
               <span class="detail_value" id="정속가동대수">{{ dataList.d_pump_cnt == null ? 0 : dataList.d_pump_cnt}}</span>
               <span class="detail_text" style="margin-left: 10px;font-size:14px;">대</span>
             </div>
             <div class="detail_textWrap">
               <div class="detail_text">태안 펌프</div>
               <span class="detail_value" id="변속가동대수">{{ dataList.t_pump_cnt == null ? 0 : dataList.t_pump_cnt}}</span>
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
               <div class="fL pump_1">당진+대산</div>
               <div class="fL pump_1_label">
                 <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                   <div class="detail_text" style="width: 20%">관압</div>
                   <span class="detail_value" id="정속관압" style="text-align: right;">{{ dataList.d_TUBE_PRSR_PRDCTT == null ? 0 : fixed(dataList.d_TUBE_PRSR_PRDCTT) }}</span>
                   <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                 </div>
                 <div class="detail_textWrap" style="margin: 0;">
                   <div class="detail_text" style="width: 20%;">유량</div>
                   <span class="detail_value" id="정속유량" style="text-align: right;">{{ dataList.d_PRDCT_MEAN == null? 0 : fixed(dataList.d_PRDCT_MEAN) }}</span>
                   <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                 </div>
               </div>
             </div>
             <!-- Left 중간 부분 opacity_p1 -->
             <!-- :style="{ opacity: d_img3_css, height: 'calc(100% / 2 - 10px)', width: 'calc(100% / 2 - 75px)', 'background-size': '80% !important' }" -->
             <div class="fL leftPumpMiddle">
               <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.d_img0_css, 'background-size': '30% !important'}">#1</div>
               <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                 <span class="input_design" style="margin-right: 10px;">{{ dataList.p_FREQ1 == null ? 0 : fixed(dataList.p_FREQ1) }}</span>Hz
               </div>
               <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.d_img1_css, 'background-size': '30% !important'}">#2</div>
               <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.d_img2_css, 'background-size': '30% !important'}">#3</div>
               <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                 <span class="input_design" style="margin-right: 10px;">{{ dataList.p_FREQ2 == null ? 0 : fixed(dataList.p_FREQ2) }}</span>Hz
               </div>
               <div class="pump_area_h4 pump_img fL" :style="{opacity: dataList.d_img3_css, 'background-size': '30% !important'}">#4</div>
             </div>
             <!-- Left 하단 부분 -->
             <div class="fL leftPumpBottom">
               <div class=" fL" style="height: 55px; width: 100%;display: flex;align-items: center;padding: 5px 0;">
                 <div class="fL item">태안</div>
                 <div class="fL pump_1_label">
                   <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                     <div class="detail_text" style="width: 20%">관압</div>
                     <span class="detail_value" style="text-align: right;">{{ dataList.t_TUBE_PRSR_PRDCT == null ? 0 : fixed(dataList.t_TUBE_PRSR_PRDCT)}}</span>
                     <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                   </div>
                   <div class="detail_textWrap" style="margin: 0;">
                     <div class="detail_text" style="width: 20%;">유량</div>
                     <span class="detail_value" style="text-align: right;">{{ dataList.t_PRDCT_MEAN == null ? 0 : fixed(dataList.t_PRDCT_MEAN)}}</span>
                     <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                   </div>
                 </div>
               </div>
               <!-- 하단 image 부분 -->
               <div class="fL" style="height: calc(100% - 75px); width: calc(100% - 15px);  margin-left: 15px;">
                 <div class="pump_area_h35 pump_img fL" :style="{opacity: dataList.t_img0_css, 'background-size': '30% !important'}">#1</div>
                 <div class="fL" style="background-size: 80%; height: 8%; width: 100%; display: flex; align-items: center; justify-content: center;">
                   <span class="input_design" style="margin-right: 10px;">{{ dataList.p_FREQ3 == null ? 0 : fixed(dataList.p_FREQ3) }}</span>Hz
                 </div>
                 <div class="pump_area_h35 pump_img fL" :style="{opacity: dataList.t_img1_css, 'background-size': '30% !important'}">#2</div>
                 <div class="pump_area_h35 pump_img fL" :style="{opacity: dataList.t_img2_css, 'background-size': '30% !important'}">#3</div>
                 <div class="pump_area_h35 pump_img fL" :style="{opacity: dataList.t_img3_css, 'background-size': '30% !important'}">#4</div>
               </div>
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
import analpipeHG from '@/components/Pipe/analsysPipeHG.vue'
import analpipeSMGD from '@/components/Pipe/analsysPipeSMGD.vue'
import analpipeNM from '@/components/Pipe/analsysPipeNM.vue'
import analsysPipeDGHR from '@/components/Pipe/analsysPipeDGHR.vue'
import analsysPipeTAHR from '@/components/Pipe/analsysPipeTAHR.vue'
import analpipeDM from '@/components/Pipe/analsysPipeDM.vue'
import analpipeAM from '@/components/Pipe/analsysPipeAM.vue'
import analpipe from '@/components/Pipe/analsysPipe.vue'
import TabItem from '@/components/common/TabItem.vue'
import BarChart from '@/components/Chart/BarChart.vue'

export default ({
  components: { BarChart, analpipe, analpipeHG, analpipeSMGD, analsysPipeTAHR, analpipeNM, analpipeDM, analpipeAM, analsysPipeDGHR, TabItem },
  setup () {
    const store = useStore()
    const currentId = ref(0)
    const list = ref([
      { id: 0, label: '대산' },
      { id: 1, label: '당진#1' },
      { id: 2, label: '당진#2' },
      { id: 3, label: '태안#1' },
      { id: 4, label: '태안#2' }
    ])
    const current = computed(() => {
      return list.value.find((el) => el.id === currentId.value) || {}
    })

    let intervalId

    const selectCurrentId = (data) => {
      currentId.value = data
      clearInterval(intervalId)
    }

    const tabInterval = () => {
      intervalId = setInterval(() => {
        currentId.value = (currentId.value + 1) % 5
      }, 5000)
    }

    const box = reactive([])
    const boxLen = 11
    for (let i = 0; i < boxLen; i++) {
      box[i] = ref(null)
    }
    const executeInterval = ref(null)
    const areaName = '서산_가'

    const PumpDataInfo = computed(() => store.getters['mariadb/getPump'])
    const PredictionInfo = computed(() => store.getters['mariadb/getPrediction'])
    const ValveInfo = computed(() => store.getters['mariadb/getSelectValveData'])

    const dataList = reactive({
      d_TUBE_PRSR_PRDCTT: 0.00,
      t_TUBE_PRSR_PRDCT: 0.00,
      d_PRDCT_MEAN: 0.00,
      t_PRDCT_MEAN: 0.00,
      FREQ0: 0.00,
      FREQ1: 0.00,
      FREQ2: 0.00,
      // 정속 관압
      d_pipe_press: 0.0,
      d_pipe_flux: 0.0,
      t_pipe_press: 0.0,
      t_pipe_flux: 0.0,
      // 정, 변속 가동 대수
      d_pump_cnt: 0,
      t_pump_cnt: 0,
      // opacity
      d_img0_css: 0.4,
      d_img1_css: 0.4,
      d_img2_css: 0.4,
      d_img3_css: 0.4,
      t_img0_css: 0.4,
      t_img1_css: 0.4,
      t_img2_css: 0.4,
      t_img3_css: 0.4,
      // 분석 결과 주파수
      p_FREQ1: 0.00,
      p_FREQ2: 0.00,
      p_FREQ3: 0.00,
      // opacity - 평택계통 1~5
      opacity: [
        0.25,
        0.25,
        0.25,
        0.25,
        0.25,
        0.25,
        0.25,
        0.25
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
      let data4 = []
      let data5 = []
      let data7 = []

      await store.dispatch('mariadb/fetchGetPumpData', areaName)
      if (PumpDataInfo.value) {
        data1 = PumpDataInfo.value.data1
        data2 = PumpDataInfo.value.data2
        data3 = PumpDataInfo.value.data3
        data4 = PumpDataInfo.value.data4
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
          if (data2[i].NAME === '당진관압') {
            dataList.d_pipe_press = data2[i].VALUE
          } else if (data2[i].NAME === '태안관압') {
            dataList.t_pipe_press = data2[i].VALUE
          }
        }

        for (let i = 0; i < data3.length; i++) {
          if (data3[i].NAME === '당진유량') {
            dataList.d_pipe_flux = data3[i].VALUE
          } else if (data3[i].NAME === '태안유량') {
            dataList.t_pipe_flux = data3[i].VALUE
          }
        }

        for (let i = 0; i < data4.length; i++) {
          dataList[`FREQ${i}`] = data4[i].VALUE
        }
        // dataList.FREQ1 = data4[0].VALUE
        // dataList.FREQ2 = data4[1].VALUE
        // dataList.FREQ3 = data4[2].VALUE ? data4[2].VALUE : 0.00

        // 펌프 가동 대수
        dataList.d_pump_cnt = data5[0].가동대수
        dataList.t_pump_cnt = data5[1].가동대수

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
          dataList.d_TUBE_PRSR_PRDCTT = data3[0]['당진분석결과예상관압']
          dataList.d_PRDCT_MEAN = data3[0]['당진분석결과예상유량'] // 평택 예측유량
          dataList.t_TUBE_PRSR_PRDCT = data3[0]['태안분석결과예상관압'] // 평택 예측_img3_css관압
          dataList.t_PRDCT_MEAN = data3[0]['태안분석결과예상유량']

          // FREQ1~3 까지 데이터 매칭이 필요
          dataList.p_FREQ1 = data3[0]['펌프1주파수_당진']
          dataList.p_FREQ2 = data3[0]['펌프3주파수_당진']
          dataList.p_FREQ3 = data3[0]['펌프1주파수_태안']

          if (parseFloat(data3[0]['펌프1가동상태운영_당진']) === 1) {
            dataList.d_img0_css = 1
          } else {
            dataList.d_img0_css = 0.25
          }

          if (parseFloat(data3[0]['펌프2가동상태운영_당진']) === 1) {
            dataList.d_img1_css = 1
          } else {
            dataList.d_img1_css = 0.25
          }

          if (parseFloat(data3[0]['펌프3가동상태운영_당진']) === 1) {
            dataList.d_img2_css = 1
          } else {
            dataList.d_img2_css = 0.25
          }

          if (parseFloat(data3[0]['펌프4가동상태운영_당진']) === 1) {
            dataList.d_img3_css = 1
          } else {
            dataList.d_img3_css = 0.25
          }

          if (parseFloat(data3[0]['펌프1가동상태운영_태안']) === 1) {
            dataList.t_img0_css = 1
          } else {
            dataList.t_img0_css = 0.25
          }

          if (parseFloat(data3[0]['펌프2가동상태운영_태안']) === 1) {
            dataList.t_img1_css = 1
          } else {
            dataList.t_img1_css = 0.25
          }

          if (parseFloat(data3[0]['펌프3가동상태운영_태안']) === 1) {
            dataList.t_img2_css = 1
          } else {
            dataList.t_img2_css = 0.25
          }

          if (parseFloat(data3[0]['펌프4가동상태운영_태안']) === 1) {
            dataList.t_img3_css = 1
          } else {
            dataList.t_img3_css = 0.25
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
      const HGbox = []
      const SYbox = []
      const GGbox = []
      const MGbox = []
      const DSbox = []
      const SMGDbox = []
      const DGHRbox = []
      const DMbox = []
      const NMbox = []
      const TAHRbox = []
      const AMbox = []
      try {
        await store.dispatch('mariadb/fetchSelectValveData')
        if (ValveInfo.value.length !== 0 && ValveInfo.value) {
          for (let i = 0; i < ValveInfo.value.length; i++) {
            if (ValveInfo.value[i].TNK_GRP_NM.includes('행정광역')) {
              HGbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('성연')) {
              SYbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('지곡')) {
              GGbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('무장')) {
              MGbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('대산')) {
              DSbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('석문공단')) {
              SMGDbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('당진화력')) {
              DGHRbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('동문')) {
              DMbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('남문')) {
              NMbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('태안화력')) {
              TAHRbox.push(ValveInfo.value[i])
            } else if (ValveInfo.value[i].TNK_GRP_NM.includes('안면')) {
              AMbox.push(ValveInfo.value[i])
            }
          }
          Pipebox.push(HGbox, SYbox, GGbox, MGbox, DSbox, SMGDbox, DGHRbox, DMbox, NMbox, TAHRbox, AMbox)
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
      current,
      currentId,
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

// nowTime_date (idx) {
//   const dateInfo = new Date()
//   if (idx == '10m') {
//     dateInfo.setMinutes(dateInfo.getMinutes() + 10) // +10분
//   } else if (idx == '1h') {
//     dateInfo.setMinutes(dateInfo.getMinutes() + 60) // +10분
//   } else if (idx == '2h') {
//     dateInfo.setMinutes(dateInfo.getMinutes() + 120) // +10분
//   }
//   const hour = this.plusZeroDay(dateInfo.getHours())
//   const min = this.plusZeroDay(dateInfo.getMinutes())
//   const year = dateInfo.getFullYear()
//   const month = this.plusZeroDay(dateInfo.getMonth() + 1)
//   const date = this.plusZeroDay(dateInfo.getDate())
//   return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':00'
// },

// plusZeroDay (day) {
//   if (typeof day === 'number') {
//     day = day + ''
//   }
//   if (day.length == 1) {
//     day = '0' + day
//   }
//   return day
// },

// async selectPeakGoal () {
//   let result
//   try {
//     const response = await axios.post('http://localhost:3000/api/selectPeakGoal')
//     result = response.data[0].value
//   } catch (err) {
//     console.log(err)
//   }
//   return result
// }
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
    height: calc(55% - 50px);
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
    height: 45%;
    width: calc(100% - 15px);
    margin-left: 15px;
  }

  .leftPumpBottom {
    height: 45%;
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
  height: calc(100%/ 5.3);
  width: calc(100%);
}

.pump_area_h35 {
  height: calc(100%/ 4);
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
