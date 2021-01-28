<template>
	<base-card class="song-list__item-row" @click="$emit('onClick')"></base-card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import BaseCard from '@/components/BaseCard.vue'

@Options({
	props: {
	},
	components: {
		BaseCard
	}
})
export default class SongListItemRow extends Vue {
	
}
</script>

<style lang="scss" scoped>

</style>