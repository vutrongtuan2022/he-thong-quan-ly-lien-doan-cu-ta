import React, {useState} from 'react';

import {IFormUpdateNews, PropsMainUpdateNews} from './interfaces';
import styles from './MainUpdateNews.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import EditerContent from '../../../utils/EditerContent';
import Form, {FormContext, Input} from '~/components/common/Form';
import FormInfoNews from '../FormInfoNews';
import {QUERY_KEY, TYPE_DISPLAY, TYPE_NEWS} from '~/constants/config/enum';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import newsServices from '~/services/newsServices';
import {price} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import uploadService from '~/services/uploadService';
import moment from 'moment';
import {useRouter} from 'next/router';

function MainUpdateNews({uuid}: PropsMainUpdateNews) {
	const router = useRouter();

	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [form, setForm] = useState<IFormUpdateNews>({
		title: '',
		content: '',
		catalog: TYPE_NEWS.NEWS,
		privacy: TYPE_DISPLAY.PUBLIC,
		timePublic: new Date(),
		isSpecial: true,
		link: '',
		sort: 1,
		blockComment: false,
		imagePath: '',
	});

	useQuery([QUERY_KEY.detail_blog], {
		queryFn: () =>
			httpRequest({
				http: newsServices.detailBlog({
					uuid: uuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					title: data?.title || '',
					imagePath: data?.imagePath || '',
					sort: data?.sort || 1,
					privacy: data?.privacy || TYPE_DISPLAY.PUBLIC,
					content: data?.content || '',
					catalog: data?.catalog || TYPE_NEWS.NEWS,
					blockComment: data?.blockComment !== undefined ? data.blockComment : false,
					timePublic: data?.timePublic ? new Date(data.timePublic) : new Date(),
					isSpecial: data?.isSpecial !== undefined ? data.isSpecial : false,
					link: data?.link || '',
				});
			}
		},
		enabled: !!uuid,
	});

	const funcUpdateBlog = useMutation({
		mutationFn: (body: {imagePath: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa bài viết thành công!',
				http: newsServices.upsertBlog({
					uuid: uuid,
					title: form?.title,
					content: form?.content,
					catalog: price(form?.catalog),
					privacy: form?.privacy,
					timePublic: moment(form?.timePublic).format('YYYY-MM-DDTHH:mm'),
					isSpecial: form?.isSpecial,
					link: form.catalog == TYPE_NEWS.EVENT ? form?.link : '',
					sort: price(form?.sort),
					blockComment: form?.blockComment,
					imagePath: body?.imagePath,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					title: '',
					content: '',
					catalog: 0,
					privacy: TYPE_DISPLAY.PUBLIC,
					timePublic: '',
					isSpecial: false,
					link: '',
					sort: 0,
					blockComment: false,
					imagePath: '',
				});
				router.back();
			}
		},
	});

	const handleSubmit = async () => {
		if (!file && !form.imagePath) {
			return toastWarn({msg: 'Vui lòng chọn ảnh!'});
		}

		if (!!file) {
			const dataImage = await httpRequest({
				setLoading,
				http: uploadService.uploadSingleImage(file, '8'),
			});

			return funcUpdateBlog.mutate({
				imagePath: dataImage,
			});
		} else {
			return funcUpdateBlog.mutate({
				imagePath: form.imagePath,
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateBlog.isLoading || loading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.head_main}>
					<Breadcrumb titles={['Quản lý tin tức', 'Chỉnh sửa bài viết']} listHref={[PATH.News]} />
					<div className={styles.group_button}>
						<Button p_10_24 grey rounded_8 onClick={() => router.back()}>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<div>
									<Button disable={!isDone} p_10_24 aquamarine rounded_8>
										Cập nhật
									</Button>
								</div>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.main}>
					<div className={styles.form}>
						<Input
							isRequired
							name='title'
							type='text'
							placeholder='Nhập tiêu đề bài viết'
							value={form.title}
							max={150}
							label={
								<span>
									Tiêu đề bài viết <span style={{color: 'red'}}>*</span>
								</span>
							}
						/>
						{form.catalog == TYPE_NEWS.EVENT && (
							<Input
								isRequired={form?.catalog == TYPE_NEWS.EVENT}
								name='link'
								placeholder='Nhập link đăng ký sự kiện'
								value={form.link}
								label={
									<span>
										Link đăng ký sự kiện <span style={{color: 'red'}}>*</span>
									</span>
								}
							/>
						)}
						<div className={styles.editer}>
							<EditerContent
								label={
									<span>
										Nội dung bài viết <span style={{color: 'red'}}>*</span>
									</span>
								}
								content={form.content}
								setContent={(c) =>
									setForm((prev) => ({
										...prev,
										content: typeof c === 'function' ? c(prev.content) : c,
									}))
								}
							/>
						</div>
					</div>
					<FormInfoNews form={form} setForm={setForm} file={file} setFile={setFile} />
				</div>
			</Form>
		</div>
	);
}

export default MainUpdateNews;
