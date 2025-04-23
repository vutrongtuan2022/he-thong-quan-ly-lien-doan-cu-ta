import React from 'react';

import {ITopScanUser, PropsTopScanStatisticalReport} from './interfaces';
import styles from './TopScanStatisticalReport.module.scss';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import dashboardServices from '~/services/dashboardServices';
import Image from 'next/image';
import images from '~/constants/images/images';

function TopScanStatisticalReport({}: PropsTopScanStatisticalReport) {
	const {data: topScanUser = []} = useQuery<ITopScanUser[]>([QUERY_KEY.get_top_scan_user], {
		queryFn: () =>
			httpRequest({
				http: dashboardServices.getTopScanUser({}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<h4>TOP NHÂN VIÊN</h4>
			<p>Xếp hạng top 5 nhân viên có lượt quét cao nhất</p>
			{topScanUser?.map((v) => (
				<div key={v.uuid} className={styles.user}>
					<div className={styles.info}>
						<Image
							alt='Avatar'
							src={v?.imageCardPath ? `${process.env.NEXT_PUBLIC_IMAGE}/${v?.imageCardPath}` : images?.avatar_default}
							width={40}
							height={40}
							className={styles.avatar}
						/>
						<h6 className={styles.name}>{v?.fullname}</h6>
					</div>
					<p className={styles.count}>{v?.countScanUsers}</p>
				</div>
			))}
		</div>
	);
}

export default TopScanStatisticalReport;
