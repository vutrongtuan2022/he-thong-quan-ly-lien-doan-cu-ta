export interface PropsMainPageMember {}

export interface IMember {
	cardState: number;
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
	expertiseType: number;
	created: string;
	status: number;
	uuid: string;
}
