<template>
    <transition-root
        :show="show"
        enter="transition-opacity duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
    >
        <div
            class="p-2 rounded bg-white shadow-md max-w-sm relative flex gap-4 border border-l-4 dark:text-gray-800"
            :class="{ 'border-green-700': type == 'success', 'border-red-700': type == 'error', 'border-primary': type == 'primary' }" 
            v-if="show"
            @click="callback ? callback() : undefined"
        >
            <icon v-if="icon" :name="icon" size="18" />
            <div class="flex-grow text-xs">
                <strong class="block">{{ title }} </strong>
                <span v-if="body" style="">{{ body }}</span>
            </div>
            <icon
                name="error"
                class="float-right"
                size="18"
                @click="remove()"
            />
        </div>
    </transition-root>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { notifications } from "@/services/notifications";
import { TransitionRoot } from "@headlessui/vue";

@Options({
    name: "notification",
    props: {
        id: {
            type: String,
        },
        type: {
            type: String,
        },
        title: {
            type: [String, Number],
        },
        body: {
            type: String,
        },
        icon: {
            type: String,
        },
        persist: {
            type: Boolean,
        },
        callback: {
            type: Function,
        },
        timeout: {
            type: Number,
            default: 5000,
        },
    },
    components: {
        TransitionRoot,
    },
})
export default class Notification extends Vue {
    public id = "";
    public type?: string;
    public icon?: string;
    public title?: string | number;
    public body?: string;
    public timeout?: number;
    public callback?: Function;
    
    public persist?: boolean;

    public show = true;

    public mounted() {
        if (!this.persist) {
            setTimeout(() => (this.show = false), this.timeout ?? 5000);
        }
    }

    public get typeClass() {
        if (!this.type) return "";
        return `notification--${this.type}`;
    }

    public async remove() {
        await notifications.remove(this.id);
        this.show = false;
    }
}
</script>
