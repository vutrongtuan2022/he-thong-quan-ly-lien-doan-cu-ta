import React, {useCallback, useMemo} from 'react';

import {PropsNavbar} from './interfaces';
import styles from './Navbar.module.scss';
import Link from 'next/link';
import {Menus, PATH} from '~/constants/config';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import {ROLE_ADMIN} from '~/constants/config/enum';

function Navbar({}: PropsNavbar) {
	const router = useRouter();

	const {infoUser} = useSelector((state: RootState) => state.user);

	const checkActive = useCallback(
		(pathname: string) => {
			const currentRoute = router.pathname.split('/')[1];

			return pathname == `/${currentRoute}`;
		},
		[router]
	);

	const tabs = useMemo(() => {
		if (infoUser?.role == ROLE_ADMIN.LEAGUE) {
			return Menus.map((menu) => ({
				...menu,
				group: menu.group.filter((item) => item.role !== ROLE_ADMIN.LEAGUE),
			}));
		} else {
			return Menus;
		}
	}, [infoUser?.role]);

	return (
		<div className={styles.container}>
			<Link href={PATH.Home} className={styles.logo}>
				<Image alt='Logo' src={icons.logo} width={44} height={44} />
			</Link>
			<div className={styles.menus}>
				{tabs.map((menu, i) => (
					<div key={i} className={styles.menu}>
						<h5>{menu.title}</h5>
						{menu.group.map((tab, y) => (
							<Link key={y} href={tab.path} className={clsx(styles.tab, {[styles.active]: checkActive(tab.pathActive)})}>
								<tab.icon size={22} className={styles.icon} />
								<p>{tab.title}</p>
							</Link>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export default Navbar;
