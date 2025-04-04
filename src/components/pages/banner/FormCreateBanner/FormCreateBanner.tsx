import React, {useState} from 'react';

import {ICreateBanner, PropsFormCreateBanner} from './interfaces';
import styles from './FormCreateBanner.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
import UploadImage from '~/components/utils/UploadImage';
import SwitchButton from '~/components/common/SwitchButton';
import {TYPE_DISPLAY} from '~/constants/config/enum';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import bannerServices from '~/services/bannerServices';
import {price} from '~/common/funcs/convertCoin';
import {toastWarn} from '~/common/funcs/toast';
import uploadService from '~/services/uploadService';
import Loading from '~/components/common/Loading';

function FormCreateBanner({queryKeys, onClose}: PropsFormCreateBanner) {
	const queryClient = useQueryClient();

	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [form, setForm] = useState<ICreateBanner>({
		title: '',
		imagePath: '',
		sort: 0,
		privacy: TYPE_DISPLAY.PUBLIC,
	});

	const funcCreateBanner = useMutation({
		mutationFn: (body: {imagePath: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới banner thành công!',
				http: bannerServices.upsertBanner({
					uuid: '',
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
		if (!file) {
			return toastWarn({msg: 'Vui lòng chọn ảnh!'});
		}

		const dataImage = await httpRequest({
			setLoading,
			http: uploadService.uploadSingleImage(file, '8'),
		});

		return funcCreateBanner.mutate({
			imagePath: dataImage,
		});
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcCreateBanner.isLoading || loading} />
			<div className={styles.container}>
				<h4 className={styles.title}>Thêm mới banner</h4>
				<div className={styles.line}></div>
				<IoClose className={styles.close} size={28} color='#8492A6' onClick={onClose} />
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
						path={''}
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
									Lưu lại
								</Button>
							</div>
						)}
					</FormContext.Consumer>
				</div>
			</div>
		</Form>
	);
}

export default FormCreateBanner;
