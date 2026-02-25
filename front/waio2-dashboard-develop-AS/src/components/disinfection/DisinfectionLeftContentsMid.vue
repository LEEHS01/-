<template>
  <div class="main">
    <div class="water-v-flow-one-img two">
      <div class="buble-v delay1"></div>
      <div class="buble-v delay2"></div>
      <div class="buble-v delay3"></div>
      </div>
    <!-- <div class="btn-tab">
      <div :class="[ this.$store.state.disinfection.selectedDisinfectionIndex === 1 ? 'btn-tab__box-abled' : 'btn-tab__box-disabled']" @click="$store.state.disinfection.selectedDisinfectionIndex = 1">전염소</div>
      <div class="box-center-margin" :class="[ this.$store.state.disinfection.selectedDisinfectionIndex === 2 ? 'btn-tab__box-abled' : 'btn-tab__box-disabled']" @click="$store.state.disinfection.selectedDisinfectionIndex = 2">중염소</div>
      <div :class="[ this.$store.state.disinfection.selectedDisinfectionIndex === 3 ? 'btn-tab__box-abled' : 'btn-tab__box-disabled']" @click="$store.state.disinfection.selectedDisinfectionIndex = 3">후염소</div>
    </div> -->
    <div class="contents-img">
      <div class="water-v-flow-one-img one-line-v1">
        <div class="buble-v delay1"></div>
        <div class="buble-v delay2"></div>
      </div>
      <!-- <div class="water-h-flow-one-img one-line-h">
        <div class="buble delay1"></div>
        <div class="buble delay2"></div>
        <div class="buble delay3"></div>
      </div> -->
      <!-- <div class="water-v-flow-one-img-bottom one-line-v2">
        <div class="buble-v delay1"></div>
        <div class="buble-v delay2"></div>
      </div> -->
      <div class="water-v-flow-one-img two-line-v1">
        <div class="buble-v delay1"></div>
        <div class="buble-v delay2"></div>
      </div>
      <!-- <div class="water-h-flow-two-img two-line-h">
        <div class="buble delay1"></div>
        <div class="buble delay2"></div>
        <div class="buble delay3"></div>
      </div> -->
      <!-- <div class="water-v-flow-one-img-bottom two-line-v2">
        <div class="buble-v delay1"></div>
        <div class="buble-v delay2"></div>
      </div> -->
    </div>
    <div class="contents-value">
      <div v-if="$store.state.login.user.tkn !== null" class="contents-value__icon">
        <div class="custom-icon" @click="updateControl">
          <div :class="[ this.$store.state.disinfection.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
        </div>
        <div v-if="this.$store.state.disinfection.isModifyMode" class="custom-cancel-icon" style="margin-top: 3px;" @click="cancelControl">
          <div class='custom-cancel-icon__cancel'></div>
        </div>
      </div>
      <div class="contents-value__row">
        <div class="contents-value__title"></div>
        <div class="contents-value__title">주입률 상한</div>
        <div class="contents-value__title">주입률 하한</div>
        <div class="contents-value__title">1회 변경<br/>주입률</div>
        <!-- <div class="contents-value__title">혼화수 목표<br/>잔류염소</div> -->
        <div class="contents-value__title">침전수 목표<br/>잔류염소</div>
      </div>
      <div class="contents-value__row">
        <div class="contents-value__line"><span>후염소1</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_pre_set_max" v-on:input="updateInput($event, 'g_pre_set_max')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_pre_set_max | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_pre_set_min" v-on:input="updateInput($event, 'g_pre_set_min')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_pre_set_min | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_pre_chg_limit_for_onetime" v-on:input="updateInput($event, 'g_pre_chg_limit_for_onetime')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_pre_chg_limit_for_onetime | numFormat('0.00') }}</span></div>
        <!-- <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.d1_target_cl" v-on:input="updateInput($event, 'd1_target_cl')"/><span v-else>{{ this.$store.state.disinfection.latestModify.d1_target_cl | numFormat('0.00') }}</span></div> -->
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.e1_target_cl" v-on:input="updateInput($event, 'e1_target_cl')"/><span v-else>{{ this.$store.state.disinfection.latestModify.e1_target_cl | numFormat('0.00') }}</span></div>
      </div>
      <div class="contents-value__row">
        <div class="contents-value__line"><span>후염소2</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_pre2_set_max" v-on:input="updateInput($event, 'g_pre2_set_max')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_pre2_set_max | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_pre2_set_min" v-on:input="updateInput($event, 'g_pre2_set_min')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_pre2_set_min | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_pre2_chg_limit_for_onetime" v-on:input="updateInput($event, 'g_pre2_chg_limit_for_onetime')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_pre2_chg_limit_for_onetime | numFormat('0.00') }}</span></div>
        <!-- <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.d2_target_cl" v-on:input="updateInput($event, 'd2_target_cl')"/><span v-else>{{ this.$store.state.disinfection.latestModify.d2_target_cl | numFormat('0.00') }}</span></div> -->
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.e2_target_cl" v-on:input="updateInput($event, 'e2_target_cl')"/><span v-else>{{ this.$store.state.disinfection.latestModify.e2_target_cl | numFormat('0.00') }}</span></div>
      </div>
    </div>
  </div>  
</template>
<script>
import { PUT_DISINFECTION_CONTROL_PRE } from '@/store/modules/disinfection'
export default {
  data: () => ({
    // isModifyMode: false
  }),
  methods: {
    updateInput: function (event, key) {
      this.$store.state.disinfection.latestModify[key] = event.target.value
    },
    checkNumberFormat: function(val) {
      const regex = /^\d{1,2}([\.](\d{1,2})?)?$/ //eslint-disable-line
      if (!regex.test(val)) {
        return false		// 0.00~99.99를 벗어나면
      }
      return true
    },
    updateControl: function() {
      let pre_min_limit = 0
      let pre_max_limit = 100
      let cl_min_limit = 0
      let cl_max_limit = 10
      if (this.$store.state.disinfection.isModifyMode) {
        if (this.$store.state.disinfection.latestModify.g_pre_set_max === ''
           || this.$store.state.disinfection.latestModify.g_pre_set_min === ''
           || this.$store.state.disinfection.latestModify.g_pre_chg_limit_for_onetime === ''
           || this.$store.state.disinfection.latestModify.d1_target_cl === ''
           || this.$store.state.disinfection.latestModify.e1_target_cl === ''
           || this.$store.state.disinfection.latestModify.g_pre2_set_max === ''
           || this.$store.state.disinfection.latestModify.g_pre2_set_min === ''
           || this.$store.state.disinfection.latestModify.g_pre2_chg_limit_for_onetime === ''
           || this.$store.state.disinfection.latestModify.d2_target_cl === ''
           || this.$store.state.disinfection.latestModify.e2_target_cl === '') {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else {
          let obj = {}
          obj.g_pre_set_max = parseFloat(this.$store.state.disinfection.latestModify.g_pre_set_max)
          obj.g_pre_set_min = parseFloat(this.$store.state.disinfection.latestModify.g_pre_set_min)
          obj.g_pre_chg_limit_for_onetime = parseFloat(this.$store.state.disinfection.latestModify.g_pre_chg_limit_for_onetime)
          obj.d1_target_cl = parseFloat(this.$store.state.disinfection.latestModify.d1_target_cl)
          obj.e1_target_cl = parseFloat(this.$store.state.disinfection.latestModify.e1_target_cl)
          obj.g_pre2_set_max = parseFloat(this.$store.state.disinfection.latestModify.g_pre2_set_max)
          obj.g_pre2_set_min = parseFloat(this.$store.state.disinfection.latestModify.g_pre2_set_min)
          obj.g_pre2_chg_limit_for_onetime = parseFloat(this.$store.state.disinfection.latestModify.g_pre2_chg_limit_for_onetime)
          obj.d2_target_cl = parseFloat(this.$store.state.disinfection.latestModify.d2_target_cl)
          obj.e2_target_cl = parseFloat(this.$store.state.disinfection.latestModify.e2_target_cl)
          if ((obj.g_pre_set_max < pre_min_limit || obj.g_pre_set_max > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 주입률 상한 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_pre_set_min < pre_min_limit || obj.g_pre_set_min > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 주입률 하한 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_pre_chg_limit_for_onetime < pre_min_limit || obj.g_pre_chg_limit_for_onetime > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 1회 변경 주입률 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.d1_target_cl < cl_min_limit || obj.d1_target_cl > cl_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 혼화수 목표 잔류염소 설정 범위', text2: cl_min_limit + ' ~ ' + cl_max_limit})
            return
          }
          if ((obj.e1_target_cl < cl_min_limit || obj.e1_target_cl > cl_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 침전수 목표 잔류염소 설정 범위', text2: cl_min_limit + ' ~ ' + cl_max_limit})
            return
          }
          if ((obj.g_pre2_set_max < pre_min_limit || obj.g_pre2_set_max > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 주입률 상한 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_pre2_set_min < pre_min_limit || obj.g_pre2_set_min > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 주입률 하한 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_pre2_chg_limit_for_onetime < pre_min_limit || obj.g_pre2_chg_limit_for_onetime > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 1회 변경 주입률 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.d2_target_cl < cl_min_limit || obj.d2_target_cl > cl_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 혼화수 목표 잔류염소 설정 범위', text2: cl_min_limit + ' ~ ' + cl_max_limit})
            return
          }
           if ((obj.e2_target_cl < cl_min_limit || obj.e2_target_cl > cl_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 침전수 목표 잔류염소 설정 범위', text2: cl_min_limit + ' ~ ' + cl_max_limit})
            return
          }
          this.$store.dispatch(PUT_DISINFECTION_CONTROL_PRE, obj)
          this.$store.state.disinfection.isModifyMode = !this.$store.state.disinfection.isModifyMode
        }
      } else {
        this.$store.state.disinfection.isModifyMode = !this.$store.state.disinfection.isModifyMode
      }
    },
    cancelControl: function() {
      this.$store.state.disinfection.latestModify = Object.assign({}, this.$store.state.disinfection.latest)
      this.$store.state.disinfection.isModifyMode = !this.$store.state.disinfection.isModifyMode
    }
  },
  watch: {
    // '$store.state.disinfection.latestModify.g_pre_set_max': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_pre_set_max'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_pre_set_max'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_pre_set_max'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_pre_set_min': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_pre_set_min'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_pre_set_min'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_pre_set_min'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_pre_chg_limit_for_onetime': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_pre_chg_limit_for_onetime'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_pre_chg_limit_for_onetime'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_pre_chg_limit_for_onetime'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.d1_target_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['d1_target_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['d1_target_cl'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['d1_target_cl'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.e1_target_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['e1_target_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['e1_target_cl'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['e1_target_cl'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_pre2_set_max': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_pre2_set_max'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_pre2_set_max'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_pre2_set_max'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_pre2_set_min': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_pre2_set_min'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_pre2_set_min'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_pre2_set_min'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_pre2_chg_limit_for_onetime': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_pre2_chg_limit_for_onetime'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_pre2_chg_limit_for_onetime'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_pre2_chg_limit_for_onetime'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.d2_target_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['d2_target_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['d2_target_cl'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['d2_target_cl'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.e2_target_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['e2_target_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['e2_target_cl'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['e2_target_cl'] = oldVal
    //     }
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.main{
  display: flex;
  flex-flow: column;
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
  .contents-value{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 592px;
    height: 160px;
    margin-top: 6px;
    background-image: url('../../assets/disinfection/contents_right_bottom.png');
    background-size: 100% 100%;
    text-align: center;
    &__icon {
      position: absolute;
      top: 17px;
      right: 54px;
      cursor: pointer;
      z-index: 20;
    }
    &__row {
      position: relative;
      left: -50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: 1px 0px;
      > div {
        width: 74px;
        height: 24px;
        box-sizing: border-box;
        > input {
          width: 100%;
          height: 26px;
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
      color: white;
      margin: 4px 8px;
    }
    &__line {
      width: 74px;
      height: 24px;
      display: flex;
      justify-content: flex-end;
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
      margin: 4px 8px;
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
  .btn-tab{
    display: flex;
    margin-left: 134px;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.3;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    .box-center-margin{
      margin: 0 16px;
    }
    &__box-abled{
      width: 90px;
      height: 34px;
      box-shadow: 0 0 10px 0 rgba(172, 207, 255, 0.7);
      border: solid 1px #b4dffa;
      background-color: rgba(139, 194, 240, 0.4);
      cursor: pointer;
    }
    &__box-disabled{
      width: 90px;
      height: 34px;
      border: solid 1px #b4dffa;
      background-color: rgba(139, 194, 240, 0.25);
      cursor: pointer;
    }
  }
  .contents-img{
    width: 595px;
    height: 527px;
    background-image: url('../../assets/as_images/asan_sub_09.png');
    background-position-x: center;
    margin: 15px 0;
    .one-line-h{
      top: 520px;
      left: 180px;
    }
    .one-line-v1{
      top: 438px;
      left: 190px;
    }
    .one-line-v2{
      top: 438px;
       left: 510px;
    }
    .two-line-h{
      top: 520px;
      left: 463px;
    }
    .two-line-v1{
      top: 438px;
      left: 476px;
    }
    .two-line-v2{
      top: 438px;
      left: 225px;
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
      100% {opacity:0; transform: translateY(35px);}
    }
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