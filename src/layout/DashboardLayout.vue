<template>
    <nav class="nav">
        <div class="nav__wrapper">
            <router-link class="nav__item" to="/dashboard">Dashboard</router-link>
            <router-link class="nav__item" to="/users">Users</router-link>
            <router-link class="nav__item" to="/song">Songs</router-link>
            <settings class="nav__item nav__options"></settings>
        </div>
    </nav>
    <div id="wrapper">
        <router-view/>
    </div>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Settings from '@/components/Options.vue';

@Options({
    components: {
        Settings,
    }
})
export default class DashboardLayout extends Vue {

}
</script>
<style lang="scss">
.nav {
    background-color: white;
    border-bottom: 1px solid var(--border-color);
    padding: var(--spacing);

    display: flex;
    justify-content: center;

    &__wrapper {
        max-width: 1000px;
        width: 100%;

        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    &__item {
        color: var(--text-color);
        margin-left: var(--spacing);
        text-decoration: none;
        font-weight: bold;

        &.router-link-exact-active {
            color: var(--primary-color);
        }
    }
}
</style>