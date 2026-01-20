<template>
    <transition name="modal" appear v-show="showModal">
    <div class="modal modal-overlay">
      <div class="modal-window">
        <div class="modal-content">
          <div class="k-window" style="padding-top: 0px;min-width: 90px; min-height: 50px; width: 463px; height: 250px;">
            <div style="padding: 25px; height: 100%; width: 100%; box-sizing: border-box;">
              <div class="popup__title">
                <div class="popup__icon"></div>
                <span id="pop2_title">알림</span>
              </div>
              <div class="popoup__body">
                <!-- <span style="font-size: 20px; color: white;">{{ popupTime }}</span>
                <span style="font-size: 20px; color: white;">{{ popupMsg }}</span> -->
                <div style="font-size: 20px; color: white;">{{ popupTime }}</div>
                <div style="font-size: 20px; color: white;">{{ popupMsg }}</div>
              </div>
              <div class="popup_button">
                <div class="popup__btn popup__btn__change" @click="goRouter(popupGo)">이동</div>
                <div class="popup__btn popup__btn__change" @click="closePop">확인</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { time } from 'echarts'
import { speakText } from '@/utils/tts.js'
import log from '@/logger.js'
import axios from 'axios'

export default {
  setup () {
    const store = useStore()
    // const alarmData = computed(() => store.getters['peak/getAlarm'])
    const alarmData = computed(() => store.getters['dashboard/getAlarm'])
    const router = useRouter()
    const showModal = ref(false)
    const popupId = ref('')
    const popupTime = ref('')
    const popupMsg = ref('')
    const popupGo = ref('')
    const executeInterval = ref(null)

    const events = [
      {
        id: '222000',
        go: 'peak'
      },
      {
        id: '223000',
        go: 'peak'
      },
      {
        id: '224000',
        go: 'peak'
      },
      {
        id: '225000',
        go: 'peak'
      },
      {
        id: '233000',
        go: 'songsu'
      },
      {
        id: '234000',
        go: 'songsu'
      }
    ]

    const closePop = () => {
      showModal.value = false
    }

    const goRouter = (value) => {
      router.push(value)
      closePop()
    }

    // const alarmFlag = (data, time, peakGoal) => {
    //   const list = []
    //   let flag = false

    //   for (let i = 0; i < data.length; i++) {
    //     const prdctPwr = uncomma(data[i].PRDCT_PWR)

    //     if (!isNaN(prdctPwr) && Number(prdctPwr) > Number(peakGoal)) {
    //       list.push(data[i].DATE)
    //     }
    //   }

    //   for (let i = 0; i < list.length; i++) {
    //     if (list[i] === time.value) {
    //       flag = true
    //     }
    //   }

    //   return flag
    // }

    const checkAlarm = async () => {
      try {
        // await store.dispatch('peak/fetchAlarm')
        await store.dispatch('dashboard/fetchAlarm')
        if (alarmData.value && alarmData.value.length > 0) {
          const alarm = JSON.parse(JSON.stringify(alarmData.value))
          popupId.value = alarm[0].ALARM_ID
          popupTime.value = alarm[0].TIME
          popupMsg.value = alarm[0].MSG
          // popupGo.value = alarm[0].LINK
          const evtIdx = events.findIndex(event => event.id === popupId.value)
          popupGo.value = events[evtIdx].go
          showModal.value = true
          alarmUpdate()
          speakText(popupMsg.value)
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const alarmUpdate = () => {
      axios
        .post(
          `${process.env.VUE_APP_HOST_IP}/api/alarmUpdate`
        )
        .then((resp) => {
          // console.log('Peak alarm update 성공')
        })
        .catch((error) => {
          if (error.response) {
            // console.log(error.response.data)
            // console.log(error.response.status)
          }
        })
    }

    const executeApis = () => {
      checkAlarm()
    }

    onMounted(() => {
      checkAlarm()
      // 10초 주기
      executeInterval.value = setInterval(executeApis, 10000)
    })
    onUnmounted(() => {
      clearInterval(executeInterval.value)
    })
    return {
      showModal,
      popupTime,
      popupMsg,
      popupGo,
      closePop,
      goRouter
    }
  }
}

</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';

.modal {
  &.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  &-window {
    background-color: transparent;
    border-radius: 4px;
    overflow: hidden;
  }
}
/**오버레이 트랜지션**/
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

/**오버레이에 포함되어 있는 모달 윈도의 트랜지션**/
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

/**딜레이가 적용된 모달 윈도가 제거된 후에 오버레이가 사라짐**/
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
.k-window{
    border: none;
    box-shadow: none;
    background: url('@/assets/img/popup/alert.png') no-repeat;
    background-size: 100% 100%;
    font-family: 'KHNPHDRegular';
}
/*2021-12-09*/
.k-content{
    background: none;
    /* color: #fff; */
    padding: 25px;
}

.popup__title {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    font-size: 24px;
    color: #b4dffb;
    font-family: 'KHNPHDRegular';
}
.popup__icon {
    background: url('@/assets/img/popup/top_img.png') no-repeat;
    background-size: 100% 100%;
    width: 17px;
    height: 28px;
    margin-right: 15px;
}
.popoup__body{
    padding: 10px 15px;
    font-size: 16px;
    color: #fff;
}
.popup_button{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 15px;
}
.popup__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 105px;
    height: 34px;
    font-size: 15px;
    color: #fff;
    margin: 0 10px;
    cursor: pointer;
}
.popup__btn__cancel{
    border: 1px solid #b4dffa;
    background-color: rgba(185,255,250,.25);
}
.popup__btn__change{
    border: 1px solid #b4dffa;
    background-color: rgba(139,194,240,.25);
}

</style>
