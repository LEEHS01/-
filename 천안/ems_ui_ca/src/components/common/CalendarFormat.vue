<template>
<div>
  <VueDatePicker
    v-model="year"
    year-picker
    auto-apply
    hide-input-icon
    locale="ko"
    :format="format"
    :clearable="false" 
    @update:model-value="updateSelectedDate" 
    @closed="sendSelectedDate"
    v-if= "calendarMode === 'y'"
  />
  <VueDatePicker
    v-model="month"
    month-picker
    auto-apply
    hide-input-icon
    locale="ko"
    :format="format"
    :clearable="false"
    @update:model-value="updateSelectedDate" 
    @closed="sendSelectedDate"
    v-else-if="calendarMode === 'm'"
  />
  <VueDatePicker
    v-model="date"
    auto-apply
    hide-input-icon
    locale="ko"
    :format="format"
    :clearable="false"
    :enable-time-picker="false"
    @update:model-value="updateSelectedDate" 
    @closed="sendSelectedDate"
    v-else-if="calendarMode === 'd'"
  />
  <VueDatePicker
    v-model="date"
    auto-apply
    hide-input-icon
    locale="ko"
    :format="format"
    :clearable="false"
    @update:model-value="updateSelectedDate" 
    @closed="sendSelectedDate"
    v-else
  />
</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { setTwoWord } from '@/utils/utils.js';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: {
    VueDatePicker
  },

  props: {
    calendarMode: String,
  },

  emits: ['changeDate'],

  setup (props, { emit }) {
    const date = ref(new Date());
    const month = ref({
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });
    const year = ref(new Date().getFullYear());
    
    let prevCalMode = 'h'; 
    const format = (selectedDate) => {
      if (props.calendarMode != prevCalMode) {
        date.value = new Date();
        month.value.month = new Date().getMonth();
        month.value.year = new Date().getFullYear();
        year.value = new Date().getFullYear();
        selectedDate = new Date();
        prevCalMode = props.calendarMode;
      }

      const selectedDay = selectedDate.getDate();
      const selectedMonth = selectedDate.getMonth() + 1;
      const selectedYear = selectedDate.getFullYear();

      if (props.calendarMode === 'h' || props.calendarMode === 'd') {
        return `${selectedYear}-${setTwoWord(selectedMonth)}-${setTwoWord(selectedDay)}`;
      } else if (props.calendarMode === 'm') {
        return `${selectedYear}-${setTwoWord(selectedMonth)}`;
      } else {
        return `${selectedYear}`;
      }
    }

    let sendDate = null;
    const updateSelectedDate = (selectedDate) => {
      sendDate = new Date();
      if (props.calendarMode === 'y') {
        sendDate.setFullYear(selectedDate);
      } else if (props.calendarMode === 'm') {
        sendDate.setFullYear(selectedDate.year);
        sendDate.setMonth(selectedDate.month);
      }
      else {
        sendDate = selectedDate;
      }

      // console.log('JJJ> updateSelectedDate!!', sendDate)
    }

    const sendSelectedDate = () => {
      // console.log('JJJ> sendSelectedDate!!', sendDate)
      if (sendDate !== null) {
        emit('changeDate', sendDate);
        sendDate = null;
      }
    }

    onMounted(() => {
      // console.log('JJJ> ', props.calendarMode);
    })

    return {
      date,
      month,
      year,
      format,
      updateSelectedDate,
      sendSelectedDate
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/layout.scss';

.dp__theme_light {
    --dp-background-color: #15284e;
    --dp-text-color: #ffffff;
    --dp-border-color: #489cf2;
    --dp-font-family: KHNPHDRegular;
    --dp-font-size: 14px
    --dp-input-icon-padding: 30px;
    --dp-input-padding: 6px 10px 6px 20px;
}
</style>