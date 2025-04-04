import React, {useState} from 'react';

import {IFormCreateNews, PropsMainCreateNews} from './interfaces';
import styles from './MainCreateNews.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import EditerContent from '../../../utils/EditerContent';
import Form, {Input} from '~/components/common/Form';
import FormInfoNews from '../FormInfoNews';
import {TYPE_DISPLAY, TYPE_NEWS} from '~/constants/config/enum';

function MainCreateNews({}: PropsMainCreateNews) {
	const [form, setForm] = useState<IFormCreateNews>({
		title: '',
		content: '',
		thumbnail: '',
		file: null,
		type: TYPE_NEWS.NEWS,
		display: TYPE_DISPLAY.PUBLIC,
		allowComments: 1,
		date: new Date(),
		order: 1,
	});

	return (
		<div className={styles.container}>
			<div className={styles.head_main}>
				<Breadcrumb titles={['Quản lý tin tức', 'Thêm mới']} listHref={[PATH.News]} />
				<div className={styles.group_button}>
					<Button p_10_24 grey rounded_8>
						Hủy bỏ
					</Button>
					<Button p_10_24 aquamarine rounded_8>
						Đăng bài
					</Button>
				</div>
			</div>
			<Form form={form} setForm={setForm}>
				<div className={styles.main}>
					<div className={styles.form}>
						<Input
							isRequired
							name='title'
							placeholder='Nhập tiêu đề bài viết'
							label={
								<span>
									Tiêu đề bài viết <span style={{color: 'red'}}>*</span>
								</span>
							}
						/>
						<div className={styles.editer}>
							<EditerContent
								label={
									<span>
										Nội dung bài viết <span style={{color: 'red'}}>*</span>
									</span>
								}
								content={form.content}
								setContent={(c) =>
									setForm((prev) => ({
										...prev,
										content: typeof c === 'function' ? c(prev.content) : c,
									}))
								}
							/>
						</div>
					</div>
					<FormInfoNews form={form} setForm={setForm} />
				</div>
			</Form>
		</div>
	);
}

export default MainCreateNews;
