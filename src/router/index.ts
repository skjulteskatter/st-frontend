import VueRouter, { RouteConfig } from "vue-router";
import PlayerDetails from '@/components/PlayerDetails.vue'

const routes: RouteConfig[] = [
    {
        path: 'player',
        component: PlayerDetails
    }
]


new VueRouter({
    routes,
})

export default routes;