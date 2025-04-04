import React, {useState} from 'react';

import {IFormForgotPassword, PropsMainForgotPassword, TYPE_FORGOT_PASWORD} from './interfaces';
import styles from './MainForgotPassword.module.scss';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {ContextForgotPassword} from './context';
import FormEmail from './components/FormEmail';
import {obfuscateEmail} from '~/common/funcs/optionConvert';
import FormOTP from './components/FormOTP';
import FormPassword from './components/FormPassword';

function MainForgotPassword({}: PropsMainForgotPassword) {
	const [type, setType] = useState<TYPE_FORGOT_PASWORD>(TYPE_FORGOT_PASWORD.EMAIL);
	const [form, setForm] = useState<IFormForgotPassword>({
		email: '',
		otp: '',
		password: '',
		rePassword: '',
	});

	return (
		<div className={styles.forgotPassword}>
			<Image alt='Login' src={icons.logo} className={styles.logo} />
			<h4 className={styles.title}>
				{type == TYPE_FORGOT_PASWORD.EMAIL && 'Quên mật khẩu'}
				{type == TYPE_FORGOT_PASWORD.CODE && 'Xác thực OTP'}
				{type == TYPE_FORGOT_PASWORD.PASSWORD && 'Đổi mật khẩu'}
			</h4>
			<p className={styles.des}>
				{type == TYPE_FORGOT_PASWORD.EMAIL && 'Nhập địa chỉ email liên kết với tài khoản của bạn'}
				{type == TYPE_FORGOT_PASWORD.CODE &&
					`Một mã xác thực đã được gửi cho bạn qua địa chỉ email: ${obfuscateEmail(form?.email!)}`}
				{type == TYPE_FORGOT_PASWORD.PASSWORD && 'Vui lòng nhập mật khẩu mới của bạn'}
			</p>
			<div className={styles.form}>
				<ContextForgotPassword.Provider
					value={{
						form: form,
						setForm: setForm,
						type: type,
						setType: setType,
					}}
				>
					{type == TYPE_FORGOT_PASWORD.EMAIL && <FormEmail />}
					{type == TYPE_FORGOT_PASWORD.CODE && <FormOTP />}
					{type == TYPE_FORGOT_PASWORD.PASSWORD && <FormPassword />}
				</ContextForgotPassword.Provider>
			</div>
		</div>
	);
}

export default MainForgotPassword;
