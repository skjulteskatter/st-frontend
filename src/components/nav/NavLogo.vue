<template>
    <div class="nav-logo" @click="$router.push('/')">
        <img
            class="nav-logo__image"
            alt="logo"
            src="/img/SongTreasures_logo.svg"
        />
        <img
            src="/img/SongTreasures_logo_icon.svg"
            alt="logo"
            class="nav-logo__image--icon"
        />
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class NavLogo extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.nav-logo {
    --size: 40px;

    padding: var(--st-spacing);
    cursor: pointer;

    &__image {
        max-height: var(--size);
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