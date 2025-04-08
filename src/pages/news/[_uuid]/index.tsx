import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainDetailNews from '~/components/pages/news/MainDetailNews';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết bài viết</title>
				<meta name='description' content='Chi tiết bài viết' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainDetailNews />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
