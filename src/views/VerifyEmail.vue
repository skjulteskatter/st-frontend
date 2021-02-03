<template>
    <div class="not-found">
        <div class="not-found__content">
            <h1 class="not-found__title">A verification link has been sent to your email.</h1>
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
        color: var(--st-primary-color);
    }
}
</style>