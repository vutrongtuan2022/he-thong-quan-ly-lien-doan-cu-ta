import React, {useState} from 'react';
import {IUpdatePaddWord, PropsFormUpdatePassword} from './interfaces';
import styles from './FormUpdatePassword.module.scss';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {ShieldSecurity} from 'iconsax-react';
function FormUpdatePadsword({onClose}: PropsFormUpdatePassword) {
	const [form, setForm] = useState<IUpdatePaddWord>({
		old_password: '',
		new_password: '',
		confirm_password: '',
	});

	return (
		<Form form={form} setForm={setForm}>
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
							<Button p_10_24 aquamarine rounded_6>
								Xác nhận
							</Button>
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

export default FormUpdatePadsword;
