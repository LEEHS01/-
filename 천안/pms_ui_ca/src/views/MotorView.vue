<template>
    <div class="monitor-1">
        <div class="tab-btn"
            :class="{
                selected: store.state.monitor1.tabIndex === 1
            }"
            v-on:click="tab(1)">전동1</div>
        <div class="tab-btn two" 
            :class="{
                selected: store.state.monitor1.tabIndex === 2
            }"
            v-on:click="tab(2)">전동2</div>
        <div class="tab-btn three" 
            :class="{
                selected: store.state.monitor1.tabIndex === 3
            }"
            v-on:click="tab(3)">전동3</div>
        <!-- <div class="action-btn" v-on:click="select(4)">4</div>
        <div class="action-btn two" v-on:click="select(3)">3</div>
        <div class="action-btn three" v-on:click="select(2)">2</div>
        <div class="action-btn four" v-on:click="select(1)">1</div>
        <div class="action-btn reset" v-on:click="selectReset()">
            reset
        </div> -->
        <Header class="header" />
        <div class="content">
            <div v-show="store.state.monitor1.tabIndex === 1" class="content-left">
                <div class="content-panel">
                    <div v-for="index in 5" :key="index" class="pipe-line hori" :class="`line${index}`">
                        <div
                            v-for="i in 2"
                            :key="i"
                            class="water-icon2"
                            :class="{ none: !store.state.monitor1.modelList[index - 1].eq_on, delay2: i === 2 }"
                        ></div>
                    </div>
                    <div class="pipe-line ver line6">
                        <div v-for="index in 12" :key="index" :class="`water-icon delay${index}`"></div>
                    </div>
                    <div class="content-header">
                        <div class="header-left"></div>
                        <div class="header-center">전동1계통 송수펌프모터</div>
                        <div class="header-right"></div>
                    </div>
                    <div class="content-container two">
                        <div class="content-container-row" 
                            v-for="(motor, index) in store.state.monitor1.modelList.slice(0, 5)" 
                            :key="motor.id">
                            <div class="icon-area"
                                v-on:click="clickParam(motor.title, index + 1)"
                                :class="{ error: motor.alarm, none: !motor.eq_on }"
                            >
                                <Frame />
                                <div class="title-box">
                                    <img src="@/assets/circle.svg" alt="" />
                                    <p>{{ motor.title }}</p>
                                </div>
                                <img class="icon" src="@/assets/motor.png" />
                            </div>
                            <div class="chart-area">
                                <div class="alert-icon">
                                    <div class="state-area">
                                        <div class="alarm-icon" :class="{ error: motor.eq_on }">
                                            <img class="icon" src="@/assets/alarm.svg" />
                                        </div>
                                        <p>{{ motor.eq_on ? '동작중' : '' }}</p>
                                    </div>
                                    <div class="value-area">
                                        <div class="value-val hold">펌프임계값<br />7.1 mm/s</div>
                                        <div class="value-val hold yellow">모터임계값<br />4.5 mm/s</div>
                                    </div>
                                    <div class="value-area2">
                                        <div class="value-title">펌프 부하</div>
                                        <div class="value-val type1">{{ motor.pump_de_amp_val }} mm/s</div>
                                        <div class="value-title">펌프 반부하</div>
                                        <div class="value-val type2">{{ motor.pump_nde_amp_val }} mm/s</div>
                                        <div class="value-title">모터 부하</div>
                                        <div class="value-val type3">{{ motor.motor_de_amp_val }} mm/s</div>
                                        <div class="value-title">모터 반부하</div>
                                        <div class="value-val type4">{{ motor.motor_nde_amp_val }} mm/s</div>
                                    </div>
                                </div>
                                <div class="chart-con">
                                    <i class="pump-full-chart" @click="showPumpChart(index)"></i>
                                    <Frame />
                                    <Linechart
                                        name1="펌프 부하"
                                        name2="펌프 반부하"
                                        name3="모터 부하"
                                        name4="모터 반부하"
                                        :detailData1="motor.pump_de_amp"
                                        :detailData2="motor.pump_nde_amp"
                                        :detailData3="motor.motor_de_amp"
                                        :detailData4="motor.motor_nde_amp"
                                    />
                                </div>
                                <transition name="modal" appear v-show="pumpChart[index]">
                                  <div class="modal modal-overlay" @click.self="closePumpChart(index)">
                                    <div class="modal-window">
                                      <div class="modal-content">
                                        <div class="modal-header">
                                          <img src="@/assets/circle.svg" alt="" />
                                          <p>{{ motor.title }}</p>
                                          <button class="modal-close-button" @click="closePumpChart(index)">X</button>
                                        </div>
                                        <div class="chart-con" style="width: 1500px; height: 650px;">
                                          <Frame />
                                          <Linechart
                                            name1="펌프 부하"
                                            name2="펌프 반부하"
                                            name3="모터 부하"
                                            name4="모터 반부하"
                                            :detailData1="motor.pump_de_amp"
                                            :detailData2="motor.pump_nde_amp"
                                            :detailData3="motor.motor_de_amp"
                                            :detailData4="motor.motor_nde_amp"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="store.state.monitor1.tabIndex === 2" class="content-left2">
                <div class="content-panel">
                    <div v-for="index in 7" :key="index" class="pipe-line hori" :class="`line${index}`">
                        <div
                            v-for="i in 2"
                            :key="i"
                            class="water-icon2"
                            :class="{ none: !store.state.monitor1.modelList[index + 4].eq_on, delay2: i === 2 }"
                        ></div>
                    </div>
                    <div class="pipe-line ver line8">
                        <div v-for="index in 12" :key="index" :class="`water-icon delay${index}`"></div>
                    </div>
                    <div class="content-header">
                        <div class="header-left"></div>
                        <div class="header-center">전동2계통 송수펌프모터</div>
                        <div class="header-right"></div>
                    </div>
                    <div class="content-container two">
                        <div class="content-container-row" 
                            v-for="(motor, index) in store.state.monitor1.modelList.slice(5, 12)" 
                            :key="motor.id">
                            <div class="icon-area"
                                v-on:click="clickParam(motor.title, index + 6)"
                                :class="{ error: motor.alarm, none: !motor.eq_on }"
                            >
                                <Frame />
                                <div class="title-box">
                                    <img src="@/assets/circle.svg" alt="" />
                                    <p>{{ motor.title }}</p>
                                </div>
                                <img class="icon" src="@/assets/motor.png" />
                            </div>
                            <div class="chart-area">
                                <div class="alert-icon">
                                    <div class="state-area">
                                        <div class="alarm-icon" :class="{ error: motor.eq_on }">
                                            <img class="icon" src="@/assets/alarm.svg" />
                                        </div>
                                        <p>{{ motor.eq_on ? '동작중' : '' }}</p>
                                    </div>
                                    <div class="value-area">
                                        <div class="value-val hold">펌프임계값<br />7.1 mm/s</div>
                                        <div class="value-val hold yellow">모터임계값<br />4.5 mm/s</div>
                                    </div>
                                    <div class="value-area2">
                                        <div class="value-title">펌프 부하</div>
                                        <div class="value-val type1">{{ motor.pump_de_amp_val }} mm/s</div>
                                        <div class="value-title">펌프 반부하</div>
                                        <div class="value-val type2">{{ motor.pump_nde_amp_val }} mm/s</div>
                                        <div class="value-title">모터 부하</div>
                                        <div class="value-val type3">{{ motor.motor_de_amp_val }} mm/s</div>
                                        <div class="value-title">모터 반부하</div>
                                        <div class="value-val type4">{{ motor.motor_nde_amp_val }} mm/s</div>
                                    </div>
                                </div>
                                <div class="chart-con">
                                    <i class="pump-full-chart" @click="showPumpChart(index)"></i>
                                    <Frame />
                                    <Linechart
                                        name1="펌프 부하"
                                        name2="펌프 반부하"
                                        name3="모터 부하"
                                        name4="모터 반부하"
                                        :detailData1="motor.pump_de_amp"
                                        :detailData2="motor.pump_nde_amp"
                                        :detailData3="motor.motor_de_amp"
                                        :detailData4="motor.motor_nde_amp"
                                    />
                                </div>
                                <transition name="modal" appear v-show="pumpChart[index]">
                                  <div class="modal modal-overlay" @click.self="closePumpChart(index)">
                                    <div class="modal-window">
                                      <div class="modal-content">
                                        <div class="modal-header">
                                          <img src="@/assets/circle.svg" alt="" />
                                          <p>{{ motor.title }}</p>
                                          <button class="modal-close-button" @click="closePumpChart(index)">X</button>
                                        </div>
                                        <div class="chart-con" style="width: 1500px; height: 650px;">
                                          <Frame />
                                          <Linechart
                                            name1="펌프 부하"
                                            name2="펌프 반부하"
                                            name3="모터 부하"
                                            name4="모터 반부하"
                                            :detailData1="motor.pump_de_amp"
                                            :detailData2="motor.pump_nde_amp"
                                            :detailData3="motor.motor_de_amp"
                                            :detailData4="motor.motor_nde_amp"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="store.state.monitor1.tabIndex === 3" class="content-left2">
                <div class="content-panel">
                    <div v-for="index in 7" :key="index" class="pipe-line hori" :class="`line${index}`">
                        <div
                            v-for="i in 2"
                            :key="i"
                            class="water-icon2"
                            :class="{ none: !store.state.monitor1.modelList[index + 11].eq_on, delay2: i === 2 }"
                        ></div>
                    </div>
                    <div class="pipe-line ver line8">
                        <div v-for="index in 12" :key="index" :class="`water-icon delay${index}`"></div>
                    </div>
                    <div class="content-header">
                        <div class="header-left"></div>
                        <div class="header-center">전동3계통 송수펌프모터</div>
                        <div class="header-right"></div>
                    </div>
                    <div class="content-container two">
                        <div class="content-container-row" 
                            v-for="(motor, index) in store.state.monitor1.modelList.slice(12, 19)" 
                            :key="motor.id">
                            <div class="icon-area"
                                v-on:click="clickParam(motor.title, index + 13)"
                                :class="{ error: motor.alarm, none: !motor.eq_on }"
                            >
                                <Frame />
                                <div class="title-box">
                                    <img src="@/assets/circle.svg" alt="" />
                                    <p>{{ motor.title }}</p>
                                </div>
                                <img class="icon" src="@/assets/motor.png" />
                            </div>
                            <div class="chart-area">
                                <div class="alert-icon">
                                    <div class="state-area">
                                        <div class="alarm-icon" :class="{ error: motor.eq_on }">
                                            <img class="icon" src="@/assets/alarm.svg" />
                                        </div>
                                        <p>{{ motor.eq_on ? '동작중' : '' }}</p>
                                    </div>
                                    <div class="value-area">
                                        <div class="value-val hold">펌프임계값<br />7.1 mm/s</div>
                                        <div class="value-val hold yellow">모터임계값<br />4.5 mm/s</div>
                                    </div>
                                    <div class="value-area2">
                                        <div class="value-title">펌프 부하</div>
                                        <div class="value-val type1">{{ motor.pump_de_amp_val }} mm/s</div>
                                        <div class="value-title">펌프 반부하</div>
                                        <div class="value-val type2">{{ motor.pump_nde_amp_val }} mm/s</div>
                                        <div class="value-title">모터 부하</div>
                                        <div class="value-val type3">{{ motor.motor_de_amp_val }} mm/s</div>
                                        <div class="value-title">모터 반부하</div>
                                        <div class="value-val type4">{{ motor.motor_nde_amp_val }} mm/s</div>
                                    </div>
                                </div>
                                <div class="chart-con">
                                    <i class="pump-full-chart" @click="showPumpChart(index)"></i>
                                    <Frame />
                                    <Linechart
                                        name1="펌프 부하"
                                        name2="펌프 반부하"
                                        name3="모터 부하"
                                        name4="모터 반부하"
                                        :detailData1="motor.pump_de_amp"
                                        :detailData2="motor.pump_nde_amp"
                                        :detailData3="motor.motor_de_amp"
                                        :detailData4="motor.motor_nde_amp"
                                    />
                                </div>
                                <transition name="modal" appear v-show="pumpChart[index]">
                                  <div class="modal modal-overlay" @click.self="closePumpChart(index)">
                                    <div class="modal-window">
                                      <div class="modal-content">
                                        <div class="modal-header">
                                          <img src="@/assets/circle.svg" alt="" />
                                          <p>{{ motor.title }}</p>
                                          <button class="modal-close-button" @click="closePumpChart(index)">X</button>
                                        </div>
                                        <div class="chart-con" style="width: 1500px; height: 650px;">
                                          <Frame />
                                          <Linechart
                                            name1="펌프 부하"
                                            name2="펌프 반부하"
                                            name3="모터 부하"
                                            name4="모터 반부하"
                                            :detailData1="motor.pump_de_amp"
                                            :detailData2="motor.pump_nde_amp"
                                            :detailData3="motor.motor_de_amp"
                                            :detailData4="motor.motor_nde_amp"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="content-right">
                <div class="content-panel">
                    <img src="@/assets/light.png" alt="" class="light-circle" />
                    <img src="@/assets/light2.png" alt="" class="light-line" />
                    <div class="content-header">
                        <img
                            src="@/assets/titleicon.svg"
                            alt=""
                            class="titleCon"
                        />
                        <p>전동1계통 운영현황</p>
                    </div>
                    <div class="content-container">
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    운영대수
                                </div>
                                <div class="value">
                                    {{ store.state.monitor1.scada_01.running }}
                                    대
                                </div>
                            </div>
                        </div>
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    유량
                                </div>
                                <div class="value">
                                    {{
                                        store.state.monitor1.scada_01
                                            .flow_rate_val
                                    }}㎥/min
                                </div>
                            </div>
                        </div>
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    압력
                                </div>
                                <div class="value">
                                    {{
                                        store.state.monitor1.scada_01
                                            .pressure_val
                                    }}kgf/㎥
                                </div>
                            </div>
                        </div>
                        <div class="value-chart">
                            <div class="label">
                                ▸ 분포도
                                <i class="distribution-full-chart" @click="showDistributionChart(0)"></i>
                            </div>
                            <div class="value">
                                <Scatter
                                    :data="store.state.monitor1.scada_01.data"
                                    :color="
                                        store.state.monitor1.scada_01.running
                                    "
                                />
                            </div>
                            <transition name="modal" appear v-show="distributionChart[0]">
                              <div class="modal modal-overlay" @click.self="closeDistributionChart(0)">
                                <div class="modal-window">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <img src="@/assets/circle.svg" alt="" />
                                      <p>분포도 ( 전동1계통 )</p>
                                      <button class="modal-close-button" @click="closeDistributionChart(0)">X</button>
                                    </div>
                                    <div class="value" style="width: 1000px; height: 600px;">
                                      <Scatter
                                        :data="store.state.monitor1.scada_01.data"
                                        :color="
                                            store.state.monitor1.scada_01.running
                                        "
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </transition>
                        </div>
                    </div>
                </div>
                <div class="content-panel">
                    <img src="@/assets/light.png" alt="" class="light-circle" />
                    <img src="@/assets/light2.png" alt="" class="light-line" />
                    <div class="content-header">
                        <img
                            src="@/assets/titleicon.svg"
                            alt=""
                            class="titleCon"
                        />
                        <p>전동2계통 운영현황</p>
                    </div>
                    <div class="content-container">
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    운영대수
                                </div>
                                <div class="value">
                                    {{
                                        store.state.monitor1.scada_05.running
                                    }}대
                                </div>
                            </div>
                        </div>
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    유량
                                </div>
                                <div class="value">
                                    {{
                                        store.state.monitor1.scada_05
                                            .flow_rate_val
                                    }}㎥/min
                                </div>
                            </div>
                        </div>
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    압력
                                </div>
                                <div class="value">
                                    {{
                                        store.state.monitor1.scada_05
                                            .pressure_val
                                    }}kgf/㎥
                                </div>
                            </div>
                        </div>
                        <div class="value-chart">
                            <div class="label">
                                ▸ 분포도
                                <i class="distribution-full-chart" @click="showDistributionChart(1)"></i>
                            </div>
                            <div class="value">
                                <Scatter2
                                    :data="store.state.monitor1.scada_05.data"
                                    :color="
                                        store.state.monitor1.scada_05.running
                                    "
                                />
                            </div>
                            <transition name="modal" appear v-show="distributionChart[1]">
                              <div class="modal modal-overlay" @click.self="closeDistributionChart(1)">
                                <div class="modal-window">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <img src="@/assets/circle.svg" alt="" />
                                      <p>분포도 ( 전동2계통 )</p>
                                      <button class="modal-close-button" @click="closeDistributionChart(1)">X</button>
                                    </div>
                                    <div class="value" style="width: 1000px; height: 600px;">
                                      <Scatter2
                                        :data="store.state.monitor1.scada_05.data"
                                        :color="
                                            store.state.monitor1.scada_05.running
                                        "
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </transition>
                        </div>
                    </div>
                </div>
                <div class="content-panel">
                    <img src="@/assets/light.png" alt="" class="light-circle" />
                    <img src="@/assets/light2.png" alt="" class="light-line" />
                    <div class="content-header">
                        <img
                            src="@/assets/titleicon.svg"
                            alt=""
                            class="titleCon"
                        />
                        <p>전동3계통 운영현황</p>
                    </div>
                    <div class="content-container">
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    운영대수
                                </div>
                                <div class="value">
                                    {{
                                        store.state.monitor1.scada_05.running
                                    }}대
                                </div>
                            </div>
                        </div>
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    유량
                                </div>
                                <div class="value">
                                    {{
                                        store.state.monitor1.scada_05
                                            .flow_rate_val
                                    }}㎥/min
                                </div>
                            </div>
                        </div>
                        <div class="value-data">
                            <div class="value-item">
                                <div class="label">
                                    압력
                                </div>
                                <div class="value">
                                    {{
                                        store.state.monitor1.scada_05
                                            .pressure_val
                                    }}kgf/㎥
                                </div>
                            </div>
                        </div>
                        <div class="value-chart">
                            <div class="label">
                                ▸ 분포도
                                <i class="distribution-full-chart" @click="showDistributionChart(2)"></i>
                            </div>
                            <div class="value">
                                <Scatter2
                                    :data="store.state.monitor1.scada_05.data"
                                    :color="
                                        store.state.monitor1.scada_05.running
                                    "
                                />
                            </div>
                            <transition name="modal" appear v-show="distributionChart[2]">
                              <div class="modal modal-overlay" @click.self="closeDistributionChart(2)">
                                <div class="modal-window">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <img src="@/assets/circle.svg" alt="" />
                                      <p>분포도 ( 전동3계통 )</p>
                                      <button class="modal-close-button" @click="closeDistributionChart(2)">X</button>
                                    </div>
                                    <div class="value" style="width: 1000px; height: 600px;">
                                      <Scatter2
                                        :data="store.state.monitor1.scada_05.data"
                                        :color="
                                            store.state.monitor1.scada_05.running
                                        "
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Header from '@/components/menu/Header.vue';
import Frame from '@/components/component/BoxFrame.vue';
// import Linechart2 from '@/components/chart/monitoring/Linechart2.vue';
import Linechart from '@/components/chart/monitoring/Linechart_1.vue';
// import Linechart from '@/components/chart/monitoring/Linechart_d4.vue';
import { onMounted, reactive } from 'vue';
import moment from 'moment';
// import axios from 'axios';
// import Scatter from '@/components/chart/monitoring/Scatter_PTK.vue';
// import Scatter2 from '@/components/chart/monitoring/Scatter_SSN.vue';
export default {
    components: {
        Header,
        Frame,
        Linechart,
        // Scatter,
        // Scatter2,
        // Linechart2,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        // const route = useRoute();
        const visibleToggle = () => {
            store.state.alertVisible = !store.state.alertVisible;
        };

        const clickParam = (value, idx) => {
            store.state.monitor1.selectModel = value;
            store.state.monitor1.id = 'motor_' + idx.toString().padStart(2, '0');
            store.state.monitor1.scada_id = 'pump_scada_' + idx.toString().padStart(2, '0');
            store.state.monitor1.modelList.map((x) => (x.select = false));
            store.state.monitor1.modelList.filter((x) => {
                if (x.id === store.state.monitor1.id) {
                    x.select = true;
                    // gelix_lsj 모터 선택 시 alert-motor 이미지 표시되도록 수정
                    store.state.monitor1.sampleData.idx = x.idx;
                    return;
                }
            });
            if (idx < 6) {  // gelix_lsj 1~5 전동1계통
              store.state.monitor1.tabIndex = 1
              store.state.monitor1.centerId = '전동1(가)'
            } else if (idx < 13) {  // gelix_lsj 6~12 전동2계통
              store.state.monitor1.tabIndex = 2
              store.state.monitor1.centerId = '전동2(가)'
            } else {  // gelix_lsj 13~20 전동3계통
              store.state.monitor1.tabIndex = 3
              store.state.monitor1.centerId = '전동3(가)'
            }
            router.push('MotorMonitoring');
        };

        onMounted(() => {
            let isLocal = false;
            if (!isLocal) {
                store.state.monitor1.tabIndex = 1 // gelix_lsj
                let currentTime = new Date();
                // let currentTime = new Date('2023-03-14 00:00:00');
                let startDate = moment(
                    currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
                ).format('yyyy-MM-DD HH:mm:ss');
                let endDate = moment(currentTime.getTime()).format(
                    'yyyy-MM-DD HH:mm:ss'
                );
                store.state.monitor1.startDate = startDate;
                store.state.monitor1.endDate = endDate;
            }
            store.dispatch('monitor1/runningInfo');
            store.dispatch('monitor1/alarm');
            store.dispatch('monitor1/handleGraphData');
            // store.dispatch('monitor1/flowPressure');
            // store.dispatch('monitor1/distribution');
        });

        const select = (idx) => {
            let val = idx - 1;
            store.state.monitor1.sampleData.idx = val;
            store.state.monitor1.modelList[val].alarm = true;
            store.state.monitor1.modelList[
                val
            ].motor_de_amp = store.state.monitor1.modelList[
                idx - 1
            ].motor_de_amp.concat(
                store.state.monitor1.sampleData.motor_de_rms_amp
            );
            store.state.monitor1.modelList[
                val
            ].motor_nde_amp = store.state.monitor1.modelList[
                val
            ].motor_nde_amp.concat(
                store.state.monitor1.sampleData.motor_nde_rms_amp
            );
            store.state.monitor1.modelList[
                val
            ].pump_de_amp = store.state.monitor1.modelList[
                val
            ].pump_de_amp.concat(
                store.state.monitor1.sampleData.pump_de_rms_amp
            );
            store.state.monitor1.modelList[
                val
            ].pump_nde_amp = store.state.monitor1.modelList[
                val
            ].pump_nde_amp.concat(
                store.state.monitor1.sampleData.pump_nde_rms_amp
            );
            store.state.monitor1.mode = true;

            // axios.get('http://10.15.32.150:35000/siyeon?songsu=' + idx);
        };
        const selectReset = () => {
            store.state.monitor1.mode = false;
            // console.log('reset');
            // axios.get('http://10.15.32.150:35000/reset');
            window.location.reload(true);
        };

        // gelix_lsj tab 선택
        const tab = (idx) => {
          store.state.monitor1.tabIndex = idx
        };

        // gelix_lsj 펌프 차트 확대
        const pumpChart = reactive([false, false, false, false, false, false, false])
        const showPumpChart = (idx) => {
          pumpChart[idx] = true
        }
        
        const closePumpChart = (idx) => {
          pumpChart[idx] = false
        }

        // gelix_lsj 분포도 차트 확대
        const distributionChart = reactive([false, false, false])
        const showDistributionChart = (idx) => {
          distributionChart[idx] = true
        }
        
        const closeDistributionChart = (idx) => {
          distributionChart[idx] = false
        }

        return {
            clickParam,
            visibleToggle,
            select,
            selectReset,
            tab,
            showPumpChart,
            closePumpChart,
            showDistributionChart,
            closeDistributionChart,
            store,
            pumpChart,
            distributionChart,
        };
    },
};
</script>

<style></style>
