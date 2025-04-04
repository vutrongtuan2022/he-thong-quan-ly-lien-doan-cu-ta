import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageMember from '~/components/pages/member/MainPageMember';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý thành viên</title>
				<meta name='description' content='Quản lý thành viên' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageMember />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
