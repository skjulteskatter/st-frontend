<template>
    <div class="relative z-10">
        <div class="cursor-pointer" @click="openDropdown">
            <button class="bg-white p-2 rounded border border-gray-300 flex items-center gap-2" v-if="label">
                <span>{{ label }}</span>
                <icon
                    :name="icon"
                    size="18"
                    v-if="icon"
                />
                <icon v-else name="arrowDown" size="18" />
            </button>
            <slot name="button" v-else></slot>
        </div>
        <base-card v-if="show" :class="`absolute top-11 ${origin == 'left' ? 'left-0 right-auto' : 'right-0 left-auto'}`">
            <slot name="default"></slot>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "base-dropdown",
    props: {
        label: {
            type: String,
        },
        icon: {
            type: String,
        },
        origin: {
            type: String,
        },
    },
})
export default class BaseDropdown extends Vue {
    public label = "";
    public icon = "";
    public origin = "left";
    public show = false;

    public close(e: Event) {
        if (!this.$el.contains(e.target)) {
            this.show = false;
        }
    }

    public mounted() {
        document.addEventListener("click", this.close);
    }

    public beforeDestroy() {
        document.removeEventListener("click", this.close);
    }

    public openDropdown() {
        this.show = !this.show;
    }
}
</script>
