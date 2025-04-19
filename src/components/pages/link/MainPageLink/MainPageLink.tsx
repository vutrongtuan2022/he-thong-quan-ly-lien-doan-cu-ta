import {PATH} from '~/constants/config';
import {IDetailLink, PropsMainPageLink} from './interfaces';
import styles from './MainPageLink.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {Fragment} from 'react';
import Image from 'next/image';
import GridColumn from '~/components/layouts/GridColumn';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import profileServices from '~/services/profileServices';
import Button from '~/components/common/Button';
import images from '~/constants/images/images';
function MainPageLink({}: PropsMainPageLink) {
	const {data: detatilLink} = useQuery<IDetailLink>([QUERY_KEY.detail_link], {
		queryFn: () =>
			httpRequest({
				http: profileServices.profileAdminDetail({}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<Fragment>
			<div className={styles.container}>
				<div className={styles.head_main}>
					<Breadcrumb titles={['Thông tin liên đoàn']} listHref={[PATH.Link]} />
					<div className={styles.group_button}>
						<Button p_10_24 aquamarine rounded_8 href={`${PATH.Updatelink}`}>
							Chỉnh sửa
						</Button>
					</div>
				</div>
				<div className={styles.form_main}>
					<h4>Thông tin liên đoàn</h4>
					<div className={styles.group_info}>
						<Image
							alt='Avatar'
							src={
								detatilLink?.imagePath
									? `${process.env.NEXT_PUBLIC_IMAGE}/${detatilLink?.imagePath}`
									: images?.avatar_default
							}
							width={120}
							height={120}
							className={styles.avatar}
						/>

						<div className={styles.divider}></div>
						<GridColumn col_2>
							<div className={styles.item}>
								<p>Tên tài khoản</p>
								<p>{detatilLink?.name || ''}</p>
							</div>
							<div className={styles.item}>
								<p>Tên rút gọn </p>
								<p>{detatilLink?.shortName || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Giới thiệu </p>
								<p>{detatilLink?.introduce || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Địa chỉ </p>
								<p>{detatilLink?.address || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Số điện thoại </p>
								<p>{detatilLink?.phoneNumber || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Email </p>
								<p>{detatilLink?.email || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tài khoản Zalo </p>
								<p>{detatilLink?.zalo || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết Linkedin</p>
								<p>{detatilLink?.linkedIn || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết Facebook</p>
								<p>{detatilLink?.facebook || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết Instagram </p>
								<p>{detatilLink?.instagram || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết Youtube</p>
								<p>{detatilLink?.youtube || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Liên kết TikTok </p>
								<p>{detatilLink?.tiktok || '---'}</p>
							</div>
						</GridColumn>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default MainPageLink;
