<template>
  <div class="main">
      <!-- 1계열 물흐름 -->
      <!-- <div class="water-h-flow-img one">
        <div class="buble delay1"></div>
        <div class="buble delay2"></div>
        <div class="buble delay3"></div>
      </div> -->
      <!-- 2계열 물흐름 -->
      <!-- <div class="water-h-flow-img two">
        <div class="buble delay1"></div>
        <div class="buble delay2"></div>
        <div class="buble delay3"></div>
      </div> -->
      <!-- 중앙 첫번째 물흐름 -->
      <div class="water-h-flow-img three">
        <div class="buble-two delay-one1"></div>
        <div class="buble-two delay-one2"></div>
        <div class="buble-two delay-one3"></div>
      </div>
      <!-- 중앙 두번째 물흐름 -->
      <div class="water-h-flow-img three">
        <div class="buble-two delay-two1"></div>
        <div class="buble-two delay-two2"></div>
        <div class="buble-two delay-two3"></div>
      </div>
      <!-- 중앙 세번째 물흐름 -->
      <div class="water-h-flow-img three">
        <div class="buble-two delay-three1"></div>
        <div class="buble-two delay-three2"></div>
        <div class="buble-two delay-three3"></div>
      </div>
      <!-- 마지막 물흐름 -->
      <div class="water-h-flow-img nine">
        <div class="buble delay1"></div>
        <div class="buble delay2"></div>
        <div class="buble delay3"></div>
      </div>
      <!-- 여과 공정 메인 컨텐츠 -->
      <div class="contents-container">
        <!-- 유입 유량 & 유량 합산 -->
        <div class="contents-box-other">
          <!-- <div class="box top" style="height: 31%;">
            <div class="box-top-title">1계열 혼화지 유입 유량</div>
            <div class="box-bottom">
              <div class="box-bottom__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.filter.latest.d1_in_fr)"></div>
              <div class="box-bottom__unit">m<sup>3</sup>/h</div>
            </div>
          </div> -->
          <div class="box top">
            <div class="box-top-title">원수 유입 유량</div>
            <div class="box-bottom">
              <div class="box-bottom__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.filter.latest.b_in_fr)"></div>
              <div class="box-bottom__unit">m<sup>3</sup>/h</div>
            </div>
          </div>
          <!-- <div class="box bottom" style="height: 35%;">
            <div class="box-top-title">혼화지 유입 유량 합산</div>
            <div class="box-bottom">
              <div class="box-bottom__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.filter.latest.d_ser_in_fr)"></div>
              <div class="box-bottom__unit">m<sup>3</sup>/h</div>
            </div>
          </div> -->
        </div>
        <!-- 1지 8지 -->
        <div class="contents-box paddingfix">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji1 == 1 }" @click="openAiModeDialogOfJi(1)">
              </div>
            </div>
            <div class="water-fill ji1" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location1) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :style="isRest(1)" :class="[ this.isFiltering(1) ? 'on' : 'off']" @click="openSbPopup(1)">1지 {{ this.$store.getters['filter/getLocationState1'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location1 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location1 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location1 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location1 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location1) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji8 == 1 }" @click="openAiModeDialogOfJi(8)">
              </div>
            </div>          
            <div class="water-fill ji8" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location8) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location8 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location8 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location8 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location8 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location8) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :style="isRest(8)" :class="[ this.isFiltering(8) ? 'on' : 'off']" @click="openSbPopup(8)">8지 {{ this.$store.getters['filter/getLocationState8'] }}</div>
          </div>
        </div>
        <!-- 2지 9지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji2 == 1 }" @click="openAiModeDialogOfJi(2)">
              </div>
            </div>
            <div class="water-fill ji2" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location2) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :style="isRest(2)" :class="[ this.isFiltering(2) ? 'on' : 'off']" @click="openSbPopup(2)">2지 {{ this.$store.getters['filter/getLocationState2'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location2 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location2 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location2 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location2 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location2) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji9 == 1 }" @click="openAiModeDialogOfJi(9)">
              </div>
            </div>
            <div class="water-fill ji9" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location9) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location9 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location9 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location9 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location9 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location9) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :style="isRest(9)" :class="[ this.isFiltering(9) ? 'on' : 'off']" @click="openSbPopup(9)">9지 {{ this.$store.getters['filter/getLocationState9'] }}</div>
          </div>
        </div>
        <!-- 3지 10지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji3 == 1 }" @click="openAiModeDialogOfJi(3)">
              </div>
            </div>
            <div class="water-fill ji3" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location3) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :style="isRest(3)" :class="[ this.isFiltering(3) ? 'on' : 'off']" @click="openSbPopup(3)">3지 {{ this.$store.getters['filter/getLocationState3'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location3div | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location3 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location3 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location3 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location3) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji10 == 1 }" @click="openAiModeDialogOfJi(10)">
              </div>
            </div>
            <div class="water-fill ji10" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location10) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location10 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location10 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location10 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location10 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location10) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :style="isRest(10)" :class="[ this.isFiltering(10) ? 'on' : 'off']" @click="openSbPopup(10)">10지 {{ this.$store.getters['filter/getLocationState10'] }}</div>
          </div>
        </div>
        <!--4지 11지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji4 == 1 }" @click="openAiModeDialogOfJi(4)">
              </div>
            </div>
            <div class="water-fill ji4" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location4) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :style="isRest(4)" :class="[ this.isFiltering(4) ? 'on' : 'off']" @click="openSbPopup(4)">4지 {{ this.$store.getters['filter/getLocationState4'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location4 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location4 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location4 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location4 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location4) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji11 == 1 }" @click="openAiModeDialogOfJi(11)">
              </div>
            </div>
            <div class="water-fill ji11" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location11) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location11 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location11 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location11 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location11 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location11) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :style="isRest(11)" :class="[ this.isFiltering(11) ? 'on' : 'off']" @click="openSbPopup(11)">11지 {{ this.$store.getters['filter/getLocationState11'] }}</div>
          </div>
        </div>
        <!-- 5지 12지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji5 == 1 }" @click="openAiModeDialogOfJi(5)">
              </div>
            </div>
            <div class="water-fill ji5" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location5) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :style="isRest(5)" :class="[ this.isFiltering(5) ? 'on' : 'off']" @click="openSbPopup(5)">5지 {{ this.$store.getters['filter/getLocationState5'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location5 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location5 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location5 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location5 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location5) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji12 == 1 }" @click="openAiModeDialogOfJi(12)">
              </div>
            </div>
            <div class="water-fill ji12" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location12) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location12 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location12 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location12 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location12 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location12) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :style="isRest(12)" :class="[ this.isFiltering(12) ? 'on' : 'off']" @click="openSbPopup(12)">12지 {{ this.$store.getters['filter/getLocationState12'] }}</div>
          </div>
        </div>
        <!-- 6지 13지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji6 == 1 }" @click="openAiModeDialogOfJi(6)">
              </div>
            </div>
            <div class="water-fill ji6" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location6) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :style="isRest(6)" :class="[ this.isFiltering(6) ? 'on' : 'off']" @click="openSbPopup(6)">6지 {{ this.$store.getters['filter/getLocationState6'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location6 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location6 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location6 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location6 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location6) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji13 == 1 }" @click="openAiModeDialogOfJi(13)">
              </div>
            </div>
            <div class="water-fill ji13" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location13) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location13 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location13 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location13 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location13 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location13) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :style="isRest(13)" :class="[ this.isFiltering(13) ? 'on' : 'off']" @click="openSbPopup(13)">13지 {{ this.$store.getters['filter/getLocationState13'] }}</div>
          </div>
        </div>
        <!-- 7지 14지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji7 == 1 }" @click="openAiModeDialogOfJi(7)">
              </div>
            </div>
            <div class="water-fill ji7" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location7) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :style="isRest(7)" :class="[ this.isFiltering(7) ? 'on' : 'off']" @click="openSbPopup(7)">7지 {{ this.$store.getters['filter/getLocationState7'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location7 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location7 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location7 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location7 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location7) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input type="checkbox" class="checkbox" :class="{ 'checked': this.$store.state.filter.latest.f_operation_ji14 == 1 }" @click="openAiModeDialogOfJi(14)">
              </div>
            </div>
            <div class="water-fill ji14" :style="{ paddingTop: this.getPaddingTop(this.$store.state.filter.latest.f_loc_le.location14) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_le.location14 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_tb.location14 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.filter.latest.f_loc_ti.location14 / 60 | numFormat('0') }} / {{ this.$store.state.filter.latest.ai_f_loc_ti.location14 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.filter.latest.ai_f_loc_bw_ti.location14) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :style="isRest(14)" :class="[ this.isFiltering(14) ? 'on' : 'off']" @click="openSbPopup(14)">14지 {{ this.$store.getters['filter/getLocationState14'] }}</div>
          </div>
        </div>
        <!-- 여과지 유출 유량 -->
        <div class="contents-box-other">
          <div class="box other-bottom-padding">
            <div class="bottom-information">수위</div>
            <div class="bottom-information">탁도</div>
            <div class="bottom-information">여과지속(현재/예측)</div>
            <div class="bottom-information">역세시작시간</div>
          </div>
          <div class="box bottom">
            <div class="box-top-title">여과지 유출 유량</div>
            <div class="box-bottom">
              <div class="box-bottom__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.filter.latest.f_out_fr)"></div>
              <div class="box-bottom__unit">m<sup>3</sup>/h</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 여과 세부 현황 -->
      <FilterPopup/>
  </div>
</template>
<script>
import FilterPopup from '@/components/filter/FilterPopup' 
import { SET_OVERLAY } from '@/store'
import { GET_FILTER_LOCATION_BY_JI } from '@/store/modules/filter'
import { OPEN_FILTER_OPERATION_OF_JI_DIALOG } from '../../store/modules/dialog'
export default {
  name:"FilterContents",
  components:{
    FilterPopup
  },
  methods: {
    /**
     * 값에 따라 물이 얼만큼 차야하는지를 반환
     * 
     * @param value 값
     * @return 물 높이 값
     */
    getPaddingTop: function (value) {
      return (130 - (value * 43)) + 'px'
    },
    /**
     * 값에 따라 현재 여과중인지를 판단
     * 
     * @param location 위치
     * @return 여과 여부
     */
    isFiltering: function (location) {
      return this.$store.state.filter.latest.f_loc_stt['location' + location] === 1
    },
    /**
     * 선택된 여과지의 세부 현황 팝업을 띄움
     * 
     * @param index 지
     */
    openSbPopup: function (index) {
      let obj = {}
      obj.numJi = index

      this.$store.commit(SET_OVERLAY, true)
      Promise.all([
        this.$store.dispatch(GET_FILTER_LOCATION_BY_JI, obj),
      ]).finally(() => {
        this.$store.commit(SET_OVERLAY, false)
      })
    },
    /**
     * 지별 운영모드 변경 버튼을 눌렀을 때
     * 변경 확인 Dialog 오픈
     */
     openAiModeDialogOfJi: function (numJi) {
      if( this.$store.state.login.user.tkn !== null ) {
        this.$store.state.dialog.filterOperationOfJi.number = numJi
        this.$store.dispatch('dialog/' + OPEN_FILTER_OPERATION_OF_JI_DIALOG)
      }
    },
    /**
     * 여과대기중, 역세대기중, 운휴중 상태가 아닌 지는 버튼 영역 비활성화
     */
    // disabledJi: function(numJi) {
    //   let opacity = 0.2
    //   let pointerEvents = 'none'
    //   let style = ''
    //   if(!this.$store.state.filter.control_ji_operation_state.includes(this.$store.getters['filter/getLocationState' + numJi])) {
    //     style = {opacity, pointerEvents}
    //   }
    //   return style
    // },
    /**
     * 운휴중일 경우 지별 팝업 비활성화
     * 
     * @param location 위치
     * @return 여과 여부
     */
    isRest: function (location) {
      let pointerEvents = 'none'
      let style = ''
      if(this.$store.state.filter.latest.f_loc_stt['location' + location] === 6) {
        style = {pointerEvents}
      }
      return style
    },
  }
}
</script>
<style lang="scss" scoped>
// 24.03.27 on/off 버튼 추가
.btn-contents {
  width: 30px;
  z-index: 100;
  position:absolute;
  top:60px;
  left: 35px;
  // display: flex;
  // align-items: center;
  // 운전모드 제어 텍스트
  &__text {
    width: 76px;
    font-size: 15px;
    // line-height: 2.2;
    text-align: left;
    color: #c3eaff;
    text-shadow: 0 0 9px #5cafff;      
    padding-left: 5px;
  }
  // 운전모드 체크박스
  .checkbox {
    position:relative;
    cursor:pointer;
    appearance:none;
    width:28px;
    height:60px;
    border-radius: 14px;
    // border: solid 1px #417290;
    background-color: rgba(139, 194, 240, 0.25);
    outline:none;
    transition:0.3s;
  }
  // 운전모드 체크박스(선택 안됐을 때)
  .checkbox::before {
    content:"AI OFF";
    position:absolute;
    height:60px;
    width:28px;
    border-radius:14px;
    transition:0.3s ease-in-out;
    font-size: 11px;
    font-family: KHNPHUotfR;
    text-align: center;
    color: #151e27;
    padding-top: 10px;
    font-weight: 600;
    background-color: #417290;
    border: solid 1px #0c4263;
  }

  // 운전모드 체크박스(선택 됐을 때)
  .checked::before {
    content:"AI ON";
    // transform:translateY(25px);
    // background:#b4dffa;
    border-color:#b4dffa;
    color: #b4dffa;
  }
  // 운전모드 체크박스(선택 됐을 때)
  .checked {
    border-color:#b4dffa;
    color: #b4dffa;
  }
}
.ji1, .ji2, .ji3, .ji4, .ji5, .ji6, .ji7 {
  width: 195px;
  height: 130px;
  top:15px;
}
.ji8,.ji9, .ji10, .ji11,.ji12, .ji13, .ji14 {
  width: 195px;
  height: 130px;
  top: 30px;
}
.water-fill{
  position: absolute;
  z-index: 2;
  &__background{
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, rgba(44, 117, 255, 0.3), rgba(127, 224, 255, 0));
    background-position-x: 5px;
  }
}
.one{
  top: 323px;
  left: 50px;
}
.two{
  top: 428px;
  left: 50px;
}
.three{
  left: 262px;
}
.four{
  left: 482px;
}
.five{
  left: 694px;
}
.six{
  left: 906px;
}
.seven{
  left: 1120px;
}
.eight{
  left: 1340px;
}
.nine{
  right:115px
}
.water-h-flow-img{
  position: absolute;
  width: 136px;
  height: 8px;
  .buble-two{
    position: absolute;
    width: 136px;
    height: 8px;
    background-image: url('../../assets/splashdown/water_h_flow.png');
    background-position: -35px 50%;
    animation-name: arrow-two;
    animation-duration: 18s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    opacity: 0;
  }
  .buble {
    position: absolute;
    width: 136px;
    height: 8px;
    background-image: url('../../assets/splashdown/water_h_flow.png');
    background-position: -35px 50%;
    animation-name: arrow-one;
    animation-duration: 5s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    opacity: 0;
  }
  .delay1 {
    animation-delay: 0s;
  }
  .delay2 {
    animation-delay: 1s;
  }
  .delay3 {
    animation-delay: 2s;
  }
  .delay-one1 {
    animation-delay: 0s;
  }
  .delay-one2 {
    animation-delay: 0.5s;
  }
  .delay-one3 {
    animation-delay: 1s;
  }
  .delay-two1 {
    animation-delay: 5s;
  }
  .delay-two2 {
    animation-delay: 5.5s;
  }
  .delay-two3 {
    animation-delay: 6s;
  }
  .delay-three1 {
    animation-delay: 11s;
  }
  .delay-three2 {
    animation-delay: 11.5s;
  }
  .delay-three3 {
    animation-delay: 12s;
  }
}
@keyframes arrow-one{ 
  0% {opacity:0; transform: translateX(0px);}
  50% {opacity:1; }
  90% {opacity:1; }
  100% {opacity:0; transform: translateX(170px);}
}
@keyframes arrow-two{ 
  0% {opacity:0; transform: translateX(0px);}
  5% {opacity:1; }
  10% {opacity:1;}
  15% {opacity:0; }
  20% {opacity:0; }
  25% {opacity:1;}
  30% {opacity:1;}
  35% {opacity:0;}
  40% {opacity:0;}
  45% {opacity:1;}
  50% {opacity:1;}
  55% {opacity:0;}
  60% {opacity:0;}
  65% {opacity:1;}
  70% {opacity:1;}
  75% {opacity:0;}
  80% {opacity:0;}
  85% {opacity:1;}
  90% {opacity:1;}
  95% {opacity:1;}
  100% {opacity:0; transform: translateX(1300px);}
}
.main{
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.contents-container{
  display: flex;
  justify-content: center;
  width: 1752px;
  height: 357px;
  background-image: url('../../assets/ca_images/sub_08.png');
  // background-position-y: 7px;
  .bottom{
    justify-content: flex-end;
    padding-bottom: 60px;
  }
  .top{
    padding-top: 65px;
  }
  .other-top{
    padding-top: 25px;
  }
  .img-position-top{
    top:-16px;
    margin-bottom: 4px;
  }
  .img-position-bottom{
    bottom: -16px;
  }
  .bottom-contents{
    justify-content: flex-end;
  }
  .other-bottom-padding{
    padding-top: 41px;
  }
  .box{
    position: relative;
    display: flex;
    flex-flow: column;
    // align-items: center;
    width: 100%;
    height: 50%;
    .bottom-information{
      width: 93%;
      background-image: url('../../assets/percolation/bottom_arrow.png');
      background-position-y: center;
      background-position-x: 20px;
      text-shadow: 0 0 9px #5cafff;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.56;
      letter-spacing: normal;
      text-align: center;
      color: #c3eaff;
      padding-left: 45px;
    }
    .on{
      background-image: url('../../assets/percolation/box_contents_title_on.png');
    }
    .off{
      background-image: url('../../assets/percolation/box_contents_title_off.png');
    }
    .box-contents-title{
      position: relative;
      width: 100%;
      height: 35px;
      text-shadow: 0 0 9px #5cafff;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2.13;
      letter-spacing: normal;
      text-align: center;
      color: #c3eaff;
      padding-left: 8px;
      cursor: pointer;
      z-index: 10;
    }
    .box-value-contents{
      display: flex;
      width: 180px;
      z-index: 5;
      margin-left: 10px;
      &__value{
        width:115px;
        text-shadow: 0 0 9px #5cafff;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.56;
        letter-spacing: normal;
        text-align: right;
        color: #fff;
      }
      &__unit{
        margin-left: 10px;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.79;
        letter-spacing: normal;
        text-align: left;
        color: #a4ceed;
      }
    }
    .box-top-title{
      text-shadow: 0 0 9px #5cafff;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.56;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
    }
    .box-bottom{
      display: flex;
      width: 131px;
      height: 43px;
      margin:10px 0 0 29px;
      object-fit: contain;
      border: solid 1px rgba(157, 191, 255, 0.3);
      &__value{
        width: 82px;
        text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
        font-family: "LAB디지털" !important;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.6;
        letter-spacing: normal;
        text-align: center;
        color: #ccf1ff;
      }
      &__unit{
        margin: 0 5px;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.7;
        letter-spacing: normal;
        text-align: left;
        color: #417db9;
      }
    }
  }
  .contents-box-other{
    height: 100%;
  }
  .contents-box-other:first-child{
  margin-right: 20px;
   width: 12%;
  }
  .contents-box-other:last-child{
    width: 17%;
    margin-left: -34px;
    padding-left: 23px;
  }
  .contents-box{
    width: 16%;
    height: 100%;
    margin: 0 auto;
  }
}
// .paddingfix{
//   padding-left: 10px;
// }
</style>