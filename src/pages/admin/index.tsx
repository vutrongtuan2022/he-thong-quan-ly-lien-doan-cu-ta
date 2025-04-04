import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageAdmin from '~/components/pages/admin/MainPageAdmin';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý quản trị viên</title>
				<meta name='description' content='Quản lý quản trị viên' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageAdmin />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
