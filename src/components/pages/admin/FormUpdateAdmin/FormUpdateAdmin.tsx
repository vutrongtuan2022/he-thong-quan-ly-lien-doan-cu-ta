import React, {useState} from 'react';

import {IDetailAdmin, IUpdateAdmin, PropsFormUpdateAdmin} from './interfaces';
import styles from './FormUpdateAdmin.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {IoClose} from 'react-icons/io5';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import roleServices from '~/services/roleServices';
import {toastWarn} from '~/common/funcs/toast';

function FormUpdateAdmin({onClose}: PropsFormUpdateAdmin) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuidUpdate} = router.query;
	const [form, setForm] = useState<IUpdateAdmin>({
		uuid: '',
		userName: '',
		account: '',
		email: '',
		role: '',
		password: '',
	});

	useQuery<IDetailAdmin>([QUERY_KEY.detail_admin, _uuidUpdate], {
		queryFn: () =>
			httpRequest({
				http: accountServices.detailAdminAccount({
					uuid: _uuidUpdate as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					uuid: data?.uuid,
					userName: data?.userName || '',
					account: data?.accountName || '',
					email: data?.email || '',
					role: data?.role?.uuid || '',
					password: '',
				});
			}
		},
		enabled: !!_uuidUpdate,
	});

	const funcUpdateAdmin = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa tài khoản thành công!',
				http: accountServices.upsertAdminAccount({
					uuid: form.uuid,
					userName: form.userName,
					accountName: form.account,
					email: form.email,
					roleUuid: form.role,
					password: form.password,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({uuid: '', userName: '', account: '', email: '', role: '', password: ''});
				queryClient.invalidateQueries([QUERY_KEY.table_admin]);
			}
		},
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

	const handleSubmit = () => {
		if (!form.role) {
			return toastWarn({msg: 'Vui lòng chọn nhóm quyền!'});
		}
		return funcUpdateAdmin.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<div className={styles.container}>
				<h4 className={styles.title}>Chỉnh sửa thông tin </h4>
				<div className={styles.line}></div>
				<div className={styles.form}>
					<Input
						placeholder='Nhập tên đăng nhập'
						name='userName'
						type='text'
						value={form.userName}
						readOnly
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
							<Button p_10_14 white rounded_6 onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<FormContext.Consumer>
							{({isDone}) => (
								<div>
									<Button disable={!isDone} p_10_14 aquamarine rounded_6>
										Lưu lại
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

export default FormUpdateAdmin;
