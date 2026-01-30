<template>
    <div class="monitor-3">
        <Header class="header" />
        <div class="content">
            <div class="content-left">
                <img src="@/assets/monitor-bg.png" class="panel-bg" />
                <div class="headerTitle">착수정유입밸브</div>
                <div class="content-container two">
                    <div
                        class="content-container-row"
                        v-for="(list, i) in store.state.monitor3.modelList"
                        :key="i"
                    >
                        <div
                            class="icon-area"
                            v-on:click="clickParam(list)"
                            :class="{ error: list.alarm }"
                        >
                            <Frame />
                            <div class="title-box">
                                <img src="@/assets/circle.svg" alt="" />
                                <p>{{ list.title }}</p>
                            </div>
                            <img class="icon" src="@/assets/motor.png" />
                        </div>
                        <div class="chart-area">
                            <div class="alert-icon">
                                <div class="state-area">
                                    <div
                                        class="alarm-icon"
                                        :class="{ error: list.eq_open }"
                                    >
                                        <img
                                            class="icon"
                                            src="@/assets/alarm.svg"
                                        />
                                    </div>
                                    <p>{{ list.eq_open ? '동작중' : '' }}</p>
                                </div>
                                <div class="value-area">
                                    <div class="title-box">
                                        <img src="@/assets/circle.svg" alt="" />
                                        <p>전류</p>
                                    </div>
                                    <div class="value-box">
                                        <div class="label">임계값</div>
                                        <input
                                            class="value"
                                            type="text"
                                            readonly
                                            value="1 A"
                                        />
                                    </div>
                                    <div class="value-box">
                                        <div class="label">현재값</div>
                                        <input
                                            class="value cur"
                                            type="text"
                                            readonly
                                            :value="list.avarage + ' A'"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="chart-con">
                                <Frame />
                                <Linechart :elecData="list.current" max="1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-right">
                <div
                    class="content-panel"
                    v-for="(list, i) in store.state.monitor3.modelList"
                    :key="i"
                >
                    <img class="panel-bg" src="@/assets/box.png" />
                    <img src="@/assets/light.png" alt="" class="light-circle" />
                    <img src="@/assets/light2.png" alt="" class="light-line" />
                    <div class="content-header">
                        <img src="@/assets/titleicon.svg" class="titleCon" />
                        <p>{{ list.title }} 운영현황</p>
                    </div>
                    <div class="panel-content">
                        <p class="title">
                            <img src="@/assets/circle.svg" />개도
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Header from '@/components/menu/Header.vue';
import Frame from '@/components/component/BoxFrame.vue';
import Linechart from '@/components/chart/monitoring/Linechart_m.vue';
import { onMounted } from 'vue';
import moment from 'moment';
export default {
    components: {
        Header,
        Frame,
        Linechart,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const visibleToggle = () => {
            store.state.alertVisible = !store.state.alertVisible;
        };

        const clickParam = (value) => {
            store.state.monitor3.selectModel = value.title;
            store.state.monitor3.id = value.id;
            router.push('WaterControlDetail');
        };

        onMounted(() => {
            // let currentTime = new Date();
            // [gelix_lsj_231012] 데이터 연동 테스트를 위해 임의 날짜 사용
            let currentTime = new Date('2023-03-20 00:00:00');
            let startDate = moment(
                currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
            ).format('yyyy-MM-DD HH:mm:ss');
            let endDate = moment(currentTime.getTime()).format(
                'yyyy-MM-DD HH:mm:ss'
            );
            store.state.monitor3.startDate = startDate;
            store.state.monitor3.endDate = endDate;
            store.dispatch('monitor3/handleGraphData');
        });

        return {
            clickParam,
            visibleToggle,
            store,
        };
    },
};
</script>

<style></style>
