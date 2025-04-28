import React, {useContext, useEffect, useState} from 'react';

import {PropsFormOTP} from './interfaces';
import styles from './FormOTP.module.scss';
import fancyTimeFormat from '~/common/funcs/optionConvert';
import {ContextForgotPassword, IContextForgotPassword} from '../../context';
import Button from '~/components/common/Button';
import {TYPE_FORGOT_PASWORD} from '../../interfaces';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import InputSingle from '~/components/common/Form/components/InputSingle';
import Form from '~/components/common/Form';
import accountServices from '~/services/accountServices';
import Loading from '~/components/common/Loading';

function FormOTP({}: PropsFormOTP) {
	const TIME_OTP = 180;

	const [countDown, setCoutDown] = useState<number>(TIME_OTP);

	const {form, setForm, setType} = useContext<IContextForgotPassword>(ContextForgotPassword);

	useEffect(() => {
		if (countDown > 0) {
			const time = setTimeout(() => {
				setCoutDown(countDown - 1);
			}, 1000);
			return () => clearInterval(time);
		}
	}, [countDown]);

	// Gửi lại OTP
	const funcSendOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Mã OTP đã được gửi đến email của bạn',
				http: accountServices.sendOTP({
					email: form?.email!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setCoutDown(TIME_OTP);
			}
		},
	});

	// FUCN submit OTP
	const funcSubmitOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác thực thành công',
				http: accountServices.enterOTP({
					email: form?.email!,
					otp: form?.otp!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setType(TYPE_FORGOT_PASWORD.PASSWORD);
			}
		},
	});

	const handleSendcode = () => {
		return funcSendOTP.mutate();
	};

	const handleSubmit = () => {
		return funcSubmitOTP.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcSendOTP.isLoading || funcSubmitOTP.isLoading} />
			<p className={styles.des}>Nhập mã OTP</p>
			<InputSingle onSetValue={setForm} name='otp' lenght={6} />
			<p className={styles.countDown}>
				Bạn chưa nhận được mã.
				{countDown > 0 ? (
					<span className={styles.textGreen}>Gửi lại OTP ({fancyTimeFormat(countDown)})</span>
				) : (
					<span className={styles.textGreen} onClick={handleSendcode}>
						Gửi lại OTP
					</span>
				)}
			</p>
			<div className={styles.btn}>
				<Button p_10_24 orange rounded_8 bold disable={form?.otp?.length! < 6} onClick={handleSubmit}>
					Đổi mật khẩu
				</Button>
			</div>
		</Form>
	);
}

export default FormOTP;
