<template>
    <div>{{ player.displayName }}</div>
    <ul v-for="subscription in player.subscriptions" :key="subscription.id">
        <li>{{ subscription.collection.key }}</li>
    </ul>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({})
export default class PlayerDetails extends Vue {
    public player: User | null = null

    public async mounted () {
        console.log()
    }
}

</script>
