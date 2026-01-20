<template>
  <div class="dashboard-info-container">
    <div class="content-box  box2">
      <div class="titleBox">
          <div class="title">자율진단</div>
          <img src="@/assets/titleImg.png" alt="" />
      </div>
      <div class="content3">
        <div class="list-box">
          <div class="itemList list1">
            <div class="list-title">
              <span>전동(가) 1</span>
              <img src="@/assets/list-title.png" alt="" />
            </div>
          </div>
          <div class="itemList list2">
            <div class="item-box">
              <div v-for="(idx) in state.pumpCnt1" :key="idx"
                class="item"
                :class="{
                  selected: state.idx === (idx-1), 
                  alarm:
                    store.state.dashboard.motorInfo[idx-1]
                      .alarm,
                }"
                @click="processClick(idx-1)"
                @mouseenter="killTimer()"
                @mouseleave="timeRotation()"
              >
                #{{ idx }}
              </div>
            </div>
          </div>
        </div>

        <div class="motor-box">
          <img
            v-if="
              !store.state.dashboard.motorInfo[state.idx].alarm
            "
            src="@/assets/motor.png"
            alt=""
          />
          <img
            v-else
            src="@/assets/motor-alert.png"
            alt=""
            class="alert-ani"
          />
          <div class="motor-value-area">
            <div class="group type1">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx]
                    .pump_de_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx]
                    .brg_pump_de_temp
                }}
                °C
              </div>
            </div>
            <div class="group type2">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx]
                    .pump_nde_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx]
                    .brg_pump_nde_temp
                }}
                °C
              </div>
            </div>
            <div class="group type3">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                    store.state.dashboard.motorInfo[state.idx]
                      .motor_de_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx]
                    .brg_motor_de_temp
                }}
                °C
              </div>
            </div>
            <div class="group type4">
              <div class="val-icon alert"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx]
                    .motor_nde_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx]
                    .brg_motor_nde_temp
                }}
                °C
              </div>
            </div>
          </div>
        </div>

        <img src="@/assets/titleImg.png" alt="" style="height : 5px;"/>

        <div class="list-box">
          <div class="itemList list1">
            <div class="list-title">
              <span>전동(가) 2</span>
              <img src="@/assets/list-title.png" alt="" />
            </div>
          </div>
          <div class="itemList list2">
            <div class="item-box">
              <div v-for="(idx) in state.pumpCnt2" :key="idx"
                class="item"
                :class="{
                  selected: state.idx2 === (idx-1), 
                  alarm:
                    store.state.dashboard.motorInfo[(idx-1+state.pumpCnt1)]
                      .alarm,
                }"
                @click="processClick2(idx-1)"
                @mouseenter="killTimer2()"
                @mouseleave="timeRotation2()"
              >
                #{{ idx }}
              </div>
            </div>
          </div>
        </div>

        <div class="motor-box">
          <img
            v-if="
              !store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1].alarm
            "
            src="@/assets/motor.png"
            alt=""
          />
          <img
            v-else
            src="@/assets/motor-alert.png"
            alt=""
            class="alert-ani"
          />
          <div class="motor-value-area">
            <div class="group type1">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1]
                    .pump_de_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1]
                    .brg_pump_de_temp
                }}
                °C
              </div>
            </div>
            <div class="group type2">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1]
                    .pump_nde_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1]
                    .brg_pump_nde_temp
                }}
                °C
              </div>
            </div>
            <div class="group type3">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                    store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1]
                      .motor_de_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1]
                    .brg_motor_de_temp
                }}
                °C
              </div>
            </div>
            <div class="group type4">
              <div class="val-icon alert"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1]
                    .motor_nde_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx2+state.pumpCnt1]
                    .brg_motor_nde_temp
                }}
                °C
              </div>
            </div>
          </div>
        </div>

        <img src="@/assets/titleImg.png" alt="" style="height : 5px;"/>

        <div class="list-box">
          <div class="itemList list1">
            <div class="list-title">
              <span>전동(가) 3</span>
              <img src="@/assets/list-title.png" alt="" />
            </div>
          </div>
          <div class="itemList list2">
            <div class="item-box">
              <div v-for="(idx) in state.pumpCnt3" :key="idx"
                class="item"
                :class="{
                  selected: state.idx3 === (idx-1), 
                  alarm:
                    store.state.dashboard.motorInfo[(idx-1+state.pumpCnt1+state.pumpCnt2)]
                      .alarm,
                }"
                @click="processClick3(idx-1)"
                @mouseenter="killTimer3()"
                @mouseleave="timeRotation3()"
              >
                #{{ idx }}
              </div>
            </div>
          </div>
        </div>

        <div class="motor-box">
          <img
            v-if="
              !store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2].alarm
            "
            src="@/assets/motor.png"
            alt=""
          />
          <img
            v-else
            src="@/assets/motor-alert.png"
            alt=""
            class="alert-ani"
          />
          <div class="motor-value-area">
            <div class="group type1">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2]
                    .pump_de_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2]
                    .brg_pump_de_temp
                }}
                °C
              </div>
            </div>
            <div class="group type2">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2]
                    .pump_nde_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2]
                    .brg_pump_nde_temp
                }}
                °C
              </div>
            </div>
            <div class="group type3">
              <div class="val-icon"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                    store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2]
                      .motor_de_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2]
                    .brg_motor_de_temp
                }}
                °C
              </div>
            </div>
            <div class="group type4">
              <div class="val-icon alert"></div>
              <div class="val-line"></div>
              <div class="val-1">
                {{
                  store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2]
                    .motor_nde_rms_amp
                }}
                rms
              </div>
              <div class="val-2">
                {{
                  store.state.dashboard.motorInfo[state.idx3+state.pumpCnt1+state.pumpCnt2]
                    .brg_motor_nde_temp
                }}
                °C
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
export default {
  setup() {
    const store = useStore();
    const state = reactive({
      idx: 0,
      idx2: 0,
      idx3: 0,
      timer: null,
      timer2: null,
      timer3: null,
      pumpCnt1: 5,
      pumpCnt2: 7,
      pumpCnt3: 7
    });

    const processClick = (idx) => {
      state.idx = idx;
      killTimer();
      timeRotation();
    };

    const processClick2 = (idx) => {
      state.idx2 = idx;
      killTimer2();
      timeRotation2();
    };

    const processClick3 = (idx) => {
      state.idx3 = idx;
      killTimer3();
      timeRotation3();
    };

    const timeRotation = () => {
      killTimer();
      state.timer = setTimeout(() => {
        state.idx = state.idx + 1;
        if (state.idx === state.pumpCnt1) 
          state.idx = 0;
        processClick(state.idx);
        timeRotation();
      }, 5000);
    };

    const killTimer = () => {
      if (state.timer) {
        clearTimeout(state.timer);
      }
    };

    const timeRotation2 = () => {
      killTimer2();
      state.timer2 = setTimeout(() => {
        state.idx2 = state.idx2 + 1;
        if (state.idx2 === state.pumpCnt2) 
          state.idx2 = 0;
        timeRotation2();
      }, 5000);
    };

    const killTimer2 = () => {
      if (state.timer2) {
        clearTimeout(state.timer2);
      }
    };

    const timeRotation3 = () => {
      killTimer3();
      state.timer3 = setTimeout(() => {
        state.idx3 = state.idx3 + 1;
        if (state.idx3 === state.pumpCnt3) 
          state.idx3 = 0;
        timeRotation3();
      }, 5000);
    };

    const killTimer3 = () => {
      if (state.timer3) {
        clearTimeout(state.timer3);
      }
    };

    onMounted(() => {
      timeRotation();
      timeRotation2();
      timeRotation3();
      store.dispatch('dashboard/motorAlarm');
      store.dispatch('dashboard/motorDataAll');
      store.dispatch('dashboard/pumpBearingAll');
    });

    watch(state.idx, () => {
      processClick(state.idx);
    });

    watch(state.idx2, () => {
      processClick2(state.idx2);
    });

    watch(state.idx3, () => {
      processClick3(state.idx3);
    });

    return {
      store,
      state,
      processClick,
      processClick2,
      processClick3,
      timeRotation,
      timeRotation2,
      timeRotation3,
      killTimer,
      killTimer2,
      killTimer3,
    };
  },
};
</script>

<style lang="scss" scoped>
.dashboard-info-container {
  background: url('../../assets/dashboard_info.png') no-repeat;
  width: 396px;
  height: 985px;
  position: absolute;
  top: 7px;
  left: 1503px;
  flex-flow: column;
  background-size: cover;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  .content-box {
    width: 100%;
    height: 58%;

    .titleBox {
      position: relative;
      margin: 10px;
      font-size: 18px;
      color: white;
      width: 200px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      .title {
        text-shadow: 0 0 9px #5cafff;
        z-index: 1;
      }
      img {
        position: absolute;
        z-index: 0;
        bottom: -5px;
      }
    }

    .contents {
      width: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 15px;

      .item-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item {
          padding: 15px;
          position: relative;
          width: 50%;
          z-index: 1;
          cursor: pointer;
          p {
            z-index: 1;
            color: white;
            width: 100%;
            text-align: center;
            text-shadow: 0 0 9px #5cafff;
          }

          img {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            height: 100%;
          }
        }

        .selected {
          p {
            color: #a9fcff;
            text-shadow: 0 0 9px #3cd8ff;
          }

          img {
            animation: select 1.5s infinite;
          }
        }

        @keyframes select {
          from {
            opacity: 1;
          }
          50% {
            opacity: 0.1;
          }
          to {
            opacity: 1;
          }
        }
      }
    }
    .contents2 {
      margin-top: 10px;
      width: 100%;
      padding: 10px 15px;
      display: flex;
      gap: 15px;
      flex: 1;

      .item-box {
        width: 50%;

        .listTitle {
          width: 100%;
          padding: 10px 0;
          border: solid 1px #b4dffa;
          box-shadow: 0 0 10px 0 rgb(172 207 255 / 70%);
          background: rgba(139, 194, 240, 0.4);
          color: white;
          text-align: center;
          font-size: 14px;
        }

        .list-elec-box {
          width: 100%;
          padding: 15px 0px;
          display: flex;
          flex-direction: column;
          gap: 10px;

          .elec-box {
            width: 100%;
            display: flex;
            // flex-direction: column;
            align-items: center;
            gap: 5px;

            .elec-conent {
              width: 15px;
              height: 15px;
              background: #b4dffa;
              box-shadow: 0 0 6px 0 #5cafff;
              border-radius: 15px;
              cursor: pointer;
              z-index: 1;
            }
            .title {
              width: 30%;
              color: #b4dffa;
              font-size: 12px;
              padding-right: 3px;
            }
            .elec-value {
              width: 70%;
              padding: 5px 3px;
              border: solid 1px #b4dffa;
              color: white;
              text-align: right;
              font-size: 12px;
              border-radius: 2px;
            }
            .elec-value.err {
              background: #ff5c5c66;
              border: solid 1px #ff5c5c;
            }

            .elecErr {
              background: #f76767;
              box-shadow: 0 0 6px 0 #ff5c5c;
              animation: err 2s infinite;
            }

            @keyframes err {
              from {
                box-shadow: 0 0 8px 0 #ff4747;
                background: #ff4747;
              }
              50% {
                box-shadow: 0 0 8px 0 #ff5c5c46;
                background: #f76767;
              }
              to {
                box-shadow: 0 0 8px 0 #ff4747;
                background: #ff4747;
              }
            }
          }
        }
      }
    }
  }
  .dashboard-line {
    width: 90%;
  }

  .box2 {
    height: 100%;
    display: flex;
    flex-direction: column;
    .titleBox {
      margin: 0 10px;
    }

    .content3 {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 15px;

      .list-box {
        width: 100%;
        display: flex;
        gap: 20px;
        align-items: center;
        padding: 15px;

        .itemList {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;

          .list-title {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1px 4px;

            span {
              z-index: 1;
              text-shadow: 0 0 9px #5cafff;
              color: white;
              font-size: 13px;
            }

            img {
              position: absolute;
              width: 100px;
              height: 25px;
              z-index: 0;
            }
          }

          .item-box {
            display: flex;
            gap: 7px;
            width: 100%;

            .item {
              // width: 50%;
              width: 29px;
              height: 22px;
              background: rgba(139, 194, 240, 0.25);
              border: 1px solid #b4dffa;
              padding: 5px 3px;
              // border-radius: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              z-index: 1;
              box-shadow: 0 0 10px 0 rgb(172 207 255 / 70%);
              background: rgba(139, 194, 240, 0.4);
              color: white;
              opacity: 0.4;
              font-size: 13px;
            }
            .item.selected {
              opacity: 1;
            }
            .item.alarm {
              background: #ff5c5c66;
              border: solid 1px #ff5c5c;
            }
          }
        }

        .list1 {
          width: 20%;
        }
        .list2 {
          width: 80%;
          gap: 7px !important;
        }
      }
      .motor-box {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        img {
          width: 60%;
        }
        .alert-ani {
          animation: alert-ani 1s infinite;
        }
        @keyframes alert-ani {
          from {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          to {
            opacity: 1;
          }
        }
        .motor-value-area {
          position: absolute;
          top: 0;
          left: 0;
          .group {
            position: absolute;
            font-size: 12px;
            color: #fff;
            .val-icon {
              position: absolute;
              width: 10px;
              height: 10px;
              border-radius: 10px;
              background: radial-gradient(
                  rgb(4, 0, 255),
                  rgb(84, 65, 255)
              );
              border: 1px solid #fff;
              box-shadow: 2px 2px 1px #000;
            }
            .val-icon.alert {
              background: radial-gradient(
                  rgb(255, 26, 26),
                  rgb(255, 105, 105)
              );
            }
            .val-1 {
              padding: 3px 0 2px;
              text-align: center;
              width: 70px;
              margin-bottom: 3px;
              border: solid 1px #b4dffa;
              color: white;
              border-radius: 2px;
            }
            .val-2 {
              padding: 3px 0 2px;
              text-align: center;
              width: 70px;
              border: solid 1px #b4dffa;
              color: white;
              border-radius: 2px;
            }
            .val-line {
              position: absolute;
              border: 1px dotted #fff;
            }
          }
          .group.type1 {
            top: 0px;
            left: 10px;
            .val-icon {
              top: 85px;
              left: 85px;
              background: #5470c6;
            }
            .val-line {
              top: 20px;
              left: 75px;
              width: 15px;
              height: 65px;
              border-left: none;
              border-bottom: none;
            }
          }
          .group.type2 {
            top: 130px;
            left: 10px;
            .val-icon {
              top: -55px;
              left: 190px;
              background: #91cc75;
            }
            .val-line {
              top: -50px;
              left: 75px;
              width: 120px;
              height: 75px;
              border-left: none;
              border-top: none;
            }
          }
          .group.type3 {
            top: 0px;
            left: 300px;
            .val-icon {
              top: 70px;
              left: -80px;
              background: #fac858;
            }
            .val-line {
              top: 20px;
              left: -75px;
              width: 70px;
              height: 55px;
              border-right: none;
              border-bottom: none;
            }
          }
          .group.type4 {
            top: 130px;
            left: 300px;
            .val-icon {
              top: -80px;
              left: 5px;
              background: #ee6666;
            }
            .val-line {
              top: -75px;
              left: 20px;
              width: 15px;
              height: 70px;
              border-left: none;
              border-bottom: none;
            }
          }
        }
      }
    }
  }
}
</style>
