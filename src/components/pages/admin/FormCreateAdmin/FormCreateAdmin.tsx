import React, {useState} from 'react';

import {ICreateAdmin, PropsFormCreateAdmin} from './interfaces';
import styles from './FormCreateAdmin.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import {QUERY_KEY} from '~/constants/config/enum';
import roleServices from '~/services/roleServices';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import md5 from 'md5';

function FormCreateAdmin({onClose}: PropsFormCreateAdmin) {
	const queryClient = useQueryClient();
	const [form, setForm] = useState<ICreateAdmin>({
		userName: '',
		account: '',
		email: '',
		password: '',
		role: '',
	});

	const listRole = useQuery([QUERY_KEY.dropdown_category_role], {
		queryFn: () =>
			httpRequest({
				http: roleServices.roleAdmin({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcCreateAdmin = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm tài khoản thành công!',
				http: accountServices.upsertAdminAccount({
					uuid: '',
					userName: form.userName,
					accountName: form.account,
					email: form.email,
					password: md5(`${form?.password}${process.env.NEXT_PUBLIC_KEY_PASS}`),
					roleUuid: form.role,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					userName: '',
					account: '',
					email: '',
					password: '',
					role: '',
				});
				queryClient.invalidateQueries([QUERY_KEY.table_admin]);
			}
		},
	});

	const handleSubmit = () => {
		if (!form.role) {
			return toastWarn({msg: 'Vui lòng chọn nhóm quyền!'});
		}
		return funcCreateAdmin.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcCreateAdmin.isLoading} />
			<div className={styles.container}>
				<h4 className={styles.title}>Tạo mới tài khoản </h4>
				<div className={styles.line}></div>
				<div className={styles.form}>
					<Input
						placeholder='Nhập tên đăng nhập'
						name='userName'
						type='text'
						value={form.userName}
						max={50}
						isRequired
						label={
							<span>
								Tên đăng nhập <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
					<Input
						placeholder='Nhập tên tài khoản'
						name='account'
						type='text'
						value={form.account}
						max={50}
						isRequired
						label={
							<span>
								Tên tài khoản <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
					<Input
						placeholder='Nhập tên email'
						name='email'
						type='text'
						value={form.email}
						max={50}
						isRequired
						label={
							<span>
								Email <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
					<Input
						label={
							<span>
								Mật khẩu <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Mật khẩu'
						type='password'
						name='password'
						value={form?.password}
						isRequired
						blur
						showDone
					/>
					<div className={styles.mt}>
						<Select
							isSearch
							name='role'
							value={form.role}
							placeholder='Chọn'
							label={
								<span>
									Nhóm quyền <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listRole?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									title={v?.name}
									value={v?.uuid}
									onClick={() =>
										setForm((prev) => ({
											...prev,
											role: v?.uuid,
										}))
									}
								/>
							))}
						</Select>
					</div>

					<div className={styles.group_button}>
						<div>
							<Button p_10_24 white rounded_6 onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<FormContext.Consumer>
							{({isDone}) => (
								<div>
									<Button disable={!isDone} p_10_24 aquamarine rounded_6>
										Tạo mới
									</Button>
								</div>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.close} onClick={onClose}>
					<IoClose size={28} color='#9EA5C0' />
				</div>
			</div>
		</Form>
	);
}

export default FormCreateAdmin;
