<template>
    <div class="chart-box">
        <Frame />
        <Linechart title="모터-베어링" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="모터-회전자" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="모터-축정렬" />
    </div>
    <div class="chart-box">
        <Frame />
        <Linechart title="모터-불평형" />
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
