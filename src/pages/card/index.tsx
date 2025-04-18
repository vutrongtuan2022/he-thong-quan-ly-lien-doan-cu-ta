import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageCard from '~/components/pages/card/MainPageCard';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Phát hành thẻ</title>
				<meta name='description' content='Phát hành thẻ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageCard />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
