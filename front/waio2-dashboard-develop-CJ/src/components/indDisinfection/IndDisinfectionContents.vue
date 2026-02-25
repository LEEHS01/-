<template>
  <div class="contents-main">
    <div class="top-contents">
      <div class="first-contents">
        <div class="arrow-animate-one"></div>
        <div class="arrow-animate-two"></div>
        <div class="first-contents__title">
          <div class="title-text">주요인자</div>
        </div>
        <div class="first-value">
          <div class="value-title-contents">
            <div class="value-title">
              <div class="value-title__text">혼화수 잔류 염소(ppm)</div>
              <div class="value-title__text">혼화수 유량(m³/h)</div>
              <div class="value-title__text">현재 주입률(kg/h)</div>
              <div class="value-title__text">AI 주입률(kg/h)</div>
              <div class="value-title__text">보정값(kg/h)</div>
            </div>
          </div>
          <div class="value-line">
            <div class="line1">
              <div class="line1__title">1계열</div>
              <div class="line1__value">{{ this.$store.getters.getCurrentSodocDataArray[2] | numFormat('0.00')}}</div>
              <div class="line1__value">{{ this.$store.getters.getCurrentSodocDataArray[13] | numFormat('0')}}</div>
              <div class="line1__value">{{ this.$store.getters.getCurrentSodocDataArray[8] | numFormat('0.00')}}</div>
              <div class="line1__value">{{ this.$store.getters.getCurrentSodocDataArray[41] | numFormat('0.00')}}</div>
              <div class="line1__value">{{ this.$store.getters.getCurrentSodocDataArray[22] | numFormat('0.00')}}</div>
            </div>
            <div class="line2">
              <div class="line2__title">2계열</div>
              <div class="line2__value">{{ this.$store.getters.getCurrentSodocDataArray[3] | numFormat('0.00')}}</div>
              <div class="line2__value">{{ this.$store.getters.getCurrentSodocDataArray[14] | numFormat('0')}}</div>
              <div class="line2__value">{{ this.$store.getters.getCurrentSodocDataArray[10] | numFormat('0.00')}}</div>
              <div class="line2__value">{{ this.$store.getters.getCurrentSodocDataArray[42] | numFormat('0.00')}}</div>
              <div class="line2__value">{{ this.$store.getters.getCurrentSodocDataArray[23] | numFormat('0.00')}}</div>
            </div>
          </div>
        </div>
        <div class="second-contents">
          <div class="second-contents__title">
            <div class="title-text">AI 다음 목표 주입률</div>
          </div>
          <div class="second-value">
            <div class="second-value__title">다음 목표 주입률 예측</div>
            <div class="second-value-contents">
              <div class="second-value-contents__one">1계열</div>
              <div class="second-value-contents__two">{{ this.$store.getters.getCurrentSodocDataArray[41] | numFormat('0.00')}}</div>
              <div class="second-value-contents__three">ppm</div>
            </div>
            <div class="contents_value_underbar"></div>
            <div class="second-value-contents">
              <div class="second-value-contents__one">2계열</div>
              <div class="second-value-contents__two">{{ this.$store.getters.getCurrentSodocDataArray[42] | numFormat('0.00')}}</div>
              <div class="second-value-contents__three">ppm</div>
            </div>
            <div class="contents_value_underbar"></div>
          </div>
        </div>
        <div class="end-contents">
          <div class="second-contents__title">
            <div class="title-text">침전수 잔류염소</div>
          </div>
          <div class="second-value">
            <div class="second-value__title"></div>
            <div class="second-value-contents">
              <div class="second-value-contents__one">1계열</div>
              <div class="second-value-contents__two">{{ this.$store.getters.getCurrentSodocDataArray[15] | numFormat('0.00')}}</div>
              <div class="second-value-contents__three">ppm</div>
            </div>
            <div class="contents_value_underbar"></div>
            <div class="second-value-contents">
              <div class="second-value-contents__one">2계열</div>
              <div class="second-value-contents__two">{{ this.$store.getters.getCurrentSodocDataArray[16] | numFormat('0.00')}}</div>
              <div class="second-value-contents__three">ppm</div>
            </div>
            <div class="contents_value_underbar"></div>
          </div>
        </div>
      </div>
    </div>
    <ChartBoxComponent :leftSecond="this.leftSecond"/>
  </div>
</template>
<script>
import ChartBoxComponent  from '@/components/indDisinfection/chart/ChartBoxComponent'

export default {
  name:'IndDisinfectionContents',
  props: [
    'leftSecond'
  ],
  components: {
    ChartBoxComponent
  }
}
</script>
<style lang="scss" scoped>
.arrow-animate-one{
  position: absolute;
  top: 35px;
  left: 346px;
  background-image: url('../../assets/disinfection/contents_arrow.png');
  width: 116px;
  height: 227px;
  animation-name: arrow-one;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes arrow-one{ 
  0% {opacity:0; transform: translateX(-10px);}
  12% {opacity:0.5; transform: translateX(-5px);}
  24% {opacity:1; transform: translateX(0px);}
  36% {opacity:0.5; transform: translateX(5px);}
  48% {opacity:0; transform: translateX(10px);}
  60% {opacity:0;}
  72% {opacity:0;}
  84% {opacity:0;}
  100% {opacity:0;}
}
.arrow-animate-two {
  position: absolute;
  top: 35px;
  z-index: 10;
  left: 768px;
  background-image: url('../../assets/disinfection/contents_arrow.png');
  width: 116px;
  height: 227px;
  animation-name: arrow-two;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes arrow-two{ 
  0% {opacity:0;}
  12% {opacity:0;}
  24% {opacity:0;}
  36% {opacity:0;}
  48% {opacity:0; transform: translateX(-10px);}
  60% {opacity:0.5; transform: translateX(-5px);}
  72% {opacity:1; transform: translateX(0px);}
  84% {opacity:0.5; transform: translateX(5px);}
  100% {opacity:0; transform: translateX(10px);}
}
.contents_value_underbar{
  width: 278px;
  height: 36px;
  background-image: url('../../assets/disinfection/contents_value_underbar.png');
}
.contents-main{
  position: absolute;
  bottom: 0px;
  right: 34px;
  width:1234px;
  height:687px;
  .top-contents{
    display: flex;
    width: 100%;
    height: 336px;
    margin-top:25px;
    .end-contents{
      position: absolute;
      width: 368px;
      height: 319.2px;
      top: 0;
      left: 878px;
      .second-value{
        display: flex;
        flex-flow: column;
        width: 278px;
        height: 100%;
        .second-value-contents{
          display: flex;
          justify-content: center;
          align-items: baseline;
          text-align: center;
          margin: 0 47px;
          &__one{
            text-shadow: 0 0 9px #5cafff;
            font-family: "KHNPHUotfR";
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.06;
            letter-spacing: normal;
            color: #fff;
            margin-right: auto;            
          }
          &__two{
            text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
            font-family: "LAB디지털" !important;
            font-size: 40px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.2;
            letter-spacing: normal;
            color: #ccf1ff;
          }
          &__three{
            font-family: KHNPHUotfR;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 2.13;
            letter-spacing: normal;
            color: #417db9;
            margin-left: auto;
          }
        }
        &__title{
          height: 24px;
          margin: 18px auto;
          text-shadow: 0 0 9px #5cafff;
          font-family: "KHNPHUotfR";
          font-size: 21px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.1;
          letter-spacing: normal;
          text-align: left;
          color: #c3eaff;
        }
      }
      &__title{
        width: 275px;
        height: 53px;
        background-image: url('../../assets/disinfection/contents_title.png');
        .title-text{
          margin-left: 35px;
          text-shadow: 0 0 9px #5cafff;
          font-family: "KHNPHUotfR";
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 2.8;
          letter-spacing: normal;
          text-align: left;
          color: #fff;
        }
      } 
    }
    .second-contents{
      position: absolute;
      width: 472px;
      height: 335px;
      background-image: url('../../assets/disinfection/second_contents_background.png');
      top: 0;
      left: 472px;
      .second-value{
        display: flex;
        flex-flow: column;
        width: 278px;
        height: 100%;
        .second-value-contents{
          display: flex;
          justify-content: center;
          align-items: baseline;
          text-align: center;
          margin: 0 47px;
          &__one{
            text-shadow: 0 0 9px #5cafff;
            font-family: "KHNPHUotfR";
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.06;
            letter-spacing: normal;
            color: #fff;
            margin-right: auto;            
          }
          &__two{
            text-shadow: 0 0 5px rgba(209, 250, 255, 0.5);
            font-family: "LAB디지털" !important;
            font-size: 40px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.2;
            letter-spacing: normal;
            color: #ccf1ff;
          }
          &__three{
            font-family: KHNPHUotfR;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 2.13;
            letter-spacing: normal;
            color: #417db9;
            margin-left: auto;
          }
        }
        &__title{
          margin: 18px auto;
          text-shadow: 0 0 9px #5cafff;
          font-family: "KHNPHUotfR";
          font-size: 21px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.1;
          letter-spacing: normal;
          text-align: left;
          color: #c3eaff;
        }
      }
      &__title{
        width: 275px;
        height: 53px;
        background-image: url('../../assets/disinfection/contents_title.png');
        .title-text{
          margin-left: 35px;
          text-shadow: 0 0 9px #5cafff;
          font-family: "KHNPHUotfR";
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 2.8;
          letter-spacing: normal;
          text-align: left;
          color: #fff;
        }
      } 
    }
    .first-contents{
      position: absolute;
      width: 524px;
      height: 335px;
      background-image: url('../../assets/disinfection/first_contents_background.png');
      .value-line{
        display: flex;
        width: 50%;
        text-shadow: 0 0 9px #5cafff;
        font-family: "KHNPHUotfR";
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: right;
        margin-top: 25px;
        margin-right: 20px;
        .line1{
          width: 50%;
          &__title{
            font-size: 16px;
            color: #c3eaff;
            margin-bottom: 10px;
          }
          &__value{
            font-size: 18px;
            color: #fff;
            margin-bottom: 2px;
          }
        }
        .line2{
          width:50% ;
          &__title{
            font-size: 16px;
            color: #c3eaff;
            margin-bottom: 10px;
          }
          &__value{
            font-size: 18px;
            color: #fff;
            margin-bottom: 2px;
          }
        }
      }
      .first-value{
        display: flex;
        width: 320px;
        height: 227px;
        background-image: url('../../assets/disinfection/main_factor.png');
        margin-top: 15px;
        .value-title-contents{
          width: 199px;
          .value-title{
            position: absolute;
            width: 178px;
            height: 177px;
            text-shadow: 0 0 9px #5cafff;
            font-family: "KHNPHUotfR";
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: left;
            color: #9fc4ff;
            left: 31px;
            top: 126px;
            &__text{
              margin-bottom: 5px;
            }
          }
        }
      }
      &__title{
        width: 275px;
        height: 53px;
        background-image: url('../../assets/disinfection/contents_title.png');
        .title-text{
          margin-left: 35px;
          text-shadow: 0 0 9px #5cafff;
          font-family: "KHNPHUotfR";
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 2.8;
          letter-spacing: normal;
          text-align: left;
          color: #fff;
        }
      }
    }
  }
}
</style>