<template>
	<base-button theme="tertiary" class="px-2 py-1" @click="showModal()">{{ $t('common.edit') }}</base-button>
	<base-modal v-if="user" :show="show" @close="hideModal()">
		<loader :loading="loading" />
		<div class="flex flex-col gap-4">
			<div class="flex gap-4 items-center">
				<img
					:src="
						user.image ??
						'/img/portrait-placeholder.png'
					"
					class="rounded-full w-20 h-20 object-cover"
				/>
				<span class="flex flex-col">
					<h3 class="font-bold">
						{{ user.displayName }}
					</h3>
					<small class="text-gray-500">{{ user.email }}</small>
				</span>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-col">
					<label
						class="font-bold"
						>Roles</label
					>
					<label
						class="text-sm"
						v-for="role in roles"
						:key="role"
					>
						<input
							type="checkbox"
							class="text-primary rounded border-gray-300 focus:ring-primary"
							:checked="
								user.roles.find(
									(r) => r == role
								)
							"
							@change="toggleRole(user, role)"
						/>
						{{ role }}
					</label>
				</div>
				<br/>
				<div class="flex flex-col">
					<h3 class="font-bold">{{$t('common.collections')}}</h3>
					<div v-for="i in user.subscriptions" :key="i.id">
						<span>{{getCollection(i)?.getName()}}</span>
						<icon class="cursor-pointer" @click="deleteSub(user, i)" size="24" name="trash" v-if="i.id.startsWith('custom')" />
					</div>
					<base-dropdown
						:label="'Add'"
					>
						<div class="mb-2 text-sm" v-for="i in getUnownedCollections(user.subscriptions)" :key="i.id">
							<label :key="i.id" class="cursor-pointer">
								<input :key="i.id" type="checkbox" v-model="newSubs[user.id][i.id]" />
								{{i.getName()}}
							</label>
						</div>
						<br/>
						<span class="text-sm">Valid To</span>
						<input type="date" v-model="validTo[user.id]"/>
						<base-button class="mb-2" :disabled="!Object.values(newSubs[user.id]).includes(true) || !validTo[user.id]" @click="addSubscriptions(user)">Save</base-button>
					</base-dropdown>
				</div>
			</div>
			<base-button
				theme="secondary"
				@click="$emit('save')"
				:loading="loading"
				>{{ $t("common.save") }}</base-button
			>
		</div>
	</base-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseModal } from "@/components";
import { useStore } from "@/store";
import { UsersMutationTypes } from "@/store/modules/users/mutation-types";
import api from "@/services/api";

@Options({
	name: "edit-user",
	components: {
		BaseModal,
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

    public loading = false;
	public show = false;

	public newSubs: {
        [key: string]: {
            [key: string]: boolean;
        };
    } = {};

    public validTo: {
        [key: string]: string;
    } = {};

    public get roles() {
        return this.store.state.users.roles;
    }

	public showModal() {
		this.show = true;
	}

	public hideModal() {
		this.show = false;
	}

    public toggleRole(user: User, role: string) {
        this.store.commit(UsersMutationTypes.USER_TOGGLE_ROLE, { user, role });
    }

    public getCollection(subscription: Subscription) {
        return this.store.getters.collections.find(i => subscription.collectionIds.includes(i.id));
    }

    public getUnownedCollections(subscriptions: Subscription[]) {
        return this.store.getters.collections.filter(i => !subscriptions.some(s => s.collectionIds.includes(i.id)));
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

    public async deleteSub(user: User, subscription: Subscription) {
        await api.admin.deleteSubcription(user.id, subscription.id);
        user.subscriptions = user.subscriptions.filter(i => i.id != subscription.id);
    }
}
</script>
