import React, {useState} from 'react';

import {PropsCardUser} from './interfaces';
import styles from './CardUser.module.scss';
import StateActive from '~/components/utils/StateActive';
import Image from 'next/image';
import {CardTick, CloseCircle, Danger, DollarCircle, Eye, TickCircle} from 'iconsax-react';
import {QUERY_KEY, STATE_USER} from '~/constants/config/enum';
import Moment from 'react-moment';
import {listExpertise} from '~/common/funcs/data';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import Popup from '~/components/common/Popup';
import FormRejectedUser from '../FormRejectedUser';
import {useRouter} from 'next/router';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';

function CardUser({user}: PropsCardUser) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [openApprove, setOpenApprove] = useState<boolean>(false);
	const [openRejected, setOpenRejected] = useState<boolean>(false);
	const [openConfirmPayment, setOpenConfirmPaymen] = useState<boolean>(false);
	const [openConfirmCard, setOpenConfirmCard] = useState<boolean>(false);

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
				queryClient.invalidateQueries([QUERY_KEY.table_user]);
			}
		},
	});

	// Xác nhận đã đóng tiền
	const funcConfirmPaymenUser = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận đóng tiền thành công!',
				http: userServices.updateStateUser({
					uuid: user?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenConfirmPaymen(false);
				queryClient.invalidateQueries([QUERY_KEY.table_user]);
			}
		},
	});

	// Xác nhận đã phát hành thẻ
	const funcConfirmCardUser = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận phát hành thẻ thành công!',
				http: userServices.updateStateUser({
					uuid: user?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenConfirmCard(false);
				queryClient.invalidateQueries([QUERY_KEY.table_user]);
			}
		},
	});

	return (
		<div className={styles.cart}>
			<Loading loading={funcApproveUser.isLoading || funcConfirmPaymenUser.isLoading || funcConfirmCardUser.isLoading} />
			<div className={styles.top}>
				<p>{user.code}</p>
				<StateActive
					borderRadius={24}
					stateActive={user?.state}
					listState={[
						{
							state: STATE_USER.PENDING_APPROVAL,
							text: 'Chờ duyệt',
							backgroundColor: '#FD8B6E',
							textColor: '#fff',
						},
						{
							state: STATE_USER.APPROVED,
							text: 'Đã duyệt',
							backgroundColor: '#4BC9F0',
							textColor: '#fff',
						},
						{
							state: STATE_USER.PAID,
							text: 'Đã đóng tiền',
							backgroundColor: '#4ECB71',
							textColor: '#fff',
						},
						{
							state: STATE_USER.ISSUED,
							text: 'Đã phát hành thẻ cứng',
							backgroundColor: '#4484FF',
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
			</div>
			<div className={styles.line}></div>
			<div className={styles.main}>
				<div className={styles.info}>
					{user?.imagePath && (
						<Image
							alt='avatar'
							src={`${process.env.NEXT_PUBLIC_IMAGE}/${user?.imagePath}`}
							width={36}
							height={36}
							className={styles.avatar}
						/>
					)}
					<div className={styles.name}>
						<p>{user?.fullname}</p>
						<p>{listExpertise?.find((v) => v?.value == user.expertiseType)?.name}</p>
					</div>
				</div>
				<div className={styles.item}>
					<p>Điện thoại:</p>
					<p>{user.phoneNumber}</p>
				</div>
				<div className={styles.item}>
					<p>Email:</p>
					<p>{user.email}</p>
				</div>
				<div className={styles.item}>
					<p>CMND/CCCD:</p>
					<p>{user.identityCode}</p>
				</div>
				<div className={styles.item}>
					<p>Ngày đăng ký:</p>
					<p>
						<Moment date={user.created} format='DD/MM/YYYY' />
					</p>
				</div>
			</div>
			<div className={styles.control}>
				{/* Chờ duyệt */}
				{user?.state == STATE_USER.PENDING_APPROVAL && (
					<>
						<Tippy content='Duyệt thành viên'>
							<div className={styles.action} onClick={() => setOpenApprove(true)}>
								<TickCircle size={24} color='#2CAE39' />
							</div>
						</Tippy>
						<Tippy content='Từ chối thành viên'>
							<div className={styles.action} onClick={() => setOpenRejected(true)}>
								<CloseCircle size={24} color='#EB2E2E' />
							</div>
						</Tippy>
					</>
				)}

				{/* Đã duyệt */}
				{user?.state == STATE_USER.APPROVED && (
					<Tippy content='Xác nhận đã đóng tiền'>
						<div className={styles.action} onClick={() => setOpenConfirmPaymen(true)}>
							<DollarCircle size={24} color='#4ECB71' />
						</div>
					</Tippy>
				)}

				{/* Đã đóng tiền */}
				{user?.state == STATE_USER.PAID && (
					<Tippy content='Xác nhận đã phát hành thẻ cứng'>
						<div className={styles.action} onClick={() => setOpenConfirmCard(true)}>
							<CardTick size={24} color='#3DC5AA' />
						</div>
					</Tippy>
				)}

				<Tippy content='Xem chi tiết'>
					<Link
						href='#'
						className={styles.action}
						onClick={(e) => {
							e.preventDefault();
							router.replace({
								pathname: router.pathname,
								query: {...router.query, _uuidUser: user?.uuid},
							});
						}}
					>
						<Eye size={24} color='#6170E3' />
					</Link>
				</Tippy>
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

			<Dialog
				type='primary'
				open={openConfirmPayment}
				onClose={() => setOpenConfirmPaymen(false)}
				title='Xác nhận đã đóng tiền'
				note='Bạn có chắc chắn muốn xác nhận thành viên này đã đóng tiền không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmPaymenUser.mutate}
			/>

			<Dialog
				type='primary'
				open={openConfirmCard}
				onClose={() => setOpenConfirmCard(false)}
				title='Xác nhận đã phát hành thẻ'
				note='Bạn có chắc chắn muốn xác nhận thành viên này đã phát hành thẻ không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmCardUser.mutate}
			/>

			<Popup open={openRejected} onClose={() => setOpenRejected(false)}>
				<FormRejectedUser uuidRejected={user?.uuid} queryKeys={[QUERY_KEY.table_user]} onClose={() => setOpenRejected(false)} />
			</Popup>
		</div>
	);
}

export default CardUser;
