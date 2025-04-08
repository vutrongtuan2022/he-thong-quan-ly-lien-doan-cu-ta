import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainUpdateProfile from '~/components/pages/profile/MainUpdateProfile';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa thông tin cá nhân</title>
				<meta name='description' content='Chỉnh sửa thông tin cá nhân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainUpdateProfile />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
