import React, {useState} from 'react';

import {IFormUpdateVideo, PropsFormUpdateVideo} from './interfaces';
import styles from './FormUpdateVideo.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
import SwitchButton from '~/components/common/SwitchButton';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, TYPE_DISPLAY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import videoServices from '~/services/videoServices';
import {price} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';

function FormUpdateVideo({uuid, queryKeys, onClose}: PropsFormUpdateVideo) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateVideo>({title: '', videoLink: '', sort: 0, privacy: TYPE_DISPLAY.PUBLIC});

	useQuery([QUERY_KEY.detail_video], {
		queryFn: () =>
			httpRequest({
				http: videoServices.detailVideo({
					uuid: uuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					title: data?.title || '',
					videoLink: data?.videoLink || '',
					sort: data?.sort || 0,
					privacy: data?.privacy,
				});
			}
		},
		enabled: !!uuid,
	});

	const funcUpdateVideo = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa video thành công!',
				http: videoServices.upsertVideo({
					uuid: uuid,
					title: form?.title,
					sort: price(form.sort),
					privacy: form.privacy,
					videoLink: form.videoLink,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					title: '',
					videoLink: '',
					sort: 0,
					privacy: TYPE_DISPLAY.PUBLIC,
				});
				queryKeys?.map((key) => queryClient.invalidateQueries([key]));
			}
		},
	});

	const handleSubmit = async () => {
		return funcUpdateVideo.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcUpdateVideo.isLoading} />
			<div className={styles.container}>
				<h4 className={styles.title}>Chỉnh sửa video</h4>
				<div className={styles.line}></div>
				<div className={styles.form}>
					<Input
						placeholder='Nhập tiêu đề video'
						name='title'
						type='text'
						value={form.title}
						isRequired
						max={255}
						label={
							<span>
								Tiêu đề video <span style={{color: '#EE0033'}}>*</span>
							</span>
						}
					/>
					<Input
						placeholder='Nhập link video từ youtube dạng https://www.youtube.com/watch?v=gUgr...'
						name='videoLink'
						type='text'
						value={form.videoLink}
						isRequired
						max={255}
						label={
							<span>
								Đường dẫn URL <span style={{color: '#EE0033'}}>*</span>
							</span>
						}
					/>
					<Input
						placeholder='Nhập số thứ tự hiển thị vd: 1'
						name='sort'
						type='string'
						value={form?.sort}
						isRequired
						isMoney
						label={
							<span>
								Thứ tự hiển thị <span style={{color: '#EE0033'}}>*</span>
							</span>
						}
					/>

					<div className={styles.label}>
						<p className={styles.status}>
							Trạng thái hiển thị <span style={{color: '#EE0033'}}>*</span>
						</p>
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
										Cập nhật
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

export default FormUpdateVideo;
