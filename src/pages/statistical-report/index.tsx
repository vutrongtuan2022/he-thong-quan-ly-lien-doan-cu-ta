import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageStatisticalReport from '~/components/pages/statistical-report/MainPageStatisticalReport';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thống kê báo cáo</title>
				<meta name='description' content='Thống kê báo cáo' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageStatisticalReport />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout>{Page}</BaseLayout>;
};
