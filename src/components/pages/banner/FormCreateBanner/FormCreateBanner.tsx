import React, {useState} from 'react';

import {ICreateBanner, PropsFormCreateBanner} from './interfaces';
import styles from './FormCreateBanner.module.scss';
import Form, {Input} from '~/components/common/Form';
import {IoClose} from 'react-icons/io5';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import UploadImage from '~/components/utils/UploadImage';
import SwitchButton from '~/components/common/SwitchButton';

function FormCreateBanner({onClose}: PropsFormCreateBanner) {
	const [form, setForm] = useState<ICreateBanner>({
		name: '',
		account: '',
		email: '',
		password: '',
		role: '',
	});

	const [file, setFile] = useState<any>(null);

	const handleSubmit = () => {};
	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<h4 className={styles.title}>Thêm mới banner</h4>
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
						path={''}
					/>

					<div className={styles.mt}>
						<Input
							placeholder='Nhập tên'
							name='name'
							type='text'
							value={form.name}
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
							name='account'
							type='text'
							value={form.account}
							max={50}
							isRequired
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

						<SwitchButton />
					</div>
				</div>

				<div className={styles.groupBtn}>
					<div>
						<Button p_12_20 grey rounded_6 onClick={onClose}>
							Hủy
						</Button>
					</div>
					<div className={styles.btn}>
						<Button p_12_20 aquamarine rounded_6>
							Thêm banner
						</Button>
					</div>
				</div>
			</div>
		</Form>
	);
}

export default FormCreateBanner;
