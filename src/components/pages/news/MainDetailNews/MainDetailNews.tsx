import React, {useState} from 'react';

import {INews, PropsMainDetailNews} from './interfaces';
import styles from './MainDetailNews.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import newsServices from '~/services/newsServices';
import CommentNews from '../CommentNews';
import ContentNews from '../ContentNews';
import TabNavLink from '~/components/common/TabNavLink';
import InfoNews from '../InfoNews';
import Dialog from '~/components/common/Dialog';
import {Danger} from 'iconsax-react';
import Loading from '~/components/common/Loading';

function MainDetailNews({}: PropsMainDetailNews) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid, _type} = router.query;
	const [dataDelete, setDataDelete] = useState<INews | null>(null);

	const {data: news} = useQuery<INews>([QUERY_KEY.detail_news], {
		queryFn: () =>
			httpRequest({
				http: newsServices.detailBlog({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	//Xóa Blog
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
				router.back();
				queryClient.invalidateQueries([QUERY_KEY.table_news]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcDeleteBlog.isLoading} />
			<div className={styles.head_main}>
				<Breadcrumb titles={['Quản lý tin tức', 'Chi tiết bài viết']} listHref={[PATH.News]} />
				<div className={styles.group_button}>
					<Button p_10_24 red rounded_8 onClick={() => setDataDelete(news!)}>
						Xóa vĩnh viễn
					</Button>
					<Button p_10_24 aquamarine rounded_8 href={`${PATH.NewsUpdate}?_uuid=${news?.uuid}`}>
						Chỉnh sửa
					</Button>
				</div>
			</div>
			<div className={styles.main}>
				<ContentNews news={news!} />
				<div className={styles.form}>
					<TabNavLink
						listHref={[
							{
								title: 'Chi tiết bài viết',
								pathname: router.pathname,
								query: null,
							},
							{
								title: `Bình luận (${news?.countComment || 0})`,
								pathname: router.pathname,
								query: 'comment',
							},
						]}
						query='_type'
						outline={true}
					/>
					<div className={styles.main_display}>
						{!_type && <InfoNews news={news!} />}
						{_type == 'comment' && <CommentNews />}
					</div>
				</div>
			</div>
			<Dialog
				type='error'
				open={!!dataDelete}
				onClose={() => setDataDelete(null)}
				title='Xác nhận xóa bài viết'
				note='Bạn có chắc chắn muốn xóa bài viết không?'
				icon={<Danger size='76' color='#F46161' variant='Bold' />}
				onSubmit={funcDeleteBlog.mutate}
			/>
		</div>
	);
}

export default MainDetailNews;
