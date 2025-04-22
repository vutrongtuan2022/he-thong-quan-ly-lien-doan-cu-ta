import React, {useState} from 'react';

import {ICardDetail, PropsMainDetailCard} from './interfaces';
import styles from './MainDetailCard.module.scss';
import Button from '~/components/common/Button';
import StateActive from '~/components/utils/StateActive';
import Image from 'next/image';
import GridColumn from '~/components/layouts/GridColumn';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {GENDER, QUERY_KEY, STATE_CARD, STATE_USER} from '~/constants/config/enum';

import Moment from 'react-moment';

import Popup from '~/components/common/Popup';
import FormRejectedCard from '../FormRejectedCard';
import Dialog from '~/components/common/Dialog';
import {Danger} from 'iconsax-react';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import {listEducation, listExpertise} from '~/common/funcs/data';
import {getTextAddress} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';

function MainDetailCard({onClose}: PropsMainDetailCard) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuidCard} = router.query;

	const [openApprove, setOpenApprove] = useState<boolean>(false);
	const [openRejected, setOpenRejected] = useState<boolean>(false);
	const [openConfirmPayment, setOpenConfirmPayment] = useState<boolean>(false);
	const [openConfirmCard, setOpenConfirmCard] = useState<boolean>(false);
	const [openConfirmCardIssued, setOpenConfirmCardIssued] = useState<boolean>(false);

	const {data: card} = useQuery<ICardDetail>([QUERY_KEY.detail_card, _uuidCard], {
		queryFn: () =>
			httpRequest({
				http: userServices.getDetailCardUser({
					uuid: _uuidCard as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuidCard,
	});

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
				queryClient.invalidateQueries([QUERY_KEY.detail_card]);
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
				setOpenConfirmPayment(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_card]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_card]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_card]);
				queryClient.invalidateQueries([QUERY_KEY.table_card]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading
				loading={
					funcApproveCard.isLoading ||
					funcConfirmPaymenCard.isLoading ||
					funcConfirmCardIssuance.isLoading ||
					funcConfirmCardIssued.isLoading
				}
			/>

			<div className={styles.head}>
				<div className={styles.info}>
					<h4>
						Chi tiết thành viên
						{/* <span>#{card?.code || '---'}</span> */}
					</h4>
					<div className={styles.status}>
						<p>Trạng thái yêu cầu:</p>
						<StateActive
							isSmall={true}
							stateActive={card?.cardState!}
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
						<div className={styles.line}></div>
						<p>
							Ngày đăng ký:
							<span style={{marginLeft: '4px'}}>
								{card?.cardCreated ? <Moment date={card?.cardCreated} format='DD/MM/YYYY' /> : '---'}
							</span>
						</p>
					</div>
				</div>
				<div className={styles.group_btn}>
					{/* Chờ duyệt */}
					{card?.cardState == STATE_USER.PENDING_APPROVAL && (
						<>
							<Button green p_8_24 rounded_8 onClick={() => setOpenApprove(true)}>
								Duyệt yêu cầu
							</Button>
							<Button red p_8_24 rounded_8 onClick={() => setOpenRejected(true)}>
								Từ chối yêu cầu
							</Button>
						</>
					)}
					{/* Đã duyệt */}
					{card?.cardState == STATE_USER.APPROVED && (
						<Button blue p_8_24 rounded_8 onClick={() => setOpenConfirmPayment(true)}>
							Xác nhận đã đóng tiền
						</Button>
					)}
					{/* Đã đóng tiền */}
					{card?.cardState == STATE_USER.PAID && (
						<Button blue p_8_24 rounded_8 onClick={() => setOpenConfirmCard(true)}>
							Xác nhận chờ phát hành thẻ cứng
						</Button>
					)}
					{/* Chờ phát hành thẻ cứng */}
					{card?.cardState == STATE_USER.ISSUED && (
						<Button blue p_8_24 rounded_8 onClick={() => setOpenConfirmCardIssued(true)}>
							Xác nhận đã phát hành thẻ cứng
						</Button>
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
					{card?.imageCardPath && (
						<Image
							alt='Avatar'
							src={`${process.env.NEXT_PUBLIC_IMAGE}/${card?.imageCardPath}`}
							width={80}
							height={80}
							className={styles.avatar}
						/>
					)}
					<GridColumn col_5>
						<div className={styles.item}>
							<p>Họ và tên</p>
							<p>{card?.fullname}</p>
						</div>
						<div className={styles.item}>
							<p>Ngày sinh</p>
							<p>
								<Moment date={card?.birthday} format='DD/MM/YYYY' />
							</p>
						</div>
						<div className={styles.item}>
							<p>Giới tính</p>
							<p>
								{card?.gender == GENDER?.MALE && 'Nam'}
								{card?.gender == GENDER?.FEMALE && 'Nữ'}
							</p>
						</div>
						<div className={styles.item}>
							<p>Chiều cao (cm)</p>
							<p>{card?.height || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Cân nặng (kg)</p>
							<p>{card?.weight || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Tình trạng học vấn</p>
							<p>{listEducation?.find((v) => v?.value == card?.education)?.name}</p>
						</div>
						<div className={styles.item}>
							<p>Chức vụ</p>
							<p>{listExpertise?.find((v) => v?.value == card?.expertiseType)?.name || '---'}</p>
						</div>

						<div className={styles.item}>
							<p>Số điện thoại liên lạc</p>
							<p>{card?.phoneNumber}</p>
						</div>
						<div className={styles.item}>
							<p>Email</p>
							<p>{card?.email}</p>
						</div>
						{card?.cardState == STATE_USER.REJECTED && (
							<div className={styles.item}>
								<p>Lý do từ chối</p>
								<p>{card?.cardRejected || '---'}</p>
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
						<p>{getTextAddress(card?.addressInfo)}</p>
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
							<p>{card?.identityCode}</p>
						</div>
						<div className={styles.item}>
							<p>Nơi cấp CMND/CCCD</p>
							<p>{card?.identityPlace}</p>
						</div>
						<div className={styles.item}>
							<p>Ngày cấp CMND/CCCD</p>
							<p>
								<Moment date={card?.identityDate} format='DD/MM/YYYY' />
							</p>
						</div>
						<div className={styles.item}>
							<p>Ảnh mặt trước CMND/CCCD</p>
							<Image
								alt='Ảnh CCCD mặt trước'
								src={`${process?.env?.NEXT_PUBLIC_IMAGE}/${card?.frontIdentityPath}`}
								height={216}
								width={368}
								style={{borderRadius: '8px'}}
							/>
						</div>
						<div className={styles.item}>
							<p>Ảnh mặt sau CMND/CCCD</p>
							<Image
								alt='Ảnh CCCD mặt sau'
								src={`${process?.env?.NEXT_PUBLIC_IMAGE}/${card?.backIdentityPath}`}
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
				onSubmit={funcApproveCard.mutate}
			/>

			<Dialog
				type='primary'
				open={openConfirmPayment}
				onClose={() => setOpenConfirmPayment(false)}
				title='Xác nhận đã đóng tiền'
				note='Bạn có chắc chắn muốn xác nhận thành viên này đã đóng tiền không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmPaymenCard.mutate}
			/>

			<Dialog
				type='primary'
				open={!!openConfirmCard}
				onClose={() => setOpenConfirmCard(false)}
				title='Xác nhận chờ phát hành thẻ'
				note='Bạn có chắc chắn muốn xác nhận chờ phát hành thẻ không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmCardIssuance.mutate}
			/>
			<Dialog
				type='primary'
				open={!!openConfirmCardIssued}
				onClose={() => setOpenConfirmCardIssued(false)}
				title='Phát hành thẻ'
				note='Bạn có chắc chắn muốn xác nhận phát hành thẻ không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmCardIssued.mutate}
			/>

			<Popup open={openRejected} onClose={() => setOpenRejected(false)}>
				<FormRejectedCard
					uuidRejected={_uuidCard as string}
					queryKeys={[QUERY_KEY.detail_card, QUERY_KEY.table_card]}
					onClose={() => setOpenRejected(false)}
				/>
			</Popup>
		</div>
	);
}

export default MainDetailCard;
