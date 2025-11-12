<template>
  <div class="main">
    <div class="water-v-flow-one-img three">
        <div class="buble-v delay1"></div>
        <div class="buble-v delay2"></div>
        <div class="buble-v delay3"></div>
    </div>
    <div class="btn-tab">
      <div class="btn-tab__box-abled">2단계생활</div>
    </div>
    <div class="contents-img">
      <!-- 1계열 -->
      <div>
        <div class="pump-title-wrap-one"><p class="pump-title-wrap-one__title">1계열</p>
        <p class="pump-title pump-one">펌프1</p>
        <p class="pump-title pump-two">펌프2</p>
        </div>
        <div class="water-v1-flow-one-img one-line-v1" :style="{ display: this.getDisplayStyle1 }">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
        <div class="water-h1-flow-one-img one-line-h" :style="{ display: this.getDisplayStyle1 }">
          <div class="buble delay1"></div>
          <div class="buble delay2"></div>
        </div>
        <div class="water-v2-flow-one-img one-line-v2" :style="{ display: this.getDisplayStyle2 }">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
        <div class="water-h2-flow-one-img one-line-h2" :style="{ display: this.getDisplayStyle2 }">
          <div class="buble delay1"></div>
          <div class="buble delay2"></div>
        </div>
        <div class="water-v-flow-one-img-bottom one-line-v3">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
      </div>
      <!-- 2계열 -->
      <div>
        <div class="pump-title-wrap-two"><p class="pump-title-wrap-two__title">2계열</p>
          <p class="pump-title pump-one">펌프1</p>
          <p class="pump-title pump-two">펌프2</p>
        </div>
        <div class="water-v1-flow-two-img two-line-v1" :style="{ display: this.getDisplayStyle3 }">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
        <div class="water-h1-flow-two-img two-line-h" :style="{ display: this.getDisplayStyle3 }">
          <div class="buble delay1"></div>
          <div class="buble delay2"></div>
        </div>
        <div class="water-v2-flow-two-img two-line-v2" :style="{ display: this.getDisplayStyle4 }">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
        <div class="water-h2-flow-two-img two-line-h2" :style="{ display: this.getDisplayStyle4 }">
          <div class="buble delay1"></div>
          <div class="buble delay2"></div>
        </div>
        <div class="water-v-flow-one-img-bottom two-line-v3">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
      </div>      
    </div>
    <div class="contents-wrap">
      <div class="contents-value">
        <div class="contents-value__row">
          <div class="contents-value__title" style="width: 50px;"></div>
          <div class="contents-value__line"><span>1계열</span></div>
          <div class="contents-value__line"><span>2계열</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">주입률상한</div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_set_max" v-on:input="updateInput($event, 'g_post_1_set_max')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_set_max | numFormat('0.00') }}</span></div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_set_max" v-on:input="updateInput($event, 'g_post_2_set_max')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_set_max | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">주입률하한</div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_set_min" v-on:input="updateInput($event, 'g_post_1_set_min')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_set_min | numFormat('0.00') }}</span></div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_set_min" v-on:input="updateInput($event, 'g_post_2_set_min')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_set_min | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">1회 변경 주입률</div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_chg_limit_for_onetime" v-on:input="updateInput($event, 'g_post_1_chg_limit_for_onetime')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_chg_limit_for_onetime | numFormat('0.00') }}</span></div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_chg_limit_for_onetime" v-on:input="updateInput($event, 'g_post_2_chg_limit_for_onetime')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_chg_limit_for_onetime | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">정수지 유입<br/>목표 잔류염소</div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_h_in_1_obj_residual_cl" v-on:input="updateInput($event, 'g_h_in_1_obj_residual_cl')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_h_in_1_obj_residual_cl | numFormat('0.00') }}</span></div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_h_in_2_obj_residual_cl" v-on:input="updateInput($event, 'g_h_in_2_obj_residual_cl')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_h_in_2_obj_residual_cl | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">정수지 유입<br/>잔류염소 홀딩 범위</div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_h_in_1_residual_cl_holding" v-on:input="updateInput($event, 'g_h_in_1_residual_cl_holding')" maxlength="5"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_h_in_1_residual_cl_holding | numFormat('0.00') }}</span></div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_h_in_2_residual_cl_holding" v-on:input="updateInput($event, 'g_h_in_2_residual_cl_holding')" maxlength="5"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_h_in_2_residual_cl_holding | numFormat('0.00') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">보정주기</div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_calib_cycle" v-on:input="updateInput($event, 'g_post_1_calib_cycle')" maxlength="5"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_calib_cycle | numFormat('0') }}</span></div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_calib_cycle" v-on:input="updateInput($event, 'g_post_2_calib_cycle')" maxlength="5"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_calib_cycle | numFormat('0') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">보정상수</div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_calib_num" v-on:input="updateInput($event, 'g_post_1_calib_num')" maxlength="5"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_calib_num | numFormat('0.0') }}</span></div>
          <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_calib_num" v-on:input="updateInput($event, 'g_post_2_calib_num')" maxlength="5"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_calib_num | numFormat('0.0') }}</span></div>
        </div>
        <div class="contents-value__row">
          <div class="contents-value__title">주입 후 경과 시간</div>
          <div class="contents-value__number"><span>{{ this.$store.state.disinfection.latest.g_1_elapsed_time }}</span></div>
          <div class="contents-value__number"><span>{{ this.$store.state.disinfection.latest.g_2_elapsed_time }}</span></div>
        </div>
      </div>
      <div class="contents-value-icon" v-if="$store.state.login.user.tkn !== null">
        <div class="custom-icon" @click="updateControl">
          <div :class="[ this.$store.state.disinfection.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
        </div>
        <div v-if="this.$store.state.disinfection.isModifyMode" class="custom-cancel-icon" style="margin-top: 3px;" @click="cancelControl">
          <div class='custom-cancel-icon__cancel'></div>
        </div>
      </div>
    </div>         
    <!-- <div class="contents-value">
      <div v-if="$store.state.login.user.tkn !== null"  class="contents-value__icon">
        <div class="custom-icon" @click="updateControl">
          <div :class="[ this.$store.state.disinfection.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
        </div>
        <div v-if="this.$store.state.disinfection.isModifyMode" class="custom-cancel-icon" style="margin-top: 3px;" @click="cancelControl">
          <div class='custom-cancel-icon__cancel'></div>
        </div>
      </div>
      <div class="contents-value__row">
        <div class="contents-value__line"></div>
        <div class="contents-value__title">주입률 상한</div>
        <div class="contents-value__title">주입률 하한</div>
        <div class="contents-value__title">1회 변경<br/>주입률</div>
        <div class="contents-value__title">정수지유입<br/>목표잔류염소</div>
        <div class="contents-value__title">보정주기</div>
        <div class="contents-value__title">주입 후<br/>경과 시간</div>
        <div class="contents-value__title">보정상수</div>
      </div>
      <div class="contents-value__row">
        <div class="contents-value__line"><span>1계열</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_set_max" v-on:input="updateInput($event, 'g_post_1_set_max')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_set_max | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_set_min" v-on:input="updateInput($event, 'g_post_1_set_min')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_set_min | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_chg_limit_for_onetime" v-on:input="updateInput($event, 'g_post_1_chg_limit_for_onetime')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_chg_limit_for_onetime | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_h_in_1_obj_residual_cl" v-on:input="updateInput($event, 'g_h_in_1_obj_residual_cl')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_h_in_1_obj_residual_cl | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_calib_cycle" v-on:input="updateInput($event, 'g_post_1_calib_cycle')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_calib_cycle | numFormat('0') }}</span></div>
        <div class="contents-value__number"><span>{{ this.$store.state.disinfection.latest.g_1_elapsed_time }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_1_calib_num" v-on:input="updateInput($event, 'g_post_1_calib_num')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_1_calib_num | numFormat('0.0') }}</span></div>
      </div>
      <div class="contents-value__row">
        <div class="contents-value__line"><span>2계열</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_set_max" v-on:input="updateInput($event, 'g_post_2_set_max')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_set_max | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_set_min" v-on:input="updateInput($event, 'g_post_2_set_min')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_set_min | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_chg_limit_for_onetime" v-on:input="updateInput($event, 'g_post_2_chg_limit_for_onetime')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_chg_limit_for_onetime | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_h_in_2_obj_residual_cl" v-on:input="updateInput($event, 'g_h_in_2_obj_residual_cl')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_h_in_2_obj_residual_cl | numFormat('0.00') }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_calib_cycle" v-on:input="updateInput($event, 'g_post_2_calib_cycle')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_calib_cycle | numFormat('0') }}</span></div>
        <div class="contents-value__number"><span>{{ this.$store.state.disinfection.latest.g_2_elapsed_time }}</span></div>
        <div class="contents-value__number"><input v-if="this.$store.state.disinfection.isModifyMode" type="text" :value="this.$store.state.disinfection.latestModify.g_post_2_calib_num" v-on:input="updateInput($event, 'g_post_2_calib_num')"/><span v-else>{{ this.$store.state.disinfection.latestModify.g_post_2_calib_num | numFormat('0.0') }}</span></div>
      </div>
    </div> -->
  </div>  
</template>
<script>
import { PUT_DISINFECTION_CONTROL_POST } from '@/store/modules/disinfection'
export default {
  data: () => ({
    // isModifyMode: false
  }),
  computed: {
    getDisplayStyle1() {
      return this.$store.state.disinfection.latest.g_1_pump_1_run === 1 ? 'block' : 'none'
    },
    getDisplayStyle2() {
      return this.$store.state.disinfection.latest.g_1_pump_2_run === 1 ? 'block' : 'none'
    },
    getDisplayStyle3() {
      return this.$store.state.disinfection.latest.g_2_pump_1_run === 1 ? 'block' : 'none'
    },
    getDisplayStyle4() {
      return this.$store.state.disinfection.latest.g_2_pump_2_run === 1 ? 'block' : 'none'
    }
  },
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
        if (this.$store.state.disinfection.latestModify.g_post_1_set_max === ''
           || this.$store.state.disinfection.latestModify.g_post_1_set_min === ''
           || this.$store.state.disinfection.latestModify.g_post_1_chg_limit_for_onetime === ''
           || this.$store.state.disinfection.latestModify.g_h_in_1_obj_residual_cl === ''
           || this.$store.state.disinfection.latestModify.g_h_in_2_obj_residual_cl === ''
           || this.$store.state.disinfection.latestModify.g_h_in_1_residual_cl_holding === ''
           || this.$store.state.disinfection.latestModify.g_h_in_2_residual_cl_holding === ''
           || this.$store.state.disinfection.latestModify.g_post_2_set_max === ''
           || this.$store.state.disinfection.latestModify.g_post_2_set_min === ''
           || this.$store.state.disinfection.latestModify.g_post_2_chg_limit_for_onetime === ''
           || this.$store.state.disinfection.latestModify.g_post_1_calib_cycle === ''
           || this.$store.state.disinfection.latestModify.g_post_2_calib_cycle === ''
           || this.$store.state.disinfection.latestModify.g_post_1_calib_num === ''
           || this.$store.state.disinfection.latestModify.g_post_2_calib_num === ''
          ) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else {
          let obj = {}
          obj.g_post_1_set_max = parseFloat(this.$store.state.disinfection.latestModify.g_post_1_set_max)
          obj.g_post_1_set_min = parseFloat(this.$store.state.disinfection.latestModify.g_post_1_set_min)
          obj.g_post_1_chg_limit_for_onetime = parseFloat(this.$store.state.disinfection.latestModify.g_post_1_chg_limit_for_onetime)
          obj.g_h_in_1_obj_residual_cl = parseFloat(this.$store.state.disinfection.latestModify.g_h_in_1_obj_residual_cl)
          obj.g_h_in_2_obj_residual_cl = parseFloat(this.$store.state.disinfection.latestModify.g_h_in_2_obj_residual_cl)
          obj.g_h_in_1_residual_cl_holding = parseFloat(this.$store.state.disinfection.latestModify.g_h_in_1_residual_cl_holding)
          obj.g_h_in_2_residual_cl_holding = parseFloat(this.$store.state.disinfection.latestModify.g_h_in_2_residual_cl_holding)
          obj.g_post_2_set_max = parseFloat(this.$store.state.disinfection.latestModify.g_post_2_set_max)
          obj.g_post_2_set_min = parseFloat(this.$store.state.disinfection.latestModify.g_post_2_set_min)
          obj.g_post_2_chg_limit_for_onetime = parseFloat(this.$store.state.disinfection.latestModify.g_post_2_chg_limit_for_onetime)
          obj.g_post_1_calib_cycle = parseFloat(this.$store.state.disinfection.latestModify.g_post_1_calib_cycle)
          obj.g_post_2_calib_cycle = parseFloat(this.$store.state.disinfection.latestModify.g_post_2_calib_cycle)
          obj.g_post_1_calib_num = parseFloat(this.$store.state.disinfection.latestModify.g_post_1_calib_num)
          obj.g_post_2_calib_num = parseFloat(this.$store.state.disinfection.latestModify.g_post_2_calib_num)
          if ((obj.g_post_1_set_max < pre_min_limit || obj.g_post_1_set_max > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 주입률 상한 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_post_1_set_min < pre_min_limit || obj.g_post_1_set_min > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 주입률 하한 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_post_1_chg_limit_for_onetime < pre_min_limit || obj.g_post_1_chg_limit_for_onetime > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 1회 변경 주입률 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_post_2_set_max < pre_min_limit || obj.g_post_2_set_max > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 주입률 상한 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_post_2_set_min < pre_min_limit || obj.g_post_2_set_min > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 주입률 하한 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_post_2_chg_limit_for_onetime < pre_min_limit || obj.g_post_2_chg_limit_for_onetime > pre_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 1회 변경 주입률 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit})
            return
          }
          if ((obj.g_h_in_1_obj_residual_cl < cl_min_limit || obj.g_h_in_1_obj_residual_cl > cl_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '1계열 정수지유입 목표 잔류염소 설정 범위', text2: cl_min_limit + ' ~ ' + cl_max_limit})
            return
          }
          if ((obj.g_h_in_2_obj_residual_cl < cl_min_limit || obj.g_h_in_2_obj_residual_cl > cl_max_limit)) {
            this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '2계열 정수지유입 목표 잔류염소 설정 범위', text2: cl_min_limit + ' ~ ' + cl_max_limit})
            return
          }
          this.$store.dispatch(PUT_DISINFECTION_CONTROL_POST, obj)
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
    // '$store.state.disinfection.latestModify.g_post_1_set_max': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_post_1_set_max'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_post_1_set_max'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_post_1_set_max'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_post_2_set_max': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_post_2_set_max'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_post_2_set_max'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_post_2_set_max'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_post_1_set_min': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_post_1_set_min'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_post_1_set_min'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_post_1_set_min'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_post_2_set_min': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_post_2_set_min'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_post_2_set_min'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_post_2_set_min'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_post_1_chg_limit_for_onetime': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_post_1_chg_limit_for_onetime'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_post_1_chg_limit_for_onetime'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_post_1_chg_limit_for_onetime'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_post_2_chg_limit_for_onetime': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_post_2_chg_limit_for_onetime'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_post_2_chg_limit_for_onetime'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_post_2_chg_limit_for_onetime'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_h_in_1_obj_residual_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_h_in_1_obj_residual_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_h_in_1_obj_residual_cl'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_h_in_1_obj_residual_cl'] = oldVal
    //     }
    //   }
    // },
    // '$store.state.disinfection.latestModify.g_h_in_2_obj_residual_cl': function(newVal, oldVal) {
    //   if (newVal === '') {
    //     this.$store.state.disinfection.latestModify['g_h_in_2_obj_residual_cl'] = newVal
    //   } else {
    //     if (this.checkNumberFormat(newVal)) {
    //       this.$store.state.disinfection.latestModify['g_h_in_2_obj_residual_cl'] = newVal
    //     } else {
    //       this.$store.state.disinfection.latestModify['g_h_in_2_obj_residual_cl'] = oldVal
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
  width: 100%;
  height: 100%;
  align-items: center;
  .three{
    top: 0px;
    left: 1509px;
}
  .contents-wrap {
    position: relative;
   }   
  .contents-value {
    display: flex;
    width: 600px;
    overflow-x: auto;
    padding: 10px 0;
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
      margin: 10px 0 15px 0;
    }
    &__line {
      width: 50px !important;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-shadow: 0 0 9px #5cafff;
      font-size: 16px;
      color: #9fc4ff;
      margin-bottom: 10px;
    }
    &__number {
      display: flex;
      justify-content: center;
      align-items: center;
      text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
      font-family: "LAB디지털" !important;
      font-size: 24px;
      color: #ccf1ff;
      margin-bottom: 10px;
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
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.3;
    letter-spacing: normal;
    text-align: center;
    color: #061732;
    width: 260px;
    height: 45px;
    justify-content: space-evenly;
    align-items: center;
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
    width: 634px;
    height: 560px;
    background-image: url('../../assets/cj_images/sub_05-1.png');
    background-position-x: center;
    margin: 15px 0;
    // 펌프 타이틀 추가
    // 1계열
    .pump-title-wrap-one {
      &__title {
        color: #fff;
        position: absolute;
        top: 240px;
        left: 180px;
      }
    }
    .pump-title-wrap-one .pump-title {
      color: #fff;
      display: inline-block;
      position: absolute;
    }
    .pump-title-wrap-one .pump-one {
      top: 291px;
      left: 113px;
    }
    .pump-title-wrap-one .pump-two {
      top: 291px;
      left: 253px;
    }    
    // 2계열 
    .pump-title-wrap-two {
      &__title {
        color: #fff;
        position: absolute;
        top: 240px;
        left: 463px;
      }
    }
    .pump-title-wrap-two .pump-title {
      color: #fff;
      display: inline-block;
      position: absolute;
    }
    .pump-title-wrap-two .pump-one {
      top: 291px;
      left: 405px;
    }
    .pump-title-wrap-two .pump-two {
      top: 291px;
      left: 547px;
    }    
    .one-line-h{
      top: 533px;
      left: 125px;
    }
    .one-line-h2{
      top: 533px;
      left: 171px;
    }
    .one-line-v1{
      top: 485px;
      left: 125px;
    }
    .one-line-v2{
      top: 485px;
      left: 263px;
    }
    .one-line-v3{
      top: 536px;
      left: 195px;
    }
    .two-line-h{
      top: 533px;
      left: 420px;
    }
    .two-line-h2{
      top: 533px;
      left: 465px;
    }
    .two-line-v1{
      top: 485px;
      left: 418px;
    }
    .two-line-v2{
      top: 485px;
      left: 555px;
    }
    .two-line-v3{
      top: 536px;
      left: 487px;
    }
    // 1계열
    .water-h1-flow-one-img{
      position: absolute;
      width: 100px;
      height: 8px;
      // transform: rotate(180deg);
      .buble {
        position: absolute;
        width: 100px;
        height: 8px;
        background-image: url('../../assets/disinfection/water_h_flow_one.png');
        background-position: -38px 50%;
        animation-name: arrow-one;
        animation-duration: 4s;
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
    }
    @keyframes arrow-one{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(50px);}
    }
    .water-h2-flow-one-img{
      position: absolute;
      width: 100px;
      height: 8px;
      transform: rotate(180deg);
      .buble {
        position: absolute;
        width: 100px;
        height: 8px;
        background-image: url('../../assets/disinfection/water_h_flow_one.png');
        background-position: -38px 50%;
        animation-name: arrow-one;
        animation-duration: 4s;
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
    }
    @keyframes arrow-one{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(50px);}
    }
    .water-v1-flow-one-img{
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
    .water-v2-flow-one-img{
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
        animation-delay: 6s;
      }
      .delay2 {
        animation-delay: 8s;
      }
    }
    @keyframes arrow-two-bottom{ 
      0% {opacity:0; transform: translateY(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateY(35px);}
    }
    // 2계열
    .water-h1-flow-two-img{
      position: absolute;
      width: 100px;
      height: 8px;
      transform: rotate(180deg);

      .buble {
        position: absolute;
        width: 100px;
        height: 8px;
        background-image: url('../../assets/disinfection/water_h_flow_two.png');
        background-position: 88px 50%;
        animation-name: arrow-three;
        animation-duration: 4s;
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
    }
    @keyframes arrow-three{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(-50px);}
    }
    .water-h2-flow-two-img{
      position: absolute;
      width: 100px;
      height: 8px;
      transform: rotate(180deg);
      .buble {
        position: absolute;
        width: 100px;
        height: 8px;
        background-image: url('../../assets/disinfection/water_h_flow_one.png');
        background-position: -38px 50%;
        animation-name: arrow-one;
        animation-duration: 4s;
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
    }
    @keyframes arrow-one{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(50px);}
    }
    .water-v1-flow-two-img{
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
    .water-v2-flow-two-img{
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