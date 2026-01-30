<template>
  <div class="fL songsuLeftBox">
    <div style="height: calc(95%); width: 100%;">
      <!-- AI 펌프 영역 시작 -->
      <div class="fL" style="width: 30%;height: 100%;">
        <div class="ai_pump_start">
          <div class="ai_pump_start2 fL">
            <div class="ai_pump_start2_2 fL">
              <div class="top_name img_circle fL">홍성</div>
              <div class=" fL" style="width: 70%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">예상 전력</div>
                  <span class="detail_value" style="text-align: right;">{{ pwrPrdctA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kW</span>
                </div>
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">예상 관압</div>
                  <span class="detail_value" style="text-align: right;">{{ tubePrsrPrdctA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 30%;">예상 유량</div>
                  <span class="detail_value" style="text-align: right;">{{ flowPrdctA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- 장치 이미지 구역 시작-->
            <div class="fL" style="height: calc(100% - 105px); width: calc(100% - 15px ); margin-left: 15px; ">
              <div class="pump_area_h4_top pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(pumpStatusA[0]) }">#1</div>
              <div v-show="pumpStatusA[0] === 'on'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ freqA1 }}</span>Hz
              </div>
              <div v-show="pumpStatusA[0] === 'off'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">0.00</span>Hz
              </div>
              <div class="pump_area_h4_top pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(pumpStatusA[1]) }">#2</div>
              <div v-show="pumpStatusA[1] === 'on'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ freqA2 }}</span>Hz
              </div>
              <div v-show="pumpStatusA[1] === 'off'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">0.00</span>Hz
              </div>
              <div class="pump_area_h4_top pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(pumpStatusA[2]) }">#3</div>
              <div class="pump_area_h4_top pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(pumpStatusA[3]) }">#4</div>
            </div>
            <!-- 장치 이미지 구역 끝-->
          </div>
          <div class="ai_pump_start_bottom fL">
            <div class="bottom_area fL">
              <div class="top_name img_circle fL">예산</div>
              <div class=" fL" style="width: 70%; height: 100%; display: flex; flex-direction: column;justify-content: center;">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">예상 전력</div>
                  <span class="detail_value" style="text-align: right;">{{ pwrPrdctB }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kW</span>
                </div>
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">예상 관압</div>
                  <span class="detail_value" style="text-align: right;">{{ tubePrsrPrdctB }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 30%;">예상 유량</div>
                  <span class="detail_value" style="text-align: right;">{{ flowPrdctB }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- 펌프 이미지 시작 -->
            <div class="fL" style="height: calc(100% - 80px); width: calc(100% - 15px);  margin-left: 15px;">
              <div class="pump_area_h4_bottom pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(pumpStatusB[0]) }">#1</div>
              <div class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ freqB1 }}</span>Hz
              </div>
              <div class="pump_area_h4_bottom pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(pumpStatusB[1]) }">#2</div>
              <div class="pump_area_h4_bottom pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(pumpStatusB[2]) }">#3</div>
              <div class="pump_area_h4_bottom pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(pumpStatusB[3]) }">#4</div>
            </div>
            <!-- 펌프 이미지 끝 -->
          </div>
        </div>
      </div>
      <!-- AI 펌프 영역 끝 -->
      <div class="ai_pump_arrow_start fL">
        <div style="width: 100%; height:60%;margin-left:-52px">
          <div class="arrow_img blinking fL"></div>
          <div class="arrow_info">
            <span class="ai_text">AI 운영</span>
            <div @click="handleToggleClick" class="toggleBG_BIG" style=" margin-top: 10px;">
              <button ref="toggleButton" class="toggleFG_BIG" style="left: 0;">{{ toggleState }}</button>
            </div>
            <div ref="autoBanArea" style="opacity: 0.2; margin-top: 30px;">
              <input type="radio" ref="aiAuto" id="ai_auto" name="fav_language" value="ai_auto" @change="handleAutoChange1">
							<label for="ai_auto" class="detail_text" style="font-size: 18px;">AI</label><br>
							<input type="radio" ref="aiBanAuto" id="ai_banauto" name="fav_language" value="ai_banauto" @change="handleBanAutoChange1">
							<label for="ai_banauto" class="detail_text" style="font-size: 18px;">AI 추천</label><br>
              <br>
            </div>
          </div>
        </div>
        <!-- 하단 부분 -->
        <div style="width: 100%; height:40%;margin-left:-52px">
          <div class="arrow_img blinking fL"></div>
          <div style="position: absolute;width: 5%;height: 33%;display: flex;justify-content: center;align-items: center;flex-direction: column;">
            <span class="ai_text">AI 운영</span>
            <div @click="handleToggleClick2" class="toggleBG_BIG" style="  margin-top: 10px;">
              <button ref="toggleButton2" class="toggleFG_BIG" style="left: 0;">{{ toggleState2 }}</button>
            </div>
            <div id="autoban_area2" ref= "autoBanArea2" style="opacity: 0.2; margin-top: 30px;">
							<input type="radio" ref="aiAuto2" id="ai_auto2" name="fav_language2" value="ai_auto2" @change="handleAutoChange2">
							<label for="ai_auto2" class="detail_text" style="font-size: 18px;">AI</label><br>
							<input type="radio" ref="aiBanAuto2" id="ai_banauto2" name="fav_language2" value="ai_banauto2" @change="handleBanAutoChange2">
							<label for="ai_banauto2" class="detail_text" style="font-size: 18px;">AI 추천</label><br>
						</div>
          </div>
        </div>
        <!-- 하단 부분 끝 -->
      </div>
      <!-- 펌프영역 시작 -->
      <div class="fL" style="width: 30%;height: 100%;">
        <div class="" style="width: 100%; height:100%; text-align: center; font-size: 20px; color: white;">
          <div class="pump_area fL">
            <div class="pump_area2 fL">
              <div class="top_name img_circle fL">홍성</div>
              <div class=" fL" style="width: 70%;height: 100%; display: flex;flex-direction: column;justify-content: center;">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">전력</div>
                  <span class="detail_value" style="text-align: right;">{{ aiPwrA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kW</span>
                </div>
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">관압</div>
                  <span class="detail_value" style="text-align: right;">{{ aiTubePrsrA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 30%;">유량</div>
                  <span class="detail_value" style="text-align: right;">{{ aiFlowA }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- 상자 중간 부분 시작 -->
            <div class="middle fL">
              <div class="pump_area_h4_top pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(nowPumpStatusA[0]) }">#1</div>
              <div v-show="nowPumpStatusA[0] === 'on' && inverterOnoff === 'on'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ aiFreqA1 }}</span>Hz
              </div>
              <div v-show="nowPumpStatusA[0] === 'off' || inverterOnoff === 'off'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">0.00</span>Hz
              </div>
              <div class="pump_area_h4_top pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(nowPumpStatusA[1]) }">#2</div>
              <div v-show="nowPumpStatusA[1] === 'on' && inverterOnoff === 'on'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ aiFreqA2 }}</span>Hz
              </div>
              <div v-show="nowPumpStatusA[1] === 'off' || inverterOnoff === 'off'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">0.00</span>Hz
              </div>
              <div class="pump_area_h4_top pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(nowPumpStatusA[2]) }">#3</div>
              <div class="pump_area_h4_top pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(nowPumpStatusA[3]) }">#4</div>
            </div>
            <!-- 상자 중간 부분 끝 -->
          </div>
          <!-- 상자 하단 부분 시작 -->
          <div class="pump_area_bottom fL">
            <div class=" fL" style="height: 70px; width: 100%;display: flex;align-items: center;padding: 10px 0 10px 0;">
              <div class="top_name img_circle fL">예산</div>
              <div class=" fL" style="width: 70%;height: 100%; display: flex;flex-direction: column;justify-content: center;">
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">전력</div>
                  <span class="detail_value" style="text-align: right;">{{ aiPwrB }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kW</span>
                </div>
                <div class="detail_textWrap" style="margin: 0 0 5px 0;">
                  <div class="detail_text" style="width: 30%;">관압</div>
                  <span class="detail_value" style="text-align: right;">{{ aiTubePrsrB }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">kg/cm2</span>
                </div>
                <div class="detail_textWrap" style="margin: 0;">
                  <div class="detail_text" style="width: 30%;">유량</div>
                  <span class="detail_value" style="text-align: right;">{{ aiFlowB }}</span>
                  <span class="detail_text" style="margin-left: 10px;width: initial;font-size:14px">m3</span>
                </div>
              </div>
            </div>
            <!-- bottom 이미지 시작 -->
            <div class="bottom_image_area fL">
              <div class="pump_area_h4_bottom pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(nowPumpStatusB[0]) }">#1</div>
              <div v-show="nowPumpStatusB[0] === 'on'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">{{ aiFreqB1 }}</span>Hz
              </div>
              <div v-show="nowPumpStatusB[0] === 'off'" class="fL" style="background-size: 80%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <span class="input_design" style="margin-right: 10px; height: 50%;">0.00</span>Hz
              </div>
              <div class="pump_area_h4_bottom pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(nowPumpStatusB[1]) }">#2</div>
              <div class="pump_area_h4_bottom pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(nowPumpStatusB[2]) }">#3</div>
              <div class="pump_area_h4_bottom pump_img fL" :style="{ backgroundSize: '25%', opacity: getOpacityValue(nowPumpStatusB[3]) }">#4</div>
            </div>
            <!-- bottom 이미지 끝 -->
          </div>
          <!-- 상자 하단 부분 끝 -->
        </div>
      </div>
      <!-- 펌프영역 끝-->
      <!-- 서산 파이프 라인 시작 -->
      <div class="fL" style="width: 30%; height: 36%; margin-top: 10%;">
        <div class="fL" style="width: 25%; height: 100%; margin-left: -3%; margin-top: 14%;">
          <div class="bottom_pipe_line2 fL">
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
          </div>
        </div>
        <div class="fL" style="width:60%; height: 75%;">
          <div class="pipe_right_box fL">
            <div style="width: 100%; height: 3%;"></div>
            <div style="width: 100%; height: 100px;">
              <div class="sub_content_middle_value fL sub_content_font" style="font-size: 18px">서산 분기점 현황</div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 13px; text-align: center;">수석(분) 신 유입유량</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[0] }}</div>
                <span class="sub_content_font" style="width: 24%;">m³/h</span>
              </div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 14px; text-align: center;">구항(분) 압력</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[1] }}</div>
                <span class="sub_content_font" style="width: 21%;">kg/cm2</span>
              </div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 14px; text-align: center;">갈산(분) 압력</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[2] }}</div>
                <span class="sub_content_font" style="width: 21%;">kg/cm2</span>
              </div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 14px; text-align: center;">수석(분) 압력</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[3] }}</div>
                <span class="sub_content_font" style="width: 21%;">kg/cm2</span>
              </div>
            </div>
          </div>
        </div>
        <div class="fL" style="width: 7.5%; height: 100%; margin-top: 14%;">
          <div class="pipe_right_box_x fL">
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
          </div>
        </div>
      </div>
      <!-- 파이프 라인 끝 -->
      <!-- 예산 파이프 라인 시작 -->
      <div class="fL" style="width: 30%; height: 25%; margin-top: 14%;">
        <div class="pipe_line_new fL">
          <div class="bottom_pipe_line2 fL">
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
          </div>
        </div>
        <div class="fL" style="width:60%; height: 65%;">
          <div class="pipe_right_box fL" style="margin-top: 5%;">
            <div style="width: 100%; height: 3%;"></div>
            <div style="width: 100%; height: 100px;">
              <div class="sub_content_middle_value fL sub_content_font" style="font-size: 18px">예산 분기점 현황</div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 14px; text-align: center;">남장(분) 압력</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[4] }}</div>
                <span class="sub_content_font" style="width: 21%;">kg/cm2</span>
              </div>
              <div class="sub_content_middle_value fL">
                <div class="detail_text" style="font-size: 14px; text-align: center;">예산관말(분) 압력</div>
                <div class="sub_input_box" style="width: 23%; height: 40%;">{{ divergeInfo[5] }}</div>
                <span class="sub_content_font" style="width: 21%;">kg/cm2</span>
              </div>
            </div>
          </div>
        </div>
        <div class="fL" style="width: 7.5%; height: 50%; margin-top: 16.5%;">
          <div class="pipe_right_box_x fL">
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
            <div class="pipe_line_arrow blinking blinking1 fL" style="width: 50%"></div>
          </div>
        </div>
      </div>
      <!-- 파이프 라인 끝 -->
    </div>
  </div>
  <!-- 펌프 영역 끝 -->
  <div class="fL songsuRightBox" style="height: 94%">
    <!-- left 서산 물통 라인 -->
    <div class="pipe_big_background" style="height: 54%">
      <div class="pipe_big_gauge" :style="{ height: gaugeHeight[0] }">
        <!-- 여기 퍼센트 바꾸기 -->
        <!-- <div style="color: white; margin-top: -35px; text-align: center;font-family: 'LABDigital';">{{ waterPercent[0] }}</div> -->
      </div>
    </div>
    <!-- left 예산 물통 라인 -->
    <div class="pipe_big_background" style="height: 46%; margin-top: 95%; margin-left: -15%;">
      <div class="pipe_big_gauge" :style="{ height: gaugeHeight[1] }">
        <!-- 여기 퍼센트 바꾸기 -->
        <!-- <div style="color: white; margin-top: -35px; text-align: center;font-family: 'LABDigital';">{{ waterPercent[1] }}</div> -->
      </div>
    </div>
    <!-- right 라인 -->
    <div class="pipes_wrap">
      <SongsuWaterBox ref="waterBox"/>
    </div>
  </div>
  <transition name="modal" appear v-show="showModal">
    <div class="modal modal-overlay">
      <div class="modal-window">
        <div class="modal-content">
          <div class="k-window" style="padding-top: 0px;min-width: 90px; min-height: 50px;width: 1100px;height: 650px;">
            <div style="padding: 60px 45px; height: 100%; width: 100%; box-sizing: border-box;">
              <div style="height: 85%; width: 100%; ">
                <div class="popup__title" style="font-size: 18px;">현재 운영 <div class="detail_text" style="width: 14%;margin-left: 11%">제어순서</div>
                  <div class="detail_value" style="text-align: left;font-family: 'KHNPHDRegular';width: 22%;color:#fff">{{ operateNum }}</div>
                  <div class="detail_text" style="width: 14%;">운영모드</div>
                  <div class="detail_value" style="text-align: left;font-family: 'KHNPHDRegular';width: 22%;color:#fff">{{ operateMode }}</div>
                </div>
                <!--  운영 펌프 영역 시작 -->
                <div class="fL" style="width: 100%;height: 30%;">
                  <div class="" style="width: 100%;height:100%;text-align: center;font-size: 20px;color: #fff;">
                    <div class=" fL" style="height: 100%; width: 100%;">
                      <div class="fL" style="height: 100%; width: 100%; margin-left: 4px; display: flex;">
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[0]) }"> #1 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[1]) }"> #2 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[2]) }"> #3 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[3]) }"> #4 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[4]) }"> #5 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[5]) }"> #6 </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--  운영 펌프 영역 끝-->
                <div class="fadein fL modal_arrow_img"></div>
                <div class="popup__title" style="font-size: 18px;">AI 분석</div>
                <!-- AI 펌프 영역 시작 -->
                <div class="fL" style="width: 100%;height: 30%;">
                  <div class="" style="width: 100%;height:100%;text-align: center;font-size: 20px;color: #fff;">
                    <div class=" fL" style="height: 100%; width: 100%;">
                      <div class="fL" style="height: 100%; width: 100%; margin-left: 4px; display: flex;">
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[0]) }"> #1 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[1]) }"> #2 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[2]) }"> #3 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[3]) }"> #4 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[4]) }"> #5 </div>
                        <div class="pump_area_w4 pop_pump_img" :style="{ backgroundSize: '70%', opacity: getOpacityValue(pumpStatusA[5]) }"> #6 </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- AI 펌프 영역 끝-->
              </div>
              <div style="width: 100%; height: 15%; display: flex; flex-direction: column; align-items: center;">
                <span style="color: #FFF;">AI 분석 결과를 적용하시겠습니까?</span>
                <span style="color: #FFF;">{{ timeCount }}</span>
                <!-- popup_button -->
                <div class="popup_button">
                  <!-- btn__cancel -->
                  <div class="popup__btn popup__btn__cancel cancleBtn" @click="cancelPTR">취소</div>
                  <!-- btn__chagne -->
                  <div class="popup__btn popup__btn__change" @click="updatePTR">적용</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="modal" appear v-show="showModal2">
    <div class="modal modal-overlay">
      <div class="modal-window">
        <div class="modal-content">
          <div class="k-window" style="padding-top: 0px;min-width: 90px; min-height: 50px; width: 463px; height: 213px;">
            <div style="padding: 25px; height: 100%; width: 100%; box-sizing: border-box;">
              <!-- popup__title -->
              <div class="popup__title">
                <!-- popup__icon -->
                <div class="popup__icon"></div>
                <span>알림</span>
              </div>
              <!-- popoup__body -->
              <div class="popoup__body">
                <span style="font-size: 20px; color: white;">{{ popupMsg }}</span>
              </div>
              <!-- popup_button -->
              <div class="popup_button">
                <!-- btn__cancel -->
                <div class="popup__btn popup__btn__cancel cancleBtn" @click="cancelHMI">취소</div>
                <!-- btn__chagne -->
                <div class="popup__btn popup__btn__change" @click="updateHMI">적용</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { nc } from '@/utils/utils.js'
import SongsuWaterBox from '@/components/AI/songsu/SongsuWaterBoxHS.vue'

export default {
  components: { SongsuWaterBox },
  setup (props, { emit }) {
    const store = useStore()
    const getPopup = computed(() => store.getters['songsu/getGetPopup'])
    // const insertPopup = computed(() => store.getters['songsu/getInsertPopup'])
    const insertPopup2 = computed(() => store.getters['songsu/getInsertPopup2'])
    const insertPopup3 = computed(() => store.getters['songsu/getInsertPopup3'])
    // const updateCTR = computed(() => store.getters['songsu/getUpdateCTR_PRF_PMPMST_INF'])
    const ptrCtrInf = computed(() => store.getters['songsu/getPTR_CTR_INF'])
    const songsuSelect = computed(() => store.getters['songsu/getSongsuSelect'])
    const pumpSelect = computed(() => store.getters['songsu/getPumpSelect'])
    const interpuppt = computed(() => store.getters['songsu/getInterpuppt'])
    const insertAIonOff = computed(() => store.getters['songsu/getInsertAIonOff'])

    const interpupptData = reactive([])
    const getPumpTime = ref('')
    const operateNum = ref('')
    const operateMode = ref('')
    const pwrPrdctA = ref('0')
    const tubePrsrPrdctA = ref('0')
    const flowPrdctA = ref('0')
    const inverterOnoff = ref('off')
    const freqA1 = ref('0.00')
    const freqA2 = ref('0.00')
    const pwrPrdctB = ref('0')
    const tubePrsrPrdctB = ref('0')
    const flowPrdctB = ref('0')
    const freqB1 = ref('0.00')
    const aiPwrA = ref('0')
    const aiTubePrsrA = ref('0')
    const aiFlowA = ref('0')
    const aiFreqA1 = ref('0.00')
    const aiFreqA2 = ref('0.00')
    const aiPwrB = ref('0')
    const aiTubePrsrB = ref('0')
    const aiFlowB = ref('0')
    const aiFreqB1 = ref('0.00')
    const divergeInfo = reactive([0, 0, 0, 0, 0, 0])
    const toggleState = ref('OFF')
    const toggleState2 = ref('OFF')
    const autoBanArea = ref(null)
    const autoBanArea2 = ref(null)
    const toggleButton = ref(null)
    const toggleButton2 = ref(null)
    const aiAuto = ref(null)
    const aiBanAuto = ref(null)
    const aiAuto2 = ref(null)
    const aiBanAuto2 = ref(null)
    const nowPumpStatusA = reactive(['off', 'off', 'off', 'off'])
    const nowPumpStatusB = reactive(['off', 'off', 'off', 'off'])
    const pumpStatusA = reactive(['off', 'off', 'off', 'off'])
    const pumpStatusB = reactive(['off', 'off', 'off', 'off'])
    const gaugeHeight = reactive(['0%', '0%'])
    const waterPercent = reactive(['0', '0'])
    const showModal = ref(false)
    const timeCount = ref(null)
    const showModal2 = ref(false)
    const popupMsg = ref('')
    const PumpIdx = ref('')
    const executeInterval = ref(null)
    const waterBox = ref(null)

    const getOpacityValue = (status) => {
      return status === 'on' ? 1 : 0.25
    }

    const handleToggleClick = async () => {
      // 서산 AI 버튼
      try {
        // if (!checkInterpupptData()) {
        //   return
        // }

        let confirmMessage = ''
        if (toggleState.value === 'OFF') {
          confirmMessage = '홍성 AI 운영을 AI 추천 모드로 하시겠습니까?'
          if (confirm(confirmMessage)) {
            // insertAIonOff DB 연동
            const actions = [
              { search: '600-456-EMS-1001', search2: '0' },
              { search: '600-456-EMS-1002', search2: '0' },
              { search: '600-456-EMS-1003', search2: '1' }
            ]
            const result = await actionInsertAIonOff(actions)
            if (result) {
              toggleState.value = 'AI'
              toggleButton.value.style.background = '#b4dffa'
              toggleButton.value.style.left = '40px'
              toggleState.value = 'AI'
              autoBanArea.value.style.opacity = 1
              aiAuto.value.disabled = false
              aiBanAuto.value.disabled = false
              aiAuto.value.checked = false
              aiAuto.value.nextElementSibling.style.opacity = '0.3'
              aiBanAuto.value.checked = true
              aiBanAuto.value.nextElementSibling.style.opacity = '1'
              toggleActionStart(toggleButton.value, 'TO_RIGHT')
            } else {
              alert('1분 후에 다시 시도해주세요.')
            }
          }
        } else {
          confirmMessage = '홍성 AI 운영을 off 하시겠습니까?'
          if (confirm(confirmMessage)) {
            // insertAIonOff DB 연동
            const actions = [
              { search: '600-456-EMS-1001', search2: '1' },
              { search: '600-456-EMS-1002', search2: '0' },
              { search: '600-456-EMS-1003', search2: '0' }
            ]
            const result = await actionInsertAIonOff(actions)
            if (result) {
              // // AI 운영 off 후 insertPopup3 DB 연동
              // await store.dispatch('songsu/fetchInsertPopup3')
              // const jsonData = JSON.parse(JSON.stringify(insertPopup3.value))
              // if (jsonData.message !== 'ok') {
              //   // 실패했을 경우에 대한 처리는 기존 소스에 없음
              //   console.log('action: fetchInsertPopup3', ' error message: ', jsonData.message)
              // }
              toggleState.value = 'OFF'
              toggleButton.value.style.left = '0px'
              toggleButton.value.style.background = '#b4dffa4d'
              toggleState.value = 'OFF'
              autoBanArea.value.style.opacity = 0.2
              aiAuto.value.disabled = true
              aiBanAuto.value.disabled = true
              aiAuto.value.checked = false
              aiAuto.value.nextElementSibling.style.opacity = '0.3'
              aiBanAuto.value.checked = false
              aiBanAuto.value.nextElementSibling.style.opacity = '0.3'
              toggleActionStart(toggleButton.value, 'TO_LEFT')
            } else {
              alert('1분 후에 다시 시도해주세요.')
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleToggleClick2 = async () => {
      // 예산 AI 버튼
      try {
        // if (!checkInterpupptData()) {
        //   return
        // }
        let confirmMessage = ''
        if (toggleState2.value === 'OFF') {
          confirmMessage = '예산 AI 운영을 AI 추천 모드로 하시겠습니까?'
          if (confirm(confirmMessage)) {
            // insertAIonOff DB 연동
            const actions = [
              { search: '600-456-EMS-2001', search2: '0' },
              { search: '600-456-EMS-2002', search2: '0' },
              { search: '600-456-EMS-2003', search2: '1' }
            ]
            const result = await actionInsertAIonOff(actions)
            if (result) {
              toggleState2.value = 'AI'
              toggleButton2.value.style.background = '#b4dffa'
              autoBanArea2.value.style.opacity = 1
              aiAuto2.value.disabled = false
              aiBanAuto2.value.disabled = false
              aiAuto2.value.checked = false
              aiAuto2.value.nextElementSibling.style.opacity = '0.3'
              aiBanAuto2.value.checked = true
              aiBanAuto2.value.nextElementSibling.style.opacity = '1'
              toggleActionStart(toggleButton2.value, 'TO_RIGHT')
            } else {
              alert('1분 후에 다시 시도해주세요.')
            }
          }
        } else {
          confirmMessage = '예산 AI 운영을 off 하시겠습니까?'
          if (confirm(confirmMessage)) {
            // insertAIonOff DB 연동
            const actions = [
              { search: '600-456-EMS-2001', search2: '1' },
              { search: '600-456-EMS-2002', search2: '0' },
              { search: '600-456-EMS-2003', search2: '0' }
            ]
            const result = await actionInsertAIonOff(actions)
            if (result) {
              // // AI 운영 off 후 insertPopup3 DB 연동
              // await store.dispatch('songsu/fetchInsertPopup3')
              // const jsonData = JSON.parse(JSON.stringify(insertPopup3.value))
              // if (jsonData.message !== 'ok') {
              //   // 실패했을 경우에 대한 처리는 기존 소스에 없음
              //   console.log('action: fetchInsertPopup3', ' error message: ', jsonData.message)
              // }
              toggleState2.value = 'OFF'
              toggleButton2.value.style.background = '#b4dffa4d'
              autoBanArea2.value.style.opacity = 0.2
              aiAuto2.value.disabled = true
              aiBanAuto2.value.disabled = true
              aiAuto2.value.checked = false
              aiAuto2.value.nextElementSibling.style.opacity = '0.3'
              aiBanAuto2.value.checked = false
              aiBanAuto2.value.nextElementSibling.style.opacity = '0.3'
              toggleActionStart(toggleButton2.value, 'TO_LEFT')
            } else {
              alert('1분 후에 다시 시도해주세요.')
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const checkInterpupptData = () => {
      // 토출밸브 체크
      console.log('checkInterpupptData: ', interpupptData.value[0].a, interpupptData.value[0].b,
        interpupptData.value[0].c, interpupptData.value[0].d)
      if (
        (interpupptData.value[0].a === '0' ||
          interpupptData.value[0].b === '0' ||
          interpupptData.value[0].c === '0' ||
          interpupptData.value[0].d === '0') ||
        (interpupptData.value[0].a === '0.0000' ||
          interpupptData.value[0].b === '0.0000' ||
          interpupptData.value[0].c === '0.0000' ||
          interpupptData.value[0].d === '0.0000')
      ) {
        alert('토출밸브로 인해 제어가 불가능합니다.')
        return false
      }
      return true
    }

    const toggleActionStart = (toggleBtn, LR) => {
      let left = parseInt(toggleBtn.style.left)
      const intervalID = setInterval(() => {
        left += LR === 'TO_RIGHT' ? 5 : -5
        if (left >= 0 && left <= 40) {
          toggleBtn.style.left = left + 'px'
        }
      }, 10)
      setTimeout(() => {
        clearInterval(intervalID)
      }, 400)
    }

    const handleAutoChange1 = async () => {
      // AI 자동 선택
      try {
        if (confirm('홍성 AI 운영을 AI 모드로 하시겠습니까?')) {
          // insertAIonOff DB 연동
          const actions = [
            { search: '600-456-EMS-1001', search2: '0' },
            { search: '600-456-EMS-1002', search2: '1' },
            { search: '600-456-EMS-1003', search2: '0' }
          ]
          const result = await actionInsertAIonOff(actions)
          if (result) {
            aiAuto.value.nextElementSibling.style.opacity = '1'
            aiBanAuto.value.nextElementSibling.style.opacity = '0.3'
          } else {
            alert('1분 후에 다시 시도해주세요.')
          }
        } else {
          aiAuto.value.disabled = false
          aiBanAuto.value.disabled = false
          aiBanAuto.value.checked = true
          aiBanAuto.value.nextElementSibling.style.opacity = '1'
          aiAuto.value.checked = false
          aiAuto.value.nextElementSibling.style.opacity = '0.3'
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleBanAutoChange1 = async () => {
      // AI 반자동 선택
      try {
        if (confirm('홍성 AI 운영을 AI 추천 모드로 하시겠습니까?')) {
          // insertAIonOff DB 연동
          const actions = [
            { search: '600-456-EMS-1001', search2: '0' },
            { search: '600-456-EMS-1002', search2: '0' },
            { search: '600-456-EMS-1003', search2: '1' }
          ]
          const result = await actionInsertAIonOff(actions)
          if (result) {
            aiBanAuto.value.nextElementSibling.style.opacity = '1'
            aiAuto.value.nextElementSibling.style.opacity = '0.3'
          } else {
            alert('1분 후에 다시 시도해주세요.')
          }
        } else {
          aiAuto.value.disabled = false
          aiBanAuto.value.disabled = false
          aiAuto.value.checked = true
          aiAuto.value.nextElementSibling.style.opacity = '1'
          aiBanAuto.value.checked = false
          aiBanAuto.value.nextElementSibling.style.opacity = '0.3'
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleAutoChange2 = async () => {
      // AI 자동 선택
      try {
        if (confirm(' 예산 AI 운영을 AI 모드로 하시겠습니까?')) {
          // insertAIonOff DB 연동
          const actions = [
            { search: '600-456-EMS-2001', search2: '0' },
            { search: '600-456-EMS-2002', search2: '1' },
            { search: '600-456-EMS-2003', search2: '0' }
          ]
          const result = await actionInsertAIonOff(actions)
          if (result) {
            aiAuto2.value.nextElementSibling.style.opacity = '1'
            aiBanAuto2.value.nextElementSibling.style.opacity = '0.3'
          } else {
            alert('1분 후에 다시 시도해주세요.')
          }
        } else {
          aiAuto2.value.disabled = false
          aiBanAuto2.value.disabled = false
          aiBanAuto2.value.checked = true
          aiBanAuto2.value.nextElementSibling.style.opacity = '1'
          aiAuto2.value.checked = false
          aiAuto2.value.nextElementSibling.style.opacity = '0.3'
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleBanAutoChange2 = async () => {
      // AI 반자동 선택
      try {
        if (confirm('예산 AI 운영을 AI 추천 모드로 하시겠습니까?')) {
          // insertAIonOff DB 연동
          const actions = [
            { search: '600-456-EMS-2001', search2: '0' },
            { search: '600-456-EMS-2002', search2: '0' },
            { search: '600-456-EMS-2003', search2: '1' }
          ]
          const result = await actionInsertAIonOff(actions)
          if (result) {
            aiBanAuto2.value.nextElementSibling.style.opacity = '1'
            aiAuto2.value.nextElementSibling.style.opacity = '0.3'
          } else {
            alert('1분 후에 다시 시도해주세요.')
          }
        } else {
          aiAuto2.value.disabled = false
          aiBanAuto2.value.disabled = false
          aiAuto2.value.checked = true
          aiAuto2.value.nextElementSibling.style.opacity = '1'
          aiBanAuto2.value.checked = false
          aiBanAuto2.value.nextElementSibling.style.opacity = '0.3'
        }
      } catch (err) {
        console.log(err)
      }
    }

    const actionInsertAIonOff = async (actions) => {
      try {
        for (const action of actions) {
          await store.dispatch('songsu/fetchInsertAIonOff', action)
          if (insertAIonOff.value) {
            const jsonData = JSON.parse(JSON.stringify(insertAIonOff.value))
            if (jsonData.message !== 'ok') {
              console.log('action: ', action, ' error message: ', jsonData.message)
              return false
            }
          } else {
            return false
          }
        }
      } catch (err) {
        console.log(err)
      }

      return true
    }

    const getData = async () => {
      try {
        // 데이터 수집시간 가져오기
        await store.dispatch('songsu/fetchInterpuppt')
        if (interpuppt.value) {
          const arr = JSON.parse(JSON.stringify(interpuppt.value))
          if (arr.interpuppt) {
            interpupptData.value = arr.interpuppt
          } else {
            console.log('interpuppt is empty')
          }
          if (arr.getPumpTime && arr.getPumpTime.length > 0) {
            const minT = Math.min(...arr.getPumpTime.map((o) => o.t))
            let idx = 0
            for (let i = 0; i < arr.getPumpTime.length; i++) {
              if (arr.getPumpTime[i].t === minT) {
                idx = i
                break
              }
            }
            getPumpTime.value = arr.getPumpTime[idx].ts
            emit('update:getPumpTime', getPumpTime.value)
          } else {
            console.log('getPumpTime is empty')
          }
        }
        // 송수펌프 데이터 가져오기
        const param = {
          search: '홍성_가'
        }
        await store.dispatch('songsu/fetchSongsuSelect', param)
        if (songsuSelect.value) {
          const arr = JSON.parse(JSON.stringify(songsuSelect.value))
          console.log('songsuSelect: ', arr)
          if (arr.data1 && arr.data1.length > 0) {
            // 배수지 컴포넌트에 데이터 업데이트
            const component = waterBox.value
            if (component && component.updateData) {
              // 데이터 인터페이스 확정 후 구현 예정
              component.updateData(arr.data1)
            }
          }
          if (arr.data3 && arr.data3.length > 0) {
            aiOnoffStatus(arr.data3)
          }
          if (arr.data2 && arr.data2.length > 0) {
            leftmappingHtml(arr.data2)
          }
          getPrediction()
          // getAiPopup()
        }
      } catch (err) {
        console.log(err)
      }
    }

    const aiOnoffStatus = (data) => {
      console.log('ai상태: ', data[0].ai_onoff, data[0].ai_onoff_auto,data[0].ai_onoff_auto_ban)
      try {
        if (data[0].ai_onoff === 1 || data[0].ai_onoff === '1.0000') { 
          //ai미사용
          toggleButton.value.style.background = '#b4dffa'
          toggleButton.value.style.left = '0px'
          toggleState.value = 'OFF'
          autoBanArea.value.style.opacity = 1
          aiAuto.value.disabled = true
          aiBanAuto.value.disabled = true
        } else {  
          //ai 사용중
          toggleButton.value.style.left = '40px'
          toggleButton.value.style.background = '#b4dffa'
          toggleState.value = 'AI'

          if (data[0].ai_onoff_auto === 0 || data[0].ai_onoff_auto === '0.0000') {  
            //AI반자동
            aiAuto.value.checked = false
            aiAuto.value.nextElementSibling.style.opacity = '0.3'
            aiBanAuto.value.checked = true
            aiBanAuto.value.nextElementSibling.style.opacity = '1'

            aiAuto.value.disabled = false
            aiBanAuto.value.disabled = false
            autoBanArea.value.style.opacity = 1
            
          } else { 
            //AI자동
            aiAuto.value.checked = true
            aiAuto.value.nextElementSibling.style.opacity = '1'
            aiBanAuto.value.checked = false
            aiBanAuto.value.nextElementSibling.style.opacity = '0.3'

            aiAuto.value.disabled = false
            aiBanAuto.value.disabled = false
            autoBanArea.value.style.opacity = 1
          }
        }

        if (data[0].ys_ai_onoff === 1 || data[0].ys_ai_onoff === '1.0000') {
          //ai미사용
          toggleButton2.value.style.background = '#b4dffa'
          toggleButton2.value.style.left = '0px'
          toggleState2.value = 'OFF'
          autoBanArea2.value.style.opacity = 1
          aiAuto2.value.disabled = true
          aiBanAuto2.value.disabled = true

        } else {
          //ai 사용중
          toggleButton2.value.style.left = '40px'
          toggleButton2.value.style.background = '#b4dffa'
          toggleState2.value = 'AI'  

          if (data[0].ys_ai_onoff_auto === 0 || data[0].ys_ai_onoff_auto === '0.0000') {  
            //AI반자동
            console.log('반자동동')
            aiAuto2.value.checked = false
            aiAuto2.value.nextElementSibling.style.opacity = '0.3'
            aiBanAuto2.value.checked = true
            aiBanAuto2.value.nextElementSibling.style.opacity = '1'

            aiAuto2.value.disabled = false
            aiBanAuto2.value.disabled = false
            autoBanArea2.value.style.opacity = 1
            
          } else { 
            //AI자동
            console.log('자동')
            aiAuto2.value.checked = true
            aiAuto2.value.nextElementSibling.style.opacity = '1'
            aiBanAuto2.value.checked = false
            aiBanAuto2.value.nextElementSibling.style.opacity = '0.3'

            aiAuto2.value.disabled = false
            aiBanAuto2.value.disabled = false
            autoBanArea2.value.style.opacity = 1
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const leftmappingHtml = (data2) => {
      try {
        // 서산
        if (data2[0].펌프1가동상태운영_서산 === null || data2[0].펌프1가동상태운영_예산 === null) {
          console.log('data empty pass')
        } else {
          insertPumpVal(aiPwrA, Number(data2[0].서산전력).toFixed(2))
          insertPumpVal(aiTubePrsrA, Number(data2[0].서산관압).toFixed(2))
          insertPumpVal(aiFlowA, Number(data2[0].서산유량).toFixed(2))
          nowPumpStatusA[0] = (data2[0].펌프1가동상태운영_서산 === '1.0' || data2[0].펌프1가동상태운영_서산 === '1.0000' || data2[0].펌프1가동상태운영_서산 === '1' || data2[0].펌프1가동상태운영_서산 === 1) ? 'on' : 'off'
          nowPumpStatusA[1] = (data2[0].펌프2가동상태운영_서산 === '1.0' || data2[0].펌프2가동상태운영_서산 === '1.0000' || data2[0].펌프2가동상태운영_서산 === '1' || data2[0].펌프2가동상태운영_서산 === 1) ? 'on' : 'off'
          nowPumpStatusA[2] = (data2[0].펌프3가동상태운영_서산 === '1.0' || data2[0].펌프3가동상태운영_서산 === '1.0000' || data2[0].펌프3가동상태운영_서산 === '1' || data2[0].펌프3가동상태운영_서산 === 1) ? 'on' : 'off'
          nowPumpStatusA[3] = (data2[0].펌프4가동상태운영_서산 === '1.0' || data2[0].펌프4가동상태운영_서산 === '1.0000' || data2[0].펌프4가동상태운영_서산 === '1' || data2[0].펌프4가동상태운영_서산 === 1) ? 'on' : 'off'
          insertPumpVal(aiFreqA1, Number(data2[0].펌프1_2주파수_서산).toFixed(2))
          insertPumpVal(aiFreqA2, Number(data2[0].펌프1_2주파수_서산).toFixed(2))
          // 예산
          insertPumpVal(aiPwrB, Number(data2[0].예산전력).toFixed(2))
          insertPumpVal(aiTubePrsrB, Number(data2[0].예산관압).toFixed(2))
          insertPumpVal(aiFlowB, Number(data2[0].예산유량).toFixed(2))
          nowPumpStatusB[0] = (data2[0].펌프1가동상태운영_예산 === '1.0' || data2[0].펌프1가동상태운영_예산 === '1.0000' || data2[0].펌프1가동상태운영_예산 === '1' || data2[0].펌프1가동상태운영_예산 === 1) ? 'on' : 'off'
          nowPumpStatusB[1] = (data2[0].펌프2가동상태운영_예산 === '1.0' || data2[0].펌프2가동상태운영_예산 === '1.0000' || data2[0].펌프2가동상태운영_예산 === '1' || data2[0].펌프2가동상태운영_예산 === 1) ? 'on' : 'off'
          nowPumpStatusB[2] = (data2[0].펌프3가동상태운영_예산 === '1.0' || data2[0].펌프3가동상태운영_예산 === '1.0000' || data2[0].펌프3가동상태운영_예산 === '1' || data2[0].펌프3가동상태운영_예산 === 1) ? 'on' : 'off'
          nowPumpStatusB[3] = (data2[0].펌프4가동상태운영_예산 === '1.0' || data2[0].펌프4가동상태운영_예산 === '1.0000' || data2[0].펌프4가동상태운영_예산 === '1' || data2[0].펌프4가동상태운영_예산 === 1) ? 'on' : 'off'
          insertPumpVal(aiFreqB1, Number(data2[0].펌프1주파수_예산).toFixed(2))
          inverterOnoff.value = (data2[0].인버터운영 === '1.0' || data2[0].인버터운영 === '1.0000' || data2[0].인버터운영 === '1' || data2[0].인버터운영 === 1) ? 'on' : 'off'
        }
      } catch (err) {
        console.log(err)
      }
    }

    const insertPumpVal = (id, data) => {
      if (nc(data)) {
        id.value = data
      }
    }

    const getPrediction = async () => {
      try {
        // 예상 결과 데이터 연동
        const param = {
          search: '홍성_가'
        }
        await store.dispatch('songsu/fetchPumpSelect', param)
        if (pumpSelect.value) {
          const arr = JSON.parse(JSON.stringify(pumpSelect.value))
          if (!arr || arr.length === 0) {
            console.log('pumpSelect is empty')
            return
          }
          console.log('pumpSelect: ', arr)
          const data3 = arr.data3
          const data4 = arr.data4
          if (data3 && data3.length > 0) {
            // 서산
            pumpStatusA[0] = (data3[0].펌프1가동상태운영_서산 === '1.0' || data3[0].펌프1가동상태운영_서산 === '1.0000' || data3[0].펌프1가동상태운영_서산 === '1' || data3[0].펌프1가동상태운영_서산 === 1) ? 'on' : 'off'
            pumpStatusA[1] = (data3[0].펌프2가동상태운영_서산 === '1.0' || data3[0].펌프2가동상태운영_서산 === '1.0000' || data3[0].펌프2가동상태운영_서산 === '1' || data3[0].펌프2가동상태운영_서산 === 1) ? 'on' : 'off'
            pumpStatusA[2] = (data3[0].펌프3가동상태운영_서산 === '1.0' || data3[0].펌프3가동상태운영_서산 === '1.0000' || data3[0].펌프3가동상태운영_서산 === '1' || data3[0].펌프3가동상태운영_서산 === 1) ? 'on' : 'off'
            pumpStatusA[3] = (data3[0].펌프4가동상태운영_서산 === '1.0' || data3[0].펌프4가동상태운영_서산 === '1.0000' || data3[0].펌프4가동상태운영_서산 === '1' || data3[0].펌프4가동상태운영_서산 === 1) ? 'on' : 'off'
            insertPumpVal(pwrPrdctA, Number(data3[0].서산분석결과예상전력).toFixed(2))
            insertPumpVal(tubePrsrPrdctA, Number(data3[0].서산분석결과예상관압).toFixed(2))
            insertPumpVal(flowPrdctA, Number(data3[0].서산분석결과예상유량).toFixed(2))
            insertPumpVal(freqA1, Number(data3[0].펌프1주파수_서산).toFixed(2))
            insertPumpVal(freqA2, Number(data3[0].펌프2주파수_서산).toFixed(2))
            // 예산
            pumpStatusB[0] = (data3[0].펌프1가동상태운영_예산 === '1.0' || data3[0].펌프1가동상태운영_예산 === '1.0000' || data3[0].펌프1가동상태운영_예산 === '1' || data3[0].펌프1가동상태운영_예산 === 1) ? 'on' : 'off'
            pumpStatusB[1] = (data3[0].펌프2가동상태운영_예산 === '1.0' || data3[0].펌프2가동상태운영_예산 === '1.0000' || data3[0].펌프2가동상태운영_예산 === '1' || data3[0].펌프2가동상태운영_예산 === 1) ? 'on' : 'off'
            pumpStatusB[2] = (data3[0].펌프3가동상태운영_예산 === '1.0' || data3[0].펌프3가동상태운영_예산 === '1.0000' || data3[0].펌프3가동상태운영_예산 === '1' || data3[0].펌프3가동상태운영_예산 === 1) ? 'on' : 'off'
            pumpStatusB[3] = (data3[0].펌프4가동상태운영_예산 === '1.0' || data3[0].펌프4가동상태운영_예산 === '1.0000' || data3[0].펌프4가동상태운영_예산 === '1' || data3[0].펌프4가동상태운영_예산 === 1) ? 'on' : 'off'
            insertPumpVal(pwrPrdctB, Number(data3[0].예산분석결과예상전력).toFixed(2))
            insertPumpVal(tubePrsrPrdctB, Number(data3[0].예산분석결과예상관압).toFixed(2))
            insertPumpVal(flowPrdctB, Number(data3[0].예산분석결과예상유량).toFixed(2))
            insertPumpVal(freqB1, Number(data3[0].펌프1주파수_예산).toFixed(2))
            // 제어순서, 운영모드
            operateNum.value = data3[0].운영대수 ? data3[0].운영대수 : ''
            emit('update:operateNum', operateNum.value)
            operateMode.value = data3[0].운영모드 ? data3[0].운영모드 : ''
            emit('update:operateMode', operateMode.value)
            // 분기점 현황 업데이트
            // insertPumpVal(divergeInfo[0], Number(data3[0].수석신유입유량).toFixed(2))
            // insertPumpVal(divergeInfo[1], Number(data3[0].구항압력).toFixed(2))
            // insertPumpVal(divergeInfo[2], Number(data3[0].갈산압력).toFixed(2))
            // insertPumpVal(divergeInfo[3], Number(data3[0].수석압력).toFixed(2))
            // insertPumpVal(divergeInfo[4], Number(data3[0].남장압력).toFixed(2))
            // insertPumpVal(divergeInfo[5], Number(data3[0].예산관말압력).toFixed(2))
            // 물통 높이 추후 구현 필요
            gaugeHeight[0] = '0%'
            gaugeHeight[1] = '0%'
            waterPercent[0] = '0'
            waterPercent[1] = '0'
            // if (nc(MIN_PRSR.value)) {
            //   if (MIN_PRSR.value === '0' || MIN_PRSR.value === '0.00') {
            //     gaugeHeight.value = '0%'
            //     waterPercent.value = '0'
            //   } else {
            //     const percent = Number(MIN_PRSR.value / 8.229 * 100.00).toFixed(0)
            //     if (percent <= 100) {
            //       gaugeHeight.value = percent + '%'
            //     }
            //     waterPercent.value = MIN_PRSR.value
            //   }
            // } else {
            //   gaugeHeight.value = '0%'
            //   waterPercent.value = '0'
            // }
          }
          if (data4 && data4.length > 0) {
            // 분기점 현황 업데이트
            divergeInfo[0] = Number(data4[0].value).toFixed(2)
            divergeInfo[1] = Number(data4[1].value).toFixed(2)
            divergeInfo[2] = Number(data4[2].value).toFixed(2)
            divergeInfo[3] = Number(data4[3].value).toFixed(2)
            divergeInfo[4] = Number(data4[4].value).toFixed(2)
            divergeInfo[5] = Number(data4[5].value).toFixed(2)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    let timer
    const getAiPopup = async () => {
      // AI 적용 팝업
      try {
        clearInterval(timer)
        await store.dispatch('songsu/fetchPTR_CTR_INF')
        if (ptrCtrInf.value) {
          const arr = JSON.parse(JSON.stringify(ptrCtrInf.value))
          console.log('ptrCtrInf: ', arr)
          let confirmFlag = '0'
          let targetTime = '0'
          let count = 0
          if (arr.data && arr.data.length > 0) {
            if (arr.data[0].value === '1' || arr.data[0].value === 1) {
              confirmFlag = '1'
              targetTime = arr.data[0].diff.split(':')
              count = 60 - Number(targetTime[2])
              console.log('targetTime: ', targetTime, ' count: ', count)
            }
            if (confirmFlag === '1' && count > 10) {
              showModal.value = true
              timer = setInterval(() => {
                timeCount.value = count
                count--
                if (count < 10) {
                  cancelPTR()
                }
              }, 1000)
            }
          } else {
            console.log('getAiPopup data is empty')
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const closeModal = (data) => {
      showModal.value = false
    }

    const cancelPTR = async () => {
      // insertPopup2 DB 연동
      try {
        await store.dispatch('songsu/fetchInsertPopup2', { search: '0' })
        if (insertPopup2.value) {
          const jsonData = JSON.parse(JSON.stringify(insertPopup2.value))
          if (jsonData.message !== 'ok') {
            // 실패했을 경우에 대한 처리는 기존 소스에 없음
            console.log('action: fetchInsertPopup2', ' error message: ', jsonData.message)
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        clearInterval(timer)
        closeModal()
      }
    }

    const getPumpPopup = async () => {
      // 펌프 컨트롤 팝업
      try {
        await store.dispatch('songsu/fetchGetPopup')
        if (getPopup.value) {
          const arr = JSON.parse(JSON.stringify(getPopup.value))
          console.log('getPopup: ', arr.data)
          let flag = true
          if (arr.data && arr.data.length > 0) {
            for (let i = 0; i < arr.data.length; i++) {
              if (arr.data[i].USE_YN !== arr.data[i].PMS_USE_YN) {
                flag = false
                PumpIdx.value = arr.data[i].PMP_GRP_IDX
                break
              }
            }
            if (!flag) {
              popupMsg.value = `${PumpIdx.value}번 펌프를 끄시겠습니까?`
              showModal2.value = true
            }
          } else {
            console.log('getPopup data is empty')
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const executeApis = () => {
      getData()
      getPumpPopup()
    }

    onMounted(() => {
      executeApis()
      // 10초 마다 데이터 갱신 및 AI 팝업 확인
      executeInterval.value = setInterval(executeApis, 10000)
    })

    onUnmounted(() => {
      clearInterval(executeInterval.value)
    })

    return {
      interpupptData,
      getPumpTime,
      operateNum,
      operateMode,
      pwrPrdctA,
      tubePrsrPrdctA,
      flowPrdctA,
      freqA1,
      freqA2,
      pwrPrdctB,
      tubePrsrPrdctB,
      flowPrdctB,
      freqB1,
      aiPwrA,
      aiTubePrsrA,
      aiFlowA,
      inverterOnoff,
      aiFreqA1,
      aiFreqA2,
      aiPwrB,
      aiTubePrsrB,
      aiFlowB,
      aiFreqB1,
      divergeInfo,
      toggleState,
      toggleState2,
      toggleButton,
      toggleButton2,
      autoBanArea,
      autoBanArea2,
      aiAuto,
      aiBanAuto,
      aiAuto2,
      aiBanAuto2,
      nowPumpStatusA,
      nowPumpStatusB,
      pumpStatusA,
      pumpStatusB,
      gaugeHeight,
      waterPercent,
      showModal,
      timeCount,
      showModal2,
      popupMsg,
      PumpIdx,
      waterBox,
      getOpacityValue,
      handleToggleClick,
      handleToggleClick2,
      handleAutoChange1,
      handleBanAutoChange1,
      handleAutoChange2,
      handleBanAutoChange2
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';
@import '~@/style/AI/songsu.css';

@-webkit-keyframes blinkY1{
  0%{opacity:0;}
  12% {opacity:0; top: 40%; transform: rotate(90deg);}
  24%{opacity: 0.5;   transform: rotate(90deg);}
  36%{opacity: 1;  transform: rotate(90deg);}
  48%{opacity: 0.5;    transform: rotate(90deg);}
  60% {opacity:0; top: 53%; transform: rotate(90deg);}
  72%{opacity:0;}
  84%{opacity:0;}
  100%{opacity:0;}
}

@-moz-keyframes blinkY1{
  0%{opacity:0;}
  12% {opacity:0; top: 40%; transform: rotate(90deg);}
  24%{opacity: 0.5;   transform: rotate(90deg);}
  36%{opacity: 1;  transform: rotate(90deg);}
  48%{opacity: 0.5;    transform: rotate(90deg);}
  60% {opacity:0; top: 53%; transform: rotate(90deg);}
  72%{opacity:0;}
  84%{opacity:0;}
  100%{opacity:0;}
}

@keyframes blinkY1{
  0%{opacity:0;}
  12% {opacity:0; top: 40%; transform: rotate(90deg);}
  24%{opacity: 0.5;   transform: rotate(90deg);}
  36%{opacity: 1;  transform: rotate(90deg);}
  48%{opacity: 0.5;    transform: rotate(90deg);}
  60% {opacity:0; top: 53%; transform: rotate(90deg);}
  72%{opacity:0;}
  84%{opacity:0;}
  100%{opacity:0;}
}

.ai_pump_start {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 20px;
  color: white;
}

.ai_pump_start2 {
  height: calc(55% - 10px);
  width: 100%;
  margin-bottom: 10px;

  .ai_pump_start2_2 {
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 5px 0 10px 0;
  }
}

.ai_pump_start_bottom {
  height: 38%;
  width: 100%;
  margin-top: 10px;

  .bottom_area {
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px 0 10px 0;
  }
}

.ai_pump_arrow_start {
  height: 100%;
  width: calc(10% - 30px);
  margin: 0 15px;
  mix-blend-mode: color-dodge;

  .arrow_img {
    width: 100%;
    height: 100%;
    background: url('@/assets/img/ai_arrow_right.png') no-repeat;
    background-position: center;
    background-size: 80% 60%;
    mix-blend-mode: color-dodge;
  }

  .arrow_info {
    position: absolute;
    width: 5%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}

.top_name {
  width: 30%;
  height: 100%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.songsuLeftBox {
  width: 70%;
  height: 93%
}

/* 펌프영역 시작 */
.pump_area {
  height: calc(58% - 5px);
  width: 100%;
  // margin-bottom: 10px;
  background: url('@/assets/img/analysis/table_bg_03.png') no-repeat;
  background-size: 101% 104%;
  background-position: center;

  .pump_area2 {
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 5px 0 10px 0;
  }

  .middle {
    height: calc(100% - 140px);
    width: calc(100% - 15px);
    margin-left: 15px;
  }
}

.pump_area_bottom {
  height: 50%;
  width: 100%;
  background: url('@/assets/img/analysis/table_bg_03.png') no-repeat;
  background-size: 101% 104%;
  background-position: center;

  .bottom_image_area {
    height: calc(56%);
    width: calc(100% - 15px);
    margin-left: 15px;
  }
}

.bottom_pipe_line {
  width: 98%;
  height: 70%;
  background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
  background-size: 100% 26px;
  background-position: center;
  margin-left: -4px;
  margin-top: -4px;
}

.bottom_pipe_line2 {
  width: 100%;
  height: 40%;
  background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
  background-size: 100% 30px;
  background-position: center;
}

.pipe_line_arrow {
  background: url('@/assets/img/dashboard/water.png') no-repeat;
  width: 100%;
  height: 100%;
  mix-blend-mode: color-dodge;
  background-position: center;
}

.pipe_line_arrow_y {
  width: 100%;
  height: 90%;
  background: url('@/assets/img/ai_song/pipeline_y.png') no-repeat;
  background-size: 34px 61%;
  background-position: bottom;
  display: flex;
  flex-direction: column;
  margin-top: -18px;
}

.blinkingY1 {
  -webkit-animation: blinkY1 5s linear infinite;
  -moz-animation: blinkY1 5s linear infinite;
  animation: blinkY1 5s linear infinite;
}

.pipe_right_box {
  width: 100%;
  height: 100%;
  background: url('@/assets/img/ai_song/middle.png') no-repeat;
  background-size: 100% 100%;
  // background-position: bottom;
}

.pipe_right_box2 {
  width: 100%;
  height: 100px;
  margin-top: 35%;
  background: url('@/assets/img/ai_song/middle.png') no-repeat;
  background-size: 100% 100px;
  background-position: center;
}

.pipe_right_box_y {
  position: absolute;
  width: 30px;
  height: 75px;
  margin-top: -72px;
  left: 61%;
  background: url('@/assets/img/analysis/pipeline_un_y.png') no-repeat;
  background-size: 100% 100%;
}

.pipe_right_box_x {
  width: 330%;
  height: 39%;
  background: url('@/assets/img/analysis/pipeline_un.png') no-repeat;
  background-size: 100% 30px;
  background-position: center;
  margin-left: -4%;
}

.detail_textWrap {
  width: calc(100% - 30px);
  display: flex;
  align-items: center;
  margin: 25px 15px;
  font-size: 16px;
  font-family: 'KHNPHDRegular';
  color: #fff
}

.modal_arrow_img {
  width: 100%;
  height: 15%;
  background: url('@/assets/img/ai_song/image (2).png') no-repeat;
  background-position: center;
  background-size: 50% 100%;
  mix-blend-mode: color-dodge;
}

.modal {
  &.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  &-window {
    background-color: transparent;
    border-radius: 4px;
    overflow: hidden;
  }
}

// 오버레이 트랜지션
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // 오버레이에 포함되어 있는 모달 윈도의 트랜지션
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// 딜레이가 적용된 모달 윈도가 제거된 후에 오버레이가 사라짐
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.pump_area_h4_top {
  height: calc(100%/ 4.3);
  width: calc(100%);
  margin-top: 5px;
}

.pump_area_h4_bottom {
  height: calc(100%/ 3.5);
  width: calc(100%);
  margin-top: 5px;
}

.pipe_line_new {
  width: 25%;
  height: 50%;
  vertical-align: bottom;
  display: flex;
  margin-left: -3%;
  align-items: flex-end;
}
</style>
