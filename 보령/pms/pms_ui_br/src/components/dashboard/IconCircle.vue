<template>
    <div class="icon">
        <div class="circle" @click="selectIcon">
            <img src="@/assets/iconcircle.svg" alt="" />
            <img :src="getImgUrl()" alt="" class="processIcon" />
            <div class="iconlight light1"></div>
            <div class="iconlight light2"></div>
        </div>

        <span class="title">
            {{ iconTitle }}
        </span>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
    props: ['img', 'title', 'index'],
    setup(props) {
        const iconTitle = ref(props.title);
        const store = useStore();
        const getImgUrl = () => {
            return require('@/assets/centerIcon/' + props.img + '.svg');
        };

        const selectIcon = () => {
            const process = store.state.process;
            process.map((x) => (x.selected = false));
            store.state.process[parseInt(props.index)].selected = true;
        };

        return { getImgUrl, iconTitle, selectIcon };
    },
};
</script>

<style></style>
