<template>
    <div class="chart-box">
        <Frame />
        <Linechart title="전류" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="전압" />
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
