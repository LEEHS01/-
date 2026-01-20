<template>
  <div class="contents-body">
    <div class="title_wrap">
      <span class="title">전력 요금제</span>
      <div class="title_line"></div>
    </div>
    <div class="seasonArea">
      <button class="season_btn season_btn_font fL" @click="updateCostSetting()">저장</button>
    </div>
    <!-- divLeftArea -->
    <div class="divLeftArea fL">
      <div class="div_border fL selec_div_top">
        <div class="div_title">요금제별</div>
        <div v-for="(rate, index) in rates" :key="index" class="bigListFont bigListCont" :style="rateItemStyle(index)" @click="changeRate(index)">
          {{ rate.name }}
        </div>
      </div>
      <div class="div_border fL selec_div_bottom">
        <div class="div_title">계절별</div>
        <div v-for="(season, index) in seasons" :key="index" class="bigListFont bigListCont" :style="seasonItemStyle(index)" @click="changeSeason(index)">
          {{ season }}
        </div>
      </div>
    </div>
    <div class="blinking arrow_img fL"></div>
    <!-- divRightArea  -->
    <div class="backArea">
      <div class="topArea">
        <div class="div_topbox div_border">
          <div class="div_title">기본요금</div>
          <div class="div_bottombox">
            <input type="text" class="top_textinput" v-model="bRate">
            <span class="topUnitFont">원</span>
            <div class="value_bottom_img"></div>
          </div>
        </div>
        <div class="div_topbox div_border">
          <div class="div_title">경부화</div>
          <div class="div_bottombox">
            <input type="text" class="top_textinput" v-model="lRate">
            <span class="topUnitFont">원</span>
            <div class="value_bottom_img"></div>
          </div>
        </div>
        <div class="div_topbox div_border">
          <div class="div_title">중간부하</div>
          <div class="div_bottombox">
            <input type="text" class="top_textinput" v-model="mRate">
            <span class="topUnitFont">원</span>
            <div class="value_bottom_img"></div>
          </div>
        </div>
        <div class="div_topbox div_border">
          <div class="div_title">최대부하</div>
          <div class="div_bottombox">
            <input type="text" class="top_textinput" v-model="hRate">
            <span class="topUnitFont">원</span>
            <div class="value_bottom_img"></div>
          </div>
        </div>
        <div class="div_topbox div_border">
          <div class="div_title">기후환경요금</div>
          <div class="div_bottombox">
            <input type="text" class="top_textinput" v-model="eRate">
            <span class="topUnitFont">원</span>
            <div class="value_bottom_img"></div>
          </div>
        </div>
        <div class="div_topbox div_border">
          <div class="div_title">연료비조정액</div>
          <div class="div_bottombox">
            <input type="text" class="top_textinput" v-model="fRate">
            <span class="topUnitFont">원</span>
            <div class="value_bottom_img"></div>
          </div>
        </div>
      </div>
      <!-- bottomArea -->
      <div class="bottomArea">
        <div class="div_title">시간별 부하설정</div>
        <div class="bottomBox">
          <div class="bottomValBox div_border">
            <div class="bottomContentsImg">
              <span class="comboFont">00시~01시</span>
              <select class="drop-down" v-model="selectedComboBox[0]">
                <option v-for="(item, idx) in comboBoxList[0]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">01시~02시</span>
              <select class="drop-down" v-model="selectedComboBox[1]">
                <option v-for="(item, idx) in comboBoxList[1]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">02시~03시</span>
              <select class="drop-down" v-model="selectedComboBox[2]">
                <option v-for="(item, idx) in comboBoxList[2]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">03시~04시</span>
              <select class="drop-down" v-model="selectedComboBox[3]">
                <option v-for="(item, idx) in comboBoxList[3]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">04시~05시</span>
              <select class="drop-down" v-model="selectedComboBox[4]">
                <option v-for="(item, idx) in comboBoxList[4]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">05시~06시</span>
              <select class="drop-down" v-model="selectedComboBox[5]">
                <option v-for="(item, idx) in comboBoxList[5]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
          </div>
          <div class="bottomValBox div_border">
            <div class="bottomContentsImg">
              <span class="comboFont">06시~07시</span>
              <select class="drop-down" v-model="selectedComboBox[6]">
                <option v-for="(item, idx) in comboBoxList[6]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">07시~08시</span>
              <select class="drop-down" v-model="selectedComboBox[7]">
                <option v-for="(item, idx) in comboBoxList[7]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">08시~09시</span>
              <select class="drop-down" v-model="selectedComboBox[8]">
                <option v-for="(item, idx) in comboBoxList[8]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">09시~10시</span>
              <select class="drop-down" v-model="selectedComboBox[9]">
                <option v-for="(item, idx) in comboBoxList[9]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">10시~11시</span>
              <select class="drop-down" v-model="selectedComboBox[10]">
                <option v-for="(item, idx) in comboBoxList[10]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">11시~12시</span>
              <select class="drop-down" v-model="selectedComboBox[11]">
                <option v-for="(item, idx) in comboBoxList[11]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
          </div>
          <div class="bottomValBox div_border">
            <div class="bottomContentsImg">
              <span class="comboFont">12시~13시</span>
              <select class="drop-down" v-model="selectedComboBox[12]">
                <option v-for="(item, idx) in comboBoxList[12]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">13시~14시</span>
              <select class="drop-down" v-model="selectedComboBox[13]">
                <option v-for="(item, idx) in comboBoxList[13]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">14시~15시</span>
              <select class="drop-down" v-model="selectedComboBox[14]">
                <option v-for="(item, idx) in comboBoxList[14]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">15시~16시</span>
              <select class="drop-down" v-model="selectedComboBox[15]">
                <option v-for="(item, idx) in comboBoxList[15]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">16시~17시</span>
              <select class="drop-down" v-model="selectedComboBox[16]">
                <option v-for="(item, idx) in comboBoxList[16]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">17시~18시</span>
              <select class="drop-down" v-model="selectedComboBox[17]">
                <option v-for="(item, idx) in comboBoxList[17]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
          </div>
          <div class="bottomValBox div_border">
            <div class="bottomContentsImg">
              <span class="comboFont">18시~19시</span>
              <select class="drop-down" v-model="selectedComboBox[18]">
                <option v-for="(item, idx) in comboBoxList[18]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">19시~20시</span>
              <select class="drop-down" v-model="selectedComboBox[19]">
                <option v-for="(item, idx) in comboBoxList[19]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">20시~21시</span>
              <select class="drop-down" v-model="selectedComboBox[20]">
                <option v-for="(item, idx) in comboBoxList[20]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">21시~22시</span>
              <select class="drop-down" v-model="selectedComboBox[21]">
                <option v-for="(item, idx) in comboBoxList[21]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">22시~23시</span>
              <select class="drop-down" v-model="selectedComboBox[22]">
                <option v-for="(item, idx) in comboBoxList[22]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </div>
            <div class="bottomContentsImg">
              <span class="comboFont">23시~24시</span>
              <select class="drop-down" v-model="selectedComboBox[23]">
                <option v-for="(item, idx) in comboBoxList[23]" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
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
import log from '@/logger.js'

export default {
  setup () {
    const store = useStore()
    const selectRtInfo = computed(() => store.getters['costSetting/getSelectRtInfo'])
    const selectRT = computed(() => store.getters['costSetting/getSelectRT'])
    const updateRT = computed(() => store.getters['costSetting/getUpdateRT'])

    const rates = ref([])
    const selectedRate = ref(-1)
    const bRate = ref(null)
    const lRate = ref(null)
    const mRate = ref(null)
    const hRate = ref(null)
    const eRate = ref(null)
    const fRate = ref(null)
    const seasons = ['봄', '여름', '가을', '겨울']
    const selectedSeason = ref(-1)
    const comboBoxList = ref(Array.from({ length: 24 }, () => ['경부하', '중부하', '최대부하']))
    const selectedComboBox = ref(Array(24).fill('경부하'))

    const getRates = async () => {
      try {
        await store.dispatch('costSetting/fetchSelectRtInfo')
        if (selectRtInfo.value && selectRtInfo.value.length > 0) {
          const result = JSON.parse(JSON.stringify(selectRtInfo.value))
          for (let i = 0; i < result.length; i++) {
            let rateIdx = String(result[i].RATE_IDX)
            rateIdx = rateIdx.substring(rateIdx.length - 1)
            rates.value[i] = {
              rateIdx: rateIdx,
              name: result[i].MIDDLE_CTGRY + result[i].SMALL_CTGRY
            }
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const changeRate = (index) => {
      try {
        selectedRate.value = index
        if (selectedSeason.value === -1) {
          changeSeason(0)
        } else {
          changeSeason(selectedSeason.value)
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const changeSeason = async (index) => {
      try {
        if (selectedRate.value === -1) {
          alert('요금제를 먼저 선택하세요')
          return
        }
        selectedSeason.value = index
        const param = {
          rate: rates.value[selectedRate.value].rateIdx,
          season: seasons[index] + '철'
        }

        await store.dispatch('costSetting/fetchSelectRT', param)
        if (selectRT.value) {
          const arr = JSON.parse(JSON.stringify(selectRT.value))
          if (arr.length === 0) {
            return
          }
          let data = []
          data = arr.data
          if (data.length > 0) {
            updateData(data)
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const updateData = (data) => {
      bRate.value = data[0].BASE_RATE
      eRate.value = data[0].ENVRNMNT_RATE
      fRate.value = data[0].FUELCOST_RATE
      for (let i = 0; i < data.length; i++) {
        if (data[i].TIMEZONE === 'L') {
          lRate.value = data[i].ELCTR_RATE
          selectedComboBox.value[i] = '경부하'
        } else if (data[i].TIMEZONE === 'M') {
          mRate.value = data[i].ELCTR_RATE
          selectedComboBox.value[i] = '중부하'
        } else if (data[i].TIMEZONE === 'H') {
          hRate.value = data[i].ELCTR_RATE
          selectedComboBox.value[i] = '최대부하'
        }
      }
    }

    const updateCostSetting = async () => {
      // 전력 요금제 저장
      try {
        if (selectedRate.value === -1) {
          alert('요금제를 먼저 선택하세요')
          return
        }

        const confirmFlag = confirm('저장하시겠습니까?')
        if (confirmFlag) {
          if (bRate.value === '' || lRate.value === '' ||
              mRate.value === '' || hRate.value === '' ||
              eRate.value === '' || fRate.value === '') {
            alert('요금을 입력해주세요.')
            return
          }

          const time = []
          for (let i = 0; i < 24; i++) {
            let timezone = 'L'
            if (selectedComboBox.value[i] === '경부하') {
              timezone = 'L'
            } else if (selectedComboBox.value[i] === '중부하') {
              timezone = 'M'
            } else if (selectedComboBox.value[i] === '최대부하') {
              timezone = 'H'
            }
            time.push({
              stn_tm: String(i).padStart(2, '0'),
              timezone: timezone
            })
          }
          const param = {
            rate: rates.value[selectedRate.value].rateIdx,
            season: seasons[selectedSeason.value] + '철',
            env_rate: eRate.value,
            fuel_rate: fRate.value,
            base_rate: bRate.value,
            rate_L: lRate.value,
            rate_M: mRate.value,
            rate_H: hRate.value,
            time: time
          }

          await store.dispatch('costSetting/fetchUpdateRT', param)
          if (updateRT.value && updateRT.value.length !== 0) {
            const jsonData = JSON.parse(JSON.stringify(updateRT.value))
            if (jsonData.message !== 'ok') {
              // console.log('action: fetchUpdateRT', ' error message: ', jsonData.message)
              return
            }
          }
          alert('저장되었습니다.')
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const rateItemStyle = computed(() => {
      return (index) => ({
        background: selectedRate.value === index ? `url(${require('@/assets/img/pump/text_input_bg.png')}) no-repeat` : 'none',
        backgroundSize: selectedRate.value === index ? '100% 100%' : 'none',
        backgroundRepeat: selectedRate.value === index ? 'no-repeat' : 'none'
      })
    })

    const seasonItemStyle = computed(() => {
      return (index) => ({
        background: selectedSeason.value === index ? `url(${require('@/assets/img/pump/text_input_bg.png')}) no-repeat` : 'none',
        backgroundSize: selectedSeason.value === index ? '100% 100%' : 'none',
        backgroundRepeat: selectedSeason.value === index ? 'no-repeat' : 'none'
      })
    })

    onMounted(() => {
      getRates()
    })

    return {
      rates,
      selectedRate,
      bRate,
      lRate,
      mRate,
      hRate,
      eRate,
      fRate,
      seasons,
      comboBoxList,
      selectedComboBox,
      rateItemStyle,
      seasonItemStyle,
      changeRate,
      changeSeason,
      updateCostSetting
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/layout.scss';
@import '~@/style/component/title.scss';

.contents-body {
  height: 100%;
  width: 100%;
  margin-left: 15px;
}

.seasonArea {
  height: 52px;
  width: 100%;
  display: fLex;
  justify-content: fLex-end;

  .season_btn_font {
    text-shadow: 0 0 9px #5cafff;
    font-size: 16px;
    letter-spacing: normal;
    color: #fff;
    font-family: 'KHNPHDRegular';
    text-align: center;
    line-height: 29px;
  }

  .season_btn {
    width: 7%;
    height: 60%;
    align-self: center;
    border: solid 1px #b4dffa;
    background-color: rgba(139, 194, 240, 0.25);
    cursor: pointer;
    border-radius: 4px;
    margin-left: 17px;
  }
}

.divLeftArea {
  width: 22%;
  height: 87%;
}

.div_border {
  background-image: url('@/assets/img/box_bg_small.png');
  background-size: 100% 100%;
}

.selec_div_top {
  width: 98%;
  height: 32%;
}

.selec_div_bottom {
  width: 98%;
  height: 58%;
  margin-top: 34px;
}

.bigListFont {
  font-family: KHNPHDRegular;
  font-size: 21px;
  color: white;
  text-shadow: 0 0 9px #5cafff;
}

.bigListCont {
  width: 100%;
  height: 57px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  line-height: 64px;
}

.arrow_img {
  width: 2%;
  height: 50%;
  background: url('@/assets/img/ai_arrow_right.png');
  background-size: 100% 100%;
  mix-blend-mode: color-dodge;
  margin-right: 1%;
  margin-top: 60px;
}

.backArea {
  display: fLex;
  fLex-direction: column;
  height: 87%;
}

.topArea {
  width: 100%;
  height: 32%;
  display: fLex;
  justify-content: space-between;
}

.div_topbox {
  width: 15.5%;
  height: 100%;
}

.div_bottombox {
  width: 100%;
  height: 77%;
  text-align: center;
}

.top_textinput {
  height: 19%;
  width: 54%;
  display: inline-block;
  margin-top: 51px;
  border: 1px solid #489cf2;
  background-color: #15284e;
  color: #fff;
  font-family: LABDigital;
  text-align: center;
  font-size: 20px;
  letter-spacing: 4px;
}

.topUnitFont {
  color: #ffffff;
  font-family: 'KHNPHDRegular';
  font-size: 18px;
  text-shadow: 0 0 10px #000;
  margin-left: 10px;
}

.value_bottom_img {
  background-image: url('@/assets/img/bottom_aura.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 24%;
  width: 94%;
  display: inline-block;
}

.bottomArea {
  display: fLex;
  fLex-direction: column;
  width: 100%;
  height: 58%;
  margin-top: 34px;
}

.bottomBox {
  display: fLex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

.bottomValBox {
  height: 100%;
  width: 24%;
  text-align: center;
}

.bottomContentsImg {
  height: calc(100% / 6);
  background: url('@/assets/img/ai_song/one_pump.png') no-repeat;
  background-size: 100% 100%;
}

.comboFont {
  color: #ffffff;
  font-family: 'KHNPHDRegular';
  font-size: 15px;
  text-shadow: 0 0 10px #000;
  margin-right: 30px;
  line-height: 47px;
}

.comboBox {
  background-color: #15284e;
  color: #fff;
  width: 169px;
  font-size: 15px;
  font-family: KHNPHDRegular;
  margin-top: 5px;
}

.drop-down {
  color: white;
  background-color: #15284e;
  border-color: #489cf2;
  width: 169px;
  height: 45%;
  font-family: 'KHNPHDRegular';
  font-size: 15px;
  padding: 4px 10px 4px 10px;
  margin: 5px;
  border-radius: 4px;
}
</style>
