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
  top: 73px;
  left: 490px;
  width: 858px;
  height: 520px;
  margin-top: 70px;
  margin-left: -45px;
  background-image: url('@/assets/img/ca_images/waterflow.png');
  // 파란선 화살표 움직임(위쪽)
  .waterway_blue_up {
    position: absolute;
    top: 9px;
    left: 3px;
    width: 15px;
    height: 18px;
    background-size: 100%;
    background-position: center;
    offset-path: path('M621.14 .45 424.04 91.35 834.59 317.05 727.36 371.18 467.95 255.77 108.46 451.86 .21 500.88');
    &.no1 {
      background-image: url('@/assets/img/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 15.4s linear 0s normal infinite backwards;
    }
    &.no2 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-up 15.4s linear 0.1s normal infinite backwards;
    }
    &.no3 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-up 15.4s linear 0.2s normal infinite backwards;
    }
    &.no4 {
      background-image: url('@/assets/img/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 15.4s linear 3s normal infinite backwards;
    }
    &.no5 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-up 15.4s linear 3.1s normal infinite backwards;
    }
    &.no6 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-up 15.4s linear 3.2s normal infinite backwards;
    }
    &.no7 {
      background-image: url('@/assets/img/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 15.4s linear 6s normal infinite backwards;
    }
    &.no8 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-up 15.4s linear 6.1s normal infinite backwards;
    }
    &.no9 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-up 15.4s linear 6.2s normal infinite backwards;
    }
    &.no10 {
      background-image: url('@/assets/img/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 15.4s linear 9s normal infinite backwards;
    }
    &.no11 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-up 15.4s linear 9.1s normal infinite backwards;
    }
    &.no12 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-up 15.4s linear 9.2s normal infinite backwards;
    }
    &.no13 {
      background-image: url('@/assets/img/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-up 15.4s linear 12s normal infinite backwards;
    }
    &.no14 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-up 15.4s linear 12.1s normal infinite backwards;
    }
    &.no15 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-up 15.4s linear 12.2s normal infinite backwards;
    }
    // &.no16 {
    //   background-image: url('@/assets/img/arrow.png');
    //   // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
    //   animation: move-blue-up 15.4s linear 15s normal infinite backwards;
    // }
    // &.no17 {
    //   background-image: url('@/assets/img/arrow2.png');
    //   animation: move-blue-up 15.4s linear 15.1s normal infinite backwards;
    // }
    // &.no18 {
    //   background-image: url('@/assets/img/arrow3.png');
    //   animation: move-blue-up 15.4s linear 15.2s normal infinite backwards;
    // }
  }
  // 파란선 화살표 움직임(아래쪽)
  .waterway_blue_down {
    position: absolute;
    top: 37px;
    left: 15px;
    width: 15px;
    height: 18px;
    background-size: 100%;
    background-position: center;
    offset-path: path('M1131.89.47l-75.4 27.3 137.8 57.2s-235.3 106.6-237.9 102.7-153.4-89.7-153.4-89.7l-37.7 13 11.7 6.5-222.3 83.2-40.3-27.3L.899 360.57l71.5 71.5 46.8 10.4 344.494-139.1h27.3l243.1 163.8-279.5 137.8-156 18.2');
    &.no1 {
      background-image: url('@/assets/img/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move-blue-down 20s linear 0s normal infinite backwards;
    }
    &.no2 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-down 20s linear 0.1s normal infinite backwards;
    }
    &.no3 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-down 20s linear 0.2s normal infinite backwards;
    }
    &.no4 {
      background-image: url('@/assets/img/arrow.png');
      animation: move-blue-down 20s linear 3.0s normal infinite backwards;
    }
    &.no5 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-down 20s linear 3.1s normal infinite backwards;
    }
    &.no6 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-down 20s linear 3.2s normal infinite backwards;
    }
    &.no7 {
      background-image: url('@/assets/img/arrow.png');
      animation:  move-blue-down 20s linear 6.0s normal infinite backwards;
    }
    &.no8 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-down 20s linear 6.1s normal infinite backwards;
    }
    &.no9 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-down 20s linear 6.2s normal infinite backwards;
    }
    &.no10 {
      background-image: url('@/assets/img/arrow.png');
      animation:  move-blue-down 20s linear 9.0s normal infinite backwards;
    }
    &.no11 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-down 20s linear 9.1s normal infinite backwards;
    }
    &.no12 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-down 20s linear 9.2s normal infinite backwards;
    }
    &.no13 {
      background-image: url('@/assets/img/arrow.png');
      animation:  move-blue-down 20s linear 12.0s normal infinite backwards;
    }
    &.no14 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-down 20s linear 12.1s normal infinite backwards;
    }
    &.no15 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-down 20s linear 12.2s normal infinite backwards;
    }
    &.no16 {
      background-image: url('@/assets/img/arrow.png');
      animation:  move-blue-down 20s linear 15.0s normal infinite backwards;
    }
    &.no17 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move-blue-down 20s linear 15.1s normal infinite backwards;
    }
    &.no18 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move-blue-down 20s linear 15.2s normal infinite backwards;
    }
  }
  // 빨간선 화살표 움직임
  .waterway_red { 
    position: absolute;
    top: 82px;
    left: 738px;
    width: 15px;
    height: 18px;
    background-size: 100%;
    background-position: center;
    offset-path: path('M10 594.453V487.446l458.977-220-142-67 291.995-130-72-29 50-24-37-17');
    &.no1 {
      background-image: url('@/assets/img/arrow.png');
      // animation: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state
      animation: move 10s linear 0s normal infinite backwards;
    }
    &.no2 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move 10s linear 0.1s normal infinite backwards;
    }
    &.no3 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move 10s linear 0.2s normal infinite backwards;
    }
    &.no4 {
      background-image: url('@/assets/img/arrow.png');
      animation: move 10s linear 3s normal infinite backwards;
    }
    &.no5 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move 10s linear 3.1s normal infinite backwards;
    }
    &.no6 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move 10s linear 3.2s normal infinite backwards;
    }
    &.no7 {
      background-image: url('@/assets/img/arrow.png');
      animation: move 10s linear 6s normal infinite backwards;
    }
    &.no8 {
      background-image: url('@/assets/img/arrow2.png');
      animation: move 10s linear 6.1s normal infinite backwards;
    }
    &.no9 {
      background-image: url('@/assets/img/arrow3.png');
      animation: move 10s linear 6.2s normal infinite backwards;
    }
  }
}
// 파란선 화살표 투명도 제어(위쪽)
@keyframes move-blue-up {
  0% {
    offset-distance: 0%;
    opacity: 0;
  }
5% {
    opacity: 1;
  }
10% {
    opacity: 1;
  }
15% {
    opacity: 0;
  }
17% {
    opacity:1;
  }
20% {
    opacity:0;
  }
40% {
    opacity: 1;
  }
50% {
    opacity: 1;
  }
60% {
    opacity: 1;
  }
80% {
    opacity: 0;
  }
100% {
    offset-distance: 100%;
    opacity:1;
  }
}
// 파란선 화살표 투명도 제어(아래쪽)
@keyframes move-blue-down {
  0% {
    offset-distance: 0%;
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  4% {
    opacity: 1;
  }
  5% {
    opacity: 0;
  }
  6% {
    opacity: 1;
  }
  8% {
    opacity: 1;
  }
  9% {
    opacity: 0;
  }
  23% {
    opacity: 0;
  }
  24% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  26% {
    opacity: 0;
  }
  32% {
    opacity: 0;
  }
  33% {
    opacity: 1;
  }
  37% {
    opacity: 1;
  }
  38% {
    opacity: 0;
  }
  39% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  42% {
    opacity: 1;
  }
  43% {
    opacity: 0;
  }
  52% {
    opacity: 0;
  }
  53% {
    opacity: 1;
  }
  74% {
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
  83% {
    opacity: 0;
  }
  84% {
    opacity: 1;
  }
  // 26% {
  //   opacity: 0;
  // }
  100% {
    offset-distance: 100%;
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