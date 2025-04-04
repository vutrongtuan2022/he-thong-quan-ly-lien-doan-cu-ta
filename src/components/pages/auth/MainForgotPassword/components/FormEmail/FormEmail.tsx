import React, {useContext} from 'react';

import {PropsFormEmail} from './interfaces';
import styles from './FormEmail.module.scss';
import {ContextForgotPassword, IContextForgotPassword} from '../../context';
import Form, {FormContext, Input} from '~/components/common/Form';
import {ArrowLeft, Sms} from 'iconsax-react';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';
import Link from 'next/link';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import {TYPE_FORGOT_PASWORD} from '../../interfaces';
import Loading from '~/components/common/Loading';

function FormEmail({}: PropsFormEmail) {
	const {form, setForm, setType} = useContext<IContextForgotPassword>(ContextForgotPassword);

	const funcSendOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Mã OTP đã được gửi đến email của bạn',
				http: accountServices.sendOTP({
					email: form?.email,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setType(TYPE_FORGOT_PASWORD.CODE);
			}
		},
	});

	const handleSendOTP = () => {
		return funcSendOTP.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSendOTP}>
			<Loading loading={funcSendOTP.isLoading} />
			<Input
				label={
					<span>
						Email <span style={{color: 'red'}}>*</span>
					</span>
				}
				placeholder='Nhập email'
				type='text'
				name='email'
				value={form?.email}
				isEmail
				onClean
				isRequired
				blur
				icon={<Sms size='22' variant='Bold' />}
			/>
			<div className={styles.btn}>
				<FormContext.Consumer>
					{({isDone}) => (
						<Button p_10_24 orange rounded_8 bold disable={!isDone}>
							Lấy lại mật khẩu
						</Button>
					)}
				</FormContext.Consumer>

				<Link href={PATH.Login} className={styles.link}>
					<ArrowLeft size={18} />
					<p>Trở về đăng nhập</p>
				</Link>
			</div>
		</Form>
	);
}

export default FormEmail;
