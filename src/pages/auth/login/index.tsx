import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import LayoutAuth from '~/components/layouts/LayoutAuth';
import MainLogin from '~/components/pages/auth/MainLogin';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Đăng nhập hệ thống</title>
				<meta name='description' content='Đăng nhập hệ thống' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainLogin />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <LayoutAuth>{Page}</LayoutAuth>;
};
