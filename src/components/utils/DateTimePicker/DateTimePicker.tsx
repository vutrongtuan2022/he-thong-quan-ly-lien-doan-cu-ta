import React, {useState} from 'react';
import DateTime from 'react-datetime';

import {PropsDateTimePicker} from './interfaces';
import styles from './DateTimePicker.module.scss';
import moment from 'moment';

function DateTimePicker({date, setDate}: PropsDateTimePicker) {
	return (
		<div className={styles.container}>
			<DateTime
				input={false}
				initialViewMode='days'
				updateOnView='days'
				value={date}
				onChange={(value) => setDate(value)}
				closeOnSelect
				timeFormat='HH:mm'
				renderMonth={(props, month) => <td {...props}>Tháng {month + 1}</td>}
				isValidDate={(current) => {
					const yesterday = moment().subtract(1, 'day');
					return current.isAfter(yesterday);
				}}
				// timeConstraints={{
				// 	minutes: {
				// 		min: 0,
				// 		max: 59,
				// 		step: 5,
				// 	},
				// }}
			/>
		</div>
	);
}

export default DateTimePicker;
