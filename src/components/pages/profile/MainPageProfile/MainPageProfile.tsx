import React, {Fragment} from 'react';
import styles from './MainPageProfile.module.scss';
import {IDetailLogin, PropsMainPageProfile} from './interfaces';
import Button from '~/components/common/Button';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import GridColumn from '~/components/layouts/GridColumn';
import Image from 'next/image';
import {useRouter} from 'next/router';
import Popup from '~/components/common/Popup';
import FormChangePassword from '../FormChangePassword';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import images from '~/constants/images/images';

function MainPageProfile({}: PropsMainPageProfile) {
	const router = useRouter();

	const {_action} = router.query;

	const {data: detatilPersonal} = useQuery<IDetailLogin>([QUERY_KEY.detail_profile], {
		queryFn: () =>
			httpRequest({
				http: accountServices.detailPersonalAccount({}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<Fragment>
			<div className={styles.container}>
				<div className={styles.head_main}>
					<Breadcrumb titles={['Thông tin cá nhân']} listHref={[PATH.Profile]} />
					<div className={styles.group_button}>
						<div>
							<Button
								p_10_24
								rounded_8
								orange
								onClick={() => {
									if (_action !== 'change_update') {
										router.replace(
											{
												pathname: router.pathname,
												query: {...router.query, _action: 'change_update'},
											},
											undefined,
											{
												scroll: false,
												shallow: false,
											}
										);
									}
								}}
							>
								Đổi mật khẩu
							</Button>
						</div>

						<Button p_10_24 aquamarine rounded_8 href={`${PATH.UpdateProfile}`}>
							Chỉnh sửa
						</Button>
					</div>
				</div>
				<div className={styles.form_main}>
					<h4>Thông tin cá nhân</h4>
					<div className={styles.group_info}>
						<Image
							alt='Avatar'
							src={
								detatilPersonal?.imagePath
									? `${process.env.NEXT_PUBLIC_IMAGE}/${detatilPersonal?.imagePath}`
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
								<p>{detatilPersonal?.accountName || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Email</p>
								<p>{detatilPersonal?.email || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tên đăng nhập</p>
								<p>{detatilPersonal?.userName || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Vai trò sử dụng</p>
								<p>{detatilPersonal?.role?.name || '---'}</p>
							</div>
						</GridColumn>
					</div>
				</div>
			</div>

			<Popup
				open={_action == 'change_update'}
				onClose={() => {
					const {_action, ...rest} = router.query;
					router.replace(
						{
							pathname: router.pathname,
							query: rest,
						},
						undefined,
						{
							scroll: false,
							shallow: false,
						}
					);
				}}
			>
				<FormChangePassword
					onClose={() => {
						const {_action, ...rest} = router.query;
						router.replace(
							{
								pathname: router.pathname,
								query: rest,
							},
							undefined,
							{
								scroll: false,
								shallow: false,
							}
						);
					}}
				/>
			</Popup>
		</Fragment>
	);
}

export default MainPageProfile;
