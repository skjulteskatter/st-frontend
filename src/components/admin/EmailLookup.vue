<template>
	<BaseCard>
		<template #header>
			<div class="flex justify-between items-baseline">
				<h3 class="font-bold">Email lookup</h3>
				<SearchInput v-model="email" @search="lookupEmail" />
			</div>
		</template>
		<Loader :loading="loading" position="local">
			<div v-if="response.user" class="grid md:grid-cols-2 gap-4">
				<div class="rounded-md p-4 flex flex-col gap-4">
					<img :src="response.user.image" class="rounded h-24 w-24 object-cover" />
					<div v-if="response.userId">
						<small>UserID</small>
						<p>Firebase: {{ response.userId["firebase"] }}</p>
						<p>Stripe: {{ response.userId["stripe"] }}</p>
					</div>
					<div>
						<small class="opacity-50">Name</small>
						<p>{{ response.user.displayName }}</p>
					</div>
					<div>
						<small class="opacity-50">Accepted Policies</small>
						<span class="flex gap-2 items-center">
							<CheckCircleIcon class="w-4 h-4 opacity-50 text-green-700" v-if="response.user.privacyPolicy" />
							<XCircleIcon class="w-4 h-4 opacity-50 text-red-700" v-else />
							Privacy Policy
						</span>
						<span class="flex gap-2 items-center">
							<CheckCircleIcon class="w-4 h-4 opacity-50 text-green-700" v-if="response.user.termsAndConditions" />
							<XCircleIcon class="w-4 h-4 opacity-50 text-red-700" v-else />
							Terms of Service
						</span>
					</div>
					<div>
						<small class="opacity-50">User Settings</small>
						<table class="table">
							<tbody>
								<tr v-for="[key, value] in Object.entries(response.user.settings)" :key="key" class="table-row">
									<td class="px-2 table-column">{{key}}</td>
									<td class="px-2 table-column">{{value}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="flex gap-4 flex-col">
					<div
						class="p-4 rounded-md border"
						:class="[response.stripeStatus[0].toLowerCase().match(/^no/) ? 'bg-red-500/5 border-red-500 text-red-700' : 'bg-green-500/5 border-green-500 text-green-700']"
					>
						<small class="opacity-50">Stripe</small>
						<p>{{ response.stripeStatus[0] }}</p>
					</div>
					<div
						class="p-4 rounded-md border"
						:class="[response.firebaseStatus[0].toLowerCase().match(/^no/) ? 'bg-red-500/5 border-red-500 text-red-700' : 'bg-green-500/5 border-green-500 text-green-700']"
					>
						<small class="opacity-50">Firebase</small>
						<p>{{ response.firebaseStatus[0] }}</p>
					</div>
				</div>
			</div>
			<p v-else class="opacity-50 p-4 text-center">No users to show</p>
		</Loader>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { SearchInput } from "@/components/inputs";
import api from "@/services/api";
import { IUser } from "songtreasures";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/solid";

type EmailLookupResponse = {
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
		CheckCircleIcon,
		XCircleIcon,
	},
	data: () => ({
		response: {} as EmailLookupResponse,
		email: "",
		loading: false,
	}),
	methods: {
		async lookupEmail() {
			this.loading = true;
			this.response = await api.admin.emailLookup(this.email);
			this.loading = false;
		},
	},
});
</script>
