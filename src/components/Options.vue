<template>
    <div id="options">
        <button @click="logout()" secondary>Log out</button>
    </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import firebase from "@/services/firebase";

export default class Options extends Vue {
    logout() {
        firebase.signOut();
        window.location.replace("/login");
    }
}
</script>

<style lang="scss" scoped>
</style>