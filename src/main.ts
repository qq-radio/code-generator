import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import App from './App.vue'
import router from './router'
import stores from './stores'

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(Antd)
app.component('v-select', VueSelect)

app.mount('#app')
