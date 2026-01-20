<template>
  <!-- pipe -->
  <div class="bongdam">
    <div class="pipe_name fL">
      <span>{{name}}</span>
      <!-- <span class="input_value_rate" style="margin: 0;">{{ MinPipePressure == '' ? 0 : MinPipePressure }}</span> -->
    </div>

      <!-- pipe -->
    <div class="pipe_first_wrap fL">
      <div class="pipe_first_wrap2">
        유입 유량
        <div class="input_box fL"><span class="input_value" >{{ PipeValueIn }}</span>m3/h</div>
      </div>
      <div class="pipe_first fL"></div>
    </div>

    <div class="pipe_con fL">
      <!-- <div class="pipeline_un_y"></div> -->
    </div>

    <div class="pipe_center_wrap fL">
      <div class="pipe_center_top fL">
        <div v-if="F1" class="valve_on fL" ></div>
        <div v-else class="valve_off fl" ></div>
        <div class="input_box input_box_rate fL" ><span class="input_value_rate" >{{OpenRate1 == '' ? 0 : OpenRate1}}</span>%</div>
        <div class="pipe_line fL" >
            <div v-if="F1" class="pipe_line_arrow blinking" ></div>
        </div>
      </div>
      <div class="pipe_center_bottom fL" >
        <div v-if="F2" class="valve_on fL" ></div>
        <div v-else class="valve_off fl" ></div>
        <div class="input_box input_box_rate fL " ><span class="input_value_rate" >{{OpenRate2 == '' ? 0 : OpenRate2}}</span>%</div>
        <div class="pipe_line fL">
            <div v-if="F2" class="pipe_line_arrow blinking" ></div>
        </div>
      </div>
    </div>
    <!-- 11 -->
    <div class="pipe_last_wrap  fL">
      <div class="water_wrap" >
        <div class="input_box input_water_top fL" ><span class="input_value" >{{ WaterLevel }}</span>m</div>
        <div class="input_box input_water_bottom fL" ><span class="input_value" >{{ WaterLevel2 }}</span>m</div>
      </div>
    </div>

    <div class="pipe_last_wrap fL" style=" width: 20%;">
      <div class="pipe_last_wrap2" >
        유출유량
        <div class="input_box bm10 fL" ><span class="input_value" >{{ PipeValueOut }}</span> m3/h</div>
        <div class=" pipe_last fL">
          <div class="pipe_last_arrow blinking"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { comma } from '@/utils/utils.js'
export default {
  props: {
    name: String
  },
  setup (props) {
    const MinPipePressure = ref('')
    const PipeValueIn = ref('')
    const PipeValueOut = ref('')
    const WaterLevel = ref('')
    const WaterLevel2 = ref('')
    const OpenRate1 = ref('')
    const OpenRate2 = ref('')
    const F1 = ref('')
    const F2 = ref('')

    const updateData = (data) => {
      let FO = []
      let FC = []
      let openRate = [] // 개도율
      // for (let i = 0; i < data.length; i++) {
      // FO, FC 개도율에 따른 활성화 코드를 다시 짜야할 필요가 있다
      // 데이터 확인 후 밸브 활성화를 결정해야 한다
      if (data.FO) {
        FO = data.FO.split(',')
      }
      if (data.FC) {
        FC = data.FC.split(',')
      }
      if (data.개도율) {
        openRate = data.개도율 !== undefined ? data.개도율.split(',') : ['0', '0']
      }
      if (data.TNK_GRP_NM) {
        PipeValueIn.value = comma(Number(data.유입유량).toFixed(2))
        if (data.유출유량 !== null) {
          PipeValueOut.value = comma(Number(data.유출유량).toFixed(2))
        } else {
          PipeValueOut.value = ''
        }
        if (data.최소요구관압 !== null) {
          MinPipePressure.value = comma(Number(data.최소요구관압).toFixed(2))
        } else {
          MinPipePressure.value = ''
        }
        if (data.수위 !== null) {
          // // 745-617-LEI-8857_수위
          // const WaterId = data.LEI_TAG + '_수위'
          // const id = document.getElementById('745-617-LEI-8856_수위')
          // id.id = WaterId

          // if (id.id === WaterId) {
          //   WaterLevel.value = comma(Number(data.수위).toFixed(0))
          //   WaterLevel2.value = comma(Number(data.수위).toFixed(0))
          // }
          WaterLevel.value = comma(Number(data.수위).toFixed(0))
          WaterLevel2.value = comma(Number(data.수위).toFixed(0))
        } else {
          WaterLevel.value = ''
          WaterLevel2.value = ''
        }
        // FO, FC 개도율에 따른 활성화 코드를 다시 짜야할 필요가 있다.
        // if (i % 2 === 0) {
        //   OpenRate1.value = comma(Number(openRate[0]).toFixed(2))
        //   if ((FO[0] === '0.0' && FC[0] === '1.0') || (FO[0] === '0.0000' && FC[0] === '1.0000')) {
        //     F1.value = ''
        //   } else {
        //     F1.value = 'activate'
        //   }
        // } else {
        //   OpenRate2.value = comma(Number(openRate[1]).toFixed(2))
        //   if ((FO[1] === '0.0' && FC[1] === '1.0') || (FO[1] === '0.0000' && FC[1] === '1.0000')) {
        //     F2.value = ''
        //   } else {
        //     F2.value = 'activate'
        //   }
        // }
        // }
      }
    }
    onMounted(() => {
    })
    return {
      updateData,
      MinPipePressure,
      PipeValueIn,
      PipeValueOut,
      WaterLevel,
      WaterLevel2,
      OpenRate1,
      OpenRate2,
      F1,
      F2
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/layout.scss';
@import '~@/style/component/title.scss';
@import '~@/style/component/BtnAndText.scss';

//style="width: 25%;height: 100%; font-size: 16px;background: url(/img/r_circle.png) no-repeat;background-position: center;background-size: contain;display: flex;align-items: center;
//justify-content: center;
.analysis_container {
  width: calc(100% - 20px);
  height: calc(100% - 155px);
  padding: 10px;
  font-family: 'KHNPHDRegular';
  color: #fff;
  .container2 {
    width: 50%;
    height: 100%;
  }
}

.pump_1 {
  width: 25%;
  height: 100%;
  font-size: 16px;
  background: url('@/assets/img/r_circle.png') no-repeat;
  background-position: center;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pump_1_label {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pump_start {
  width: 30%;
  height: calc(100% - 40px);
  .pump_start_2 {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 20px;
    color: white;
  }
  .leftPumpMiddle {
    // height: calc(100% - 80px);
    height: 48%;
    width: calc(100% - 15px );
    margin-left: 15px;
  }
  .leftPumpBottom {
    height: 42%;
    width: calc(100% - 2px);
  }
  .item {
    width: 25%;
    height: 100%;
    font-size: 16px;
    background: url('@/assets/img/r_circle.png') no-repeat;
    background-position: center;
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.detail_textWrap {
  width: calc(100% - 11px);
  display: flex;
  align-items: center;
  margin: 25px 15px;
  font-size: 18px;
  font-family: 'KHNPHDRegular';
  color: #fff;
}

.pump_area_h4 {
  height: calc(100%/ 4 );
  width: calc(100% );
}
.pump_area_h35 {
  height: 39%;
  width: 100%;
}
.pump_img {
  background: url('@/assets/img/peakcontrol/pump_peakcontrol.png') no-repeat;
  background-size: 49%;
  background-position: center;
  text-align: left;
  text-indent: 5%;
  mix-blend-mode: color-dodge;
}

/** 벨브 시작 css */

.container_middle {
  width: calc(70% - 15px);
  height: calc(70% - 40px);
  margin: 12% 0 0 15px;
  color: #fff;
  font-family: 'KHNPHDRegular';
  font-size: 15px;
  img {
    width: 150px;
    height: 25px;
  }
  .bongdam {
    height: calc(100%/ 4);
    width: 100%;
    margin-bottom: 15px;
  }
  .pipe_name {
    width: 10%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('@/assets/img/r_circle.png') no-repeat;
    background-position:
    center;margin-right: 2%;
  }
  .input_value_rate {
      font-family: 'LAB디지털';
      margin-right: 5px;
      font-size: 15px;
      color: #fff;
  }
}

/** 벨프 이미지 */
.pipe_first_wrap{
  width: 20%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  .pipe_first_wrap2{
      width: 70%;
      margin-top: -24%;
  }
  .input_box {
    height: 25px;
    width: 100%;
    font-size: 11px;
    border-radius: 3px;
    border: 1px solid #489cf2;
    background-color: #15284e;
    color: #a4ceed;
    text-align: center;
    font-family: 'KHNPHDRegular';
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pipe_first {
    width: 30%;
    height: 25px;
    background: url("@/assets/img/analysis/pipeline_un.png") no-repeat;
    background-size: 100% 15px;
  }
}

.pipe_con {
  width: 5%;
  height: 77.5%;
  text-align: center;
  background: url('@/assets/img/analysis/pipeline_two.png') no-repeat;
  background-size: 105% 64%;
  background-position: bottom;
}

// 활성화 될때 안될때 css 처리를 다시 해줘야 합니다
.pipeline_un_y{
  width: 45%;
  height: 91%;
  background: url('@/assets/img/analysis/pipeline_un_y.png') no-repeat;
  margin-top: 314%;
  margin-left: 0%;

}

.pipe_center_wrap {
  height: 100%;
  width: 20%;
  margin-left: -1.5%;
  .pipe_center_top {
    width: 100%;
    height: 50%;
    text-align: center;
  }
  .input_box {
    height: 25px;
    width: 100%;
    font-size: 11px;
    border-radius: 3px;
    border: 1px solid #489cf2;
    background-color: #15284e;
    color: #a4ceed;
    text-align: center;
    font-family: 'KHNPHDRegular';
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input_box_rate {
    width: 40% !important;
    height: 25% !important;
    margin: 8px 0 0 -10%;
  }
  .pipe_line {
    width: 47%;
    height: 41%;
    text-align: center;
    background: url("@/assets/img/analysis/pipeline_un.png") no-repeat;
    background-size: 100% 15px;
    background-position: center;
    margin: 1.5% 0 0 -7%;
  }
  .pipe_line_arrow {
    background: url("@/assets/img/analysis/pipeline_arrow.png") no-repeat;
    width: 100%;
    height: 100%;
    mix-blend-mode: color-dodge;
    background-position: center;
  }
  .pipe_center_bottom {
    width: 100%;
    height: 50%;
    text-align: center;
    margin-top: -11%;
  }
}

.pipe_last_wrap {
  width: 15%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: flex-end;
  .input_box {
    height: 25px;
    width: 100%;
    font-size: 11px;
    border-radius: 3px;
    border: 1px solid #489cf2;
    background-color: #15284e;
    color: #a4ceed;
    text-align: center;
    font-family: 'KHNPHDRegular';
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input_water_top {
    width: 80% !important;
    margin-bottom: 10%;
    background-color: #15284e54 !important;
  }
  .input_water_bottom {
    width: 80% !important ;
    margin-bottom: 25%;
    background-color: #15284e54 !important;
  }
  .pipe_last_wrap2 {
    width: 87%; height: 70%;margin-left: -3%;
  }
  .pipe_last {
    width: 130%;
    margin: 0 0 0 -12%;
    height: 25px;
    background: url("@/assets/img/analysis/pipeline_un.png") no-repeat;
    background-size: 100% 15px;
  .pipe_last_arrow {
      background: url("@/assets/img/analysis/pipeline_arrow.png") no-repeat;
      width: 100%;
      height: 100%;
      mix-blend-mode: color-dodge;
      position: relative;
      left: 40px;
    }
  }
}
/* 벨브용 css */
.water_wrap {
  width: 100%;
  height: 100%;
  background: url("@/assets/img/analysis/watertank_big.png") no-repeat;
  background-size: contain;
  background-position: center;
  margin: 0 0 0 -16%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
/* 벨브 색상 */
.valve_on {
  width: 50%; height: 100%; text-align: center; background: url("@/assets/img/analysis/03_2_valve_active.png") no-repeat; background-position: center; background-size: 86%;
}
.valve_off {
  width: 50%; height: 100%; text-align: center; background: url("@/assets/img/analysis/03_2_valve_active.png") no-repeat; background-position: center; background-size: 86%;
}
.input_value{
  font-family: 'LAB디지털';margin-right: 5px;font-size: 18px;color: #fff;
}
.bm10{
  margin-bottom: 10%;
}

</style>
