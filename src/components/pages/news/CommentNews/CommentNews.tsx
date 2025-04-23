import React, {useState} from 'react';

import {IComment, PropsCommentNews} from './interfaces';
import styles from './CommentNews.module.scss';
import Image from 'next/image';
import images from '~/constants/images/images';
import {Danger, Trash} from 'iconsax-react';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import commentServices from '~/services/commentServices';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';

const PAGESIZE = 2;

function CommentNews({}: PropsCommentNews) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [page, setPage] = useState<number>(1);
	const [comments, setComments] = useState<IComment[]>([]);

	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [uuidDelete, setUuidDelete] = useState<string>('');

	const {
		data = {
			items: [],
			pagination: {
				totalCount: 0,
				totalPage: 0,
			},
		},
		isLoading: loadingList,
	} = useQuery<{
		items: IComment[];
		pagination: {
			totalCount: number;
			totalPage: number;
		};
	}>([QUERY_KEY.list_comment_news, page], {
		queryFn: () =>
			httpRequest({
				http: commentServices.getCommentNews({
					page: page,
					pageSize: PAGESIZE,
					uuid: _uuid as string,
				}),
			}),
		onSuccess(data) {
			setComments((prev) => [...prev, ...data.items]);
		},
		enabled: !!_uuid,
	});

	const funcDeleteComment = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa bình luận thành công!',
				http: commentServices.updateStatus({
					uuid: uuidDelete,
					status: 0,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.detail_news]);
				setComments((prev) => prev?.filter((v) => v?.uuid != uuidDelete));
				setOpenDelete(false);
			}
		},
	});

	return (
		<div className={styles.commentNews}>
			<Loading loading={funcDeleteComment.isLoading} />
			{loadingList ? (
				<div className={styles.main_loading}>
					<div className={styles.ldsSpinner}>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<h4>Đang tải...</h4>
				</div>
			) : (
				<>
					{comments?.length == 0 ? (
						<div className={styles.empty}>
							<svg xmlns='http://www.w3.org/2000/svg' width='122' height='122' viewBox='0 0 122 122' fill='none'>
								<path
									d='M118.492 117.323C118.024 117.98 117.407 118.517 116.691 118.888C115.975 119.259 115.181 119.455 114.374 119.458H7.62434C6.81786 119.455 6.02385 119.259 5.3079 118.888C4.59194 118.517 3.97459 117.98 3.50684 117.323C23.586 72.6663 19.4177 81.9433 25.416 68.625H96.5827C103.039 82.9854 98.2602 72.3867 118.492 117.323Z'
									fill='#4795EA'
								/>
								<path
									d='M25.4163 35.583V68.6247C18.9604 82.9851 23.7388 72.3863 3.50711 117.323C2.86965 116.473 2.53017 115.437 2.54128 114.375V78.7913L25.4163 35.583Z'
									fill='url(#paint0_linear_409_20609)'
								/>
								<path
									d='M119.458 78.7913V114.375C119.469 115.437 119.13 116.473 118.492 117.323C98.413 72.6659 102.581 81.943 96.583 68.6247V35.583L119.458 78.7913Z'
									fill='url(#paint1_linear_409_20609)'
								/>
								<path
									d='M119.458 78.7912V114.375C119.458 115.723 118.922 117.016 117.969 117.969C117.015 118.922 115.723 119.458 114.374 119.458H7.62435C6.27616 119.458 4.9832 118.922 4.02989 117.969C3.07658 117.016 2.54102 115.723 2.54102 114.375V78.7912H45.9781C46.5911 78.7842 47.1859 78.9991 47.6529 79.3961C48.12 79.7931 48.4279 80.3455 48.5198 80.9516C48.9117 83.2512 49.9289 85.3985 51.4602 87.1584C52.9914 88.9182 54.9774 90.2227 57.2008 90.9288C59.4241 91.6349 61.7988 91.7154 64.0649 91.1615C66.3309 90.6077 68.4008 89.4408 70.0477 87.7887C71.8956 85.9237 73.1284 83.5378 73.5806 80.9516C73.6725 80.3455 73.9804 79.7931 74.4474 79.3961C74.9145 78.9991 75.5093 78.7842 76.1223 78.7912H119.458Z'
									fill='url(#paint2_linear_409_20609)'
								/>
								<path d='M25.416 35.583H96.5827V68.6247H25.416V35.583Z' fill='url(#paint3_linear_409_20609)' />
								<path
									d='M83.875 25.4163C83.8808 21.0614 82.6434 16.7953 80.3082 13.1195C77.9729 9.44367 74.637 6.5108 70.6923 4.66561C66.7477 2.82041 62.3583 2.13956 58.04 2.70307C53.7217 3.26659 49.6541 5.05106 46.315 7.84674C42.976 10.6424 40.5044 14.3332 39.1907 18.4852C37.8769 22.6372 37.7757 27.0779 38.8989 31.2855C40.0221 35.493 42.3229 39.2925 45.5311 42.2374C48.7393 45.1824 52.7215 47.1503 57.0096 47.91L59.8562 53.6542C59.9668 53.8615 60.1316 54.0348 60.3331 54.1557C60.5345 54.2766 60.765 54.3404 61 54.3404C61.2349 54.3404 61.4654 54.2766 61.6669 54.1557C61.8684 54.0348 62.0332 53.8615 62.1437 53.6542L64.9904 47.91C70.2776 46.9733 75.0668 44.2065 78.5194 40.0941C81.972 35.9817 83.8678 30.7858 83.875 25.4163Z'
									fill='url(#paint4_linear_409_20609)'
								/>
								<path
									d='M64.5831 25.4163L70.4289 19.5959C70.9075 19.1173 71.1764 18.4682 71.1764 17.7913C71.1764 17.1145 70.9075 16.4653 70.4289 15.9867C69.9503 15.5081 69.3012 15.2393 68.6243 15.2393C67.9475 15.2393 67.2984 15.5081 66.8197 15.9867L60.9993 21.8326L55.1789 15.9867C54.9419 15.7498 54.6606 15.5618 54.351 15.4335C54.0413 15.3053 53.7095 15.2393 53.3743 15.2393C52.6975 15.2393 52.0484 15.5081 51.5697 15.9867C51.0911 16.4653 50.8223 17.1145 50.8223 17.7913C50.8223 18.4682 51.0911 19.1173 51.5697 19.5959L57.4156 25.4163L51.5697 31.2367C51.3328 31.4737 51.1448 31.7551 51.0165 32.0647C50.8883 32.3743 50.8223 32.7062 50.8223 33.0413C50.8223 33.7182 51.0911 34.3673 51.5697 34.8459C52.0484 35.3245 52.6975 35.5934 53.3743 35.5934C53.7095 35.5934 54.0413 35.5274 54.351 35.3991C54.6606 35.2709 54.9419 35.0829 55.1789 34.8459L60.9993 29.0001L66.8197 34.8459C67.2984 35.3245 67.9475 35.5934 68.6243 35.5934C69.3012 35.5934 69.9503 35.3245 70.4289 34.8459C70.9075 34.3673 71.1764 33.7182 71.1764 33.0413C71.1764 32.3645 70.9075 31.7153 70.4289 31.2367L64.5831 25.4163Z'
									fill='#FFB369'
								/>
								<path
									d='M27.9577 96.583H12.7077C11.304 96.583 10.166 97.721 10.166 99.1247V109.291C10.166 110.695 11.304 111.833 12.7077 111.833H27.9577C29.3614 111.833 30.4993 110.695 30.4993 109.291V99.1247C30.4993 97.721 29.3614 96.583 27.9577 96.583Z'
									fill='url(#paint5_linear_409_20609)'
								/>
								<path
									d='M22.875 106.749H17.7917C17.1176 106.749 16.4711 106.482 15.9944 106.005C15.5178 105.528 15.25 104.882 15.25 104.208C15.25 103.534 15.5178 102.887 15.9944 102.41C16.4711 101.934 17.1176 101.666 17.7917 101.666H22.875C23.5491 101.666 24.1956 101.934 24.6722 102.41C25.1489 102.887 25.4167 103.534 25.4167 104.208C25.4167 104.882 25.1489 105.528 24.6722 106.005C24.1956 106.482 23.5491 106.749 22.875 106.749Z'
									fill='#FFB369'
								/>
								<path
									d='M43.208 111.833H38.1247C37.4506 111.833 36.8041 111.566 36.3274 111.089C35.8508 110.612 35.583 109.966 35.583 109.292C35.583 108.618 35.8508 107.971 36.3274 107.494C36.8041 107.018 37.4506 106.75 38.1247 106.75H43.208C43.8821 106.75 44.5286 107.018 45.0052 107.494C45.4819 107.971 45.7497 108.618 45.7497 109.292C45.7497 109.966 45.4819 110.612 45.0052 111.089C44.5286 111.566 43.8821 111.833 43.208 111.833Z'
									fill='#4795EA'
								/>
								<path
									d='M48.2913 101.666H38.1247C37.4506 101.666 36.8041 101.399 36.3274 100.922C35.8508 100.445 35.583 99.7988 35.583 99.1247C35.583 98.4506 35.8508 97.8041 36.3274 97.3274C36.8041 96.8508 37.4506 96.583 38.1247 96.583H48.2913C48.9654 96.583 49.6119 96.8508 50.0886 97.3274C50.5652 97.8041 50.833 98.4506 50.833 99.1247C50.833 99.7988 50.5652 100.445 50.0886 100.922C49.6119 101.399 48.9654 101.666 48.2913 101.666Z'
									fill='#4795EA'
								/>
								<defs>
									<linearGradient
										id='paint0_linear_409_20609'
										x1='13.9788'
										y1='117.323'
										x2='13.9788'
										y2='35.583'
										gradientUnits='userSpaceOnUse'
									>
										<stop stop-color='#54A5FF' />
										<stop offset='1' stop-color='#8AD3FE' />
									</linearGradient>
									<linearGradient
										id='paint1_linear_409_20609'
										x1='108.021'
										y1='117.323'
										x2='108.021'
										y2='-0.00032059'
										gradientUnits='userSpaceOnUse'
									>
										<stop stop-color='#54A5FF' />
										<stop offset='1' stop-color='#8AD3FE' />
									</linearGradient>
									<linearGradient
										id='paint2_linear_409_20609'
										x1='60.9993'
										y1='119.458'
										x2='60.9993'
										y2='78.7912'
										gradientUnits='userSpaceOnUse'
									>
										<stop stop-color='#54A5FF' />
										<stop offset='1' stop-color='#8AD3FE' />
									</linearGradient>
									<linearGradient
										id='paint3_linear_409_20609'
										x1='60.9993'
										y1='68.6247'
										x2='60.9993'
										y2='-0.000325317'
										gradientUnits='userSpaceOnUse'
									>
										<stop stop-color='#54A5FF' />
										<stop offset='1' stop-color='#8AD3FE' />
									</linearGradient>
									<linearGradient
										id='paint4_linear_409_20609'
										x1='61'
										y1='54.3404'
										x2='61'
										y2='2.54126'
										gradientUnits='userSpaceOnUse'
									>
										<stop stop-color='#D3E6F5' />
										<stop offset='1' stop-color='#F0F7FC' />
									</linearGradient>
									<linearGradient
										id='paint5_linear_409_20609'
										x1='10.166'
										y1='104.208'
										x2='30.4993'
										y2='104.208'
										gradientUnits='userSpaceOnUse'
									>
										<stop stop-color='#D3E6F5' />
										<stop offset='1' stop-color='#F0F7FC' />
									</linearGradient>
								</defs>
							</svg>
							<p>Không có bình luận</p>
						</div>
					) : (
						<>
							{comments?.map((cmt) => (
								<div key={cmt?.uuid} className={styles.commnent}>
									<div className={styles.head}>
										<div className={styles.user}>
											<Image
												alt='Avatar user'
												src={
													cmt?.profileUser?.imagePath
														? `${process.env.NEXT_PUBLIC_IMAGE}/${cmt?.profileUser?.imagePath}`
														: images.avatar_default
												}
												width={36}
												height={36}
												style={{borderRadius: '50%'}}
											/>
											<div className={styles.info}>
												<p>{cmt?.profileUser?.name}</p>
												<p>{cmt?.timeAgo}</p>
											</div>
										</div>
										<div
											className={styles.delete}
											onClick={() => {
												setOpenDelete(true);
												setUuidDelete(cmt?.uuid);
											}}
										>
											<Trash color='#FA4B4B' size={18} />
										</div>
									</div>
									<p className={styles.content}>{cmt?.content}</p>
								</div>
							))}
							{loadingList ? (
								<p className={styles.loading}>Loading...</p>
							) : (
								<>
									{data?.pagination?.totalCount > page * PAGESIZE && (
										<p className={styles.more} onClick={() => setPage((prev) => prev + 1)}>
											Xem thêm
										</p>
									)}
								</>
							)}
						</>
					)}
				</>
			)}
			<Dialog
				type='error'
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				title='Xác nhận xóa bình luận'
				note='Bạn có chắc chắn muốn xóa bình luận này không?'
				icon={<Danger size='76' color='#F46161' variant='Bold' />}
				onSubmit={funcDeleteComment.mutate}
			/>
		</div>
	);
}

export default CommentNews;
