<template>
    <div class="monitor-19">
        
        <Header class="header" />
        <div class="content">
            <div class="content-left">
                <div class="header">NAVIGATOR</div>
                <div style="display: flex; flex-direction:row; justify-content: space-between; width: 85%;">
                    <div class="pump-name">전동1가압장</div>
                    <div class="icon-button" @click="openModal_jd1">
                        <img src="../assets/icon/main6_s.png" alt="Settings Icon">
                    </div>
                </div>
                <!-- <div class="pump-name">전동1가압장</div> -->
                <PumpNav pumpNum = "1" centerId = "전동1(가)" pumpMotorId = "motor_01" ipcLocId = "전동1가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "2" centerId = "전동1(가)" pumpMotorId = "motor_02" ipcLocId = "전동1가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "3" centerId = "전동1(가)" pumpMotorId = "motor_03" ipcLocId = "전동1가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "4" centerId = "전동1(가)" pumpMotorId = "motor_04" ipcLocId = "전동1가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "5" centerId = "전동1(가)" pumpMotorId = "motor_05" ipcLocId = "전동1가압장" :trendChart = "trendChart"/>
                <!-- <div class="pump-name">전동2가압장</div>  -->
                <div style="display: flex; flex-direction:row; justify-content: space-between; width: 85%;">
                    <div class="pump-name">전동2가압장</div>
                    <div class="icon-button" @click="openModal_jd2">
                        <img src="../assets/icon/main6_s.png" alt="Settings Icon">
                    </div>
                </div>
                <PumpNav pumpNum = "1" centerId = "전동2(가)" pumpMotorId = "motor_06" ipcLocId = "전동2가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "2" centerId = "전동2(가)" pumpMotorId = "motor_07" ipcLocId = "전동2가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "3" centerId = "전동2(가)" pumpMotorId = "motor_08" ipcLocId = "전동2가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "4" centerId = "전동2(가)" pumpMotorId = "motor_09" ipcLocId = "전동2가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "5" centerId = "전동2(가)" pumpMotorId = "motor_10" ipcLocId = "전동2가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "6" centerId = "전동2(가)" pumpMotorId = "motor_11" ipcLocId = "전동2가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "7" centerId = "전동2(가)" pumpMotorId = "motor_12" ipcLocId = "전동2가압장" :trendChart = "trendChart"/>
                <div style="display: flex; flex-direction:row; justify-content: space-between; width: 85%;">
                    <div class="pump-name">전동3가압장</div>
                    <div class="icon-button" @click="openModal_jd3">
                        <img src="../assets/icon/main6_s.png" alt="Settings Icon">
                    </div>
                </div>
                <PumpNav pumpNum = "1" centerId = "전동3(가)" pumpMotorId = "motor_13" ipcLocId = "전동3가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "2" centerId = "전동3(가)" pumpMotorId = "motor_14" ipcLocId = "전동3가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "3" centerId = "전동3(가)" pumpMotorId = "motor_15" ipcLocId = "전동3가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "4" centerId = "전동3(가)" pumpMotorId = "motor_16" ipcLocId = "전동3가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "5" centerId = "전동3(가)" pumpMotorId = "motor_17" ipcLocId = "전동3가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "6" centerId = "전동3(가)" pumpMotorId = "motor_18" ipcLocId = "전동3가압장" :trendChart = "trendChart"/>
                <PumpNav pumpNum = "7" centerId = "전동3(가)" pumpMotorId = "motor_19" ipcLocId = "전동3가압장" :trendChart = "trendChart"/>
            </div>
            <div class="content-right">
                <div class="calender-container">
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
                            <q-date v-model="state.date" range mask="YYYY-MM-DD" @range-end="updateInputDate">
                                <div class="row items-center justify-end"></div>
                            </q-date>
                        </q-popup-proxy>
                    </div>
                    <button class="button" @click="searchDate">Search</button>
                    <button class="button" @click="changeCurrentTime">Current</button>
                </div>
                <div class="chart1-container">
                    <Frame />
                    <div ref="trendLineChartRef"></div>
                </div>
                <div class="chart2-container">
                    <div class="chart2-area1" >
                        <Frame />
                        <div ref="timeLineChartRef"></div>
                    </div>
                    <div class="chart2-area2" >
                        <Frame />
                        <div ref="spectrumLineChartRef"></div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="modal">
        <div v-if="isModalOpen_jd1" class="modal-overlay" @click.self="closeModal_jd1">
            <div class="modal-content">
                <div class="selection-group">
                    <div class="selection">
                        <h3>Pump</h3>
                        <ul>
                        <li
                            v-for="(pump, index) in pumps_jd1"
                            :key="index"
                            @click="selectPump_jd1(pump)"
                            :class="{ selected: selectedPump_jd1 === pump }"
                        >
                            {{ pump }}
                        </li>
                        </ul>
                    </div>

                    <div class="selection">
                        <h3>Motor</h3>
                        <ul>
                        <li
                            v-for="(motor, index) in motors_jd1"
                            :key="index"
                            @click="selectMotor_jd1(motor)"
                            :class="{ selected: selectedMotor_jd1 === motor }"
                        >
                            {{ motor }}
                        </li>
                        </ul>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; width: 30%; margin-left: 10px; justify-content: space-between;">
                    <div style="display: flex; flex-direction: column;">
                        <p v-if="selectedMotor_jd1" style="margin-top: 25px; font-size: x-large;">{{ selectedMotor_jd1 }}</p>
                        <p v-if="selectedPump_jd1" style="margin-top: 25px; font-size: x-large;">{{ selectedPump_jd1 }}</p>
                        <div >
                            <div v-if="selectedPump_jd1">
                                <div style="display: flex; flex-direction: row; margin-bottom: 20px; margin-top: 20px;">
                                    <button
                                        @click="selectPumpButton('POV')"
                                        :style="buttonStyle(selectedPumpButton === 'POV')"
                                    >POV</button>
                                    <button
                                        @click="selectPumpButton('PIV')"
                                        :style="buttonStyle(selectedPumpButton === 'PIV')"
                                    >PIV</button>
                                </div> 
                                <div class="input-group">
                                    <label for="brgBall">rpm:</label>
                                    <input type="number" v-model="pumpFormData.rpm" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">모터 극수:</label>
                                    <input type="number" v-model="pumpFormData.pole" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">운전 주파수:</label>
                                    <input type="number" v-model="pumpFormData.d_hz" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="rpm">베어링 내륜 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.bpfi_hz" id="rpm" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">베어링 외륜 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.bpfo_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">볼 스핀 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.ball_spin_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">리테이너 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.retainer_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">펌프 임펠러:</label>
                                    <input type="number" v-model="pumpFormData.pump_impller" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">전원 주파수:</label>
                                    <input type="number" v-model="pumpFormData.power_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                            </div>
                            <div v-if="selectedMotor_jd1">
                                <div style="display: flex; flex-direction: row; margin-bottom: 20px; margin-top: 20px;">
                                    <button
                                        @click="selectMotorButton('MOV')"
                                        :style="buttonStyle(selectedMotorButton === 'MOV')"
                                    >MOV</button>
                                    <button
                                        @click="selectMotorButton('MIV')"
                                        :style="buttonStyle(selectedMotorButton === 'MIV')"
                                    >MIV</button>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">rpm:</label>
                                    <input type="number" v-model="motorFormData.rpm" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">모터 극수:</label>
                                    <input type="number" v-model="motorFormData.pole" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">운전 주파수:</label>
                                    <input type="number" v-model="motorFormData.d_hz" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="rpm">베어링 내륜 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.bpfi_hz" id="rpm" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">베어링 외륜 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.bpfo_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">볼 스핀 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.ball_spin_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">리테이너 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.retainer_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">펌프 임펠러:</label>
                                    <input type="number" v-model="motorFormData.pump_impller" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">전원 주파수:</label>
                                    <input type="number" v-model="motorFormData.power_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row; ">
                        <button @click="saveChanges">Save changes</button>
                        <button @click="closeModal_jd1">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
    <transition name="modal">
        <div v-if="isModalOpen_jd2" class="modal-overlay" @click.self="closeModal_jd2">
            <div class="modal-content">
                <div class="selection-group">
                    <div class="selection">
                        <h3>Pump</h3>
                        <ul>
                        <li
                            v-for="(pump, index) in pumps_jd2"
                            :key="index"
                            @click="selectPump_jd2(pump)"
                            :class="{ selected: selectedPump_jd2 === pump }"
                        >
                            {{ pump }}
                        </li>
                        </ul>
                    </div>

                    <div class="selection">
                        <h3>Motor</h3>
                        <ul>
                        <li
                            v-for="(motor, index) in motors_jd2"
                            :key="index"
                            @click="selectMotor_jd2(motor)"
                            :class="{ selected: selectedMotor_jd2 === motor }"
                        >
                            {{ motor }}
                        </li>
                        </ul>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; width: 30%; margin-left: 10px; justify-content: space-between;">
                    <div style="display: flex; flex-direction: column;">
                        <p v-if="selectedMotor_jd2" style="margin-top: 25px; font-size: x-large;">{{ selectedMotor_jd2 }}</p>
                        <p v-if="selectedPump_jd2" style="margin-top: 25px; font-size: x-large;">{{ selectedPump_jd2 }}</p>
                        <div >
                            <div v-if="selectedPump_jd2">
                                <div style="display: flex; flex-direction: row; margin-bottom: 20px; margin-top: 20px;">
                                    <button
                                        @click="selectPumpButton('POV')"
                                        :style="buttonStyle(selectedPumpButton === 'POV')"
                                    >POV</button>
                                    <button
                                        @click="selectPumpButton('PIV')"
                                        :style="buttonStyle(selectedPumpButton === 'PIV')"
                                    >PIV</button>
                                </div> 
                                <div class="input-group">
                                    <label for="brgBall">rpm:</label>
                                    <input type="number" v-model="pumpFormData.rpm" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">모터 극수:</label>
                                    <input type="number" v-model="pumpFormData.pole" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">운전 주파수:</label>
                                    <input type="number" v-model="pumpFormData.d_hz" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="rpm">베어링 내륜 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.bpfi_hz" id="rpm" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">베어링 외륜 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.bpfo_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">볼 스핀 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.ball_spin_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">리테이너 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.retainer_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">펌프 임펠러:</label>
                                    <input type="number" v-model="pumpFormData.pump_impller" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">전원 주파수:</label>
                                    <input type="number" v-model="pumpFormData.power_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                            </div>
                            <div v-if="selectedMotor_jd2">
                                <div style="display: flex; flex-direction: row; margin-bottom: 20px; margin-top: 20px;">
                                    <button
                                        @click="selectMotorButton('MOV')"
                                        :style="buttonStyle(selectedMotorButton === 'MOV')"
                                    >MOV</button>
                                    <button
                                        @click="selectMotorButton('MIV')"
                                        :style="buttonStyle(selectedMotorButton === 'MIV')"
                                    >MIV</button>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">rpm:</label>
                                    <input type="number" v-model="motorFormData.rpm" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">모터 극수:</label>
                                    <input type="number" v-model="motorFormData.pole" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">운전 주파수:</label>
                                    <input type="number" v-model="motorFormData.d_hz" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="rpm">베어링 내륜 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.bpfi_hz" id="rpm" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">베어링 외륜 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.bpfo_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">볼 스핀 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.ball_spin_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">리테이너 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.retainer_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">펌프 임펠러:</label>
                                    <input type="number" v-model="motorFormData.pump_impller" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">전원 주파수:</label>
                                    <input type="number" v-model="motorFormData.power_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row; ">
                        <button @click="saveChanges">Save changes</button>
                        <button @click="closeModal_jd2">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
    <transition name="modal">
        <div v-if="isModalOpen_jd3" class="modal-overlay" @click.self="closeModal_jd3">
            <div class="modal-content">
                <div class="selection-group">
                    <div class="selection">
                        <h3>Pump</h3>
                        <ul>
                        <li
                            v-for="(pump, index) in pumps_jd3"
                            :key="index"
                            @click="selectPump_jd3(pump)"
                            :class="{ selected: selectedPump_jd3 === pump }"
                        >
                            {{ pump }}
                        </li>
                        </ul>
                    </div>

                    <div class="selection">
                        <h3>Motor</h3>
                        <ul>
                        <li
                            v-for="(motor, index) in motors_jd3"
                            :key="index"
                            @click="selectMotor_jd3(motor)"
                            :class="{ selected: selectedMotor_jd3 === motor }"
                        >
                            {{ motor }}
                        </li>
                        </ul>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; width: 30%; margin-left: 10px; justify-content: space-between;">
                    <div style="display: flex; flex-direction: column;">
                        <p v-if="selectedMotor_jd3" style="margin-top: 25px; font-size: x-large;">{{ selectedMotor_jd3 }}</p>
                        <p v-if="selectedPump_jd3" style="margin-top: 25px; font-size: x-large;">{{ selectedPump_jd3 }}</p>
                        <div >
                            <div v-if="selectedPump_jd3">
                                <div style="display: flex; flex-direction: row; margin-bottom: 20px; margin-top: 20px;">
                                    <button
                                        @click="selectPumpButton('POV')"
                                        :style="buttonStyle(selectedPumpButton === 'POV')"
                                    >POV</button>
                                    <button
                                        @click="selectPumpButton('PIV')"
                                        :style="buttonStyle(selectedPumpButton === 'PIV')"
                                    >PIV</button>
                                </div> 
                                <div class="input-group">
                                    <label for="brgBall">rpm:</label>
                                    <input type="number" v-model="pumpFormData.rpm" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">모터 극수:</label>
                                    <input type="number" v-model="pumpFormData.pole" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">운전 주파수:</label>
                                    <input type="number" v-model="pumpFormData.d_hz" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="rpm">베어링 내륜 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.bpfi_hz" id="rpm" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">베어링 외륜 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.bpfo_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">볼 스핀 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.ball_spin_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">리테이너 결함 주파수:</label>
                                    <input type="number" v-model="pumpFormData.retainer_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">펌프 임펠러:</label>
                                    <input type="number" v-model="pumpFormData.pump_impller" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">전원 주파수:</label>
                                    <input type="number" v-model="pumpFormData.power_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                            </div>
                            <div v-if="selectedMotor_jd3">
                                <div style="display: flex; flex-direction: row; margin-bottom: 20px; margin-top: 20px;">
                                    <button
                                        @click="selectMotorButton('MOV')"
                                        :style="buttonStyle(selectedMotorButton === 'MOV')"
                                    >MOV</button>
                                    <button
                                        @click="selectMotorButton('MIV')"
                                        :style="buttonStyle(selectedMotorButton === 'MIV')"
                                    >MIV</button>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">rpm:</label>
                                    <input type="number" v-model="motorFormData.rpm" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">모터 극수:</label>
                                    <input type="number" v-model="motorFormData.pole" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="brgBall">운전 주파수:</label>
                                    <input type="number" v-model="motorFormData.d_hz" id="brgBall" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="rpm">베어링 내륜 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.bpfi_hz" id="rpm" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">베어링 외륜 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.bpfo_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">볼 스핀 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.ball_spin_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">리테이너 결함 주파수:</label>
                                    <input type="number" v-model="motorFormData.retainer_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">펌프 임펠러:</label>
                                    <input type="number" v-model="motorFormData.pump_impller" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                                <div class="input-group">
                                    <label for="vane">전원 주파수:</label>
                                    <input type="number" v-model="motorFormData.power_hz" id="vane" style="margin-left: 10px; background-color: darkgrey;"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row; ">
                        <button @click="saveChanges">Save changes</button>
                        <button @click="closeModal_jd3">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
    </div>
</template>

<script>
import { useStore } from 'vuex';
// import { useRouter } from 'vue-router';
import Frame from '@/components/component/BoxFrame.vue';
import Header from '@/components/menu/Header.vue';
import PumpNav from '@/components/component/PumpNav.vue';
import { onMounted, reactive, ref} from 'vue';
import Plotly from 'plotly.js/dist/plotly.js'
import { toRaw } from 'vue';
import axios from 'axios';
import log from '@/logger.js'
// import * as math from 'mathjs';


// import axios from 'axios';
// import Scatter from '@/components/chart/monitoring/Scatter_PTK.vue';
// import Scatter2 from '@/components/chart/moni toring/Scatter_SSN.vue';
export default {
    components: {
        Header,
        PumpNav,
        Frame,

        // Scatter,
        // Scatter2,
        // Linechart2,
    },
    setup() {
        const store = useStore();
        const trendLineChartRef = ref(null)
        const timeLineChartRef = ref(null)
        const spectrumLineChartRef = ref(null)
        
        const moment = require('moment');

         // 모달 상태와 데이터 추가
        const pumpNum = ref(0)
        const siteNum = ref(0)
        const isModalOpen_jd1 = ref(false);
        const isModalOpen_jd2 = ref(false);
        const isModalOpen_jd3 = ref(false);
        const selectedPump_jd1 = ref('');
        const selectedMotor_jd1 = ref('');
        const selectedPump_jd2 = ref('');
        const selectedMotor_jd2 = ref('');
        const selectedPump_jd3 = ref('');
        const selectedMotor_jd3 = ref('');
        const selectedPumpButton = ref('')
        const selectedMotorButton = ref('')
        const pumps_jd1 = ref(['전동1가압장 #1', '전동1가압장 #2', '전동1가압장 #3', '전동1가압장 #4', '전동1가압장 #5']);
        const motors_jd1 = ref(['전동1가압장 #1', '전동1가압장 #2', '전동1가압장 #3', '전동1가압장 #4', '전동1가압장 #5']);
        const pumps_jd2 = ref(['전동2가압장 #1', '전동2가압장 #2', '전동2가압장 #3', '전동2가압장 #4', '전동2가압장 #5', '전동2가압장 #6', '전동2가압장 #7']);
        const motors_jd2 = ref(['전동2가압장 #1', '전동2가압장 #2', '전동2가압장 #3', '전동2가압장 #4', '전동2가압장 #5', '전동2가압장 #6', '전동2가압장 #7']);
        const pumps_jd3 = ref(['전동3가압장 #1', '전동3가압장 #2', '전동3가압장 #3', '전동3가압장 #4', '전동3가압장 #5', '전동3가압장 #6', '전동3가압장 #7']);
        const motors_jd3 = ref(['전동3가압장 #1', '전동3가압장 #2', '전동3가압장 #3', '전동3가압장 #4', '전동3가압장 #5', '전동3가압장 #6', '전동3가압장 #7']);
        const pumpFormData = reactive({
            rpm: 0,
            pole: 0,
            d_hz: 0,
            bpfi_hz: 0,
            bpfo_hz: 0,
            ball_spin_hz: 0,
            retainer_hz: 0,
            pump_impller: 0,
            power_hz: 0
        });
        const motorFormData = reactive({
            rpm: 0,
            pole: 0,
            d_hz: 0,
            bpfi_hz: 0,
            bpfo_hz: 0,
            ball_spin_hz: 0,
            retainer_hz: 0,
            pump_impller: 0,
            power_hz: 0
        });

        const resetFormData = (formData) => {
            for (let key in formData) {
                formData[key] = 0;
            }
        };
        
        const extractNumber = (str) => {
            const match = str.match(/#(\d+)/); // '#' 뒤에 오는 숫자를 찾는 정규표현식
            return match ? Number(match[1]) : null; // 숫자를 추출하고, 없으면 null 반환    
        }

        const selectPump_jd1 = (pump) => {
            selectedPump_jd1.value = pump;
            selectedMotor_jd1.value = '';  // Pump 선택 시 Motor 선택 해제
            pumpNum.value = extractNumber(pump)
            selectedPumpButton.value = '';
            selectedMotorButton.value = '';
            resetFormData(pumpFormData)
            resetFormData(motorFormData)

            selectPumpButton('POV')

            // api 호출 (지금 선택한 펌프 해당 값들 불러오기) pov piv 구분해서 가져와야함
        };

        const selectMotor_jd1 = (motor) => {
            selectedMotor_jd1.value = motor;
            selectedPump_jd1.value = '';  // Pump 선택 시 Motor 선택 해제
            pumpNum.value = extractNumber(motor)
            selectedPumpButton.value = '';
            selectedMotorButton.value = '';
            resetFormData(pumpFormData)
            resetFormData(motorFormData)
            
            selectMotorButton('MOV')

            // api 호출 (지금 선택한 모터 해당 값들 불러오기) mov miv 구분해서 가져와야함        
        };


        const selectPump_jd2 = (pump) => {
            selectedPump_jd2.value = pump;
            selectedMotor_jd2.value = '';  // Pump 선택 시 Motor 선택 해제
            pumpNum.value = extractNumber(pump)
            selectedPumpButton.value = '';
            selectedMotorButton.value = '';
            resetFormData(pumpFormData)
            resetFormData(motorFormData) 

            selectPumpButton('POV')
        };

        const selectMotor_jd2 = (motor) => {
            selectedMotor_jd2.value = motor;
            selectedPump_jd2.value = '';  // Pump 선택 시 Motor 선택 해제
            pumpNum.value = extractNumber(motor)
            selectedPumpButton.value = '';
            selectedMotorButton.value = '';
            resetFormData(pumpFormData)
            resetFormData(motorFormData)
        
            selectMotorButton('MOV')
        };

        const selectPump_jd3 = (pump) => {
            selectedPump_jd3.value = pump;
            selectedMotor_jd3.value = '';  // Pump 선택 시 Motor 선택 해제
            pumpNum.value = extractNumber(pump)
            selectedPumpButton.value = '';
            selectedMotorButton.value = '';
            resetFormData(pumpFormData)
            resetFormData(motorFormData) 

            selectPumpButton('POV')
        };

        const selectMotor_jd3 = (motor) => {
            selectedMotor_jd3.value = motor;
            selectedPump_jd3.value = '';  // Pump 선택 시 Motor 선택 해제
            pumpNum.value = extractNumber(motor)
            selectedPumpButton.value = '';
            selectedMotorButton.value = '';
            resetFormData(pumpFormData)
            resetFormData(motorFormData)
        
            selectMotorButton('MOV')
        };

        const selectPumpButton = (button) => {
            selectedPumpButton.value = button;
            selectedMotorButton.value = '';
            let params = {}
            if (selectedPumpButton.value === 'POV') {
                    params = {
                    ipc_loc: `전동${siteNum.value}가압장`,
                    pm_id: `${pumpNum.value}PM`,
                    ch_id: `${4 * pumpNum.value - 3}Ch_P`,
                    };
                } else if (selectedPumpButton.value === 'PIV') {
                    params = {
                    ipc_loc: `전동${siteNum.value}가압장`,
                    pm_id: `${pumpNum.value}PM`,
                    ch_id: `${4 * pumpNum.value - 2}Ch_P`,
                    formData: toRaw(pumpFormData)
                    };
                }
            axios
                .post(window.globalIP+'/api/v1/diagnosis/getDiagData', params)
                .then(response => {
                    pumpFormData.rpm = response.data.datas[0].RPM
                    pumpFormData.pole = response.data.datas[0].POLE
                    pumpFormData.d_hz = response.data.datas[0].D_HZ
                    pumpFormData.bpfi_hz = response.data.datas[0].BPFI_HZ
                    pumpFormData.bpfo_hz = response.data.datas[0].BPFO_HZ
                    pumpFormData.ball_spin_hz = response.data.datas[0].BALL_SPIN_HZ
                    pumpFormData.retainer_hz = response.data.datas[0].RETAINER_HZ
                    pumpFormData.pump_impller = response.data.datas[0].PUMP_IMPLLER
                    pumpFormData.power_hz = response.data.datas[0].POWER_HZ
                })
                .catch();
            
        };

        const selectMotorButton = (button) => {
            selectedMotorButton.value = button;
            selectedPumpButton.value = '';
            let params = {}
            if (selectedMotorButton.value === 'MIV') {
                    params = {
                    ipc_loc: `전동${siteNum.value}가압장`,
                    pm_id: `${pumpNum.value}PM`,
                    ch_id: `${4 * pumpNum.value - 1}Ch_M`,
                    formData: toRaw(motorFormData)
                    };
                } else if (selectedMotorButton.value === 'MOV') {
                    params = {
                    ipc_loc: `전동${siteNum.value}가압장`,
                    pm_id: `${pumpNum.value}PM`,
                    ch_id: `${4 * pumpNum.value}Ch_M`,
                    formData: toRaw(motorFormData)
                    };
                }
            axios
                .post(window.globalIP+'/api/v1/diagnosis/getDiagData', params)
                .then(response => {
                    motorFormData.rpm = response.data.datas[0].RPM
                    motorFormData.pole = response.data.datas[0].POLE
                    motorFormData.d_hz = response.data.datas[0].D_HZ
                    motorFormData.bpfi_hz = response.data.datas[0].BPFI_HZ
                    motorFormData.bpfo_hz = response.data.datas[0].BPFO_HZ
                    motorFormData.ball_spin_hz = response.data.datas[0].BALL_SPIN_HZ
                    motorFormData.retainer_hz = response.data.datas[0].RETAINER_HZ
                    motorFormData.pump_impller = response.data.datas[0].PUMP_IMPLLER
                    motorFormData.power_hz = response.data.datas[0].POWER_HZ
                })
                .catch();
        };
        const buttonStyle = (isSelected) => ({
            backgroundColor: isSelected ? '#00aaff' : '#3c4fff33', // 선택된 버튼과 선택되지 않은 버튼의 배경색을 다르게 설정
            color: isSelected ? '#ffffff' : '#000000', // 선택된 버튼의 텍스트 색상 변경
            fontWeight: 'bold',
            border: isSelected ? '2px solid #007acc' : '1px solid #cccccc',
            padding: '10px 20px',
            marginRight: '10px',
            cursor: 'pointer',
        });

        const openModal_jd1 = () => {
            isModalOpen_jd1.value = true;
            siteNum.value = 1
            pumpNum.value = 0
            selectedMotor_jd1.value = ''
            selectedPump_jd1.value = ''
            selectedMotor_jd2.value = ''
            selectedPump_jd2.value = ''
            selectedMotor_jd3.value = ''
            selectedPump_jd3.value = ''
            resetFormData(pumpFormData)
            resetFormData(motorFormData)

            selectPump_jd1('전동1가압장 #1')
        };

        const closeModal_jd1 = () => {
            isModalOpen_jd1.value = false;
            siteNum.value = 0
        };

        const openModal_jd2 = () => {
            isModalOpen_jd2.value = true;
            siteNum.value = 2
            pumpNum.value = 0
            selectedMotor_jd1.value = ''
            selectedPump_jd1.value = ''
            selectedMotor_jd2.value = ''
            selectedPump_jd2.value = ''
            selectedMotor_jd3.value = ''
            selectedPump_jd3.value = ''
            resetFormData(pumpFormData)
            resetFormData(motorFormData)

            selectPump_jd2('전동2가압장 #1')
        };

        const closeModal_jd2 = () => {
            isModalOpen_jd2.value = false;
            siteNum.value = 0 
        };

        const openModal_jd3 = () => {
            isModalOpen_jd3.value = true;
            siteNum.value = 3
            pumpNum.value = 0
            selectedMotor_jd1.value = ''
            selectedPump_jd1.value = ''
            selectedMotor_jd2.value = ''
            selectedPump_jd2.value = ''
            selectedMotor_jd3.value = ''
            selectedPump_jd3.value = ''
            resetFormData(pumpFormData)
            resetFormData(motorFormData)

            selectPump_jd3('전동3가압장 #1')
        };

        const closeModal_jd3 = () => {
            isModalOpen_jd3.value = false;
            siteNum.value = 0 
        };

        const saveChanges = () => {
            let params = {};

            if (siteNum.value === 1) {
                if (selectedPumpButton.value) {
                    if (selectedPumpButton.value === 'POV') {
                        params = {
                        ipc_loc: '전동1가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 3}Ch_P`,
                        formData: toRaw(pumpFormData)
                        };
                    } else if (selectedPumpButton.value === 'PIV') {
                        params = {
                        ipc_loc: '전동1가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 2}Ch_P`,
                        formData: toRaw(pumpFormData)
                        };
                    }
                } else if (selectedMotorButton.value) {
                    if (selectedMotorButton.value === 'MIV') {
                        params = {
                        ipc_loc: '전동1가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 1}Ch_M`,
                        formData: toRaw(motorFormData)
                        };
                    } else if (selectedMotorButton.value === 'MOV') {
                        params = {
                        ipc_loc: '전동1가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value}Ch_M`,
                        formData: toRaw(motorFormData)
                        };
                    }
                }
            } else if (siteNum.value === 2) {
                if (selectedPumpButton.value) {
                    if (selectedPumpButton.value === 'POV') {
                        params = {
                        ipc_loc: '전동2가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 3}Ch_P`,
                        formData: toRaw(pumpFormData)
                        };
                    } else if (selectedPumpButton.value === 'PIV') {
                        params = {
                        ipc_loc: '전동2가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 2}Ch_P`,
                        formData: toRaw(pumpFormData)
                        };
                    }
                } else if (selectedMotorButton.value) {
                    if (selectedMotorButton.value === 'MIV') {
                        params = {
                        ipc_loc: '전동2가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 1}Ch_M`,
                        formData: toRaw(motorFormData)
                        };
                    } else if (selectedMotorButton.value === 'MOV') {
                        params = {
                        ipc_loc: '전동2가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value}Ch_M`,
                        formData: toRaw(motorFormData)
                        };
                    }
                }
            } else if (siteNum.value === 3) {
                if (selectedPumpButton.value) {
                    if (selectedPumpButton.value === 'POV') {
                        params = {
                        ipc_loc: '전동3가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 3}Ch_P`,
                        formData: toRaw(pumpFormData)
                        };
                    } else if (selectedPumpButton.value === 'PIV') {
                        params = {
                        ipc_loc: '전동3가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 2}Ch_P`,
                        formData: toRaw(pumpFormData)
                        };
                    }
                } else if (selectedMotorButton.value) {
                    if (selectedMotorButton.value === 'MIV') {
                        params = {
                        ipc_loc: '전동3가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value - 1}Ch_M`,
                        formData: toRaw(motorFormData)
                        };
                    } else if (selectedMotorButton.value === 'MOV') {
                        params = {
                        ipc_loc: '전동3가압장',
                        pm_id: `${pumpNum.value}PM`,
                        ch_id: `${4 * pumpNum.value}Ch_M`,
                        formData: toRaw(motorFormData)
                        };
                    }
                }
            }

            // 서버에 POST 요청
            axios
                .post(window.globalIP+'/api/v1/diagnosis/diagDataSave', params)
                .then()
                .catch();

            // closeModal_jd1();
            // closeModal_jd2();
            // closeModal_jd3();
        };

        const state = reactive({
            datePop: false,
            date: {
                from: '',
                to: '',
            },
            startStr: '',
            endStr: '',
        })

        const trendChart = async () => {
            const data = store.state.monitor19[`diag${store.state.monitor19.nav}Data`];
            try {
                const values = []
                const labels = []

                for (let i = 0; i < data.length; i++) {
                    values.push(data[i].calRMS)
                    labels.push(moment(data[i].acq_date).format('YYYY-MM-DD HH:mm:ss'))
                    if(i == data.length -1) {
                        store.state.monitor19.lastSpot = moment(data[i].acq_date).format('YYYY-MM-DD HH:mm:ss')
                    }
                }
                // console.log(store.state.monitor19.lastSpot)
                 // 병렬로 디스패치 호출
                await Promise.all([
                    store.dispatch('monitor19/fetchTimeWave'),
                    store.dispatch('monitor19/fetchSpecTrum')
                ]);

                // 병렬로 차트 업데이트
                await Promise.all([
                    timeWaveChart(),
                    specTrumChart()
                ]);
                const lineData = [{
                    x: labels,
                    y: values,
                    type: 'scatter',  // scatter로 설정
                    mode: 'lines+markers',  // lines+markers로 설정
                    marker: {
                        color: 'EF5656',
                        size: 6  // 마커의 크기 설정
                    },
                    line: {
                        color: '#EF5656',  // 라인의 색상 설정 (초록색)
                        width: 2.0
                    },
                    orientation: 'v'
                }];

                const lineLayout = {
                    title: {
                        text: 'Overall Vibration Trend',
                        font: {
                            color: '#FFF'  // 제목 색상 설정
                        }
                    },
                    height: 430,
                    width: 1300,
                    margin: { t: 40, l: 70, r: 70, b: 70 },
                    legend: { font: { color: '#FFF' } },
                    plot_bgcolor: 'transparent',
                    paper_bgcolor: 'transparent',
                    xaxis: { color: '#FFF',  title: 'Time', showline: true, showgrid: false, tickformat: '%Y-%m-%d'  },
                    yaxis: { color: '#FFF', title: 'RMS Velocity (mm/s)', showline: true, showgrid: false, fixedrange: false, exponentformat: 'none' },
                    font: { family: 'KHNPHDRegular' },
                };

                Plotly.newPlot(trendLineChartRef.value, lineData, lineLayout);
                 
                // 클릭 이벤트 핸들러 추가
                trendLineChartRef.value.on('plotly_click', function async (data) {
                    const point = data.points[0];
                    store.state.monitor19.lastSpot = point.x
                    Promise.all([
                        store.dispatch('monitor19/fetchTimeWave').then(() => {
                            timeWaveChart();
                        }),
                        store.dispatch('monitor19/fetchSpecTrum').then(() => {
                            specTrumChart();
                        })
                    ]);
                });
            } catch (err) {
                log.logError(err.message);
            }
        }

        const timeWaveChart = () => {
            const data = store.state.monitor19.diagTimeWaveData;
            try {
                const values = data[0].dt_ary.split(',').map(parseFloat);
                const labels = [];
                for (let i = 0; i < values.length; i++) {
                    labels.push(i * (1 / (values.length - 1))); // 0에서 1초 사이의 값을 생성
                }

                const lineData = [{
                    x: labels,
                    y: values,
                    type: 'line',
                    marker: {
                        color: '#EF5656',
                        width: 0.1
                    },
                    orientation: 'v'
                }];

                const lineLayout = {
                    title: {
                        text: 'TimeWave',
                        font: {
                            color: '#FFF'  // 제목 색상 설정
                        }
                    },
                    height: 400,
                    width: 650,
                    margin: { t: 30, l: 70, r: 70, b: 60 },
                    legend: { font: { color: '#FFF' } },
                    plot_bgcolor: 'transparent',
                    paper_bgcolor: 'transparent',
                    xaxis: { 
                        color: '#FFF',  
                        title: 'Time (sec)', 
                        showline: true, 
                        showgrid: false,
                        range: [0, 1] // x축 범위 설정
                    },
                    yaxis: { 
                        color: '#FFF',  
                        title: 'Velocity (mm/s)', 
                        showline: true, 
                        showgrid: false, 
                        fixedrange: false, 
                        exponentformat: 'none' 
                    },
                    font: { family: 'KHNPHDRegular' },
                };

                Plotly.newPlot(timeLineChartRef.value, lineData, lineLayout);
                // 클릭 이벤트 핸들러 추가

            } catch (err) {
                log.logError(err.message);
            }
        }
        // const specTrumChart = () => {
        //     const data = store.state.monitor19.diagSpecTrumData;
        //     try {
        //         const vibrationValues  = data[0].dt_ary.split(',').map(parseFloat)
        //         const n = vibrationValues.length
        //         const frequencies = Array.from({ length: n }, (_, i) => i * 12800 / n)
        //         const spectrum = math.fft(vibrationValues)
        //         const amplitude = spectrum.map(value => math.abs(value));
                
        //         const frequencyRange = frequencies.slice(0, n / 2);
        //         const amplitudeRange = amplitude.slice(0, n / 2);

    
           
        //         const lineData = [{
        //             x: frequencyRange,
        //             y: amplitudeRange,
        //             type: 'line',
        //             marker: {
        //                 color: '#EF5656',
        //                 width: 0.1
        //             },
        //             orientation: 'v'
        //         }];

        //         const lineLayout = {
        //             title: {
        //                 text: 'Frequency Spectrum',
        //                 font: {
        //                     color: '#FFF'  // 제목 색상 설정
        //                 }
        //             },
        //             height: 400,
        //             width: 650,
        //             margin: { t: 30, l: 70, r: 70, b: 60 },
        //             legend: { font: { color: '#FFF' } },
        //             plot_bgcolor: 'transparent',
        //             paper_bgcolor: 'transparent',
        //             xaxis: { color: '#FFF',  title: 'Frequency (Hz)', showline: true, showgrid: false }, 
        //             yaxis: { color: '#FFF',  title: 'Amplitude', showline: true, showgrid: false, fixedrange: false, exponentformat: 'none' },
        //             font: { family: 'KHNPHDRegular' },
        //         };

        //         Plotly.newPlot(spectrumLineChartRef.value, lineData, lineLayout);
        //          // 클릭 이벤트 핸들러 추가
                
        //     } catch (err) {
        //         console.log(err);
        //     }
        // }

    
        const specTrumChart = () => {

            const data = store.state.monitor19.diagSpecTrumData;
            try {
                const frequencyRange = data.frequencyRange
                const velocityRange = data.velocityRange

                // 최소 및 최대 속도 계산
                const min_velocity = 0;  // 속도는 음수가 없으므로 최소값은 0으로 설정
                const max_velocity = Math.max(...velocityRange);

                const lineData = [{
                    x: frequencyRange,
                    y: velocityRange,
                    type: 'line',
                    marker: {
                        color: '#EF5656',
                        width: 0.1
                    },
                    orientation: 'v'
                }];

                const lineLayout = {
                    title: {
                        text: 'Frequency Spectrum (Velocity)',
                        font: {
                            color: '#FFF'  // 제목 색상 설정
                        }
                    },
                    height: 400,
                    width: 650,
                    margin: { t: 30, l: 70, r: 70, b: 60 },
                    legend: { font: { color: '#FFF' } },
                    plot_bgcolor: 'transparent',
                    paper_bgcolor: 'transparent',
                    xaxis: { 
                        color: '#FFF',  
                        title: 'Frequency (Hz)', 
                        showline: true, 
                        showgrid: false 
                    },
                    yaxis: { 
                        color: '#FFF',  
                        title: 'Velocity (mm/s)', 
                        showline: true, 
                        showgrid: false, 
                        fixedrange: false, 
                        exponentformat: 'none',
                        range: [min_velocity, max_velocity]  // y축 범위 설정
                    },
                    font: { family: 'KHNPHDRegular' },
                };

                Plotly.newPlot(spectrumLineChartRef.value, lineData, lineLayout);
                // 클릭 이벤트 핸들러 추가

            } catch (err) {
                log.logError(err.message);
            }
        }


        const changeCurrentTime = () => {
            let isLocal = false;
            if (!isLocal) {
                let currentTime = new Date();
                // let currentTime = new Date('2023-03-14 00:00:00');
                let startDate = moment(
                    currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
                ).format('yyyy-MM-DD HH:mm:ss');
                let endDate = moment(currentTime.getTime()).format(
                    'yyyy-MM-DD HH:mm:ss'
                );
                store.state.monitor19.startDate = startDate;
                store.state.monitor19.endDate = endDate;
                todayDate()
                dateToNumber();
                store.dispatch(`monitor19/fetchDiag${store.state.monitor19.nav}`).then(() => {
                    trendChart(); // Call trendChart after fetching data
                });
            }
        }


        onMounted(async () => {
            let isLocal = false;
            if (!isLocal) {
                let currentTime = new Date();
                // let currentTime = new Date('2023-03-14 00:00:00');
                let startDate = moment(
                    currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
                ).format('yyyy-MM-DD HH:mm:ss');
                let endDate = moment(currentTime.getTime()).format(
                    'yyyy-MM-DD HH:mm:ss'
                );
                store.state.monitor19.startDate = startDate;
                store.state.monitor19.endDate = endDate;
            }
            todayDate();
            dateToNumber();
            await store.dispatch('monitor19/fetchDiagPOV')

            trendChart()

        });


        const dateToNumber = () => {
            const appendStartTime = (dateStr) => `${dateStr} 00:00:00`;
            const appendEndTime = (dateStr) => `${dateStr} 23:59:59`;

            if (state.date.from && state.date.to) {
                const fromDateTime = appendStartTime(state.date.from);
                const toDateTime = appendEndTime(state.date.to);

                store.state.monitor19.startDate = fromDateTime;
                store.state.monitor19.endDate = toDateTime;

                state.startStr = state.date.from;
                state.endStr = state.date.to;
            } else if (state.date) {
                const dateTime = appendStartTime(state.date);

                store.state.monitor19.startDate = dateTime;
                store.state.monitor19.endDate = appendEndTime(state.date);

                state.startStr = state.date;
                state.endStr = state.date;
            }
        };

        const todayDate = () => {
            state.date.from = store.state.monitor19.startDate.split(' ')[0];
            state.date.to = store.state.monitor19.endDate.split(' ')[0];
            state.startStr = state.date.from;
            state.endStr = state.date.to;
        }

        const updateInputDate = () => {
            if (state.date.from && state.date.to) {
                state.startStr = state.date.from;
                state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230921] from, to를 같은 날짜로 선택 시 처리
                state.startStr = state.date;
                state.endStr = state.date;
            }
        }

        const searchDate = () => {
            dateToNumber();
            // console.log(store.state.monitor19.startDate)
            store.dispatch(`monitor19/fetchDiag${store.state.monitor19.nav}`).then(() => {
                trendChart(); // Call trendChart after fetching data
            });
        }

        
        return {
            state,
            store,
            trendLineChartRef,
            timeLineChartRef,
            spectrumLineChartRef,
            updateInputDate,
            searchDate,
            trendChart,
            timeWaveChart,
            specTrumChart,
            changeCurrentTime,
            // 모달 관련 추가
            isModalOpen_jd1,
            isModalOpen_jd2,
            isModalOpen_jd3,
            openModal_jd1,
            closeModal_jd1,
            openModal_jd2,
            closeModal_jd2,
            openModal_jd3,
            closeModal_jd3,
            saveChanges,
            selectedPump_jd1,
            selectedMotor_jd1,
            selectedPump_jd2,
            selectedMotor_jd2,
            selectedPump_jd3,
            selectedMotor_jd3,
            pumps_jd1,
            motors_jd1,
            pumps_jd2,
            motors_jd2,
            pumps_jd3,
            motors_jd3,
            selectPump_jd1,
            selectMotor_jd1,
            selectPump_jd2,
            selectMotor_jd2,
            selectPump_jd3,
            selectMotor_jd3,
            pumpFormData,
            motorFormData,
            selectedPumpButton,
            selectedMotorButton,
            selectPumpButton,
            selectMotorButton,
            buttonStyle


            
        };
    },
};
</script>

<style></style>
