<template>
    <div class="nav-logo" @click="$router.push('/')">
        <img
            class="nav-logo__image"
            alt="logo"
            :src="`/img/logo/${logoStyle}.svg`"
        />
        <img
            src="/img/logo/icon.svg"
            alt="logo"
            class="nav-logo__image--icon"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "nav-logo",
})
export default class NavLogo extends Vue {
    public get logoStyle() {
        return document.body.classList.contains("darkmode") ? "light" : "dark";
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.nav-logo {
    --size: 50px;

    padding: var(--st-spacing);
    padding-bottom: 0;
    cursor: pointer;

    &__image {
        max-height: var(--size);
        max-width: 100%;
        margin: 0;
    }

    &__image--icon {
        display: none;
    }

    @include breakpoint("medium") {
        .nav-logo__image--icon {
            display: block;
            height: calc(var(--size) * 0.75);
        }

        .nav-logo__image {
            display: none;
        }
    }
}
</style>