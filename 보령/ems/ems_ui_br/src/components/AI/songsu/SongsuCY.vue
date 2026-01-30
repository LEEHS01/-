<template>
  <div class="fL songsuLeftBox">
    <div style="height: calc(95%); width: 100%;">
      <!-- AI 펌프 영역 시작 -->
      <div class="fL" style="width: 30%;height: 100%;">
        <div class="ai_pump_start">
          <div class="ai_pump_start2 fL">
            <div class="ai_pump_start2_2 fL">
              <div class="top_name img_circle fL">청양</div>
              <div class=" fL" style="width: 70%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">예상 전력</div>
                  <span class="detail_value" style="text-align: right;">{{ pwrPrdctA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kW</span>
                </div>
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">예상 관압</div>
                  <span class="detail_value" style="text-align: right;">{{ tubePrsrPrdctA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 30%;">예상 유량</div>
                  <span class="detail_value" style="text-align: right;">{{ flowPrdctA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- 장치 이미지 구역 시작-->
            <div class="fL" style="height: 50%; width: calc(100% - 15px ); margin-left: 15px; margin-top: 30%;">
              <div class="pump_area_h3_top pump_img fL" :style="{ backgroundSize: '40%', opacity: getOpacityValue(pumpStatusA[0]) }">#1</div>
              <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ freqA1 }}</span>Hz
              </div>
              <div class="pump_area_h3_top pump_img fL" :style="{ backgroundSize: '40%', opacity: getOpacityValue(pumpStatusA[1]) }">#2</div>
              <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ freqA2 }}</span>Hz
              </div>
              <div class="pump_area_h3_top pump_img fL" :style="{ backgroundSize: '40%', opacity: getOpacityValue(pumpStatusA[2]) }">#3</div>
              <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ freqA3 }}</span>Hz
              </div>
            </div>
            <!-- 장치 이미지 구역 끝-->
          </div>
        </div>
      </div>
      <!-- AI 펌프 영역 끝 -->
      <div class="ai_pump_arrow_start fL">
        <div style="width: 100%; height:60%;margin-left:-52px;margin-top:250px">
          <div class="arrow_img blinking fL"></div>
          <div class="arrow_info">
            <span class="ai_text">AI 운영</span>
            <div @click="handleToggleClick" class="toggleBG_BIG" style=" margin-top: 10px;">
              <button ref="toggleButton" class="toggleFG_BIG" style="left: 0;">{{ toggleState }}</button>
            </div>
            <div ref="autoBanArea" style="opacity: 0.2; margin-top: 30px;">
              <input type="radio" ref="aiAuto" name="fav_language" value="ai_auto" @change="handleAutoChange">
              <label for="ai_auto" class="detail_text" style="font-size: 18px;">AI</label>
              <br>
              <input type="radio" ref="aiBanAuto" name="fav_language" value="ai_banauto" @change="handleBanAutoChange">
              <label for="ai_banauto" class="detail_text" style="font-size: 18px;">AI 추천</label>
              <br>
            </div>
          </div>
        </div>
      </div>
      <!-- 펌프영역 시작 -->
      <div class="fL" style="width: 30%;height: 100%;">
        <div class="" style="width: 100%; height:100%; text-align: center; font-size: 20px; color: white;">
          <div class="pump_area fL">
            <div class="pump_area2 fL">
              <div class="top_name img_circle fL">청양</div>
              <div class=" fL" style="width: 70%;height: 100%; display: flex;flex-direction: column;justify-content: center;">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">전력</div>
                  <span class="detail_value" style="text-align: right;">{{ aiPwrA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kW</span>
                </div>
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">관압</div>
                  <span class="detail_value" style="text-align: right;">{{ aiTubePrsrA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 30%;">유량</div>
                  <span class="detail_value" style="text-align: right;">{{ aiFlowA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- 상자 중간 부분 시작 -->
            <div class="middle fL">
              <div class="pump_area_h3_top pump_img fL" :style="{ backgroundSize: '40%', opacity: getOpacityValue(nowPumpStatusA[0]) }">#1</div>
              <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span v-show="getOpacityValue(nowPumpStatusA[0]) === 1" class="input_design" style="margin-right: 10px; height: 50%;">{{ aiFreqA1 }}</span>
                <span v-show="getOpacityValue(nowPumpStatusA[0]) === 0.25" class="input_design" style="margin-right: 10px; height: 50%;">0.00</span>Hz
              </div>
              <div class="pump_area_h3_top pump_img fL" :style="{ backgroundSize: '40%', opacity: getOpacityValue(nowPumpStatusA[1]) }">#2</div>
              <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span v-show="getOpacityValue(nowPumpStatusA[1]) === 1" class="input_design" style="margin-right: 10px; height: 50%;">{{ aiFreqA2 }}</span>
                <span v-show="getOpacityValue(nowPumpStatusA[1]) === 0.25" class="input_design" style="margin-right: 10px; height: 50%;">0.00</span>Hz
              </div>
              <div class="pump_area_h3_top pump_img fL" :style="{ backgroundSize: '40%', opacity: getOpacityValue(nowPumpStatusA[2]) }">#3</div>
              <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span v-show="getOpacityValue(nowPumpStatusA[2]) === 1" class="input_design" style="margin-right: 10px; height: 50%;">{{ aiFreqA3 }}</span>
                <span v-show="getOpacityValue(nowPumpStatusA[2]) === 0.25" class="input_design" style="margin-right: 10px; height: 50%;">0.00</span>Hz
              </div>
            </div>
            <!-- 상자 중간 부분 끝 -->
          </div>
        </div>
      </div>
      <!-- 펌프영역 끝-->
      <!-- 파이프 라인 시작 -->
      <div class="fL" style="width: 30%; height: 77%; margin-top: 9%;">
        <div class="fL" style="width: 25%; height: 100%; margin-left: -3%;">
          <div class="bottom_pipe_line2 fL">
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
          </div>
        </div>
        <div class="fL" style="width:60%; height: 97%;">
          <div class="pipe_right_box fL">
            <div style="width: 100%; height: 33%;"></div>
            <div style="width: 100%; height: 100px;">
              <div class="sub_content_middle_value fL sub_content_font" style="font-size: 18px">청양 분기점 현황</div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 14px; text-align: center;">청양(가) 유입유량</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[0] }}</div>
                <span class="sub_content_font" style="width: 24%;">m³/h</span>
              </div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 12px; text-align: center;">청양(가) 유입분기 압력</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[1] }}</div>
                <span class="sub_content_font" style="width: 21%;">kg/cm2</span>
              </div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 12px; text-align: center;">청양(가) 유출분기 압력</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[2] }}</div>
                <span class="sub_content_font" style="width: 21%;">kg/cm2</span>
              </div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 12px; text-align: center;">청양(배) 유량분기 압력</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[3] }}</div>
                <span class="sub_content_font" style="width: 21%;">kg/cm2</span>
              </div>
            </div>
          </div>
        </div>
        <div class="fL" style="width: 7.5%;height: 100%;">
          <div class="pipe_right_box_x fL">
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
          </div>
        </div>
      </div>
      <!-- 파이프 라인 끝 -->
    </div>
  </div>
  <!-- 펌프 영역 끝 -->
  <div class="fL songsuRightBox" style="height: 94%">
    <!-- left 물통 라인 -->
    <div class="pipe_big_background">
      <div class="pipe_big_gauge" :style="{ height: gaugeHeight }">
        <!-- 여기 퍼센트 바꾸기 -->
        <!-- <div style="color: white; margin-top: -35px; text-align: center;font-family: 'LABDigital';">{{ waterPercent }}</div> -->
      </div>
    </div>
    <!-- right 라인 -->
    <div class="pipes_wrap">
      <SongsuWaterBox ref="waterBox"/>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { nc } from '@/utils/utils.js'
import SongsuWaterBox from '@/components/AI/songsu/SongsuWaterBoxCY.vue'

export default {
  components: { SongsuWaterBox },
  setup (props, { emit }) {
    const store = useStore()
    const getPopup = computed(() => store.getters['songsu/getGetPopup'])
    const insertPopup = computed(() => store.getters['songsu/getInsertPopup'])
    // const insertPopup2 = computed(() => store.getters['songsu/getInsertPopup2'])
    const insertPopup3 = computed(() => store.getters['songsu/getInsertPopup3'])
    const updateCTR = computed(() => store.getters['songsu/getUpdateCTR_PRF_PMPMST_INF'])
    // const ptrCtrInf = computed(() => store.getters['songsu/getPTR_CTR_INF'])
    const songsuSelect = computed(() => store.getters['songsu/getSongsuSelect'])
    const pumpSelect = computed(() => store.getters['songsu/getPumpSelect'])
    const interpuppt = computed(() => store.getters['songsu/getInterpuppt'])
    const insertAIonOff = computed(() => store.getters['songsu/getInsertAIonOff'])

    const interpupptData = reactive([])
    const getPumpTime = ref('')
    const operateNum = ref('')
    const operateMode = ref('')
    const pwrPrdctA = ref('0')
    const tubePrsrPrdctA = ref('0')
    const flowPrdctA = ref('0')
    const freqA1 = ref('0.00')
    const freqA2 = ref('0.00')
    const freqA3 = ref('0.00')
    const aiPwrA = ref('0')
    const aiTubePrsrA = ref('0')
    const aiFlowA = ref('0')
    const aiFreqA1 = ref('0.00')
    const aiFreqA2 = ref('0.00')
    const aiFreqA3 = ref('0.00')
    const divergeInfo = reactive([0.00, 0.00, 0.00, 0.00])
    const toggleState = ref('OFF')
    const autoBanArea = ref(null)
    const toggleButton = ref(null)
    const aiAuto = ref(null)
    const aiBanAuto = ref(null)
    const nowPumpStatusA = reactive(['off', 'off', 'off'])
    const pumpStatusA = reactive(['off', 'off', 'off'])
    const gaugeHeight = ref('0%')
    const waterPercent = ref('0')
    const showModal = ref(false)
    const timeCount = ref(null)
    const showModal2 = ref(false)
    const popupMsg = ref('')
    const PumpIdx = ref('')
    const executeInterval = ref(null)
    const waterBox = ref(null)

    const getOpacityValue = (status) => {
      return status === 'on' ? 1 : 0.25
    }

    const handleToggleClick = async () => {
      // 청양 AI 버튼
      try {
        // if (!checkInterpupptData()) {
        //   return
        // }

        let confirmMessage = ''
        if (toggleState.value === 'OFF') {
          confirmMessage = '청양(가) AI 운영을 AI추천 모드로 하시겠습니까?'
          if (confirm(confirmMessage)) {
            // insertAIonOff DB 연동
            const actions = [
              { search: '606-459-EMS-1001', search2: '0' },
              { search: '606-459-EMS-1002', search2: '0' },
              { search: '606-459-EMS-1003', search2: '1' }
            ]
            const result = await actionInsertAIonOff(actions)
            if (result) {
              toggleState.value = 'AI'
              toggleButton.value.style.background = '#b4dffa'
              toggleButton.value.style.left = '40px'
              toggleState.value = 'AI'
              autoBanArea.value.style.opacity = 1
              aiAuto.value.disabled = false
              aiBanAuto.value.disabled = false
              aiAuto.value.checked = false
              aiAuto.value.nextElementSibling.style.opacity = '0.3'
              aiBanAuto.value.checked = true
              aiBanAuto.value.nextElementSibling.style.opacity = '1'
              toggleActionStart(toggleButton.value, 'TO_RIGHT')
            } else {
              alert('1분 후에 다시 시도해주세요.')
            }
          }
        } else {
          confirmMessage = '청양(가) AI 운영을 off 하시겠습니까?'
          if (confirm(confirmMessage)) {
            // insertAIonOff DB 연동
            const actions = [
              { search: '606-459-EMS-1001', search2: '1' },
              { search: '606-459-EMS-1002', search2: '0' },
              { search: '606-459-EMS-1003', search2: '0' }
            ]
            const result = await actionInsertAIonOff(actions)
            if (result) {
              // // AI 운영 off 후 insertPopup3 DB 연동
              // await store.dispatch('songsu/fetchInsertPopup3')
              // const jsonData = JSON.parse(JSON.stringify(insertPopup3.value))
              // if (jsonData.message !== 'ok') {
              //   // 실패했을 경우에 대한 처리는 기존 소스에 없음
              //   console.log('action: fetchInsertPopup3', ' error message: ', jsonData.message)
              // }
              toggleState.value = 'OFF'
              toggleButton.value.style.left = '0px'
              toggleButton.value.style.background = '#b4dffa4d'
              toggleState.value = 'OFF'
              autoBanArea.value.style.opacity = 0.2
              aiAuto.value.disabled = true
              aiBanAuto.value.disabled = true
              aiAuto.value.checked = false
              aiAuto.value.nextElementSibling.style.opacity = '0.3'
              aiBanAuto.value.checked = false
              aiBanAuto.value.nextElementSibling.style.opacity = '0.3'
              toggleActionStart(toggleButton.value, 'TO_LEFT')
            } else {
              alert('1분 후에 다시 시도해주세요.')
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const checkInterpupptData = () => {
      // 토출밸브 체크
      console.log('checkInterpupptData: ', interpupptData.value[0].a, interpupptData.value[0].b,
        interpupptData.value[0].c, interpupptData.value[0].d)
      if (
        (interpupptData.value[0].a === '0' ||
          interpupptData.value[0].b === '0' ||
          interpupptData.value[0].c === '0' ||
          interpupptData.value[0].d === '0') ||
        (interpupptData.value[0].a === '0.0000' ||
          interpupptData.value[0].b === '0.0000' ||
          interpupptData.value[0].c === '0.0000' ||
          interpupptData.value[0].d === '0.0000')
      ) {
        alert('토출밸브로 인해 제어가 불가능합니다.')
        return false
      }
      return true
    }

    const toggleActionStart = (toggleBtn, LR) => {
      let left = parseInt(toggleBtn.style.left)
      const intervalID = setInterval(() => {
        left += LR === 'TO_RIGHT' ? 5 : -5
        if (left >= 0 && left <= 40) {
          toggleBtn.style.left = left + 'px'
        }
      }, 10)
      setTimeout(() => {
        clearInterval(intervalID)
      }, 400)
    }

    const handleAutoChange = async () => {
      // AI 자동 선택
      try {
        if (confirm('청양(가) AI 운영을 AI 모드로 하시겠습니까?')) {
          // insertAIonOff DB 연동
          const actions = [
            { search: '606-459-EMS-1001', search2: '0' },  
            { search: '606-459-EMS-1002', search2: '1' },
            { search: '606-459-EMS-1003', search2: '0' }
          ]
          const result = await actionInsertAIonOff(actions)
          if (result) {
            aiAuto.value.nextElementSibling.style.opacity = '1'
            aiBanAuto.value.nextElementSibling.style.opacity = '0.3'
          } else {
            alert('1분 후에 다시 시도해주세요.')
            // aiAuto.value.checked = false
            // aiBanAuto.value.checked = true 
            // aiAuto.value.nextElementSibling.style.opacity = '0.3'
            // aiBanAuto.value.nextElementSibling.style.opacity = '1'
          }
        } else {
          aiBanAuto.value.checked = true
          aiBanAuto.value.nextElementSibling.style.opacity = '1'
          aiAuto.value.checked = false
          aiAuto.value.nextElementSibling.style.opacity = '0.3'
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleBanAutoChange = async () => {
      // AI 반자동 선택
      try {
        if (confirm('청양(가) AI 운영을 AI추천 모드로 하시겠습니까?')) {
          // insertAIonOff DB 연동
          const actions = [
            { search: '606-459-EMS-1001', search2: '0' },
            { search: '606-459-EMS-1002', search2: '0' },
            { search: '606-459-EMS-1003', search2: '1' }
          ]
          const result = await actionInsertAIonOff(actions)
          if (result) {
            aiBanAuto.value.nextElementSibling.style.opacity = '1'
            aiAuto.value.nextElementSibling.style.opacity = '0.3'
          } else {
            alert('1분 후에 다시 시도해주세요.')
            // aiAuto.value.checked = true
            // aiBanAuto.value.checked = false
            // aiAuto.value.nextElementSibling.style.opacity = '1'
            // aiBanAuto.value.nextElementSibling.style.opacity = '0.3'
          }
        } else {
          aiAuto.value.checked = true
          aiAuto.value.nextElementSibling.style.opacity = '1'
          aiBanAuto.value.checked = false
          aiBanAuto.value.nextElementSibling.style.opacity = '0.3'
        }
      } catch (err) {
        console.log(err)
      }
    }

    const actionInsertAIonOff = async (actions) => {
      try {
        for (const action of actions) {
          await store.dispatch('songsu/fetchInsertAIonOff', action)
          if (insertAIonOff.value) {
            const jsonData = JSON.parse(JSON.stringify(insertAIonOff.value))
            if (jsonData.message !== 'ok') {
              console.log('action: ', action, ' error message: ', jsonData.message)
              return false
            }
          } else {
            return false
          }
        }
      } catch (err) {
        console.log(err)
      }

      return true
    }

    const getData = async () => {
      try {
        // 데이터 수집시간 가져오기
        await store.dispatch('songsu/fetchInterpuppt')
        if (interpuppt.value) {
          const arr = JSON.parse(JSON.stringify(interpuppt.value))
          if (arr.interpuppt) {
            interpupptData.value = arr.interpuppt
          } else {
            console.log('interpuppt is empty')
          }
          if (arr.getPumpTime && arr.getPumpTime.length > 0) {
            const minT = Math.min(...arr.getPumpTime.map((o) => o.t))
            let idx = 0
            for (let i = 0; i < arr.getPumpTime.length; i++) {
              if (arr.getPumpTime[i].t === minT) {
                idx = i
                break
              }
            }
            getPumpTime.value = arr.getPumpTime[idx].ts
            emit('update:getPumpTime', getPumpTime.value)
          } else {
            console.log('getPumpTime is empty')
          }
        }
        // 송수펌프 데이터 가져오기
        const param = {
          search: '청양_가'
        }
        await store.dispatch('songsu/fetchSongsuSelect', param)
        if (songsuSelect.value) {
          const arr = JSON.parse(JSON.stringify(songsuSelect.value))
          console.log('songsuSelect: ', arr)
          if (arr.data1 && arr.data1.length > 0) {
            // 배수지 컴포넌트에 데이터 업데이트
            const component = waterBox.value
            if (component && component.updateData) {
              // 데이터 인터페이스 확정 후 구현 예정
              component.updateData(arr.data1)
            }
          }
          if (arr.data3 && arr.data3.length > 0) {
            aiOnoffStatus(arr.data3)
          }
          if (arr.data2 && arr.data2.length > 0) {
            leftmappingHtml(arr.data2)
          }
          getPrediction()
          // getAiPopup()
        }
      } catch (err) {
        console.log(err)
      }
    }

    const aiOnoffStatus = (data) => {
      console.log('ai상태: ', data[0].ai_onoff, data[0].ai_onoff_auto,data[0].ai_onoff_auto_ban)
      try {
        if (data[0].ai_onoff === 1 || data[0].ai_onoff === '1.0000') { 
          //ai미사용
          toggleButton.value.style.background = '#b4dffa'
          toggleButton.value.style.left = '0px'
          toggleState.value = 'OFF'
          autoBanArea.value.style.opacity = 1
          aiAuto.value.disabled = true
          aiBanAuto.value.disabled = true
        } else {  
          //ai 사용중
          toggleButton.value.style.left = '40px'
          toggleButton.value.style.background = '#b4dffa'
          toggleState.value = 'AI'

          if (data[0].ai_onoff_auto === 0 || data[0].ai_onoff_auto === '0.0000') {  
            //AI반자동
            aiAuto.value.checked = false
            aiAuto.value.nextElementSibling.style.opacity = '0.3'
            aiBanAuto.value.checked = true
            aiBanAuto.value.nextElementSibling.style.opacity = '1'

            aiAuto.value.disabled = false
            aiBanAuto.value.disabled = false
            autoBanArea.value.style.opacity = 1
            
          } else { 
            //AI자동
            aiAuto.value.checked = true
            aiAuto.value.nextElementSibling.style.opacity = '1'
            aiBanAuto.value.checked = false
            aiBanAuto.value.nextElementSibling.style.opacity = '0.3'

            aiAuto.value.disabled = false
            aiBanAuto.value.disabled = false
            autoBanArea.value.style.opacity = 1
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const leftmappingHtml = (data2) => {
      try {
        if (data2[0].펌프1가동상태운영_청양 === null) {
          console.log('data empty pass')
        } else {
          insertPumpVal(aiPwrA, Number(data2[0].청양전력).toFixed(2))
          insertPumpVal(aiTubePrsrA, Number(data2[0].청양관압).toFixed(2))
          insertPumpVal(aiFlowA, Number(data2[0].청양유량).toFixed(2))
          nowPumpStatusA[0] = (data2[0].펌프1가동상태운영_청양 === '1.0' || data2[0].펌프1가동상태운영_청양 === '1.0000' || data2[0].펌프1가동상태운영_청양 === 1 || data2[0].펌프1가동상태운영_청양 === '1') ? 'on' : 'off'
          nowPumpStatusA[1] = (data2[0].펌프2가동상태운영_청양 === '1.0' || data2[0].펌프2가동상태운영_청양 === '1.0000' || data2[0].펌프2가동상태운영_청양 === 1 || data2[0].펌프2가동상태운영_청양 === '1') ? 'on' : 'off'
          nowPumpStatusA[2] = (data2[0].펌프3가동상태운영_청양 === '1.0' || data2[0].펌프3가동상태운영_청양 === '1.0000' || data2[0].펌프3가동상태운영_청양 === 1 || data2[0].펌프3가동상태운영_청양 === '1') ? 'on' : 'off'
          insertPumpVal(aiFreqA1, Number(data2[0].펌프1주파수_청양).toFixed(2))
          insertPumpVal(aiFreqA2, Number(data2[0].펌프2주파수_청양).toFixed(2))
          insertPumpVal(aiFreqA3, Number(data2[0].펌프3주파수_청양).toFixed(2))
        }
      } catch (err) {
        console.log(err)
      }
    }

    const insertPumpVal = (id, data) => {
      if (nc(data)) {
        id.value = data
      }
    }

    const getPrediction = async () => {
      try {
        // 예상 결과 데이터 연동
        const param = {
          search: '청양_가'
        }
        await store.dispatch('songsu/fetchPumpSelect', param)
        if (pumpSelect.value) {
          const arr = JSON.parse(JSON.stringify(pumpSelect.value))
          if (!arr || arr.length === 0) {
            console.log('pumpSelect is empty')
            return
          }
          console.log('pumpSelect: ', arr)
          const data3 = arr.data3
          const data4 = arr.data4
          if (data3 && data3.length > 0) {
            pumpStatusA[0] = (data3[0].펌프1가동상태운영_청양 === '1.0' || data3[0].펌프1가동상태운영_청양 === '1.0000' || data3[0].펌프1가동상태운영_청양 === '1' || data3[0].펌프1가동상태운영_청양 === 1) ? 'on' : 'off'
            pumpStatusA[1] = (data3[0].펌프2가동상태운영_청양 === '1.0' || data3[0].펌프2가동상태운영_청양 === '1.0000' || data3[0].펌프2가동상태운영_청양 === '1' || data3[0].펌프2가동상태운영_청양 === 1) ? 'on' : 'off'
            pumpStatusA[2] = (data3[0].펌프3가동상태운영_청양 === '1.0' || data3[0].펌프3가동상태운영_청양 === '1.0000' || data3[0].펌프3가동상태운영_청양 === '1' || data3[0].펌프3가동상태운영_청양 === 1) ? 'on' : 'off'
            insertPumpVal(pwrPrdctA, Number(data3[0].청양분석결과예상전력).toFixed(2))
            insertPumpVal(tubePrsrPrdctA, Number(data3[0].청양분석결과예상관압).toFixed(2))
            insertPumpVal(flowPrdctA, Number(data3[0].청양분석결과예상유량).toFixed(2))
            insertPumpVal(freqA1, Number(data3[0].펌프1주파수_청양).toFixed(2))
            insertPumpVal(freqA2, Number(data3[0].펌프2주파수_청양).toFixed(2))
            insertPumpVal(freqA3, Number(data3[0].펌프3주파수_청양).toFixed(2))
            // 제어순서, 운영모드
            operateNum.value = data3[0].운영대수 ? data3[0].운영대수 : ''
            emit('update:operateNum', operateNum.value)
            operateMode.value = data3[0].운영모드 ? data3[0].운영모드 : ''
            emit('update:operateMode', operateMode.value)
            // 분기점 현황 업데이트
            // insertPumpVal(divergeInfo[0], Number(data3[0].청양유입유량).toFixed(2))
            // insertPumpVal(divergeInfo[1], Number(data3[0].청양유입압력).toFixed(2))
            // insertPumpVal(divergeInfo[2], Number(data3[0].청양유출분기압력).toFixed(2))
            // insertPumpVal(divergeInfo[3], Number(data3[0].청양유량분기압력).toFixed(2))
            // 물통 높이 추후 구현 필요
            gaugeHeight.value = '0%'
            waterPercent.value = '0'
            // if (nc(MIN_PRSR.value)) {
            //   if (MIN_PRSR.value === '0' || MIN_PRSR.value === '0.00') {
            //     gaugeHeight.value = '0%'
            //     waterPercent.value = '0'
            //   } else {
            //     const percent = Number(MIN_PRSR.value / 8.229 * 100.00).toFixed(0)
            //     if (percent <= 100) {
            //       gaugeHeight.value = percent + '%'
            //     }
            //     waterPercent.value = MIN_PRSR.value
            //   }
            // } else {
            //   gaugeHeight.value = '0%'
            //   waterPercent.value = '0'
            // }
          }
          if (data4 && data4.length > 0) {
            // 분기점 현황 업데이트
            divergeInfo[0] = Number(data4[0].value).toFixed(2)
            divergeInfo[1] = Number(data4[1].value).toFixed(2)
            divergeInfo[2] = Number(data4[2].value).toFixed(2)
            divergeInfo[3] = Number(data4[3].value).toFixed(2)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const getPumpPopup = async () => {
      // 펌프 컨트롤 팝업
      try {
        await store.dispatch('songsu/fetchGetPopup')
        if (getPopup.value) {
          const arr = JSON.parse(JSON.stringify(getPopup.value))
          console.log('getPopup: ', arr.data)
          let flag = true
          if (arr.data && arr.data.length > 0) {
            for (let i = 0; i < arr.data.length; i++) {
              if (arr.data[i].USE_YN !== arr.data[i].PMS_USE_YN) {
                flag = false
                PumpIdx.value = arr.data[i].PMP_GRP_IDX
                break
              }
            }
            if (!flag) {
              popupMsg.value = `${PumpIdx.value}번 펌프를 끄시겠습니까?`
              showModal2.value = true
            }
          } else {
            console.log('getPopup data is empty')
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const closeModal2 = (data) => {
      showModal2.value = false
    }

    const cancelHMI = async () => {
      try {
        if (PumpIdx.value > 0) {
          // insertPopup DB 연동
          await store.dispatch('songsu/fetchUpdateCTR_PRF_PMPMST_INF', { search: PumpIdx.value })
          if (updateCTR.value) {
            const jsonData = JSON.parse(JSON.stringify(updateCTR.value))
            if (jsonData.message !== 'ok') {
              // 실패했을 경우에 대한 처리는 기존 소스에 없음
              console.log('action: fetchUpdateCTR_PRF_PMPMST_INF', ' error message: ', jsonData.message)
            }
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        closeModal2()
      }
    }

    const updateHMI = async () => {
      try {
        const parm = [
          { search: '745-617-PMK-4114', search2: '1' },
          { search: '745-617-PMK-4117', search2: '1' },
          { search: '745-617-PMK-4120', search2: '1' },
          { search: '745-617-PMK-4123', search2: '1' }
        ]
        if (PumpIdx.value > 0) {
          // insertPopup DB 연동
          await store.dispatch('songsu/fetchInsertPopup', parm[PumpIdx.value - 1])
          if (insertPopup.value) {
            const jsonData = JSON.parse(JSON.stringify(insertPopup.value))
            if (jsonData.message !== 'ok') {
              // 실패했을 경우에 대한 처리는 기존 소스에 없음
              console.log('action: fetchInsertPopup', ' error message: ', jsonData.message)
            }
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        closeModal2()
      }
    }

    const executeApis = () => {
      getData()
      getPumpPopup()
    }

    onMounted(() => {
      executeApis()
      // 10초 마다 데이터 갱신 및 AI 팝업 확인
      executeInterval.value = setInterval(executeApis, 10000)
    })

    onUnmounted(() => {
      clearInterval(executeInterval.value)
    })

    return {
      interpupptData,
      getPumpTime,
      operateNum,
      operateMode,
      pwrPrdctA,
      tubePrsrPrdctA,
      flowPrdctA,
      freqA1,
      freqA2,
      freqA3,
      aiPwrA,
      aiTubePrsrA,
      aiFlowA,
      aiFreqA1,
      aiFreqA2,
      aiFreqA3,
      divergeInfo,
      toggleState,
      toggleButton,
      autoBanArea,
      aiAuto,
      aiBanAuto,
      nowPumpStatusA,
      pumpStatusA,
      gaugeHeight,
      waterPercent,
      showModal,
      timeCount,
      showModal2,
      popupMsg,
      PumpIdx,
      waterBox,
      getOpacityValue,
      handleToggleClick,
      handleAutoChange,
      handleBanAutoChange,
      cancelHMI,
      updateHMI,
      closeModal2
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';
@import '~@/style/AI/songsu.css';

.ai_pump_start {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 20px;
  color: white;
}

.ai_pump_start2 {
  height: calc(100%);
  width: 100%;
  margin-bottom: 10px;

  .ai_pump_start2_2 {
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 5px 0 10px 0;
  }
}

.ai_pump_arrow_start {
  height: 100%;
  width: calc(10% - 30px);
  margin: 0 15px;
  mix-blend-mode: color-dodge;

  .arrow_img {
    width: 100%;
    height: 100%;
    background: url('@/assets/img/ai_arrow_right.png') no-repeat;
    background-position: center;
    background-size: 80% 60%;
    mix-blend-mode: color-dodge;
  }

  .arrow_info {
    position: absolute;
    width: 5%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}

.top_name {
  width: 30%;
  height: 100%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.songsuLeftBox {
  width: 70%;
  height: 93%
}

/* 펌프영역 시작 */
.pump_area {
  height: 104%;
  width: 100%;
  // margin-bottom: 10px;
  background: url('@/assets/img/analysis/table_bg_03.png') no-repeat;
  background-size: 101% 105%;
  background-position: center;

  .pump_area2 {
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 5px 0 10px 0;
  }

  .middle {
    height: 48%;
    width: calc(100% - 15px);
    margin-left: 15px;
    margin-top: 30%;
  }
}

.bottom_pipe_line2 {
  width: 100%;
  height: 100%;
  background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
  background-size: 100% 30px;
  background-position: center;
}

.pipe_line_arrow {
  background: url('@/assets/img/dashboard/water.png') no-repeat;
  width: 100%;
  height: 100%;
  mix-blend-mode: color-dodge;
  background-position: center;
}

.pipe_right_box {
  width: 100%;
  height: 100%;
  background: url('@/assets/img/ai_song/middle.png') no-repeat;
  background-size: 100% 37%;
  background-position: center;
}

.pipe_right_box_x {
  width: 330%;
  height: 100%;
  background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
  background-size: 100% 30px;
  background-position: center;
  margin-left: -4%;
}

.detail_textWrap {
  width: calc(100% - 30px);
  display: flex;
  align-items: center;
  margin: 25px 15px;
  font-size: 16px;
  font-family: 'KHNPHDRegular';
  color: #fff
}

.modal_arrow_img {
  width: 100%;
  height: 15%;
  background: url('@/assets/img/ai_song/image (2).png') no-repeat;
  background-position: center;
  background-size: 50% 100%;
  mix-blend-mode: color-dodge;
}

.modal {
  &.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  &-window {
    background-color: transparent;
    border-radius: 4px;
    overflow: hidden;
  }
}

// 오버레이 트랜지션
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // 오버레이에 포함되어 있는 모달 윈도의 트랜지션
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// 딜레이가 적용된 모달 윈도가 제거된 후에 오버레이가 사라짐
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.pump_area_h3_top {
  height: calc(100%/ 3);
  width: calc(100%);
  margin-top: 5px;
}

.pipes_wrap_cy {
  width: 83%;
  height: 50%;
  margin-left: 2%;
  margin-top: 39%;
  float: left;
}
</style>
