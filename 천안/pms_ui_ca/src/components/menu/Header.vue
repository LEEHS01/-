<template>
    <div class="header">
        <div class="top-bar">
            <!-- <img
                src="@/assets/logo.svg"
                alt=""
                class="logo"
                @click="goSite('/', 3)"
            /> -->
            <img
                src="@/assets/evironment.png"
                alt=""
                class="logo"
                @click="goRouter('/')"
            />
            <span class="title" @click="goRouter('/')"
                >AI 스마트 정수장 운영 시스템(천안)</span
            >
            <img
                src="@/assets/kwater.png"
                alt=""
                class="logo"
                @click="goRouter('/')"
            />
            <div class="top-line"><img src="@/assets/topbar.png" alt="" /></div>
            <!-- <div class="top-line">
                <img src="@/assets/topbar.png" alt="" @click="goSite('/', 3)" />
            </div> -->
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const router = useRouter();
        const state = reactive({
            select: 0,
        });
        const toggleLeftDrawer = () => {
            store.state.leftDrawerOpen = !store.state.leftDrawerOpen;
        };

        const goRouter = (value, idx) => {
            router.push(value);
            state.select = idx;
        };
        const goSite = (value) => {
            window.location.href = value;
        };

        return {
            toggleLeftDrawer,
            thumbStyle: {
                right: '4px',
                borderRadius: '5px',
                backgroundColor: '#ffffff55',
                width: '5px',
                opacity: 0.75,
            },
            goRouter,
            goSite,
        };
    },
};
</script>
