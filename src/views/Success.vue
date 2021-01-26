<template>
    <div>
        <h1>Success. Your purchase should be available soon.</h1>
    </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";


export default class Success extends Vue {
    public mounted() {
        setTimeout(() => this.$router.push('/dashboard'), 5000);
    }
}
</script>