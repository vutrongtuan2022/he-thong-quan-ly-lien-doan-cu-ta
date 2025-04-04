import React, {useEffect, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsHeader} from './interfaces';
import styles from './Header.module.scss';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import Navbar from '../Navbar';
import MenuProfile from '../MenuProfile';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import images from '~/constants/images/images';

function Header({}: PropsHeader) {
	const router = useRouter();

	const {infoUser} = useSelector((state: RootState) => state.user);

	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [openProfile, setOpenProfile] = useState<boolean>(false);

	useEffect(() => {
		if (openMenu) {
			document.body.style.overflowY = 'hidden';
		} else {
			document.body.style.overflowY = 'overlay';
		}
	}, [openMenu]);

	useEffect(() => {
		if (openMenu) {
			setOpenMenu(false);
		}
	}, [router]);

	const toggleFullScreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch((err) => {
				console.error(`Lỗi mở toàn màn hình: ${err.message}`);
			});
		} else {
			document.exitFullscreen();
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.control}>
				<Image
					alt='icon hamburger'
					src={icons.hamburger}
					width={28}
					height={28}
					className={styles.hamburger}
					onClick={() => setOpenMenu(true)}
				/>
				<h4>Xin chào, {infoUser?.accountName}!</h4>
			</div>
			<div className={styles.main_info}>
				<div className={styles.full_screen} onClick={toggleFullScreen}>
					<Image src={icons.full_screen} alt='icon full screen' width={24} height={24} />
				</div>
				<div className={styles.box_noti}>
					<Image src={icons.bell} alt='icon bell' width={24} height={24} />
					<div className={styles.box_count}>
						<span>1</span>
					</div>
				</div>
				<TippyHeadless
					maxWidth={'100%'}
					interactive
					visible={openProfile}
					onClickOutside={() => setOpenProfile(false)}
					placement='bottom-end'
					render={(attrs: any) => <MenuProfile onClose={() => setOpenProfile(false)} />}
				>
					<div className={styles.avatar} onClick={() => setOpenProfile(!openProfile)}>
						<Image
							src={infoUser?.avatar ? `${process.env.NEXT_PUBLIC_IMAGE}/${infoUser?.avatar}` : images.avatar_default}
							alt='avatar default'
							width={42}
							height={42}
							style={{borderRadius: '50%'}}
						/>
					</div>
				</TippyHeadless>
			</div>

			{/* Responsive mobile */}
			<div className={clsx(styles.overlay, {[styles.close]: !openMenu})} onClick={() => setOpenMenu(false)}></div>
			<div className={clsx(styles.main_mobile, {[styles.active]: openMenu})}>
				<Navbar />
			</div>
		</div>
	);
}

export default Header;
