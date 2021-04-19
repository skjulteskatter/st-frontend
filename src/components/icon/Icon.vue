<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        :width="size"
        :height="size"
        stroke="currentColor"
        class="icon"
        v-if="name"
    >
        <g v-if="icons[name].paths">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                v-for="p in paths"
                :key="p"
                :d="p"
            />
        </g>
        <path
            v-else-if="icons[name].path"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="icons[name].path"
        />
    </svg>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import icons from "./icons";

@Options({
    name: "icon",
    props: {
        name: {
            type: String,
        },
        size: {
            type: String,
        },
    },
})
export default class Icon extends Vue {
    public icons = icons;
    public name = "";
    public size = "24";

    public get paths() {
        return this.icons[this.name].paths ?? [];
    }
}
</script>

<style lang="scss" >
.icon {
    display: inline;
    flex: none;
}
</style>
