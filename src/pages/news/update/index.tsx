import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainUpdateNews from '~/components/pages/news/MainUpdateNews';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa tin tức</title>
				<meta name='description' content='Chỉnh sửa tin tức' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainUpdateNews />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
