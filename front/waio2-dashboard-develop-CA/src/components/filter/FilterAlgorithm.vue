<template>
  <div class="main">
    <!-- Top 공정 네이게이터 -->
    <div class="top-center">
      <div class="top-center__contents">
        <TopNavigator/>
      </div>
    </div>
    <!-- Top 제목, 운전모드 -->
    <div class="top">
      <div class="title-down">
        <div class="title-down__text">운영지수<span class="title-down__digital">{{ this.$store.state.filter.latest.f_opr_cnt }}</span>지</div> 
      </div>
      <div class="title">여과<p>전체 현황</p></div>
      <div class="right">
        <div class="right-contents">
          <div class="right-contents__text-first">AI 운전 모드</div>
          <div class="right-contents__btn-first">
            <div class="control_box_operation">
              <div v-if="$store.state.filter.latest.ai_opr === 2" class="control_box_operation__btn control_box_operation__btn--on">AI</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(5, 2)">AI</div>
              <div v-if="$store.state.filter.latest.ai_opr === 1" class="control_box_operation__btn control_box_operation__btn--on">AI추천</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(5, 1)">AI추천</div>
              <div v-if="$store.state.filter.latest.ai_opr === 0" class="control_box_operation__btn control_box_operation__btn--on">AI분석</div>
              <div v-else class="control_box_operation__btn control_box_operation__btn--off" @click="onClickAICheckbox(5, 0)">AI분석</div>
            </div>
          </div>
        </div>
        <div class="right-contents" style="flex-direction: column; width: 220px;">
          <div class="right-contents__icon">
            <div v-if="$store.state.login.user.tkn !== null" class="custom-icon" @click="updateControl">
              <div :class="[ this.$store.state.filter.isModifyMode ? 'custom-icon__checkbox' : 'custom-icon__pencil' ]"></div>
            </div>
            <div v-if="this.$store.state.filter.isModifyMode" class="custom-cancel-icon" @click="cancelControl">
              <div class='custom-cancel-icon__cancel'></div>
            </div>
          </div>          
          <div class="right-contents__wrap">
            <div class="right-contents__text-third">최대 여과지속시간</div>
            <div class="right-contents__input-box">
              <input v-if="this.$store.state.filter.isModifyMode" type="text" 
              :value="this.$store.state.filter.latestModify.f_location_ti_set_max" 
              v-on:input="updateInput($event, 'f_location_ti_set_max')" maxlength="5"/>
              <span v-else>{{ this.$store.state.filter.latestModify.f_location_ti_set_max | numFormat('0') }}</span>
            </div>
          </div>
          <div class="right-contents__wrap" style="margin-left: 52px;">
            <div class="right-contents__text-third">최대 한계 수위</div>
            <div class="right-contents__input-box">
              <input v-if="this.$store.state.filter.isModifyMode" type="text" 
              :value="this.$store.state.filter.latestModify.f_location_wl_max" 
              v-on:input="updateInput($event, 'f_location_wl_max')"/>
              <span v-else>{{ this.$store.state.filter.latestModify.f_location_wl_max | numFormat('0.00') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 중앙 여과 컨텐츠 -->
    <div class="btn-tab">
      <div class="btn-tab__box-abled">2단계생활</div>
      <div class="btn-tab__box-disabled" @click="$routingByIndex(22)">3단계</div>
    </div>
    <div class="contents">
      <FilterContents/>
    </div>
    <!-- 하단 컨텐츠(주요인자, 알고리즘 예측, 예측 결과) -->
    <div class="bottom">
      <FilterChart/>
    </div>
  </div>  
</template>
<script>
import FilterContents from '@/components/filter/FilterContents' 
import FilterChart from '@/components/filter/FilterChart' 
import { SET_OVERLAY } from '@/store'
import { GET_FILTER_LATEST } from '@/store/modules/filter'
import TopNavigator from '@/components/core/TopNavigator'
import { OPEN_AI_MODE_DIALOG } from '@/store/modules/dialog'
import { GET_FILTER_SCHEDULE, PUT_FILTER_CONTROL_TI } from '@/store/modules/filter'
export default {
  name:'FbAlgorithm',
  components: {
    FilterContents,
    FilterChart,
    TopNavigator 
  },
  methods: {
     /**
     * AI운전모드 변경시 
     * AI운전모드 확인 Dialog 오픈
     * 
     * @param index 공정 index
     * @param expectedValue 변경하고자 하는 운전모드
     */
    onClickAICheckbox: function(index, expectedValue) {
      if( this.$store.state.login.user.tkn !== null ) {
        this.$store.state.selectedBuildingIndex = index
        this.$store.dispatch('dialog/' + OPEN_AI_MODE_DIALOG, expectedValue)
      }
    },
    updateControl: function() {
      let wl_min = 0
      let wl_max = 5
      if (this.$store.state.filter.isModifyMode) {
        if (this.$store.state.filter.latestModify.f_location_ti_set_max === '' 
        || this.$store.state.filter.latestModify.f_location_wl_max === '') {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '값을 입력해주세요' })
        } else if (parseFloat(this.$store.state.filter.latestModify.f_location_wl_max) < wl_min 
        || parseFloat(this.$store.state.filter.latestModify.f_location_wl_max) > wl_max) {
          this.$store.dispatch('alertDialog/OPEN_DIALOG', { title: '경고', text1: '최대 한계 수위 설정 범위', text2: wl_min + ' ~ ' + wl_max })
        } else {
          let obj = {}
          obj.f_location_ti_set_max = parseInt(this.$store.state.filter.latestModify.f_location_ti_set_max)
          obj.f_location_wl_max = parseFloat(this.$store.state.filter.latestModify.f_location_wl_max).toFixed(2)
          this.$store.dispatch(PUT_FILTER_CONTROL_TI, obj)
          this.$store.state.filter.isModifyMode = !this.$store.state.filter.isModifyMode
          this.$store.state.filter.latest.f_location_ti_set_max = parseInt(this.$store.state.filter.latestModify.f_location_ti_set_max)
          this.$store.state.filter.latest.f_location_wl_max = parseFloat(this.$store.state.filter.latestModify.f_location_wl_max).toFixed(2)
        }
      } else {
        this.$store.state.filter.isModifyMode = !this.$store.state.filter.isModifyMode
      }
    },
    cancelControl: function () {
      this.$store.state.filter.latestModify.f_location_ti_set_max = this.$store.state.filter.latest.f_location_ti_set_max
      this.$store.state.filter.latestModify.f_location_wl_max = this.$store.state.filter.latest.f_location_wl_max
      this.$store.state.filter.isModifyMode = !this.$store.state.filter.isModifyMode
    },
    checkNumberFormat: function(val) {
      const regex = /^[1-9][0-9]?$|^100$/ //eslint-disable-line
      if (!regex.test(val)) {
        return false		// 0~100를 벗어나면
      }
      return true
    },
    updateInput: function (event, key) {
      this.$store.state.filter.latestModify[key] = event.target.value
    },
  },
  /**
   * 마운트시 실행되는 함수
   * 필요한 API를 주기적으로 요청함
   */
  mounted: function() {
    this.$store.state.selectedBuildingIndex = 5
    this.$store.commit(SET_OVERLAY, true)
    Promise.all([
      this.$store.dispatch(GET_FILTER_LATEST),
      this.$store.dispatch(GET_FILTER_SCHEDULE)
    ]).finally(() => {
      this.$store.commit(SET_OVERLAY, false)
    })
    
    this.timer = setInterval(() => {
      this.$store.dispatch(GET_FILTER_LATEST),
      this.$store.dispatch(GET_FILTER_SCHEDULE)
    }, 60 * 1000)
  },
  destroyed: function () {
    clearInterval(this.timer)
  },
}
</script>
<style lang="scss" scoped>
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
    margin-left: 50px;
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
.bottom{
  display: flex;
  width: 100%;
  height: 392px;
  // margin-top: 50px;
}
.contents{
  display: flex;
  justify-content: center;
  width: 100%;
  height: 415px;
  margin-top: 22px;
}
.top-center{
  display: flex;
  justify-content: center;
  position: absolute;
  top:-76px;
  left: 159px;
  width: 1585px;
  height: 249px;
  background-image: url('../../assets/splashdown/top_center_background.png');
  .timer{
    width: 72px;
    height: 72px;
    margin-top: 110px;
    margin-right: 14px;
  }
  &__contents{
    margin-top: 100px;
  }
}
.top{
  display: flex;
  width: 100%;
  height: 173px;
  .title-down{
    position: absolute;
    width: 177px;
    height: 53px;
    background-image: url('../../assets/percolation/title_down.png');
    left: 50%;
    transform: translateX(-50%);
    top: 177px;
    &__text{
      text-shadow: 0 0 9px #5cafff;
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 3;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
    }
    &__digital{
      text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
      font-family: "LAB디지털" !important;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.17;
      letter-spacing: normal;
      text-align: center;
      color: #ccf1ff;
      margin: 0 5px;
    }
  }
  .title{
    width: 230px;
    background-position: 68px 25px;
    background-image: url('../../assets/as_images/main_title.png');
    letter-spacing: 0 !important;
    text-align:left;
    line-height: 1.5;
    font-weight: 600;
    height: 100%;
    text-shadow: 0 0 9px #5cafff;
    font-family: "KHNPHUotfR";
    font-size: 30px !important;
    font-stretch: normal;
    font-style: normal;
    color: #fff;
    margin-left: 55px;
    margin-top: 35px;
  }
  p {
    font-size: 24px;
    font-weight: 300;
  }
    .right-contents {
      &__icon {
        top: 73px;
      }
    }
  // .right{
  //   width: 190px;
  //   margin-left: auto;
  //   margin-right: 29px;
  //   .right-contents{
  //     display: flex;
  //     width: 100%;
  //     margin-top: 20px;
  //     &__text-first{
  //       text-shadow: 0 0 9px #5cafff;
  //       font-family: "KHNPHUotfR";
  //       font-size: 18px;
  //       font-weight: normal;
  //       font-stretch: normal;
  //       font-style: normal;
  //       letter-spacing: normal;
  //       text-align: left;
  //       color: #c3eaff;
  //     }
  //     &__btn-first{
  //       width: 60px;
  //       height: 28px;
  //       margin-left: auto;
  //       .checkbox{
  //         position:relative;
  //         cursor:pointer;
  //         appearance:none;
  //         width:60px;
  //         height:28px;
  //         border-radius: 14px;
  //         border: solid 1px #417290;
  //         background-color: rgba(139, 194, 240, 0.25);
  //         outline:none;
  //         transition:0.3s;
  //       }
  //       .checkbox::before{
  //         content:"OFF";
  //         position:absolute;
  //         height:22px;
  //         width:29px;
  //         border-radius:11px;
  //         background:#b4dffa;
  //         top:2px;
  //         left:2px;
  //         transition:0.3s ease-in-out;
  //         font-size: 11px;
  //         font-family: KHNPHUotfR;
  //         font-weight: normal;
  //         font-stretch: normal;
  //         font-style: normal;
  //         line-height: 2;
  //         letter-spacing: normal;
  //         text-align: center;
  //         color: #19274e;
  //         background-color: rgba(122, 155, 175, 0.25);
  //       }
  //       .checkbox:checked::before{
  //         content:"AI";
  //         transform:translateX(25px);
  //         background:#b4dffa;
  //       }
  //       .checkbox:checked{
  //         border-color:#b4dffa;
  //       } 
  //     }
  //     &__text-second{
  //       text-shadow: 0 0 9px #5cafff;
  //       font-family: "KHNPHUotfR";
  //       font-size: 18px;
  //       font-weight: normal;
  //       font-stretch: normal;
  //       font-style: normal;
  //       letter-spacing: normal;
  //       text-align: left;
  //       color: #80b6ff;
  //     }
  //     &__btn-second{
  //       width: 60px;
  //       height: 28px;
  //       margin-left: auto;
  //       .checkbox{
  //         position:relative;
  //         cursor:pointer;
  //         appearance:none;
  //         width:60px;
  //         height:28px;
  //         border-radius: 14px;
  //         border: solid 1px #417290;
  //         background-color: rgba(139, 194, 240, 0.25);
  //         outline:none;
  //         transition:0.3s;
  //       }
  //       .checkbox::before{
  //         content:"OFF";
  //         position:absolute;
  //         height:22px;
  //         width:29px;
  //         border-radius:11px;
  //         background-color: rgba(122, 155, 175, 0.25);
  //         top:2px;
  //         left:2px;
  //         transition:0.3s ease-in-out;
  //         font-size: 11px;
  //         font-family: KHNPHUotfR;
  //         font-weight: normal;
  //         font-stretch: normal;
  //         font-style: normal;
  //         line-height: 2;
  //         letter-spacing: normal;
  //         text-align: center;
  //         color: #19274e;
  //       }
  //       .checkbox:checked::before{
  //         content:"AI";
  //         transform:translateX(25px);
  //         background:#80b6ff;
          
  //       }
  //       .checkbox:checked{
  //         border-color:#80b6ff;
  //       } 
  //     }
  //   }
  // }
}
</style>