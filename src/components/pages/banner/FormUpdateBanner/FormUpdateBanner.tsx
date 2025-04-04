import React, {useState} from 'react';

import {IUpdateBanner, PropsFormUpdateBanner} from './interfaces';
import styles from './FormUpdateBanner.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
import UploadImage from '~/components/utils/UploadImage';
import SwitchButton from '~/components/common/SwitchButton';
import {QUERY_KEY, TYPE_DISPLAY} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import bannerServices from '~/services/bannerServices';
import {price} from '~/common/funcs/convertCoin';
import {toastWarn} from '~/common/funcs/toast';
import uploadService from '~/services/uploadService';
import Loading from '~/components/common/Loading';

function FormUpdateBanner({uuid, queryKeys, onClose}: PropsFormUpdateBanner) {
	const queryClient = useQueryClient();

	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [form, setForm] = useState<IUpdateBanner>({
		title: '',
		imagePath: '',
		sort: 0,
		privacy: TYPE_DISPLAY.PUBLIC,
	});

	useQuery([QUERY_KEY.detail_banners], {
		queryFn: () =>
			httpRequest({
				http: bannerServices.detailBanner({
					uuid: uuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					title: data?.title || '',
					imagePath: data?.imagePath || '',
					sort: data?.sort || 0,
					privacy: data?.privacy || TYPE_DISPLAY.PUBLIC,
				});
			}
		},
		enabled: !!uuid,
	});

	const funcUpdateBanner = useMutation({
		mutationFn: (body: {imagePath: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa banner thành công!',
				http: bannerServices.upsertBanner({
					uuid: uuid,
					title: form?.title,
					sort: price(form.sort),
					privacy: form.privacy,
					imagePath: body?.imagePath,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					title: '',
					imagePath: '',
					sort: 0,
					privacy: TYPE_DISPLAY.PUBLIC,
				});
				queryKeys?.map((key) => queryClient.invalidateQueries([key]));
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

			return funcUpdateBanner.mutate({
				imagePath: dataImage,
			});
		} else {
			return funcUpdateBanner.mutate({
				imagePath: form.imagePath,
			});
		}
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcUpdateBanner.isLoading || loading} />
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<h4 className={styles.title}>Chỉnh sửa banner</h4>
					<IoClose className={styles.close} size={28} color='#8492A6' onClick={onClose} />
				</div>
				<div className={styles.form}>
					<UploadImage
						label={
							<span>
								Hình ảnh banner <span style={{color: 'red'}}>*</span>
							</span>
						}
						name='banner'
						file={file}
						setFile={setFile}
						path={form?.imagePath ? `${process.env.NEXT_PUBLIC_IMAGE}/${form?.imagePath}` : ''}
						resetPath={() =>
							setForm((prev) => ({
								...prev,
								imagePath: '',
							}))
						}
					/>
					<div className={styles.mt}>
						<Input
							placeholder='Nhập tên'
							name='title'
							type='text'
							value={form.title}
							max={50}
							isRequired
							label={
								<span>
									Tên banner <span style={{color: 'red'}}>*</span>
								</span>
							}
						/>
					</div>
					<div className={styles.mt}>
						<Input
							placeholder='Nhập số thứ tự hiển thị vd: 1'
							name='sort'
							type='string'
							value={form.sort}
							isRequired
							isMoney
							label={
								<span>
									Thứ tự hiển thị <span style={{color: 'red'}}>*</span>
								</span>
							}
						/>
					</div>
					<div className={styles.mt}>
						<div className={styles.status}>
							Trạng thái hiển thị <span style={{color: 'red'}}>*</span>
						</div>
						<SwitchButton
							checkOn={form?.privacy == TYPE_DISPLAY.PUBLIC}
							onClick={() =>
								setForm((prev) => ({
									...prev,
									privacy: prev?.privacy == TYPE_DISPLAY.PUBLIC ? TYPE_DISPLAY.PRIVATE : TYPE_DISPLAY.PUBLIC,
								}))
							}
						/>
					</div>
				</div>
				<div className={styles.groupBtn}>
					<div>
						<Button p_12_20 grey rounded_6 onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<FormContext.Consumer>
						{({isDone}) => (
							<div>
								<Button disable={!isDone} p_12_20 aquamarine rounded_6>
									Cập nhật
								</Button>
							</div>
						)}
					</FormContext.Consumer>
				</div>
			</div>
		</Form>
	);
}

export default FormUpdateBanner;
