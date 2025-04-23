import React, {useState} from 'react';
import {AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';

import {PropsChartStatisticalReport} from './interfaces';
import styles from './ChartStatisticalReport.module.scss';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, TYPE_DATE} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import dashboardServices from '~/services/dashboardServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import FilterDateRange from '~/components/common/FilterDateRange';
import moment from 'moment';

function ChartStatisticalReport({}: PropsChartStatisticalReport) {
	const [typeDate, setTypeDate] = useState<TYPE_DATE>(TYPE_DATE.THIS_MONTH);
	const [date, setDate] = useState<{from: Date | null; to: Date | null} | null>(null);

	const {
		data = {
			allCount: 0,
			data: [],
		},
	} = useQuery([QUERY_KEY.get_chart_scan_user, date?.from, date?.to], {
		queryFn: () =>
			httpRequest({
				http: dashboardServices.getChartAdmin({
					startDate: date?.from ? moment(date.from).format('YYYY-MM-DD') : null,
					endDate: date?.to ? moment(date.to).format('YYYY-MM-DD') : null,
				}),
			}),
		select(data) {
			return {
				allCount: data?.allCount,
				data: data?.data?.map((v: any) => ({
					time: v?.time,
					'Số lượt quét': v?.countScan,
				})),
			};
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>Biểu đồ thống kê lượt quét thẻ theo thời gian</h4>
				<FilterDateRange date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} />
			</div>
			<div className={styles.total_scan}>
				<Image alt='icon thống kê lượt quét thẻ' src={icons.total_scan} />
				<p>
					Tổng lượt quét: <span>{convertCoin(data?.allCount)}</span>
				</p>
			</div>
			<div className={styles.main}>
				<ResponsiveContainer width='100%' height='100%'>
					<AreaChart
						data={data?.data}
						syncId='anyId'
						margin={{
							top: 0,
							right: 16,
							left: -16,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='time' padding={{left: 32, right: 32}} minTickGap={32} />
						<YAxis
							domain={[0, (dataMax: number) => dataMax + 10]}
							tickFormatter={(value): any => Math.floor(value)}
							allowDecimals={false}
						/>
						<Tooltip />
						<defs>
							<linearGradient id='colorScan' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#8979FF' stopOpacity={1} />
								<stop offset='95%' stopColor='#8979FF' stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<Area type='linear' dataKey='Số lượt quét' stroke='#8979FF' fill='url(#colorScan)' dot />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ChartStatisticalReport;
