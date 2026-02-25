<template>
  <div class="waterwall_back">
    <!-- 빨간선 화살표 움직임 -->
    <!-- <div class="waterway_red no1"></div>
    <div class="waterway_red no2"></div>
    <div class="waterway_red no3"></div>
    <div class="waterway_red no4"></div>
    <div class="waterway_red no5"></div>
    <div class="waterway_red no6"></div>
    <div class="waterway_red no7"></div>
    <div class="waterway_red no8"></div>
    <div class="waterway_red no9"></div> -->

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
    <div class="waterway_blue_up no25"></div>
    <div class="waterway_blue_up no26"></div>
    <div class="waterway_blue_up no27"></div>
    <div class="waterway_blue_up no28"></div>
    <div class="waterway_blue_up no29"></div>
    <div class="waterway_blue_up no30"></div>

    <!-- 파란선 화살표 움직임(아래쪽) -->
    <!-- <div class="waterway_blue_down no1"></div>
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
    <div class="waterway_blue_down no18"></div> -->
  </div>
</template>

<style scoped lang="scss">
// 최상위 엘리먼트
.waterwall_back {
  position: absolute;
  top: 45px;
  left: 582px;
  width: 885px;
  height: 938px;
  background-image: url('../../assets/cj_images/waterflow.png');
  // 파란선 화살표 움직임(위쪽)
  .waterway_blue_up {
    position: absolute;
    top: 10px;
    left: -90px;
    width: 15px;
    height: 18px;
    background-size: 100%;
    background-position: center;
    offset-path: path('M758.81 0 563.81 97 601.18 112.67 707.74 180.77 934.47 279.83 859.91 320.68 591.32 208.34 539.23 235.91 454.47 281.87 803.74 453.45 724.09 506.55 966.13 627.06 829.28 727.15 372.77 518.81 235.91 439.15 0 553.53 382.98 737.36 96 920.17 ');
    &.no1 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 0s normal infinite backwards;
    }
    &.no2 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 0.1s normal infinite backwards;
    }
    &.no3 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 0.2s normal infinite backwards;
    }
    &.no4 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 3s normal infinite backwards;
    }
    &.no5 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 3.1s normal infinite backwards;
    }
    &.no6 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 3.2s normal infinite backwards;
    }
    &.no7 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 6s normal infinite backwards;
    }
    &.no8 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 6.1s normal infinite backwards;
    }
    &.no9 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 6.2s normal infinite backwards;
    }
    &.no10 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 9s normal infinite backwards;
    }
    &.no11 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 9.1s normal infinite backwards;
    }
    &.no12 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 9.2s normal infinite backwards;
    }
    &.no13 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 12s normal infinite backwards;
    }
    &.no14 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 12.1s normal infinite backwards;
    }
    &.no15 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 12.2s normal infinite backwards;
    }
    &.no16 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 15s normal infinite backwards;
    }
    &.no17 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 15.1s normal infinite backwards;
    }
    &.no18 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 15.2s normal infinite backwards;
    }
    &.no19 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 18s normal infinite backwards;
    }
    &.no20 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 18.1s normal infinite backwards;
    }
    &.no21 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 18.2s normal infinite backwards;
    }
    &.no22 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 21s normal infinite backwards;
    }
    &.no23 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 21.1s normal infinite backwards;
    }
    &.no24 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 21.2s normal infinite backwards;
    }
    &.no25 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 24s normal infinite backwards;
    }
    &.no26 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 24.1s normal infinite backwards;
    }
    &.no27 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 24.2s normal infinite backwards;
    }
    &.no28 {
      background-image: url('../../assets/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 30s linear 27s normal infinite backwards;
    }
    &.no29 {
      background-image: url('../../assets/arrow2.png');
      animation: move-blue-up 30s linear 27.1s normal infinite backwards;
    }
    &.no30 {
      background-image: url('../../assets/arrow3.png');
      animation: move-blue-up 30s linear 27.2s normal infinite backwards;
    }
  }
  // 파란선 화살표 움직임(아래쪽)
  .waterway_blue_down {
    position: absolute;
    top: 26px;
    left: 180px;
    width: 15px;
    height: 18px;
    background-size: 100%;
    background-position: center;
    offset-path: path('M491.12 0.5 451.25 0.5 451.25 35.73 77.31 35.73 0.66 301.66 348.66 301.66 390.47 331.47 592.15 331.47 643.63 376.37 661.83 559.47 784.15 559.47');
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
    top: 6px;
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
  1% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  20% {
    opacity:1;
  }
  30% {
    opacity: 1;
  }
  35% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  45% {
    opacity: 1;
  }
  50% {
    opacity:0;
  }
  55% {
    opacity:1;
  }
  60% {
    opacity:1;
  }
  65% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 1;
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
    opacity: 1;
  }
  55% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  70% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 1;
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