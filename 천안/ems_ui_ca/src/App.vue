<template>
  <div class="page_bg">
    <HeaderName />
    <MenuBar />
    <div class="contents-container">
      <router-view @update:isLoading="setLoading" />
    </div>
    <div v-if="isLoading" class="loading-container">
      <div class="loading">
        <Fade-loader />
      </div>
    </div>
    <AlarmModal />
    <AIPopupModalVue />
    <SiteAlarmModal />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import HeaderName from '@/components/main/Header.vue'
import MenuBar from '@/components/menu/MenuBarBak.vue'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import AlarmModal from '@/components/common/AlarmModal.vue'
import AIPopupModalVue from './components/common/AIPopupModal.vue'
import SiteAlarmModal from '@/components/common/SiteAlarmModal.vue'

export default {
  components: {
    MenuBar,
    HeaderName,
    FadeLoader,
    AlarmModal,
    AIPopupModalVue,
    SiteAlarmModal
  },
  setup () {
    const isLoading = ref(false)
    const store = useStore()
    const loginInfo = computed(() => store.getters['loginCheck/getLoginInfo'])
    const delay = 15000
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id') // "gelix"
    const token = urlParams.get('token')
    let timer

    const setLoading = (value) => {
      isLoading.value = value
      if (value) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          // console.log('timeout!!, reset isLoading to false')
          isLoading.value = false
        }, delay)
      } else {
        clearTimeout(timer)
      }
    }
    const loginCheck = async () => {
      console.log(id)
      if (id === 'gelix') {
        console.log('개발서버')
      } else {
        await store.dispatch('loginCheck/fetchLoginInfo')
        if (loginInfo.value && loginInfo.value.length > 0) {
          console.log(loginInfo.value)
        } else {
          alert('login이 필요합니다')
          window.open(`${process.env.VUE_APP_AIO_URL}`, '_self')
        }
      }
    }

    onMounted(async () => {
      // ksw:의미없음 loginCheck()
      
      if (token) {
            console.log('받은 토큰:', token);
            localStorage.setItem('authToken', token); // localStorage에 저장
        } else {
            console.error('토큰이 없습니다....');
            alert('login이 필요합니다....')
            window.open(`${process.env.VUE_APP_AIO_URL}`, '_self')
        }
    })

    return {
      isLoading,
      setLoading
    }
  }
}
</script>

<style lang="scss">
html, body, #app{
  width: 100%;
  height: 100%;
  background: #101320;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.page_bg {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/img/img03.png');
  background-size: 100% 100%;
}
.contents-container {
  width: calc(100% - 38px);
  height: calc(100% - 105px);
  margin: 10px;
}
</style>
