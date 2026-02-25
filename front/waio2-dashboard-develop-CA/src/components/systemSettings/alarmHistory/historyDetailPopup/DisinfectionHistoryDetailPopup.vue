<template>
  <div v-if="this.$store.state.alarm.visible && this.$store.state.alarm.alarmsDetail.procCd.substring(0, 1) == 'G'" class="popup-wrap">
    <div class="popup-main">
      <div class="popup-contents">
        <div class="top">
          <div class="top__img"></div>
          <div class="top__title">{{ this.$store.state.alarm.selectedProcessTitle }}</div>
          <div class="top__exit-btn" @click="closePopup()"></div>
        </div>
        <div class="chart-container">
        <!-- 주요인자 -->
        <div class="one-contents">
          <div class="one-contents__title">주요인자</div>
          <div class="big-contents">
            <div class="contents-value" v-if="this.$store.state.alarm.selectedDisinfectionIndex == 1">
              <div class="value-container">
                <div class="value-container__one">· 기온</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_tei | numFormat('0.00') }}</div>
                <div class="value-container__three">℃</div>
              </div>
              <div class="value-container">
                <div class="value-container__one">· 수온</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.b_te | numFormat('0.00') }}</div>
                <div class="value-container__three">℃</div>
              </div>
              <div v-if="this.$store.state.alarm.alarmsDetail.procCd == 'G2_IND'" class="value-container">
                <div class="value-container__one">· 정수지 잔류 염소</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.h_in_fr | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
              <div v-if="this.$store.state.alarm.alarmsDetail.procCd != 'G2_IND'" class="value-container">
                <div class="value-container__one">· 혼화지 잔류 염소</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_d_residual_cl | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
              <div v-if="this.$store.state.alarm.alarmsDetail.procCd != 'G2_IND'" class="value-container">
                <div class="value-container__one">· 침전지 잔류 염소</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_e_residual_cl | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
              <div v-if="this.$store.state.alarm.alarmsDetail.procCd == 'G2_LIV'" class="value-container">
                <div class="value-container__one">· 중차염 주입률</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_peri_chol_rate | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
              <div class="value-container">
                <div class="value-container__one">· 현재 주입률</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_pre_chol_rate | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
            </div>
            <div class="contents-value" v-else-if="this.$store.state.alarm.selectedDisinfectionIndex == 2">
              <div class="value-container">
                <div class="value-container__one">· 침전지 잔류 염소</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_e_residual_cl | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
              <div class="value-container">
                <div class="value-container__one">· 현재 주입률</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_peri_chol_rate | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
            </div>
            <div class="contents-value" v-else-if="this.$store.state.alarm.selectedDisinfectionIndex == 3">
              <div class="value-container">
                <div class="value-container__one">· 정수지 유입 잔류 염소</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_h_in_residual_cl | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
              <div class="value-container">
                <div class="value-container__one">· 현재 주입률</div>
                <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_post_chol_rate | numFormat('0.00') }}</div>
                <div class="value-container__three">ppm</div>
              </div>
            </div>
          </div>
        </div>    
        <div class="arrow-animate-one"></div>        
        <!-- 리스트가 1개 일 때 -->
        <div v-if="this.$store.state.alarm.alarmsDetail.ctrHisList.length == 1" class="table-contents-wrap">
          <div class="table-contents-wrap__title">알고리즘 제어</div>
          <div class="table-contents-container">
            <div class="table-detail">
              <div class="table-title">· 태그명</div>
              <div class="table-arrow"></div>
              <div class="table-contents">{{ this.$store.state.alarm.alarmsDetail.ctrHisList[0].tagSn }}</div>
            </div>
            <div class="table-detail">
              <div class="table-title">· 태그설명</div>
              <div class="table-arrow"></div>
              <div class="table-contents">{{ this.$store.state.alarm.alarmsDetail.ctrHisList[0].tagDp }}</div>
            </div>
            <div class="table-detail">
              <div class="table-title">· 이전값</div>
              <div class="table-arrow"></div>
              <div class="table-contents">{{ this.$store.state.alarm.alarmsDetail.ctrHisList[0].tagCmpVal }}</div>
            </div>
            <div class="table-detail">
              <div class="table-title">· 제어값</div>
              <div class="table-arrow"></div>
              <div class="table-contents">{{ this.$store.state.alarm.alarmsDetail.ctrHisList[0].tagVal }}</div>
            </div>
          </div>
        </div>
        <!-- 리스트가 2개 이상 일 때 -->
        <div v-else class="table-contents-wrap-v2">
          <div class="table-contents-wrap__title">알고리즘 제어</div>
          <div class="table-contents-container" :style=" { maxHeight: containerHeight + 'px', overflowY: containerHeight > 330 ? 'auto' : 'hidden' }">
            <table class="table-detail" >
              <colgroup>
                <col style="width: 20%;">
                <col style="width: 35%;">
                <col style="width: 10%;">
                <col style="width: 10%;">
              </colgroup>
              <thead class="table-title">
                <th>태그명</th>
                <th>태그설명</th>
                <th>이전값</th>
                <th>제어값</th>
              </thead>
              <tbody>
                <tr v-for="(item) in $store.state.alarm.alarmsDetail.ctrHisList" class="table-contents" :key="item.historySeq">
                  <td>{{ item.tagSn }}</td>
                  <td>{{ item.tagDp }}</td>
                  <td>{{ item.tagCmpVal }}</td>
                  <td>{{ item.tagVal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CLOSE_POPUP } from '@/store/modules/alarm/alarm'
export default {
  name: 'DisinfectionHistoryDetailPopup',
  data() {
    return {
      containerHeight: 330 // 팝업 높이 설정
    }
  },
  computed: {
  },
  methods: {
    updateContainerHeight() {
      const contentHeight = /* 여기에서 컨텐츠의 높이를 가져오는 로직 */
      this.containerHeight = Math.min(contentHeight, 330); // 최대 330px로 제한
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
  },
  created: function () {
    // console.log(this.$options.name + ' created')
  },
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
            this.$store.commit(CLOSE_POPUP)
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
  .popup-main{
    position: absolute;
    width: 1200px;
    height: 520px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url('../../../../assets/ca_images/popup_main.png');
    background-size: 100% 100%;
    .popup-contents{
      padding: 50px 30px;
      width: 100%;
      height: 100%;
      .chart-container {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        color: #b4dffb;
        font-size: 14px;
        .arrow-animate-one {
          background-image: url('../../../../assets/splashdown/arrow_img.png');
          background-size: 100% 100%;
          width: 85px;
          animation-name: big-arrow-one;
          animation-duration: 5s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes big-arrow-one { 
          0% {opacity:1;}
          25% {opacity:0.5;}
          50% {opacity:1;}
          75% {opacity:0.5;}
          100% {opacity:1;}
        } 
        .one-contents {
          .big-contents {
            .contents-value {
              display: flex;
              flex-direction: column;
              // justify-content: space-between;
              width: 400px;
              height: 340px;
              padding: 15px;
              .value-container {
                position: relative;
                display: flex;
                width: 100%;
                height: 32px;
                margin-bottom: 20px;
                &__title {
                  flex: 1;
                  text-shadow: 0 0 9px #5cafff;
                  font-size: 16px;
                  text-align: center;
                  color: #c3eaff;
                }
                &__one {
                  width: 190px;
                  margin-left: 15px;
                  text-shadow: 0 0 9px #5cafff;
                  font-size: 18px;
                  text-align: left;
                  color: #9fc4ff;
                }
                &__two {
                  margin-left: auto;
                  text-shadow: 0 0 9px #5cafff;
                  font-size: 20px;
                  text-align: left;
                  color: #fff;
                }
                &__three {
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
          &__title {
            width: 100%;
            height: 53px;
            padding-left: 30px;
            background-image: url('../../../../assets/disinfection/contents_right_title.png');
            text-shadow: 0 0 9px #5cafff;
            font-size: 18px;
            line-height: 2.8;
            text-align: left;
            color: #fff;
            background-size: 100% 100%;
          }
        }  
      // 리스트가 1개 일 때
      .table-contents-wrap {
        width: 60%;
          &__title {
            width: 100%;
            height: 53px;
            padding-left: 30px;
            background-image: url('../../../../assets/ca_images/contents_right_title.png');
            text-shadow: 0 0 9px #5cafff;
            font-size: 18px;
            line-height: 2.8;
            text-align: left;
            color: #fff;
            background-size: 100% 100%;
          }
          .table-contents-container {
            margin-top: 20px;
          } 
        .table-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 85%;
          height: 55px;
          padding-left: 40px;
        }  
        .table-title {
          width: 75px;
          color: #c3eaff;
          font-size: 16px;
        }         
        .table-arrow {
          width: 47px;
          height: 100%;
          background-image: url('../../../../assets/coagulants/simulation/simul_search_pagenation_right_arrow.png');
          background-position: 50%;
        }       
        .table-contents {
          width: 350px;
          color: #fff;
          font-size: 16px;
        }              
      }  
      // 리스트가 2개 이상 일 때
      .table-contents-wrap-v2 {
        width: 60%;
        &__title {
          width: 100%;
          height: 53px;
          padding-left: 30px;
          background-image: url('../../../../assets/ca_images/contents_right_title.png');
          text-shadow: 0 0 9px #5cafff;
          font-size: 18px;
          line-height: 2.8;
          text-align: left;
          color: #fff;
          background-size: 100% 100%;
        }
        .table-contents-container {
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
          background-image: linear-gradient(to right, #0c2a60 0%, rgba(39, 86, 162,1) 15%, rgba(39, 86, 162,1) 85%, #0c2a60 100%);
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
    }
      .top{
        display: flex;
        width: 100%;
        height: 30px;
        &__img{
          width: 19px;
          height: 30px;
          background-image: url('../../../../assets/sedimentation/top_title_img.png');
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
          background-image: url('../../../../assets/sedimentation/exit_btn.png');
          background-position-y: center;
          cursor: pointer;
          z-index: 9;
        }
      }
    }
  }
}
</style>