import React, {useState} from 'react';

import {IFormCreateVideo, PropsFormCreateVideo} from './interfaces';
import styles from './FormCreateVideo.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
import SwitchButton from '~/components/common/SwitchButton';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import videoServices from '~/services/videoServices';
import {QUERY_KEY, TYPE_DISPLAY} from '~/constants/config/enum';

function FormCreateVideo({queryKeys, onClose}: PropsFormCreateVideo) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormCreateVideo>({title: '', videoLink: '', privacy: 0, sort: 0});

	const funcCreateMaterial = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới video thành công!',
				http: videoServices.upsertVideo({
					uuid: '',
					title: form?.title,
					videoLink: form?.videoLink,
					sort: Number(form?.sort),
					privacy: form?.privacy,
				}),
			});
		},
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

	const handleSubmit = () => {
		return funcCreateMaterial.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<div className={styles.container}>
				<h4 className={styles.title}>Thêm mới video</h4>
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
						type='number'
						value={form.sort}
						isRequired
						label={
							<span>
								Thứ tự hiển thị <span style={{color: '#EE0033'}}>*</span>
							</span>
						}
					/>

					<p className={styles.label}>
						Trạng thái hiển thị <span style={{color: '#EE0033'}}>*</span>
					</p>
					<p>
						<SwitchButton
							checkOn={form?.privacy == TYPE_DISPLAY.PUBLIC}
							onClick={() =>
								setForm((prev) => ({
									...prev,
									privacy: prev?.privacy == TYPE_DISPLAY.PUBLIC ? TYPE_DISPLAY.PRIVATE : TYPE_DISPLAY.PUBLIC,
								}))
							}
						/>
					</p>

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
										Thêm video
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

export default FormCreateVideo;
