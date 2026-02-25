<template>
  <div class="record-search">
    <!-- 제목 -->
    <div class="record-title">
      <div class="record-title-contents">
        <div class="record-text">{{ this.$store.state.alarm.selectedClassification == 'total' ? '전체' : this.$store.state.alarm.selectedClassification == 'auto_control' ? '자동' : '사용자'  }} 제어</div>
      </div>
    </div>
    <!-- 날짜 검색 -->
    <div class="start_end_date">
      <!-- 시작 날짜 -->
      <v-menu
        ref="menuStart"
        v-model="menuStart"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y>
        <template v-slot:activator="{ on }">
          <input class="selected-date" type="text" v-model="$store.state.alarm.formattedStartTime" v-on="on" readonly>
        </template>
        <v-date-picker v-model="$store.state.alarm.formattedStartTime" no-title scrollable class="custom"></v-date-picker>
        <v-time-picker format="24hr" v-model="startTime" :max="endTime"></v-time-picker>
      </v-menu>
      <div class="right-arrow-img"></div>
      <!-- 종료 날짜 -->
      <v-menu
        ref="menuEnd"
        v-model="menuEnd"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y>
        <template v-slot:activator="{ on }">
          <input class="selected-date" type="text" v-model="$store.state.alarm.formattedEndTime" v-on="on" readonly>
        </template>
        <v-date-picker v-model="$store.state.alarm.formattedEndTime" :min="$store.state.alarm.formattedStartTime" no-title scrollable class="custom"></v-date-picker>
        <v-time-picker format="24hr" v-model="endTime" :min="startTime"></v-time-picker>
      </v-menu>
      <!-- 검색 버튼 -->
      <button class="search-btn" @click="onClickSearchBtn">
        <div class="search-icon-img"></div>
        <div class="search-btn-text">검색</div>
      </button>
      <div class="category-box">
        <span>전체 :{{ totalCnt }}건</span>
        <span>제어 :{{ controlCnt }}건</span>
        <span>자동제어 :{{ autoControlCnt }}건</span>
        <span>취소 :{{ cancelCnt }}건</span>
        <span>미확인 :{{ noActionCnt }}건</span>
      </div>
    </div>
    <!-- 전체 알람 이력 테이블 -->
    <div class="record-table">
      <table class="search-table">
        <colgroup>
        <col style="width: 5%;">
        <col style="width: 5%;">
        <col style="width: 10%;">
        <col style="width: 15%;">
        <col style="width: 5%;">
        <col style="width: 5%;">
        <col style="width: 10%;">
        <col style="width: 5%;">
        <col style="width: 6%;">
        </colgroup>
        <thead class="table-title">
          <th class="row-text">분류</th>
          <th class="row-text">사용자명</th>
          <th class="row-text">공정 및 단계</th>
          <th class="row-text">태그설명</th>
          <th class="row-text">이전값</th>
          <th class="row-text">제어값</th>
          <th class="row-text">제어시간</th>
          <th class="row-text">제어여부</th>
          <th class="row-text">상세</th>
        </thead>
        <tbody class="search-contents-container ">
          <tr class="table-contents" v-if="paginatedData == ''">
            <td colspan="9">조회된 데이터가 없습니다.</td>
          </tr>
          <template v-for="(item) in paginatedData"> 
            <tr class="table-contents" :key="item.seq">
              <td>{{ item.ctrYn == 'A' ? '자동' : item.almTy == $store.state.alarm.semiAuto ? '반자동' : '임계치'}}</td>
              <!-- <td>{{ item.ctrYn == 'A' ? '시스템' : item.usrId === null ? '-' : item.usrId }}</td> -->
              <td>{{ item.ctrYn == 'A' ? '시스템' : item.usrNm === null ? '-' : item.usrNm }}</td>
              <td>{{ item.processTitle }}</td>
              <td>{{ item.dp }}</td>
              <td>{{ item.tagCmpVal }}</td>
              <td>{{ item.tagVal }}</td>
              <td>{{ item.ctrTi | dateFormat }}</td>
              <td>{{ item.ctrYn == 'A' ? '자동 제어' : item.ctrYn == 'Y' ? '제어' : item.ctrYn == 'N' ? '취소' : '-' }}</td>
              <td><button @click="onClickDetail(item)">보기</button></td>
            </tr>
          </template>
        </tbody>
      </table>
      <!-- 페이지네이션 -->
      <div class="pagination-container">
        <div class="pagination">
          <a href="javascript:void(0);" @click="prevPage"><img src="@/assets/UserManagement/left-arrow.png" alt="이전"></a>
          <a href="javascript:void(0);" @click="setPage(n-1)" v-for="n in showedPageList" :key="n" :class="{active:n == pageNum + 1}">{{ n }}</a>
          <a href="javascript:void(0);" @click="nextPage"><img src="@/assets/UserManagement/right-arrow.png" alt="다음"></a>
        </div>
        <div class="pagination-search-box">
          <input type="text" placeholder="검색어 입력" class="input_search" v-model="search">
          <div class="pagination-search-icon" @click="onClickSearchWordBtn"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { SET_OVERLAY } from '@/store'

export default {
  name: 'TotalAlarmRecord',
  data: () => ({
    pageNum: 0, // 현재 페이지
    pageSize: 15, // 한 페이지에 표현할 갯수
    menuStart: false, // 검색 시작 날짜
    menuEnd: false, // 검색 종료 날짜
    search: null, // 검색어
    isSearch: false, // 검색중인지 아닌지 판단
    popupData: [],
    startTime: '00:00:00',
    endTime: '23:59:59'
  }),
  components: {
  },
  computed: {
    // 전체 페이지 갯수
    pageCount () {
      let listLeng = this.calcData.length
      let listSize = this.pageSize
      let page = Math.floor(listLeng / listSize)
      if (listLeng % listSize > 0) page += 1
      return page
    },
    // 현재 페이지에 나타낼 데이터
    paginatedData () {
      const start = this.pageNum * this.pageSize
      const end = start + this.pageSize
      return this.calcData.slice(start, end)
    },
    // 검색어 입력시 필터링한 데이터
    alarmHistorySearchData () {
      return this.$store.state.alarm.alarms.map((it) => {
        let _it = {}
        _it = it
        _it.processTitle = (it.processStep == 0 ? '펌프 ' : it.processStep +  '단계 ') + this.$getProcessTitle(it.process == 'G' ? it.process + it.disinfectionIndex : it.process) 
        if(_it.ctrYn === 'A'){
          _it.classification = 'auto_control'
        }else{
          _it.classification = 'user_control'
        }
        return _it
      })
    },
    // 검색 여부에 따라 데이터 필터링 후 반환
    calcData () {
      let filtered = this.alarmHistorySearchData.filter((data) => {
        let flag = false
        if (this.isSearch === true && this.search !== '' && this.search !== null) {
          Object.keys(data).forEach((key) => {
            if(data[key] != null && data[key].toString().includes(this.search)) {
              if(this.$store.state.alarm.selectedClassification == 'total' || this.$store.state.alarm.selectedClassification == data.classification){
                flag = true
                return flag
              }
            }
          })
        } else {
          if(this.$store.state.alarm.selectedClassification == 'total' || this.$store.state.alarm.selectedClassification == data.classification) {
            flag = true
            return flag
          }
        }
        if (flag) return data
      })
      return filtered
    },
    // 선택된 페이지 위치에 따라 표현할 페이지 리스트 반환
    showedPageList () {
      let totalCount = 10
      let leftCount = 5
      let rightCount = 4
      if (this.pageCount <= totalCount) {
        return this.range(1, this.pageCount)
      } else {
        if (this.pageNum <= leftCount) {
          return this.range(1, totalCount)
        } else {
          if (this.pageNum >= this.pageCount - leftCount) {
            return this.range(this.pageCount - (leftCount + rightCount), this.pageCount)
          } else {
            return this.range(this.pageNum - rightCount, this.pageNum + leftCount)
          }
        }
      }
    },
    controlCnt() {
      let count = 0
      this.calcData.forEach((it) => {
        if(it.ctrYn === 'Y') {
          if(this.$store.state.alarm.selectedClassification == 'total' || this.$store.state.alarm.selectedClassification == it.classification) {
            count++
          }
        }
      })
      return count
    },
    cancelCnt() {
      let count = 0
      this.calcData.forEach((it) => {
        if(it.ctrYn === 'N') {
          if(this.$store.state.alarm.selectedClassification == 'total' || this.$store.state.alarm.selectedClassification == it.classification) {
            count++
          }
        }
      })
      return count
    },
    autoControlCnt() {
      let count = 0
      this.calcData.forEach((it) => {
        if(it.ctrYn === 'A') {
          if(this.$store.state.alarm.selectedClassification == 'total' || this.$store.state.alarm.selectedClassification == it.classification) {
            count++
          }
        }
      })
      return count
    },
    noActionCnt() {
      let count = 0
      this.calcData.forEach((it) => {
        if(it.ctrYn === '') {
          if(this.$store.state.alarm.selectedClassification == 'total' || this.$store.state.alarm.selectedClassification == it.classification) {
            count++
          }
        }
      })
      return count
    },
    totalCnt() {
      let count = 0
      this.calcData.forEach((it) => {
        if(this.$store.state.alarm.selectedClassification == 'total' || this.$store.state.alarm.selectedClassification == it.classification) {
          count++
        }
      })
      return count
    },
  },
  methods: {
    /**
     * 날짜 검색 버튼 클릭시 실행되는 함수
     * 시작날짜, 종료날짜에 해당하는 알람이력 조회
     */
    onClickSearchBtn () {
      let _startTime = moment(this.$store.state.alarm.formattedStartTime + " " + this.startTime)
      let _endTime = moment(this.$store.state.alarm.formattedEndTime + " " + this.endTime)
      // _startTime.set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
      // _endTime.set({ hour: 23, minute: 59, second: 59, milliseconds: 999})
      this.$store.commit(SET_OVERLAY, true)
      Promise.all([
        this.$store.dispatch('alarm/PUT_ALARMS_SEARCH', { start_time: _startTime.valueOf(), end_time: _endTime.valueOf(), isInit: true})
      ]).finally(() => {
        this.$store.commit(SET_OVERLAY, false)
      })
    },
    /**
     * 검색 버튼을 클릭했을 때
     * 첫번째 페이지로 이동
     */
    onClickSearchWordBtn () {
      this.pageNum = 0
      this.isSearch = true
    },
    /**
     * 다음 페이지 버튼을 눌렀을 때
     * 현재 페이지 = 현재 페이지 + 1
     */
    nextPage () {
      if (this.pageNum === this.pageCount - 1) {
        this.pageNum = this.pageCount - 1
      } else {
        this.pageNum += 1
      }
    },
    /**
     * 이전 페이지 버튼을 눌렀을 때
     * 이전 페이지 = 이전 페이지 - 1
     */
    prevPage () {
      if (this.pageNum === 0) {
        this.pageNum = 0
      } else {
        this.pageNum -= 1
      }
    },
    /**
     * 특정 페이지를 눌렀을 때
     */
    setPage (v) {
      this.pageNum = v
    },
    /**
     * 숫자를 리스트로 반환하는 함수
     * 
     * @param start 시작 숫자
     * @param end 종료 숫자
     * @return 배열(시작 ~ 종료)
     */
    range: function (start, end) {
      let list = []
      for (let i = start; i <= end; i++) list.push(i)
      return list
    },
    onClickDetail: function(obj) {
      this.$store.state.alarm.selectedProcessTitle = obj.processTitle
      Promise.all([
        this.$store.dispatch('alarm/PUT_ALARMS_DETAIL', obj)
      ]).finally(() => {
        this.$store.state.alarm.visible = true
      })
    }
  },
  /**
   * 마운트 됐을 때 실행되는 함수
   * 알람 설정 정보를 조회함
   */
  mounted: function () {
    // console.log(this.$options.name + ' mounted')
    let now = moment()
    now.set({ hour: 23, minute: 59, second: 59, milliseconds: 999})
    this.$store.state.alarm.endTime = now
    this.$store.state.alarm.startTime = now.clone().subtract(6, 'd')
    this.$store.state.alarm.startTime.set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
    // console.log(this.$store.state.alarm.endTime.format('YYYY-MM-DD HH:mm:ss'), this.$store.state.alarm.startTime.format('YYYY-MM-DD HH:mm:ss'))
    this.$store.state.alarm.formattedStartTime = this.$store.state.alarm.startTime.format('YYYY-MM-DD')
    this.$store.state.alarm.formattedEndTime = this.$store.state.alarm.endTime.format('YYYY-MM-DD')

    this.$store.commit(SET_OVERLAY, true)
    Promise.all([
      this.$store.dispatch('alarm/GET_ALL_ALARM_SETTING'),
    ]).finally(() => {
      this.$store.commit(SET_OVERLAY, false)
    })
  },
  destroyed: function () {
    // console.log(this.$options.name + ' destoryed')
  },
  updated: function () {
    // console.log(this.$options.name + ' updated')
  },
  watch: { 
    // 검색값에 따라 검색값이 없는 경우 초기화
    search: function () {
      if (this.search === '' || this.search === null) {
        this.isSearch = false
        this.pageNum = 0
        
      } 
    },
    '$store.state.alarm.selectedClassification': function() {
      this.search = ''
      this.onClickSearchWordBtn()
    }
  }
}
</script>

<style lang="scss" scoped>
// 달력 위치
.v-menu__content {
  top: 227px !important;
}
// 최상위 엘리먼트
.record-search {
  width: 1230px;
  height: 964px;
  // 알람이력 타이틀
  .record-title {
    display: flex;
    align-items: center;
    height: 59px;
    // 알람이력 컨텐츠
    .record-title-contents {
      display: flex;
      align-items: center;
      width:100%;
      // 알람이력 텍스트
      .record-text {
        width: 197px;
        height: 47px;
        background-image: url('../../../assets/editableDashboard/title_under.png');
        margin-top:10px;
        text-shadow: 0 0 9px #5cafff;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        color: #ffffff;
      }
    }
  }
  // 시작날짜, 종료날짜 검색
  .start_end_date {  
    display: flex;
    position: relative;
    margin-top: 13.5px;
    width: 1230px;
    height: 64px;
    padding: 15px 50px;
    // 날짜 Input
    .selected-date {
      font-size: 14px;
      font-weight: normal;
      text-shadow: 0 0 9px #5cafff;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
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
    // 검색 버큰 아이콘
    .search-icon-img {
      background-image: url('~@/assets/alarmHistory/search_icon.png');
      width: 13.8px;
      height: 15.4px;
      margin-right: 7.3px;
    }
    // 검색 버튼 텍스트
    .search-btn-text {
      font-size: 13px;
      text-shadow: 0 0 9px #5cafff;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      color: #ffffff;
    }
    // arrow
    .right-arrow-img {
      background-image: url('~@/assets/alarmHistory/right_arrow.png');
      background-repeat: no-repeat;
      width: 23.2px;
      height: 9.1px;
      margin: 13px 26.3px 0 30.6px;
    }
    .category-box {
      margin-left: auto;
      display: flex;
      align-items: flex-end;
    }
    .category-box span{
      color: #b4dffa;
      font-size: 14px;
      padding-left: 10px;
      position: relative;
    }
    .category-box span:first-child{
      color: #fff;
      padding-right: 20px;
    }
    .category-box span:first-child::after{
      content: "";
      display: inline-block;
      width: 1px;
      height: 14px;
      background-color: #fff;
      position: absolute;
      top: 2px;
      margin-left: 15px;
    }
  }
  // 알람 이력 테이블
  .record-table {
    width: 1230px;
    height: 800px;
    margin-top: 14px;
    // padding: 14px 20px 16px 17px;
    // 검색 결과 테이블
    .search-table {
      width: 100%;
      border-spacing: 0px;
      border-collapse: separate;
      margin-top: 5px;
      // thead tr
      .table-title {
        // display: inline-flex;
        // justify-content: center;
        // align-items: center;
        width: 100%;
        height: 45px;
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        color: rgba(255, 255, 255, 0.85);
        vertical-align: middle;
        background-image: linear-gradient(to right, rgba(16, 36, 65, 0) 0%, rgba(39, 86, 162, 0.93) 14%, rgba(39, 86, 162, 0.93) 85%, rgba(16, 36, 65, 0) 100%);
        // thread td
        .row-text {
          // padding-top: 15px;
          // margin-right: 4px;
          // width: 219px;
          // height: 48px;
        }
      }
      // tbody
      .search-contents-container {
        width: 100%;
        // height: 669px;
        overflow: overlay;
        &::-webkit-scrollbar {
          width:6px;
        }
        &::-webkit-scrollbar-thumb {
          width: 6px;
          height: 146px;
          border-radius: 3.3px;
          background-color: #21b2e0;
        }
       // tbody tr
       .table-contents {
        height: 45px;
        font-size: 13px;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        color: #fff;
        vertical-align: middle;
        }
        .table-contents:nth-child(odd) {
          background-image: linear-gradient(90deg,rgba(9,76,181,0) 3%,rgba(9,76,181,.15) 21%,rgba(9,76,181,.15) 82%,rgba(9,76,181,0) 100%);
        }
        .table-contents:nth-child(even) {
          background-image: linear-gradient(90deg,rgba(66,144,221,0),rgba(66,144,221,.15) 16%,rgba(66,144,221,.15) 87%,rgba(66,144,221,0));
        }
        .table-contents button {
          padding: 2px 15px;
          border: 1px solid #457fbc;
          border-radius: 3px;
          color: #b4dffb;
        }
        .table-contents button:hover {
          background-color: #457fbc;
          color: #fff;
        }
      }
    }
    // 페이지네이션 컨테이너
    .pagination-container{
      display:flex;
      padding-top: 20px;
      align-items: center;
      // 페이지네이션
      .pagination {
        display: inline-block;
        margin: auto;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.08;
        letter-spacing: normal;
        color: rgba(255, 255, 255, 1);
        a {
          float: left;
          padding: 8px 10px;
          color:white;
          text-decoration: none;
          border-radius: 4px;
          &.active {
            background-color: rgba(253, 254, 255, 0.3);
            color: white;
          }
          &:hover:not(.active) {
            background-color: #ddd;
          }
        }
      }
      // 검색 박스
      .pagination-search-box {
        position: absolute;
        right: 58px;
        display: flex;
        width: 200px;
        align-items: center;
        // input
        .input_search {
          font-size: 13px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: left;
          color: #ffffff;
          width: 188.9px;
          border-bottom: solid 1px #ffffff;
          -webkit-appearance: none;
          -moz-appearance: none;
          background: transparent;
          padding: 0 5.6px 5px 5.6px;
          margin-right: 10px;
          &::placeholder {
            font-size: 13px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: left;
            text-shadow: 0 0 9px #5cafff;
            color: #ffffff;
          }
        }
        // 검색 아이콘
        .pagination-search-icon {
          background-image: url('~@/assets/alarmHistory/search_icon.png');
          width: 13.8px;
          height: 15.4px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>