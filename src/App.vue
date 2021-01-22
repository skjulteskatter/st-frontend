<template>
    <div>
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import DashboardLayout from '@/layout/DashboardLayout.vue';
import Card from '@/components/Card.vue';

@Options({
    components: {
        DashboardLayout,
        Card,
    }
})
export default class App extends Vue {
    public onLyrics = false;

    public mounted() {
        this.onLyrics = this.$route.name == "lyrics";
    }
}
</script>

<style lang="scss">
@import '@/style/main';

*,
*:before,
*:after {
    box-sizing: border-box;
    outline-color: var(--primary-color);
}

body {
    margin: 0;
    background-color: var(--secondary-background-color);
}

#app {
    font-family: Lato, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--text-color);
}
</style>
