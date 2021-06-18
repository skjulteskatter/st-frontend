<template>
    <div :style="view ? '' : 'display: none'" class="flex-1 w-full bottom-0 text-sm text-center sticky p-6">
        <span class="bg-white rounded-lg p-2">© {{new Date().getFullYear()}} {{ $t('copyright.title')}} | All rights reserved.</span>
    </div>
</template>
<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "copyright",
})
export default class Copyright extends Vue {
    private store = useStore();

    public get view() {
        return !this.store.getters.collection?.loading;
    }
}
</script>
