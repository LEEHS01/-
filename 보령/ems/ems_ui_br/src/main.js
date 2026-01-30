import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import '@/style/common.scss'

// createApp(App).use(store).use(router).mount('#app')
// [ 앱 생성 실시 ]
const app = createApp(App);

// [ 앱 글로벌 변수 선언 실시 ]
app.config.globalProperties.$store = store

// [ router 사용 설정 ]
app.use(router);

app.use(store);

app.mount('#app');