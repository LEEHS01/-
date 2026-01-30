<template>
    <div class="monitor-4">
        <Header class="header" />
        <div class="content">
            <div class="content-left">
                <img src="@/assets/monitor-bg.png" class="panel-bg" />
                <!-- <div class="headerTitle">PAC튜브펌프</div> -->
                <div class="headerTitle">약품펌프</div>
                <div class="content-container two">
                    <div
                        class="content-container-row"
                        v-for="(list, i) in store.state.monitor4.modelList"
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
                                        :class="{ error: list.status.eq_on }"
                                    >
                                        <img
                                            class="icon"
                                            src="@/assets/alarm.svg"
                                        />
                                    </div>
                                    <p>
                                        {{ list.status.eq_on ? '동작중' : '' }}
                                    </p>
                                </div>
                                <div class="value-area">
                                    <div class="title-box">
                                        <img src="@/assets/circle.svg" alt="" />
                                        <p>전류</p>
                                    </div>
                                    <div class="value-val hold">
                                        <div class="value-val-left">
                                            펌프임계값
                                        </div>
                                        <div class="value-val-right">
                                            {{ i >= 3 ? '1.162 A' : '0.686 A' }}
                                        </div>
                                    </div>
                                    <div class="value-val hold cur">
                                        <div class="value-val-left">현재값</div>
                                        <div class="value-val-right">
                                            {{ list.avarage }} A
                                        </div>
                                    </div>
                                    <!-- <div class="value-box">
                                        <div class="label">임계값</div>
                                        <input
                                            class="value"
                                            type="text"
                                            readonly
                                            :value="
                                                i >= 3 ? '1.162 A' : '0.686 A'
                                            "
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
                                    </div> -->
                                </div>
                            </div>
                            <div class="chart-con">
                                <Frame />
                                <Linechart
                                    :elecData="list.current"
                                    threadHold="0.686"
                                    max="1.5"
                                />
                            </div>
                        </div>
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
            store.state.monitor4.selectModel = value.title;
            store.state.monitor4.modelList.filter((list) => {
                if (list.title === value.title)
                    store.state.monitor4.id = list.id;
            });
            router.push('PacTubeDetail');
        };

        onMounted(() => {
            // let isLocal = true;
            // [gelix_lsj_231012] isLocal 값이 true로 되어있어 차트 갱신 안됨, 테스트를 위해 false로 수정
            let isLocal = false;
            if (!isLocal) {
                // let currentTime = new Date();
                // [gelix_lsj_231012] 데이터 연동 테스트를 위해 임의 날짜 사용
                let currentTime = new Date('2023-03-20 00:00:00');
                let startDate = moment(
                    currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
                ).format('yyyy-MM-DD HH:mm:ss');
                let endDate = moment(currentTime.getTime()).format(
                    'yyyy-MM-DD HH:mm:ss'
                );
                store.state.monitor4.startDate = startDate;
                store.state.monitor4.endDate = endDate;
            }
            store.dispatch('monitor4/handleGraphData');
            // store.dispatch('monitor5/handleGraphData'); // [gelix_lsj_231012] monitor5 api 요청 필요없음
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
