export interface PropsFormUpdateAdmin {
	onClose: () => void;
}

export interface IUpdateAdmin {
	uuid: string;
	userName: string;
	account: string;
	email: string;
	role: string;
	password: string;
}

export interface IDetailAdmin {
	userName: string;
	accountName: string;
	email: string;
	role: {
		code: string;
		name: string;
		uuid: string;
	};
	created: string;
	updated: string;
	status: number;
	uuid: string;
}
