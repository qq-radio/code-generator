import { createApp } from 'vue'
import Antd from 'ant-design-vue'

import App from './App.vue'
import router from './router'
import stores from './stores'

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(Antd)

app.mount('#app')
