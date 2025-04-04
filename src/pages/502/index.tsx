import Head from 'next/head';
import {Fragment} from 'react';

import styles from './Page502.module.scss';
import Image from 'next/image';
import images from '~/constants/images/images';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';

export default function PageError() {
	return (
		<Fragment>
			<Head>
				<title>Page 502</title>
				<meta name='description' content='Page 502' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className={styles.container}>
				<Image alt='Ảnh page 502' src={images.image_502} className={styles.image} />
				<h4>Oops! Lỗi máy chủ nội bộ.</h4>
				<p>Xin lỗi! Hiện tại máy chủ đang gặp sự cố. Bạn vui lòng chờ trong giây lát hoặc thử lại sau.</p>
				<div className={styles.btn}>
					<Button href={PATH.Home} rounded_8 bold orange p_14_40>
						Quay về trang chủ
					</Button>
				</div>
			</div>
		</Fragment>
	);
}
