<template>
  <div class="center-container">
    <!-- 화살표 애니메이션(첫번째) -->
    <div class="arrow-animate-one"></div>
    <!-- 화살표 애니메이션(두번째) -->
    <div class="arrow-animate-two"></div>
    <!-- 이미지 컨텐츠 -->
    <div class="img-contents">
      <div class="valve-box one-value-position">
        <div class="valve-box__text">원수 유입 유량 순시</div>
        <div class="box">
          <div class="box__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.receiving.latest.b_in_fr_i)"></div>
          <div class="box__unit">m<sup>3</sup>/h</div>
        </div>
      </div>
      <div class="valve-box three-value-position">
        <div class="valve-box__text">유입밸브</div>
        <div class="box">
          <div class="box__value">{{ this.$store.state.receiving.latest.b1_vv_po | numFormat('0.00') }}</div>
          <div class="box__unit">%</div>
        </div>
      </div>
      <div class="oneline-valve-img"></div>
      <div class="one-line-water-h-flow">
        <div class="buble delay1"></div>
        <div class="buble delay2"></div>
        <div class="buble delay3"></div>
      </div>
    </div>
    <!-- 주요인자, 알고리즘 에측, 예측 결과 -->
    <div class="last-container">
      <!-- 주요인자 -->
      <div class="first marginleft">
        <div class="first__title">
          <div class="text">주요인자</div>
        </div>
        <div class="first-result-contents">
          <div class="result-value">
            <div class="result-text">
              <div class="result-text__text">· 원수 유입 유량</div>
              <div class="result-text__value">{{ this.$store.state.receiving.latest.b_in_fr_i | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 정수지#1 수위</div>
              <div class="result-text__value">{{ this.$store.state.receiving.latest.h_location_le1 | numFormat('0.00') }}</div>
              <div class="result-text__unit">m</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 정수지#2 수위</div>
              <div class="result-text__value">{{ this.$store.state.receiving.latest.h_location_le2 | numFormat('0.00') }}</div>
              <div class="result-text__unit">m</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 정수지#3 수위</div>
              <div class="result-text__value">{{ this.$store.state.receiving.latest.h_location_le3 | numFormat('0.00') }}</div>
              <div class="result-text__unit">m</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 정수지 총 유출 유량</div>
              <div class="result-text__value">{{ this.$store.state.receiving.latest.h_out_fr | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 알고리즘 예측 -->
      <div class="first">
        <div class="first__title">
          <div class="text">알고리즘 예측</div>
        </div>
        <div class="second-result-contents paddingtop">
          <div class="top-title">AI 원수 유입 유량 예측</div>
          <div class="contents-title">
          </div>
          <div class="value-box">
            <div class="value-box__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.receiving.latest.ai_b_in_fri)"></div>
            <div class="value-box__unit">m<sup>3</sup>/h</div>
          </div>
          <div class="value-bottom-img"></div>    
        </div>
      </div>
      <!-- 예측결과 -->
      <div class="first">
        <div class="first__title">
          <div class="text">
            예측결과
          </div>
          <div class="first__timerbox-outter">
            <div class="timerbox">
              {{ this.$store.state.receiving.latest.upd_ti | moment('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
        <div class="last-result-contents paddingtop">
          <div class="top-title">AI 유입 밸브 개도율 예측</div>
          <div class="contents-title">
          <div class="real-box real-one">
            <div class="real-text">유입밸브 현재개도율</div>
            <div class="real-value">{{ this.$store.state.receiving.latest.b1_vv_po | numFormat('0.00') }} %</div>
          </div>
          </div>
          <div class="value-box">
          <div class="value-box__value">{{ this.$store.state.receiving.latest.ai_b_vv_po | numFormat('0') }}</div>
          <div class="value-box__unit marginleft">%</div>
          </div>
          <div class="value-bottom-img"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReceivingRightContents',
  data: () => ({
    controlRange1: 5, // 알고리즘 예측 1계열 제어 범위
    controlRange2: 5 // 알고리즘 예측 2계열 제어 범위
  }),
  methods: {
  }
}
</script>
<style lang="scss" scoped>
// 최상위 컨텐츠
.center-container{
  display: flex;
  // justify-content: center;
  width: 100%;
  height: 100%;
  // 좌측 공정 이미지
  .img-contents{
    width: 592px;
    height: 327px;
    background-image: url('../../assets/cj_images/sub_08.png');
    background-position-y: 82px;
    background-position-x: center;
    position: relative;
    margin-top: 57px;
    // 1계열 수평 물 흐름
    .one-line-water-h-flow{ 
    position: absolute;
    width: 136px;
    height: 8px;
    top: 188px;
    left: 362px;
    .buble {
      position: absolute;
      width: 136px;
      height: 8px;
      background-image: url('../../assets/splashdown/water_h_flow.png');
      background-position: -35px 50%;
      animation-name: one-line-h-flow;
      animation-duration: 5s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      opacity: 0;
    }
    .delay1 {
      animation-delay: 0s;
    }
    .delay2 {
      animation-delay: 1.25s;
    }
    .delay3 {
      animation-delay: 2.5s;
    }
  }
    @keyframes one-line-h-flow{ 
      0% {opacity:0; transform: translateX(0px);}
      50% {opacity:1; }
      90% {opacity:1; }
      100% {opacity:0; transform: translateX(120px);}
    }
    // 1계열 수직 물 흐름
    // .one-line-water-v-flow{
    //   position: absolute;
    //   width: 8px;
    //   height: 136px;
    //   top: 106px;
    //   left: 268px;
    //   .buble {
    //     position: absolute;
    //     width: 8px;
    //     height: 136px;
    //     background-image: url('../../assets/splashdown/water_v_flow.png');
    //     background-position: 50% 124px;
    //     animation-name: one-line-v-flow;
    //     animation-duration: 5s;
    //     animation-timing-function: linear;
    //     animation-iteration-count: infinite;
    //     opacity: 0;
    //   }
    //   .delay1 {
    //     animation-delay: 0s;
    //   }
    //   .delay2 {
    //     animation-delay: 1.25s;
    //   }
    //   .delay3 {
    //     animation-delay: 2.5s;
    //   }
    // }
    // @keyframes one-line-v-flow{ 
    //   0% {opacity:0; transform: translateY(0px);}
    //   50% {opacity:1; }
    //   90% {opacity:1; }
    //   100% {opacity:0; transform: translateY(-75px);}
    // }
    // 2계열 수평 물 흐름
    .two-line-water-h-flow{ 
      position: absolute;
      width: 136px;
      height: 8px;
      top: 289px;
      left: 268px;
      .buble {
        position: absolute;
        width: 136px;
        height: 8px;
        background-image: url('../../assets/splashdown/water_h_flow.png');
        background-position: -35px 50%;
        animation-name: one-line-h-flow;
        animation-duration: 5s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        opacity: 0;
      }
      .delay1 {
        animation-delay: 0s;
      }
      .delay2 {
        animation-delay: 1.25s;
      }
      .delay3 {
        animation-delay: 2.5s;
      }
    }
    // 2계열 수직 물 흐름
    // .two-line-water-v-flow{
    //   position: absolute;
    //   width: 8px;
    //   height: 136px;
    //   top: 369px;
    //   left: 273px;
    //   .buble {
    //     position: absolute;
    //     width: 8px;
    //     height: 136px;
    //     background-image: url('../../assets/splashdown/water_v_flow_bottom.png');
    //     background-position: 50% -32px;
    //     animation-name: two-line-v-flow;
    //     animation-duration: 5s;
    //     animation-timing-function: linear;
    //     animation-iteration-count: infinite;
    //     opacity: 0;
    //   }
    //   .delay1 {
    //     animation-delay: 0s;
    //   }
    //   .delay2 {
    //     animation-delay: 1.25s;
    //   }
    //   .delay3 {
    //     animation-delay: 2.5s;
    //   }
    // }
    // @keyframes two-line-v-flow{ 
    //   0% {opacity:0; transform: translateY(0px);}
    //   50% {opacity:1; }
    //   90% {opacity:1; }
    //   100% {opacity:0; transform: translateY(75px);}
    // }
    // 1계열 벨브 이미지
    .oneline-valve-img{
      position: absolute;
      top: 171px;
      left: 131px;
      width: 88px;
      height: 42px;
      background-image: url('../../assets/splashdown/on_valve.png');
    }
    // 2계열 벨브 이미지
    // .twoline-valve-img{
    //   position: absolute;
    //   top:273px;
    //   left: 42px;
    //   width: 88px;
    //   height: 42px;
    //   background-image: url('../../assets/splashdown/on_valve.png');
    // }
    // 1유입밸브
    .one-value-position{
      top: 65px;
      left: 34px;
    }
    // 2유입밸브
    // .two-value-position {
    //   top: 325px;
    //   left: -23px;
    // }
    // 유출 유량
    .three-value-position{
      top: 65px;
      left: 402px;
    }
    // 유출 유량
    .four-value-position {
      top: 572px;
      left: 520px;
    }
    // 밸브 박스
    .valve-box{
      position: absolute;
      display: flow-root;
      width: 142px;
      &__text{
        text-shadow: 0 0 9px #5cafff;
        font-family: "KHNPHUotfR";
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.56;
        letter-spacing: normal;
        text-align: center;
        color: #fff;
      }
      .box{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 131px;
        height: 43px;
        object-fit: contain;
        border: solid 1px rgba(157,191,255,0.3);
        margin: 10px auto;
        padding: 0 10px;
        &__value{
          width: 90px;
          text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
          font-family: "LAB디지털" !important;
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: center;
          color: #ccf1ff;
        }
        &__unit{
          font-family: "KHNPHUotfR";
          font-size: 16px;
          line-height: 2.5;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: right;
          color: #417db9;
          margin-left: auto;
        }
      }
    }
  }
  // 값 컨텐츠(원수 유입 유량 순시, 원수 유입 유량 적산, 원수 유입 압력)
  .value-contents{
    width: 240px;
    height: 100%;
    // padding: 70px 0 0 20px;
    // 제목
    &__title{
      text-shadow: 0 0 9px #5cafff;
      font-family: "KHNPHUotfR";
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.56;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      margin-top: 8px;
    }
    // 값 박스
    .box{
      display: flex;
      justify-content: center;
      width: 131px;
      height: 30px;
      object-fit: contain;
      border: solid 1px rgba(157,191,255,0.3);
      margin: 5px auto;
      padding: 0 10px;
      align-items: center;
      // 원수 유입 유량 적산
      &__value-other{
        text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
        line-height: 2.5;
        font-family: "LAB디지털" !important;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        color: #ccf1ff;
      }
      // 원수 유입 유량 순시, 원수 유입 압력
      &__value{
        text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
        font-family: "LAB디지털" !important;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        color: #ccf1ff;
      }
      // 단위
      &__unit{
        font-family: "KHNPHUotfR";
        font-size: 16px;
        line-height: 2.5;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: right;
        color: #417db9;
        margin-left: auto;
      }
    }
  }
  // 예측 결과 컨테이너
  .last-container{
    display: flex;
    width: 1250px;
    .first{
      width: 420px;
      margin-left: 20px;
      // 예측 결과 시간
      &__timerbox-outter {
        display: flex;
        position: relative;
        margin-left: auto;
        top: -3px;
      }
      // 제목
      &__title{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 310px;
        height: 53px;
        background-image: url('../../assets/splashdown/result_title.png');
        .text{
          margin-right: auto;
          width: 160px;
          text-shadow: 0 0 9px #5cafff;
          font-family: "KHNPHUotfR";
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 2.5;
          letter-spacing: normal;
          text-align: center;
          color: #fff;
        }
      }
      // 주요 인자
      .first-result-contents{
        width: 458px;
        height: 356px;
        margin-top: 20px;
        background-image: url('../../assets/splashdown/result_background.png');
        // 주요 인자 값
        .result-value{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 340px;
          height: 100%;
          background-image: url('../../assets/drugInjection/value_factor.png');
          background-position-y: 18px;
          padding: 35px 0px;
          // 값 글자
          .result-text{
            display: flex;
            width:100%;
            font-family: "KHNPHUotfR";
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            &__text{
              width: 170px;
              margin-left: 15px;
              text-shadow: 0 0 9px #5cafff;
              font-size: 18px;
              text-align: left;
              color: #9fc4ff;
            }
            &__value{
              margin-left: auto;
              text-shadow: 0 0 9px #5cafff;
              font-size: 20px;
              text-align: left;
              color: #fff;
            }
            &__unit{
              width: 48px;
              margin-right: 10px;
              margin-left: 7px;
              font-size: 14px;
              line-height: 2.5;
              text-align: left;
              color: #417db9;
            }
          }
        }
      }      
      // 알고리즘 에측 컨텐츠
      .second-result-contents{
        width: 424px;
        height: 356px;
        margin-top: 20px;
        background-image: url('../../assets/splashdown/second_result_background.png');
        // 대제목
        .top-title{
          text-shadow: 0 0 9px #5cafff;
          font-size: 21px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.1;
          letter-spacing: normal;
          text-align: center;
          color: #c3eaff;
          padding-right: 110px;
          margin-bottom: 10px;
        }
        // 중제목
        .middle-title{
          text-shadow: 0 0 9px #a0d0ff;
          font-family: KHNPHUotfR;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.06;
          letter-spacing: normal;
          text-align: center;
          color: #23a7c7;
          padding-right: 110px;
          margin-top: -10px;
          input{
            width: 50px;
            height: 27px;
            background-image: url('../../assets/splashdown/input_box.png');
            text-align: right;
            color: #23a7c7;
            text-shadow: 0 0 9px #a0d0ff;
            padding: 5px;
          }
        }
      }
      // 예측 결과 컨텐츠
      .last-result-contents{
        width: 316px;
        height: 356px;
        margin-top: 20px;
        background-image: url('../../assets/splashdown/valve_result_background.png');
        position: relative;
        // 제목
        .top-title{
          text-shadow: 0 0 9px #5cafff;
          font-size: 21px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.1;
          letter-spacing: normal;
          text-align: center;
          color: #c3eaff;
          margin-bottom: 10px;
        }
        // 현재개도 박스
        .real-box{
          display: flex;
          position: absolute;
          // 텍스트
          .real-text{
            text-shadow: 0 0 9px #a0d0ff;
            font-family: KHNPHUotfR;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.06;
            letter-spacing: normal;
            text-align: left;
            color: #23a7c7;
            padding-top: 17px;
          }
          // 값
          .real-value{
            text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
            font-family: "LAB디지털" !important;
            font-size: 23px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.7;
            letter-spacing: normal;
            text-align: center;
            color: #23a7c7;
            padding-top: 5px;
            margin-left: 7px;
          }
        }
        // 현재개도 박스 위치(1계열)
        .real-one{
          top: 40px;
          left: 50px;
        }
        // 현재개도 박스 위치(2계열)
        .real-two{
           top: 500px;
           //left: 1670px;
        }
      }
    }
  }
}
// select 요소 화살표 제거
input[type="number"] {
  -moz-appearance: textfield;
}
// select 요소 화살표 제거
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
// 화살표 애니메이션(첫번째)
.arrow-animate-one{
  position: absolute;
  top: 262px;
  left: 1002px;
  background-image: url('../../assets/splashdown/arrow_img.png');
  width: 85px;
  height: 356px;
  animation-name: big-arrow-one;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
// 화살표 keyframe(첫번째)
@keyframes big-arrow-one{ 
  0% {opacity:0; transform: translateX(-5px);}
  12% {opacity:0.5; transform: translateX(-2px);}
  24% {opacity:1; transform: translateX(0px);}
  36% {opacity:0.5; transform: translateX(2px);}
  48% {opacity:0; transform: translateX(5px);}
  60% {opacity:0;}
  72% {opacity:0;}
  84% {opacity:0;}
  100% {opacity:0;}
}
// 화살표 애니메이션(두번째)
.arrow-animate-two {
  position: absolute;
  top: 262px;
  left: 1405px;
  background-image: url('../../assets/splashdown/arrow_img.png');
  width: 85px;
  height: 356px;
  animation-name: big-arrow-two;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
// 화살표 keyframe(두번째)
@keyframes big-arrow-two{ 
  0% {opacity:0;}
  12% {opacity:0;}
  24% {opacity:0;}
  36% {opacity:0;}
  48% {opacity:0; transform: translateX(-5px);}
  60% {opacity:0.5; transform: translateX(-2px);}
  72% {opacity:1; transform: translateX(0px);}
  84% {opacity:0.5; transform: translateX(2px);}
  100% {opacity:0; transform: translateX(5px);}
}

// padding-top
.paddingtop{
  padding-top: 20px;
}

// margin-left
.marginleft{
  margin-left: 42px !important;
}

// margin-top
.margintop{
  margin-top: 25px;
}

// 알고리즘 예측, 예측결과 값 하단에 있는 배경 이미지
.value-bottom-img{
  height: 36px;
  background-image: url('../../assets/splashdown/value_bottom.png');
  background-position-x: 18px;
  background-position-y: -11px;
}
// 알고리즘 예측, 예측결과 값 하단에 있는 값 박스
.value-box{
  display: flex;
  width: 240px;
  // justify-content: center;
  margin-top: -10px;
  // 값
  &__value{
    width: 175px;
    text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
    font-family: "LAB디지털" !important;
    font-size: 40px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: right;
    color: #ccf1ff;
  }
  // 단위
  &__unit{
    margin-left: 22.4px;
    font-family: "KHNPHUotfR";
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    margin-top: 23px;
    letter-spacing: normal;
    text-align: left;
    color: #417db9;
  }
}
// 알고리즘 예측, 예측결과 컨텐츠 계열 타이틀
.contents-title{
  display: flex;
  margin: 70px 0 0 18px;
  // 화살표 이미지
  &__img{
    width: 47px;
    height: 34px;
    background-image: url('../../assets/splashdown/result_arrow.png');
  }
  // 텍스트
  &__text{
    text-shadow: 0 0 9px #5cafff;
    font-family: "KHNPHUotfR";
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.3;
    letter-spacing: normal;
    text-align: left;
    color: #c3eaff;
  }
}

</style>