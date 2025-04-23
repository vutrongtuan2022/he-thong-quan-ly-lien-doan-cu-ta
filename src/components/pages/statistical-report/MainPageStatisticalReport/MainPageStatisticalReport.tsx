import React from 'react';

import {PropsMainPageStatisticalReport} from './interfaces';
import styles from './MainPageStatisticalReport.module.scss';
import ChartStatisticalReport from '../ChartStatisticalReport';
import TopScanStatisticalReport from '../TopScanStatisticalReport';

function MainPageStatisticalReport({}: PropsMainPageStatisticalReport) {
	return (
		<div className={styles.container}>
			<ChartStatisticalReport />
			<TopScanStatisticalReport />
		</div>
	);
}

export default MainPageStatisticalReport;
