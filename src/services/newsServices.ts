import axiosClient from '.';

const newsServices = {
	getListNews: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			startDate: string | null;
			endDate: string | null;
			catalog: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Blog/get-page-list-blog-admin`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default newsServices;
