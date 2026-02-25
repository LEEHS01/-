<template>
  <div class="main">
    <div class="contents-img">
      <div class="contents-img-title first">#1</div>
      <!-- 1호기 물흐름 -->
      <div class="first-line" :style="{ display: this.getDisplayStyleFirst }">
        <div class="water-flow-vertical one-line-v1">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
        <div class="water-big-right-horizontal">
          <div class="buble delay1"></div>
          <div class="buble delay2"></div>
          <div class="buble delay3"></div>
          <div class="buble delay4"></div>
          <div class="buble delay5"></div>
          <div class="buble delay6"></div>
        </div>
        <div class="water-flow-vertical one-line-v2">
          <div class="buble-v delay5"></div>
          <div class="buble-v delay6"></div>
        </div>
      </div>
      <div class="contents-img-title second">#2</div>
      <!-- 2호기 물흐름 -->
      <div class="second-line" :style="{ display: this.getDisplayStyleSecond }">
        <div class="water-big-flow-vertical one-line-v5">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
          <div class="buble-v delay3"></div>
          <div class="buble-v delay4"></div>
        </div>
      </div>
      <div class="contents-img-title third">#3</div>
      <!-- 3호기 물흐름 -->
      <div class="third-line" :style="{ display: this.getDisplayStyleThird }">
        <div class="water-flow-vertical one-line-v3">
          <div class="buble-v delay1"></div>
          <div class="buble-v delay2"></div>
        </div>
        <div class="water-big-left-horizontal">
          <div class="buble delay1"></div>
          <div class="buble delay2"></div>
          <div class="buble delay3"></div>
          <div class="buble delay4"></div>
          <div class="buble delay5"></div>
          <div class="buble delay6"></div>
        </div>
        <div class="water-flow-vertical one-line-v4">
          <div class="buble-v delay5"></div>
          <div class="buble-v delay6"></div>
        </div>
      </div>
     <!-- 응집제 종류 -->
     <div class="line-box-top">
        <div class="line-box__title">응집제 종류:</div>
        <v-select outlined
        :menu-props="{
          offsetY: true,
          nudgeBottom: 0
        }"
        v-model="selectedCoagulant"
        :items="this.$store.state.coagulants.coagulant_type"
        :disabled="this.$store.state.login.user.tkn == null">
        </v-select>
        <button class="btn-save" v-show="this.$store.state.login.user.tkn !== null" @click="updateControl">저장</button>
      </div>
      <!-- #1(펌프) 응집제 주입률, 주입량-->
      <div class="line-box oneline">
        <div class="line-box__title margintop">#1 응집제 주입률</div>
        <div class="box-contents">
          <div class="box-contents__value">{{ this.$store.state.coagulants.latest.c1_cf | numFormat('0.00') }}</div>
          <div class="box-contents__unit">ppm</div>
        </div>
        <div class="line-box__title margintop">#1 응집제 주입량</div>
        <div class="box-contents">
          <div class="box-contents__value">{{ this.$store.state.coagulants.latest.c1_mm_fr | numFormat('0.00') }}</div>
          <div class="box-contents__unit">ℓ/h</div>
        </div>
      </div>
      <!-- #2(펌프) 응집제 주입률, 주입량-->
      <div class="line-box twoline">
        <div class="line-box__title margintop">#2 응집제 주입률</div>
        <div class="box-contents">
          <div class="box-contents__value">{{ this.$store.state.coagulants.latest.c2_cf | numFormat('0.00') }}</div>
          <div class="box-contents__unit">ppm</div>
        </div>
        <div class="line-box__title margintop">#2 응집제 주입량</div>
        <div class="box-contents">
          <div class="box-contents__value">{{ this.$store.state.coagulants.latest.c2_mm_fr | numFormat('0.00') }}</div>
          <div class="box-contents__unit">ℓ/h</div>
        </div>
      </div>
      <!-- #3(펌프) 응집제 주입률, 주입량-->
      <div class="line-box threeline">
        <div class="line-box__title margintop">#3 응집제 주입률</div>
        <div class="box-contents">
          <div class="box-contents__value">{{ this.$store.state.coagulants.latest.c3_cf | numFormat('0.00') }}</div>
          <div class="box-contents__unit">ppm</div>
        </div>
        <div class="line-box__title margintop">#3 응집제 주입량</div>
        <div class="box-contents">
          <div class="box-contents__value">{{ this.$store.state.coagulants.latest.c3_mm_fr | numFormat('0.00') }}</div>
          <div class="box-contents__unit">ℓ/h</div>
        </div>
      </div>
    </div>
  </div>  
</template>
<script>
import { PUT_COAGULANT_CONTROL_COAGULANT } from '@/store/modules/coagulants'
export default {
  data: () => ({
      items: ['PACS', 'PAC'],
    }),
  computed: {
    selectedCoagulant: {
      get() {
        return this.$store.state.coagulants.latestModify.c_cf_coagulant
      },
      set(value) {
        this.$store.state.coagulants.latestModify.c_cf_coagulant = value
      }
    },
    // 현재 주입되는 약품에 따라 1호기 애니메이션 여부
    getDisplayStyleFirst() {
      return this.$store.state.coagulants.latest.c_injector1 === 1 ? 'block' : 'none'
    },
    // 현재 주입되는 약품에 따라 2호기 애니메이션 여부
    getDisplayStyleSecond() {
      return this.$store.state.coagulants.latest.c_injector2 === 1 ? 'block' : 'none'
    },
    // 현재 주입되는 약품에 따라 3호기 애니메이션 여부
    getDisplayStyleThird() {
      return this.$store.state.coagulants.latest.c_injector3 === 1 ? 'block' : 'none'
    }
  },
  methods: {
    updateControl: function() {
      let obj = {}
      obj.c_cf_coagulant = this.$store.state.coagulants.latestModify.c_cf_coagulant
      this.$store.dispatch(PUT_COAGULANT_CONTROL_COAGULANT, obj)
    },
    updateSelect: function (value, key) {
      this.$store.state.coagulants.latestModify[key] = value
    },
  }
}
</script>
<style lang="scss" scoped>
.v-input {
  max-width: 155px;
  height: 35px !important;
  color: #417db9 !important;
  border-radius: 0;
  border: none;
}
.main {
  display: flex;
  flex-flow: column;
  width: 592px;
  height: 100%;
  .contents-img{
    width: 100%;
    height: 100%;
    background-image: url('../../assets/br_images/sub_04.png');
    margin-bottom: 16px;
    background-position-x: center;
    background-position-y: 80px;
    position: relative;
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
    top: 81px;
    left: 49px;
  }
  .second {
    top: 81px;
    left: 237px;
  }    
  .third {
    top: 81px;
    left: 429px;
  }    
    .oneline{
      top: 600px;
      left: 57px;
    }
    .twoline{
      top: 600px;
      left: 226px;
    }
    .threeline{
      top: 600px;
      left: 395px;
    }
    .line-box-top {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 310px;
      left: 50%;
      transform: translateX(-50%);
      top: 15px;
      .margintop{
        margin-top: 10px;
      }
      &__title{
        text-shadow: 0 0 9px #5cafff;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.56;
        letter-spacing: normal;
        text-align: left;
        color: #fff;
      }
      //03.29 저장버튼 추가
      .btn-save {
        border: none;
        color: #fff;
        width: 55px;
        height: 35px;    
        background-color: #496097;
        font-size: 14px;
      }
      .btn-save:hover {        
        background-color: #4aa1ff;
        color: #fff;
        transition: .3s
      }
      .box-contents{
        display: flex;
        width: 131px;
        height: 43px;
        // border: solid 1px rgba(157, 191, 255, 0.3);
        &__unit{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 3;
          letter-spacing: normal;
          text-align: right;
          color: #417db9;
          padding-right: 10px;
          margin-left: auto;
        }
        &__text {
          width: 100%;
          text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
          font-family: "LAB디지털" !important;
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.8;
          letter-spacing: normal;
          text-align: center;
          color: #ccf1ff;
        }
        &__input > input {
          width: 100%;
          font-family: "LAB디지털" !important;
          color: #ccf1ff;
          text-align: center;
          border: 1px solid rgba(157,191,255,.3);
        }
        &__value {
          display: block;
          overflow: hidden;
          text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
          font-family: "LAB디지털" !important;
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.8;
          letter-spacing: normal;
          text-align:center;
        }
      }
        .modify-button {
          position: absolute;
          top: 10px;
          left: 233px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          width: 53px;
        }
        .btn-bg {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          background-color: #b4dffa;
          border-radius: 12px;
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
    }
    .line-box {
      position: absolute;
      display: flex;
      flex-flow: column;
      align-items: center;
      //width: 131px;
      width: 137px;
      .margintop{
        margin-top: 10px;
      }
      &__title{
        text-shadow: 0 0 9px #5cafff;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2;
        letter-spacing: normal;
        text-align: left;
        color: #fff;
      }
      .box-contents{
        display: flex;
        width: 131px;
        height: 40px;
        border: solid 1px rgba(157, 191, 255, 0.3);
        &__value{
          text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
          font-family: "LAB디지털" !important;
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.8;
          letter-spacing: normal;
          text-align: left;
          color: #ccf1ff;
          padding-left: 10px;
        }
        &__unit{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 3;
          letter-spacing: normal;
          text-align: right;
          color: #417db9;
          padding-right: 10px;
          margin-left: auto;
        }
        &__text{
          width: 100%;
          text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
          font-family: "LAB디지털" !important;
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.8;
          letter-spacing: normal;
          text-align: center;
          color: #ccf1ff;
        }
        .modify-button {
          position: absolute;
          top: 40px;
          right: -57px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          width: 53px;
        }
        .btn-bg {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          background-color: #b4dffa;
          border-radius: 12px;
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
  }
    .first-line {
      position: absolute;
      top: 43px;
      left: 41px;
    }
    .second-line{
      position: absolute;
      top: 43px;
      left: 337px;
    }
    .third-line{
      position: absolute;
      top: 43px;
      left: 337px;
    }
    .one-line1{
      position: absolute;
      top:517px;
      left: 142px;
      width: 40px;
      height: 75px;
      background-image: url('../../assets/drugInjection/off_valve.png');
    }
    .one-line2{
      position: absolute;
      top:517px;
      left: 209px;
      width: 40px;
      height: 75px;
      background-image: url('../../assets/drugInjection/off_valve.png');
    }
    .one-line3{
      position: absolute;
      top:517px;
      left: 278px;
      width: 40px;
      height: 75px;
      background-image: url('../../assets/drugInjection/off_valve.png');
    }
    .two-line1{
      position: absolute;
      top:517px;
      left: 437px;
      width: 40px;
      height: 75px;
      background-image: url('../../assets/drugInjection/off_valve.png');
    }
    .two-line2{
      position: absolute;
      top:517px;
      left: 505px;
      width: 40px;
      height: 75px;
      background-image: url('../../assets/drugInjection/off_valve.png');
    }
    .two-line3{
      position: absolute;
      top:517px;
      left: 573px;
      width: 40px;
      height: 75px;
      background-image: url('../../assets/drugInjection/on_valve.png');
    }
    .one-line-v1{
      top: 240px;
      left: 63px;
    }
    .one-line-v2{
      top: 293px;
      left: 252px;
    }
    .one-line-v3{
      top: 240px;
      left: 144px;
    }
    .one-line-v4{
      top: 293px;
      left: -44px;
    }
    .one-line-v5{
      top: 238px;
      left: -44px;
    }
    .water-right-horizontal{
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
    }
    @keyframes arrow-one{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:0; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(80px);}
    }
    .water-big-right-horizontal{
      position: absolute;
      width: 200px;
      height: 8px;
      top: 296px;
      left: 49px;
      .buble {
        position: absolute;
        width: 100px;
        height: 8px;
        background-image: url('../../assets/disinfection/water_h_flow_one.png');
        background-position: -38px 50%;
        animation-name: big-arrow-one;
        animation-duration: 12s;
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
      .delay4 {
        animation-delay: 8s;
      }
      .delay5 {
        animation-delay:10s;
      }
      .delay6 {
        animation-delay: 12s;
      }
    }
    @keyframes big-arrow-one{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(200px);}
    }
    .water-left-horizontal{
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
    }
    @keyframes arrow-three{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:0; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(-80px);}
    }
    .water-big-left-horizontal{
      position: absolute;
      width: 200px;
      height: 8px;
      top: 296px;
      left: 71px;
      .buble {
        position: absolute;
        width: 100px;
        height: 8px;
        background-image: url('../../assets/disinfection/water_h_flow_two.png');
        background-position: 88px 50%;
        animation-name: big-arrow-two;
        animation-duration: 12s;
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
      .delay4 {
        animation-delay: 8s;
      }
      .delay5 {
        animation-delay: 10s;
      }
      .delay6 {
        animation-delay: 12s;
      }
    }
    @keyframes big-arrow-two{ 
      0% {opacity:0; transform: translateX(0px);}
      20% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(-200px);}
    }
    .water-flow-vertical{
      position: absolute;
      width: 8px;
      height: 60px;
      .buble-v {
        position: absolute;
        width: 8px;
        height: 60px;
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
      .delay3 {
        animation-delay: 4s;
      }
      .delay4 {
        animation-delay: 6s;
      }
      .delay5 {
        animation-delay: 12s;
      }
      .delay6 {
        animation-delay: 14s;
      }
    }
    @keyframes arrow-two{ 
      0% {opacity:0; transform: translateY(0px);}
      10% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateY(50px);}
    }
    .water-big-flow-vertical{
      position: absolute;
      width: 8px;
      height: 100px;
      .buble-v {
        position: absolute;
        width: 8px;
        height: 100px;
        background-image: url('../../assets/disinfection/water_v_flow_one.png');
        background-position:50% -20px;
        animation-name: arrow-big;
        animation-duration: 6s;
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
      .delay4 {
        animation-delay: 6s;
      }
      @keyframes arrow-big { 
      0% {opacity:0; transform: translateY(0px);}
      10% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateY(100px);}
    }
    } 
  }
}
</style>