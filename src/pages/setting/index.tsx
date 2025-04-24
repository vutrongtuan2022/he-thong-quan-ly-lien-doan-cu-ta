import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageSettings from '~/components/pages/setting/MainPageSettings';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Cài đặt hệ thống</title>
				<meta name='description' content='Cài đặt hệ thống' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageSettings />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
