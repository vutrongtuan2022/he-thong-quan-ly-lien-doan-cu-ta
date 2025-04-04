import React, {Fragment, useState} from 'react';

import {IUser, PropsMainPageHome} from './interfaces';
import styles from './MainPageHome.module.scss';
import SearchBlock from '~/components/utils/SearchBlock';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import FilterCustom from '~/components/common/FilterCustom';
import MainTable from '~/components/utils/MainTable';
import {CardTick, Category, CloseCircle, Danger, DollarCircle, Eye, TaskSquare, TickCircle, User} from 'iconsax-react';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import GridColumn from '~/components/layouts/GridColumn';
import CardUser from '../CardUser';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import StateActive from '~/components/utils/StateActive';
import IconCustom from '~/components/common/IconCustom';
import FilterDateRange from '~/components/common/FilterDateRange';
import {QUERY_KEY, STATE_USER, TYPE_DATE} from '~/constants/config/enum';
import Dialog from '~/components/common/Dialog';
import Popup from '~/components/common/Popup';
import FormRejectedUser from '../FormRejectedUser';
import PositionContainer from '~/components/common/PositionContainer';
import MainDetailUser from '../MainDetailUser';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import {listExpertise} from '~/common/funcs/data';
import moment from 'moment';
import Moment from 'react-moment';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import Loading from '~/components/common/Loading';

function MainPageHome({}: PropsMainPageHome) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_view, _uuidUser} = router.query;

	const [keyword, setKeyword] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [expertiseType, setExpertiseType] = useState<number | null>(null);
	const [state, setState] = useState<number | null>(null);
	const [typeDateDefault, setTypeDateDefault] = useState<TYPE_DATE>(TYPE_DATE.ALL);
	const [date, setDate] = useState<{from: Date | null; to: Date | null} | null>(null);

	const [uuidConfirmCard, setUuidConfirmCard] = useState<string>('');
	const [uuidConfirmPayment, setUuidConfirmPayment] = useState<string>('');
	const [uuidApprove, setUuidApprove] = useState<string>('');
	const [uuidRejected, setUuidRejected] = useState<string>('');

	const resetFilter = () => {
		setKeyword('');
		setPage(1);
		setPageSize(20);
		setExpertiseType(null);
		setState(null);
		setTypeDateDefault(TYPE_DATE.ALL);
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
		items: IUser[];
		pagination: {
			totalCount: number;
			totalPage: number;
		};
	}>([QUERY_KEY.table_user, page, pageSize, keyword, state, expertiseType, date?.from, date?.to], {
		queryFn: () =>
			httpRequest({
				http: userServices.getListUser({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					state: state,
					expertiseType: expertiseType,
					startDate: date?.from ? moment(date.from).format('YYYY-MM-DD') : null,
					endDate: date?.to ? moment(date.to).format('YYYY-MM-DD') : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Duyệt thành viên
	const funcApproveUser = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Duyệt thành viên thành công!',
				http: userServices.updateStateUser({
					uuid: uuidApprove,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidApprove('');
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
					uuid: uuidConfirmPayment,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidConfirmPayment('');
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
					uuid: uuidConfirmCard,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidConfirmCard('');
				queryClient.invalidateQueries([QUERY_KEY.table_user]);
			}
		},
	});

	return (
		<Fragment>
			<Loading loading={funcApproveUser.isLoading || funcConfirmPaymenUser.isLoading || funcConfirmCardUser.isLoading} />
			<SearchBlock
				keyword={keyword}
				setKeyword={setKeyword}
				placeholder='Tìm kiếm theo tên người dùng, mã thẻ'
				action={
					<div className={styles.filter}>
						<div className={styles.flex}>
							<FilterCustom
								name='Nghề nghiệp'
								value={expertiseType}
								setValue={setExpertiseType}
								listOption={listExpertise?.map((v) => ({
									uuid: v?.value,
									name: v?.name,
								}))}
							/>
							<FilterCustom
								name='Trạng thái'
								value={state}
								setValue={setState}
								listOption={[
									{
										uuid: STATE_USER.PENDING_APPROVAL,
										name: 'Chờ duyệt',
									},
									{
										uuid: STATE_USER.APPROVED,
										name: 'Đã duyệt',
									},
									{
										uuid: STATE_USER.PAID,
										name: 'Đã đóng tiền',
									},
									{
										uuid: STATE_USER.ISSUED,
										name: 'Đã phát hành thẻ cứng',
									},
									{
										uuid: STATE_USER.REJECTED,
										name: 'Bị từ chối',
									},
								]}
							/>
							<FilterDateRange typeDateDefault={typeDateDefault} date={date} setDate={setDate} />
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
							>
								Xuất dữ liệu
							</Button>
						</div>
					</div>
				}
			/>
			<MainTable
				icon={<User size={28} color='#FC6A45' variant='Bold' />}
				title='Danh sách người đăng ký'
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
						title='Người dùng trống!'
						note='Danh sách người dùng hiện đang trống!'
					>
						<Table<IUser>
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
														query: {...router.query, _uuidUser: row?.uuid},
													});
												}}
											>
												{row?.code}
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
									title: 'Nghề nghiệp',
									render: (row, _) => <>{listExpertise?.find((v) => v?.value == row.expertiseType)?.name}</>,
								},
								{
									title: 'Số điện thoại',
									render: (row, _) => <>{row.phoneNumber}</>,
								},
								{
									title: 'Email',
									render: (row, _) => <>{row.email}</>,
								},
								{
									title: 'CMND/CCCD',
									render: (row, _) => <>{row.identityCode}</>,
								},
								{
									title: 'Ngày đăng ký',
									render: (row, _) => <Moment date={row.created} format='DD/MM/YYYY' />,
								},
								{
									title: 'Trạng thái',
									render: (row, _) => (
										<StateActive
											stateActive={row.state}
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
									),
								},
								{
									title: 'Lý do từ chối',
									render: (row, _) => <>{row.rejectedReason || '---'}</>,
								},
								{
									title: 'Tác vụ',
									fixedRight: true,
									render: (row, _) => (
										<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
											{/* Chờ duyệt */}
											{row?.state == STATE_USER.PENDING_APPROVAL && (
												<>
													<IconCustom
														icon={<TickCircle color='#2CAE39' size={24} />}
														tooltip='Duyệt thành viên'
														background='rgba(44, 174, 57, 0.10)'
														onClick={() => setUuidApprove(row?.uuid)}
													/>
													<IconCustom
														icon={<CloseCircle color='#EB2E2E' size={24} />}
														tooltip='Từ chối thành viên'
														background='rgba(244, 97, 97, 0.10)'
														onClick={() => setUuidRejected(row?.uuid)}
													/>
												</>
											)}

											{/* Đã duyệt */}
											{row?.state == STATE_USER.APPROVED && (
												<IconCustom
													icon={<DollarCircle color='#4ECB71' size={24} />}
													tooltip='Xác nhận đã đóng tiền'
													background='rgba(78, 203, 113, 0.10)'
													onClick={() => setUuidConfirmPayment(row?.uuid)}
												/>
											)}

											{/* Đã đóng tiền */}
											{row?.state == STATE_USER.PAID && (
												<IconCustom
													icon={<CardTick color='#3DC5AA' size={24} />}
													tooltip='Xác nhận đã phát hành thẻ cứng'
													background='rgba(61, 197, 170, 0.10)'
													onClick={() => setUuidConfirmCard(row?.uuid)}
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
														query: {...router.query, _uuidUser: row?.uuid},
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
								<CardUser key={v?.uuid} user={v} />
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
						dependencies={[pageSize, keyword, state, expertiseType, date?.from, date?.to]}
					/>
				</div>
			</MainTable>

			<Dialog
				type='primary'
				open={!!uuidApprove}
				onClose={() => setUuidApprove('')}
				title='Duyệt thành viên'
				note='Bạn có chắc chắn muốn duyệt thành viên này?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcApproveUser.mutate}
			/>

			<Dialog
				type='primary'
				open={!!uuidConfirmPayment}
				onClose={() => setUuidConfirmPayment('')}
				title='Xác nhận đã đóng tiền'
				note='Bạn có chắc chắn muốn xác nhận thành viên này đã đóng tiền không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmPaymenUser.mutate}
			/>

			<Dialog
				type='primary'
				open={!!uuidConfirmCard}
				onClose={() => setUuidConfirmCard('')}
				title='Xác nhận đã phát hành thẻ'
				note='Bạn có chắc chắn muốn xác nhận thành viên này đã phát hành thẻ không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcConfirmCardUser.mutate}
			/>

			<Popup open={!!uuidRejected} onClose={() => setUuidRejected('')}>
				<FormRejectedUser uuidRejected={uuidRejected} queryKeys={[QUERY_KEY.table_user]} onClose={() => setUuidRejected('')} />
			</Popup>

			<PositionContainer
				open={!!_uuidUser}
				onClose={() => {
					const {_uuidUser, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<MainDetailUser
					onClose={() => {
						const {_uuidUser, ...rest} = router.query;

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

export default MainPageHome;
