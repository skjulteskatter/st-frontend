export type Notification = {
	id?: string;
	type: string;
	title: string;
	content?: string;
	icon?: string;
	hidden?: boolean;
}

export type State = {
    notifications: Notification[];
}

export const state: State = {
    notifications: [],
};
