import React from 'react';

import {PropsMainTable} from './interfaces';
import styles from './MainTable.module.scss';

function MainTable({icon, title, action, children}: PropsMainTable) {
	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<div className={styles.info}>
					{icon}
					<h4>{title}</h4>
				</div>
				{action && action}
			</div>
			<div className={styles.line}></div>
			<div className={styles.main}>{children}</div>
		</div>
	);
}

export default MainTable;
