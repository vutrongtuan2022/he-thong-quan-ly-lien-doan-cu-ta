export interface PropsMainPageMember {}

export interface IMember {
	userInfo: {
		code: string;
		fullname: string;
		imageCardPath: string;
		phoneNumber: string;
		uuid: string;
	};
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
