<template>
    <div class="popup-info">
        <div class="popup-top-edge"></div>
        <div class="popup-bottom-edge"></div>
        <div class="popup-contents">
            <div
                class="items"
                v-for="(item, i) in store.state.dashboard.processStatus[0].list"
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

<style lang="scss">
.popup-info {
    z-index: 100;
    position: absolute;
    bottom: 11px;
    right: 432px;
    width: 511px;
    box-shadow: 0 0 10px 0 #accfff;
    background-color: rgb(19, 47, 78);
    animation: move-up-building 1s ease-in-out 0s normal backwards;

    .popup-top-edge {
        position: absolute;
        top: 1px;
        margin: 4px;
        width: 98%;
        height: 11px;
        background-image: url('../../../assets/dashboard_img/popup-top.png');
        background-size: 100%;
        background-position: center;
    }
    .popup-bottom-edge {
        position: absolute;
        bottom: 1px;
        margin: 4px;
        width: 98%;
        height: 11px;
        background-image: url('../../../assets/dashboard_img/popup-bottom.png');
        background-size: 100%;
        background-position: center;
    }

    .popup-contents {
        width: 100%;
        height: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 30px;

        .items {
            width: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            gap: 10px;

            .title {
                color: white;
                text-shadow: 0 0 9px #5cafff;
                margin-bottom: 10px;
                font-size: 18px;
            }
            .item-list {
                width: 100%;
                display: flex;
                gap: 15px;

                .item-box {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: center;
                    width: 60px;

                    .item-title {
                        color: #c3eaff;
                        font-size: 14px;
                        text-align: center;
                    }

                    .item {
                        width: 12px;
                        height: 12px;
                        background: #b4dffa;
                        box-shadow: 0 0 6px 0 #5cafff;
                        border-radius: 15px;
                    }

                    .err {
                        background: #f76767 !important;
                        box-shadow: 0 0 6px 0 #ff5c5c !important;
                        // animation: err 2s infinite;
                        animation: none;
                    }
                    .eqon {
                        background: #00a331;
                        box-shadow: 0 0 6px 0 #00b637;
                        animation: none;
                    }

                    @keyframes err {
                        from {
                            box-shadow: 0 0 8px 0 #363030;
                            background: #ff4747;
                        }
                        50% {
                            box-shadow: 0 0 8px 0 #ff5c5c46;
                            background: #f76767;
                        }
                        to {
                            box-shadow: 0 0 8px 0 #ff4747;
                            background: #ff4747;
                        }
                    }
                }
            }
        }
        .items::after {
            content: '';
            width: 100%;
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            height: 1px;
            background: linear-gradient(
                to right,
                #70a8dbb9,
                #2d6599,
                #13283ba1
            );
        }

        .items:last-child::after {
            height: 0;
        }
    }
}

@keyframes move-up-building {
    0% {
        transform: translateY(380px);
    }
    100% {
        transform: translateY(0px);
    }
}
</style>
