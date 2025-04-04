import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageBanner from '~/components/pages/banner/MainPageBanner';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý banner</title>
				<meta name='description' content='Quản lý banner' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageBanner />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
