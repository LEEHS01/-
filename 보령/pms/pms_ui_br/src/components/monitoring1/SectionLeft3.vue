<template>
    <div class="chart-box">
        <Frame />
        <Linechart2 title="전류" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart3 title="전압변동률" />
    </div>
</template>

<script>
import Frame from '@/components/component/BoxFrame.vue';
import Linechart2 from '@/components/chart/monitoring/Linechart2.vue';
import Linechart3 from '@/components/chart/monitoring/Linechart3.vue';
export default {
    components: { Frame, Linechart2, Linechart3 },
};
</script>

<style></style>
