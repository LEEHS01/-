<template>
    <div class="monitor-12">
        <Header class="header" />
        <div class="content">
            <div class="content-left">
                <img src="@/assets/monitor-bg.png" class="panel-bg" />
                <div class="headerTitle">GAC역세펌프</div>
                <div class="content-container two">
                    <div
                        class="content-container-row"
                        v-for="(list, i) in store.state.monitor12.modelList"
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
                                <div class="empty-area"></div>
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
                                        펌프임계값<br />136.22 A
                                    </div>
                                    <div class="value-val hold cur">
                                        현재값<br />{{ list.avarage }} A
                                    </div>
                                </div>
                            </div>
                            <div class="chart-con">
                                <Frame />
                                <Linechart
                                    :elecData="list.current"
                                    threadHold="136.22"
                                    max="145"
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
                        <p>GAC역세펌프 운영현황</p>
                    </div>
                    <div class="panel-content">
                        <div class="value-box">
                            <div class="value-content">
                                <div class="value-data">
                                    <div class="value-item">
                                        <div class="label">
                                            운영대수
                                        </div>
                                        <div class="value">
                                            {{
                                                store.state.monitor12.equipCount
                                            }}
                                            대
                                        </div>
                                    </div>
                                </div>
                                <div class="value-data">
                                    <div class="value-item">
                                        <div class="label">
                                            유량
                                        </div>
                                        <div class="value">
                                            {{
                                                store.state.monitor12
                                                    .modelList[0].status
                                                    .flow_rate
                                            }}㎥/min
                                        </div>
                                    </div>
                                </div>
                                <div class="value-data">
                                    <div class="value-item">
                                        <div class="label">
                                            압력
                                        </div>
                                        <div class="value">
                                            {{
                                                store.state.monitor12
                                                    .modelList[0].status
                                                    .pressure
                                            }}kgf/㎥
                                        </div>
                                    </div>
                                </div>
                                <div class="value-chart-group">
                                    <div class="value-chart">
                                        <div class="label">
                                            ▸ 분포도
                                        </div>
                                        <div class="value">
                                            <Scatter
                                                :data="
                                                    store.state.monitor12
                                                        .modelList[0]
                                                        .distribution
                                                "
                                            />
                                        </div>
                                    </div>
                                    <div class="value-chart">
                                        <div class="label">
                                            ▸ 분포도2
                                        </div>
                                        <div class="value">
                                            <Scatter2
                                                :data="
                                                    store.state.monitor12
                                                        .modelList[0]
                                                        .distribution
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
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
import Scatter from '@/components/chart/monitoring/Scatter_gac.vue';
import Scatter2 from '@/components/chart/monitoring/Scatter_gac2.vue';
import { onMounted } from 'vue';
import moment from 'moment';
export default {
    components: {
        Header,
        Frame,
        Linechart,
        Scatter,
        Scatter2,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const visibleToggle = () => {
            store.state.alertVisible = !store.state.alertVisible;
        };

        onMounted(() => {
            let isLocal = false;
            if (!isLocal) {
                // let currentTime = new Date();
                // [gelix_lsj_230922] 데이터 연동 테스트를 위해 임의 날짜 사용
                let currentTime = new Date('2023-03-20 00:00:00');
                let startDate = moment(
                    currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
                ).format('yyyy-MM-DD HH:mm:ss');
                let endDate = moment(currentTime.getTime()).format(
                    'yyyy-MM-DD HH:mm:ss'
                );
                store.state.monitor12.startDate = startDate;
                store.state.monitor12.endDate = endDate;
            }
            store.dispatch('monitor12/handleGraphData');
        });

        const clickParam = (value) => {
            store.state.monitor12.selectModel = value.title;
            store.state.monitor12.modelList.filter((list) => {
                if (list.title === value.title)
                    store.state.monitor12.id = list.id;
            });
            router.push('GacBackwashDetail');
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
