import React, {useState} from 'react';
import {IFormChangePassword, PropsFormChangePassword} from './interfaces';
import styles from './FormUpdatePassword.module.scss';
import {IoClose} from 'react-icons/io5';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {ShieldSecurity} from 'iconsax-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import md5 from 'md5';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';

function FormChangePassword({onClose}: PropsFormChangePassword) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormChangePassword>({
		old_password: '',
		new_password: '',
		confirm_password: '',
	});

	const funcChangePassPersonal = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật mât khẩu thành công',
				http: accountServices.changePassPersonal({
					oldPassword: md5(`${form?.old_password}${process.env.NEXT_PUBLIC_KEY_PASS}`),
					newPassword: md5(`${form?.new_password}${process.env.NEXT_PUBLIC_KEY_PASS}`),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setForm({old_password: '', new_password: '', confirm_password: ''});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.detail_profile]);
			}
		},
	});

	const handleSubmit = () => {
		return funcChangePassPersonal.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcChangePassPersonal.isLoading} />
			<div className={styles.container}>
				<h4 className={styles.title}>Đổi mật khẩu </h4>
				<div className={styles.line}></div>
				<div className={styles.form}>
					<Input
						label={
							<span>
								Mật khẩu cũ <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập mật khẩu cũ'
						type='password'
						name='old_password'
						value={form?.old_password}
						isRequired
						blur
						showDone
						icon={<ShieldSecurity size='22' variant='Bold' />}
					/>
					<Input
						label={
							<span>
								Mật khẩu mới <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập mật khẩu mới'
						type='password'
						name='new_password'
						value={form?.new_password}
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
						name='confirm_password'
						value={form?.confirm_password}
						valueConfirm={form.new_password}
						onClean
						isRequired
						blur
						showDone
						icon={<ShieldSecurity size='22' variant='Bold' />}
					/>

					<div className={styles.group_button}>
						<div>
							<Button p_10_24 white rounded_6 onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>

						<div>
							<FormContext.Consumer>
								{({isDone}) => (
									<Button p_10_24 aquamarine rounded_6 disable={!isDone}>
										Xác nhận
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>
				</div>
				<div className={styles.close} onClick={onClose}>
					<IoClose size={28} color='#9EA5C0' />
				</div>
			</div>
		</Form>
	);
}

export default FormChangePassword;
