<template>
    <div class="not-found">
        <div class="not-found__content">
            <h1 class="not-found__title">Sorry, this page does not exist.</h1>
            <router-link class="not-found__link" to="/"
                >Go to dashboard</router-link
            >
        </div>
    </div>
</template>

<style lang="scss" scoped>
.not-found {
    width: 100%;
    height: 100vh;
    text-align: center;
    padding: var(--st-spacing);

    display: flex;
    align-items: center;
    justify-content: center;

    &__link {
        color: var(--st-color-primary);
    }
}
</style>