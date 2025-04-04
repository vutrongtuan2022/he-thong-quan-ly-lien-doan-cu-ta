import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import LayoutAuth from '~/components/layouts/LayoutAuth';
import MainForgotPassword from '~/components/pages/auth/MainForgotPassword';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quên mật khẩu</title>
				<meta name='description' content='Quên mật khẩu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainForgotPassword />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <LayoutAuth>{Page}</LayoutAuth>;
};
