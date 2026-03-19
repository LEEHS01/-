<template>
  <!-- 제목 -->
  <div class="ai-record">
    <p class="record-text-one">AI운영이력(상세)</p>
    <div class="start_end_date">
      <div class="line-box">
        <div class="line-box__title">단계</div>
        <v-select outlined
        :menu-props="{
          offsetY: true,
          nudgeBottom: 0
        }"
        :items="this.processList"
        item-text="text"
        return-object
        v-model="selectedProcess"
        >
        </v-select>
      </div>
      <div class="line-box">
        <div class="line-box__title">기간</div>
        <v-select outlined
        :menu-props="{
          offsetY: true,
          nudgeBottom: 0
        }"
        :items="this.periodList"
        v-model="selectedPeriod"
        @change="setDate"
        >
        </v-select>
      </div>
      <!-- 시작 날짜 -->
      <div class="line-box__title">시작일</div>
      <v-menu
        ref="menuStart"
        v-model="menuStart"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y>
        <template v-slot:activator="{ on }">
          <input id="startTime" class="selected-date" type="text" v-model="$store.state.aioprhistory.formattedStartTime" v-on="on" readonly>
          <label for="startTime"></label>
        </template>
        <v-date-picker v-model="$store.state.aioprhistory.formattedStartTime" no-title scrollable class="custom" :max="maxDate" @input="inputByCalendar"></v-date-picker>
      </v-menu>
      <div class="right-arrow-img"></div>
      <!-- 종료 날짜 -->
      <div class="line-box__title">종료일</div>
      <v-menu
        ref="menuEnd"
        v-model="menuEnd"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y>
        <template v-slot:activator="{ on }">
          <input id="endTime" class="selected-date" type="text" v-model="$store.state.aioprhistory.formattedEndTime" v-on="on" readonly>
          <label for="endTime"></label>
        </template>
        <v-date-picker v-model="$store.state.aioprhistory.formattedEndTime" :min="$store.state.aioprhistory.formattedStartTime" :max="maxDate" no-title scrollable class="custom" @input="inputByCalendar"></v-date-picker>
      </v-menu>
      <!-- 검색 버튼 -->
      <button class="search-btn" @click="onClickSearchBtn">
        <!-- <div class="search-icon-img"></div> -->
        <div class="search-btn-text">조회</div>
      </button>      
    </div>
    <!-- 조회기간 -->
    <div class="top-info">
      <div class="step-area">
        <p class="step-area__title">{{ getProcessStepName(this.searchProcess) }}</p>
      </div>
      <div class="ai-period">
        <div>조회기간 : </div>
        <div>{{ this.searchStartDate }}</div>
        <div style="padding: 0 10px;">~</div>
        <div>{{ this.searchEndDate }}</div>
      </div>
    </div>
    <!-- 상세 테이블 영역 -->
    <div class="ai-table">
      <table class="search-table">
      <colgroup>
        <col style="width: 5%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
      </colgroup>
      <thead class="table-title">
        <th class="row-text">구분</th>
        <th class="row-text">착수</th>
        <th class="row-text">약품</th>
        <th class="row-text">혼화응집</th>
        <th class="row-text">침전</th>
        <th class="row-text">여과</th>
        <th class="row-text">전차염</th>
        <th class="row-text">중차염</th>
        <th class="row-text">후차염</th>
      </thead>
      <tbody class="search-contents-container">
        <tr class="table-contents">
          <td class="none">전체</td>
          <td>{{ this.getAiOprDays('B','SUM') }}일 {{ this.getAiOprHours('B','SUM') }}시간 ({{ this.getAiOprTotalHours('B','SUM') }})</td>
          <td>{{ this.getAiOprDays('C','SUM') }}일 {{ this.getAiOprHours('C','SUM') }}시간 ({{ this.getAiOprTotalHours('C','SUM') }})</td>
          <td>{{ this.getAiOprDays('D','SUM') }}일 {{ this.getAiOprHours('D','SUM') }}시간 ({{ this.getAiOprTotalHours('D','SUM') }})</td>
          <td>{{ this.getAiOprDays('E','SUM') }}일 {{ this.getAiOprHours('E','SUM') }}시간 ({{ this.getAiOprTotalHours('E','SUM') }})</td>
          <td>{{ this.getAiOprDays('F','SUM') }}일 {{ this.getAiOprHours('F','SUM') }}시간 ({{ this.getAiOprTotalHours('F','SUM') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','PRE','SUM') }}일 {{ this.getAiOprHoursDisinfection('G','PRE','SUM') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','PRE','SUM') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','PERI','SUM') }}일 {{ this.getAiOprHoursDisinfection('G','PERI','SUM') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','PERI','SUM') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','POST','SUM') }}일 {{ this.getAiOprHoursDisinfection('G','POST','SUM') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','POST','SUM') }})</td>
        </tr>
        <tr class="table-contents">
          <td class="none">AI</td>
          <td>{{ this.getAiOprDays('B','2') }}일 {{ this.getAiOprHours('B','2') }}시간 ({{ this.getAiOprTotalHours('B','2') }})</td>
          <td>{{ this.getAiOprDays('C','2') }}일 {{ this.getAiOprHours('C','2') }}시간 ({{ this.getAiOprTotalHours('C','2') }})</td>
          <td>{{ this.getAiOprDays('D','2') }}일 {{ this.getAiOprHours('D','2') }}시간 ({{ this.getAiOprTotalHours('D','2') }})</td>
          <td>{{ this.getAiOprDays('E','2') }}일 {{ this.getAiOprHours('E','2') }}시간 ({{ this.getAiOprTotalHours('E','2') }})</td>
          <td>{{ this.getAiOprDays('F','2') }}일 {{ this.getAiOprHours('F','2') }}시간 ({{ this.getAiOprTotalHours('F','2') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','PRE','2') }}일 {{ this.getAiOprHoursDisinfection('G','PRE','2') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','PRE','2') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','PERI','2') }}일 {{ this.getAiOprHoursDisinfection('G','PERI','2') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','PERI','2') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','POST','2') }}일 {{ this.getAiOprHoursDisinfection('G','POST','2') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','POST','2') }})</td>
        </tr>
        <tr class="table-contents">
          <td class="none">AI추천</td>
          <td>{{ this.getAiOprDays('B','1') }}일 {{ this.getAiOprHours('B','1') }}시간 ({{ this.getAiOprTotalHours('B','1') }})</td>
          <td>{{ this.getAiOprDays('C','1') }}일 {{ this.getAiOprHours('C','1') }}시간 ({{ this.getAiOprTotalHours('C','1') }})</td>
          <td>{{ this.getAiOprDays('D','1') }}일 {{ this.getAiOprHours('D','1') }}시간 ({{ this.getAiOprTotalHours('D','1') }})</td>
          <td>{{ this.getAiOprDays('E','1') }}일 {{ this.getAiOprHours('E','1') }}시간 ({{ this.getAiOprTotalHours('E','1') }})</td>
          <td>{{ this.getAiOprDays('F','1') }}일 {{ this.getAiOprHours('F','1') }}시간 ({{ this.getAiOprTotalHours('F','1') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','PRE','1') }}일 {{ this.getAiOprHoursDisinfection('G','PRE','1') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','PRE','1') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','PERI','1') }}일 {{ this.getAiOprHoursDisinfection('G','PERI','1') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','PERI','1') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','POST','1') }}일 {{ this.getAiOprHoursDisinfection('G','POST','1') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','POST','1') }})</td>
        </tr>
        <tr class="table-contents">
          <td class="none">AI분석</td>
          <td>{{ this.getAiOprDays('B','0') }}일 {{ this.getAiOprHours('B','0') }}시간 ({{ this.getAiOprTotalHours('B','0') }})</td>
          <td>{{ this.getAiOprDays('C','0') }}일 {{ this.getAiOprHours('C','0') }}시간 ({{ this.getAiOprTotalHours('C','0') }})</td>
          <td>{{ this.getAiOprDays('D','0') }}일 {{ this.getAiOprHours('D','0') }}시간 ({{ this.getAiOprTotalHours('D','0') }})</td>
          <td>{{ this.getAiOprDays('E','0') }}일 {{ this.getAiOprHours('E','0') }}시간 ({{ this.getAiOprTotalHours('E','0') }})</td>
          <td>{{ this.getAiOprDays('F','0') }}일 {{ this.getAiOprHours('F','0') }}시간 ({{ this.getAiOprTotalHours('F','0') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','PRE','0') }}일 {{ this.getAiOprHoursDisinfection('G','PRE','0') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','PRE','0') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','PERI','0') }}일 {{ this.getAiOprHoursDisinfection('G','PERI','0') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','PERI','0') }})</td>
          <td>{{ this.getAiOprDaysDisinfection('G','POST','0') }}일 {{ this.getAiOprHoursDisinfection('G','POST','0') }}시간 ({{ this.getAiOprTotalHoursDisinfection('G','POST','0') }})</td>
        </tr>
      </tbody>
      </table>
    </div>
    <div class="record-text-two">자율운영<p>AI운영 가동시간(조회기간내)</p></div>
    <!-- 자율운영 차트 영역 -->
    <div v-if="this.getAiOprTotalHours('B','SUM') == 0 ">
      <p class="ai-chart-text">조회된 데이터가 없습니다.</p>
    </div>
    <div v-else class="ai-chart">
      <highcharts :options="aiHistoryChart"/>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { SET_OVERLAY } from '@/store'
import { PUT_AIOPR_SEARCH } from '@/store/modules/aioprhistory'

export default {
  name: 'AIOprHistoryRecord',
  data: () => ({
    menuStart: false, // 검색 시작 날짜
    menuEnd: false, // 검색 종료 날짜
    startTime: '00:00:00',
    endTime: '23:59:59',
    searchStartDate: '',
    searchEndDate: '',
    selectedPeriod: '7일',
    periodList: ['--', '7일', '30일', '1년'],
    processList: [{processStep : 1, text: '2단계공업'},{processStep : 2, text: '2단계생활'},{processStep : 3, text: '3단계'},{processStep : 4, text: '펌프'}],
    selectedProcess : {processStep : 1, text: '2단계공업'},
    searchProcess: 1,
    chartOptions:{
      chart: {
        type: 'column',
        backgroundColor:false,
      },
      title: null,
      xAxis: {
        categories: [],
        gridLineWidth: 0,
        labels: {
          style: {
            color: '#FFFFFF'
          }
        },
        plotLines: [
          {
              color: '#C0C0C0',
              width: 1, 
              value: 0.5
          },
          {
              color: '#C0C0C0',
              width: 1,
              value: 1.5
          },
          {
              color: '#C0C0C0',
              width: 1,
              value: 2.5
          },
          {
              color: '#C0C0C0',
              width: 1,
              value: 3.5
          }
        ]
      },
      yAxis: {
        min: 0,
        labels: {
          style: {
            color: '#FFFFFF'
          }
        },
        gridLineWidth: 0,
        title: null
      },
      credits:{
        enabled: false
      },
      legend: {
        layout: 'horizontal',
        align: 'right',
        verticalAlign: 'top',
        borderWidth: 1,
        borderColor:null,
        itemStyle:{
          color:'#FFFFFF'
        }
      },
      exporting: {
        enabled: false,
        buttons: {
          contextButton: {
            enabled: false 
          }
        }
      },
      plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
            dataLabels:{
              enabled: true,
              format: '{y}',
              style: {
                fontSize: '10px',
                color:'#FFFFFF'
              }
            }
        }
      },
      series:[]
    }
  }),
  mounted: function () {
    let now = moment()
    this.$store.state.aioprhistory.endTime = now.clone().subtract(1, 'd')
    this.$store.state.aioprhistory.startTime = now.clone().subtract(7, 'd')
    this.$store.state.aioprhistory.formattedStartTime = this.$store.state.aioprhistory.startTime.format('YYYY-MM-DD')
    this.$store.state.aioprhistory.formattedEndTime = this.$store.state.aioprhistory.endTime.format('YYYY-MM-DD')

    this.$store.commit(SET_OVERLAY, true)
    Promise.all([
    this.$store.dispatch(PUT_AIOPR_SEARCH , { start_time: this.$store.state.aioprhistory.startTime.valueOf(), end_time: this.$store.state.aioprhistory.endTime.valueOf()})
    ]).finally(() => {
      this.searchStartDate = this.$store.state.aioprhistory.formattedStartTime
      this.searchEndDate = this.$store.state.aioprhistory.formattedEndTime
      this.$store.commit(SET_OVERLAY, false)
    })
  },
  computed: {
    aiHistoryChart: function(){
      let chart = this.chartOptions
      chart.series= []
      chart.xAxis.categories = []
      chart.xAxis.plotLines = []

      //processStep별 카테고리 및 plotLine 셋팅 
      const categoryMap = {
        1: ['착수', '약품', '혼화응집', '침전', '전차염'],
        2: ['착수', '약품', '혼화응집', '침전', '여과', '전차염', '중차염', '후차염'],
        3: ['착수', '약품', '혼화응집', '침전', '여과', '전차염', '중차염', '후차염'],
        4: ['착수']
      };

      chart.xAxis.categories = categoryMap[this.searchProcess];
      chart.xAxis.plotLines = chart.xAxis.categories.map((_, index) => ({
        color: '#C0C0C0',
        width: 1,
        value: index + 0.5
      }))

      //processStep별 데이터 filtering
      const { aiOprHistorySearch } = this.$store.state.aioprhistory
      let filteredHistorySearch = [];
      filteredHistorySearch = Object.fromEntries(
        Object.entries(aiOprHistorySearch).filter(([key]) =>
          key.includes(`${this.getProcessStep(this.searchProcess)}_`)
        )
      );
      
      //ai/ai추천/ai분석 데이터 분류
      const aiData = [];
      const aiSuggestData= [];
      const aiAnalysisData = [];

      for(const key in filteredHistorySearch){
        const item = filteredHistorySearch[key];
        if (key.endsWith('_2')) {
          aiData.push(item.totalHours)
        } else if (key.endsWith('_1')) {
          aiSuggestData.push(item.totalHours)
        } else if (key.endsWith('_0')) {
          aiAnalysisData.push(item.totalHours)
        }
      }

      let aiSeries = {name : 'AI', color: '#ec6c6b', data: aiData}
      let aiSuggestSeries = {name : 'AI추천', color: '#ff9c39', data: aiSuggestData}
      let aiAnalysisSeries = {name : 'AI분석', color: '#269bbe', data: aiAnalysisData}
      chart.series.push(aiSeries, aiSuggestSeries, aiAnalysisSeries)

      return chart
    },
    maxDate: function(){
      let now = moment()
      let yesterDay = now.clone().subtract(1, 'd')
      return yesterDay.format('YYYY-MM-DD')
    }
  },
  methods: {
    getProcessStepName:function(processStep) {
      let processStepName
      if (processStep == 1) {
        processStepName = '2단계공업'
      } else if (processStep == 2) {
        processStepName = '2단계생활'
      } else if (processStep == 3) {
        processStepName = '3단계'
      } else if (processStep == 4) {
        processStepName = '펌프'
      }
      return processStepName
    },
    getProcessStep:function(processStep) {
      if (processStep == 1) {
        processStep = '2_IND'
      } else if (processStep == 2) {
        processStep = '2_LIV'
      } else if (processStep == 3) {
        processStep = '3'
      } else if (processStep == 4) {
        processStep = '_PUMP'
      }
      return processStep
    },
    getAiOprDays:function(process, opr) {
      let processStep = this.searchProcess
      if(processStep == 1 && process == 'F') { //1단계는 여과 미존재
        return '-'
      }
      if(processStep == 4) {
        if(process !== 'B'){
          return '-'
        }
      }
      processStep = this.getProcessStep(processStep)
      return this.$store.state.aioprhistory.aiOprHistorySearch[`${process}${processStep}_${opr}`].days
    },
    getAiOprDaysDisinfection:function(process, disinfectionIndex, opr) {
      let processStep = this.searchProcess
      if((processStep == 1 && disinfectionIndex == 'PERI') || (processStep == 1 && disinfectionIndex == 'POST')) { //1단계는 중/후 미존재
        return '-'
      }
      if(processStep == 4) {
        return '-'
      }
      processStep = this.getProcessStep(processStep)
      return this.$store.state.aioprhistory.aiOprHistorySearch[`${process}${processStep}_${disinfectionIndex}_${opr}`].days
    },
    getAiOprHours:function(process, opr) {
      let processStep = this.searchProcess
      if(processStep == 1 && process == 'F') { //1단계는 여과 미존재
        return '-'
      }
      if(processStep == 4) {
        if(process !== 'B'){
          return '-'
        }
      }
      processStep = this.getProcessStep(processStep)
      return this.$store.state.aioprhistory.aiOprHistorySearch[`${process}${processStep}_${opr}`].hours
    },
    getAiOprHoursDisinfection:function(process, disinfectionIndex, opr) {
      let processStep = this.searchProcess
      if((processStep == 1 && disinfectionIndex == 'PERI') || (processStep == 1 && disinfectionIndex == 'POST')) { //1단계는 중/후 미존재
        return '-'
      }
      if(processStep == 4) {
        return '-'
      }
      processStep = this.getProcessStep(processStep)
      return this.$store.state.aioprhistory.aiOprHistorySearch[`${process}${processStep}_${disinfectionIndex}_${opr}`].hours
    },
    getAiOprTotalHours:function(process, opr) {
      let processStep =  this.searchProcess
      if(processStep == 1 && process == 'F') { //1단계는 여과 미존재
        return '-'
      }
      if(processStep == 4) {
        if(process !== 'B'){
          return '-'
        }
      }
      processStep = this.getProcessStep(processStep)
      return this.$store.state.aioprhistory.aiOprHistorySearch[`${process}${processStep}_${opr}`].totalHours
    },
    getAiOprTotalHoursDisinfection:function(process, disinfectionIndex, opr) {
      let processStep =  this.searchProcess
      if((processStep == 1 && disinfectionIndex == 'PERI') || (processStep == 1 && disinfectionIndex == 'POST')) { //1단계는 중/후 미존재
        return '-'
      }
      if(processStep == 4) {
        return '-'
      }
      processStep = this.getProcessStep(processStep)
      return this.$store.state.aioprhistory.aiOprHistorySearch[`${process}${processStep}_${disinfectionIndex}_${opr}`].totalHours
    },
    onClickSearchBtn () {
      let _startTime = moment(this.$store.state.aioprhistory.formattedStartTime)
      let _endTime = moment(this.$store.state.aioprhistory.formattedEndTime)
      this.$store.commit(SET_OVERLAY, true)
      Promise.all([
      this.$store.dispatch(PUT_AIOPR_SEARCH , { start_time: _startTime.valueOf(), end_time: _endTime.valueOf()})
    ]).finally(() => {
        this.searchProcess = this.selectedProcess.processStep
        this.searchStartDate = this.$store.state.aioprhistory.formattedStartTime
        this.searchEndDate = this.$store.state.aioprhistory.formattedEndTime
        this.$store.commit(SET_OVERLAY, false)
      })
    }, 
    setDate(selectedValue){
      if(selectedValue == '--'){
        return;
      }
      let now = moment()
      if(selectedValue == '7일'){
        this.$store.state.aioprhistory.endTime = now.clone().subtract(1, 'd')
        this.$store.state.aioprhistory.startTime = now.clone().subtract(7, 'd')
      }else if(selectedValue == '30일'){
        this.$store.state.aioprhistory.endTime = now.clone().subtract(1, 'd')
        this.$store.state.aioprhistory.startTime = now.clone().subtract(30, 'd')
      }else if(selectedValue == '1년'){
        this.$store.state.aioprhistory.endTime = now.clone().subtract(1, 'd')
        this.$store.state.aioprhistory.startTime = now.clone().subtract(1, 'y')
      }
      this.$store.state.aioprhistory.formattedStartTime = this.$store.state.aioprhistory.startTime.format('YYYY-MM-DD')
      this.$store.state.aioprhistory.formattedEndTime = this.$store.state.aioprhistory.endTime.format('YYYY-MM-DD')
    },
    inputByCalendar(){
      this.selectedPeriod = '--'
    }
  },
  destroyed: function () {
    console.log(this.$options.name + ' destoryed')
  },
  updated: function () {
    console.log(this.$options.name + ' updated')
  },
  watch: {

  }
}
</script>
<style lang="scss" scoped>

.v-input {
  max-width: 155px;
  height: 35px !important;
  color: #417db9 !important;
  border-radius: 0;
  border: none;
  padding-right: 20px;
}
.ai-record {
  padding: 20px 40px;
  width: 100%;
  height: 100%;
  .record-text-one {
    width: 197px;
    height: 47px;
    background-image: url('../../assets/editableDashboard/title_under.png');
    text-shadow: 0 0 9px #5cafff;
    font-size: 18px;
    text-align: center;
    color: #fff;
    margin-bottom: 0;
  }
  .record-text-two {
    width: 197px;
    height: 67px;
    background-position-y: 20px;
    background-image: url('../../assets/editableDashboard/title_under.png');
    text-shadow: 0 0 9px #5cafff;
    font-size: 18px;
    text-align: center;
    color: #fff;
    margin-bottom: 0;
    > p { 
      font-size: 14px;
    }
  }
  .top-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .step-area {
    margin-left: 10px;
      &__title {
        width: 150px;
        line-height: 30px;
        padding-left: 30px;
        margin-bottom: 0;
        color: #fff;
        text-shadow: 0 0 9px #5cafff;
        background-image: url('../../assets/dialog/ai_header_icon.png');
      }
    }
  }
  .ai-period {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('../../assets/aioprhistory/big_ai_contents_right_title.png');
    background-position: calc(50% - 50px);
    width: 100%;
    height: 52px;
    padding-right: 150px;
    > div {
      color: #fff;
      padding: 0 5px;
    }
  }
  // 시작날짜, 종료날짜 검색
  .start_end_date {  
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    .line-box {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      &__title {
        text-shadow: 0 0 9px #5cafff;
        font-size: 16px;
        text-align: left;
        color: #fff;
        padding-right: 10px;
      }
    }
    // 날짜 Input
    .selected-date {
      font-size: 14px;
      font-weight: normal;
      text-shadow: 0 0 9px #5cafff;
      text-align: left;
      color: #ffffff;
      width: 189px;
      height: 34px;
      border-bottom: solid 1px #ffffff;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: transparent;
      background-image: url('~@/assets/alarmHistory/under_arrow.png');
      background-repeat: no-repeat;
      background-position-x: 170px;
      padding: 0 5px;
      background-position-y: 12px;
    }
    // 검색 버튼
    .search-btn {
      display: flex;
      margin-left: 15px;
      margin-right: 5px;
      width: 80px;
      height: 34px;
      background-color: #3bb7e5;
      justify-content: center;
      align-items: center;
      border: solid 1px #b4dffa;
      background-color: rgba(139, 194, 240, 0.25);
    }
    // 검색 버튼 아이콘
    .search-icon-img {
      background-image: url('~@/assets/alarmHistory/search_icon.png');
      width: 13.8px;
      height: 15.4px;
      margin-right: 7.3px;
    }
    // 검색 버튼 텍스트
    .search-btn-text {
      font-size: 14px;
      text-shadow: 0 0 9px #5cafff;
      color: #fff;
    }
    // arrow
    .right-arrow-img {
      background-image: url('~@/assets/alarmHistory/right_arrow.png');
      background-repeat: no-repeat;
      width: 23.2px;
      height: 9.1px;
      margin: 0 30px;
    }
  }
  // 알람 이력 테이블
  .ai-table {
    margin-bottom: 30px;
    // 검색 결과 테이블
    .search-table {
      width: 100%;
      border-collapse: collapse;
      // thead tr
      .table-title {
        width: 100%;
        height: 55px;
        font-size: 15px;
        text-align: center;
        color: rgba(255, 255, 255, 0.85);
        background-image: linear-gradient(to right, rgba(16, 36, 65, 0) 0%, #2551a3 25%,#2551a3 75%, rgba(16, 36, 65, 0) 100%);
        // thread th
        .row-text {
        }
      }
      // tbody
      .search-contents-container {
       // tbody tr
       .table-contents {
        height: 55px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        border-bottom: 1px solid #3a547c;
        }
        .table-contents > td {
          border-left: 1px solid #3a547c;
        }
        .table-contents > td.none {
          border:none;
        }
      }
    }
  }
  .ai-chart {
    width: 100%;
    height: 100%;
  }
  .ai-chart-text {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items:center;
    color: white;
    transform: translateY(60px);
  }
}
</style>