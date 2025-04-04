export interface PropsFormCreateBanner {
	onClose: () => void;
	queryKeys: number[];
}

export interface ICreateBanner {
	title: string;
	imagePath: string;
	sort: number;
	privacy: number;
}
