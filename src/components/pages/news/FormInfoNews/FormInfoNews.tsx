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

function FormInfoNews({form, setForm}: PropsFormInfoNews) {
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
											name='display'
											type='radio'
											id='display_public'
											value={form.display}
											checked={form.display == TYPE_DISPLAY.PUBLIC}
											onChange={() => {
												setOpenDisplay(false);
												setForm((prev) => ({
													...prev,
													display: TYPE_DISPLAY.PUBLIC,
												}));
											}}
										/>
										<label htmlFor='display_public'>
											<p>Công khai</p>
											<p>Hiển thị với tất cả mọi người</p>
										</label>
									</div>
									<div className={styles.itemDisplay}>
										<input
											name='display'
											type='radio'
											id='display_private'
											value={form.display}
											checked={form.display == TYPE_DISPLAY.PRIVATE}
											onChange={() => {
												setOpenDisplay(false);
												setForm((prev) => ({
													...prev,
													display: TYPE_DISPLAY.PRIVATE,
												}));
											}}
										/>
										<label htmlFor='display_private'>
											<p>Riêng tư</p>
											<p>Chỉ hiển thị với quản trị viên và biên tập</p>
										</label>
									</div>
								</div>
							)}
						>
							<p onClick={() => setOpenDisplay(!openDisplay)}>
								{form.display == TYPE_DISPLAY.PUBLIC && 'Công khai'}
								{form.display == TYPE_DISPLAY.PRIVATE && 'Riêng tư'}
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
									date={form.date}
									setDate={(d: any) =>
										setForm((prev) => ({
											...prev,
											date: d,
										}))
									}
								/>
							)}
						>
							<p onClick={() => setOpenDate(!openDate)}>{moment(form.date).format('HH:mm, DD/MM/YYYY')}</p>
						</TippyHeadless>
					</div>
					<div className={styles.view}>
						<p>Bài viết nổi bật:</p>
						<SwitchButton />
					</div>
					<div className={styles.view}>
						<p>Thứ tự hiển thị:</p>
						<div className={styles.order}>
							<div
								className={clsx(styles.item_order, {[styles.disable]: form.order == 1})}
								onClick={() =>
									setForm((prev) => ({
										...prev,
										order: prev.order - 1,
									}))
								}
							>
								<Minus size={18} />
							</div>
							<div className={styles.item_order}>{form.order}</div>
							<div
								className={clsx(styles.item_order, {[styles.disable]: false})}
								onClick={() =>
									setForm((prev) => ({
										...prev,
										order: prev.order + 1,
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
							name='type'
							type='checkbox'
							id='category_news'
							value={form.type}
							checked={form.type == TYPE_NEWS.NEWS}
							onChange={() =>
								setForm((prev) => ({
									...prev,
									type: TYPE_NEWS.NEWS,
								}))
							}
						/>
						<label htmlFor='category_news'>Tin tức</label>
					</div>
					<div className={styles.item}>
						<input
							name='type'
							type='checkbox'
							id='category_opportunity'
							value={form.type}
							checked={form.type == TYPE_NEWS.OPPORTUNITY}
							onChange={() =>
								setForm((prev) => ({
									...prev,
									type: TYPE_NEWS.OPPORTUNITY,
								}))
							}
						/>
						<label htmlFor='category_opportunity'>Cơ hội</label>
					</div>
					<div className={styles.item}>
						<input
							name='type'
							type='checkbox'
							id='category_event'
							value={form.type}
							checked={form.type == TYPE_NEWS.EVENT}
							onChange={() =>
								setForm((prev) => ({
									...prev,
									type: TYPE_NEWS.EVENT,
								}))
							}
						/>
						<label htmlFor='category_event'>Sự kiện</label>
					</div>
					<div className={styles.item}>
						<input
							name='type'
							type='checkbox'
							id='category_document'
							value={form.type}
							checked={form.type == TYPE_NEWS.DOCUMENT}
							onChange={() =>
								setForm((prev) => ({
									...prev,
									type: TYPE_NEWS.DOCUMENT,
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
					name='thumbnail'
					path={form.thumbnail}
					file={form.file}
					setFile={(f) =>
						setForm((prev) => ({
							...prev,
							file: f,
						}))
					}
				/>
			</Accordion>
			<div className={styles.line}></div>
			<Accordion title='Thảo luận'>
				<div className={styles.category}>
					<div className={styles.item}>
						<input
							name='allowComments'
							type='checkbox'
							id='allowComments'
							value={form.allowComments}
							checked={form.allowComments == 1}
							onChange={(e) => {
								const {checked} = e.target;

								setForm((prev) => ({
									...prev,
									allowComments: checked ? 1 : 0,
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
