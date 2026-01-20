<template>
    <div class="monitor-18">
        <Header class="header" />
        <div class="content">
            <div class="content-left">
                <img src="@/assets/monitor-bg.png" class="panel-bg" />
                <!-- <div class="headerTitle">PAC튜브펌프</div> -->
                <div class="headerTitle">VCB반</div>
                <div class="content-container two">
                    <div
                        class="content-container-row"
                        v-for="(list, i) in store.state.monitor18.modelList"
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
                                        <p>부분방전크기</p>
                                    </div>
                                    <div class="value-val hold">
                                        <div class="value-val-left">
                                            임계값
                                        </div>
                                        <div class="value-val-right">
                                            1 dbm
                                        </div>
                                    </div>
                                    <div class="value-val hold cur">
                                        <div class="value-val-left">현재값</div>
                                        <div class="value-val-right">
                                            {{ list.avarage }} dbm
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
                                    threadHold="1"
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
import Linechart from '@/components/chart/monitoring/Linechart_m2.vue';
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
            store.state.monitor18.selectModel = value.title;
            store.state.monitor18.modelList.filter((list) => {
                if (list.title === value.title)
                    store.state.monitor18.id = list.id;
            });
            router.push('VcbDetail');
        };

        onMounted(() => {
            // let isLocal = true;
            // [gelix_lsj_230921] isLocal 값이 true로 되어있어 차트 갱신 안됨, 테스트를 위해 false로 수정
            let isLocal = false;
            if (!isLocal) {
                // let currentTime = new Date();
                // [gelix_lsj_230921] 데이터 연동 테스트를 위해 임의 날짜 사용
                let currentTime = new Date('2023-03-20 00:00:00');
                let startDate = moment(
                    currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
                ).format('yyyy-MM-DD HH:mm:ss');
                let endDate = moment(currentTime.getTime()).format(
                    'yyyy-MM-DD HH:mm:ss'
                );
                store.state.monitor18.startDate = startDate;
                store.state.monitor18.endDate = endDate;
                // console.log(startDate)
            }
            store.dispatch('monitor18/handleGraphData');
            // [gelix_lsj_230921] 펌프 상세 정보 조회 api가 누락되어서 추가
            store.dispatch('monitor18/getPumpInfo');
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
