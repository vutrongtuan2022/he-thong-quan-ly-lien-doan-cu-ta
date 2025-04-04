export interface PropsMainForgotPassword {}

export interface IFormForgotPassword {
	email: string;
	otp: string;
	password: string;
	rePassword: string;
}

export enum TYPE_FORGOT_PASWORD {
	EMAIL = 1,
	CODE,
	PASSWORD,
}
