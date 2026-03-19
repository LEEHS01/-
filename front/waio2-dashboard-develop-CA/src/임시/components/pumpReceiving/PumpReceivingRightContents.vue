<template>
  <div class="main">
    <!-- 상단 컨텐츠(주요인자, 알고리즘 예측, 예측 결과) -->
    <div class="top-contents">
      <div class="last-container">
      <!-- 주요인자 -->
      <div class="first marginleft">
        <div class="first__title">
          <div class="text">주요인자</div>
        </div>
        <div class="first-result-contents">
          <div class="result-value">
            <div class="result-text">
              <div class="result-text__text">· 2단계공업 원수유입유량</div>
              <div class="result-text__value">{{ this.$store.state.pumpReceiving.latest.b_fri.f1 | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 2단계생활 원수유입유량</div>
              <div class="result-text__value">{{ this.$store.state.pumpReceiving.latest.b_fri.f2 | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 3단계 원수유입유량</div>
              <div class="result-text__value">{{ this.$store.state.pumpReceiving.latest.b_fri.f3 | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 6누수 원수 관로유량</div>
              <div class="result-text__value">{{ this.$store.state.pumpReceiving.latest.b_out_fri_tj | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
            <div class="result-text">
              <div class="result-text__text">· 	3단계 6누수 순시유량</div>
              <div class="result-text__value">{{ this.$store.state.pumpReceiving.latest.b_out_fri_as | numFormat('0,0') }}</div>
              <div class="result-text__unit">m<sup>3</sup>/h</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 화살표 애니메이션(첫번째) -->
      <div class="arrow-animate-one"></div>
      <!-- 알고리즘 예측 -->
      <div class="first">
        <div class="first__title">
          <div class="text">알고리즘 예측</div>
        </div>
        <div class="second-result-contents paddingtop">
          <div class="top-title">AI 필요원수 유입유량 예측</div>
          <div class="contents-title">
            <!-- <div class="contents-title__img"></div>
            <div class="contents-title__text">착수정</div> -->
          </div>
          <div class="value-box">
            <div class="value-box__value" v-html="this.$getNumeralWithCommaAndFontFamily(this.$store.state.pumpReceiving.latest.ai_b_in_fri)"></div>
            <div class="value-box__unit">m<sup>3</sup>/h</div>
          </div>
          <div class="value-bottom-img"></div>
        </div>
      </div>
      <!-- 화살표 애니메이션(두번째) -->
      <div class="arrow-animate-two"></div>
      <!-- 예측결과 -->
      <div class="first">
        <div class="first__title">
          <div class="text">
            예측결과
          </div>
          <div class="first__timerbox-outter">
            <div class="timerbox">
              {{ this.$store.state.pumpReceiving.latest.upd_ti | moment('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
        <div class="last-result-contents paddingtop">
          <div class="pump-result">
            <div class="top-title">AI 펌프 총 가동 대수</div>
            <button class="pump-result__btn" @click="onClickDetail()">상세</button>
          </div>
          <div class="contents-title">
            <!-- <div class="contents-title__img"></div>
            <div class="contents-title__text">착수정</div> -->
            <div class="real-box real-one">
              <div class="real-text">현재 총 가동 대수</div>
              <div class="real-value">{{ this.$store.state.pumpReceiving.latest.b_pump_cnt_h1 
              + this.$store.state.pumpReceiving.latest.b_pump_cnt_h2 
              + this.$store.state.pumpReceiving.latest.b_pump_cnt_h3 | numFormat('0') }}</div>
            </div>
            <!-- <div class="real-box real-two">
              <div class="real-text">전동2단계 현재 가동 대수</div>
              <div class="real-value">{{ this.$store.state.pumpReceiving.latest.b_pump_cnt_h2 | numFormat('0') }}</div>
            </div>
            <div class="real-box real-three">
              <div class="real-text">전동3단계 현재 가동 대수</div>
              <div class="real-value">{{ this.$store.state.pumpReceiving.latest.b_pump_cnt_h3 | numFormat('0') }}</div>
            </div> -->
          </div>
          <div class="value-box">
            <div class="value-box__value">{{ this.$store.state.pumpReceiving.latest.ai_b_pump_cnt | numFormat('0') }}</div>
            <div class="value-box__unit marginleft"></div>
          </div>
          <div class="value-bottom-img"></div>
        </div>
      </div>
    </div>

    </div>
    <!-- 하단 컨텐츠(그래프) -->
    <div class="chart-container">
      <!-- 원수 유입 유량 예측 차트 -->
      <div class="chart-contents" style="margin-right: 35px;">
        <div class="chart-title">
          <div class="chart-title__text">원수 유입 유량 예측</div>
        </div>
        <div class="chart">
          <highcharts ref="chartRawWaterFlow" :options="ChartRawWaterFlow" style="height:100%;"/>
        </div>
      </div>
      <!-- 정수지 수위 밴드 차트 -->
      <!-- <div class="chart-contents marginleft10">
        <div class="chart-title">
          <div class="chart-title__text">정수지 수위 밴드</div>
          <div class="chart-title-tab">
            <div class="chart-title-tab__box" @click="selectedLocation = 1" :class="{'selected': selectedLocation === 1}">#1</div>
            <div class="chart-title-tab__box" @click="selectedLocation = 2" :class="{'selected': selectedLocation === 2}">#2</div>
            <div class="chart-title-tab__box" @click="selectedLocation = 3" :class="{'selected': selectedLocation === 3}">#3</div>
            <div class="chart-title-tab__box" @click="selectedLocation = 4" :class="{'selected': selectedLocation === 4}">#4</div>
          </div>
        </div>
        <div class="chart">
          <highcharts ref="chartClearWaterLevel" :options="ChartClearWaterLevel" style="height:100%;"/>
        </div>
      </div>       -->
      <!-- 정수지 유출 유량 차트 -->
      <div class="chart-contents">
        <div class="chart-title">
          <div class="chart-title__text">정수지 유출 유량</div>
        </div>
        <div class="chart">
          <highcharts ref="chartReceivingWaterFlow" :options="ChartReceivingWaterFlow" style="height:100%;"/>
        </div>
      </div>
    </div>
  </div>  
</template>
<script>
export default {
  data: () => ({
    // 원수 유입 유량 차트
    chartDataRawWaterFlow: {
      chart: {
        type: 'spline',
        backgroundColor: false,
        zoomType: 'x'
      },
      title: {
        useHTML: true,
        text: '원수 유입 유량 예측',
        style: {
          color: 'transparent'
        }
      },
      legend: {
        enabled: false,
        align: 'right',
        verticalAlign: 'top',
        borderWidth: 0,
        y: 0,
        itemStyle: {
          color: '#ffffff',
          fontWeight: 'bold'
        },
        labelFormatter: function () {
          return '<span style="color: ' + this.color + '; width: 100px;">' + this.name + '</span>'
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        valueDecimals: 2,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
        useHTML: true,
        valueSuffix: 'm<sup>3</sup>/h'
      },
      xAxis: {
        title: {
          text: ''
        },
        type: 'datetime',
        labels: {
          format: '{value:%m-%d %H:%M}',
          style:{
            fontFamily:'NanumSquare',
            fontSize: 13,
            color:"rgb(255,255,255,0.8)"
          }
        },
        tickInterval: 1000 * 60 * 60 * 10 // 48시간
      },
      yAxis: {
        title: {
          align: 'high',
          text: 'm<sup>3</sup>/h',
          useHTML: true,
          offset: 0,
          rotation: 0,
          y: -15,
          x: -10,
          style: {
            color:"rgb(255,255,255,0.8)"
          }
        },
        gridLineColor: false,
        labels: {
          style:{
            fontFamily:'NanumSquare',
            fontSize: 13,
            color:"rgb(255,255,255,0.8)"
          }
        }
      },
      series: null,
      exporting: {
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'downloadJPEG', 'downloadCSV'],
            menuItemStyle: { padding: "0 10px", background: "none", color: "#303030" },
            symbolStroke: "rgb(110, 157, 225)",
            theme: {
              fill:"rgba(0,0,0,0)",
              states: {
                hover: {
                  fill: 'rgba(0,0,0,0)',
                },
                select: {
                  fill: 'rgba(0,0,0,0)',
                }
              }
            },
            titleKey: null
          }
        },
        filename: null,
        fallbackToExportServer: false,
      }
    },        
    // 정수지 유출 유량 차트
    chartDataReceivingWaterFlow: {
      chart: {
        type: 'spline',
        backgroundColor: false,
        zoomType: 'x'
      },
      title: {
        useHTML: true,
        text: '정수지 유출 유량',
        style: {
          color: 'transparent'
        }
      },
      legend: {
            // align: 'right',
            // verticalAlign: 'top',
            // borderWidth: 0,
            // y: 0,
            // itemStyle: {
            //   color: '#ffffff',
            //   fontWeight: 'bold'
            // },
            // labelFormatter: function () {
            //   return '<span style="color: ' + this.color + '; width: 100px;">' + this.name + '</span>'
            // }
      enabled: false
      },
      credits: {
        enabled: false
        },
          tooltip: {
            valueDecimals: 2,
            xDateFormat: '%Y-%m-%d %H:%M:%S',
            useHTML: true,
            valueSuffix: 'm<sup>3</sup>/h'
          },
          xAxis: {
            title: '',
            type: 'datetime',
            labels: {
              format: '{value:%m-%d %H:%M}',
              style:{
                fontFamily:'NanumSquare',
                fontSize: 13,
                color:"rgb(255,255,255,0.8)"
              }
            },
          },
          yAxis: {
            title: {
              align: 'high',
              text: 'm<sup>3</sup>/h',
              useHTML: true,
              offset: 0,
              rotation: 0,
              y: -15,
              x: -10,
              style: {
                color:"rgb(255,255,255,0.8)"
              }
            },
            gridLineColor: false,
            labels: {
              style:{
                fontFamily:'NanumSquare',
                fontSize: 13,
                color:"rgb(255,255,255,0.8)"
              }
            }
          },
          series: null,
          exporting: {
            buttons: {
              contextButton: {
                menuItems: ['viewFullscreen', 'downloadJPEG', 'downloadCSV'],
                menuItemStyle: { padding: "0 10px", background: "none", color: "#303030"},
                symbolStroke: "rgb(110, 157, 225)",
                theme: {
                  fill:"rgba(0,0,0,0)",
                  states: {
                    hover: {
                      fill: 'rgba(0,0,0,0)',
                    },
                    select: {
                      fill: 'rgba(0,0,0,0)',
                    }
                  }
                },
                titleKey: null
              }
            },
            filename: null,
            fallbackToExportServer: false,
          }
    },
  }),
  components: {
    
  },
  computed: {
  // 원수 유입 유량 차트
    ChartRawWaterFlow: function () {
      let chart = this.chartDataRawWaterFlow
      chart.xAxis.plotLines = [{
        color: 'white', // Color value
        dashStyle: 'ShortDash', // Style of the plot line. Default to solid
        value: new Date().getTime(), // Value of where the line will appear
        width: 3, // Width of the line
      }]
      chart.series = []
      if (this.$store.state.pumpReceiving.latest.ai_b_in_fr_rtd !== null && Object.keys(this.$store.state.pumpReceiving.latest.ai_b_in_fr_rtd).length > 0) {
        let dataSeries1 = []
        for (let key in this.$store.state.pumpReceiving.latest.ai_b_in_fr_rtd) {
          dataSeries1.push([new Date(key).getTime(), parseInt(this.$store.state.pumpReceiving.latest.ai_b_in_fr_rtd[key])])
        }
        chart.series.push({
          name: '유입 유량',
          data: dataSeries1,
          color: 'rgb(110, 157, 225)'
        })
      }
      chart.exporting.filename = this.$moment().format('YYYYMMDDHHmmss') + '_원수 유입 유량 예측'

      return chart
    },
    // 정수지 유출 유량 차트
    ChartReceivingWaterFlow: function () {
        let chart = this.chartDataReceivingWaterFlow
        chart.xAxis.plotLines =[{
          color: 'white',
          dashStyle: 'shortDash',
          value: new Date().getTime(),
          width: 3,
        }]
        chart.series = []
        if (this.$store.state.pumpReceiving.latest.ai_b_out_fr_rtd !== null) {
          let dataSeries1 = []
          for (let key in this.$store.state.pumpReceiving.latest.ai_b_out_fr_rtd) {
            dataSeries1.push([new Date(key).getTime(), this.$store.state.pumpReceiving.latest.ai_b_out_fr_rtd[key]])
          }
          chart.series.push({
            name: '유출 유량',
            data: dataSeries1,
            color: 'rgb(110, 157, 225)'
          })
        }
        chart.exporting.filename = this.$moment().format('YYYYMMDDHHmmss') + '_정수지 유출 유량'
  
        return chart
    },      
  },
  methods: {
    onClickDetail: function() { 
      this.$store.state.pumpReceiving.popup.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.top-info{
  text-shadow: 0 0 9px #a0d0ff;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.06;
  letter-spacing: normal;
  text-align: left;
  color: #23a7c7;
  padding-top: 12px;
  margin-left: 40px;
}
.scroll_container {
  width: 280px;
  height: 41px;
  height: 100%;
  margin-left: 5px;
}
.select-cube{
  position: absolute;
  width: 296px;
  height: 50px;
  background-image: url('../../assets/drugInjection/cg_roling.png');
  background-size: 100% 100%;
  top: 169px;
  left: 8px;
}
#cube {
  display: block;
  position: relative;
  margin: 60px auto;
  height: 41px;  
  width: 280px;
  -webkit-transform-style: preserve-3d;
  -webkit-transform: rotateX(0) rotateY(0) rotateZ(0);
  transform-style: preserve-3d;
  transform: rotateX(0) rotateY(0) rotateZ(0);
  transition: transform 2s;
}
@-webkit-keyframes infiniteRotation {
  0% { -webkit-transform: rotateX(0) ;}
  100% { -webkit-transform: rotateX(360deg) ;}
}
@keyframes infiniteRotation {
  0% { transform: rotateX(0) ;}
  100% { transform: rotateX(360deg) ;}
}
.carousel {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translateZ(-75px);
  transform-style: preserve-3d;
  transition: transform 1s;
}
.carousel__cell {
  position: absolute;
  width: 100%;
  height: 41px;
  text-shadow: 0 0 9px #5cafff;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.5;
  letter-spacing: normal;
  color: #fff;
  text-align: center;
  transition: transform 1s, opacity 1s;
  backface-visibility: hidden;
}
.carousel__cell::before{
  content: "";
  opacity: 0.5;
  position: absolute;
  background-image: url('../../assets/drugInjection/swiper_roling_background.png');
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.select-box{
  position: absolute;
  display: flex;
  bottom: 353px;
  right: 40px;
  select{
    width: 94.5px;
    height: 34px;
    border: solid 1px rgba(157, 191, 255, 0.3);
    opacity: 0.7;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.07;
    letter-spacing: normal;
    text-align: left;
    padding-left: 15px;
    color: #fff;
    margin-left: 20px;
    background-image: url('../../assets/drugInjection/box_under_arrow.png');
    background-position-y: center;
    background-position-x: 70px;
  }
  &__text{
    text-shadow: 0 0 9px #5cafff;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: left;
    color: #fff;
  }
}
.main{
  width: 1202px;
  height: 794px;
  padding-left: 32px;
}
.bottom-contents{
  display: flex;
  width: 100%;
  height: 373px;
  padding-top: 20px;
  .paddingleft{
    padding-left: 10px;
  }
  .contents{
    width: 100%;
    height: 100%;
    .contents-gragh{
      width: 100%;
      height: 306px;
      background-size: contain;
      background-position-y: bottom;
    }
    &__title{
      height:47px;
      background-image: url('../../assets/disinfection/gragh_title.png');
      text-shadow: 0 0 9px #5cafff;
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.11;
      letter-spacing: normal;
      text-align: left;
      color: #fff;
    }
  }
}
.last-container{
  display: flex;
  width: 63%;
  position: relative;
  .first{
    width: 420px;
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
        padding : 35px 0px;
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
            width: 200px;
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
            width: 38px;
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
    // 알고리즘 예측 컨텐츠
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
      margin-top: 15px;
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
        text-align: left;
        color: #c3eaff;
        // margin-bottom: 10px;
      }
      // 현재개도 박스
      .real-box{
        display: flex;

        position: absolute;
        width: 220px;
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
      // 전동가압장 박스 위치(1단계)
      .real-one {
        top: 45px;
        left: 0;
      }
      // 전동가압장 박스 위치(2단계)
      // .real-two {
      //   top: 150px;
      // }
      // 전동가압장 박스 위치(3단계)
      // .real-three {
      //   top: 185px;
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
top: 89px;
left: 367px;
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
z-index: 10;
position: absolute;
top: 89px;
left: 752px;
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
margin:70px 0 0 18px;
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
.chart-container{
    display: flex;
    width: 100%;
    // margin: 0 25px;
    // 차트 컨텐츠
  .chart-contents{
      width: 50%;
      height: 100%;
      margin-right: 10px;
      // 차트 제목
      .chart-title{
        display: flex;
        margin-top: 10px;
        // 계열 선택 탭
        .chart-title-tab{
          display: flex;
          margin-top: 5px;
          margin-left: auto;
          &__box{
            width: 30.9px;
            height: 26.4px;
            border: solid 1px #b4dffa;
            background-color: rgba(139, 194, 240, 0.25);
            font-family: "KHNPHUotfR";
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.8;
            letter-spacing: normal;
            text-align: center;
            color: #fff;
            cursor: pointer;
          }
        }
        &__text{
          width: 196px;
          height: 47px;
          background-image: url('../../assets/splashdown/chart_title.png');
          text-shadow: 0 0 9px #5cafff;
          font-family: "KHNPHUotfR";
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.11;
          letter-spacing: normal;
          text-align: center;
          color: #fff;
        }
      }
      // 차트
      .chart{
        width: 600px;
        height: 318px;
        margin-left: 17px;
      }
  }
}
</style>