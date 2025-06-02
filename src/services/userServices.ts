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
	exportListUser: (
		data: {
			// pageSize: number;
			// page: number;
			// keyword: string;
			// expertiseType: number | null;
			// status: number | null;
			// cardState: number | null;
			// startDate: string | null;
			// endDate: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/export-list-user`, data, {
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
	//card

	getListUserRegisterCard: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			expertiseType: number | null;
			status: number | null;
			startDate: string | null;
			endDate: string | null;
			cardState: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/get-page-list-user-register-card`, data, {
			cancelToken: tokenAxios,
		});
	},

	updateCardStateUser: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/update-card-state-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	rejectedCardUser: (
		data: {
			uuid: string;
			rejectedReason: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/rejected-card-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetailCardUser: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/get-detail-register-card-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailUpdateExpertiseType: (data: {uuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`User/get-detail-update-expertise-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateExpertiseType: (data: {uuid: string; expertiseType: number | null}, tokenAxios?: any) => {
		return axiosClient.post(`User/update-expertise-type-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailUserAccount: (data: {uuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`User/get-detail-user-account`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default userServices;
