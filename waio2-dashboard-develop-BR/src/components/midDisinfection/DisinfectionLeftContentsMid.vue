<template>
  <div class="main">
    <div class="water-v-flow-one-img two">
      <div class="buble-v delay1"></div>
      <div class="buble-v delay2"></div>
      <div class="buble-v delay3"></div>
    </div>
    <div class="btn-tab">
      <div :class="[ this.$store.state.midDisinfection.selectedDisinfectionIndex === 1 ? 'btn-tab__box-abled' : 'btn-tab__box-disabled']" @click="$routingByIndex(7)">전차염</div>
      <div :class="[ this.$store.state.midDisinfection.selectedDisinfectionIndex === 2 ? 'btn-tab__box-abled' : 'btn-tab__box-disabled']" @click="$routingByIndex(8)">중차염</div>
      <div :class="[ this.$store.state.midDisinfection.selectedDisinfectionIndex === 3 ? 'btn-tab__box-abled' : 'btn-tab__box-disabled']" @click="$routingByIndex(9)">후차염</div>
    </div>
    <div class="contents-img">
      <div class="contents-img-title first">차염B(중차염)</div>
      <div :style="{ display: this.getDisplayStyleFirst }">
        <!-- <div v-if="this.$store.state.disinfection.latest.g_1_mm_fr != 0" class="water-v-flow-one-img one-line-v1"> -->
        <div class="water-v-flow-one-img one-line-v1">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
        <div class="water-h-flow-one-img one-line-h">
          <div class="buble delay1"></div>
          <div class="buble delay2"></div>
          <div class="buble delay3"></div>
        </div>
        <div class="water-v-flow-one-img-bottom one-line-v2">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
      </div>
      <div class="contents-img-title last">차염D(예비)</div>
      <div :style="{ display: this.getDisplayStyleSecond }">
        <!-- <div v-if="this.$store.state.midDisinfection.latest.g_2_mm_fr == 0" class="water-v-flow-one-img two-line-v2"> -->
        <div class="water-v-flow-one-img two-line-v1">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
        <div class="water-h-flow-two-img two-line-h">
          <div class="buble delay1"></div>
          <div class="buble delay2"></div>
          <div class="buble delay3"></div>
        </div>
        <div class="water-v-flow-one-img-bottom two-line-v2">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
      </div>         
    </div>
    <div class="contents-wrap">
      <div class="contents-value">
        <div class="contents-value__row">
          <div class="contents-value__title">주입률상한</div>
          <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_peri_set_max" v-on:input="updateInput($event, 'g_peri_set_max')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_peri_set_max | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">주입률하한</div>
          <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_peri_set_max" v-on:input="updateInput($event, 'g_peri_set_max')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_peri_set_min | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">1회 변경 주입률</div>
          <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_peri_chg_limit_for_onetime" v-on:input="updateInput($event, 'g_peri_chg_limit_for_onetime')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_peri_chg_limit_for_onetime | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">침전수 목표<br/>잔류염소</div>
          <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_e_obj_residual_cl" v-on:input="updateInput($event, 'g_e_obj_residual_cl')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_e_obj_residual_cl | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">침전지 잔류염소<br/>홀딩범위</div>
          <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_e_residual_cl_holding" v-on:input="updateInput($event, 'g_e_residual_cl_holding')" maxlength="5"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_e_residual_cl_holding | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">여과지 유출<br/>잔류염소 하한값</div>
          <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_f_out_residual_cl_min" v-on:input="updateInput($event, 'g_f_out_residual_cl_min')" maxlength="5"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_f_out_residual_cl_min | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">보정주기</div>
          <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_peri_calib_cycle" v-on:input="updateInput($event, 'g_peri_calib_cycle')" maxlength="5"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_peri_calib_cycle | numFormat('0') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">주입 후 경과 시간</div>
          <div class="contents-value__number"><span>{{ this.$store.state.midDisinfection.latestModify.g_elapsed_time | numFormat('0') }}</span></div>
        </div>
      </div>
      <div v-if="$store.state.login.user.tkn !== null" class="contents-value-icon">
        <div class="custom-icon" @click="updateControl">
          <div :class="[ this.$store.state.midDisinfection.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
        </div>
        <div v-if="this.$store.state.midDisinfection.isModifyMode" class="custom-cancel-icon" style="margin-top: 3px;" @click="cancelControl">
          <div class='custom-cancel-icon__cancel'></div>
        </div>
      </div>
    </div>        
    <!-- <div class="contents-value">
      <div v-if="$store.state.login.user.tkn !== null" class="contents-value__icon">
        <div class="custom-icon" @click="updateControl">
          <div :class="[ this.$store.state.midDisinfection.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
        </div>
        <div v-if="this.$store.state.midDisinfection.isModifyMode" class="custom-cancel-icon" style="margin-top: 3px;" @click="cancelControl">
          <div class='custom-cancel-icon__cancel'></div>
        </div>
      </div>
      <div class="contents-value__row">
        <div class="contents-value__title">주입률 상한</div>
        <div class="contents-value__title">주입률 하한</div>
        <div class="contents-value__title">1회 변경<br/>주입률</div>
        <div class="contents-value__title">침전수 목표<br/>잔류염소</div>
        <div class="contents-value__title">여과지 유출<br/>잔류염소<br/>하한값</div>
        <div class="contents-value__title">보정주기</div>
        <div class="contents-value__title">주입 후<br/>경과 시간</div>
      </div>
      <div class="contents-value__row">
        <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_peri_set_max" v-on:input="updateInput($event, 'g_peri_set_max')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_peri_set_max | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_peri_set_min" v-on:input="updateInput($event, 'g_peri_set_min')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_peri_set_min | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_peri_chg_limit_for_onetime" v-on:input="updateInput($event, 'g_peri_chg_limit_for_onetime')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_peri_chg_limit_for_onetime | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_e_obj_residual_cl" v-on:input="updateInput($event, 'g_e_obj_residual_cl')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_e_obj_residual_cl | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_f_out_residual_cl_min" v-on:input="updateInput($event, 'g_f_out_residual_cl_min')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_f_out_residual_cl_min | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.midDisinfection.isModifyMode" type="text" :value="this.$store.state.midDisinfection.latestModify.g_peri_calib_cycle" v-on:input="updateInput($event, 'g_peri_calib_cycle')"/><span v-else>{{ this.$store.state.midDisinfection.latestModify.g_peri_calib_cycle | numFormat('0') }}</span></div>
        <div class="contents-value__number"><span>{{ this.$store.state.midDisinfection.latestModify.g_elapsed_time | numFormat('0') }}</span></div>
      </div>
    </div> -->
  </div>  
</template>
<script>
import { PUT_DISINFECTION_CONTROL_PERI } from '@/store/modules/midDisinfection'
export default {
  data: () => ({
    // isModifyMode: false
  }),
  computed: {
    getDisplayStyleFirst() {
      return this.$store.state.midDisinfection.latest.g_inj_b_run === 1 ? 'block' : 'none'
    },
    getDisplayStyleSecond() {
      return this.$store.state.midDisinfection.latest.g_inj_d_run === 1 ? 'block' : 'none'
    }
  },
  methods: {
    updateInput: function (event, key) {
      this.$store.state.midDisinfection.latestModify[key] = event.target.value
    },
    checkNumberFormat: function(val) {
      const regex = /^\d{1,2}([\.](\d{1,2})?)?$/ //eslint-disable-line
      if (!regex.test(val)) {
        return false		// 0.00~99.99를 벗어나면
      }
      return true
    },

    //후차염 사용자 제어 데이터 수정
    updateControl: function() {
      
      /**
       * peri_min_limit  : 중차염 주입률 하한
       * peri_max_limit  : 중차염 주입률 상한
       * cl_min_limit    : 중차염 혼화지 잔류염소 하한
       * cl_max_limit    : 중차염 혼화지 잔류염소 상한
       */
      let peri_min_limit = 0
      let peri_max_limit = 100
      let cl_min_limit = 0
      let cl_max_limit = 10

      if (this.$store.state.midDisinfection.isModifyMode) {
        if (
              this.$store.state.midDisinfection.latestModify.g_peri_set_max === ''
           || this.$store.state.midDisinfection.latestModify.g_peri_set_min === ''
           || this.$store.state.midDisinfection.latestModify.g_peri_chg_limit_for_onetime === ''
           || this.$store.state.midDisinfection.latestModify.g_peri_calib_cycle === ''
           || this.$store.state.midDisinfection.latestModify.g_e_obj_residual_cl === ''
           || this.$store.state.midDisinfection.latestModify.g_f_out_residual_cl_min === ''
           || this.$store.state.midDisinfection.latestModify.g_e_residual_cl_holding === '') {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else {
          let obj = {}
          
          obj.g_peri_set_max = parseFloat(this.$store.state.midDisinfection.latestModify.g_peri_set_max)
          obj.g_peri_set_min = parseFloat(this.$store.state.midDisinfection.latestModify.g_peri_set_min)
          obj.g_peri_chg_limit_for_onetime = parseFloat(this.$store.state.midDisinfection.latestModify.g_peri_chg_limit_for_onetime)
          obj.g_peri_calib_cycle = parseFloat(this.$store.state.midDisinfection.latestModify.g_peri_calib_cycle)
          obj.g_e_obj_residual_cl = parseFloat(this.$store.state.midDisinfection.latestModify.g_e_obj_residual_cl)
          obj.g_f_out_residual_cl_min = parseFloat(this.$store.state.midDisinfection.latestModify.g_f_out_residual_cl_min)
          obj.g_e_residual_cl_holding = parseFloat(this.$store.state.midDisinfection.latestModify.g_e_residual_cl_holding)

          if ((obj.g_peri_set_max < peri_min_limit || obj.g_peri_set_max > peri_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '중차염 주입률 상한 설정 범위', text2: peri_min_limit + ' ~ ' + peri_max_limit})
            return
          }
          if ((obj.g_peri_set_min < peri_min_limit || obj.g_peri_set_min > peri_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '중차염 주입률 하한 설정 범위', text2: peri_min_limit + ' ~ ' + peri_max_limit})
            return
          }
          if ((obj.g_peri_chg_limit_for_onetime < peri_min_limit || obj.g_peri_chg_limit_for_onetime > peri_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '중차염 1회 변경 주입률 설정 범위', text2: peri_min_limit + ' ~ ' + peri_max_limit})
            return
          }
          if ((obj.g_e_obj_residual_cl < cl_min_limit || obj.g_e_obj_residual_cl > cl_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '중차염 침전지 목표 잔류염소 설정 범위', text2: cl_min_limit + ' ~ ' + cl_max_limit})
            return
          }

          //processStep 및 소독 단계 설정
          obj.processStep = this.$store.state.midDisinfection.processStep
          obj.selectedDisinfectionIndex = this.$store.state.midDisinfection.selectedDisinfectionIndex

          this.$store.dispatch(PUT_DISINFECTION_CONTROL_PERI, obj)
          this.$store.state.midDisinfection.isModifyMode = !this.$store.state.midDisinfection.isModifyMode
        }
      } else {
        this.$store.state.midDisinfection.isModifyMode = !this.$store.state.midDisinfection.isModifyMode
      }
    },
    cancelControl: function() {
      this.$store.state.midDisinfection.latestModify = Object.assign({}, this.$store.state.midDisinfection.latest)
      this.$store.state.midDisinfection.isModifyMode = !this.$store.state.midDisinfection.isModifyMode
    }
  },
  watch: {
    // '$store.state.midDisinfection.latestModify.g_pre1_set_max': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['g_pre1_set_max'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['g_pre1_set_max'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['g_pre1_set_max'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.g_pre1_set_min': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['g_pre1_set_min'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['g_pre1_set_min'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['g_pre1_set_min'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.g_pre1_chg_limit_for_onetime': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['g_pre1_chg_limit_for_onetime'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['g_pre1_chg_limit_for_onetime'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['g_pre1_chg_limit_for_onetime'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.d1_target_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['d1_target_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['d1_target_cl'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['d1_target_cl'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.e1_target_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['e1_target_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['e1_target_cl'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['e1_target_cl'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.g_pre2_set_max': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['g_pre2_set_max'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['g_pre2_set_max'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['g_pre2_set_max'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.g_pre2_set_min': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['g_pre2_set_min'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['g_pre2_set_min'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['g_pre2_set_min'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.g_pre2_chg_limit_for_onetime': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['g_pre2_chg_limit_for_onetime'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['g_pre2_chg_limit_for_onetime'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['g_pre2_chg_limit_for_onetime'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.d2_target_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['d2_target_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['d2_target_cl'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['d2_target_cl'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.e2_target_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['e2_target_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['e2_target_cl'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['e2_target_cl'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.midDisinfection.latestModify.g_f_out_residual_cl_min': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.midDisinfection.latestModify['g_f_out_residual_cl_min'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.midDisinfection.latestModify['g_f_out_residual_cl_min'] = newVal
    //     } else {
    //       this.$store.state.midDisinfection.latestModify['g_f_out_residual_cl_min'] = oldVal
    //     }
    //   }
    // },
  }
}
</script>
<style lang="scss" scoped>
.main{
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
.two{
  top: 0;
  left: 1173px;
}
.water-v-flow-one-img{
  position: absolute;
  width: 6px;
  height: 50px;
  .buble-v {
    position: absolute;
    width: 6px;
    height: 41px;
    background-image: url('../../assets/disinfection/v_water_flow.png');
    background-position:50% -28px;
    animation-name: arrow-two;
    animation-duration: 4s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    opacity: 0;
  }
  .delay1 {
    animation-delay: 0s;
  }
  .delay2 {
    animation-delay: 2s;
  }
  .delay3 {
    animation-delay: 4s;
  }
}
@keyframes arrow-two{ 
  0% {opacity:0; transform: translateY(0px);}
  20% {opacity:0; }
  90% {opacity:1; }
  100% {opacity:0; transform: translateY(50px);}
}
  .contents-wrap {
    position: relative;
  }   
  .contents-value {
    display: flex;
    width: 560px;
    overflow-x: auto;
    padding: 20px 0;
    background-image: url('../../assets/disinfection/contents_right_bottom.png');
    text-align: center;
    &__row {
      position: relative;
      margin: 0 5px;
      > div {
        width: 130px;
        height: 30px;
        box-sizing: border-box;
        > input {
          width: 100%;
          height: 30px;
          text-align: center;
          border: solid 1px rgba(157, 191, 255, 0.5);
          background-color: rgba(157, 191, 255, 0.07);
          font-family: inherit !important;
          color: inherit !important;
        }
      }
    }
    &__title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-shadow: 0 0 9px #5cafff;
      font-family: KHNPHUotfR;
        color: #fff;
        margin: 10px 0 25px 0;
    }
    &__line {
      width: 74px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      text-shadow: 0 0 9px #5cafff;
      font-family: KHNPHUotfR;
      font-size: 16px;
      color: #9fc4ff;
      margin: 4px 8px;
    }
    &__number {
      display: flex;
      justify-content: center;
      align-items: center;
      text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
      font-family: "LAB디지털" !important;
      font-size: 24px;
      color: #ccf1ff;
      > span {
        font-family: "LAB디지털" !important;
      }
    }
    .under-line{
      height: 7px;
      margin: 10px 0;
      background-image: url('../../assets/disinfection/mixed_water_under_line.png');
      background-position: 145px;
      object-fit: contain;
    }
    .mixed-water-data{
      display: flex;
      justify-content: center;
      align-items:center ;
      &__num{
        margin:0 23px;
        text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
        font-family: "LAB디지털" !important;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.21;
        letter-spacing: normal;
        text-align: center;
        color: #ccf1ff;
      }
      &__text{
        width: 92px;
        height: 34px;
        text-shadow: 0 0 9px #5cafff;
        font-family: "KHNPHUotfR";
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        text-align: center;
        color: #fff;
      }
    }
  }
  .contents-value::-webkit-scrollbar {
    height: 10px;
  }
  .contents-value::-webkit-scrollbar-track {
    background-color: #011527;
    border-radius: 5px;
  }
  .contents-value::-webkit-scrollbar-thumb {
    background-color: #417db9;
    border-radius: 5px;
  }  
  .contents-value-icon {
    position: absolute;
    top: 5px;
    right: -25px;
    cursor: pointer;
    z-index: 20;
  }
  .btn-tab{
    display: flex;
    justify-content:space-evenly;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.3;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    width: 386px;
    height: 45px;
    .box-center-margin{
      // margin: 0 16px;
    }
    &__box-abled{
      width: 120px;
      height: 35px;
      box-shadow: 0 0 10px 0 rgba(172, 207, 255, 0.7);
      border: solid 1px #72a3d6;
      background-color: #447fbc;
      color: #fff;
      line-height: 35px;
      cursor: pointer;
    }
    &__box-disabled{
      width: 120px;
      height: 35px;
      border: solid 1px #457fbc;
      background-color: #1a3462;
      color: #a7c2e7;
      line-height: 35px;
      cursor: pointer;
    }
  }
  .contents-img{
    width: 584px;
    height: 527px;
    background-image: url('../../assets/br_images/sub_02.png');
    background-position-x: center;
    margin: 15px 0;
    // position: relative;
    .one-line-h{
      top: 516px;
      left: 232px;
    }
    .one-line-v1{
      top: 471px;
      left: 201px;
    }
    .one-line-v2{
      top: 509px;
      left: 344px;
    }
    .two-line-h{
      top: 516px;
      left: 361px;
    }
    .two-line-v1{
      top: 471px;
      left: 485px;
    }
    .two-line-v2{
      top: 509px;
      left: 344px;
    }
    .water-h-flow-one-img{
      position: absolute;
      width: 100px;
      height: 8px;
      .buble {
        position: absolute;
        width: 100px;
        height: 8px;
        background-image: url('../../assets/disinfection/water_h_flow_one.png');
        background-position: -38px 50%;
        animation-name: arrow-one;
        animation-duration: 6s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        opacity: 0;
      }
      .delay1 {
        animation-delay: 2s;
      }
      .delay2 {
        animation-delay: 4s;
      }
      .delay3 {
        animation-delay: 6s;
      }
    }
    @keyframes arrow-one{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(80px);}
    }
    .water-h-flow-two-img{
      position: absolute;
      width: 100px;
      height: 8px;
      .buble {
        position: absolute;
        width: 100px;
        height: 8px;
        background-image: url('../../assets/disinfection/water_h_flow_two.png');
        background-position: 88px 50%;
        animation-name: arrow-three;
        animation-duration: 6s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        opacity: 0;
      }
      .delay1 {
        animation-delay: 2s;
      }
      .delay2 {
        animation-delay: 4s;
      }
      .delay3 {
        animation-delay: 6s;
      }
    }
    @keyframes arrow-three{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(-80px);}
    }
    .water-v-flow-one-img{
      position: absolute;
      width: 8px;
      height: 50px;
      .buble-v {
        position: absolute;
        width: 8px;
        height: 50px;
        background-image: url('../../assets/disinfection/water_v_flow_one.png');
        background-position:50% -20px;
        animation-name: arrow-two;
        animation-duration: 4s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        opacity: 0;
      }
      .delay1 {
        animation-delay: 0s;
      }
      .delay2 {
        animation-delay: 2s;
      }
    }
    @keyframes arrow-two{ 
      0% {opacity:0; transform: translateY(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateY(45px);}
    }
    .water-v-flow-one-img-bottom{
      position: absolute;
      width: 8px;
      height: 40px;
      .buble-v {
        position: absolute;
        width: 8px;
        height: 40px;
        background-image: url('../../assets/disinfection/water_v_flow_one.png');
        background-position:50% -20px;
        animation-name: arrow-two-bottom;
        animation-duration: 4s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        opacity: 0;
      }
      .delay1 {
        animation-delay: 8s;
      }
      .delay2 {
        animation-delay: 10s;
      }
    }
    @keyframes arrow-two-bottom{ 
      0% {opacity:0; transform: translateY(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateY(45px);}
    }
  }
.contents-img-title {
  width:115px;
  height: 32px;
  text-shadow: 0 0 9px #5cafff;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.3;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  position: absolute;
}
  .first {
  top: 235px;
  left: 135px;
  }
  .last {
    top: 235px;
    left: 415px;
  }
}
.custom-icon {
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: #b4dffa;
  cursor: pointer;
  &__pencil {
    width: 15px;
    height: 15px;
    background-image: url('../../assets/disinfection/icon_pencil.png');
  }
  &__checkbox {
    width: 16px;
    height: 12px;
    background-image: url('../../assets/disinfection/icon_checkbox.png');
    background-position-x: 1px;
  }
}
.custom-cancel-icon {
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: #649fff;
  cursor: pointer;
  &__cancel {
    width: 16px;
    height: 16px;
    background-image: url('../../assets/disinfection/icon_cancel.png');
    
  }
}
</style>