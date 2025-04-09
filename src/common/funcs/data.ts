import {TYPE_EDUCATION, TYPE_EXPERTISE} from '~/constants/config/enum';

export const listExpertise: {
	value: number;
	name: string;
	code: string;
}[] = [
	{
		value: TYPE_EXPERTISE.COACH,
		name: 'Huấn luyện viên',
		code: 'HLV',
	},
	{
		value: TYPE_EXPERTISE.REFEREE,
		name: 'Trọng tài',
		code: 'TT',
	},
	{
		value: TYPE_EXPERTISE.ATHLETE,
		name: 'Vận động viên',
		code: 'VĐV',
	},
];

export const listEducation: {
	value: number;
	name: string;
	code: string;
}[] = [
	{
		value: TYPE_EDUCATION.HIGH_SCHOOL,
		name: 'THPT',
		code: 'THPT',
	},
	{
		value: TYPE_EDUCATION.INTERMEDIATE,
		name: 'Trung cấp',
		code: 'TC',
	},
	{
		value: TYPE_EDUCATION.COLLEGE,
		name: 'Cao đẳng',
		code: 'CĐ',
	},
	{
		value: TYPE_EDUCATION.UNIVERSITY,
		name: 'Đại học',
		code: 'ĐH',
	},
	{
		value: TYPE_EDUCATION.POSTGRADUATE,
		name: 'Cao học',
		code: 'CH',
	},
];
