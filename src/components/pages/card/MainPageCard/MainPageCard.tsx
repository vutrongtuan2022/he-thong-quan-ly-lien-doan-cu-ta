import {Fragment, useState} from 'react';
import styles from './MainPageCard.module.scss';
import {ICard, PropsMainPageCard} from './interfaces';
import SearchBlock from '~/components/utils/SearchBlock';
import FilterCustom from '~/components/common/FilterCustom';
import {QUERY_KEY, STATE_CARD, STATE_USER, TYPE_DATE} from '~/constants/config/enum';
import FilterDateRange from '~/components/common/FilterDateRange';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import MainTable from '~/components/utils/MainTable';
import {Card, CardTick, Category, CloseCircle, Danger, DollarCircle, Eye, TaskSquare, TickCircle} from 'iconsax-react';
import DataWrapper from '~/components/common/DataWrapper';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import moment from 'moment';
import Table from '~/components/common/Table';
import Tippy from '@tippyjs/react';
import Moment from 'react-moment';
import StateActive from '~/components/utils/StateActive';
import IconCustom from '~/components/common/IconCustom';
import GridColumn from '~/components/layouts/GridColumn';
import Pagination from '~/components/common/Pagination';
import Dialog from '~/components/common/Dialog';
import Popup from '~/components/common/Popup';
import PositionContainer from '~/components/common/PositionContainer';
import MainDetailCard from '../MainDetailCard';
import FormRejectedCard from '../FormRejectedCard';
import CardIssuance from '../CardIssuance';
import Link from 'next/link';
import {listExpertise} from '~/common/funcs/data';
import Loading from '~/components/common/Loading';

function MainPageCard({}: PropsMainPageCard) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_view, _uuidCard} = router.query;

	const [keyword, setKeyword] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [expertiseType, setExpertiseType] = useState<number | null>(null);
	const [status, setStatus] = useState<number | null>(null);
	const [cardState, setCardState] = useState<number | null>(null);
	const [typeDate, setTypeDate] = useState<TYPE_DATE>(TYPE_DATE.ALL);
	const [date, setDate] = useState<{from: Date | null; to: Date | null} | null>(null);

	const [uuidConfirmCard, setUuidConfirmCard] = useState<string>('');
	const [uuidConfirmCardIssued, setUuidConfirmCardIssued] = useState<string>('');

	const [uuidConfirmPayment, setUuidConfirmPayment] = useState<string>('');
	const [uuidApprove, setUuidApprove] = useState<string>('');
	const [uuidRejected, setUuidRejected] = useState<string>('');

	const resetFilter = () => {
		setKeyword('');
		setPage(1);
		setPageSize(20);
		setExpertiseType(null);
		setStatus(null);
		setCardState(null);
		setTypeDate(TYPE_DATE.ALL);
		setDate(null);
	};

	const {
		data = {
			items: [],
			pagination: {
				totalCount: 0,
				totalPage: 0,
			},
		},
		isLoading,
	} = useQuery<{
		items: ICard[];
		pagination: {
			totalCount: number;
			totalPage: number;
		};
	}>([QUERY_KEY.table_card, page, pageSize, keyword, status, cardState, expertiseType, date?.from, date?.to], {
		queryFn: () =>
			httpRequest({
				http: userServices.getListUserRegisterCard({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					status: status,
					expertiseType: expertiseType,
					cardState: cardState,
					startDate: date?.from ? moment(date.from).format('YYYY-MM-DD') : null,
					endDate: date?.to ? moment(date.to).format('YYYY-MM-DD') : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Duyệt làm thẻ
	const funcApproveCard = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Duyệt yêu cầu làm thẻ thành công!',
				http: userServices.updateCardStateUser({
					uuid: uuidApprove,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidApprove('');
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
					uuid: uuidConfirmPayment,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidConfirmPayment('');
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
					uuid: uuidConfirmCard,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidConfirmCard('');
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
					uuid: uuidConfirmCardIssued,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidConfirmCardIssued('');
				queryClient.invalidateQueries([QUERY_KEY.table_card]);
			}
		},
	});

	const funcExportData = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: false,
				showMessageSuccess: false,
				http: userServices.exportListUser({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					status: status,
					cardState: cardState,
					expertiseType: expertiseType,
					startDate: date?.from ? moment(date.from).format('YYYY-MM-DD') : null,
					endDate: date?.to ? moment(date.to).format('YYYY-MM-DD') : null,
				}),
			}),
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	return (
		<Fragment>
			<Loading
				loading={
					funcApproveCard.isLoading ||
					funcConfirmPaymenCard.isLoading ||
					funcConfirmCardIssuance.isLoading ||
					funcExportData.isLoading
				}
			/>
			<SearchBlock
				keyword={keyword}
				setKeyword={setKeyword}
				placeholder='Tìm kiếm theo tên người dùng, mã thẻ '
				action={
					<div className={styles.filter}>
						<div className={styles.flex}>
							<FilterDateRange date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} />
							<FilterCustom
								name='Trạng thái'
								value={cardState}
								setValue={setCardState}
								listOption={[
									{
										uuid: STATE_CARD.PENDING_APPROVAL,
										name: 'Chờ duyệt',
									},
									{
										uuid: STATE_CARD.APPROVED,
										name: 'Đã duyệt',
									},
									{
										uuid: STATE_CARD.PAID,
										name: 'Đã đóng tiền',
									},
									{
										uuid: STATE_CARD.PENDING_ISSUED,
										name: 'Chờ phát hành thẻ cứng',
									},
									{
										uuid: STATE_CARD.ISSUED,
										name: 'Đã phát hành thẻ cứng',
									},
									{
										uuid: STATE_CARD.REJECTED,
										name: 'Bị từ chối',
									},
								]}
							/>
							<FilterCustom
								name='Chức vụ'
								value={expertiseType}
								setValue={setExpertiseType}
								listOption={listExpertise?.map((v) => ({
									uuid: v?.value,
									name: v?.name,
								}))}
							/>
						</div>
						<div className={styles.flex}>
							<Button p_8_24 black rounded_8 bold onClick={resetFilter}>
								Đặt lại
							</Button>
							<Button
								p_8_24
								orange
								rounded_8
								bold
								icon={<Image alt='icon download' src={icons.iconBtnDownload} width={16} height={16} />}
								onClick={funcExportData.mutate}
							>
								Xuất dữ liệu
							</Button>
						</div>
					</div>
				}
			/>
			<MainTable
				icon={<Card size={28} color='#FC6A45' variant='Bold' />}
				title='Danh sách yêu cầu phát hành thẻ'
				action={
					<div className={styles.action}>
						<div
							className={clsx(styles.view, {[styles.active]: _view == 'list'})}
							onClick={() =>
								router.replace({
									pathname: router.pathname,
									query: {
										...router.query,
										_view: 'list',
									},
								})
							}
						>
							<Category className={styles.icon_view} size={24} />
						</div>
						<div
							className={clsx(styles.view, {[styles.active]: !_view})}
							onClick={() => {
								const {_view, ...rest} = router.query;

								router.replace({
									pathname: router.pathname,
									query: {
										...rest,
									},
								});
							}}
						>
							<TaskSquare className={styles.icon_view} size={26} />
						</div>
					</div>
				}
			>
				{!_view && (
					<DataWrapper
						loading={isLoading}
						data={data?.items || []}
						title='Danh sách yêu cầu phát hành thẻ trống!'
						note='Danh sách yêu cầu phát hành thẻ hiện đang trống!'
					>
						<Table<ICard>
							data={data?.items || []}
							column={[
								{
									title: 'STT',
									render: (_, index) => <>{index + 1}</>,
								},
								{
									title: 'Mã thẻ thành viên',
									render: (row, _) => (
										<Tippy content='Xem chi tiết'>
											<Link
												href='#'
												className={styles.link}
												onClick={(e) => {
													e.preventDefault();
													router.replace({
														pathname: router.pathname,
														query: {...router.query, _uuidCard: row?.uuid},
													});
												}}
											>
												{row?.code || ''}
											</Link>
										</Tippy>
									),
								},
								{
									title: 'Họ tên',
									render: (row, _) => (
										<div style={{width: '160px', display: 'flex', alignItems: 'center', gap: '8px'}}>
											{row?.imagePath && (
												<Image
													alt='avatar'
													width={36}
													height={36}
													style={{borderRadius: '50%', border: '1px solid #ff8357'}}
													src={`${process.env.NEXT_PUBLIC_IMAGE}/${row?.imagePath}`}
												/>
											)}
											<p>{row?.fullname}</p>
										</div>
									),
								},
								{
									title: 'Chức vụ',
									render: (row, _) => <>{listExpertise?.find((v) => v?.value == row.expertiseType)?.name || '---'}</>,
								},
								{
									title: 'Số điện thoại',
									render: (row, _) => <>{row?.phoneNumber || '---'}</>,
								},
								{
									title: 'Email',
									render: (row, _) => <>{row?.email || '---'}</>,
								},
								{
									title: 'CMND/CCCD',
									render: (row, _) => <>{row?.identityCode || '---'}</>,
								},
								{
									title: 'Ngày đăng ký',
									render: (row, _) => <Moment date={row?.cardCreated} format='DD/MM/YYYY' />,
								},
								{
									title: 'Trạng thái',
									render: (row, _) => (
										<StateActive
											stateActive={row?.cardState}
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
									),
								},
								{
									title: 'Lý do từ chối',
									render: (row, _) => <>{row?.cardRejected || '---'}</>,
								},
								{
									title: 'Tác vụ',
									fixedRight: true,
									render: (row, _) => (
										<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
											{/* Chờ duyệt */}
											{row?.cardState == STATE_CARD.PENDING_APPROVAL && (
												<>
													<IconCustom
														icon={<TickCircle color='#2CAE39' size={24} />}
														tooltip='Xác nhận duyệt yêu cầu làm thẻ'
														background='rgba(44, 174, 57, 0.10)'
														onClick={() => setUuidApprove(row?.uuid)}
													/>
													<IconCustom
														icon={<CloseCircle color='#EB2E2E' size={24} />}
														tooltip='Từ chối yêu cầu'
														background='rgba(244, 97, 97, 0.10)'
														onClick={() => setUuidRejected(row?.uuid)}
													/>
												</>
											)}

											{/* Đã duyệt */}
											{row?.cardState == STATE_CARD.APPROVED && (
												<IconCustom
													icon={<DollarCircle color='#4ECB71' size={24} />}
													tooltip='Xác nhận đã đóng tiền'
													background='rgba(78, 203, 113, 0.10)'
													onClick={() => setUuidConfirmPayment(row?.uuid)}
												/>
											)}

											{/* Đã đóng tiền */}
											{row?.cardState == STATE_CARD.PAID && (
												<IconCustom
													icon={<CardTick color='#3DC5AA' size={24} />}
													tooltip='Xác nhận chờ phát hành thẻ'
													background='rgba(61, 197, 170, 0.10)'
													onClick={() => setUuidConfirmCard(row?.uuid)}
												/>
											)}

											{/* Đã phát hành thẻ */}
											{row?.cardState == STATE_CARD.PENDING_ISSUED && (
												<IconCustom
													icon={<TickCircle color='#3DC5AA' size={24} />}
													tooltip='Xác nhận đã phát hành thẻ'
													background='rgba(0, 183, 196, 0.10)'
													onClick={() => setUuidConfirmCardIssued(row?.uuid)}
												/>
											)}

											{/* Xem chi tiết */}
											<IconCustom
												icon={<Eye color='#6170E3' size={24} />}
												tooltip='Xem chi tiết'
												background='rgba(97, 112, 227, 0.10)'
												onClick={() =>
													router.replace({
														pathname: router.pathname,
														query: {...router.query, _uuidCard: row?.uuid},
													})
												}
											/>
										</div>
									),
								},
							]}
						/>
					</DataWrapper>
				)}
				{_view == 'list' && (
					<DataWrapper
						loading={isLoading}
						data={data?.items || []}
						title='Người dùng trống!'
						note='Danh sách người dùng hiện đang trống!'
					>
						<GridColumn col_4>
							{data?.items?.map((v) => (
								<CardIssuance key={1} card={v} />
							))}
						</GridColumn>
					</DataWrapper>
				)}

				<div className={styles.pagination}>
					<Pagination
						page={page}
						onSetPage={setPage}
						pageSize={pageSize}
						onSetPageSize={setPageSize}
						total={data?.pagination?.totalCount || 0}
						dependencies={[pageSize, keyword, status, cardState, expertiseType, date?.from, date?.to]}
					/>
				</div>
			</MainTable>
			<Dialog
				type='primary'
				open={!!uuidApprove}
				onClose={() => setUuidApprove('')}
				title='Duyệt yêu cầu'
				note='Bạn có chắc chắn muốn duyệt yêu cầu này?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcApproveCard.mutate}
			/>
			<Dialog
				type='primary'
				open={!!uuidConfirmPayment}
				onClose={() => setUuidConfirmPayment('')}
				title='Xác nhận đã đóng tiền'
				note='Bạn có chắc chắn muốn xác nhận này đã đóng tiền không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmPaymenCard.mutate}
			/>
			<Dialog
				type='primary'
				open={!!uuidConfirmCard}
				onClose={() => setUuidConfirmCard('')}
				title='Xác nhận chờ phát hành thẻ'
				note='Bạn có chắc chắn muốn xác nhận chờ đã phát hành thẻ không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmCardIssuance.mutate}
			/>
			<Dialog
				type='primary'
				open={!!uuidConfirmCardIssued}
				onClose={() => setUuidConfirmCardIssued('')}
				title='Phát hành thẻ'
				note='Bạn có chắc chắn muốn xác nhận đã phát hành thẻ không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmCardIssued.mutate}
			/>
			<Popup open={!!uuidRejected} onClose={() => setUuidRejected('')}>
				<FormRejectedCard uuidRejected={uuidRejected} queryKeys={[QUERY_KEY.table_card]} onClose={() => setUuidRejected('')} />
			</Popup>
			<PositionContainer
				open={!!_uuidCard}
				onClose={() => {
					const {_uuidCard, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<MainDetailCard
					onClose={() => {
						const {_uuidCard, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>
		</Fragment>
	);
}

export default MainPageCard;
