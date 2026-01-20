<template>
    <q-slide-transition>
        <div v-show="store.state.alertVisible" class="alertSlider">
            <div class="content">
                <TableAlert
                    class="table-box"
                    title="펌프기동반"
                    :tableRow="store.state.alertList"
                />
            </div>
        </div>
    </q-slide-transition>
</template>

<script>
import { useStore } from 'vuex';
import TableAlert from '@/components/component/Table_alert.vue';

export default {
    components: { TableAlert },
    setup() {
        const store = useStore();

        return {
            store,
        };
    },
};
</script>

<style></style>
