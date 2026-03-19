<template>
  <div class="popup" v-if="this.$store.state.aioprhistory.aiOprHistoryPopupVisible">
    <div class="popup__title">
      <div class="popup__icon"></div>
      <span>AI운영이력</span>
    </div>
    <div class="btn" @click="closePopup()"></div>
    <div class="popup__body">
      <div class="popup__wrap">
        <p>2단계 공업</p>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_splashdown.png" alt="착수아이콘">
            <div class="contents-title">착수</div>
          </div>
          <highcharts ref="B2_IND_Chart" class="chart" :options="getChartOptions('B2_IND')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('B2_IND_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B2_IND_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('B2_IND_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B2_IND_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('B2_IND_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B2_IND_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_coagulants.png" alt="약품아이콘">
            <div class="contents-title">약품</div>
          </div>
          <highcharts ref="C2_IND_Chart" class="chart" :options="getChartOptions('C2_IND')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('C2_IND_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C2_IND_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('C2_IND_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C2_IND_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('C2_IND_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C2_IND_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_mixingtank.png" alt="혼화응집아이콘">
            <div class="contents-title">혼화응집</div>
          </div>
          <highcharts ref="D2_IND_Chart" class="chart" :options="getChartOptions('D2_IND')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('D2_IND_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D2_IND_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('D2_IND_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D2_IND_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('D2_IND_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D2_IND_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_sedimentation.png" alt="침전아이콘">
            <div class="contents-title">침전</div>
          </div>
          <highcharts ref="E2_IND_Chart" class="chart" :options="getChartOptions('E2_IND')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('E2_IND_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E2_IND_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('E2_IND_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E2_IND_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('E2_IND_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E2_IND_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>        
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_disinfection.png" alt="소독아이콘">
            <div class="contents-title">전차염</div>
          </div>
          <highcharts ref="G2_IND_PRE_Chart" class="chart" :options="getChartOptions('G2_IND_PRE')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('G2_IND_PRE_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_IND_PRE_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('G2_IND_PRE_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_IND_PRE_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('G2_IND_PRE_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_IND_PRE_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <p style="margin-top: 153px;">펌프</p>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_splashdown.png" alt="착수아이콘">
            <div class="contents-title">착수</div>
          </div>
          <highcharts ref="B_PUMP_Chart" class="chart" :options="getChartOptions('B_PUMP')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('B_PUMP_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B_PUMP_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('B_PUMP_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B_PUMP_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('B_PUMP_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B_PUMP_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="popup__line"></div>
      <div class="popup__wrap">
        <p>2단계 생활</p>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_splashdown.png" alt="착수아이콘">
            <div class="contents-title">착수</div>
          </div>
          <highcharts ref="B2_LIV_Chart" class="chart" :options="getChartOptions('B2_LIV')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('B2_LIV_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B2_LIV_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('B2_LIV_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B2_LIV_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('B2_LIV_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B2_LIV_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_coagulants.png" alt="약품아이콘">
            <div class="contents-title">약품</div>
          </div>
          <highcharts ref="C2_LIV_Chart" class="chart" :options="getChartOptions('C2_LIV')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('C2_LIV_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C2_LIV_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('C2_LIV_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C2_LIV_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('C2_LIV_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C2_LIV_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_mixingtank.png" alt="혼화응집아이콘">
            <div class="contents-title">혼화응집</div>
          </div>
          <highcharts ref="D2_LIV_Chart" class="chart" :options="getChartOptions('D2_LIV')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('D2_LIV_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D2_LIV_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('D2_LIV_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D2_LIV_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('D2_LIV_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D2_LIV_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_sedimentation.png" alt="침전아이콘">
            <div class="contents-title">침전</div>
          </div>
          <highcharts ref="E2_LIV_Chart" class="chart" :options="getChartOptions('E2_LIV')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('E2_LIV_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E2_LIV_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('E2_LIV_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E2_LIV_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('E2_LIV_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E2_LIV_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>        
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_percolation.png" alt="여과아이콘">
            <div class="contents-title">여과</div>
          </div>
          <highcharts ref="F2_LIV_Chart" class="chart" :options="getChartOptions('F2_LIV')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('F2_LIV_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('F2_LIV_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('F2_LIV_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('F2_LIV_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('F2_LIV_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('F2_LIV_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>        
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_disinfection.png" alt="소독아이콘">
            <div class="contents-title">전차염</div>
          </div>
          <highcharts ref="G2_LIV_PRE_Chart" class="chart" :options="getChartOptions('G2_LIV_PRE')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_PRE_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_PRE_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_PRE_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_PRE_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_PRE_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_PRE_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_disinfection.png" alt="소독아이콘">
            <div class="contents-title">중차염</div>
          </div>
          <highcharts ref="G2_LIV_PERI_Chart" class="chart" :options="getChartOptions('G2_LIV_PERI')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_PERI_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_PERI_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_PERI_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_PERI_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_PERI_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_PERI_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_disinfection.png" alt="소독아이콘">
            <div class="contents-title">후차염</div>
          </div>
          <highcharts ref="G2_LIV_POST_Chart" class="chart" :options="getChartOptions('G2_LIV_POST')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_POST_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_POST_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_POST_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_POST_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('G2_LIV_POST_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G2_LIV_POST_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="popup__line"></div>
      <div class="popup__wrap">
        <p>3단계</p>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_splashdown.png" alt="착수아이콘">
            <div class="contents-title">착수</div>
          </div>
          <highcharts ref="B3_Chart" class="chart" :options="getChartOptions('B3')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('B3_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B3_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('B3_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B3_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('B3_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('B3_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_coagulants.png" alt="약품아이콘">
            <div class="contents-title">약품</div>
          </div>
          <highcharts ref="C3_Chart" class="chart" :options="getChartOptions('C3')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('C3_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C3_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('C3_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C3_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('C3_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('C3_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_mixingtank.png" alt="혼화응집아이콘">
            <div class="contents-title">혼화응집</div>
          </div>
          <highcharts ref="D3_Chart" class="chart" :options="getChartOptions('D3')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('D3_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D3_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('D3_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D3_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('D3_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('D3_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_sedimentation.png" alt="침전아이콘">
            <div class="contents-title">침전</div>
          </div>
          <highcharts ref="E3_Chart" class="chart" :options="getChartOptions('E3')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('E3_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E3_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('E3_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E3_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('E3_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('E3_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>        
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_percolation.png" alt="여과아이콘">
            <div class="contents-title">여과</div>
          </div>
          <highcharts ref="F3_Chart" class="chart" :options="getChartOptions('F3')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('F3_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('F3_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('F3_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('F3_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('F3_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('F3_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>        
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_disinfection.png" alt="소독아이콘">
            <div class="contents-title">전차염</div>
          </div>
          <highcharts ref="G3_PRE_Chart" class="chart" :options="getChartOptions('G3_PRE')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('G3_PRE_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_PRE_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('G3_PRE_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_PRE_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('G3_PRE_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_PRE_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_disinfection.png" alt="소독아이콘">
            <div class="contents-title">중차염</div>
          </div>
          <highcharts ref="G3_PERI_Chart" class="chart" :options="getChartOptions('G3_PERI')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('G3_PERI_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_PERI_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('G3_PERI_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_PERI_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('G3_PERI_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_PERI_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="popup__contents">
          <div class="popup__icon-value">
            <img src="../../../assets/aioprhistory/icon_disinfection.png" alt="소독아이콘">
            <div class="contents-title">후차염</div>
          </div>
          <highcharts ref="G3_POST_Chart" class="chart" :options="getChartOptions('G3_POST')"/>
          <div class="ai-contents">
            <ul class="ai-contents__wrap">
              <li class="ai-contents__list">
                <div class="mode mode-one">AI</div>
                <div class="day">{{ this.getAiOprTime('G3_POST_2','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_POST_2','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-two">AI추천</div>
                <div class="day">{{ this.getAiOprTime('G3_POST_1','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_POST_1','hours') }} 시간</div>
              </li>
              <li class="ai-contents__list">
                <div class="mode mode-three">AI분석</div>
                <div class="day">{{ this.getAiOprTime('G3_POST_0','days') }} 일</div>
                <div class="hour">{{ this.getAiOprTime('G3_POST_0','hours') }} 시간</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AIOprHistoryPopup',
  data: () => ({
  }),
  computed: {
  },
  methods: {
    closePopup: function () {
      this.$store.state.aioprhistory.aiOprHistoryPopupVisible = false;
    },
    getAiOprTime: function(oprInfo, time){
      return this.$store.state.aioprhistory.aiOprTotal[oprInfo][time]
    },
    makeChart: function(){
      const chartOption = {
        chart: {
          type: 'pie',
          backgroundColor:false,
          height: '100px',
        },
        legend: {
          enabled: false
        },
        tooltip:{
          enabled: false
        },
        credits:{
          enabled: false
        },
        exporting: {
          enabled: false,
          buttons: {
            contextButton: {
                enabled: false 
            }
          }
        },
        title:{
          text: '',
          align: 'center',
          verticalAlign: 'middle',
          y: 10,
          style: {
            color: '#FFFFFF',
            textAlign: 'center',
            fontSize: '13px', 
          }
        },
        plotOptions: {
          series:{
            allowPointSelect: false,
          },
          pie: {
            size: '200%',
            dataLabels: {
              enabled: false
            },
            borderColor: null,
          },
        },
      }
      return chartOption;
    },
    getChartOptions:function(processInfo){
      let chart = this.makeChart();
      chart.series = []
      let _series = {colorByPoint:true, innerSize : '79%', data: []}
      _series.data.push({name : 'AI', color: '#ec6c6b', y: this.$store.state.aioprhistory.aiOprTotal[`${processInfo}_2`].totalHours })
      _series.data.push({name : '부분AI', color: '#ff9c39', y: this.$store.state.aioprhistory.aiOprTotal[`${processInfo}_1`].totalHours })
      _series.data.push({name : 'AI추천', color: '#269bbe', y: this.$store.state.aioprhistory.aiOprTotal[`${processInfo}_0`].totalHours })
      chart.series.push(_series)
      chart.title.text = `${this.$store.state.aioprhistory.aiOprTotal[`${processInfo}_SUM`].days}일<br/>${this.$store.state.aioprhistory.aiOprTotal[`${processInfo}_SUM`].hours}시간`;

      return chart
    }
  },
  mounted: function() {
  },
  destroyed: function() {
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.popup{
  position: fixed;
  bottom: 11px;
  right: 421px;
  width: 1490px;
  height: 920px;
  z-index: 99999;
  background-size: 100% 100%;
  background-image: url('../../../assets/aioprhistory/ai_popup.png');
  padding: 20px;
  &__title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    color: #b4dffb;
  }
  &__icon {
    width: 17px;
    height: 28px;
    margin-right: 15px;
    background-image: url('../../../assets/dialog/ai_header_icon.png');
    background-size: 100% 100%;
  }
  &__body {
    display: flex;
    justify-content: space-evenly;
    margin-top: 10px;
  }
  &__line {
    width: 1px;
    background-image: url('../../../assets/aioprhistory/ai-line.png');
  }
  &__wrap {
    padding: 0 20px;
    & > p {
      width: 397px;
      height: 37px;
      text-align: center;
      color: #fff;
      background-image: url('../../../assets/aioprhistory/ai_contents_right_title.png');
      background-position-x: 50%;
      line-height: 2.2;
      margin-bottom: 10px;
    }
  }
  &__contents {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
  }
  &__icon-value {
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    > img {
      width: 40px;
    }
  }
  .chart {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin: 0 20px;
    &__wrap {
      padding-top: 3px;
    }
  }
  .total {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 0 auto;
    color: #fff;
    font-size: 14px;
    &__wrap {
      padding-top: 3px;
    }
    span {
      font-size: 12px;
    }
  }
  // ai
  .total-one {
    border: 8px solid #ec6c6b;
  }
  // ai추천
  .total-two {
    border: 8px solid #ff9c39;
  }
  // ai분석
  .total-three {
    border: 8px solid #269bbe;
  }
  .total-day {

  }
  .ai-contents {
    display: flex;
    &__wrap {
      padding: 0;
      // width: 185px;
    }
    &__list {
      display: flex;
      list-style: none;
      font-size: 14px;
      color: #fff;
      margin: 8px 0;
    }
    .mode {
      width: 50px;
      font-weight: 600;
      text-align: right;
    }
    // ai
    .mode-one {
      color: #ec6c6b;
    }
    // ai추천
    .mode-two {
      color: #ff9c39;
    }
    // ai분석
    .mode-three {
      color: #269bbe;
    }
    .day {
      width: 80px;
      text-align: right;
    }
    .hour {
      width: 50px;
      margin-left: 20px;
      text-align: right;
    }
  }
  .contents-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    margin-top: 7px;
    font-size: 14px;
    color: #fff;
    background-size: 100% 100%;
    background-image: url('../../../assets/aioprhistory/icon_title.png');
  }
}
.btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 24px;
  height: 30px;
  background-image: url('../../../assets/sedimentation/exit_btn.png');
  background-position-y: center;
  cursor: pointer;
  z-index: 9;
}
</style>