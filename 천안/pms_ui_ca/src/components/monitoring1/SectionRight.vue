<template>
    <div class="chart-box">
          <Frame />
          <Linechart title="불평형"/>
    </div>
    <div class="chart-box">
          <Frame />
          <Linechart title="임펠러"/>
    </div>
    <div class="chart-box">
          <Frame />
          <Linechart title="온도"/>
    </div>
</template>

<script>
import Frame from '@/components/component/BoxFrame.vue';
import Linechart from '@/components/chart/monitoring/Linechart.vue'
export default {
    components:{Frame , Linechart}
}
</script>

<style>

</style>