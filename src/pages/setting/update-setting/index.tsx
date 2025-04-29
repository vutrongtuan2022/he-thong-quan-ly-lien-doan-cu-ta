import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainUpdateSettings from '~/components/pages/setting/MainUpdateSettings';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa hệ thống</title>
				<meta name='description' content='Chỉnh sửa hệ thống' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainUpdateSettings />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
