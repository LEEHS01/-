<template>
    <div class="chart-box">
        <Frame />
        <Linechart title="모터 부하/반부하 총진동량" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="모터 부하/반부하 베어링" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="모터 권선온도" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="모터 베어링온도" />
    </div>
</template>

<script>
import Frame from '@/components/component/BoxFrame.vue';
import Linechart from '@/components/chart/monitoring/Linechart3.vue';
export default {
    components: { Frame, Linechart },
};
</script>

<style></style>
