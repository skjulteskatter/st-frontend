<template>
    <div id="options">
        <button @click="logout()">Log out</button>
    </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import firebase from "firebase";

export default class Options extends Vue {
    logout() {
        firebase.auth().signOut();
        window.location.replace("/");
    }
}
</script>

<style lang="scss" scoped>
</style>