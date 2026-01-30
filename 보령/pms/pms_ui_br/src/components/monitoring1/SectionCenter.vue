<template>
    <div class="chart-box">
        <!-- <q-select
            label="Flip up/down"
            transition-show="flip-up"
            transition-hide="flip-down"
            filled
            v-model="model"
            :options="options"
            style="width: 250px"
        /> -->
        <q-select
            v-model="model"
            :options="options"
            bg-color="transparent"
            dark
            dense
        />
        <div class="titlebox">
            <!-- <p>{{ TITLE.name }}</p> -->
        </div>
        <Frame />
        <div style="margin-top : 25px;">
            <img src="@/assets/sample2.png" />
        </div>
    </div>
</template>

<script>
import Frame from '@/components/component/BoxFrame.vue';
import { useStore } from 'vuex';
import { reactive, ref } from 'vue';
export default {
    components: { Frame },
    setup() {
        const store = useStore();
        let TITLE = reactive({
            name: '송수펌프 #1',
        });

        const selectedMotor = (num) => {
            const motorsData = store.state.motors;
            motorsData.map((x) => (x.select = false));

            motorsData.filter((x) => {
                if (x.id === num) {
                    x.select = true;
                    TITLE.name = x.name;
                    return;
                }
            });
        };

        return {
            store,
            selectedMotor,
            TITLE,
            model: ref('유입밸브 #1'),
            options: ['유입밸브 #1', '유입밸브 #2'],
        };
    },
};
</script>

<style></style>
