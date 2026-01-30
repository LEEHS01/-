<template>
  <!-- pipe -->
  <div class="cheongso">
    <div class="fL" style="display: flex; flex-direction: column; width: 11%; height: 100%; justify-content: center; align-items: center; margin-right: 2%; ">
      <div class="pipe_name fL">
        <span>{{ name1}}</span>
        <!-- <span class="input_value_rate" style="margin: 0;">{{ dataList.minPipePressureCS }}</span> -->
      </div>
      <div class="pipe_name fL" style=" background-position: bottom; justify-content: end; padding-bottom: 20px;">
        <span>{{ name2 }}</span>
        <span class="input_value_rate" style="margin: 0;">{{ dataList.minPipePressureDC }}</span>
      </div>

    </div>

      <!-- pipe -->
    <div class="fL" style="height: 100%; width: 20%; display: flex; flex-direction: column;">
      <div class="pipe_first_wrap fL" style="margin-top: 30px;">
        <div class="pipe_first_wrap2">
          유입 유량
          <div class="input_box fL"><span class="input_value" >{{ dataList.pipeValueInCD1 }}</span>m3/h</div>
        </div>
        <div class="pipe_first fL"></div>
      </div>
      <div class="pipe_first_wrap fL" style="height: 30%;">
        <div class="pipe_first_wrap2">
          유입 유량
          <div class="input_box fL"><span class="input_value" >{{ dataList.pipeValueInCD2 }}</span>m3/h</div>
        </div>
        <div class="pipe_first fL"></div>
      </div>
      <div class="pipe_first_wrap fL" style="align-items: end">
        <div class="pipe_first_wrap2" style="height: 50%;">
          유입 유량
          <div class="input_box fL"><span class="input_value" >{{ dataList.pipeValueInDC }}</span>m3/h</div>
        </div>
        <div class="pipe_first fL" style="height: 35%;"></div>
      </div>
    </div>
    <div class="pipe_wrap fL">
        <div class="pipe_con fL">
          <!-- <div class="pipeline_un_y"></div> -->
        </div>
        <div class="pipe_first fL"></div>
        <div class="pipe_first fL" style="height: 40%; background-position-y: 79.5%;" ></div>
    </div>

    <div class="pipe_center_wrap fL" style="padding-top: 8px;">
      <div class="pipe_center_top fL" style="padding-top: 4px;">
        <div v-if="dataList.openRateCD1" class="valve_on fL"></div>
        <div v-else class="valve_off fL"></div>
        <div class="input_box input_box_rate fL" ><span class="input_value_rate" >{{dataList.openRateCD1}}</span>%</div>
        <div class="pipe_line fL" >
          <div v-if="dataList.openRateCD1" class="pipe_line_arrow blinking" ></div>
        </div>
      </div>
      <!-- <ValveComponent :openRate="OpenRates"/> -->
      <div class="pipe_center_top fL" style="padding-top: 1px;" >
        <div v-if="dataList.openRateCD2" class="valve_on fL"></div>
        <div v-else class="valve_off fL"></div>
        <div class="input_box input_box_rate fL" ><span class="input_value_rate" >{{dataList.openRateCD2}}</span>%</div>
        <div class="pipe_line fL" >
          <div v-if="dataList.openRateCD2" class="pipe_line_arrow blinking"></div>
        </div>
      </div>
      <!-- <div class="pipe_center_top fL" style="padding-bottom: 1px;">
        <div v-if="dataList.openRateCD1" class="valve_on fL"></div>
        <div v-else class="valve_off fL"></div>
        <div class="input_box input_box_rate fL" ><span class="input_value_rate" >{{dataList.openRateCD1}}</span>%</div>
        <div class="pipe_line fL" >
          <div v-if="dataList.openRateCD1" class="pipe_line_arrow blinking" ></div>
        </div>
      </div> -->
      <div class="pipe_center_top fL" style="padding-bottom: 50px; padding-top: 20px;">
        <div v-if="dataList.openRateCD3" class="valve_on fL"></div>
        <div v-else class="valve_off fL"></div>
        <div class="input_box input_box_rate fL" ><span class="input_value_rate" >{{dataList.openRateCD3}}</span>%</div>
        <div class="pipe_line fL" >
          <div v-if="dataList.openRateCD3" class="pipe_line_arrow blinking" ></div>
        </div>
      </div>
      <div class="pipe_center_top fL" style="padding-top: 42px; padding-bottom: 26px;">
        <div v-if="dataList.openRateDC0" class="valve_on fL"></div>
        <div v-else class="valve_off fL"></div>
        <div class="input_box input_box_rate fL" ><span class="input_value_rate" >{{dataList.openRateDC0}}</span>%</div>
        <div class="pipe_line fL" >
          <div v-if="dataList.openRateDC0" class="pipe_line_arrow blinking" ></div>
        </div>
      </div>
    </div>
    <!-- -->
    <div class="tank_wrap fL">
        <div class="pipe_last_wrap  fL">
          <div class="water_wrap" >
            <div class="input_box input_water_top fL" ><span class="input_value" >{{ dataList.waterLevelCD1 }}</span>m</div>
            <div class="input_box input_water_bottom fL" ><span class="input_value" >{{ dataList.waterLevelCD2 }}</span> m</div>
          </div>
        </div>
        <div class="pipe_last_wrap  fL">
          <div class="water_wrap" >
            <div class="input_box input_water_top fL" ><span class="input_value" >{{ dataList.waterLevelCD3 }}</span>m</div>
            <div style="height: 40px;"></div>
            <!-- <div class="input_box input_water_bottom fL" ><span class="input_value" >{{ dataList.waterLevelCD3 }}</span> m</div> -->
          </div>
        </div>
        <div class="pipe_last_wrap  fL" >
          <div class="water_wrap" style="background-size: 100% 85%;" >
            <div class="input_box input_water_top fL" style="margin-bottom: 40%;"><span class="input_value" >{{ dataList.waterLevelDC0 }}</span>m</div>
          </div>
        </div>
    </div>

    <div class="valve_out_wrap fL"  >
      <div class="valve_out_wrap2 fL" style="height: 30%; padding-top: 210px;">
        유출유량
        <div class="input_box bm10 fL" ><span class="input_value">{{ dataList.pipeValueOutCD }}</span> m3/h</div>
        <div class=" pipe_last fL">
          <div class="pipe_last_arrow blinking"></div>
        </div>
      </div>
      <div class="valve_out_wrap2 fL">
        유출유량
        <div class="input_box bm10 fL" ><span class="input_value">{{ dataList.pipeValueOutDC }}</span> m3/h</div>
        <div class=" pipe_last fL">
          <div class="pipe_last_arrow blinking"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
export default ({
  props: {
    name1: String,
    name2: String
  },
  setup (props) {
    const dataList = reactive({
    // 최소요구관압
      minPipePressureCS: 0.00,
      minPipePressureDC: 0.00,
      // 개도율
      openRateCD0: 0.00,
      openRateCD1: 0.00,
      openRateCD2: 0.00,
      openRateCD3: 0.00,
      openRateDC0: 0.00,

      // 수위
      waterLevelCD0: 0.00,
      waterLevelCD1: 0.00,
      waterLevelCD2: 0.00,
      waterLevelCD3: 0.00,
      waterLevelDC0: 0.00,

      // 유입유량
      pipeValueInCD1: 0.00,
      pipeValueInCD2: 0.00,
      pipeValueInDC: 0.00,
      // 유출유량,
      pipeValueOutCD: 0.00,
      pipeValueOutDC: 0.00
    })

    const fixed = (val) => {
      return Number(Number(val).toFixed(2))
    }
    const updateData = (data) => {
      // 대천 데이터 매칭
      dataList.pipeValueInDC = data[0].유입유량 !== null ? fixed(data[0].유입유량) : 0.00
      dataList.pipeValueOutDC = data[0].유출유량 !== null ? fixed(data[0].유출유량) : 0.00
      for (let i = 0; i < 1; i++) {
        dataList[`openRateDC${i}`] = data[i].개도율 !== null ? fixed(data[i].개도율) : 0.00
        dataList[`waterLevelDC${i}`] = data[i].수위 !== null ? fixed(data[i].수위) : 0.00
      }
      // 창동(배) 데이터 매칭
      dataList.pipeValueInCD1 = data[1].유입유량 !== null ? fixed(data[1].유입유량) : 0.00
      dataList.pipeValueInCD2 = data[2].유입유량 !== null ? fixed(data[2].유입유량) : 0.00
      dataList.pipeValueOutCD = data[1].유출유량 !== null ? fixed(data[1].유출유량) : 0.00
      for (let i = 1; i < data.length; i++) {
        dataList[`openRateCD${i}`] = data[i].개도율 !== null ? fixed(data[i].개도율) : 0.00
        dataList[`waterLevelCD${i}`] = data[i].수위 !== null ? fixed(data[i].수위) : 0.00
      }
    }
    onMounted(() => {
    })
    return {
      updateData,
      dataList
    }
  }
})
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
  .cheongso {
    height: 100%;
    width: 100%;
    margin-bottom: 10px;
  }
  .pipe_name {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('@/assets/img/r_circle.png') no-repeat;
    background-position: center;
    margin-right: 2%;
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
  width: 100%;
  height: 35%;
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

.pipe_first {
    width: 100%;
    height: 26.5%;
    background: url("@/assets/img/analysis/pipeline_un.png") no-repeat;
    background-size: 100% 15px;
    background-position-y:76%;
  }
.pipe_wrap{
  display: flex;
  flex-direction: column;
  width: 5%;
  height: 100%;
}
.pipe_con {
  width: 100%;
  height: 33%;
  text-align: center;
  background: url('@/assets/img/analysis/pipeline_two.png') no-repeat;
  background-size: 105% 64%;
  background-position: bottom;
}

// 활성화 될때 안될때 css 처리를 다시 해줘야 합니다
.pipeline_un_y{
  width: 33%;
  height: 60%;
  background: url('@/assets/img/analysis/pipeline_un_y.png') no-repeat;
  margin-top: 410%;
  margin-left: 0%;

}

.pipe_center_wrap {
  height: 100%;
  width: 20%;
  margin-left: -1.5%;
  display: flex;
  flex-direction: column;
  .pipe_center_top {
    width: 100%;
    height: 17%;
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
    margin: 12px 0 0 -5%;
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
.tank_wrap{
  display: flex;
  flex-direction: column;
  width: 15%;
  height: 100%;
}
.pipe_last_wrap {
  width: 100%;
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
}
.valve_out_wrap {
  width:20%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .input_box {
    height: 25px;
    width: 90%;
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
  .valve_out_wrap2 {
    width: 100%; height: 20%;margin-left: -3%;
  }
  .pipe_last {
    width: 120%;
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
  background-size: 100% 100%;
  background-position: center;
  margin: 0 0 0 -16%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
/* 벨브 색상 */
.valve_on {
  width: 50%; height: 100%; text-align: center; background: url("@/assets/img/analysis/03_2_valve_active.png") no-repeat; background-position: center; background-size: 110%; margin-left: 0%;
}
.valve_off {
  width: 50%; height: 100%; text-align: center; background: url("@/assets/img/analysis/03_2_valve_active.png") no-repeat; background-position: center; background-size: 110%; margin-left: 0%;
}
.input_value{
  font-family: 'LAB디지털';margin-right: 5px;font-size: 18px;color: #fff;
}
.bm10{
  margin-bottom: 10%;
}

</style>
