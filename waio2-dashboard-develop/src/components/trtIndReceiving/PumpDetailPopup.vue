<template>
    <div v-if="this.$store.state.trtIndReceiving.visible" class="main">
      <div class="popup-main">
        <div class="popup-contents">
          <div class="top">
            <div class="top__img"></div>
            <div class="top__title">AI 펌프 총 가동 대수 예측 상세</div>
            <div class="top__exit-btn" @click="closePopup()"></div>
          </div>         
          <div class="top-title">총 가동 대수 예측
            <span class="top-title__num">{{ this.$store.state.trtIndReceiving.latest.ai_b_pump_cnt | numFormat('0') }}</span>
          </div>
          <div class="contents-img">
            <div class="pump-info">
              <div class="pump-info__on">ON</div>
              <div class="pump-info__off">OFF</div>
            </div>
            <div class="pump-contents">
              <div class="title-line vertical"></div>
              <ul class="pump-contents__title">
                <p class="title1">현도1취수장</p>
                <li v-for="(item, index) in $store.state.trtIndReceiving.latest.ai_b_pump_cb_h1" :key="index" class="pump-contents__text" :class="item === 0 ? 'off' : 'on'">
                {{ index.split('p')[1] }}
                </li>
              </ul>
              <div class="title-line horizontal"></div>
              <ul class="pump-contents__title">
                <p class="title2">현도2취수장</p>
                <li v-for="(item, index) in $store.state.trtIndReceiving.latest.ai_b_pump_cb_h2" :key="index" class="pump-contents__text" :class="item === 0 ? 'off' : 'on'">
                {{ index.split('p')[1] }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script> 
import { CLOSE_POPUP } from '@/store/modules/trtIndReceiving'
export default {
  name: 'PumpDetailPopup',
  data: () => ({
    timer: null, // API 요청 타이머
    scDividedValue: 5.7, // 대차 위치 계산 상수
    // 슬러지 발생량 예측 차트
    chartDataSludge: {
      chart: {
        type: 'spline',
        backgroundColor: false,
        zoomType: 'x'
      },
      title: {
        useHTML: true,
        text: '슬러지 발생량 예측',
        style: {
          color: 'transparent'
        }
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false
      },
      tooltip: {
        valueDecimals: 2,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
        valueSuffix: 'ton'
      },
      xAxis: {
        title: {
          text: ''
        },
        type: 'datetime',
        categories: [],
        labels: {
          format: '{value:%m-%d %H:%M}',
          style:{
            fontFamily:'NanumSquare',
            fontSize: 13,
            color:"rgb(255,255,255,0.8)"
          }
        },
        tickInterval: 1000 * 60 * 60 * 12 
      },
      yAxis: {
        title: {
          align: 'high',
          text: 'ton',
          useHTML: true,
          offset: 0,
          rotation: 0,
          x: -15,
          y: -15,
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
    // 계면계 수위 차트
    chartDataMeter: {
      chart: {
        type: 'spline',
        backgroundColor: false,
        zoomType: 'x'
      },
      title: {
        useHTML: true,
        text: '계면계 수위',
        style: {
          color: 'transparent'
        }
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false
      },
      tooltip: {
        valueDecimals: 2,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
        valueSuffix: 'm'
      },
      xAxis: {
        title: {
          text: ''
        },
        type: 'datetime',
        labels: {
          format: '{value:%H:%M}',
          style:{
            fontFamily:'NanumSquare',
            fontSize: 13,
            color:"rgb(255,255,255,0.8)"
          }
        },
        tickInterval: 1000 * 60 * 60 * 3 
      },
      yAxis: {
        title: {
          align: 'high',
          text: 'm',
          useHTML: true,
          offset: 0,
          rotation: 0,
          x: -10,
          y: -15,
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
    }
  }),
  computed: {
    // 슬러지 발생량 예측 차트 옵션
    ChartSludge: function () {
      let chart = this.chartDataSludge
      let now = new Date()
      chart.exporting.filename = this.$moment().format('YYYYMMDDHHmmss') + '_슬러지 발생량 예측 ' + this.$store.state.sedimentation.popup.numJi + '지'
      chart.xAxis.plotLines = []
      chart.xAxis.plotLines.push({
        color: 'white', 
        dashStyle: 'ShortDash',
        value: now.getTime(), 
        width: 3,
      })
      if (this.$store.state.sedimentation.popup.location.e_location_sludge_trend !== null && Object.keys(this.$store.state.sedimentation.popup.location.e_location_sludge_trend).length > 0) {
        let data = []
        for (let key in this.$store.state.sedimentation.popup.location.e_location_sludge_trend) {
          data.push([new Date(key).getTime(), this.$store.state.sedimentation.popup.location.e_location_sludge_trend[key]])
          console.log(this.$store.state.sedimentation.popup.location.e_location_sludge_trend[key], this.$store.state.sedimentation.latestModify.e_sc_set_sludge_q)
          if (this.$store.state.sedimentation.popup.location.e_location_sludge_trend[key] >= this.$store.state.sedimentation.latestModify.e_sc_set_sludge_q) {
            chart.xAxis.plotLines.push({
              color: 'red', 
              dashStyle: 'ShortDash',
              value: new Date(key).getTime(),
              width: 3,
            })
          }
        }
        chart.series = [{
          name: '슬러지 발생량',
          data: data
        }]
        return chart
      }
      return chart
    },
    // 계면계 수위 발생 차트 옵션
    ChartMeter: function () {
      let chart = this.chartDataMeter
      chart.exporting.filename = this.$moment().format('YYYYMMDDHHmmss') + '_계면계 수위 ' + this.$store.state.sedimentation.popup.numJi + '지'
      if (this.$store.state.sedimentation.popup.interface.series !== null && Object.keys(this.$store.state.sedimentation.popup.interface.series).length > 0) {
        let dataSeries = []
        for (let key in this.$store.state.sedimentation.popup.interface.series) {
          dataSeries.push([new Date(key).getTime(), this.$store.state.sedimentation.popup.interface.series[key]])
        }
        chart.series = [{
          name: '계면계 수위',
          data: dataSeries,
          color: 'rgb(110, 157, 225)'
        }]
        return chart
      }
      return chart
    }
  },
  methods: {
    /**
     * 팝업이 닫힘 버튼 선택시 
     * 타이머 종료
     */
    closePopup: function () {
      clearInterval(this.timer)
      this.$store.commit('trtIndReceiving/' + CLOSE_POPUP)
    },
    // fullscreen 이벤트
    // fullscreenchanged: function () {
    //   console.log('fullscreenchange')
    //   if(document.fullscreenElement) {
    //     this.chartDataSludge.title.style.color = 'white'
    //     this.chartDataMeter.title.style.color = 'white'
    //   } else {
    //     this.chartDataSludge.title.style.color = 'transparent'
    //     this.chartDataMeter.title.style.color = 'transparent'
    //   }
    // }
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
  watch: {
    // 팝업 열림/닫힘 값 변화 감지
    '$store.state.trtIndReceiving.popup.visible': function (newVal) {
      if (newVal) {
        this.timer = setInterval( () => {
           Promise.all([
            // this.$store.dispatch(GET_SEDIMENTATION_LOCATION_BY_JI, { numJi: this.$store.state.sedimentation.popup.numJi })
          ])
        }, 1000 * 60)
      }
    }
  }
} 
</script>
<style lang="scss" scoped>
.main{
  position: absolute;
  top: -85px;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 1096px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30,37,61,0.8);
  .popup-main{
    display: flex;
    width: 697px;
    height: 632px;
    justify-content: center;
    align-items: center;
    // background-image: url('../../assets/sedimentation/popup_main.png');
    .popup-contents{
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url('../../assets/cj_images/pump-bg.png');
      padding: 40px 25px;
      background-size: 100% 100%;
      .top-title{
        width: 230px;
        height: 53px;
        margin-top: 25px;
        padding-left: 30px;
        background-image: url('../../assets/sedimentation/bottom_title_img.png');
        text-shadow: 0 0 9px #5cafff;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        color: #fff;
        &__num {
          font-family: "LAB디지털" !important;
          font-size: 32px;
          color: #b4dffb;
          margin-left: 20px;
          vertical-align: middle;
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
      .contents-img{
        // width: 592px;
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
          background: radial-gradient( #123169,#cb4455 );
          margin-right: 5px;
        }
        &__off::before {
          content: '';
          // display: block;
          border-radius: 50%;
          width: 15px;
          height: 15px;
          background: radial-gradient( #123169,#1fa8b2 );
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
          background: radial-gradient( #123169 35% ,#1fa8b2 80%);
        }
        .on {
          color: #f898aa;
          background: radial-gradient( #123169 35% ,#cb4455 70%);
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
        left: 141px;
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
      }
    }
  }
}
</style>