import React, {useState} from 'react';

import {PropsCardUser} from './interfaces';
import styles from './CardUser.module.scss';
import StateActive from '~/components/utils/StateActive';
import Image from 'next/image';
import {CardTick, CloseCircle, Danger, DollarCircle, Eye, TickCircle} from 'iconsax-react';
import {QUERY_KEY, STATE_CARD, STATE_USER} from '~/constants/config/enum';
import Moment from 'react-moment';
import {listExpertise} from '~/common/funcs/data';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import Popup from '~/components/common/Popup';
import {useRouter} from 'next/router';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import FormRejectedUser from '../FormRejectedUser';

function CardUser({user}: PropsCardUser) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [openApprove, setOpenApprove] = useState<boolean>(false);
	const [openRejected, setOpenRejected] = useState<boolean>(false);

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

	return (
		<div className={styles.user}>
			<div className={styles.top}>
				{/* <p>{card?.code}</p> */}
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
					<p>{user?.phoneNumber || '---'}</p>
				</div>
				<div className={styles.item}>
					<p>Email:</p>
					<p>{user?.email || '---'}</p>
				</div>
				<div className={styles.item}>
					<p>CMND/CCCD:</p>
					<p>{user?.identityCode}</p>
				</div>
				<div className={styles.item}>
					<p>Ngày đăng ký:</p>
					<p>
						<Moment date={user?.created} format='DD/MM/YYYY' />
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

				<Tippy content='Xem chi tiết'>
					<Link
						href='#'
						className={styles.action}
						onClick={(e) => {
							e.preventDefault();
							router.replace(
								{
									pathname: router.pathname,
									query: {...router.query, _uuidUser: user?.uuid},
								},
								undefined,
								{
									scroll: false,
									shallow: false,
								}
							);
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

			<Popup open={openRejected} onClose={() => setOpenRejected(false)}>
				<FormRejectedUser uuidRejected={user?.uuid} queryKeys={[QUERY_KEY.table_user]} onClose={() => setOpenRejected(false)} />
			</Popup>
		</div>
	);
}

export default CardUser;
