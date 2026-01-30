<template>
    <div class="chart-box">
        <Frame />
        <Linechart title="총진동량" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="베어링온도" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="권선온도" />
    </div>
</template>

<script>
import Frame from '@/components/component/BoxFrame.vue';
import Linechart from '@/components/chart/monitoring/Linechart.vue';
export default {
    components: { Frame, Linechart },
};
</script>

<style></style>
