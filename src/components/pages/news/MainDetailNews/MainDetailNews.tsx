import React from 'react';

import {INews, PropsMainDetailNews} from './interfaces';
import styles from './MainDetailNews.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import newsServices from '~/services/newsServices';
import CommentNews from '../CommentNews';
import ContentNews from '../ContentNews';
import TabNavLink from '~/components/common/TabNavLink';
import InfoNews from '../InfoNews';

function MainDetailNews({}: PropsMainDetailNews) {
	const router = useRouter();

	const {_uuid, _type} = router.query;

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
	return (
		<div className={styles.container}>
			<div className={styles.head_main}>
				<Breadcrumb titles={['Quản lý tin tức', 'Chi tiết bài viết']} listHref={[PATH.News]} />
				<div className={styles.group_button}>
					<Button p_10_24 red rounded_8>
						Xóa vĩnh viễn
					</Button>
					<Button p_10_24 aquamarine rounded_8>
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
								title: 'Chi tiết tin tức',
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
		</div>
	);
}

export default MainDetailNews;
