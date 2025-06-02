import React, {Fragment, useState} from 'react';
import Image from 'next/image';
import {IMember, PropsMainPageMember} from './interfaces';
import styles from './MainPageMember.module.scss';
import SearchBlock from '~/components/utils/SearchBlock';
import MainTable from '~/components/utils/MainTable';
import {Crown1, Danger, Edit, Eye, People} from 'iconsax-react';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import StateActive from '~/components/utils/StateActive';
import IconCustom from '~/components/common/IconCustom';
import Pagination from '~/components/common/Pagination';
import Dialog from '~/components/common/Dialog';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_STATUS, QUERY_KEY, STATE_CARD} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';
import FilterCustom from '~/components/common/FilterCustom';
import Button from '~/components/common/Button';
import {listExpertise} from '~/common/funcs/data';
import {useRouter} from 'next/router';
import Popup from '~/components/common/Popup';
import FormCreateExpertise from '../FormCreateExpertise';
import FormUpdateExpertise from '../FormUpdateExpertise';
import PositionContainer from '~/components/common/PositionContainer';
import MainDetailMember from '../MainDetailMember';
import ImportExcel from '~/components/utils/ImportExcel';

function MainPageMember({}: PropsMainPageMember) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const {_uuidCreate, _uuidUpdate, _uuidMember, _action} = router.query;

	const [file, setFile] = useState<File | null>(null);
	const [keyword, setKeyword] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [status, setStatus] = useState<number | null>(null);
	const [uuidLocked, setUuidLocked] = useState<string>('');
	const [uuidOpen, setUuidOpen] = useState<string>('');
	const [expertiseType, setExpertiseType] = useState<number | null>(null);

	const resetFilter = () => {
		setKeyword('');
		setPage(1);
		setExpertiseType(null);
		setPageSize(20);
		setStatus(null);
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
		items: IMember[];
		pagination: {
			totalCount: number;
			totalPage: number;
		};
	}>([QUERY_KEY.table_member, page, pageSize, status, keyword, expertiseType], {
		queryFn: () =>
			httpRequest({
				http: accountServices.listUserAccount({
					page: page,
					pageSize: pageSize,
					status: status,
					keyword: keyword,
					expertiseType: expertiseType,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcLocked = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Khóa thành viên thành công!',
				http: accountServices.updateStatus({
					uuid: uuidLocked,
					status: CONFIG_STATUS.LOCKED,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidLocked('');
				queryClient.invalidateQueries([QUERY_KEY.table_member]);
			}
		},
	});

	const funcOpen = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Mở khóa thành viên thành công!',
				http: accountServices.updateStatus({
					uuid: uuidOpen,
					status: CONFIG_STATUS.ACTIVE,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidOpen('');
				queryClient.invalidateQueries([QUERY_KEY.table_member]);
			}
		},
	});

	const fucnImportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				http: accountServices.importExcel({
					FileData: file!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseImportExcel();
				queryClient.invalidateQueries([QUERY_KEY.table_member]);
			}
		},
	});

	const handleCloseImportExcel = () => {
		const {_action, ...rest} = router.query;

		setFile(null);
		router.replace(
			{
				query: rest,
			},
			undefined,
			{scroll: false}
		);
	};

	const handleImportExcel = async () => {
		return fucnImportExcel.mutate();
	};

	return (
		<Fragment>
			<Loading loading={funcLocked.isLoading || funcOpen.isLoading || fucnImportExcel.isLoading} />
			<SearchBlock
				keyword={keyword}
				setKeyword={setKeyword}
				placeholder='Tìm kiếm theo họ tên, email, số điện thoại'
				action={
					<div className={styles.filter}>
						<div className={styles.flex}>
							<FilterCustom
								name='Trạng thái'
								value={status}
								setValue={setStatus}
								listOption={[
									{
										uuid: CONFIG_STATUS.ACTIVE,
										name: 'Hoạt động',
									},
									{
										uuid: CONFIG_STATUS.LOCKED,
										name: 'Đang khóa',
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
								green
								rounded_8
								bold
								onClick={() =>
									router.replace(
										{
											pathname: router.pathname,
											query: {
												...router.query,
												_action: 'import-excel',
											},
										},
										undefined,
										{
											scroll: false,
											shallow: false,
										}
									)
								}
							>
								Import excel
							</Button>
						</div>
					</div>
				}
			/>

			<MainTable icon={<People size={28} color='#FC6A45' variant='Bold' />} title='Danh sách thành viên'>
				<DataWrapper
					data={data?.items || []}
					loading={isLoading}
					title='Thành viên trống!'
					note='Danh sách thành viên hiện đang trống!'
				>
					<Table<IMember>
						data={data?.items || []}
						column={[
							{
								title: 'STT',
								render: (_, index) => <>{index + 1}</>,
							},
							{
								title: 'Họ tên',
								render: (row, _) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
										{row?.userInfo?.imageCardPath && (
											<div style={{position: 'relative', width: 36, height: 36}}>
												<Image
													fill
													alt='avatar'
													style={{borderRadius: '50%', border: '1px solid #ff8357'}}
													src={`${process.env.NEXT_PUBLIC_IMAGE}/${row?.userInfo?.imageCardPath}`}
												/>
											</div>
										)}
										<p style={{flex: '1'}}>{row?.userInfo?.fullname}</p>
									</div>
								),
							},
							{
								title: 'Số điện thoại',
								render: (row, _) => <>{row?.userInfo?.phoneNumber}</>,
							},
							{
								title: 'Email',
								render: (row, _) => <>{row?.email}</>,
							},
							{
								title: 'Nhóm quyền',
								render: (row, _) => <>{row?.role?.name}</>,
							},
							{
								title: 'Chức vụ',
								render: (row, _) => <>{listExpertise?.find((v) => v?.value == row.expertiseType)?.name || '---'}</>,
							},
							{
								title: 'Mã thẻ thành viên',
								render: (row, _) => <>{row?.userInfo?.code || '---'}</>,
							},
							{
								title: 'Ngày đăng ký',
								render: (row, _) => <>{row.created ? <Moment date={row.created} format='DD/MM/YYYY' /> : '---'}</>,
							},
							{
								title: 'Trạng thái',
								render: (row, _) => (
									<StateActive
										stateActive={row?.status}
										listState={[
											{
												state: CONFIG_STATUS.ACTIVE,
												text: 'Hoạt động',
												backgroundColor: '#33C041',
												textColor: '#fff',
											},
											{
												state: CONFIG_STATUS.LOCKED,
												text: 'Đang khóa',
												backgroundColor: '#FD8B6E',
												textColor: '#fff',
											},
										]}
									/>
								),
							},
							{
								title: 'Phát hành thẻ',
								render: (row, _) => (
									<StateActive
										stateActive={row?.cardState}
										listState={[
											{
												state: STATE_CARD.ISSUED,
												text: 'Đã phát hành',
												backgroundColor: 'rgba(68, 132, 255, 0.10)',
												textColor: '#4484FF',
											},
										]}
									/>
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (row, _) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										{row?.expertiseType == null ? (
											<IconCustom
												icon={<Crown1 color='#6170E3' size={24} />}
												tooltip='Thêm chức vụ'
												background=' rgba(55, 114, 255, 0.10)'
												onClick={() =>
													router.replace(
														{
															pathname: router.pathname,
															query: {
																...router.query,
																_uuidCreate: row?.userInfo.uuid,
															},
														},
														undefined,
														{
															scroll: false,
															shallow: false,
														}
													)
												}
											/>
										) : (
											<IconCustom
												icon={<Edit color='#6170E3' size={24} />}
												tooltip='Chỉnh sửa chức vụ'
												background=' rgba(55, 114, 255, 0.10)'
												onClick={() =>
													router.replace(
														{
															pathname: router.pathname,
															query: {
																...router.query,
																_uuidUpdate: row?.userInfo.uuid,
															},
														},
														undefined,
														{
															scroll: false,
															shallow: false,
														}
													)
												}
											/>
										)}
										{row?.status === CONFIG_STATUS.ACTIVE && (
											<IconCustom
												icon={<HiOutlineLockClosed color='#FA4B4B' size={24} />}
												tooltip='Khóa thành viên'
												background='rgba(250, 75, 75, 0.10)'
												onClick={() => {
													setUuidLocked(row?.uuid);
												}}
											/>
										)}
										{row?.status === CONFIG_STATUS.LOCKED && (
											<IconCustom
												icon={<HiOutlineLockOpen color=' #33C041' size={24} />}
												tooltip='Mở khóa thành viên'
												background='rgba(51, 192, 65, 0.10)'
												onClick={() => {
													setUuidOpen(row?.uuid);
												}}
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
													query: {...router.query, _uuidMember: row?.userInfo?.uuid},
												})
											}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>

				<div className={styles.pagination}>
					<Pagination
						page={page}
						onSetPage={setPage}
						pageSize={pageSize}
						onSetPageSize={setPageSize}
						total={data?.pagination?.totalCount || 0}
						dependencies={[pageSize, keyword, status]}
					/>
				</div>
			</MainTable>

			<Dialog
				type='primary'
				open={!!uuidOpen}
				onClose={() => setUuidOpen('')}
				title='Xác nhận mở khóa thành viên'
				note='Bạn có chắc chắn muốn mở khóa thành viên không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcOpen.mutate}
			/>

			<Dialog
				type='error'
				open={!!uuidLocked}
				onClose={() => setUuidLocked('')}
				title='Xác nhận khóa thành viên'
				note={`Bạn có chắc chắn muốn khóa thành viên không?`}
				icon={<Danger size='76' color='#F46161' variant='Bold' />}
				onSubmit={funcLocked.mutate}
			/>

			{/* thêm mới chức vụ */}
			<Popup
				open={!!_uuidCreate}
				onClose={() => {
					const {_uuidCreate, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormCreateExpertise
					uuid={_uuidCreate as string}
					queryKeys={[QUERY_KEY.table_member]}
					onClose={() => {
						const {_uuidCreate, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: rest,
						});
					}}
				/>
			</Popup>

			{/* chỉnh sửa chức vụ */}
			<Popup
				open={!!_uuidUpdate}
				onClose={() => {
					const {_uuidUpdate, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormUpdateExpertise
					uuid={_uuidUpdate as string}
					queryKeys={[QUERY_KEY.table_member]}
					onClose={() => {
						const {_uuidUpdate, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: rest,
						});
					}}
				/>
			</Popup>

			<PositionContainer
				open={!!_uuidMember}
				onClose={() => {
					const {_uuidMember, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<MainDetailMember
					onClose={() => {
						const {_uuidMember, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>

			<Popup open={_action == 'import-excel'} onClose={handleCloseImportExcel}>
				<ImportExcel
					name='file-gateway'
					file={file}
					pathTemplate='/static/files/Mau_Import_ID_the_thanh_vien.xlsx'
					setFile={setFile}
					onClose={handleCloseImportExcel}
					onSubmit={handleImportExcel}
				/>
			</Popup>
		</Fragment>
	);
}

export default MainPageMember;
