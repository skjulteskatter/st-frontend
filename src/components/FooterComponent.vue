<template>
    <footer id="footer">
        <div class="container">
            <small>Copyright 2021 © Stiftelsen Skjulte Skatters Forlag</small>
        </div>
    </footer>
</template>

<script>
import { Vue } from "vue-class-component";

export default class FooterComponent extends Vue {
    
}
</script>

<style lang="scss">
#footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;

    background: var(--secondary-background-color);
    border-top: 1px solid var(--border-color);
    padding: var(--spacing);
}
</style>