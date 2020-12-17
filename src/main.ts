import { createApp } from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import { store } from './store'

createApp(App)
    .use(store)
    .mount('#app')
