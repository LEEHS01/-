<template>
  <div class="waterwall_back">
    <!-- 빨간선 화살표 움직임 -->
    <div class="waterway_red no1"></div>
    <div class="waterway_red no2"></div>
    <div class="waterway_red no3"></div>
    <div class="waterway_red no4"></div>
    <div class="waterway_red no5"></div>
    <div class="waterway_red no6"></div>
    <div class="waterway_red no7"></div>
    <div class="waterway_red no8"></div>
    <div class="waterway_red no9"></div>

    <!-- 파란선 화살표 움직임(위쪽) -->
    <div class="waterway_blue_up no1"></div>
    <div class="waterway_blue_up no2"></div>
    <div class="waterway_blue_up no3"></div>
    <div class="waterway_blue_up no4"></div>
    <div class="waterway_blue_up no5"></div>
    <div class="waterway_blue_up no6"></div>
    <div class="waterway_blue_up no7"></div>
    <div class="waterway_blue_up no8"></div>
    <div class="waterway_blue_up no9"></div>
    <div class="waterway_blue_up no10"></div>
    <div class="waterway_blue_up no11"></div>
    <div class="waterway_blue_up no12"></div>
    <div class="waterway_blue_up no13"></div>
    <div class="waterway_blue_up no14"></div>
    <div class="waterway_blue_up no15"></div>
    <div class="waterway_blue_up no16"></div>
    <div class="waterway_blue_up no17"></div>
    <div class="waterway_blue_up no18"></div>
    <div class="waterway_blue_up no19"></div>
    <div class="waterway_blue_up no20"></div>
    <div class="waterway_blue_up no21"></div>
    <div class="waterway_blue_up no22"></div>
    <div class="waterway_blue_up no23"></div>
    <div class="waterway_blue_up no24"></div>

    <!-- 파란선 화살표 움직임(아래쪽) -->
    <div class="waterway_blue_down no1"></div>
    <div class="waterway_blue_down no2"></div>
    <div class="waterway_blue_down no3"></div>
    <div class="waterway_blue_down no4"></div>
    <div class="waterway_blue_down no5"></div>
    <div class="waterway_blue_down no6"></div>
    <div class="waterway_blue_down no7"></div>
    <div class="waterway_blue_down no8"></div>
    <div class="waterway_blue_down no9"></div>
    <div class="waterway_blue_down no10"></div>
    <div class="waterway_blue_down no11"></div>
    <div class="waterway_blue_down no12"></div>
    <div class="waterway_blue_down no13"></div>
    <div class="waterway_blue_down no14"></div>
    <div class="waterway_blue_down no15"></div>
    <div class="waterway_blue_down no16"></div>
    <div class="waterway_blue_down no17"></div>
    <div class="waterway_blue_down no18"></div>
  </div>
</template>

<style scoped lang="scss">
// 최상위 엘리먼트
.waterwall_back {
  position: absolute;
  top: 161px;
  left: 144px;
  width: 1014px;
  height: 719px;
  background-image: url('../../assets/as_images/asan_line.png');
  // 파란선 화살표 움직임(위쪽)
  .waterway_blue_up {
    position: absolute;
    top: -46px;
    left: 247px;
    width: 15px;
    height: 18px;
    background-size: 100%;
    background-position: center;
    offset-path: path('M411.34,89.96 411.34,111.64 450.05,111.64 450.05,155.77 701.67,155.77 757.41,456.93 69.15,456.93 94.7,321.44 63.73,480.15 -90.33,480.15 -162.33,751.12 560.76,751.12 603.34,722.48');
    &.no1 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 26s linear 0s normal infinite backwards;
    }
    &.no2 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 26s linear 0.1s normal infinite backwards;
    }
    &.no3 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 26s linear 0.2s normal infinite backwards;
    }
    &.no4 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 26s linear 3s normal infinite backwards;
    }
    &.no5 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 26s linear 3.1s normal infinite backwards;
    }
    &.no6 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 26s linear 3.2s normal infinite backwards;
    }
    &.no7 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 26s linear 6s normal infinite backwards;
    }
    &.no8 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 26s linear 6.1s normal infinite backwards;
    }
    &.no9 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 26s linear 6.2s normal infinite backwards;
    }
    &.no10 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 26s linear 9s normal infinite backwards;
    }
    &.no11 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 26s linear 9.1s normal infinite backwards;
    }
    &.no12 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 26s linear 9.2s normal infinite backwards;
    }
    &.no13 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 26s linear 12s normal infinite backwards;
    }
    &.no14 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 26s linear 12.1s normal infinite backwards;
    }
    &.no15 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 26s linear 12.2s normal infinite backwards;
    }
    &.no16 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 26s linear 15s normal infinite backwards;
    }
    &.no17 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 26s linear 15.1s normal infinite backwards;
    }
    &.no18 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 26s linear 15.2s normal infinite backwards;
    }
    &.no19 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 26s linear 18s normal infinite backwards;
    }
    &.no20 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 26s linear 18.1s normal infinite backwards;
    }
    &.no21 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 26s linear 18.2s normal infinite backwards;
    }
    &.no22 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 26s linear 21s normal infinite backwards;
    }
    &.no23 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 26s linear 21.1s normal infinite backwards;
    }
    &.no24 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 26s linear 21.2s normal infinite backwards;
    }
  }
  // 파란선 화살표 움직임(아래쪽)
  .waterway_blue_down {
    position: absolute;
    top: -135px;
    left: 54px;
    width: 15px;
    height: 18px;
    background-size: 100%;
    background-position: center;
    offset-path: path('M604.95,180.21 604.95,201.11 563.14,201.11 563.14,246.79 102.5,246.79 -9.76,639.3 516.69,639.3 545.34,660.98');
    &.no1 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-down 15s linear 0s normal infinite backwards;
    }
    &.no2 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-down 15s linear 0.1s normal infinite backwards;
    }
    &.no3 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-down 15s linear 0.2s normal infinite backwards;
    }
    &.no4 {
      background-image: url('../../assets/arrow.png');
      animation: move-blue-down 15s linear 3.0s normal infinite backwards;
    }
    &.no5 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-down 15s linear 3.1s normal infinite backwards;
    }
    &.no6 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-down 15s linear 3.2s normal infinite backwards;
    }
    &.no7 {
      background-image: url('../../assets/arrow.png');
      animation:  move-blue-down 15s linear 6.0s normal infinite backwards;
    }
    &.no8 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-down 15s linear 6.1s normal infinite backwards;
    }
    &.no9 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-down 15s linear 6.2s normal infinite backwards;
    }
    &.no10 {
      background-image: url('../../assets/arrow.png');
      animation:  move-blue-down 15s linear 9.0s normal infinite backwards;
    }
    &.no11 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-down 15s linear 9.1s normal infinite backwards;
    }
    &.no12 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-down 15s linear 9.2s normal infinite backwards;
    }
    &.no13 {
      background-image: url('../../assets/arrow.png');
      animation:  move-blue-down 15s linear 12.0s normal infinite backwards;
    }
    &.no14 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-down 15s linear 12.1s normal infinite backwards;
    }
    &.no15 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-down 15s linear 12.2s normal infinite backwards;
    }
    &.no16 {
      background-image: url('../../assets/arrow.png');
      animation:  move-blue-down 15s linear 15.0s normal infinite backwards;
    }
    &.no17 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-down 15s linear 15.1s normal infinite backwards;
    }
    &.no18 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-down 15s linear 15.2s normal infinite backwards;
    }
  }
  // 빨간선 화살표 움직임
  .waterway_red { 
    position: absolute;
    top: 13px;
    left: 0px;
    width: 15px;
    height: 18px;
    background-size: 100%;
    background-position: center;
    offset-path: path('M 0 28.82 569.29 28.82 617.81 0.43');
    &.no1 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move 6s linear 0s normal infinite backwards;
    }
    &.no2 {
      background-image: url('../../assets/arrow2.png');
      animation: move 6s linear 0.1s normal infinite backwards;
    }
    &.no3 {
      background-image: url('../../assets/arrow3.png');
      animation: move 6s linear 0.2s normal infinite backwards;
    }
    &.no4 {
      background-image: url('../../assets/arrow.png');
      animation: move 6s linear 3s normal infinite backwards;
    }
    &.no5 {
      background-image: url('../../assets/arrow2.png');
      animation: move 6s linear 3.1s normal infinite backwards;
    }
    &.no6 {
      background-image: url('../../assets/arrow3.png');
      animation: move 6s linear 3.2s normal infinite backwards;
    }
    &.no7 {
      background-image: url('../../assets/arrow.png');
      animation: move 6s linear 6s normal infinite backwards;
    }
    &.no8 {
      background-image: url('../../assets/arrow2.png');
      animation: move 6s linear 6.1s normal infinite backwards;
    }
    &.no9 {
      background-image: url('../../assets/arrow3.png');
      animation: move 6s linear 6.2s normal infinite backwards;
    }
  }
}
// 파란선 화살표 투명도 제어(위쪽)
@keyframes move-blue-up {
  0% {
    offset-distance: 0%;
    display: none;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  20% {
    opacity:0;
  }
  23% {
    opacity: 1;
  }
  24% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  33% {
    opacity:1;
  }
  35% {
    opacity: 1;
  }
  40% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  65% {
    opacity: 0;
  }
  70% {
    opacity: 1;
  }
  75% {
    opacity:1;
  }
  80% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 0;
  }
}
// 파란선 화살표 투명도 제어(아래쪽)
@keyframes move-blue-down {
  0% {
    offset-distance: 0%;
    display: none;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  20% {
    opacity:1;
  }
  30% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  55% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  90% {
    opacity: 0;
  }
  95% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 0;
  }
}
// 빨간선 화살표 투명도 제어
@keyframes move {
  0% {
    offset-distance: 0%;
    display: none;
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
  }
}
</style>