import {TYPE_DATE} from '~/constants/config/enum';

export function getDateRange(range: number): {
	from: Date | null;
	to: Date | null;
} {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	switch (range) {
		case TYPE_DATE.ALL:
			return {from: null, to: null};

		// Tuần này
		case TYPE_DATE.TODAY:
			return {from: new Date(), to: new Date()};

		// Hôm qua
		case TYPE_DATE.YESTERDAY:
			const firstYesterday = new Date();
			firstYesterday.setDate(today.getDate() - 1);

			const lastYesterday = new Date();

			lastYesterday.setDate(today.getDate() - 1);

			return {
				from: firstYesterday,
				to: lastYesterday,
			};

		// Tuần này
		case TYPE_DATE.THIS_WEEK:
			const firstDayOfWeek = new Date(today);
			firstDayOfWeek.setDate(today.getDate() - today.getDay());

			const lastDayOfWeek = new Date(today);
			lastDayOfWeek.setDate(today.getDate() - today.getDay() + 6);

			return {from: firstDayOfWeek, to: lastDayOfWeek};

		// Tuần trước
		case TYPE_DATE.LAST_WEEK:
			const firstDayLastWeek = new Date(today);
			firstDayLastWeek.setDate(today.getDate() - today.getDay() - 7);

			const lastDayLastWeek = new Date(today);
			lastDayLastWeek.setDate(today.getDate() - today.getDay() - 1);

			return {from: firstDayLastWeek, to: lastDayLastWeek};

		// Tháng này
		case TYPE_DATE.THIS_MONTH:
			const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
			const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

			return {from: firstDayOfMonth, to: lastDayOfMonth};

		// Tháng trước
		case TYPE_DATE.LAST_MONTH:
			const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
			const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

			return {from: firstDayLastMonth, to: lastDayLastMonth};

		// Năm nay
		case TYPE_DATE.THIS_YEAR:
			const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
			const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

			return {from: firstDayOfYear, to: lastDayOfYear};

		// 7 ngày trước
		case TYPE_DATE.LAST_7_DAYS:
			const firstDayLast7Days = new Date(today);
			firstDayLast7Days.setDate(today.getDate() - 7);

			return {from: firstDayLast7Days, to: today};

		default:
			return {from: null, to: null};
	}
}
