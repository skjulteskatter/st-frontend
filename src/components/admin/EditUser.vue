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
									)
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
							<br/>
							<span class="text-sm">Valid To</span>
							<input type="date" v-model="validTo[User.id]"/>
							<BaseButton class="mb-2" :disabled="!Object.values(newSubs[User.id]).includes(true) || !validTo[User.id]" @click="addSubscriptions(User)">Save</BaseButton>
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
import { Options, Vue } from "vue-class-component";
import SlidePanel from "@/components/SlidePanel.vue";
import { TrashIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";
import { UsersMutationTypes } from "@/store/modules/users/mutation-types";
import { adminService } from "@/services/admin";
import api, { admin } from "@/services/api";
import { User } from "@/classes";
import { ISubscription } from "songtreasures";

@Options({
	name: "edit-user",
	components: {
		SlidePanel,
		TrashIcon,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	emits: ["save"],
})
export default class EditUser extends Vue {
	public store = useStore();
	public user?: User;

	public get User() {
		return this.user as User;
	}

    public loading = false;
	public show = false;

    public get roles() {
        return this.store.state.users.roles;
    }

	public newSubs = adminService.NewSubs;

	public validTo = adminService.ValidTo;

	public async showModal() {
		this.show = true;
		this.loading = true;
		const id = this.User.id;
		this.User.subscriptions = (await admin.getUser(id)).subscriptions;
		this.newSubs[id] = {};
		this.validTo[id] = "";
		this.loading = false;
	}

	public hideModal() {
		this.show = false;
	}

    public toggleRole(user: User, role: string) {
        this.store.commit(UsersMutationTypes.USER_TOGGLE_ROLE, { user, role });
    }

    public getCollections(subscription: ISubscription) {
        return this.store.getters.collections.filter(i => subscription.collectionIds?.includes(i.id));
    }

    public getUnownedCollections(subscriptions: ISubscription[]) {
        return this.store.getters.collections.filter(i => !subscriptions.some(s => s.collectionIds?.includes(i.id)));
    }

    public async addSubscriptions(user: User) {
        const cols = [];

        for (const v of Object.entries(this.newSubs[user.id])) {
            if (v[1] === true)
                cols.push(v[0]);
        }

        if (cols.length > 0 && this.validTo[user.id]) {
            const sub = await api.admin.createSubscription(user.id, {
                collectionIds: cols,
                validTo: this.validTo[user.id],
            });

            user.subscriptions.push(sub);
            this.newSubs[user.id] = {};
            delete this.validTo[user.id];
        }
            
    }

    public async deleteSub(user: User, subscription: ISubscription) {
        await api.admin.deleteSubcription(user.id, subscription.id);
        user.subscriptions = user.subscriptions.filter(i => i.id != subscription.id);
    }
}
</script>
