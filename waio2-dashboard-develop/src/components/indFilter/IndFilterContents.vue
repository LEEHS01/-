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
    <!-- <div class="water-h-flow-img nine">
      <div class="buble delay1"></div>
      <div class="buble delay2"></div>
      <div class="buble delay3"></div>
    </div> -->
    <!-- 여과 공정 메인 컨텐츠 -->
    <div class="contents-container">
      <!-- 유입 유량 & 유량 합산 -->
      <div class="contents-box-other">
        <!-- <div class="box top" style="height: 31%;">
          <div class="box-top-title">1계열 혼화지 유입 유량</div>
          <div class="box-bottom">
            <div class="box-bottom__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.indFilter.latest.d1_in_fr)"></div>
            <div class="box-bottom__unit">m<sup>3</sup>/h</div>
          </div>
        </div> -->
        <div class="box top">
          <div class="box-top-title">원수 유입 유량</div>
          <div class="box-bottom">
            <div class="box-bottom__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.indFilter.latest.d1_in_fr)"></div>
            <div class="box-bottom__unit">m<sup>3</sup>/h</div>
          </div>
        </div>
        <!-- <div class="box bottom" style="height: 35%;">
          <div class="box-top-title">혼화지 유입 유량 합산</div>
          <div class="box-bottom">
            <div class="box-bottom__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.indFilter.latest.d_ser_in_fr)"></div>
            <div class="box-bottom__unit">m<sup>3</sup>/h</div>
          </div>
        </div> -->
      </div>
        <!-- 1지 18지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(1)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location1 }">
              </div>
            </div>
            <div class="water-fill ji1" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location1) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :class="[ this.isFiltering(1) ? 'on' : 'off']" @click="openSbPopup(1)">1지 {{ this.$store.getters['indFilter/getLocationState1'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location1 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location1 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location1 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location1 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location1) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(18)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location18 }" >
              </div>
            </div>   
            <div class="water-fill ji18" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location18) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location18 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location18 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location18 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location18 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location18) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :class="[ this.isFiltering(18) ? 'on' : 'off']" @click="openSbPopup(18)">18지 {{ this.$store.getters['indFilter/getLocationState18'] }}</div>
          </div>
        </div>
        <!-- 2지 17지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(2)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location2 }">
              </div>
            </div>
            <div class="water-fill ji2" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location2) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :class="[ this.isFiltering(2) ? 'on' : 'off']" @click="openSbPopup(2)">2지 {{ this.$store.getters['indFilter/getLocationState2'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location2 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location2 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location2 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location2 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location2) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(17)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location17 }">
              </div>
            </div>
            <div class="water-fill ji12" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location17) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location17 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location17 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location17 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location17 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location17) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :class="[ this.isFiltering(17) ? 'on' : 'off']" @click="openSbPopup(17)">17지 {{ this.$store.getters['indFilter/getLocationState17'] }}</div>
          </div>
        </div>
        <!-- 3지 16지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(3)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location3 }">
              </div>
            </div>
            <div class="water-fill ji3" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location3) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :class="[ this.isFiltering(3) ? 'on' : 'off']" @click="openSbPopup(3)">3지 {{ this.$store.getters['indFilter/getLocationState3'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location3 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location3 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location3 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location3 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location3) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(16)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location16 }">
              </div>
            </div>
            <div class="water-fill ji16" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location16) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location16 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location16 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location16 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location16 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location16) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :class="[ this.isFiltering(16) ? 'on' : 'off']" @click="openSbPopup(16)">16지 {{ this.$store.getters['indFilter/getLocationState16'] }}</div>
          </div>
        </div>
        <!-- 4지 15지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(4)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location4 }">
              </div>
            </div> 
            <div class="water-fill ji4" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location4) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :class="[ this.isFiltering(4) ? 'on' : 'off']" @click="openSbPopup(4)">4지 {{ this.$store.getters['indFilter/getLocationState4'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location4 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location4 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location4 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location4 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location4) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(15)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location15 }">
              </div>
            </div> 
            <div class="water-fill ji15" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location15) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location15 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location15 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location15 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location15 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location15) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :class="[ this.isFiltering(15) ? 'on' : 'off']" @click="openSbPopup(15)">15지 {{ this.$store.getters['indFilter/getLocationState15'] }}</div>
          </div>
        </div>
        <!-- 5지 14지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(5)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location5 }">
              </div>
            </div>
            <div class="water-fill ji5" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location5) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :class="[ this.isFiltering(5) ? 'on' : 'off']" @click="openSbPopup(5)">5지 {{ this.$store.getters['indFilter/getLocationState5'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location5 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location5 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location5 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location5 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location5) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(14)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location14 }">
              </div>
            </div>
            <div class="water-fill ji14" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location14) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location14 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location14 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location14 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location14 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location14) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :class="[ this.isFiltering(14) ? 'on' : 'off']" @click="openSbPopup(14)">14지 {{ this.$store.getters['indFilter/getLocationState14'] }}</div>
          </div>
        </div>
        <!-- 6지 13지 -->
        <div class="contents-box">
          <div class="box">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(6)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location6 }">
              </div>
            </div>
            <div class="water-fill ji6" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location6) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-contents-title img-position-top" :class="[ this.isFiltering(6) ? 'on' : 'off']" @click="openSbPopup(6)">6지 {{ this.$store.getters['indFilter/getLocationState6'] }}</div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location6 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location6 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location6 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location6 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location6) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
          </div>
          <div class="box bottom-contents">
            <div class="btn-contents">
              <div class="btn-contents__btn">
                <input @click="openAiModeDialogOfJi(13)" type="checkbox" class="checkbox" :class="{ 'checked' : this.$store.state.indFilter.latest.f_loc_operation_mode.location13 }">
              </div>
            </div>                   
            <div class="water-fill ji13" :style="{ paddingTop: this.getPaddingTop(this.$store.state.indFilter.latest.f_loc_le.location13) }">
              <div class="water-fill__background"></div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_le.location13 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">m</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_tb.location13 | numFormat('0.00') }}</div>
              <div class="box-value-contents__unit">NTU</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$store.state.indFilter.latest.f_loc_ti.location13 / 60 | numFormat('0') }} / {{ this.$store.state.indFilter.latest.ai_f_loc_ti.location13 / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간</div>
            </div>
            <div class="box-value-contents">
              <div class="box-value-contents__value">{{ this.$minusToZero(this.$store.state.indFilter.latest.ai_f_loc_bw_ti.location13) / 60 | numFormat('0') }}</div>
              <div class="box-value-contents__unit">시간 후</div>
            </div>
            <div class="box-contents-title img-position-bottom" :class="[ this.isFiltering(13) ? 'on' : 'off']" @click="openSbPopup(13)">13지 {{ this.$store.getters['indFilter/getLocationState13'] }}</div>
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
        <div class="box top">
          <div class="box-top-title">여과지 유출 유량</div>
          <div class="box-bottom">
            <div class="box-bottom__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.indFilter.latest.f_out_fr)"></div>
            <div class="box-bottom__unit">m<sup>3</sup>/h</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 여과 세부 현황 -->
    <IndFilterPopup/>
  </div>  
</template>
<script>
import IndFilterPopup from '@/components/indFilter/IndFilterPopup' 
import { SET_OVERLAY } from '@/store'
import { GET_INDFILTER_LOCATION_BY_JI } from '@/store/modules/indFilter'
import { OPEN_AI_MODE_OF_FILTER_JI_DIALOG } from '../../store/modules/dialog'
export default {
  name:"IndFilterContents",
  components:{
    IndFilterPopup
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
      return this.$store.state.indFilter.latest.f_loc_stt['location' + location] === 1
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
        this.$store.dispatch(GET_INDFILTER_LOCATION_BY_JI, obj),
      ]).finally(() => {
        this.$store.commit(SET_OVERLAY, false)
      })
    },
    /**
     * TODO: 지별 운전모드 제어를 눌렀을 때
     * 제어 확인 Dialog 오픈
     */
     openAiModeDialogOfJi: function (numJi) {
      this.$store.state.dialog.aiModeOfFilterJi.number = numJi
      this.$store.state.dialog.aiModeOfFilterJi.filterIndex = 1
      this.$store.dispatch('dialog/' + OPEN_AI_MODE_OF_FILTER_JI_DIALOG)
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
.ji1,.ji2,.ji3,.ji4,.ji5,.ji6{
  width: 200px;
  height: 130px;
  top: 18px;
}
.ji13,.ji14,.ji15,.ji16,.ji17,.ji18{
  width: 200px;
  height: 130px;
  top: 32px;
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
// .one{
//   top: 462px;
//   left: 50px;
// }
// .two{
//   top: 462px;
//   left: 50px;
// }
.three{
  top: 444px;
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
  width: 1566px;
  height: 369px;
  background-image: url('../../assets/cj_images/sub_06.png');
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
    bottom: -6px;
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
      width: 100%;
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