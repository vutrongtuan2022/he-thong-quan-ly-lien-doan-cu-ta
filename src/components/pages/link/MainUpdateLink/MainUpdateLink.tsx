import React, {Fragment, useState} from 'react';
import styles from './MainUpdateLink.module.scss';
import {IDetailLink, PropsMainUpdateLink} from './interfaces';
import Button from '~/components/common/Button';
import UploadAvatar from '~/components/utils/UploadAvatar';
import images from '~/constants/images/images';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import GridColumn from '~/components/layouts/GridColumn';
import Form, {FormContext, Input} from '~/components/common/Form';
import {useMutation, useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import uploadService from '~/services/uploadService';
import {useRouter} from 'next/router';
import profileServices from '~/services/profileServices';

function MainUpdateLink({}: PropsMainUpdateLink) {
	const router = useRouter();

	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [form, setForm] = useState<IDetailLink>({
		name: '',
		shortName: '',
		introduce: '',
		address: '',
		phoneNumber: '',
		email: '',
		zalo: '',
		facebook: '',
		youtube: '',
		instagram: '',
		tiktok: '',
		linkedIn: '',
		imagePath: '',
	});

	useQuery([QUERY_KEY.detail_profile], {
		queryFn: () =>
			httpRequest({
				http: profileServices.profileAdminDetail({}),
			}),
		onSuccess(data) {
			setForm({
				name: data?.name || '',
				shortName: data?.shortName || '',
				introduce: data?.introduce || '',
				address: data?.address || '',
				phoneNumber: data?.phoneNumber || '',
				email: data?.email || '',
				zalo: data?.zalo || '',
				facebook: data?.facebook || '',
				youtube: data?.youtube || '',
				instagram: data?.instagram || '',
				tiktok: data?.tiktok || '',
				linkedIn: data?.linkedIn || '',
				imagePath: data?.imagePath || '',
			});
		},
		select(data) {
			return data;
		},
	});

	const funcUpdateLink = useMutation({
		mutationFn: (body: {imagePath: string}) => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa thông tin thành công!',
				http: profileServices.updateProfileAdmin({
					name: form?.name,
					shortName: form?.shortName,
					introduce: form?.introduce,
					address: form?.address,
					phoneNumber: form?.phoneNumber,
					email: form?.email,
					zalo: form?.zalo,
					facebook: form?.facebook,
					youtube: form?.youtube,
					instagram: form?.instagram,
					tiktok: form?.tiktok,
					linkedIn: form?.linkedIn,
					imagePath: body.imagePath,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					shortName: '',
					introduce: '',
					address: '',
					phoneNumber: '',
					email: '',
					zalo: '',
					facebook: '',
					youtube: '',
					instagram: '',
					tiktok: '',
					linkedIn: '',
					imagePath: '',
				});

				router.back();
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
				http: uploadService.uploadSingleImage(file, '4'),
			});
			return funcUpdateLink.mutate({
				imagePath: dataImage,
			});
		} else {
			return funcUpdateLink.mutate({
				imagePath: form.imagePath,
			});
		}
	};

	return (
		<Fragment>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Loading loading={funcUpdateLink.isLoading || loading} />
				<div className={styles.container}>
					<div className={styles.head_main}>
						<Breadcrumb titles={['Thông tin liên đoàn', 'Chỉnh sửa']} listHref={[PATH.Profile]} />
						<div className={styles.group_button}>
							<div>
								<Button p_10_24 grey rounded_8 href={PATH.Link}>
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
						<h4>Thông tin liên đoàn</h4>
						<div className={styles.add_avatar}>
							<UploadAvatar
								path={form?.imagePath ? `${process.env.NEXT_PUBLIC_IMAGE}/${form?.imagePath}` : images?.avatar_default}
								name='avatar'
								onSetFile={setFile}
								resetPath={() =>
									setForm((prev) => ({
										...prev,
										imagePath: '',
									}))
								}
							/>
						</div>
						<div className={styles.divider}></div>
						<div className={styles.name_acount}>
							<GridColumn col_2>
								<Input
									placeholder='Nhập tên tài khoản '
									name='name'
									type='text'
									value={form?.name}
									isRequired
									max={255}
									label={
										<span>
											Tên liên đoàn <span style={{color: '#EE0033'}}>*</span>
										</span>
									}
								/>
								<div>
									<Input
										placeholder='Nhập tên rút gọn '
										name='shortName'
										type='text'
										value={form.shortName}
										max={255}
										label={<span>Tên rút gọn</span>}
									/>
								</div>

								<Input
									placeholder='Nhập giới thiệu '
									name='introduce'
									type='text'
									value={form?.introduce}
									max={255}
									label={<span>Giới thiệu</span>}
								/>
								<div>
									<Input
										placeholder='Nhập địa chỉ '
										name='address'
										type='text'
										value={form.address}
										isRequired
										max={255}
										label={
											<span>
												Địa chỉ <span style={{color: '#EE0033'}}>*</span>
											</span>
										}
									/>
								</div>
								<Input
									placeholder='Nhập số điện thoại '
									name='phoneNumber'
									type='text'
									value={form?.phoneNumber}
									isRequired
									max={255}
									label={
										<span>
											Số điện thoại <span style={{color: '#EE0033'}}>*</span>
										</span>
									}
								/>
								<div>
									<Input
										placeholder='Nhập email '
										name='email'
										type='text'
										isEmail
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
									placeholder='Nhập zalo '
									name='zalo'
									type='text'
									isNumber
									value={form?.zalo}
									max={255}
									label={<span>Tài khoản Zalo</span>}
								/>
								<div>
									<Input
										placeholder='Nhập LinkedIn '
										name='linkedIn'
										type='text'
										value={form.linkedIn}
										max={255}
										label={<span>Liên kết LinkedIn</span>}
									/>
								</div>
								<Input
									placeholder='Nhập liên kết Facebook '
									name='facebook'
									type='text'
									value={form?.facebook}
									max={255}
									label={<span>Liên kết Facebook</span>}
								/>
								<div>
									<Input
										placeholder='Nhập liên kết Insta '
										name='instagram'
										type='text'
										value={form.instagram}
										max={255}
										label={<span>Liên kết Insta</span>}
									/>
								</div>
								<Input
									placeholder='Nhập liên kết Youtube '
									name='youtube'
									type='text'
									value={form?.youtube}
									max={255}
									label={<span>Liên kết Youtube</span>}
								/>
								<div>
									<Input
										placeholder='Nhập liên kết Tiktok '
										name='tiktok'
										type='text'
										value={form.tiktok}
										max={255}
										label={<span>Liên kết TikTok</span>}
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

export default MainUpdateLink;
