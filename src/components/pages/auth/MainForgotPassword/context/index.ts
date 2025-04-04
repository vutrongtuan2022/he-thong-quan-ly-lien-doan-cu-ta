import {createContext, Dispatch, SetStateAction} from 'react';
import {IFormForgotPassword, TYPE_FORGOT_PASWORD} from '../interfaces';

export interface IContextForgotPassword {
	form: IFormForgotPassword;
	setForm: Dispatch<SetStateAction<IFormForgotPassword>>;
	type: number;
	setType: Dispatch<SetStateAction<number>>;
}

export const ContextForgotPassword = createContext<IContextForgotPassword>({
	form: {email: '', otp: '', password: '', rePassword: ''},
	setForm: () => null,
	type: TYPE_FORGOT_PASWORD.EMAIL,
	setType: () => null,
});
