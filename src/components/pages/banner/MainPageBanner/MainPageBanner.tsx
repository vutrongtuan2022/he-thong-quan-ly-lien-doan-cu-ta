import React, {Fragment, useState} from 'react';

import Image from 'next/image';
import {IBanners, PropsMainPageBanner} from './interfaces';
import styles from './MainPageBanner.module.scss';
import {useRouter} from 'next/router';
import {CONFIG_STATUS, QUERY_KEY, TYPE_DATE, TYPE_DISPLAY} from '~/constants/config/enum';
import SearchBlock from '~/components/utils/SearchBlock';
import FilterDateRange from '~/components/common/FilterDateRange';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import MainTable from '~/components/utils/MainTable';
import {Danger, Edit, Eye, Gallery, Trash} from 'iconsax-react';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import IconCustom from '~/components/common/IconCustom';
import Pagination from '~/components/common/Pagination';
import SwitchButton from '~/components/common/SwitchButton';
import Popup from '~/components/common/Popup';
import FormCreateBanner from '../FormCreateBanner';
import images from '~/constants/images/images';
import Dialog from '~/components/common/Dialog';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import bannerServices from '~/services/bannerServices';
import moment from 'moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';
import FormUpdateBanner from '../FormUpdateBanner';

function MainPageBanner({}: PropsMainPageBanner) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_open, _uuidUpdate} = router.query;

	const [keyword, setKeyword] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [typeDate, setTypeDate] = useState<TYPE_DATE>(TYPE_DATE.ALL);
	const [date, setDate] = useState<{from: Date | null; to: Date | null} | null>(null);

	const [dataDelete, setDataDelete] = useState<IBanners | null>(null);

	const resetFilter = () => {
		setKeyword('');
		setPage(1);
		setPageSize(20);
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
		items: IBanners[];
		pagination: {
			totalCount: number;
			totalPage: number;
		};
	}>([QUERY_KEY.table_banners, page, pageSize, keyword, date?.from, date?.to], {
		queryFn: () =>
			httpRequest({
				http: bannerServices.getListBanner({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					startDate: date?.from ? moment(date.from).format('YYYY-MM-DD') : null,
					endDate: date?.to ? moment(date.to).format('YYYY-MM-DD') : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Thay đổi hiển thị
	const funcChangePrivacy = useMutation({
		mutationFn: (body: {uuid: string}) =>
			httpRequest({
				showMessageFailed: false,
				showMessageSuccess: false,
				http: bannerServices.updatePrivacy({
					uuid: body?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.table_banners]);
			}
		},
	});

	// Thay đổi hiển thị
	const funcDeleteBanner = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa banner thành công!',
				http: bannerServices.updateStatus({
					uuid: dataDelete?.uuid!,
					status: 0, // Xóa trạng thái = 0
				}),
			}),
		onSuccess(data) {
			if (data) {
				setDataDelete(null);
				queryClient.invalidateQueries([QUERY_KEY.table_banners]);
			}
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteBanner.isLoading} />
			<SearchBlock
				keyword={keyword}
				setKeyword={setKeyword}
				placeholder='Tìm kiếm theo tên banner'
				action={
					<div className={styles.filter}>
						<div className={styles.flex}>
							<FilterDateRange date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} />
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
				icon={<Gallery size={28} color='#FC6A45' variant='Bold' />}
				title='Danh sách banner'
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
									router.replace(
										{
											pathname: router.pathname,
											query: {...router.query, _open: 'create'},
										},
										undefined,
										{
											scroll: false,
											shallow: false,
										}
									);
								}
							}}
						>
							Thêm banner
						</Button>
					</div>
				}
			>
				<DataWrapper data={data?.items || []} loading={isLoading} title='Banner trống!' note='Danh sách banner hiện đang trống!'>
					<Table<IBanners>
						data={data?.items || []}
						column={[
							{
								title: 'STT',
								render: (_, index) => <>{index + 1}</>,
							},
							{
								title: 'Hình ảnh',
								render: (row, _) => (
									<div>
										<Image
											className={styles.avatar}
											src={
												row?.imagePath
													? `${process.env.NEXT_PUBLIC_IMAGE}/${row?.imagePath}`
													: images.avatar_default
											}
											alt='Image'
											width={72}
											height={44}
										/>
									</div>
								),
							},
							{
								title: 'Tên banner',
								render: (row, _) => <>{row?.title || '---'}</>,
							},
							{
								title: 'Thứ tự hiển thị',
								render: (row, _) => <>{convertCoin(row?.sort) || 0}</>,
							},
							{
								title: 'Hiển thị',
								render: (row, _) => (
									<SwitchButton
										checkOn={row?.privacy == TYPE_DISPLAY.PUBLIC}
										onClick={() =>
											funcChangePrivacy.mutate({
												uuid: row?.uuid,
											})
										}
									/>
								),
							},
							{
								title: 'Thời gian đăng',
								render: (row, _) => <Moment date={row?.created} format='HH:mm - DD/MM/YYYY' />,
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (row, _) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											icon={<Edit color='#3772FF' size={24} />}
											tooltip='Chỉnh sửa'
											background='#3772FF1A'
											onClick={() =>
												router.replace(
													{
														pathname: router.pathname,
														query: {
															...router.query,
															_uuidUpdate: row.uuid,
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
										<IconCustom
											icon={<Trash color='#FA4B4B' size={24} />}
											tooltip='Xóa'
											background='#FA4B4B1A'
											onClick={() => setDataDelete(row)}
										/>
										{/* <IconCustom
											icon={<Eye color='#6170E3' size={24} />}
											tooltip='Xem chi tiết'
											background='#6170E31A'
											onClick={() =>
												router.replace({
													pathname: router.pathname,
													query: {
														...router.query,
														_uuidDetail: '1',
													},
												})
											}
										/> */}
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
						dependencies={[pageSize, keyword, date?.from, date?.to]}
					/>
				</div>
			</MainTable>

			<Popup
				open={_open === 'create'}
				onClose={() => {
					const {_open, ...rest} = router.query;
					router.replace(
						{
							pathname: router.pathname,
							query: rest,
						},
						undefined,
						{
							scroll: false,
							shallow: false,
						}
					);
				}}
			>
				<FormCreateBanner
					queryKeys={[QUERY_KEY.table_banners]}
					onClose={() => {
						const {_open, ...rest} = router.query;
						router.replace(
							{
								pathname: router.pathname,
								query: rest,
							},
							undefined,
							{
								scroll: false,
								shallow: false,
							}
						);
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
				<FormUpdateBanner
					uuid={_uuidUpdate as string}
					queryKeys={[QUERY_KEY.table_banners]}
					onClose={() => {
						const {_uuidUpdate, ...rest} = router.query;

						router.replace(
							{
								pathname: router.pathname,
								query: rest,
							},
							undefined,
							{
								scroll: false,
								shallow: false,
							}
						);
					}}
				/>
			</Popup>

			<Dialog
				type='error'
				open={!!dataDelete}
				onClose={() => setDataDelete(null)}
				title='Xác nhận xóa banner'
				note='Bạn có chắc chắn muốn xóa banner này không?'
				icon={<Danger size='76' color='#F46161' variant='Bold' />}
				onSubmit={funcDeleteBanner.mutate}
			/>
		</Fragment>
	);
}

export default MainPageBanner;
