<template>
  <div v-if="this.$store.state.alarm.visible" class="popup-wrap">
    <div class="popup-main">
      <div class="popup-contents">
        <div class="top">
          <div class="top__img"></div>
          <div class="top__title">{{ this.popupData.processTitle }} </div>
          <div class="top__exit-btn" @click="closePopup()"></div>
        </div>
        <div class="chart-container">
          <div class="table-contents-wrap" :style=" { maxHeight: containerHeight + 'px', overflowY: containerHeight > 500 ? 'auto' : 'hidden' }">
            <table class="table-detail">
            <colgroup>
              <col style="width: 20%;">
              <col style="width: 35%;">
              <col style="width: 10%;">
              <col style="width: 10%;">
            </colgroup>
            <thead class="table-title">
              <th>태그값</th>
              <th>태그설명</th>
              <th>이전값</th>
              <th>제어값</th>
            </thead>
            <tbody>
              <tr class="table-contents" v-for="(item) in this.$store.state.alarm.alarmsDetail" :key="item.historySeq">
                <td>{{ item.tagSn }}</td>
                <td>{{ item.tagDp }}</td>
                <td>{{ item.tagCmpVal }}</td>
                <td>{{ item.tagVal != null ? item.tagVal : '-' }}</td>
              </tr>
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CLOSE_POPUP } from '@/store/modules/alarm/alarm'
export default {
name: 'HistoryDetailPopup',
props: ['popupData'],
data() {
    return {
      containerHeight: 500 // 팝업 높이 설정
    }
  },
computed: {
},
methods: {
  updateContainerHeight() {
      const contentHeight = /* 여기에서 컨텐츠의 높이를 가져오는 로직 */
      this.containerHeight = Math.min(contentHeight, 500); // 최대 500px로 제한
    },
    mounted() {
    // 페이지가 로드되거나 컨텐츠가 업데이트될 때마다 호출
    this.updateContainerHeight();
    },
  /**
   * 팝업이 닫힘 버튼 선택시 
   * 타이머 종료
   */
  closePopup: function () {
    clearInterval(this.timer)
    this.$store.commit('alarm/' + CLOSE_POPUP)
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
  // console.log(this.$options.name + ' destoryed')
},
updated: function () {
  // console.log(this.$options.name + ' updated')
},
watch: {
  // 팝업 열림/닫힘 값 변화 감지
  '$store.state.alarm.visible': function (newVal) {
    if (newVal) {
      this.timer = setInterval( () => {
        Promise.all([
          this.$store.dispatch(CLOSE_POPUP)
        ])
      }, 1000 * 60)
    }
  }
}
}
</script>
<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 5px;
}
*::-webkit-scrollbar-track {
  background-color: #011527;
  border-radius: 2.5px;
}
*::-webkit-scrollbar-thumb {
  background-color: #417db9;
  border-radius: 2.5px;
}
.popup-wrap {
  position: absolute;
  top: -155px;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 100%;
  min-height: 1156px;
  background-color: rgba(30,37,61,0.8);
  .popup-main {
    position: absolute;
    width: 800px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url('../../assets/sedimentation/popup_main.png');
    background-size: 100% 100%;
    .popup-contents{
      padding: 30px;
      height: 100%;
      .chart-container {
        width: 100%;
        margin: 20px 0;
        color: #b4dffb;
        font-size: 14px;
        .table-contents-wrap {
          overflow-y: auto !important;
        }
        .table-detail {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
        }
        .table-title {
          width: 100%;
          color: #fff;
          height: 45px;
          background-image: linear-gradient(to right, #11316b 0%, rgba(39, 86, 162,1) 15%, rgba(39, 86, 162,1) 85%, #11316b 100%);
          position: sticky;
          top: 0;
        }
        td {
          text-align: center;
          height: 45px;
        }
        .table-contents:nth-child(odd) {
          background-image: linear-gradient(90deg,rgba(9,76,181,0) 3%,rgba(9,76,181,.15) 21%,rgba(9,76,181,.15) 82%,rgba(9,76,181,0) 100%);
        }
        .table-contents:nth-child(even) {
          background-image: linear-gradient(90deg,rgba(66,144,221,0),rgba(66,144,221,.15) 16%,rgba(66,144,221,.15) 87%,rgba(66,144,221,0));
        }
    }
      .top{
        display: flex;
        width: 100%;
        height: 30px;
        margin-top: 20px;
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