import router from '@/router'
import numeral from 'numeral'
import { SERVICE_URL } from '@/store'

export default{
  install(Vue){
    /**
     * 공정 페이지로 라우팅 하는 함수
     * 
     * @param index 공정index
     */
    Vue.prototype.$routingByIndex = function (index){
      switch (index) {
        case 0:
          this.$store.state.drawer.selectedMainMenuIndex = 0
          if(this.$route.path!=='/') router.push('/')
          break
        case 1.1:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/fstReceivingAlgorithm') router.push('/fstReceivingAlgorithm')
          break
        case 1.2:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/sndReceivingAlgorithm') router.push('/sndReceivingAlgorithm')
          break
        case 1.3:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/trdReceivingAlgorithm') router.push('/trdReceivingAlgorithm')
          break
        case 1.4:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/pumpReceivingAlgorithm') router.push('/pumpReceivingAlgorithm')
          break
        case 2:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/cgAlgorithm') router.push('/cgAlgorithm')
          break
        case 3:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/mtccAlgorithm') router.push('/mtccAlgorithm')
          break
        case 4:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/sedimentationAlgorithm') router.push('/sedimentationAlgorithm')
          break
        case 5:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/filterAlgorithm') router.push('/filterAlgorithm')
          break
        case 7.1: // 전차염 2단계공업
          this.$store.state.fstDisinfection.disinfectionStep = 1
          this.$store.state.drawer.selectedMainMenuIndex = 2
          // this.$store.state.fstDisinfection.title = '전차염'
          this.$store.state.selectedBuildingIndex = 7.1
          if(this.$route.path!=='/preFstDisinfectionAlgorithm') router.push('/preFstDisinfectionAlgorithm')
          break
        case 7.2: // 전차염 2단계생활
          // this.$store.state.sndDisinfection.disinfectionStep = 1
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.sndDisinfection.title = '전차염'
          this.$store.state.selectedBuildingIndex = 7.2
          if(this.$route.path!=='/preSndDisinfectionAlgorithm') router.push('/preSndDisinfectionAlgorithm')
           break
        case 7.3: // 전차염 3단계
          // this.$store.state.trdDisinfection.disinfectionStep = 1
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.trdDisinfection.title = '전차염'
          this.$store.state.selectedBuildingIndex = 7.3
          if(this.$route.path!=='/preTrdDisinfectionAlgorithm') router.push('/preTrdDisinfectionAlgorithm')
          break
        case 7.4: // 중차염 2단계생활
          // this.$store.state.sndDisinfection.disinfectionStep = 2
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.sndDisinfection.title = '중차염'
          this.$store.state.selectedBuildingIndex = 7.4
          if(this.$route.path!=='/periSndDisinfectionAlgorithm') router.push('/periSndDisinfectionAlgorithm')
          break
        case 7.5: // 중차염 3단계
          // this.$store.state.trdDisinfection.disinfectionStep = 2
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.trdDisinfection.title = '중차염'
          this.$store.state.selectedBuildingIndex = 7.5
          if(this.$route.path!=='/periTrdDisinfectionAlgorithm') router.push('/periTrdDisinfectionAlgorithm')
          break
        case 7.6: // 후차염 2단계생활
          // this.$store.state.sndDisinfection.disinfectionStep = 3
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.sndDisinfection.title = '후차염'
          this.$store.state.selectedBuildingIndex = 7.6
          if(this.$route.path!=='/postSndDisinfectionAlgorithm') router.push('/postSndDisinfectionAlgorithm')
          break
        case 7.7: // 후차염 3단계
          // this.$store.state.trdDisinfection.disinfectionStep = 3
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.trdDisinfection.title = '후차염'
          this.$store.state.selectedBuildingIndex = 7.7
          if(this.$route.path!=='/postTrdDisinfectionAlgorithm') router.push('/postTrdDisinfectionAlgorithm')
          break
        case 8:
          this.$store.state.drawer.selectedMainMenuIndex = 8
          window.open(SERVICE_URL.EMS + '/analysis', "_self")
          break
        case 16: // 공업3차 약품
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/trtIndCgAlgorithm') router.push('/trtIndCgAlgorithm')
          break
        case 17: // 공업3차 혼화/응집
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/trtIndMtccAlgorithm') router.push('/trtIndMtccAlgorithm')
          break
        case 18: // 공업3차 침전
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/trtIndSedimentationAlgorithm') router.push('/trtIndSedimentationAlgorithm')
          break
        case 19: // 공업1차 약품
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/indCgAlgorithm') router.push('/indCgAlgorithm')
          break
        case 20: // 공업1차 혼화/응집
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/indMtccAlgorithm') router.push('/indMtccAlgorithm')
          break
        case 21: // 공업1차 침전
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/indSedimentationAlgorithm') router.push('/indSedimentationAlgorithm')
          break
        case 22: // 3차 여과
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/trdFilterAlgorithm') router.push('/trdFilterAlgorithm')
          break
      }
    },
    /**
     * 숫자에 폰트와 콤마(,) 적용하는 함수
     * 
     * @param value 숫자
     * @returns formatted number 
     */
    Vue.prototype.$getNumeralWithCommaAndFontFamily = function (value) {
      return numeral(value).format('0,0').replace(/,/gi, '<span style="font-family: Noto Sans CJK KR">,</span>')
    },
    /**
     * 시간을 밀리초로 변환하는 함수
     *
     * @param value 시간
     * @return 밀리초
     */
    Vue.prototype.$getMilliSecondFromHour = function (value) {
      return 1000 * 60 * 60 * value
    },
    /**
     * 값에 따라 AI모드인지 판단하는 함수
     * @param value 운영모드
     * @return AI모드 판단 여부
     */
    Vue.prototype.$isAIMode = function (value) {
      return value !== 0 ? true : false
    },
    /**
     * 여과/GAC여과 차트의 x축의 최소 값과, 최대값을 구하는 함수
     * 
     * @param obj 혼화응집 스케쥴 객체
     * @return [최소값, 최대값]
     */
    Vue.prototype.$getMinMaxTimestampAIFLocationSchedule = function(obj) {
      let min = 0
      let max = 0
      let locationKeys = Object.keys(obj)
      for(let i = 0; i < locationKeys.length ; i++) {
        if (obj[locationKeys[i]].start !== "0") {
          let startTimestamp = new Date(obj[locationKeys[i]].start).getTime()
          if (min === 0) {
            min = startTimestamp
          } else {
            if (startTimestamp < min) {
              min = startTimestamp
            }
          }
        }
        if (obj[locationKeys[i]].next_end !== "0") {
          let nextEndTimestamp = new Date(obj[locationKeys[i]].next_end).getTime()
          if (max === 0) {
            max = nextEndTimestamp
          } else {
            if (nextEndTimestamp > max) {
              max = nextEndTimestamp
            }
          }
        } else if (obj[locationKeys[i]].end !== "0") {
          let endTimestamp = new Date(obj[locationKeys[i]].end).getTime()
          if (max === 0) {
            max = endTimestamp
          } else {
            if (endTimestamp > max) {
              max = endTimestamp
            }
          }
        }
      }
      return [min, max]
    },
    /**
     * 침전 차트의 x축의 최소 값과, 최대값을 구하는 함수
     * 
     * @param obj 혼화응집 스케쥴 객체
     * @return [최소값, 최대값]
     */
    Vue.prototype.$getMinMaxTimestampAIELocationSchedule = function(obj) {
      let min = 0
      let max = 0
      for (let i = 1; i < 9; i ++) {
        if (obj['e_sc' + i + '_schedule'].start !== null && obj['e_sc' + i + '_schedule'].start !== "" && obj['e_sc' + i + '_schedule'].start !== "0") {
          let startTimestamp = new Date(obj['e_sc' + i + '_schedule'].start).getTime()
          if (min === 0) {
            min = startTimestamp
          } else {
            if (startTimestamp < min) {
              min = startTimestamp
            }
          }
        }
        if (obj['e_sc' + i + '_schedule'].stop !== null && obj['e_sc' + i + '_schedule'].stop !== "" && obj['e_sc' + i + '_schedule'].stop !== "0") {
          let nextEndTimestamp = new Date(obj['e_sc' + i + '_schedule'].stop).getTime()
          if (max === 0) {
            max = nextEndTimestamp
          } else {
            if (nextEndTimestamp > max) {
              max = nextEndTimestamp
            }
          }
        }
        if (obj['e_sc' + i + '_schedule'].inbal !== null && obj['e_sc' + i + '_schedule'].inbal !== "" && obj['e_sc' + i + '_schedule'].inbal !== "0") {
          let nextEndTimestamp = new Date(obj['e_sc' + i + '_schedule'].inbal).getTime()
          if (max === 0) {
            max = nextEndTimestamp
          } else {
            if (nextEndTimestamp > max) {
              max = nextEndTimestamp
            }
          }
        }
      }
      return [min, max]
    },
    /**
     * 2차 공업 침전 차트의 x축의 최소 값과, 최대값을 구하는 함수
     * 
     * @param obj 혼화응집 스케쥴 객체
     * @return [최소값, 최대값]
     */
    Vue.prototype.$getMinMaxTimestampAIELocationSchedule2 = function(obj) {
      let min = 0
      let max = 0
      for (let i = 9; i < 11; i ++) {
        if (obj['e_sc' + i + '_schedule'].start !== null && obj['e_sc' + i + '_schedule'].start !== "" && obj['e_sc' + i + '_schedule'].start !== "0") {
          let startTimestamp = new Date(obj['e_sc' + i + '_schedule'].start).getTime()
          if (min === 0) {
            min = startTimestamp
          } else {
            if (startTimestamp < min) {
              min = startTimestamp
            }
          }
        }
        if (obj['e_sc' + i + '_schedule'].stop !== null && obj['e_sc' + i + '_schedule'].stop !== "" && obj['e_sc' + i + '_schedule'].stop !== "0") {
          let nextEndTimestamp = new Date(obj['e_sc' + i + '_schedule'].stop).getTime()
          if (max === 0) {
            max = nextEndTimestamp
          } else {
            if (nextEndTimestamp > max) {
              max = nextEndTimestamp
            }
          }
        }
        if (obj['e_sc' + i + '_schedule'].inbal !== null && obj['e_sc' + i + '_schedule'].inbal !== "" && obj['e_sc' + i + '_schedule'].inbal !== "0") {
          let nextEndTimestamp = new Date(obj['e_sc' + i + '_schedule'].inbal).getTime()
          if (max === 0) {
            max = nextEndTimestamp
          } else {
            if (nextEndTimestamp > max) {
              max = nextEndTimestamp
            }
          }
        }
      }
      return [min, max]
    },
    /**
     * 3차 공업 침전 차트의 x축의 최소 값과, 최대값을 구하는 함수
     * 
     * @param obj 혼화응집 스케쥴 객체
     * @return [최소값, 최대값]
     */
    Vue.prototype.$getMinMaxTimestampAIELocationSchedule3 = function(obj) {
      let min = 0
      let max = 0
      for (let i = 1; i < 6; i ++) {
        if (obj['e_sc' + i + '_schedule'].start !== null && obj['e_sc' + i + '_schedule'].start !== "" && obj['e_sc' + i + '_schedule'].start !== "0") {
          let startTimestamp = new Date(obj['e_sc' + i + '_schedule'].start).getTime()
          if (min === 0) {
            min = startTimestamp
          } else {
            if (startTimestamp < min) {
              min = startTimestamp
            }
          }
        }
        if (obj['e_sc' + i + '_schedule'].stop !== null && obj['e_sc' + i + '_schedule'].stop !== "" && obj['e_sc' + i + '_schedule'].stop !== "0") {
          let nextEndTimestamp = new Date(obj['e_sc' + i + '_schedule'].stop).getTime()
          if (max === 0) {
            max = nextEndTimestamp
          } else {
            if (nextEndTimestamp > max) {
              max = nextEndTimestamp
            }
          }
        }
        if (obj['e_sc' + i + '_schedule'].inbal !== null && obj['e_sc' + i + '_schedule'].inbal !== "" && obj['e_sc' + i + '_schedule'].inbal !== "0") {
          let nextEndTimestamp = new Date(obj['e_sc' + i + '_schedule'].inbal).getTime()
          if (max === 0) {
            max = nextEndTimestamp
          } else {
            if (nextEndTimestamp > max) {
              max = nextEndTimestamp
            }
          }
        }
      }
      return [min, max]
    },
    /**
     * 한글을 음성으로 읽어주는 함수
     * 
     * @param text 텍스트
     * @param opt_prop 추가 옵션
     * 
     */
    Vue.prototype.$speak = function(text, opt_prop) {
      if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
        alert("이 브라우저는 음성 합성을 지원하지 않습니다.")
        return
      }
      
      // window.speechSynthesis.cancel() // 현재 읽고있다면 초기화

      const prop = opt_prop || {}

      const speechMsg = new SpeechSynthesisUtterance()
      speechMsg.rate = prop.rate || 1 // 속도: 0.1 ~ 10      
      speechMsg.pitch = prop.pitch || 1 // 음높이: 0 ~ 2
      speechMsg.lang = prop.lang || "ko-KR"
      speechMsg.text = text
      
      // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
      window.speechSynthesis.speak(speechMsg)
    },
    /**
     * 값이 마이너스인 경우 0으로 반환
     * 
     * @param obj 숫자
     * @return 0 or 숫자
     */
    Vue.prototype.$minusToZero = function(obj) {
      return obj < 0 ? 0 : obj
    },
    Vue.prototype.$getProcessTitle = function(process) {
      switch (process) {
        case "B":
          return "착수"
        case "C":
          return "약품"
        case "D":
          return "혼화응집"
        case "E":
          return "침전"
        case "F":
          return "여과"
        case "G1":
          return "소독 전차염"
        case "G2":
          return "소독 중차염"
        case "G3":
          return "소독 후차염"
      }
    }
  },
}