import axiosClient from '.';

const accountServices = {
	sendOTP: (
		data: {
			email: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/send-otp`, data, {
			cancelToken: tokenAxios,
		});
	},
	enterOTP: (data: {email: string; otp: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/enter-otp`, data, {
			cancelToken: tokenAxios,
		});
	},
	changePassForget: (data: {email: string; otp: string; newPass: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/change-pass-forget`, data, {
			cancelToken: tokenAxios,
		});
	},
	listUserAccount: (data: {pageSize: number; page: number; keyword: string; status: number | null}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/get-page-list-user-account`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStatus: (data: {uuid: string; status: number}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/update-status`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertAdminAccount: (
		data: {uuid: string; userName: string; accountName: string; email: string; password: string; roleUuid: string},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/upsert-admin-account`, data, {
			cancelToken: tokenAxios,
		});
	},
	listAdminAccount: (data: {pageSize: number; page: number; keyword: string; role: string; status: number | null}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/get-page-list-admin-account`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailAdminAccount: (data: {uuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/get-detail-admin-account`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailPersonalAccount: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/get-detail-personal-account`, data, {
			cancelToken: tokenAxios,
		});
	},
	updatePersonalAccount: (data: {accountName: string; email: string; imagePath: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/update-personal-account`, data, {
			cancelToken: tokenAxios,
		});
	},
	changePassPersonal: (data: {oldPassword: string; newPassword: string}, tokenAxios?: any) => {
		return axiosClient.post(`Account/change-pass-personal`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default accountServices;
