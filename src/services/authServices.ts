import axiosClient from '.';

const authServices = {
	login: (
		data: {
			userName: string;
			password: string;
			type: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Auth/login`, data, {
			cancelToken: tokenAxios,
		});
	},
	logout: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Auth/logout`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default authServices;
