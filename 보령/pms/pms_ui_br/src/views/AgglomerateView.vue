<template>
    <div class="monitor-8">
        <Header class="header" />
        <div class="content">
            <div class="content-left">
                <img src="@/assets/monitor-bg.png" class="panel-bg" />
                <div class="headerTitle">응집기</div>
                <div class="content-container two">
                    <div
                        class="content-container-row"
                        v-for="(list, i) in store.state.monitor8.modelList"
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
                                    <div class="value-box">
                                        <div class="label">임계값</div>
                                        <input
                                            class="value"
                                            type="text"
                                            readonly
                                            value="5.516 A"
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
                                <Linechart
                                    :elecData="list.current"
                                    max="5.516"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-right">
                <div class="content-panel">
                    <img class="panel-bg" src="@/assets/box3.png" />
                    <img src="@/assets/light.png" alt="" class="light-circle" />
                    <img src="@/assets/light2.png" alt="" class="light-line" />
                    <div class="content-header">
                        <img
                            src="@/assets/titleicon.svg"
                            alt=""
                            class="titleCon"
                        />
                        <p>응집기 운영현황</p>
                    </div>
                    <div class="panel-content">
                        <div class="value-box">
                            <div class="label">
                                가동대수
                            </div>
                            <div class="value">
                                {{ store.state.monitor8.equipCount
                                }}<span>대 </span>
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

        onMounted(() => {
            // let currentTime = new Date();
            // [gelix_lsj_231004] 데이터 연동 테스트를 위해 임의 날짜 사용
            let currentTime = new Date('2023-03-20 00:00:00');
            let startDate = moment(
                currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
            ).format('yyyy-MM-DD HH:mm:ss');
            let endDate = moment(currentTime.getTime()).format(
                'yyyy-MM-DD HH:mm:ss'
            );
            store.state.monitor8.startDate = startDate;
            store.state.monitor8.endDate = endDate;
            store.dispatch('monitor8/handleGraphData');
        });

        const clickParam = (value) => {
            store.state.monitor8.selectModel = value.title;
            store.state.monitor8.modelList.filter((list) => {
                if (list.title === value.title)
                    store.state.monitor8.id = list.id;
            });
            router.push('AgglomerateDetail');
        };

        return {
            clickParam,
            visibleToggle,
            store,
        };
    },
};
</script>

<style></style>
