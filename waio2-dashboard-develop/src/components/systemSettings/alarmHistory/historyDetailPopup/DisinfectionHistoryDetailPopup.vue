<template>
  <div v-if="this.$store.state.alarm.visible" class="popup-wrap">
    <div class="popup-main">
      <div class="popup-contents">
        <div class="top">
          <div class="top__img"></div>
          <div class="top__title"> {{ this.$store.state.alarm.selectedProcessTitle }}</div>
          <div class="top__exit-btn" @click="closePopup()"></div>
        </div>
        <div class="chart-container">
          <div class="one-contents">
            <div class="one-contents__title">주요인자</div>
            <div class="big-contents">
              <div class="contents-value" v-if="this.$store.state.alarm.alarmsDetail.factorMap.disinfection_index == 1">
                <div class="value-container">
                  <div class="value-container__one">· 수온(°C)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.b_te | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 기온</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_tei | numFormat('0.00') }}</div>
                </div>
                <!-- <div class="value-container">
                  <div class="value-container__one">· 정수 탁도(NTU)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.h_tb | numFormat('0.00') }}</div>
                </div> -->
                <!-- <div class="value-container">
                  <div class="value-container__one">· 정수 pH</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.h_ph | numFormat('0.00') }}</div>
                </div> -->
                <!-- <div class="value-container">
                  <div class="value-container__one">· 원수 유입유량</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.b_in_fr | numFormat('0,0') }}</div>
                </div> -->
                <div class="value-container" v-if="this.$store.state.alarm.alarmsDetail.procCd == 'G2'">
                  <div class="value-container__one">· 혼화지 잔류 염소</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_d_residual_cl | numFormat('0.00') }}</div>
                </div>
                <div class="value-container" v-if="this.$store.state.alarm.alarmsDetail.procCd == 'G1'">
                  <div class="value-container__one">· 침전지 잔류 염소</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.e1_cl | numFormat('0.00') }}</div>
                </div>
                <div class="value-container" v-if="this.$store.state.alarm.alarmsDetail.procCd == 'G2'">
                  <div class="value-container__one"></div>
                  <div class="value-container__title">1계열</div>
                  <div class="value-container__title">2계열</div>
                </div>
                <div class="value-container" v-if="this.$store.state.alarm.alarmsDetail.procCd == 'G2'">
                  <div class="value-container__one">· 침전지 잔류 염소</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_e_1_residual_cl | numFormat('0.00') }}</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_e_2_residual_cl | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 현재 주입률</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_pre_chol_rate | numFormat('0.00') }}</div>
                </div>
              </div>
              <div class="contents-value" v-if="this.$store.state.alarm.alarmsDetail.factorMap.disinfection_index == 2">
                <!-- <div class="value-container">
                  <div class="value-container__one">· 수온(°C)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.b_te | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 정수 탁도(NTU)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.h_tb | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 정수 pH</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.h_ph | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 원수 유입유량</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.b_in_fr | numFormat('0,0') }}</div>
                </div> -->
                <div class="value-container">
                  <div class="value-container__one">· 중염소 주입률</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_peri_chol_rate | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one"></div>
                  <div class="value-container__title">1계열</div>
                  <div class="value-container__title">2계열</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 여과지 유출 잔류 염소</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_f_out_1_residual_cl | numFormat('0.00') }}</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_f_out_2_residual_cl | numFormat('0.00') }}</div>
                </div>
              </div>
              <div class="contents-value" v-if="this.$store.state.alarm.alarmsDetail.factorMap.disinfection_index == 3">
                <!-- <div class="value-container">
                  <div class="value-container__one">· 수온(°C)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.b_te | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 정수 탁도(NTU)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.h_tb | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 정수 pH</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.h_ph | numFormat('0.00') }}</div>
                </div> -->
                <div class="value-container">
                  <div class="value-container__one"></div>
                  <div class="value-container__title">1계열</div>
                  <div class="value-container__title">2계열</div>
                </div>
                <!-- <div class="value-container">
                  <div class="value-container__one">· 여과지 유출유량(m<sup>3</sup>/h)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.f1_out_fr | numFormat('0,0') }}</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.f2_out_fr | numFormat('0,0') }}</div>
                </div> -->
                <div class="value-container">
                  <div class="value-container__one">· 정수지 유입 잔류염소(ppm)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_h_in_1_residual_cl | numFormat('0.00') }}</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_h_in_2_residual_cl | numFormat('0.00') }}</div>
                </div>
                <div class="value-container">
                  <div class="value-container__one">· 여과지 유출 잔류 염소</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_f_out_1_residual_cl | numFormat('0.00') }}</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_f_out_2_residual_cl | numFormat('0.00') }}</div>
                </div>
                <!-- <div class="value-container">
                  <div class="value-container__one">· 정수지 유출 잔류염소(ppm)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_h_out_residual_cl | numFormat('0.00') }}</div>
                </div> -->
                <div class="value-container">
                  <div class="value-container__one">· 현재 주입률(ppm)</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_post_1_chol_rate | numFormat('0.00') }}</div>
                  <div class="value-container__two">{{ this.$store.state.alarm.alarmsDetail.factorMap.g_post_2_chol_rate | numFormat('0.00') }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="arrow-animate-one"></div>
          <!-- 리스트가 1개 일 때 -->
          <div class="table-contents-wrap" v-if="this.$store.state.alarm.alarmsDetail.ctrHisList.length == 1">
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
                <div class="table-contents">{{ this.$store.state.alarm.alarmsDetail.ctrHisList[0].dp  }}</div>
              </div>
              <div class="table-detail">
                <div class="table-title">· 이전값</div>
                <div class="table-arrow"></div>
                <div class="table-contents">{{ this.$store.state.alarm.alarmsDetail.ctrHisList[0].tagCmpVal  }}</div>
              </div>
              <div class="table-detail">
                <div class="table-title">· 제어값</div>
                <div class="table-arrow"></div>
                <div class="table-contents">{{ this.$store.state.alarm.alarmsDetail.ctrHisList[0].tagVal }}</div>
              </div>
            </div>
          </div>
          <!-- 리스트가 2개 이상 일 때 -->
          <div class="table-contents-wrap-v2" v-else>
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
                  <tr class="table-contents" v-for="(ctr) in this.$store.state.alarm.alarmsDetail.ctrHisList" :key="ctr.historySeq">
                    <td> {{ ctr.tagSn }}</td>
                    <td> {{ ctr.dp }}</td>
                    <td> {{ ctr.tagCmpVal }}</td>
                    <td> {{ ctr.tagVal }}</td>
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
  closePopup(){
    this.$store.state.alarm.visible = false;
  }
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
  width: 1920px;
  height: 1156px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30,37,61,0.8);
  .popup-main{
    display: flex;
    width: 1200px;
    height: 520px;
    justify-content: center;
    align-items: center;
    background-image: url('../../../../assets/cj_images/popup_main.png');
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
                  margin-left: auto;
                  text-shadow: 0 0 9px #5cafff;
                  font-size: 16px;
                  text-align: center;
                  color: #c3eaff;
                }
                &__one {
                  width: 220px;
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
                // &__three {
                //   width: 48px;
                //   margin-right: 10px;
                //   margin-left: 7px;
                //   font-size: 14px;
                //   line-height: 2.5;
                //   text-align: left;
                //   color: #417db9;
                // }
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
            background-image: url('../../../../assets/cj_images/contents_right_title.png');
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
          background-image: url('../../../../assets/cj_images/contents_right_title.png');
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
    .top {
      display: flex;
      width: 100%;
      height: 30px;
      &__img {
        width: 19px;
        height: 30px;
        background-image: url('../../../../assets/sedimentation/top_title_img.png');
      }
      &__title {
        margin-left: 10px;
        font-size: 24px;
        line-height: 1.5;
        text-align: left;
        color: #b4dffb;
      }
      &__exit-btn {
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