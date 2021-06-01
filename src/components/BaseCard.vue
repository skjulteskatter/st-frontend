<template>
    <div class="bg-white rounded-md shadow-md dark:bg-secondary" :class="{ 'border border-gray-300': border, 'bg-transparent': secondary }">
        <div
            v-if="image"
            class="cover"
            :style="{ backgroundImage: `url(${image})` }"
        ></div>
        <div class="p-4 border-b border-gray-300 flex justify-between" v-if="header">
            <slot name="header" />
            <icon
                class="cursor-pointer"
                v-if="toggleable && !disableContent"
                :name="isClosed ? 'arrowDown' : 'arrowUp'"
                @click="isClosed = !isClosed"
            />
        </div>
        <div v-if="!disableContent" class="p-4 h-full" v-show="!(header && isClosed)">
            <slot name="default" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        border: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
            default: "",
        },
        header: {
            type: Boolean,
            default: false,
        },
        toggleable: {
            type: Boolean,
            default: false,
        },
        closed: {
            type: Boolean,
            default: false,
        },
        disableContent: {
            type: Boolean,
            default: false,
        },
        secondary: {
            type: Boolean,
            default: false,
        },
    },
    name: "base-card",
})
export default class Card extends Vue {
    public border?: boolean;
    public header?: boolean;
    public image?: string;
    public toggleable?: boolean;
    public closed?: boolean;
    public disableContent?: boolean;
    public secondary?: boolean;

    public get isClosed() {
        return this.closed == true;
    }
}
</script>

<style lang="scss">
.card {
    animation: slideInFromBottom 0.3s ease;
}
</style>
