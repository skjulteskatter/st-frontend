<template>
	<BaseCard>
		<template #header>
			<div class="flex justify-between items-baseline">
				<SearchInput v-model="email" @search="lookupEmail" />
			</div>
			<div v-if="user">
				{{ user }}
			</div>
		</template>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { SearchInput } from "@/components/inputs";
import api from "@/services/api";
import { IUser } from "songtreasures";

type Response = {
	userId: {
		[key: string]: string;
	};
	stripeStatus: string[];
	firebaseStatus: string[];
	user: IUser;
}

export default defineComponent({
    name: "email-lookup",
    components: {
		SearchInput,
	},
	data: () => ({
		user: {} as Response,
		email: "",
	}),
	methods: {
		async lookupEmail() {
			this.user = await api.admin.emailLookup(this.email);
		},
	},
});
</script>
