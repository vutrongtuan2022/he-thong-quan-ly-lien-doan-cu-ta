import axiosClient from '.';

const dashboardServices = {
	getTopScanUser: (
		data: {
			startDate?: string | null;
			endDate?: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Dashboard/get-top-scan-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	getChartAdmin: (
		data: {
			startDate: string | null;
			endDate: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Dashboard/dashboard-chart-admin`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default dashboardServices;
