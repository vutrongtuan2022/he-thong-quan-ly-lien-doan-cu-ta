import axiosClient from '.';

const uploadService = {
	uploadSingleImage: (file: any, type: string) => {
		const dataFile = new FormData();

		dataFile.append('FileData', file);
		dataFile.append('Type', type);

		return axiosClient.put(`/Upload/upload-single-image`, dataFile, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'text/plain',
			},
		});
	},
};

export default uploadService;
