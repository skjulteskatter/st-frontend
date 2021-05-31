<template>
    <div class="bg-white rounded-md shadow-md dark:bg-secondary" :class="{ 'border border-gray-300': border, 'bg-transparent': secondary }">
        <div
            v-if="image"
            class="cover"
            :style="{ backgroundImage: `url(${image})` }"
        ></div>
        <div class="p-4 border-b border-gray-300 flex justify-between" v-if="header">
            <div>
                <slot name="header" />
            </div>
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
        },
        image: {
            type: String,
        },
        header: {
            type: Boolean,
        },
        toggleable: {
            type: Boolean,
        },
        closed: {
            type: Boolean,
        },
        disableContent: {
            type: Boolean,
        },
        secondary: {
            type: Boolean,
        },
    },
    name: "base-card",
})
export default class Card extends Vue {
    public border = false;
    public header = false;
    public image = "";
    public toggleable = false;
    public closed = false;
    public disableContent = false;
    private isClosed = this.closed;
    public secondary = false;
}
</script>

<style lang="scss">
.card {
    animation: slideInFromBottom 0.3s ease;
}
</style>
