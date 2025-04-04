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
};

export default bannerServices;
