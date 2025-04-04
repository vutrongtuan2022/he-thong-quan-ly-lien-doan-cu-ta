export interface PropsMainPageAdmin {}

export interface IPageAdmin {
	userName: string;
	accountName: string;
	email: string;
	role: {
		code: string;
		name: string;
		uuid: string;
	};
	created: string;
	status: number;
	uuid: string;
}
