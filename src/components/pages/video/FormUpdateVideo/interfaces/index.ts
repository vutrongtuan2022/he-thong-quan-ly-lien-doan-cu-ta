export interface PropsFormUpdateVideo {
	uuid: string;
	onClose: () => void;
	queryKeys: number[];
}
export interface IFormUpdateVideo {
	title: string;
	videoLink: string;
	sort: number;
	privacy: number;
}
