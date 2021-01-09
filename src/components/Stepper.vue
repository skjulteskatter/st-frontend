<template>
    <div class="stepper">
        <ul class="stepper__breadcrumb">
            <li class="stepper__breadcrumb__item" v-for="step in steps" :key="step.id" @click="callback(step.type)">
                {{ step.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        steps: {
            type: Array,
            default: []
        },
        callback: {
            type: Function,
            default: (() => null)
        }
    }
})
export default class Stepper extends Vue {
    public steps?: Step[];
}
</script>

<style lang="scss" scoped>
.stepper {
    &__breadcrumb {
        height: var(--spacing);
        padding: 0;
        opacity: .7;

        &__item {
            display: inline-block;
            margin-right: .5em;
            padding: 0;
            cursor: pointer;

            &:not(:last-child):after {
                content: '>';
                padding-left: .5em;
            }
        }
    }
}
</style>