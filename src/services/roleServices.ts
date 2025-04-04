import axiosClient from '.';

const roleServices = {
	roleAdmin: (
		data: {
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Role/category-role-admin`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default roleServices;
