<template>
  <div class="goal-contents-body">
    <div class="title_wrap">
      <span class="title">절감 목표</span>
      <div class="title_line"></div>
    </div>
    <div class="goal-divL fL">
      <div class="goal-div_grid goal-div_border fL">
        <div class="goal-EitemsName">
          <span class="fL" style="margin-top:17px; font-size: 16px;">
            <select class="drop-down-year" v-model="selectedYear" @change="changeYear">
              <option v-for="(item, idx) in yearList" :key="idx" :value="item">
                {{item}}
              </option>
            </select>
          </span>
          <div v-show="isThisYear">
            <span class="buttonArea fR" style="margin-top: 17px;">
              <span class="button" @click="saveGoal">저장</span>
            </span>
            <span class="buttonArea fR" style="margin-top: 17px; margin-right: 60px;">
              <span class="button" @click="allInput">일괄적용</span>
            </span>
            <span class="fR" style="font-family: KHNPHDRegular;font-size:12px;color:#fff;margin-top:17px; ">
              <select class="drop-down-unit" v-model="selectedUnit" @change="goalValue = ''">
                <option v-for="(item, idx) in unitList" :key="idx" :value="item">
                  {{item}}
                </option>
              </select>
            </span>
            <input style="margin-top:17px;" class="goal_textinput fR" type="text" maxlength="15" v-model="goalValue"/>
          </div>
        </div>
        <div ref="gridRef" class="EitemsGridArea2 scrollbar" style="padding:10px; height: 88%;">
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            class=ag-theme-alpine
            :headerHeight="40"
            :rowHeight="49"
            :columnDefs="columnDefs"
            :stopEditingWhenCellsLoseFocus="true"
            :rowData="dataTableList">
          </ag-grid-vue>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import log from '@/logger.js'
import { nc, comma, uncomma } from '@/utils/utils.js'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridVue } from 'ag-grid-vue3'

export default {
  components: {
    AgGridVue
  },
  setup () {
    const store = useStore()
    const selectGetSetting = computed(() => store.getters['goalSetting/getSelectGetSetting'])
    const updateGoal = computed(() => store.getters['goalSetting/getUpdateGoal'])

    const isThisYear = ref(true)
    const yearList = ref([])
    const selectedYear = ref(new Date().getFullYear())
    const goalValue = ref('')
    const unitList = ['kWh', '%']
    const selectedUnit = ref('kWh')
    const gridRef = ref(null)
    const dataTableList = ref([])
    const columnDefs = ref([
      { headerName: '월', field: 'month', width: 100, suppressMovable: true },
      { headerName: '전년도 목표치(kWh)', field: 'lastGoal', width: 100, suppressMovable: true },
      { headerName: '기준년도 사용량(kWh)', field: 'baseYear', width: 100, suppressMovable: true },
      { headerName: '적용중인 목표치(kWh)', field: 'goal', width: 100, suppressMovable: true },
      {
        headerName: '적용할 목표치(kWh)',
        field: 'toGoal',
        width: 100,
        suppressMovable: true,
        editable: true,
        singleClickEdit: true,
        cellEditorParams: {
          maxLength: 15
        }
      }
    ])

    const changeYear = async () => {
      try {
        if (selectedYear.value === new Date().getFullYear()) {
          isThisYear.value = true
          goalValue.value = ''
          selectedUnit.value = 'kWh'
        } else {
          isThisYear.value = false
        }

        await store.dispatch('goalSetting/fetchSelectGetSetting')
        if (selectGetSetting.value && selectGetSetting.value.length > 0) {
          const result = JSON.parse(JSON.stringify(selectGetSetting.value))
          if (result) {
            updateColumnData(result)
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const updateColumnData = (data) => {
      try {
        if (selectGetSetting.value && selectGetSetting.value.length > 0) {
          const selectedYearData = data.find(item => item.year === String(selectedYear.value))
          const prevYearData = data.find(item => item.year === String(selectedYear.value - 1))
          const baseData = data.find(item => item.year === 'base')
          const monthList = []
          const lastGoalList = []
          const baseYearList = []
          const goalList = []
          const gridData = ref([])
          for (let i = 1; i < 13; i++) {
            monthList.push(i + '월')
            let thisval = 0
            let baseVal = 0

            if (nc(selectedYearData[i + 'm'])) {
              thisval = selectedYearData[i + 'm']
            }
            if (nc(baseData[i + 'm'])) {
              baseVal = baseData[i + 'm']
            }

            lastGoalList.push(thisval)
            baseYearList.push(baseVal)

            if (prevYearData === null || prevYearData === undefined) {
              goalList.push(0)
            } else {
              if (prevYearData[i + 'm'] === null) {
                prevYearData[i + 'm'] = 0
              }
              goalList.push(prevYearData[i + 'm'])
            }
          }

          for (let i = 0; i < monthList.length; i++) {
            gridData.value.push({
              month: monthList[i],
              lastGoal: comma(goalList[i]),
              baseYear: comma(baseYearList[i]),
              goal: comma(lastGoalList[i])
            })
          }

          dataTableList.value = gridData.value
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const saveGoal = async () => {
      try {
        const confirmFlag = confirm('저장하시겠습니까?')
        if (confirmFlag) {
          if (!dataTableList.value.some(item => item.toGoal)) {
            alert('적용할 목표치를 입력해주세요')
            return
          }
          const hasInvalidToGoal = dataTableList.value.some(item => {
            if (typeof item.toGoal === 'undefined' || item.toGoal === '') {
              return false
            }
            const toGoalValue = parseFloat(item.toGoal)
            return isNaN(toGoalValue) || typeof toGoalValue !== 'number'
          })

          if (hasInvalidToGoal) {
            alert('적용할 목표치를 숫자 또는 실수로 입력해주세요')
            return
          }

          const param = {}
          for (let i = 0; i < 12; i++) {
            let goal = null
            if (dataTableList.value[i].toGoal !== '' && dataTableList.value[i].toGoal !== '0' && !isNaN(dataTableList.value[i].toGoal)) {
              goal = Number(dataTableList.value[i].toGoal)
            }
            param[`month${i + 1}`] = goal
          }

          await store.dispatch('goalSetting/fetchUpdateGoal', param)
          if (updateGoal.value && updateGoal.value.length !== 0) {
            const jsonData = JSON.parse(JSON.stringify(updateGoal.value))
            if (jsonData.message !== 'ok') {
              // console.log('action: fetchUpdateGoal', ' error message: ', jsonData.message)
              return
            }
          }
          alert('저장되었습니다.')
          changeYear()
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const allInput = () => {
      try {
        if (!goalValue.value) {
          alert('값을 입력해주세요')
          return
        }
        const gridData = ref([])
        if (selectedUnit.value === 'kWh') {
          if (!/^\d+(\.\d*)?$/.test(goalValue.value)) {
            alert('숫자 또는 실수를 입력해주세요')
          } else {
            for (let i = 0; i < 12; i++) {
              gridData.value.push({
                month: dataTableList.value[i].month,
                lastGoal: dataTableList.value[i].lastGoal,
                baseYear: dataTableList.value[i].baseYear,
                goal: dataTableList.value[i].goal,
                toGoal: goalValue.value
              })
            }
            dataTableList.value = gridData.value
          }
        } else if (selectedUnit.value === '%') {
          if (!/^\d+(\.\d*)?$/.test(goalValue.value) || parseFloat(goalValue.value) > 100) {
            alert('100 이하의 숫자 또는 실수를 입력해주세요')
          } else {
            const percent = (100 - goalValue.value) * 0.01
            for (let i = 0; i < 12; i++) {
              const goal = uncomma(dataTableList.value[i].goal)
              gridData.value.push({
                month: dataTableList.value[i].month,
                lastGoal: dataTableList.value[i].lastGoal,
                baseYear: dataTableList.value[i].baseYear,
                goal: dataTableList.value[i].goal,
                toGoal: (goal * percent).toFixed(2)
              })
            }
            dataTableList.value = gridData.value
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const getData = async () => {
      try {
        await store.dispatch('goalSetting/fetchSelectGetSetting')
        if (selectGetSetting.value && selectGetSetting.value.length > 0) {
          const result = JSON.parse(JSON.stringify(selectGetSetting.value))
          if (result) {
            makeYearCombo(result)
            updateColumnData(result)
          }
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const makeYearCombo = (data) => {
      const thisYear = new Date().getFullYear()
      yearList.value.push(thisYear)

      for (let i = 0; i < data.length; i++) {
        if (data[i].year !== 'base' && data[i].year !== thisYear.toString()) {
          yearList.value.push(data[i].year)
        }
      }
    }

    const adjustColumnWidth = () => {
      if (gridRef.value) {
        const minWidth = gridRef.value.clientWidth / 5.1
        columnDefs.value.forEach((colDef) => {
          colDef.minWidth = minWidth
        })
      }
    }

    let resizeObserver

    onMounted(() => {
      getData()
      // 브라우저 크기가 변경 될때 Column의 width 조절
      resizeObserver = new ResizeObserver(adjustColumnWidth)
      if (gridRef.value) {
        resizeObserver.observe(gridRef.value)
      }
    })

    onBeforeUnmount(() => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    })

    return {
      isThisYear,
      yearList,
      goalValue,
      selectedYear,
      unitList,
      selectedUnit,
      gridRef,
      dataTableList,
      columnDefs,
      changeYear,
      saveGoal,
      allInput
    }
  }
}
</script>

<style lang="scss">
@import '~@/style/layout.scss';
@import '~@/style/component/title.scss';

.goal-contents-body {
  height: 100%;
  width: 100%;
  margin-left: 15px;
}

.goal_textinput {
  height: 27px;
  width: 128px;
  display: inline-block;
  border: 1px solid #489cf2;
  background-color: #15284e;
  color: #fff;
  font-family: 'LAB디지털';
  font-size: 18px;
  letter-spacing: 3px;
  text-align: right;
  padding: 0 10px;
  border-radius: 3px;
}

.goal-divL {
  height: 94%;
  width: 100%;
}

.goal-div_grid{
  width: 100%;
  height: 93%;
  margin-top: 1%;
}

.goal-div_border{
	background-image: url("@/assets/img/box_bg_big2x.png");
	background-size: 100% 100%;
}

.goal-EitemsName {
  height: 50px;
  margin: 0 20px 0 20px;
}

.drop-down-year {
  color: white;
  background-color: #15284e;
  border-color: #489cf2;
  width: 120px;
  height: 30px;
  font-family: 'KHNPHDRegular';
  font-size: 13px;
  margin-left: 10px;
  border-radius: 4px;
}

.drop-down-unit {
  color: white;
  background-color: #15284e;
  border-color: #489cf2;
  width: 70px;
  height: 30px;
  font-family: 'KHNPHDRegular';
  font-size: 13px;
  margin-left: 10px;
  border-radius: 4px;
}

.ag-theme-alpine {
  --ag-foreground-color: white;
  --ag-background-color: rgb(234, 234, 234, / 0%);
  --ag-header-foreground-color: white;
  --ag-header-background-color: #15284e;
  --ag-header-column-resize-handle-color: white;
  --ag-row-border-color: #33a2ff;
  --ag-odd-row-background-color: rgb(0, 0, 0, 0.03);
  --ag-font-size: 16px;
  --ag-font-family: 'KHNPHDRegular';

  .ag-header-cell-label {
    justify-content: center;
  }

  .ag-row .ag-cell {
    text-align: center;
  }

  .ag-text-field-input {
    background-color: #15284e;
    text-align: center;
  }
}
</style>
