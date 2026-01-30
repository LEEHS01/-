<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
  <transition name="modal" appear v-show="showModalDangjin">
  <div class="modal modal-overlay" style="width: 50%; margin-right: 50%;">
    <div class="modal-window">
      <div class="modal-content">
        <div class="k-window" style="padding-top: 0px;min-width: 90px; min-height: 50px;width: 900px;height: 650px;">
          <div style="padding: 60px 45px; height: 100%; width: 100%; box-sizing: border-box;">
            <div style="height: 85%; width: 100%; ">
              <div class="popup__title" style="font-size: 18px;">당진 현재 운영
              </div>
              <!--  운영 펌프 영역 시작 -->
              <div class="fL" style="width: 100%;height: 30%;">
                <div class="" style="width: 100%;height:100%;text-align: center;font-size: 20px;color: #fff;">
                  <div class=" fL" style="height: 100%; width: 90%;">
                    <div class="fL" style="height: 100%; width: calc(100% - 30px ); display: flex; margin-left: 8%;">
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                        <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(nowPumpStatusA[0]), width:'100%' , height:'100%' }"> #1</div>
                        <div v-show="nowPumpStatusA[0] === 'on'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            <span class="input_design" id="aiFreqA1" style="margin-right: 10px; height: 100%;">{{ aiFreqA1 }}</span>Hz
                        </div>
                        <div v-show="nowPumpStatusA[0] === 'off'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            <span class="input_design" id="aiFreqA1" style="margin-right: 10px; height: 100%;">0.00</span>Hz
                        </div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                        <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(nowPumpStatusA[1]), width:'100%' , height:'100%' }"> #2</div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                        <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(nowPumpStatusA[2]), width:'100%' , height:'100%'}"> #3</div>
                        <div v-show="nowPumpStatusA[2] === 'on'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                          <span class="input_design" id="aiFreqA2" style="margin-right: 10px; height: 100%;">{{ aiFreqA2 }}</span>Hz
                        </div>
                        <div v-show="nowPumpStatusA[2] === 'off'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            <span class="input_design" id="aiFreqA2" style="margin-right: 10px; height: 100%;">0.00</span>Hz
                        </div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                        <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(nowPumpStatusA[3]), width:'100%' , height:'100%', marginBottom:'15%'}"> #4</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--  운영 펌프 영역 끝-->
              <div class="fadein fL modal_arrow_img"></div>
              <div class="popup__title" style="font-size: 18px;">당진 AI 분석</div>
              <!-- AI 펌프 영역 시작 -->
              <div class="fL" style="width: 100%;height: 30%;">
                <div class="" style="width: 100%;height:100%;text-align: center;font-size: 20px;color: #fff;">
                  <div class=" fL" style="height: 100%; width: 90%;">
                    <div class="fL" style="height: 100%; width: calc(100% - 30px ); display: flex; margin-left: 8%;">
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                        <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[0]), width:'100%' , height:'100%' }"> #1</div>
                        <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            <span class="input_design" id="freqA1" style="margin-right: 10px; height: 100%;">{{ freqA1 }}</span>Hz
                        </div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                        <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[1]), width:'100%' , height:'100%' }"> #2</div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                        <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[2]), width:'100%' , height:'100%' }"> #3</div>
                        <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                          <span class="input_design" id="freqA2" style="margin-right: 10px; height: 100%;">{{ freqA2 }}</span>Hz
                        </div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                        <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[3]), width:'100%' , height:'100%', marginBottom:'15%' }"> #4</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- AI 펌프 영역 끝-->
            </div>
            <div style="width: 100%; height: 15%; display: flex; flex-direction: column; align-items: center;">
              <span style="color: #FFF;">AI 분석 결과를 적용하시겠습니까?</span>
              <span style="color: #FFF;">{{ timecountDangjin }}</span>
              <!-- popup_button -->
              <div class="popup_button">
                <!-- btn__cancel -->
                <div class="popup__btn popup__btn__cancel cancleBtn" @click="cancelPTRDangjin">취소</div>
                <!-- btn__chagne -->
                <div class="popup__btn popup__btn__change" @click="updatePTRDangjin">적용</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
<transition name="modal" appear v-show="showModalTaean">
  <div class="modal modal-overlay" style="margin-left: 50%; width: 50%;">
    <div class="modal-window">
      <div class="modal-content">
        <div class="k-window" style="padding-top: 0px;min-width: 90px; min-height: 50px;width: 900px;height: 650px;">
          <div style="padding: 60px 45px; height: 100%; width: 100%; box-sizing: border-box;">
            <div style="height: 85%; width: 100%; ">
              <div class="popup__title" style="font-size: 18px;">태안 현재 운영
              </div>
              <!--  운영 펌프 영역 시작 -->
              <div class="fL" style="width: 100%;height: 30%;">
                <div class="" style="width: 100%;height:100%;text-align: center;font-size: 20px;color: #fff;">
                  <div class=" fL" style="height: 100%;width: 90%;">
                    <div class="fL" style="height: 100%; width: calc(100% - 30px);  margin-left: 8%; display: flex;">
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                          <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(nowPumpStatusB[0]), width:'100%' , height:'100%' }"> #1</div>
                          <div v-show="nowPumpStatusB[0] === 'on'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            <span class="input_design" id="aiFreqB1" style="margin-right: 10px; height: 100%;">{{ aiFreqB1 }}</span>Hz
                          </div>
                          <div v-show="nowPumpStatusB[0] === 'off'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                              <span class="input_design" id="aiFreqB1" style="margin-right: 10px; height: 100%;">0.00</span>Hz
                          </div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                          <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(nowPumpStatusB[1]), width:'100%' , height:'100%', marginBottom:'15%' }"> #2</div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                          <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(nowPumpStatusB[2]), width:'100%' , height:'100%', marginBottom:'15%' }"> #3</div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                          <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(nowPumpStatusB[3]), width:'100%' , height:'100%', marginBottom:'15%' }"> #4</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--  운영 펌프 영역 끝-->
              <div class="fadein fL modal_arrow_img"></div>
              <div class="popup__title" style="font-size: 18px;">태안 AI 분석</div>
              <!-- AI 펌프 영역 시작 -->
              <div class="fL" style="width: 100%;height: 30%;">
                <div class="" style="width: 100%;height:100%;text-align: center;font-size: 20px;color: #fff;">
                  <div class=" fL" style="height: 100%;width: 90%;">
                    <div class="fL" style="height: 100%; width: calc(100% - 30px);  margin-left: 8%; display: flex;">
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                          <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusB[0]), width:'100%' , height:'100%' }"> #1</div>
                          <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            <span class="input_design" id="freqB1" style="margin-right: 10px; height: 100%;">{{ freqB1 }}</span>Hz
                          </div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                          <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusB[1]), width:'100%' , height:'100%', marginBottom:'15%' }"> #2</div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                          <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusB[2]), width:'100%' , height:'100%', marginBottom:'15%' }"> #3</div>
                      </div>
                      <div class="fL pump_area_w3" style="display: flex; flex-direction: column;">
                          <div class="pop_pump_img flex_center fL" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusB[3]), width:'100%' , height:'100%', marginBottom:'15%' }"> #4</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- AI 펌프 영역 끝-->
            </div>
            <div style="width: 100%; height: 15%; display: flex; flex-direction: column; align-items: center;">
              <span style="color: #FFF;">AI 분석 결과를 적용하시겠습니까?</span>
              <span style="color: #FFF;">{{ timecountTaean }}</span>
              <!-- popup_button -->
              <div class="popup_button">
                <!-- btn__cancel -->
                <div class="popup__btn popup__btn__cancel cancleBtn" @click="cancelPTRTaean">취소</div>
                <!-- btn__chagne -->
                <div class="popup__btn popup__btn__change" @click="updatePTRTaean">적용</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { nc } from '@/utils/utils.js'
import { speakText } from '@/utils/tts.js'
import axios from 'axios'

export default {
  setup () {
    const store = useStore()
    const insertPopup2 = computed(() => store.getters['songsu/getInsertPopup2'])
    const insertPopupAuto2 = computed(() => store.getters['songsu/getInsertPopupAuto2'])
    const songsuSelect = computed(() => store.getters['songsu/getSongsuSelect'])
    const pumpSelect = computed(() => store.getters['songsu/getPumpSelect'])
    const interpuppt = computed(() => store.getters['songsu/getInterpuppt'])
    const ptrCtrInf = computed(() => store.getters['songsu/getPTR_CTR_INF'])
    // const getPopup = computed(() => store.getters['songsu/getGetPopup'])
    // const insertPopup = computed(() => store.getters['songsu/getInsertPopup'])
    // const updateCTR = computed(() => store.getters['songsu/getUpdateCTR_PRF_PMPMST_INF'])

    const interpupptData = reactive([])
    const getPumpTime = ref('')
    const operateNum = ref('')
    const operateMode = ref('')
    const pwrPrdctA = ref('0')
    const tubePrsrPrdctA = ref('0')
    const flowPrdctA = ref('0')
    const aiFreqA1 = ref('0.00')
    const aiFreqA2 = ref('0.00')
    const pwrPrdctB = ref('0')
    const tubePrsrPrdctB = ref('0')
    const flowPrdctB = ref('0')
    const freqB1 = ref('0.00')
    const aiPwrA = ref('0')
    const aiTubePrsrA = ref('0')
    const aiFlowA = ref('0')
    const freqA1 = ref('0.00')
    const freqA2 = ref('0.00')
    const aiPwrB = ref('0')
    const aiTubePrsrB = ref('0')
    const aiFlowB = ref('0')
    const aiFreqB1 = ref('0.00')
    const nowPumpStatusA = reactive(['off', 'off', 'off', 'off'])
    const nowPumpStatusB = reactive(['off', 'off', 'off', 'off'])
    const pumpStatusA = reactive(['off', 'off', 'off', 'off'])
    const pumpStatusB = reactive(['off', 'off', 'off', 'off'])
    const showModalDangjin = ref(false)
    const timecountDangjin = ref(null)
    const timecountTaean = ref(null)
    const showModal2 = ref(false)
    const showModalTaean = ref(false)
    const popupMsg = ref('')
    const PumpIdx = ref('')
    const executeInterval = ref(null)

    const getOpacityValue = (status) => {
      return status === 'on' ? 1 : 0.25
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

    // const getData = async () => {
    //   try {
    //   // 데이터 수집시간 가져오기
    //     await store.dispatch('songsu/fetchInterpuppt')
    //     if (interpuppt.value) {
    //       const arr = JSON.parse(JSON.stringify(interpuppt.value))
    //       if (arr.interpuppt && arr.interpuppt.length > 0) {
    //         interpupptData.value = arr.interpuppt
    //       } else {
    //         console.log('interpuppt is empty')
    //       }
    //       if (arr.getPumpTime && arr.getPumpTime.length > 0) {
    //         const minT = Math.min(...arr.getPumpTime.map((o) => o.t))
    //         let idx = 0
    //         for (let i = 0; i < arr.getPumpTime.length; i++) {
    //           if (arr.getPumpTime[i].t === minT) {
    //             idx = i
    //             break
    //           }
    //         }
    //         getPumpTime.value = arr.getPumpTime[idx].ts
    //       } else {
    //         console.log('getPumpTime is empty')
    //       }
    //     }
    //     // 송수펌프 데이터 가져오기
    //     const param = {
    //       search: '서산_가'
    //     }
    //     await store.dispatch('songsu/fetchSongsuSelect', param)
    //     if (songsuSelect.value) {
    //       const arr = JSON.parse(JSON.stringify(songsuSelect.value))
    //       console.log('songsuSelect: ', arr)
    //       if (arr.data3 && arr.data3.length > 0) {
    //         aiOnoffStatus(arr.data3)
    //       }
    //       if (arr.data2 && arr.data2.length > 0) {
    //         await leftmappingHtml(arr.data2)
    //       }
    //       getPrediction()
    //       await getAiPopup()
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }

    const MAX_RETRY_COUNT = 10 // 최대 재시도 횟수 설정
    let retryCount = 0 // 현재 재시도 횟수

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
          } else {
            console.log('getPumpTime is empty')
          }
        }
        // 송수펌프 데이터 가져오기
        const param = {
          search: '서산_가'
        }
        await store.dispatch('songsu/fetchSongsuSelect', param)
        if (songsuSelect.value) {
          const arr = JSON.parse(JSON.stringify(songsuSelect.value))
          console.log('songsuSelect: ', arr)
          if (arr.data3 && arr.data3.length > 0) {
            aiOnoffStatus(arr.data3)
          }
          if (arr.data2 && arr.data2.length > 0) {
            if (arr.data2[0].펌프1가동상태운영_당진 === null || arr.data2[0].펌프1가동상태운영_태안 === null) {
              if (retryCount < MAX_RETRY_COUNT) {
                retryCount++
                console.log(`펌프 현재 운영값이 null입니다. 재시도 중 (${retryCount}/${MAX_RETRY_COUNT})...`)
                getData() // 재귀 호출
              } else {
                console.log('최대 재시도 횟수에 도달하여 함수를 종료합니다.')
              }
              return // 함수 종료하여 나머지 코드 실행 방지
            }
            await leftmappingHtml(arr.data2)
          }
          getPrediction()
          await getAiPopup()
        }
      } catch (err) {
        console.log(err)
      }
    }

    const aiOnoffStatus = (data) => {
      try {
      // 나중에 자동 반자동이 확실해지면 로직 수정 필요
        console.log('aiOnoffStatus Check!!!')
      } catch (err) {
        console.log(err)
      }
    }

    const leftmappingHtml = (data2) => {
      try {
      // 당진
        // 당진
        insertPumpVal(aiPwrA, Number(data2[0].당진전력).toFixed(2))
        insertPumpVal(aiTubePrsrA, Number(data2[0].당진관압).toFixed(2))
        insertPumpVal(aiFlowA, Number(data2[0].당진유량).toFixed(2))
        nowPumpStatusA[0] = (data2[0].펌프1가동상태운영_당진 === '1.0' || data2[0].펌프1가동상태운영_당진 === '1.0000' || data2[0].펌프1가동상태운영_당진 === '1' || data2[0].펌프1가동상태운영_당진 === 1) ? 'on' : 'off'
        nowPumpStatusA[1] = (data2[0].펌프2가동상태운영_당진 === '1.0' || data2[0].펌프2가동상태운영_당진 === '1.0000' || data2[0].펌프2가동상태운영_당진 === '1' || data2[0].펌프2가동상태운영_당진 === 1) ? 'on' : 'off'
        nowPumpStatusA[2] = (data2[0].펌프3가동상태운영_당진 === '1.0' || data2[0].펌프3가동상태운영_당진 === '1.0000' || data2[0].펌프3가동상태운영_당진 === '1' || data2[0].펌프3가동상태운영_당진 === 1) ? 'on' : 'off'
        nowPumpStatusA[3] = (data2[0].펌프4가동상태운영_당진 === '1.0' || data2[0].펌프4가동상태운영_당진 === '1.0000' || data2[0].펌프4가동상태운영_당진 === '1' || data2[0].펌프4가동상태운영_당진 === 1) ? 'on' : 'off'
        insertPumpVal(aiFreqA1, Number(data2[0].펌프1주파수_당진).toFixed(2))
        insertPumpVal(aiFreqA2, Number(data2[0].펌프3주파수_당진).toFixed(2))
        // 태안
        insertPumpVal(aiPwrB, Number(data2[0].태안전력).toFixed(2))
        insertPumpVal(aiTubePrsrB, Number(data2[0].태안관압).toFixed(2))
        insertPumpVal(aiFlowB, Number(data2[0].태안유량).toFixed(2))
        nowPumpStatusB[0] = (data2[0].펌프1가동상태운영_태안 === '1.0' || data2[0].펌프1가동상태운영_태안 === '1.0000' || data2[0].펌프1가동상태운영_태안 === '1' || data2[0].펌프1가동상태운영_태안 === 1) ? 'on' : 'off'
        nowPumpStatusB[1] = (data2[0].펌프2가동상태운영_태안 === '1.0' || data2[0].펌프2가동상태운영_태안 === '1.0000' || data2[0].펌프2가동상태운영_태안 === '1' || data2[0].펌프2가동상태운영_태안 === 1) ? 'on' : 'off'
        nowPumpStatusB[2] = (data2[0].펌프3가동상태운영_태안 === '1.0' || data2[0].펌프3가동상태운영_태안 === '1.0000' || data2[0].펌프3가동상태운영_태안 === '1' || data2[0].펌프3가동상태운영_태안 === 1) ? 'on' : 'off'
        nowPumpStatusB[3] = (data2[0].펌프4가동상태운영_태안 === '1.0' || data2[0].펌프4가동상태운영_태안 === '1.0000' || data2[0].펌프4가동상태운영_태안 === '1' || data2[0].펌프4가동상태운영_태안 === 1) ? 'on' : 'off'
        insertPumpVal(aiFreqB1, Number(data2[0].펌프1주파수_태안).toFixed(2))
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
          search: '서산_가'
        }
        await store.dispatch('songsu/fetchPumpSelect', param)
        if (pumpSelect.value) {
          const arr = JSON.parse(JSON.stringify(pumpSelect.value))
          console.log('pumpSelect: ', arr)
          const data3 = arr.data3
          if (data3 && data3.length > 0) {
          // 당진
            pumpStatusA[0] = (data3[0].펌프1가동상태운영_당진 === '1.0' || data3[0].펌프1가동상태운영_당진 === '1.0000' || data3[0].펌프1가동상태운영_당진 === '1' || data3[0].펌프1가동상태운영_당진 === 1) ? 'on' : 'off'
            pumpStatusA[1] = (data3[0].펌프2가동상태운영_당진 === '1.0' || data3[0].펌프2가동상태운영_당진 === '1.0000' || data3[0].펌프2가동상태운영_당진 === '1' || data3[0].펌프2가동상태운영_당진 === 1) ? 'on' : 'off'
            pumpStatusA[2] = (data3[0].펌프3가동상태운영_당진 === '1.0' || data3[0].펌프3가동상태운영_당진 === '1.0000' || data3[0].펌프3가동상태운영_당진 === '1' || data3[0].펌프3가동상태운영_당진 === 1) ? 'on' : 'off'
            pumpStatusA[3] = (data3[0].펌프4가동상태운영_당진 === '1.0' || data3[0].펌프4가동상태운영_당진 === '1.0000' || data3[0].펌프4가동상태운영_당진 === '1' || data3[0].펌프4가동상태운영_당진 === 1) ? 'on' : 'off'
            insertPumpVal(pwrPrdctA, Number(data3[0].당진분석결과예상전력).toFixed(2))
            insertPumpVal(tubePrsrPrdctA, Number(data3[0].당진분석결과예상관압).toFixed(2))
            insertPumpVal(flowPrdctA, Number(data3[0].당진분석결과예상유량).toFixed(2))
            insertPumpVal(freqA1, Number(data3[0].펌프1주파수_당진).toFixed(2))
            insertPumpVal(freqA2, Number(data3[0].펌프3주파수_당진).toFixed(2))
            // 태안
            pumpStatusB[0] = (data3[0].펌프1가동상태운영_태안 === '1.0' || data3[0].펌프1가동상태운영_태안 === '1.0000' || data3[0].펌프1가동상태운영_태안 === '1' || data3[0].펌프1가동상태운영_태안 === 1) ? 'on' : 'off'
            pumpStatusB[1] = (data3[0].펌프2가동상태운영_태안 === '1.0' || data3[0].펌프2가동상태운영_태안 === '1.0000' || data3[0].펌프2가동상태운영_태안 === '1' || data3[0].펌프2가동상태운영_태안 === 1) ? 'on' : 'off'
            pumpStatusB[2] = (data3[0].펌프3가동상태운영_태안 === '1.0' || data3[0].펌프3가동상태운영_태안 === '1.0000' || data3[0].펌프3가동상태운영_태안 === '1' || data3[0].펌프3가동상태운영_태안 === 1) ? 'on' : 'off'
            pumpStatusB[3] = (data3[0].펌프4가동상태운영_태안 === '1.0' || data3[0].펌프4가동상태운영_태안 === '1.0000' || data3[0].펌프4가동상태운영_태안 === '1' || data3[0].펌프4가동상태운영_태안 === 1) ? 'on' : 'off'
            insertPumpVal(pwrPrdctB, Number(data3[0].태안분석결과예상전력).toFixed(2))
            insertPumpVal(tubePrsrPrdctB, Number(data3[0].태안분석결과예상관압).toFixed(2))
            insertPumpVal(flowPrdctB, Number(data3[0].태안분석결과예상유량).toFixed(2))
            insertPumpVal(freqB1, Number(data3[0].펌프1주파수_태안).toFixed(2))
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    let timerDangjin
    let timerTaean

    const getAiPopup = async () => {
    // AI 적용 팝업
      try {
        await store.dispatch('songsu/fetchPTR_CTR_INF')
        const arr = JSON.parse(JSON.stringify(ptrCtrInf.value))

        const convertDiffTimeToMinutes = (diffTime) => {
          const [hours, minutes, seconds] = diffTime.split(':').map(Number)
          return hours * 60 + minutes
        }

        // 현재 시간과의 차이 계산
        const diffTime1 = convertDiffTimeToMinutes(arr.data['600-457-EMS-1901'].DIFF_TIME)
        const diffTime2 = convertDiffTimeToMinutes(arr.data['600-457-EMS-2901'].DIFF_TIME)
        // 당진 AI 추천(반자동) 모드
        if (arr.data['600-457-EMS-1001'].value && arr.data['600-457-EMS-1003'].value) {
          if (parseInt(arr.data['600-457-EMS-1901'].UPDT_TIME_MINUTES) % 15 === 6 && diffTime1 < 10 && arr.data['600-457-EMS-1901'].value) {
            clearInterval(timerDangjin)
            let countDangjin = 60
            showModalDangjin.value = true
            timerDangjin = setInterval(() => {
              timecountDangjin.value = countDangjin
              countDangjin--
              if (countDangjin < 10) {
                console.log('!!!!!!!!!!!!!!!!')
                cancelPTRDangjin()
              }
            }, 1000)
          } else {
            console.log('time issue!!!!')
          }
        }
        // 당진 AI (자동)모드
        else if (arr.data['600-457-EMS-1001'].value && arr.data['600-457-EMS-1002'].value) {
          if (parseInt(arr.data['600-457-EMS-1901'].UPDT_TIME_MINUTES) % 15 === 6 && diffTime1 < 10 && arr.data['600-457-EMS-1901'].value) {
            console.log('당진 AI 자동 모드')
            autoPTRDangjin()
          } else {
            console.log('time issue!!!!')
          }
        }
        // 태안 AI추천 (반자동) 모드
        if (arr.data['600-457-EMS-2001'].value && arr.data['600-457-EMS-2003'].value) {
          if (parseInt(arr.data['600-457-EMS-2901'].UPDT_TIME_MINUTES) % 15 === 6 && diffTime2 < 10 && arr.data['600-457-EMS-2901'].value) {
            clearInterval(timerTaean)
            let countTaean = 60
            showModalTaean.value = true
            timerTaean = setInterval(() => {
              timecountTaean.value = countTaean
              countTaean--
              if (countTaean < 10) {
                cancelPTRTaean()
              }
            }, 1000)
          } else {
            console.log('time issue!!!!')
          }
        }
        // 태안 AI (자동) 모드
        else if (arr.data['600-457-EMS-2001'].value && arr.data['600-457-EMS-2002'].value) {
          if (parseInt(arr.data['600-457-EMS-2901'].UPDT_TIME_MINUTES) % 15 === 6 && diffTime2 < 10 && arr.data['600-457-EMS-2901'].value) {
            console.log('태안 AI 자동 모드')
            autoPTRTaean()
          } else {
            console.log('time issue!!!!')
          }
        }

        if (showModalDangjin.value === true || showModalTaean.value === true) {
          insertAIpopupAlarm()
          speakText('펌프제어 AI 추천 팝업이 발생하였습니다.')
        }
      } catch (err) {
        console.log(err)
      }
    }

    const closeModalDangjin = () => {
      showModalDangjin.value = false
    }

    const closeModalTaean = () => {
      showModalTaean.value = false
    }

    const autoPTRDangjin = async () => {
    // insertPopup2 DB 연동
      try {
      // const arr = JSON.parse(JSON.stringify(ptrCtrInf.value))
        await store.dispatch('songsu/fetchInsertPopupAuto2', {
          search: '0',
          local: 'Dangjin',
          updt_time: ptrCtrInf.value.data['600-457-EMS-1901'].UPDT_TIME,
          ai_info: [
            { tag: '600-457-EMS-1001', value: '1' },
            { tag: '600-457-EMS-1002', value: '1' },
            { tag: '600-457-EMS-1003', value: '0' },
            { tag: '600-457-EMS-1004', value: '0' }
          ],
          flag: '3'
        }
        )
        if (insertPopupAuto2.value) {
          const jsonData = JSON.parse(JSON.stringify(insertPopupAuto2.value))
          if (jsonData.message !== 'ok') {
          // 실패했을 경우에 대한 처리는 기존 소스에 없음
            console.log('action: fetchInsertPopupAuto2', ' error message: ', jsonData.message)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const autoPTRTaean = async () => {
    // insertPopup2 DB 연동
      try {
        const arr = JSON.parse(JSON.stringify(ptrCtrInf.value))
        await store.dispatch('songsu/fetchInsertPopupAuto2', {
          search: '0',
          local: 'Taean',
          updt_time: arr.data['600-457-EMS-2901'].UPDT_TIME,
          ai_info: [
            { tag: '600-457-EMS-2001', value: '1' },
            { tag: '600-457-EMS-2002', value: '1' },
            { tag: '600-457-EMS-2003', value: '0' },
            { tag: '600-457-EMS-2004', value: '0' }
          ],
          flag: '3'
        }
        )
        if (insertPopupAuto2.value) {
          const jsonData = JSON.parse(JSON.stringify(insertPopupAuto2.value))
          if (jsonData.message !== 'ok') {
          // 실패했을 경우에 대한 처리는 기존 소스에 없음
            console.log('action: fetchInsertPopupAuto2', ' error message: ', jsonData.message)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const cancelPTRDangjin = async () => {
    // insertPopup2 DB 연동
      try {
      // const arr = JSON.parse(JSON.stringify(ptrCtrInf.value))
        await store.dispatch('songsu/fetchInsertPopup2', {
          search: '0',
          local: 'Dangjin',
          updt_time: ptrCtrInf.value.data['600-457-EMS-1901'].UPDT_TIME,
          ai_info: [
            { tag: '600-457-EMS-1001', value: '1' },
            { tag: '600-457-EMS-1002', value: '0' },
            { tag: '600-457-EMS-1003', value: '1' },
            { tag: '600-457-EMS-1004', value: '0' }
          ],
          flag: '1'
        }
        )
        if (insertPopup2.value) {
          const jsonData = JSON.parse(JSON.stringify(insertPopup2.value))
          if (jsonData.message !== 'ok') {
          // 실패했을 경우에 대한 처리는 기존 소스에 없음
            console.log('action: fetchInsertPopup2', ' error message: ', jsonData.message)
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        clearInterval(timerDangjin)
        closeModalDangjin()
      }
    }

    const cancelPTRTaean = async () => {
    // insertPopup2 DB 연동
      try {
        const arr = JSON.parse(JSON.stringify(ptrCtrInf.value))
        await store.dispatch('songsu/fetchInsertPopup2', {
          search: '0',
          local: 'Taean',
          updt_time: arr.data['600-457-EMS-2901'].UPDT_TIME,
          ai_info: [
            { tag: '600-457-EMS-2001', value: '1' },
            { tag: '600-457-EMS-2002', value: '0' },
            { tag: '600-457-EMS-2003', value: '1' },
            { tag: '600-457-EMS-2004', value: '0' }
          ],
          flag: '1'
        }
        )
        if (insertPopup2.value) {
          const jsonData = JSON.parse(JSON.stringify(insertPopup2.value))
          if (jsonData.message !== 'ok') {
          // 실패했을 경우에 대한 처리는 기존 소스에 없음
            console.log('action: fetchInsertPopup2', ' error message: ', jsonData.message)
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        clearInterval(timerTaean)
        closeModalTaean()
      }
    }

    const updatePTRDangjin = async () => {
    // insertPopup2 DB 연동
      try {
        const arr = JSON.parse(JSON.stringify(ptrCtrInf.value))
        await store.dispatch('songsu/fetchInsertPopup2', {
          search: '1',
          local: 'Dangjin',
          updt_time: arr.data['600-457-EMS-1901'].UPDT_TIME,
          ai_info: [
            { tag: '600-457-EMS-1001', value: '1' },
            { tag: '600-457-EMS-1002', value: '0' },
            { tag: '600-457-EMS-1003', value: '1' },
            { tag: '600-457-EMS-1004', value: '1' }
          ],
          flag: '2'
        }
        )
        if (insertPopup2.value) {
          const jsonData = JSON.parse(JSON.stringify(insertPopup2.value))
          if (jsonData.message !== 'ok') {
          // 실패했을 경우에 대한 처리는 기존 소스에 없음
            console.log('action: fetchInsertPopup2', ' error message: ', jsonData.message)
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        clearInterval(timerDangjin)
        closeModalDangjin()
      }
    }

    const updatePTRTaean = async () => {
    // insertPopup2 DB 연동
      try {
        const arr = JSON.parse(JSON.stringify(ptrCtrInf.value))
        await store.dispatch('songsu/fetchInsertPopup2', {
          search: '1',
          local: 'Taean',
          updt_time: arr.data['600-457-EMS-2901'].UPDT_TIME,
          ai_info: [
            { tag: '600-457-EMS-2001', value: '1' },
            { tag: '600-457-EMS-2002', value: '0' },
            { tag: '600-457-EMS-2003', value: '1' },
            { tag: '600-457-EMS-2004', value: '1' }
          ],
          flag: '2'
        }
        )
        if (insertPopup2.value) {
          const jsonData = JSON.parse(JSON.stringify(insertPopup2.value))
          if (jsonData.message !== 'ok') {
          // 실패했을 경우에 대한 처리는 기존 소스에 없음
            console.log('action: fetchInsertPopup2', ' error message: ', jsonData.message)
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        clearInterval(timerTaean)
        closeModalTaean()
      }
    }

    const insertAIpopupAlarm = () => {
      axios
        .post(
          `${process.env.VUE_APP_HOST_IP}/api/insertAIpopupAlarm`
        )
        .then((resp) => {
          console.log('AIpopup alarm insert 성공')
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
          }
        })
    }

    // const getPumpPopup = async () => {
    //   // 펌프 컨트롤 팝업
    //   try {
    //     await store.dispatch('songsu/fetchGetPopup')
    //     if (getPopup.value) {
    //       const arr = JSON.parse(JSON.stringify(getPopup.value))
    //       console.log('getPopup: ', arr.data)
    //       let flag = true
    //       if (arr.data && arr.data.length > 0) {
    //         for (let i = 0; i < arr.data.length; i++) {
    //           if (arr.data[i].USE_YN !== arr.data[i].PMS_USE_YN) {
    //             flag = false
    //             PumpIdx.value = arr.data[i].PMP_GRP_IDX
    //             break
    //           }
    //         }
    //         if (!flag) {
    //           popupMsg.value = `${PumpIdx.value}번 펌프를 끄시겠습니까?`
    //           showModal2.value = true
    //         }
    //       } else {
    //         console.log('getPopup data is empty')
    //       }
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }

    // const closeModal2 = (data) => {
    //   showModal2.value = false
    // }

    // const cancelHMI = async () => {
    //   try {
    //     if (PumpIdx.value > 0) {
    //       // insertPopup DB 연동
    //       await store.dispatch('songsu/fetchUpdateCTR_PRF_PMPMST_INF', { search: PumpIdx.value })
    //       if (updateCTR.value) {
    //         const jsonData = JSON.parse(JSON.stringify(updateCTR.value))
    //         if (jsonData.message !== 'ok') {
    //           // 실패했을 경우에 대한 처리는 기존 소스에 없음
    //           console.log('action: fetchUpdateCTR_PRF_PMPMST_INF', ' error message: ', jsonData.message)
    //         }
    //       }
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   } finally {
    //     closeModal2()
    //   }
    // }

    // const updateHMI = async () => {
    //   try {
    //     const parm = [
    //       { search: '745-617-PMK-4114', search2: '1' },
    //       { search: '745-617-PMK-4117', search2: '1' },
    //       { search: '745-617-PMK-4120', search2: '1' },
    //       { search: '745-617-PMK-4123', search2: '1' }
    //     ]
    //     if (PumpIdx.value > 0) {
    //       // insertPopup DB 연동
    //       await store.dispatch('songsu/fetchInsertPopup', parm[PumpIdx.value - 1])
    //       if (insertPopup.value) {
    //         const jsonData = JSON.parse(JSON.stringify(insertPopup.value))
    //         if (jsonData.message !== 'ok') {
    //           // 실패했을 경우에 대한 처리는 기존 소스에 없음
    //           console.log('action: fetchInsertPopup', ' error message: ', jsonData.message)
    //         }
    //       }
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   } finally {
    //     closeModal2()
    //   }
    // }

    const executeApis = async () => {
      await getData()
    }

    onMounted(async () => {
      await executeApis() // 첫 번째 실행에서 getData와 getAiPopup이 완료될 때까지 기다림
      // 1분 마다 데이터 갱신 및 AI 팝업 확인
      executeInterval.value = setInterval(executeApis, 60000)
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
      aiFreqA1,
      aiFreqA2,
      pwrPrdctB,
      tubePrsrPrdctB,
      flowPrdctB,
      freqB1,
      aiPwrA,
      aiTubePrsrA,
      aiFlowA,
      freqA1,
      freqA2,
      aiPwrB,
      aiTubePrsrB,
      aiFlowB,
      aiFreqB1,
      nowPumpStatusA,
      nowPumpStatusB,
      pumpStatusA,
      pumpStatusB,
      showModalDangjin,
      timecountDangjin,
      timecountTaean,
      showModal2,
      showModalTaean,
      popupMsg,
      PumpIdx,
      getOpacityValue,
      cancelPTRDangjin,
      cancelPTRTaean,
      updatePTRDangjin,
      updatePTRTaean
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';
@import '~@/style/AI/songsu.css';

@-webkit-keyframes blinkY1{
0%{opacity:0;}
12% {opacity:0; top: 40%; transform: rotate(90deg);}
24%{opacity: 0.5;   transform: rotate(90deg);}
36%{opacity: 1;  transform: rotate(90deg);}
48%{opacity: 0.5;    transform: rotate(90deg);}
60% {opacity:0; top: 53%; transform: rotate(90deg);}
72%{opacity:0;}
84%{opacity:0;}
100%{opacity:0;}
}

@-moz-keyframes blinkY1{
0%{opacity:0;}
12% {opacity:0; top: 40%; transform: rotate(90deg);}
24%{opacity: 0.5;   transform: rotate(90deg);}
36%{opacity: 1;  transform: rotate(90deg);}
48%{opacity: 0.5;    transform: rotate(90deg);}
60% {opacity:0; top: 53%; transform: rotate(90deg);}
72%{opacity:0;}
84%{opacity:0;}
100%{opacity:0;}
}

@keyframes blinkY1{
0%{opacity:0;}
12% {opacity:0; top: 40%; transform: rotate(90deg);}
24%{opacity: 0.5;   transform: rotate(90deg);}
36%{opacity: 1;  transform: rotate(90deg);}
48%{opacity: 0.5;    transform: rotate(90deg);}
60% {opacity:0; top: 53%; transform: rotate(90deg);}
72%{opacity:0;}
84%{opacity:0;}
100%{opacity:0;}
}

.ai_pump_start {
width: 100%;
height: 100%;
text-align: center;
font-size: 20px;
color: white;
}

.ai_pump_start2 {
height: calc(55% - 10px);
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

.ai_pump_start_bottom {
height: 38%;
width: 100%;
margin-top: 10px;

.bottom_area {
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px 0 10px 0;
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
height: calc(58% - 5px);
width: 100%;
// margin-bottom: 10px;
background: url('@/assets/img/analysis/table_bg_03.png') no-repeat;
background-size: 101% 104%;
background-position: center;

.pump_area2 {
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5px 0 10px 0;
}

.middle {
  height: calc(100% - 140px);
  width: calc(100% - 15px);
  margin-left: 15px;
}
}

.pump_area_bottom {
height: 50%;
width: 100%;
background: url('@/assets/img/analysis/table_bg_03.png') no-repeat;
background-size: 101% 104%;
background-position: center;

.bottom_image_area {
  height: calc(56%);
  width: calc(100% - 15px);
  margin-left: 15px;
}
}

.bottom_pipe_line {
width: 98%;
height: 70%;
background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
background-size: 100% 26px;
background-position: center;
margin-left: -4px;
margin-top: -4px;
}

.bottom_pipe_line2 {
width: 100%;
height: 40%;
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

.pipe_line_arrow_y {
width: 100%;
height: 90%;
background: url('@/assets/img/ai_song/pipeline_y.png') no-repeat;
background-size: 34px 61%;
background-position: bottom;
display: flex;
flex-direction: column;
margin-top: -18px;
}

.blinkingY1 {
-webkit-animation: blinkY1 5s linear infinite;
-moz-animation: blinkY1 5s linear infinite;
animation: blinkY1 5s linear infinite;
}

.pipe_right_box {
width: 100%;
height: 100%;
background: url('@/assets/img/ai_song/middle.png') no-repeat;
background-size: 100% 100%;
// background-position: bottom;
}

.pipe_right_box2 {
width: 100%;
height: 100px;
margin-top: 35%;
background: url('@/assets/img/ai_song/middle.png') no-repeat;
background-size: 100% 100px;
background-position: center;
}

.pipe_right_box_y {
position: absolute;
width: 30px;
height: 75px;
margin-top: -72px;
left: 61%;
background: url('@/assets/img/analysis/pipeline_un_y.png') no-repeat;
background-size: 100% 100%;
}

.pipe_right_box_x {
width: 330%;
height: 39%;
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

.pipe_line_new {
width: 25%;
height: 50%;
vertical-align: bottom;
display: flex;
margin-left: -3%;
align-items: flex-end;
}
</style>
