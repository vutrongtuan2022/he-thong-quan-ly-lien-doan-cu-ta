import axiosClient from '.';

const commentServices = {
	getCommentNews: (
		data: {
			pageSize: number;
			page: number;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Comment/get-page-list-comment-admin`, data, {
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
		return axiosClient.post(`/Comment/update-status`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default commentServices;
