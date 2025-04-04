import React from 'react';

import {PropsIconCustom} from './interfaces';
import styles from './IconCustom.module.scss';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import Link from 'next/link';

function IconCustom({icon, tooltip, onClick, color, href, disnable = false, background = 'rgba(78, 203, 113, 0.1)'}: PropsIconCustom) {
	return (
		<Tippy content={tooltip}>
			{href ? (
				<Link
					href={href}
					style={{color: color, background: background}}
					className={clsx({[styles.disnable]: disnable}, styles.container)}
				>
					<div className={styles.icon}>{icon}</div>
				</Link>
			) : (
				<div
					style={{color: color, background: background}}
					className={clsx({[styles.disnable]: disnable}, styles.container)}
					onClick={onClick}
				>
					<div className={styles.icon}>{icon}</div>
				</div>
			)}
		</Tippy>
	);
}

export default IconCustom;
