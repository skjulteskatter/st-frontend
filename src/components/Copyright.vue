<template>
    <div :class="{ 'hidden': hide }" class="w-full mb-4 text-center">
        <small class="text-gray-500">Copyright {{new Date().getFullYear()}} © {{ $t('copyright_title')}}. All Rights Reserved</small>
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

    public get hide() {
        return this.store.getters.collection?.loading;
    }
}
</script>
