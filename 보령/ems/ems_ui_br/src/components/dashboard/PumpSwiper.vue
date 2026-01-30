<template>
<div class="right_title_div" style="margin-top: 10px;">
  <span class="right_title_font fL" style="width: 20.2%; height: 44px; cursor: pointer;" @click="movePage('analysis')">펌프현황</span>
  <div class="fL" style="width: 79.8%;">
    <div class="fL" style="width: 200px; height: 78px; margin-left: 120px; background-color: rgba(139, 194, 240, 0.22); border-radius: 5px 5px 0 0;">
      <span class=" right_pump_title fL " style="line-height: 3;">보령(정)</span>
    </div>
    <!-- <div class="fL" style="width: 130px; height: 78px; margin-left: 15px; background-color: rgba(68, 134, 222, 0.25); border-radius: 5px 5px 0 0;">
      <span class=" right_pump_title fL " style="line-height: 3;">당진(가)생활</span>
    </div> -->
  </div>
</div>

<div class="right_title_div" style=" margin-top: -5px;">
  <span class="right_title_font fL" style="width: 20%; height: 44px;"></span>
  <div class="fL" style="width: 80%;">
    <div class="fL" style="width: 200px; margin-left: 125px;">
      <span class=" right_pump_title fL "></span>
      <div v-for="(slide, idx) in state.slideList1" :key="idx"
        class="dash_pump_tab fL pump_number"
        :class="[slide.status === 0 ? 'offPump': '', state.slideIndex === idx ? 'selected_tab': '']"
        @click="changeSlide(idx)">
        {{ idx+1 }}
      </div>
    </div>
    <div class="fL" style="width: 130px; margin-left: 15px;">
      <span class=" right_pump_title fL " style="margin-left: 15px;"></span>
      <div v-for="(slide, idx) in state.slideList2" :key="idx"
        class="dash_pump_tab fL pump_number"
        :class="[slide.status === 0 ? 'offPump': '', state.slideIndex === (idx+SLIDE1_CNT) ? 'selected_tab': '']"
        @click="changeSlide(idx+SLIDE1_CNT)">
        {{ idx+1 }}
      </div>
    </div>
  </div>
</div>

<div class="dashinfo-pump-div">
  <div class="swiper-container">
    <swiper
      :modules="modules"
      :style="{
        '--swiper-navigation-color': '#489cf2'
      }"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :slides-per-view="1"
      :speed="1200"
      navigation
      @swiper="onSwiper"
      @slideChange="onSlideChange">

      <swiper-slide v-for="(slide, idx) in state.slideList1" :key="idx" class="wrap-swiper">
        <div class="swiper-slide dashinfo-pump-img">
          <div v-if="slide.status === 0" class="off_pump_img">비활성화</div>
          <span class="pump_name fontData">{{ slide.pwr }}</span>
          <span class="pump_name_unit">kW</span>
        </div>
      </swiper-slide>
      <swiper-slide v-for="(slide, idx) in state.slideList2" :key="idx" class="wrap-swiper">
        <div class="swiper-slide dashinfo-pump-img">
          <div v-if="slide.status === 0" class="off_pump_img">비활성화</div>
          <span class="pump_name fontData">{{ slide.pwr }}</span>
          <span class="pump_name_unit">kW</span>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</div>
</template>
<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Navigation, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  setup (props, context) {
    const router = useRouter()

    const state = reactive({
      slideIndex: 0,
      slideList1: [
        { status: 1, pwr: 0 },
        { status: 1, pwr: 1 },
        { status: 0, pwr: 2 },
        { status: 1, pwr: 3 },
        { status: 1, pwr: 4 },
        { status: 0, pwr: 5 }
      ],
      slideList2: [
      ]
    })

    let pumpSwiper = null
    const SLIDE_CNT = 6
    const SLIDE1_CNT = 6

    const onSwiper = (swiper) => {
      pumpSwiper = swiper
      // console.log('pumpSwiper=', pumpSwiper);
    }

    const onSlideChange = (swiper) => {
      state.slideIndex = swiper.activeIndex
      // console.log('activeIndex=', swiper.activeIndex);
    }

    const changeSlide = (idx) => {
      pumpSwiper.slideTo(idx, 1000)
    }

    const movePage = (value, index) => {
      // console.log(value);
      router.push(value)
    }

    const setPumpList = (pumpList) => {
      // console.log('JJJ>setPumpList:', pumpList);

      if (pumpList.length === SLIDE_CNT) {
        state.slideList1.forEach((slide, idx) => {
          slide.status = parseInt(pumpList[idx].status)
          slide.pwr = pumpList[idx].pwr
        })

        state.slideList2.forEach((slide, idx) => {
          slide.status = parseInt(pumpList[idx + SLIDE1_CNT].status)
          slide.pwr = pumpList[idx + SLIDE1_CNT].pwr
        })
      }
    }

    context.expose({ setPumpList })

    return {
      state,
      onSwiper,
      onSlideChange,
      changeSlide,
      setPumpList,
      movePage,
      SLIDE1_CNT,
      modules: [Navigation, Autoplay]
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/style/component/dashboard.scss';

.right_pump_title {
  color: #c2cad1;
  font-family: 'KHNPHDRegular';
  font-size: 16px;
  text-shadow: 0 0 10px #000;
  text-indent: 3%;
  text-align: center;
  width: 100%;
  line-height: 31px;
}
.dash_pump_tab {
  width: 23px;
  height: 65%;
  border: solid 1px #b4dffa;
  background-color: rgb(139 194 240 / 57%);
  cursor: pointer;
  margin-left: 6px;
}

.selected_tab {
  color: #F8C314 !important;
  border: solid 1px #F8C314 !important;
  font-weight: bold;
}

.offPump {
  background-color: #5b49491f;
}

.pump_number {
  font-family: LABDigital !important;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 27px;
}

.dashinfo-pump-img {
  width:410px;
  height:175px;
  margin-left: 0px;
  background: url(@/assets/img/dashboard/pump_00.png) no-repeat;
	background-position: center;
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
}

.off_pump_img{
	width: 250px;
	height: 60px;
	background: #1A406F;
	opacity: 0.8;
	align-self: center;
	color: #F8C314;
	font-size: 21px;
	font-weight: bold;
	font-family: KHNPHDRegular;
	border: 2px solid #00C0FF;
	text-align: center;
	line-height: 57px;
	letter-spacing: 5px;
}

.pump_name{
	color: #fff;
	font-size: 21px;
	font-family: 'LAB디지털' !important;
	line-height: 57px;
	letter-spacing: 5px;
	position: absolute;
	bottom: 0;
	right: 48px;
}

.pump_name_unit{
	font-family: KHNPHDRegular;
    font-size: 17px;
    color: #c3eaff;
    margin-left: 2px;
    line-height: 57px;
    letter-spacing: 5px;
    position: absolute;
    bottom: 0;
    right: 10px;
}
</style>
