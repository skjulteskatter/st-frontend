import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { sessionStore, sessionKey, usersStore, usersKey, songStore, songKey } from './store'

import './style/chordpro.less';

createApp(App)
    .use(sessionStore, sessionKey)
    .use(usersStore, usersKey)
    .use(songStore, songKey)
    .use(router)
    .mount('#app')
