<template>
    <div class="alerts">
        <div class="title-box">
            <img src="@/assets/titleicon.svg" alt="" />
            <span>알람 현황</span>
        </div>
        <div class="alert-box">
            <div class="table-box">
                <TableAlert :tableRow="store.state.alertList" />
            </div>
        </div>
    </div>
</template>

<script>
import TableAlert from '@/components/component/Table_alert.vue';
import { useStore } from 'vuex';
export default {
    components: {
        TableAlert,
    },
    setup() {
        const store = useStore();

        return {
            store,
        };
    },
};
</script>

<style></style>
