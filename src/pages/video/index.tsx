import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageVideo from '~/components/pages/video/MainPageVideo';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý video</title>
				<meta name='description' content='Quản lý video' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageVideo />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
