<template>
  <div class="dashboard-container">
    <!-- 좌측 상단의 원수탁도, 정수탁도, 원수유입유량, 정수유출유량 컴포넌트-->
    <MainFactor/>
    <!-- 좌측 상단의 뇌 이미지 컴포넌트 -->
    <BrainImage/>
    <!-- 우측 자율운영 정보 컴포넌트 -->
    <DashboardInfo/>
    <!-- 라인(빨강, 파랑) & 물 흐름 컴포넌트 -->
    <WaterFlow/>
    
    <!-- 공정별 건물 배치 -->
    <div class="map-contents">
      <!-- 탈수기동 건물-->
      <!-- <div class="one-building"></div> -->
      <!-- 농축조 건물-->
      <!-- <div class="two-building"></div> -->
      <!-- 정수지 건물 -->
      <div class="four-building"></div>
      <!-- 관리동 건물 -->
      <!-- <div class="five-building"></div> -->
      <!-- 추가화면 -->
      <!-- <div class="sec"><a href="../../components/secSedimentation"></a></div> -->

      <!-- 1단계착수 건물 -->
      <div class="map-contents__splashdown" :class="[this.$store.state.selectedBuildingIndex === 22 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 22 ? 'opacity50' : '']">
        <div class="splashdown-text" @mouseover="onBuildingMouseover(22, 'processStep1')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(22)">1단계착수</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 22 ? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_06.png" usemap="#splashdown_map" alt="1단계착수건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 22 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_06_up.png" usemap="#over_splashdown_map" alt="1단계착수건물"/>
        <img class="aurora_splashdown" :class="[this.$store.state.selectedBuildingIndex === 22 ? 'building-unvisible': 'building-visible']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="1단계착수텍스트빛효과"/>
      </div>
      <!-- 1단계착수 회전 아이콘 -->
      <div class="cube splashdown_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep1.receiving ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_splashdown"></div>
          </div>
        </div>
      </div>

      <!--2단계착수 건물 -->
      <div class="map-contents__splashdown2" :class="[this.$store.state.selectedBuildingIndex === 1 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 1 ? 'opacity50' : '']">
        <div class="splashdown2-text" @mouseover="onBuildingMouseover(1, 'processStep2')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(1)">2단계착수</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 1 ? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_04.png" usemap="#splashdown_map" alt="2단계착수건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 1 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_04_up.png" usemap="#over_splashdown_map" alt="2단계착수건물"/>
        <img class="aurora_splashdown2" :class="[this.$store.state.selectedBuildingIndex === 1 ? 'building-unvisible': 'building-visible']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="2단계착수텍스트빛효과"/>
      </div>
      <!-- 2단계착수 회전 아이콘 -->
      <div class="cube splashdown2_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep2.receiving ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_splashdown"></div>
          </div>
        </div>
      </div>

      <!-- 1단계약품 건물 -->
      <div class="map-contents__drug" :class="[this.$store.state.selectedBuildingIndex === 2 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 2 ? 'opacity50' : '']">
        <div class="drug-text" @mouseover="onBuildingMouseover(2, 'processStep1')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(2)">1단계약품</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 2 ? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_03.png" usemap="#drug_map" alt="1단계약품건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 2 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_03_up.png" usemap="#over_drug_map" alt="1단계약품건물"/>
        <img class="aurora_drug" :class="[this.$store.state.selectedBuildingIndex === 2 ? 'building-unvisible': 'building-visible']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="1단계약품텍스트빛효과"/>
      </div>
      <!-- 1단계약품 회전 아이콘 -->
      <div class="cube drug_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep1.coagulants ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_drug"></div>
          </div>
        </div>
      </div>

      <!-- 2단계약품 건물 -->
      <div class="map-contents__drug2" :class="[this.$store.state.selectedBuildingIndex === 19 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 19 ? 'opacity50' : '']">
        <div class="drug2-text" @mouseover="onBuildingMouseover(19, 'processStep2')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(19)">2단계약품</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 19 ? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_03.png" usemap="#drug_map" alt="2단계약품건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 19 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_03_up.png" usemap="#over_drug_map" alt="2단계약품건물"/>
        <img class="aurora_drug2" :class="[this.$store.state.selectedBuildingIndex === 19 ? 'building-unvisible': 'building-visible']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="2단계약품텍스트빛효과"/>
      </div>
      <!-- 2단계약품 회전 아이콘 -->
      <div class="cube drug2_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep2.coagulants ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_drug"></div>
          </div>
        </div>
      </div>

      <!-- 1단계침전&혼화응집 건물 -->
      <div class="map-contents__sedimentation-mix" :class="[this.$store.state.selectedBuildingIndex === 21 || this.$store.state.selectedBuildingIndex === 21 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 20 && this.$store.state.selectedBuildingIndex !== 21 ? 'opacity50' : '']">
        <div class="sedimentation-text" :class="[this.$store.state.selectedBuildingIndex === 20 ? 'opacity50': '']" @mouseover="onBuildingMouseover(21, 'processStep1')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(21)">1단계침전</div>
        <div class="mix-text" :class="[this.$store.state.selectedBuildingIndex === 21 ? 'opacity50': '']" @mouseover="onBuildingMouseover(20, 'processStep1')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(20)">1단계혼화응집</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 20 || this.$store.state.selectedBuildingIndex === 21? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_01.png" alt="1단계침전&혼화응집건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 20 || this.$store.state.selectedBuildingIndex === 21 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_01_up.png" alt="1단계침전&혼화응집건물"/>
        <img class="aurora_sedimentation" :class="[this.$store.state.selectedBuildingIndex === 21 ? 'building-unvisible': 'building-visible', this.$store.state.selectedBuildingIndex === 21 ? 'opacity0' : '']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="1단계침전텍스트빛효과"/>
        <img class="aurora_mix" :class="[this.$store.state.selectedBuildingIndex === 20 ? 'building-unvisible': 'building-visible', this.$store.state.selectedBuildingIndex === 20 ? 'opacity0' : '']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="1단계혼화응집텍스트빛효과"/>
      </div>
      <!-- 1단계침전 회전 아이콘 -->
      <div class="cube sedimentation_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep1.sedimentation ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_sedimentation"></div>
          </div>
        </div>
      </div>
      <!-- 1단계혼화응집 회전 아이콘 -->
      <div class="cube mix_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep1.mixing ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_mix"></div>
          </div>
        </div>
      </div>

      <!-- 2단계침전&혼화응집 건물 -->
      <div class="map-contents__sedimentation2-mix" :class="[this.$store.state.selectedBuildingIndex === 4 || this.$store.state.selectedBuildingIndex === 4 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 3 && this.$store.state.selectedBuildingIndex !== 4 ? 'opacity50' : '']">
        <div class="sedimentation2-text" :class="[this.$store.state.selectedBuildingIndex === 3 ? 'opacity50': '']" @mouseover="onBuildingMouseover(4, 'processStep2')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(4)">2단계침전</div>
        <div class="mix2-text" :class="[this.$store.state.selectedBuildingIndex === 4 ? 'opacity50': '']" @mouseover="onBuildingMouseover(3, 'processStep2')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(3)">2단계혼화응집</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 3 || this.$store.state.selectedBuildingIndex === 4 ? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_01.png" alt="2단계침전&혼화응집건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 3 || this.$store.state.selectedBuildingIndex === 4 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_01_up.png" alt="2단계침전&혼화응집건물"/>
        <img class="aurora_sedimentation2" :class="[this.$store.state.selectedBuildingIndex === 4 ? 'building-unvisible': 'building-visible', this.$store.state.selectedBuildingIndex === 4 ? 'opacity0' : '']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="2단계침전텍스트빛효과"/>
        <img class="aurora_mix2" :class="[this.$store.state.selectedBuildingIndex === 3 ? 'building-unvisible': 'building-visible', this.$store.state.selectedBuildingIndex === 3 ? 'opacity0' : '']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="2단계혼화응집텍스트빛효과"/>
      </div>
      <!-- 2단계침전 회전 아이콘 -->
      <div class="cube sedimentation2_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep2.sedimentation ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_sedimentation"></div>
          </div>
        </div>
      </div>
      <!-- 2단계혼화응집 회전 아이콘 -->
      <div class="cube mix2_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep2.mixing ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_mix"></div>
          </div>
        </div>
      </div>
      <!-- 1단계여과 건물 -->
      <div class="map-contents__percolation" :class="[this.$store.state.selectedBuildingIndex === 23 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 23 ? 'opacity50' : '']">
        <div class="percolation-text" @mouseover="onBuildingMouseover(23, 'processStep1')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(23)">1단계여과</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 23 ? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_02.png" usemap="#percolation_map" alt="1단계여과건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 23 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_02_up.png" usemap="#percolation_over_map" alt="1단계여과건물"/>
        <img class="aurora_percolation" :class="[this.$store.state.selectedBuildingIndex === 23 ? 'building-unvisible': 'building-visible']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="1단계여과텍스트빛효과"/>
      </div>
      <!-- 1단계여과 회전 아이콘 -->
      <div class="cube percolation_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep1.filter ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_percolation"></div>
          </div>
        </div>
      </div>
      <!-- 2단계여과 건물 -->
      <div class="map-contents__percolation2" :class="[this.$store.state.selectedBuildingIndex === 5 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 5 ? 'opacity50' : '']">
        <div class="percolation2-text" @mouseover="onBuildingMouseover(5, 'processStep2')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(5)">2단계여과</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 5 ? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_02.png" usemap="#percolation_map" alt="2단계여과건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 5 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_02_up.png" usemap="#percolation_over_map" alt="2단계여과건물"/>
        <img class="aurora_percolation2" :class="[this.$store.state.selectedBuildingIndex === 5 ? 'building-unvisible': 'building-visible']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="2단계여과텍스트빛효과"/>
      </div>
      <!-- 2단계여과 회전 아이콘 -->
      <div class="cube percolation2_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.state.dashboard.processStep2.filter ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_percolation"></div>
          </div>
        </div>
      </div>

      <!-- 소독 건물 -->
      <div class="map-contents__disinfection" :class="[this.$store.state.selectedBuildingIndex === 24 ? 'zIndex10': '', this.$store.state.selectedBuildingIndex > 0 && this.$store.state.selectedBuildingIndex !== 24 ? 'opacity50' : '']">
        <div class="disinfection-text" @mouseover="onBuildingMouseover(24, 'processStep1')" @mouseout="this.onBuildingMouseout" @click="$routingByIndex(24)">소독</div>
        <img class="down" :class="[this.$store.state.selectedBuildingIndex === 24 ? 'building-unvisible': 'building-visible']" src="../../assets/cj_images/cj_box_08.png" usemap="#disinfection_map" alt="소독건물"/>
        <img class="up" :class="[this.$store.state.selectedBuildingIndex === 24 ? 'building-visible': 'building-unvisible']" src="../../assets/cj_images/cj_box_08_up.png" usemap="#over_disinfection_map" alt="소독건물"/>
        <img class="aurora_disinfection" :class="[this.$store.state.selectedBuildingIndex === 24 ? 'building-unvisible': 'building-visible']" src="../../assets/dashboard_icons/bottom-aurora.png" alt="소독텍스트빛효과"/>
      </div>
      <!-- 소독 아이콘 -->
      <div class="cube disinfection_cube" :class="[this.$store.state.selectedBuildingIndex > 0 ? 'building-unvisible': 'building-visible']">
        <div class="cube__inner">
          <div class="cube__noimg">
          <div :class="[this.$store.getters['indDisinfection/isAiOperationMode'] ? 'cube__front_logo--on' : 'cube__front_logo--off']"></div>
          <div class="cube__back_logo back_disinfection"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 착수 팝업 (1단계, 2단계) -->
    <Popup1 v-if="[22, 1].includes(this.$store.state.selectedBuildingIndex)"/>
    <!-- 약품 팝업 (1단계, 2단계) -->
    <Popup2 v-if="[19, 2].includes(this.$store.state.selectedBuildingIndex)"/>
    <!-- 혼화응집 팝업 (1단계, 2단계) -->
    <Popup3 v-if="[20, 3].includes(this.$store.state.selectedBuildingIndex)"/>
    <!-- 침전 팝업 (1단계, 2단계) -->
    <Popup4 v-if="[21, 4].includes(this.$store.state.selectedBuildingIndex)"/>
    <!-- 여과 팝업 (1단계, 2단계) -->
    <Popup5 v-if="[23, 5].includes(this.$store.state.selectedBuildingIndex)"/>
    <!-- 소독 팝업 (1단계, 2단계) -->
    <Popup7 v-if="[7.1, 7.2, 7.3, 24].includes(this.$store.state.selectedBuildingIndex)"/>
    <!-- 운영 이력 팝업-->
    <AIOprHistoryPopup/>

  </div>
</template>

<script>
import MainFactor from '@/components/dashboard/MainFactor'
import DashboardInfo from '@/components/dashboard/DashboardInfo'
import WaterFlow from '@/components/dashboard/WaterFlow'
import BrainImage from '@/components/dashboard/BrainImage'
import Popup1 from '@/components/dashboard/popup/Popup1'
import Popup2 from '@/components/dashboard/popup/Popup2'
import Popup3 from '@/components/dashboard/popup/Popup3'
import Popup4 from '@/components/dashboard/popup/Popup4'
import Popup5 from '@/components/dashboard/popup/Popup5'
import Popup7 from '@/components/dashboard/popup/Popup7'
import AIOprHistoryPopup from '@/components/dashboard/popup/AIOprHistoryPopup'
import { SET_OVERLAY } from '@/store'
import { GET_AI_OPR } from '@/store/modules/dashboard'
import { GET_PMS_LATEST } from '@/store/modules/pms'

//1단계 공정 import
// import { GET_INDRECEIVING_LATEST } from '@/store/modules/indReceiving' 
// import { GET_INDCOAGULANT_LATEST } from '@/store/modules/indCoagulants'
// import { GET_INDMIXING_LATEST } from '@/store/modules/indMixing'
// import { GET_INDSEDIMENTATION_LATEST } from '@/store/modules/indSedimentation'
// import { GET_INDFILTER_LATEST } from '@/store/modules/indFilter'
// import { GET_INDDISINFECTION_LATEST_MAIN } from '@/store/modules/indDisinfection'


//2단계 공정 import
// import { GET_RECEIVING_LATEST } from '@/store/modules/receiving' 
// import { GET_COAGULANT_LATEST } from '@/store/modules/secondCoagulants'
// import { GET_MIXING_LATEST } from '@/store/modules/mixing'
// import { GET_SEDIMENTATION_LATEST } from '@/store/modules/sedimentation'
// import { GET_FILTER_LATEST } from '@/store/modules/filter'
// import { GET_DISINFECTION_LATEST_MAIN } from '@/store/modules/disinfection'
import { SERVICE_URL } from '@/store'
import { GET_AI_OPR_HISTORY_TOTAL } from '@/store/modules/aioprhistory'

export default {
  name: 'Dashboard',
  data: () => ({
  }),
  // Dashboard에서 이용할 Component 정의
  components: {
    MainFactor,
    DashboardInfo,
    WaterFlow,
    Popup1,
    Popup2,
    Popup3,
    Popup4,
    Popup5,
    Popup7,
    BrainImage,
    AIOprHistoryPopup
  },
  // Dashboard.vue에서 이용할 함수 정의
  methods:{
    /**
     * EMS 페이지로 이동하는 함수
     * '_self' 옵션으로 새롭게 창을 띄우지 않고 이동
     */
    onClickSending: function() {
      window.open(SERVICE_URL.EMS + '/analysis', "_self")
    },
    /**
     * 선택한 공정 페이지로 이동하는 함수
     * Vue Router를 통해 선택한 공정 페이지로 이동
     *
     * @param index 선택한 공정 index
     */
    onBuildingMouseClick: function(index) {
      this.$routingByIndex(index)
    },
    /**
     * 공정 건물에 마우스를 올렸을 때 발생하는 이벤트 함수
     * 선택된 공정 건물로 상태값을 변경
     *
     * @param index 선택한 공정 index
     */
    onBuildingMouseover: function (index, processStep) {
      this.$store.state.dashboard.processStep = processStep
      this.$store.state.selectedBuildingIndex = index
    },
    /**
     * 공정 건물에 마우스가 벗어났을 때 발생하는 이벤트 함수
     * 선택된 공정 건물 상태 값을 없음(0)으로 변경
     */
    onBuildingMouseout: function () {
      this.$store.state.selectedBuildingIndex = 0
    },
  },
  /**
   * Dashboard.vue가 마운트 됐을 때 실행되는 함수 
   * 1분 간격으로 API 호출하는 interval 등록
   * 호출 전 로딩바 생성 / 호출 후 로딩바 제거
   */
  mounted: function() {
    this.$store.commit(SET_OVERLAY, true)
    Promise.all([
      this.$store.dispatch(GET_AI_OPR),
      this.$store.dispatch(GET_AI_OPR_HISTORY_TOTAL),
      this.$store.dispatch(GET_PMS_LATEST)
    ]).finally(() => {
      this.$store.commit(SET_OVERLAY, false)
    })
    
    this.timer = setInterval(() => {
      this.$store.dispatch(GET_AI_OPR),
      this.$store.dispatch(GET_AI_OPR_HISTORY_TOTAL),
      this.$store.dispatch(GET_PMS_LATEST)
    }, 60 * 1000)
  },
  /**
   * Dashboard.vue가 제거될 때 실행되는 함수
   * 마운트에서 등록해 놓은 API 호출 interval 제거
   */
  destroyed: function () {
    // console.log(this.$options.name + ' destoryed')
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
.sec a{
  position: absolute;
  top: 10px;
  border: 1px solid #fff;
}
// 공정 건물 안 보이도록 함
.building-unvisible {
  display: none !important;
}
// 공정 건물을 보이도록 함
.building-visible {
  display: block !important;
}
// 대시보드 사이즈 및 배경
.dashboard-container {
  background-image: url('../../assets/cj_images/main_bg.png');
  background-size: cover;
  width: 100%;
  height: 100%;
  min-height: 985px;
  overflow-y: auto;
}
// 레이어 10층
.zindex10 {
  z-index: 10;
}
// 불투명도 0
.opacity0 {
  opacity: 0 !important;
}
// 불투명도 50%
.opacity50 {
  opacity: 0.5 !important;
}
// 불투명도 100%
.opacity100 {
  opacity: 1 !important;
}
// 대시보드 건물 레이아웃
.map-contents {
  position: absolute;
  top: 226.5px;
  width: 1509px;
  height: 763px;
  img{
    position: absolute;
  }
    // 정수지 건물
    .four-building{
    position: absolute;
    top: 307px;
    left: 1211px;
    width: 244px;
    height: 183px;
    background-image: url('../../assets/cj_images/cj_box_07.png');
  }
  // 탈수기동 건물
  // .one-building{
  //   position: absolute;
  //   top: 252px;
  //   left: 50px;
  //   width: 196px;
  //   height: 129px;
  //   background-image: url('../../assets/dashboard_img/one_building.png');
  // }
  // 농축조 건물
  // .two-building{
  //   position: absolute;
  //   top: 172px;
  //   left: 319px;
  //   width: 227px;
  //   height: 128px;
  //   background-image: url('../../assets/dashboard_img/two_building.png');
  // }

  // 관리동 건물
  // .five-building{
  //   position: absolute;
  //   top: 260px;
  //   left: 890px;
  //   width: 236px;
  //   height: 178px;
  //   background-image: url('../../assets/dashboard_img/five_building.png');
  // }
  // 1단계착수 건물
  &__splashdown{
    z-index: 3;
    position: absolute;
    left: 1062px;
    top: -78px;
    width: 175px;
    height: 125px;
    clip-path: polygon(0 -100%, 200% 0, 100% 72%, 57% 101%, 0 72%);
    // 마우스 오버시 건물 Up
    .up{
      position: absolute;
      top: -54px;
      left: 0;
      animation: splashdown-up 1s ease-in-out 0s normal;
    }
    // 마우스 오버시 건물 Up keyframes
    @keyframes splashdown-up {
      0% {
        transform: translateY(53px);
      }
      100% {
        transform: translateY(0);
      }
    }
    // 아이콘 하단에 반짝이는 빛
    .aurora_splashdown{
      pointer-events:none;
      top: -38px;
      left: 33px;
      animation: blink 3s infinite alternate;
    }
    // 착수 텍스트
    .splashdown-text {
      position: absolute;
      left: 18px;
      top: 23px;
      width: 140px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;    
    }
  }
  // 2단계착수 건물
  &__splashdown2{
    z-index: 3;
    position: absolute;
    left: 777px;
    top: 278px;
    width: 156px;
    height: 127px;
    clip-path: polygon(0 -100%, 200% 0, 100% 74%, 57% 101%, 0 70%);
    // 마우스 오버시 건물 Up
    .up{
      position: absolute;
      top: -57px;
      left: 0;
      animation: splashdown2-up 1s ease-in-out 0s normal;
    }
    // 마우스 오버시 건물 Up keyframes
    @keyframes splashdown2-up {
      0% {
        transform: translateY(58px);
      }
      100% {
        transform: translateY(0);
      }
    }
    // 아이콘 하단에 반짝이는 빛
    .aurora_splashdown2{
      pointer-events:none;
      top: -38px;
      left: 20px;
      animation: blink 3s infinite alternate;
    }
    // 착수 텍스트
    .splashdown2-text {
      position: absolute;
      left: 9px;
      top: 26px;
      width: 140px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;    
    }
  }
  // 1단계약품 건물
  &__drug{
    z-index: 2;
    position: absolute;
    left: 1243px;
    top: -23px;
    width: 180px;
    height: 146px;
    clip-path: polygon(0 -100%, 200% 0, 100% 75%, 58% 101%, 0 71%);
    .up{
      position: absolute;
      top: -57px;
      left: 0;
      animation: drug-up 1s ease-in-out 0s normal;
    }
    @keyframes drug-up {
      0% {
        transform: translateY(56px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_drug{
      pointer-events:none;
      top: -18px;
      left: 36px;
      animation: blink 3s infinite alternate;
    }
    .drug-text {
      position: absolute;
      left: 42px;
      top: 41px;
      width: 100px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
  }
    // 2단계약품 건물
    &__drug2{
    z-index: 2;
    position: absolute;
    left: 595px;
    top: 168px;
    width: 180px;
    height: 146px;
    clip-path: polygon(0 -100%, 200% 0, 100% 75%, 58% 101%, 0 71%);
    .up{
      position: absolute;
      top: -57px;
      left: 0;
      animation: drug2-up 1s ease-in-out 0s normal;
    }
    @keyframes drug2-up {
      0% {
        transform: translateY(56px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_drug2{
      pointer-events:none;
      top: -17px;
      left: 33px;
      animation: blink 3s infinite alternate;
    }
    .drug2-text {
      position: absolute;
      left: 42px;
      top: 41px;
      width: 100px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
  }
  
  // 1단계침전 건물
  &__sedimentation-mix{
    z-index: 1;
    position: absolute;
    left: 569px;
    top: -68px;
    width: 563px;
    height: 318px;
    clip-path: polygon(0 -100%, 200% 0, 100% 61%, 61% 100%, 0 52%);
    .up{
      position: absolute;
      top: -61px;
      left: 0px;
      animation: sedimentation-mix-up 1s ease-in-out 0s normal;
    }
    @keyframes sedimentation-mix-up {
      0% {
        transform: translateY(60px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_sedimentation{
      pointer-events:none;
      top: 50px;
      left: 192px;
      animation: blink 3s infinite alternate;
    }
    .aurora_mix{
      pointer-events:none;
      top: 1px;
      left: 285px;
      animation: blink 3s infinite alternate;
    }
    .sedimentation-text {
      position: absolute;
      left: 137px;
      top: 113px;
      width: 210px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
    .mix-text {
      position: absolute;
      left: 228px;
      top: 62px;
      width: 250px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor:pointer;
    }
  }
    // 2단계침전 건물
    &__sedimentation2-mix{
    z-index: 1;
    position: absolute;
    left: 155px;
    top: 223px;
    width: 563px;
    height: 318px;
    clip-path: polygon(0 -100%, 200% 0, 100% 61%, 61% 100%, 0 52%);
    .up{
      position: absolute;
      top: -61px;
      left: 0px;
      animation: sedimentation-mix-up 1s ease-in-out 0s normal;
  
    }
    @keyframes sedimentation-mix-up {
      0% {
        transform: translateY(60px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_sedimentation2{
      pointer-events:none;
      top: 55px;
      left: 176px;
      animation: blink 3s infinite alternate;
    }
    .aurora_mix2{
      pointer-events:none;
      top: 1px;
      left: 285px;
      animation: blink 3s infinite alternate;
    }
    .sedimentation2-text {
      position: absolute;
      left: 125px;
      top: 112px;
      width: 210px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
    .mix2-text {
      position: absolute;
      left: 222px;
      top: 67px;
      width: 250px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor:pointer;
    }
  }

  // 1단계여과 건물
  &__percolation{
    z-index: 2;
    position: absolute;
    top: 138px;
    left: 1028px;
    width: 296px;
    height: 203px;
    clip-path: polygon(0 -100%, 200% 0, 100% 41%, 31% 100%, 0 80%);
    // clip-path: polygon(-200% -200%, 101% -75%, 200% 100%, -100% 100%, -200% -100%, 0% 0%);
    .up {
      position: absolute;
      left:0;
      top: -48px;
      animation: percolation-up 1s ease-in-out 0s normal;
    }
    @keyframes percolation-up {
      0% {
        transform: translateY(47px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_percolation{
      pointer-events:none;
      top: -1px;
      left: 82px;
      animation: blink 3s infinite alternate;
    }
    .percolation-text{
      position: absolute;
      left: 67px;
      top: 64px;
      width: 159px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
  }
  // 2단계여과 건물
  &__percolation2{
    z-index: 2;
    position: absolute;
    top: 421px;
    left: 617px;
    width: 296px;
    height: 203px;
    clip-path: polygon(0 -100%, 200% 0, 100% 41%, 31% 100%, 0 80%);
    .up {
      position: absolute;
      left:0;
      top: -48px;
      animation: percolation-up 1s ease-in-out 0s normal;
    }
    @keyframes percolation-up {
      0% {
        transform: translateY(47px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_percolation2{
      pointer-events:none;
      top: -2px;
      left: 86px;
      animation: blink 3s infinite alternate;
    }
    .percolation2-text{
      position: absolute;
      left: 66px;
      top: 62px;
      width: 159px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
  }
  // 소독 건물
  &__disinfection{
    position: absolute;
    left: 426px;
    top: 118px;
    width: 132px;
    height: 93px;
    clip-path: polygon(0 -100%, 200% 0, 100% 58%, 42% 100%, 0 70%);
    .up{
      position: absolute;
      top:-36px;
      left: 0;
      animation: disinfection-up 1s ease-in-out 0s normal;
    }
    @keyframes disinfection-up {
      0% {
        transform: translateY(35px);
      }
      100% {
        transform: translateY(0);
      }
    }
    .aurora_disinfection{
      pointer-events:none;
      top: -42px;
      left: -10px;
      animation: blink 3s infinite alternate;
    }
    .disinfection-text {
      position: absolute;
      left: -27px;
      top: 22px;
      width: 150px;
      height: 37px;
      opacity: 0.8;
      background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
      text-shadow: 0 0 9px #5cafff;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      z-index: 10;
      cursor: pointer;
    }
  }
  // 정수지동(공업) 건물
  // &__pump{
  //   position: absolute;
  //   left: 1031px;
  //   top: 305px;
  //   width: 61px;
  //   height: 132px;
  //   clip-path:polygon(-200% -200%, 101% -75%, 200% 100%, -100% 100%, -200% 100%, 0% 0%);
  //   .aurora_pump{
  //     pointer-events:none;
  //     top: -37px;
  //      left: -25px;
  //     animation: blink 3s infinite alternate;
  //   }
  //   .up {
  //     position: absolute;
  //     top: -38px;
  //     left: 0;
  //     animation: pump-up 1s ease-in-out 0s normal;
  //   }
  //   @keyframes pump-up {
  //     0% {
  //       transform: translateY(37px);
  //     }
  //     100% {
  //       transform: translateY(0);
  //     }
  //   }
  //   .pump-text {
  //     position: absolute;
  //     left: -68px;
  //     top: 31px;
  //     width: 210px;
  //     height: 37px;
  //     opacity: 0.8;
  //     background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
  //     text-shadow: 0 0 9px #5cafff;
  //     font-size: 20px;
  //     font-weight: normal;
  //     font-stretch: normal;
  //     font-style: normal;
  //     line-height: 2;
  //     letter-spacing: normal;
  //     text-align: center;
  //     color: #fff;
  //     z-index: 10;
  //     cursor: pointer;  
  //   }
  // }
    // 정수지동(공업) 건물
  // &__pump2{
  //   position: absolute;
  //   left: 648px;
  //   top: 531px;
  //   width: 82px;
  //   height: 94px;
  //   clip-path: polygon(-200% -200%, 101% -75%, 200% 100%, -100% 100%, -200% -100%, 0% 0%);
  //   .aurora_pump2{
  //     pointer-events:none;
  //     top: -36px;
  //      left: -13px;
  //     animation: blink 3s infinite alternate;
  //   }
  //   .up2 {
  //     position: absolute;
  //     top: -37px;
  //     left: 0;
  //     animation: pump-up 1s ease-in-out 0s normal;
  //   }
  //   @keyframes pump2-up {
  //     0% {
  //       transform: translateY(36px);
  //     }
  //     100% {
  //       transform: translateY(0);
  //     }
  //   }
  //   .pump2-text {
  //     position: absolute;
  //     left: -68px;
  //     top: 31px;
  //     width: 210px;
  //     height: 37px;
  //     opacity: 0.8;
  //     background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
  //     text-shadow: 0 0 9px #5cafff;
  //     font-size: 20px;
  //     font-weight: normal;
  //     font-stretch: normal;
  //     font-style: normal;
  //     line-height: 2;
  //     letter-spacing: normal;
  //     text-align: center;
  //     color: #fff;
  //     z-index: 10;
  //     cursor: pointer;  
  //   }
  // }
  // 탈수기동 건물
  // &__concentration{
  //   z-index: 1;
  //   position: absolute;
  //   left: 45px;
  //   top: 240px;
  //   width: 199px;
  //   height: 145px;
  //   clip-path: polygon(59% -100%, 101% -75%, 101% 65%, 26% 100%, -1% 69%, -1% -72%);
  //   .up{
  //     position: absolute;
  //     top: -57px;
  //     left: -30px;
  //     animation: concentration-up 1s ease-in-out 0s forwards;
  //   }
  //   @keyframes concentration-up {
  //     0% {
  //       transform: translateY(56px);
  //     }
  //     100% {
  //       transform: translateY(15px);
  //     }
  //   }
  //   .aurora_concentration{
  //     pointer-events:none;
  //     top: -36px;
  //     left: 40px;
  //     animation: blink 3s infinite alternate;
  //   }
  //   .concentration{
  //     pointer-events:none;
  //     top: -36px;
  //     left: 40px;
  //     animation: blink 3s infinite alternate;
  //   }
  //   .concentration-text {
  //     position: absolute;
  //     left: -26px;
  //     top: 40px;
  //     width: 250px;
  //     height: 37px;
  //     opacity: 0.8;
  //     background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
  //     text-shadow: 0 0 9px #5cafff;
  //     font-size: 20px;
  //     font-weight: normal;
  //     font-stretch: normal;
  //     font-style: normal;
  //     line-height: 2;
  //     letter-spacing: normal;
  //     text-align: center;
  //     color: #fff;
  //     z-index: 10;
  //     cursor: pointer;  
  //   }
  // }
  // 농축조 건물
  // &__dehydration{
  //   z-index: 1;
  //   position: absolute;
  //   left: 291px;
  //   top: 148px;
  //   width: 279px;
  //   height: 140px;
  //   clip-path: polygon(46% -100%, 72% -100%, 100% -71%, 100% 70%, 58% 100%, 28% 100%, 0 65%, 0 -74%);
  //   .up{
  //     position: absolute;
  //     top: -57px;
  //     left: -30px;
  //     animation: dehydration-up 1s ease-in-out 0s normal;
  //   }
  //   @keyframes dehydration-up {
  //     0% {
  //       transform: translateY(56px);
  //     }
  //     100% {
  //       transform: translateY(0);
  //     }
  //   }
  //   .aurora_dehydration{
  //     pointer-events:none;
  //     top: -24px;
  //     left: 82px;
  //     animation: blink 3s infinite alternate;
  //   }
  //   .dehydration{
  //     pointer-events:none;
  //     top: -36px;
  //     left: 40px;
  //     animation: blink 3s infinite alternate;
  //   }
  //   .dehydration-text {
  //     position: absolute;
  //     left: 15px;
  //     top: 52px;
  //     width: 250px;
  //     height: 37px;
  //     opacity: 0.8;
  //     background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
  //     text-shadow: 0 0 9px #5cafff;
  //     font-size: 20px;
  //     font-weight: normal;
  //     font-stretch: normal;
  //     font-style: normal;
  //     line-height: 2;
  //     letter-spacing: normal;
  //     text-align: center;
  //     color: #fff;
  //     z-index: 10;
  //     cursor: pointer;  
  //   }
  // }
  // 오존 건물
  // &__o3{
  //   z-index: 1;
  //   position: absolute;
  //   left: 451px;
  //   top: 281px;
  //   width: 79px;
  //   height: 61px;
  //   clip-path: polygon(67% -100%, 100% -80%, 100% 74%, 33% 100%, 0 76%, 0 -80%);
  //   .up{
  //     position: absolute;
  //     top: -57px;
  //     left: -30px;
  //     animation: o3-up 1s ease-in-out 0s normal forwards;
  //   }
  //   @keyframes o3-up {
  //     0% {
  //       transform: translateY(56px);
  //     }
  //     100% {
  //       transform: translateY(25px);
  //     }
  //   }
  //   .aurora_o3{
  //     pointer-events:none;
  //     top: -61px;
  //     left: -17px;
  //     animation: blink 3s infinite alternate;
  //   }
  //   .o3{
  //     pointer-events:none;
  //     top: -36px;
  //     left: 40px;
  //     animation: blink 3s infinite alternate;
  //   }
  //   .o3-text {
  //     position: absolute;
  //     left: -84px;
  //     top: 14px;
  //     width: 250px;
  //     height: 37px;
  //     opacity: 0.8;
  //     background-image: linear-gradient(to right, rgba(32, 80, 105, 0) 2%, rgba(2, 23, 52, 0.6) 36%, rgba(2, 23, 52, 0.6) 64%, rgba(32, 57, 105, 0));
  //     text-shadow: 0 0 9px #5cafff;
  //     font-size: 20px;
  //     font-weight: normal;
  //     font-stretch: normal;
  //     font-style: normal;
  //     line-height: 2;
  //     letter-spacing: normal;
  //     text-align: center;
  //     color: #fff;
  //     z-index: 10;
  //     cursor: pointer;
  //   }
  // }
}

// 공정별 아이콘
// 위 아래로 움직이는 아이콘
.cube {
  z-index: 5;
  pointer-events:none;  
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 80px;
  height: 80px;
  -webkit-animation: updown 2s ease-in-out 0s infinite alternate;
  animation: updown 2s ease-in-out 0s infinite alternate;
  // 아이콘 테투리 원
  &__inner {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('../../assets/dashboard_icons/cube_back.png');
  }
  // 아이콘 3차원
  &__noimg{
    width: 80px;
    height: 80px;
    -webkit-transform-style: preserve-3d;
    -webkit-transform: rotateX(0) rotateY(0) rotateZ(0);

    transform-style: preserve-3d;
    transform: rotateX(0) rotateY(0) rotateZ(0);
    // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
    -webkit-animation: turn 5s linear 0s infinite normal;
    animation: turn 5s linear 0s infinite normal;
  }
  // 아이콘 앞면(AI 모드 ON)
  &__front_logo--on {    
    width: 80px;
    height: 80px;
    background-image: url('../../assets/dashboard_icons/cube_ai_icon.png');
    background-position: center;
    background-size: cover;
    position: absolute;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  // 아이콘 앞면(AI 모드 OFF)
  &__front_logo--off {    
    width: 80px;
    height: 80px;
    background-image: url('../../assets/dashboard_icons/cube_ai_off_icon.png');
    background-position: center;
    background-size: cover;
    position: absolute;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  // 아이콘 뒷면
  &__back_logo {
    width: 80px;
    height: 80px;
    background-position: center;
    position: absolute;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform:  rotateY(180deg);
    -webkit-transform:  rotateY(180deg);
  }
}
// 회전 keyframe
@-webkit-keyframes turn {
  0% {
    -webkit-transform: rotateY(0);
  }
  100% {
    -webkit-transform: rotateY(360deg);
  }
}
@keyframes turn {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(360deg);
  }
}

// 위아래 둥실둥실 keyframe
@keyframes updown {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(20px);
  }
}
@-webkit-keyframes updown {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(20px);
  }
}

// 반짝반짝 keyframe
@keyframes blink {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

// 소독 아이콘
.disinfection_cube{
  top: 25px;
  left: 430px;

  .back_disinfection{
    background-image: url('../../assets/dashboard_icons/cube_disinfection_icon.png');
  }
}

// 1단계여과 아이콘
.percolation_cube{
  top: 95px;
  left: 1125px;
  .back_percolation{
    background-image: url('../../assets/dashboard_icons/cube_percolation_icon.png');
  }
}
// 2단계여과 아이콘
.percolation2_cube{
  top: 368px;
  left: 717px;
  .back_percolation{
    background-image: url('../../assets/dashboard_icons/cube_percolation_icon.png');
  }
}

// 1단계약품  아이콘
.drug_cube{
  top: -93px;
  left: 1296px;
  .back_drug{
    background-image: url('../../assets/dashboard_icons/cube_drug_icon.png');
  }
}
// 2단계약품  아이콘
.drug2_cube{
  top: 92px;
  left: 644px;
  .back_drug{
    background-image: url('../../assets/dashboard_icons/cube_drug_icon.png');
  }
}
// 약품 좌측하단 아이콘
// .drug3_cube{
//   top: 150px;
//   left: 318px;
//   .back_drug{
//     background-image: url('../../assets/dashboard_icons/cube_drug_icon.png');
//   }
// }

// 1단계착수 아이콘
.splashdown_cube{
  top: -168px;
  left: 1109px;
  .back_splashdown{
    background-image: url('../../assets/dashboard_icons/cube_splashdown_icon.png');
  }
}
// 2단계착수 아이콘
.splashdown2_cube{
  top: 190px;
  left: 813px;
  .back_splashdown{
    background-image: url('../../assets/dashboard_icons/cube_splashdown_icon.png');
  }
}

// 1단계침전 아이콘
.sedimentation_cube{
  z-index: 2;
  top: -65px;
  left: 778px;
  .back_sedimentation{
    background-image: url('../../assets/dashboard_icons/cube_sedimentation_icon.png');
  }
}
// 2단계침전 아이콘
.sedimentation2_cube{
  z-index: 2;
  top: 221px;
  left: 348px;
  .back_sedimentation{
    background-image: url('../../assets/dashboard_icons/cube_sedimentation_icon.png');
  }
}

// 1단계혼화응집 아이콘
.mix_cube{
  top: -120px;
  left: 871px;
  .back_mix{
    background-image: url('../../assets/dashboard_icons/cube_mix_icon.png');
  }
}
// 2단계혼화응집 아이콘
.mix2_cube{
  top: 177px;
    left: 456px;
  .back_mix{
    background-image: url('../../assets/dashboard_icons/cube_mix_icon.png');
  }
}

// 탈수기동 아이콘
// .concentration_cube{
//   top:150px;
//   left:100px;
//   .back_concentration{
//     background-image: url('../../assets/dashboard_icons/cube_mix_icon.png');
//   }
// }

// 농축조 아이콘
// .dehydration_cube{
//   top:70px;
//   left:386px;
//   .back_dehydration{
//     background-image: url('../../assets/dashboard_icons/cube_splashdown_icon.png');
//   }
// }

// 오존 아이콘
// .o3_cube{
//   top:170px;
//   left:450px;
//   .back_o3{
//     background-image: url('../../assets/dashboard_icons/cube_ozone_icon.png');
//   }
// }
</style>