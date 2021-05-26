<template>
    <div class="bg-gray-100 rounded-md shadow" :class="{ 'border border-gray-500': border, 'bg-transparent': secondary }">
        <div
            v-if="image"
            class="cover"
            :style="{ backgroundImage: `url(${image})` }"
        ></div>
        <div class="p-4 border-b border-gray-300 flex justify-between" v-if="header">
            <div>
                <slot name="header" />
            </div>
            <Icon
                class="cursor-pointer"
                v-if="toggleable && !disableContent"
                :name="isClosed ? 'arrowDown' : 'arrowUp'"
                @click="isClosed = !isClosed"
            />
        </div>
        <div v-if="!disableContent" class="p-4" v-show="!(header && isClosed)">
            <slot name="default" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";

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
        }
    },
    components: {
        Icon,
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
