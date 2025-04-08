import {Award, ClipboardText, Gallery, People, PresentionChart, ProfileTick, UserOctagon, VideoPlay} from 'iconsax-react';
import {ROLE_ADMIN, TYPE_DATE} from './enum';

export enum PATH {
	Home = '/',
	Any = '/any',

	// AUTH
	Login = '/auth/login',
	ForgotPassword = '/auth/forgot-password',

	// Member
	Member = '/member',
	Admin = '/admin',

	// News
	News = '/news',
	NewsCreate = '/news/create',
	NewsUpdate = '/news/update',

	//Video
	Video = '/video',

	//Profile
	Profile = '/profile',
	UpdateProfile = '/profile/update-profile',

	// System
	Banner = '/banner',

	// Privacy policy
	PrivacyPolicy = '/privacy-policy',
}

export const Menus: {
	title: string;
	group: {
		path: string;
		pathActive: string;
		title: string;
		icon: any;
		role: ROLE_ADMIN;
	}[];
}[] = [
	{
		title: 'QUẢN LÝ THÀNH VIÊN',
		group: [
			{
				title: 'Đăng ký mới',
				icon: ProfileTick,
				path: PATH.Home,
				pathActive: PATH.Home,
				role: ROLE_ADMIN.ADMIN,
			},
			{
				title: 'Thành viên',
				icon: People,
				path: PATH.Member,
				pathActive: PATH.Member,
				role: ROLE_ADMIN.LEAGUE,
			},
			{
				title: 'Quản trị viên',
				icon: UserOctagon,
				path: PATH.Admin,
				pathActive: PATH.Admin,
				role: ROLE_ADMIN.LEAGUE,
			},
		],
	},
	{
		title: 'QUẢN LÝ TIN TỨC',
		group: [
			{
				title: 'Bài viết',
				icon: ClipboardText,
				path: PATH.News,
				pathActive: PATH.News,
				role: ROLE_ADMIN.ADMIN,
			},
			{
				title: 'Quản lý video',
				icon: VideoPlay,
				path: PATH.Video,
				pathActive: PATH.Video,
				role: ROLE_ADMIN.ADMIN,
			},
		],
	},
	{
		title: 'HỆ THỐNG',
		group: [
			{
				title: 'Thống kê báo cáo',
				icon: PresentionChart,
				path: PATH.Any,
				pathActive: PATH.Any,
				role: ROLE_ADMIN.ADMIN,
			},
			{
				title: 'Quản lý banner',
				icon: Gallery,
				path: PATH.Banner,
				pathActive: PATH.Banner,
				role: ROLE_ADMIN.ADMIN,
			},
			{
				title: 'Chính sách bảo mật',
				icon: Award,
				path: PATH.PrivacyPolicy,
				pathActive: PATH.PrivacyPolicy,
				role: ROLE_ADMIN.ADMIN,
			},
		],
	},
];

export const ListOptionFilterDate: {
	name: string;
	value: number;
}[] = [
	{
		name: 'Tất cả',
		value: TYPE_DATE.ALL,
	},
	{
		name: 'Hôm nay',
		value: TYPE_DATE.TODAY,
	},
	{
		name: 'Hôm qua',
		value: TYPE_DATE.YESTERDAY,
	},
	{
		name: 'Tuần này',
		value: TYPE_DATE.THIS_WEEK,
	},
	{
		name: 'Tuần trước',
		value: TYPE_DATE.LAST_WEEK,
	},
	{
		name: '7 ngày trước',
		value: TYPE_DATE.LAST_7_DAYS,
	},
	{
		name: 'Tháng này',
		value: TYPE_DATE.THIS_MONTH,
	},
	{
		name: 'Tháng trước',
		value: TYPE_DATE.LAST_MONTH,
	},
	{
		name: 'Năm này',
		value: TYPE_DATE.THIS_YEAR,
	},
	{
		name: 'Lựa chọn',
		value: TYPE_DATE.LUA_CHON,
	},
];

export const KEY_STORE = 'vbwf-gym';
