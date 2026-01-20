<template>
    <div class="dashboard">
        <Header class="header" />

        <div class="content">
            <div class="section s-left">
                <img src="@/assets/box3.png" alt="" class="box" />
                <img src="@/assets/light.png" alt="" class="light-circle" />
                <img src="@/assets/light2.png" alt="" class="light-line" />

                <div class="sub-sec">
                    <div class="title-box">
                        <img
                            src="@/assets/titleicon.svg"
                            alt=""
                            class="titleCon"
                        />
                        <p>설비현황 통계</p>
                    </div>

                    <div class="content-box">
                        <PieMain class="charts pie_main" />
                    </div>
                </div>
                <div class="sub-sec">
                    <div class="content-box">
                        <BarMain class="charts bar_main" />
                    </div>
                </div>
            </div>
            <div class="section s-center">
                <img src="@/assets/box2.png" alt="" class="box" />
                <img src="@/assets/light.png" alt="" class="light-circle" />
                <img src="@/assets/light2.png" alt="" class="light-line" />

                <div class="title">
                    <p>공정별 설비현황 통계</p>
                </div>
                <div class="content-box">
                    <MainDashboard class="main-board" />
                </div>
            </div>
            <div class="section s-right">
                <img src="@/assets/box3.png" alt="" class="box" />
                <img src="@/assets/light.png" alt="" class="light-circle" />
                <img src="@/assets/light2.png" alt="" class="light-line" />
                <div class="title-box">
                    <img src="@/assets/titleicon.svg" alt="" class="titleCon" />
                    <p>송수 설비 현황</p>
                </div>

                <div class="content-box">
                    <div class="table-box">
                        <div class="title-box">
                            <img src="@/assets/circle.svg" alt="" />
                            <p>펌프모터</p>
                        </div>
                        <Frame />
                        <Table :tableRow="store.state.pumpMotor" />
                    </div>
                </div>

                <div class="content-box">
                    <div class="table-box">
                        <div class="title-box">
                            <img src="@/assets/circle.svg" alt="" />
                            <p>펌프기동반</p>
                        </div>
                        <Frame />
                        <Table :tableRow="store.state.pumpMotor" />
                    </div>
                </div>
            </div>
        </div>

        <div class="alertToggle">
            <p @click="visibleToggle" class="title">시스템 알람 이력</p>

            <AlertSlider />
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import Header from '@/components/menu/Header.vue';
import AlertSlider from '@/components/dashboard/AlertSlider.vue';
import PieMain from '@/components/chart/dashboard/PieChart_main.vue';
import BarMain from '@/components/chart/dashboard/BarChart_main.vue';
import Table from '@/components/component/Table.vue';
import Frame from '@/components/component/BoxFrame.vue';
import MainDashboard from '@/components/dashboard/MainDashboard.vue';

export default {
    components: {
        Header,
        AlertSlider,
        PieMain,
        BarMain,
        Table,
        Frame,
        MainDashboard,
    },
    setup() {
        const store = useStore();
        const visibleToggle = () => {
            store.state.alertVisible = !store.state.alertVisible;
        };

        return {
            visibleToggle,
            store,
        };
    },
};
</script>

<style></style>
