import React from 'react';

import {PropsMainDetailNews} from './interfaces';
import styles from './MainDetailNews.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';

function MainDetailNews({}: PropsMainDetailNews) {
	return (
		<div className={styles.container}>
			<div className={styles.head_main}>
				<Breadcrumb titles={['Quản lý tin tức', 'Chi tiết bài viết']} listHref={[PATH.News]} />
				<div className={styles.group_button}>
					<Button p_10_24 red rounded_8>
						Xóa vĩnh viễn
					</Button>
					<Button p_10_24 aquamarine rounded_8>
						Chỉnh sửa
					</Button>
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.form}>
					<div className={styles.item}>
						<p>Tiêu đề bài viết</p>
						<p>1</p>
					</div>
					<div className={styles.item}>
						<p>Link đăng ký sự kiện</p>
						<p>1</p>
					</div>
					<div className={styles.item}>
						<p>Nội dung bài viết</p>
						<div dangerouslySetInnerHTML={{__html: ''}}></div>
					</div>
				</div>
				<div className={styles.form}></div>
			</div>
		</div>
	);
}

export default MainDetailNews;
