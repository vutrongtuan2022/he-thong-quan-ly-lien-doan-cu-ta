import {PATH} from '~/constants/config';
import {PropsMainPageLink} from './interfaces';
import styles from './MainPageLink.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {Fragment} from 'react';
import Image from 'next/image';
import GridColumn from '~/components/layouts/GridColumn';
function MainPageLink({}: PropsMainPageLink) {
	return (
		<Fragment>
			<div className={styles.container}>
				<div className={styles.head_main}>
					<Breadcrumb titles={['Thông tin liên đoàn']} listHref={[PATH.Link]} />
				</div>
				<div className={styles.form_main}>
					<h4>Thông tin liên đoàn</h4>
					<div className={styles.group_info}>
						<Image alt='Avatar' src={''} width={120} height={120} className={styles.avatar} />

						<div className={styles.divider}></div>
						<GridColumn col_2>
							<div className={styles.item}>
								<p>Tên tài khoản</p>
								<p>{'Liên đoàn Cử tạ, Thể hình Việt Nam'}</p>
							</div>
							<div className={styles.item}>
								<p>Tên rút gọn </p>
								<p>{'VBWF'}</p>
							</div>
							<div className={styles.item}>
								<p>Giới thiệu </p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Địa chỉ </p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Số điện thoại </p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Email </p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tài khoản Zalo </p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết Linkedin</p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết Facebook</p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết Instagram </p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết Youtube</p>
								<p>{'---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết TikTok </p>
								<p>{'---'}</p>
							</div>
						</GridColumn>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default MainPageLink;
