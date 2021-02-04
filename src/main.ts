import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n';
import router from './router';
import { sessionStore, sessionKey, usersStore, usersKey, songStore, songKey, stripeKey, stripeStore } from './store';
import './style/chordpro.less';


createApp(App)
    .use(sessionStore, sessionKey)
    .use(usersStore, usersKey)
    .use(songStore, songKey)
    .use(stripeStore, stripeKey)
    .use(router)
    .use(i18n)
    .mount('#app')
