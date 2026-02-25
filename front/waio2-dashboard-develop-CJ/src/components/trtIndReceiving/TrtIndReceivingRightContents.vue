<template>
  <div class="center-container">
    <!-- 화살표 애니메이션(첫번째) -->
    <div class="arrow-animate-one"></div>
    <!-- 화살표 애니메이션(두번째) -->
    <div class="arrow-animate-two"></div>
    <!-- 이미지 컨텐츠 -->
    <div class="contents-img">
      <div class="pump-info">
        <div class="pump-info__on">ON</div>
        <div class="pump-info__off">OFF</div>
      </div>
      <div class="pump-contents">
        <div class="title-line vertical"></div>
        <ul class="pump-contents__title">
          <p class="title1">현도1취수장</p>
          <li v-for="(item, index) in $store.state.trtIndReceiving.latest.b_pump_on_h1" :key="index" class="pump-contents__text" :class="item === 0 ? 'off' : 'on'">
            {{ index.split('p')[1] }}
          </li>
        </ul>
        <div class="title-line horizontal"></div>
        <ul class="pump-contents__title">
          <p class="title2">현도2취수장</p>
          <li v-for="(item, index) in $store.state.trtIndReceiving.latest.b_pump_on_h2" :key="index" class="pump-contents__text" :class="item === 0 ? 'off' : 'on'">
            {{ index.split('p')[1] }}
          </li>
        </ul>
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
              <div class="result-text__text">· 현도(취) 토출유량(#1~#10)</div>
              <div class="result-text__value">{{ this.$store.state.trtIndReceiving.latest.b_in_fr1 + this.$store.state.trtIndReceiving.latest.b_in_fr2 | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 현도2(취) 토출유량</div>
              <div class="result-text__value">{{ this.$store.state.trtIndReceiving.latest.b_in_fr3 | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 원형수조 수위</div>
              <div class="result-text__value">{{ this.$store.state.trtIndReceiving.latest.b_lei | numFormat('0.00') }}</div>
              <div class="result-text__unit">m</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 정수지 총 유출 유량</div>
              <div class="result-text__value">{{ this.$store.state.trtIndReceiving.latest.h_out_fr | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 전동(가) 1단계 유입유량</div>
              <div class="result-text__value">{{ this.$store.state.trtIndReceiving.latest.b_in_fr4 | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 전동(가) 2단계 유입유량</div>
              <div class="result-text__value">{{ this.$store.state.trtIndReceiving.latest.b_in_fr5 | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 중부권유량</div>
              <div class="result-text__value">{{ this.$store.state.trtIndReceiving.latest.b_in_fr6 | numFormat('0,0') }}</div>
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
          <div class="top-title">AI 필요원수 유입유량 예측</div>
          <div class="contents-title">
          </div>
          <div class="value-box">
            <div class="value-box__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.trtIndReceiving.latest.ai_b_in_fri)"></div>
            <div class="value-box__unit">m<sup>3</sup>/h</div>
          </div>
          <div class="value-bottom-img"></div>    
        </div>
      </div>
      <!-- 예측결과 -->
      <div class="first">
        <div class="first__title">
          <div class="text">예측결과</div>
          <div class="first__timerbox-outter">
            <div class="timerbox">
              {{ this.$store.state.trtIndReceiving.latest.upd_ti | moment('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
        <div class="last-result-contents paddingtop">
          <div class="pump-result">
            <div class="top-title">AI 펌프 총 가동 대수</div>
            <button class="pump-result__btn" @click="onClickDetail()">상세</button>
          </div>
          <div class="contents-title">
            <div class="real-box real-one">
              <div class="real-text">현재 펌프 총 가동 대수</div>
              <div class="real-value">{{ this.$store.state.trtIndReceiving.latest.b_pump_cnt_h1 + this.$store.state.trtIndReceiving.latest.b_pump_cnt_h2 | numFormat('0') }}</div>
            </div>
            <!-- <div class="real-box real-two">
              <div class="real-text">현재 (현도2취) 펌프 총 가동 대수</div>
              <div class="real-value">{{ this.$store.state.trtIndReceiving.latest.b_pump_cnt_h2 | numFormat('0') }}</div>
            </div> -->
          </div>
          <div class="value-box">
          <div class="value-box__value">{{ this.$store.state.trtIndReceiving.latest.ai_b_pump_cnt | numFormat('0') }}</div>
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
    onClickDetail: function() {
      this.$store.state.trtIndReceiving.visible = true
    }
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
  .contents-img{
    width: 592px;
    height: 142px;
    background-image: url('../../assets/cj_images/pump.png');
    background-position-x: center;
    background-position-y: 10px;
    margin-top: 72px;
  }
  .pump-info {
    display: flex;
    justify-content: flex-end;
    margin-right: 37px;
    &__on, &__off {
      margin-right: 10px;
    }
    &__on::before {
      content: '';
      // display: block;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      background: radial-gradient( #061732,#cb4455 );
      margin-right: 5px;
    }
    &__off::before {
      content: '';
      // display: block;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      background: radial-gradient( #061732,#1fa8b2 );
      margin-right: 5px;
    }
  }
  .pump-info > div {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;
  }
  .pump-contents {
    margin-top: 150px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    position: relative;
    padding-left: 10px;
    &__title {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0;
      width: 600px;
    }
    &__text {
      list-style: none;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      line-height: 31px;
      text-align: center;
      margin: 18px 0 18px 15px;
    }
    .off {
    color: #43d3e3;
    background: radial-gradient( #1d2a52 35% ,#1fa8b2 80%);
    }
    .on {
    color: #f898aa;
    background: radial-gradient( #1d2a52 35% ,#cb4455 70%);
    }
  }
  .pump-contents p {
    width: 110px;
    color: #fff;
    text-shadow: 0 0 9px #5cafff;
    text-align: center;
    font-size: 18px;
    margin: 0;
  }
  .pump-contents .title-line {
    position: absolute;
    display: inline-block;
    background: linear-gradient(#1d2a52 0%, #66a6ff 50%, #1d2a52 100%);
    // rotate: 90deg;
  }
  .pump-contents .vertical {
    // transform: rotate(90deg);
    width: 1px;
    height: 165px;
    top: -10px; 
    left: 114px;
    }
  .pump-contents .horizontal {
    transform: rotate(90deg);
    width: 1px;
    height: 570px;
    top: -219px;
    left: 291px;
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
        margin-top: 15px;
        background-image: url('../../assets/splashdown/result_background.png');
        // 주요 인자 값
        .result-value{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 355px;
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
              // width: 170px;
              margin-left: 8px;
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
          // margin-bottom: 10px;
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
          top: 45px;
          left: 0;
        }
        // 현재개도 박스 위치(2계열)
        // .real-two{
        //    top: 70px;
        //    left: 43px;
        // }
        .pump-result {
          width: 300px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &__btn {
            width: 80px;
            height: 35px;
            border: 1px solid #457fbc;
            background-color: #1a3462;
            color: #c2d6f8;
          }
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
  left: 1406px;
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