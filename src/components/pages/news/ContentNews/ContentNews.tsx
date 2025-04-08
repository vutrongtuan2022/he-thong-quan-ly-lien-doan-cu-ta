import React from 'react';

import {PropsContentNews} from './interfaces';
import styles from './ContentNews.module.scss';
import {TYPE_NEWS} from '~/constants/config/enum';
import Link from 'next/link';

function ContentNews({news}: PropsContentNews) {
	return (
		<div className={styles.form}>
			<div className={styles.item}>
				<p>Tiêu đề bài viết</p>
				<p>{news?.title}</p>
			</div>
			{news?.catalog == TYPE_NEWS.EVENT && (
				<div className={styles.item}>
					<p>Link đăng ký sự kiện</p>
					<Link target='_blank' href={news?.link} className={styles.link}>
						{news?.link}
					</Link>
				</div>
			)}
			<div className={styles.item}>
				<p>Nội dung bài viết</p>
				<div dangerouslySetInnerHTML={{__html: news?.content || ''}}></div>
			</div>
		</div>
	);
}

export default ContentNews;
