import Head from 'next/head';
import {Fragment} from 'react';

import styles from './Page404.module.scss';
import Image from 'next/image';
import images from '~/constants/images/images';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';

export default function PageNotFound() {
	return (
		<Fragment>
			<Head>
				<title>Page 404</title>
				<meta name='description' content='Page 404' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className={styles.container}>
				<Image alt='Ảnh page 404' src={images.image_404} className={styles.image} />
				<h4>Oops! Không tìm thấy trang.</h4>
				<p>Xin lỗi! Trang bạn đang tìm không tồn tại. Nếu bạn cho rằng có gì đó bị hỏng, hãy báo cáo sự cố cho đội ngũ kỹ thuật.</p>
				<div className={styles.btn}>
					<Button href={PATH.Home} rounded_8 bold orange p_14_40>
						Quay về trang chủ
					</Button>
				</div>
			</div>
		</Fragment>
	);
}
