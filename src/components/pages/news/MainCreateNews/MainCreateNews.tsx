import React, {useState} from 'react';

import {IFormCreateNews, PropsMainCreateNews} from './interfaces';
import styles from './MainCreateNews.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import EditerContent from '../../../utils/EditerContent';
import Form, {FormContext, Input} from '~/components/common/Form';
import FormInfoNews from '../FormInfoNews';
import {TYPE_DISPLAY, TYPE_NEWS} from '~/constants/config/enum';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import newsServices from '~/services/newsServices';
import {price} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import uploadService from '~/services/uploadService';
import moment from 'moment';

function MainCreateNews({queryKeys, onClose}: PropsMainCreateNews) {
	const queryClient = useQueryClient();
	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [form, setForm] = useState<IFormCreateNews>({
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

	const funcCreateBlog = useMutation({
		mutationFn: (body: {imagePath: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới bài viết thành công!',
				http: newsServices.upsertBlog({
					uuid: '',
					title: form?.title,
					content: form?.content,
					catalog: price(form?.catalog),
					privacy: form?.privacy,
					timePublic: moment(form?.timePublic).format('YYYY-MM-DD HH:mm'),
					isSpecial: form?.isSpecial,
					link: form?.link,
					sort: price(form?.sort),
					blockComment: form?.blockComment,
					imagePath: body?.imagePath,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
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
				queryKeys?.map((key) => queryClient.invalidateQueries([key]));
			}
		},
	});

	const handleSubmit = async () => {
		if (!file) {
			return toastWarn({msg: 'Vui lòng chọn ảnh!'});
		}

		const dataImage = await httpRequest({
			setLoading,
			http: uploadService.uploadSingleImage(file, '8'),
		});

		return funcCreateBlog.mutate({
			imagePath: dataImage,
		});
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcCreateBlog.isLoading || loading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.head_main}>
					<Breadcrumb titles={['Quản lý tin tức', 'Thêm mới']} listHref={[PATH.News]} />
					<div className={styles.group_button}>
						<Button p_10_24 grey rounded_8 onClick={onClose}>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<div>
									<Button disable={!isDone} p_10_24 aquamarine rounded_8>
										Đăng bài
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
							placeholder='Nhập tiêu đề bài viết'
							value={form.title}
							max={50}
							label={
								<span>
									Tiêu đề bài viết <span style={{color: 'red'}}>*</span>
								</span>
							}
						/>
						{form.catalog == TYPE_NEWS.EVENT && (
							<Input
								isRequired
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

export default MainCreateNews;
