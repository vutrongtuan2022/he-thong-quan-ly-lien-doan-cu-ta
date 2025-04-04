import axiosClient from '.';

const userServices = {
	getListUser: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			expertiseType: number | null;
			state: number | null;
			startDate: string | null;
			endDate: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/get-page-list-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetailUser: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/get-detail-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	rejectedUser: (
		data: {
			uuid: string;
			rejectedReason: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/rejected-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStateUser: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/update-state-user`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default userServices;
