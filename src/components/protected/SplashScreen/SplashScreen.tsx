import {useEffect} from 'react';
import Lottie from 'react-lottie';
import {RootState, store} from '~/redux/store';

import {PropsSplashScreen} from './interfaces';
import clsx from 'clsx';
import styles from './SplashScreen.module.scss';
import {useSelector} from 'react-redux';
import {getItemStorage, setItemStorage} from '~/common/funcs/localStorage';
import {KEY_STORE} from '~/constants/config';
import {setLoading, setRememberPassword} from '~/redux/reducer/site';

import {setDataLoginStorage, setStateLogin, setToken} from '~/redux/reducer/auth';
import {setInfoUser} from '~/redux/reducer/user';

import * as loading from '../../../../public/static/anim/loading_screen.json';

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: loading,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

function SplashScreen({}: PropsSplashScreen) {
	const {loading, isRememberPassword} = useSelector((state: RootState) => state.site);
	const {infoUser} = useSelector((state: RootState) => state.user);
	const {token, isLogin, dataLoginStorage} = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		(async () => {
			const state = await getItemStorage(KEY_STORE);

			if (!!state) {
				store.dispatch(setToken(state.token));
				store.dispatch(setStateLogin(state.isLogin));
				store.dispatch(setInfoUser(state.infoUser));
				store.dispatch(setRememberPassword(state.isRememberPassword));
				store.dispatch(setDataLoginStorage(state.dataLoginStorage));
			}

			store.dispatch(setLoading(false));
		})();
	}, []);

	useEffect(() => {
		if (!loading) {
			setItemStorage(KEY_STORE, {
				isLogin: isLogin,
				token: token,
				infoUser: infoUser,
				isRememberPassword: isRememberPassword,
				dataLoginStorage: dataLoginStorage,
			});
		}
	}, [loading, isLogin, token, infoUser, isRememberPassword, dataLoginStorage]);

	return (
		<div className={clsx(styles.container, {[styles.close]: !loading})}>
			<div className={styles.logo}>
				<Lottie options={defaultOptions} />
			</div>
		</div>
	);
}

export default SplashScreen;
