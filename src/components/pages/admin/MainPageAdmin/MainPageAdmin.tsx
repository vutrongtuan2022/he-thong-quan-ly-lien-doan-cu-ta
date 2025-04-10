import React, {Fragment, useState} from 'react';
import Image from 'next/image';

import {IPageAdmin, PropsMainPageAdmin} from './interfaces';
import styles from './MainPageAdmin.module.scss';
import SearchBlock from '~/components/utils/SearchBlock';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import MainTable from '~/components/utils/MainTable';
import {Danger, Edit, UserOctagon} from 'iconsax-react';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import StateActive from '~/components/utils/StateActive';
import IconCustom from '~/components/common/IconCustom';
import Pagination from '~/components/common/Pagination';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import Popup from '~/components/common/Popup';
import Dialog from '~/components/common/Dialog';
import FormCreateAdmin from '../FormCreateAdmin';
import FormUpdateAdmin from '../FormUpdateAdmin';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_STATUS, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';
import FilterCustom from '~/components/common/FilterCustom';
import roleServices from '~/services/roleServices';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';

function MainPageAdmin({}: PropsMainPageAdmin) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {infoUser} = useSelector((state: RootState) => state.user);

	const {_open, _uuidUpdate} = router.query;

	const [keyword, setKeyword] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [status, setStatus] = useState<number | null>(null);
	const [role, setRole] = useState<string>('');
	const [uuidLocked, setUuidLocked] = useState<string>('');
	const [uuidOpen, setUuidOpen] = useState<string>('');

	const resetFilter = () => {
		setKeyword('');
		setPage(1);
		setPageSize(20);
		setStatus(null);
		setRole('');
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
		items: IPageAdmin[];
		pagination: {
			totalCount: number;
			totalPage: number;
		};
	}>([QUERY_KEY.table_admin, page, status, pageSize, keyword, role], {
		queryFn: () =>
			httpRequest({
				http: accountServices.listAdminAccount({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					status: status,
					role: role,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: listRole} = useQuery([QUERY_KEY.dropdown_category_role], {
		queryFn: () =>
			httpRequest({
				http: roleServices.roleAdmin({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcLocked = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageSuccess: true,
				showMessageFailed: true,
				msgSuccess: 'Khóa quản trị viên thành công!',
				http: accountServices.updateStatus({
					uuid: uuidLocked,
					status: CONFIG_STATUS.LOCKED,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidLocked('');
				queryClient.invalidateQueries([QUERY_KEY.table_admin]);
			}
		},
	});

	const funcOpen = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageSuccess: true,
				showMessageFailed: true,
				msgSuccess: 'Mở khóa quản trị viên thành công!',
				http: accountServices.updateStatus({
					uuid: uuidOpen,
					status: CONFIG_STATUS.ACTIVE,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidOpen('');
				queryClient.invalidateQueries([QUERY_KEY.table_admin]);
			}
		},
	});

	return (
		<Fragment>
			<Loading loading={funcLocked.isLoading || funcOpen.isLoading} />
			<SearchBlock
				keyword={keyword}
				setKeyword={setKeyword}
				placeholder='Tìm kiếm theo tên đăng nhập, tên tài khoản, email'
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
								name='Nhóm quyền'
								value={role}
								setValue={setRole}
								listOption={listRole?.map((v: any) => ({
									uuid: v?.uuid,
									name: v?.name,
								}))}
							/>
						</div>
						<div className={styles.flex}>
							<Button p_8_24 black rounded_8 bold onClick={resetFilter}>
								Đặt lại
							</Button>
						</div>
					</div>
				}
			/>
			<MainTable
				icon={<UserOctagon size={28} color='#FC6A45' variant='Bold' />}
				title='Danh sách tài khoản quản trị viên'
				action={
					<div className={styles.action}>
						<Button
							p_8_24
							aquamarine
							rounded_8
							bold
							icon={<Image alt='icon download' src={icons.iconAdd} width={16} height={16} />}
							onClick={() => {
								if (_open !== 'create') {
									router.replace({
										pathname: router.pathname,
										query: {...router.query, _open: 'create'},
									});
								}
							}}
						>
							Thêm tài khoản
						</Button>
					</div>
				}
			>
				<DataWrapper
					data={data?.items || []}
					loading={isLoading}
					title='Quản trị viên trống!'
					note='Danh sách quản trị viên hiện đang trống!'
				>
					<Table<IPageAdmin>
						data={data?.items || []}
						column={[
							{
								title: 'STT',
								render: (_, index) => <>{index + 1}</>,
							},
							{
								title: 'Tên đăng nhập',
								render: (row, _) => <>{row?.userName}</>,
							},
							{
								title: 'Tên tài khoản',
								render: (row, _) => <>{row?.accountName}</>,
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
								title: 'Ngày tham gia',
								render: (row, _) => <Moment date={row?.created} format='DD/MM/YYYY' />,
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
								title: 'Tác vụ',
								fixedRight: true,
								render: (row, _) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										{row?.uuid === infoUser?.uuid ? null : (
											<>
												{row?.status === CONFIG_STATUS.ACTIVE && (
													<IconCustom
														icon={<HiOutlineLockClosed color='#FA4B4B' size={24} />}
														tooltip='Khóa quản trị viên'
														background='rgba(250, 75, 75, 0.10)'
														onClick={() => setUuidLocked(row?.uuid)}
													/>
												)}
												{row?.status === CONFIG_STATUS.LOCKED && (
													<IconCustom
														icon={<HiOutlineLockOpen color=' #33C041' size={24} />}
														tooltip='Mở khóa quản trị viên'
														background='rgba(51, 192, 65, 0.10)'
														onClick={() => setUuidOpen(row?.uuid)}
													/>
												)}
												<IconCustom
													icon={<Edit color='#3772FF' size={24} />}
													tooltip='Chỉnh sửa'
													background='rgba(55, 114, 255, 0.10)'
													onClick={() =>
														router.replace({
															pathname: router.pathname,
															query: {
																...router.query,
																_uuidUpdate: row?.uuid,
															},
														})
													}
												/>
											</>
										)}
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
						dependencies={[pageSize, keyword, status, role]}
					/>
				</div>
			</MainTable>

			<Popup
				open={_open == 'create'}
				onClose={() => {
					const {_open, ...rest} = router.query;
					router.replace({
						pathname: router.pathname,
						query: rest,
					});
				}}
			>
				<FormCreateAdmin
					onClose={() => {
						const {_open, ...rest} = router.query;
						router.replace({
							pathname: router.pathname,
							query: rest,
						});
					}}
				/>
			</Popup>

			<Popup
				open={!!_uuidUpdate}
				onClose={() => {
					const {_uuidUpdate, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: rest,
					});
				}}
			>
				<FormUpdateAdmin
					onClose={() => {
						const {_uuidUpdate, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: rest,
						});
					}}
				/>
			</Popup>

			<Dialog
				type='primary'
				open={!!uuidOpen}
				onClose={() => setUuidOpen('')}
				title='Xác nhận mở khóa tài khoản'
				note='Bạn có chắc chắn muốn mở khóa tài khoản không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcOpen.mutate}
			/>

			<Dialog
				type='error'
				open={!!uuidLocked}
				onClose={() => setUuidLocked('')}
				title='Xác nhận khóa tài khoản'
				note='Bạn có chắc chắn muốn khóa tài khoản không?'
				icon={<Danger size='76' color='#F46161' variant='Bold' />}
				onSubmit={funcLocked.mutate}
			/>
		</Fragment>
	);
}

export default MainPageAdmin;
