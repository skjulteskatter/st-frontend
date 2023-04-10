<template>
    <table>
        <thead>
            <tr>
                <th v-for="(header, i) in headers" :key="i">
                    {{header.name}}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, i) in items" :key="i">
                <td v-for="(header, i) in headers" :key="i">
                    {{header.selector(item)}}
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

type Header = {
    name: string;
    selector: (i: unknown) => string;
}

export default defineComponent({
    name: "base-table",
    props: {
        title: {
            type: String,
        },
        headers: {
            type: Array as PropType<Header[]>,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
    },
});
</script>
