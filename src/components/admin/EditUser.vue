<template>
	<BaseButton theme="tertiary" class="px-2 py-1" @click="showModal()">{{ $t('common_edit') }}</BaseButton>
	<SlidePanel :open="show" @close="hideModal()" :title="`${$t('common_edit')} ${$t('common_user').toLocaleLowerCase()}`">
		<Loader :loading="loading" position="local">
			<div class="flex flex-col gap-4">
				<div class="flex gap-4 items-center">
					<img
						:src="
							User.image ??
							'/img/portrait-placeholder.png'
						"
						class="rounded-full w-20 h-20 object-cover border border-black/20 dark:border-white/20"
						width="80"
						height="80"
					/>
					<span class="flex flex-col">
						<h3 class="font-bold">
							{{ User.displayName }}
						</h3>
						<small class="text-gray-500">{{ User.email }}</small>
					</span>
				</div>
				<div class="flex flex-col">
					<div class="flex flex-col gap-1 py-4">
						<small class="mb-2 opacity-50 text-xs font-medium uppercase tracking-wider">{{$t('common_roles')}}</small>
						<label

							v-for="role in roles"
							:key="role"
						>
							<input
								type="checkbox"
								class="text-primary rounded border-gray-300 focus-visible:ring-primary mr-1"
								:checked="
									User.roles.find(
										(r) => r == role
									) != undefined
								"
								@change="toggleRole(User, role)"
							/>
							{{ role }}
						</label>
					</div>
					<div class="flex flex-col py-4">
						<small class="mb-2 opacity-50 text-xs font-medium uppercase tracking-wider">{{$t('common_collections')}}</small>
						<div v-for="i in User.subscriptions" :key="i.id" class="relative p-2 rounded-md border border-gray-300 mb-2">
							<b class="text-sm">{{i.id}}</b>
							<button class="cursor-pointer text-red-700 absolute right-2 top-2" @click="deleteSub(User, i)" v-if="i.id.startsWith('custom')">
								<TrashIcon class="w-4 h-4" />
							</button>
							<small class="whitespace-nowrap block" v-for="c in getCollections(i)" :key="c.id">{{c.getName()}}</small>
							<small class="whitespace-nowrap block" v-if="i.productIds.includes(PRESENTATION_PRODUCT_ID)">Presentation</small>
							<BaseDropdown
								label="Move"
							>
								<div class="flex">
									<input v-model="moveToEmailLookup" type="email" placeholder="Email..." />
									<RefreshIcon class="w-8 h-8" @click="moveToEmailLookupSearch()"></RefreshIcon>
								</div>
								<div v-if="lookedUpUser">
									<h3>{{lookedUpUser.name}}</h3>
									<BaseButton @click="transferToId(i, lookedUpUser?.id ?? '')">Confirm</BaseButton>
								</div>
							</BaseDropdown>
						</div>
						<BaseDropdown
							:label="'Add'"
						>
							<div class="mb-2 text-sm" v-for="i in getUnownedCollections(User.subscriptions)" :key="i.id">
								<label :key="i.id" class="cursor-pointer">
									<input :key="i.id" type="checkbox" class="text-primary rounded border-gray-300 focus-visible:ring-primary mr-1" v-model="newSubs[User.id][i.id]" />
									{{i.getName()}}
								</label>
							</div>
							<div class="mb-2 text-sm">
								<label class="cursor-pointer">
									<input type="checkbox" class="text-primary rounded border-gray-300 focus-visible:ring-primary mr-1" v-model="newSubs[User.id][PRESENTATION_PRODUCT_ID]" />
									Presentation
								</label>
							</div>
							<br/>
							<span class="text-sm">Valid To</span>
							<input type="date" v-model="validTo[User.id]"/>
							<BaseButton class="mb-2" @click="addSubscriptions(User)">Add</BaseButton>
						</BaseDropdown>
					</div>
				</div>
				<BaseButton
					theme="secondary"
					@click="$emit('save')"
					:loading="loading"
					>{{ $t("common_save") }}</BaseButton
				>
			</div>
		</Loader>
	</SlidePanel>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import SlidePanel from "@/components/SlidePanel.vue";
import { RefreshIcon, TrashIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";
import { UsersMutationTypes } from "@/store/modules/users/mutation-types";
import { adminService } from "@/services/admin";
import api, { admin } from "@/services/api";
import { User } from "@/classes";
import { ISubscription } from "songtreasures-api";
import { appSession } from "@/services/session";
import { Product, ProductService } from "hiddentreasures-js";
import client from "@/services/client";

const PRESENTATION_PRODUCT_ID = "prod_MoRqqzwH6vnfTZ";

export default defineComponent({
	name: "edit-user",
	components: {
    SlidePanel,
    TrashIcon,
    RefreshIcon
},
	props: {
		user: {
			type: Object as PropType<User>,
			required: true,
		},
	},
	data: () => ({
		store: useStore(),
		loading: false,
		show: false,
		PRESENTATION_PRODUCT_ID,
		products: [] as Product[],
		lookedUpUser: null as {
			id: string,
			name: string,
		} | null,
		moveToEmailLookup: "",
	}),
	async mounted() {
		const service = new ProductService(client);
		this.products = await service.list();
	},
	emits: ["save"],
	computed: {
		User() {
			return this.user as User;
		},
		roles() {
			return this.store.state.users.roles;
		},
		newSubs() {
			return adminService.NewSubs;
		},
		validTo() {
			return adminService.ValidTo;
		},
	},
	methods: {
		async showModal() {
			this.show = true;
			this.loading = true;
			const id = this.User.id;
			this.User.subscriptions = (await admin.getUser(id)).subscriptions;
			this.newSubs[id] = {};
			this.validTo[id] = "";
			this.loading = false;
		},
		async moveToEmailLookupSearch() {
			this.lookedUpUser = null;
			const users = await admin.getUsers(this.moveToEmailLookup);
			const u = users[0];
			if (u) {
				this.lookedUpUser = {
					id: u.id,
					name: u.displayName,
				};
			}
		},
		async transferToId(sub: ISubscription, userId: string) {
			await admin.updateSubscription(sub.id, {userId});
		},
		hideModal() {
			this.show = false;
		},
		toggleRole(user: User, role: string) {
			this.store.commit(UsersMutationTypes.USER_TOGGLE_ROLE, { user, role });
		},
		getCollections(subscription: ISubscription) {
			const cols = appSession.collections.filter(i => this.products.filter(p => subscription.productIds.includes(p.id)).some(p => p.collectionIds.includes(i.id)));
			return cols;
		},
		getUnownedCollections(subscriptions: ISubscription[]) {
			return appSession.collections.filter(i => !subscriptions.some(s => s.collectionIds?.includes(i.id)));
		},
		async addSubscriptions(user: User) {
			const cols = [];

			for (const v of Object.entries(this.newSubs[user.id])) {
				if (v[1] === true)
					cols.push(v[0]);
			}

			const presentation = cols.includes(PRESENTATION_PRODUCT_ID)

			if (cols.length > 0 && this.validTo[user.id]) {
				const sub = await api.admin.createSubscription(user.id, {
					collectionIds: cols.filter(i => i !== PRESENTATION_PRODUCT_ID),
					validTo: this.validTo[user.id],
				}, presentation);

				user.subscriptions.push(sub);
				this.newSubs[user.id] = {};
				delete this.validTo[user.id];
			}	
		},
		async deleteSub(user: User, subscription: ISubscription) {
			await api.admin.deleteSubcription(user.id, subscription.id);
			user.subscriptions = user.subscriptions.filter(i => i.id != subscription.id);
		},
	},
});
</script>
