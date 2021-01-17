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
// Variables
:root {
    --primary-color: #5372e2;
    --border-color: #393d42;
    --text-color: #F5F7FA;
    --background-color: #2C2F33;
    --secondary-background-color: #232527;

    --border-radius: 5px;
    --spacing: 1rem;
}

// Animations
@keyframes slideInFromBottom {
  from {
    transform: translateY(.5em);
    opacity: 0;
  }
  to {
    tranform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

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

.hover {
    transition: transform .2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 10px -5px rgba(black, 0.1);
    }
}
</style>
