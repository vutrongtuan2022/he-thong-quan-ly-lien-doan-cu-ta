import React from 'react';

import {PropsLayoutAuth} from './interfaces';
import styles from './LayoutAuth.module.scss';
import RequiredLogout from '~/components/protected/RequiredLogout';

function LayoutAuth({children}: PropsLayoutAuth) {
	return (
		<RequiredLogout>
			<div className={styles.container}>
				<div className={styles.background}></div>
				<main className={styles.main}>{children}</main>
			</div>
		</RequiredLogout>
	);
}

export default LayoutAuth;
