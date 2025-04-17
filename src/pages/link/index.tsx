import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageLink from '~/components/pages/link/MainPageLink';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thông tin liên đoàn</title>
				<meta name='description' content='Thông tin liên đoàn' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageLink />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
