<template>
    <div>
        <MenuBar />
        <router-view class="view"></router-view>
        <AlarmModal />
    </div>
    </template>

    <script>
    import MenuBar from '@/components/menu/MenuBar.vue';
    import AlarmModal from '@/components/dashboard/popup/AlarmModal.vue'
    import { onMounted } from 'vue'

    export default {
        components:{
            MenuBar,
            AlarmModal
        },
        setup() {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        onMounted(async () => {
        if (token) {
                console.log('받은 토큰:', token);
                localStorage.setItem('authToken', token); // localStorage에 저장
            } else {
                console.error('토큰이 없습니다....');
                alert('login이 필요합니다....')
                // window.open(`${process.env.globalAioURL}`, '_self')
                window.open(window.globalAioURL, '_self')
            }
        })
        }
    
    }
</script>