<template>
  <div v-if="this.$store.state.dialog.receiving.visible" class="popup-wrap">
    <div class="popup-main">
      <div class="popup-contents">
        <div class="top">
          <div class="top__img"></div>
          <div class="top__title">사용자 제어 설정</div>
          <div class="top__exit-btn" @click="closePopup()"></div>
        </div>         
        <!-- 정수지 목표 수위/개도율 변화 -->
        <div class="right-value">
          <div class="right-value__text"></div>
          <div class="right-value__title">최대</div>
          <div class="right-value__title">최소</div>
        </div>  
        <div class="right-value mt10">
          <div class="right-value__text">정수지 목표 수위<span>(m)</span></div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.h_target_le_max"
            v-on:input="updateInput($event, 'h_target_le_max')">
            <!-- <span class="right-value__text-num" v-else>
              {{ this.$store.state.receiving.latestModify.h_target_le_max | numFormat('0.0') }}
            </span> -->
          </div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.h_target_le_min"
            v-on:input="updateInput($event, 'h_target_le_min')">
            <!-- <span class="right-value__text-num" v-else>
              {{ this.$store.state.receiving.latestModify.h_target_le_min | numFormat('0.0') }}
            </span> -->
          </div>
        </div>  
        <!-- 11.04추가 -->
        <div class="right-value">
          <div class="right-value__text">가이드 베인 제어 범위<span>(%)</span></div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_gv_uplmt | numFormat('0,0')"
            v-on:input="updateInput($event, 'b_valve_gv_uplmt')">
          </div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_gv_lolmt | numFormat('0,0')"
            v-on:input="updateInput($event, 'b_valve_gv_lolmt')">
          </div>
        </div>  
        <div class="right-value">
          <div class="right-value__text">바이패스 제어 범위<span>(%)</span></div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_bypass_uplmt | numFormat('0,0')"
            v-on:input="updateInput($event, 'b_valve_bypass_uplmt')">
          </div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_bypass_lolmt | numFormat('0,0')"
            v-on:input="updateInput($event, 'b_valve_bypass_lolmt')">
          </div>
        </div>  
        <!--// 11.04추가 -->        
        <div class="right-value">
          <div class="right-value__text">가이드 베인 변화<span>(%)</span></div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_gv_max"
            v-on:input="updateInput($event, 'b_valve_gv_max')">
            <!-- <span class="right-value__text-num" v-else>
              {{ this.$store.state.receiving.latestModify.h_target_le_max | numFormat('0.0') }}
            </span> -->
          </div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_gv_min"
            v-on:input="updateInput($event, 'b_valve_gv_min')">
            <!-- <span class="right-value__text-num" v-else>
              {{ this.$store.state.receiving.latestModify.h_target_le_min | numFormat('0.0') }}
            </span> -->
          </div>
        </div> 
        <div class="right-value">
          <div class="right-value__text">바이패스 변화<span>(%)</span></div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_bypass_max"
            v-on:input="updateInput($event, 'b_valve_bypass_max')">
            <!-- <span class="right-value__text-num" v-else>
              {{ this.$store.state.receiving.latestModify.h_target_le_max | numFormat('0.0') }}
            </span> -->
          </div>
          <div class="right-value__input-box">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_bypass_min"
            v-on:input="updateInput($event, 'b_valve_bypass_min')">
            <!-- <span class="right-value__text-num" v-else>
              {{ this.$store.state.receiving.latestModify.h_target_le_min | numFormat('0.0') }}
            </span> -->
          </div>
        </div>  
        <div class="right-value">
          <div class="right-value__text">가이드 베인 전력량<span>(kw)</span></div>
          <div class="right-value__input-box" style="margin-left: 45px;">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_valve_gv_pwr | numFormat('0,0')"
            v-on:input="updateInput($event, 'b_valve_gv_pwr')" maxlength="5">
            <!-- <span class="right-value__text-num" v-else>
              {{ this.$store.state.receiving.latestModify.h_target_le_max | numFormat('0.0') }}
            </span> -->
          </div>
        </div>
        <!-- 20260226 알파값 추가 -->
        <div class="right-value">
          <div class="right-value__text">유출유량 예측 보정 계수<span>(0~1)</span></div>
          <div class="right-value__input-box" style="margin-left: 45px;">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_pred_friout_correction_ratio_factor"
            v-on:input="updateInput($event, 'b_pred_friout_correction_ratio_factor')" maxlength="5">
          </div>
        </div>
        <!-- 실행주기 추가 -->
        <div class="right-value">
          <div class="right-value__text">실행주기<span>(초)</span></div>
          <div class="right-value__input-box" style="margin-left: 45px;">
            <input type="text" :value="this.$store.state.receiving.latestModify.b_process_period_sec"
            v-on:input="updateInput($event, 'b_process_period_sec')" maxlength="5">
          </div>
        </div>  
        <!-- <div v-if="$store.state.login.user.tkn !== null" class="modify-button">
          <div class="custom-icon" @click="updateControl">
            <div :class="[ this.$store.state.receiving.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
          </div>
          <div v-if="this.$store.state.receiving.isModifyMode" class="custom-cancel-icon" style="margin-top: 5px;" @click="cancelControl">
            <div class='custom-cancel-icon__cancel'></div>
          </div>
        </div> -->
        <div class="btn-wrap">
          <button class="btn-wrap__save" @click="updateControl()">저장</button>
          <button class="btn-wrap__cancel" @click="closePopup()">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script> 
import { CLOSE_RECEIVING_POPUP } from '@/store/modules/dialog'
import { PUT_RECEIVING_CONTROL_LEVEL } from '@/store/modules/receiving' 
export default {
  name: 'ReceivingPopup',
  data: () => ({
    // timer: null, // API 요청 타이머
  }),
  computed: {
  },
  methods: {
    updateInput: function (event, key) {
      this.$store.state.receiving.latestModify[key] = event.target.value
    },
    updateControl: function() {
      let waterLevel_min = 0
      let waterLevel_max = 10
      let b_min = 0
      let b_max = 100
      if (this.$store.state.receiving.isModifyMode) {
        if (this.$store.state.receiving.latestModify.h_target_le_max === '' 
        || this.$store.state.receiving.latestModify.h_target_le_min === ''
        || this.$store.state.receiving.latestModify.b_valve_gv_max === ''
        || this.$store.state.receiving.latestModify.b_valve_gv_min === ''
        || this.$store.state.receiving.latestModify.b_valve_bypass_max === ''
        || this.$store.state.receiving.latestModify.b_valve_bypass_min === ''
        || this.$store.state.receiving.latestModify.b_valve_gv_pwr === ''
        || this.$store.state.receiving.latestModify.b_valve_gv_uplmt === ''
        || this.$store.state.receiving.latestModify.b_valve_gv_lolmt === ''
        || this.$store.state.receiving.latestModify.b_valve_bypass_uplmt === ''
        || this.$store.state.receiving.latestModify.b_valve_bypass_lolmt === ''
         //260226 이현수 착수공정 후처리 관련
          //알파값 및 실행주기 추가
        || this.$store.state.receiving.latestModify.b_pred_friout_correction_ratio_factor === ''  //260226 알파값 추가
        || this.$store.state.receiving.latestModify.b_process_period_sec === '') {                //260226 실행주기 추가
          
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else if (parseFloat(this.$store.state.receiving.latestModify.h_target_le_min) < waterLevel_min || parseFloat(this.$store.state.receiving.latestModify.h_target_le_max) > waterLevel_max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '정수지 목표 수위 설정 범위', text2: waterLevel_min + ' ~ ' + waterLevel_max })
        } else if (parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_min) < b_min || 
          parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_min) > b_max ||

          parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_min) < b_min || 
          parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_min) > b_max ||

          parseInt(this.$store.state.receiving.latestModify.b_valve_gv_lolmt) < b_min || 
          parseInt(this.$store.state.receiving.latestModify.b_valve_gv_lolmt) > b_max ||

          parseInt(this.$store.state.receiving.latestModify.b_valve_bypass_lolmt) < b_min || 
          parseInt(this.$store.state.receiving.latestModify.b_valve_bypass_lolmt) > b_max ||

          parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_max) < b_min || 
          parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_max) > b_max ||

          parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_max) < b_min || 
          parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_max) > b_max ||

          parseInt(this.$store.state.receiving.latestModify.b_valve_gv_uplmt) < b_min || 
          parseInt(this.$store.state.receiving.latestModify.b_valve_gv_uplmt) > b_max ||

          parseInt(this.$store.state.receiving.latestModify.b_valve_bypass_uplmt) < b_min || 
          parseInt(this.$store.state.receiving.latestModify.b_valve_bypass_uplmt) > b_max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '변화율 설정 범위', text2: b_min + ' ~ ' + b_max })
        }
        //260226 이현수 착수공정 후처리 관련
        //알파값 및 실행주기 추가
        // 알파값 범위 체크 (0~1)
        else if (parseFloat(this.$store.state.receiving.latestModify.b_pred_friout_correction_ratio_factor) < 0
          || parseFloat(this.$store.state.receiving.latestModify.b_pred_friout_correction_ratio_factor) > 1) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '유출유량 예측 보정 계수는 0~1 사이로 입력해주세요' })
        }
        // 실행주기 체크 (양의 정수)
        else if (parseInt(this.$store.state.receiving.latestModify.b_process_period_sec) <60
          || isNaN(parseInt(this.$store.state.receiving.latestModify.b_process_period_sec))) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '실행주기는 60초 이상으로 입력해주세요' })
        } 
        else {
          let obj = {}
          obj.h_target_le_max = parseFloat(this.$store.state.receiving.latestModify.h_target_le_max).toFixed(1)
          obj.h_target_le_min = parseFloat(this.$store.state.receiving.latestModify.h_target_le_min).toFixed(1)
          obj.b_valve_gv_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_max).toFixed(1)
          obj.b_valve_gv_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_min).toFixed(1)
          obj.b_valve_bypass_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_max).toFixed(1)
          obj.b_valve_bypass_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_min).toFixed(1)
          obj.b_valve_gv_pwr = parseInt(this.$store.state.receiving.latestModify.b_valve_gv_pwr).toFixed(1)
          obj.b_valve_gv_uplmt = parseInt(this.$store.state.receiving.latestModify.b_valve_gv_uplmt)
          obj.b_valve_gv_lolmt = parseInt(this.$store.state.receiving.latestModify.b_valve_gv_lolmt)
          obj.b_valve_bypass_uplmt = parseInt(this.$store.state.receiving.latestModify.b_valve_bypass_uplmt)
          obj.b_valve_bypass_lolmt = parseInt(this.$store.state.receiving.latestModify.b_valve_bypass_lolmt)

          //260226 이현수 착수공정 후처리 관련
          //알파값 및 실행주기 추가
          obj.b_pred_friout_correction_ratio_factor = parseFloat(this.$store.state.receiving.latestModify.b_pred_friout_correction_ratio_factor)
          obj.b_process_period_sec = parseInt(this.$store.state.receiving.latestModify.b_process_period_sec)

          this.$store.dispatch(PUT_RECEIVING_CONTROL_LEVEL, obj)
          this.$store.state.receiving.isModifyMode = !this.$store.state.receiving.isModifyMode
          this.$store.state.receiving.latest.h_target_le_max = parseFloat(this.$store.state.receiving.latestModify.h_target_le_max).toFixed(1)
          this.$store.state.receiving.latest.h_target_le_min = parseFloat(this.$store.state.receiving.latestModify.h_target_le_min).toFixed(1)
          this.$store.state.receiving.latest.b_valve_gv_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_max).toFixed(1)
          this.$store.state.receiving.latest.b_valve_gv_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_gv_min).toFixed(1)
          this.$store.state.receiving.latest.b_valve_bypass_max = parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_max).toFixed(1)
          this.$store.state.receiving.latest.b_valve_bypass_min = parseFloat(this.$store.state.receiving.latestModify.b_valve_bypass_min).toFixed(1)
          this.$store.state.receiving.latest.b_valve_gv_pwr = parseInt(this.$store.state.receiving.latestModify.b_valve_gv_pwr)
          this.$store.state.receiving.latest.b_valve_gv_uplmt = parseInt(this.$store.state.receiving.latestModify.b_valve_gv_uplmt)
          this.$store.state.receiving.latest.b_valve_gv_lolmt = parseInt(this.$store.state.receiving.latestModify.b_valve_gv_lolmt)
          this.$store.state.receiving.latest.b_valve_bypass_uplmt = parseInt(this.$store.state.receiving.latestModify.b_valve_bypass_uplmt)
          this.$store.state.receiving.latest.b_valve_bypass_lolmt = parseInt(this.$store.state.receiving.latestModify.b_valve_bypass_lolmt)

           //260226 이현수 착수공정 후처리 관련
          //알파값 및 실행주기 추가
          this.$store.state.receiving.latest.b_pred_friout_correction_ratio_factor = parseFloat(this.$store.state.receiving.latestModify.b_pred_friout_correction_ratio_factor)
          this.$store.state.receiving.latest.b_process_period_sec = parseInt(this.$store.state.receiving.latestModify.b_process_period_sec)
        }
      } else {
        this.$store.state.receiving.isModifyMode = !this.$store.state.receiving.isModifyMode
      }
    },
    closePopup: function () {
      this.$store.commit('dialog/' + CLOSE_RECEIVING_POPUP)
      this.$store.state.receiving.latestModify = Object.assign({}, this.$store.state.receiving.latest)
    },
  },
  created: function () {
    console.log(this.$options.name + ' created')
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
.popup-wrap {
  position: absolute;
  top: -155px;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 100%;
  min-height: 1156px;
  background-color: rgba(30,37,61,0.8);
  .popup-main{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    // height: 410px;
    // background-image: url('../../assets/sedimentation/popup_main.png');
    .popup-contents{
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url('../../assets/br_images/pump-bg.png');
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
        &__num {
          font-family: "LAB디지털" !important;
          font-size: 32px;
          color: #b4dffb;
          margin-left: 20px;
          vertical-align: middle;
        }
      }
      .mt10 {
        margin-top: 10px !important;
      }
      .right-value {
        display: flex;
        margin-top: 20px;
        &__title {
          width: 70px;
          height: 30px;
          text-align: center;
          color: #fff;
          margin: 0 5px;
        }
        &__text {
          width: 200px;
          height: 25px;
          margin-right: 5px;
          text-align: right;
          color: #fff;
          > span {
            color: #6c9ed1;
            font-size: 12px;
            margin-left: 5px;
          }
        }
        &__text-num {
          text-align: center;
          color: #c3eaff;
        }
        &__num {
          width: 55px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        &__input-box {
          width: 70px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 5px;
          > input {
            width: 70px;
            height: 30px;
            color: #c3eaff;
            text-align: center;
            // outline: none;
            border: solid 1px rgba(157, 191, 255, 0.3);
          }
        }
      }  
      .modify-button {
        position: absolute;
        top: 60px;
        right: 10px;
        cursor: pointer;
      }
      .btn-bg {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background-color: #b4dffa;
      }      
      // .value-contents {
      //   width: 250px;
      //   margin: 30px auto;
      //   &__wrap {
      //     display: flex;
      //     justify-content: center;
      //     align-items: center;
      //     margin-bottom: 20px;
      //     > span {
      //       color: #fff;
      //     }
      //   }
      //   &__num {
      //     display: flex;
      //     align-items: center;
      //     justify-content: center;
      //     border: solid 1px rgba(157, 191, 255, 0.3);
      //     width: 85px;
      //     margin: 0 20px;
      //     text-align: center;
      //     > span {
      //       color: #fff;
      //     }
      //     > input {
      //       width: 80px;
      //       // height: 30px;
      //       color: #c3eaff;
      //       text-align: center;
      //       }
      //     }
      // }
      .btn-wrap {
        display: flex;
        justify-content: center;
        margin-top: 25px;
        > button {
          width: 85px;
          height: 38px;
          margin: 0 3px;
        }
        &__save {
          background-color: #457fbc;
          color: #fff;
        }
        &__cancel {
          border: 1px solid #457fbc;
          color: #b4dffb;
        }
      }
      .top{
        display: flex;
        width: 100%;
        height: 30px;
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
        &__exit-btn{
          margin-left: auto;
          width: 24px;
          height: 30px;
          background-image: url('../../assets/sedimentation/exit_btn.png');
          background-position-y: center;
          cursor: pointer;
          z-index: 9;
        }
      }  
    }
  }
}
</style>