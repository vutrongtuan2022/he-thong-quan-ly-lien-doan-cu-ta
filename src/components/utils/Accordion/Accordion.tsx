import React, {useState} from 'react';

import {PropsAccordion} from './interfaces';
import styles from './Accordion.module.scss';
import {ArrowDown2} from 'iconsax-react';
import clsx from 'clsx';

function Accordion({title, children}: PropsAccordion) {
	const [open, setOpen] = useState<boolean>(true);

	return (
		<div className={styles.accordion}>
			<div className={clsx(styles.head, {[styles.active]: open})} onClick={() => setOpen(!open)}>
				<h4>{title}</h4>
				<div className={styles.icon}>
					<ArrowDown2 size={18} color='#000' />
				</div>
			</div>
			{open && <div className={styles.main}>{children}</div>}
		</div>
	);
}

export default Accordion;
