import React, {Fragment, useState} from 'react';

import {IVideos, PropsMainPageVideo} from './interfaces';
import styles from './MainPageVideo.module.scss';
import SearchBlock from '~/components/utils/SearchBlock';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import MainTable from '~/components/utils/MainTable';
import {Edit, Eye, Trash, VideoPlay} from 'iconsax-react';
import {useRouter} from 'next/router';

import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import IconCustom from '~/components/common/IconCustom';
import FilterDateRange from '~/components/common/FilterDateRange';
import {QUERY_KEY, TYPE_DATE, TYPE_DISPLAY} from '~/constants/config/enum';
import Dialog from '~/components/common/Dialog';
import Popup from '~/components/common/Popup';

import SwitchButton from '~/components/common/SwitchButton';

import FormUpdateVideo from '../FormUpdateVideo';
import FormCreateVideo from '../FormCreateVideo';
import Link from 'next/link';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import videoServices from '~/services/videoServices';
import moment from 'moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';

function MainPageVideo({}: PropsMainPageVideo) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_view, _uuidUpdate, action} = router.query;

	const [keyword, setKeyword] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [typeDateDefault, setTypeDateDefault] = useState<TYPE_DATE>(TYPE_DATE.THIS_MONTH);
	const [date, setDate] = useState<{from: Date | null; to: Date | null} | null>(null);

	const [dataDelete, setDataDelete] = useState<IVideos | null>(null);

	const resetFilter = () => {
		setKeyword('');
		setPage(1);
		setPageSize(20);
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
		items: IVideos[];
		pagination: {
			totalCount: number;
			totalPage: number;
		};
	}>([QUERY_KEY.table_videos, page, pageSize, keyword, date?.from, date?.to], {
		queryFn: () =>
			httpRequest({
				http: videoServices.getListVideo({
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
				http: videoServices.changePrivacy({
					uuid: body?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.table_videos]);
			}
		},
	});

	// Xóa Video
	const funcDeleteVideo = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa video thành công!',
				http: videoServices.updateStatus({
					uuid: dataDelete?.uuid!,
					status: 0, // Xóa trạng thái = 0
				}),
			}),
		onSuccess(data) {
			if (data) {
				setDataDelete(null);
				queryClient.invalidateQueries([QUERY_KEY.table_videos]);
			}
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteVideo.isLoading} />
			<SearchBlock
				keyword={keyword}
				setKeyword={setKeyword}
				placeholder='Tìm kiếm theo tên video'
				action={
					<div className={styles.filter}>
						<div className={styles.flex}>
							<FilterDateRange typeDateDefault={typeDateDefault} date={date} setDate={setDate} />
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
				icon={<VideoPlay size={28} color='#FC6A45' variant='Bold' />}
				title='Danh sách video'
				action={
					<div className={styles.action}>
						<Button
							p_8_16
							rounded_8
							aquamarine
							icon={<Image alt='icon add' src={icons.iconAdd} width={20} height={20} />}
							onClick={() => {
								router.replace({
									pathname: router.pathname,
									query: {
										...router.query,
										action: 'create',
									},
								});
							}}
						>
							Thêm video
						</Button>
					</div>
				}
			>
				{!_view && (
					<DataWrapper data={data?.items || []} loading={isLoading} title='Video trống!' note='Danh sách video hiện đang trống!'>
						<Table<IVideos>
							data={data?.items || []}
							column={[
								{
									title: 'STT',
									render: (_, index) => <>{index + 1}</>,
								},
								{
									title: 'Video',
									render: (row, _) => (
										<>
											<p style={{marginBottom: '10px'}}>{row?.title || '---'}</p>
											<Link className={styles.link} href={row?.videoLink || '#'} target='_blank'>
												{row?.videoLink || '---'}
											</Link>
										</>
									),
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
												background='rgba(55, 114, 255, 0.10)'
												onClick={() =>
													router.replace({
														pathname: router.pathname,
														query: {
															...router.query,
															_uuidUpdate: row.uuid,
														},
													})
												}
											/>

											<IconCustom
												icon={<Trash color='#EB2E2E' size={24} />}
												tooltip='Xóa'
												background='rgba(244, 97, 97, 0.10)'
												onClick={() => setDataDelete(row)}
											/>
											<IconCustom
												icon={<Eye color='#6170E3' size={24} />}
												tooltip='Xem chi tiết'
												background='rgba(97, 112, 227, 0.10)'
											/>
										</div>
									),
								},
							]}
						/>
					</DataWrapper>
				)}

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

			<Dialog
				type='error'
				open={!!dataDelete}
				onClose={() => setDataDelete(null)}
				title='Xóa video'
				note='Bạn có chắc chắn muốn xóa video này không?'
				icon={<Image alt='icon question' src={icons.iconQuestion} width={86} height={86} />}
				onSubmit={funcDeleteVideo.mutate}
			/>

			<Popup
				open={action == 'create'}
				onClose={() => {
					const {action, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormCreateVideo
					queryKeys={[QUERY_KEY.table_videos]}
					onClose={() => {
						const {action, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
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
						query: {
							...rest,
						},
					});
				}}
			>
				<FormUpdateVideo
					uuid={_uuidUpdate as string}
					queryKeys={[QUERY_KEY.table_videos]}
					onClose={() => {
						const {_uuidUpdate, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: rest,
						});
					}}
				/>
			</Popup>
		</Fragment>
	);
}

export default MainPageVideo;
