import axiosClient from '.';

const policyServices = {
	upsertPolicy: (
		data: {
			content: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Policy/upsert-policy`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailPolicy: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Policy/get-detail-policy`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default policyServices;
