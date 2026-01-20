<template>
    <div class="chart-box">
        <Frame />
        <Linechart title="펌프 부하/반부하 총진동량" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="펌프 부하/반부하 베어링" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="펌프 임펠러" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="펌프 케비테이션" />
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
