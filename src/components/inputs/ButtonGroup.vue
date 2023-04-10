<template>
    <div class="rounded-md border border-black/20 flex overflow-hidden dark:border-white/20" v-if="Buttons.length">
        <button
            v-for="(button, i) in Buttons"
            :key="button.label"
            class="p-2 bg-white border-black/10 dark:bg-secondary dark:border-white/10"
            :class="{
                'border-l': i > 0,
                'bg-primary dark:bg-primary text-white': button.selected(),
                'hover:bg-gray-100 dark:hover:bg-secondary dark:hover:brightness-110': !button.selected(),
                'bg-gray-200 cursor-wait': loading[button.value],
            }"
            @click="action ? clickButton(button.value) : undefined"
        >
            {{ button.label }}
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

type Button = {
    label: string;
    value: string;
    selected: () => boolean;
}

type Loading = {
    [key: string]: boolean;
}

export default defineComponent({
    name: "button-group",
    props: {
        buttons: {
            type: Array as PropType<Button[]>,
        },
        action: {
            type: Function,
        },
    },
    data: () => ({
        loading: {} as Loading,
    }),
    computed: {
        Buttons() {
            return this.buttons ?? [];
        },
    },
    methods: {
        async clickButton(value: string) {
            if (this.action) {
                this.loading[value] = true;
                await this.action(value);
                this.loading[value] = false;
            }
        },
    },
});
</script>
