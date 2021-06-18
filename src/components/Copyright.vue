<template>
    <div :class="{ 'hidden': hide }" class="w-full bottom-0 md:bottom-4 text-center sticky flex md:justify-center">
        <div class="bg-white rounded-lg p-2 text-sm shadow-md">
            <span>© {{new Date().getFullYear()}} {{ $t('copyright.title')}} | All rights reserved.</span>
        </div>
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
