<template>
    <div>
        <div class="title-box">
            <img src="@/assets/circle.svg" alt="" />
            <p>공정별</p>
        </div>
        <Frame />
        <div class="chart-box">
            <div
                class="chart"
                v-for="(value, index) in store.state.process"
                :key="index"
                @click="selectBarchart(index)"
            >
                <div
                    class="selectbox"
                    :class="{ chartSelected: value.selected }"
                ></div>
                <Bar
                    :name="value.title"
                    :value="value.normal"
                    :value2="value.err"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Bar from './BarChart';
import Frame from '@/components/component/BoxFrame.vue';
import { useStore } from 'vuex';

export default {
    components: {
        Bar,
        Frame,
    },
    setup() {
        const store = useStore();

        const selectBarchart = (i) => {
            const process = store.state.process;
            process.map((x) => (x.selected = false));
            store.state.process[i].selected = true;
        };

        return { store, selectBarchart };
    },
};
</script>
