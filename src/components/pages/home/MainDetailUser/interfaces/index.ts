export interface PropsMainDetailUser {
	onClose: () => void;
}

export interface IUserDetail {
	code: string;
	identityCode: string;
	identityPlace: string;
	identityDate: string;
	imageCardPath: string;
	frontIdentityPath: string;
	backIdentityPath: string;
	fullname: string;
	email: string;
	gender: number;
	birthday: string;
	height: number;
	weight: number;
	education: number;
	phoneNumber: string;
	expertiseType: number;
	state: number;
	rejectedReason: string;
	created: string;
	updated: string;
	status: number;
	uuid: string;
	addressInfo: {
		address1: string;
		tp: {
			code: string;
			name: string;
			uuid: string;
		};
		qh: {
			code: string;
			name: string;
			uuid: string;
		};
		xa: {
			code: string;
			name: string;
			uuid: string;
		};
		uuid: string;
	};
}
