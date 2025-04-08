import React, {useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsFormInfoNews} from './interfaces';
import styles from './FormInfoNews.module.scss';
import Accordion from '~/components/utils/Accordion';
import {TYPE_DISPLAY, TYPE_NEWS} from '~/constants/config/enum';
import UploadImage from '~/components/utils/UploadImage';
import SwitchButton from '~/components/common/SwitchButton';
import DateTimePicker from '~/components/utils/DateTimePicker';
import moment from 'moment';
import {Add, Minus} from 'iconsax-react';
import clsx from 'clsx';

function FormInfoNews({form, setForm, setFile, file}: PropsFormInfoNews) {
	const [openDisplay, setOpenDisplay] = useState<boolean>(false);
	const [openDate, setOpenDate] = useState<boolean>(false);

	return (
		<div className={styles.container}>
			<Accordion title='Trạng thái và hiển thị'>
				<div className={styles.main_display}>
					<div className={styles.view}>
						<p>Hiển thị:</p>
						<TippyHeadless
							maxWidth={'100%'}
							interactive
							visible={openDisplay}
							onClickOutside={() => setOpenDisplay(false)}
							placement='bottom'
							render={(attrs: any) => (
								<div className={styles.mainOptionDisplay}>
									<h4>Hiển thị</h4>
									<div className={styles.itemDisplay}>
										<input
											name='privacy'
											type='radio'
											id='privacy_public'
											value={form.privacy}
											checked={form.privacy == TYPE_DISPLAY.PUBLIC}
											onChange={() => {
												setOpenDisplay(false);
												setForm((prev) => ({
													...prev,
													privacy: TYPE_DISPLAY.PUBLIC,
												}));
											}}
										/>
										<label htmlFor='privacy_public'>
											<p>Công khai</p>
											<p>Hiển thị với tất cả mọi người</p>
										</label>
									</div>
									<div className={styles.itemDisplay}>
										<input
											name='privacy'
											type='radio'
											id='privacy_private'
											value={form.privacy}
											checked={form.privacy == TYPE_DISPLAY.PRIVATE}
											onChange={() => {
												setOpenDisplay(false);
												setForm((prev) => ({
													...prev,
													privacy: TYPE_DISPLAY.PRIVATE,
												}));
											}}
										/>
										<label htmlFor='privacy_private'>
											<p>Riêng tư</p>
											<p>Chỉ hiển thị với quản trị viên và biên tập</p>
										</label>
									</div>
								</div>
							)}
						>
							<p onClick={() => setOpenDisplay(!openDisplay)}>
								{form.privacy == TYPE_DISPLAY.PUBLIC && 'Công khai'}
								{form.privacy == TYPE_DISPLAY.PRIVATE && 'Riêng tư'}
							</p>
						</TippyHeadless>
					</div>
					<div className={styles.view}>
						<p>Chế độ đăng:</p>
						<TippyHeadless
							maxWidth={'100%'}
							interactive
							visible={openDate}
							onClickOutside={() => setOpenDate(false)}
							placement='bottom-start'
							render={(attrs: any) => (
								<DateTimePicker
									date={form.timePublic ? moment(form.timePublic).toDate() : new Date()}
									setDate={(d: any) =>
										setForm((prev) => ({
											...prev,
											timePublic: d,
										}))
									}
								/>
							)}
						>
							<p onClick={() => setOpenDate(!openDate)}>{moment(form.timePublic).format('HH:mm, DD/MM/YYYY')}</p>
						</TippyHeadless>
					</div>
					<div className={styles.view}>
						<p>Bài viết nổi bật:</p>
						<SwitchButton
							checkOn={form?.isSpecial}
							onClick={() =>
								setForm((prev) => ({
									...prev,
									isSpecial: !prev?.isSpecial,
								}))
							}
						/>
					</div>
					<div className={styles.view}>
						<p>Thứ tự hiển thị:</p>
						<div className={styles.order}>
							<div
								className={clsx(styles.item_order, {[styles.disable]: form.sort == 1})}
								onClick={() =>
									setForm((prev) => ({
										...prev,
										sort: prev.sort - 1,
									}))
								}
							>
								<Minus size={18} />
							</div>
							<div className={styles.item_order}>{form.sort}</div>
							<div
								className={clsx(styles.item_order, {[styles.disable]: false})}
								onClick={() =>
									setForm((prev) => ({
										...prev,
										sort: prev.sort + 1,
									}))
								}
							>
								<Add size={18} />
							</div>
						</div>
					</div>
				</div>
			</Accordion>
			<div className={styles.line}></div>
			<Accordion title='Loại tin tức'>
				<div className={styles.category}>
					<div className={styles.item}>
						<input
							name='catalog'
							type='checkbox'
							id='category_news'
							value={form.catalog}
							checked={form.catalog == TYPE_NEWS.NEWS}
							onChange={() =>
								setForm((prev) => ({
									...prev,
									catalog: TYPE_NEWS.NEWS,
								}))
							}
						/>
						<label htmlFor='category_news'>Tin tức</label>
					</div>
					<div className={styles.item}>
						<input
							name='catalog'
							type='checkbox'
							id='category_opportunity'
							value={form.catalog}
							checked={form.catalog == TYPE_NEWS.OPPORTUNITY}
							onChange={() =>
								setForm((prev) => ({
									...prev,
									catalog: TYPE_NEWS.OPPORTUNITY,
								}))
							}
						/>
						<label htmlFor='category_opportunity'>Cơ hội</label>
					</div>
					<div className={styles.item}>
						<input
							name='catalog'
							type='checkbox'
							id='category_event'
							value={form.catalog}
							checked={form.catalog == TYPE_NEWS.EVENT}
							onChange={() =>
								setForm((prev) => ({
									...prev,
									catalog: TYPE_NEWS.EVENT,
								}))
							}
						/>
						<label htmlFor='category_event'>Sự kiện</label>
					</div>
					<div className={styles.item}>
						<input
							name='catalog'
							type='checkbox'
							id='category_document'
							value={form.catalog}
							checked={form.catalog == TYPE_NEWS.DOCUMENT}
							onChange={() =>
								setForm((prev) => ({
									...prev,
									catalog: TYPE_NEWS.DOCUMENT,
								}))
							}
						/>
						<label htmlFor='category_document'>Tài liệu</label>
					</div>
				</div>
			</Accordion>
			<div className={styles.line}></div>
			<Accordion title='Ảnh đại diện'>
				<UploadImage
					isWidthFull={true}
					name='imagePath'
					path={form?.imagePath ? `${process.env.NEXT_PUBLIC_IMAGE}/${form?.imagePath}` : ''}
					file={file}
					setFile={(f) => setFile(f)}
					resetPath={() =>
						setForm((prev) => ({
							...prev,
							imagePath: '',
						}))
					}
				/>
			</Accordion>
			<div className={styles.line}></div>
			<Accordion title='Thảo luận'>
				<div className={styles.category}>
					<div className={styles.item}>
						<input
							name='blockComment'
							type='checkbox'
							id='allowComments'
							checked={!form.blockComment}
							onChange={(e) => {
								const {checked} = e.target;
								setForm((prev) => ({
									...prev,
									blockComment: !checked,
								}));
							}}
						/>
						<label htmlFor='allowComments'>Cho phép bình luận</label>
					</div>
				</div>
			</Accordion>
		</div>
	);
}

export default FormInfoNews;
