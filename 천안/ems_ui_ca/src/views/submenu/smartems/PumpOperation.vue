<template>
  <div class="title_wrap">
    <span class="title">송수펌프 운영</span>
    <div class="title_line"></div>
  </div>
  <div class="pump_operate_bg">
    <div class="pump_operate">
      <div class="fL div-middle pump_operate2">
        <div style="padding: 0 25px 10px 25px; width: calc(100% - 50px);  height: calc(100% - 10px);">
          <div class="div_title">
            <span style="width: 100%;"> 펌프 운영 관리 </span>
          </div>
          <!-- 범례 및 조건 버튼 영역 -->
          <div class="div_content1">
            <div class="pump_condition">
              <!-- 왼쪽 영영 > 범례 -->
              <div class="div_legend fL">
                <div class="div_legend_top"> 경부하 <div class="div_legend_color" style="background-color: #0080008f;"></div> 중부하 <div class="div_legend_color" style="background-color: #ffff008f;"></div> 최대부하 <div class="div_legend_color" style="background-color: #ff00008f;"></div>
                </div>
              </div>
              <!-- 오른쪽 영영 > 조건 버튼 영역 -->
              <div class="div_content1_right fL pump_right_condition">
                <!-- top 영역 -->
                <div class="right_top"> 현재 적용 중인 계절은 <span class="nowInfoText">{{currentSeason}} </span> 입니다. </div>
              </div>
              <!-- 적용 버튼 영역 -->
              <div class="right_select fR">
                <span class="button fR button_setting" @click="updateOperMode()">적용</span>
              </div>
            </div>
            <!-- 시간대 -->
            <div class="pump_timeZone">
              <div class="div_content1_left div_box_border div-flex-center fL">시간대
                <select class="drop-down" v-model="selectedSeason" @change="changeSeason">
                  <option v-for="(season, idx) in seasonList" :key="idx" :value="season">
                    {{season}}
                  </option>
                </select>
              </div>
              <div class="div_content1_right div_box_border  fL" style=" display: flex;  justify-content: center;">
                <div
                  v-for="item in timeList"
                  :key="item.STN_TM"
                  class="div_content_col"
                  :style="{'background-color': getTimezoneColor(item.TIMEZONE)}">
                  {{ item.STN_TM }}
                </div>
              </div>
            </div>
            <!-- 배수지 조건 -->
            <div class="pump_baesuji">
              <div class="div_content1_left fL" style="width: calc(20% - 10px);  height: 100%;">
                <div class="div-flex-center div_box_border fL" style="width: calc(60% - 16px);  height: calc(100% - 6px);  margin-right: 10px;">관압모드</div>
                <div class="div-flex-center div_box_border fL" style="width: calc(40% - 6px);height: calc(50% - 11px);margin-bottom: 10px;">고압</div>
                <div class="div-flex-center div_box_border fL" style="width: calc(40% - 6px);height: calc(50% - 11px);">저압</div>
              </div>
              <div class="fL" style="width: 80%; height: 100%">
                <div class="div_content1_right2 div-flex-center div_box_border fL" style="margin-bottom: 10px;">
                  <div class="div_content_col2" v-for="item in timeList"
                    :key="'H' + item.STN_TM">
                    <div class="div_content_col2_status cursor_P"
                      :class="getValveModeClass('H', item.STN_TM)"
                      @click="toggleValveMode('H', item.STN_TM)">
                    </div>
                  </div>
                </div>
                <div class="div_content1_right2 div-flex-center div_box_border fL">
                  <div class="div_content_col2" v-for="item in timeList"
                    :key="'H' + item.STN_TM">
                    <div class="div_content_col2_status cursor_P"
                      :class="getValveModeClass('L', item.STN_TM)"
                      @click="toggleValveMode('L', item.STN_TM)">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 펌프 우선 순위 -->
    <div class="pump_priority">
      <div class="fL div-middle" style="height: 100%; width: 100%; background: none;">
        <div style="padding: 0 25px 10px 25px; width: calc(100% - 50px);  height: calc(100% - 10px);">
          <div class="div_title">
            <span style="  width: 100%;">펌프 우선 순위</span>
            <span class="button fR button_setting" style="text-align: left; width: 70px;" @click="updatePriority()">적용</span>
          </div>
          <div class="div_content2">
            <!-- left -->
            <div class="fL" style="width: 18%; height: 100%; margin: 0 1%">
              <!-- left design -->
              <div class="fL left_design"></div>
              <!-- left category -->
              <div class="fL left_category">
                <div class="div_content2_left_category div_box_border fL"></div>
                <div class="div_content2_left_category fL" style=" width: 100%;  height: calc(100% / 5 - 5px);">
                  <div class="div_content2_left_category1 div_box_border fL">운영자 지정</div>
                  <input type="radio" name="type" class="div_content2_left_category2 fL cursor_P" :checked="rank1Selected" @click="selectRank(1)" />
                </div>
                <div class="div_content2_left_category fL" style=" width: 100%;  height: calc(100% / 5 - 5px);">
                  <div class="div_content2_left_category1 div_box_border fL">우선순위 분석</div>
                  <input type="radio" name="type" class="div_content2_left_category2 fL cursor_P" :checked="rank2Selected" @click="selectRank(2)" />
                </div>
                <div class="div_content2_left_category div_box_border fL">현재 가동 가능한 펌프</div>
                <div class="div_content2_left_category div_box_border fL">결과 값</div>
              </div>
            </div>
            <!-- right -->
            <div class="fL" style="width: calc(80% - 35px); height: 100%;">
              <div class="div_content2_right_col fL">
                <div class="div_content2_right_category div_box_title_border fL">천안(가) #1</div>
                <input class="div_content2_right_category div_box_border fL" v-model="operatorAssignment[0]"/>
                <input class="div_content2_right_category div_box_border fL" v-model="priorityAnalysis[0]" />
                <div class="div_content2_right_category div_box_border fL">
                  <select class="drop-down-pump" v-model="selectedPumpUse[0]">
                    <option v-for="(item, idx) in pumpUseList[0]" :key="idx" :value="item">
                      {{item}}
                    </option>
                  </select>
                </div>
                <div class="div_content2_right_category div_box_border fL">{{ resultValue[0] }}</div>
              </div>
              <div class="div_content2_right_col fL">
                <div class="div_content2_right_category div_box_title_border fL">천안(가) #2</div>
                <input class="div_content2_right_category div_box_border fL" v-model="operatorAssignment[1]"/>
                <input class="div_content2_right_category div_box_border fL" v-model="priorityAnalysis[1]" />
                <div class="div_content2_right_category div_box_border fL">
                  <select class="drop-down-pump" v-model="selectedPumpUse[1]">
                    <option v-for="(item, idx) in pumpUseList[1]" :key="idx" :value="item">
                      {{item}}
                    </option>
                  </select>
                </div>
                <div class="div_content2_right_category div_box_border fL">{{ resultValue[1] }}</div>
              </div>
              <div class="div_content2_right_col fL">
                <div class="div_content2_right_category div_box_title_border fL">천안(가) #3</div>
                <input class="div_content2_right_category div_box_border fL" v-model="operatorAssignment[2]"/>
                <input class="div_content2_right_category div_box_border fL" v-model="priorityAnalysis[2]" />
                <div class="div_content2_right_category div_box_border fL">
                  <select class="drop-down-pump" v-model="selectedPumpUse[2]">
                    <option v-for="(item, idx) in pumpUseList[2]" :key="idx" :value="item">
                      {{item}}
                    </option>
                  </select>
                </div>
                <div class="div_content2_right_category div_box_border fL">{{ resultValue[2] }}</div>
              </div>
              <div class="div_content2_right_col fL">
                <div class="div_content2_right_category div_box_title_border fL">목천(가) #1</div>
                <input class="div_content2_right_category div_box_border fL" v-model="operatorAssignment[3]"/>
                <input class="div_content2_right_category div_box_border fL" v-model="priorityAnalysis[3]" />
                <div class="div_content2_right_category div_box_border fL">
                  <select class="drop-down-pump" v-model="selectedPumpUse[3]">
                    <option v-for="(item, idx) in pumpUseList[3]" :key="idx" :value="item">
                      {{item}}
                    </option>
                  </select>
                </div>
                <div class="div_content2_right_category div_box_border fL">{{ resultValue[3] }}</div>
              </div>
              <div class="fL" style="width: 12px; height: 100%;"></div>
              <div class="div_content2_right_col fL">
                <div class="div_content2_right_category div_box_title_border fL">목천(가) #2</div>
                <input class="div_content2_right_category div_box_border fL" v-model="operatorAssignment[4]"/>
                <input class="div_content2_right_category div_box_border fL" v-model="priorityAnalysis[4]" />
                <div class="div_content2_right_category div_box_border fL">
                  <select class="drop-down-pump" v-model="selectedPumpUse[4]">
                    <option v-for="(item, idx) in pumpUseList[4]" :key="idx" :value="item">
                      {{item}}
                    </option>
                  </select>
                </div>
                <div class="div_content2_right_category div_box_border fL">{{ resultValue[4] }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { plusZeroDay } from '@/utils/utils.js'
import log from '@/logger.js'

export default {
  setup () {
    const store = useStore()
    const selectCTR = computed(() => store.getters['pumpOperation/getSelectCTR'])
    const updateCTR = computed(() => store.getters['pumpOperation/getUpdateCTR'])
    const updateCTR2 = computed(() => store.getters['pumpOperation/getUpdateCTR2'])
    const mergePTR = computed(() => store.getters['pumpOperation/getMergePTR'])
    const mergeOPER = computed(() => store.getters['pumpOperation/getMergeOPER'])
    const selectRT = computed(() => store.getters['pumpOperation/getSelectRT'])

    // 펌프 운영 관리 관련
    const seasonList = ['봄', '여름', '가을', '겨울']
    const timeList = ref([])
    const modeList = ref([])

    const getCurrentSeason = () => {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth() + 1

      if (currentMonth >= 3 && currentMonth <= 5) {
        return '봄'
      } else if (currentMonth >= 6 && currentMonth <= 8) {
        return '여름'
      } else if (currentMonth >= 9 && currentMonth <= 11) {
        return '가을'
      } else {
        return '겨울'
      }
    }

    const currentSeason = ref(getCurrentSeason())
    const selectedSeason = ref(getCurrentSeason())

    const changeSeason = () => {
      getPumpOperMode()
    }

    const getPumpOperMode = async () => {
      try {
        const param = {
          rate: '7',
          season: selectedSeason.value + '철'
        }

        await store.dispatch('pumpOperation/fetchSelectRT', param)
        if (selectRT.value) {
          const arr = JSON.parse(JSON.stringify(selectRT.value))
          if (arr.length === 0) {
            return
          }
          let data = []
          let data2 = []
          data = arr.data
          data2 = arr.data2
          if (data.length > 0 && data2.length > 0) {
            timeList.value = data
            modeList.value = data2
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const getTimezoneColor = (timezone) => {
      if (timezone === 'L') {
        return '#0080008f'
      } else if (timezone === 'M') {
        return '#ffff008f'
      } else if (timezone === 'H') {
        return '#ff00008f'
      }
    }

    const getValveModeClass = (mode, time) => {
      const index = parseInt(time)
      // db의 마지막 저장된 값으로 설정
      const timeData = modeList.value[modeList.value.length - 1]
      if (mode === 'H') {
        return {
          mode_off: !timeData || timeData['c' + index] === '1',
          mode_on: timeData && timeData['c' + index] === '0'
        }
      } else {
        return {
          mode_off: !timeData || timeData['c' + index] === '0',
          mode_on: timeData && timeData['c' + index] === '1'
        }
      }
    }

    const toggleValveMode = (mode, time) => {
      const index = parseInt(time)
      const timeData = modeList.value[modeList.value.length - 1]

      if (timeData) {
        if (mode === 'H') {
          timeData['c' + index] = '0'
        } else {
          timeData['c' + index] = '1'
        }
      }
    }

    const updateOperMode = async () => {
      // 펌프 운영 관리 적용
      try {
        const confirmFlag = confirm('모드를 저장하시겠습니까?')
        if (confirmFlag) {
          const arr = []
          const timeData = modeList.value[modeList.value.length - 1]

          for (let i = 0; i < 24; i++) {
            const no = plusZeroDay(i)
            const value = timeData['c' + i]
            if (currentSeason.value === selectedSeason.value) {
              const param = {
                NO: '745-617-EMS-14' + no,
                VALUE: value,
                USERID: selectedSeason.value + '철',
                SEASON: selectedSeason.value + '철'
              }
              await store.dispatch('pumpOperation/fetchMergePTR', param)
              if (mergePTR.value && mergePTR.value.length !== 0) {
                const jsonData = JSON.parse(JSON.stringify(mergePTR.value))
                if (jsonData.message !== 'ok') {
                  // 실패했을 경우에 대한 처리는 기존 소스에 없음
                  // console.log('action: fetchMergePTR', ' error message: ', jsonData.message)
                }
              }
            }
            arr.push({ NO: i, VALUE: value })
          }
          const param2 = {
            userid: selectedSeason.value + '철',
            season: selectedSeason.value + '철'
          }

          for (let i = 0; i < 24; i++) {
            param2['c' + i] = arr[i].VALUE
          }
          await store.dispatch('pumpOperation/fetchMergeOPER', param2)
          if (mergeOPER.value && mergeOPER.value.length !== 0) {
            const jsonData = JSON.parse(JSON.stringify(mergeOPER.value))
            if (jsonData.message !== 'ok') {
              // console.log('action: fetchMergeOPER', ' error message: ', jsonData.message)
              return
            }
          }
          alert('저장되었습니다.')
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    // 펌프 우선 순위 관련
    const rank1Selected = ref(true)
    const rank2Selected = ref(false)

    const selectRank = (rank) => {
      if (rank === 1) {
        rank1Selected.value = true
        rank2Selected.value = false
      } else if (rank === 2) {
        rank1Selected.value = false
        rank2Selected.value = true
      }
    }

    const operatorAssignment = ref([])
    const priorityAnalysis = ref([])
    const pumpUseList = ref([])
    const selectedPumpUse = ref([])
    const pumpLen = 9
    for (let i = 0; i < pumpLen; i++) {
      pumpUseList.value[i] = ['사용', '미사용']
      selectedPumpUse.value[i] = '미사용'
    }
    const resultValue = ref([])

    const getPumpPriority = async () => {
      try {
        await store.dispatch('pumpOperation/fetSelectCTR')
        if (selectCTR.value && selectCTR.value.length > 0) {
          const result = JSON.parse(JSON.stringify(selectCTR.value))
          for (let i = 0; i < result.length; i++) {
            operatorAssignment.value[i] = result[i].USER_RNK
            priorityAnalysis.value[i] = result[i].ANLY_RNK
            pumpUseList.value[i] = ['사용', '미사용']
            if (result[i].USE_YN === '1') {
              selectedPumpUse.value[i] = '사용'
            } else {
              selectedPumpUse.value[i] = '미사용'
            }
            resultValue.value[i] = result[i].PRRT_RNK
            if (result[i].USER_RNK !== result[i].PRRT_RNK) {
              // 운영자 지정과 결과 값이 다르면 우선순위 분석 모드로 변경
              selectRank(2)
            }
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const updatePriority = async () => {
      // 펌프 우선 순위 적용
      try {
        const confirmFlag = confirm('펌프 우선 순위를 적용하시겠습니까?')
        if (confirmFlag) {
          const isInRange = (num, max) => !isNaN(num) && num >= 1 && num <= max
          const validateNum = (num, num2, max, message) => {
            if (!isInRange(num, max) || !isInRange(num2, max)) {
              alert(message)
              return false
            }
            return true
          }

          // 천안(가) 펌프 3개
          let list = []
          let list2 = []
          for (let i = 0; i < 3; i++) {
            const num = parseInt(operatorAssignment.value[i])
            const num2 = parseInt(priorityAnalysis.value[i])
            if (!validateNum(num, num2, 3, '해당 숫자만 입력해주세요. (천안(가):1~3)')) {
              return
            }
            list.push(num)
            list2.push(num2)
          }
          if (new Set(list).size !== 3 || new Set(list2).size !== 3) {
            alert('우선순위가 겹치지 않도록 입력해주세요. (천안(가))')
            return
          }

          // 목천(가)생활 펌프 2개
          list = []
          list2 = []
          for (let i = 3; i < 5; i++) {
            const num = parseInt(operatorAssignment.value[i])
            const num2 = parseInt(priorityAnalysis.value[i])
            if (!validateNum(num, num2, 2, '해당 숫자만 입력해주세요. (목천(가):1~2)')) {
              return
            }
            list.push(num)
            list2.push(num2)
          }
          if (new Set(list).size !== 2 || new Set(list2).size !== 2) {
            alert('우선순위가 겹치지 않도록 입력해주세요. (목천(가))')
            return
          }

          const result = JSON.parse(JSON.stringify(selectCTR.value))
          for (let i = 0; i < result.length; i++) {
            const param = {
              PMP_IDX: result[i].PMP_IDX,
              PRRT_RNK: rank1Selected.value === true ? operatorAssignment.value[i] : priorityAnalysis.value[i],
              flag: rank1Selected.value === true ? '1' : '2',
              USE_YN: selectedPumpUse.value[i] === '사용' ? '1' : '0'
            }
            await store.dispatch('pumpOperation/fetchUpdateCTR', param)
            if (updateCTR.value && updateCTR.value.length !== 0) {
              const jsonData = JSON.parse(JSON.stringify(updateCTR.value))
              if (jsonData.message !== 'ok') {
                // 실패했을 경우에 대한 처리는 기존 소스에 없음
                // console.log('action: fetchUpdateCTR', ' error message: ', jsonData.message)
              }
            }
          }

          const param2 = {
            flag: rank1Selected.value === true ? '1' : '0'
          }
          await store.dispatch('pumpOperation/fetchUpdateCTR2', param2)
          if (updateCTR2.value && updateCTR2.value.length !== 0) {
            const jsonData = JSON.parse(JSON.stringify(updateCTR2.value))
            if (jsonData.message !== 'ok') {
              // 실패했을 경우에 대한 처리는 기존 소스에 없음
              // console.log('action: fetchUpdateCTR2', ' error message: ', jsonData.message)
            }
          }
          alert('적용이 완료되었습니다.')
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    onMounted(() => {
      getPumpOperMode()
      getPumpPriority()
    })

    return {
      selectedSeason,
      timeList,
      modeList,
      seasonList,
      currentSeason,
      rank1Selected,
      rank2Selected,
      operatorAssignment,
      priorityAnalysis,
      pumpUseList,
      selectedPumpUse,
      resultValue,
      changeSeason,
      getTimezoneColor,
      getValveModeClass,
      toggleValveMode,
      updateOperMode,
      selectRank,
      updatePriority
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';

.pump_operate_bg {
  width: 100%;
  height: calc(100% - 80px);
  margin-top: 20px;
  float: left;

  .pump_operate {
    height: calc(50% - 10px);
    width: calc(100% - 20px);
    padding: 0 10px 20px 10px;

    .pump_operate2 {
      height: 100%;
      width: 100%;
      background: none;
    }
  }

  .pump_condition {
    height: calc(30% - 10px);
    width: calc(100% - 10px);
    margin: 0 10px 10px 0;

    .pump_right_condition {
      width: 70%;
      height: 100%;
      padding: 0;
      float: left;

      .right_top {
        height: calc(50% - 5px);
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
        margin-right: 10px;
        font-size: 15px;
        color: #fff;
        font-family: 'KHNPHDRegular';
        text-shadow: 0 0 3px #4ebfff;
        align-items: center;
      }

      .right_select {
        width: 5%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
      }
    }
  }

  .pump_timeZone {
    height: calc(23.3% - 10px);
    width: calc(100% - 10px);
    margin: 0 10px 10px 0;
  }

  .pump_baesuji {
    height: 46.6%;
    width: calc(100% - 10px);
    margin: 0 10px 0 0;
  }

  .pump_priority {
    height: calc(49% - 10px);
    width: calc(100% - 20px);
    padding: 0 10px 10px 10px;

    .left_design {
      width: 15px;
      margin: 0 10px;
      height: 100%;
      background: url('@/assets/img/image_01.png') no-repeat;
      background-position: bottom;
      background-size: contain;
    }

    .left_category {
      width: calc(100% - 55px);
      height: calc(100% - 15px);
      padding: 10px 10px 5px 10px;
      background: url('@/assets/img/box_bg_big.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}

.mode_on {
  background: url('@/assets/img/pump_O/on.png') no-repeat !important;
}

.mode_off {
  background: url('@/assets/img/pump_O/off.png') no-repeat !important;
  opacity: 0.4;
}

@-webkit-keyframes scale-up-center {
  0% {
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes scale-up-center {
  0% {
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

input[type='radio'] {
  background: none;
  border: none;
}

input[type='radio']:after {
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  background: #15284e;
  border: 10px #15284e;
  box-shadow: 0 0 10px #489cf2;
  border-style: solid;
  border-radius: 50%;
  content: '';
  display: inline-block;
}

input[type='radio']:checked:after {
  -webkit-animation: scale-up-center 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: scale-up-center 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  background: #489cf2;
  border: 10px #15284e;
  box-shadow: 0 0 10px #489cf2;
  border-style: solid;
  border-radius: 50%;
  content: '';
  display: inline-block;
}

.div_title {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.div_content1 {
  width: calc(100% - 30px);
  height: calc(100% - 90px);
  margin-right: 10px;
  padding: 15px;
}

.div_content1_left {
  width: calc(20% - 16px);
  height: calc(100% - 6px);
  margin-right: 10px;
  color: #fff;
  font-family: 'KHNPHDRegular';
}

.div_legend {
  width: calc(20% - 40px);
  height: calc(100% - 30px);
  margin-right: 10px;
  padding: 15px;
  background: url('@/assets/img/div_new.png') center no-repeat;
  background-size: 101% 100%;
  display: flex;
  color: #c3eaff;
  box-shadow: 0 0 5px #0cc7f7b0;
  font-family: 'KHNPHDRegular';
  flex-direction: column;
}

.div_legend_top {
  width: 100%;
  height: 50%;
  float: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.div_legend_color {
  width: 20px;
  height: 20px;
  margin: 0 10px;
  border: 2px solid #ffffff8f;
  border-radius: 5px;
}

.div_content1_right {
  width: calc(80% - 18px);
  height: calc(100% - 18px);
  padding: 5px;
  background: none !important;
}

.div_content1_right2 {
  width: calc(100% - 18px);
  height: calc(50% - 21px);
  background: none !important;
  padding: 5px;
}

.div_content_col {
  width: calc(100% / 24 - 9px);
  height: calc(100% - 4px);
  margin-right: 5px;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'KHNPHDRegular';
  font-size: 16px;
  background-color: #0080008f;
  border: 2px solid #ffffff8f;
  border-radius: 5px;
  color: #fff;
}

.div_content_col2 {
  width: calc(100% / 24 - 9px);
  height: calc(100% - 4px);
  margin-right: 5px;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #0a4cba8f;
  border: 2px solid #0A5AAE8f;
  border-radius: 5px;
  color: #fff;
}

.div_content_col2_status {
  background: url('@/assets/img/pump_O/on.png') no-repeat;
  width: 100%;
  height: 100%;
  background-position: center !important;
}

.div_content2 {
  width: calc(100% - 40px);
  height: calc(100% - 100px);
  padding: 20px;
}

.div_content2_left_category {
  height: calc(100% / 5 - 11px);
  width: calc(100% - 6px);
  margin-bottom: 5px;
  color: #fff;
  font-family: 'KHNPHDRegular';
  display: flex;
  align-items: center;
  text-indent: 20px;
}

.div_content2_left_category1 {
  height: calc(100% - 6px);
  width: calc(80% - 11px);
  margin-right: 5px;
  display: flex;
  align-items: center;
}

.div_content2_left_category2 {
  height: 48px;
  width: 50px;
  background: none;
  border: none;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div_content2_right_category {
  height: calc(100% / 5 - 11px);
  width: calc(100% - 6px);
  margin-bottom: 5px;
  color: #fff;
  font-family: 'KHNPHDRegular';
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.div_content2_right_col {
  width: calc(100% / 5 - 33px);
  height: calc(100% - 15px);
  padding: 10px 10px 5px 10px;
  margin-right: 10px;
  background: url('@/assets/img/box_bg_big.png') no-repeat;
  background-size: 100% 100%;
}

.div-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.div_box_border {
  border: 1px solid #489cf2d1;
  box-shadow: 0 0 3px #489cf2;
  background-color: #0947ae66;
  border-radius: 5px;
}

.div_box_title_border {
  background: #067be6cc;
  border: 3px solid #0cc7f7b0;
  box-shadow: 0 0 5px #0cc7f7b0;
  justify-content: center;
  text-indent: 0;
  border-radius: 5px;
}

.button_setting {
  height: 25px;
  padding: 5px;
}

.nowInfoText {
  color: #489cf2;
  font-size: 20px;
  font-weight: bold;
  text-shadow: none;
  margin: 0 5px;
}

.drop-down {
  color: white;
  background-color: #15284e;
  border-color: #489cf2;
  width: 75px;
  height: 30px;
  font-family: 'KHNPHDRegular';
  font-size: 14px;
  padding: 4px 10px 4px 15px;
  margin-left: 10px;
  border-radius: 4px;
}

.drop-down-pump {
  color: white;
  background-color: #15284e;
  border-color: #489cf2;
  width: 100%;
  height: 50%;
  font-family: 'KHNPHDRegular';
  font-size: 14px;
  padding: 4px 10px 4px 15px;
  margin: 5px;
  border-radius: 4px;
}
</style>
