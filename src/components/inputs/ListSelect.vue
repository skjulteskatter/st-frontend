<template>
    <div class="flex">
        <slot></slot>
        <div v-if="multiSelect">
            <div class="form-check" v-for="row in data" :key="row.value">
                <input
                    class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox" :id="row.value"
                    :checked="row.checked"
                    @input="$emit('select', row, ($event.target as HTMLInputElement).checked)"
                >
                <label class="form-check-label inline-block text-gray-800" :for="row.value">
                    {{row.display}}
                </label>
            </div>
        </div>
        <div v-else>
            <div class="" v-for="row in data" :key="row.value">
                {{row.display}}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
type Row = {
    display: string;
    value: string;
    checked?: boolean;
}
defineEmits<{
    (event: "select", row: Row, checked: boolean): void,
}>();
defineProps<{
    data: Row[],
    multiSelect?: boolean,
}>();
</script>
