<template>
    <div>
        <input @change="setFiles" ref="file-selector" type="file" multiple="true" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "file-selector",
    emits: [
        "files",
    ],
    data() {
        return {
            files: null as FileList | null,
        };
    },
    methods: {
        setFiles(e: Event | null) {
            if (e) {
                const target = e.target as HTMLInputElement;
                this.files = target.files;
            } else {
                this.files = null;
            }
            this.$emit("files", this.files);
        },
    },
});
</script>
