import React, {Fragment, useState} from 'react';
import Image from 'next/image';
import {INews, PropsMainPageNews} from './interfaces';
import styles from './MainPageNews.module.scss';
import {useRouter} from 'next/router';
import {QUERY_KEY, TYPE_NEWS, TYPE_DATE, TYPE_DISPLAY} from '~/constants/config/enum';
import SearchBlock from '~/components/utils/SearchBlock';
import FilterCustom from '~/components/common/FilterCustom';
import FilterDateRange from '~/components/common/FilterDateRange';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import MainTable from '~/components/utils/MainTable';
import IconCustom from '~/components/common/IconCustom';
import {ClipboardText, Danger, Edit, Eye, Trash} from 'iconsax-react';
import SwitchButton from '~/components/common/SwitchButton';
import Table from '~/components/common/Table';
import images from '~/constants/images/images';
import {PATH} from '~/constants/config';
import Dialog from '~/components/common/Dialog';
import Link from 'next/link';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import newsServices from '~/services/newsServices';
import moment from 'moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';

function MainPageNews({}: PropsMainPageNews) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [keyword, setKeyword] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [typeNews, setTypeNews] = useState<number | null>(null);
	const [typeDateDefault, setTypeDateDefault] = useState<TYPE_DATE>(TYPE_DATE.THIS_MONTH);
	const [date, setDate] = useState<{from: Date | null; to: Date | null} | null>(null);

	const [dataDelete, setDataDelete] = useState<INews | null>(null);

	const resetFilter = () => {
		setKeyword('');
		setPage(1);
		setPageSize(20);
		setTypeNews(null);
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
		items: INews[];
		pagination: {
			totalCount: number;
			totalPage: number;
		};
	}>([QUERY_KEY.table_news, page, pageSize, keyword, typeNews, date?.from, date?.to], {
		queryFn: () =>
			httpRequest({
				http: newsServices.getListNews({
					page: page,
					pageSize: pageSize,
					keyword: keyword,
					startDate: date?.from ? moment(date.from).format('YYYY-MM-DD') : null,
					endDate: date?.to ? moment(date.to).format('YYYY-MM-DD') : null,
					catalog: typeNews,
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
				http: newsServices.changePrivacy({
					uuid: body?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.table_news]);
			}
		},
	});

	// Xóa Blog
	const funcDeleteBlog = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa bài viết thành công!',
				http: newsServices.deleteBlog({
					uuid: dataDelete?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setDataDelete(null);
				queryClient.invalidateQueries([QUERY_KEY.table_news]);
			}
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteBlog.isLoading} />
			<SearchBlock
				keyword={keyword}
				setKeyword={setKeyword}
				placeholder='Tìm kiếm theo tên bài viết'
				action={
					<div className={styles.filter}>
						<div className={styles.flex}>
							<FilterCustom
								name='Loại tin tức'
								value={typeNews}
								setValue={setTypeNews}
								listOption={[
									{
										uuid: TYPE_NEWS.NEWS,
										name: 'Tin tức',
									},
									{
										uuid: TYPE_NEWS.OPPORTUNITY,
										name: 'Cơ hội',
									},
									{
										uuid: TYPE_NEWS.EVENT,
										name: 'Sự kiện',
									},
									{
										uuid: TYPE_NEWS.DOCUMENT,
										name: 'Tài liệu',
									},
								]}
							/>
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
				icon={<ClipboardText size={28} color='#FC6A45' variant='Bold' />}
				title='Danh sách tin tức'
				action={
					<div className={styles.action}>
						<Button
							p_8_24
							aquamarine
							rounded_8
							bold
							icon={<Image alt='icon download' src={icons.iconAdd} width={20} height={20} />}
							href={PATH.NewsCreate}
						>
							Thêm tin tức
						</Button>
					</div>
				}
			>
				<DataWrapper
					data={data?.items || []}
					loading={isLoading}
					title='Tin tức trống!'
					note='Danh sách tin tức hiện đang trống!'
					button={
						<Button
							p_8_24
							aquamarine
							rounded_8
							bold
							icon={<Image alt='icon download' src={icons.iconAdd} width={20} height={20} />}
							href={PATH.NewsCreate}
						>
							Thêm tin tức
						</Button>
					}
				>
					<Table<INews>
						data={data?.items || []}
						column={[
							{
								title: 'Bài viết',
								render: (row, _) => (
									<div className={styles.wrapper}>
										<Image
											className={styles.avatar}
											src={
												row?.imagePath
													? `${process.env.NEXT_PUBLIC_IMAGE}/${row?.imagePath}`
													: images.avatar_default
											}
											alt='Image'
											width={44}
											height={44}
										/>
										<div className={styles.content}>
											<Link href={'#'} className={styles.label}>
												{row?.title || '---'}
											</Link>
											<Link href={'#'} className={styles.desc}>
												{row?.imagePath || '---'}
											</Link>
										</div>
									</div>
								),
							},
							{
								title: 'Loại tin tức',
								render: (row, _) => (
									<>
										{row?.catalog === TYPE_NEWS.NEWS && 'Tin tức'}
										{row?.catalog === TYPE_NEWS.OPPORTUNITY && 'Cơ hội'}
										{row?.catalog === TYPE_NEWS.EVENT && 'Sự kiện'}
										{row?.catalog === TYPE_NEWS.DOCUMENT && 'Tài liệu'}
									</>
								),
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
								title: 'Lượt xem',
								render: (row, _) => <>{convertCoin(row?.view) || 0}</>,
							},
							{
								title: 'Bình luận',
								render: (row, _) => (
									<div className={styles.box}>
										<Image src={icons.message} alt='Icon' width={24} height={24} />
										<span>{convertCoin(row?.countComment) || 0}</span>
									</div>
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
											href={`${PATH.NewsUpdate}?_uuid=${row.uuid}`}
										/>
										<IconCustom
											icon={<Trash color='#FA4B4B' size={24} />}
											tooltip='Xóa'
											background='#FA4B4B1A'
											onClick={() => setDataDelete(row)}
										/>
										<IconCustom
											icon={<Eye color='#6170E3' size={24} />}
											tooltip='Xem chi tiết'
											background='#6170E31A'
											href={`${PATH.News}/${row.uuid}`}
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
						dependencies={[pageSize, keyword, typeNews, date?.from, date?.to]}
					/>
				</div>
			</MainTable>
			<Dialog
				type='error'
				open={!!dataDelete}
				onClose={() => setDataDelete(null)}
				title='Xác nhận xóa tin tức'
				note='Bạn có chắc chắn muốn xóa bài viết ABC không?'
				icon={<Danger size='76' color='#F46161' variant='Bold' />}
				onSubmit={funcDeleteBlog.mutate}
			/>
		</Fragment>
	);
}

export default MainPageNews;
