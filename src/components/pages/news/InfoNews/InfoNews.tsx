import React from 'react';

import {PropsInfoNews} from './interfaces';
import styles from './InfoNews.module.scss';
import Accordion from '~/components/utils/Accordion';
import {TYPE_DISPLAY, TYPE_NEWS} from '~/constants/config/enum';
import moment from 'moment';
import SwitchButton from '~/components/common/SwitchButton';
import Image from 'next/image';

function InfoNews({news}: PropsInfoNews) {
	return (
		<div className={styles.container}>
			<Accordion title='Trạng thái và hiển thị'>
				<div className={styles.main_display}>
					<div className={styles.view}>
						<p>Hiển thị:</p>
						<p>
							{news?.privacy == TYPE_DISPLAY.PUBLIC && 'Công khai'}
							{news?.privacy == TYPE_DISPLAY.PRIVATE && 'Riêng tư'}
						</p>
					</div>
					<div className={styles.view}>
						<p>Lượt xem:</p>
						<p>{news?.view || 0}</p>
					</div>
					<div className={styles.view}>
						<p>Bình luận:</p>
						<p>{news?.countComment || 0}</p>
					</div>
					<div className={styles.view}>
						<p>Chế độ đăng:</p>
						<p>{moment(news?.timePublic).format('HH:mm, DD/MM/YYYY')}</p>
					</div>
					<div className={styles.view}>
						<p>Bài viết nổi bật:</p>
						<SwitchButton checkOn={news?.isSpecial} />
					</div>
					<div className={styles.view}>
						<p>Thứ tự hiển thị:</p>
						<p>{news?.sort}</p>
					</div>
				</div>
			</Accordion>
			<div className={styles.line}></div>
			<Accordion title='Loại bài viết'>
				<div className={styles.category}>
					<div className={styles.item}>
						<input name='catalog' type='checkbox' checked={true} />
						<label>
							{news?.catalog == TYPE_NEWS.NEWS && 'Tin tức'}
							{news?.catalog == TYPE_NEWS.OPPORTUNITY && 'Cơ hội'}
							{news?.catalog == TYPE_NEWS.EVENT && 'Sự kiện'}
							{news?.catalog == TYPE_NEWS.DOCUMENT && 'Tài liệu'}
						</label>
					</div>
				</div>
			</Accordion>
			<div className={styles.line}></div>
			<Accordion title='Ảnh bài viết'>
				<div className={styles.image}>
					<Image
						style={{
							borderRadius: '6px',
						}}
						alt='Ảnh bài viết'
						src={`${process.env.NEXT_PUBLIC_IMAGE}/${news?.imagePath}`}
						fill
					/>
				</div>
			</Accordion>

			<div className={styles.line}></div>
			<Accordion title='Thảo luận'>
				<div className={styles.category}>
					<div className={styles.item}>
						<input name='blockComment' type='checkbox' id='allowComments' checked={news?.blockComment} />
						<label htmlFor='allowComments'>Cho phép bình luận</label>
					</div>
				</div>
			</Accordion>
		</div>
	);
}

export default InfoNews;
