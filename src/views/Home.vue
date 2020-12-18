<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <!-- <hello-world msg="Welcome to Your Vue.js + TypeScript App"/> -->
    </div>
</template>

<script lang="ts">
import { key } from '@/store'
import { useStore } from 'vuex'

export default class Home {
    public user: User | null = null;

    async mounted() {
        this.user = useStore(key).state.currentUser;
        
        console.log(this.user);
    }
}

// export default {
//     name: 'HelloWorld',
//     components: {
//     },
//     data() {
//         return {
//             session: ''
//         }
//     },
//     props: {
//         msg: String,
//     },
//     setup() {
//         return {
//         }
//     },
//     mounted() {
//         const store = useStore(key);
//         this.session = store.state.currentUser;
//     },
// }
</script>