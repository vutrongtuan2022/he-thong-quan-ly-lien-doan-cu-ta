import React, {useState} from 'react';

import {PropsCardIssuance} from './interfaces';
import styles from './CardIssuance.module.scss';
import StateActive from '~/components/utils/StateActive';
import Image from 'next/image';
import {CardTick, CloseCircle, Danger, DollarCircle, Eye, TickCircle} from 'iconsax-react';
import {QUERY_KEY, STATE_CARD, STATE_USER} from '~/constants/config/enum';
import Moment from 'react-moment';
import {listExpertise} from '~/common/funcs/data';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import Popup from '~/components/common/Popup';
import FormRejectedCard from '../FormRejectedCard';
import {useRouter} from 'next/router';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';

function CardIssuance({card}: PropsCardIssuance) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [openApprove, setOpenApprove] = useState<boolean>(false);
	const [openRejected, setOpenRejected] = useState<boolean>(false);
	const [openConfirmPayment, setOpenConfirmPaymen] = useState<boolean>(false);
	const [openConfirmCard, setOpenConfirmCard] = useState<boolean>(false);
	const [openConfirmCardIssued, setOpenConfirmCardIssued] = useState<boolean>(false);

	// Duyệt làm thẻ
	const funcApproveCard = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Duyệt yêu cầu làm thẻ thành công!',
				http: userServices.updateCardStateUser({
					uuid: card?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenApprove(false);
				queryClient.invalidateQueries([QUERY_KEY.table_card]);
			}
		},
	});

	// Xác nhận đã đóng tiền
	const funcConfirmPaymenCard = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận đóng tiền thành công!',
				http: userServices.updateCardStateUser({
					uuid: card?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenConfirmPaymen(false);
				queryClient.invalidateQueries([QUERY_KEY.table_card]);
			}
		},
	});

	// Xác nhận chờ phát hành thẻ
	const funcConfirmCardIssuance = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận chờ phát hành thẻ thành công!',
				http: userServices.updateCardStateUser({
					uuid: card?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenConfirmCard(false);
				queryClient.invalidateQueries([QUERY_KEY.table_card]);
			}
		},
	});

	// Xác nhận đã phát hành thẻ
	const funcConfirmCardIssued = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận phát hành thẻ thành công!',
				http: userServices.updateCardStateUser({
					uuid: card?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenConfirmCardIssued(false);
				queryClient.invalidateQueries([QUERY_KEY.table_card]);
			}
		},
	});

	return (
		<div className={styles.cart}>
			<div className={styles.top}>
				{/* <p>{card?.code}</p> */}
				<StateActive
					borderRadius={24}
					stateActive={card?.cardState}
					listState={[
						{
							state: STATE_CARD.PENDING_APPROVAL,
							text: 'Chờ duyệt',
							backgroundColor: '#FD8B6E',
							textColor: '#fff',
						},
						{
							state: STATE_CARD.APPROVED,
							text: 'Đã duyệt',
							backgroundColor: '#4BC9F0',
							textColor: '#fff',
						},
						{
							state: STATE_CARD.PAID,
							text: 'Đã đóng tiền',
							backgroundColor: '#4ECB71',
							textColor: '#fff',
						},
						{
							state: STATE_CARD.ISSUED,
							text: 'Đã phát hành thẻ cứng',
							backgroundColor: 'rgba(68, 132, 255, 0.10)',
							textColor: '#4484FF',
						},
						{
							state: STATE_CARD.PENDING_ISSUED,
							text: 'Chờ phát hành thẻ cứng',
							backgroundColor: '#4484FF',
							textColor: '#fff',
						},
						{
							state: STATE_CARD.REJECTED,
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
					{card?.imagePath && (
						<Image
							alt='avatar'
							src={`${process.env.NEXT_PUBLIC_IMAGE}/${card?.imagePath}`}
							width={36}
							height={36}
							className={styles.avatar}
						/>
					)}
					<div className={styles.name}>
						<p>{card?.fullname}</p>
						<p>{listExpertise?.find((v) => v?.value == card.expertiseType)?.name}</p>
					</div>
				</div>
				<div className={styles.item}>
					<p>Điện thoại:</p>
					<p>{card?.phoneNumber || '---'}</p>
				</div>
				<div className={styles.item}>
					<p>Email:</p>
					<p>{card?.email || '---'}</p>
				</div>
				<div className={styles.item}>
					<p>CMND/CCCD:</p>
					<p>{card?.identityCode}</p>
				</div>
				<div className={styles.item}>
					<p>Ngày đăng ký:</p>
					<p>{card?.cardCreated ? <Moment date={card?.cardCreated} format='DD/MM/YYYY' /> : '---'}</p>
				</div>
			</div>
			<div className={styles.control}>
				{/* Chờ duyệt */}
				{card?.cardState == STATE_CARD.PENDING_APPROVAL && (
					<>
						<Tippy content='Xác nhận duyệt yêu cầu làm thẻ'>
							<div className={styles.action} onClick={() => setOpenApprove(true)}>
								<TickCircle size={24} color='#2CAE39' />
							</div>
						</Tippy>
						<Tippy content='Từ chối yêu cầu'>
							<div className={styles.action} onClick={() => setOpenRejected(true)}>
								<CloseCircle size={24} color='#EB2E2E' />
							</div>
						</Tippy>
					</>
				)}

				{/* Đã duyệt */}
				{card?.cardState == STATE_CARD.APPROVED && (
					<Tippy content='Xác nhận đã đóng tiền'>
						<div className={styles.action} onClick={() => setOpenConfirmPaymen(true)}>
							<DollarCircle size={24} color='#4ECB71' />
						</div>
					</Tippy>
				)}

				{/* Đã đóng tiền */}
				{card?.cardState == STATE_CARD.PAID && (
					<Tippy content='Xác nhận chờ phát hành thẻ'>
						<div className={styles.action} onClick={() => setOpenConfirmCard(true)}>
							<CardTick size={24} color='#3DC5AA' />
						</div>
					</Tippy>
				)}

				{/* Đã phát hành thẻ */}
				{card?.cardState == STATE_CARD.PENDING_ISSUED && (
					<Tippy content='Xác nhận đã phát hành thẻ'>
						<div className={styles.action} onClick={() => setOpenConfirmCardIssued(true)}>
							<TickCircle size={24} color='#3DC5AA' />
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
								query: {...router.query, _uuidCard: card?.uuid},
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
				title='Duyệt yêu cầu'
				note='Bạn có chắc chắn muốn duyệt yêu cầu này?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcApproveCard.mutate}
			/>

			<Dialog
				type='primary'
				open={openConfirmPayment}
				onClose={() => setOpenConfirmPaymen(false)}
				title='Xác nhận đã đóng tiền'
				note='Bạn có chắc chắn muốn xác nhận đã đóng tiền không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmPaymenCard.mutate}
			/>

			<Dialog
				type='primary'
				open={openConfirmCard}
				onClose={() => setOpenConfirmCard(false)}
				title='Xác nhận chờ phát hành thẻ'
				note='Bạn có chắc chắn muốn xác nhận chờ phát hành thẻ không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmCardIssuance.mutate}
			/>

			<Dialog
				type='primary'
				open={openConfirmCardIssued}
				onClose={() => setOpenConfirmCardIssued(false)}
				title='Phát hành thẻ'
				note='Bạn có chắc chắn muốn xác nhận phát hành thẻ không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmCardIssued.mutate}
			/>

			<Popup open={openRejected} onClose={() => setOpenRejected(false)}>
				<FormRejectedCard uuidRejected={card?.uuid} queryKeys={[QUERY_KEY.table_card]} onClose={() => setOpenRejected(false)} />
			</Popup>
		</div>
	);
}

export default CardIssuance;
