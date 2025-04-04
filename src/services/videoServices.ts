import axiosClient from '.';

const videoServices = {
	getListVideo: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			startDate: string | null;
			endDate: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Video/get-page-list-video-admin`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertVideo: (
		data: {
			uuid: string;
			title: string;
			videoLink: string;
			sort: number;
			privacy: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Video/upsert-video`, data, {
			cancelToken: tokenAxios,
		});
	},
	changePrivacy: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Video/change-privacy`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailVideo: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Video/get-detail-video`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStatus: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Video/update-status`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default videoServices;
