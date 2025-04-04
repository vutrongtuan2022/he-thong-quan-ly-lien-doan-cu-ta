import React, {Fragment, useState} from 'react';
import styles from './MainPageProfile.module.scss';
import {PropsMainPageProfile} from './interfaces';
import Button from '~/components/common/Button';
import UploadAvatar from '~/components/utils/UploadAvatar';
import images from '~/constants/images/images';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import GridColumn from '~/components/layouts/GridColumn';
import Form, {FormContext, Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';

function MainPageProfile({}: PropsMainPageProfile) {
	const [file, setFile] = useState<any>(null);
	const [form, setForm] = useState<{
		name: string;
		email: string;
		username: string[];
		role: string[];
		avatar: string;
	}>({
		name: '',
		email: '',
		username: [],
		role: [],
		avatar: '',
	});

	return (
		<Fragment>
			<Form form={form} setForm={setForm}>
				<div className={styles.container}>
					<div className={styles.head_main}>
						<Breadcrumb titles={['Thông tin cá nhân', 'Chỉnh sửa']} listHref={[PATH.Profile]} />
						<div className={styles.group_button}>
							<div>
								<Button p_10_24 grey rounded_8>
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
								path={form.avatar ? `${process.env.NEXT_PUBLIC_IMAGE}/${form.avatar}` : images?.avatar_default}
								name='avatar'
								onSetFile={setFile}
							/>
						</div>
						<div className={styles.divider}></div>
						<div className={styles.name_acount}>
							<GridColumn col_2>
								<Input
									placeholder='Nhập tên tài khoản '
									name='name'
									type='text'
									value={form.avatar}
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
										name='name'
										type='text'
										value={form.avatar}
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
									placeholder='Nhập Username '
									name='username'
									type='text'
									value={form.username}
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
									<Select
										isSearch
										name='role'
										value={form.role}
										placeholder='Chọn người dùng'
										label={<span>Vai trò sử dụng</span>}
									>
										<Option
											key=''
											value=''
											title=''
											onClick={() =>
												setForm((prev: any) => ({
													...prev,
													role: '',
												}))
											}
										/>
									</Select>
								</div>
							</GridColumn>
						</div>
					</div>
				</div>
			</Form>
		</Fragment>
	);
}

export default MainPageProfile;
