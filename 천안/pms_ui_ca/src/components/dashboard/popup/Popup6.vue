<template>
    <div class="popup-info">
        <div class="popup-top-edge"></div>
        <div class="popup-bottom-edge"></div>
        <div class="popup-contents">
            <div
                class="items"
                v-for="(item, i) in store.state.dashboard.processStatus[5].list"
                :key="i"
            >
                <div class="title">
                    {{ item.title }}
                </div>

                <div class="item-list">
                    <div
                        class="item-box"
                        v-for="(item, i) in item.items"
                        :key="i"
                    >
                        <div
                            class="item"
                            :class="{ err: !item.status, eqon: item.eqon }"
                        ></div>
                        <div class="item-title">{{ item.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
export default {
    setup() {
        const store = useStore();

        return { store };
    },
};
</script>
