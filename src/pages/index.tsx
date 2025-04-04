import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageHome from '~/components/pages/home/MainPageHome';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Đăng ký mới</title>
				<meta name='description' content='Đăng ký mới' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageHome />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
