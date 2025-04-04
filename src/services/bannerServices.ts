import axiosClient from '.';

const bannerServices = {
	getListBanner: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			startDate: string | null;
			endDate: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Banner/get-page-list-banner-admin`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertBanner: (
		data: {
			uuid: string;
			title: string;
			imagePath: string;
			sort: number;
			privacy: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Banner/upsert-banner`, data, {
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
		return axiosClient.post(`/Banner/update-status`, data, {
			cancelToken: tokenAxios,
		});
	},
	updatePrivacy: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Banner/change-privacy`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailBanner: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Banner/get-detail-banner`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default bannerServices;
