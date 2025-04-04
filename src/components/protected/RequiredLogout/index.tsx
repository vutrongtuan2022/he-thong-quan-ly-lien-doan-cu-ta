import React, {useEffect} from 'react';

import {RootState} from '~/redux/store';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {PATH} from '~/constants/config';

interface props {
	children: React.ReactNode;
}

function RequiredLogout({children}: props) {
	const {replace} = useRouter();
	const {isLogin} = useSelector((state: RootState) => state.auth);
	const {loading} = useSelector((state: RootState) => state.site);

	useEffect(() => {
		if (isLogin && !loading) replace(PATH.Home);
	}, [isLogin, loading, replace]);

	if (!isLogin && !loading) {
		return <>{children}</>;
	}

	return <div className='loading-page'></div>;
}

export default RequiredLogout;
