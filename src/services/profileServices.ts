import axiosClient from '.';

const profileServices = {
	profileAdminDetail: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Profile/get-home-profile-admin-detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateProfileAdmin: (
		data: {
			name: string;
			shortName: string;
			introduce: string;
			address: string;
			phoneNumber: string;
			email: string;
			zalo: string;
			facebook: string;
			youtube: string;
			instagram: string;
			tiktok: string;
			linkedIn: string;
			imagePath: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Profile/update-home-profile-admin`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default profileServices;
