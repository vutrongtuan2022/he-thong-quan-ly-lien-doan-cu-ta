import axiosClient from '.';

const settingsServices = {
	updateURLDownloadApp: (
		data: {
			urlIOS: string;
			urlAndroid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Settings/update-url-dowload-app`, data, {
			cancelToken: tokenAxios,
		});
	},
	getURLDownloadApp: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Settings/get-url-dowload-app`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default settingsServices;
