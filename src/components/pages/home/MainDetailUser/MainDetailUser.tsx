import React, {useState} from 'react';

import {IUserDetail, PropsMainDetailUser} from './interfaces';
import styles from './MainDetailUser.module.scss';
import Button from '~/components/common/Button';
import StateActive from '~/components/utils/StateActive';
import Image from 'next/image';
import GridColumn from '~/components/layouts/GridColumn';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {GENDER, QUERY_KEY, STATE_USER} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import Moment from 'react-moment';
import {listEducation, listExpertise} from '~/common/funcs/data';
import {getTextAddress} from '~/common/funcs/convertCoin';
import Popup from '~/components/common/Popup';
import FormRejectedUser from '../FormRejectedUser';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import {Danger} from 'iconsax-react';

function MainDetailUser({onClose}: PropsMainDetailUser) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuidUser} = router.query;

	const [openApprove, setOpenApprove] = useState<boolean>(false);
	const [openRejected, setOpenRejected] = useState<boolean>(false);

	const {data: user} = useQuery<IUserDetail>([QUERY_KEY.detail_user, _uuidUser], {
		queryFn: () =>
			httpRequest({
				http: userServices.getDetailUser({
					uuid: _uuidUser as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuidUser,
	});

	// Duyệt thành viên
	const funcApproveUser = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Duyệt thành viên thành công!',
				http: userServices.updateStateUser({
					uuid: user?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenApprove(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_user]);
				queryClient.invalidateQueries([QUERY_KEY.table_user]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcApproveUser.isLoading} />
			<div className={styles.head}>
				<div className={styles.info}>
					<h4>Chi tiết thành viên</h4>
					<div className={styles.status}>
						<p>Trạng thái hiện tại:</p>
						<StateActive
							isSmall={true}
							stateActive={user?.state!}
							listState={[
								{
									state: STATE_USER.PENDING_APPROVAL,
									text: 'Chờ duyệt',
									backgroundColor: '#FD8B6E',
									textColor: '#fff',
								},
								{
									state: STATE_USER.REJECTED,
									text: 'Bị từ chối',
									backgroundColor: '#FA4B4B',
									textColor: '#fff',
								},
							]}
						/>
						<div className={styles.line}></div>
						<p>
							Ngày đăng ký:
							<span style={{marginLeft: '4px'}}>
								{user?.created ? <Moment date={user?.created} format='DD/MM/YYYY' /> : '---'}
							</span>
						</p>
					</div>
				</div>
				<div className={styles.group_btn}>
					{/* Chờ duyệt */}
					{user?.state == STATE_USER.PENDING_APPROVAL && (
						<>
							<Button green p_8_24 rounded_8 onClick={() => setOpenApprove(true)}>
								Duyệt thành viên
							</Button>
							<Button red p_8_24 rounded_8 onClick={() => setOpenRejected(true)}>
								Từ chối thành viên
							</Button>
						</>
					)}

					<Button grey p_8_24 rounded_8 onClick={onClose}>
						Đóng
					</Button>
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.head_title}>
					<h4>Thông tin cá nhân</h4>
				</div>
				<div className={styles.group_info}>
					{user?.imageCardPath && (
						<Image
							alt='Avatar'
							src={`${process.env.NEXT_PUBLIC_IMAGE}/${user?.imageCardPath}`}
							width={80}
							height={80}
							className={styles.avatar}
						/>
					)}
					<GridColumn col_5>
						<div className={styles.item}>
							<p>Họ và tên</p>
							<p>{user?.fullname}</p>
						</div>
						<div className={styles.item}>
							<p>Ngày sinh</p>
							<p>
								<Moment date={user?.birthday} format='DD/MM/YYYY' />
							</p>
						</div>
						<div className={styles.item}>
							<p>Giới tính</p>
							<p>
								{user?.gender == GENDER?.MALE && 'Nam'}
								{user?.gender == GENDER?.FEMALE && 'Nữ'}
							</p>
						</div>
						<div className={styles.item}>
							<p>Chiều cao (cm)</p>
							<p>{user?.height || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Cân nặng (kg)</p>
							<p>{user?.weight || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Tình trạng học vấn</p>
							<p>{listEducation?.find((v) => v?.value == user?.education)?.name}</p>
						</div>
						<div className={styles.item}>
							<p>Số điện thoại liên lạc</p>
							<p>{user?.phoneNumber}</p>
						</div>
						<div className={styles.item}>
							<p>Email</p>
							<p>{user?.email}</p>
						</div>
						{user?.state == STATE_USER.REJECTED && (
							<div className={styles.item}>
								<p>Lý do từ chối</p>
								<p>{user?.rejectedReason || '---'}</p>
							</div>
						)}
					</GridColumn>
				</div>
				<div className={styles.line_width}></div>
				<div className={styles.head_title}>
					<h4>Địa chỉ</h4>
				</div>
				<div className={styles.group_info}>
					<div className={styles.item}>
						<p>{getTextAddress(user?.addressInfo)}</p>
					</div>
				</div>
				<div className={styles.line_width}></div>
				<div className={styles.head_title}>
					<h4>Thông tin CMND/CCCD</h4>
				</div>
				<div className={styles.group_info}>
					<GridColumn col_3>
						<div className={styles.item}>
							<p>Số CMND/CCCD</p>
							<p>{user?.identityCode}</p>
						</div>
						<div className={styles.item}>
							<p>Nơi cấp CMND/CCCD</p>
							<p>{user?.identityPlace}</p>
						</div>
						<div className={styles.item}>
							<p>Ngày cấp CMND/CCCD</p>
							<p>
								<Moment date={user?.identityDate} format='DD/MM/YYYY' />
							</p>
						</div>
						<div className={styles.item}>
							<p>Ảnh mặt trước CMND/CCCD</p>
							<Image
								alt='Ảnh CCCD mặt trước'
								src={`${process?.env?.NEXT_PUBLIC_IMAGE}/${user?.frontIdentityPath}`}
								height={216}
								width={368}
								style={{borderRadius: '8px'}}
							/>
						</div>
						<div className={styles.item}>
							<p>Ảnh mặt sau CMND/CCCD</p>
							<Image
								alt='Ảnh CCCD mặt sau'
								src={`${process?.env?.NEXT_PUBLIC_IMAGE}/${user?.backIdentityPath}`}
								height={216}
								width={368}
								style={{borderRadius: '8px'}}
							/>
						</div>
					</GridColumn>
				</div>
			</div>

			<Dialog
				type='primary'
				open={openApprove}
				onClose={() => setOpenApprove(false)}
				title='Duyệt thành viên'
				note='Bạn có chắc chắn muốn duyệt thành viên này?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcApproveUser.mutate}
			/>

			<Popup open={openRejected} onClose={() => setOpenRejected(false)}>
				<FormRejectedUser
					uuidRejected={_uuidUser as string}
					queryKeys={[QUERY_KEY.detail_user, QUERY_KEY.table_user]}
					onClose={() => setOpenRejected(false)}
				/>
			</Popup>
		</div>
	);
}

export default MainDetailUser;
