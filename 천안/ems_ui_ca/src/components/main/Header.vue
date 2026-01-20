<template>
    <div class="dashboard-view">
        <div class="top-bar">
                <img src="@/assets/img/logo_environment.png" alt=""  class="logo">
            <span class="title">AI 스마트 정수장 운영 시스템(천안)</span>
                <img src="@/assets/img/logo_kwater.png" alt=""  class="logo">
            <div class="top-line"><img src="@/assets/img/topbar.png" alt=""></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dashboard-view {
    width: 100%;
    padding-top: 85px;

    .top-bar {
        width: 100%;
        height: 85px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;

        .logo{
            height: 60%;
            margin: 0 12px;
        }

        .title {
            font-size: 35px;
            font-weight: bold;
            color: white;
            padding: 0 12px;
            font-family: 'KHNPHDRegular';
        }

        .top-line {
            position: absolute;
            bottom: -10px;
            right: 0;
            height: 32.5px;
        }
    }

    .main-content {
        width: 100%;
        position: relative;
        overflow: hidden;
    }
}
</style>