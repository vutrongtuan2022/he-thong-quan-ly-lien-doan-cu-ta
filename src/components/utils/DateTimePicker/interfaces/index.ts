import {Dispatch, SetStateAction} from 'react';

export interface PropsDateTimePicker {
	date: Date;
	setDate: Dispatch<SetStateAction<Date | string | moment.Moment>>;
}
