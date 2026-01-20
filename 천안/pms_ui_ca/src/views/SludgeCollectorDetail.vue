<template>
    <div class="detail-9">
        <Header class="header" />
        <div class="content">
            <div class="content-left">
                <div class="chart-box">
                    <q-select
                        v-model="state.model"
                        :options="state.options"
                        bg-color="transparent"
                        dark
                        dense
                        @update:model-value="selectModel"
                    >
                        <template v-slot:prepend>
                            <q-avatar>
                                <img
                                    src="@/assets/titleicon.svg"
                                    alt=""
                                    class="titleCon"
                                />
                            </q-avatar>
                        </template>
                    </q-select>
                    <div class="titlebox"></div>
                    <!-- <Frame /> -->
                    <div class="image-area">
                        <img src="@/assets/motor.png" />
                    </div>
                </div>
                <div class="content-panel">
                    <img src="@/assets/box.png" alt="" class="panel-bg" />
                    <img src="@/assets/light.png" alt="" class="light-circle" />
                    <img src="@/assets/light2.png" alt="" class="light-line" />
                    <div class="content-header">
                        <img
                            src="@/assets/titleicon.svg"
                            alt=""
                            class="titleCon"
                        />
                        <p>상세 정보</p>
                    </div>
                    <div class="content-container">
                        <div class="value-area">
                            <div class="value-box">
                                <div class="label">
                                    가동여부
                                </div>
                                <div class="value">
                                    {{
                                        store.getters[
                                            'monitor9/selectModelStatus'
                                        ].eq_on
                                    }}
                                </div>
                            </div>
                            <div class="value-box">
                                <div class="label">
                                    상태정보
                                </div>
                                <div class="value"></div>
                            </div>
                            <div class="value-box">
                                <div class="label">
                                    이동속도
                                </div>
                                <div class="value"></div>
                            </div>
                            <div class="value-box">
                                <div class="label">
                                    이동속도 FB
                                </div>
                                <div class="value"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-right">
                <!-- 펌프현황 -->
                <div class="location">
                    <div class="search">
                        <input
                            @click="state.datePop"
                            readonly
                            :value="state.startStr"
                        />
                        <span>~</span>
                        <input
                            @click="state.datePop"
                            readonly
                            :value="state.endStr"
                        />
                        <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                            v-model="state.datePop"
                        >
                            <!-- [gelix_lsj_230922] q-date 날짜 변경 시 input에 업데이트 되도록 수정 -->
                            <q-date
                                v-model="state.date"
                                range
                                mask="YYYY-MM-DD"
                                @range-end="updateInputDate"
                            >
                                <div class="row items-center justify-end"></div>
                            </q-date>
                        </q-popup-proxy>
                    </div>
                    <button class="button" @click="searchDate">조회</button>
                </div>
                <div class="chart-box">
                    <div class="chart-area">
                        <div class="chart-con">
                            <Frame />
                            <Linechart
                                title="과전류"
                                name1="과전류"
                                :detailData="
                                    store.state.monitor9.detailData
                                        .current_limit
                                "
                            />
                        </div>
                    </div>
                    <div class="chart-area">
                        <div class="chart-con">
                            <Frame />
                            <Linechart
                                title="전압변동률"
                                name1="전압변동률"
                                :detailData="
                                    store.state.monitor9.detailData.voltage_diff
                                "
                            />
                        </div>
                    </div>
                    <div class="chart-area">
                        <div class="chart-con">
                            <Frame />
                            <Linechart
                                title="전류불평형"
                                name1="전류불평형"
                                :detailData="
                                    store.state.monitor9.detailData
                                        .current_unbalance
                                "
                            />
                        </div>
                    </div>
                    <div class="chart-area">
                        <div class="chart-con">
                            <Frame />
                            <Linechart
                                title="전압불평형"
                                name1="전압불평형"
                                :detailData="
                                    store.state.monitor9.detailData
                                        .voltage_unbalance
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Frame from '@/components/component/BoxFrame.vue';
import { useStore } from 'vuex';
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/menu/Header.vue';
import Linechart from '@/components/chart/monitoring/Linechart_s.vue';
import moment from 'moment';
export default {
    components: {
        Frame,
        Header,
        Linechart,
    },
    setup() {
        const router = useRouter();
        const store = useStore();
        const state = reactive({
            model: store.state.monitor9.selectModel,
            options: computed(() => {
                let list = [];
                for (
                    let i = 0;
                    i < store.state.monitor9.modelList.length;
                    i++
                ) {
                    list.push(store.state.monitor9.modelList[i].title);
                }
                return list;
            }),
            datePop: false,
            date: {
                from: '',
                to: '',
            },
            startStr: '',
            endStr: '',
            detailInfo: computed(() => store.getters['monitor9/detailInfo']),
        });

        let TITLE = reactive({
            name: '침전지슬러지수집기 #1',
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
                // console.log(endDate);
                store.state.monitor9.startDate = startDate;
                store.state.monitor9.endDate = endDate;
            }
            todayDate();
            dateToNumber();
            store.dispatch('monitor9/handleDatePicker');
        });

        const todayDate = () => {
            state.date.from = store.state.monitor9.startDate.split(' ')[0];
            state.date.to = store.state.monitor9.endDate.split(' ')[0];
            state.startStr = state.date.from;
            state.endStr = state.date.to;
        };

        const dateToNumber = () => {
            if (state.date.from && state.date.to) {
                  store.state.monitor9.pickDate.from = Number(
                      state.date.from.replaceAll('-', '')
                  );
                  store.state.monitor9.pickDate.to = Number(
                      state.date.to.replaceAll('-', '')
                  );
                  state.startStr = state.date.from;
                  state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230922] from, to를 같은 날짜로 선택 시 처리
                store.state.monitor9.pickDate.from = Number(
                    state.date.replaceAll('-', '')
                );
                store.state.monitor9.pickDate.to = Number(
                    state.date.replaceAll('-', '')
                );
                state.startStr = state.date;
                state.endStr = state.date;
            }
        };

        const searchDate = () => {
            dateToNumber();
            store.dispatch('monitor9/handleDatePicker');
        };

        const selectModel = (value) => {
            let select = store.state.monitor9.modelList.filter(
                (v) => v.title === value
            );
            store.state.monitor9.selectModel = select[0].title;
            store.state.monitor9.id = select[0].id;
            store.dispatch('monitor9/handleDatePicker');
        };
        const back = () => {
            router.push('SludgeCollectorView');
        };

        // [gelix_lsj_230922] q-date 날짜 변경 시 input에 업데이트 되도록 수정
        const updateInputDate = () => {
            if (state.date.from && state.date.to) {
                state.startStr = state.date.from;
                state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230922] from, to를 같은 날짜로 선택 시 처리
                state.startStr = state.date;
                state.endStr = state.date;
            }
        };

        return {
            store,
            state,
            selectedMotor,
            TITLE,
            model: ref('침전지슬러지수집기 #1'),
            options: [
                '침전지슬러지수집기 #1',
                '침전지슬러지수집기 #2',
                '침전지슬러지수집기 #3',
                '침전지슬러지수집기 #4',
                '침전지슬러지수집기 #5',
                '침전지슬러지수집기 #6',
                '침전지슬러지수집기 #7',
                '침전지슬러지수집기 #8',
            ],
            searchDate,
            selectModel,
            back,
            updateInputDate
        };
    },
};
</script>

<style></style>
