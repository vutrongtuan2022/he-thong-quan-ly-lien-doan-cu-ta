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
	changePrivacy: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Blog/change-privacy`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertBlog: (
		data: {
			uuid: string;
			title: string;
			content: string;
			catalog: number;
			privacy: number;
			timePublic: string;
			isSpecial: boolean;
			link: string;
			sort: number;
			blockComment: boolean;
			imagePath: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Blog/upsert-blog`, data, {
			cancelToken: tokenAxios,
		});
	},
	deleteBlog: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Blog/delete-blog`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default newsServices;
