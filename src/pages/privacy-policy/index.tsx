import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPagePrivacyPolicy from '~/components/pages/privacy-policy/MainPagePrivacyPolicy';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chính sách bảo mật</title>
				<meta name='description' content='Chính sách bảo mật' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPagePrivacyPolicy />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
