import React, {Fragment, useState} from 'react';
import Image from 'next/image';
import {IMember, PropsMainPageMember} from './interfaces';
import styles from './MainPageMember.module.scss';
import SearchBlock from '~/components/utils/SearchBlock';
import MainTable from '~/components/utils/MainTable';
import {Danger, People} from 'iconsax-react';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import StateActive from '~/components/utils/StateActive';
import IconCustom from '~/components/common/IconCustom';
import Pagination from '~/components/common/Pagination';
import Dialog from '~/components/common/Dialog';
import images from '~/constants/images/images';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_STATUS, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';

function MainPageMember({}: PropsMainPageMember) {
	const queryClient = useQueryClient();

	const [keyword, setKeyword] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [uuidLocked, setUuidLocked] = useState<string>('');
	const [uuidOpen, setUuidOpen] = useState<string>('');

	const [dataStatus, setDataStatus] = useState<IMember | null>(null);
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
	}>([QUERY_KEY.table_member, page, pageSize, keyword], {
		queryFn: () =>
			httpRequest({
				http: accountServices.listUserAccount({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcUpdateStatus = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: dataStatus?.status == CONFIG_STATUS.ACTIVE ? 'Khóa thành viên thành công!' : 'Mở khóa thành viên thành công!',
				http: accountServices.updateStatus({
					uuid: dataStatus?.uuid!,
					status: dataStatus?.status == CONFIG_STATUS.ACTIVE ? CONFIG_STATUS.LOCKED : CONFIG_STATUS.ACTIVE,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setDataStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.table_member]);
			}
		},
	});

	return (
		<Fragment>
			<Loading loading={funcUpdateStatus.isLoading} />
			<SearchBlock keyword={keyword} setKeyword={setKeyword} placeholder='Tìm kiếm theo tên người dùng, email, số điện thoại' />

			<MainTable icon={<People size={28} color='#FC6A45' variant='Bold' />} title='Danh sách người tài khoản'>
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
									<div className={styles.wrapper}>
										{row?.userInfo?.imageCardPath && (
											<Image
												alt='avatar'
												width={36}
												height={36}
												className={styles.avatar}
												src={`${process.env.NEXT_PUBLIC_IMAGE}/${row?.userInfo?.imageCardPath}`}
											/>
										)}
										<p>{row?.userInfo?.fullname}</p>
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
								title: 'Ngày tham gia',
								render: (row, _) => (
									<>
										<Moment date={row.created} format='DD/MM/YYYY' />
									</>
								),
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
										{row?.status === CONFIG_STATUS.ACTIVE && (
											<IconCustom
												icon={<HiOutlineLockClosed color='#FA4B4B' size={24} />}
												tooltip='Khóa thành viên'
												background='rgba(250, 75, 75, 0.10)'
												onClick={() => {
													setDataStatus(row);
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
													setDataStatus(row);
													setUuidOpen(row?.uuid);
												}}
											/>
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
						dependencies={[pageSize, keyword]}
					/>
				</div>
			</MainTable>

			<Dialog
				type='primary'
				open={!!uuidOpen}
				onClose={() => setUuidOpen('')}
				title='Xác nhận mở khóa thành viên'
				note='Bạn có chắc chắn muốn mở khóa thành viên ABC không?'
				icon={<Danger size='76' color='#3DC5AA' variant='Bold' />}
				onSubmit={funcUpdateStatus.mutate}
			/>

			<Dialog
				type='error'
				open={!!uuidLocked}
				onClose={() => setUuidLocked('')}
				title='Xác nhận khóa thành viên'
				note={`Bạn có chắc chắn muốn khóa thành viên không?`}
				icon={<Danger size='76' color='#F46161' variant='Bold' />}
				onSubmit={funcUpdateStatus.mutate}
			/>
		</Fragment>
	);
}

export default MainPageMember;
