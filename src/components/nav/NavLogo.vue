<template>
    <div class="nav-logo" @click="$router.push('/')">
        <img
            class="nav-logo__image nav-logo__image--light"
            alt="logo"
            :src="`/img/logo/light.svg`"
        />
        <img
            class="nav-logo__image nav-logo__image--dark"
            alt="logo"
            :src="`/img/logo/dark.svg`"
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
    public get darkmode(): boolean {
        return document.body.classList.contains("darkmode");
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.nav-logo {
    --size: 50px;

    padding: var(--st-spacing) var(--st-spacing) 0 var(--st-spacing);
    cursor: pointer;

    &__image {
        max-height: var(--size);
        max-width: 100%;
        margin: 0;

        &--light {
            display: none;
        }
    }

    &__image--icon {
        display: none;
    }

    @include breakpoint("medium") {
        padding: var(--st-spacing);

        .nav-logo__image--icon {
            display: block;
            height: calc(var(--size) * 0.75);
        }

        .nav-logo__image {
            display: none !important;
        }
    }
}

body.darkmode .nav-logo__image {
    &--dark {
        display: none;
    }

    &--light {
        display: block;
    }
}
</style>
