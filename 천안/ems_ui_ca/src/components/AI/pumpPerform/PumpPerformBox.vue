<template>
  <div class="pumWrap">
    <div class="div-line-top"></div>
    <span style="color: white"></span>
    <div class="pum_box">
      <div style="width: calc(100% - 40px); padding: 15px 20px;">
        <div class="pum_value fontContent">{{info.data.name}}</div>
        <div class="pum_gauge">
          <span style="color: white;"></span>
          <div class="pum_gauge_bottom" ref="guageRef">
            <!-- <div style="position: absolute">
              <canvas class="rotate" ref="canvasRef" :width="calculateCanvasWidth()" :height="calculateCanvasHeight()"
              style=" width: 100%;  height: 100%;  transform: rotate(-90deg);"></canvas>
            </div> -->
            <div class="pum_gauge_center">
              <div class="pum_gauge_value fontData">
                {{ percentValue }}
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="pum_value fontContent">{{info.data.name}}</div> -->
        <div class="pum_value_text fontContent">정격양정 : <span class="fontData" style="font-size:18px">{{info.ratedData.pumpingHead}}</span></div>
        <div class="pum_value_text fontContent">정격유량 : <span class="fontData" style="font-size:18px">{{info.ratedData.flow}}</span> m³ </div>
      </div>
    </div>
    <div class="div-line-bottom"></div>
    {{ info.data.value }}
  </div>
</template>

<script>
import { nextTick, onMounted, ref, toRefs } from 'vue'
import log from '@/logger.js'
export default {
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { info } = toRefs(props)
    const canvasRef = ref(null)
    const guageRef = ref(null)
    const percentValue = ref('')

    const calculateCanvasWidth = () => {
      const guage = guageRef.value
      return guage ? guage.offsetWidth : 0
    }

    const calculateCanvasHeight = () => {
      const guage = guageRef.value
      return guage ? guage.offsetHeight : 0
    }

    const canvasData = () => {
      try {
        nextTick(() => {
          // const canvas = canvasRef.value
          const guage = guageRef.value

          // if (canvas && guage) {
          //   const ctx = canvas.getContext('2d')
          //   const percent = info.value.data.val
          //   const width = guage.offsetWidth
          //   const height = guage.offsetHeight

          //   ctx.beginPath()
          //   ctx.arc(width / 2, height / 2, (width / 2 - 25), 0, (percent * 100 / 50) * Math.PI)
          //   ctx.lineWidth = 20
          //   ctx.strokeStyle = '#5cafffB3'
          //   ctx.stroke()

          //   const percentText = (percent * 100).toFixed(1) + '%'
          //   percentValue.value = percentText
          // }
          if (guage) {
            const percent = info.value.data.val
            const percentText = (percent * 100).toFixed(1) + '%'
            percentValue.value = percentText
          }
        })
      } catch (err) {
        log.logError(err.message);
      }
    }

    onMounted(() => {
      canvasData()
    })

    return {
      percentValue,
      canvasRef,
      guageRef,
      calculateCanvasWidth,
      calculateCanvasHeight,
      canvasData
    }
  }
}

</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';
@import '~@/style/AI/songsu.css';

.itemsWrap1 {
  width: 100%;
  float: left;
  margin: 5px 0 0 0;
}
.itemsWrap2 {
  height: 300px;
  width: 50%;
  float: left;
  margin: 5px 0 0 0;
}
.items4 {
  width: calc(100% - 10px);
  height: 100%;
  margin-right: 10px;
  background-color: 'transparent';
  border-radius: 10px;
  /* box-shadow: 1px 1px 5px #d3d3d5; */
  border-style: inset;
  border-width: 1px;
  border-color: #33a2ff;
}

.pumWrap {
  width: calc(100% / 5);
  height: calc(100% - 10px);
  float: left;
}
.pum_box {
  width: calc(100% - 10px);
  // height: 100%;
  margin-right: 10px;
  background: url('@/assets/img/pump/box_bg04.png') no-repeat;
  background-size: 90% 100%;
  background-position: center;
}
.pum_box_in {
  width: calc(100% - 40px);
  height: calc(100% - 30px);
  padding: 15px 20px;
}
.pum_gauge {
  // background: url('@/assets/img/pump/chart_line.png') no-repeat;
  // background-size: calc(100% - 25px);
  height: 55%;
  margin-bottom: 20px;
  background-position: center;
  mix-blend-mode: color-dodge;
}
.pum_gauge_bottom {
  /* background: url(img/pump/chart_gauge.png) no-repeat; */
  background-size: calc(100% - 25px);
  height: 100%;
  width: 100%;
  // margin: 0 30px 20px 30px;
  background-position: center;
  mix-blend-mode: color-dodge;
}
.pum_gauge_center {
  // background: url('@/assets/img/pump/chart_based.png') no-repeat center;
  width: 100%;
  height: 100%;
  mix-blend-mode: color-dodge;
}
.pum_gauge_value {
  position: relative;
  height: 100%;
  font-size: 40px;
  text-align: center;
  text-indent: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
}
.pum_value {
  width: 100%;
  height: 14%;
  background: url('@/assets/img/pump/text_input_bg.png') no-repeat center;
  background-position: center;
  mix-blend-mode: color-dodge;
  text-shadow: 0 0 9px #5cafff;
  text-align: center;
  color: #c3eaff;
  line-height: 70px;
  margin-bottom: 50px;
}
.pum_value_text {
  text-align: center;
  margin-bottom: 15px;
}
.left_box {
  background: url('@/assets/img/left_box.png');
  background-size: 100% 100%;
}
.left_box:after {
  opacity: 0.5 !important;
}
.middle_box {
  background: url('@/assets/img/middle_box.png');
  background-size: 100% 100%;
}
.right_box {
  background: url('@/assets/img/right_box.png');
  background-size: 100% 100%;
}

.fL {
  float: left;
}
.fR {
  float: right;
}

.rotate {
  animation: rotation 5s;
  animation-delay: 1s;
}
@keyframes rotation {
  0% {
    transform: rotate(-90deg);
  }
  70% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

.fontContent{
	font-family: KHNPHDRegular;
	font-size: 18px; /*사용 가능 범위 : 18~16*/
	color: white;
	text-shadow: 0 0 9px #5cafff;
}

.fontData {
  font-family: LAB디지털;
  color: white;
}
</style>
