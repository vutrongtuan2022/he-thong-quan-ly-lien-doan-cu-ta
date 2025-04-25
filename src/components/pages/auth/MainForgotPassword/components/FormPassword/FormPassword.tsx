import React, {useContext} from 'react';

import {PropsFormPassword} from './interfaces';
import styles from './FormPassword.module.scss';
import {ContextForgotPassword, IContextForgotPassword} from '../../context';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {ShieldSecurity} from 'iconsax-react';
import {useRouter} from 'next/router';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import md5 from 'md5';
import {PATH} from '~/constants/config';
import accountServices from '~/services/accountServices';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';

function FormPassword({}: PropsFormPassword) {
	const router = useRouter();
	const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

	const {form, setForm} = useContext<IContextForgotPassword>(ContextForgotPassword);

	const funcChangePassForget = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Đổi mật khẩu thành công',
				http: accountServices.changePassForget({
					email: form?.email!,
					otp: form?.otp!,
					newPass: md5(`${form?.password}${process.env.NEXT_PUBLIC_KEY_PASS}`),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				router.push(PATH.Login);
			}
		},
	});

	const handleSubmit = () => {
		if (!regex.test(form?.password!)) {
			return toastWarn({
				msg: 'Mật khẩu mới phải chứa ít nhất 6 ký tự, bao gồm chữ cái và số',
			});
		}
		return funcChangePassForget.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcChangePassForget.isLoading} />
			<Input
				label={
					<span>
						Mật khẩu mới <span style={{color: 'red'}}>*</span>
					</span>
				}
				placeholder='Nhập mật khẩu mới'
				type='password'
				name='password'
				value={form?.password}
				onClean
				isRequired
				blur
				showDone
				icon={<ShieldSecurity size='22' variant='Bold' />}
			/>
			<Input
				label={
					<span>
						Xác nhận mật khẩu mới <span style={{color: 'red'}}>*</span>
					</span>
				}
				placeholder='Xác nhận mật khẩu mới'
				type='password'
				name='rePassword'
				value={form?.rePassword}
				valueConfirm={form.password}
				onClean
				isRequired
				blur
				showDone
				icon={<ShieldSecurity size='22' variant='Bold' />}
			/>
			<div className={styles.btn}>
				<FormContext.Consumer>
					{({isDone}) => (
						<Button p_10_24 orange rounded_8 bold disable={!isDone}>
							Xác nhận
						</Button>
					)}
				</FormContext.Consumer>
			</div>
		</Form>
	);
}

export default FormPassword;
