import router from '@/router'
import numeral from 'numeral'
import { SERVICE_URL } from '@/store'
import * as XLSX from 'xlsx'

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
        case 1:
          this.$store.state.drawer.selectedMainMenuIndex = 1
          this.$store.state.receiving.processStep = 1
          if(this.$route.path!=='/indReceivingAlgorithm') router.push('/indReceivingAlgorithm')
          break
        case 2:
          this.$store.state.drawer.selectedMainMenuIndex = 2
          if(this.$route.path!=='/cgAlgorithm') router.push('/cgAlgorithm')
          break
        case 3:
          this.$store.state.drawer.selectedMainMenuIndex = 3
          if(this.$route.path!=='/mtccAlgorithm') router.push('/mtccAlgorithm')
          break
        case 4:
          this.$store.state.drawer.selectedMainMenuIndex = 4
          this.$store.state.sedimentation.processStep = 2
          if(this.$route.path!=='/sedimentationAlgorithm') router.push('/sedimentationAlgorithm')
          break
        case 5:
          this.$store.state.drawer.selectedMainMenuIndex = 5
          if(this.$route.path!=='/filterAlgorithm') router.push('/filterAlgorithm')
          break
        // case 6:
        //   this.$store.state.drawer.selectedMainMenuIndex = 2
        //   router.push('/gacAlgorithm')
        //   break
        // case 7:
        //   this.$store.state.drawer.selectedMainMenuIndex = 2
        //   router.push('/disinfectionAlgorithm')
        //   break
        case 7.1: // 1단계공업 전차염
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.disinfection.selectedDisinfectionIndex = 1
          this.$store.state.disinfection.processStep = 1
          if(this.$route.path!=='/indDisinfectionAlgorithm') router.push('/indDisinfectionAlgorithm')
          break
        case 7.3: // 2단계생활 후차염
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.disinfection.selectedDisinfectionIndex = 3
          this.$store.state.disinfection.processStep = 2
          if(this.$route.path!=='/disinfectionPostAlgorithm') router.push('/disinfectionPostAlgorithm')
          break
        case 7.4: // 2단계생활 전차염
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.disinfection.selectedDisinfectionIndex = 1
          this.$store.state.disinfection.processStep = 2
          if(this.$route.path!=='/disinfectionAlgorithm') router.push('/disinfectionAlgorithm')
           break
        case 7.5: // 3단계공업 전차염
          this.$store.state.drawer.selectedMainMenuIndex = 2
          this.$store.state.disinfection.selectedDisinfectionIndex = 1
          this.$store.state.disinfection.processStep = 3
          if(this.$route.path!=='/trtIndDisinfectionAlgorithm') router.push('/trtIndDisinfectionAlgorithm')
          break
        
        case 8:
          this.$store.state.drawer.selectedMainMenuIndex = 8
          window.open(SERVICE_URL.EMS + '/analysis', "_self")
          break
        case 16: // 공업3차 약품
          this.$store.state.drawer.selectedMainMenuIndex = 1
          if(this.$route.path!=='/trtIndCgAlgorithm') router.push('/trtIndCgAlgorithm')
          break
        case 17: // 공업3차 혼화/응집
          this.$store.state.drawer.selectedMainMenuIndex = 17
          if(this.$route.path!=='/trtIndMtccAlgorithm') router.push('/trtIndMtccAlgorithm')
          break
        case 18: // 공업3차 침전
          this.$store.state.drawer.selectedMainMenuIndex = 18
          this.$store.state.sedimentation.processStep = 3
          if(this.$route.path!=='/trtIndSedimentationAlgorithm') router.push('/trtIndSedimentationAlgorithm')
          break
        case 19: // 공업1차 약품
          this.$store.state.drawer.selectedMainMenuIndex = 1
          if(this.$route.path!=='/indCgAlgorithm') router.push('/indCgAlgorithm')
          break
        case 20: // 공업1차 혼화/응집
          this.$store.state.drawer.selectedMainMenuIndex = 20
          if(this.$route.path!=='/indMtccAlgorithm') router.push('/indMtccAlgorithm')
          break
        case 21: // 공업1차 침전
          this.$store.state.drawer.selectedMainMenuIndex = 21
          this.$store.state.sedimentation.processStep = 1
          if(this.$route.path!=='/indSedimentationAlgorithm') router.push('/indSedimentationAlgorithm')
          break
        case 22:
          this.$store.state.drawer.selectedMainMenuIndex = 1
          this.$store.state.receiving.processStep = 2
          if(this.$route.path!=='/receivingAlgorithm') router.push('/receivingAlgorithm')
          break
        case 23:
          this.$store.state.drawer.selectedMainMenuIndex = 1
          this.$store.state.receiving.processStep = 3
          if(this.$route.path!=='/trtIndReceivingAlgorithm') router.push('/trtIndReceivingAlgorithm')
          break
          default:
            this.$store.state.selectedBuildingIndex = index
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
      if(obj !== undefined) {
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
      if(obj.locationMin != null) {
        for (let i = obj.locationMin; i <= obj.locationMax; i ++) {
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
    /**
     * 하이차트 엑셀다운로드
     * 
     * @param chart 차트
     * @param data 데이터
     */
    Vue.prototype.$chartDownloadExcel = function(chart,  data) {
      const exportName = chart.exporting.buttons.contextButton.menuItems[2]

      // console.log(data)
      if (exportName == undefined) {
        const max_width_list = []
        for(let arr in data) {
          for(let field in data[arr]) {
            max_width_list.push({
              wch: data.reduce((w, r) => r[field].length === undefined ? field.length + 5 : Math.max(w, r[field].length), 10)
            })
          }
        }
        chart.exporting.buttons.contextButton.menuItems.push({
          text: 'Download Excel',
          onclick: function() {
            // 엑셀 워크시트로 json 내보내기
            const wb = XLSX.utils.book_new();
            let newSheet = XLSX.utils.json_to_sheet(data);
            newSheet['!cols'] = max_width_list

            XLSX.utils.book_append_sheet(wb, newSheet, `${chart.exporting.filename}`)
            XLSX.writeFile(wb, `${chart.exporting.filename}.xlsx`)
          }
        })
      }
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