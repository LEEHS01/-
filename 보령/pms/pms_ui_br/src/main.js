import { createApp } from 'vue';
import App from './App.vue';
import { Quasar } from 'quasar';
import router from './router';
import store from './store';
import quasarUserOptions from './quasar-user-options';

import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import {
    CanvasRenderer
  } from 'echarts/renderers'
  import {
    BarChart,
    PieChart
  } from 'echarts/charts'
  import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent
  } from 'echarts/components'
  
  use([
    CanvasRenderer,
    BarChart,
    PieChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
  ])

import '@/styles/common.scss';

createApp(App)
    .use(Quasar, quasarUserOptions)
    .use(store)
    .use(router)
    .component('v-chart', ECharts)
    .mount('#app');
