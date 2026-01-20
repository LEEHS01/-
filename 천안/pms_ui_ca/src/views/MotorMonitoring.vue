<template>
    <div class="monitoring">
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
        <Header class="header" />

        <div class="content">
            <!-- 펌프현황 -->
            <div class="section s-top">
                <div class="inSection s-left">
                    <div 
                        class="chart-box" 
                    >
                        <i class="full-chart" @click="showChart(0)"></i>
                        <Frame />
                        <Linechart21 
                            title="펌프-부하/반부하 총진동량" 
                            name1="펌프 부하 총진동량" 
                            name2="펌프 반부하 총진동량" 
                            :detailData1="
                                    store.state.monitor1.detailData.pump_de_rms_amp
                                " 
                            :detailData2="
                                    store.state.monitor1.detailData.pump_nde_rms_amp
                                " 
                        />
                    </div>
                    <transition name="modal" appear v-show="chart[0]">
                        <div class="modal modal-overlay" @click.self="closeChart(0)">
                            <div class="modal-window">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="modal-close-button" @click="closeChart(0)">X</button>
                                    </div>
                                    <div class="chart-box" style="width: 1500px; height: 650px;">
                                        <Frame />
                                        <Linechart21 
                                            title="펌프-부하/반부하 총진동량" 
                                            name1="펌프 부하 총진동량" 
                                            name2="펌프 반부하 총진동량" 
                                            :detailData1="
                                                store.state.monitor1.detailData.pump_de_rms_amp
                                            " 
                                            :detailData2="
                                                store.state.monitor1.detailData.pump_nde_rms_amp
                                            " 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="chart-box" 
                        :class="{
                            warning: store.state.monitor1.detailData.p_bearing_alarm == 1 || store.state.monitor1.detailData.p_ban_bearing_alarm == 1, 
                            error: store.state.monitor1.detailData.p_bearing_alarm == 2 || store.state.monitor1.detailData.p_ban_bearing_alarm == 2
                        }"
                    >
                        <i class="full-chart" @click="showChart(1)"></i>
                        <Frame />
                        <Linechart2 
                            title="펌프-부하/반부하 베어링 결함" 
                            name1="펌프 부하 베어링" 
                            name2="펌프 반부하 베어링" 
                            :detailData1="
                                    store.state.monitor1.detailData.pump_de_amp
                                " 
                                :detailData2="
                                    store.state.monitor1.detailData.pump_nde_amp
                                " 
                            />
                    </div>
                    <transition name="modal" appear v-show="chart[1]">
                        <div class="modal modal-overlay" @click.self="closeChart(1)">
                            <div class="modal-window">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="modal-close-button" @click="closeChart(1)">X</button>
                                    </div>
                                    <div class="chart-box" style="width: 1500px; height: 650px;">
                                        <Frame />
                                        <Linechart2 
                                            title="펌프-부하/반부하 베어링 결함" 
                                            name1="펌프 부하 베어링" 
                                            name2="펌프 반부하 베어링" 
                                            :detailData1="
                                            store.state.monitor1.detailData.pump_de_amp
                                            " 
                                            :detailData2="
                                            store.state.monitor1.detailData.pump_nde_amp
                                            " 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="chart-box" :class="{error: store.state.monitor1.detailData.vane_alarm}">
                            <i class="full-chart" @click="showChart(2)"></i>
                        <Frame />
                        <Linechart 
                            title="펌프-임펠러 결함" 
                            name1="펌프 임펠러" 
                            maxLine="0.03"
                            minLine="0"
                            :detailData="
                                store.state.monitor1.detailData
                                        .pump_impeller_amp
                            " 

                        />
                    </div>
                    <transition name="modal" appear v-show="chart[2]">
                        <div class="modal modal-overlay" @click.self="closeChart(2)">
                            <div class="modal-window">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="modal-close-button" @click="closeChart(2)">X</button>
                                    </div>
                                    <div class="chart-box" style="width: 1500px; height: 650px;">
                                        <Frame />
                                        <Linechart 
                                            title="펌프-임펠러 결함" 
                                            name1="펌프 임펠러" 
                                            maxLine="0.03"
                                            minLine="0"
                                            :detailData="
                                                store.state.monitor1.detailData
                                                    .pump_impeller_amp
                                            " 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="chart-box" :class="{error: store.state.monitor1.detailData.cavitation_alarm}">
                        <i class="full-chart" @click="showChart(3)"></i>
                        <Frame />
                        <Linechart 
                            title="펌프-케비테이션 발생" 
                            name1="펌프 케비테이션" 
                            maxLine="0.8"
                            minLine="0"
                            :detailData="
                                store.state.monitor1.detailData
                                    .pump_cavatation_amp
                            " 
                        />
                    </div>
                    <transition name="modal" appear v-show="chart[3]">
                        <div class="modal modal-overlay" @click.self="closeChart(3)">
                            <div class="modal-window">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="modal-close-button" @click="closeChart(3)">X</button>
                                    </div>
                                    <div class="chart-box" style="width: 1500px; height: 650px;">
                                        <Frame />
                                        <Linechart 
                                            title="펌프-케비테이션 발생" 
                                            name1="펌프 케비테이션" 
                                            maxLine="0.8"
                                            minLine="0"
                                            :detailData="
                                                store.state.monitor1.detailData
                                                    .pump_cavatation_amp
                                            " 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
                <div class="inSection s-center">
                    <!-- <div class="action-btn reset" v-on:click="selectReset()">
                        reset
                    </div> -->
                    <div class="chart-box">
                        <div class="titlebox">
                            <img 
                                src="@/assets/monitor-centerTitle.svg" 
                                alt="" 
                            />
                            <!-- <p>{{ TITLE.name }}</p> -->
                            <p>
                                {{ setTitle(store.state.monitor1.selectModel) }}
                            </p>
                        </div>
                        <img src="@/assets/light2.png" alt="" class="light" />
                        <BoxFrame />
    
                        <div class="motors">
                            <!-- <div
                                    class="motor-alert-status"
                                    :class="{
                                        error:  store.state.monitor1.modelList,
                                    }"
                                >
                                    정상
                                </div> -->
                            <div class="main-motor">
                                <img 
                                    v-if="
                                        store.state.monitor1.detailData.m_bearing_alarm > 0 || 
                                        store.state.monitor1.detailData.p_bearing_alarm > 0 || 
                                        store.state.monitor1.detailData.m_ban_bearing_alarm > 0 || 
                                        store.state.monitor1.detailData.p_ban_bearing_alarm > 0 || 
                                        store.state.monitor1.detailData.cavitation_alarm > 0 || 
                                        store.state.monitor1.detailData.misaligment_alarm > 0 || 
                                        store.state.monitor1.detailData.rotorbar_alarm > 0 || 
                                        store.state.monitor1.detailData.unbalance_alarm > 0 || 
                                        store.state.monitor1.detailData.vane_alarm > 0
                                        " 
                                        src="@/assets/motor_alert.png" 
                                        alt="" 
                                    />
                                <img v-else src="@/assets/motor.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.cavitation_alarm > 0" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/alert2.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.misaligment_alarm > 0" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/motor-alert.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.rotorbar_alarm > 0" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/alert3.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.unbalance_alarm > 0" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/alert4.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.vane_alarm > 0" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/alert1.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.m_bearing_alarm > 0" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/alert7.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.p_bearing_alarm" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/alert6.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.m_ban_bearing_alarm > 0" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/alert8.png" alt="" />
                            </div>
                            <div 
                                v-if="store.state.monitor1.detailData.p_ban_bearing_alarm" 
                                    class="alert-motor"
                            >
                                <img src="@/assets/alert5.png" alt="" />
                            </div>
                           <div class="select-motor">
                                <div v-show="store.state.monitor1.tabIndex === 1"
                                    class="motor-box"
                                    v-for="(motor, index) 
                                    in store.state.monitor1.modelList.slice(0, 5)" 
                                    :key="motor.id"
                                    @click="selectedMotor(motor.id)"
                                    style="width: calc(100% / 5)"
                                >
                                    <div
                                        class="motor-img"
                                        :class="{
                                            selected: motor.select,
                                            error: motor.alarm,
                                        }"
                                    >
                                        <div
                                            class="action-btn"
                                            v-on:click="select(motor.idx + 1)"
                                            :style="
                                                motor.visible
                                                    ? { visibility: 'visible' }
                                                    : {}
                                            "
                                        >
                                            {{ index + 1 }}
                                        </div>
                                        <img src="@/assets/motor.png" alt="" />
                                    </div>
                                    <div
                                        class="motor-name"
                                        :class="{ selectName: motor.select }"
                                    >
                                        {{ setTitle(motor.title) }}
                                    </div>
                                </div>
                                <div v-show="store.state.monitor1.tabIndex === 2"
                                    class="motor-box"
                                    v-for="(motor, index) 
                                    in store.state.monitor1.modelList.slice(5, 12)" 
                                    :key="motor.id"
                                    @click="selectedMotor(motor.id)"
                                >
                                    <div 
                                        class="motor-img" 
                                        :class="{
                                                selected: motor.select,
                                                error: motor.alarm,
                                            }"
                                    >
                                        <div 
                                            class="action-btn" 
                                            v-on:click="select(motor.idx + 1)" 
                                            :style="
                                                    motor.visible
                                                        ? { visibility: 'visible' }
                                                        : {}
                                                "
                                        >
                                            {{ index + 1 }}
                                        </div>
                                        <img src="@/assets/motor.png" alt="" />
                                    </div>
                                    <div
                                        class="motor-name"
                                        :class="{ selectName: motor.select }"
                                    >
                                        {{ setTitle(motor.title) }}
                                    </div>
                                </div>
                                <div v-show="store.state.monitor1.tabIndex === 3"
                                    class="motor-box"
                                    v-for="(motor, index) 
                                    in store.state.monitor1.modelList.slice(12, 20)" 
                                    :key="motor.id"
                                    @click="selectedMotor(motor.id)"
                                >
                                    <div
                                        class="motor-img"
                                        :class="{
                                            selected: motor.select,
                                            error: motor.alarm,
                                        }"
                                    >
                                        <div
                                            class="action-btn"
                                            v-on:click="select(motor.idx + 1)"
                                            :style="
                                                motor.visible
                                                    ? { visibility: 'visible' }
                                                    : {}
                                            "
                                        >
                                            {{ index + 1 }}
                                        </div>
                                        <img src="@/assets/motor.png" alt="" />
                                    </div>
                                    <div 
                                        class="motor-name" 
                                        :class="{ selectName: motor.select }"
                                    >
                                        {{ setTitle(motor.title) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inSection s-right">
                    <div class="chart-box">
                        <i class="full-chart" @click="showChart(4)"></i>
                        <Frame />
                        <Linechart22 
                            title="모터-부하/반부하 총진동량" 
                            name1="모터 부하 총진동량" 
                            name2="모터 반부하 총진동량" 
                            :detailData1="
                                    store.state.monitor1.detailData.motor_de_rms_amp
                            " 
                            :detailData2="
                                    store.state.monitor1.detailData
                                        .motor_nde_rms_amp
                            "
                        />
                    </div>
                    <transition name="modal" appear v-show="chart[4]">
                        <div class="modal modal-overlay" @click.self="closeChart(4)">
                            <div class="modal-window">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="modal-close-button" @click="closeChart(4)">X</button>
                                    </div>
                                    <div class="chart-box" style="width: 1500px; height: 650px;">
                                        <Frame />
                                        <Linechart22 
                                            title="모터-부하/반부하 총진동량" 
                                            name1="모터 부하 총진동량" 
                                            name2="모터 반부하 총진동량" 
                                            :detailData1="
                                            store.state.monitor1.detailData.motor_de_rms_amp
                                            " 
                                            :detailData2="
                                            store.state.monitor1.detailData.motor_nde_rms_amp
                                            " 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="chart-box" 
                        :class="{
                            warning: store.state.monitor1.detailData.m_bearing_alarm == 1 || store.state.monitor1.detailData.m_ban_bearing_alarm == 1, 
                            error: store.state.monitor1.detailData.m_bearing_alarm == 2 || store.state.monitor1.detailData.m_ban_bearing_alarm == 2
                        }"
                    >
                        <i class="full-chart" @click="showChart(5)"></i>
                        <Frame />
                        <Linechart2 
                            title="모터-부하/반부하 베어링 결함" 
                            name1="모터 부하 베어링" 
                            name2="모터 반부하 베어링" 
                            :detailData1="
                                    store.state.monitor1.detailData.motor_de_amp
                            " 
                            :detailData2="
                                    store.state.monitor1.detailData.motor_nde_amp
                            " 
                        />
                    </div>
                    <transition name="modal" appear v-show="chart[5]">
                        <div class="modal modal-overlay" @click.self="closeChart(5)">
                            <div class="modal-window">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="modal-close-button" @click="closeChart(5)">X</button>
                                    </div>
                                    <div class="chart-box" style="width: 1500px; height: 650px;">
                                        <Frame />
                                        <Linechart2 
                                            title="모터-부하/반부하 베어링 결함" 
                                            name1="모터 부하 베어링" 
                                            name2="모터 반부하 베어링" 
                                            :detailData1="
                                            store.state.monitor1.detailData.motor_de_amp
                                            " 
                                            :detailData2="
                                            store.state.monitor1.detailData.motor_nde_amp
                                            " 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="chart-box" :class="{error: store.state.monitor1.detailData.rotorbar_alarm}">
                        <i class="full-chart" @click="showChart(6)"></i>
                        <Frame />
                        <Linechart 
                            title="모터-회전자 결함" 
                            name1="모터 회전자" 
                            maxLine="0.5"
                            minLine="0"
                            :detailData="
                                    store.state.monitor1.detailData.motor_rotor_amp
                            " 
                        />
                    </div>
                    <transition name="modal" appear v-show="chart[6]">
                        <div class="modal modal-overlay" @click.self="closeChart(6)">
                            <div class="modal-window">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="modal-close-button" @click="closeChart(6)">X</button>
                                    </div>
                                    <div class="chart-box" style="width: 1500px; height: 650px;">
                                        <Frame />
                                        <Linechart 
                                            title="모터-회전자 결함" 
                                            name1="모터 회전자" 
                                            maxLine="0.5"
                                            minLine="0"
                                            :detailData="
                                            store.state.monitor1.detailData.motor_rotor_amp
                                            " 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="chart-box">
                        <i class="full-chart" @click="showChart(7)"></i>
                        <Frame />
                        <Linechart3 
                            title="모터-권선온도" 
                            name1="R" 
                            name2="T" 
                            name3="S" 
                            :detailData1="
                                    store.state.monitor1.detailData.winding_tempR
                            " 
                            :detailData2="
                                    store.state.monitor1.detailData.winding_tempT
                            " 
                            :detailData3="
                                    store.state.monitor1.detailData.winding_tempS
                            " 
                        />
                    </div>
                    <transition name="modal" appear v-show="chart[7]">
                        <div class="modal modal-overlay" @click.self="closeChart(7)">
                            <div class="modal-window">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="modal-close-button" @click="closeChart(7)">X</button>
                                    </div>
                                    <div class="chart-box" style="width: 1500px; height: 650px;">
                                        <Frame />
                                        <Linechart3 
                                            title="모터-권선온도" 
                                            name1="R" 
                                            name2="T" 
                                            name3="S" 
                                            :detailData1="
                                            store.state.monitor1.detailData.winding_tempR
                                            " 
                                            :detailData2="
                                            store.state.monitor1.detailData.winding_tempT
                                            " 
                                            :detailData3="
                                            store.state.monitor1.detailData.winding_tempS
                                            " 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <!-- 알람현황 -->
            <div class="section s-bottom">
                <div 
                    class="chart-box left" 
                    :class="{
                        warning: store.state.monitor1.detailData.misaligment_alarm == 1,
                        error: store.state.monitor1.detailData.misaligment_alarm == 2
                    }"
                >
                    <i class="full-chart" @click="showChart(8)"></i>
                    <Frame />
                    <Linechart 
                        title="펌프모터-축정렬 불량" 
                        name1="펌프모터 축정렬" 
                        maxLine="1.7"
                        minLine="1"
                        :detailData="
                                store.state.monitor1.detailData
                                    .motor_misalignment_amp
                        " 
                    />
                </div>
                <transition name="modal" appear v-show="chart[8]">
                    <div class="modal modal-overlay" @click.self="closeChart(8)">
                        <div class="modal-window">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="modal-close-button" @click="closeChart(8)">X</button>
                                </div>
                                <div class="chart-box" style="width: 1500px; height: 650px;">
                                    <Frame />
                                    <Linechart 
                                        title="펌프모터-축정렬 불량"
                                        name1="펌프모터 축정렬" 
                                        maxLine="1.7"
                                        minLine="1"
                                        :detailData="
                                            store.state.monitor1.detailData
                                                .motor_misalignment_amp
                                        " 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
                <div 
                    class="chart-box center " 
                    :class="{
                        warning: store.state.monitor1.detailData.unbalance_alarm == 1,
                        error: store.state.monitor1.detailData.unbalance_alarm == 2 
                    }"
                >
                    <i class="full-chart" @click="showChart(9)"></i>
                    <Frame />
                    <Linechart 
                        title="펌프모터-질량 불평형" 
                        name1="펌프모터 질량 불평형"
                        maxLine="1.75" 
                        minLine="1"
                        :detailData="
                                store.state.monitor1.detailData.motor_unbalance_amp
                        " 
                    />
                </div>
                <transition name="modal" appear v-show="chart[9]">
                    <div class="modal modal-overlay" @click.self="closeChart(9)">
                        <div class="modal-window">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="modal-close-button" @click="closeChart(9)">X</button>
                                </div>
                                <div class="chart-box" style="width: 1500px; height: 650px;">
                                    <Frame />
                                    <Linechart 
                                        title="펌프모터-질량 불평형" 
                                        name1="펌프모터 질량 불평형"
                                        maxLine="1.75" 
                                        minLine="1"
                                        :detailData="
                                             store.state.monitor1.detailData.motor_unbalance_amp
                                        " 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
                <div class="chart-box right">
                    <i class="full-chart" @click="showChart(10)"></i>
                    <Frame />
                    <Linechart4 
                        title="펌프모터-베어링온도" 
                        name1="펌프 부하" 
                        name2="펌프 반부하" 
                        name3="모터 부하" 
                        name4="모터 반부하" 
                        :detailData1="
                                store.state.monitor1.detailData.P_DE_bearing_temp
                        " 
                        :detailData2="
                            store.state.monitor1.detailData.P_NDE_bearing_temp
                        " 
                        :detailData3="
                            store.state.monitor1.detailData.M_DE_bearing_temp
                        " 
                        :detailData4="
                            store.state.monitor1.detailData.M_NDE_bearing_temp
                        
                        " 
                    />
                </div>
                <transition name="modal" appear v-show="chart[10]">
                    <div class="modal modal-overlay" @click.self="closeChart(10)">
                        <div class="modal-window">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="modal-close-button" @click="closeChart(10)">X</button>
                                </div>
                                <div class="chart-box" style="width: 1500px; height: 650px;">
                                    <Frame />
                                    <Linechart4 
                                        title="펌프모터-베어링온도"
                                        name1="펌프 부하" 
                                        name2="펌프 반부하" 
                                        name3="모터 부하" 
                                        name4="모터 반부하" 
                                        :detailData1="
                                            store.state.monitor1.detailData.P_DE_bearing_temp
                                        " 
                                        :detailData2="
                                            store.state.monitor1.detailData.P_NDE_bearing_temp
                                        " 
                                        :detailData3="
                                            store.state.monitor1.detailData.M_DE_bearing_temp
                                        " 
                                        :detailData4="
                                            store.state.monitor1.detailData.M_NDE_bearing_temp
                                        " 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div class="back-btn" v-on:click="back()">
            <span> ← Back</span>
        </div>
        <div class="location">
            <div class="search">
                <input 
                    @click="state.datePop" 
                    readonly 
                    :value="state.startStr" 
                />
                <span>~</span>
                <input @click="state.datePop" readonly :value="state.endStr" />
                <q-popup-proxy 
                    ref="qDateProxy" 
                    transition-show="scale" 
                    transition-hide="scale" 
                    v-model="state.datePop"
                >
                    <!-- [gelix_lsj_230921] q-date 날짜 변경 시 input에 업데이트 되도록 수정 -->
                    <q-date v-model="state.date" range mask="YYYY-MM-DD" @range-end="updateInputDate">
                        <div class="row items-center justify-end"></div>
                    </q-date>
                </q-popup-proxy>
            </div>
            <button class="button" @click="searchDate">조회</button>
            <button class="button" @click="downloadCSV">저장</button>

        </div>
        <q-dialog 
            v-model="state.alert" 
            transition-hide="scale" 
            transition-duration="0"
        >
            <q-card class="bg-default">
                <q-card-section>
                    <div class="text-h6">펌프모터 축정렬 불량</div>
                </q-card-section>
    
                <q-card-section class="q-pt-none">
                    <!-- 송수펌프모터 #{{ store.state.monitor1.sampleData.idx }} 모터 -->
                    <span class="large">{{
                            store.state.monitor1.modelList[
                                store.state.monitor1.sampleData.idx
                            ].title
                        }}</span> 
                        축정렬불량 여부로 인한 고장이 예상됩니다.
                    <br /> 
                        해당 장비에 대한 조치를 취하시겠습니까?
                </q-card-section>
    
                <q-card-actions align="right">
                    <!-- <q-btn flat label="OK" color="primary" v-close-popup /> -->
                    <q-btn 
                        flat 
                        class="confirm-btn" 
                        label="확인" 
                        @click="modalClick" 
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed, onMounted, reactive } from 'vue';
import Frame from '@/components/component/BoxFrame.vue';
import Linechart from '@/components/chart/monitoring/Linechart_d.vue';
import Linechart2 from '@/components/chart/monitoring/Linechart_d2.vue';
import Linechart21 from '@/components/chart/monitoring/Linechart_d21.vue';
import Linechart22 from '@/components/chart/monitoring/Linechart_d22.vue';
import Linechart3 from '@/components/chart/monitoring/Linechart_d3.vue';
import Linechart4 from '@/components/chart/monitoring/Linechart_d4.vue';
import Header from '@/components/menu/Header.vue';
import BoxFrame from '@/components/component/BoxFrame.vue';
import moment from 'moment';
// import axios from 'axios';

export default {
    components: {
        Header,
        BoxFrame,
        Frame,
        Linechart,
        Linechart2,
        Linechart21,
        Linechart22,
        Linechart3,
        Linechart4,
    },
    setup() {
        const router = useRouter();
        const store = useStore();
        let TITLE = reactive({
            name: '전동1계통 #1',
        });

        const state = reactive({
            model: store.state.monitor1.selectModel,
            options: computed(() => {
                let list = [];
                for (
                    let i = 0;
                    i < store.state.monitor1.modelList.length;
                    i++
                ) {
                    list.push(store.state.monitor1.modelList[i].title);
                }
                return list;
            }),
            datePop: false,
            date: {
                from: '',
                to: '',
            },
            startStr: '',
            endStr: '',
            alert: false,
        });
        onMounted(() => {
            let local = false;
            if (!local) {
                let currentTime = new Date();
                // let currentTime = new Date('2023-03-15 13:06:00');
                let startDate = moment(
                    currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
                ).format('yyyy-MM-DD HH:mm:ss');
                let endDate = moment(currentTime.getTime()).format(
                    'yyyy-MM-DD HH:mm:ss'
                );
                store.state.monitor1.startDate = startDate;
                store.state.monitor1.endDate = endDate;
            }
            todayDate();
            dateToNumber();
            store.dispatch('monitor1/motorDetails');
            store.dispatch('monitor1/bearingTempInfo');
            store.dispatch('monitor1/windingTempInfo');
            store.dispatch('monitor1/vibrationGraph');
            store.dispatch('monitor1/alarm');
            if (store.state.monitor1.mode) {
                // setTimeout(() => {
                //     store.state.monitor1.detailData.motor_misalignment_amp = store.state.monitor1.detailData.motor_misalignment_amp.concat(
                //         store.state.monitor1.sampleData.motor
                //     );
                // }, 2000);
                setTimeout(() => {
                    state.alert = true;
                }, 3000);
            }
        });

        const select = (idx) => {
            store.state.monitor1.mode = true;
            let val = idx - 1;
            store.state.monitor1.sampleData.idx = val;
            store.state.monitor1.modelList[val].alarm = true;
            store.dispatch('monitor1/motorDetails');
            store.dispatch('monitor1/bearingTempInfo');
            store.dispatch('monitor1/windingTempInfo');
            store.dispatch('monitor1/alarm');
            if (store.state.monitor1.mode) {
                // setTimeout(() => {
                //     store.state.monitor1.detailData.motor_misalignment_amp = store.state.monitor1.detailData.motor_misalignment_amp.concat(
                //         store.state.monitor1.sampleData.motor
                //     );
                // }, 2000);
                setTimeout(() => {
                    state.alert = true;
                }, 3000);
            }
            // axios.get('http://10.15.32.150:35000/siyeon?songsu=' + idx);
        };
        const selectReset = () => {
            store.state.monitor1.mode = false;
            // console.log('reset');
            // axios.get('http://10.15.32.150:35000/reset');
            window.location.reload(true);
        };

        const todayDate = () => {
            state.date.from = store.state.monitor1.startDate.split(' ')[0];
            state.date.to = store.state.monitor1.endDate.split(' ')[0];
            state.startStr = state.date.from;
            state.endStr = state.date.to;
        };

        const selectedMotor = (num) => {
            let select = store.state.monitor1.modelList.filter(
                (v) => v.id === num
            );
            // console.log('select :: ' + select);
            store.state.monitor1.selectModel = select[0].title;
            store.state.monitor1.id = select[0].id;
            store.state.monitor1.scada_id = select[0].scada_id;
            store.state.monitor1.sampleData.idx = select[0].idx;
            store.dispatch('monitor1/motorDetails');
            store.dispatch('monitor1/bearingTempInfo');
            store.dispatch('monitor1/windingTempInfo');
            store.state.monitor1.modelList.map((x) => (x.select = false));
            store.state.monitor1.modelList.filter((x) => {
                if (x.id === num) {
                    x.select = true;
                    return;
                }
            });
            if (select[0].alarm) {
                if (store.state.monitor1.mode) {
                    // setTimeout(() => {
                    //     store.state.monitor1.detailData.motor_misalignment_amp = store.state.monitor1.detailData.motor_misalignment_amp.concat(
                    //         store.state.monitor1.sampleData.motor
                    //     );
                    // }, 2000);
                    setTimeout(() => {
                        state.alert = true;
                    }, 3000);
                }
            }
        };

        const searchDate = () => {
            dateToNumber();
            store.dispatch('monitor1/motorDetails');
            store.dispatch('monitor1/bearingTempInfo');
            store.dispatch('monitor1/windingTempInfo');
            store.dispatch('monitor1/vibrationGraph');
            // store.dispatch('monitor1/handleDatePicker');
        };

        const downloadCSV = () => {
             const data_pump_motor_rms = store.state.monitor1.detailData.pump_motor_rms_amp_csv;
             //console.log('date: ' +  store.state.monitor1.detailData.pump_motor_rms_amp_csv);

            // CSV 형식으로 변환
            const csvContent = convertToCSV(data_pump_motor_rms);
            // Blob을 사용하여 CSV 파일 생성
            const bom = '\ufeff'; // UTF-8 BOM
            const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);

            link.setAttribute("href", url);

            // 날짜 형식 변환 (예: YYYY-MM-DD)
            const formattedStartDate = state.startStr; // 시작 날짜
            const formattedEndDate = state.endStr;
    
            // 파일명 생성
            const filename = `motor_report_${formattedStartDate}_${formattedEndDate}.csv`;
            // link.setAttribute("download", "펌프모터진동량.csv"); // 다운로드할 파일 이름
            link.setAttribute("download", filename); // 다운로드할 파일 이름
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        const convertToCSV = function(rdata) {
             const csvRows = [];
             const headers = ['날짜','펌프모터','모터부하 총진동량', '모터반부하 총진동량','펌프부하 총진동량','펌프반부하 총진동량'];

             // 헤더 추가
             csvRows.push(headers.join(','));

             // 데이터 추가
             //const maxLength = Math.max(rdata);
             const maxLength = rdata.length;
             /* 기존것
             for (let i = 0; i < maxLength; i++) {
                 const row = [
                    rdata[i] !== undefined ? rdata[i][0] : '', // 날짜
                    rdata[i] !== undefined ? rdata[i][1] : '', // 펌프모터
                    rdata[i] !== undefined ? rdata[i][2] : '', // 모터부하 총진동량
                    rdata[i] !== undefined ? rdata[i][3] : '', // 모터반부하 총진동량
                    rdata[i] !== undefined ? rdata[i][4] : '', // 펌프부하 총진동량
                    rdata[i] !== undefined ? rdata[i][5] : ''  // 펌프반부하 총진동량
                 ];
                 csvRows.push(row.join(','));
             }
            */
            for (let i = 0; i < maxLength; i++) {
                // 펌프모터 이름 변경 로직
                let pumpMotorName = rdata[i] !== undefined ? rdata[i][1] : ''; // 원래 이름 가져오기
                if (pumpMotorName === 'motor_01') {
                    pumpMotorName = '전동1가압장 가압펌프 #1'; 
                } else if (pumpMotorName === 'motor_02') {
                    pumpMotorName = '전동1가압장 가압펌프 #2'; 
                } else if (pumpMotorName === 'motor_03') {
                    pumpMotorName = '전동1가압장 가압펌프 #3'; 
                } else if (pumpMotorName === 'motor_04') {
                    pumpMotorName = '전동1가압장 가압펌프 #4'; 
                } else if (pumpMotorName === 'motor_05') {
                    pumpMotorName = '전동1가압장 가압펌프 #5'; 
                } else if (pumpMotorName === 'motor_06') {
                    pumpMotorName = '전동2가압장 가압펌프 #1'; 
                } else if (pumpMotorName === 'motor_07') {
                    pumpMotorName = '전동2가압장 가압펌프 #2'; 
                } else if (pumpMotorName === 'motor_08') {
                    pumpMotorName = '전동2가압장 가압펌프 #3'; 
                } else if (pumpMotorName === 'motor_09') {
                    pumpMotorName = '전동2가압장 가압펌프 #4'; 
                } else if (pumpMotorName === 'motor_10') {
                    pumpMotorName = '전동2가압장 가압펌프 #5'; 
                } else if (pumpMotorName === 'motor_11') {
                    pumpMotorName = '전동2가압장 가압펌프 #6'; 
                } else if (pumpMotorName === 'motor_12') {
                    pumpMotorName = '전동2가압장 가압펌프 #7'; 
                } else if (pumpMotorName === 'motor_13') {
                    pumpMotorName = '전동3가압장 가압펌프 #1'; 
                } else if (pumpMotorName === 'motor_14') {
                    pumpMotorName = '전동3가압장 가압펌프 #2'; 
                } else if (pumpMotorName === 'motor_15') {
                    pumpMotorName = '전동3가압장 가압펌프 #3'; 
                } else if (pumpMotorName === 'motor_16') {
                    pumpMotorName = '전동3가압장 가압펌프 #4'; 
                } else if (pumpMotorName === 'motor_17') {
                    pumpMotorName = '전동3가압장 가압펌프 #5'; 
                } else if (pumpMotorName === 'motor_18') {
                    pumpMotorName = '전동3가압장 가압펌프 #6'; 
                } else if (pumpMotorName === 'motor_19') {
                    pumpMotorName = '전동3가압장 가압펌프 #7'; 
                }


                 const row = [
                    rdata[i] !== undefined ? rdata[i][0] : '', // 날짜
                    pumpMotorName, // 펌프모터
                    rdata[i] !== undefined ? rdata[i][2] : '', // 모터부하 총진동량
                    rdata[i] !== undefined ? rdata[i][3] : '', // 모터반부하 총진동량
                    rdata[i] !== undefined ? rdata[i][4] : '', // 펌프부하 총진동량
                    rdata[i] !== undefined ? rdata[i][5] : ''  // 펌프반부하 총진동량
                 ];
                 csvRows.push(row.join(','));
             }
             return csvRows.join('\n');
        } ;

        const dateToNumber = () => {
            if (state.date.from && state.date.to) {
                store.state.monitor1.pickDate.from = Number(
                    state.date.from.replaceAll('-', '')
                );
                store.state.monitor1.pickDate.to = Number(
                    state.date.to.replaceAll('-', '')
                );
                state.startStr = state.date.from;
                state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230921] from, to를 같은 날짜로 선택 시 처리
                store.state.monitor1.pickDate.from = Number(
                    state.date.replaceAll('-', '')
                );
                store.state.monitor1.pickDate.to = Number(
                    state.date.replaceAll('-', '')
                );
                state.startStr = state.date;
                state.endStr = state.date;
            }
        };

        const selectModel = (value) => {
            // console.log(value);
            let select = store.state.monitor1.modelList.filter(
                (v) => v.title === value
            );
            store.state.monitor1.selectedMotor = select[0].title;
            store.state.monitor1.id = select[0].id;
            store.state.monitor1.scada_id = select[0].id;
        };

        const setTitle = (val) => {
            let arr = val.split(' ');
            return arr[0] + ' ' + arr[2];
        };

        const modalClick = () => {
            state.alert = false;
            // axios.get(
            //     'http://10.15.32.150:35000/siyeon?songsu=' +
            //         (store.state.monitor1.sampleData.idx + 1)
            // );
            // window.location.href = 'http://localhost:8081/songsu';
        };
        const back = () => {
            router.push('MotorView');
        };

        // [gelix_lsj_230921] q-date 날짜 변경 시 input에 업데이트 되도록 수정
        const updateInputDate = () => {
            if (state.date.from && state.date.to) {
                state.startStr = state.date.from;
                state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230921] from, to를 같은 날짜로 선택 시 처리
                state.startStr = state.date;
                state.endStr = state.date;
            }
        };

        // gelix_lsj tab 선택
        const tab = (idx) => {
            store.state.monitor1.tabIndex = idx
            if (idx === 1) {
                store.state.monitor1.id = 'motor_01'
                store.state.monitor1.centerId = '전동1(가)'
            } else if (idx === 2) {
                store.state.monitor1.id = 'motor_06'
                store.state.monitor1.centerId = '전동2(가)'
            } else {
                store.state.monitor1.id = 'motor_13'
                store.state.monitor1.centerId = '전동3(가)'
            }
            selectedMotor(store.state.monitor1.id);
        };

        // gelix_lsj 차트 확대
        const chart = reactive([false, false, false, false, false, false, false, false, false, false, false])
        const showChart = (idx) => {
            chart[idx] = true
        }

        const closeChart = (idx) => {
            chart[idx] = false
        }

        return {
            store,
            selectedMotor,
            selectReset,
            TITLE,
            state,
            selectModel,
            setTitle,
            modalClick,
            searchDate,
            downloadCSV,
            select,
            back,
            updateInputDate,
            tab,
            chart,
            showChart,
            closeChart
        };
    },
};
</script>

<style>

</style>
