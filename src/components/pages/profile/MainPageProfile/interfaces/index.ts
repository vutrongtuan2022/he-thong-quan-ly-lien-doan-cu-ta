export interface PropsMainPageProfile {}
export interface IDetailLogin {
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
