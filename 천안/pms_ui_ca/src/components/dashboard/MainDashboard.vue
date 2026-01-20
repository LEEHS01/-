<template>
    <div>
        <div class="content">
            <div class="maincircle">
                <div class="line line1"></div>
                <div class="line line2"></div>
                <div class="line line3"></div>
                <div class="line line4"></div>

                <div class="rotatebox">
                    <RotateLine />
                </div>

                <div class="iconbox">
                    <IconCircle
                        :class="data.img"
                        :img="data.img"
                        :title="data.title"
                        v-for="(data, index) in store.state.process"
                        :key="index"
                        :index="index"
                        @click="setCenterCircle"
                    />
                </div>

                <div class="centerCircle">
                    <img src="@/assets/iconcircle.svg" alt="" />
                    <img :src="setCenterCircle()" class="processIcon" />
                    <div class="selectTitle">{{ state.TITLE }}</div>
                    <div class="iconlight light1"></div>
                    <div class="iconlight light2"></div>
                </div>

                <CenterPiechart class="center-pie" />
            </div>
        </div>
    </div>
</template>

<script>
import IconCircle from '@/components/dashboard/IconCircle.vue';
import { useStore } from 'vuex';
import CenterPiechart from '@/components/chart/dashboard/PieChart_center.vue';
import RotateLine from '@/components/dashboard/RotateLine.vue';
import { reactive } from 'vue';

export default {
    components: { IconCircle, CenterPiechart, RotateLine },
    setup() {
        const store = useStore();

        let state = reactive({
            IMG: 'icon1',
            TITLE: '착수',
        });

        const setCenterCircle = () => {
            let data = store.state.process;

            let filterData = JSON.stringify(data.filter((x) => x.selected));
            let selectData = JSON.parse(filterData)[0];

            state.IMG = selectData.img;
            state.TITLE = selectData.title;
            return require('@/assets/centerIcon/' + state.IMG + '.svg');
        };

        return {
            setCenterCircle,
            store,
            state,
        };
    },
};
</script>

<style></style>
