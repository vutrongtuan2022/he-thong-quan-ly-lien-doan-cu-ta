import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainUpdateLink from '~/components/pages/link/MainUpdateLink';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa thông tin liên đoàn</title>
				<meta name='description' content='Chỉnh sửa thông tin liên đoàn' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainUpdateLink />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
