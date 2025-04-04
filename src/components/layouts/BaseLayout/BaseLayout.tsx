import React from 'react';

import {PropsBaseLayout} from './interfaces';
import styles from './BaseLayout.module.scss';
import RequireAuth from '~/components/protected/RequiredAuth';
import Header from './components/Header';
import Navbar from './components/Navbar';

function BaseLayout({children}: PropsBaseLayout) {
	return (
		<RequireAuth>
			<div className={styles.container}>
				<nav className={styles.nav}>
					<Navbar />
				</nav>
				<header className={styles.header}>
					<Header />
				</header>
				<main className={styles.main}>{children}</main>
			</div>
		</RequireAuth>
	);
}

export default BaseLayout;
