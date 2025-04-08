import React, {Fragment, useState} from 'react';
import styles from './MainUpdateProfile.module.scss';
import {IDetailLogin, PropsMainUpdateProfile} from './interfaces';
import Button from '~/components/common/Button';
import UploadAvatar from '~/components/utils/UploadAvatar';
import images from '~/constants/images/images';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import GridColumn from '~/components/layouts/GridColumn';
import Form, {FormContext, Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import uploadService from '~/services/uploadService';
import {useRouter} from 'next/router';

function MainUpdateProfile({}: PropsMainUpdateProfile) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [form, setForm] = useState<IDetailLogin>({
		userName: '',
		accountName: '',
		email: '',
		role: '',
		imagePath: '',
		uuid: '',
	});

	useQuery([QUERY_KEY.detail_profile], {
		queryFn: () =>
			httpRequest({
				http: accountServices.detailPersonalAccount({}),
			}),
		onSuccess(data) {
			setForm({
				userName: data?.userName,
				accountName: data?.accountName,
				email: data?.email,
				role: data?.role?.name,
				imagePath: data?.imagePath,
				uuid: data?.uuid,
			});
		},
		select(data) {
			return data;
		},
	});

	const funcUpdateProfile = useMutation({
		mutationFn: (body: {imagePath: string}) => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa thông tin thành công!',
				http: accountServices.updatePersonalAccount({
					accountName: form?.accountName,
					email: form?.email,
					imagePath: body?.imagePath,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setForm({accountName: '', email: '', imagePath: '', uuid: form?.uuid, role: form?.role, userName: form?.userName});
				router.back();
				queryClient.invalidateQueries([QUERY_KEY.detail_profile]);
			}
		},
	});

	const handleSubmit = async () => {
		if (!file && !form.imagePath) {
			return toastWarn({msg: 'Vui lòng chọn ảnh!'});
		}

		if (!!file) {
			const dataImage = await httpRequest({
				setLoading,
				http: uploadService.uploadSingleImage(file, '8'),
			});

			return funcUpdateProfile.mutate({
				imagePath: dataImage,
			});
		} else {
			return funcUpdateProfile.mutate({
				imagePath: form.imagePath,
			});
		}
	};

	return (
		<Fragment>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Loading loading={funcUpdateProfile.isLoading || loading} />
				<div className={styles.container}>
					<div className={styles.head_main}>
						<Breadcrumb titles={['Thông tin cá nhân', 'Chỉnh sửa']} listHref={[PATH.Profile]} />
						<div className={styles.group_button}>
							<div>
								<Button p_10_24 grey rounded_8 href={PATH.Profile}>
									Hủy bỏ
								</Button>
							</div>
							<FormContext.Consumer>
								{({isDone}) => (
									<Button p_10_24 aquamarine rounded_8 disable={!isDone}>
										Lưu lại
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>
					<div className={styles.form_main}>
						<h4>Thông tin cá nhân</h4>
						<div className={styles.add_avatar}>
							<UploadAvatar
								path={form?.imagePath ? `${process.env.NEXT_PUBLIC_IMAGE}/${form?.imagePath}` : images?.avatar_default}
								name='avatar'
								onSetFile={setFile}
							/>
						</div>
						<div className={styles.divider}></div>
						<div className={styles.name_acount}>
							<GridColumn col_2>
								<Input
									placeholder='Nhập tên tài khoản '
									name='accountName'
									type='text'
									value={form?.accountName}
									isRequired
									max={255}
									label={
										<span>
											Tên tài khoản <span style={{color: '#EE0033'}}>*</span>
										</span>
									}
								/>
								<div>
									<Input
										placeholder='Nhập Email '
										name='email'
										type='text'
										value={form.email}
										isRequired
										max={255}
										label={
											<span>
												Email <span style={{color: '#EE0033'}}>*</span>
											</span>
										}
									/>
								</div>

								<Input
									placeholder='Nhập username '
									name='userName'
									type='text'
									value={form.userName}
									isRequired
									readOnly
									max={255}
									label={
										<span>
											Username <span style={{color: '#EE0033'}}>*</span>
										</span>
									}
								/>
								<div>
									<Input
										placeholder='Nhập vai trò sử dụng '
										name='role'
										type='text'
										value={form.role}
										isRequired
										readOnly
										max={255}
										label={
											<span>
												Vai trò sử dụng <span style={{color: '#EE0033'}}>*</span>
											</span>
										}
									/>
								</div>
							</GridColumn>
						</div>
					</div>
				</div>
			</Form>
		</Fragment>
	);
}

export default MainUpdateProfile;
