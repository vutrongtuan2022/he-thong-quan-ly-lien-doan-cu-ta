export interface PropsFormUpdateBanner {
	uuid: string;
	queryKeys: number[];
	onClose: () => void;
}

export interface IUpdateBanner {
	title: string;
	imagePath: string;
	sort: number;
	privacy: number;
}
