<template>
    <div class="detail-13">
        <Header class="header" />
        <div class="content">
            <div class="content-select">
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
                <div class="back-btn" v-on:click="back()">
                    <span> ← Back</span>
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
                            <!-- [gelix_lsj_230921] q-date 날짜 변경 시 input에 업데이트 되도록 수정 -->
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
                                    store.state.monitor13.detailData
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
                                    store.state.monitor13.detailData
                                        .voltage_diff
                                "
                            />
                        </div>
                    </div>
                </div>
                <div class="chart-box">
                    <div class="chart-area">
                        <div class="chart-con">
                            <Frame />
                            <Linechart
                                title="전류불평형"
                                name1="전류불평형"
                                :detailData="
                                    store.state.monitor13.detailData
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
                                    store.state.monitor13.detailData
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
import { reactive, computed, onMounted } from 'vue';
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
            model: store.state.monitor13.selectModel,
            options: computed(() => {
                let list = [];
                for (
                    let i = 0;
                    i < store.state.monitor13.modelList.length;
                    i++
                ) {
                    list.push(store.state.monitor13.modelList[i].title);
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
            detailInfo: computed(() => store.getters['monitor13/detailInfo']),
        });

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
                store.state.monitor13.startDate = startDate;
                store.state.monitor13.endDate = endDate;
            }

            todayDate();
            dateToNumber();
            store.dispatch('monitor13/handleDatePicker');
        });

        const todayDate = () => {
            state.date.from = store.state.monitor13.startDate.split(' ')[0];
            state.date.to = store.state.monitor13.endDate.split(' ')[0];
            state.startStr = state.date.from;
            state.endStr = state.date.to;
        };

        const dateToNumber = () => {
            if (state.date.from && state.date.to) {
                  store.state.monitor13.pickDate.from = Number(
                      state.date.from.replaceAll('-', '')
                  );
                  store.state.monitor13.pickDate.to = Number(
                      state.date.to.replaceAll('-', '')
                  );
                  state.startStr = state.date.from;
                  state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230922] from, to를 같은 날짜로 선택 시 처리
                store.state.monitor13.pickDate.from = Number(
                    state.date.replaceAll('-', '')
                );
                store.state.monitor13.pickDate.to = Number(
                    state.date.replaceAll('-', '')
                );
                state.startStr = state.date;
                state.endStr = state.date;
            }
        };

        const searchDate = () => {
            dateToNumber();
            store.dispatch('monitor13/handleDatePicker');
        };

        const selectModel = (value) => {
            let select = store.state.monitor13.modelList.filter(
                (v) => v.title === value
            );
            store.state.monitor13.selectModel = select[0].title;
            store.state.monitor13.id = select[0].id;
            store.dispatch('monitor13/handleDatePicker');
        };
        const back = () => {
            router.push('MotifPumpView');
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
            searchDate,
            selectModel,
            back,
            updateInputDate
        };
    },
};
</script>

<style></style>
