<template>
  <div class="title_wrap">
    <span class="title">태그 정보</span>
    <div class="title_line"></div>
  </div>
  <div class="divL fL" style="margin-left: 16px;">
    <div class="div_search div_border">
      <div class="searchBox">
        <div class="searchTag1">
          <span class="searchLabel">시설명</span>
        </div>
        <div class="searchTag1">
          <select class="comboBox scrollbar" @input="chagneZone($event.target.value)">
            <option v-for="(dataName, idx) in zone" :key="idx" :value="dataName">
              {{ dataName }}
            </option>
          </select>
        </div>
      </div>
      <div class="searchBox">
        <div class="searchTag1">
          <span class="searchLabel">설비명</span>
        </div>
        <div class="searchTag1">
          <span>
            <input class="top_textinput" type="text" v-model="facValue" @keyup.enter="selectTagInfo"/>
          </span>
        </div>
      </div>
      <div class="searchBox">
        <div class="searchTag1">
          <span class="searchLabel">태그명</span>
        </div>
        <div class="searchTag1">
          <span>
            <input class="top_textinput" type="text" v-model="tagValue" @keyup.enter="selectTagInfo"/>
          </span>
        </div>
      </div>
      <div class="search_btn search_btn_font fL" style="margin-top:33px;" @click="selectTagInfo">조회</div>
    </div>
    <div class="div_grid div_border fL">
      <div class="EitemsName">
        <div @click="updateTag" class="save_btn search_btn_font fR"> 저장 </div>
      </div>
      <div ref="gridRef" class="EitemsGridArea2 scrollbar" style="padding:10px; height: 88%;">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          class="ag-theme-alpine"
          :headerHeight="40"
          :rowHeight="35"
          :columnDefs="columnDefs"
          :stopEditingWhenCellsLoseFocus="true"
          :rowData="dataTableList.value">
        </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridVue } from 'ag-grid-vue3'
import log from '@/logger.js'

export default {
  components: {
    AgGridVue
  },
  setup () {
    const store = useStore()
    const zoneDataList = computed(() => store.getters['setting/getZoneData'])
    const selectDataList = computed(() => store.getters['setting/getSelectData'])
    const updateTagInfo = computed(() => store.getters['setting/getUpdateTagInfo'])

    const zone = ref([])
    const gridRef = ref(null)
    const dataTableList = reactive([])
    const cellEditorValues = ref([])
    const columnDefs = ref([
      {
        headerName: '시설명',
        field: 'zone',
        width: 150,
        maxWidth: 400,
        suppressMovable: true,
        editable: true,
        singleClickEdit: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: cellEditorValues.value
        }
      },
      { headerName: '설비 코드', field: 'fac', width: 150, maxWidth: 400, suppressMovable: true },
      {
        headerName: '설비명',
        field: 'description',
        width: 150,
        maxWidth: 400,
        suppressMovable: true,
        editable: true,
        singleClickEdit: true,
        cellEditorParams: {
          maxLength: 40
        }
      },
      { headerName: '태그', field: 'tagname', width: 150, suppressMovable: true }
    ])
    const seletedZone = ref('')
    const facValue = ref('')
    const tagValue = ref('')

    const selectGetZone = async () => {
      let data = []
      await store.dispatch('setting/selectZone')
      if (zoneDataList.value) {
        data = JSON.parse(JSON.stringify(zoneDataList.value))
        cellEditorValues.value = data.map(list => list.ZONE_NAME)
        columnDefs.value.forEach((colDef) => {
          if (colDef.headerName === '시설명') {
            colDef.cellEditorParams.values = cellEditorValues.value
          }
        })
        data.unshift({ ZONE_NAME: '전체', ZONE_CODE: '' })
        zone.value = data.map(list => list.ZONE_NAME)
      }
    }

    const selectTagInfo = async () => {
      try {
        const param = {}

        param.zone = seletedZone.value
        param.fac = facValue.value
        param.tag = tagValue.value

        let data = []
        await store.dispatch('setting/selectTagList', param)

        if (selectDataList.value != null) {
          data = selectDataList.value
          dataTableList.value = data
        } else {
          dataTableList.value = []
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const chagneZone = (x) => {
      seletedZone.value = x
    }

    // 저장 버튼
    const updateTag = async () => {
      try {
        const confirmMessage = '저장 하시겠습니까?'
        if (confirm(confirmMessage)) {
          const param = {
            tagList: dataTableList.value
          }

          await store.dispatch('setting/updateTagInfo', param)
          if (updateTagInfo.value && updateTagInfo.value.length !== 0) {
            const jsonData = JSON.parse(JSON.stringify(updateTagInfo.value))
            if (jsonData.message !== 'ok') {
              // console.log('action: updateTagInfo', ' error message: ', jsonData.message)
              return
            }
          }
          alert('저장되었습니다.')
        }
      } catch (err) {
        log.logError(err.message);
      }
    }

    const adjustColumnWidth = () => {
      if (gridRef.value) {
        const minWidth = gridRef.value.clientWidth / 3
        columnDefs.value.forEach((colDef) => {
          colDef.minWidth = minWidth
        })
      }
    }

    let resizeObserver

    // 처음 page load 될 때
    onMounted(() => {
      selectGetZone()
      selectTagInfo()
      // 브라우저 크기 변경 시 Column의 width 조절
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
      zone,
      facValue,
      tagValue,
      gridRef,
      dataTableList,
      columnDefs,
      selectGetZone,
      selectTagInfo,
      chagneZone,
      updateTag
    }
  }
}
</script>

<style lang="scss">
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';

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

  .ag-cell-inline-editing {
    background-color: #15284e;
  }

  .ag-popup-child {
    background-color: #15284e;
  }
}

.div_grid {
  width: 100%;
  height: 84%;
  margin-top: 1%;
}

.div_border {
  background-image: url("@/assets/img/box_bg_big2x.png");
  background-size: 100% 100%;
}

.div_search {
  width: 100%;
  height: 12%;
  display: flex;
}

.searchLabel {
  font-family: KHNPHDRegular;
  text-align: center;
  font-size: 14px;
  letter-spacing: 4px;
  color: white;
}

.searchBox {
  display: flex;
  width: 15%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  margin-left: 51px;
}

.searchTag1 {
  height: 36%;
  width: 100%;
}

.top_textinput {
  height: 85%;
  width: 91%;
  display: inline-block;
  border: 1px solid #489cf2;
  background-color: #15284e;
  color: #fff;
  font-family: 'KHNPHDRegular';
  text-align: center;
  font-size: 20px;
  letter-spacing: 4px;
  border-radius: 5px;
}

.comboBox {
  color: white;
  background-color: #15284e;
  border-color: #489cf2;
  height: 95%;
  width: 91%;
  font-size: 16px;
  font-family: 'KHNPHDRegular';
  border-radius: 4px;
}

.search_btn_font {
  text-shadow: 0 0 9px #5cafff;
  font-size: 17px;
  letter-spacing: normal;
  color: #fff;
  font-family: 'KHNPHDRegular';
  text-align: center;
  line-height: 2;
}

.search_btn {
  width: 110px;
  height: 32px;
  align-self: center;
  border: solid 1px #b4dffa;
  background-color: rgba(139, 194, 240, 0.25);
  cursor: pointer;
  border-radius: 4px;
  margin-left: 17px;
  margin-top: 31px;
}

.divL {
  height: 94%;
  width: 100%;
}

.save_btn {
  width: 110px;
  height: 32px;
  align-self: center;
  border: solid 1px #b4dffa;
  background-color: rgba(139, 194, 240, 0.25);
  cursor: pointer;
  border-radius: 4px;
  margin-top: 7px;
}
</style>
