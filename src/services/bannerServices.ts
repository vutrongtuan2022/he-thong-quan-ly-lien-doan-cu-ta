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
};

export default bannerServices;
