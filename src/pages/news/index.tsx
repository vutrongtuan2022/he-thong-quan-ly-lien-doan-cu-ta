import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageNews from '~/components/pages/news/MainPageNews';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý tin tức</title>
				<meta name='description' content='Quản lý tin tức' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageNews />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
