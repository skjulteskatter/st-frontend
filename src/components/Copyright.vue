<template>
    <div class="flex-1 w-full text-sm text-center mb-6">© {{new Date().getFullYear()}} {{ $t('copyright.title')}} | All rights reserved.</div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "copyright",
})
export default class Copyright extends Vue {
    
}
</script>
