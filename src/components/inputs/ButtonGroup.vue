<template>
    <div class="rounded-md border border-gray-300 flex overflow-hidden dark:border-gray-500" v-if="Buttons.length">
        <button
            v-for="(button, i) in Buttons"
            :key="button.label"
            class="p-2 bg-white border-gray-300 dark:bg-secondary dark:border-gray-500"
            :class="{ 
                'border-l': i > 0, 
                'bg-primary dark:bg-primary text-white': button.selected, 
                'hover:bg-gray-100': !button.selected, 
                'bg-gray-200 cursor-wait': loading[button.value],
            }"
            @click="action ? clickButton(button.value) : undefined"
        >
            {{ button.label }}
        </button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "button-group",
    props: {
        buttons: {
            type: Array,
        },
        action: {
            type: Function,
        },
    },
})
export default class ButtonGroup extends Vue {
    public buttons?: {
        label: string;
        value: string;
        selected: boolean;
    }[];
    public action?: Function;

    public loading: {
        [value: string]: boolean;
    } = {};

    public async clickButton(value: string) {
        if (this.action) {
            this.loading[value] = true;
            await this.action(value);
            this.loading[value] = false;
        }
    }

    public get Buttons() {
        return this.buttons ?? [];
    }
}
</script>
