import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainCreateNews from '~/components/pages/news/MainCreateNews';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới tin tức</title>
				<meta name='description' content='Thêm mới tin tức' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainCreateNews />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
