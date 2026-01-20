<template>
  <div
    class="menu-bar"
    @mouseenter="menuEnter"
    @mouseleave="menuLeave"
    :class="{ menuEnter: state.menu }"
  >
    <div class="menu" v-if="state.menu">
      <div class="logo-box">
        <img src="@/assets/img/icon/logo.png" />
      </div>
      <div
        class="menu-item"
        :class="{ selected: state.select === 0 }"
        @click="pageMove('/')"
      >
        <img src="@/assets/img/icon/dashboard.png"/>
        <span :class="{ select: state.select === 0 }">메인</span>
      </div>
      <div
        class="menu-item"
        :class="{ selected: state.select === 1 }"
        @click="serviceMove(1)"
      >
        <img src="@/assets/img/icon/auto.png" />
        <span :class="{ select: state.select === 1 }">자율운영</span>
      </div>
      <div
        class="menu-item"
        :class="{ selected: state.select === 2 }"
        @click="emsSubMenuOpen2"
      >
        <img src="@/assets/img/icon/ems.png" />
        <span :class="{ select: state.select === 2 }">스마트EMS</span>
      </div>
      <div
        class="menu-item"
        :class="{ selected: state.select === 3 }"
        @click="serviceMove(3)"
      >
        <img src="@/assets/img/icon/pms.png" />
        <span :class="{ select: state.select === 3 }">스마트PMS</span>
      </div>
    </div>

    <!-- 스마트 EMS 서브메뉴 -->
    <div class="ems-subMenu" v-if="state.ems2">
      <div class="sub-logo">
        <img src="@/assets/img/icon/ems.png" />
        <span> 스마트EMS </span>
      </div>

      <div class="sub-item" @click="pageMove('/')">
        <div class="sub-menu-contents">
          <img src="@/assets/img/icon/dashboard.png"/>
          <span>대시보드</span>
        </div>
      </div>

      <div class="sub-item">
        <div @click="subMenu(1)">
          <div class="sub-menu-contents">
            <img src="@/assets/img/icon/ai.png"/>
            <span>AI 분석</span>
          </div>
        </div>
        <div class="sub-item-list" :class="{ showList: state.subList === 1 }">
          <div class="item" @click="subMenu3depth(10)">
            <div class="circle"></div>
            송수펌프 제어
          </div>
          <div
            class="item2"
            v-if="state.subList3depth == 10"
            @click="pageMove('analysis', 10)"
          >
            송수펌프 제어분석
          </div>
          <div
            class="item2"
            v-if="state.subList3depth == 10"
            @click="pageMove('songsu', 10)"
          >
            송수펌프 제어 세부 현황
          </div>
          <div
            class="item2"
            v-if="state.subList3depth == 10"
            @click="pageMove('sujiSelect', 10)"
          >
            송수펌프 제어 트렌드
          </div>
          <div
            class="item2"
            v-if="state.subList3depth == 10"
            @click="pageMove('pumpPerform', 10)"
          >
            송수펌프 가동이력
          </div>
          <div
            class="item2"
            v-if="state.subList3depth == 10"
            @click="pageMove('sujiSelect_2', 10)"
          >
            주요 배수지 수위 현황
          </div>
          <div class="item" @click="subMenu3depth(11)">
            <div class="circle"></div>
            전력 피크
          </div>
          <div
            class="item2"
            v-if="state.subList3depth == 11"
            @click="pageMove('peakControl', 10)"
          >
            전력피크 분석
          </div>
          <div
            class="item2"
            v-if="state.subList3depth == 11"
            @click="pageMove('peak', 10)"
          >
            전력피크 세부현황
          </div>
        </div>
      </div>

      <div class="sub-item" @click="subMenu(2)">
        <div class="sub-menu-contents">
          <img src="@/assets/img/icon/spend.png" />
          <span>에너지 사용 현황</span>
        </div>
        <div class="sub-item-list" :class="{ showList: state.subList === 2 }">
          <div class="item" @click="pageMove('zoneUse', 2)">
            <div class="circle"></div>
            시설별 사용량
          </div>
          <div class="item" @click="pageMove('facUse', 2)">
            <div class="circle"></div>
            설비별 사용량
          </div>
          <div class="item" @click="pageMove('useTrand', 2)">
            <div class="circle"></div>
            사용량 트랜드
          </div>
        </div>
      </div>
      <div class="sub-item" @click="subMenu(3)">
        <div class="sub-menu-contents">
          <img src="@/assets/img/icon/reduce.png" />
          <span>에너지 절감 관리</span>
        </div>
        <div class="sub-item-list" :class="{ showList: state.subList === 3 }">
          <div class="item" @click="pageMove('cost', 3)">
            <div class="circle"></div>
            최적 요금제 분석
          </div>
          <div class="item" @click="pageMove('reduction', 3)">
            <div class="circle"></div>
            절감 목표 달성 현황
          </div>
        </div>
      </div>

      <div class="sub-item" @click="subMenu(4)">
        <div class="sub-menu-contents">
          <img src="@/assets/img/icon/setting.png" />
          <span>설정</span>
        </div>
        <div class="sub-item-list" :class="{ showList: state.subList === 4 }">
          <div class="item" @click="pageMove('setting', 4)">
            <div class="circle"></div>
            태그 정보
          </div>
          <!-- <div class="item" @click="pageMove('pumpOperation', 4)">
            <div class="circle"></div>
            송수펌프 운영
          </div> -->
          <div class="item" @click="pageMove('CostSetting', 4)">
            <div class="circle"></div>
            전력요금제
          </div>
          <div class="item" @click="pageMove('goalSetting', 4)">
            <div class="circle"></div>
            절감 목표
          </div>
          <div class="item" @click="pageMove('peakSet', 4)">
            <div class="circle"></div>
            목표 전력피크
          </div>
        </div>
      </div>

      <!-- <div class="sub-item" @click="subMenu(5)">
        <div class="sub-menu-contents">
          <img src="@/assets/img/icon/report03.png" />
          <span>보고서</span>
        </div>
        <div class="sub-item-list" :class="{ showList: state.subList === 5 }">
          <div class="item" @click="pageMove('report', 5)">
            <div class="circle"></div>
            일일 보고서
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const router = useRouter()
    const state = reactive({
      menu: false,
      ems1: false,
      ems2: false,
      ems3: false,
      ems4: false,
      select: 0,
      subList1: '',
      subList2: '',
      subList3: '',
      subList4: '',
      subList3depth: ''
    })

    const menuEnter = () => {
      state.menu = true
    }

    const menuLeave = () => {
      state.menu = false
      state.ems1 = false
      state.ems2 = false
      state.ems3 = false
      state.ems4 = false
      state.subList = ''
    }

    const emsSubMenuOpen1 = () => {
      state.ems1 = true
      state.ems2 = false
      state.ems3 = false
      state.ems4 = false
      state.select = 1
    }

    const emsSubMenuOpen2 = () => {
      state.ems1 = false
      state.ems2 = true
      state.ems3 = false
      state.ems4 = false
      state.select = 2
    }

    const subMenu = (idx) => {
      // console.log(' sub list ~ ', state.subList3depth, state.subList)
      // if (state.subList === idx) {
      //   state.subList = ''
      // } else {
      state.subList = idx
      // }
    }

    const pageMove = (value, idx) => {
      // console.log(value)
      router.push(value)
    }

    const serviceMove = (value, idx) => {
      if (value === 1) {
        state.select = 1
        const token = localStorage.getItem('authToken'); // localStorage에서 토큰 읽기
        if (token) {
            console.log('메뉴받은 토큰:', token);
            const url = new URL(process.env.VUE_APP_AIO_URL);
            url.searchParams.append('token', token);
            console.log('보낼URL: ', url)
            window.open(url.toString(), '_self'); // 최종 URL로 이동
        } else {
            console.error('메뉴토큰이 없습니다.');
        }
         //window.open(process.env.VUE_APP_AIO_URL, '_self')
        //window.open(process.env.VUE_APP_AIO_URL, '_blank')
      } else if (value === 3) {
        state.select = 3
        //  window.open(process.env.VUE_APP_PMS_URL, '_self')
        //window.open(process.env.VUE_APP_PMS_URL, '_blank')
        const token = localStorage.getItem('authToken'); // localStorage에서 토큰 읽기
        if (token) {
            console.log('메뉴받은 토큰:', token);
            const url = new URL(process.env.VUE_APP_PMS_URL);
            url.searchParams.append('token', token);
            console.log('보낼URL: ', url)
            window.open(url.toString(), '_self'); // 최종 URL로 이동
        } else {
          console.error('메뉴토큰이 없습니다.');
        }
      }
    }

    const subMenu3depth = (idx) => {
      // console.log(' sub list ~22 ')
      if (state.subList3depth === idx) {
        state.subList = 1
        state.subList3depth = ''
      } else {
        state.subList3depth = idx
        state.subList = 1
      }
    }

    return {
      state,
      subMenu3depth,
      menuEnter,
      menuLeave,
      emsSubMenuOpen1,
      emsSubMenuOpen2,
      subMenu,
      pageMove,
      serviceMove
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/menu.scss';
</style>
