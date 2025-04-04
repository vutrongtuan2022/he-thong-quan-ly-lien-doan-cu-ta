import {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './Table.module.scss';
import {PropsTable} from './interfaces';

const Table = <T,>({
	data,
	column,
	fixedHeader = false,
	handleCheckedAll,
	isCheckedAll,
	handleCheckedRow,
	handleIsCheckedRow,
}: PropsTable<T>) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const [isShowScroll, setIsShowScroll] = useState(false);

	useEffect(() => {
		const element = tableRef.current;
		if (!element) return;

		const observer = new ResizeObserver(() => {
			setIsShowScroll(element.scrollWidth > element.clientWidth);
		});

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={tableRef} className={clsx(styles.container, {[styles.fixedHeader]: fixedHeader})}>
			<table>
				<thead>
					<tr>
						{column.map((col, i) => (
							<th
								key={i}
								className={clsx({
									[styles.checkBox]: col.checkBox,
									[styles.fixedLeft]: col.fixedLeft && isShowScroll,
									[styles.fixedRight]: col.fixedRight && isShowScroll,
								})}
							>
								{col.checkBox && (
									<input
										className={clsx(styles.checkbox, styles.checkbox_head)}
										type='checkbox'
										onChange={handleCheckedAll}
										checked={isCheckedAll}
									/>
								)}
								{col.title}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, i) => (
						<tr key={i} className={styles.tr_data}>
							{column.map((col, j) => (
								<td
									key={j}
									className={clsx({
										[styles.fixedLeft]: col.fixedLeft && isShowScroll,
										[styles.fixedRight]: col.fixedRight && isShowScroll,
									})}
								>
									<div className={clsx(col.className, {[styles.checkBox]: col.checkBox})}>
										{col.checkBox && (
											<input
												className={styles.checkbox}
												type='checkbox'
												onChange={(e) => handleCheckedRow?.(e, row)}
												checked={handleIsCheckedRow?.(row) ?? false}
											/>
										)}
										{col.render(row, i)}
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
