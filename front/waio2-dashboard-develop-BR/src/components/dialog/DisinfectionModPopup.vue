<template>
  <div v-if="this.$store.state.dialog.disinfection.visible" class="main">
    <div class="popup-main">
      <div class="popup-contents">
        <div class="top">
          <div class="top__img"></div>
          <div class="top__title">시간대별 주입률 설정</div>
          <div class="btn-wrap">
            <button class="btn-wrap__save" @click="updateControl()">저장</button>
            <button class="btn-wrap__cancel" @click="closePopup()">취소</button>
          </div>
        </div>   
        <div class="contents">
          <div class="contents__wrap">
            <ul>
              <div class="contents__title">시간대</div>
              <div class="contents__title-time">0~1시</div>
              <div class="contents__title-time">1~2시</div>
              <div class="contents__title-time">2~3시</div>
              <div class="contents__title-time">3~4시</div>
              <div class="contents__title-time">4~5시</div>
              <div class="contents__title-time">5~6시</div>
              <div class="contents__title-time">6~7시</div>
              <div class="contents__title-time">7~8시</div>
            </ul>
            <ul>
              <div class="contents__title">주입률 상한</div>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_0" v-on:input="updateInput($event, 'g_pre_max_limit_0')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_1" v-on:input="updateInput($event, 'g_pre_max_limit_1')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_2" v-on:input="updateInput($event, 'g_pre_max_limit_2')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_3" v-on:input="updateInput($event, 'g_pre_max_limit_3')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_4" v-on:input="updateInput($event, 'g_pre_max_limit_4')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_5" v-on:input="updateInput($event, 'g_pre_max_limit_5')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_6" v-on:input="updateInput($event, 'g_pre_max_limit_6')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_7" v-on:input="updateInput($event, 'g_pre_max_limit_7')">
              </li>
            </ul>
            <ul>
              <div class="contents__title">주입률 하한</div>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_0" v-on:input="updateInput($event, 'g_pre_min_limit_0')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_1" v-on:input="updateInput($event, 'g_pre_min_limit_1')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_2" v-on:input="updateInput($event, 'g_pre_min_limit_2')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_3" v-on:input="updateInput($event, 'g_pre_min_limit_3')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_4" v-on:input="updateInput($event, 'g_pre_min_limit_4')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_5" v-on:input="updateInput($event, 'g_pre_min_limit_5')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_6" v-on:input="updateInput($event, 'g_pre_min_limit_6')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_7" v-on:input="updateInput($event, 'g_pre_min_limit_7')">
              </li>
            </ul>
          </div>
          <div class="contents__wrap">
            <ul>
              <div class="contents__title">시간대</div>
              <div class="contents__title-time">8~9시</div>
              <div class="contents__title-time">9~10시</div>
              <div class="contents__title-time">10~11시</div>
              <div class="contents__title-time">11~12시</div>
              <div class="contents__title-time">12~13시</div>
              <div class="contents__title-time">13~14시</div>
              <div class="contents__title-time">14~15시</div>
              <div class="contents__title-time">15~16시</div>
            </ul>
            <ul>
              <div class="contents__title">주입률 상한</div>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_8" v-on:input="updateInput($event, 'g_pre_max_limit_8')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_9" v-on:input="updateInput($event, 'g_pre_max_limit_9')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_10" v-on:input="updateInput($event, 'g_pre_max_limit_10')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_11" v-on:input="updateInput($event, 'g_pre_max_limit_11')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_12" v-on:input="updateInput($event, 'g_pre_max_limit_12')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_13" v-on:input="updateInput($event, 'g_pre_max_limit_13')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_14" v-on:input="updateInput($event, 'g_pre_max_limit_14')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_15" v-on:input="updateInput($event, 'g_pre_max_limit_15')">
              </li>
            </ul>
            <ul>
              <div class="contents__title">주입률 하한</div>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_8" v-on:input="updateInput($event, 'g_pre_min_limit_8')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_9" v-on:input="updateInput($event, 'g_pre_min_limit_9')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_10" v-on:input="updateInput($event, 'g_pre_min_limit_10')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_11" v-on:input="updateInput($event, 'g_pre_min_limit_11')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_12" v-on:input="updateInput($event, 'g_pre_min_limit_12')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_13" v-on:input="updateInput($event, 'g_pre_min_limit_13')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_14" v-on:input="updateInput($event, 'g_pre_min_limit_14')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_15" v-on:input="updateInput($event, 'g_pre_min_limit_15')">
              </li>
            </ul>
          </div>
          <div class="contents__wrap">
            <ul>
              <div class="contents__title">시간대</div>
              <div class="contents__title-time">16~17시</div>
              <div class="contents__title-time">17~18시</div>
              <div class="contents__title-time">18~19시</div>
              <div class="contents__title-time">19~20시</div>
              <div class="contents__title-time">20~21시</div>
              <div class="contents__title-time">21~22시</div>
              <div class="contents__title-time">22~23시</div>
              <div class="contents__title-time">23~24시</div>
            </ul>
            <ul>
              <div class="contents__title">주입률 상한</div>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_16" v-on:input="updateInput($event, 'g_pre_max_limit_16')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_17" v-on:input="updateInput($event, 'g_pre_max_limit_17')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_18" v-on:input="updateInput($event, 'g_pre_max_limit_18')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_19" v-on:input="updateInput($event, 'g_pre_max_limit_19')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_20" v-on:input="updateInput($event, 'g_pre_max_limit_20')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_21" v-on:input="updateInput($event, 'g_pre_max_limit_21')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_22" v-on:input="updateInput($event, 'g_pre_max_limit_22')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_max_limit_23" v-on:input="updateInput($event, 'g_pre_max_limit_23')">
              </li>
            </ul>
            <ul>
              <div class="contents__title">주입률 하한</div>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_16" v-on:input="updateInput($event, 'g_pre_min_limit_16')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_17" v-on:input="updateInput($event, 'g_pre_min_limit_17')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_18" v-on:input="updateInput($event, 'g_pre_min_limit_18')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_19" v-on:input="updateInput($event, 'g_pre_min_limit_19')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_20" v-on:input="updateInput($event, 'g_pre_min_limit_20')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_21" v-on:input="updateInput($event, 'g_pre_min_limit_21')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_22" v-on:input="updateInput($event, 'g_pre_min_limit_22')">
              </li>
              <li class="contents__list">
                <input type="text" :value="this.$store.state.disinfection.latestModify.g_pre_min_limit_23" v-on:input="updateInput($event, 'g_pre_min_limit_23')">
              </li>
            </ul>
          </div>
        </div>   
      </div>
    </div>
  </div>
</template>
<script> 
import { CLOSE_DISINFECTION_POPUP } from '@/store/modules/dialog'
import { PUT_DISINFECTION_CONTROL_CHOLRATE } from '@/store/modules/disinfection'
export default {
  name: 'DisinfectionModPopup',
  data: () => ({
    timer: null, // API 요청 타이머
  }),
  computed: {
  },
  methods: {
    updateInput: function (event, key) {
      this.$store.state.disinfection.latestModify[key] = event.target.value
    },
    updateControl: function() {
      let pre_min_limit = 0
      let pre_max_limit = 100
      if (this.$store.state.disinfection.isPopupModifyMode) {
        if (this.$store.state.disinfection.latestModify.g_pre_max_limit_0 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_1 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_2 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_3 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_4 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_5 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_6 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_7 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_8 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_9 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_10 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_11 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_12 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_13 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_14 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_15 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_16 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_17 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_18 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_19 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_20 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_21 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_22 === ''
           || this.$store.state.disinfection.latestModify.g_pre_max_limit_23 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_0 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_1 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_2 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_3 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_4 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_5 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_6 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_7 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_8 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_9 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_10 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_11 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_12 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_13 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_14 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_15 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_16 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_17 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_18 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_19 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_20 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_21 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_22 === ''
           || this.$store.state.disinfection.latestModify.g_pre_min_limit_23 === '') {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else if (
          parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_0) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_0) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_1) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_1) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_2) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_2) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_3) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_3) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_4) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_4) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_5) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_5) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_6) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_6) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_7) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_7) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_8) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_8) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_9) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_9) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_10) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_10) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_11) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_11) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_12) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_12) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_13) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_13) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_14) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_14) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_15) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_15) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_16) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_16) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_17) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_17) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_18) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_18) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_19) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_19) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_20) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_20) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_21) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_21) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_22) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_22) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_23) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_23) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_0) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_0) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_1) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_1) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_2) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_2) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_3) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_3) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_4) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_4) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_5) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_5) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_6) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_6) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_7) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_7) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_8) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_8) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_9) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_9) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_10) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_10) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_11) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_11) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_12) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_12) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_13) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_13) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_14) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_14) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_15) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_15) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_16) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_16) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_17) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_17) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_18) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_18) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_19) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_19) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_20) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_20) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_21) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_21) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_22) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_22) > pre_max_limit
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_23) < pre_min_limit 
          || parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_23) > pre_max_limit) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '주입률 설정 범위', text2: pre_min_limit + ' ~ ' + pre_max_limit })
        } else {
          let obj = {}
          obj.g_pre_max_limit_0 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_0).toFixed(2)
          obj.g_pre_max_limit_1 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_1).toFixed(2)
          obj.g_pre_max_limit_2 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_2).toFixed(2)
          obj.g_pre_max_limit_3 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_3).toFixed(2)
          obj.g_pre_max_limit_4 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_4).toFixed(2)
          obj.g_pre_max_limit_5 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_5).toFixed(2)
          obj.g_pre_max_limit_6 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_6).toFixed(2)
          obj.g_pre_max_limit_7 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_7).toFixed(2)
          obj.g_pre_max_limit_8 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_8).toFixed(2)
          obj.g_pre_max_limit_9 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_9).toFixed(2)
          obj.g_pre_max_limit_10 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_10).toFixed(2)
          obj.g_pre_max_limit_11 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_11).toFixed(2)
          obj.g_pre_max_limit_12 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_12).toFixed(2)
          obj.g_pre_max_limit_13 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_13).toFixed(2)
          obj.g_pre_max_limit_14 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_14).toFixed(2)
          obj.g_pre_max_limit_15 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_15).toFixed(2)
          obj.g_pre_max_limit_16 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_16).toFixed(2)
          obj.g_pre_max_limit_17 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_17).toFixed(2)
          obj.g_pre_max_limit_18 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_18).toFixed(2)
          obj.g_pre_max_limit_19 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_19).toFixed(2)
          obj.g_pre_max_limit_20 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_20).toFixed(2)
          obj.g_pre_max_limit_21 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_21).toFixed(2)
          obj.g_pre_max_limit_22 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_22).toFixed(2)
          obj.g_pre_max_limit_23 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_max_limit_23).toFixed(2)
          obj.g_pre_min_limit_0 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_0).toFixed(2)
          obj.g_pre_min_limit_1 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_1).toFixed(2)
          obj.g_pre_min_limit_2 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_2).toFixed(2)
          obj.g_pre_min_limit_3 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_3).toFixed(2)
          obj.g_pre_min_limit_4 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_4).toFixed(2)
          obj.g_pre_min_limit_5 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_5).toFixed(2)
          obj.g_pre_min_limit_6 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_6).toFixed(2)
          obj.g_pre_min_limit_7 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_7).toFixed(2)
          obj.g_pre_min_limit_8 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_8).toFixed(2)
          obj.g_pre_min_limit_9 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_9).toFixed(2)
          obj.g_pre_min_limit_10 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_10).toFixed(2)
          obj.g_pre_min_limit_11 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_11).toFixed(2)
          obj.g_pre_min_limit_12 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_12).toFixed(2)
          obj.g_pre_min_limit_13 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_13).toFixed(2)
          obj.g_pre_min_limit_14 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_14).toFixed(2)
          obj.g_pre_min_limit_15 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_15).toFixed(2)
          obj.g_pre_min_limit_16 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_16).toFixed(2)
          obj.g_pre_min_limit_17 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_17).toFixed(2)
          obj.g_pre_min_limit_18 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_18).toFixed(2)
          obj.g_pre_min_limit_19 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_19).toFixed(2)
          obj.g_pre_min_limit_20 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_20).toFixed(2)
          obj.g_pre_min_limit_21 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_21).toFixed(2)
          obj.g_pre_min_limit_22 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_22).toFixed(2)
          obj.g_pre_min_limit_23 = parseFloat(this.$store.state.disinfection.latestModify.g_pre_min_limit_23).toFixed(2)

          this.$store.dispatch(PUT_DISINFECTION_CONTROL_CHOLRATE, obj)
        }
      } else {
        this.$store.state.disinfection.isPopupModifyMode = !this.$store.state.disinfection.isPopupModifyMode
      }
    },
    /**
     * 팝업이 닫힘 버튼 선택시 
     * 타이머 종료
     */
    closePopup: function () {
      this.$store.commit('dialog/' + CLOSE_DISINFECTION_POPUP)
      this.$store.state.disinfection.latestModify = Object.assign({}, this.$store.state.disinfection.latest)
      this.$store.state.disinfection.isPopupModifyMode = false
    },
  },
  created: function () {
    // console.log(this.$options.name + ' created')
  },
  /**
   * 마운트시 
   * fullscreenchange 이벤트 등록
   */
  // mounted: function () {
  //   console.log(this.$options.name + ' mounted')
  //   window.addEventListener('fullscreenchange', this.fullscreenchanged)
  // },
  /**
   * 마운트 해제시 
   * fullscreenchange 이벤트 해제
   */
  // beforeDestroy () { window.removeEventListener('fullscreenchange', this.fullscreenchanged) },
  destroyed: function () {
    console.log(this.$options.name + ' destoryed')
  },
  updated: function () {
    console.log(this.$options.name + ' updated')
  },
} 
</script>
<style lang="scss" scoped>
.main {
  position: absolute;
  top: -85px;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 1190px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  background-color: rgba(30,37,61,0.8);
  .popup-main {
    width: 1212px;
    height: 558px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 50%);
    // background-image: url('../../assets/sedimentation/popup_main.png');
    .popup-contents {
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url('../../assets/br_images/mode-bg.png');
      background-size: 100% 100%;
      padding: 30px 25px;
      .top-title{
        height: 53px;
        margin-top: 25px;
        background-image: url('../../assets/sedimentation/bottom_title_img.png');
        text-shadow: 0 0 9px #5cafff;
        font-size: 18px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        background-position: 50%;
      }
      .btn-wrap {
        display: flex;
        justify-content: center;
        margin-left: auto;
        > button {
          width: 85px;
          height: 38px;
          margin: 0 3px;
        }
        &__save {
          background-color: #457fbc;
          color: #fff;
        }
        &__save:hover {
          background-color: #3a99ff;
          transition: .2s;
          color: #fff;
        }
        &__cancel {
          border: 1px solid #457fbc;
          color: #b4dffb;
        }
      }
      .top{
        display: flex;
        align-items: center;
        width: 100%;
        padding: 10px;
        &__img{
          width: 19px;
          height: 30px;
          background-image: url('../../assets/sedimentation/top_title_img.png');
        }
        &__title{
          margin-left: 10px;
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: left;
          color: #b4dffb;
        }
        // &__exit-btn{
        //   margin-left: auto;
        //   width: 24px;
        //   height: 30px;
        //   background-image: url('../../assets/sedimentation/exit_btn.png');
        //   background-position-y: center;
        //   cursor: pointer;
        //   z-index: 9;
        // }
      }  
      .contents {
        display: flex;
        justify-content: space-evenly;
        padding: 20px;
        &__wrap {
          display: flex;
          justify-content: space-between;
          > ul {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0;
          }
        }
        &__title {
          width: 115px;
          height: 44px;
          text-align: center;
          line-height: 2.7;
          color: #fff;
          margin-bottom: 5px;
          background-image: url('../../assets/br_images/mode-title.png');
          background-size: 100% 100%;
        }
        &__title-time {
          width: 120px;
          height: 39px;
          text-align: center;
          line-height: 2.5;
          color: #fff;
          margin-bottom: 5px;
          background-image: url('../../assets/br_images/mode-title-time.png');
          background-size: 100% 100%;
        }
        &__list{
          width: 110px;
          height: 39px;
          list-style: none;
          margin-bottom: 5px;
          > input {
            width: 100%;
            height: 100%;
            text-align: center;
            color: #b4dffb;
            border: 1px solid #245dab;
          }
          > input:focus {
            outline: 1px solid #93baf0;;
          }
        }
      }
    }
  }
}
</style>