<template>
    <div class="chart-box">
        <Frame />
        <Linechart title="펌프-베어링" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="펌프-Cavitation" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="펌프-임펠러" />
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
