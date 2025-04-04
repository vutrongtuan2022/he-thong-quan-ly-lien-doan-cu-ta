import React, {useState} from 'react';

import {IFormUpdateVideo, PropsFormUpdateVideo} from './interfaces';
import styles from './FormUpdateVideo.module.scss';
import Form, {Input} from '~/components/common/Form';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
import SwitchButton from '~/components/common/SwitchButton';

function FormUpdateVideo({onClose}: PropsFormUpdateVideo) {
	const [form, setForm] = useState<IFormUpdateVideo>({name: '', linkYou: '', second: 0});

	return (
		<Form form={form} setForm={setForm}>
			<div className={styles.container}>
				<h4 className={styles.title}>Chỉnh sửa video</h4>
				<div className={styles.line}></div>
				<div className={styles.form}>
					<Input
						placeholder='Nhập tiêu đề video'
						name='name'
						type='text'
						value={form.name}
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
						name='linkYou'
						type='text'
						value={form.linkYou}
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
						name='second '
						type='number'
						value={form.second}
						isRequired
						max={255}
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
						<SwitchButton />
					</p>

					<div className={styles.group_button}>
						<div>
							<Button p_10_14 white rounded_6 onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<Button p_10_14 aquamarine rounded_6>
								Lưu lại
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

export default FormUpdateVideo;
