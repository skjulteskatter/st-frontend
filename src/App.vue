<template>
    <div>
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import DashboardLayout from '@/layout/DashboardLayout.vue';

@Options({
    components: {
        DashboardLayout,
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
:root {
    // Colors
    --primary-color: #0073ff;
    --border-color: #d0d0d0;
    --text-color: #2c3e50;
    --background-color: #ffffff;

    // Misc
    --border-radius: 5px;
    --spacing: 1rem;
}

*,
*:before,
*:after {
    box-sizing: border-box;
    outline-color: var(--primary-color);
}

body {
    margin: 0;
    background-color: #fafafa;
}

#app {
    font-family: Lato, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--text-color);
}

.hover {
    transition: transform .2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 10px -5px rgba(black, 0.1);
    }
}
</style>
