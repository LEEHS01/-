<template>
    <div class="detail-18">
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
            <div class="content-left">
                <div class="chart-box">
                  <!-- [gelix_lsj_230921] 온도 값 표시안되는 문제 수정 및 코드 간소화 -->
                  <div v-for="index in 20" :key="index">
                    온도{{ index }} :&nbsp;
                    {{
                      store.state.monitor18.modelList[store.state.monitor18.selectIdx] &&
                      store.state.monitor18.modelList[store.state.monitor18.selectIdx].status
                        ? store.state.monitor18.modelList[store.state.monitor18.selectIdx].status['temp_' + index]
                        : ''
                    }}
                    <br />
                  </div>
                    <Frame />
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
                                title="부분방전 크기"
                                name1="부분방전 크기"
                                :detailData="
                                    store.state.monitor18.detailData.dbm
                                "
                            />
                        </div>
                    </div>
                    <div class="chart-area">
                        <div class="chart-con">
                            <Frame />
                            <Linechart
                                title="부분방전 펄스수"
                                name1="부분방전 펄스수"
                                :detailData="
                                    store.state.monitor18.detailData.pps
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
                                title="내부온도 크기"
                                name1="내부온도 크기"
                                :detailData="
                                    store.state.monitor18.detailData.max_in
                                "
                            />
                        </div>
                    </div>
                    <div class="chart-area">
                        <div class="chart-con">
                            <Frame />
                            <Linechart
                                title="외부온도 크기"
                                name1="외부온도 크기"
                                :detailData="
                                    store.state.monitor18.detailData.max_out
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
            model: store.state.monitor18.selectModel,
            options: computed(() => {
                let list = [];
                for (
                    let i = 0;
                    i < store.state.monitor18.modelList.length;
                    i++
                ) {
                    list.push(store.state.monitor18.modelList[i].title);
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
            detailInfo: computed(() => store.getters['monitor18/detailInfo']),
        });

        onMounted(() => {
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
                // console.log(endDate);
                store.state.monitor18.startDate = startDate;
                store.state.monitor18.endDate = endDate;
            }
            todayDate();
            dateToNumber();
            store.dispatch('monitor18/handleDatePicker');
            store.dispatch('monitor18/getPumpInfo');
            // [gelix_lsj_230921] 상세 화면 진입 시 온도 값 표시
            selectModel(store.state.monitor18.selectModel)
        });

        const todayDate = () => {
            state.date.from = store.state.monitor18.startDate.split(' ')[0];
            state.date.to = store.state.monitor18.endDate.split(' ')[0];
            state.startStr = state.date.from;
            state.endStr = state.date.to;
        };

        const dateToNumber = () => {
            if (state.date.from && state.date.to) {
                  store.state.monitor18.pickDate.from = Number(
                      state.date.from.replaceAll('-', '')
                  );
                  store.state.monitor18.pickDate.to = Number(
                      state.date.to.replaceAll('-', '')
                  );
                  state.startStr = state.date.from;
                  state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230921] from, to를 같은 날짜로 선택 시 처리
                store.state.monitor18.pickDate.from = Number(
                    state.date.replaceAll('-', '')
                );
                store.state.monitor18.pickDate.to = Number(
                    state.date.replaceAll('-', '')
                );
                state.startStr = state.date;
                state.endStr = state.date;
            }
        };

        const searchDate = () => {
            dateToNumber();
            store.dispatch('monitor18/handleDatePicker');
        };

        const selectModel = (value) => {
            let select = store.state.monitor18.modelList.filter(
                (v) => v.title === value
            );
            store.state.monitor18.selectModel = select[0].title;
            store.state.monitor18.id = select[0].id;
            // [gelix_lsj_230921] 셀렉트 박스 선택 시 해당 설비의 온도 값 표시
            let idx = store.state.monitor18.modelList.findIndex(model => model.title === value)
            store.state.monitor18.selectIdx = idx
            store.dispatch('monitor18/handleDatePicker');
        };
        const back = () => {
            router.push('VcbView');
        };

        // [gelix_lsj_230921] q-date 날짜 변경 시 input에 업데이트 되도록 수정
        const updateInputDate = () => {
            if (state.date.from && state.date.to) {
                state.startStr = state.date.from;
                state.endStr = state.date.to;
            } else if (state.date) {
                // [gelix_lsj_230921] from, to를 같은 날짜로 선택 시 처리
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
