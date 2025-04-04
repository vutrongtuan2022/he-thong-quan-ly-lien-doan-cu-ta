import {TYPE_DATE} from '~/constants/config/enum';

export interface PropsFilterDateRange {
	typeDateDefault?: TYPE_DATE;
	date: {
		from: Date | null;
		to: Date | null;
	} | null;
	setDate: (date: {from: Date | null; to: Date | null}) => void;
}
