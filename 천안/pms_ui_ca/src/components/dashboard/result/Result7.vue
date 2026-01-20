<template>
  <div class="right-contents">

  </div>
</template>

<script>
export default {
  props: [
    'isAiOn'
  ]
}
</script>
<style scoped lang="scss">
.blink {
  animation: blink 1s infinite alternate;
}
@keyframes blink {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
.right-contents {
  width:193px;
  height: 100%;
  margin-top: 70px;

}
</style>