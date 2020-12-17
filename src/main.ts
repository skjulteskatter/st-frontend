import Vue, { createApp } from 'vue';
import VueRouter from "vue-router";
import App from './App.vue';
import store from './store';

import routes from "./router";

const Router = new VueRouter({
    routes
});

createApp(App)
.use(Router)
.use(store)
.mount('#app');
